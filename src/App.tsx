/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BrowserView } from './components/BrowserView';
import { SettingsModal } from './components/SettingsModal';
import { UserModal } from './components/UserModal';
import { ApkModal } from './components/ApkModal';
import {
  BookmarkItem,
  BrowserSettings,
  DownloadItem,
  SavedPageItem,
  UserProfile,
} from './types';
import {
  loadBookmarks,
  loadDownloads,
  loadSavedPages,
  loadSettings,
  loadUserProfile,
  saveBookmarks,
  saveDownloads,
  saveSavedPages,
  saveSettings,
  saveUserProfile,
} from './utils/storage';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'browser'>('home');
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.google.com');
  const [offlinePageToView, setOfflinePageToView] = useState<SavedPageItem | null>(null);

  // Modals & Drawers state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'settings' | 'downloads' | 'bookmarks' | 'savepage'>('settings');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // App Data states (with local storage persistence)
  const [settings, setSettings] = useState<BrowserSettings>(loadSettings);
  const [downloads, setDownloads] = useState<DownloadItem[]>(loadDownloads);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(loadBookmarks);
  const [savedPages, setSavedPages] = useState<SavedPageItem[]>(loadSavedPages);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);

  // Persist whenever state changes
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveDownloads(downloads);
  }, [downloads]);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveSavedPages(savedPages);
  }, [savedPages]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Active Downloads Progress Engine (Live Animation, Speeds, Progress, Completion)
  useEffect(() => {
    const activeTasks = downloads.filter((d) => d.status === 'downloading');
    if (activeTasks.length === 0) return;

    const interval = setInterval(() => {
      setDownloads((prevDownloads) =>
        prevDownloads.map((dl) => {
          if (dl.status !== 'downloading') return dl;

          // Increment progress smoothly
          const step = Math.random() * 2.5 + 0.8;
          const nextProgress = Math.min(100, dl.progress + step);
          const nextSize = Math.floor((nextProgress / 100) * dl.totalBytes);
          const isDone = nextProgress >= 100;

          return {
            ...dl,
            progress: nextProgress,
            sizeBytes: nextSize,
            status: isDone ? 'completed' : 'downloading',
            speedKBps: isDone ? 0 : Math.floor(Math.random() * 2200) + 1400,
          };
        })
      );
    }, 400);

    return () => clearInterval(interval);
  }, [downloads]);

  // Navigate to URL or Google Search
  const handleSearchOrNavigate = (queryOrUrl: string) => {
    let finalUrl = queryOrUrl.trim();
    if (
      !finalUrl.startsWith('http://') &&
      !finalUrl.startsWith('https://') &&
      !finalUrl.startsWith('darkhacks://')
    ) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = `https://${finalUrl}`;
      } else {
        finalUrl = `${settings.searchEngine}${encodeURIComponent(finalUrl)}`;
      }
    }
    setOfflinePageToView(null);
    setCurrentUrl(finalUrl);
    setCurrentView('browser');
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setOfflinePageToView(null);
  };

  // Open Settings with a specific tab
  const handleOpenSettingsTab = (tab?: 'settings' | 'downloads' | 'bookmarks' | 'savepage') => {
    if (tab) setSettingsActiveTab(tab);
    setIsSettingsOpen(true);
  };

  // Add / Remove Bookmark
  const handleAddBookmark = (newBm: Omit<BookmarkItem, 'id' | 'timestamp'>) => {
    const existingIndex = bookmarks.findIndex((b) => b.url === newBm.url);
    if (existingIndex >= 0) {
      // Toggle off if already present
      setBookmarks(bookmarks.filter((_, idx) => idx !== existingIndex));
    } else {
      const item: BookmarkItem = {
        ...newBm,
        id: `bm-${Date.now()}`,
        timestamp: Date.now(),
      };
      setBookmarks([item, ...bookmarks]);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  // Save Page (Entire page in HTML encode)
  const handleSavePage = (newPage: Omit<SavedPageItem, 'id' | 'timestamp'>) => {
    const item: SavedPageItem = {
      ...newPage,
      id: `sp-${Date.now()}`,
      timestamp: Date.now(),
    };
    setSavedPages([item, ...savedPages]);
  };

  const handleDeleteSavedPage = (id: string) => {
    setSavedPages(savedPages.filter((p) => p.id !== id));
  };

  const handleViewSavedPage = (page: SavedPageItem) => {
    setOfflinePageToView(page);
    setCurrentUrl(page.url);
    setCurrentView('browser');
  };

  // Trigger a new Download task
  const handleTriggerDownload = (filename: string, url: string, size: number = 18500000) => {
    const newTask: DownloadItem = {
      id: `dl-${Date.now()}`,
      name: filename,
      url: url,
      sizeBytes: 0,
      totalBytes: size,
      progress: 0,
      status: 'downloading',
      speedKBps: 2400,
      timestamp: Date.now(),
      mimeType: filename.endsWith('.apk')
        ? 'application/vnd.android.package-archive'
        : filename.endsWith('.html')
        ? 'text/html'
        : 'application/octet-stream',
      localPath: `${settings.downloadLocation}/${filename}`,
    };

    setDownloads([newTask, ...downloads]);
    setSettingsActiveTab('downloads');
    setIsSettingsOpen(true);
  };

  const isCurrentUrlBookmarked = bookmarks.some((b) => b.url === currentUrl);

  return (
    <div className="min-h-screen bg-[#07090f] text-gray-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Bar */}
      <Header
        onOpenSettings={handleOpenSettingsTab}
        onOpenUser={() => setIsUserModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        userProfile={userProfile}
        currentView={currentView}
        onNavigateHome={handleGoHome}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' ? (
          <HomeView
            onSearchOrNavigate={handleSearchOrNavigate}
            settings={settings}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenSettings={handleOpenSettingsTab}
          />
        ) : (
          <BrowserView
            currentUrl={currentUrl}
            onNavigate={(url) => {
              setOfflinePageToView(null);
              setCurrentUrl(url);
            }}
            onGoHome={handleGoHome}
            onAddBookmark={handleAddBookmark}
            onSavePage={handleSavePage}
            isBookmarked={isCurrentUrlBookmarked}
            onTriggerDownload={handleTriggerDownload}
            settings={settings}
            offlinePageContent={offlinePageToView}
          />
        )}
      </main>

      {/* Settings Modal (1. Browser Sets, 2. DownLoads, 3. BookMarks, 4. SavePage) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeTab={settingsActiveTab}
        setActiveTab={setSettingsActiveTab}
        settings={settings}
        onUpdateSettings={setSettings}
        downloads={downloads}
        onUpdateDownloads={setDownloads}
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
        onNavigateToUrl={(url) => {
          handleSearchOrNavigate(url);
          setIsSettingsOpen(false);
        }}
        savedPages={savedPages}
        onDeleteSavedPage={handleDeleteSavedPage}
        onViewSavedPage={handleViewSavedPage}
        onTriggerDownload={handleTriggerDownload}
      />

      {/* User Modal (Sign In With Google Account) */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      {/* APK Generator / Download Modal */}
      <ApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
