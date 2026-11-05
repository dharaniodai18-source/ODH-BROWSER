import React, { useState } from 'react';
import {
  X,
  Globe,
  Download,
  FolderOpen,
  CheckCircle,
  Play,
  Pause,
  Plus,
  ExternalLink,
  ShieldCheck,
  Search,
  Eye,
  Copy,
  Check,
  FileCode,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { BookmarkItem, BrowserSettings, DownloadItem, SavedPageItem } from '../types';
import { ThreeDotsMenu } from './ThreeDotsMenu';
import { generateAndDownloadApk } from '../utils/apkGenerator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'settings' | 'downloads' | 'bookmarks' | 'savepage';
  setActiveTab: (tab: 'settings' | 'downloads' | 'bookmarks' | 'savepage') => void;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: BrowserSettings) => void;
  downloads: DownloadItem[];
  onUpdateDownloads: (downloads: DownloadItem[]) => void;
  bookmarks: BookmarkItem[];
  onDeleteBookmark: (id: string) => void;
  onNavigateToUrl: (url: string) => void;
  savedPages: SavedPageItem[];
  onDeleteSavedPage: (id: string) => void;
  onViewSavedPage: (page: SavedPageItem) => void;
  onTriggerDownload: (filename: string, url: string, size: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  downloads,
  onUpdateDownloads,
  bookmarks,
  onDeleteBookmark,
  onNavigateToUrl,
  savedPages,
  onDeleteSavedPage,
  onViewSavedPage,
  onTriggerDownload,
}) => {
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [previewEncodedPage, setPreviewEncodedPage] = useState<SavedPageItem | null>(null);
  const [copiedEncode, setCopiedEncode] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [showAddDownload, setShowAddDownload] = useState(false);
  const [openWithItem, setOpenWithItem] = useState<DownloadItem | null>(null);

  if (!isOpen) return null;

  // Handle phone local files permission for Download location
  const handleRequestDownloadLocation = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // @ts-expect-error - Web File System Access API
        const dirHandle = await window.showDirectoryPicker();
        const newPath = `/storage/emulated/0/Download/${dirHandle.name}`;
        onUpdateSettings({
          ...settings,
          downloadLocation: newPath,
          hasStoragePermission: true,
        });
        setPermissionMessage(`Folder selected: ${newPath}. Phone storage access granted!`);
      } else {
        const customPath = prompt(
          'Enter preferred Android phone storage folder:',
          settings.downloadLocation
        );
        if (customPath) {
          onUpdateSettings({
            ...settings,
            downloadLocation: customPath,
            hasStoragePermission: true,
          });
          setPermissionMessage(`Download location set to ${customPath}. Storage permission granted!`);
        }
      }
    } catch (err) {
      console.log('Directory selection was cancelled or not supported', err);
      setPermissionMessage('Phone permission dialog dismissed. Using default secure download directory.');
    }
    setTimeout(() => setPermissionMessage(null), 4000);
  };

  // Handle Set as default browser permission
  const handleToggleDefaultBrowser = () => {
    const newState = !settings.isDefaultBrowser;
    onUpdateSettings({
      ...settings,
      isDefaultBrowser: newState,
    });
    if (newState) {
      setPermissionMessage(
        'Phone system permission intent invoked: 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 registered as default browser for HTTP/HTTPS/darkhacks protocols!'
      );
    } else {
      setPermissionMessage('Default browser assignment reset to system picker.');
    }
    setTimeout(() => setPermissionMessage(null), 4500);
  };

  // Toggle download pause / resume
  const handleTogglePause = (id: string) => {
    const updated = downloads.map((dl) => {
      if (dl.id === id) {
        const nextStatus = dl.status === 'downloading' ? 'paused' : 'downloading';
        return {
          ...dl,
          status: nextStatus as 'downloading' | 'paused',
          speedKBps: nextStatus === 'downloading' ? Math.floor(Math.random() * 2500) + 1200 : 0,
        };
      }
      return dl;
    });
    onUpdateDownloads(updated);
  };

  // Delete download
  const handleDeleteDownload = (id: string) => {
    const updated = downloads.filter((dl) => dl.id !== id);
    onUpdateDownloads(updated);
  };

  // Share download
  const handleShareDownload = async (item: DownloadItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Downloaded file via 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Browser: ${item.name}`,
          url: item.url,
        });
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(item.url || item.name);
      setPermissionMessage(`Copied download link for "${item.name}" to clipboard!`);
      setTimeout(() => setPermissionMessage(null), 3500);
    }
  };

  // Rename download
  const handleRenameDownload = (item: DownloadItem) => {
    setEditingDownload(item);
    setRenameValue(item.name);
  };

  const handleSaveRename = () => {
    if (!editingDownload || !renameValue.trim()) return;
    const updated = downloads.map((dl) =>
      dl.id === editingDownload.id ? { ...dl, name: renameValue.trim() } : dl
    );
    onUpdateDownloads(updated);
    setEditingDownload(null);
    setRenameValue('');
  };

  // Open with download
  const handleOpenWith = (item: DownloadItem) => {
    setOpenWithItem(item);
  };

  // Add new download task
  const handleAddNewDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDownloadUrl.trim()) return;
    const url = newDownloadUrl.trim();
    let filename = url.split('/').pop()?.split('?')[0] || 'downloaded_asset.bin';
    if (!filename.includes('.')) filename += '.bin';

    onTriggerDownload(filename, url, 24500000);
    setNewDownloadUrl('');
    setShowAddDownload(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c101b] border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden text-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-[#0f1422]">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base sm:text-lg font-bold font-mono tracking-wide text-cyan-300">
              BROWSER CONTROL CENTER
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: 1. Browser Sets, 2. DownLoads, 3. BookMarks, 4. SavePage */}
        <div className="flex border-b border-gray-800 bg-[#090d16] px-2 overflow-x-auto no-scrollbar">
          {/* 1. Browser Sets with default icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#111728]'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Browser Sets</span>
          </button>

          {/* 2. DownLoads */}
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#111728]'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>DownLoads</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900/60 text-cyan-300 font-mono">
              {downloads.length}
            </span>
          </button>

          {/* 3. BookMarks with icon 🌟 */}
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'border-amber-400 text-amber-400 bg-amber-950/30'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#111728]'
            }`}
          >
            <span className="text-sm">🌟</span>
            <span>BookMarks</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/60 text-amber-300 font-mono">
              {bookmarks.length}
            </span>
          </button>

          {/* 4. SavePage with icon 🗃️ */}
          <button
            onClick={() => setActiveTab('savepage')}
            className={`flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'savepage'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-950/30'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#111728]'
            }`}
          >
            <span className="text-sm">🗃️</span>
            <span>SavePage</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-900/60 text-emerald-300 font-mono">
              {savedPages.length}
            </span>
          </button>
        </div>

        {/* Permission / Status Toast */}
        {permissionMessage && (
          <div className="bg-cyan-950/80 border-b border-cyan-500/40 px-4 py-2 text-xs text-cyan-200 flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{permissionMessage}</span>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: BROWSER SETS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border border-cyan-500/30 rounded-xl p-4 sm:p-5 bg-[#0f1423] space-y-4">
                <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm sm:text-base font-bold font-mono text-cyan-300">
                    1. General Browser Sets
                  </h3>
                </div>

                {/* 1. General > 'Download location' is from access phone permission local files */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <span>Download location</span>
                    </label>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Phone Permission: GRANTED
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    File storage location accessed via Android phone filesystem permissions
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 font-mono text-xs px-3 py-2 rounded-lg bg-[#080b12] border border-gray-700 text-cyan-300 truncate select-all">
                      {settings.downloadLocation}
                    </div>
                    <button
                      onClick={handleRequestDownloadLocation}
                      className="px-3 py-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Access Phone Storage</span>
                    </button>
                  </div>
                </div>

                {/* Set as default browser access from phone system permission */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Set as default browser</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Access system permission to register 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 as your default phone browser
                      </p>
                    </div>
                    <button
                      onClick={handleToggleDefaultBrowser}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        settings.isDefaultBrowser
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                      }`}
                    >
                      {settings.isDefaultBrowser ? 'DEFAULT: ACTIVE ✅' : 'ENABLE PERMISSION'}
                    </button>
                  </div>
                </div>

                {/* Search Engine: www.google.com */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Default Search Engine</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'www.google.com', url: 'https://www.google.com/search?q=' },
                      { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
                      { name: 'Bing', url: 'https://www.bing.com/search?q=' },
                    ].map((eng) => (
                      <button
                        key={eng.name}
                        onClick={() =>
                          onUpdateSettings({
                            ...settings,
                            searchEngineName: eng.name,
                            searchEngine: eng.url,
                          })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-mono text-left border transition cursor-pointer ${
                          settings.searchEngineName === eng.name
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-[#080b12] border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        {eng.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Agent */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-gray-200">
                      Mobile Android User-Agent
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono">Chrome 151 Mobile</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b12] border border-gray-800 font-mono text-[11px] text-cyan-300/90 break-all select-all">
                    {settings.userAgent}
                  </div>
                </div>

                {/* Direct APK Package Builder */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-200">
                      APK Package (Android App)
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Download compiled OdaiDarkHacks_v1.0.apk installable package
                    </p>
                  </div>
                  <button
                    onClick={() => generateAndDownloadApk('1.0.0')}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Download .apk
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              {/* Header actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-mono text-cyan-300 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>2. DownLoads Manager</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Active and completed download tasks with pause, resume, animations, and options menu
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddDownload(!showAddDownload)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>
                  <button
                    onClick={() => generateAndDownloadApk('1.0.0')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Generate APK file download"
                  >
                    <span>📥 Download APK</span>
                  </button>
                </div>
              </div>

              {/* Add New Download URL Form */}
              {showAddDownload && (
                <form
                  onSubmit={handleAddNewDownload}
                  className="p-3 rounded-xl bg-[#080b12] border border-cyan-500/30 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={newDownloadUrl}
                    onChange={(e) => setNewDownloadUrl(e.target.value)}
                    placeholder="Enter file URL (e.g. https://.../tool.zip or .apk)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0f1422] border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition cursor-pointer"
                    >
                      Start Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddDownload(false)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Active & Downloading Tasks */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  Active & Downloading Tasks
                </span>

                {downloads.filter((dl) => dl.status === 'downloading' || dl.status === 'paused')
                  .length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#080b12]/60 border border-gray-800/80 text-center text-xs text-gray-500">
                    No active downloading tasks.
                  </div>
                ) : (
                  downloads
                    .filter((dl) => dl.status === 'downloading' || dl.status === 'paused')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[#0f1423] border border-cyan-500/30 space-y-2.5 relative overflow-hidden"
                      >
                        {/* Downloading glowing pulse animation background */}
                        {item.status === 'downloading' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/10 to-cyan-500/5 animate-pulse pointer-events-none" />
                        )}

                        <div className="flex items-center justify-between gap-2 relative z-10">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">
                                {item.name.endsWith('.apk')
                                  ? '🤖'
                                  : item.name.endsWith('.pdf')
                                  ? '📄'
                                  : '📦'}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold font-mono text-gray-200 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono block truncate mt-0.5">
                              {item.localPath}
                            </span>
                          </div>

                          {/* Pause / Resume button */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleTogglePause(item.id)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer active:scale-95 ${
                                item.status === 'downloading'
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              }`}
                              title={item.status === 'downloading' ? 'Pause download' : 'Resume download'}
                            >
                              {item.status === 'downloading' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>

                            {/* Three dots menu for active task */}
                            <ThreeDotsMenu
                              item={item}
                              onDelete={handleDeleteDownload}
                              onShare={handleShareDownload}
                              onRename={handleRenameDownload}
                              onOpenWith={handleOpenWith}
                            />
                          </div>
                        </div>

                        {/* Downloading animation bar */}
                        <div className="space-y-1 relative z-10">
                          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                item.status === 'downloading'
                                  ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                            {item.status === 'downloading' && (
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[progress-bar-stripes_1s_linear_infinite]" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                            <span>
                              {item.status === 'downloading' ? '⚡ Downloading...' : '⏸️ Paused'} (
                              {item.progress.toFixed(1)}%)
                            </span>
                            <span>
                              {item.status === 'downloading' && (
                                <span className="text-cyan-400 mr-2">
                                  {(item.speedKBps / 1024).toFixed(2)} MB/s
                                </span>
                              )}
                              {(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB /{' '}
                              {(item.totalBytes / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Completed Downloaded Tasks */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                  Completed Downloads ({downloads.filter((dl) => dl.status === 'completed').length})
                </span>

                {downloads.filter((dl) => dl.status === 'completed').length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#080b12]/60 border border-gray-800/80 text-center text-xs text-gray-500">
                    No completed downloads yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {downloads
                      .filter((dl) => dl.status === 'completed')
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0a0e18] border border-gray-800 hover:border-cyan-500/30 transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-lg flex-shrink-0">
                              {item.name.endsWith('.apk') ? '🤖' : '📁'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-semibold font-mono text-gray-200 truncate group-hover:text-cyan-300 transition">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono mt-0.5">
                                <span>{(item.totalBytes / (1024 * 1024)).toFixed(2)} MB</span>
                                <span className="text-emerald-400">Completed</span>
                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Vertical three dots of setting: 'DeleteShareRenameOpen with' */}
                          <div className="flex items-center gap-1">
                            <ThreeDotsMenu
                              item={item}
                              onDelete={handleDeleteDownload}
                              onShare={handleShareDownload}
                              onRename={handleRenameDownload}
                              onOpenWith={handleOpenWith}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-mono text-amber-300 flex items-center gap-2">
                    <span className="text-base">🌟</span>
                    <span>3. BookMarks</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Saved page links. When browsing any site, tap the 🌟 icon on the toolbar to bookmark it instantly!
                  </p>
                </div>
              </div>

              {bookmarks.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#080b12] border border-gray-800 text-gray-500 text-xs space-y-2">
                  <span className="text-3xl block">🌟</span>
                  <p>No bookmarks saved yet.</p>
                  <p className="text-gray-400">
                    Browse any page and click the 🌟 star icon to add it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0f1422] border border-gray-800 hover:border-amber-500/40 transition group"
                    >
                      <div
                        onClick={() => {
                          onNavigateToUrl(bm.url);
                          onClose();
                        }}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <span className="text-lg text-amber-400 flex-shrink-0">🌟</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-semibold font-mono text-gray-200 group-hover:text-amber-300 truncate transition">
                            {bm.title}
                          </h4>
                          <span className="text-[11px] text-cyan-400/80 font-mono truncate block">
                            {bm.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => {
                            onNavigateToUrl(bm.url);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition cursor-pointer"
                          title="Open page in browser"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBookmark(bm.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition cursor-pointer"
                          title="Delete bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVEPAGE */}
          {activeTab === 'savepage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-mono text-emerald-300 flex items-center gap-2">
                    <span className="text-base">🗃️</span>
                    <span>4. SavePage (HTML Encoded Offline Pages)</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Entire web pages stored in HTML encoded format. When browsing, tap 🗃️ to capture and store any full page offline!
                  </p>
                </div>
              </div>

              {savedPages.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#080b12] border border-gray-800 text-gray-500 text-xs space-y-2">
                  <span className="text-3xl block">🗃️</span>
                  <p>No offline pages saved yet.</p>
                  <p className="text-gray-400">
                    Search or browse any page and tap the 🗃️ icon to save the entire page in HTML encode.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedPages.map((page) => (
                    <div
                      key={page.id}
                      className="p-3.5 rounded-xl bg-[#0f1422] border border-gray-800 hover:border-emerald-500/40 transition space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🗃️</span>
                            <h4 className="text-xs sm:text-sm font-semibold font-mono text-gray-100 truncate">
                              {page.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono truncate block mt-0.5">
                            {page.url}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono px-2 py-0.5 rounded bg-gray-800">
                          {(page.sizeBytes / 1024).toFixed(1)} KB HTML
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800/80">
                        <span className="text-[10px] text-gray-500 font-mono">
                          Saved: {new Date(page.timestamp).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onViewSavedPage(page);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Offline</span>
                          </button>

                          <button
                            onClick={() => setPreviewEncodedPage(page)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            <span>HTML Encode</span>
                          </button>

                          <button
                            onClick={() => onDeleteSavedPage(page.id)}
                            className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition cursor-pointer"
                            title="Delete saved page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rename Dialog Modal */}
      {editingDownload && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-[#0e1320] border border-cyan-500/40 p-4 space-y-4">
            <h3 className="text-sm font-bold font-mono text-cyan-300">Rename Download Task</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080b12] border border-gray-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingDownload(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open With Modal */}
      {openWithItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-[#0e1320] border border-cyan-500/40 p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Open With System Handler</span>
            </h3>
            <p className="text-xs text-gray-300">
              Select action for <strong className="text-cyan-200">{openWithItem.name}</strong>:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  window.open(openWithItem.url, '_blank');
                  setOpenWithItem(null);
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-[#141a29] hover:bg-[#1a2337] border border-gray-700 text-xs text-cyan-300 flex items-center justify-between"
              >
                <span>Launch in Browser / External App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (openWithItem.name.endsWith('.apk')) {
                    generateAndDownloadApk('1.0.0');
                  } else {
                    const blob = new Blob(['Simulated file content from ' + openWithItem.name], {
                      type: 'text/plain',
                    });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = openWithItem.name;
                    link.click();
                  }
                  setOpenWithItem(null);
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-[#141a29] hover:bg-[#1a2337] border border-gray-700 text-xs text-emerald-300 flex items-center justify-between"
              >
                <span>Download to Local Filesystem</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setOpenWithItem(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML Encode Preview Modal */}
      {previewEncodedPage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-[#0c101b] border border-cyan-500/40 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div>
                <h3 className="text-sm font-bold font-mono text-cyan-300">
                  🗃️ HTML Encode Snapshot: {previewEncodedPage.title}
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">
                  Base64 & HTML encoded representation
                </span>
              </div>
              <button
                onClick={() => setPreviewEncodedPage(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Size: {(previewEncodedPage.sizeBytes / 1024).toFixed(2)} KB</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewEncodedPage.encodedHtml);
                  setCopiedEncode(true);
                  setTimeout(() => setCopiedEncode(false), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 font-mono text-[11px]"
              >
                {copiedEncode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEncode ? 'Copied Encode!' : 'Copy Base64 HTML'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 rounded-lg bg-[#07090f] border border-gray-800 font-mono text-[11px] text-emerald-400 break-all select-all">
              {previewEncodedPage.encodedHtml}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                onClick={() => {
                  const blob = new Blob([previewEncodedPage.htmlContent], { type: 'text/html' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `${previewEncodedPage.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
                  link.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold"
              >
                Download .html File
              </button>
              <button
                onClick={() => setPreviewEncodedPage(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
