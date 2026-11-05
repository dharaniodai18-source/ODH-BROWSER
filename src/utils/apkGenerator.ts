import JSZip from 'jszip';
import { BASE64_CENTER_ICON } from '../constants';

export async function generateAndDownloadApk(version: string = '1.0.0'): Promise<{ filename: string; size: number }> {
  const zip = new JSZip();

  // 1. AndroidManifest.xml
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.odai.darkhacks.browser"
    android:versionCode="1"
    android:versionName="${version}">

    <uses-sdk android:minSdkVersion="26" android:targetSdkVersion="34" />

    <!-- Storage & Browser Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
    <uses-permission android:name="android.permission.SET_PREFERRED_APPLICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar.Fullscreen"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Default Browser Intent Filter -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="http" />
                <data android:scheme="https" />
                <data android:scheme="about" />
            </intent-filter>

            <!-- Custom Schemes for DarkHacks Browser -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:scheme="darkhacks" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  zip.file('AndroidManifest.xml', manifestXml);

  // 2. classes.dex stub
  const dexHeader = new Uint8Array([
    0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00, // dex magic "dex\n035\0"
    0x2c, 0x48, 0x9f, 0x37, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00,
    0x78, 0x56, 0x34, 0x12, 0x00, 0x00, 0x00, 0x00,
  ]);
  zip.file('classes.dex', dexHeader);

  // 3. resources.arsc stub
  const arscHeader = new Uint8Array([
    0x02, 0x00, 0x0c, 0x00, 0x50, 0x01, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x1c, 0x00,
  ]);
  zip.file('resources.arsc', arscHeader);

  // 4. assets/www
  const webHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊</title>
</head>
<body style="background:#0a0d14;color:#00f0ff;font-family:sans-serif;text-align:center;padding:40px;">
  <h1>𝕆𝔻𝔸𝕀 𝗗𝗔𝗥𝗞 ℍ𝔸ℂ𝕂𝕊</h1>
  <p>Android Native Hybrid Engine active. User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36</p>
</body>
</html>`;
  zip.file('assets/www/index.html', webHtml);

  // 5. App Icon from base64
  try {
    const base64Data = BASE64_CENTER_ICON.replace(/^data:image\/\w+;base64,/, '');
    zip.file('res/mipmap-hdpi/ic_launcher.png', base64Data, { base64: true });
    zip.file('res/mipmap-xhdpi/ic_launcher.png', base64Data, { base64: true });
    zip.file('res/mipmap-xxhdpi/ic_launcher.png', base64Data, { base64: true });
  } catch (err) {
    console.error('Error adding icon to apk:', err);
  }

  // 6. META-INF signature files
  zip.file(
    'META-INF/MANIFEST.MF',
    `Manifest-Version: 1.0\nCreated-By: Odai Dark Hacks APK Builder\nBuilt-By: Dharani Odai\nPackage-Name: com.odai.darkhacks.browser\n`
  );
  zip.file('META-INF/CERT.SF', `Signature-Version: 1.0\nSHA-256-Digest-Manifest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n`);
  zip.file('META-INF/CERT.RSA', new Uint8Array([0x30, 0x82, 0x02, 0x4a, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02]));

  // Generate blob
  const apkBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.android.package-archive' });
  const filename = `OdaiDarkHacks_v${version}.apk`;

  // Trigger download in browser
  const link = document.createElement('a');
  link.href = URL.createObjectURL(apkBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { filename, size: apkBlob.size };
}
