const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function cleanHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace inline white color text that would be invisible on light background
  content = content.replace(/color:\s*#fff(?:fff)?;/gi, 'color: var(--text-primary);');
  content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.8\d*\);/gi, 'color: var(--text-primary);');
  content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.6\d*\);/gi, 'color: var(--text-secondary);');
  content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.4\d*\);/gi, 'color: var(--text-muted);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[1-5]\);/gi, 'background: var(--bg-card-subtle);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[6-9]\);/gi, 'background: var(--bg-card-subtle);');
  content = content.replace(/border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.0[5-9]\);/gi, 'border: 1px solid var(--border-color);');
  content = content.replace(/border:\s*1px\s+solid\s+var\(--border-glass\);/gi, 'border: 1px solid var(--border-color);');
  content = content.replace(/border-color:\s*var\(--border-neon\);/gi, 'border-color: var(--border-color);');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Cleaned inline styles in: ${path.relative(rootDir, filePath)}`);
}

// Clean root HTML files
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootFiles.forEach(f => cleanHtmlFile(path.join(rootDir, f)));

// Clean blog HTML files
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(f => cleanHtmlFile(path.join(blogDir, f)));
}

console.log('\nAll HTML files successfully cleaned for Light Theme!');
