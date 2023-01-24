const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-moreidea.form-moreidea', ({strapi})=>({
    async sendEmail(ctx) {
        try {
            const emailconfig = await strapi.service('plugin::email-service.emailservice').find();
            var emailFrom = emailconfig.emailFrom ?? 'webadmin@dash.cs.uh.edu'
            var emailCC = emailconfig.emailCC ?? ""
            var emailBCC= emailconfig.emailBCC   ?? ""
            var emailMoreIdeasSubject = emailconfig.emailMoreIdeasSubject ?? "No Subject"
            var emailMoreIdeasText = emailconfig.emailMoreIdeasText ?? "No Text"
            var message = 
    `Dear ${ctx.request.body.data.Name},

    ${emailMoreIdeasText}

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
                emailMoreIdeasSubject,
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