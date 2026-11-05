import React from 'react';
import { Download, Globe, Shield, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenSettings: (tab?: 'settings' | 'downloads' | 'bookmarks' | 'savepage') => void;
  onOpenUser: () => void;
  onOpenApkModal: () => void;
  userProfile: UserProfile;
  currentView: 'home' | 'browser';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenUser,
  onOpenApkModal,
  userProfile,
  currentView,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0e17]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left top: Settings out with ⚙️ icon */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onOpenSettings('settings')}
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1c2336] border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 transition-all shadow-sm shadow-cyan-950/40 text-xs sm:text-sm font-medium active:scale-95 cursor-pointer"
            title="Open Browser Settings"
          >
            <span className="text-base sm:text-lg animate-spin-slow group-hover:rotate-45 transition-transform">⚙️</span>
            <span className="font-semibold tracking-wide hidden xs:inline">Settings</span>
          </button>

          {/* Quick shortcuts to Bookmarks & Downloads inside header for quick access */}
          <button
            onClick={() => onOpenSettings('downloads')}
            className="flex items-center justify-center p-1.5 rounded-lg bg-[#141926]/80 hover:bg-[#1c2336] border border-gray-700/60 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-400 transition text-xs active:scale-95 cursor-pointer"
            title="DownLoads"
          >
            <Download className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => onOpenSettings('bookmarks')}
            className="flex items-center justify-center p-1.5 rounded-lg bg-[#141926]/80 hover:bg-[#1c2336] border border-gray-700/60 hover:border-amber-500/40 text-gray-300 hover:text-amber-400 transition text-xs active:scale-95 cursor-pointer"
            title="BookMarks"
          >
            <span className="text-sm">🌟</span>
          </button>

          <button
            onClick={() => onOpenSettings('savepage')}
            className="flex items-center justify-center p-1.5 rounded-lg bg-[#141926]/80 hover:bg-[#1c2336] border border-gray-700/60 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-400 transition text-xs active:scale-95 cursor-pointer"
            title="SavePage"
          >
            <span className="text-sm">🗃️</span>
          </button>
        </div>

        {/* Top center: '𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊' */}
        <div
          onClick={onNavigateHome}
          className="cursor-pointer text-center select-none group flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block"></span>
            <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] font-mono">
              𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊
            </h1>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block"></span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider font-mono uppercase group-hover:text-cyan-300 transition-colors">
            CYBER-SEC BROWSER ENGINE v1.0
          </span>
        </div>

        {/* Right top: 'User' in with 👤 icon & APK button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK Direct Download Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 hover:from-cyan-500/40 hover:to-emerald-500/40 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 text-xs font-mono font-medium transition shadow-sm active:scale-95 cursor-pointer"
            title="Download APK File"
          >
            <span className="text-xs">📥</span>
            <span className="font-bold tracking-tight hidden sm:inline">APK</span>
          </button>

          {/* User button with 👤 icon */}
          <button
            onClick={onOpenUser}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1c2336] border border-cyan-500/30 hover:border-cyan-400 text-gray-200 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            title="User Profile & Google Sign-In"
          >
            <span className="text-base sm:text-lg">👤</span>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">
              {userProfile.isSignedIn ? userProfile.name.split(' ')[0] : 'User'}
            </span>
            {userProfile.isSignedIn && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
