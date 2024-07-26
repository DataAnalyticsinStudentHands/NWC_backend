'use strict';

/**
 * data-race controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::data-race.data-race');
