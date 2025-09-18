const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 600000);
const MAX = Number(process.env.RATE_LIMIT_MAX || 30);

const buckets = {};

export default (policyContext, _config, { strapi }) => {
  const ip = policyContext?.ctx?.ip || 'unknown';
  const now = Date.now();
  let b = buckets[ip];
  if (!b || now > b.reset) {
    b = { count: 0, reset: now + WINDOW_MS };
  }
  b.count += 1;
  buckets[ip] = b;
  if (b.count > MAX) {
    strapi.log.warn(`Rate limit exceeded by ${ip}`);
    policyContext.ctx.status = 429;
    policyContext.ctx.body = { error: 'Too Many Requests' };
    return false;
  }
  return true;
};