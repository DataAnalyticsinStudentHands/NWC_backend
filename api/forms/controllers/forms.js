
   
'use strict'

module.exports = {
  // GET /hello
  send: async ctx => {

    strapi.services.forms.send(
      'webadmin@dash.cs.uh.edu', 
      'houstoncon17@gmail.com', 
      'NWC Form Submit ' + Date.now(), 
      `${ctx.request.body}`
    );

    // Send response to the server.
    ctx.send({
      ok: true,
    });
  },
};
