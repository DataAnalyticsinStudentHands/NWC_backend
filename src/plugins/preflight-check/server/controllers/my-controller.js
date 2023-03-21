'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('preflight-check')
      .service('myService')
      .getWelcomeMessage();
  },
});
