'use strict';

/**
 * basic-race router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::basic-race.basic-race');
