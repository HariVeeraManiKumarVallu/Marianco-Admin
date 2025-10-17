export default [
  'strapi::errors',
  { name: 'strapi::cors', config: { enabled: true, origin: ['http://localhost:3000'], headers: '*'} },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public'
];
