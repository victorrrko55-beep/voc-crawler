const CHURN_KEYWORDS = [
  'switching to', 'moving to', 'switched to', 'uninstall', 'canceled', 'cancelled',
  'leaving smartthings', 'giving up on', 'done with smartthings', 'refund',
  'no longer using', 'moved away from',
];

const COMPETITOR_KEYWORDS = [
  'home assistant', 'hubitat', 'apple home', 'homekit', 'google home',
  'aqara', 'homey', 'homeassistant',
];

function findQuotes(items, keywords, limit = 5) {
  const hits = [];
  for (const item of items) {
    const t = (item.text || '').toLowerCase();
    const matched = keywords.find((k) => t.includes(k));
    if (matched) {
      hits.push({ item, matched });
      if (hits.length >= limit) break;
    }
  }
  return hits;
}

// Builds the PM Insight + Executive Summary sections from already-ranked
// category rows and the raw pain-signal item pool.
export function buildInsights({ top10, allRows, painItemsRecent }) {
  const mostUrgent = top10[0];

  const churnHits = findQuotes(painItemsRecent, CHURN_KEYWORDS);
  const competitorHits = findQuotes(painItemsRecent, COMPETITOR_KEYWORDS);

  const nextReleasePriority = [...top10]
    .filter((r) => r.growth === null || r.growth > 0)
    .sort((a, b) => (b.growth ?? 999) - (a.growth ?? 999))
    .slice(0, 3);

  return {
    mostUrgent,
    churnHits,
    competitorHits,
    nextReleasePriority,
  };
}

export function buildExecutiveSummary({ top10, insights, totalPainItems }) {
  const lines = [];
  const top1 = top10[0];
  const top2 = top10[1];
  lines.push(
    `최근 12개월간 SmartThings 앱 관련 부정 VOC ${totalPainItems}건을 분석한 결과, ` +
      `가장 시급한 Pain Point는 "${top1?.category ?? 'N/A'}"이며 최근 3개월 발생 빈도가 ` +
      `${top1?.recentCount ?? 0}건(${top1?.growthLabel ?? '0%'})으로 나타났다.`
  );
  if (top2) {
    lines.push(
      `"${top2.category}" 역시 상위 Pain Point로, 사용자 경험 저하가 지속되고 있어 함께 우선 대응이 필요하다.`
    );
  }
  lines.push(
    insights.churnHits.length > 0
      ? `일부 사용자는 대체 솔루션으로의 이탈 의사를 직접 언급(${insights.churnHits.length}건)하여 이탈 위험 신호가 관측된다.`
      : '직접적인 이탈(전환) 언급은 아직 제한적이나, 상위 Pain Point의 누적 시 이탈 위험으로 이어질 수 있다.'
  );
  lines.push(
    insights.competitorHits.length > 0
      ? `Home Assistant, Apple Home 등 경쟁/대체 플랫폼 대비 열위가 언급된 VOC가 ${insights.competitorHits.length}건 확인되어 경쟁력 저하 신호로 관리가 필요하다.`
      : '경쟁 플랫폼 대비 열위를 직접 언급한 VOC는 제한적이나, 지속 모니터링이 필요하다.'
  );
  lines.push(
    `차기 릴리즈에서는 ${insights.nextReleasePriority.map((r) => r.category).join(', ') || '상위 Pain Point'} ` +
      '항목을 우선 검토 대상으로 제안한다.'
  );
  return lines;
}
