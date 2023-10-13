module.exports = {
  "email-service": {
    enabled: true,
    resolve: "./src/plugins/email-service",
  },
  "preflight-check": {
    enabled: true,
    resolve: "./src/plugins/preflight-check",
  },
  "import-export-entries": {
    enabled: true,
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        sendmail: true,
      },
      settings: {
        defaultFrom: "webadmin@dash.cs.uh.edu",
        defaultReplyTo: "webadmin@dash.cs.uh.edu",
      },
    },
  },
};
