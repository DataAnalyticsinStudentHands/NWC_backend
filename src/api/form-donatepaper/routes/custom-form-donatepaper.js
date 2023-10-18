module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-donatepaper', 
        handler: 'form-donatepaper.sendEmail',
      },
    ]
  }