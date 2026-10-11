const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const popunderSnippet = `  <!-- Popunder Ad Script -->
  <script src="https://pl31769223.profitableratecpmnetwork.com/24/c2/65/24c265c87577d30b381ddafb430d03e7.js"></script>`;

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if script already exists
  if (content.includes('24c265c87577d30b381ddafb430d03e7.js')) {
    console.log(`- Already present: ${path.basename(filePath)}`);
    return;
  }

  // Insert right before </head>
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${popunderSnippet}\n</head>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Added popunder to: ${path.relative(rootDir, filePath)}`);
  } else {
    console.warn(`! No </head> found in: ${filePath}`);
  }
}

// 1. Process root HTML files
const rootFiles = fs.readdirSync(rootDir);
rootFiles.forEach(file => {
  if (file.endsWith('.html')) {
    processHtmlFile(path.join(rootDir, file));
  }
});

// 2. Process blog HTML files
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir);
  blogFiles.forEach(file => {
    if (file.endsWith('.html')) {
      processHtmlFile(path.join(blogDir, file));
    }
  });
}

console.log('\nAll HTML pages processed successfully!');
