module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forms-inquiryarchivist', 
        handler: 'form-inquiryarchivist.sendEmail',
      },
    ]
  }