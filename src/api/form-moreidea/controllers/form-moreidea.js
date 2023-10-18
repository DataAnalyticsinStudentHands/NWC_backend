const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::form-moreidea.form-moreidea",
  ({ strapi }) => ({
    async sendEmail(ctx) {
      try {
        const data = ctx.request.body.data;
        const emailconfig = await strapi
          .service("plugin::email-service.emailservice")
          .find();

        const email = {};
        email.to = data.Email;
        email.from = emailconfig.emailFrom ?? "webadmin@dash.cs.uh.edu";
        emailconfig.emailBCC && (email.bcc = emailconfig.emailBCC);
        email.subject = emailconfig.emailMoreIdeasSubject ?? "NWC - Thanks for your ideas";
        email.text = `
        Dear ${data.Name},
        
        ${
          emailconfig.emailMoreIdeasText ??
          `Thanks for your ideas. We will get back to you soon.`
        }
        `;
        await strapi.plugins["email"].services.email.send(email);
        strapi.db.query("api::form-moreidea.form-moreidea").create({
          data: data,
        });

        ctx.send({
          ok: "email send",
        });
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
