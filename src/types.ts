export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'failed';

export interface DownloadItem {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  totalBytes: number;
  progress: number; // 0 - 100
  status: DownloadStatus;
  speedKBps: number;
  timestamp: number;
  mimeType: string;
  localPath: string;
  blobUrl?: string;
  contentData?: string; // base64 or text for viewing/opening
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  timestamp: number;
}

export interface SavedPageItem {
  id: string;
  title: string;
  url: string;
  htmlContent: string;
  encodedHtml: string; // base64 / HTML encoded string
  timestamp: number;
  sizeBytes: number;
}

export interface BrowserSettings {
  downloadLocation: string;
  hasStoragePermission: boolean;
  isDefaultBrowser: boolean;
  searchEngine: string; // e.g. https://www.google.com/search?q=
  searchEngineName: string;
  userAgent: string;
  adBlocker: boolean;
  javaScript: boolean;
  cyberTheme: boolean;
}

export interface UserProfile {
  isSignedIn: boolean;
  name: string;
  email: string;
  avatar: string;
  syncBookmarks: boolean;
  syncDownloads: boolean;
  syncSavedPages: boolean;
}

export type ActiveDrawerTab = 'settings' | 'downloads' | 'bookmarks' | 'savepage' | 'user' | null;
