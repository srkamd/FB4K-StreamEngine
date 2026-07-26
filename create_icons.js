const fs = require('fs');
const path = require('path');

// 1x1 base64 png fallback
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const extDir = path.join(__dirname, 'extension');
['icon16.png', 'icon48.png', 'icon128.png'].forEach(filename => {
  fs.writeFileSync(path.join(extDir, filename), Buffer.from(base64Png, 'base64'));
});
console.log('Icons generated!');
