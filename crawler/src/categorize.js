import { CATEGORIES } from './config.js';

// Keyword weights per category. Matching is case-insensitive substring
// matching against the item's title+text. A match on a multi-word phrase is
// weighted higher than a single generic word to reduce false positives.
const CATEGORY_KEYWORDS = {
  'Device Onboarding': [
    ['add device', 3], ['adding device', 3], ['pairing', 3], ['pair a', 2],
    ['won\'t pair', 3], ['failed to add', 3], ['setup failed', 3],
    ['couldn\'t find device', 3], ['scanning for devices', 2], ['qr code', 2],
    ['onboarding', 3], ['hub setup', 2], ['initial setup', 2], ['can\'t add', 2],
    ['device not found', 3], ['stuck at 90', 2], ['stuck adding', 3],
  ],
  'Connectivity & Reliability': [
    ['offline', 3], ['disconnect', 3], ['keeps dropping', 3], ['unresponsive', 3],
    ['connection lost', 3], ['won\'t connect', 3], ['wifi drop', 3],
    ['zigbee', 1], ['z-wave', 1], ['reconnect', 2], ['shows offline', 3],
    ['unreliable', 2], ['drops connection', 3], ['loses connection', 3],
    ['stopped responding', 3], ['device unavailable', 2],
  ],
  'Automation & Routine': [
    ['routine', 2], ['automation', 2], ['smartapp', 2], ['scene', 1],
    ['didn\'t trigger', 3], ['not triggering', 3], ['routine failed', 3],
    ['automation stopped', 3], ['scheduled routine', 2], ['routine didn\'t run', 3],
    ['automations broke', 3], ['routines stopped working', 3],
  ],
  'UX/UI': [
    ['confusing ui', 3], ['redesign', 2], ['clunky', 2], ['hard to find', 2],
    ['navigation', 1], ['cluttered', 2], ['interface', 1], ['layout', 1],
    ['ui is bad', 3], ['ui/ux', 2], ['too many taps', 2], ['user interface', 2],
    ['unintuitive', 3], ['hard to navigate', 3],
  ],
  'Multi-brand Integration': [
    ['matter', 2], ['third-party device', 3], ['google home', 2], ['alexa', 2],
    ['ifttt', 2], ['doesn\'t work with', 2], ['incompatible', 3],
    ['not compatible', 3], ['homekit', 2], ['apple home', 2],
    ['third party integration', 3], ['works with other brands', 2],
    ['cross-brand', 2],
  ],
  'Notification & Alert': [
    ['no notification', 3], ['notifications delayed', 3], ['missed alert', 3],
    ['push notification', 2], ['alert not working', 3], ['notification lag', 3],
    ['doesn\'t notify', 3], ['silent notification', 2], ['late notification', 3],
  ],
  'Performance': [
    ['app crash', 3], ['crashes', 3], ['freezes', 3], ['freezing', 3],
    ['laggy', 2], ['slow to load', 3], ['battery drain', 3], ['high battery', 2],
    ['loading forever', 3], ['app is slow', 3], ['unresponsive app', 2],
    ['stuck loading', 3], ['takes forever', 2],
  ],
  'AI / Voice': [
    ['bixby', 3], ['voice assistant', 2], ['ai feature', 2], ['generative ai', 2],
    ['smartthings ai', 3], ['voice command', 2], ['ai hub', 2],
    ['ai suggestion', 2], ['smart ai', 1],
  ],
  'Security & Privacy': [
    ['permission', 2], ['privacy', 3], ['data collection', 3], ['hacked', 3],
    ['2fa', 2], ['two-factor', 2], ['account breach', 3], ['unauthorized access', 3],
    ['security concern', 3], ['personal data', 2], ['tracking', 1],
  ],
  'Ecosystem Management': [
    ['room assignment', 3], ['multiple hubs', 3], ['switch location', 3],
    ['shared access', 2], ['family sharing', 2], ['device grouping', 3],
    ['manage devices', 2], ['location switching', 3], ['organize devices', 3],
    ['too many devices', 2], ['device list', 1],
  ],
  'Energy Management': [
    ['energy usage', 3], ['energy monitoring', 3], ['energy mode', 3],
    ['ai energy', 3], ['power consumption', 3], ['energy tab', 3],
    ['energy report', 2], ['energy saving', 2], ['energy consumption', 3],
    ['smartthings energy', 3], ['electricity usage', 2], ['power usage', 2],
    ['kwh', 2], ['energy data', 2], ['energy dashboard', 3],
  ],
};

const PAIN_WORDS = [
  'bad', 'broken', "doesn't work", 'does not work', "won't", 'wont', 'cannot',
  "can't", 'cant', 'issue', 'problem', 'fail', 'failed', 'failing', 'crash',
  'annoying', 'disappointing', 'disappointed', 'worst', 'unable', 'stopped working',
  'glitch', 'bug', 'buggy', 'terrible', 'awful', 'useless', 'frustrat', 'horrible',
  'never works', 'garbage', 'unusable', 'poor', 'complain', 'sucks', 'hate it',
  'ridiculous', 'unacceptable',
];

const JOY_WORDS = [
  'great', 'love', 'excellent', 'amazing', 'perfect', 'awesome', 'fantastic',
  'works well', 'best app', 'highly recommend', 'smooth', 'reliable', 'happy',
];

export function categorize(text) {
  const t = (text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const category of CATEGORIES) {
    const rules = CATEGORY_KEYWORDS[category] || [];
    let score = 0;
    for (const [phrase, weight] of rules) {
      if (t.includes(phrase)) score += weight;
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return best || 'Uncategorized';
}

export function sentiment(text) {
  const t = (text || '').toLowerCase();
  let pain = 0;
  let joy = 0;
  for (const w of PAIN_WORDS) if (t.includes(w)) pain++;
  for (const w of JOY_WORDS) if (t.includes(w)) joy++;
  if (pain > joy) return 'negative';
  if (joy > pain) return 'positive';
  return 'neutral';
}

export function isPainSignal(text) {
  return sentiment(text) === 'negative';
}
