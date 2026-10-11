const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 RUNNING COMPLIANT INTERNAL LINKING, FOOTER UPGRADE & HUMANIZED CONTENT PIPELINE\n');

// 1. Reset workspace to clean original state
try {
  execSync('git checkout -- .', { stdio: 'inherit' });
  console.log('[OK] Reset workspace to clean original state.');
} catch (e) {
  console.warn('[WARN] Git checkout failed, proceeding with local files.');
}

// 2. Define page-specific Internal Linking Hub HTML
const indexLinks = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-nodes" style="color: var(--neon-cyan);"></i> Explore Our Specialized Facebook Media Extraction Tools
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            We have developed a full suite of client-side downloader tools to help you backup social media content under different conditions. Explore the links below to find the specific tool for your archiving needs:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-reels-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Facebook Reels Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Need to archive short-form vertical videos? Our Reels Downloader extracts pristine vertical MP4 streams from Meta's CDNs, keeping the native 9:16 mobile aspect ratio intact.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/fb-to-mp3" style="color: var(--neon-cyan); text-decoration: underline;">Facebook to MP3 Converter</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                If you only need the audio backing track, lectures, or music sets, save bandwidth by routing to our MP3 tool to convert video files directly into constant 320kbps MP3 tracks.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-private-video-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Private Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                For videos shared inside private groups or friends-only timelines, use our local HTML source code parser to extract download streams securely without sharing password data.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/bulk-fb-reel-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Bulk Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Avoid the tedious work of copying links one-by-one. Paste a full list of video links or drag and drop a TXT notepad file to process up to 100 files simultaneously.
              </p>
            </div>

          </div>
        </section>
`;

const reelsLinks = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-link" style="color: var(--neon-cyan);"></i> Need More Media Tools? Check Our Suite
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            We provide a complete suite of browser-based downloader utilities. Depending on your current file format or privacy requirements, you can switch to any of our related tools:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/" style="color: var(--neon-cyan); text-decoration: underline;">Standard Facebook Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                For standard horizontal posts, watch streams, and video uploads, use our main homepage tool to grab resolutions up to 1080p Full HD.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/fb-to-mp3" style="color: var(--neon-cyan); text-decoration: underline;">Audio Extractor (FB to MP3)</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Want to extract just the music backing track, speech, or sound loops from a reel? Hop over to our specialized MP3 conversion tool to get a high-quality 320kbps audio track.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-private-video-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Private Post Grabber</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                If the reel is uploaded inside a private group or shared with a custom private list, use our local HTML parser tool to fetch the file source.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/bulk-fb-reel-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Batch Reels Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                To save full series of reels in one single run, try our bulk input downloader, which accepts up to 100 links concurrently.
              </p>
            </div>

          </div>
        </section>
`;

const mp3Links = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-link" style="color: var(--neon-cyan);"></i> Contextual Audio & Video Extraction Suite
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            If you need to archive video formats or download files in batch queues, we have customized utilities designed for these tasks. Visit any page below:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/" style="color: var(--neon-cyan); text-decoration: underline;">Standard Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                To save full video streams (with high-definition video frames) instead of raw MP3 tracks, return to our standard download page.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-reels-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Reels Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                For saving short-form clips in native 9:16 dimensions, check our reels extractor page to grab vertical MP4 streams directly.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-private-video-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Private Audio Extractor</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                If the audio track is embedded inside a private group video, use our local page source parser to fetch the video code and isolate the track.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/bulk-fb-reel-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Bulk Audio Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                If you have multiple links for audio backups, run a batch query to convert up to 100 links into MP3s simultaneously.
              </p>
            </div>

          </div>
        </section>
`;

const privateLinks = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-link" style="color: var(--neon-cyan);"></i> Safe Navigation & Related Downloader Tools
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            If the video you are trying to archive is public, you don't need to go through the copy-paste source process. Use any of our faster tools:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/" style="color: var(--neon-cyan); text-decoration: underline;">Standard Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                For any standard, publicly visible Facebook videos, simply paste the direct URL in our main homepage downloader for instant results.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-reels-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Vertical Reels Extractor</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Save public vertical reels without watermarks. Ideal for content editors working with 9:16 aspect ratios.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/fb-to-mp3" style="color: var(--neon-cyan); text-decoration: underline;">High-Fidelity audio (MP3)</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                To extract only the vocal track, podcast, or background speech from a video, route to our MP3 converter page.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/bulk-fb-reel-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Batch List Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                If you have a queue of multiple public videos, process them simultaneously using our bulk importer tool.
              </p>
            </div>

          </div>
        </section>
`;

const bulkLinks = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-link" style="color: var(--neon-cyan);"></i> Internal Extraction Utilities for Media Backups
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            If you need single video links or require local parsing for restricted page sources, explore our specific features listed below:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/" style="color: var(--neon-cyan); text-decoration: underline;">Standard Home Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Quickly download individual standard video clips or watch streams at maximum 1080p resolution.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-reels-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Vertical Reels Grabber</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Download individual Facebook Reels in high-definition vertical MP4 format for mobile layouts.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/fb-to-mp3" style="color: var(--neon-cyan); text-decoration: underline;">FB to MP3 Converter</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Extract lectures, audio backing tracks, or background music loops at pristine 320kbps bitrate.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-private-video-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Private Video Extractor</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                To process multiple links from private groups, use our private downloader to parse source code files locally.
              </p>
            </div>

          </div>
        </section>
