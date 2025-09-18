import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async ping(ctx) {
    ctx.send({ ok: true, uptime: process.uptime() });
  },

  async subscribe(ctx) {
    const { email } = ctx.request.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ctx.badRequest('Invalid email');
    }
    const normalized = email.trim().toLowerCase();

    const existing = await strapi.db.query('api::newsletter.newsletter').findOne({ where: { email: normalized } });
    if (!existing) {
      await strapi.db.query('api::newsletter.newsletter').create({
        data: {
          email: normalized,
          isSubscribed: true,
          subscribedAt: new Date(),
          source: 'web',
          mailchimpStatus: 'pending'
        }
      });
    }

    let mcStatus = 'error';
    try {
      const result = await strapi.service('api::newsletter.newsletter').addToMailchimp(normalized);
      mcStatus = result.status || 'unknown';
      await strapi.db.query('api::newsletter.newsletter').update({
        where: { email: normalized },
        data: {
          mailchimpStatus: mcStatus,
          isSubscribed: mcStatus === 'subscribed'
        }
      });
    } catch (e) {
      strapi.log.error('Mailchimp subscribe failed', e);
      return ctx.internalServerError('Subscription failed');
    }

    ctx.send({ success: true, status: mcStatus });
  }
}));