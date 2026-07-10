import { REDDIT_SUBREDDIT, REDDIT_USER_AGENT, ANALYSIS_WINDOW_MONTHS } from '../config.js';

// Reddit's read-only JSON listing endpoints (no OAuth needed for light,
// well-identified traffic). We paginate the subreddit's "new" listing until
// we fall outside the analysis window or hit Reddit's ~1000-item cap.
export async function fetchReddit() {
  const cutoff = Date.now() - ANALYSIS_WINDOW_MONTHS * 30 * 24 * 60 * 60 * 1000;
  const items = [];
  let after = null;
  let pages = 0;

  while (pages < 10) {
    const url = new URL(`https://www.reddit.com/r/${REDDIT_SUBREDDIT}/new.json`);
    url.searchParams.set('limit', '100');
    if (after) url.searchParams.set('after', after);

    const res = await fetch(url, { headers: { 'User-Agent': REDDIT_USER_AGENT } });
    if (!res.ok) {
      if (items.length === 0) throw new Error(`Reddit fetch failed: ${res.status}`);
      break;
    }
    const json = await res.json();
    const children = json?.data?.children || [];
    if (children.length === 0) break;

    let sawOld = false;
    for (const { data: post } of children) {
      const createdMs = post.created_utc * 1000;
      if (createdMs < cutoff) { sawOld = true; continue; }
      items.push({
        id: `reddit_${post.id}`,
        source: 'reddit',
        author: post.author || 'unknown',
        title: post.title || '',
        text: `${post.title || ''}\n${post.selftext || ''}`.trim().slice(0, 2000),
        url: `https://www.reddit.com${post.permalink}`,
        date: new Date(createdMs).toISOString(),
        upvotes: post.score ?? 0,
      });
    }

    after = json?.data?.after || null;
    pages += 1;
    if (!after || sawOld) break;
  }

  return items;
}
