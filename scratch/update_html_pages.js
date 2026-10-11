const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Bottom Nav HTML generator
function getBottomNav(activeTab) {
  return `
  <!-- Mobile App-Style Bottom Navigation Bar (Thumb Friendly) -->
  <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
    <a href="/" class="mobile-nav-item ${activeTab === 'home' ? 'active' : ''}">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>
    <a href="/facebook-reels-downloader" class="mobile-nav-item ${activeTab === 'reels' ? 'active' : ''}">
      <i class="fa-solid fa-clapperboard"></i>
      <span>Reels</span>
    </a>
    <a href="/fb-to-mp3" class="mobile-nav-item ${activeTab === 'mp3' ? 'active' : ''}">
      <i class="fa-solid fa-music"></i>
      <span>MP3</span>
    </a>
    <a href="/bulk-fb-reel-downloader" class="mobile-nav-item ${activeTab === 'bulk' ? 'active' : ''}">
      <i class="fa-solid fa-list-check"></i>
      <span>Bulk</span>
    </a>
    <a href="/blog" class="mobile-nav-item ${activeTab === 'blog' ? 'active' : ''}">
      <i class="fa-solid fa-newspaper"></i>
      <span>Blog</span>
    </a>
  </nav>
`;
}

// 3-Step Quick Guide Strip
const quickStepsHtml = `
          <!-- 3-Step Mobile Friendly Guide Strip -->
          <div class="mobile-quick-steps">
            <div class="quick-step-pill">
              <span class="step-num">1</span>
              <i class="fa-solid fa-share-nodes"></i>
              <span>FB <strong>Share</strong></span>
            </div>
            <div class="quick-step-pill">
              <span class="step-num">2</span>
              <i class="fa-solid fa-copy"></i>
              <span><strong>Copy Link</strong></span>
            </div>
            <div class="quick-step-pill">
              <span class="step-num">3</span>
              <i class="fa-solid fa-cloud-arrow-down"></i>
              <span><strong>Paste & Save</strong></span>
            </div>
          </div>
`;

// Mobile Save Tip inside Result Card
const saveTipHtml = `
                <div class="mobile-save-tip">
                  <i class="fa-solid fa-circle-info"></i>
                  <span><strong>Mobile Phone Tip:</strong> Tap quality above. Video will save directly to your phone's Gallery or Downloads folder.</span>
                </div>
`;

// PWA Meta Tags
const pwaHeadTags = `
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#030712">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="FB4K">
`;

// 1. UPDATE index.html
function updateIndexHtml() {
  const filePath = path.join(rootDir, 'index.html');
  let content = fs.readFileSync(filePath, 'utf8');

  // Add PWA tags in head if missing
  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaHeadTags}\n</head>`);
  }

  // Add Clear button in form if missing
  if (!content.includes('id="btn-clear-url"')) {
    content = content.replace(
      '<button id="btn-paste"',
      '<button id="btn-clear-url" class="btn-clear-url" type="button" title="Clear input" aria-label="Clear input"><i class="fa-solid fa-xmark"></i></button>\n              <button id="btn-paste"'
    );
  }

  // Add 3-step quick steps if missing
  if (!content.includes('mobile-quick-steps')) {
    content = content.replace('</form>', `</form>\n${quickStepsHtml}`);
  }

  // Add mobile-save-tip in result card if missing
  if (!content.includes('mobile-save-tip')) {
    content = content.replace('</div>\n              </div>\n            </div>\n          </div>', `${saveTipHtml}\n              </div>\n            </div>\n          </div>\n        </div>`);
  }

  // Add Guide Collapsible Toggle
  if (!content.includes('guide-toggle-bar') && content.includes('<article id="guide-article"')) {
    const articleStart = content.indexOf('<article id="guide-article"');
    const headerEnd = content.indexOf('</div>', content.indexOf('<div class="card-header">', articleStart)) + 6;
    const articleEnd = content.indexOf('</article>', articleStart);

    if (articleStart !== -1 && headerEnd !== -1 && articleEnd !== -1) {
      const headerPart = content.substring(articleStart, headerEnd);
      const bodyPart = content.substring(headerEnd, articleEnd);
      const rest = content.substring(articleEnd);

      const newArticleSection = headerPart + `
          <!-- Collapsible Guide Toggle for Mobile View -->
          <div class="guide-toggle-bar">
            <button type="button" class="btn-guide-toggle" id="btn-guide-toggle">
              <span><i class="fa-solid fa-book-open"></i> Read Complete Guide & Specifications</span>
              <i class="fa-solid fa-chevron-down chevron"></i>
            </button>
          </div>
          <div class="guide-body-collapsible" id="guide-body-collapsible">` + bodyPart + `
          </div>`;

      content = content.substring(0, articleStart) + newArticleSection + rest;
    }
  }

  // Add Bottom Nav if missing
  if (!content.includes('mobile-bottom-nav')) {
    content = content.replace('</body>', `${getBottomNav('home')}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ index.html successfully upgraded for mobile-first experience!');
}

