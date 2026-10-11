const pluginPermissions = {
  main: [
    { action: 'plugin::preflight-check.preflight-check', subject: null },
  ],
  import: [
    { action: 'plugin::preflight-check.import', subject: null },
  ],
};

export default pluginPermissions;