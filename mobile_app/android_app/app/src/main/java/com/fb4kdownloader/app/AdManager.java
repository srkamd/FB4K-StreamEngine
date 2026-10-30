package com.fb4kdownloader.app;

import android.app.Activity;
import android.content.Context;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.appopen.AppOpenAd;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class AdManager {

    private static final String TAG = "AdManager";
    private static AdManager instance;

    private InterstitialAd interstitialAd;
    private RewardedAd rewardedAd;
    private AppOpenAd appOpenAd;
    private boolean isInterstitialLoading = false;
    private boolean isRewardedLoading = false;
    private boolean isAppOpenLoading = false;

    private long lastInterstitialShownTime = 0;
    private static final long INTERSTITIAL_MIN_INTERVAL_MS = 40_000; // 40 seconds interval for Google Policy compliance

    private AdManager() {}

    public static synchronized AdManager getInstance() {
        if (instance == null) {
            instance = new AdManager();
        }
        return instance;
    }

    public void initialize(Context context) {
        MobileAds.initialize(context, initializationStatus -> {
            Log.d(TAG, "Google Mobile Ads initialized successfully.");
            loadInterstitial(context);
            loadRewarded(context);
            loadAppOpenAd(context);
        });
    }

    // =========================================================================
    // 1. ADAPTIVE STICKY BANNER AD (Bottom Bar)
    // =========================================================================
    public void setupAdaptiveBanner(Activity activity, FrameLayout container) {
        try {
            AdView adView = new AdView(activity);
            adView.setAdUnitId(AdConfig.getBannerAdUnitId());
            container.removeAllViews();
            container.addView(adView);

            AdSize adSize = getAdaptiveAdSize(activity);
            adView.setAdSize(adSize);

            AdRequest adRequest = new AdRequest.Builder().build();
            adView.loadAd(adRequest);
            Log.d(TAG, "Adaptive Banner ad requested.");
        } catch (Exception e) {
            Log.e(TAG, "Error setting up Adaptive Banner: " + e.getMessage());
        }
    }

    private AdSize getAdaptiveAdSize(Activity activity) {
        Display display = activity.getWindowManager().getDefaultDisplay();
        DisplayMetrics outMetrics = new DisplayMetrics();
        display.getMetrics(outMetrics);

        float density = outMetrics.density;
        float adWidthPixels = outMetrics.widthPixels;
        int adWidth = (int) (adWidthPixels / density);

        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth);
    }

    // =========================================================================
    // 2. INTERSTITIAL AD (Triggers on standard download)
    // =========================================================================
    public void loadInterstitial(Context context) {
        if (interstitialAd != null || isInterstitialLoading) return;

        isInterstitialLoading = true;
        AdRequest adRequest = new AdRequest.Builder().build();

        InterstitialAd.load(context, AdConfig.getInterstitialAdUnitId(), adRequest,
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd ad) {
                        interstitialAd = ad;
                        isInterstitialLoading = false;
                        Log.d(TAG, "Interstitial Ad loaded successfully.");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        interstitialAd = null;
                        isInterstitialLoading = false;
                        Log.w(TAG, "Interstitial Ad failed to load: " + error.getMessage());
                    }
                });
    }

    public void showInterstitialIfAvailable(Activity activity, Runnable onComplete) {
        long now = System.currentTimeMillis();
        boolean intervalElapsed = (now - lastInterstitialShownTime) >= INTERSTITIAL_MIN_INTERVAL_MS;

        if (interstitialAd != null && intervalElapsed) {
            interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    interstitialAd = null;
                    lastInterstitialShownTime = System.currentTimeMillis();
                    loadInterstitial(activity);
                    if (onComplete != null) onComplete.run();
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    interstitialAd = null;
                    loadInterstitial(activity);
                    if (onComplete != null) onComplete.run();
                }
            });

            interstitialAd.show(activity);
        } else {
            // Ad not ready or throttled: proceed immediately
            if (interstitialAd == null) loadInterstitial(activity);
            if (onComplete != null) onComplete.run();
        }
    }

    // =========================================================================
    // 3. REWARDED VIDEO AD (Unlocks 4K Transcoding / Ultra Fast Download)
    // =========================================================================
    public void loadRewarded(Context context) {
        if (rewardedAd != null || isRewardedLoading) return;

        isRewardedLoading = true;
        AdRequest adRequest = new AdRequest.Builder().build();

        RewardedAd.load(context, AdConfig.getRewardedAdUnitId(), adRequest,
                new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        rewardedAd = ad;
                        isRewardedLoading = false;
                        Log.d(TAG, "Rewarded Video Ad loaded successfully.");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        rewardedAd = null;
                        isRewardedLoading = false;
                        Log.w(TAG, "Rewarded Video Ad failed to load: " + error.getMessage());
                    }
                });
    }

    public interface OnRewardGrantedListener {
        void onRewardGranted();
        void onDismissedWithoutReward();
    }

    public void showRewardedAd(Activity activity, OnRewardGrantedListener listener) {
        if (rewardedAd != null) {
            final boolean[] userEarnedReward = {false};

            rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    rewardedAd = null;
                    loadRewarded(activity);
                    if (userEarnedReward[0]) {
                        if (listener != null) listener.onRewardGranted();
                    } else {
                        if (listener != null) listener.onDismissedWithoutReward();
                    }
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    rewardedAd = null;
                    loadRewarded(activity);
                    // Fallback: grant reward anyway so user isn't punished by ad failure
                    if (listener != null) listener.onRewardGranted();
                }
            });

            rewardedAd.show(activity, rewardItem -> {
                userEarnedReward[0] = true;
                Log.d(TAG, "User earned reward: " + rewardItem.getAmount() + " " + rewardItem.getType());
            });
        } else {
            // If ad is not ready, still allow the user to download and reload
            loadRewarded(activity);
            if (listener != null) listener.onRewardGranted();
        }
    }

    // =========================================================================
    // 4. APP OPEN AD (Cold-Start Monetization)
    // =========================================================================
    public void loadAppOpenAd(Context context) {
        if (appOpenAd != null || isAppOpenLoading) return;

        isAppOpenLoading = true;
        AdRequest adRequest = new AdRequest.Builder().build();

        AppOpenAd.load(context, AdConfig.getAppOpenAdUnitId(), adRequest,
                new AppOpenAd.AppOpenAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull AppOpenAd ad) {
                        appOpenAd = ad;
                        isAppOpenLoading = false;
                        Log.d(TAG, "App Open Ad loaded successfully.");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        appOpenAd = null;
                        isAppOpenLoading = false;
                        Log.w(TAG, "App Open Ad failed to load: " + error.getMessage());
                    }
                });
    }

    public void showAppOpenAdIfAvailable(Activity activity) {
        if (appOpenAd != null) {
            appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    appOpenAd = null;
                    loadAppOpenAd(activity);
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    appOpenAd = null;
                    loadAppOpenAd(activity);
                }
            });
            appOpenAd.show(activity);
        } else {
            loadAppOpenAd(activity);
        }
    }
}
