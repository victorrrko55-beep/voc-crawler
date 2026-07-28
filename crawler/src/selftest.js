// Pure-logic smoke test using synthetic fixture VOC data (no network calls).
// Run with `npm test`. Exits non-zero on assertion failure.
import assert from 'node:assert/strict';
import { categorize, sentiment, isPainSignal } from './categorize.js';
import { dedupe, uniqueById } from './dedupe.js';
import { analyze } from './analyze.js';
import { renderReport } from './report.js';
import { CATEGORIES } from './config.js';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// --- categorize.js ---
assert.equal(categorize('The app crashes every time I open a routine'), 'Performance');
assert.equal(categorize("My hub keeps going offline and won't reconnect"), 'Connectivity & Reliability');
assert.equal(categorize("I can't add device, pairing fails at setup"), 'Device Onboarding');
assert.equal(categorize('My routine didn\'t trigger this morning, automation failed'), 'Automation & Routine');
assert.equal(categorize('The UI is confusing and hard to navigate'), 'UX/UI');
assert.equal(categorize("This device is incompatible with Matter, doesn't work with Google Home"), 'Multi-brand Integration');
assert.equal(categorize('No notification when the door opens, notifications delayed'), 'Notification & Alert');
assert.equal(categorize('Bixby voice command never works, bad AI feature'), 'AI / Voice');
assert.equal(categorize('Worried about privacy, too many permission requests'), 'Security & Privacy');
assert.equal(categorize('Managing multiple hubs and room assignment is a nightmare'), 'Ecosystem Management');
assert.equal(categorize('Random unrelated text about nothing'), 'Uncategorized');
console.log('OK categorize()');

assert.equal(sentiment('This app is terrible and buggy'), 'negative');
assert.equal(sentiment('I love this app, works great'), 'positive');
assert.equal(isPainSignal('The app crashes constantly, so annoying'), true);
console.log('OK sentiment()/isPainSignal()');

// --- dedupe.js ---
const dupeItems = [
  { id: 'a', category: 'Performance', text: 'The app crashes on launch', date: daysAgo(5) },
  { id: 'b', category: 'Performance', text: 'The app crashes on launch', date: daysAgo(1) },
  { id: 'c', category: 'Performance', text: 'Totally different complaint about battery drain', date: daysAgo(2) },
];
const deduped = dedupe(dupeItems);
assert.equal(deduped.length, 2);
const merged = deduped.find((i) => i.text.includes('crashes'));
assert.equal(merged.occurrences, 2);
assert.equal(merged.date, dupeItems[1].date); // keeps most recent date
console.log('OK dedupe()');

assert.equal(uniqueById([{ id: 'x' }, { id: 'x' }, { id: 'y' }]).length, 2);
console.log('OK uniqueById()');

// --- analyze.js + report.js with synthetic fixture spanning 12 months ---
const now = new Date();
const fixture = [];
let idCounter = 0;
function push(category, text, monthsAgoN, painOverride = true) {
  const d = new Date(now);
  d.setMonth(d.getMonth() - monthsAgoN);
  fixture.push({
    id: `fixture_${idCounter++}`,
    source: 'reddit',
    author: 'tester',
    title: '',
    text,
    url: 'https://example.com',
    date: d.toISOString(),
    category,
    sentiment: painOverride ? 'negative' : 'positive',
    pain: painOverride,
  });
}

// Connectivity & Reliability: heavy recent volume -> should be #1 with strong growth
for (let i = 0; i < 2; i++) push('Connectivity & Reliability', 'Hub keeps going offline, terrible', 10);
for (let i = 0; i < 12; i++) push('Connectivity & Reliability', `Device disconnects randomly #${i}`, 1);

// Automation & Routine: steady across the year (no growth)
for (let i = 0; i < 9; i++) push('Automation & Routine', `Routine failed to trigger #${i}`, 6);
for (let i = 0; i < 3; i++) push('Automation & Routine', `Routine failed to trigger recent #${i}`, 1);

// Performance: declining (lots in prior period, fewer recently)
for (let i = 0; i < 10; i++) push('Performance', `App crashes a lot #${i}`, 7);
for (let i = 0; i < 1; i++) push('Performance', 'App crashes occasionally', 1);

// AI / Voice: brand new issue only in the last 2 months
for (let i = 0; i < 4; i++) push('AI / Voice', `Bixby voice command fails #${i}`, 1);

const analysis = analyze(fixture, now);

assert.ok(analysis.top10.length > 0, 'top10 should not be empty');
assert.equal(analysis.top10[0].category, 'Connectivity & Reliability', 'highest-volume category should rank #1');
assert.equal(analysis.top10[0].rank, 1);
assert.ok(analysis.top10[0].growth > 0, 'Connectivity & Reliability should show positive growth');

const aiRow = analysis.allRows.find((r) => r.category === 'AI / Voice');
assert.equal(aiRow.growthLabel, '신규', 'brand-new-issue category should be labelled 신규');

const perfRow = analysis.allRows.find((r) => r.category === 'Performance');
assert.ok(perfRow.growth < 0, 'Performance should show negative growth (declining)');
assert.ok(
  analysis.declining.some((r) => r.category === 'Performance'),
  'Performance should appear in declining section'
);
assert.ok(
  analysis.rising.some((r) => r.category === 'AI / Voice' || r.category === 'Connectivity & Reliability'),
  'rising section should include at least one growing category'
);

for (const cat of CATEGORIES) {
  assert.ok(
    analysis.allRows.find((r) => r.category === cat),
    `every category should have a row, missing ${cat}`
  );
}
console.log('OK analyze()');

const markdown = renderReport(analysis);
assert.ok(markdown.includes("# Victor's VoC Crawler"));
assert.ok(markdown.includes('## Top 10 Pain Points'));
assert.ok(markdown.includes('## 신규 증가 이슈'));
assert.ok(markdown.includes('## 감소 이슈'));
assert.ok(markdown.includes('## PM Insight'));
assert.ok(markdown.includes('## Executive Summary'));
assert.ok(markdown.includes('Connectivity & Reliability'));
console.log('OK renderReport()');

console.log('\nAll self-tests passed.');
