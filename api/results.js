// Vercel KV (Upstash Redis) — env vars set via Vercel dashboard:
// KV_REST_API_URL, KV_REST_API_TOKEN
// Data stored: tilt:p1 / tilt:p2 / tilt:p3 (hashes: abbr → count), tilt:total (int)

const ALLOWED_ABBRS = new Set([
  'FF','FG','SF','Lab','SocD','GP','PBP','Sol','Aon','II',
  '100R','WP','R2C','WUA','KIA','Rab','NP','DDI','PAW','I4C',
]);

async function kv(commands) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV not configured');
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  return res.json();
}

function toObj(arr) {
  if (!Array.isArray(arr)) return {};
  const o = {};
  for (let i = 0; i < arr.length; i += 2) o[arr[i]] = parseInt(arr[i + 1]) || 0;
  return o;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const body = req.body || {};
    const r1 = String(body.result1 || '').trim();
    const r2 = String(body.result2 || '').trim();
    const r3 = String(body.result3 || '').trim();

    if (!ALLOWED_ABBRS.has(r1)) return res.status(400).json({ error: 'Invalid result1' });

    const cmds = [
      ['HINCRBY', 'tilt:p1', r1, 1],
      ['INCR', 'tilt:total'],
    ];
    if (ALLOWED_ABBRS.has(r2)) cmds.push(['HINCRBY', 'tilt:p2', r2, 1]);
    if (ALLOWED_ABBRS.has(r3)) cmds.push(['HINCRBY', 'tilt:p3', r3, 1]);

    try {
      await kv(cmds);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const rows = await kv([
        ['HGETALL', 'tilt:p1'],
        ['HGETALL', 'tilt:p2'],
        ['HGETALL', 'tilt:p3'],
        ['GET', 'tilt:total'],
      ]);
      const p1 = toObj(rows[0]?.result);
      const p2 = toObj(rows[1]?.result);
      const p3 = toObj(rows[2]?.result);
      const total = parseInt(rows[3]?.result) || 0;
      const top3 = Object.entries(p1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([abbr, count]) => ({ abbr, count }));
      return res.status(200).json({ total, p1, p2, p3, top3, topParty: top3[0]?.abbr || null });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
