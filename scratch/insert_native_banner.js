const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const nativeBannerHtml = `
        <!-- Native Banner Ad Placement (4:1 Widget) -->
        <div class="native-ad-wrapper">
          <span class="native-ad-label">Sponsored</span>
          <script async="async" data-cfasync="false" src="https://pl31769225.profitableratecpmnetwork.com/09adca24625a59ec0f9e926dfead7c41/invoke.js"></script>
          <div id="container-09adca24625a59ec0f9e926dfead7c41"></div>
        </div>
`;

// 1. Tool Pages: Place between </section> and <article or <section
const toolPages = ['index.html', 'reels.html', 'mp3.html', 'private.html', 'bulk-fb-reel-downloader.html'];

toolPages.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('09adca24625a59ec0f9e926dfead7c41')) {
    console.log(`- Already present: ${file}`);
    return;
  }

  // Look for end of hero section or downloader section
  if (html.includes('</section>')) {
    html = html.replace('</section>', `</section>\n${nativeBannerHtml}`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Inserted Native Banner in: ${file}`);
  }
});

// 2. Blog Hub (blog.html)
const blogHubPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHubPath)) {
  let blogHub = fs.readFileSync(blogHubPath, 'utf8');
  if (!blogHub.includes('09adca24625a59ec0f9e926dfead7c41')) {
    if (blogHub.includes('</section>')) {
      blogHub = blogHub.replace('</section>', `</section>\n${nativeBannerHtml}`);
      fs.writeFileSync(blogHubPath, blogHub, 'utf8');
      console.log('✓ Inserted Native Banner in: blog.html');
    }
  }
}

// 3. Blog Articles
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  const articleFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  articleFiles.forEach(file => {
    const artPath = path.join(blogDir, file);
    let artHtml = fs.readFileSync(artPath, 'utf8');
    if (!artHtml.includes('09adca24625a59ec0f9e926dfead7c41')) {
      // Place right before article footer or author bio card
      if (artHtml.includes('<div class="author-bio-card">')) {
        artHtml = artHtml.replace('<div class="author-bio-card">', `${nativeBannerHtml}\n          <div class="author-bio-card">`);
      } else if (artHtml.includes('</article>')) {
        artHtml = artHtml.replace('</article>', `${nativeBannerHtml}\n</article>`);
      }
      fs.writeFileSync(artPath, artHtml, 'utf8');
      console.log(`✓ Inserted Native Banner in article: ${file}`);
    }
  });
}

// 4. Append native banner styling to styles.css
const cssPath = path.join(rootDir, 'styles.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('.native-ad-wrapper')) {
    const nativeCss = `
/* Native Banner Ad Container */
.native-ad-wrapper {
  margin: 28px auto;
  max-width: 920px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 242, 254, 0.15);
  border-radius: var(--radius-xl);
  padding: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.native-ad-label {
  display: block;
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
  font-weight: 700;
}
`;
    fs.appendFileSync(cssPath, nativeCss, 'utf8');
    console.log('✓ Added .native-ad-wrapper styles to styles.css');
  }
}

console.log('\nAll Native Banner placements completed!');
