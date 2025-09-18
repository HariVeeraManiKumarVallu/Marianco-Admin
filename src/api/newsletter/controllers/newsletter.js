'use strict';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async ping(ctx) {
    ctx.body = { ok: true, uptime: process.uptime() };
  },

  async subscribe(ctx) {
    const { email } = ctx.request.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ctx.badRequest('Invalid email');
    }
    const normalized = email.trim().toLowerCase();

    // Local upsert
    let record = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { email: normalized } });
    if (!record) {
      record = await strapi.db.query('api::newsletter.newsletter').create({
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
      const result = await strapi.service('api::newsletter.newsletter').addToMailchimp(normalized);
      await strapi.db.query('api::newsletter.newsletter').update({
        where: { id: record.id },
        data: {
          mailchimpStatus: result.status || 'unknown',
          isSubscribed: (result.status === 'subscribed')
        }
      });
      ctx.body = { success: true, status: result.status };
    } catch (e) {
      strapi.log.error('Mailchimp subscribe failed', e);
      return ctx.internalServerError('Subscription failed');
    }
  }
}));