'use strict';

module.exports = ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Email Service',
      uid: 'email-service',
      pluginName: 'email-service',
    }
  ];

  return strapi.admin.services.permission.actionProvider.registerMany(actions);
};
