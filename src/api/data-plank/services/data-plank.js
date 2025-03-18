'use strict';

/**
 * data-plank service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::data-plank.data-plank');
