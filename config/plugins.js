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
	config:{
    provider: "nodemailer",
    providerOptions: {
      sendmail: true,
    },
    settings: {
      defaultFrom: "webadmin@dash.cs.uh.edu",
      defaultReplyTo: "",
    },
	},
  },
  // ...
};
