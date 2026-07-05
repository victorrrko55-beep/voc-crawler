// ─── State ────────────────────────────────────────────────────────────────────
let allVOC = [], filtered = [], page = 1;
const PER_PAGE = 10;
let srcPlay = true, srcHN = true, srcAppStore = true;
let activeFilter = 'all', currentKeyword = '', sinceYear = 0;

// ─── background.js 통해 CORS 없이 fetch ──────────────────────────────────────
function bgFetch(url, headers = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'FETCH', url, headers }, res => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (res?.ok) resolve(res.text);
      else reject(new Error(res?.error || 'fetch failed'));
    });
  });
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function toggleSource(src) {
  if (src === 'play') {
    srcPlay = !srcPlay;
    document.getElementById('toggle-play').className = 'src-btn' + (srcPlay ? ' active-play' : '');
  } else if (src === 'hn') {
    srcHN = !srcHN;
    document.getElementById('toggle-hn').className = 'src-btn' + (srcHN ? ' active-hn' : '');
  } else if (src === 'appstore') {
    srcAppStore = !srcAppStore;
    document.getElementById('toggle-appstore').className = 'src-btn' + (srcAppStore ? ' active-appstore' : '');
  }
}

// ─── Main Search ──────────────────────────────────────────────────────────────
async function search() {
  currentKeyword = document.getElementById('keyword').value.trim();
  sinceYear = parseInt(document.getElementById('since-year').value) || 0;
  if (!currentKeyword) { alert('주제어를 입력해주세요.'); return; }
  if (!srcPlay && !srcHN && !srcAppStore) { alert('최소 하나의 소스를 선택해주세요.'); return; }

  setLoading(true);
  hide('content'); hide('error');
  allVOC = []; page = 1; activeFilter = 'all';
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));

  try {
    const promises = [];
    if (srcPlay)     promises.push(fetchPlayStore(currentKeyword));
    if (srcHN)       promises.push(fetchHN(currentKeyword));
    if (srcAppStore) promises.push(fetchAppStore(currentKeyword));

    const results = await Promise.allSettled(promises);
    results.forEach(r => { if (r.status === 'fulfilled') allVOC.push(...r.value); });

    if (sinceYear) {
      allVOC = allVOC.filter(v => {
        if (!v.date) return true;
        const year = parseInt(v.date.split('.')[0]);
        return !isNaN(year) ? year >= sinceYear : true;
      });
    }

    if (allVOC.length === 0) {
      showError('결과를 찾을 수 없습니다. 다른 키워드를 시도해보세요.');
      setLoading(false); return;
    }

    allVOC.sort((a, b) => b.score - a.score);
    applyFilter('all');
    renderSummary(); renderSentiment(); renderKeywords();
    show('content');
  } catch (e) {
    showError('오류: ' + e.message);
  }
  setLoading(false);
}

