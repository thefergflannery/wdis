// Server-side RSS proxy — fetches Irish politics news feeds, returns sanitized JSON.
// Returns: { items: [{ title, link, pubDate, source }] }
// Enforces max 2 items per source in final output to ensure variety.

const https = require('https');
const http = require('http');

const FEEDS = [
  { url: 'https://feeds.rte.ie/rtepolitics',                           source: 'RTÉ Politics' },
  { url: 'https://feeds.rte.ie/rtenews/ireland',                       source: 'RTÉ News' },
  { url: 'https://www.thejournal.ie/feed/',                            source: 'The Journal' },
  { url: 'https://www.irishexaminer.com/feed/news/politics/',          source: 'Irish Examiner' },
  { url: 'https://www.newstalk.com/news/politics/feed/',               source: 'Newstalk' },
  { url: 'https://www.irishexaminer.com/feed/news/ireland/',           source: 'Irish Examiner' },
];

const MAX_ITEMS_PER_FEED = 6;
const MAX_PER_SOURCE = 2;
const TIMEOUT_MS = 5000;

const ALLOWED_HOSTNAMES = new Set([
  'rte.ie', 'www.rte.ie',
  'thejournal.ie', 'www.thejournal.ie',
  'irishtimes.com', 'www.irishtimes.com',
  'independent.ie', 'www.independent.ie',
  'irishexaminer.com', 'www.irishexaminer.com',
  'newstalk.com', 'www.newstalk.com',
  'breakingnews.ie', 'www.breakingnews.ie',
]);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => { data += chunk; if (data.length > 500_000) req.destroy(); });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function parseItems(xml, source) {
  const items = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml)) !== null && items.length < MAX_ITEMS_PER_FEED) {
    const block = match[1];
    const title = stripTags(extractTag(block, 'title'));
    const link = extractTag(block, 'link') || extractAttr(block, 'link', 'href') || '';
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || '';
    if (!title || !link) continue;
    try {
      const u = new URL(link);
      const host = u.hostname.replace(/^www\./, '');
      if (!ALLOWED_HOSTNAMES.has(u.hostname) && !ALLOWED_HOSTNAMES.has(host)) continue;
    } catch { continue; }
    items.push({ title, link, pubDate, source });
  }
  return items;
}

function extractTag(str, tag) {
  const re = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = re.exec(str);
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractAttr(str, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i');
  const m = re.exec(str);
  return m ? m[1] : '';
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// Pick up to `limit` items from the pool ensuring no source appears more than MAX_PER_SOURCE times.
function diversify(allItems, limit) {
  const sorted = [...allItems].sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate) : 0;
    const db = b.pubDate ? new Date(b.pubDate) : 0;
    return db - da;
  });
  const counts = {};
  const out = [];
  for (const item of sorted) {
    if (out.length >= limit) break;
    const c = counts[item.source] || 0;
    if (c >= MAX_PER_SOURCE) continue;
    counts[item.source] = c + 1;
    out.push(item);
  }
  return out;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'same-origin');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const results = await Promise.allSettled(
    FEEDS.map(async ({ url, source }) => {
      const xml = await fetchUrl(url);
      return parseItems(xml, source);
    })
  );

  const allItems = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  const items = diversify(allItems, 9);

  return res.status(200).json({ items });
};
