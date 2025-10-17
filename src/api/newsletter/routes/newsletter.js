'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/newsletter/ping', handler: 'newsletter.ping', config: { auth: false } },
    { method: 'POST', path: '/newsletter/subscribe', handler: 'newsletter.subscribe', config: { auth: false } },
    // Optional GET fallback (query ?email=)
    { method: 'GET', path: '/newsletter/subscribe', handler: 'newsletter.subscribeGet', config: { auth: false } }
  ]
};