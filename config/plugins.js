module.exports =  {
    // ...
    'email-service': {
      enabled: true,
      resolve: './src/plugins/email-service'
    },
    'preflight-check': {
      enabled: true,
      resolve: './src/plugins/preflight-check'
    },
    'import-export-entries': {
      enabled: true,
      // config: {
      //   // See `Config` section.
      //   serverPublicHostname: 'https://dash.cs.uh.edu',
      // },
    },
    // ...
  }