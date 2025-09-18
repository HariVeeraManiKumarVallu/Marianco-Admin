export default {
  routes: [
    {
      method: 'GET',
      path: '/newsletter/ping',
      handler: 'newsletter.ping',
      config: { auth: false }
    },
    {
      method: 'POST',
      path: '/newsletter/subscribe',
      handler: 'newsletter.subscribe',
      config: {
        auth: false,
        policies: ['global::rate-limit']
      }
    }
  ]
};