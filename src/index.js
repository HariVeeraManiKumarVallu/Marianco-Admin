export default {
  register() {},
  bootstrap({ strapi }) {
    const all = strapi.server.routes();
    const nl = all
      .filter(r => (r.path || '').includes('newsletter'))
      .map(r => `${r.method} ${r.path}`);
    strapi.log.info(`Newsletter routes loaded: ${nl.join(', ') || 'NONE'}`);
  }
};