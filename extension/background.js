// Service Worker - CORS 없이 직접 fetch
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'FETCH') {
    fetch(msg.url, { headers: msg.headers || {} })
      .then(r => r.text())
      .then(text => sendResponse({ ok: true, text }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true; // 비동기 응답 유지
  }
});
