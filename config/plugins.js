'use strict';

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false),
        auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'no-reply@marianco.org'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'support@marianco.org'),
      },
    },
  },
});