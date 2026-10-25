/* ==========================================================================
   FB4KDownloader Backend Extraction & Stream Handler
   Coordinates client input with server `/api/extract` & native file streams.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const downloadForm = document.getElementById('download-form');
  const videoUrlInput = document.getElementById('url-input') || document.getElementById('video-url');
  const btnSubmit = document.getElementById('download-btn') || document.getElementById('btn-submit');
  const resultCard = document.getElementById('result') || document.getElementById('result-card');
  const toolMsg = document.getElementById('tool-msg');

  // Trigger feedback message
  function notify(msg, type = '') {
    if (window.FB4K && typeof window.FB4K.say === 'function') {
      window.FB4K.say(msg, type);
    } else if (toolMsg) {
      toolMsg.textContent = msg;
      toolMsg.className = 'tool-msg ' + (type === 'ok' ? 'is-ok' : type === 'error' ? 'is-error' : '');
    }
  }

  // Trigger loading UI
  function setLoadingState(loading) {
    if (window.FB4K && typeof window.FB4K.setLoading === 'function') {
      window.FB4K.setLoading(loading);
    } else if (btnSubmit) {
      btnSubmit.disabled = loading;
    }
  }

  // Trigger direct download
  function triggerDirectDownload(url, filename) {
    notify('⚡ Starting download: ' + filename, 'ok');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Core extraction routine
  async function performExtraction(url) {
    if (!url) {
      notify('Please enter or paste a valid Facebook URL.', 'error');
      if (videoUrlInput) videoUrlInput.focus();
      return;
    }

    if (!/^https?:\/\/.+/i.test(url)) {
      notify('Please enter a valid link starting with https://', 'error');
      if (videoUrlInput) videoUrlInput.focus();
      return;
    }

    notify('');
    setLoadingState(true);

    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      setLoadingState(false);

      if (data && data.success) {
        const title = data.title || 'Facebook Video Stream';
        const duration = data.duration || '00:20';
        const thumb = data.thumbnail || '';
        const links = {
          '4k': data.fourKUrl || data.hdUrl || data.sdUrl,
          '1080': data.hdUrl || data.sdUrl,
          '720': data.sdUrl || data.hdUrl,
          'mp3': data.mp3Url || ''
        };

        if (window.FB4K && typeof window.FB4K.showResult === 'function') {
          window.FB4K.showResult({
            title: title,
            duration: duration,
            thumb: thumb,
            links: links
          });
        } else if (resultCard) {
          resultCard.hidden = false;
          resultCard.style.display = 'block';
        }

        notify('Video ready! Choose your preferred format below.', 'ok');
      } else {
        notify(data.message || 'Unable to fetch video from this link. Please check if the video is public.', 'error');
        if (resultCard) resultCard.hidden = true;
      }
    } catch (err) {
      setLoadingState(false);
      notify('Network error. Please try again or refresh the page.', 'error');
      console.error('Extract error:', err);
    }
  }

  // Form submit handler
  if (downloadForm && videoUrlInput) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = videoUrlInput.value.trim();
      performExtraction(val);
    });
  }

  // Direct download button bindings on format links
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-format]');
    if (!btn) return;
    const format = btn.getAttribute('data-format');
    const targetUrl = btn.dataset.url || btn.getAttribute('href');

    if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('javascript:')) {
      // Allow default browser download if it's a real direct URL, or stream
      const filenames = {
        '4k': 'fb4kdownloader_video_4k.mp4',
        '1080': 'fb4kdownloader_video_1080p.mp4',
        '720': 'fb4kdownloader_video_720p.mp4',
        'mp3': 'fb4kdownloader_audio.mp3'
      };
      const fname = filenames[format] || 'fb4kdownloader_video.mp4';
      triggerDirectDownload(targetUrl, fname);
      e.preventDefault();
    }
  });
// Google Play Coming Soon Handler
  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('#googlePlayBtn') || e.target.closest('.btn-google-play');
    if (!playBtn) return;
    e.preventDefault();
    alert('FB4KDownloader Android App is currently in final testing and will be officially available on the Google Play Store soon!\n\nIn the meantime, you can use our mobile web downloader or Chrome extension for instant downloads.');
  });
});
