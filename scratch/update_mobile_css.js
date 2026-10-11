const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Normalize line endings for replacement
const isCRLF = css.includes('\r\n');
const newline = isCRLF ? '\r\n' : '\n';

// 1. Add Helper components (.btn-clear-url, .mobile-quick-steps, .mobile-save-tip, .mobile-bottom-nav, .guide-accordion)
const helperStyles = `
/* ==========================================================================
   📱 MOBILE-FIRST & APP-LIKE UI COMPONENTS
   ========================================================================== */

/* URL Clear (✕) Button */
.btn-clear-url {
  position: absolute;
  right: 98px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  z-index: 5;
}

.btn-clear-url:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fff;
}

.btn-clear-url.show {
  display: flex;
}

/* Quick 3-Step Visual Strip */
.mobile-quick-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 18px auto 0;
  max-width: 650px;
}

.quick-step-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: var(--transition);
}

.quick-step-pill:hover {
  background: rgba(0, 242, 254, 0.06);
  border-color: rgba(0, 242, 254, 0.25);
}

.quick-step-pill .step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 242, 254, 0.15);
  color: var(--neon-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.quick-step-pill i {
  color: var(--neon-cyan);
  font-size: 0.9rem;
}

/* Mobile Save Tip inside Result Card */
.mobile-save-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(0, 242, 254, 0.06);
  border: 1px dashed rgba(0, 242, 254, 0.3);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: 0.82rem;
  margin-top: 16px;
  line-height: 1.45;
  text-align: left;
}

.mobile-save-tip i {
  color: var(--neon-cyan);
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Guide Article Collapsible Toggle on Mobile */
.guide-toggle-bar {
  display: none;
}

.guide-body-collapsible {
  display: block;
}

/* Mobile App Bottom Navigation Bar (Hidden on desktop) */
.mobile-bottom-nav {
  display: none;
}
`;

