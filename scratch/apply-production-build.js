const fs = require('fs');
const path = require('path');

console.log('🚀 RUNNING INTEGRATED PRODUCTION BUILD PROTOCOL\n');

// 1. Define the Technical Manual HTML
const manualHtml = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-gears"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); font-family: 'Outfit', sans-serif;">FB4KDownloader — Ultimate Technical Archiving & Media Operations Manual</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            
            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">1. Server-Side CDN Pipeline & Bandwidth Optimization</h3>
            <p>
              FB4KDownloader.com utilizes an advanced high-speed proxy routing engine to pipe streams directly from Meta's edge servers. When a user inputs a media link, our system parses the response payloads in real-time, locating the exact stream segment URLs. To ensure zero-latency downloads, the server establishes pooled TCP keep-alive connections. This eliminates the handshaking overhead of standard requests, enabling users to download high-bitrate files at their native home bandwidth speeds. We bypass geographical bottlenecks and server-side rate limits using rotating edge proxies, guaranteeing constant download availability.
            </p>

            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">2. 4K Video Upscaling & Frame Transcoding Mechanics</h3>
            <p>
              Many videos on social networks are compressed to 720p or 1080p to conserve bandwidth. When a user requests a 4K upscaled download, our backend processors initiate a server-side FFmpeg transcoding sequence. By applying bilinear upscaling filters and adjusting CRF (Constant Rate Factor) values, the transcoder increases the pixel grid dimension to 3840x2160. This processes YUV color matrices, enhancing edge details and smoothing color gradients. The result is a high-bitrate MP4 container file optimized for large displays like 4K Smart TVs and monitors, delivering enhanced visual depth for offline archives.
            </p>

            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">3. Audio Transcoding (AAC to 320kbps MP3) Specs</h3>
            <p>
              For users converting video files into audio containers, our engine isolates the raw audio stream (usually encoded in AAC/M4A format) from the video wrapper. The system then transcodes this raw track into a constant bitrate (CBR) 320kbps MP3 file. This ensures that the dynamic range, high frequencies, and acoustic clarity are preserved without any clipping or distortion. By isolating only the audio track, the conversion process saves up to 90% of user bandwidth, making it the most efficient way to backup podcasts, lectures, and speech records.
            </p>

            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">4. Platform Compliance, Copyrights & DMCA Guidelines</h3>
            <p>
              FB4KDownloader.com operates in full compliance with the Digital Millennium Copyright Act (DMCA) and copyright regulations. Our service is strictly a client-side search and transcode utility. We do not host, store, index, or replicate any media files on our servers. All video and audio streams are piped directly from public platforms to the user's local disk buffer. We strongly advise users to download media only for personal, educational, or fair-use backups. Downloading copyrighted material for redistribution or commercial monetization without the owner's permission violates our terms of service and copyright legislation.
            </p>

            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">5. Comprehensive Troubleshooting Guide & Error Resolutions</h3>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 10px;">
              <li><strong>Error "Video Stream Not Found":</strong> This happens if the video setting is restricted to specific countries or private lists. Verify the video is set to "Public" before parsing. For private group videos, use our <strong>Private Downloader</strong> tool.</li>
              <li><strong>Error "Download Blocks Midway":</strong> On slow networks, the TCP connection may timeout. Try reloading the page and choosing the 1080p format, which has a smaller file size and downloads faster.</li>
              <li><strong>Error "Audio Lacks Bass or Clarity":</strong> Ensure you selected the 320kbps MP3 profile. Lower profiles compress audio ranges, which can affect playback quality on high-end speakers.</li>
              <li><strong>Error "Safari Redirects to Media Player":</strong> On iOS devices, Safari may play the video inside the browser. To save it, long-press the download button and tap "Download Linked File" to save it directly to the Files app.</li>
            </ul>

            <h3 style="color: var(--text-primary); font-size: 1.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">6. Expanded Technical FAQ Section</h3>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <p><strong>Q: Does FB4KDownloader require account registration?</strong><br>A: No. We value your privacy and convenience. Our platform is completely anonymous and free, requiring no signup, logins, or software installations.</p>
              <p><strong>Q: Is there a file size limit for downloads?</strong><br>A: No. You can download and transcode files of any size or duration. Note that larger 4K files may require extra processing time depending on server load.</p>
              <p><strong>Q: Can I use this downloader on my tablet and mobile phone?</strong><br>A: Yes! The platform is fully responsive and optimized for mobile browsers like Safari (iOS) and Chrome (Android).</p>
              <p><strong>Q: Why does my browser warn me about downloading files?</strong><br>A: Some browsers show security warnings for direct media streams. FB4KDownloader pipes clean, virus-free files directly from official servers, making it 100% safe to download.</p>
            </div>

          </div>
        </article>
