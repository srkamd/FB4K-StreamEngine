const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'app.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Replace paste handler and add clear button & smart auto-fetch logic
const oldPasteSection = `  // Paste from Clipboard
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            videoUrlInput.value = text;
            showToast('Pasted link from clipboard!');
          } else {
            showToast('Clipboard is empty.');
          }
        }
      } catch (err) {
        showToast('Unable to read clipboard.');
      }
    });
  }`;

const newPasteSection = `  // URL Validation Helper
  function isFacebookUrl(str) {
    if (!str || typeof str !== 'string') return false;
    return /facebook\\.com|fb\\.watch|fb\\.gg|fb\\.me/i.test(str.trim());
  }

  // Clear URL (✕) Button Handler
  const btnClearUrl = document.getElementById('btn-clear-url');
  if (videoUrlInput && btnClearUrl) {
    videoUrlInput.addEventListener('input', () => {
      if (videoUrlInput.value.trim().length > 0) {
        btnClearUrl.classList.add('show');
      } else {
        btnClearUrl.classList.remove('show');
      }
    });

    btnClearUrl.addEventListener('click', () => {
      videoUrlInput.value = '';
      btnClearUrl.classList.remove('show');
      if (resultCard) resultCard.style.display = 'none';
      videoUrlInput.focus();
    });
  }

  // 1-Tap Smart Paste & Auto-Extraction
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          const cleanText = text ? text.trim() : '';
          if (cleanText) {
            videoUrlInput.value = cleanText;
            if (btnClearUrl) btnClearUrl.classList.add('show');
            
            // Smart Frictionless Auto-Fetch
            if (isFacebookUrl(cleanText)) {
              showToast('⚡ Link detected! Fetching video...');
              performExtraction(cleanText);
            } else {
              showToast('Link pasted! Tap Download to fetch.');
            }
          } else {
            showToast('Clipboard is empty.');
          }
        } else {
          videoUrlInput.focus();
          showToast('Please paste the video link.');
        }
      } catch (err) {
        videoUrlInput.focus();
        showToast('Please paste the video link directly.');
      }
    });
  }`;

// Replace paste section
if (js.includes('// Paste from Clipboard')) {
  const startIdx = js.indexOf('  // Paste from Clipboard');
  const endIdx = js.indexOf('  // Core Extraction Function');
  if (startIdx !== -1 && endIdx !== -1) {
    js = js.substring(0, startIdx) + newPasteSection + '\n\n' + js.substring(endIdx);
    console.log('✓ Replaced paste section in app.js');
  }
}

// Add Mobile Guide Accordion Handler at the bottom of DOMContentLoaded
const guideAccordionHandler = `
  // Mobile Collapsible Guide Toggle
  const btnGuideToggle = document.getElementById('btn-guide-toggle');
  const guideBody = document.getElementById('guide-body-collapsible');
  if (btnGuideToggle && guideBody) {
    btnGuideToggle.addEventListener('click', () => {
      const isOpen = guideBody.classList.toggle('open');
      btnGuideToggle.classList.toggle('expanded', isOpen);
      const titleSpan = btnGuideToggle.querySelector('span');
      if (titleSpan) {
        titleSpan.innerHTML = isOpen 
          ? '<i class="fa-solid fa-chevron-up"></i> Hide Detailed Specifications & Guide'
          : '<i class="fa-solid fa-book-open"></i> Read Complete Guide & Specifications';
      }
    });
  }
});
`;

if (js.includes('});') && !js.includes('btnGuideToggle')) {
  const lastClose = js.lastIndexOf('});');
  js = js.substring(0, lastClose) + guideAccordionHandler;
  console.log('✓ Added guide accordion handler to app.js');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('✓ app.js successfully updated!');
