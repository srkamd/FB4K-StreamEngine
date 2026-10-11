const fs = require('fs');

console.log('🚀 BUMPING CSS VERSION TO v12.0 FOR CACHE BYPASS\n');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (file === 'admin.html') return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/styles\.css\?v=[0-9.]+/g, 'styles.css?v=12.0');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`[OK] Bumped stylesheet version to v12.0 in ${file}`);
});

console.log('\n🎉 STYLESHEET CACHE BYPASS BUMP COMPLETED!');
