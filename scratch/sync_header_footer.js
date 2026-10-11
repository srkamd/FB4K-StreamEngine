const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const professionalFooterHtml = `  <!-- Executive Corporate Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        
        <!-- Column 1: Brand & Trust Badges -->
        <div class="footer-col brand-col">
          <a href="/" class="brand-logo" style="margin-bottom: 16px;">
            <div class="logo-icon">
              <i class="fa-solid fa-cloud-arrow-down"></i>
            </div>
            <div class="logo-text">FB4K<span>Downloader</span></div>
          </a>
          <p class="brand-desc">
            The internet's leading high-performance media archiving utility. Convert and download Facebook videos, reels, and audio lists in native 4K Ultra HD.
          </p>
          <div class="footer-trust-badges">
            <span class="trust-badge-pill"><i class="fa-solid fa-shield-halved"></i> 256-Bit SSL</span>
            <span class="trust-badge-pill"><i class="fa-solid fa-bolt"></i> 100% Free & Safe</span>
            <span class="trust-badge-pill"><i class="fa-solid fa-lock"></i> No Logs Policy</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            &copy; 2026 FB4KDownloader.com. All rights reserved.
          </div>
        </div>

        <!-- Column 2: Downloader Tools -->
        <div class="footer-col">
          <h4>Downloader Tools</h4>
          <ul>
            <li><a href="/"><i class="fa-solid fa-house"></i> Facebook Downloader</a></li>
            <li><a href="/facebook-reels-downloader"><i class="fa-solid fa-clapperboard"></i> Reels Downloader</a></li>
            <li><a href="/fb-to-mp3"><i class="fa-solid fa-music"></i> FB to MP3 Audio</a></li>
            <li><a href="/facebook-private-video-downloader"><i class="fa-solid fa-lock"></i> Private Downloader</a></li>
            <li><a href="/bulk-fb-reel-downloader"><i class="fa-solid fa-list-check"></i> Bulk Downloader</a></li>
          </ul>
        </div>

        <!-- Column 3: Help & Policies -->
        <div class="footer-col">
          <h4>Help & Policies</h4>
          <ul>
            <li><a href="/how-to-use">How to Use</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/dmca">DMCA Disclaimer</a></li>
          </ul>
        </div>

        <!-- Column 4: System Status & Edge Nodes -->
        <div class="footer-col status-col">
          <h4>System Status</h4>
          <div>
            <div class="status-item">
              <span class="status-dot-pulse"></span>
              CDN Edge Nodes: <strong style="color: #ffffff; margin-left: 4px;">Active (100%)</strong>
            </div>
            <div class="status-item">
              <span class="status-dot-pulse"></span>
              4K FFmpeg Engine: <strong style="color: #ffffff; margin-left: 4px;">Online</strong>
            </div>
            <div class="status-item">
              <span class="status-dot-pulse"></span>
              API v2.4 Latency: <strong style="color: #ffffff; margin-left: 4px;">12ms (Optimal)</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-top: 14px;">
              Designed by <a href="/about" style="color: var(--accent-cyan);">SRK AMD</a>.<br>
              Support: <a href="mailto:support@fb4kdownloader.com" style="color: var(--accent-cyan);">support@fb4kdownloader.com</a>
            </p>
          </div>
        </div>

      </div>

      <!-- Legal Disclaimer -->
      <div class="footer-disclaimer">
        FB4KDownloader is an independent utility and is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Facebook. All trademarks and logos are the property of their respective owners.
      </div>
    </div>
  </footer>`;

function replaceFooter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const footerStart = content.indexOf('<footer');
  const footerEnd = content.indexOf('</footer>');

  if (footerStart !== -1 && footerEnd !== -1) {
    content = content.substring(0, footerStart) + professionalFooterHtml + content.substring(footerEnd + 9);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Replaced footer in: ${path.relative(rootDir, filePath)}`);
  }
}

// 1. Root HTML files
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootFiles.forEach(f => replaceFooter(path.join(rootDir, f)));

// 2. Blog HTML files
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(f => replaceFooter(path.join(blogDir, f)));
}

console.log('\nAll pages updated with Executive Corporate Footer!');
