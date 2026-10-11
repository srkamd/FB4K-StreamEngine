const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function updateMetaInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/content="#030712"/g, 'content="#ffffff"');
  content = content.replace(/var\(--bg-dark\)/g, 'var(--bg-body)');
  content = content.replace(/var\(--bg-card\)/g, 'var(--bg-surface)');
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Root files
fs.readdirSync(rootDir).filter(f => f.endsWith('.html')).forEach(f => {
  updateMetaInFile(path.join(rootDir, f));
});

// 2. Blog files
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).forEach(f => {
    updateMetaInFile(path.join(blogDir, f));
  });
}

console.log('✓ Meta tags and background variables updated across all HTML files!');
