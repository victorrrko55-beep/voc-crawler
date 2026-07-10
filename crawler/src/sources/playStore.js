import gplay from 'google-play-scraper';
import { PLAY_STORE_APP_ID, PLAY_STORE_LANGS, ANALYSIS_WINDOW_MONTHS } from '../config.js';

export async function fetchPlayStore() {
  const cutoff = Date.now() - ANALYSIS_WINDOW_MONTHS * 30 * 24 * 60 * 60 * 1000;
  const items = [];

  for (const { lang, country } of PLAY_STORE_LANGS) {
    let nextPaginationToken;
    for (let page = 0; page < 8; page++) {
      let result;
      try {
        result = await gplay.reviews({
          appId: PLAY_STORE_APP_ID,
          sort: gplay.sort.NEWEST,
          num: 150,
          lang,
          country,
          nextPaginationToken,
        });
      } catch (err) {
        break;
      }

      const reviews = result?.data || [];
      if (reviews.length === 0) break;

      let sawOld = false;
      for (const r of reviews) {
        const createdMs = new Date(r.date).getTime();
        if (createdMs < cutoff) { sawOld = true; continue; }
        items.push({
          id: `play_${lang}_${r.id}`,
          source: 'play',
          author: r.userName || 'unknown',
          title: '',
          text: (r.text || '').slice(0, 2000),
          url: `https://play.google.com/store/apps/details?id=${PLAY_STORE_APP_ID}`,
          date: new Date(createdMs).toISOString(),
          rating: r.score ?? null,
        });
      }

      nextPaginationToken = result?.nextPaginationToken;
      if (!nextPaginationToken || sawOld) break;
    }
  }

  return items;
}
