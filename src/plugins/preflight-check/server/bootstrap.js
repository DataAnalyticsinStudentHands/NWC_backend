'use strict';

module.exports = async ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Preflight Check',
      uid: 'preflight-check',
      pluginName: 'preflight-check',
    }
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
