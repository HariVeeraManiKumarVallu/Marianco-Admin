'use strict';
const crypto = require('crypto');

module.exports = () => ({
  async addToMailchimp(email) {
    const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_API_SERVER } = process.env;
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_API_SERVER) {
      throw new Error('Mailchimp env vars missing');
    }
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${hash}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'subscribed',
        status: 'subscribed'
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return { status: data.status || 'error', detail: data.detail };
    }
    return { status: data.status };
  }
});