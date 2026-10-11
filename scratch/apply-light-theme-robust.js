const fs = require('fs');

console.log('🧪 RUNNING ROBUST THEME CONVERSION PROCESS\n');

let css = fs.readFileSync('styles.css', 'utf8');

// Replacements map for exact variable overrides
const replacements = [
  { regex: /--bg-dark:\s*#090d16/gi, replace: '--bg-dark: #f8fafc' },
  { regex: /--bg-card:\s*rgba\(17,\s*24,\s*39,\s*0\.65\)/gi, replace: '--bg-card: rgba(255, 255, 255, 0.9)' },
  { regex: /--bg-card-solid:\s*#111827/gi, replace: '--bg-card-solid: #ffffff' },
  { regex: /--bg-input:\s*rgba\(15,\s*23,\s*42,\s*0\.6\)/gi, replace: '--bg-input: #ffffff' },
  { regex: /--bg-navbar:\s*rgba\(9,\s*13,\s*22,\s*0\.85\)/gi, replace: '--bg-navbar: rgba(255, 255, 255, 0.85)' },
  { regex: /--bg-dropdown:\s*rgba\(17,\s*24,\s*39,\s*0\.95\)/gi, replace: '--bg-dropdown: #ffffff' },
  
  { regex: /--neon-cyan:\s*#22d3ee/gi, replace: '--neon-cyan: #0284c7' },
  { regex: /--neon-blue:\s*#06b6d4/gi, replace: '--neon-blue: #0369a1' },
  { regex: /--neon-purple:\s*#6366f1/gi, replace: '--neon-purple: #4f46e5' },
  { regex: /--neon-pink:\s*#4f46e5/gi, replace: '--neon-pink: #c084fc' },
  { regex: /--neon-green:\s*#10b981/gi, replace: '--neon-green: #059669' },
  
  { regex: /--text-primary:\s*#f8fafc/gi, replace: '--text-primary: #0f172a' },
  { regex: /--text-secondary:\s*#94a3b8/gi, replace: '--text-secondary: #475569' },
  { regex: /--text-muted:\s*#64748b/gi, replace: '--text-muted: #64748b' },
  
  { regex: /--hero-title-gradient:\s*linear-gradient\(180deg,\s*#ffffff\s*0%,\s*#cbd5e1\s*100%\)/gi, replace: '--hero-title-gradient: linear-gradient(180deg, #0f172a 0%, #334155 100%)' },
  
  { regex: /--border-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.06\)/gi, replace: '--border-glass: rgba(15, 23, 42, 0.08)' },
  { regex: /--border-neon:\s*rgba\(99,\s*102,\s*241,\s*0\.25\)/gi, replace: '--border-neon: rgba(79, 70, 229, 0.12)' },
  { regex: /--border-purple:\s*rgba\(99,\s*102,\s*241,\s*0\.35\)/gi, replace: '--border-purple: rgba(79, 70, 229, 0.15)' },
  
  { regex: /--gradient-btn:\s*linear-gradient\(135deg,\s*#6366f1\s*0%,\s*#06b6d4\s*100%\)/gi, replace: '--gradient-btn: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)' },
  { regex: /--gradient-badge:\s*linear-gradient\(135deg,\s*#6366f1\s*0%,\s*#ec4899\s*100%\)/gi, replace: '--gradient-badge: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)' },
  
  { regex: /--shadow-card:\s*0\s*15px\s*35px\s*-12px\s*rgba\(0,\s*0,\s*0,\s*0\.5\),\s*0\s*2px\s*5px\s*rgba\(0,\s*0,\s*0,\s*0\.3\)/gi, replace: '--shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)' },
  { regex: /--shadow-glow:\s*0\s*0\s*35px\s*rgba\(99,\s*102,\s*241,\s*0\.15\)/gi, replace: '--shadow-glow: 0 0 35px rgba(79, 70, 229, 0.05)' },
  { regex: /--shadow-purple:\s*0\s*0\s*35px\s*rgba\(99,\s*102,\s*241,\s*0\.25\)/gi, replace: '--shadow-purple: 0 0 35px rgba(79, 70, 229, 0.08)' }
];

replacements.forEach(r => {
  css = css.replace(r.regex, r.replace);
});

// Update ambient glow opacity on body
css = css.replace('opacity: 0.15;', 'opacity: 0.04;');

// Update logo text gradients for light theme readability
css = css.replace('background: linear-gradient(135deg, #ffffff 30%, #cbd5e1 100%);', 'background: linear-gradient(135deg, #0f172a 30%, #334155 100%);');
css = css.replace('background: linear-gradient(135deg, #00f2fe 0%, #6366f1 100%);', 'background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);');

// Replace hardcoded transparent white colors in CSS with soft transparent slates
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/gi, 'rgba(15, 23, 42, 0.05)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/gi, 'rgba(15, 23, 42, 0.03)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.04\)/gi, 'rgba(15, 23, 42, 0.02)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.12\)/gi, 'rgba(15, 23, 42, 0.08)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.06\)/gi, 'rgba(15, 23, 42, 0.04)');

// Also make sure text inside forms, dropdowns, and details sections are readable
css += `
/* Light Theme Helper Overrides */
input::placeholder, textarea::placeholder {
  color: var(--text-muted) !important;
  opacity: 0.8;
}
.url-input {
  background: var(--bg-input) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-glass) !important;
}
.url-input:focus {
  border-color: var(--neon-cyan) !important;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1) !important;
}
.card-box {
  background: var(--bg-card) !important;
  border-color: var(--border-glass) !important;
}
.nav-link:hover, .nav-link.active {
  background: rgba(15, 23, 42, 0.04) !important;
}
.nav-link.active {
  color: var(--neon-cyan) !important;
  background: rgba(2, 132, 199, 0.08) !important;
  border-color: rgba(2, 132, 199, 0.2) !important;
}
.dropdown-menu {
  background: var(--bg-dropdown) !important;
  border: 1px solid var(--border-glass) !important;
  box-shadow: var(--shadow-card) !important;
}
.dropdown-item {
  color: var(--text-secondary) !important;
}
.dropdown-item:hover {
  background: rgba(15, 23, 42, 0.03) !important;
  color: var(--text-primary) !important;
}
.faq-question {
  color: var(--text-primary) !important;
}
.faq-answer {
  color: var(--text-secondary) !important;
  border-top-color: var(--border-glass) !important;
}
`;

fs.writeFileSync('styles.css', css, 'utf8');
console.log('[OK] Completed robust CSS rewrite for Light Theme.');
