'use strict';

/**
 * content-resource router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::content-resource.content-resource');
