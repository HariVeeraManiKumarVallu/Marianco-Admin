'use strict';

const { createStrapi } = require('@strapi/strapi');

(async () => {
  const strapi = await createStrapi();
  await strapi.load();

  const adminService = strapi.admin.services.user;
  const roleService = strapi.admin.services.role;

  const email = 'admin@example.com';

  const exists = await adminService.exists({ email });
  if (exists) {
    console.log('Admin already exists');
  } else {
    const superAdmin = await roleService.getSuperAdmin();
    await adminService.create({
      email,
      password: 'Admin123!',
      firstname: 'Admin',
      lastname: 'User',
      isActive: true,
      roles: [superAdmin.id],
    });
    console.log('Admin created');
  }

  await strapi.destroy();
  process.exit(0);
})();