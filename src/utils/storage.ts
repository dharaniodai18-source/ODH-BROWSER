import {
  DEFAULT_BROWSER_SETTINGS,
  INITIAL_BOOKMARKS,
  INITIAL_DOWNLOADS,
  INITIAL_SAVED_PAGES,
  INITIAL_USER_PROFILE,
} from '../constants';
import { BookmarkItem, BrowserSettings, DownloadItem, SavedPageItem, UserProfile } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'odai_browser_settings',
  BOOKMARKS: 'odai_browser_bookmarks',
  DOWNLOADS: 'odai_browser_downloads',
  SAVED_PAGES: 'odai_browser_saved_pages',
  USER: 'odai_browser_user',
};

export function loadSettings(): BrowserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_BROWSER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_BROWSER_SETTINGS;
  } catch {
    return DEFAULT_BROWSER_SETTINGS;
  }
}

export function saveSettings(settings: BrowserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : INITIAL_BOOKMARKS;
  } catch {
    return INITIAL_BOOKMARKS;
  }
}

export function saveBookmarks(bookmarks: BookmarkItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (err) {
    console.error('Failed to save bookmarks:', err);
  }
}

export function loadDownloads(): DownloadItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    return raw ? JSON.parse(raw) : INITIAL_DOWNLOADS;
  } catch {
    return INITIAL_DOWNLOADS;
  }
}

export function saveDownloads(downloads: DownloadItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
  } catch (err) {
    console.error('Failed to save downloads:', err);
  }
}

export function loadSavedPages(): SavedPageItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PAGES);
    return raw ? JSON.parse(raw) : INITIAL_SAVED_PAGES;
  } catch {
    return INITIAL_SAVED_PAGES;
  }
}

export function saveSavedPages(pages: SavedPageItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_PAGES, JSON.stringify(pages));
  } catch (err) {
    console.error('Failed to save saved pages:', err);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? { ...INITIAL_USER_PROFILE, ...JSON.parse(raw) } : INITIAL_USER_PROFILE;
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}
