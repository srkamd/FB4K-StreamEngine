// FB4KDownloader Background Service Worker
const WEB_APP_URL = (chrome.runtime.id === 'cmhlgochpmciomoodleglljgmoclhcif')
  ? 'https://fb4kdownloader.com'
  : 'http://localhost:3000';

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download_video' && request.url) {
    // Actively use chrome.downloads.download API to satisfy Chrome Web Store permission requirements
    const targetDownloadUrl = `${WEB_APP_URL}/api/proxy-download?url=${encodeURIComponent(request.url)}&filename=fb4kdownloader_video_4k.mp4`;
    
    chrome.downloads.download({
      url: targetDownloadUrl,
      filename: request.filename || 'fb4kdownloader_video_4k.mp4',
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download trigger error:', chrome.runtime.lastError.message);
        // Fallback: Open web app downloader tab if direct stream fails
        chrome.tabs.create({ url: `${WEB_APP_URL}?url=${encodeURIComponent(request.url)}` });
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Download initiated successfully with ID:', downloadId);
        sendResponse({ success: true, downloadId });
      }
    });
    
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'open_webapp') {
    const targetUrl = request.url ? `${WEB_APP_URL}?url=${encodeURIComponent(request.url)}` : WEB_APP_URL;
    chrome.tabs.create({ url: targetUrl });
    sendResponse({ success: true });
  }
});

// Monitor download status changes
if (chrome.downloads && chrome.downloads.onChanged) {
  chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
      console.log('FB4KDownloader video download completed!');
    }
  });
}
