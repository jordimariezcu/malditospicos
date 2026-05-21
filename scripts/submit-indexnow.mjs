/**
 * submit-indexnow.mjs
 * Submits all URLs from the sitemap to IndexNow (Bing, Yandex, Naver).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *
 * Run after each deployment or scheduled weekly.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

const KEY = 'ed23de2b58c54aa2b7ce009e75d3f443';
const HOST = 'www.malditospicos.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// ── Extract URLs from sitemap files ─────────────────────────────────────────

function extractUrlsFromXml(xml) {
  const matches = xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
  return [...matches].map(m => m[1]);
}

async function collectUrls() {
  const urls = [];

  // Fetch the sitemap index
  const indexRes = await fetch(`https://${HOST}/sitemap-index.xml`);
  if (!indexRes.ok) {
    console.error('Could not fetch sitemap-index.xml:', indexRes.status);
    process.exit(1);
  }
  const indexXml = await indexRes.text();
  const sitemapUrls = extractUrlsFromXml(indexXml);

  console.log(`Found ${sitemapUrls.length} sitemaps in index.`);

  // Fetch each individual sitemap
  for (const sitemapUrl of sitemapUrls) {
    const res = await fetch(sitemapUrl);
    if (!res.ok) {
      console.warn(`Skipping ${sitemapUrl} (HTTP ${res.status})`);
      continue;
    }
    const xml = await res.text();
    const pageUrls = extractUrlsFromXml(xml);
    urls.push(...pageUrls);
    console.log(`  ${sitemapUrl} → ${pageUrls.length} URLs`);
  }

  return urls;
}

// ── Submit to IndexNow ───────────────────────────────────────────────────────

async function submitBatch(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return res;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Collecting URLs from sitemap…');
  const allUrls = await collectUrls();
  console.log(`\nTotal URLs to submit: ${allUrls.length}`);

  // IndexNow accepts up to 10 000 URLs per request; batch to be safe
  const BATCH_SIZE = 1000;
  let submitted = 0;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    console.log(`\n📤 Submitting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} URLs)…`);
    const res = await submitBatch(batch);
    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`  ✅ HTTP ${res.status} — accepted`);
      submitted += batch.length;
    } else if (res.status === 422) {
      console.warn(`  ⚠️  HTTP 422 — some URLs may be invalid`);
    } else {
      console.error(`  ❌ HTTP ${res.status} — ${res.statusText}`);
    }
  }

  console.log(`\n✅ Done. ${submitted}/${allUrls.length} URLs submitted to IndexNow.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
