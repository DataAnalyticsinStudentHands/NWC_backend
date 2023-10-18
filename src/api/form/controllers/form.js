const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::form.form", ({ strapi }) => ({
  async sendEmail(ctx) {
    try {
      const { data, template } = ctx.request.body;

      // Insert data into database
      await strapi.db.query("api::form.form").create({
        data: data,
      });

      // Send email
      const templates = await strapi.entityService.findMany(
        "api::email-template.email-template",
        {
          fields: ["bcc", "subject", "text"],
          filters: {
            template: {
              $eq: template,
            },
          },
        }
      );
      const emailConfig = templates[0] ?? {};
      const email = {};
      email.to = data.Email;
      email.from = "webadmin@dash.cs.uh.edu";
      emailConfig.bcc && (email.bcc = emailConfig.bcc);
      email.subject = emailConfig.subject ?? "NWC - Thanks for your corrections";
      email.text = `
        Dear ${data.Name},
        
        ${
          emailConfig.text ??
          `Thanks for contacting us. We will get back to you soon.`
        }
            `;
      await strapi.plugins["email"].services.email.send(email);

      ctx.send({
        ok: "email send",
      });
    } catch (err) {
      ctx.body = err;
    }
  },
}));
