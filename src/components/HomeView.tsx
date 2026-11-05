import React, { useState } from 'react';
import { Search, ArrowRight, Shield, Terminal, Zap, Download } from 'lucide-react';
import { BASE64_CENTER_ICON, DEFAULT_USER_AGENT } from '../constants';
import { BrowserSettings } from '../types';

interface HomeViewProps {
  onSearchOrNavigate: (queryOrUrl: string) => void;
  settings: BrowserSettings;
  onOpenApkModal: () => void;
  onOpenSettings: (tab?: 'settings' | 'downloads' | 'bookmarks' | 'savepage') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearchOrNavigate,
  settings,
  onOpenApkModal,
  onOpenSettings,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearchOrNavigate(searchInput.trim());
  };

  const speedDialShortcuts = [
    {
      title: 'Google',
      url: 'https://www.google.com',
      icon: '🌐',
      category: 'Search Engine',
      accent: 'border-cyan-500/30 hover:border-cyan-400',
    },
    {
      title: 'GitHub',
      url: 'https://github.com',
      icon: '🐙',
      category: 'Developer Hub',
      accent: 'border-emerald-500/30 hover:border-emerald-400',
    },
    {
      title: 'The Hacker News',
      url: 'https://thehackernews.com',
      icon: '🛡️',
      category: 'Cyber Security',
      accent: 'border-rose-500/30 hover:border-rose-400',
    },
    {
      title: 'Wikipedia',
      url: 'https://wikipedia.org',
      icon: '📚',
      category: 'Encyclopedia',
      accent: 'border-amber-500/30 hover:border-amber-400',
    },
    {
      title: 'Odai Tools',
      url: 'darkhacks://tools',
      icon: '⚡',
      category: 'Browser Payloads',
      accent: 'border-teal-500/30 hover:border-teal-400',
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com',
      icon: '▶️',
      category: 'Media Streaming',
      accent: 'border-red-500/30 hover:border-red-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-between px-3 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      {/* Top Banner / System State */}
      <div className="w-full flex items-center justify-between gap-2 text-[11px] font-mono text-cyan-400/80 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>DARK ENGINE SECURE SHELL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSettings('settings')}
            className="hover:text-cyan-300 transition underline underline-offset-2 cursor-pointer"
          >
            Engine: {settings.searchEngineName}
          </button>
        </div>
      </div>

      {/* Main Center Section */}
      <div className="w-full flex flex-col items-center justify-center my-auto space-y-6 sm:space-y-8 text-center">
        {/* Icon 1 is center of screen of base64 image */}
        <div className="relative group cursor-pointer" onClick={() => onOpenSettings('settings')}>
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-emerald-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition duration-500 opacity-80 animate-pulse"></div>

          <div className="relative p-2 rounded-2xl bg-[#090d16] border-2 border-cyan-500/50 shadow-2xl shadow-cyan-900/60 overflow-hidden transform group-hover:scale-105 transition duration-300">
            <img
              src={BASE64_CENTER_ICON}
              alt="𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Core Icon"
              className="w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            />
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0a0f1d] border border-cyan-400/60 text-[10px] font-mono text-cyan-300 font-bold tracking-wider shadow">
            DARK CORE
          </div>
        </div>

        {/* Center Title Display */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-emerald-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]">
            𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊
          </h2>
          <p className="text-xs sm:text-sm font-mono text-gray-400 tracking-wide">
            Next-Gen Android Mobile Web Browser & Cyber Engine
          </p>
        </div>

        {/* Icon 2 is center of screen: search bar like [......…................…...........🔍] */}
        {/* Search engine is 'www.google.com' */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl px-2 relative"
        >
          <div className="relative flex items-center group">
            {/* Glowing borders */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 rounded-2xl blur-sm opacity-50 group-focus-within:opacity-100 transition duration-300"></div>

            <div className="relative w-full flex items-center rounded-2xl bg-[#0e1424] border border-cyan-500/40 px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl">
              <span className="text-gray-500 font-mono text-xs select-none pr-2 hidden sm:inline">
                https://
              </span>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search www.google.com or enter URL..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-cyan-100 placeholder-gray-500 focus:outline-none tracking-wide"
                autoFocus
              />

              {/* Exact format requested: [......…................…...........🔍] */}
              <button
                type="submit"
                className="flex items-center justify-center p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 hover:text-white border border-cyan-500/40 transition active:scale-95 cursor-pointer ml-1"
                title="Search www.google.com"
              >
                <Search className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 px-3 pt-2">
            <span>Engine: <strong className="text-cyan-400">{settings.searchEngineName}</strong></span>
            <span className="truncate max-w-[240px]">Press Enter to browse or search</span>
          </div>
        </form>

        {/* Speed Dial / Quick Bookmarks */}
        <div className="w-full max-w-2xl pt-2">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {speedDialShortcuts.map((item) => (
              <button
                key={item.title}
                onClick={() => onSearchOrNavigate(item.url)}
                className={`p-2.5 sm:p-3 rounded-xl bg-[#0a0f1d] border ${item.accent} transition flex flex-col items-center justify-center gap-1 group active:scale-95 cursor-pointer shadow-md`}
              >
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-mono font-medium text-gray-300 group-hover:text-cyan-300 truncate w-full">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* APK Download Banner Card */}
        <div className="w-full max-w-2xl p-4 rounded-2xl bg-gradient-to-r from-[#0c1322] via-[#0d1627] to-[#0c1322] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold font-mono text-cyan-200">
                Install 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 APK
              </h4>
              <p className="text-[11px] text-gray-400 font-mono">
                Download OdaiDarkHacks_v1.0.apk installable package directly onto Android
              </p>
            </div>
          </div>
          <button
            onClick={onOpenApkModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-mono font-bold text-xs transition shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            📥 Download APK
          </button>
        </div>
      </div>

      {/* Footer / Mobile Android User-Agent badge */}
      {/* User agent is 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36' */}
      <footer className="w-full mt-6 pt-4 border-t border-gray-800/80 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1322] border border-cyan-500/20 text-[10px] sm:text-[11px] font-mono text-gray-400 max-w-full">
          <span className="text-cyan-400 font-bold whitespace-nowrap">User-Agent:</span>
          <span className="text-gray-300 truncate select-all">{settings.userAgent}</span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono">
          © 2026 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 • All Permissions Handled Through Local Storage
        </p>
      </footer>
    </div>
  );
};
