module.exports = {
  // ...
  "preflight-check": {
    enabled: true,
    resolve: "./src/plugins/preflight-check",
  },
  "import-export-entries": {
    enabled: true,
  },
  email: {
    provider: "nodemailer",
    providerOptions: {
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    },
    settings: {
      defaultFrom: "webadmin@dash.cs.uh.edu",
      defaultReplyTo: "",
    },
  },
  // ...
};
