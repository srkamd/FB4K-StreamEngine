const fs = require('fs');
const path = require('path');

console.log('🧪 RUNNING THEME CONVERSION & AD BANNER RELOCATION PROTOCOL\n');

// 1. Update styles.css with premium Light Theme variables and properties
let css = fs.readFileSync('styles.css', 'utf8');

// Replace dark theme variables with light theme variables in :root
const darkVariables = `:root {
  /* Color Tokens matching MyLogoQR.com */
  --bg-dark: #090d16;
  --bg-card: rgba(17, 24, 39, 0.65);
  --bg-card-solid: #111827;
  --bg-input: rgba(15, 23, 42, 0.6);
  --bg-navbar: rgba(9, 13, 22, 0.85);
  --bg-dropdown: rgba(17, 24, 39, 0.95);

  --neon-cyan: #22d3ee;
  --neon-blue: #06b6d4;
  --neon-purple: #6366f1;
  --neon-pink: #4f46e5;
  --neon-green: #10b981;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --hero-title-gradient: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);

  --border-glass: rgba(255, 255, 255, 0.06);
  --border-neon: rgba(99, 102, 241, 0.25);
  --border-purple: rgba(99, 102, 241, 0.35);

  --gradient-btn: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  --gradient-badge: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);

  --shadow-card: 0 15px 35px -12px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 35px rgba(99, 102, 241, 0.15);
  --shadow-purple: 0 0 35px rgba(99, 102, 241, 0.25);`;

const lightVariables = `:root {
  /* Color Tokens - Modern Light Theme */
  --bg-dark: #f1f5f9;
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-solid: #ffffff;
  --bg-input: #ffffff;
  --bg-navbar: rgba(255, 255, 255, 0.85);
  --bg-dropdown: #ffffff;

  --neon-cyan: #0284c7;
  --neon-blue: #0369a1;
  --neon-purple: #4f46e5;
  --neon-pink: #c084fc;
  --neon-green: #059669;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  --hero-title-gradient: linear-gradient(180deg, #0f172a 0%, #334155 100%);

  --border-glass: rgba(15, 23, 42, 0.08);
  --border-neon: rgba(79, 70, 229, 0.12);
  --border-purple: rgba(79, 70, 229, 0.15);

  --gradient-btn: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%);
  --gradient-badge: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);

  --shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05);
  --shadow-glow: 0 0 35px rgba(79, 70, 229, 0.05);
  --shadow-purple: 0 0 35px rgba(79, 70, 229, 0.08);`;

css = css.replace(darkVariables, lightVariables);

// Update ambient glow opacity on body
css = css.replace('opacity: 0.15;', 'opacity: 0.05;');

// Update logo text gradients for light theme readability
css = css.replace('background: linear-gradient(135deg, #ffffff 30%, #cbd5e1 100%);', 'background: linear-gradient(135deg, #0f172a 30%, #334155 100%);');
css = css.replace('background: linear-gradient(135deg, #00f2fe 0%, #6366f1 100%);', 'background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);');

// Replace hardcoded transparent white colors in CSS with soft transparent slates
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'rgba(15, 23, 42, 0.05)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'rgba(15, 23, 42, 0.03)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.04\)/g, 'rgba(15, 23, 42, 0.02)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.12\)/g, 'rgba(15, 23, 42, 0.08)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.06\)/g, 'rgba(15, 23, 42, 0.04)');

fs.writeFileSync('styles.css', css, 'utf8');
console.log('[OK] Updated styles.css with light theme values');

// 2. Loop through all HTML files to relocate the bottom ad and fix text colors
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (file === 'admin.html') return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix header text colors: Replace inline color: #fff or #ffffff with color: var(--text-primary)
  content = content.replace(/(<h[1-6]\s+[^>]*?style="[^"]*?)color:\s*#(?:fff|ffffff);?([^"]*?")/gi, '$1color: var(--text-primary);$2');

  // Relocate bottom ad banner: find commented bottom ad and move it to the absolute bottom of main content column
  const bottomAdRegex = /(<!--\s*<!--\s*(?:Ad Placement 2|AD PLACEMENT 2: Bottom Ad Banner|Ad Banner Placement 2|Bottom Ad Placement)[\s\S]*?<\/div>\s*-->\s*-->|<!--\s*(?:Ad Placement 2|AD PLACEMENT 2: Bottom Ad Banner|Ad Banner Placement 2|Bottom Ad Placement)[\s\S]*?<\/div>\s*-->)/i;
  
  const match = content.match(bottomAdRegex);
  if (match) {
    const bottomAdBlock = match[0];
    
    // Remove the ad block from its original position
    content = content.replace(bottomAdRegex, '');
    
    // Insert the ad block right before </main> (absolute bottom of the main content alignment)
    if (content.includes('</main>')) {
      content = content.replace('</main>', `${bottomAdBlock}\n  </main>`);
      console.log(`[OK] Relocated bottom ad banner to bottom in ${file}`);
    }
  } else {
    console.log(`[WARN] Bottom ad banner block not found or already relocated in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('\n🎉 THEME CONVERSION & BANNER RELOCATION COMPLETED!');
