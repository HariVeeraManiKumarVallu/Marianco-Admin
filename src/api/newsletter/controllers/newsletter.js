'use strict';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async subscribe(ctx) {
    const { email } = ctx.request.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ctx.badRequest('Invalid email');

    const existing = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { email } });
    if (existing) {
      if (existing.isSubscribed) return ctx.badRequest('Already subscribed');
      await strapi.db.query('api::newsletter.newsletter').update({
        where: { id: existing.id },
        data: { isSubscribed: true, subscribedAt: new Date() }
      });
      return ctx.send({ success: true, message: 'Resubscribed' });
    }
    const created = await strapi.db.query('api::newsletter.newsletter').create({
      data: { email, isSubscribed: true, subscribedAt: new Date() }
    });
    return ctx.send({ success: true, message: 'Subscribed', data: created });
  }
}));