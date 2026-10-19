/**
 * FB4KDownloader — Background Service Worker v2.2.0
 * High-Precision Stream Interceptor & Native Chrome Downloader
 */

// In-memory store of live video streams per tab
const tabStreams = {};

// Clean Filename Generator
function sanitizeFilename(title, format) {
  const ext = (format === 'mp3') ? 'mp3' : 'mp4';
  
  // Clean tab title, remove notification counts like "(9) "
  let clean = (title || 'Facebook_Reel')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40);

  if (!clean) clean = 'Facebook_Reel';
  return `${clean}_${format || '4K'}.${ext}`;
}

// Safely clean stream URL using URL API (Preserves all signatures and query params)
function cleanCdnUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    // Only strip chunk range parameters if present, never alter other signed params
    parsed.searchParams.delete('bytestart');
    parsed.searchParams.delete('byteend');
    return parsed.toString();
  } catch (e) {
    return rawUrl;
  }
}

// Intercept live video streams from Facebook CDN
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const url = details.url;
      const tabId = details.tabId;

      if (tabId && tabId > 0 && url.includes('.fbcdn.net/')) {
        // Filter for actual video streams (exclude static images/scripts)
        const isVideo = (url.includes('.mp4') || url.includes('/v/t') || url.includes('&efg=') || url.includes('video-fallback')) &&
                        !url.includes('.jpg') && !url.includes('.png') && !url.includes('.webp') && !url.includes('.js') && !url.includes('.css');

        if (isVideo) {
          if (!tabStreams[tabId]) tabStreams[tabId] = [];

          const fullStreamUrl = cleanCdnUrl(url);

          // Store if not duplicate
          if (!tabStreams[tabId].some(item => item.url === fullStreamUrl)) {
            tabStreams[tabId].unshift({
              url: fullStreamUrl,
              rawUrl: url,
              time: Date.now()
            });

            // Keep up to 20 recent streams
            if (tabStreams[tabId].length > 20) {
              tabStreams[tabId].pop();
            }

            console.log(`[FB4K] Captured video stream on Tab ${tabId}:`, fullStreamUrl.slice(0, 100));
          }
        }
      }
    },
    { urls: ['*://*.fbcdn.net/*'] }
  );
}

// Clean up memory on tab close
if (chrome.tabs && chrome.tabs.onRemoved) {
  chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStreams[tabId];
  });
}

// Handle messages from content script & popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Query active stream for tab
  if (request.action === 'get_tab_stream') {
    const tabId = sender.tab ? sender.tab.id : request.tabId;
    if (tabId && tabStreams[tabId] && tabStreams[tabId].length > 0) {
      sendResponse({ success: true, streamUrl: tabStreams[tabId][0].url });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }

  // Trigger download via Chrome Downloads API
  if (request.action === 'download_file') {
    const targetUrl = request.url;
    const tabTitle = (sender.tab && sender.tab.title) ? sender.tab.title : request.title;
    const filename = sanitizeFilename(tabTitle, request.format || '4K');

    if (!targetUrl) {
      sendResponse({ success: false, message: 'Invalid URL' });
      return true;
    }

    console.log(`[FB4K] Downloading: ${filename}`);

    chrome.downloads.download({
      url: targetUrl,
      filename: filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.warn('[FB4K] Download failed with saveAs:false, retrying with saveAs:true:', chrome.runtime.lastError.message);
        
        chrome.downloads.download({
          url: targetUrl,
          filename: filename,
          saveAs: true
        }, (dlId2) => {
          if (chrome.runtime.lastError) {
            console.error('[FB4K] Both download attempts failed:', chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true, downloadId: dlId2, filename });
          }
        });
      } else {
        console.log('[FB4K] Download started successfully. ID:', downloadId);
        sendResponse({ success: true, downloadId, filename });
      }
    });

    return true;
  }
});

console.log('⚡ FB4KDownloader Service Worker v2.2.0 Active');
