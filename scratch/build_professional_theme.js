const fs = require('fs');
const path = require('path');

const cssContent = `/* ==========================================================================
   FB4KDownloader.com - Modern Enterprise SaaS / Pro Dark Theme
   Engineered for Blazing Speed, Micro-Interactions & Flawless Mobile Responsiveness
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  /* Core Color Tokens: High-Trust Enterprise Dark */
  --bg-body: #0b0f19;
  --bg-surface: #111827;
  --bg-surface-elevated: #162032;
  --bg-card: rgba(17, 24, 39, 0.85);
  --bg-card-solid: #111827;
  --bg-input: #0e1422;
  --bg-navbar: rgba(11, 15, 25, 0.88);
  --bg-dropdown: #131c2e;
  --bg-footer: #070a12;

  /* Accent Color Palette */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-glow: rgba(37, 99, 235, 0.25);
  --accent-cyan: #38bdf8;
  --accent-emerald: #10b981;
  --accent-purple: #8b5cf6;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;

  /* Legacy color aliases for backward compatibility */
  --neon-cyan: #38bdf8;
  --neon-blue: #2563eb;
  --neon-purple: #8b5cf6;
  --neon-green: #10b981;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
  --hero-title-gradient: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);

  /* Typography Colors */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-subtle: #475569;

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-neon: rgba(56, 189, 248, 0.25);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-focus: #38bdf8;

  /* Gradients */
  --gradient-btn: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
  --gradient-btn-hover: linear-gradient(135deg, #1d4ed8 0%, #0369a1 100%);
  --gradient-badge: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
  --gradient-card: linear-gradient(180deg, rgba(22, 32, 50, 0.6) 0%, rgba(17, 24, 39, 0.6) 100%);

  /* Modern Refined Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05);
  --shadow-card-hover: 0 20px 40px -12px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(56, 189, 248, 0.2);
  --shadow-btn: 0 4px 14px 0 rgba(37, 99, 235, 0.35);
  --shadow-btn-hover: 0 6px 20px 0 rgba(37, 99, 235, 0.5);
  --shadow-neon: 0 0 30px rgba(37, 99, 235, 0.15);
  --shadow-glow: 0 0 25px rgba(56, 189, 248, 0.15);

  /* Radius Scale */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
  --radius-pill: 9999px;

  /* Transitions */
  --transition-fast: all 0.15s ease;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Base Reset & Optimization */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: var(--bg-body);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  position: relative;
}

/* Subtle, Zero-Lag Top Ambient Glow (Hardware Accelerated) */
body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  max-width: 100vw;
  height: 400px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.02em;
}

a {
  color: var(--accent-cyan);
  text-decoration: none;
  transition: var(--transition-fast);
}

a:hover {
  color: #ffffff;
}

/* ==========================================================================
   🏛️ PROFESSIONAL EXECUTIVE NAVBAR (DESKTOP & MOBILE)
   ========================================================================== */

.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--bg-navbar);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 1000;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.nav-container {
  max-width: 1380px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* Logo Presentation */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-btn);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transition: transform 0.3s ease;
}

.brand-logo:hover .logo-icon {
  transform: scale(1.05);
}

.logo-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 2px;
}

.logo-text span {
  color: var(--accent-cyan);
  font-weight: 700;
}

/* Desktop Nav Links */
.nav-links-wrapper {
  display: flex;
  align-items: center;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--text-secondary);
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
  text-decoration: none;
}

.nav-link i {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link:hover i {
  color: var(--accent-cyan);
}

.nav-link.active {
  color: #ffffff;
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.35);
}

.nav-link.active i {
  color: var(--accent-cyan);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  background: var(--bg-dropdown);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 8px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: var(--transition);
  z-index: 1200;
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(4px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  text-decoration: none;
}

.dropdown-item i {
  font-size: 0.88rem;
  color: var(--text-muted);
  width: 16px;
  text-align: center;
}

.dropdown-item:hover {
  background: rgba(37, 99, 235, 0.15);
  color: #ffffff;
}

.dropdown-item:hover i {
  color: var(--accent-cyan);
}

/* Header Action Button */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-extension-nav {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: var(--transition);
}

.btn-extension-nav i {
  color: var(--accent-cyan);
}

.btn-extension-nav:hover {
  background: var(--gradient-btn);
  border-color: transparent;
  color: #ffffff;
  box-shadow: var(--shadow-btn);
  transform: translateY(-1px);
}

.btn-extension-nav:hover i {
  color: #ffffff;
}

/* ==========================================================================
   📄 PAGE LAYOUT & MAIN CONTAINER
   ========================================================================== */

.main-content {
  flex: 1;
  padding: 30px 0 60px;
  position: relative;
  z-index: 1;
}

.page-layout {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 30px;
}

.center-content {
  flex: 1;
  min-width: 0;
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
}

/* ==========================================================================
   🚀 HERO SECTION & SEARCH/DOWNLOADER CARD
   ========================================================================== */

.hero-section {
  text-align: center;
  max-width: 860px;
  margin: 20px auto 40px;
  padding: 0 10px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-emerald);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 6px 18px;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 22px;
}

.hero-badge .pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-emerald);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-emerald);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
  color: #ffffff;
  font-family: 'Outfit', sans-serif;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  margin-bottom: 34px;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
}

/* Downloader Input Form Box */
.downloader-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 10px;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  display: flex;
  gap: 10px;
  position: relative;
  transition: var(--transition);
}

.downloader-box:focus-within {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18), var(--shadow-card);
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 240px;
}

.input-icon {
  position: absolute;
  left: 20px;
  color: var(--text-muted);
  font-size: 1.15rem;
  pointer-events: none;
  transition: color 0.2s ease;
}

.downloader-box:focus-within .input-icon {
  color: var(--accent-cyan);
}

.url-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  padding: 16px 95px 16px 52px;
  color: #ffffff;
  font-size: 1rem;
  border-radius: var(--radius-xl);
  outline: none;
  font-weight: 500;
  font-family: inherit;
  transition: var(--transition-fast);
}

.url-input:focus {
  background: #090e18;
  border-color: rgba(56, 189, 248, 0.4);
}

.url-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

/* Clear (✕) Button */
.btn-clear-url {
  position: absolute;
  right: 92px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 5;
}

.btn-clear-url:hover {
  background: rgba(244, 63, 94, 0.2);
  color: var(--accent-rose);
}

.btn-clear-url.show {
  display: flex;
}

/* Paste Button */
.btn-paste {
  position: absolute;
  right: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-fast);
}

.btn-paste:hover {
  background: rgba(37, 99, 235, 0.15);
  color: #ffffff;
  border-color: rgba(37, 99, 235, 0.4);
}

/* Download Submit Button */
.btn-download {
  background: var(--gradient-btn);
  color: #ffffff;
  border: none;
  padding: 16px 36px;
  border-radius: var(--radius-xl);
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-btn);
  transition: var(--transition);
  flex-shrink: 0;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.01em;
}

.btn-download:hover {
  background: var(--gradient-btn-hover);
  box-shadow: var(--shadow-btn-hover);
  transform: translateY(-2px);
}

.btn-download:active {
  transform: translateY(0);
}

/* 3-Step Quick Helper Strip */
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.quick-step-pill:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.14);
}

.quick-step-pill .step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.2);
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.quick-step-pill i {
  color: var(--accent-cyan);
  font-size: 0.88rem;
}

/* Hero Actions */
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.btn-info {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 10px 20px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-fast);
  text-decoration: none;
}

.btn-info:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}

/* ==========================================================================
   📦 RESULT CARD & DOWNLOAD OPTIONS
   ========================================================================== */

.result-card {
  display: none;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 24px;
  margin-top: 28px;
  box-shadow: var(--shadow-card);
  text-align: left;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.thumbnail-box {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-subtle);
}

.thumbnail-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.duration-tag {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
}

.video-info h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: #ffffff;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-info i {
  color: var(--accent-emerald);
}

/* Quality Download Buttons Grid */
.download-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.btn-quality {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 13px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.btn-quality:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  color: #ffffff;
}

.btn-quality.upscale-4k {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border-color: rgba(139, 92, 246, 0.35);
}

.btn-quality.upscale-4k:hover {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 4px 18px rgba(139, 92, 246, 0.25);
}

.badge-4k {
  background: var(--accent-purple);
  color: #ffffff;
  font-size: 0.68rem;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  font-weight: 800;
  letter-spacing: 0.05em;
}

.badge-hd {
  background: var(--primary);
  color: #ffffff;
  font-size: 0.68rem;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  font-weight: 800;
}

/* Mobile Save Tip */
.mobile-save-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px dashed rgba(37, 99, 235, 0.25);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.82rem;
  margin-top: 16px;
  line-height: 1.45;
}

.mobile-save-tip i {
  color: var(--accent-cyan);
  font-size: 1.05rem;
  flex-shrink: 0;
}

/* ==========================================================================
   📰 CARDS, ARTICLES & ACCORDIONS (CONTENT SECTION)
   ========================================================================== */

.card-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 32px;
  box-shadow: var(--shadow-card);
  margin-top: 36px;
  position: relative;
  transition: var(--transition);
}

.card-box:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.card-header-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: rgba(37, 99, 235, 0.12);
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-header h2 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
}

/* Guide Accordion on Mobile */
.guide-toggle-bar {
  display: none;
}

.guide-body-collapsible {
  display: block;
}

/* Native Banner Ad Wrapper */
.native-ad-wrapper {
  margin: 32px auto;
  max-width: 980px;
  width: 100%;
  text-align: center;
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.native-ad-label {
  display: block;
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
  font-weight: 700;
}

/* FAQ Accordion */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  transition: var(--transition-fast);
}

.faq-item.active {
  border-color: rgba(37, 99, 235, 0.35);
  background: rgba(37, 99, 235, 0.04);
}

.faq-question {
  width: 100%;
  padding: 18px 22px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
}

.faq-question:hover {
  color: var(--accent-cyan);
}

.faq-icon {
  font-size: 0.95rem;
  transition: transform 0.3s ease;
  color: var(--text-muted);
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
  color: var(--accent-cyan);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  padding: 0 22px;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
  transition: max-height 0.35s ease, padding 0.35s ease;
}

.faq-item.active .faq-answer {
  max-height: 300px;
  padding: 0 22px 18px;
}

/* ==========================================================================
   📦 BULK DOWNLOADER & REELS STYLES
   ========================================================================== */

.batch-input-box textarea {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  color: #ffffff;
  font-size: 0.95rem;
  font-family: monospace;
  resize: vertical;
  min-height: 140px;
  outline: none;
  transition: var(--transition-fast);
}

.batch-input-box textarea:focus {
  border-color: var(--accent-cyan);
  background: #090e18;
}

.batch-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 14px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 14px;
}

.btn-batch-download {
  background: var(--gradient-btn);
  color: #ffffff;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-btn);
  transition: var(--transition-fast);
}

.btn-batch-download:hover {
  background: var(--gradient-btn-hover);
  transform: translateY(-1px);
}

.batch-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.batch-video-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: var(--transition-fast);
}

.batch-video-card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  background: rgba(37, 99, 235, 0.03);
}

.batch-card-thumb {
  width: 72px;
  height: 44px;
  border-radius: var(--radius-xs);
  background: #000;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.batch-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==========================================================================
   📰 BLOG & ARTICLE TYPOGRAPHY
   ========================================================================== */

.blog-hero {
  text-align: center;
  max-width: 820px;
  margin: 20px auto 40px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.blog-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
}

.blog-card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.blog-card-thumb {
  width: 100%;
  height: 190px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 16px;
  background: #080c14;
  border: 1px solid var(--border-subtle);
}

.blog-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-card-thumb img {
  transform: scale(1.04);
}

.blog-tag {
  display: inline-block;
  background: rgba(37, 99, 235, 0.12);
  color: var(--accent-cyan);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.blog-card h3 {
  font-size: 1.15rem;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #ffffff;
  font-weight: 800;
}

.blog-card p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.55;
  flex: 1;
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Single Article Layout */
.article-container {
  max-width: 860px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 0.88rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.article-hero-media {
  margin: 25px 0 35px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.article-hero-media img {
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: cover;
  display: block;
}

.article-content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #cbd5e1;
}

.article-content p {
  margin-bottom: 22px;
}

.article-content h2 {
  font-size: 1.6rem;
  margin: 40px 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-subtle);
}

.article-content h3 {
  font-size: 1.3rem;
  margin: 30px 0 12px;
}

.article-content ul, .article-content ol {
  padding-left: 24px;
  margin-bottom: 24px;
}

.article-content li {
  margin-bottom: 8px;
}

.code-box {
  background: #080c14;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin: 24px 0;
  font-family: 'Consolas', monospace;
  font-size: 0.9rem;
  color: var(--accent-cyan);
  overflow-x: auto;
}

.author-bio-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-top: 45px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.author-bio-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gradient-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #ffffff;
  flex-shrink: 0;
}

/* ==========================================================================
   🏢 EXECUTIVE CORPORATE FOOTER (METICULOUSLY CRAFTED)
   ========================================================================== */

.footer {
  background: var(--bg-footer);
  border-top: 1px solid var(--border-subtle);
  padding: 60px 0 calc(30px + env(safe-area-inset-bottom));
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.footer-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-col h4 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
}

.brand-desc {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.65;
  margin-bottom: 18px;
  max-width: 320px;
}

/* Security Trust Badges in Footer */
.footer-trust-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.trust-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

.trust-badge-pill i {
  color: var(--accent-emerald);
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col ul li a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: var(--transition-fast);
}

.footer-col ul li a:hover {
  color: #ffffff;
  transform: translateX(3px);
}

.footer-col ul li a i {
  font-size: 0.8rem;
  margin-right: 8px;
  color: var(--accent-cyan);
}

/* Live System Status Column */
.status-col .status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.status-dot-pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
  box-shadow: 0 0 8px var(--accent-emerald);
  animation: pulse 2s infinite;
}

.footer-disclaimer {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ==========================================================================
   📱 MOBILE BOTTOM APP-STYLE NAVIGATION BAR
   ========================================================================== */

.mobile-bottom-nav {
  display: none;
}

/* Toast Notifications */
.toast {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom));
  right: 24px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition);
  z-index: 4000;
  pointer-events: none;
  max-width: 90vw;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast i {
  color: var(--accent-emerald);
}

/* ==========================================================================
   📱 100% BULLETPROOF RESPONSIVE SYSTEM (MOBILE, TABLET, LAPTOP, DESKTOP)
   ========================================================================== */

/* Laptops & Tablets (< 1024px) */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.6rem;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

/* Tablets & Mobile (< 768px) */
@media (max-width: 768px) {
  body {
    padding-bottom: 74px !important; /* Space for thumb navigation bar */
  }

  /* Compact Sleek Top Navbar */
  .navbar {
    height: 60px !important;
    padding: 0 16px !important;
  }

  .nav-container {
    padding: 0 !important;
    justify-content: space-between !important;
  }

  .nav-links-wrapper {
    display: none !important; /* Replaced by bottom nav */
  }

  .nav-actions {
    display: none !important;
  }

  .logo-icon {
    width: 36px !important;
    height: 36px !important;
    font-size: 1.1rem !important;
  }

  .logo-text {
    font-size: 1.25rem !important;
  }

  /* Fixed Native App-Style Bottom Bar */
  .mobile-bottom-nav {
    display: flex !important;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 62px !important;
    background: rgba(11, 15, 25, 0.95) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-top: 1px solid var(--border-subtle) !important;
    z-index: 9999 !important;
    align-items: center !important;
    justify-content: space-around !important;
    padding: 0 8px calc(env(safe-area-inset-bottom, 0px) + 2px) !important;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.6) !important;
  }

  .mobile-nav-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    color: var(--text-muted) !important;
    font-size: 0.7rem !important;
    font-weight: 700 !important;
    gap: 4px !important;
    flex: 1 !important;
    height: 100% !important;
    padding: 6px 0 !important;
    transition: var(--transition-fast) !important;
    position: relative !important;
    border-radius: var(--radius-sm) !important;
  }

  .mobile-nav-item i {
    font-size: 1.15rem !important;
    transition: transform 0.2s ease, color 0.2s ease !important;
  }

  .mobile-nav-item.active {
    color: var(--accent-cyan) !important;
  }

  .mobile-nav-item.active i {
    transform: translateY(-2px) !important;
    color: var(--accent-cyan) !important;
  }

  .mobile-nav-item.active::after {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    width: 24px !important;
    height: 3px !important;
    background: var(--gradient-btn) !important;
    border-radius: 0 0 3px 3px !important;
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.8) !important;
  }

  /* Compact Mobile Hero */
  .hero-section {
    margin: 10px auto 25px !important;
    padding: 0 !important;
  }

  .hero-badge {
    font-size: 0.75rem !important;
    padding: 4px 12px !important;
    margin-bottom: 14px !important;
  }

  .hero-title {
    font-size: 1.95rem !important;
    line-height: 1.25 !important;
    margin-bottom: 10px !important;
  }

  .hero-subtitle {
    font-size: 0.92rem !important;
    margin-bottom: 20px !important;
    line-height: 1.5 !important;
  }

  /* Downloader Input Box on Mobile */
  .downloader-box {
    flex-direction: column !important;
    padding: 8px !important;
    border-radius: var(--radius-xl) !important;
    gap: 8px !important;
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
    font-size: 1.05rem !important;
  }

  .btn-paste {
    right: 8px !important;
    padding: 7px 12px !important;
    font-size: 0.78rem !important;
  }

  .btn-clear-url {
    right: 76px !important;
  }

  .btn-download {
    width: 100% !important;
    padding: 15px !important;
    font-size: 1rem !important;
    justify-content: center !important;
    border-radius: var(--radius-lg) !important;
  }

  /* Quick Step Pills on Mobile */
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

  /* Hero Actions on Mobile */
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
    padding: 18px !important;
    border-radius: var(--radius-xl) !important;
    margin-top: 20px !important;
  }

  .result-content {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  .download-options {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .btn-quality {
    min-height: 52px !important;
    padding: 14px 18px !important;
    font-size: 0.95rem !important;
    border-radius: var(--radius-md) !important;
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
    border: 1px solid var(--border-subtle) !important;
    color: #ffffff !important;
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
    max-height: 12000px !important;
    opacity: 1 !important;
  }

  .card-box {
    padding: 20px !important;
    border-radius: var(--radius-xl) !important;
    margin-top: 24px !important;
  }

  /* Footer on Mobile */
  .footer {
    padding: 40px 0 calc(30px + env(safe-area-inset-bottom)) !important;
  }

  .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
    text-align: left !important;
  }

  .brand-desc {
    max-width: 100% !important;
  }

  .toast {
    left: 12px !important;
    right: 12px !important;
    bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
    max-width: calc(100vw - 24px) !important;
    justify-content: center !important;
  }
}

/* Small Smart Phones (< 480px) */
@media (max-width: 480px) {
  .hero-title {
    font-size: 1.7rem !important;
  }
  .card-box {
    padding: 16px !important;
  }
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'styles.css'), cssContent, 'utf8');
console.log('✓ styles.css successfully rebuilt with modern enterprise professional theme!');
