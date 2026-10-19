document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('ext-url-input');
  const btnDownload = document.getElementById('btn-download');
  const btnText = document.getElementById('btn-text');
  const btnPaste = document.getElementById('btn-paste');
  const statusCard = document.getElementById('status-card');
  const statusMsg = document.getElementById('status-msg');
  const fmtButtons = document.querySelectorAll('.fmt-btn');

  let selectedFormat = '4k';

  // 1. Detect Active Chrome Tab
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const activeUrl = tabs[0].url;

        if (activeUrl.includes('facebook.com') || activeUrl.includes('fb.watch')) {
          urlInput.value = activeUrl;
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
      btnText.textContent = `Download in ${selectedFormat.toUpperCase()}`;
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

  // 4. Download Trigger
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (!url) {
        urlInput.focus();
        statusMsg.textContent = 'Please enter or paste a valid URL!';
        return;
      }

      btnDownload.disabled = true;
      btnText.textContent = `Extracting ${selectedFormat.toUpperCase()} Stream...`;

      chrome.runtime.sendMessage(
        {
          action: 'download_video_stream',
          url: url,
          format: selectedFormat
        },
        (res) => {
          btnDownload.disabled = false;

          if (res && res.success) {
            btnText.textContent = '✅ Download Started!';
            statusMsg.textContent = 'Download initiated! Check your downloads folder.';
            statusCard.classList.add('active');

            setTimeout(() => {
              btnText.textContent = `Download Reel Now`;
            }, 3000);
          } else {
            // Fallback: Open web app
            const targetUrl = `https://fb4kdownloader.com?url=${encodeURIComponent(url)}`;
            chrome.tabs.create({ url: targetUrl });
            btnText.textContent = `Opened on FB4KDownloader.com`;
          }
        }
      );
    });
  }
});
