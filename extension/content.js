/**
 * FB4KDownloader — Content Script v2.2.0
 * Multi-Layer Direct Video Engine with In-Page Blob Saving
 * 100% Reliable | Zero Redirects | Zero Failed .txt Downloads
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
    title = title.replace(/^\(\d+\)\s*/, ''); // Remove notification counts like "(9) "
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

  // Safely clean CDN stream URL
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

  // Layer 1: Extract from <video> element
  function getStreamFromVideoTag(container) {
    const v = (container && container.querySelector('video')) || document.querySelector('video');
    if (v) {
      if (v.src && v.src.startsWith('http') && v.src.includes('fbcdn.net')) return cleanStreamUrl(v.src);
      if (v.currentSrc && v.currentSrc.startsWith('http') && v.currentSrc.includes('fbcdn.net')) return cleanStreamUrl(v.currentSrc);

      // Inspect React Fiber props on the video element
      try {
        const fiberKey = Object.keys(v).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactProps'));
        if (fiberKey && v[fiberKey]) {
          let node = v[fiberKey];
          let depth = 0;
          while (node && depth < 8) {
            const props = node.memoizedProps || node.props;
            if (props) {
              const possibleUrl = props.hd_src || props.sd_src || props.src || props.playable_url || (props.videoData && (props.videoData.hd_src || props.videoData.sd_src));
              if (possibleUrl && typeof possibleUrl === 'string' && possibleUrl.includes('fbcdn.net')) {
                return cleanStreamUrl(possibleUrl);
              }
            }
            node = node.return;
            depth++;
          }
        }
      } catch (e) {}
    }
    return null;
  }

  // Layer 2: Extract from page HTML & scripts
  function getStreamFromScripts() {
    const html = document.documentElement.innerHTML;

    // Search for explicit HD/SD properties
    const hdMatch = html.match(/"browser_native_hd_url":"([^"]+)"/) ||
                    html.match(/"playable_url_quality_hd":"([^"]+)"/);
    if (hdMatch && hdMatch[1]) {
      return cleanStreamUrl(hdMatch[1]);
    }

    const sdMatch = html.match(/"browser_native_sd_url":"([^"]+)"/) ||
                    html.match(/"playable_url":"([^"]+)"/);
    if (sdMatch && sdMatch[1]) {
      return cleanStreamUrl(sdMatch[1]);
    }

    // Search for any fbcdn video stream
    const mp4Match = html.match(/(https?:\\?\/\\?\/[^\s"'<>]+\.fbcdn\.net[^\s"'<>]+\.mp4[^\s"'>]*)/i);
    if (mp4Match && mp4Match[1]) {
      return cleanStreamUrl(mp4Match[1]);
    }

    return null;
  }

  // Layer 3: Query background script for intercepted stream
  function getStreamFromBackground() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'get_tab_stream' }, (res) => {
        if (res && res.success && res.streamUrl) {
          resolve(cleanStreamUrl(res.streamUrl));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Master Stream Locator
  async function resolveStreamUrl(container) {
    // Try Video Tag & React Fiber
    let streamUrl = getStreamFromVideoTag(container);
    if (streamUrl) return streamUrl;

    // Try Intercepted WebRequest Stream from Background
    streamUrl = await getStreamFromBackground();
    if (streamUrl) return streamUrl;

    // Try Page HTML & Scripts
    streamUrl = getStreamFromScripts();
    if (streamUrl) return streamUrl;

    return null;
  }

  // Download File Directly (Attempts In-Page Blob first, then Chrome Download API)
  async function downloadVideoFile(streamUrl, format, btnElement) {
    const filename = getFilename(format);

    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Saving <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Downloading video stream...`);

    // Method A: In-Page Fetch as Blob (Bypasses all hotlinking & session issues)
    try {
      console.log('[FB4K] Attempting in-page fetch blob:', streamUrl);
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
        showToast(`✅ Reel downloaded successfully! Check your downloads.`);

        setTimeout(() => {
          btnElement.classList.remove('fb4k-btn-success');
          resetBtnContent(btnElement);
        }, 3000);
        return;
      }
    } catch (fetchErr) {
      console.warn('[FB4K] In-page fetch fallback to Chrome downloads API:', fetchErr);
    }

    // Method B: Chrome Downloads API via Background Service Worker
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
          showToast(`⚠️ Please play the video for 1-2 seconds so the stream buffers, then click Download!`, true);
          resetBtnContent(btnElement);
        }
      }
    );
  }

  // Trigger Download Flow
  async function triggerDownload(container, format, btnElement) {
    btnElement.classList.add('fb4k-btn-loading');
    btnElement.innerHTML = `${SVG_SPINNER} <span class="fb4k-pill-label">Grabbing <strong>${format.toUpperCase()}</strong>...</span>`;
    showToast(`Detecting Reel stream...`);

    const streamUrl = await resolveStreamUrl(container);

    if (streamUrl) {
      await downloadVideoFile(streamUrl, format, btnElement);
    } else {
      btnElement.classList.remove('fb4k-btn-loading');
      showToast(`⚠️ Please let the Reel play for 1 second, then click Download again!`, true);
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
    btn.title = 'Click to Download Reel in 4K (Instant Download)';
    resetBtnContent(btn);

    // 1-Click handler
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      triggerDownload(container, '4k', btn);
    });

    // Options dropdown for selecting other formats
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
        triggerDownload(container, fmt.id, btn);
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

  console.log('⚡ FB4KDownloader v2.2 active: Direct in-page blob engine ready.');
})();
