const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'admin.html' && f !== 'blog.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Check if header nav already has /blog
  if (!content.includes('href="/blog" class="nav-link"')) {
    // Find how-to-use nav item
    const howToUseRegex = /(<li class="nav-item">\s*<a href="\/how-to-use"[^>]*>[\s\S]*?<\/li>)/i;
    if (howToUseRegex.test(content)) {
      const blogNavItem = `\n          <li class="nav-item">\n            <a href="/blog" class="nav-link"><i class="fa-solid fa-book-open"></i> Blog</a>\n          </li>`;
      content = content.replace(howToUseRegex, `$1${blogNavItem}`);
      console.log(`[OK] Added Blog to header nav in ${file}`);
    } else {
      console.log(`[WARN] how-to-use item not found in ${file}`);
    }
  } else {
    console.log(`[SKIP] Already has /blog in header nav: ${file}`);
  }

  // 2. Check footer for Tech Blog & Guides link
  if (!content.includes('href="/blog"')) {
    const footerHelpRegex = /(<div class="footer-col">\s*<h4[^>]*>Help &amp; (?:Policies|Resources)<\/h4>\s*<ul[^>]*>)/i;
    if (footerHelpRegex.test(content)) {
      const blogFooterItem = `\n            <li><a href="/blog" style="color: var(--neon-cyan); text-decoration: none; font-size: 0.88rem; font-weight: 700; transition: var(--transition);">Tech Blog &amp; Guides</a></li>`;
      content = content.replace(footerHelpRegex, `$1${blogFooterItem}`);
      console.log(`[OK] Added Blog to footer in ${file}`);
    }
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('🎉 NAVIGATION UPDATE COMPLETED!');
