'use strict';

const ALLOWED_IMPORT_SLUGS = new Set([
  'api::nwc-participant.nwc-participant',
  'api::data-residence-in-1977.data-residence-in-1977',
  'api::data-spouse.data-spouse',
  'api::data-basic-race.data-basic-race',
  'api::data-race.data-race',
  'api::data-education.data-education',
  'api::data-career.data-career',
  'api::data-political-office-held.data-political-office-held',
  'api::data-political-office-lost.data-political-office-lost',
  'api::data-political-party.data-political-party',
  'api::data-leadership-in-organization.data-leadership-in-organization',
  'api::data-organizational-political.data-organizational-political',
  'api::data-role.data-role',
  'api::data-plank.data-plank',
]);

const isAllowedImportSlug = (slug) => ALLOWED_IMPORT_SLUGS.has(slug);

module.exports = ({ strapi }) => ({
  async getDataIdcMasters(ctx) {
    const entries = await strapi.entityService.findMany(
      'api::data-idc-master.data-idc-master',
      {
        populate: '*',
      }
    );

    ctx.body = {
      data: entries.map(({ id, ...attributes }) => ({
        id,
        attributes,
      })),
    };
  },

  async getNwcParticipants(ctx) {
    const { populate, filters } = ctx.query;

    const entries = await strapi.entityService.findMany(
      'api::nwc-participant.nwc-participant',
      {
        populate,
        filters,
      }
    );

    ctx.body = {
      data: entries.map(({ id, ...attributes }) => {
        if (populate) {
          const populatedFields = Array.isArray(populate) ? populate : [populate];

          populatedFields.forEach((field) => {
            if (Array.isArray(attributes[field])) {
              attributes[field] = {
                data: attributes[field].map(({ id, ...relationAttributes }) => ({
                  id,
                  attributes: relationAttributes,
                })),
              };
            }
          });
        }

        return {
          id,
          attributes,
        };
      }),
    };
  },

  async exportData(ctx) {
    const {
      slug,
      search,
      applySearch,
      exportFormat,
      relationsAsId,
      deepness = 5,
      exportPluginsContentTypes,
    } = ctx.request.body;

    if (!isAllowedImportSlug(slug)) {
      return ctx.forbidden('This content type is not allowed for demographic operations');
    }

    const exportService = strapi
      .plugin('import-export-entries')
      .service('export');

    let data;

    if (exportFormat === exportService.formats.JSON_V2) {
      data = await exportService.exportDataV2({
        slug,
        search,
        applySearch,
        deepness,
        exportPluginsContentTypes,
      });
    } else {
      data = await exportService.exportData({
        slug,
        search,
        applySearch,
        exportFormat,
        relationsAsId,
        deepness,
      });
    }

    ctx.body = {
      data,
    };
  },

  async importData(ctx) {
    const { user } = ctx.state;
    const { slug, data: dataRaw, format, idField } = ctx.request.body;

    if (!isAllowedImportSlug(slug)) {
      return ctx.forbidden('This content type is not allowed for demographic imports');
    }

    const importService = strapi
      .plugin('import-export-entries')
      .service('import');

    const fileContent = await importService.parseInputData(
      format,
      dataRaw,
      { slug }
    );

    let result;

    if (fileContent?.version === 2) {
      result = await importService.importDataV2(fileContent, {
        slug,
        user,
        idField,
      });
    } else {
      result = await importService.importData(dataRaw, {
        slug,
        format,
        user,
        idField,
      });
    }

    ctx.body = {
      failures: result.failures,
    };
  },

  async deleteEntry(ctx) {
    const { slug, id } = ctx.request.body;

    if (!slug || !id) {
      return ctx.badRequest('slug and id are required');
    }

    if (!isAllowedImportSlug(slug)) {
      return ctx.forbidden('This content type is not allowed for demographic operations');
    }

    await strapi.entityService.delete(slug, id);

    ctx.body = {
      success: true,
      id,
    };
  },

  async createEntry(ctx) {
    const { slug, data } = ctx.request.body;

    if (!slug || !data) {
      return ctx.badRequest('slug and data are required');
    }

    if (!isAllowedImportSlug(slug)) {
      return ctx.forbidden('This content type is not allowed for demographic operations');
    }

    const entry = await strapi.entityService.create(slug, {
      data,
    });

    ctx.body = {
      data: entry,
    };
  },
});