// Mobile-specific responsive rules
const mobileResponsiveRules = `
/* ==========================================================================
   📱 ENHANCED MOBILE RESPONSIVE ENGINE (< 768px & < 480px)
   ========================================================================== */

@media (max-width: 768px) {
  body {
    padding-bottom: 74px !important; /* Space for fixed bottom navigation bar */
  }

  /* Compact Top Navbar on Mobile */
  .navbar {
    padding: 10px 16px !important;
  }

  .nav-container {
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .nav-links-wrapper {
    display: none !important; /* Replaced by bottom nav for clean native app look! */
  }

  .nav-actions {
    display: none !important;
  }

  .brand-logo {
    gap: 10px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  /* Fixed Native App-Style Bottom Navigation Bar */
  .mobile-bottom-nav {
    display: flex !important;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 62px;
    background: rgba(9, 14, 28, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0, 242, 254, 0.2);
    z-index: 9999;
    align-items: center;
    justify-content: space-around;
    padding: 0 8px calc(env(safe-area-inset-bottom, 0px) + 2px);
    box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.6);
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 700;
    gap: 4px;
    flex: 1;
    height: 100%;
    padding: 6px 0;
    transition: var(--transition);
    position: relative;
    border-radius: 8px;
  }

  .mobile-nav-item i {
    font-size: 1.15rem;
    transition: transform 0.2s ease, color 0.2s ease;
  }

  .mobile-nav-item:hover,
  .mobile-nav-item:active {
    color: var(--neon-cyan);
  }

  .mobile-nav-item.active {
    color: var(--neon-cyan);
  }

  .mobile-nav-item.active i {
    transform: translateY(-2px);
    filter: drop-shadow(0 0 8px rgba(0, 242, 254, 0.8));
  }

  .mobile-nav-item.active::after {
    content: '';
    position: absolute;
    top: 0;
    width: 24px;
    height: 3px;
    background: var(--gradient-btn);
    border-radius: 0 0 3px 3px;
    box-shadow: 0 0 10px rgba(0, 242, 254, 0.9);
  }

  /* Compact Hero Typography on Mobile */
  .hero-section {
    padding: 16px 0 10px !important;
    margin: 10px auto 25px !important;
  }

  .hero-badge {
    font-size: 0.75rem !important;
    padding: 4px 14px !important;
    margin-bottom: 12px !important;
  }

  .hero-title {
    font-size: 1.85rem !important;
    line-height: 1.25 !important;
    margin-bottom: 8px !important;
  }

  .hero-subtitle {
    font-size: 0.88rem !important;
    margin-bottom: 18px !important;
    line-height: 1.45 !important;
  }

  /* Downloader Input Box on Mobile */
  .downloader-box {
    flex-direction: column !important;
    padding: 10px !important;
    border-radius: var(--radius-xl) !important;
    gap: 10px !important;
  }

  .input-wrapper {
    min-width: 100% !important;
  }

  .url-input {
    font-size: 16px !important;
    padding: 15px 75px 15px 44px !important;
    border-radius: var(--radius-lg) !important;
  }

  .input-icon {
    left: 14px !important;
    font-size: 1.1rem !important;
  }

  .btn-paste {
    right: 8px !important;
    padding: 7px 12px !important;
    font-size: 0.78rem !important;
  }

  .btn-clear-url {
    right: 78px !important;
    width: 26px !important;
    height: 26px !important;
  }

  .btn-download {
    width: 100% !important;
    padding: 15px !important;
    font-size: 1rem !important;
    justify-content: center !important;
    border-radius: var(--radius-lg) !important;
  }

  /* 3-Step Quick Pills on Mobile */
  .mobile-quick-steps {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 8px !important;
    margin: 14px 0 6px !important;
  }

  .quick-step-pill {
    padding: 8px 4px !important;
    flex-direction: column !important;
    text-align: center !important;
    gap: 4px !important;
    border-radius: 12px !important;
    font-size: 0.72rem !important;
    line-height: 1.2 !important;
  }

  .quick-step-pill .step-num {
    margin-bottom: 2px !important;
  }

  /* Hero Actions */
  .hero-actions {
    flex-direction: column !important;
    width: 100% !important;
    gap: 8px !important;
  }

  .hero-actions .btn-info {
    width: 100% !important;
    padding: 10px 14px !important;
    font-size: 0.82rem !important;
  }

  /* Result Card on Mobile */
  .result-card {
    padding: 16px !important;
    border-radius: var(--radius-xl) !important;
    margin-top: 20px !important;
  }

  .result-content {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  .thumbnail-box {
    width: 100% !important;
    max-height: 220px !important;
    border-radius: 12px !important;
  }

  .download-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .btn-quality {
    min-height: 52px !important;
    padding: 14px 18px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    justify-content: space-between !important;
    grid-column: span 1 !important;
  }

  .btn-quality i {
    font-size: 1.1rem !important;
  }

  /* Collapsible Guide Article on Mobile */
  .guide-toggle-bar {
    display: flex !important;
    width: 100% !important;
    margin-bottom: 12px !important;
  }

  .btn-guide-toggle {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid var(--border-neon) !important;
    color: #fff !important;
    padding: 14px 18px !important;
    border-radius: var(--radius-lg) !important;
    font-size: 0.92rem !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    transition: var(--transition) !important;
  }

  .btn-guide-toggle i.chevron {
    transition: transform 0.3s ease !important;
  }

  .btn-guide-toggle.expanded i.chevron {
    transform: rotate(180deg) !important;
  }

  .guide-body-collapsible {
    max-height: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
    transition: max-height 0.4s ease, opacity 0.3s ease !important;
  }

  .guide-body-collapsible.open {
    max-height: 10000px !important;
    opacity: 1 !important;
  }

  /* Toast floating above bottom navigation bar */
  .toast {
    left: 12px !important;
    right: 12px !important;
    bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
    max-width: calc(100vw - 24px) !important;
    justify-content: center !important;
    text-align: center !important;
  }

  /* Footer on Mobile */
  .footer-content {
    flex-direction: column !important;
    text-align: center !important;
    gap: 12px !important;
  }

  .footer-links {
    justify-content: center !important;
    gap: 10px !important;
    font-size: 0.8rem !important;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.6rem !important;
  }
  .card-box {
    padding: 16px !important;
  }
}
`;

// Append helper styles and responsive rules
css = css + '\n' + helperStyles + '\n' + mobileResponsiveRules;

// Write back with original line endings
if (isCRLF) {
  css = css.replace(/\r?\n/g, '\r\n');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ styles.css successfully updated with mobile components and bottom nav rules!');
