import { APP_STORE_APP_ID, APP_STORE_COUNTRIES } from '../config.js';

// Apple's public customer-reviews RSS feed (JSON flavor). No auth required.
// Returns roughly the most recent ~500 reviews per storefront/page combo.
export async function fetchAppStore() {
  const items = [];

  for (const country of APP_STORE_COUNTRIES) {
    for (let page = 1; page <= 10; page++) {
      const url = `https://itunes.apple.com/${country}/rss/customerreviews/id=${APP_STORE_APP_ID}/sortBy=mostRecent/page=${page}/json`;
      let res;
      try {
        res = await fetch(url);
      } catch (err) {
        break;
      }
      if (!res.ok) break;

      const json = await res.json();
      const entries = json?.feed?.entry;
      if (!Array.isArray(entries)) break; // page 1 without `entry` array = app info only, no reviews

      for (const entry of entries) {
        const id = entry?.id?.label;
        const text = entry?.content?.label;
        if (!id || !text) continue;
        items.push({
          id: `appstore_${country}_${id}`,
          source: 'appstore',
          author: entry?.author?.name?.label || 'unknown',
          title: entry?.title?.label || '',
          text: `${entry?.title?.label || ''}\n${text}`.trim().slice(0, 2000),
          url: `https://apps.apple.com/${country}/app/id${APP_STORE_APP_ID}`,
          date: new Date(entry?.updated?.label || Date.now()).toISOString(),
          rating: Number(entry?.['im:rating']?.label) || null,
        });
      }
    }
  }

  return items;
}
