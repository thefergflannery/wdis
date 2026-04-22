// Server-side RSS proxy — fetches Irish news feeds and returns sanitized JSON.
// Replaces the client-side api.rss2json.com third-party proxy to eliminate XSS risk.
// Returns: { items: [{ title, link, pubDate, source }] }

const https = require('https');
const http = require('http');

const FEEDS = [
  { url: 'https://feeds.rte.ie/rtenews/ireland', source: 'RTÉ News' },
  { url: 'https://feeds.rte.ie/rtepolitics', source: 'RTÉ Politics' },
  { url: 'https://www.thejournal.ie/feed/', source: 'The Journal' },
];

const MAX_ITEMS_PER_FEED = 4;
const TIMEOUT_MS = 5000;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
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
    // Only allow known-safe hostnames
    try {
      const hostname = new URL(link).hostname;
      if (!hostname.endsWith('.rte.ie') && !hostname.endsWith('.thejournal.ie') &&
          !hostname.endsWith('.irishtimes.com') && !hostname.endsWith('.independent.ie')) continue;
    } catch { continue; }
    items.push({ title, link, pubDate, source });
  }
  return items;
}

function extractTag(str, tag) {
  const re = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = re.exec(str);
  if (!m) return '';
  // Strip CDATA
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'same-origin');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const results = await Promise.allSettled(FEEDS.map(async ({ url, source }) => {
    const xml = await fetchUrl(url);
    return parseItems(xml, source);
  }));

  const items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate) : 0;
      const db = b.pubDate ? new Date(b.pubDate) : 0;
      return db - da;
    })
    .slice(0, 9);

  return res.status(200).json({ items });
};
