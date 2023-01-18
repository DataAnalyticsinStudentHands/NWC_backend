const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-moreidea.form-moreidea', ({strapi})=>({
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
    Affiliation: ${ctx.request.body.data.Affiliation}
    Address: ${ctx.request.body.data.Address}
    Phone: ${ctx.request.body.data.Phone}
    Email: ${ctx.request.body.data.Email}
    Comments: ${ctx.request.body.data.Comments}`

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