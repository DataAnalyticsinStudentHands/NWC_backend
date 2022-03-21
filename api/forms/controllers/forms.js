
   
'use strict'

module.exports = {
  // GET /hello
  send: async ctx => {

    strapi.services.forms.send(
      'webadmin@dash.cs.uh.edu', 
      'peggylind@gmail.com', 
      'NWC Form Submit', 
      `${ctx.request.body.data}`
    );

    // Send response to the server.
    ctx.send({
      ok: true,
    });
  },
};
