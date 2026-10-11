const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function bumpVersion(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/styles\.css(?:\?v=[a-zA-Z0-9\._\-]+)?/g, 'styles.css?v=15.0-light');
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Root files
fs.readdirSync(rootDir).filter(f => f.endsWith('.html')).forEach(f => bumpVersion(path.join(rootDir, f)));

// 2. Blog files
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).forEach(f => bumpVersion(path.join(blogDir, f)));
}

console.log('✓ Cache-busting CSS version updated to styles.css?v=15.0-light across all pages!');
