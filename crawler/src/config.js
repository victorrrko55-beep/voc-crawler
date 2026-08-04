// Central configuration for the SmartThings VOC Pain Point Radar pipeline.

export const CATEGORIES = [
  'Device Onboarding',
  'Connectivity & Reliability',
  'Automation & Routine',
  'UX/UI',
  'Multi-brand Integration',
  'Notification & Alert',
  'Performance',
  'AI / Voice',
  'Security & Privacy',
  'Ecosystem Management',
  'Energy Management',
];

export const APP_STORE_APP_ID = '1222822904'; // SmartThings - Apple App Store
export const APP_STORE_COUNTRIES = ['us', 'kr', 'gb'];

export const PLAY_STORE_APP_ID = 'com.samsung.android.oneconnect'; // SmartThings - Google Play
export const PLAY_STORE_LANGS = [
  { lang: 'en', country: 'us' },
  { lang: 'ko', country: 'kr' },
];

export const REDDIT_SUBREDDIT = 'smartthings';
export const REDDIT_USER_AGENT = 'web:smartthings-voc-radar:1.0 (by /u/voc-radar-bot)';

// Discourse-powered forums. `label` becomes the `source` field on collected items.
export const DISCOURSE_FORUMS = [
  {
    label: 'smartthings_community',
    baseUrl: 'https://community.smartthings.com',
    // Search terms are run against Discourse's /search.json endpoint since it
    // returns a text blurb + created_at without having to fetch every topic body.
    queries: [
      'app crash', 'won\'t connect', 'offline', 'routine not working',
      'notification', 'slow', 'Matter', 'automation failed', 'hub offline',
      'app update', 'battery', 'pairing failed',
    ],
  },
  {
    // Stands in for "기타 Smart Home 포럼" (other smart-home forums): Home
    // Assistant's community is also Discourse-based and frequently discusses
    // SmartThings integration pain points.
    label: 'other_forum_home_assistant',
    baseUrl: 'https://community.home-assistant.io',
    queries: ['smartthings'],
  },
];

// Sources that are known to be fragile (JS-rendered pages / anti-scraping
// measures) and are not verified to work reliably from a plain HTTP fetch.
// They are off by default; set ENABLE_EXPERIMENTAL_SOURCES=true to try them.
// If they break, `collect.js` swallows the error for that source only so the
// rest of the pipeline keeps working.
export const EXPERIMENTAL_SOURCES_ENABLED = process.env.ENABLE_EXPERIMENTAL_SOURCES === 'true';

export const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/www.smartthings.com';

export const SAMSUNG_COMMUNITY_SEARCH_URL =
  'https://community.samsung.com/t5/forums/searchpage/tab/message?q=smartthings%20app&collapse_discussion=true';

// Human-readable directory of every source the pipeline can pull from, used
// to render the "VOC 출처" section at the end of the report. `active`
// reflects whether the source runs by default (experimental ones only run
// when ENABLE_EXPERIMENTAL_SOURCES=true).
export const SOURCE_DIRECTORY = [
  {
    key: 'reddit',
    name: 'Reddit r/smartthings',
    url: `https://www.reddit.com/r/${REDDIT_SUBREDDIT}/`,
    active: true,
  },
  {
    key: 'smartthings_community',
    name: 'SmartThings Community',
    url: DISCOURSE_FORUMS[0].baseUrl,
    active: true,
  },
  {
    key: 'other_forum_home_assistant',
    name: 'Home Assistant Community (기타 스마트홈 포럼)',
    url: DISCOURSE_FORUMS[1].baseUrl,
    active: true,
  },
  {
    key: 'appstore',
    name: 'Apple App Store (SmartThings)',
    url: `https://apps.apple.com/us/app/id${APP_STORE_APP_ID}`,
    active: true,
  },
  {
    key: 'play',
    name: 'Google Play Store (SmartThings)',
    url: `https://play.google.com/store/apps/details?id=${PLAY_STORE_APP_ID}`,
    active: true,
  },
  {
    key: 'trustpilot',
    name: 'Trustpilot',
    url: TRUSTPILOT_URL,
    active: EXPERIMENTAL_SOURCES_ENABLED,
  },
  {
    key: 'samsung_community',
    name: 'Samsung Community',
    url: 'https://community.samsung.com',
    active: EXPERIMENTAL_SOURCES_ENABLED,
  },
];

// Categories always shown in their own report section regardless of Top 10
// rank, for topics the business wants visibility on even at low volume.
export const SPOTLIGHT_CATEGORIES = ['Energy Management'];

export const ANALYSIS_WINDOW_MONTHS = 12;
export const RECENT_WINDOW_MONTHS = 3;
export const RETENTION_MONTHS = 13; // how long raw items are kept in the store

export const DATA_STORE_PATH = new URL('../../data/voc-store.json', import.meta.url).pathname;
export const REPORTS_DIR = new URL('../../reports', import.meta.url).pathname;
