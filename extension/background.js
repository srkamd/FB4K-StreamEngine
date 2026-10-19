/**
 * FB4KDownloader — Background Service Worker v2.1.0
 * Pure Direct Client-Side Stream Interceptor & Downloader
 * Downloads Facebook Reels & Videos directly to the browser without any website redirects.
 */

// In-memory store of live video stream URLs per tab
// tabId -> Array of stream objects: { url, time }
const tabStreams = {};

// Clean Filename Sanitizer
function sanitizeName(title, format) {
  const ext = (format === 'mp3') ? 'mp3' : 'mp4';
  const clean = (title || 'Facebook_Reel')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 45);
  return `${clean || 'Facebook_Reel'}_${format || '4K'}.${ext}`;
}

// Intercept live video stream requests from Facebook CDN (fbcdn.net)
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const url = details.url;
      const tabId = details.tabId;

      if (tabId && tabId > 0 && url.includes('.fbcdn.net/')) {
        // Detect video stream requests
        if (url.includes('.mp4') || url.includes('/v/t') || url.includes('bytestart') || url.includes('&efg=')) {
          if (!tabStreams[tabId]) {
            tabStreams[tabId] = [];
          }

          // Keep pristine stream url (strip byterange query if necessary to get full stream)
          let cleanStream = url;
          if (cleanStream.includes('&bytestart=') || cleanStream.includes('?bytestart=')) {
            cleanStream = cleanStream.replace(/[?&]bytestart=\d+/, '').replace(/[?&]byteend=\d+/, '');
          }

          // Unshift to keep most recent at top
          if (!tabStreams[tabId].some(item => item.url === cleanStream)) {
            tabStreams[tabId].unshift({
              url: cleanStream,
              rawUrl: url,
              time: Date.now()
            });

            // Keep max 20 recent streams per tab
            if (tabStreams[tabId].length > 20) {
              tabStreams[tabId].pop();
            }

            console.log(`[FB4K] Captured live FB video stream on Tab ${tabId}:`, cleanStream.slice(0, 90));
          }
        }
      }
    },
    { urls: ['*://*.fbcdn.net/*'] }
  );
}

// Clean up memory when tab is closed
if (chrome.tabs && chrome.tabs.onRemoved) {
  chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStreams[tabId];
  });
}

// Message Dispatcher
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download_reel_direct') {
    const tabId = sender.tab ? sender.tab.id : request.tabId;
    let finalUrl = request.streamUrl;

    // Layer 1: If DOM didn't supply stream, check captured webRequest streams
    if (!finalUrl && tabId && tabStreams[tabId] && tabStreams[tabId].length > 0) {
      finalUrl = tabStreams[tabId][0].url;
      console.log(`[FB4K] Using webRequest stream for Tab ${tabId}`);
    }

    if (!finalUrl) {
      console.warn('[FB4K] No stream URL found for tab:', tabId);
      sendResponse({ success: false, message: 'Stream not loaded yet. Play the video for 1 second!' });
      return true;
    }

    // Determine filename
    const tabTitle = (sender.tab && sender.tab.title) ? sender.tab.title : 'Facebook_Reel';
    const filename = sanitizeName(tabTitle, request.format || '4K');

    console.log(`[FB4K] Initiating direct Chrome download: ${filename}`);

    // Trigger Direct Browser Download
    chrome.downloads.download({
      url: finalUrl,
      filename: filename,
      saveAs: false // Download straight to user's computer without prompt
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.warn('[FB4K] Download with saveAs:false failed, retrying with saveAs:true...', chrome.runtime.lastError.message);
        
        chrome.downloads.download({
          url: finalUrl,
          filename: filename,
          saveAs: true
        }, (dlId2) => {
          if (chrome.runtime.lastError) {
            console.error('[FB4K] Direct download failed:', chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log('[FB4K] Download started with ID:', dlId2);
            sendResponse({ success: true, downloadId: dlId2, filename });
          }
        });
      } else {
        console.log('[FB4K] Download started successfully with ID:', downloadId);
        sendResponse({ success: true, downloadId, filename });
      }
    });

    return true; // Keep message channel open for async response
  }

  // Query captured streams for active tab (used by popup)
  if (request.action === 'get_active_tab_stream') {
    const tabId = request.tabId;
    if (tabId && tabStreams[tabId] && tabStreams[tabId].length > 0) {
      sendResponse({ success: true, streamUrl: tabStreams[tabId][0].url });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }
});

console.log('⚡ FB4KDownloader Service Worker v2.1.0 Ready (Direct Stream Engine)');
