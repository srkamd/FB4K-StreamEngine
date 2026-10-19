/**
 * FB4KDownloader — Content Script v2.3.0
 * 1-Click On-Reel Video & Audio Downloader
 * Downloads Real Full-Length Video (Not Audio Chunks)
 */

(function () {
  'use strict';

  const INJECT_FLAG = 'data-fb4k-injected';

  // SVG Icons
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

  // Clean filename generator
  function getFilename(format) {
    let title = document.title || 'Facebook_Reel';
    title = title.replace(/^\(\d+\)\s*/, ''); // Remove notification counts
    title = title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_').slice(0, 35);
    if (!title) title = 'Facebook_Reel';
    const ext = (format === 'mp3') ? 'mp3' : 'mp4';
    return `${title}_${format || '4K'}.${ext}`;
  }

  // Toast notification
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
    }, 4000);
  }

  // Clean stream URL
  function cleanStreamUrl(url) {
    if (!url || typeof url !== 'string') return null;
    try {
      let clean = url
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .replace(/\\\//g, '/')
        .replace(/\\/g, '')
        .split('"')[0]
        .split('\'')[0]
        .trim();

      const parsed = new URL(clean);
      parsed.searchParams.delete('bytestart');
      parsed.searchParams.delete('byteend');
      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  // Scan DOM Video Tag for Direct Video Stream
  function getDirectVideoTagStream(container) {
    const v = (container && container.querySelector('video')) || document.querySelector('video');
    if (v) {
      // Check src if it is a real video link
      if (v.src && v.src.startsWith('http') && v.src.includes('fbcdn.net') && !v.src.includes('_a.mp4')) {
        return cleanStreamUrl(v.src);
      }
      if (v.currentSrc && v.currentSrc.startsWith('http') && v.currentSrc.includes('fbcdn.net') && !v.currentSrc.includes('_a.mp4')) {
        return cleanStreamUrl(v.currentSrc);
      }
    }
    return null;
  }

  // Query Background Service Worker for Best Stream (Separated Video vs Audio)
  function queryBackgroundStream(format) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'get_best_stream', format: format }, (res) => {
        if (res && res.success && res.streamUrl) {
          resolve(res.streamUrl);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Download File via in-page blob or chrome.downloads
  async function executeDownload(streamUrl, format, btnElement) {
    const filename = getFilename(format);

    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Saving <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Downloading ${format.toUpperCase()} video stream...`);

    // In-page Blob Fetch (Fastest, avoids hotlinking issues)
    try {
      console.log('[FB4K] Attempting in-page fetch for:', streamUrl);
      const res = await fetch(streamUrl, {
        method: 'GET',
        credentials: 'omit',
        mode: 'cors'
      });

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 1500);

        btnElement.classList.remove('fb4k-btn-loading');
        btnElement.classList.add('fb4k-btn-success');
        btnElement.innerHTML = `${SVG_CHECK} <span class="fb4k-pill-label">Downloaded!</span>`;
        showToast(`✅ Video downloaded successfully! Check your downloads.`);

        setTimeout(() => {
          btnElement.classList.remove('fb4k-btn-success');
          resetBtnContent(btnElement);
        }, 3000);
        return;
      }
    } catch (err) {
      console.warn('[FB4K] In-page fetch skipped, using Chrome Downloads API:', err);
    }

    // Chrome Downloads API Fallback
    chrome.runtime.sendMessage(
      {
        action: 'download_file',
        url: streamUrl,
        format: format,
        title: document.title
      },
      (res) => {
        btnElement.classList.remove('fb4k-btn-loading');

        if (res && res.success) {
          btnElement.classList.add('fb4k-btn-success');
          btnElement.innerHTML = `${SVG_CHECK} <span class="fb4k-pill-label">Downloaded!</span>`;
          showToast(`✅ Video download started! Check your downloads.`);

          setTimeout(() => {
            btnElement.classList.remove('fb4k-btn-success');
            resetBtnContent(btnElement);
          }, 3000);
        } else {
          showToast(`⚠️ Please let the video play for 1-2 seconds, then click Download again!`, true);
          resetBtnContent(btnElement);
        }
      }
    );
  }

  // Master Download Handler
  async function handleDownload(container, format, btnElement) {
    btnElement.classList.add('fb4k-btn-loading');
    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Detecting <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Locating video stream...`);

    // 1. Try DOM direct video tag (if format is video)
    let streamUrl = null;
    if (format !== 'mp3') {
      streamUrl = getDirectVideoTagStream(container);
    }

    // 2. Query Background Stream Registry (Separated Video & Audio channels)
    if (!streamUrl) {
      streamUrl = await queryBackgroundStream(format);
    }

    if (streamUrl) {
      console.log(`[FB4K] Downloading resolved stream [${format}]:`, streamUrl);
      await executeDownload(streamUrl, format, btnElement);
    } else {
      btnElement.classList.remove('fb4k-btn-loading');
      showToast(`⚠️ Please let the Reel play for 1 second so the video stream buffers, then click Download!`, true);
      resetBtnContent(btnElement);
    }
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
    btn.title = 'Click to Download Reel in 4K Video (Instant Download)';
    resetBtnContent(btn);

    // 1-Click handler
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleDownload(container, '4k', btn);
    });

    // Options dropdown for selecting other formats
    const menu = document.createElement('div');
    menu.className = 'fb4k-options-menu';

    const formats = [
      { id: '4k', label: '4K Ultra HD (Video)', badge: 'Best' },
      { id: '1080p', label: '1080p Full HD (Video)', badge: 'HD' },
      { id: '720p', label: '720p Standard (Video)', badge: 'Fast' },
      { id: 'mp3', label: '320kbps MP3 (Audio Only)', badge: 'Audio' }
    ];

    formats.forEach((fmt) => {
      const item = document.createElement('div');
      item.className = `fb4k-menu-item ${fmt.id === '4k' ? 'active-4k' : ''}`;
      item.innerHTML = `<span>${fmt.label}</span> <small style="opacity: 0.7; font-size: 10px;">${fmt.badge}</small>`;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        handleDownload(container, fmt.id, btn);
      });

      menu.appendChild(item);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    return wrapper;
  }

  // Scan and Inject Badges on video containers
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

  // MutationObserver for infinite scroll
  const observer = new MutationObserver(() => {
    scanAndInject();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  scanAndInject();
  setInterval(scanAndInject, 1500);

  console.log('⚡ FB4KDownloader v2.3 active: Dual-channel video & audio engine ready.');
})();
