'use strict';

const fetch = require('node-fetch');

const isProd = process.env.SQUARE_ENV === 'production';
const SQUARE_DOMAIN = isProd ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com';
const SQUARE_BASE = `${SQUARE_DOMAIN}/v2`;

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    'Square-Version': process.env.SQUARE_VERSION || '2024-08-15',
  };
}

async function sq(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${SQUARE_DOMAIN}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Square error: ${JSON.stringify(json)}`);
  return json;
}

async function createSubscription({ email, planId, customerId, cardId, referenceId }) {
  const cust = customerId
    ? { id: customerId }
    : (await sq('/v2/customers/search', {
        method: 'POST',
        body: { query: { filter: { email_address: { exact: email } } } },
      }).then(r => r.customers?.[0])) ||
      (await sq('/v2/customers', { method: 'POST', body: { email_address: email } }).then(r => r.customer));

  const resp = await sq('/v2/subscriptions', {
    method: 'POST',
    body: {
      idempotency_key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      location_id: process.env.SQUARE_LOCATION_ID,
      plan_id: planId,
      customer_id: cust.id,
      card_id: cardId,
      reference_id: referenceId,
    },
  });
  return resp.subscription;
}

async function cancelSubscription(subscriptionId) {
  const resp = await sq(`/v2/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
  return resp.subscription;
}

module.exports = { createSubscription, cancelSubscription };