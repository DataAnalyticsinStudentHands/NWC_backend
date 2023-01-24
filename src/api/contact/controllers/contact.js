const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();
            var emailFrom = emailconfig.emailFrom ?? 'webadmin@dash.cs.uh.edu'
            var emailCC = emailconfig.emailCC ?? ""
            var emailBCC= emailconfig.emailBCC   ?? ""
            var emailContactUsSubject = emailconfig.emailContactUsSubject ?? "No Subject"
            var emailContactUsText = emailconfig.emailContactUsText ?? "No Text"
            var message = 
    `Dear ${ctx.request.body.data.Name},

    ${emailContactUsText}

    Name: ${ctx.request.body.data.Name}
    Email: ${ctx.request.body.data.Email}
    Phone: ${ctx.request.body.data.Phone}
    Message: ${ctx.request.body.data.Message}`

            strapi.service('plugin::email-service.emailservice').send(
                emailFrom,       
                ctx.request.body.data.Email,
                emailCC ,   
                emailBCC,   
                emailContactUsSubject,
                message
              );

              strapi.db.query('api::contact.contact').create({
                data: {
                  Name: ctx.request.body.data.Name,
                  Email: ctx.request.body.data.Email,
                  Phone: ctx.request.body.data.Phone,
                  Message: ctx.request.body.data.Message,
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