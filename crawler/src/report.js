function fmtDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toISOString().slice(0, 10);
}

function quote(item) {
  if (!item) return '(대표 VOC 없음)';
  const text = (item.text || '').replace(/\s+/g, ' ').trim().slice(0, 220);
  return `"${text}${item.text && item.text.length > 220 ? '…' : ''}" — ${item.source}, ${fmtDate(item.date)} ([원문](${item.url}))`;
}

function renderTop10Item(row) {
  return [
    `### ${row.rank}. ${row.category}`,
    '',
    `- 순위: ${row.rank}`,
    `- 카테고리: ${row.category}`,
    `- 발생 빈도: ${row.totalFrequency}건 (최근 3개월 ${row.recentCount}건 / 이전 9개월 ${row.priorCount}건)`,
    `- 증가율: ${row.growthLabel}`,
    `- 대표 VOC: ${quote(row.representative)}`,
    `- Pain Point 요약: ${summarize(row)}`,
    `- Root Cause 추정: ${row.rootCause}`,
    `- 개선 아이디어: ${row.improvementIdea}`,
    '',
  ].join('\n');
}

function summarize(row) {
  const trend =
    row.growth === null
      ? '최근 3개월 내 새롭게 부각된 이슈로,'
      : row.growth > 0
      ? `최근 3개월 발생 빈도가 이전 대비 ${row.growthLabel} 증가하며,`
      : `발생 빈도는 ${row.growthLabel}로 완만한 추세를 보이나,`;
  return `${trend} '${row.category}' 관련 부정 VOC가 총 ${row.totalFrequency}건 누적되어 상위 Pain Point로 식별됨.`;
}

function renderRisingSection(rising) {
  if (rising.length === 0) return '최근 6개월간 뚜렷한 증가 추세를 보이는 카테고리가 확인되지 않았습니다.';
  return rising
    .slice(0, 8)
    .map(
      (r) =>
        `- **${r.category}**: 최근 6개월 ${r.last6moCount}건 vs 이전 6개월 ${r.prev6moCount}건 (${r.growthLabel})`
    )
    .join('\n');
}

function renderDecliningSection(declining) {
  if (declining.length === 0) return '최근 6개월간 뚜렷한 감소 추세를 보이는 카테고리가 확인되지 않았습니다.';
  return declining
    .slice(0, 8)
    .map(
      (r) =>
        `- **${r.category}**: 최근 6개월 ${r.last6moCount}건 vs 이전 6개월 ${r.prev6moCount}건 (${r.growthLabel})`
    )
    .join('\n');
}

function renderPmInsight(analysis) {
  const { insights, top10 } = analysis;
  const churnLine =
    insights.churnHits.length > 0
      ? insights.churnHits
          .slice(0, 3)
          .map((h) => `"${h.item.text.slice(0, 140).replace(/\s+/g, ' ')}…" (${h.item.source}, ${fmtDate(h.item.date)})`)
          .join('; ')
      : '직접적인 이탈 언급 VOC는 제한적 (지속 모니터링 필요)';
  const competitorLine =
    insights.competitorHits.length > 0
      ? insights.competitorHits
          .slice(0, 3)
          .map((h) => `"${h.item.text.slice(0, 140).replace(/\s+/g, ' ')}…" (${h.item.source}, ${fmtDate(h.item.date)})`)
          .join('; ')
      : '경쟁 플랫폼 대비 열위를 직접 언급한 VOC는 제한적 (지속 모니터링 필요)';

  return [
    `- **가장 시급한 개선 과제**: ${insights.mostUrgent ? `${insights.mostUrgent.category} (최근 3개월 ${insights.mostUrgent.recentCount}건, ${insights.mostUrgent.growthLabel})` : 'N/A'}`,
    `- **사용자 이탈 위험 요소**: ${churnLine}`,
    `- **SmartThings 경쟁력 저하 요소**: ${competitorLine}`,
    `- **차기 릴리즈 우선 검토 항목**: ${top10.slice(0, 3).map((r) => r.category).join(', ') || 'N/A'}`,
  ].join('\n');
}

export function renderReport(analysis) {
  const { generatedAt, windowStart, recentStart, top10, rising, declining, executiveSummary, totalPainItems, totalRawItems } = analysis;

  const header = [
    '# SmartThings Pain Point Radar',
    '',
    `- 생성 시각: ${generatedAt}`,
    `- 분석 기간: ${fmtDate(windowStart)} ~ ${fmtDate(generatedAt)} (최근 12개월)`,
    `- 최근 구간: ${fmtDate(recentStart)} ~ ${fmtDate(generatedAt)} (최근 3개월) vs 이전 9개월`,
    `- 분석 대상 부정 VOC: ${totalPainItems}건 (전체 수집 VOC ${totalRawItems}건 중)`,
    '',
  ].join('\n');

  const top10Section =
    top10.length > 0
      ? top10.map(renderTop10Item).join('\n')
      : '_아직 충분한 VOC 데이터가 수집되지 않았습니다. `npm run collect`를 실행해 데이터를 먼저 수집하세요._\n';

  const body = [
    '## Top 10 Pain Points',
    '',
    top10Section,
    '## 신규 증가 이슈',
    '',
    '최근 6개월간 증가한 VOC:',
    '',
    renderRisingSection(rising),
    '',
    '## 감소 이슈',
    '',
    '최근 감소한 VOC:',
    '',
    renderDecliningSection(declining),
    '',
    '## PM Insight',
    '',
    renderPmInsight(analysis),
    '',
    '## Executive Summary',
    '',
    executiveSummary.map((l) => `- ${l}`).join('\n'),
    '',
  ].join('\n');

  return header + '\n' + body;
}
