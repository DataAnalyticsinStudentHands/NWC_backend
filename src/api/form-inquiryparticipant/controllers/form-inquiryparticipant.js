const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-inquiryparticipant.form-inquiryparticipant',({ strapi }) => ({
    async sendEmail(ctx) {
        try {
          const { data, template } = ctx.request.body;
          // Validate input data
          if (!data || !template) {
            throw new Error("Missing required data or template in the request body.");
          }
          // Check if email template exists
          const emailConfig = await fetchEmailTemplate(template);
          if (!emailConfig) {
            throw new Error(`Email template ${template} not found.`);
          }
          // Build email object
          const email = buildEmailObject(data, emailConfig);
          // Send email
          strapi.plugins["email"].services.email.send(email);
          // Insert data into database
          saveContactToDatabase(data);
          ctx.send({
            ok: "email send",
          });
        } catch (err) {
          console.error("Error in sendEmail function:", err.message);
          ctx.status = 500; // Set server error status
          ctx.body = { error: "Failed to send email. Please try again later." };        
        }
      },
    }));

    // Helper function to save contact to database
async function saveContactToDatabase(data) {
  return await strapi.db.query("api::form-inquiryparticipant.form-inquiryparticipant").create({ data });
}
// Helper function to fetch email template
async function fetchEmailTemplate(template) {
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

  return templates[0] ?? {};
}

// Helper function to build email object
function buildEmailObject(data, emailConfig) {
  return {
    to: data.Email,
    from: "webadmin@dash.cs.uh.edu",
    bcc: emailConfig.bcc || undefined,
    subject: emailConfig.subject || "NWC - Thanks for your inquiry",
    text: `
Dear ${data.Name},

${emailConfig.text || "Thanks for contacting us. We will get back to you soon."}
`,
  };
}