// 2. UPDATE reels.html
function updateReelsHtml() {
  const filePath = path.join(rootDir, 'reels.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaHeadTags}\n</head>`);
  }
  if (!content.includes('id="btn-clear-url"')) {
    content = content.replace(
      '<button id="btn-paste"',
      '<button id="btn-clear-url" class="btn-clear-url" type="button" title="Clear input" aria-label="Clear input"><i class="fa-solid fa-xmark"></i></button>\n              <button id="btn-paste"'
    );
  }
  if (!content.includes('mobile-quick-steps')) {
    content = content.replace('</form>', `</form>\n${quickStepsHtml}`);
  }
  if (!content.includes('mobile-save-tip')) {
    content = content.replace('</div>\n              </div>\n            </div>\n          </div>', `${saveTipHtml}\n              </div>\n            </div>\n          </div>\n        </div>`);
  }
  if (!content.includes('mobile-bottom-nav')) {
    content = content.replace('</body>', `${getBottomNav('reels')}\n</body>`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ reels.html successfully upgraded!');
}

// 3. UPDATE mp3.html
function updateMp3Html() {
  const filePath = path.join(rootDir, 'mp3.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaHeadTags}\n</head>`);
  }
  if (!content.includes('id="btn-clear-url"')) {
    content = content.replace(
      '<button id="btn-paste"',
      '<button id="btn-clear-url" class="btn-clear-url" type="button" title="Clear input" aria-label="Clear input"><i class="fa-solid fa-xmark"></i></button>\n              <button id="btn-paste"'
    );
  }
  if (!content.includes('mobile-quick-steps')) {
    content = content.replace('</form>', `</form>\n${quickStepsHtml}`);
  }
  if (!content.includes('mobile-save-tip')) {
    content = content.replace('</div>\n              </div>\n            </div>\n          </div>', `${saveTipHtml}\n              </div>\n            </div>\n          </div>\n        </div>`);
  }
  if (!content.includes('mobile-bottom-nav')) {
    content = content.replace('</body>', `${getBottomNav('mp3')}\n</body>`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ mp3.html successfully upgraded!');
}

// 4. UPDATE bulk-fb-reel-downloader.html
function updateBulkHtml() {
  const filePath = path.join(rootDir, 'bulk-fb-reel-downloader.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaHeadTags}\n</head>`);
  }
  if (!content.includes('mobile-bottom-nav')) {
    content = content.replace('</body>', `${getBottomNav('bulk')}\n</body>`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ bulk-fb-reel-downloader.html successfully upgraded!');
}

// 5. UPDATE blog.html
function updateBlogHtml() {
  const filePath = path.join(rootDir, 'blog.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaHeadTags}\n</head>`);
  }
  if (!content.includes('mobile-bottom-nav')) {
    content = content.replace('</body>', `${getBottomNav('blog')}\n</body>`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ blog.html successfully upgraded!');
}

// 6. UPDATE other utility pages (private.html, about, contact, etc.)
['private.html', 'about.html', 'contact.html', 'how-to-use.html', 'privacy.html', 'terms.html', 'dmca.html'].forEach(page => {
  const p = path.join(rootDir, page);
  if (fs.existsSync(p)) {
    let html = fs.readFileSync(p, 'utf8');
    if (!html.includes('rel="manifest"')) {
      html = html.replace('</head>', `${pwaHeadTags}\n</head>`);
    }
    if (!html.includes('mobile-bottom-nav')) {
      html = html.replace('</body>', `${getBottomNav('home')}\n</body>`);
    }
    fs.writeFileSync(p, html, 'utf8');
    console.log(`✓ ${page} updated with bottom nav!`);
  }
});

// Run all
updateIndexHtml();
updateReelsHtml();
updateMp3Html();
updateBulkHtml();
updateBlogHtml();
