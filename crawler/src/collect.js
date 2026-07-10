import fs from 'node:fs';
import path from 'node:path';
import { fetchReddit } from './sources/reddit.js';
import { fetchDiscourseForum } from './sources/discourseForum.js';
import { fetchAppStore } from './sources/appStore.js';
import { fetchPlayStore } from './sources/playStore.js';
import { fetchTrustpilot, fetchSamsungCommunity } from './sources/experimental.js';
import { categorize, sentiment, isPainSignal } from './categorize.js';
import { dedupe, uniqueById } from './dedupe.js';
import {
  DISCOURSE_FORUMS, DATA_STORE_PATH, RETENTION_MONTHS,
  EXPERIMENTAL_SOURCES_ENABLED,
} from './config.js';

function loadStore() {
  if (!fs.existsSync(DATA_STORE_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
  } catch (err) {
    console.error('Failed to parse existing data store, starting fresh:', err.message);
    return [];
  }
}

function saveStore(items) {
  fs.mkdirSync(path.dirname(DATA_STORE_PATH), { recursive: true });
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(items, null, 2) + '\n');
}

async function collectFromSource(name, fn) {
  try {
    const items = await fn();
    console.log(`[collect] ${name}: ${items.length} item(s)`);
    return items;
  } catch (err) {
    console.error(`[collect] ${name} failed: ${err.message}`);
    return [];
  }
}

async function main() {
  const collectors = [
    ['reddit', fetchReddit],
    ...DISCOURSE_FORUMS.map((forum) => [forum.label, () => fetchDiscourseForum(forum)]),
    ['appstore', fetchAppStore],
    ['play', fetchPlayStore],
  ];

  if (EXPERIMENTAL_SOURCES_ENABLED) {
    collectors.push(['trustpilot', fetchTrustpilot]);
    collectors.push(['samsung_community', fetchSamsungCommunity]);
  }

  const results = await Promise.all(collectors.map(([name, fn]) => collectFromSource(name, fn)));
  const rawItems = results.flat();

  const classified = rawItems.map((item) => ({
    ...item,
    category: categorize(item.text),
    sentiment: sentiment(item.text),
    pain: isPainSignal(item.text),
  }));

  const existing = loadStore();
  const merged = uniqueById([...existing, ...classified]);
  const deduped = dedupe(merged);

  const cutoff = Date.now() - RETENTION_MONTHS * 30 * 24 * 60 * 60 * 1000;
  const retained = deduped.filter((item) => {
    const t = new Date(item.date).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });

  retained.sort((a, b) => new Date(b.date) - new Date(a.date));
  saveStore(retained);

  console.log(`[collect] new raw items: ${rawItems.length}`);
  console.log(`[collect] store size after merge/dedupe/retention: ${retained.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
