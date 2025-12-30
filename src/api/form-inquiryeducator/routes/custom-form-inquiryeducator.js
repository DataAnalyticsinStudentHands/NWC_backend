module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-inquiryeducator', 
        handler: 'form-inquiryeducator.sendEmail',
      },
    ]
  }