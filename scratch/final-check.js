const fs = require('fs');
const path = require('path');

console.log('🧪 RUNNING HIGH-PRECISION UNIQUE LINKING COMPLIANCE AUDIT\n');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let allClear = true;

const corePages = ['index.html', 'reels.html', 'mp3.html', 'private.html', 'bulk-fb-reel-downloader.html', 'how-to-use.html'];
const legalPages = ['about.html', 'contact.html', 'privacy.html', 'terms.html', 'dmca.html'];

files.forEach(file => {
  if (file === 'admin.html') return;
  const content = fs.readFileSync(file, 'utf8');

  // Strip comments
  const strippedContent = content.replace(/<!--[\s\S]*?-->/g, '');

  const adPlacementRegex = /<div class="ad-placement/gi;
  const adSkyscraperRegex = /<aside class="ad-skyscraper/gi;

  let filePassed = true;

  // 1. Ensure no active ad containers
  if (adPlacementRegex.test(strippedContent)) {
    console.log(`❌ FAIL: Uncommented ad-placement found in ${file}!`);
    allClear = false;
    filePassed = false;
  }
  if (adSkyscraperRegex.test(strippedContent)) {
    console.log(`❌ FAIL: Uncommented ad-skyscraper found in ${file}!`);
    allClear = false;
    filePassed = false;
  }

  // 2. Core pages must have unique internal links & manuals
  if (corePages.includes(file)) {
    if (!content.includes('INTERNAL LINKING HUB') || !content.includes('ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL')) {
      console.log(`❌ FAIL: Unique Manual or Linking Hub not found in core page ${file}`);
      allClear = false;
      filePassed = false;
    }
  }

  // 3. Legal pages must NOT have manuals or linking hubs
  if (legalPages.includes(file)) {
    if (content.includes('INTERNAL LINKING HUB') || content.includes('ULTIMATE TECHNICAL ARCHIVING & COMPLIANCE MANUAL')) {
      console.log(`❌ FAIL: Spam manual or links found in legal page ${file}`);
      allClear = false;
      filePassed = false;
    }
  }

  if (filePassed) {
    console.log(`✅ PASS: ${file} matches exact compliance rules.`);
  }
});

if (allClear) {
  console.log('\n🎉 ALL COMPLIANCE CHECKS PASSED! The project has unique content & internal links.');
} else {
  console.log('\n🚨 SOME COMPLIANCE CHECKS FAILED! Please check the errors above.');
}
