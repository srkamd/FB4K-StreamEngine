const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const blogDir = path.join(rootDir, 'blog');

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

function navHeader(title) {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | FB4KDownloader.com</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/styles.css?v=14.1">
</head>
<body class="min-h-screen pb-12 transition-colors duration-300">
  <!-- Navigation Header -->
  <header class="navbar">
    <div class="nav-container">
      <a href="/" class="brand-logo">
        <div class="logo-icon"><i class="fa-solid fa-cloud-arrow-down"></i></div>
        <div class="logo-text">FB4K<span>Downloader</span></div>
      </a>
      <div class="nav-links-wrapper">
        <ul class="nav-links">
          <li class="nav-item"><a href="/" class="nav-link"><i class="fa-solid fa-house"></i> Home</a></li>
          <li class="nav-item"><a href="/facebook-reels-downloader" class="nav-link"><i class="fa-solid fa-clapperboard"></i> Reels</a></li>
          <li class="nav-item"><a href="/fb-to-mp3" class="nav-link"><i class="fa-solid fa-music"></i> FB to MP3</a></li>
          <li class="nav-item"><a href="/bulk-fb-reel-downloader" class="nav-link"><i class="fa-solid fa-list-check"></i> Bulk</a></li>
          <li class="nav-item"><a href="/blog" class="nav-link active"><i class="fa-solid fa-newspaper"></i> Blog</a></li>
          <li class="nav-item">
            <a href="#" class="nav-link"><i class="fa-solid fa-compass"></i> Resources ▾</a>
            <div class="dropdown-menu">
              <a href="/how-to-use" class="dropdown-item"><i class="fa-solid fa-circle-question"></i> How to Use</a>
              <a href="/about" class="dropdown-item"><i class="fa-solid fa-circle-info"></i> About Us</a>
              <a href="/privacy" class="dropdown-item"><i class="fa-solid fa-user-shield"></i> Privacy Policy</a>
              <a href="/terms" class="dropdown-item"><i class="fa-solid fa-file-contract"></i> Terms of Service</a>
              <a href="/dmca" class="dropdown-item"><i class="fa-solid fa-scale-balanced"></i> DMCA Policy</a>
              <a href="/contact" class="dropdown-item"><i class="fa-regular fa-envelope"></i> Contact Us</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="nav-actions">
        <a href="https://chromewebstore.google.com/detail/fb4kdownloader-4k-faceboo/cmhlgochpmciomoodleglljgmoclhcif" target="_blank" class="btn-extension-nav">
          <i class="fa-brands fa-chrome"></i> Extension
        </a>
      </div>
    </div>
  </header>`;
}

function siteFooter() {
  return `  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col brand-col">
          <div class="brand-logo" style="margin-bottom: 16px;">
            <div class="logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; background: var(--primary-gradient); border-radius: 8px; color: #fff;"><i class="fa-solid fa-cloud-arrow-down"></i></div>
            <div class="logo-text" style="font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #fff; font-family: 'Outfit', sans-serif;">FB4K<span style="color: var(--neon-cyan);">Downloader</span></div>
          </div>
          <p class="brand-desc" style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px; max-width: 320px;">
            The internet's leading high-performance media archiving utility. Convert and download Facebook videos, reels, and audio lists in native 4K Ultra HD.
          </p>
          <div style="font-size: 0.82rem; color: var(--text-muted);">&copy; 2026 FB4KDownloader.com. All rights reserved.</div>
        </div>
        <div class="footer-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">Downloader Tools</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
            <li><a href="/" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;"><i class="fa-solid fa-house" style="color: var(--neon-cyan); margin-right: 6px;"></i> Facebook Downloader</a></li>
            <li><a href="/facebook-reels-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;"><i class="fa-solid fa-clapperboard" style="color: var(--neon-cyan); margin-right: 6px;"></i> Reels Downloader</a></li>
            <li><a href="/fb-to-mp3" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;"><i class="fa-solid fa-music" style="color: var(--neon-cyan); margin-right: 6px;"></i> FB to MP3 Audio</a></li>
            <li><a href="/facebook-private-video-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;"><i class="fa-solid fa-lock" style="color: var(--neon-cyan); margin-right: 6px;"></i> Private Downloader</a></li>
            <li><a href="/bulk-fb-reel-downloader" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;"><i class="fa-solid fa-list-check" style="color: var(--neon-cyan); margin-right: 6px;"></i> Bulk Downloader</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">Help & Resources</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
            <li><a href="/blog" style="color: var(--neon-cyan); text-decoration: none; font-size: 0.88rem; font-weight: 700;">Tech Blog</a></li>
            <li><a href="/how-to-use" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">How to Use</a></li>
            <li><a href="/about" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">About Us</a></li>
            <li><a href="/privacy" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">Privacy Policy</a></li>
            <li><a href="/terms" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">Terms of Service</a></li>
            <li><a href="/dmca" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">DMCA Policy</a></li>
            <li><a href="/contact" style="color: var(--text-secondary); text-decoration: none; font-size: 0.88rem;">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col status-col">
          <h4 style="color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">System Status</h4>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
              CDN Edge Nodes: <strong style="color: #fff; margin-left: 2px;">Active</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
              FFmpeg Upscaler: <strong style="color: #fff; margin-left: 2px;">Online</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
              API Engine v2.1: <strong style="color: #fff; margin-left: 2px;">Stable</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-top: 10px;">
              Author: <a href="/about" style="color: var(--neon-cyan); text-decoration: underline;">Shahrukh Ahmad</a>.<br>
              Support: <a href="mailto:support@fb4kdownloader.com" style="color: var(--neon-cyan); text-decoration: underline;">support@fb4kdownloader.com</a>
            </p>
          </div>
        </div>
      </div>
      <div class="footer-disclaimer" style="margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 25px; text-align: center; font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
        FB4KDownloader is an independent utility and is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Facebook. All trademarks are property of their respective owners.
      </div>
    </div>
  </footer>
  <script src="/app.js?v=2.1"></script>
</body>
</html>`;
}

function authorBio() {
  return `      <!-- Author Bio -->
      <div class="author-bio-card">
        <div class="author-bio-avatar"><i class="fa-solid fa-code"></i></div>
        <div class="author-bio-details">
          <h4>Compiled by Shahrukh Ahmad (SRK AMD)</h4>
          <p>
            Lead software engineer at FB4KDownloader.com. Dedicated to building open, client-side web media utilities, demystifying video engineering, and empowering digital creators with reliable archiving tools.
          </p>
        </div>
      </div>`;
}

console.log('Builder setup ready.');
