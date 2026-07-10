function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^a-z0-9가-힣\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Exact-match dedupe on normalized text. Repost/duplicate VOC (e.g. the same
// review synced across regions, or a crossposted Reddit thread) collapse into
// a single item; `occurrences` tracks how many times it was seen.
export function dedupe(items) {
  const seen = new Map();
  for (const item of items) {
    const key = `${item.category}::${normalize(item.text)}`;
    if (!key.trim()) continue;
    const existing = seen.get(key);
    if (existing) {
      existing.occurrences += 1;
      if (new Date(item.date) > new Date(existing.date)) {
        existing.date = item.date;
      }
    } else {
      seen.set(key, { ...item, occurrences: 1 });
    }
  }
  return [...seen.values()];
}

export function uniqueById(items) {
  const seen = new Map();
  for (const item of items) {
    if (!seen.has(item.id)) seen.set(item.id, item);
  }
  return [...seen.values()];
}
