'use strict';


const { default: createStrapi } = require("strapi");
const qs = require('qs');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 * 
 * We are not actively using this for NWC, but it can be good for testing
 */

module.exports = {

    async findBasic(ctx)
     {
         console.log("findBasic ctx query" , ctx.query._where._or)

         const participantList = await Promise.all(ctx.query._where._or.map(async role => {
             const parts = await strapi.services.participants.find({'nwc_roles.delegate_at_the_nwc': "1"})
             return parts;
         }));
        
         return participantList
     }
};
