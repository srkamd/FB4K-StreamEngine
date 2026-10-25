# FB4K — Android Mobile App (High-eCPM Monetized)

Official Android Client for **[FB4KDownloader](https://fb4kdownloader.com)** designed for **maximum revenue generation** using Google AdMob (Adaptive Banners, Interstitials, Rewarded Videos, and App Open Ads).

---

## 💰 Monetization Architecture ("Paisa Hi Paisa" Revenue Engine)

The app utilizes the **Golden 4-Pillar Monetization Strategy** used by top multi-million-download utility apps:

| Ad Type | Location / Trigger | Purpose | Average eCPM |
| :--- | :--- | :--- | :--- |
| **Adaptive Sticky Banner** | Fixed at bottom of screen | Constant passive impressions while user browses | $1.50 – $4.00 |
| **Interstitial Ad** | On standard download (1080p, 720p, MP3) | Full-screen high conversion ad on action | $8.00 – $18.00 |
| **Rewarded Video Ad (VIP)** | When user taps **4K Ultra HD (60FPS)** | User willingly watches 15–30s sponsor video to unlock 4K | **$20.00 – $45.00+** |
| **App Open Ad** | On app cold-start / resume | Immediate monetization upon opening app | $15.00 – $30.00 |

---

## ⚡ Core Features

1. **Auto-Clipboard Facebook Link Detection**:
   - When the user copies any Facebook/Reels/Video link anywhere on their phone and opens FB4K, the app automatically detects the link and offers a one-tap **"Fetch & Download"** prompt.
2. **Native Share Sheet Integration (`ACTION_SEND`)**:
   - Inside the official Facebook or Instagram app: Tap **Share ➔ More Options ➔ FB4K**, and the app instantly opens and extracts the video automatically.
3. **High-Speed Native Android `DownloadManager`**:
   - Downloads run in the background with real-time Android notification tray progress bar.
   - Automatically registers files with Android's `MediaScannerConnection` so videos immediately appear in Google Photos / Gallery.
4. **$0 Additional Server Cost**:
   - Directly connects to your existing Hostinger backend (`https://fb4kdownloader.com/api/extract`). Any updates to the website are immediately reflected in the app without requiring app store updates!
5. **ASO Viral Rating Booster**:
   - After the 2nd successful download, prompts the user to rate 5 stars on Google Play to boost organic search rankings.

---

## 🛠️ Project Structure

```
android_app/
├── app/
│   ├── src/main/
│   │   ├── java/com/fb4kdownloader/app/
│   │   │   ├── MainActivity.java         # Lifecycle, WebView, Clipboard, Downloads & Rating
│   │   │   ├── AdManager.java            # Google AdMob Ad Engine (Banner, Interstitial, Rewarded, App Open)
│   │   │   ├── AdConfig.java             # AdMob Keys & Test Mode Switch
│   │   │   └── WebAppInterface.java      # JavaScript Bridge connecting Website buttons with Native Ads
│   │   ├── res/
│   │   │   ├── layout/activity_main.xml  # UI layout with progress bar, WebView & banner container
│   │   │   ├── values/                   # strings.xml, colors.xml, styles.xml (Dark Gold theme)
│   │   │   └── mipmap-*/                 # Official HD squircle app icons (48x48 to 192x192)
│   │   └── AndroidManifest.xml           # Permissions, Share Intent, and AdMob Meta-data
│   ├── build.gradle                      # App dependencies (AdMob SDK, Material, SwipeRefresh)
│   └── proguard-rules.pro                # Release code optimization & bridge preservation
├── build.gradle                          # Top-level Gradle config
└── settings.gradle                       # Module settings
```

---

## 🚀 How to Setup & Publish to Google Play Store

### Step 1: Open in Android Studio
1. Launch **Android Studio**.
2. Click **Open** and select the folder: `D:\Projects\fb4kdownloader\android_app`.
3. Wait for Gradle Sync to complete.

### Step 2: Test with Google Test Ads
The project comes pre-configured with `AdConfig.USE_TEST_ADS = true` and Google's official AdMob sample IDs:
- Run the app on an Android Emulator or connected physical phone (`Shift + F10`).
- Test copying a link, downloading 1080p (triggers Interstitial), and downloading 4K (triggers Rewarded Video).

### Step 3: Add Your Real AdMob IDs (To Start Earning)
1. Go to **[Google AdMob](https://admob.google.com)** and create an account.
2. Click **Apps ➔ Add App ➔ Android ➔ No (not listed yet)** ➔ Name it **"FB4K — Video Saver"**.
3. Create 4 Ad Units:
   - **Banner** (Adaptive)
   - **Interstitial**
   - **Rewarded**
   - **App Open**
4. Copy your **AdMob App ID** and paste it in `AndroidManifest.xml`:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID" />
   ```
5. Copy your 4 Ad Unit IDs and paste them into `AdConfig.java`:
   ```java
   public static final boolean USE_TEST_ADS = false; // Turn OFF test mode

   private static final String LIVE_BANNER_ID       = "ca-app-pub-XXXXX/YYYYY";
   private static final String LIVE_INTERSTITIAL_ID = "ca-app-pub-XXXXX/YYYYY";
   private static final String LIVE_REWARDED_ID     = "ca-app-pub-XXXXX/YYYYY";
   private static final String LIVE_APP_OPEN_ID     = "ca-app-pub-XXXXX/YYYYY";
   ```

### Step 4: Generate Signed Release APK / AAB
1. In Android Studio, go to **Build ➔ Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** (required by Google Play).
3. Create or select your keystore file.
4. Click **Release** and hit **Finish**.
5. Upload the generated `.aab` file to **Google Play Console**.

---

## 🛡️ Google Play Store Compliance Guidelines

To avoid rejections or trademark issues from Meta/Google:
1. **App Title**: Use **"FB4K — Video & Reels Saver"** (DO NOT title it "Facebook Video Downloader").
2. **Short Description**: Fast & secure high-definition video downloader for social clips and reels.
3. **Privacy Policy**: Provide your live URL: `https://fb4kdownloader.com/privacy.html`.
4. **Disclaimer / DMCA**: Provide your live URL: `https://fb4kdownloader.com/dmca.html`.
