'use strict';

/**
 * plank service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::plank.plank');
