const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const regex = /style="([^"]*color:\s*#[^"]*)"/gi;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null && count < 20) {
  console.log(match[1]);
  count++;
}