`;

const howtoLinks = `
        <!-- INTERNAL LINKING HUB & SEARCH ENGINE OPTIMIZATION CONTAINER -->
        <section class="card-box" style="margin-top: 30px; padding: 25px; border-color: var(--border-color); background: var(--bg-card);">
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-link" style="color: var(--neon-cyan);"></i> Quick Access to Media Downloader Suite
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
            Once you understand how to save media on your specific device, check our specialized tools to start downloading:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/" style="color: var(--neon-cyan); text-decoration: underline;">Home Video Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Archive standard post videos, watch files, and news feeds in original high-definition streams.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-reels-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Reels Downloader</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Extract vertical format reels without watermarks, optimized for Android, iOS, and PC.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/fb-to-mp3" style="color: var(--neon-cyan); text-decoration: underline;">FB to MP3 audio</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Extract vocals and speech tracks from live recordings and webinars directly into MP3 files.
              </p>
            </div>

            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">
                <a href="/facebook-private-video-downloader" style="color: var(--neon-cyan); text-decoration: underline;">Private Video Parser</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Save restricted-access videos from closed groups safely by pasting their HTML source code.
              </p>
            </div>

          </div>
        </section>
`;

// 3. Define the Technical Manuals
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

// 4. Define the Premium Multi-Column Footer HTML
const premiumFooterHtml = `
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        
        <!-- Column 1: Brand Info -->
        <div class="footer-col brand-col">
          <div class="brand-logo" style="margin-bottom: 16px;">
            <div class="logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; background: var(--primary-gradient); border-radius: 8px; color: #fff;">
              <i class="fa-solid fa-cloud-arrow-down"></i>
            </div>
            <div class="logo-text" style="font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #fff; font-family: 'Outfit', sans-serif;">FB4K<span style="color: var(--neon-cyan);">Downloader</span></div>
          </div>
          <p class="brand-desc" style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px; max-width: 320px;">
            The internet\'s leading high-performance media archiving utility. Convert and download Facebook videos, reels, and audio lists in native 4K Ultra HD.
          </p>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            &copy; 2026 FB4KDownloader.com. All rights reserved.
          </div>
        </div>

        <!-- Column 2: Downloader Tools -->
        <div class="footer-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">Downloader Tools</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
            <li><a href="/" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);"><i class="fa-solid fa-house" style="font-size: 0.8rem; margin-right: 6px; color: var(--neon-cyan);"></i> Facebook Downloader</a></li>
            <li><a href="/facebook-reels-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);"><i class="fa-solid fa-clapperboard" style="font-size: 0.8rem; margin-right: 6px; color: var(--neon-cyan);"></i> Reels Downloader</a></li>
            <li><a href="/fb-to-mp3" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);"><i class="fa-solid fa-music" style="font-size: 0.8rem; margin-right: 6px; color: var(--neon-cyan);"></i> FB to MP3 Audio</a></li>
            <li><a href="/facebook-private-video-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);"><i class="fa-solid fa-lock" style="font-size: 0.8rem; margin-right: 6px; color: var(--neon-cyan);"></i> Private Downloader</a></li>
            <li><a href="/bulk-fb-reel-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);"><i class="fa-solid fa-list-check" style="font-size: 0.8rem; margin-right: 6px; color: var(--neon-cyan);"></i> Bulk Downloader</a></li>
          </ul>
        </div>

        <!-- Column 3: Help & Policies -->
        <div class="footer-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">Help & Policies</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
            <li><a href="/how-to-use" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">How to Use</a></li>
            <li><a href="/about" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">About Us</a></li>
            <li><a href="/contact" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">Contact Us</a></li>
            <li><a href="/privacy" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">Privacy Policy</a></li>
            <li><a href="/terms" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">Terms of Service</a></li>
            <li><a href="/dmca" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem; transition: var(--transition);">DMCA Disclaimer</a></li>
          </ul>
        </div>

        <!-- Column 4: System Status -->
        <div class="footer-col status-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">System Status</h4>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse 1.8s infinite;"></span>
              CDN Edge Nodes: <strong style="color: #fff; margin-left: 2px;">Active</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse 1.8s infinite;"></span>
              FFmpeg Upscaler: <strong style="color: #fff; margin-left: 2px;">Online</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse 1.8s infinite;"></span>
              API Engine v2.1: <strong style="color: #fff; margin-left: 2px;">Stable</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-top: 10px;">
              Designed by <a href="/about" style="color: var(--neon-cyan); text-decoration: underline;">SRK AMD</a>.<br>
              Support: <a href="mailto:support@fb4kdownloader.com" style="color: var(--neon-cyan); text-decoration: underline;">support@fb4kdownloader.com</a>
            </p>
          </div>
        </div>

      </div>

      <!-- Legal Disclaimer -->
      <div class="footer-disclaimer" style="margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 25px; text-align: center; font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
        FB4KDownloader is an independent utility and is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Facebook. All trademarks are property of their respective owners.
      </div>
    </div>
  </footer>
