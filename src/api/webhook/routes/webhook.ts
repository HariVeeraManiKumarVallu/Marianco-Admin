export default {
  routes: [
    {
      method: 'POST',
      path: '/printify-webhook',
      handler: 'webhook.webhook',
      config: {
        // Optional: disable authentication for this route if it's a public webhook
        auth: false,
      },
    },
  ],
}
