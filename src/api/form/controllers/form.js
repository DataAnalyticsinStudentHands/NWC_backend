const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form.form', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();
            var emailFrom = emailconfig.emailFrom ?? 'webadmin@dash.cs.uh.edu'
            var emailCC = emailconfig.emailCC ?? ""
            var emailBCC= emailconfig.emailBCC   ?? ""
            var emailCorrectionsSubject = emailconfig.emailCorrectionsSubject ?? "No Subject"
            var emailCorrectionsText = emailconfig.emailCorrectionsText ?? "No Text"
            var message = 
    `Dear ${ctx.request.body.data.Name},

    ${emailCorrectionsText}

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
                emailCorrectionsSubject,
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