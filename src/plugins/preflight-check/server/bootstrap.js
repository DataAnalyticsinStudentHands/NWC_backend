'use strict';

module.exports = async ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Use Preflight Check',
      uid: 'preflight-check',
      pluginName: 'preflight-check',
    },
    {
      section: 'plugins',
      displayName: 'Import Demographics',
      uid: 'import',
      pluginName: 'preflight-check',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
