// Upstash Redis via @upstash/redis
// Reads UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN from env (set by Vercel integration)
// Data: tilt:p1 / tilt:p2 / tilt:p3 (hashes: party abbr → count), tilt:total (integer)

const { Redis } = require('@upstash/redis');

const ALLOWED = new Set([
  'FF','FG','SF','Lab','SocD','GP','PBP','Sol','Aon','II',
  '100R','WP','R2C','WUA','KIA','Rab','NP','DDI','PAW','I4C',
]);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let redis;
  try {
    redis = Redis.fromEnv();
  } catch (e) {
    // Return empty data so the toggle still renders without crashing
    if (req.method === 'GET') {
      return res.status(200).json({ total: 0, p1: {}, p2: {}, p3: {}, top3: [], topParty: null, _error: 'redis_not_configured' });
    }
    return res.status(503).json({ error: 'Redis not configured' });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const r1 = String(body.result1 || '').trim();
    const r2 = String(body.result2 || '').trim();
    const r3 = String(body.result3 || '').trim();

    if (!ALLOWED.has(r1)) return res.status(400).json({ error: 'Invalid result1' });

    const pipeline = redis.pipeline();
    pipeline.hincrby('tilt:p1', r1, 1);
    pipeline.incr('tilt:total');
    if (ALLOWED.has(r2)) pipeline.hincrby('tilt:p2', r2, 1);
    if (ALLOWED.has(r3)) pipeline.hincrby('tilt:p3', r3, 1);

    await pipeline.exec();
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const [p1, p2, p3, total] = await Promise.all([
      redis.hgetall('tilt:p1'),
      redis.hgetall('tilt:p2'),
      redis.hgetall('tilt:p3'),
      redis.get('tilt:total'),
    ]);

    // hgetall returns object or null; normalise values to integers
    const norm = (obj) => {
      if (!obj) return {};
      const o = {};
      for (const [k, v] of Object.entries(obj)) o[k] = parseInt(v) || 0;
      return o;
    };

    const p1n = norm(p1);
    const top3 = Object.entries(p1n)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([abbr, count]) => ({ abbr, count }));

    return res.status(200).json({
      total: parseInt(total) || 0,
      p1: p1n,
      p2: norm(p2),
      p3: norm(p3),
      top3,
      topParty: top3[0]?.abbr || null,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
