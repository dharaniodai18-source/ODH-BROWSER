import { BookmarkItem, BrowserSettings, DownloadItem, SavedPageItem, UserProfile } from './types';

export const BASE64_CENTER_ICON =
  'data:image/png;base64,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';

export const GOOGLE_ACCOUNT_ICON =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjBVBDIsxzyGwfNy6LQjCWmJ_ey-QCM-GXANVz03OLHA&s=10';

export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36';

export const DEFAULT_BROWSER_SETTINGS: BrowserSettings = {
  downloadLocation: '/storage/emulated/0/Download/OdaiDarkHacks',
  hasStoragePermission: true,
  isDefaultBrowser: true,
  searchEngine: 'https://www.google.com/search?q=',
  searchEngineName: 'www.google.com',
  userAgent: DEFAULT_USER_AGENT,
  adBlocker: true,
  javaScript: true,
  cyberTheme: true,
};

export const INITIAL_USER_PROFILE: UserProfile = {
  isSignedIn: false,
  name: 'Guest Hacker',
  email: 'dharaniodai18@gmail.com',
  avatar: GOOGLE_ACCOUNT_ICON,
  syncBookmarks: true,
  syncDownloads: true,
  syncSavedPages: true,
};

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-1',
    title: 'Google Search Engine',
    url: 'https://www.google.com',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'bm-2',
    title: 'GitHub - Open Source Development',
    url: 'https://github.com',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'bm-3',
    title: 'The Hacker News - Cyber Security',
    url: 'https://thehackernews.com',
    timestamp: Date.now() - 10800000,
  },
  {
    id: 'bm-4',
    title: 'Wikipedia - Free Encyclopedia',
    url: 'https://wikipedia.org',
    timestamp: Date.now() - 14400000,
  },
];

export const INITIAL_DOWNLOADS: DownloadItem[] = [
  {
    id: 'dl-apk-1',
    name: 'OdaiDarkHacks_v1.0.apk',
    url: 'https://odai.darkhacks/release/OdaiDarkHacks_v1.0.apk',
    sizeBytes: 15420000,
    totalBytes: 15420000,
    progress: 100,
    status: 'completed',
    speedKBps: 0,
    timestamp: Date.now() - 600000,
    mimeType: 'application/vnd.android.package-archive',
    localPath: '/storage/emulated/0/Download/OdaiDarkHacks/OdaiDarkHacks_v1.0.apk',
  },
  {
    id: 'dl-active-2',
    name: 'cyber_payload_toolkit.tar.gz',
    url: 'https://odai.darkhacks/tools/cyber_payload_toolkit.tar.gz',
    sizeBytes: 42300000,
    totalBytes: 85000000,
    progress: 49.7,
    status: 'downloading',
    speedKBps: 2840,
    timestamp: Date.now() - 30000,
    mimeType: 'application/gzip',
    localPath: '/storage/emulated/0/Download/OdaiDarkHacks/cyber_payload_toolkit.tar.gz',
  },
  {
    id: 'dl-doc-3',
    name: 'Android_Browser_Architecture.pdf',
    url: 'https://odai.darkhacks/docs/Android_Browser_Architecture.pdf',
    sizeBytes: 3120000,
    totalBytes: 3120000,
    progress: 100,
    status: 'completed',
    speedKBps: 0,
    timestamp: Date.now() - 86400000,
    mimeType: 'application/pdf',
    localPath: '/storage/emulated/0/Download/OdaiDarkHacks/Android_Browser_Architecture.pdf',
  },
];

export const INITIAL_SAVED_PAGES: SavedPageItem[] = [
  {
    id: 'sp-1',
    title: 'Google Homepage - Offline Snapshot',
    url: 'https://www.google.com',
    htmlContent: `<!DOCTYPE html><html><head><title>Google</title><style>body{background:#202124;color:#fff;font-family:sans-serif;text-align:center;padding:50px;}</style></head><body><h1>Google Offline Archive</h1><p>Saved by 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Browser</p></body></html>`,
    encodedHtml: 'PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHRpdGxlPkdvb2dsZTwvdGl0bGU+PC9oZWFkPjxib2R5PjxoMT5Hb29nbGUgT2ZmbGluZSBBcmNoaXZlPC9oMT48L2JvZHk+PC9odG1sPg==',
    timestamp: Date.now() - 1200000,
    sizeBytes: 14200,
  },
];
