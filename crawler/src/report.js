import { SOURCE_DIRECTORY } from './config.js';

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

function quoteBullet(h) {
  const text = h.item.text.slice(0, 160).replace(/\s+/g, ' ').trim();
  return `- "${text}${h.item.text.length > 160 ? '…' : ''}" — ${h.item.source}, ${fmtDate(h.item.date)} ([원문](${h.item.url}))`;
}

function renderUrgentSection(insights) {
  const { mostUrgent, second, urgentShare, urgentGapToSecond } = insights;
  if (!mostUrgent) return 'N/A';
  const shareLine = urgentShare != null ? `12개월 누적 ${mostUrgent.totalFrequency}건으로 전체 부정 VOC의 ${urgentShare}%를 차지` : `12개월 누적 ${mostUrgent.totalFrequency}건`;
  const gapLine = second
    ? `, 2위(${second.category}, 최근 3개월 ${second.recentCount}건)보다 ${urgentGapToSecond}건 더 많음`
    : '';
  return [
    `**${mostUrgent.category}** — 최근 3개월 ${mostUrgent.recentCount}건(${mostUrgent.growthLabel}), ${shareLine}${gapLine}.`,
    '',
    `Root Cause 추정: ${mostUrgent.rootCause}`,
  ].join('\n');
}

function renderChurnSection(insights) {
  const { churnHits, churnTopCategory } = insights;
  if (churnHits.length === 0) {
    return '직접적인 이탈(전환/삭제) 언급 VOC는 발견되지 않았습니다. 다만 상위 Pain Point가 누적될 경우 잠재적 이탈로 이어질 수 있어 지속 모니터링이 필요합니다.';
  }
  const catLine = churnTopCategory ? ` 주로 **${churnTopCategory}** 관련 맥락에서 언급됨.` : '';
  return [
    `대체 솔루션으로의 전환·삭제 의사를 직접 언급한 VOC ${churnHits.length}건 확인.` +
      ` 건수는 많지 않지만 자발적 이탈 의사 표현은 일반 불만보다 드물게 나타나는 강한 신호이므로 주시가 필요합니다.${catLine}`,
    '',
    ...churnHits.map(quoteBullet),
  ].join('\n');
}

function renderCompetitorSection(insights) {
  const { competitorHits, mentionedCompetitors, competitorTopCategory } = insights;
  if (competitorHits.length === 0) {
    return '경쟁/대체 플랫폼 대비 열위를 직접 언급한 VOC는 발견되지 않았습니다.';
  }
  const catLine = competitorTopCategory ? ` 주로 **${competitorTopCategory}** 카테고리에서 함께 언급됨.` : '';
  return [
    `${mentionedCompetitors.join(', ')} 등 경쟁/대체 플랫폼과 비교하며 SmartThings의 열위를 지적한 VOC ${competitorHits.length}건 확인.${catLine}`,
    '',
    ...competitorHits.map(quoteBullet),
  ].join('\n');
}

function renderNextReleaseSection(insights) {
  const { nextReleasePriority } = insights;
  if (nextReleasePriority.length === 0) return 'N/A';
  return [
    '증가율 기준 상위 카테고리를 차기 릴리즈 검토 우선순위로 제안합니다:',
    '',
    ...nextReleasePriority.map(
      (r, i) => `${i + 1}. **${r.category}** (${r.growthLabel}) — ${r.rootCause}`
    ),
  ].join('\n');
}

function renderPmInsight(analysis) {
  const { insights } = analysis;
  return [
    '### 가장 시급한 개선 과제',
    '',
    renderUrgentSection(insights),
    '',
    '### 사용자 이탈 위험 요소',
    '',
    renderChurnSection(insights),
    '',
    '### SmartThings 경쟁력 저하 요소',
    '',
    renderCompetitorSection(insights),
    '',
    '### 차기 릴리즈 우선 검토 항목',
    '',
    renderNextReleaseSection(insights),
  ].join('\n');
}

export function renderReport(analysis) {
  const { generatedAt, windowStart, recentStart, top10, rising, declining, executiveSummary, totalPainItems, totalRawItems } = analysis;

  const header = [
    "# Victor's VoC Crawler",
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
    '## VOC 출처',
    '',
    renderSourceDirectory(),
    '',
  ].join('\n');

  return header + '\n' + body;
}

function renderSourceDirectory() {
  return SOURCE_DIRECTORY.map(
    (s) => `- ${s.name} — [${s.url}](${s.url})${s.active ? '' : ' _(현재 비활성 소스)_'}`
  ).join('\n');
}
