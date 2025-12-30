module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-inquirystudent', 
        handler: 'form-inquirystudent.sendEmail',
      },
    ]
  }