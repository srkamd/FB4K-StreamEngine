(function() {
  const WEB_APP_URL = 'https://fb4kdownloader.com';

  function injectFbDownloaderButton() {
    if (document.getElementById('fb4k-floating-action-btn')) return;

    const btn = document.createElement('a');
    btn.id = 'fb4k-floating-action-btn';
    btn.className = 'fdown-floating-btn';
    btn.innerHTML = `<span>📥</span> Download 4K with FB4KDownloader`;
    btn.target = '_blank';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = window.location.href;
      
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'download_video', url: currentUrl }, (response) => {
          if (!response || !response.success) {
            const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(currentUrl)}`;
            window.open(targetUrl, '_blank');
          }
        });
      } else {
        const targetUrl = `${WEB_APP_URL}?url=${encodeURIComponent(currentUrl)}`;
        window.open(targetUrl, '_blank');
      }
    });

    document.body.appendChild(btn);
  }

  // Inject floating button when on Facebook reel or video pages
  setInterval(() => {
    const url = window.location.href;
    if (url.includes('/reel/') || url.includes('/watch/') || url.includes('/videos/')) {
      injectFbDownloaderButton();
    }
  }, 2000);
})();
