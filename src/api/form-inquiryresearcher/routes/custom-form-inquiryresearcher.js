module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-inquiryresearcher', 
        handler: 'form-inquiryresearcher.sendEmail',
      },
    ]
  }