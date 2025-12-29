module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-inquiryparticipant', 
        handler: 'form-inquiryparticipant.sendEmail',
      },
    ]
  }