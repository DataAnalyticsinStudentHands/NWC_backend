const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form.form', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const data = ctx.request.body.data;
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();

            const email = {};
            email.to = data.Email;
            email.from = emailconfig.emailFrom ?? "webadmin@dash.cs.uh.edu";
            emailconfig.emailBCC && (email.bcc = emailconfig.emailBCC);
            email.subject = emailconfig.emailContactUsSubject ?? "NWC - Thanks for your corrections";
            email.text = `
        Dear ${data.Name},
        
        ${
            emailconfig.emailContactUsText ??
            `Thanks for contacting us. We will get back to you soon.`
        }
            `;
            await strapi.plugins['email'].services.email.send(email);
            strapi.db.query('api::form.form').create({
                data: data,
            });

            ctx.send({
                ok: 'email send',
            });
        }
      catch (err) {
        ctx.body = err;
        }
    }
}));