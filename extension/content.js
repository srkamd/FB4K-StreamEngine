/**
 * FB4KDownloader — Content Script v2.1.0
 * 1-Click On-Reel Video Downloader (Pure Direct In-Page Download)
 * Zero website redirects — downloads directly to your device via Chrome Download Manager.
 */

(function () {
  'use strict';

  const INJECT_FLAG = 'data-fb4k-injected';

  // Inline Vector Icons for performance & zero CSP issues
  const SVG_DOWNLOAD = `
    <svg class="fb4k-icon-svg" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`;

  const SVG_SPINNER = `
    <svg class="fb4k-icon-svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle>
    </svg>`;

  const SVG_CHECK = `
    <svg class="fb4k-icon-svg" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;

  const SVG_ARROW = `
    <svg class="fb4k-arrow-indicator" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;

  // Clean and unescape JSON/URL strings from Facebook HTML
  function cleanUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;
    return raw
      .replace(/\\u0026/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/\\\//g, '/')
      .replace(/\\/g, '')
      .split('"')[0]
      .split('\'')[0]
      .trim();
  }

  // Find direct MP4 stream in the DOM or scripts
  function findStreamInDom(container) {
    // 1. Direct <video> tag in container
    if (container) {
      const v = container.querySelector('video');
      if (v) {
        if (v.src && v.src.startsWith('http') && v.src.includes('fbcdn.net')) return v.src;
        if (v.currentSrc && v.currentSrc.startsWith('http') && v.currentSrc.includes('fbcdn.net')) return v.currentSrc;
      }
    }

    // 2. Active playing / visible video in viewport
    const allVideos = document.querySelectorAll('video');
    for (const v of allVideos) {
      const rect = v.getBoundingClientRect();
      if (rect.top >= -100 && rect.bottom <= window.innerHeight + 100) {
        if (v.src && v.src.startsWith('http') && v.src.includes('fbcdn.net')) return v.src;
        if (v.currentSrc && v.currentSrc.startsWith('http') && v.currentSrc.includes('fbcdn.net')) return v.currentSrc;
      }
    }

    // 3. Scan script tags & page HTML for browser_native_hd_url / browser_native_sd_url
    const html = document.documentElement.innerHTML;

    // HD stream
    const hdMatch = html.match(/"browser_native_hd_url":"([^"]+)"/) ||
                    html.match(/"playable_url_quality_hd":"([^"]+)"/);
    if (hdMatch && hdMatch[1]) {
      return cleanUrl(hdMatch[1]);
    }

    // SD stream
    const sdMatch = html.match(/"browser_native_sd_url":"([^"]+)"/) ||
                    html.match(/"playable_url":"([^"]+)"/);
    if (sdMatch && sdMatch[1]) {
      return cleanUrl(sdMatch[1]);
    }

    // Any fbcdn .mp4 URL
    const mp4Match = html.match(/(https?:\\\/\\\/[^\s"'<>]+\.fbcdn\.net[^\s"'<>]+\.mp4[^\s"'>]*)/i);
    if (mp4Match && mp4Match[1]) {
      return cleanUrl(mp4Match[1]);
    }

    return null;
  }

  // Floating Toast Notification
  function showToast(message, isError = false) {
    const existingToast = document.querySelector('.fb4k-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'fb4k-toast';
    toast.style.borderColor = isError ? '#ef4444' : '#10b981';
    toast.innerHTML = `<span>${isError ? '⚠️' : '⚡'}</span> ${message}`;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // Direct In-Page Download Execution (Zero Redirects)
  function triggerDirectDownload(container, format, btnElement) {
    // Set Loading UI
    btnElement.classList.add('fb4k-btn-loading');
    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Downloading <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Grabbing ${format.toUpperCase()} stream...`);

    // Extract stream URL
    const streamUrl = findStreamInDom(container);

    // Send direct download request to background service worker
    chrome.runtime.sendMessage(
      {
        action: 'download_reel_direct',
        streamUrl: streamUrl,
        format: format
      },
      (res) => {
        btnElement.classList.remove('fb4k-btn-loading');

        if (res && res.success) {
          btnElement.classList.add('fb4k-btn-success');
          btnElement.innerHTML = `${SVG_CHECK} <span class="fb4k-pill-label">Downloaded!</span>`;
          showToast(`✅ Video download started! Check your browser downloads.`);

          setTimeout(() => {
            btnElement.classList.remove('fb4k-btn-success');
            resetBtnContent(btnElement);
          }, 3200);
        } else {
          // Inform user clearly without redirecting anywhere
          showToast(`⚠️ Video stream not loaded yet. Play the Reel for 1-2 seconds, then click Download again!`, true);
          resetBtnContent(btnElement);
        }
      }
    );
  }

  function resetBtnContent(btn) {
    btn.innerHTML = `${SVG_DOWNLOAD} <span class="fb4k-pill-label"><strong>4K</strong> Reel</span> ${SVG_ARROW}`;
  }

  // Create On-Reel Badge Button
  function createBadge(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'fb4k-reel-badge-wrapper';

    // 1-Click Button (Defaults to 4K)
    const btn = document.createElement('div');
    btn.className = 'fb4k-reel-btn';
    btn.title = 'Click to Download Reel in 4K (Direct Download)';
    resetBtnContent(btn);

    // Click handler for 1-click download
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      triggerDirectDownload(container, '4k', btn);
    });

    // Options menu on hover
    const menu = document.createElement('div');
    menu.className = 'fb4k-options-menu';

    const formats = [
      { id: '4k', label: '4K Ultra HD', badge: 'Best' },
      { id: '1080p', label: '1080p Full HD', badge: 'HD' },
      { id: '720p', label: '720p Standard', badge: 'Fast' },
      { id: 'mp3', label: 'MP3 Audio Format', badge: 'Audio' }
    ];

    formats.forEach((fmt) => {
      const item = document.createElement('div');
      item.className = `fb4k-menu-item ${fmt.id === '4k' ? 'active-4k' : ''}`;
      item.innerHTML = `<span>${fmt.label}</span> <small style="opacity: 0.7; font-size: 10px;">${fmt.badge}</small>`;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        triggerDirectDownload(container, fmt.id, btn);
      });

      menu.appendChild(item);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    return wrapper;
  }

  // Inject badges on all active video containers
  function scanAndInject() {
    const videoElements = document.querySelectorAll('video');

    videoElements.forEach((video) => {
      const videoBox = video.closest('[role="dialog"], [data-pagelet*="Reel"], [aria-label*="Reel"], .x1n2onr6, .x78zum5') || video.parentElement;

      if (!videoBox) return;

      if (videoBox.hasAttribute(INJECT_FLAG) || videoBox.querySelector('.fb4k-reel-badge-wrapper')) {
        return;
      }

      const computedPos = window.getComputedStyle(videoBox).position;
      if (computedPos === 'static') {
        videoBox.style.position = 'relative';
      }

      videoBox.setAttribute(INJECT_FLAG, 'true');
      const badge = createBadge(videoBox);
      videoBox.appendChild(badge);
    });
  }

  // MutationObserver for infinite scrolling Reels
  const observer = new MutationObserver(() => {
    scanAndInject();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  scanAndInject();
  setInterval(scanAndInject, 1500);

  console.log('⚡ FB4KDownloader v2.1 active (Direct In-Page Download, No Redirects)');
})();
