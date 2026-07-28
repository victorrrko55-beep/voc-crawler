// One-off maintenance script: re-applies the current categorize()/sentiment()
// logic to every item already in data/voc-store.json. Needed whenever the
// category taxonomy or keyword rules change, since collect.js only classifies
// newly-fetched items and otherwise preserves each item's existing category.
import fs from 'node:fs';
import { categorize, sentiment, isPainSignal } from './categorize.js';
import { DATA_STORE_PATH } from './config.js';

function main() {
  const items = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
  let changed = 0;

  const updated = items.map((item) => {
    const category = categorize(item.text);
    const sent = sentiment(item.text);
    const pain = isPainSignal(item.text);
    if (category !== item.category || sent !== item.sentiment || pain !== item.pain) changed++;
    return { ...item, category, sentiment: sent, pain };
  });

  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(updated, null, 2) + '\n');
  console.log(`[recategorize] ${changed} of ${items.length} item(s) changed category/sentiment/pain`);
}

main();
