'use strict';

/**
 * basic-race service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::basic-race.basic-race');
