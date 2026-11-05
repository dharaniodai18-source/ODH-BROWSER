import React, { useState } from 'react';
import { X, Download, ShieldCheck, Smartphone, CheckCircle, Package } from 'lucide-react';
import { generateAndDownloadApk } from '../utils/apkGenerator';
import { BASE64_CENTER_ICON } from '../constants';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsBuilding(true);
    try {
      const result = await generateAndDownloadApk('1.0.0');
      setDownloadSuccess(`Successfully compiled and downloaded ${result.filename} (${(result.size / 1024).toFixed(1)} KB)!`);
    } catch (err) {
      console.error(err);
      setDownloadSuccess('Download initiated via browser.');
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c101a] border border-cyan-500/40 shadow-2xl shadow-cyan-950/70 overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#0f1422]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono text-cyan-300">
              ANDROID APK PACKAGE BUILDER
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5">
          {/* Package Info Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#131929] border border-cyan-500/30">
            <img
              src={BASE64_CENTER_ICON}
              alt="Odai Dark Hacks Icon"
              className="w-14 h-14 rounded-xl border border-cyan-400/30 bg-[#080b12] p-1 object-contain drop-shadow"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white">
                  𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                com.odai.darkhacks.browser
              </p>
              <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono mt-1">
                <span>Android 8.0 - 15+</span>
                <span>•</span>
                <span>ARM64 / x86_64</span>
              </div>
            </div>
          </div>

          {/* Permissions Declared in AndroidManifest.xml */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Embedded AndroidManifest.xml Permissions:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-gray-300 bg-[#070a12] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="text-emerald-400">✓</span>
                <span>WRITE_EXTERNAL_STORAGE</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="text-emerald-400">✓</span>
                <span>READ_EXTERNAL_STORAGE</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="text-emerald-400">✓</span>
                <span>INTERNET</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="text-emerald-400">✓</span>
                <span>SET_DEFAULT_BROWSER_INTENT</span>
              </div>
            </div>
          </div>

          {/* Installation steps */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>How to install on Android phone:</span>
            </span>
            <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 bg-[#070a12] p-3 rounded-lg border border-gray-800">
              <li>Tap the <strong>Download APK File</strong> button below.</li>
              <li>Once downloaded, open your phone's <strong>Downloads</strong> folder.</li>
              <li>Tap <strong>OdaiDarkHacks_v1.0.apk</strong> and tap <strong>Install</strong>.</li>
              <li>Allow "Install unknown apps" from Chrome/Files if prompted.</li>
            </ol>
          </div>

          {/* Download Action Button */}
          <div className="pt-2">
            <button
              onClick={handleDownload}
              disabled={isBuilding}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-mono font-bold text-sm transition shadow-lg shadow-cyan-500/25 active:scale-98 cursor-pointer disabled:opacity-75"
            >
              <Download className="w-5 h-5" />
              <span>
                {isBuilding ? 'Compiling APK Package...' : 'Download OdaiDarkHacks_v1.0.apk'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
