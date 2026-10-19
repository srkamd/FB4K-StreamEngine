/**
 * FB4KDownloader — Background Service Worker v2.0.0
 * Handles direct stream extraction and seamless chrome.downloads API triggers
 */

const PRODUCTION_API = 'https://fb4kdownloader.com';
const LOCAL_API = 'http://localhost:3000';

// Determine API Endpoint based on environment
const API_BASE = (chrome.runtime.id === 'cmhlgochpmciomoodleglljgmoclhcif')
  ? PRODUCTION_API
  : PRODUCTION_API; // Always use production for reliable downloads

// Sanitize filename to avoid OS-level invalid characters
function getCleanFilename(title, format) {
  const ext = (format === 'mp3') ? 'mp3' : 'mp4';
  const cleanTitle = (title || 'fb4k_reel')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 45);
  return `${cleanTitle}_${format || '4k'}.${ext}`;
}

// Main Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download_video_stream' && request.url) {
    const targetUrl = request.url;
    const format = request.format || '4k';

    (async () => {
      try {
        console.log(`[FB4K] Extracting Reel Stream: ${targetUrl} [${format}]`);

        // Query the extraction API
        const extractRes = await fetch(`${API_BASE}/api/extract?url=${encodeURIComponent(targetUrl)}`);
        const data = await extractRes.json();

        if (!data || !data.success) {
          console.warn('[FB4K] Extraction API could not resolve stream:', data);
          sendResponse({ success: false, message: data?.message || 'Could not resolve stream' });
          return;
        }

        // Determine download path
        let relativeDownloadPath = '';
        if (format === '4k') {
          relativeDownloadPath = data.fourKUrl || data.hdUrl || data.sdUrl;
        } else if (format === '1080p') {
          relativeDownloadPath = data.hdUrl || data.sdUrl;
        } else if (format === '720p') {
          relativeDownloadPath = data.sdUrl || data.hdUrl;
        } else if (format === 'mp3') {
          relativeDownloadPath = data.mp3Url;
        } else {
          relativeDownloadPath = data.fourKUrl || data.hdUrl;
        }

        if (!relativeDownloadPath) {
          sendResponse({ success: false, message: 'Stream URL not found' });
          return;
        }

        const finalDownloadUrl = relativeDownloadPath.startsWith('http')
          ? relativeDownloadPath
          : `${API_BASE}${relativeDownloadPath}`;

        const filename = getCleanFilename(data.title, format);

        // Trigger direct browser download
        chrome.downloads.download({
          url: finalDownloadUrl,
          filename: filename,
          saveAs: false // Download immediately without prompt
        }, (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('[FB4K] Chrome download error:', chrome.runtime.lastError.message);
            // Fallback: Open tab
            chrome.tabs.create({ url: finalDownloadUrl });
            sendResponse({ success: true, fallback: true });
          } else {
            console.log('[FB4K] Download started with ID:', downloadId);
            sendResponse({ success: true, downloadId, filename });
          }
        });

      } catch (err) {
        console.error('[FB4K] Background handler error:', err);
        sendResponse({ success: false, error: err.message });
      }
    })();

    return true; // Keep message channel open for async response
  }

  if (request.action === 'open_webapp') {
    const target = request.url ? `${API_BASE}?url=${encodeURIComponent(request.url)}` : API_BASE;
    chrome.tabs.create({ url: target });
    sendResponse({ success: true });
  }
});

// Download progress listener
if (chrome.downloads && chrome.downloads.onChanged) {
  chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
      console.log(`[FB4K] Download ${delta.id} completed successfully!`);
    }
  });
}
