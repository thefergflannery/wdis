// Upstash Redis — stores vote counts for the government approval poll
// Hash key: tilt:survey:gov, fields: "-2" | "-1" | "0" | "1" | "2"

const { Redis } = require('@upstash/redis');

const KEY = 'tilt:survey:gov';
const VALID = new Set(['-2', '-1', '0', '1', '2']);

const ALLOWED_ORIGINS = new Set([
  'https://wdisf-ferg-flannerys-projects.vercel.app',
  'https://tilt.ferg.ie',
  'https://tilt.fergflannery.com',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
]);

const rateLimits = new Map();
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_MAX = 1;

function checkRate(ip) {
  const now = Date.now();
  const r = rateLimits.get(ip);
  if (!r || now - r.windowStart > RATE_WINDOW_MS) { rateLimits.set(ip, { count: 1, windowStart: now }); return true; }
  if (r.count >= RATE_MAX) return false;
  r.count++; return true;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(origin)) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const empty = { total: 0, counts: { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 } };

  let redis;
  try { redis = Redis.fromEnv(); } catch (e) {
    return res.status(200).json({ ...empty, _error: 'redis_not_configured' });
  }

  if (req.method === 'POST') {
    if (JSON.stringify(req.body || {}).length > 64) return res.status(413).json({ error: 'Payload too large' });
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    if (!checkRate(ip)) return res.status(429).json({ error: 'Already voted' });
    const vote = String(req.body?.vote ?? '').trim();
    if (!VALID.has(vote)) return res.status(400).json({ error: 'Invalid vote' });
    await redis.hincrby(KEY, vote, 1);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const raw = await redis.hgetall(KEY);
    const counts = { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 };
    if (raw) for (const [k, v] of Object.entries(raw)) if (VALID.has(k)) counts[k] = parseInt(v) || 0;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return res.status(200).json({ total, counts });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
