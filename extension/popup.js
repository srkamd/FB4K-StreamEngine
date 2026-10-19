document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('ext-url-input');
  const btnDownload = document.getElementById('btn-download');
  const btnText = document.getElementById('btn-text');
  const btnPaste = document.getElementById('btn-paste');
  const statusCard = document.getElementById('status-card');
  const statusMsg = document.getElementById('status-msg');
  const fmtButtons = document.querySelectorAll('.fmt-btn');

  let selectedFormat = '4k';
  let activeTabId = null;

  // 1. Detect Active Chrome Tab
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        activeTabId = tabs[0].id;
        const activeUrl = tabs[0].url || '';

        if (activeUrl.includes('facebook.com') || activeUrl.includes('fb.watch')) {
          urlInput.value = activeUrl.split('?')[0];
          statusCard.classList.add('active');

          if (activeUrl.includes('/reel/')) {
            statusMsg.textContent = 'Active Facebook Reel Detected!';
          } else if (activeUrl.includes('/watch/')) {
            statusMsg.textContent = 'Facebook Watch Video Detected!';
          } else {
            statusMsg.textContent = 'Facebook Tab Detected!';
          }
        } else {
          statusMsg.textContent = 'Open any Facebook Reel to auto-detect!';
        }
      }
    });
  }

  // 2. Format Selection Logic
  fmtButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      fmtButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFormat = btn.getAttribute('data-format') || '4k';
      btnText.textContent = `Download ${selectedFormat.toUpperCase()} Video`;
    });
  });

  // 3. Paste Button
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.startsWith('http')) {
          urlInput.value = text.trim();
          statusCard.classList.add('active');
          statusMsg.textContent = 'Link pasted from clipboard!';
        }
      } catch (err) {
        console.error('Clipboard paste error:', err);
      }
    });
  }

  // 4. Download Trigger (Direct Download, No Redirects)
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      btnDownload.disabled = true;
      btnText.textContent = `Resolving ${selectedFormat.toUpperCase()} Video...`;

      chrome.runtime.sendMessage(
        {
          action: 'get_best_stream',
          tabId: activeTabId,
          format: selectedFormat
        },
        (res) => {
          if (res && res.success && res.streamUrl) {
            chrome.runtime.sendMessage(
              {
                action: 'download_file',
                url: res.streamUrl,
                format: selectedFormat,
                title: 'Facebook_Video'
              },
              (dlRes) => {
                btnDownload.disabled = false;
                if (dlRes && dlRes.success) {
                  btnText.textContent = '✅ Download Started!';
                  statusMsg.textContent = 'Video is downloading! Check your downloads.';
                  statusCard.classList.add('active');
                  setTimeout(() => {
                    btnText.textContent = `Download Reel Now`;
                  }, 3000);
                } else {
                  btnText.textContent = `Retry Download`;
                  statusMsg.textContent = 'Download error. Please play the video and retry!';
                }
              }
            );
          } else {
            btnDownload.disabled = false;
            btnText.textContent = `Play Reel & Retry`;
            statusMsg.textContent = 'Please play the video on Facebook for 1 second, then click Download!';
            statusCard.classList.remove('active');
          }
        }
      );
    });
  }
});
