module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/form-inquiryparticipant', 
        handler: 'form-inquiryparticipant.sendEmail',
      },
    ]
  }