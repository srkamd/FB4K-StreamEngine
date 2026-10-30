package com.fb4kdownloader.app;

import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends AppCompatActivity {

    public static final String APP_URL = "https://fb4kdownloader.com";
    private static final String PREF_NAME = "fb4k_prefs";
    private static final String KEY_DOWNLOAD_COUNT = "key_dl_count";
    private static final String KEY_RATED = "key_rated";

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private FrameLayout adBannerContainer;

    private String lastDetectedClipboardUrl = "";
    private long backPressedTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Bind UI Views
        webView = findViewById(R.id.webview);
        progressBar = findViewById(R.id.progressBar);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        adBannerContainer = findViewById(R.id.adBannerContainer);

        // 1. Initialize Google Mobile Ads (AdMob)
        AdManager.getInstance().initialize(this);
        AdManager.getInstance().setupAdaptiveBanner(this, adBannerContainer);
        AdManager.getInstance().showAppOpenAdIfAvailable(this);

        // 2. Setup WebView and Swipe Refresh
        setupWebView();
        setupSwipeRefresh();

        // 3. Handle Share Intent (if opened from Facebook/Instagram share sheet)
        handleIncomingIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        checkClipboardForVideoLink();
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Append identification token to User Agent
        String defaultUa = webSettings.getUserAgentString();
        webSettings.setUserAgentString(defaultUa + " FB4KApp/1.0 (Android)");

        // Inject Native-to-JavaScript Bridge
        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");

        // Top horizontal progress indicator
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        // Navigation and external URL handler
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith(APP_URL) || url.contains("fb4kdownloader.com")) {
                    return false; // Stay inside WebView
                }
                // External links open in default browser
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception ignored) {}
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                swipeRefreshLayout.setRefreshing(false);
            }
        });

        // Fallback Native DownloadListener (for standard browser downloads)
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                handleDownloadWithMonetization(url, "standard", fileName);
            }
        });

        webView.loadUrl(APP_URL);
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setColorSchemeResources(R.color.primary_cyan, R.color.accent_gold);
        swipeRefreshLayout.setProgressBackgroundColorSchemeResource(R.color.card_dark);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            webView.reload();
        });
    }

    // =========================================================================
    // 🔗 SHARE INTENT & AUTO-CLIPBOARD LINK DETECTION
    // =========================================================================
    private void handleIncomingIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null && "text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null && !sharedText.trim().isEmpty()) {
                String extractedUrl = extractUrlFromString(sharedText);
                if (extractedUrl != null) {
                    loadUrlInApp(extractedUrl);
                }
            }
        }
    }

    private void checkClipboardForVideoLink() {
        try {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null && clipboard.hasPrimaryClip()) {
                ClipData clip = clipboard.getPrimaryClip();
                if (clip != null && clip.getItemCount() > 0) {
                    CharSequence text = clip.getItemAt(0).getText();
                    if (text != null) {
                        String raw = text.toString().trim();
                        if (isFacebookUrl(raw) && !raw.equals(lastDetectedClipboardUrl)) {
                            lastDetectedClipboardUrl = raw;
                            showClipboardPrompt(raw);
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
    }

    private boolean isFacebookUrl(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        return (lower.contains("facebook.com") || lower.contains("fb.watch") || 
                lower.contains("fb.gg") || lower.contains("fb.com"));
    }

    private String extractUrlFromString(String text) {
        Pattern pattern = Pattern.compile("https?://[\\w\\d:#@%/;$()~_?\\+-=\\\\.&]+", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return text;
    }

    private void showClipboardPrompt(final String videoUrl) {
        new AlertDialog.Builder(this)
                .setTitle(R.string.clipboard_detected_title)
                .setMessage(videoUrl)
                .setPositiveButton(R.string.clipboard_action_fetch, (dialog, which) -> {
                    loadUrlInApp(videoUrl);
                })
                .setNegativeButton(R.string.clipboard_action_dismiss, null)
                .show();
    }

    private void loadUrlInApp(String videoUrl) {
        String targetUrl = APP_URL + "?url=" + Uri.encode(videoUrl);
        webView.loadUrl(targetUrl);
    }

    // =========================================================================
    // 💰 MONETIZATION ROUTING (REWARDED VIDEO FOR 4K / INTERSTITIAL FOR HD)
    // =========================================================================
    public void handleDownloadWithMonetization(final String url, final String quality, final String filename) {
        final String safeName = (filename != null && !filename.isEmpty()) ? filename : "fb4k_video_" + System.currentTimeMillis() + ".mp4";

        if ("4k".equalsIgnoreCase(quality)) {
            // 🎬 Rewarded Video Ad ($20-$45+ eCPM) for 4K Ultra HD
            new AlertDialog.Builder(this)
                    .setTitle(R.string.reward_title)
                    .setMessage(R.string.reward_message)
                    .setCancelable(false)
                    .setPositiveButton(R.string.reward_action_watch, (dialog, which) -> {
                        AdManager.getInstance().showRewardedAd(this, new AdManager.OnRewardGrantedListener() {
                            @Override
                            public void onRewardGranted() {
                                Toast.makeText(MainActivity.this, "🎉 4K Ultra VIP Unlocked! Downloading...", Toast.LENGTH_SHORT).show();
                                startNativeDownload(url, safeName);
                            }

                            @Override
                            public void onDismissedWithoutReward() {
                                Toast.makeText(MainActivity.this, "Ad was not completed. 4K download cancelled.", Toast.LENGTH_SHORT).show();
                            }
                        });
                    })
                    .setNegativeButton(R.string.reward_action_cancel, (dialog, which) -> {
                        // User cancelled rewarded ad: fallback to standard download with interstitial
                        AdManager.getInstance().showInterstitialIfAvailable(this, () -> startNativeDownload(url, safeName));
                    })
                    .show();
        } else {
            // Standard HD/SD/MP3: Interstitial Ad
            AdManager.getInstance().showInterstitialIfAvailable(this, () -> {
                startNativeDownload(url, safeName);
            });
        }
    }

    // =========================================================================
    // 📥 NATIVE HIGH-SPEED DOWNLOAD MANAGER
    // =========================================================================
    private void startNativeDownload(String url, String fileName) {
        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));

            String mimeType = fileName.endsWith(".mp3") ? "audio/mpeg" : "video/mp4";
            request.setMimeType(mimeType);

            String cookies = CookieManager.getInstance().getCookie(url);
            if (cookies != null) request.addRequestHeader("cookie", cookies);

            request.setDescription("Downloading via FB4KDownloader...");
            request.setTitle(fileName);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

            // Save to public Downloads/FB4KDownloader folder
            File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "FB4KDownloader");
            if (!dir.exists()) dir.mkdirs();

            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "FB4KDownloader/" + fileName);

            DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            if (dm != null) {
                dm.enqueue(request);
                Toast.makeText(this, getString(R.string.download_started), Toast.LENGTH_LONG).show();

                // Scan into Android Gallery
                File targetFile = new File(dir, fileName);
                MediaScannerConnection.scanFile(this, new String[]{targetFile.getAbsolutePath()}, new String[]{mimeType}, null);

                incrementDownloadCountAndCheckRating();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Download error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            // Fallback: open browser
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
            } catch (Exception ignored) {}
        }
    }

    private void incrementDownloadCountAndCheckRating() {
        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        boolean alreadyRated = prefs.getBoolean(KEY_RATED, false);
        if (alreadyRated) return;

        int count = prefs.getInt(KEY_DOWNLOAD_COUNT, 0) + 1;
        prefs.edit().putInt(KEY_DOWNLOAD_COUNT, count).apply();

        // Prompt rating after 2 downloads
        if (count == 2) {
            new AlertDialog.Builder(this)
                    .setTitle(R.string.rate_title)
                    .setMessage(R.string.rate_message)
                    .setPositiveButton(R.string.rate_action_yes, (d, w) -> {
                        prefs.edit().putBoolean(KEY_RATED, true).apply();
                        try {
                            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + getPackageName())));
                        } catch (Exception e) {
                            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + getPackageName())));
                        }
                    })
                    .setNegativeButton(R.string.rate_action_later, null)
                    .show();
        }
    }

    // =========================================================================
    // 🔙 BACK NAVIGATION
    // =========================================================================
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            if (System.currentTimeMillis() - backPressedTime < 2000) {
                super.onBackPressed();
            } else {
                backPressedTime = System.currentTimeMillis();
                Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
