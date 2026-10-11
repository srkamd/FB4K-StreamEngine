const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');

let openBraces = 0;
let lines = css.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces < 0) {
      console.log(`❌ ERROR: Unmatched closing brace at line ${i + 1}`);
      console.log(line);
      process.exit(1);
    }
  }
}

if (openBraces !== 0) {
  console.log(`❌ ERROR: Mismatched braces! Open braces left: ${openBraces}`);
} else {
  console.log('✅ PASS: CSS braces are perfectly balanced!');
}
