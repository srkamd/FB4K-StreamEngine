const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 RUNNING INTEGRATED HUMANIZED SEO & COMPLIANCE PIPELINE\n');

// 1. Revert HTML files to clean HEAD state first
try {
  execSync('git checkout -- .', { stdio: 'inherit' });
  console.log('[OK] Reset workspace to clean original state.');
} catch (e) {
  console.warn('[WARN] Git checkout failed, proceeding with local files.');
}

// 2. Define unique humanized content blocks for the 6 core pages
const indexManual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-gears"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Facebook Video Archiving Guide — Safe Offline Saving</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              Let's face it—most online video downloaders are a nightmare to use. They push popups, trick you into clicking malware links, and slow down your browser. We built FB4KDownloader.com because we wanted a clean, fast, and secure utility to archive public social media clips without the annoying spyware redirects. Our tool works directly with the content delivery networks (CDNs) to grab the raw MP4 file streams, letting you save them at your network's full speed.
            </p>
            <p>
              When a Facebook video gets uploaded, it is automatically compressed into multiple quality levels (from 240p up to 1080p or even 4K). Our extractor parses the source code of the page to find these hidden CDN source links. If you select our upscaled 4K profile, we apply bilinear filtering to upscale the pixel resolution grid, which makes it look crisp and clear on large smart TV displays and monitors.
            </p>
            <p>
              We don't ask you to create an account, log in, or install any fishy executables on your computer. Everything runs smoothly on standard web protocols. We recommend saving files for personal backups, editing practice, or offline educational projects.
            </p>

            <h4 style="color: #fff; font-weight: 800;">Quick Downloader Troubleshooting Tips</h4>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 10px;">
              <li><strong>Video plays instead of downloading?</strong> This is common on iOS Safari. Just long-press the download button and choose "Download Linked File".</li>
              <li><strong>Got an invalid URL error?</strong> Make sure you are copying the direct link to the post. If the video is in a private group, use our specialized "Private Downloader" page.</li>
              <li><strong>Is the stream loading slowly?</strong> If the server load is high, choose the 1080p format. It is much smaller and saves bandwidth.</li>
            </ul>
          </div>
        </article>
`;

const reelsManual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-clapperboard"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Facebook Reels Extraction & Aspect Ratio Guidelines</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              Short-form vertical video has taken over our feeds. However, saving Facebook Reels for content curation or offline archives can be incredibly frustrating. Most tools either cut off the audio or add huge watermarks. Our Facebook Reels Downloader is optimized specifically for the 9:16 vertical viewport. It fetches the original high-bitrate video stream from Meta CDN servers, preserving the fast-paced framing and visual flow.
            </p>
            <p>
              Because Reels are designed for quick mobile viewing, they are heavily compressed. Our system lets you grab the clean, unwatermarked source files. If you are an editor working on compilations or reaction clips, having access to the raw MP4 stream saves you from losing quality during screen-recording.
            </p>
            <p>
              Always make sure to respect the original creators. We recommend downloading Reels only for creative reference, reactions, or personal storage. Never re-upload clips without giving credit to the author.
            </p>

            <h4 style="color: #fff; font-weight: 800;">Reels Downloading FAQ</h4>
            <p><strong>Q: Why does the video quality look blurry at first?</strong><br>A: Facebook uses adaptive bitrate streaming. Our tool grabs both the SD and HD streams. Choose the HD link for the highest quality copy.</p>
            <p><strong>Q: Can I save reels on my phone?</strong><br>A: Absolutely. Simply paste the link in your Chrome or Safari browser on Android/iOS, and tap download. It goes straight to your device storage.</p>
          </div>
        </article>
`;

const mp3Manual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-music"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Facebook to MP3 Audio Extraction Manual</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              If you want to save a lecture, podcast, or live musical performance from a Facebook video, downloading the full video is a massive waste of storage. Our Facebook to MP3 converter isolates the audio track directly from the video wrapper. We run a clean transcoding sequence to save the sound stream into a constant 320kbps MP3 container.
            </p>
            <p>
              Unlike online converters that ruin the sound quality, we prioritize acoustic clarity. The high frequencies, speech dynamics, and audio range are preserved without clipping or distortion. The conversion happens on our secure servers, meaning you don't need to download any heavy software to your local machine.
            </p>
            <p>
              Please note that this tool is meant for educational archiving, public speeches, and royalty-free music backups. We do not support the piracy of commercial music tracks or copyrighted media.
            </p>

            <h4 style="color: #fff; font-weight: 800;">Audio Extraction FAQ</h4>
            <p><strong>Q: What is the difference between 320kbps and lower bitrates?</strong><br>A: 320kbps offers the highest audio fidelity available for MP3 files. Lower bitrates (like 128kbps) compress the audio frequencies, making the sound tinny on high-end speakers.</p>
            <p><strong>Q: How long does the audio conversion take?</strong><br>A: Typically under 5 to 10 seconds. The server extracts the audio track and streams it directly to your browser.</p>
          </div>
        </article>
