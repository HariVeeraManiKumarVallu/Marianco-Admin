import crypto from 'node:crypto';

export default () => ({
  async addToMailchimp(email) {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_AUDIENCE_ID;
    const dc = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. us21
    if (!apiKey || !listId || !dc) throw new Error('Mailchimp env vars missing');

    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `apikey ${apiKey}`,
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