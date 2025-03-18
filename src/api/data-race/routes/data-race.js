'use strict';

/**
 * data-race router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::data-race.data-race');
