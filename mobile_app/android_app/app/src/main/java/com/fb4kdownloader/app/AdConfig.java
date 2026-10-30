package com.fb4kdownloader.app;

/**
 * AdMob Monetization Configuration for FB4KDownloader.
 * 
 * Instructions:
 * 1. During testing & development, keep USE_TEST_ADS = true.
 * 2. When ready to publish to Google Play Store:
 *    - Replace LIVE_APP_ID in AndroidManifest.xml
 *    - Replace LIVE_*_ID below with your actual AdMob Ad Unit IDs from https://admob.google.com
 *    - Switch USE_TEST_ADS = false
 */
public class AdConfig {

    // =========================================================================
    // ⚙️ TOGGLE TEST MODE (Set to false before building release APK for Play Store)
    // =========================================================================
    public static final boolean USE_TEST_ADS = true;

    // =========================================================================
    // 🧪 GOOGLE OFFICIAL TEST AD UNIT IDS (Safe for unlimited testing)
    // =========================================================================
    private static final String TEST_BANNER_ID       = "ca-app-pub-3940256099942544/6300978111";
    private static final String TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
    private static final String TEST_REWARDED_ID     = "ca-app-pub-3940256099942544/5224354917";
    private static final String TEST_APP_OPEN_ID     = "ca-app-pub-3940256099942544/9257395921";

    // =========================================================================
    // 💰 YOUR LIVE ADMOB AD UNIT IDS (Paste your real IDs here)
    // =========================================================================
    private static final String LIVE_BANNER_ID       = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";
    private static final String LIVE_INTERSTITIAL_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";
    private static final String LIVE_REWARDED_ID     = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";
    private static final String LIVE_APP_OPEN_ID     = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";

    // =========================================================================
    // 🚀 AD RESOLVERS
    // =========================================================================
    public static String getBannerAdUnitId() {
        return USE_TEST_ADS ? TEST_BANNER_ID : LIVE_BANNER_ID;
    }

    public static String getInterstitialAdUnitId() {
        return USE_TEST_ADS ? TEST_INTERSTITIAL_ID : LIVE_INTERSTITIAL_ID;
    }

    public static String getRewardedAdUnitId() {
        return USE_TEST_ADS ? TEST_REWARDED_ID : LIVE_REWARDED_ID;
    }

    public static String getAppOpenAdUnitId() {
        return USE_TEST_ADS ? TEST_APP_OPEN_ID : LIVE_APP_OPEN_ID;
    }
}
