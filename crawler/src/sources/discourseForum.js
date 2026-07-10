// Generic collector for Discourse-powered forums (SmartThings Community,
// Home Assistant Community, ...). Discourse's /search.json endpoint returns a
// text `blurb` plus `created_at` per matching post without needing to fetch
// every topic body individually.
export async function fetchDiscourseForum({ label, baseUrl, queries }) {
  const items = [];
  const seenPostIds = new Set();

  for (const query of queries) {
    const url = new URL('/search.json', baseUrl);
    url.searchParams.set('q', `${query} order:latest`);

    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': 'smartthings-voc-radar/1.0' } });
    } catch (err) {
      continue; // network hiccup on one query shouldn't kill the whole forum
    }
    if (!res.ok) continue;

    const json = await res.json();
    const posts = json?.posts || [];
    const topicsById = new Map((json?.topics || []).map((t) => [t.id, t]));

    for (const post of posts) {
      if (seenPostIds.has(post.id)) continue;
      seenPostIds.add(post.id);
      const topic = topicsById.get(post.topic_id);
      const title = topic?.title || post.blurb?.slice(0, 80) || '';
      const slug = topic?.slug || 'topic';
      items.push({
        id: `${label}_${post.id}`,
        source: label,
        author: post.username || 'unknown',
        title,
        text: `${title}\n${post.blurb || ''}`.trim().slice(0, 2000),
        url: `${baseUrl}/t/${slug}/${post.topic_id}/${post.post_number || ''}`,
        date: post.created_at,
      });
    }
  }

  return items;
}