// ─── Hacker News ──────────────────────────────────────────────────────────────
async function fetchHN(kw) {
  setMsg('Hacker News 수집 중...');
  let numFilter = '';
  if (sinceYear) {
    const ts = Math.floor(new Date(sinceYear + '-01-01').getTime() / 1000);
    numFilter = `&numericFilters=created_at_i>${ts}`;
  }
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(kw)}&tags=story&hitsPerPage=50${numFilter}`;
  let data;
  try {
    const text = await bgFetch(url, { 'Accept': 'application/json' });
    data = JSON.parse(text);
  } catch (_) { return []; }

  const items = [];
  for (const h of (data.hits || [])) {
    const text = (h.story_text || h.title || '').replace(/<[^>]+>/g, '').slice(0, 600);
    items.push({
      id: h.objectID,
      source: 'hn',
      author: h.author || 'unknown',
      title: h.title || '',
      text: text || h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      date: h.created_at ? new Date(h.created_at).toLocaleDateString('ko-KR') : '',
      score: h.points || 0,
      sentiment: analyzeSentiment(text || h.title)
    });
  }
  return items;
}

// ─── App Store ────────────────────────────────────────────────────────────────
async function fetchAppStore(kw) {
  setMsg('App Store 수집 중...');
  const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(kw)}&entity=software&limit=5&country=kr`;
  let apps = [];
  try {
    const text = await bgFetch(searchUrl, { 'Accept': 'application/json' });
    const data = JSON.parse(text);
    apps = data.results || [];
  } catch (_) { return []; }

  const items = [];
  for (const app of apps.slice(0, 3)) {
    const appId = app.trackId;
    try {
      const rssUrl = `https://itunes.apple.com/kr/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`;
      const rText = await bgFetch(rssUrl, { 'Accept': 'application/json' });
      const rData = JSON.parse(rText);
      const entries = rData?.feed?.entry || [];
      for (const entry of entries.slice(1, 20)) {
        const text = entry?.content?.label || '';
        const title = entry?.title?.label || '';
        const author = entry?.author?.name?.label || 'unknown';
        const dateStr = entry?.updated?.label || '';
        const rating = parseInt(entry?.['im:rating']?.label || '3');
        if (!text || text.length < 5) continue;
        const date = dateStr ? new Date(dateStr).toLocaleDateString('ko-KR') : '';
        const year = dateStr ? new Date(dateStr).getFullYear() : 0;
        if (sinceYear && year && year < sinceYear) continue;
        items.push({
          id: Math.random().toString(36).slice(2),
          source: 'appstore',
          author,
          title: `${app.trackName} - ${title}`,
          text: text.slice(0, 600),
          url: app.trackViewUrl || `https://apps.apple.com/kr/app/id${appId}`,
          date,
          score: rating,
          sentiment: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral'
        });
      }
    } catch (_) {}

    if (items.length === 0) {
      items.push({
        id: String(appId),
        source: 'appstore',
        author: app.sellerName || 'App Store',
        title: app.trackName,
        text: (app.description || app.trackName || '').slice(0, 600),
        url: app.trackViewUrl || `https://apps.apple.com/kr/app/id${appId}`,
        date: new Date().toLocaleDateString('ko-KR'),
        score: Math.round((app.averageUserRating || 3) * 20),
        sentiment: (app.averageUserRating || 3) >= 4 ? 'positive' : (app.averageUserRating || 3) <= 2 ? 'negative' : 'neutral'
      });
    }
  }
  return items;
}

// ─── Play Store ───────────────────────────────────────────────────────────────
async function fetchPlayStore(kw) {
  setMsg('Play Store 수집 중...');
  let html = '';
  try {
    html = await bgFetch(
      'https://play.google.com/store/search?q=' + encodeURIComponent(kw) + '&c=apps&hl=ko&gl=KR',
      { 'Accept': 'text/html', 'Accept-Language': 'ko-KR,ko;q=0.9' }
    );
  } catch (_) { return []; }

  const appIdRegex = /\/store\/apps\/details\?id=([\w.]+)/g;
  const appIds = [...new Set([...html.matchAll(appIdRegex)].map(m => m[1]))].slice(0, 5);

  const items = [];
  for (const appId of appIds) {
    try {
      const reviews = await fetchPlayReviews(appId);
      items.push(...reviews);
    } catch (_) {}
  }

  if (items.length === 0 && appIds.length > 0) {
    for (const appId of appIds.slice(0, 3)) {
      items.push({
        id: appId, source: 'play',
        author: 'Play Store',
        title: '앱 검색 결과',
        text: `"${kw}" 관련 앱: ${appId}`,
        url: `https://play.google.com/store/apps/details?id=${appId}&hl=ko`,
        date: new Date().toLocaleDateString('ko-KR'),
        score: 0, sentiment: 'neutral'
      });
    }
  }
  return items;
}

