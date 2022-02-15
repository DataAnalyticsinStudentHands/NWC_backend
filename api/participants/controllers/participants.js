'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findBasic(ctx)
     {
         console.log("findBasic ctx query" , ctx.query)
     }
};