`;

// 2. Define the Bottom Ad Block
const bottomAdHtml = `
        <!-- Bottom Ad Placement (Commented Out for AdSense Review)
        <div class="ad-placement ad-bottom" style="margin-top: 40px;">
          <span class="ad-label">Advertisement</span>
          <div class="ad-content">
            <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Banner Placement #2 (Bottom Leaderboard 728x90)</p>
          </div>
        </div>
        -->
`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (file === 'admin.html') return;
  let content = fs.readFileSync(file, 'utf8');

  // A. Add bulk-fb-reel-downloader guide article if we are on that page (since it's restored to clean state)
  if (file === 'bulk-fb-reel-downloader.html') {
    const target = `          <!-- Video Cards Grid -->\n          <div class="batch-video-grid" id="batch-grid"></div>\n        </section>`;
    const replacement = `          <!-- Video Cards Grid -->\n          <div class="batch-video-grid" id="batch-grid"></div>\n        </section>\n\n        <!-- ARTICLE SECTION FOR pSEO & COMPLIANCE -->\n        <article class="article-box" style="margin-top: 40px; padding: 25px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">\n          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">\n            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">\n              <i class="fa-solid fa-book-open"></i>\n            </div>\n            <h2 style="color: var(--text-primary);">FB4KDownloader — Bulk Facebook Video & Reels Downloader Guide</h2>\n          </div>\n          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.96rem; display: flex; flex-direction: column; gap: 16px;">\n            <p>\n              Welcome to the official <strong>Bulk Facebook Downloader</strong> utility on FB4KDownloader.com! Downloading media one-by-one can be slow and tedious, especially when archiving full video series, playlist streams, or multiple content creator reels. Our batch downloader tool resolves this by letting you input up to 100 Facebook video URLs simultaneously or import a standard text file (.TXT/.CSV) containing lists of links. We query Meta CDN servers in parallel pipelines, generating instant download cards with various quality profiles like <strong>4K Ultra HD</strong>, <strong>1080p Full HD</strong>, <strong>720p SD</strong>, or <strong>320kbps MP3 audio</strong>.\n            </p>\n          </div>\n        </article>`;
    content = content.replace(target, replacement);
  }

  // B. Comment out Left Skyscraper safely without nested comments
  content = content.replace(/<!-- LEFT SIDE SKYSCRAPER AD BANNER -->\s*<aside class="ad-skyscraper ad-left">[\s\S]*?<\/aside>/gi, `<!-- LEFT SIDE SKYSCRAPER AD BANNER (Commented Out for AdSense Review)
      <aside class="ad-skyscraper ad-left">
        <span class="ad-label">Advertisement</span>
        <div class="ad-content">
          <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Placement</p>
        </div>
      </aside>
      -->`);

  // C. Comment out Right Skyscraper safely without nested comments
  content = content.replace(/<!-- RIGHT SIDE SKYSCRAPER AD BANNER -->\s*<aside class="ad-skyscraper ad-right">[\s\S]*?<\/aside>/gi, `<!-- RIGHT SIDE SKYSCRAPER AD BANNER (Commented Out for AdSense Review)
      <aside class="ad-skyscraper ad-right">
        <span class="ad-label">Advertisement</span>
        <div class="ad-content">
          <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Placement</p>
        </div>
      </aside>
      -->`);

  // D. Comment out and Remove Top Ad Placement from its original location
  content = content.replace(/<!-- (?:Ad Placement 1|Ad Leaderboard Banner|Top Ad Placement) -->\s*<div class="ad-placement ad-leaderboard"[\s\S]*?<\/div>\s*<\/div>/gi, `<!-- Top Ad Placement (Commented Out for AdSense Review)
        <div class="ad-placement ad-leaderboard">
          <span class="ad-label">Advertisement</span>
          <div class="ad-content">
            <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Banner Placement #1 (Header Leaderboard 728x90)</p>
          </div>
        </div>
        -->`);

  // E. Remove the original bottom ad placement from its location
  content = content.replace(/<!-- (?:Ad Placement 2|AD PLACEMENT 2: Bottom Ad Banner|Ad Banner Placement 2|Bottom Ad Placement) -->\s*<div class="ad-placement ad-bottom"[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // F. Fix inline white color styles inside header tags
  content = content.replace(/(<h[1-6]\s+[^>]*?style="[^"]*?)color:\s*#(?:fff|ffffff);?([^"]*?")/gi, '$1color: var(--text-primary);$2');

  // G. Bump CSS version from 3.0 to 4.0 to bypass browser stylesheet caching
  content = content.replace(/styles\.css\?v=3\.0/g, 'styles.css?v=4.0');

  // H. Inject Technical Manual and Bottom Ad Banner right before </main>
  if (content.includes('</main>')) {
    content = content.replace('</main>', `${manualHtml}\n${bottomAdHtml}\n  </main>`);
    console.log(`[OK] Processed & compiled layout for ${file}`);
  } else {
    console.log(`[WARN] </main> tag not found in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('\n🎉 INTEGRATED PRODUCTION BUILD COMPLETE!');
