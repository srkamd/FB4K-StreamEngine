# Proguard rules for FB4KDownloader Android App

# Preserve JavaScript Interface methods for WebView bridge
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Google Mobile Ads SDK classes
-keep class com.google.android.gms.ads.** { *; }
-keep interface com.google.android.gms.ads.** { *; }

# Keep Material & AndroidX components
-keep class androidx.appcompat.** { *; }
-keep class com.google.android.material.** { *; }
