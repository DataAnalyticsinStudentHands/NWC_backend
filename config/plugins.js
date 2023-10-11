module.exports = {
  // ...
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
    provider: "nodemailer",
    providerOptions: {
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    },
  },
  // ...
};