async function fetchPlayReviews(appId) {
  const url = `https://play.google.com/store/apps/details?id=${appId}&showAllReviews=true&hl=ko`;
  let html = '';
  try { html = await bgFetch(url); } catch (_) { return []; }

  const items = [];
  const jsonMatch = html.match(/\[\[null,\[\[null,null,null,"([^"]{10,})".*?\]\]/g);
  if (jsonMatch) {
    for (const block of jsonMatch.slice(0, 20)) {
      const m = block.match(/"([^"]{20,500})"/);
      if (m) {
        const text = m[1].replace(/\\n/g, ' ').trim();
        if (text.length > 15) {
          items.push({
            id: Math.random().toString(36).slice(2), source: 'play',
            author: '플레이스토어 사용자',
            title: `${appId} 리뷰`, text,
            url: `https://play.google.com/store/apps/details?id=${appId}&hl=ko`,
            date: new Date().toLocaleDateString('ko-KR'),
            score: 1, sentiment: analyzeSentiment(text)
          });
        }
      }
    }
  }
  return items;
}

// ─── Sentiment ────────────────────────────────────────────────────────────────
const POS_KO = ['좋아','훌륭','최고','편리','빠르','유용','추천','만족','완벽','사랑','쉽','간편'];
const NEG_KO = ['나쁘','불편','느리','버그','오류','문제','최악','실망','삭제','충돌','끊김','불만','짜증'];
const POS_EN = ['great','love','excellent','amazing','perfect','good','awesome','fast','easy','helpful','best'];
const NEG_EN = ['bad','terrible','worst','bug','crash','slow','broken','useless','hate','awful','poor','error'];

function analyzeSentiment(text) {
  const t = text.toLowerCase();
  let pos = 0, neg = 0;
  [...POS_KO, ...POS_EN].forEach(w => { if (t.includes(w)) pos++; });
  [...NEG_KO, ...NEG_EN].forEach(w => { if (t.includes(w)) neg++; });
  return pos > neg ? 'positive' : neg > pos ? 'negative' : 'neutral';
}

// ─── Keywords ─────────────────────────────────────────────────────────────────
function extractKeywords(vocs) {
  const freq = {};
  const stop = new Set(['the','a','an','is','in','it','of','and','or','to','this','that','for','with','on','be','was','are','by','as','i','we','you','they','have','has','do','not','so','but','if','from','can','will','just','about','more','also','when','what','who','no','get','use','like','one','would','any','some','https','www','com','app','apps','store','play','google','이','그','저','의','가','은','는','을','를','에','에서','으로','로','와','과','또','도']);
  for (const v of vocs) {
    const words = (v.text + ' ' + (v.title || '')).toLowerCase().match(/[a-z가-힣]{2,}/g) || [];
    for (const w of words) { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; }
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderSummary() {
  const pos      = allVOC.filter(v => v.sentiment === 'positive').length;
  const neg      = allVOC.filter(v => v.sentiment === 'negative').length;
  const neu      = allVOC.filter(v => v.sentiment === 'neutral').length;
  const play     = allVOC.filter(v => v.source === 'play').length;
  const hn       = allVOC.filter(v => v.source === 'hn').length;
  const appstore = allVOC.filter(v => v.source === 'appstore').length;
  document.getElementById('summary-grid').innerHTML = `
    <div class="stat-card"><div class="num blue">${allVOC.length}</div><div class="lbl">총 VOC</div></div>
    <div class="stat-card"><div class="num green">${pos}</div><div class="lbl">긍정</div></div>
    <div class="stat-card"><div class="num red">${neg}</div><div class="lbl">부정</div></div>
    <div class="stat-card"><div class="num yellow">${neu}</div><div class="lbl">중립</div></div>
    <div class="stat-card"><div class="num" style="color:var(--play)">${play}</div><div class="lbl">Play Store</div></div>
    <div class="stat-card"><div class="num" style="color:var(--hn)">${hn}</div><div class="lbl">Hacker News</div></div>
    <div class="stat-card"><div class="num" style="color:var(--appstore)">${appstore}</div><div class="lbl">App Store</div></div>
  `;
}

function renderSentiment() {
  const total = allVOC.length || 1;
  const pos = allVOC.filter(v => v.sentiment === 'positive').length;
  const neg = allVOC.filter(v => v.sentiment === 'negative').length;
  const neu = total - pos - neg;
  const pP = (pos/total*100).toFixed(1), pN = (neu/total*100).toFixed(1), pNg = (neg/total*100).toFixed(1);
  document.getElementById('sent-bar').innerHTML = `
    <span class="bar-pos" style="width:${pP}%"></span>
    <span class="bar-neu" style="width:${pN}%"></span>
    <span class="bar-neg" style="width:${pNg}%"></span>`;
  document.getElementById('leg-pos').textContent = `긍정 ${pP}%`;
  document.getElementById('leg-neu').textContent = `중립 ${pN}%`;
  document.getElementById('leg-neg').textContent = `부정 ${pNg}%`;
}

function renderKeywords() {
  const kws = extractKeywords(allVOC);
  const max = kws[0]?.[1] || 1;
  document.getElementById('kw-cloud').innerHTML = kws.map(([w, c]) =>
    `<span class="kw-tag${c >= max * 0.5 ? ' hot' : ''}">${w} <small style="opacity:.6">${c}</small></span>`
  ).join('');
}

function applyFilter(f) {
  activeFilter = f;
  filtered = f === 'all' ? [...allVOC]
    : (f === 'play' || f === 'hn' || f === 'appstore') ? allVOC.filter(v => v.source === f)
    : allVOC.filter(v => v.sentiment === f);
  page = 1;
  renderPage();
}

function renderPage() {
  const total = filtered.length, totalPages = Math.ceil(total / PER_PAGE) || 1;
  const slice = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  if (!slice.length) {
    document.getElementById('voc-list').innerHTML = '<div class="empty">결과 없음</div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }
  document.getElementById('voc-list').innerHTML = slice.map(vocCard).join('');
  document.getElementById('pagination').innerHTML = `
    <button class="pg-btn" onclick="changePage(-1)" ${page<=1?'disabled':''}>◀</button>
    <span class="pg-info">${page}/${totalPages} (${total}건)</span>
    <button class="pg-btn" onclick="changePage(1)" ${page>=totalPages?'disabled':''}>▶</button>`;
}

function vocCard(v) {
  const srcB = v.source === 'play'
    ? '<span class="src-badge badge-play">▶ Play</span>'
    : v.source === 'hn'
    ? '<span class="src-badge badge-hn">● HN</span>'
    : '<span class="src-badge badge-appstore">🍎 App Store</span>';
  const sMap = { positive: ['sent-pos','긍정😊'], neutral: ['sent-neu','중립😐'], negative: ['sent-neg','부정😞'] };
  const [sc, sl] = sMap[v.sentiment] || ['sent-neu','중립'];
  const showTitle = (v.source === 'hn' || v.source === 'appstore') && v.title;
  return `<div class="voc-card">
    <div class="voc-meta">${srcB}<span class="sent-badge ${sc}">${sl}</span><span class="voc-author">@${esc(v.author)}</span><span class="voc-date">${v.date}</span></div>
    ${showTitle ? `<div class="voc-title">${esc(v.title.slice(0,70))}</div>` : ''}
    <div class="voc-text">${highlight(v.text)}</div>
    <a class="voc-link" href="${v.url}" target="_blank">🔗 원문 보기</a>
  </div>`;
}

function highlight(text) {
  const safe = esc(text);
  if (!currentKeyword) return safe;
  const parts = currentKeyword.split(/\s+/).filter(Boolean).map(p => p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  return safe.replace(new RegExp(`(${parts.join('|')})`, 'gi'), '<em>$1</em>');
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function changePage(d) { page += d; renderPage(); }
function filterTab(f, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active'); applyFilter(f);
}
function setLoading(on) {
  document.getElementById('loading').style.display = on ? 'block' : 'none';
  document.getElementById('btn').disabled = on;
}
function setMsg(m) { document.getElementById('loading-msg').textContent = m; }
function show(id) { document.getElementById(id).style.display = 'block'; }
function hide(id) { document.getElementById(id).style.display = 'none'; }
function showError(msg) { document.getElementById('error-msg').textContent = msg; show('error'); }

document.getElementById('keyword').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
document.getElementById('btn').addEventListener('click', search);
document.getElementById('toggle-play').addEventListener('click', () => toggleSource('play'));
document.getElementById('toggle-hn').addEventListener('click', () => toggleSource('hn'));
document.getElementById('toggle-appstore').addEventListener('click', () => toggleSource('appstore'));
document.getElementById('tabs').addEventListener('click', e => {
  const tab = e.target.closest('[data-filter]');
  if (tab) filterTab(tab.dataset.filter, tab);
});
