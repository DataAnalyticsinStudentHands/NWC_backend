'use strict';

/**
 *  nwc-participant controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::nwc-participant.nwc-participant',({strapi})=>({
    async search(ctx, next) {
        try {            
            const entries = await strapi.db.query('api::nwc-participant.nwc-participant').findMany(
                ctx.request.body.query
            );
            ctx.body = entries;
            
        } catch (error) {
            ctx.throw(500, error);
        }
    }
}));
