const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form.form', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();
            var emailFrom = emailconfig.emailFrom ?? 'webadmin@dash.cs.uh.edu'
            var emailCC = emailconfig.emailCC ?? ""
            var emailBCC= emailconfig.emailBCC   ?? ""
            var emailSubject = emailconfig.emailSubject ?? "No Subject"
            var emailText = emailconfig.emailText ?? "No Text"
            var message = `
Dear ${ctx.request.body.data.name}

${emailText}
`
            strapi.service('plugin::email-service.emailservice').send(
                emailFrom,       
                ctx.request.body.data.email,
                emailCC ,   
                emailBCC,   
                emailSubject,
                message
              );

              ctx.send({
                ok:'email send'
              })

        } catch (err) {
        ctx.body = err;
        }
    },
}));