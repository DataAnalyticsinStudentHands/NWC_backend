'use strict';

/**
 * content-resource service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::content-resource.content-resource');
