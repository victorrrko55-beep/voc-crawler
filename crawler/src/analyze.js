import fs from 'node:fs';
import path from 'node:path';
import {
  DATA_STORE_PATH, REPORTS_DIR, ANALYSIS_WINDOW_MONTHS,
  RECENT_WINDOW_MONTHS, CATEGORIES,
} from './config.js';
import { getRootCause } from './rootCause.js';
import { buildInsights, buildExecutiveSummary } from './insights.js';
import { renderReport } from './report.js';

function monthsAgo(n, from) {
  const d = new Date(from);
  d.setMonth(d.getMonth() - n);
  return d;
}

export function loadStore() {
  if (!fs.existsSync(DATA_STORE_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
}

export function analyze(items, now = new Date()) {
  const windowStart = monthsAgo(ANALYSIS_WINDOW_MONTHS, now);
  const recentStart = monthsAgo(RECENT_WINDOW_MONTHS, now);
  const sixMoStart = monthsAgo(6, now);
  const priorMonths = ANALYSIS_WINDOW_MONTHS - RECENT_WINDOW_MONTHS;

  const painItems = items.filter((i) => i.pain && i.category && i.category !== 'Uncategorized');
  const inWindow = painItems.filter((i) => {
    const d = new Date(i.date);
    return d >= windowStart && d <= now;
  });

  const byCategory = {};
  for (const cat of CATEGORIES) {
    byCategory[cat] = { all: [], recent: [], prior: [], last6mo: [], prev6mo: [] };
  }

  for (const item of inWindow) {
    const d = new Date(item.date);
    const bucket = byCategory[item.category];
    if (!bucket) continue;
    bucket.all.push(item);
    if (d >= recentStart) bucket.recent.push(item);
    else bucket.prior.push(item);
    if (d >= sixMoStart) bucket.last6mo.push(item);
    else bucket.prev6mo.push(item);
  }

  const rows = CATEGORIES.map((cat) => {
    const b = byCategory[cat];
    const recentCount = b.recent.length;
    const priorCount = b.prior.length;
    const recentRate = recentCount / RECENT_WINDOW_MONTHS;
    const priorRate = priorCount / priorMonths;

    let growth = 0;
    let growthLabel = '0%';
    if (priorRate === 0 && recentRate > 0) {
      growth = null;
      growthLabel = '신규';
    } else if (priorRate > 0) {
      growth = ((recentRate - priorRate) / priorRate) * 100;
      growthLabel = `${growth >= 0 ? '+' : ''}${growth.toFixed(0)}%`;
    }

    const sortedRecent = [...b.recent].sort((a, c) => new Date(c.date) - new Date(a.date));
    const sortedAll = [...b.all].sort((a, c) => new Date(c.date) - new Date(a.date));
    const representative = sortedRecent[0] || sortedAll[0] || null;

    return {
      category: cat,
      totalFrequency: b.all.length,
      recentCount,
      priorCount,
      growth,
      growthLabel,
      last6moCount: b.last6mo.length,
      prev6moCount: b.prev6mo.length,
      representative,
      ...getRootCause(cat),
    };
  });

  const ranked = [...rows]
    .filter((r) => r.totalFrequency > 0)
    .sort((a, b) => b.totalFrequency - a.totalFrequency || (b.growth ?? 999) - (a.growth ?? 999));
  const top10 = ranked.slice(0, 10).map((r, idx) => ({ ...r, rank: idx + 1 }));

  const rising = rows
    .filter((r) => r.last6moCount > 0 && r.last6moCount > r.prev6moCount)
    .sort((a, b) => (b.last6moCount - b.prev6moCount) - (a.last6moCount - a.prev6moCount));

  const declining = rows
    .filter((r) => r.prev6moCount > 0 && r.last6moCount < r.prev6moCount)
    .sort((a, b) => (a.last6moCount - a.prev6moCount) - (b.last6moCount - b.prev6moCount));

  const recentPainItems = inWindow.filter((i) => new Date(i.date) >= recentStart);
  const insights = buildInsights({ top10, allRows: rows, painItemsRecent: recentPainItems });
  const executiveSummary = buildExecutiveSummary({
    top10,
    insights,
    totalPainItems: inWindow.length,
  });

  return {
    generatedAt: now.toISOString(),
    windowStart: windowStart.toISOString(),
    recentStart: recentStart.toISOString(),
    totalPainItems: inWindow.length,
    totalRawItems: items.length,
    top10,
    rising,
    declining,
    allRows: rows,
    insights,
    executiveSummary,
  };
}

function main() {
  const items = loadStore();
  const now = new Date();
  const analysis = analyze(items, now);
  const markdown = renderReport(analysis);

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(path.join(REPORTS_DIR, 'archive'), { recursive: true });

  const dateStr = now.toISOString().slice(0, 10);
  fs.writeFileSync(path.join(REPORTS_DIR, 'latest.md'), markdown);
  fs.writeFileSync(path.join(REPORTS_DIR, 'archive', `${dateStr}.md`), markdown);
  fs.writeFileSync(
    path.join(REPORTS_DIR, 'latest.json'),
    JSON.stringify(analysis, null, 2) + '\n'
  );

  console.log(`[analyze] pain items in 12mo window: ${analysis.totalPainItems}`);
  console.log(`[analyze] top10 categories: ${analysis.top10.map((r) => r.category).join(', ') || '(none yet)'}`);
  console.log(`[analyze] report written to reports/latest.md and reports/archive/${dateStr}.md`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
