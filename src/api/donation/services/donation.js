'use strict';

const { randomUUID } = require('node:crypto');
const { factories } = require('@strapi/strapi');

let squareClient = null;
let ready = false;

(function initSquare() {
  try {
    const { Client, Environment } = require('square'); // ensure correct package
    squareClient = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: (process.env.SQUARE_ENV === 'production') ? Environment.Production : Environment.Sandbox,
    });
    ready = true;
  } catch {
    ready = false;
  }
})();

async function ensureCustomer(email) {
  if (!ready) return { id: 'mock-' + Date.now() };
  const { customersApi } = squareClient;
  const list = await customersApi.listCustomers().catch(() => ({ result: {} }));
  const match = list?.result?.customers?.find(c => c.emailAddress?.toLowerCase() === email.toLowerCase());
  if (match) return match;
  const created = await customersApi.createCustomer({ idempotencyKey: randomUUID(), emailAddress: email });
  return created.result.customer;
}

module.exports = factories.createCoreService('api::donation.donation', ({ strapi }) => ({
  async processOneTimePayment({ email, amount, currency = 'USD', nonce }) {
    if (!ready) return { mock: true, paymentId: 'mock-' + Date.now() };
    const { paymentsApi } = squareClient;
    const resp = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: nonce,
      amountMoney: { amount: Number(amount), currency },
      locationId: process.env.SQUARE_LOCATION_ID,
      note: `Donation ${email}`,
      autocomplete: true,
    });
    return { payment: resp.result.payment };
  },

  async processRecurringSubscription({ email, nonce, planId }) {
    const planVariationId = planId || process.env.SQUARE_SUBSCRIPTION_PLAN_ID;
    if (!planVariationId) throw new Error('Missing planId');

    if (!ready) return { mock: true, subscriptionId: 'mock-sub-' + Date.now() };

    const { cardsApi, subscriptionsApi } = squareClient;
    const customer = await ensureCustomer(email);

    const cardResp = await cardsApi.createCard({
      idempotencyKey: randomUUID(),
      sourceId: nonce,
      card: { customerId: customer.id },
    });

    const subResp = await subscriptionsApi.createSubscription({
      idempotencyKey: randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID,
      planVariationId,
      customerId: customer.id,
      cardId: cardResp.result.card.id,
    });

    return { subscription: subResp.result.subscription };
  },
}));
