const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'admin.html' && f !== 'guides.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('href="/guides"')) {
    const howToMatch = /(<li class="nav-item">\s*<a href="\/how-to-use"[^>]*>[\s\S]*?<\/li>)/i;
    if (howToMatch.test(content)) {
      const guidesItem = `\n          <li class="nav-item">\n            <a href="/guides" class="nav-link"><i class="fa-solid fa-layer-group"></i> Master Guides</a>\n          </li>`;
      content = content.replace(howToMatch, `$1${guidesItem}`);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[OK] Added /guides nav to ${file}`);
    }
  }
});
console.log('Done!');
