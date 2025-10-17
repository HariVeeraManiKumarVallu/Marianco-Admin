'use strict';

(async () => {
  const strapiFactory = require('@strapi/strapi');
  const app = await strapiFactory.createStrapi();
  await app.start();

  const existing = await app.query('admin::user').findMany();
  if (existing.length) {
    console.log('Existing admin users:', existing.map(u => u.email));
  } else {
    const auth = app.service('admin::auth');
    await auth.registration({
      body: {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        password: 'Passw0rd!',
      },
    });
    console.log('Created admin: admin@example.com / Passw0rd!');
  }

  await app.destroy();
  process.exit(0);
})();