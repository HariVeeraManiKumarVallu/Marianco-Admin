// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const all = strapi.server.routes();
    const nl = all.filter(r => (r.path || '').includes('newsletter'))
      .map(r => `${r.method} ${r.path}`);
    strapi.log.info(`Newsletter routes loaded: ${nl.join(', ') || 'NONE'}`);
  }
};
