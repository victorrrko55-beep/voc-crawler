// ─── State ────────────────────────────────────────────────────────────────────
let allVOC = [], filtered = [], page = 1;
const PER_PAGE = 10;
let srcPlay = true, srcReddit = true;
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
  } else {
    srcReddit = !srcReddit;
    document.getElementById('toggle-reddit').className = 'src-btn' + (srcReddit ? ' active-reddit' : '');
  }
}

// ─── Main Search ──────────────────────────────────────────────────────────────
async function search() {
  currentKeyword = document.getElementById('keyword').value.trim();
  sinceYear = parseInt(document.getElementById('since-year').value) || 0;
  if (!currentKeyword) { alert('주제어를 입력해주세요.'); return; }
  if (!srcPlay && !srcReddit) { alert('최소 하나의 소스를 선택해주세요.'); return; }

  setLoading(true);
  hide('content'); hide('error');
  allVOC = []; page = 1; activeFilter = 'all';
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));

  try {
    const promises = [];
    if (srcReddit) promises.push(fetchReddit(currentKeyword));
    if (srcPlay)   promises.push(fetchPlayStore(currentKeyword));

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

// ─── Reddit ───────────────────────────────────────────────────────────────────
async function fetchReddit(kw) {
  setMsg('Reddit 수집 중...');
  const tParam = sinceYear ? (new Date().getFullYear() - sinceYear <= 1 ? '&t=year' : '&t=all') : '';
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(kw)}&sort=relevance&limit=100&type=link${tParam}`;
  const text = await bgFetch(url, { 'Accept': 'application/json' });
  const data = JSON.parse(text);
  const posts = data?.data?.children || [];
  const items = [];

  for (const p of posts) {
    const d = p.data;
    const text = (d.selftext || d.title || '').slice(0, 600);
    items.push({
      id: d.id, source: 'reddit',
      author: d.author || 'unknown',
      title: d.title,
      text: text || d.title,
      url: 'https://www.reddit.com' + d.permalink,
      subreddit: d.subreddit_name_prefixed || '',
      date: d.created_utc ? new Date(d.created_utc * 1000).toLocaleDateString('ko-KR') : '',
      score: d.score || 0,
      sentiment: analyzeSentiment(text)
    });
  }

  // 상위 게시글 댓글 수집
  if (posts.length > 0) {
    try {
      const top = posts[0].data;
      const commText = await bgFetch(`https://www.reddit.com${top.permalink}.json?limit=30`);
      const commData = JSON.parse(commText);
      const comments = commData?.[1]?.data?.children || [];
      for (const c of comments) {
        const cd = c.data;
        if (!cd.body || cd.body === '[deleted]') continue;
        const t = cd.body.slice(0, 500);
        items.push({
          id: cd.id, source: 'reddit',
          author: cd.author || 'unknown',
          title: '💬 ' + top.title,
          text: t,
          url: 'https://www.reddit.com' + top.permalink,
          subreddit: top.subreddit_name_prefixed || '',
          date: cd.created_utc ? new Date(cd.created_utc * 1000).toLocaleDateString('ko-KR') : '',
          score: cd.score || 0,
          sentiment: analyzeSentiment(t)
        });
      }
    } catch (_) {}
  }
  return items;
}

// ─── Play Store ───────────────────────────────────────────────────────────────
async function fetchPlayStore(kw) {
  setMsg('Play Store 수집 중...');
  let html = '';
  try {
    const text = await bgFetch(
      'https://play.google.com/store/search?q=' + encodeURIComponent(kw) + '&c=apps&hl=ko&gl=KR',
      { 'Accept': 'text/html', 'Accept-Language': 'ko-KR,ko;q=0.9' }
    );
    html = text;
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
  const stop = new Set(['the','a','an','is','in','it','of','and','or','to','this','that','for','with','on','be','was','are','by','as','i','we','you','they','have','has','do','not','so','but','if','from','can','will','just','about','more','also','when','what','who','no','get','use','like','one','would','any','some','https','www','com','app','apps','store','play','reddit','google','이','그','저','의','가','은','는','을','를','에','에서','으로','로','와','과','또','도']);
  for (const v of vocs) {
    const words = (v.text + ' ' + (v.title || '')).toLowerCase().match(/[a-z가-힣]{2,}/g) || [];
    for (const w of words) { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; }
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderSummary() {
  const pos  = allVOC.filter(v => v.sentiment === 'positive').length;
  const neg  = allVOC.filter(v => v.sentiment === 'negative').length;
  const neu  = allVOC.filter(v => v.sentiment === 'neutral').length;
  const play = allVOC.filter(v => v.source === 'play').length;
  const red  = allVOC.filter(v => v.source === 'reddit').length;
  document.getElementById('summary-grid').innerHTML = `
    <div class="stat-card"><div class="num blue">${allVOC.length}</div><div class="lbl">총 VOC</div></div>
    <div class="stat-card"><div class="num green">${pos}</div><div class="lbl">긍정</div></div>
    <div class="stat-card"><div class="num red">${neg}</div><div class="lbl">부정</div></div>
    <div class="stat-card"><div class="num yellow">${neu}</div><div class="lbl">중립</div></div>
    <div class="stat-card"><div class="num" style="color:var(--play)">${play}</div><div class="lbl">Play Store</div></div>
    <div class="stat-card"><div class="num" style="color:var(--reddit)">${red}</div><div class="lbl">Reddit</div></div>
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
    : (f === 'play' || f === 'reddit') ? allVOC.filter(v => v.source === f)
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
    : '<span class="src-badge badge-reddit">● Reddit</span>';
  const sMap = { positive: ['sent-pos','긍정😊'], neutral: ['sent-neu','중립😐'], negative: ['sent-neg','부정😞'] };
  const [sc, sl] = sMap[v.sentiment] || ['sent-neu','중립'];
  const sub = v.subreddit ? `<span style="color:var(--reddit);font-size:10px">${v.subreddit}</span>` : '';
  return `<div class="voc-card">
    <div class="voc-meta">${srcB}<span class="sent-badge ${sc}">${sl}</span><span class="voc-author">@${esc(v.author)}</span>${sub}<span class="voc-date">${v.date}</span></div>
    ${v.title && v.source==='reddit' ? `<div class="voc-title">${esc(v.title.slice(0,70))}</div>` : ''}
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
