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
            var message = 
    `Dear ${ctx.request.body.data.Name},

    ${emailText}

    Name: ${ctx.request.body.data.Name}
    Affiliation/Occupation: ${ctx.request.body.data.Affiliation}
    Email: ${ctx.request.body.data.Email}
    Name of Page: ${ctx.request.body.data.Page}
    Name of Feature: ${ctx.request.body.data.Feature}
    Corrections: ${ctx.request.body.data.Corrections}
    Source for Correction: ${ctx.request.body.data.Source}`

            strapi.service('plugin::email-service.emailservice').send(
                emailFrom,       
                ctx.request.body.data.Email,
                emailCC ,   
                emailBCC,   
                emailSubject,
                message
              );

              strapi.db.query('api::form.form').create({
                data: {
                  Name: ctx.request.body.data.Name,
                  Email: ctx.request.body.data.Email,
                  Affiliation: ctx.request.body.data.Affiliation,
                  Page: ctx.request.body.data.Page,
                  Feature: ctx.request.body.data.Feature,
                  Corrections: ctx.request.body.data.Corrections,
                  Source: ctx.request.body.data.Source,
                  //publishedAt: new Date().getTime()
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