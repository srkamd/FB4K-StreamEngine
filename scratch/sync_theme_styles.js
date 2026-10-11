const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const themeCssPath = path.join(rootDir, 'theme.css');
const stylesCssPath = path.join(rootDir, 'styles.css');

let themeCss = fs.readFileSync(themeCssPath, 'utf8');

const bridgeCss = `
/* ==========================================================================
   🔗 COMPONENT ALIASES FOR ALL APPLICATION PAGES
   ========================================================================== */
.navbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255, 255, 255, .94);
  -webkit-backdrop-filter: saturate(1.4) blur(10px);
  backdrop-filter: saturate(1.4) blur(10px);
  border-bottom: 1px solid var(--line);
}
.nav-container { display: flex; align-items: center; justify-content: space-between; height: var(--header-h); max-width: var(--wrap); margin: 0 auto; padding: 0 clamp(16px, 4vw, 28px); }
.brand-logo { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; font-weight: 800; font-size: 1.15rem; letter-spacing: -.02em; }
.logo-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--brand); color: #fff; display: grid; place-items: center; font-size: 1rem; }
.logo-text { font-size: 1.15rem; font-weight: 800; color: var(--ink); }
.logo-text span { color: var(--brand); }
.nav-links { display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0; }
.nav-link { display: flex; align-items: center; gap: 6px; padding: 8px 12px; color: var(--ink); font-weight: 600; text-decoration: none; border-radius: 8px; font-size: .95rem; }
.nav-link:hover { background: var(--bg); color: var(--brand); }
.nav-link.active { background: var(--brand-soft); color: var(--brand-dark); }
.btn-extension-nav { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--brand); color: #fff; border-radius: var(--radius); font-weight: 650; font-size: .9rem; text-decoration: none; }
.btn-extension-nav:hover { background: var(--brand-dark); color: #fff; }

.hero-section { padding: clamp(36px, 7vw, 84px) 0 clamp(28px, 5vw, 56px); text-align: center; }
.hero-title { font-size: var(--fs-h1); letter-spacing: -.03em; margin-bottom: .4em; font-weight: 750; }
.hero-subtitle { max-width: 60ch; margin: 0 auto 28px; color: var(--muted); font-size: var(--fs-lg); }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; border-radius: 999px; background: var(--brand-soft); color: var(--brand-dark); font-size: var(--fs-sm); font-weight: 600; margin-bottom: 20px; }
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }

.downloader-box {
  max-width: 820px; margin: 0 auto; padding: clamp(12px, 2.4vw, 18px);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow);
  display: flex; gap: 10px;
}
.input-wrapper { flex: 1; position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 16px; color: var(--muted); pointer-events: none; }
.url-input {
  width: 100%; height: 56px; padding: 0 92px 0 46px;
  font: inherit; font-size: 16px; color: var(--ink); background: var(--bg); border: 1.5px solid transparent; border-radius: var(--radius);
}
.url-input:focus { outline: none; background: #fff; border-color: var(--brand); box-shadow: 0 0 0 4px var(--brand-soft); }
.btn-paste { position: absolute; right: 6px; top: 6px; height: 44px; padding: 0 14px; background: #fff; border: 1px solid var(--line); border-radius: 9px; font-weight: 650; font-size: .9rem; cursor: pointer; }
.btn-download {
  height: 56px; padding: 0 24px; background: var(--brand); color: #fff; border: none; border-radius: var(--radius);
  font-weight: 700; font-size: 1rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
}
.btn-download:hover { background: var(--brand-dark); }
.btn-info { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--line); border-radius: 999px; background: #fff; color: var(--muted); font-size: var(--fs-sm); text-decoration: none; font-weight: 550; }
.btn-info:hover { border-color: var(--brand); color: var(--brand-dark); }

.card-box {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg);
  padding: clamp(20px, 3vw, 32px); box-shadow: var(--shadow); margin-top: 24px;
}
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 14px; }
.card-header-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--brand-soft); color: var(--brand-dark); display: grid; place-items: center; font-size: 1.1rem; }
.card-header h2 { margin: 0; font-size: var(--fs-h2); }

.download-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 14px; }
.btn-quality {
  display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;
  border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); color: var(--ink); text-decoration: none; font-weight: 600;
}
.btn-quality:hover { border-color: var(--brand); background: var(--brand-soft); color: var(--brand-dark); }
.btn-quality.upscale-4k { background: var(--brand); color: #fff; border-color: transparent; }
.btn-quality.upscale-4k:hover { background: var(--brand-dark); color: #fff; }
.badge-4k, .badge-hd { padding: 2px 8px; border-radius: 999px; font-size: .75rem; background: rgba(255, 255, 255, .25); color: inherit; }

/* Responsive adjustments */
@media (max-width: 640px) {
  .downloader-box { flex-direction: column; }
  .btn-download { width: 100%; justify-content: center; }
  .nav-links-wrapper { display: none; }
}
`;

if (!themeCss.includes('.brand-logo')) {
  themeCss += '\n' + bridgeCss;
}

fs.writeFileSync(themeCssPath, themeCss, 'utf8');
fs.writeFileSync(stylesCssPath, themeCss, 'utf8');
console.log('✓ Synchronized theme.css and styles.css with full page compatibility!');