`;

const privateManual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Facebook Private Group Video Saver Guide</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              Many Facebook videos are uploaded inside closed groups, restricted pages, or private profiles. Standard scraper engines cannot read these links because they do not have login access to your account. To solve this, our tool uses a local client-side extraction model. By manually copying the page HTML source code, you feed the authorized HTML data (which your browser has already fetched since you are logged in) directly into our local parsing script.
            </p>
            <p>
              Think of it this way: we never ask for your Facebook password or email. The page source parsing runs entirely inside your browser's local memory. We do not transmit or store your HTML code, cookies, or account sessions on our servers, ensuring your account remains 100% secure.
            </p>
            <p>
              Since private group videos are shared under privacy expectations, please respect this boundary. Only download private videos if you have permission from the original uploader or group administrator.
            </p>

            <h4 style="color: #fff; font-weight: 800;">Private Downloader Tips</h4>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 10px;">
              <li><strong>How to open page source on mobile?</strong> Mobile browsers usually don't support viewing page source code easily. We recommend using a desktop browser (like Chrome or Edge) to copy the source code via <code>Ctrl + U</code>.</li>
              <li><strong>Paste fails?</strong> Make sure you copy the entire page source (press <code>Ctrl + A</code> and copy). If the code is incomplete, the parser won't find the media streams.</li>
            </ul>
          </div>
        </article>
`;

const bulkManual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-list"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Facebook Bulk Download Queue & Rate Limits</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              Downloading twenty or thirty videos one-by-one is tedious. If you are backing up an entire educational course, a series of webinars, or research clips, our Bulk Downloader lets you paste a list of URLs or import a standard text file (.TXT). Our engine processes the links in parallel queues to save your time.
            </p>
            <p>
              When you submit the list, the client script validates the format of each link. It then establishes parallel network connections to parse the metadata, descriptions, and durations, building a visual download queue. You can then download selected items or let the browser save files sequentially.
            </p>
            <p>
              To avoid getting your IP address temporarily throttled by Facebook, we recommend limiting your bulk lists to 50 links per batch. This ensures smooth processing without triggering platform rate limits.
            </p>

            <h4 style="color: #fff; font-weight: 800;">Bulk Downloader Guide</h4>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 10px;">
              <li><strong>How to format the TXT file?</strong> Simply place one Facebook URL per line in a notepad document, save it, and upload it using our "Import .TXT File" button.</li>
              <li><strong>Direct folder saving:</strong> By default, your browser will ask where to save each file. You can select a target folder to speed up sequential downloads.</li>
            </ul>
          </div>
        </article>
`;

const howtoManual = `
        <!-- ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL -->
        <article class="article-box" style="margin-top: 40px; padding: 30px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid var(--border-glass); padding-bottom: 15px;">
            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif;">Device Compatibility Guide & Browser Extension Setup</h2>
          </div>
          
          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; display: flex; flex-direction: column; gap: 20px;">
            <p>
              FB4KDownloader.com is designed to work across all major platforms, but different operating systems handle media downloads in their own way. Here is a quick reference to make sure you get the best experience:
            </p>
            
            <h4 style="color: #fff; font-weight: 800;">1. Windows & MacOS Desktop</h4>
            <p>
              Downloads on desktop are the most straightforward. Tapping the HD or SD download buttons will directly trigger your browser's default download manager. For Chrome users, we also offer a lightweight **Chrome Extension** that adds instant download buttons directly underneath videos while you browse Facebook.
            </p>

            <h4 style="color: #fff; font-weight: 800;">2. Apple iOS (iPhone & iPad)</h4>
            <p>
              iOS has strict sandboxing rules. If you tap download in Safari, the video may play inside the Safari media player instead of saving. To bypass this, **long-press the download button** and select **"Download Linked File"**. The video will download in the background and can be accessed inside the iOS "Files" app.
            </p>

            <h4 style="color: #fff; font-weight: 800;">3. Google Android</h4>
            <p>
              Android Chrome handles downloads seamlessly. Tapping any download button will save the file directly to your local downloads folder, and you will see a progress bar in your notification drawer.
            </p>
          </div>
        </article>
