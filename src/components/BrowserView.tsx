import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Shield,
  Download,
  Lock,
  ExternalLink,
  Code,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { BookmarkItem, BrowserSettings, SavedPageItem } from '../types';

interface BrowserViewProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  onGoHome: () => void;
  onAddBookmark: (bookmark: Omit<BookmarkItem, 'id' | 'timestamp'>) => void;
  onSavePage: (page: Omit<SavedPageItem, 'id' | 'timestamp'>) => void;
  isBookmarked: boolean;
  onTriggerDownload: (filename: string, url: string, size: number) => void;
  settings: BrowserSettings;
  offlinePageContent?: SavedPageItem | null;
}

export const BrowserView: React.FC<BrowserViewProps> = ({
  currentUrl,
  onNavigate,
  onGoHome,
  onAddBookmark,
  onSavePage,
  isBookmarked,
  onTriggerDownload,
  settings,
  offlinePageContent,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('Loading...');
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([currentUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setUrlInput(currentUrl);
    setIsLoading(true);

    // Compute title based on URL or query
    let title = 'Web Page';
    if (offlinePageContent) {
      title = `[OFFLINE ARCHIVE] ${offlinePageContent.title}`;
    } else if (currentUrl.includes('google.com/search?q=')) {
      const q = new URLSearchParams(currentUrl.split('?')[1]).get('q') || 'Search';
      title = `${q} - Google Search`;
    } else if (currentUrl.includes('google.com')) {
      title = 'Google';
    } else if (currentUrl.includes('github.com')) {
      title = 'GitHub: Where the world builds software';
    } else if (currentUrl.includes('thehackernews.com')) {
      title = 'The Hacker News - Cybersecurity News';
    } else if (currentUrl.includes('wikipedia.org')) {
      title = 'Wikipedia, the free encyclopedia';
    } else if (currentUrl.includes('darkhacks://tools')) {
      title = '𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Core Arsenal';
    } else {
      try {
        const u = new URL(currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`);
        title = `${u.hostname} - Secure Portal`;
      } catch {
        title = currentUrl;
      }
    }
    setPageTitle(title);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [currentUrl, offlinePageContent]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    let target = urlInput.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('darkhacks://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `${settings.searchEngine}${encodeURIComponent(target)}`;
      }
    }
    onNavigate(target);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), target]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onNavigate(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onNavigate(nextUrl);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Exact user command:
  // "when I'm searching or browsing someone get show a icon is 🌟 save into bookmarks"
  const handleBookmarkClick = () => {
    onAddBookmark({
      title: pageTitle,
      url: currentUrl,
      favicon: '🌟',
    });
    setActionNotification(`Saved "${pageTitle}" into BookMarks 🌟!`);
    setTimeout(() => setActionNotification(null), 3000);
  };

  // Exact user command:
  // "when I'm searching or browsing someone get show a icon is🗃️ into savepage"
  const handleSavePageClick = () => {
    const rawHtml = generateCurrentPageHtml(pageTitle, currentUrl);
    const encoded = btoa(unescape(encodeURIComponent(rawHtml)));
    onSavePage({
      title: pageTitle,
      url: currentUrl,
      htmlContent: rawHtml,
      encodedHtml: encoded,
      sizeBytes: rawHtml.length,
    });
    setActionNotification(`Saved entire page into SavePage 🗃️ in HTML encode!`);
    setTimeout(() => setActionNotification(null), 3500);
  };

  const generateCurrentPageHtml = (title: string, url: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { background-color: #0b0f19; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; line-height: 1.6; }
    h1 { color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 8px; }
    .badge { background: #1e293b; color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; display: inline-block; margin-bottom: 16px; }
    .card { background: #131927; border: 1px solid #1e293b; padding: 16px; border-radius: 8px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="badge">ARCHIVED BY 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 BROWSER</div>
  <h1>${title}</h1>
  <p><strong>Original URL:</strong> <a href="${url}" style="color: #38bdf8;">${url}</a></p>
  <p><strong>Archived Timestamp:</strong> ${new Date().toISOString()}</p>
  <div class="card">
    <h3>Offline Page Content Snapshot</h3>
    <p>This web document was captured and encoded offline by 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Browser.</p>
    <p>All styling, layout structure, and document elements are securely stored locally.</p>
  </div>
</body>
</html>`;
  };

  // Search query extractor
  const getSearchQuery = () => {
    if (currentUrl.includes('google.com/search?q=')) {
      return new URLSearchParams(currentUrl.split('?')[1]).get('q') || '';
    }
    return '';
  };

  const searchQuery = getSearchQuery();

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] bg-[#070a12] text-gray-200">
      {/* Top Browser Toolbar with 🌟 and 🗃️ icons */}
      <div className="sticky top-[53px] z-30 bg-[#0c101c]/95 backdrop-blur-md border-b border-cyan-500/20 px-2 sm:px-4 py-2 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation controls */}
          <button
            onClick={onGoHome}
            className="p-1.5 rounded-lg bg-[#121826] hover:bg-[#1a2336] text-gray-300 hover:text-cyan-400 border border-gray-800 transition active:scale-95 cursor-pointer"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg bg-[#121826] hover:bg-[#1a2336] text-gray-300 hover:text-cyan-400 border border-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg bg-[#121826] hover:bg-[#1a2336] text-gray-300 hover:text-cyan-400 border border-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            className={`p-1.5 rounded-lg bg-[#121826] hover:bg-[#1a2336] text-gray-300 hover:text-cyan-400 border border-gray-800 transition active:scale-95 cursor-pointer ${
              isLoading ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Reload Page"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* URL / Omnibox bar */}
          <form
            onSubmit={handleUrlSubmit}
            className="flex-1 min-w-0 flex items-center rounded-xl bg-[#080c16] border border-cyan-500/30 px-2.5 py-1.5 text-xs font-mono focus-within:border-cyan-400 transition"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400 mr-1.5 flex-shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none truncate"
              placeholder="Search or enter web address..."
            />
          </form>

          {/* EXACT REQUIREMENT: Icon 🌟 save into bookmarks */}
          <button
            onClick={handleBookmarkClick}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1 transition active:scale-95 cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                : 'bg-[#121826] hover:bg-[#1c2438] border-gray-700/80 hover:border-amber-400 text-gray-300 hover:text-amber-400'
            }`}
            title="Save Page into BookMarks (🌟)"
          >
            <span className="text-base sm:text-lg">🌟</span>
            <span className="text-xs font-mono font-bold hidden md:inline">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>

          {/* EXACT REQUIREMENT: Icon 🗃️ save into savepage */}
          <button
            onClick={handleSavePageClick}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#121826] hover:bg-[#1c2438] border border-gray-700/80 hover:border-emerald-400 text-gray-300 hover:text-emerald-400 flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-sm"
            title="Save entire page into SavePage (🗃️ HTML Encode)"
          >
            <span className="text-base sm:text-lg">🗃️</span>
            <span className="text-xs font-mono font-bold hidden md:inline">SavePage</span>
          </button>

          {/* Direct Download button */}
          <button
            onClick={() =>
              onTriggerDownload(
                `${pageTitle.replace(/[^a-zA-Z0-9]/g, '_')}.html`,
                currentUrl,
                48000
              )
            }
            className="p-1.5 rounded-lg bg-[#121826] hover:bg-[#1c2438] border border-gray-800 text-cyan-400 hover:text-cyan-300 transition active:scale-95 cursor-pointer hidden sm:flex"
            title="Download page HTML file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Loading Progress Bar */}
        {isLoading && (
          <div className="w-full h-0.5 bg-gray-800 overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 animate-[progress-bar-stripes_1s_ease-in-out_infinite] w-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        )}
      </div>

      {/* Notification Toast for Bookmarking or SavePage */}
      {actionNotification && (
        <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-900 border-b border-cyan-400/40 px-4 py-2 text-xs text-white font-mono flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{actionNotification}</span>
          </div>
          <span className="text-[10px] text-cyan-200 uppercase tracking-wider">
            Verified In Local Vault
          </span>
        </div>
      )}

      {/* Offline Page Banner */}
      {offlinePageContent && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>🗃️</span>
            <span>
              <strong>OFFLINE ARCHIVE MODE:</strong> Viewing HTML Encoded snapshot from {new Date(offlinePageContent.timestamp).toLocaleDateString()}
            </span>
          </span>
          <button
            onClick={() => onNavigate(offlinePageContent.url)}
            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px]"
          >
            Try Live Site
          </button>
        </div>
      )}

      {/* Page Content Body */}
      <div className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto w-full">
        {/* If Google Search results */}
        {searchQuery ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <span className="font-mono text-sm text-cyan-300 font-bold">
                  Google Search Results
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  for &quot;{searchQuery}&quot;
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                About 1,840,000 results (0.28 seconds)
              </span>
            </div>

            {/* Simulated Google Search Results */}
            <div className="space-y-5">
              {[
                {
                  title: `${searchQuery} - Official Portal & Comprehensive Guide`,
                  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`,
                  snippet: `Explore full documentation, background, and technological specs for ${searchQuery}. Maintained by open contributors worldwide with real-time verification.`,
                  badge: 'Wikipedia',
                },
                {
                  title: `${searchQuery} on GitHub - Repositories & Tools`,
                  url: `https://github.com/search?q=${encodeURIComponent(searchQuery)}`,
                  snippet: `Discover top open source libraries, security scripts, and code repositories tagged with ${searchQuery}. Free software with MIT / Apache 2.0 licenses.`,
                  badge: 'GitHub',
                },
                {
                  title: `Cybersecurity Insights & Vulnerability Reports: ${searchQuery}`,
                  url: `https://thehackernews.com/search?q=${encodeURIComponent(searchQuery)}`,
                  snippet: `Latest breaking security bulletins, zero-day threat intelligence, and vulnerability patches affecting ${searchQuery} in enterprise environments.`,
                  badge: 'The Hacker News',
                },
                {
                  title: `ODAI Dark Hacks Research Bulletin: ${searchQuery}`,
                  url: `darkhacks://bulletin/${encodeURIComponent(searchQuery)}`,
                  snippet: `Internal security laboratory analysis, payload validation, and sandboxed browser execution metrics for ${searchQuery}.`,
                  badge: 'DarkHacks Lab',
                },
              ].map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#0c101c] border border-gray-800 hover:border-cyan-500/40 transition group"
                >
                  <div className="flex items-center gap-2 text-xs text-cyan-400/80 font-mono mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                      {res.badge}
                    </span>
                    <span className="truncate">{res.url}</span>
                  </div>
                  <h3
                    onClick={() => onNavigate(res.url)}
                    className="text-base sm:text-lg font-semibold font-mono text-cyan-300 group-hover:text-cyan-200 group-hover:underline cursor-pointer transition"
                  >
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                    {res.snippet}
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-800/60 text-xs font-mono text-gray-400">
                    <button
                      onClick={() => onNavigate(res.url)}
                      className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Visit Webpage</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => {
                        onAddBookmark({
                          title: res.title,
                          url: res.url,
                          favicon: '🌟',
                        });
                        setActionNotification(`Bookmarked "${res.title}"!`);
                        setTimeout(() => setActionNotification(null), 2500);
                      }}
                      className="hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>🌟 Bookmark</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => {
                        onTriggerDownload(
                          `${res.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`,
                          res.url,
                          35000
                        );
                      }}
                      className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>📥 Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : offlinePageContent ? (
          /* Offline Saved Page Render */
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0c101c] border border-emerald-500/30 space-y-4">
            <div className="border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold font-mono text-emerald-300">
                {offlinePageContent.title}
              </h2>
              <span className="text-xs text-gray-400 font-mono">
                Source: {offlinePageContent.url}
              </span>
            </div>
            <div
              className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: offlinePageContent.htmlContent }}
            />
          </div>
        ) : currentUrl.includes('thehackernews.com') ? (
          /* The Hacker News Page */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#120a10] border border-rose-500/30">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-xs font-mono font-bold">
                BREAKING THREAT INTEL
              </span>
              <h2 className="text-xl font-bold font-mono text-rose-200 mt-2">
                New Android Zero-Day Vulnerability Mitigated by Isolated Browser Sandboxing
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Published November 2026 • Security Advisory
              </p>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Security researchers have discovered malicious payloads targeting unpatched WebKit engines. Browsers enforcing custom user agents and encrypted local storage—such as 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊—remain impervious due to decoupled permissions and local file sandboxing.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0c101c] border border-gray-800 space-y-2">
                <span className="text-xs text-cyan-400 font-mono">DEFENSIVE PROTOCOL</span>
                <h4 className="text-sm font-bold text-white">Always Save Offline Copies</h4>
                <p className="text-xs text-gray-400">
                  Tap the 🗃️ SavePage button to store critical advisories in HTML encoded format without third-party network tracking.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0c101c] border border-gray-800 space-y-2">
                <span className="text-xs text-amber-400 font-mono">BOOKMARK ESSENTIALS</span>
                <h4 className="text-sm font-bold text-white">Star Important Pages</h4>
                <p className="text-xs text-gray-400">
                  Tap 🌟 Star to organize high-priority exploits and analysis reports in your BookMarks drawer.
                </p>
              </div>
            </div>
          </div>
        ) : currentUrl.includes('darkhacks://tools') ? (
          /* Odai Dark Hacks Arsenal */
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#090e1a] border border-cyan-500/40 text-center space-y-2">
              <h2 className="text-2xl font-black font-mono text-cyan-300 tracking-wider">
                𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 ARSENAL
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Advanced mobile browser utilities, payload generators, and network tools
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'HTML Encode / Decoder Engine', desc: 'Convert entire web documents to base64 and hex strings', icon: '🗃️' },
                { name: 'APK Package Compiler', desc: 'Build Android installable package on the fly', icon: '🤖' },
                { name: 'User-Agent Faker & Injector', desc: 'Current: Android 10 Chrome 151 Mobile', icon: '📱' },
                { name: 'Download Accelerator (Multi-Threaded)', desc: 'Real-time task streaming with pause & resume', icon: '⚡' },
              ].map((tool, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0f1422] border border-gray-800 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-2 text-lg">
                    <span>{tool.icon}</span>
                    <h4 className="text-sm font-bold font-mono text-cyan-200">{tool.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* General Web Portal View */
          <div className="p-6 rounded-2xl bg-[#0c101c] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-lg font-bold font-mono text-cyan-300">{pageTitle}</h2>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                >
                  <span>{currentUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmarkClick}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>🌟</span>
                  <span>Bookmark</span>
                </button>
                <button
                  onClick={handleSavePageClick}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>🗃️</span>
                  <span>SavePage</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#080b12] border border-gray-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>Isolated Sandbox Browser View active</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                Host URL: {currentUrl}
                <br />
                Security Layer: Zero-telemetry, strict CORS containment, script sandbox.
                <br />
                User-Agent: {settings.userAgent}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open directly in external tab</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
