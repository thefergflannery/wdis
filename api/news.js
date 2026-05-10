// Server-side RSS/Atom proxy — fetches Irish politics news feeds, returns sanitized JSON.
// Returns: { items: [{ title, link, pubDate, source }] }

const https = require('https');
const http = require('http');

const FEEDS = [
  { url: 'https://www.irishtimes.com/arc/outboundfeeds/rss/category/politics/', source: 'Irish Times' },
  { url: 'https://www.irishtimes.com/arc/outboundfeeds/rss/category/ireland/',  source: 'Irish Times' },
  { url: 'https://www.irishexaminer.com/feed/569-Politics.xml',                 source: 'Irish Examiner' },
  { url: 'https://www.newstalk.com/feed/',                                       source: 'Newstalk' },
  { url: 'https://www.newstalk.com/news/feed/',                                  source: 'Newstalk' },
];

const EXCLUDE_RE = /\b(premier league|champions league|europa league|all-ireland final draw|match report|full[- ]time score|box office|love island|celebrity big brother|x factor)\b/i;

const MAX_ITEMS_PER_FEED = 8;
const MAX_PER_SOURCE = 3;
const TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;

const ALLOWED_HOSTNAMES = new Set([
  'irishtimes.com', 'www.irishtimes.com',
  'irishexaminer.com', 'www.irishexaminer.com',
  'newstalk.com', 'www.newstalk.com',
  'rte.ie', 'www.rte.ie',
  'independent.ie', 'www.independent.ie',
  'breakingnews.ie', 'www.breakingnews.ie',
]);

function fetchUrl(url, redirectsLeft = MAX_REDIRECTS) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && redirectsLeft > 0) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        res.resume();
        return fetchUrl(next, redirectsLeft - 1).then(resolve, reject);
      }
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

// Parse standard RSS <item> blocks
function parseRssItems(xml, source) {
  const items = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml)) !== null && items.length < MAX_ITEMS_PER_FEED) {
    const block = match[1];
    const title = stripTags(extractTag(block, 'title'));
    const link = extractTag(block, 'link') || extractAttr(block, 'link', 'href') || '';
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || '';
    if (!title || !link) continue;
    if (EXCLUDE_RE.test(title)) continue;
    if (!isAllowedLink(link)) continue;
    items.push({ title, link, pubDate, source });
  }
  return items;
}

// Parse Atom <entry> blocks (used by Irish Examiner)
function parseAtomItems(xml, source) {
  const items = [];
  const entryRe = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRe.exec(xml)) !== null && items.length < MAX_ITEMS_PER_FEED) {
    const block = match[1];
    const title = stripTags(extractTag(block, 'title'));
    const link = extractAttr(block, 'link', 'href') || extractTag(block, 'link') || '';
    const pubDate = extractTag(block, 'published') || extractTag(block, 'updated') || '';
    if (!title || !link) continue;
    if (EXCLUDE_RE.test(title)) continue;
    if (!isAllowedLink(link)) continue;
    items.push({ title, link, pubDate, source });
  }
  return items;
}

function parseItems(xml, source) {
  // Detect Atom by presence of <entry> tags
  if (/<entry[\s>]/i.test(xml)) return parseAtomItems(xml, source);
  return parseRssItems(xml, source);
}

function isAllowedLink(link) {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, '');
    return ALLOWED_HOSTNAMES.has(u.hostname) || ALLOWED_HOSTNAMES.has(host);
  } catch { return false; }
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

// Drop items older than yesterday (start of the day before today, UTC).
function filterRecent(items) {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 1);
  cutoff.setUTCHours(0, 0, 0, 0);
  return items.filter(item => {
    if (!item.pubDate) return false;
    const d = new Date(item.pubDate);
    return !isNaN(d) && d >= cutoff;
  });
}

// Pick up to `limit` items ensuring no source appears more than MAX_PER_SOURCE times.
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
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const results = await Promise.allSettled(
    FEEDS.map(async ({ url, source }) => {
      const xml = await fetchUrl(url);
      return parseItems(xml, source);
    })
  );

  const allItems = filterRecent(
    results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
  );

  const items = diversify(allItems, 15);

  return res.status(200).json({ items });
};
