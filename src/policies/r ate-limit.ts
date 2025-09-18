const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 600000); // 10 min
const MAX = Number(process.env.RATE_LIMIT_MAX || 30);

const buckets: Record<string, { count: number; reset: number }> = {};

export default (policyContext, config, { strapi }) => {
  const ip = policyContext?.ctx?.ip || 'unknown';
  const now = Date.now();
  const bucket = buckets[ip] || { count: 0, reset: now + WINDOW_MS };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + WINDOW_MS;
  }
  bucket.count += 1;
  buckets[ip] = bucket;
  if (bucket.count > MAX) {
    strapi.log.warn(`Rate limit exceeded by ${ip}`);
    policyContext.ctx.status = 429;
    policyContext.ctx.body = { error: 'Too Many Requests' };
    return false;
  }
  return true;
};