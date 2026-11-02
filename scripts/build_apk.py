import os
import sys
import subprocess
import shutil
import struct
import zlib

def run_cmd(cmd, cwd=None):
    print(f"--> Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), check=True)
    return res

def create_png_icon(size, out_path):
    raw_data = bytearray()
    center = size / 2.0
    radius = size * 0.46
    inner_radius = size * 0.22
    
    for y in range(size):
        raw_data.append(0) # filter None
        for x in range(size):
            dx = x - center
            dy = y - center
            dist = (dx*dx + dy*dy) ** 0.5
            if dist <= radius:
                if dist <= inner_radius:
                    raw_data.extend([255, 255, 255]) # White center
                else:
                    ratio = (dist - inner_radius) / (radius - inner_radius)
                    r = int(59 * (1 - ratio) + 30 * ratio)
                    g = int(130 * (1 - ratio) + 41 * ratio)
                    b = int(246 * (1 - ratio) + 59 * ratio)
                    raw_data.extend([r, g, b])
            else:
                raw_data.extend([28, 25, 23]) # Stone-900 background

    compressed = zlib.compress(bytes(raw_data), 9)
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'wb') as f:
        f.write(png)

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    build_dir = "/tmp/apk-build"
    
    print("=== 1. Building Vite Production Bundle ===")
    run_cmd(["npm", "run", "build"], cwd=root_dir)
    
    print("=== 2. Setting up APK Build Directory ===")
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    
    src_dir = os.path.join(build_dir, "src/com/smartrevision/cockpit")
    bin_dir = os.path.join(build_dir, "bin")
    res_dir = os.path.join(build_dir, "res")
    assets_dir = os.path.join(build_dir, "assets")
    
    os.makedirs(src_dir, exist_ok=True)
    os.makedirs(bin_dir, exist_ok=True)
    os.makedirs(os.path.join(res_dir, "values"), exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)
    
    print("=== 3. Generating Android Resources & Icons ===")
    create_png_icon(48, os.path.join(res_dir, "mipmap-mdpi/ic_launcher.png"))
    create_png_icon(72, os.path.join(res_dir, "mipmap-hdpi/ic_launcher.png"))
    create_png_icon(96, os.path.join(res_dir, "mipmap-xhdpi/ic_launcher.png"))
    create_png_icon(144, os.path.join(res_dir, "mipmap-xxhdpi/ic_launcher.png"))
    create_png_icon(192, os.path.join(res_dir, "mipmap-xxxhdpi/ic_launcher.png"))
    
    with open(os.path.join(res_dir, "values/strings.xml"), "w") as f:
        f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Smart Revision Cockpit</string>
</resources>
""")

    with open(os.path.join(res_dir, "values/styles.xml"), "w") as f:
        f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar">
        <item name="android:windowBackground">@android:color/white</item>
    </style>
</resources>
""")

    with open(os.path.join(build_dir, "AndroidManifest.xml"), "w") as f:
        f.write("""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.smartrevision.cockpit"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34"/>

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:allowBackup="true"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
""")

    print("=== 4. Writing Native Android Activity ===")
    with open(os.path.join(src_dir, "MainActivity.java"), "w") as f:
        f.write("""package com.smartrevision.cockpit;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setStatusBarColor(Color.parseColor("#1c1917"));
            window.setNavigationBarColor(Color.parseColor("#1c1917"));
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#f5f5f4"));

        webView = new WebView(this);
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, 8
        ));

        root.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
        ));
        root.addView(progressBar);
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " SmartRevisionApp/1.0 NativeAndroid");

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

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

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:///android_asset/") || url.startsWith("http://") || url.startsWith("https://")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        });

        webView.loadUrl("file:///android_asset/dist/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void vibrate(long milliseconds) {
            try {
                Vibrator v = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    v.vibrate(milliseconds);
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public boolean isNativeAndroid() {
            return true;
        }

        @JavascriptInterface
        public String getVersion() {
            return "1.0.0-native";
        }
    }
}
""")

    print("=== 5. Compiling Java Source ==="
    android_jar = "/usr/lib/android-sdk/platforms/android-23/android.jar"
    java_file = os.path.join(src_dir, "MainActivity.java")
    run_cmd([
        "javac", "-source", "8", "-target", "8",
        "-bootclasspath", android_jar,
        "-d", bin_dir,
        java_file
    ])

    print("=== 6. Converting Bytecode to Dalvik DEX ===")
    dex_output = os.path.join(build_dir, "classes.dex")
    run_cmd(["dalvik-exchange", "--dex", f"--output={dex_output}", bin_dir])

    print("=== 7. Packaging Android Resources with AAPT ===")
    manifest_file = os.path.join(build_dir, "AndroidManifest.xml")
    unsigned_apk = os.path.join(build_dir, "unsigned.apk")
    run_cmd([
        "aapt", "package", "-f",
        "-M", manifest_file,
        "-S", res_dir,
        "-I", android_jar,
        "-F", unsigned_apk
    ])

    print("=== 8. Bundling Native Offline App Assets into APK ===")
    dist_src = os.path.join(root_dir, "dist")
    assets_dist = os.path.join(assets_dir, "dist")
    shutil.copytree(dist_src, assets_dist)

    run_cmd(["zip", "-u", unsigned_apk, "classes.dex"], cwd=build_dir)
    run_cmd(["zip", "-r", "-u", unsigned_apk, "assets"], cwd=build_dir)

    print("=== 9. Signing APK with apksigner ===")
    keystore_path = "/tmp/debug.keystore"
    if not os.path.exists(keystore_path):
        run_cmd([
            "keytool", "-genkey", "-v",
            "-keystore", keystore_path,
            "-alias", "androiddebugkey",
            "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000",
            "-storepass", "android", "-keypass", "android",
            "-dname", "CN=Android Debug,O=Android,C=US"
        ])

    signed_apk = os.path.join(build_dir, "SmartRevisionCockpit.apk")
    run_cmd([
        "apksigner", "sign",
        "--ks", keystore_path,
        "--ks-pass", "pass:android",
        "--ks-key-alias", "androiddebugkey",
        "--key-pass", "pass:android",
        "--out", signed_apk,
        unsigned_apk
    ])

    print("=== 10. Verifying APK Signature ===")
    run_cmd(["apksigner", "verify", "--verbose", signed_apk])

    print("=== 11. Publishing APK to public/ and android/ ===")
    public_apk = os.path.join(root_dir, "public", "SmartRevisionCockpit.apk")
    android_apk = os.path.join(root_dir, "android", "SmartRevisionCockpit.apk")
    os.makedirs(os.path.join(root_dir, "public"), exist_ok=True)
    os.makedirs(os.path.join(root_dir, "android"), exist_ok=True)
    shutil.copyfile(signed_apk, public_apk)
    shutil.copyfile(signed_apk, android_apk)

    size_mb = os.path.getsize(public_apk) / (1024 * 1024)
    print(f"=== SUCCESS! SmartRevisionCockpit.apk created: {size_mb:.2f} MB ===")
    print(f"Saved to: {public_apk}")

if __name__ == "__main__":
    main()
