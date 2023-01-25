'use strict';

/**
 * commission-of-women service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::commission-of-women.commission-of-women');