`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

// G. Read, update, and write styles.css with the new premium footer CSS rules
let cssContent = fs.readFileSync('styles.css', 'utf8');

// Match old footer styles block and replace it
const oldCssPattern = /\/\* Footer \*\/[\s\S]*?\.footer-bottom\s*\{[\s\S]*?\}/gi;
const newCssContent = `/* Footer Styles Upgrade */
.footer {
  background: #02050c;
  border-top: 1px solid var(--border-glass);
  padding: 60px 0 calc(30px + env(safe-area-inset-bottom));
  margin-top: auto;
  color: var(--text-muted);
}

.footer-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 40px;
}

.footer-col h4 {
  font-family: 'Outfit', sans-serif;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col ul li a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.88rem;
  transition: var(--transition);
}

.footer-col ul li a:hover {
  color: var(--neon-cyan) !important;
  padding-left: 4px;
}

.footer-disclaimer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 20px;
}

.footer-bottom {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 25px;
    text-align: center;
  }
  .brand-col, .status-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-col ul li a:hover {
    padding-left: 0;
  }
}

/* GDPR Cookie Consent Banner Styling */
.cookie-banner {
  position: fixed;
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 900px;
  background: rgba(11, 19, 41, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 254, 0.06);
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  z-index: 9999;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.cookie-banner.show {
  bottom: 24px;
}

.cookie-text a {
  color: var(--neon-cyan);
  text-decoration: underline;
}

.btn-cookie-accept {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  padding: 10px 22px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.15);
}

.btn-cookie-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.3);
}

@media (max-width: 768px) {
  .cookie-banner {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    gap: 16px;
    bottom: -220px;
  }
  .cookie-banner.show {
    bottom: 16px;
  }
  .btn-cookie-accept {
    width: 100%;
  }
}
`;

cssContent = cssContent.replace(oldCssPattern, newCssContent);
cssContent = cssContent.replace(
  /\.center-content\s*\{\s*flex:\s*1;\s*min-width:\s*0;\s*\}/g,
  `.center-content {
  flex: 1;
  min-width: 0;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}`
);
fs.writeFileSync('styles.css', cssContent, 'utf8');
console.log('[OK] Wrote premium multi-column footer CSS and center-content max-width to styles.css.');

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

  // E. Replace bottom ad banner & inject page-specific unique internal linking hub & manuals
  const centerContentEndPattern = /(?:<!--[\s\S]{1,100}?-->\s*)?<div class="ad-placement ad-bottom"[^>]*?>[\s\S]{1,300}?<\/div>\s*<\/div>\s*<\/div>/gi;

  let pageManual = null;
  let pageLinks = null;

  if (file === 'index.html') {
    pageManual = indexManual;
    pageLinks = indexLinks;
  } else if (file === 'reels.html') {
    pageManual = reelsManual;
    pageLinks = reelsLinks;
  } else if (file === 'mp3.html') {
    pageManual = mp3Manual;
    pageLinks = mp3Links;
  } else if (file === 'private.html') {
    pageManual = privateManual;
    pageLinks = privateLinks;
  } else if (file === 'bulk-fb-reel-downloader.html') {
    pageManual = bulkManual;
    pageLinks = bulkLinks;
  }

  if (pageManual && pageLinks) {
    if (content.match(centerContentEndPattern)) {
      content = content.replace(centerContentEndPattern, `
        \n\n        ${pageLinks}\n\n        ${pageManual}\n\n        ${bottomAdHtml}\n      </div>`);
    }
  } else {
    // For how-to-use.html (which doesn't have skyscrapers)
    if (file === 'how-to-use.html') {
      content = content.replace(/(?:<!--[\s\S]{1,100}?-->\s*)?<div class="ad-placement ad-bottom"[^>]*?>[\s\S]{1,300}?<\/div>\s*<\/div>/gi, '');
      content = content.replace('</main>', `\n    ${howtoLinks}\n\n    ${howtoManual}\n\n    ${bottomAdHtml}\n  </main>`);
    } else {
      // For the 5 static/legal pages, we do NOT inject any manual or links, just comment out ads!
      content = content.replace(centerContentEndPattern, `
        \n\n        ${bottomAdHtml}\n      </div>`);
    }
  }

  // G. Replace old footer with new premium multi-column footer HTML
  content = content.replace(/<footer class="footer">[\s\S]*?<\/footer>/gi, premiumFooterHtml);

  // Bump version parameter to 8.0
  content = content.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=8.0');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[OK] Upgraded footer to premium multi-column layout in ${file}`);
});

console.log('\n🎉 ALL FOOTERS & CSS STYLING SUCCESSFULLY INTEGRATED!');
