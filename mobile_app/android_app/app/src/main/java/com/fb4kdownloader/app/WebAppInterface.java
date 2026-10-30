package com.fb4kdownloader.app;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {

    private final MainActivity activity;

    public WebAppInterface(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public boolean isAndroidApp() {
        return true;
    }

    @JavascriptInterface
    public String getAppVersion() {
        return "1.0.0";
    }

    /**
     * Called by website JavaScript when user taps any download button (4K, 1080p, 720p, MP3).
     */
    @JavascriptInterface
    public void onDownloadTriggered(final String url, final String quality, final String filename) {
        if (activity == null || activity.isFinishing()) return;

        activity.runOnUiThread(() -> {
            activity.handleDownloadWithMonetization(url, quality, filename);
        });
    }

    @JavascriptInterface
    public void showToast(final String message) {
        if (activity == null || activity.isFinishing()) return;

        activity.runOnUiThread(() -> {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
        });
    }

    @JavascriptInterface
    public void shareUrl(final String url, final String title) {
        if (activity == null || activity.isFinishing()) return;

        activity.runOnUiThread(() -> {
            try {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("text/plain");
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, title != null ? title : "FB4K Video Download");
                shareIntent.putExtra(Intent.EXTRA_TEXT, url);
                activity.startActivity(Intent.createChooser(shareIntent, "Share Video via"));
            } catch (Exception e) {
                Toast.makeText(activity, "Unable to open share sheet", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
