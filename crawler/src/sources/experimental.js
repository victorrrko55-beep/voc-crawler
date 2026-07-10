import * as cheerio from 'cheerio';
import { TRUSTPILOT_URL, SAMSUNG_COMMUNITY_SEARCH_URL } from '../config.js';

// Trustpilot server-renders review listings with schema.org JSON-LD blocks
// embedded in <script type="application/ld+json">. This is best-effort: if
// Trustpilot changes markup or blocks the request, this returns [] and the
// rest of the pipeline is unaffected. Verify selectors periodically.
export async function fetchTrustpilot() {
  const items = [];
  for (let page = 1; page <= 5; page++) {
    let res;
    try {
      res = await fetch(`${TRUSTPILOT_URL}?page=${page}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; smartthings-voc-radar/1.0)' },
      });
    } catch (err) {
      break;
    }
    if (!res.ok) break;
    const html = await res.text();
    const $ = cheerio.load(html);

    let foundOnPage = 0;
    $('script[type="application/ld+json"]').each((_, el) => {
      let data;
      try {
        data = JSON.parse($(el).contents().text());
      } catch (err) {
        return;
      }
      const reviews = Array.isArray(data) ? data : [data];
      for (const entry of reviews) {
        if (entry?.['@type'] !== 'Review' || !entry?.reviewBody) continue;
        foundOnPage++;
        items.push({
          id: `trustpilot_${page}_${items.length}_${Date.now()}`,
          source: 'trustpilot',
          author: entry?.author?.name || 'unknown',
          title: entry?.headline || '',
          text: `${entry?.headline || ''}\n${entry.reviewBody}`.trim().slice(0, 2000),
          url: TRUSTPILOT_URL,
          date: entry?.datePublished ? new Date(entry.datePublished).toISOString() : new Date().toISOString(),
          rating: entry?.reviewRating?.ratingValue ? Number(entry.reviewRating.ratingValue) : null,
        });
      }
    });
    if (foundOnPage === 0) break;
  }
  return items;
}

// Samsung Community runs on a Khoros/Lithium (JS-rendered "t5") forum
// platform. A plain HTTP fetch often only returns the app shell, so this
// selector-based scrape is unverified and likely needs adjustment once run
// against the live site. Kept isolated so a broken selector can't crash the
// rest of the collection pipeline.
export async function fetchSamsungCommunity() {
  const items = [];
  let res;
  try {
    res = await fetch(SAMSUNG_COMMUNITY_SEARCH_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; smartthings-voc-radar/1.0)' },
    });
  } catch (err) {
    return items;
  }
  if (!res.ok) return items;

  const html = await res.text();
  const $ = cheerio.load(html);

  $('.message-subject, .MessageSubject').each((_, el) => {
    const $el = $(el);
    const title = $el.text().trim();
    const link = $el.is('a') ? $el.attr('href') : $el.find('a').attr('href');
    if (!title || !link) return;
    items.push({
      id: `samsung_community_${Buffer.from(link).toString('base64').slice(0, 24)}`,
      source: 'samsung_community',
      author: 'unknown',
      title,
      text: title,
      url: link.startsWith('http') ? link : `https://community.samsung.com${link}`,
      date: new Date().toISOString(), // list view rarely exposes a parseable date without JS rendering
    });
  });

  return items;
}
