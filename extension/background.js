/**
 * FB4KDownloader — Background Service Worker v2.3.0
 * Dual-Channel Stream Engine: Distinguishes Real Video Streams from Audio Tracks
 */

// In-memory stream registries per tab
const tabVideoStreams = {};
const tabAudioStreams = {};

// Clean Filename Generator
function sanitizeFilename(title, format) {
  const ext = (format === 'mp3') ? 'mp3' : 'mp4';
  
  let clean = (title || 'Facebook_Reel')
    .replace(/^\(\d+\)\s*/, '') // Strip notification counts e.g. "(9) "
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40);

  if (!clean) clean = 'Facebook_Reel';
  return `${clean}_${format || '4K'}.${ext}`;
}

// Safely clean CDN URL preserving signature
function cleanCdnUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete('bytestart');
    parsed.searchParams.delete('byteend');
    return parsed.toString();
  } catch (e) {
    return rawUrl;
  }
}

// Track live network streams from Facebook CDN
if (chrome.webRequest && chrome.webRequest.onResponseStarted) {
  chrome.webRequest.onResponseStarted.addListener(
    (details) => {
      const url = details.url;
      const tabId = details.tabId;

      if (!tabId || tabId <= 0 || !url.includes('.fbcdn.net/')) return;

      // Inspect Response Headers for Content-Type & Content-Length
      const headers = details.responseHeaders || [];
      let contentType = '';
      let contentLength = 0;

      for (const h of headers) {
        const name = (h.name || '').toLowerCase();
        if (name === 'content-type') contentType = (h.value || '').toLowerCase();
        if (name === 'content-length') contentLength = parseInt(h.value, 10) || 0;
      }

      // Ignore static assets
      if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.js') || url.includes('.css')) {
        return;
      }

      const cleanStream = cleanCdnUrl(url);

      // Detect whether stream is Audio or Video
      const isAudioExplicit = contentType.includes('audio') || url.includes('_a.mp4') || url.includes('fb_audio');
      const isVideoExplicit = contentType.includes('video') || url.includes('_v.mp4') || url.includes('fb_video');

      if (isAudioExplicit) {
        // Record Audio Stream
        if (!tabAudioStreams[tabId]) tabAudioStreams[tabId] = [];
        if (!tabAudioStreams[tabId].some(i => i.url === cleanStream)) {
          tabAudioStreams[tabId].unshift({
            url: cleanStream,
            size: contentLength,
            time: Date.now()
          });
          if (tabAudioStreams[tabId].length > 15) tabAudioStreams[tabId].pop();
          console.log(`[FB4K] 🎵 Captured AUDIO Stream (${(contentLength / 1024).toFixed(0)} KB):`, cleanStream.slice(0, 80));
        }
      } else if (isVideoExplicit || (!isAudioExplicit && (url.includes('.mp4') || url.includes('/v/t')))) {
        // Record Video Stream
        if (!tabVideoStreams[tabId]) tabVideoStreams[tabId] = [];
        if (!tabVideoStreams[tabId].some(i => i.url === cleanStream)) {
          tabVideoStreams[tabId].unshift({
            url: cleanStream,
            size: contentLength,
            time: Date.now()
          });

          // Sort video streams by size descending so largest / highest-quality stream is at index 0
          tabVideoStreams[tabId].sort((a, b) => (b.size || 0) - (a.size || 0));

          if (tabVideoStreams[tabId].length > 15) tabVideoStreams[tabId].pop();
          console.log(`[FB4K] 🎬 Captured REAL VIDEO Stream (${(contentLength / 1024 / 1024).toFixed(2)} MB):`, cleanStream.slice(0, 80));
        }
      }
    },
    { urls: ['*://*.fbcdn.net/*'] },
    ['responseHeaders']
  );
}

// Clean up memory on tab close
if (chrome.tabs && chrome.tabs.onRemoved) {
  chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabVideoStreams[tabId];
    delete tabAudioStreams[tabId];
  });
}

// Handle Messages from Content Script & Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tabId = sender.tab ? sender.tab.id : request.tabId;

  // Resolve best stream for requested format
  if (request.action === 'get_best_stream') {
    const format = request.format || '4k';
    let selectedUrl = null;

    if (format === 'mp3') {
      // Pick Audio Stream
      if (tabId && tabAudioStreams[tabId] && tabAudioStreams[tabId].length > 0) {
        selectedUrl = tabAudioStreams[tabId][0].url;
      }
    } else {
      // Pick Video Stream (4K / 1080p / 720p)
      if (tabId && tabVideoStreams[tabId] && tabVideoStreams[tabId].length > 0) {
        // Index 0 has the largest / highest bitrate video stream
        selectedUrl = tabVideoStreams[tabId][0].url;
      }
    }

    if (selectedUrl) {
      sendResponse({ success: true, streamUrl: selectedUrl });
    } else {
      // Fallback: Check if any video stream available at all
      const fallbackUrl = (tabVideoStreams[tabId] && tabVideoStreams[tabId][0]) ? tabVideoStreams[tabId][0].url : null;
      sendResponse({ success: !!fallbackUrl, streamUrl: fallbackUrl });
    }
    return true;
  }

  // Download Trigger
  if (request.action === 'download_file') {
    const targetUrl = request.url;
    const tabTitle = (sender.tab && sender.tab.title) ? sender.tab.title : request.title;
    const filename = sanitizeFilename(tabTitle, request.format || '4K');

    if (!targetUrl) {
      sendResponse({ success: false, message: 'Invalid URL' });
      return true;
    }

    console.log(`[FB4K] Starting download for: ${filename}`);

    chrome.downloads.download({
      url: targetUrl,
      filename: filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.warn('[FB4K] Retrying download with saveAs:true:', chrome.runtime.lastError.message);
        
        chrome.downloads.download({
          url: targetUrl,
          filename: filename,
          saveAs: true
        }, (dlId2) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true, downloadId: dlId2, filename });
          }
        });
      } else {
        console.log('[FB4K] Download started successfully with ID:', downloadId);
        sendResponse({ success: true, downloadId, filename });
      }
    });

    return true;
  }
});

console.log('⚡ FB4KDownloader Service Worker v2.3.0 Ready (Dual-Channel Video/Audio Separation)');
