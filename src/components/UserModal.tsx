import React, { useState } from 'react';
import { X, CheckCircle, Shield, Cloud, LogOut, Check } from 'lucide-react';
import { GOOGLE_ACCOUNT_ICON } from '../constants';
import { UserProfile } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      onUpdateProfile({
        ...userProfile,
        isSignedIn: true,
        name: 'Dharani Odai',
        email: 'dharaniodai18@gmail.com',
        avatar: GOOGLE_ACCOUNT_ICON,
      });
      setIsSigningIn(false);
      setSyncToast('Successfully signed in with Google Account! Cloud synchronization active.');
      setTimeout(() => setSyncToast(null), 4000);
    }, 600);
  };

  const handleSignOut = () => {
    onUpdateProfile({
      ...userProfile,
      isSignedIn: false,
      name: 'Guest Hacker',
      email: 'dharaniodai18@gmail.com',
    });
    setSyncToast('Signed out of Google Account.');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleToggleSync = (field: 'syncBookmarks' | 'syncDownloads' | 'syncSavedPages') => {
    onUpdateProfile({
      ...userProfile,
      [field]: !userProfile[field],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d121e] border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#0f1525]">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h2 className="text-base font-bold font-mono text-cyan-300">USER PROFILE</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Toast */}
        {syncToast && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{syncToast}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6">
          {!userProfile.isSignedIn ? (
            /* Sign In Screen */
            <div className="space-y-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#141b2c] border border-cyan-500/30 flex items-center justify-center p-2 shadow-inner">
                <img
                  src={GOOGLE_ACCOUNT_ICON}
                  alt="Google Account Icon"
                  className="w-10 h-10 object-contain drop-shadow"
                />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  Google Account Authentication
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Sign in to synchronize your BookMarks 🌟, DownLoads history, and offline SavePages 🗃️ across devices.
                </p>
              </div>

              {/* Exact user command: 'Sign In With Google Account.' with icon from link */}
              <div className="pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm transition shadow-lg shadow-white/10 active:scale-98 cursor-pointer disabled:opacity-75"
                >
                  <img
                    src={GOOGLE_ACCOUNT_ICON}
                    alt="Google Account Icon"
                    className="w-5 h-5 object-contain"
                  />
                  <span>
                    {isSigningIn ? 'Connecting to Google...' : 'Sign In With Google Account.'}
                  </span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#090d16] border border-gray-800 text-[11px] text-gray-400 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Encrypted Zero-Knowledge Browser Session</span>
                </div>
                <p>
                  Your credentials and browsing bookmarks remain encrypted locally in this terminal container.
                </p>
              </div>
            </div>
          ) : (
            /* Signed In Profile View */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#141b2c] border border-cyan-500/30">
                <div className="relative">
                  <img
                    src={GOOGLE_ACCOUNT_ICON}
                    alt="Google Account Avatar"
                    className="w-12 h-12 rounded-full border border-cyan-400/40 p-1 bg-white/10 object-contain"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#141b2c]"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-mono text-white truncate">
                      {userProfile.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-900/60 text-cyan-300 font-mono">
                      SYNC ON
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                    {userProfile.email}
                  </p>
                </div>
              </div>

              {/* Sync settings */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                  <Cloud className="w-4 h-4" />
                  <span>Account Sync Preferences</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleToggleSync('syncBookmarks')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-gray-800 hover:border-cyan-500/30 text-xs transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-gray-200">
                      <span>🌟</span>
                      <span>Sync BookMarks</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        userProfile.syncBookmarks
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {userProfile.syncBookmarks ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleToggleSync('syncDownloads')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-gray-800 hover:border-cyan-500/30 text-xs transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-gray-200">
                      <span>📥</span>
                      <span>Sync DownLoads History</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        userProfile.syncDownloads
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {userProfile.syncDownloads ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleToggleSync('syncSavedPages')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-gray-800 hover:border-cyan-500/30 text-xs transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-gray-200">
                      <span>🗃️</span>
                      <span>Sync SavePage HTML Vault</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        userProfile.syncSavedPages
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {userProfile.syncSavedPages ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sign out button */}
              <div className="pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold font-mono transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
