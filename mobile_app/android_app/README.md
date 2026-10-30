# FB4KDownloader — Android Mobile Application

Official native Android client for **[FB4KDownloader](https://fb4kdownloader.com)**. Designed for seamless Facebook video extraction, background downloading, share sheet integration, and optimized AdMob monetization integration.

---

## 🌟 Core Features

- **Automatic Clipboard Link Detection**:
  Automatically detects Facebook / Reels video URLs copied to the clipboard when the app is brought to the foreground, offering a one-tap fetch dialog.

- **Native System Share Sheet (`ACTION_SEND`)**:
  Allows users to share video links directly from the Facebook or Instagram apps into FB4KDownloader for instant link extraction.

- **Background Download Manager**:
  Leverages Android's native `DownloadManager` for robust background downloads, complete with progress notifications and automatic `MediaScanner` registration for immediate gallery visibility.

- **Integrated AdMob Monetization Framework**:
  Fully structured ad implementation supporting Adaptive Banners, Interstitial Ads, Rewarded Ads, and App Open Ads adhering to Google Policy guidelines.

- **In-App Rating & Review Booster**:
  Prompts satisfied users to rate the app on the Google Play Store after a configurable threshold of successful downloads.

---

## 🏗️ Technical Architecture & Stack

- **Language**: Java 8 / Modern Android APIs
- **Min SDK**: 24 (Android 7.0 Nougat)
- **Target / Compile SDK**: 34 (Android 14)
- **Build System**: Gradle with Android Gradle Plugin 8.7.3
- **Dependencies**:
  - `androidx.appcompat:appcompat`
  - `com.google.android.material:material`
  - `androidx.swiperefreshlayout:swiperefreshlayout`
  - `com.google.android.gms:play-services-ads:23.0.0`

---

## 💰 Monetization Structure

The app integrates standard Google AdMob formats designed for user engagement and compliance:

| Ad Type | Location / Trigger | Implementation Strategy |
| :--- | :--- | :--- |
| **Adaptive Sticky Banner** | Fixed at bottom container | Dynamic orientation-anchored banner |
| **Interstitial Ad** | Standard download action (e.g., 1080p, 720p, MP3) | Full-screen presentation with time-interval throttling |
| **Rewarded Video Ad** | High-definition / 4K Ultra HD downloads | User-opted video ad rewarded with high-quality download access |
| **App Open Ad** | App cold-start or resume | Non-intrusive full-screen splash ad |

---

## 📁 Project Structure

```text
android_app/
├── app/
│   ├── src/main/
│   │   ├── java/com/fb4kdownloader/app/
│   │   │   ├── MainActivity.java         # Primary activity managing WebView, clipboard, and download triggers
│   │   │   ├── AdManager.java            # AdMob lifecycle manager (Banners, Interstitials, Rewarded, App Open)
│   │   │   ├── AdConfig.java             # AdMob configuration and unit ID resolution
│   │   │   └── WebAppInterface.java      # JavaScript interface bridging web events with native capabilities
│   │   ├── res/
│   │   │   ├── layout/activity_main.xml  # Layout configuration with WebView, SwipeRefresh, and ad layout
│   │   │   ├── values/                   # Color palettes, string resources, and app theme configuration
│   │   │   └── mipmap-*/                 # Application icons across various densities
│   │   └── AndroidManifest.xml           # Manifest declaration, permissions, share intents, and AdMob application ID
│   ├── build.gradle                      # Module-level build configuration and dependencies
│   └── proguard-rules.pro                # Code obfuscation and optimization rules
├── build.gradle                          # Top-level Gradle configuration
├── gradle.properties                     # Gradle build properties and AndroidX settings
└── settings.gradle                       # Subproject and repository settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Android Studio** (Ladybug / Jellyfish or newer recommended)
- **JDK**: 17 or higher
- **Android SDK**: API 34 installed

### Setup & Configuration

1. **Clone or Open Project**:
   Open the `android_app` directory in Android Studio.

2. **Test Mode (Default)**:
   By default, the project uses official Google AdMob test IDs (`AdConfig.USE_TEST_ADS = true`). You can run and test all ad placements safely on an emulator or physical device.

3. **Production Deployment**:
   Before releasing to production:
   - Update `com.google.android.gms.ads.APPLICATION_ID` in `app/src/main/AndroidManifest.xml` with your live AdMob Application ID.
   - Set `public static final boolean USE_TEST_ADS = false;` in `AdConfig.java`.
   - Replace the `LIVE_*_ID` constants in `AdConfig.java` with your actual AdMob unit IDs.

---

## 🔨 Building the Project

### Debug Build
In Android Studio terminal or command prompt:
```bash
./gradlew :app:assembleDebug
```
The generated APK will be located at `app/build/outputs/apk/debug/app-debug.apk`.

### Release Build (APK / AAB)
To generate an Android App Bundle (AAB) for Google Play submission:
```bash
./gradlew :app:bundleRelease
```
Or build a signed release APK:
```bash
./gradlew :app:assembleRelease
```

---

## 🛡️ Google Play Compliance & Policies

- **App Naming**: Ensure the app title on Play Store does not infringe trademarked brand names (e.g., use *"FB4K — Video & Reels Saver"*).
- **Privacy Policy**: Provide a valid privacy policy link during submission in the Google Play Console.
- **Permissions**: Request runtime permissions appropriately for storage access on legacy versions and media permissions on Android 13+.

---

## 📄 License

This project is proprietary software developed for **[FB4KDownloader](https://fb4kdownloader.com)**. All rights reserved.
