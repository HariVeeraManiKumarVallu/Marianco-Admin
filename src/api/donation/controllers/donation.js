'use strict';

const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreController('api::donation.donation', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);

    try {
      const body = ctx.request.body || {};
      const email = body.email;
      const amount = body.amount;
      const currency = body.currency || 'USD';
      const ref = body.externalId || response?.data?.id;

      if (email) {
        await strapi.plugin('email').service('email').send({
          to: email,
          subject: `Thank you for your donation${amount ? ` (${amount} ${currency})` : ''}`,
          html: `<p>We received your donation.</p><p>Reference: ${ref || ''}</p>`,
        });
      }
    } catch (e) {
      strapi.log.warn(`Email send failed: ${e?.message || e}`);
    }

    return response;
  },

  async createRecurring(ctx) {
    ctx.body = { ok: true };
  },
}));
