const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔄 STARTING REVERT TO DARK THEME PROTOCOL\n');

try {
  // 1. Revert styles.css to git version (Original Dark Theme)
  execSync('git checkout styles.css', { stdio: 'inherit' });
  console.log('[OK] Restored styles.css to original dark theme via Git.');

  // 2. Loop through all HTML files to bump version tag to 5.0 (forcing cache clear to dark stylesheet)
  const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

  files.forEach(file => {
    if (file === 'admin.html') return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace styles.css?v=4.0 with styles.css?v=5.0
    content = content.replace(/styles\.css\?v=4\.0/g, 'styles.css?v=5.0');
    content = content.replace(/styles\.css\?v=3\.0/g, 'styles.css?v=5.0');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`[OK] Bumped CSS version to 5.0 in ${file}`);
  });

  console.log('\n🎉 DARK THEME REVERT COMPLETED SUCCESSFULLY!');
} catch (err) {
  console.error('❌ Error during revert:', err.message);
}
