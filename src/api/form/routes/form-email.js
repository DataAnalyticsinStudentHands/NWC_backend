module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/user-form-email', 
        handler: 'form.sendEmail',
      },
    ]
  }