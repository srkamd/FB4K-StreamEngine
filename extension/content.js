/**
 * FB4KDownloader — Content Script v2.0.0
 * Injects sleek, 1-click 4K download buttons directly onto Facebook Reels & Videos
 */

(function () {
  'use strict';

  const WEB_APP_URL = 'https://fb4kdownloader.com';
  const INJECT_FLAG = 'data-fb4k-injected';

  // Inline SVG Icons for optimal performance & CSP safety
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

  // Extract clean Reel / Video URL from any container
  function extractTargetUrl(container) {
    // 1. If currently on a specific reel or watch page
    const currentLoc = window.location.href;
    if (currentLoc.includes('/reel/') || currentLoc.includes('/watch/')) {
      const match = currentLoc.match(/(?:reel\/|watch\/\?v=|videos\/)(\d+)/);
      if (match) return currentLoc.split('?')[0];
    }

    // 2. Check within container for specific link
    if (container) {
      const links = container.querySelectorAll('a[href*="/reel/"], a[href*="/watch/"], a[href*="/videos/"]');
      for (const link of links) {
        if (link.href && (link.href.includes('/reel/') || link.href.includes('/watch/'))) {
          return link.href.split('?')[0];
        }
      }

      // Check parent containers for links
      const parent = container.closest('[role="article"], [data-pagelet*="Reel"], [role="dialog"], [data-pagelet*="FeedUnit"]');
      if (parent) {
        const parentLinks = parent.querySelectorAll('a[href*="/reel/"], a[href*="/watch/"], a[href*="/videos/"]');
        for (const link of parentLinks) {
          if (link.href) return link.href.split('?')[0];
        }
      }
    }

    return currentLoc.split('?')[0];
  }

  // Display unobtrusive floating toast message
  function showToast(message, isError = false) {
    const existingToast = document.querySelector('.fb4k-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'fb4k-toast';
    toast.style.borderColor = isError ? '#ef4444' : '#06b6d4';
    toast.innerHTML = `<span>${isError ? '⚠️' : '⚡'}</span> ${message}`;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Perform Download Flow
  async function triggerDownload(url, format, btnElement, labelElement) {
    if (!url || !url.includes('facebook.com')) {
      showToast('Please open or click on a Facebook Reel first!', true);
      return;
    }

    // Set Loading State
    btnElement.classList.add('fb4k-btn-loading');
    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Downloading <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Extracting 4K stream for Reel...`);

    // Send request to background service worker
    chrome.runtime.sendMessage(
      {
        action: 'download_video_stream',
        url: url,
        format: format
      },
      (response) => {
        btnElement.classList.remove('fb4k-btn-loading');

        if (response && response.success) {
          btnElement.classList.add('fb4k-btn-success');
          btnElement.innerHTML = `${SVG_CHECK} <span class="fb4k-pill-label">Downloaded!</span>`;
          showToast(`Download started successfully! Saving to your computer.`);

          setTimeout(() => {
            btnElement.classList.remove('fb4k-btn-success');
            resetBtnContent(btnElement);
          }, 3000);
        } else {
          // Fallback: Open web app with prefilled URL
          const fallbackUrl = `${WEB_APP_URL}?url=${encodeURIComponent(url)}`;
          window.open(fallbackUrl, '_blank');
          showToast(`Opening FB4KDownloader web app...`);
          resetBtnContent(btnElement);
        }
      }
    );
  }

  function resetBtnContent(btn) {
    btn.innerHTML = `${SVG_DOWNLOAD} <span class="fb4k-pill-label"><strong>4K</strong> Reel</span> ${SVG_ARROW}`;
  }

  // Create On-Reel Floating Badge Element
  function createBadge(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'fb4k-reel-badge-wrapper';

    // Main 1-Click Button (Defaults to 4K)
    const btn = document.createElement('div');
    btn.className = 'fb4k-reel-btn';
    btn.title = 'Click to Download Reel in 4K (FB4KDownloader)';
    resetBtnContent(btn);

    // Click handler for 1-click download
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const targetUrl = extractTargetUrl(container);
      triggerDownload(targetUrl, '4k', btn);
    });

    // Options dropdown for selecting other formats
    const menu = document.createElement('div');
    menu.className = 'fb4k-options-menu';

    const formats = [
      { id: '4k', label: '4K Ultra HD', badge: 'Best' },
      { id: '1080p', label: '1080p Full HD', badge: 'HD' },
      { id: '720p', label: '720p Standard', badge: 'Fast' },
      { id: 'mp3', label: '320kbps MP3', badge: 'Audio' }
    ];

    formats.forEach((fmt) => {
      const item = document.createElement('div');
      item.className = `fb4k-menu-item ${fmt.id === '4k' ? 'active-4k' : ''}`;
      item.innerHTML = `<span>${fmt.label}</span> <small style="opacity: 0.7; font-size: 10px;">${fmt.badge}</small>`;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const targetUrl = extractTargetUrl(container);
        triggerDownload(targetUrl, fmt.id, btn);
      });

      menu.appendChild(item);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    return wrapper;
  }

  // Scan and Inject Badges on all active Reels and Video Players
  function scanAndInject() {
    // 1. Facebook Reels Dedicated Fullscreen / Feed Containers
    const videoElements = document.querySelectorAll('video');

    videoElements.forEach((video) => {
      // Find suitable parent wrapper for the video player
      const videoBox = video.closest('[role="dialog"], [data-pagelet*="Reel"], [aria-label*="Reel"], .x1n2onr6, .x78zum5') || video.parentElement;

      if (!videoBox) return;

      // Skip if already has button
      if (videoBox.hasAttribute(INJECT_FLAG) || videoBox.querySelector('.fb4k-reel-badge-wrapper')) {
        return;
      }

      // Ensure parent has relative/absolute positioning so badge anchors correctly
      const computedPos = window.getComputedStyle(videoBox).position;
      if (computedPos === 'static') {
        videoBox.style.position = 'relative';
      }

      videoBox.setAttribute(INJECT_FLAG, 'true');
      const badge = createBadge(videoBox);
      videoBox.appendChild(badge);
    });
  }

  // Initialize MutationObserver to catch dynamically loaded Reels as user scrolls
  const observer = new MutationObserver(() => {
    scanAndInject();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial Scan
  scanAndInject();

  // Periodic safety check for URL changes or new tabs
  setInterval(scanAndInject, 2000);

  console.log('⚡ FB4KDownloader 2.0 active: 1-click on-reel icons ready.');
})();
