'use strict';

const { createStrapi } = require('@strapi/strapi');

(async () => {
  const app = await createStrapi();
  await app.start();

  const items = [
    { name: 'Alice Johnson', role: 'Founder', hierarchy: 1, bio: 'Leads vision.' },
    { name: 'Ben Lee', role: 'Operations', hierarchy: 2, bio: 'Runs operations.' }
  ];

  for (const data of items) {
    const found = await app.db.query('api::team-member.team-member').findOne({ where: { hierarchy: data.hierarchy } });
    if (!found) {
      await app.entityService.create('api::team-member.team-member', { data });
      console.log('Created hierarchy', data.hierarchy);
    }
  }

  await app.destroy();
  process.exit(0);
})();