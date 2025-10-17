'use strict';

const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async ping(ctx) {
    ctx.body = { ok: true, uptime: process.uptime() };
  },

  async subscribe(ctx) {
    const { email } = ctx.request.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ctx.badRequest('Invalid email');
    const normalized = email.trim().toLowerCase();

    let rec = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { email: normalized } });
    if (!rec) {
      rec = await strapi.db.query('api::newsletter.newsletter').create({
        data: {
          email: normalized,
          isSubscribed: true,
          subscribedAt: new Date(),
          source: 'web',
          mailchimpStatus: 'pending'
        }
      });
    }

    try {
      const r = await strapi.service('api::newsletter.newsletter').addToMailchimp(normalized);
      await strapi.db.query('api::newsletter.newsletter').update({
        where: { id: rec.id },
        data: {
          mailchimpStatus: r.status || 'unknown',
          isSubscribed: r.status === 'subscribed'
        }
      });
      ctx.body = { success: true, status: r.status };
    } catch (e) {
      strapi.log.warn('Mailchimp skipped: ' + e.message);
      ctx.body = { success: true, status: 'pending' };
    }
  },

  async subscribeGet(ctx) {
    const { email } = ctx.query || {};
    ctx.request.body = { email };
    return this.subscribe(ctx);
  }
}));