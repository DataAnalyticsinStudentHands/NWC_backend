'use strict';

/**
 * data-race service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::data-race.data-race');
