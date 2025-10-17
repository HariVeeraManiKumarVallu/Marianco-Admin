'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/donations',
      handler: 'donation.create',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/donations/recurring',
      handler: 'donation.createRecurring',
      config: { auth: false },
    },
  ],
};
