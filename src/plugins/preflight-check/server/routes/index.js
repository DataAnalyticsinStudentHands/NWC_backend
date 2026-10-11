'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/data-idc-masters',
    handler: 'myController.getDataIdcMasters',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.preflight-check'],
          },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/nwc-participants',
    handler: 'myController.getNwcParticipants',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.import'],
          },
        },
      ],
    },
  },
  {
  method: 'POST',
    path: '/export',
    handler: 'myController.exportData',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.import'],
          },
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'myController.importData',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.import'],
          },
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/delete-entry',
    handler: 'myController.deleteEntry',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.import'],
          },
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/create-entry',
    handler: 'myController.createEntry',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::preflight-check.import'],
          },
        },
      ],
    },
  },
];
