document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('ext-url-input');
  const btnDownload = document.getElementById('btn-ext-download');
  const btnPaste = document.getElementById('btn-ext-paste');
  const btnOpenWebapp = document.getElementById('btn-open-webapp');
  const statusText = document.getElementById('status-text');
  const tabStatus = document.getElementById('tab-status');

  const WEB_APP_URL = (chrome.runtime.id === 'cmhlgochpmciomoodleglljgmoclhcif')
    ? 'https://fb4kdownloader.com'
    : 'http://localhost:3000';

  // Detect Active Chrome Tab
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const activeUrl = tabs[0].url;
        if (activeUrl.includes('facebook.com') || activeUrl.includes('fb.watch')) {
          urlInput.value = activeUrl;
          if (statusText) statusText.textContent = 'Facebook Video Tab Detected!';
          if (tabStatus) {
            tabStatus.style.background = 'rgba(16, 185, 129, 0.1)';
            tabStatus.style.borderColor = 'rgba(16, 185, 129, 0.25)';
          }
        } else {
          if (statusText) statusText.textContent = 'Open a Facebook video tab to auto-detect!';
          if (tabStatus) {
            tabStatus.style.background = 'rgba(255, 255, 255, 0.05)';
            tabStatus.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }
        }
      }
    });
  }

  // Paste Action
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          urlInput.value = text;
        }
      } catch (err) {
        console.error('Clipboard error:', err);
      }
    });
  }

  // Trigger Download Action
  if (btnDownload) {
    btnDownload.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        urlInput.focus();
        return;
      }

      const originalBtnText = btnDownload.innerHTML;
      btnDownload.innerHTML = `<span class="spinner"></span> Extracting...`;
      btnDownload.disabled = true;

      try {
        const formatSelect = document.getElementById('ext-format-select');
        const selectedFormat = formatSelect ? formatSelect.value : '4k';

        const response = await fetch(`${WEB_APP_URL}/api/extract?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        let downloadPath = '';
        let filename = 'fb4kdownloader_video.mp4';

        if (selectedFormat === '4k') {
          downloadPath = data.fourKUrl || data.hdUrl || data.sdUrl;
          filename = 'fb4kdownloader_video_4k.mp4';
        } else if (selectedFormat === '1080p') {
          downloadPath = data.hdUrl || data.sdUrl;
          filename = 'fb4kdownloader_video_1080p.mp4';
        } else if (selectedFormat === '720p') {
          downloadPath = data.sdUrl || data.hdUrl;
          filename = 'fb4kdownloader_video_720p.mp4';
        } else if (selectedFormat === 'mp3') {
          downloadPath = data.mp3Url;
          filename = 'fb4kdownloader_audio.mp3';
        }

        if (data.success && downloadPath) {
          const absoluteDownloadUrl = `${WEB_APP_URL}${downloadPath}`;

          if (chrome.downloads && chrome.downloads.download) {
            chrome.downloads.download({
              url: absoluteDownloadUrl,
              filename: filename,
              saveAs: true
            }, (downloadId) => {
              btnDownload.innerHTML = originalBtnText;
              btnDownload.disabled = false;
              if (chrome.runtime.lastError) {
                const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(url)}`;
                if (chrome.tabs && chrome.tabs.create) {
                  chrome.tabs.create({ url: targetUrl });
                } else {
                  window.open(targetUrl, '_blank');
                }
              }
            });
          } else {
            const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(url)}`;
            if (chrome.tabs && chrome.tabs.create) {
              chrome.tabs.create({ url: targetUrl });
            } else {
              window.open(targetUrl, '_blank');
            }
            btnDownload.innerHTML = originalBtnText;
            btnDownload.disabled = false;
          }
        } else {
          const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(url)}`;
          if (chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: targetUrl });
          } else {
            window.open(targetUrl, '_blank');
          }
          btnDownload.innerHTML = originalBtnText;
          btnDownload.disabled = false;
        }

      } catch (err) {
        console.error('Extension download flow error:', err);
        const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(url)}`;
        if (chrome.tabs && chrome.tabs.create) {
          chrome.tabs.create({ url: targetUrl });
        } else {
          window.open(targetUrl, '_blank');
        }
        btnDownload.innerHTML = originalBtnText;
        btnDownload.disabled = false;
      }
    });
  }

  // Open WebApp Action
  if (btnOpenWebapp) {
    btnOpenWebapp.addEventListener('click', () => {
      if (chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: WEB_APP_URL });
      } else {
        window.open(WEB_APP_URL, '_blank');
      }
    });
  }
});
