const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Pattern 1: Left Skyscraper
  content = content.replace(/(<!-- LEFT SIDE SKYSCRAPER AD BANNER -->\s*<aside class="ad-skyscraper ad-left">[\s\S]*?<\/aside>)/g, '<!-- $1 -->');
  
  // Pattern 2: Right Skyscraper
  content = content.replace(/(<!-- RIGHT SIDE SKYSCRAPER AD BANNER -->\s*<aside class="ad-skyscraper ad-right">[\s\S]*?<\/aside>)/g, '<!-- $1 -->');
  
  // Pattern 3: Top Ad Placement
  content = content.replace(/(<!-- Ad Placement 1 -->\s*<div class="ad-placement ad-leaderboard"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  content = content.replace(/(<!-- Ad Leaderboard Banner -->\s*<div class="ad-placement ad-leaderboard"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  content = content.replace(/(<!-- Top Ad Placement -->\s*<div class="ad-placement ad-leaderboard"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  
  // Pattern 4: Bottom Ad Placement
  content = content.replace(/(<!-- Ad Placement 2 -->\s*<div class="ad-placement ad-bottom"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  content = content.replace(/(<!-- AD PLACEMENT 2: Bottom Ad Banner -->\s*<div class="ad-placement ad-bottom"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  content = content.replace(/(<!-- Ad Banner Placement 2 -->\s*<div class="ad-placement ad-bottom"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');
  content = content.replace(/(<!-- Bottom Ad Placement -->\s*<div class="ad-placement ad-bottom"[\s\S]*?>[\s\S]*?<\/div>\s*<\/div>)/g, '<!-- $1 -->');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[OK] Commented ads in ${file}`);
});