`;

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

  // A. Add bulk-fb-reel-downloader guide article if we are on that page
  if (file === 'bulk-fb-reel-downloader.html') {
    const target = `          <!-- Video Cards Grid -->\n          <div class="batch-video-grid" id="batch-grid"></div>\n        </section>`;
    const replacement = `          <!-- Video Cards Grid -->\n          <div class="batch-video-grid" id="batch-grid"></div>\n        </section>\n\n        <!-- ARTICLE SECTION FOR pSEO & COMPLIANCE -->\n        <article class="article-box" style="margin-top: 40px; padding: 25px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">\n          <div class="card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">\n            <div class="card-header-icon" style="background: var(--primary-gradient); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">\n              <i class="fa-solid fa-book-open"></i>\n            </div>\n            <h2 style="color: #fff;">FB4KDownloader — Bulk Facebook Video & Reels Downloader Guide</h2>\n          </div>\n          <div style="color: var(--text-secondary); line-height: 1.8; font-size: 0.96rem; display: flex; flex-direction: column; gap: 16px;">\n            <p>\n              Welcome to the official <strong>Bulk Facebook Downloader</strong> utility on FB4KDownloader.com! Downloading media one-by-one can be slow and tedious, especially when archiving full video series, playlist streams, or multiple content creator reels. Our batch downloader tool resolves this by letting you input up to 100 Facebook video URLs simultaneously or import a standard text file (.TXT/.CSV) containing lists of links. We query Meta CDN servers in parallel pipelines, generating instant download cards with various quality profiles like <strong>4K Ultra HD</strong>, <strong>1080p Full HD</strong>, <strong>720p SD</strong>, or <strong>320kbps MP3 audio</strong>.\n            </p>\n          </div>\n        </article>`;
    content = content.replace(target, replacement);
  }

  // B. Comment out Left Skyscraper safely using Tight Tag Match
  content = content.replace(/(?:<!--[\s\S]{1,100}?-->\s*)?<aside class="ad-skyscraper ad-left"[^>]*?>[\s\S]{1,300}?<\/aside>/gi, `<!-- Left Skyscraper (Commented Out for AdSense Review)
      <aside class="ad-skyscraper ad-left">
        <span class="ad-label">Advertisement</span>
        <div class="ad-content">
          <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Placement</p>
        </div>
      </aside>
      -->`);

  // C. Comment out Right Skyscraper safely using Tight Tag Match
  content = content.replace(/(?:<!--[\s\S]{1,100}?-->\s*)?<aside class="ad-skyscraper ad-right"[^>]*?>[\s\S]{1,300}?<\/aside>/gi, `<!-- Right Skyscraper (Commented Out for AdSense Review)
      <aside class="ad-skyscraper ad-right">
        <span class="ad-label">Advertisement</span>
        <div class="ad-content">
          <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Placement</p>
        </div>
      </aside>
      -->`);

  // D. Comment out Top Ad Placement safely using Tight Tag Match
  content = content.replace(/(?:<!--[\s\S]{1,100}?-->\s*)?<div class="ad-placement ad-leaderboard"[^>]*?>[\s\S]{1,300}?<\/div>\s*<\/div>/gi, `<!-- Top Ad Placement (Commented Out for AdSense Review)
        <div class="ad-placement ad-leaderboard">
          <span class="ad-label">Advertisement</span>
          <div class="ad-content">
            <p class="ad-placeholder-text"><i class="fa-solid fa-rectangle-ad"></i> Ad Banner Placement #1</p>
          </div>
        </div>
        -->`);

  // E. Replace bottom ad banner & inject custom unique manuals depending on the page
  const centerContentEndPattern = /(?:<!--[\s\S]{1,100}?-->\s*)?<div class="ad-placement ad-bottom"[^>]*?>[\s\S]{1,300}?<\/div>\s*<\/div>\s*<\/div>/gi;

  let pageManual = null;
  if (file === 'index.html') pageManual = indexManual;
  else if (file === 'reels.html') pageManual = reelsManual;
  else if (file === 'mp3.html') pageManual = mp3Manual;
  else if (file === 'private.html') pageManual = privateManual;
  else if (file === 'bulk-fb-reel-downloader.html') pageManual = bulkManual;

  if (pageManual) {
    if (content.match(centerContentEndPattern)) {
      content = content.replace(centerContentEndPattern, `
        \n\n        ${pageManual}\n\n        ${bottomAdHtml}\n      </div>`);
      console.log(`[OK] Injected UNIQUE manual inside center-content column in ${file}`);
    } else {
      console.log(`[WARN] Center content closing structure not matched in ${file}`);
    }
  } else {
    // This is for how-to-use.html (which doesn't have skyscrapers)
    if (file === 'how-to-use.html') {
      content = content.replace(/(?:<!--[\s\S]{1,100}?-->\s*)?<div class="ad-placement ad-bottom"[^>]*?>[\s\S]{1,300}?<\/div>\s*<\/div>/gi, '');
      content = content.replace('</main>', `\n    ${howtoManual}\n\n    ${bottomAdHtml}\n  </main>`);
      console.log(`[OK] Injected UNIQUE manual inside main column in how-to-use.html`);
    } else {
      // For the 5 static/legal pages, we do NOT inject any manual!
      // But we still comment out their bottom ad placement safely!
      content = content.replace(centerContentEndPattern, `
        \n\n        ${bottomAdHtml}\n      </div>`);
      console.log(`[OK] Commented bottom ad in static/legal page: ${file}`);
    }
  }

  // F. Bump version parameter to 7.0
  content = content.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=7.0');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('\n🎉 INTEGRATED PRECISION UNIQUE BUILD COMPLETE!');
