module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms', 
        handler: 'form.sendEmail',
      },
    ]
  }