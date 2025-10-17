'use strict';

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];