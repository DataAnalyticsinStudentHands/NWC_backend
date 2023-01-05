const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-moreidea.form-moreidea', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();
            var emailFrom = emailconfig.emailFrom ?? 'webadmin@dash.cs.uh.edu'
            var emailCC = emailconfig.emailCC ?? ""
            var emailBCC= emailconfig.emailBCC   ?? "houstoncon17@gmail.com"
            var emailSubject = emailconfig.emailSubject ?? "Sharing Stories 1977"
            var emailText = emailconfig.emailText ?? "Thank you for visiting Sharing Stories! This email is being sent to confirm that we have received your submission."
            var message = `
    Dear ${ctx.request.body.data.Name}

    ${emailText}
`
            strapi.service('plugin::email-service.emailservice').send(
                emailFrom,       
                ctx.request.body.data.Email,
                emailCC ,   
                emailBCC,   
                emailSubject,
                message
              );

              strapi.db.query('api::form-moreidea.form-moreidea').create({
                data: {
                  Name: ctx.request.body.data.Name,
                  Affiliation: ctx.request.body.data.Affiliation,
                  Address: ctx.request.body.data.Address,
                  Phone: ctx.request.body.data.Phone,
                  Email: ctx.request.body.data.Email,
                  Comments: ctx.request.body.data.Comments,
                  publishedAt: new Date().getTime()
                },
              });

              ctx.send({
                ok:'email send'
              })

        } catch (err) {
        ctx.body = err;
        }
    }
}));