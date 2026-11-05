# 𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊 Browser

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-brightgreen.svg)]()
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> A high-performance, dark-themed cyber mobile browser interface with offline page archiving (HTML Encode), active download manager with live speed and progress animations, bookmark manager, Google Account integration, and an integrated Android APK package compiler.

---

## 🌟 Key Features

### 1. ⚙️ Browser Sets & System Permissions
- **Download Location**: Configurable Android local storage directory (`/storage/emulated/0/Download/OdaiDarkHacks`) with native file system permissions.
- **Default Browser Intent**: Simulated and native Android system permission intent (`android.intent.action.VIEW`) registration to handle HTTP/HTTPS and custom `darkhacks://` protocol links.
- **Mobile Android User-Agent**: Pre-configured with:
  ```
  Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36
  ```
- **Custom Search Engines**: Default configured to `www.google.com`, with switchable support for DuckDuckGo and Bing.

### 2. 📥 DownLoads Manager
- **Active Task Monitoring**: Real-time download progress bar with animated striped gradients, live speed tracking (MB/s), and byte counts.
- **Task Controls**: Pause (⏸️) and resume (▶️) active transfers.
- **3-Dot Setting Menu (⋮)** for all completed downloads:
  - 🗑️ **Delete**: Remove download task and cached files.
  - 🔗 **Share**: Web Share API & clipboard link sharing.
  - ✏️ **Rename**: Inline file renaming.
  - ↗️ **Open with**: Open in external system handler, browser, or local storage.

### 3. 🌟 BookMarks Manager
- Save page links with custom titles, URLs, and timestamps.
- **Live Browsing Integration**: Tap the **🌟** star icon on any page toolbar while searching or browsing to instantly bookmark the page.

### 4. 🗃️ SavePage (Offline HTML Encoded Snapshots)
- Capture full web documents in **Base64 / HTML encoded format**.
- View offline snapshots directly within the browser without internet connectivity.
- Inspect and copy raw Base64 HTML encoded strings.
- Export archived `.html` files directly to phone storage.
- **Live Browsing Integration**: Tap the **🗃️** icon on any page toolbar to archive the entire page offline.

### 5. 👤 User Authentication & Sync
- **Sign In With Google Account**:
  - Displays user profile status (`dharaniodai18@gmail.com`).
  - Toggle real-time cloud synchronization for Bookmarks, Downloads, and Saved Pages.

### 6. 🤖 APK Package Compiler
- Generates a valid `.apk` file (`OdaiDarkHacks_v1.0.apk`) containing:
  - `AndroidManifest.xml` (Storage permissions, Browser intent-filters)
  - `classes.dex`
  - `resources.arsc`
  - `res/mipmap-hdpi/ic_launcher.png` (using the Odai Dark Hacks retro pixel character)
  - `assets/www/index.html` (embedded browser engine)
  - `META-INF` signatures

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm / pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/odai-dark-hacks-browser.git
cd odai-dark-hacks-browser

# Install dependencies
npm install

# Start local development server (Port 3000)
npm run dev
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + Cyber Glow Accents
- **Icons**: Lucide React
- **Package Archive Builder**: JSZip (for Android APK generation)

---

## 📜 License
Licensed under the Apache License, Version 2.0.
