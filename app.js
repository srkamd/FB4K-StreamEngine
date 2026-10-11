document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements (Supports both old and new theme IDs)
  const downloadForm = document.getElementById('download-form');
  const videoUrlInput = document.getElementById('url-input') || document.getElementById('video-url');
  const btnSubmit = document.getElementById('download-btn') || document.getElementById('btn-submit');
  const btnPaste = document.getElementById('paste-btn') || document.getElementById('btn-paste');
  const resultCard = document.getElementById('result') || document.getElementById('result-card');
  const toolMsg = document.getElementById('tool-msg');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg') || (toast ? toast.querySelector('span') : null);

  // Result Elements
  const resThumbnail = document.getElementById('result-thumb') || document.getElementById('res-thumbnail') || document.getElementById('res-thumb');
  const resTitle = document.getElementById('result-title') || document.getElementById('res-title');
  const resDuration = document.getElementById('result-time') || document.getElementById('res-duration');
  
  const btnDl4k = document.querySelector('[data-format="4k"]') || document.getElementById('btn-dl-4k') || document.getElementById('dl-4k');
  const btnDlHd = document.querySelector('[data-format="1080"]') || document.getElementById('btn-dl-hd') || document.getElementById('dl-hd');
  const btnDlSd = document.querySelector('[data-format="720"]') || document.getElementById('btn-dl-sd') || document.getElementById('dl-sd');
  const btnDlMp3 = document.querySelector('[data-format="mp3"]') || document.getElementById('btn-dl-mp3') || document.getElementById('dl-mp3');

  // Status & Message Helper
  function showStatus(message, isError = false) {
    if (toolMsg) {
      toolMsg.textContent = message;
      toolMsg.className = 'tool-msg ' + (isError ? 'is-error' : 'is-ok');
    }
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }

  // URL Validation Helper
  function isFacebookUrl(str) {
    if (!str || typeof str !== 'string') return false;
    return /facebook\.com|fb\.watch|fb\.gg|fb\.me/i.test(str.trim());
  }

  // Clear (✕) Button Handler if exists
  const btnClearUrl = document.getElementById('btn-clear-url');
  if (videoUrlInput && btnClearUrl) {
    videoUrlInput.addEventListener('input', () => {
      btnClearUrl.classList.toggle('show', videoUrlInput.value.trim().length > 0);
    });

    btnClearUrl.addEventListener('click', () => {
      videoUrlInput.value = '';
      btnClearUrl.classList.remove('show');
      if (resultCard) {
        resultCard.hidden = true;
        resultCard.style.display = 'none';
      }
      videoUrlInput.focus();
    });
  }

  // Paste Button Handler (Auto-extract on valid link)
  if (btnPaste && videoUrlInput) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          const clean = (text || '').trim();
          if (clean) {
            videoUrlInput.value = clean;
            if (btnClearUrl) btnClearUrl.classList.add('show');
            if (isFacebookUrl(clean)) {
              showStatus('Link detected! Fetching video...');
              performExtraction(clean);
            } else {
              showStatus('Link pasted. Press Download to fetch.');
            }
          } else {
            showStatus('Clipboard is empty.', true);
          }
        } else {
          videoUrlInput.focus();
          showStatus('Please paste the Facebook link.');
        }
      } catch (err) {
        videoUrlInput.focus();
        showStatus('Please paste the Facebook link directly.');
      }
    });
  }

  // Native Trigger for Downloads
  function triggerDirectDownload(url, filename) {
    showStatus('⚡ Starting download: ' + filename);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Core Extraction Function
  async function performExtraction(url) {
    if (!btnSubmit) return;
    const originalBtnContent = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<svg class="spinner" style="width:18px;height:18px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4m-10-10h4m12 0h4m-3.5-6.5-2.8 2.8m-9.4 9.4-2.8 2.8m0-15 2.8 2.8m9.4 9.4 2.8 2.8"/></svg> Fetching...`;
    btnSubmit.disabled = true;

    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      btnSubmit.innerHTML = originalBtnContent;
      btnSubmit.disabled = false;

      if (data.success) {
        if (resTitle) resTitle.textContent = data.title || 'Facebook Video Stream';
        if (resDuration && data.duration) resDuration.textContent = data.duration;
        
        if (resThumbnail) {
          if (resThumbnail.tagName === 'IMG') {
            resThumbnail.src = data.thumbnail || '';
          } else {
            resThumbnail.style.backgroundImage = `url('${data.thumbnail || ''}')`;
            const imgInside = resThumbnail.querySelector('img');
            if (imgInside) imgInside.src = data.thumbnail || '';
          }
        }

        if (btnDl4k && data.fourKUrl) {
          btnDl4k.dataset.url = data.fourKUrl;
          btnDl4k.href = data.fourKUrl;
        }
        if (btnDlHd && data.hdUrl) {
          btnDlHd.dataset.url = data.hdUrl;
          btnDlHd.href = data.hdUrl;
        }
        if (btnDlSd && data.sdUrl) {
          btnDlSd.dataset.url = data.sdUrl;
          btnDlSd.href = data.sdUrl;
        }
        if (btnDlMp3 && data.mp3Url) {
          btnDlMp3.dataset.url = data.mp3Url;
          btnDlMp3.href = data.mp3Url;
        }

        if (resultCard) {
          resultCard.hidden = false;
          resultCard.style.display = 'block';
          resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showStatus(`Video ready! Choose format below.`);
      } else {
        showStatus(data.message || 'Could not parse Facebook link.', true);
      }
    } catch (err) {
      btnSubmit.innerHTML = originalBtnContent;
      btnSubmit.disabled = false;
      showStatus('Connection error. Please try again.', true);
    }
  }

  // Form Submit Handler
  if (downloadForm && videoUrlInput) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = videoUrlInput.value.trim();
      if (!url) {
        showStatus('Please paste a Facebook link first.', true);
        videoUrlInput.focus();
        return;
      }
      performExtraction(url);
    });
  }

  // 4K Upscale Download Handler
  if (btnDl4k) {
    btnDl4k.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDl4k.dataset.url || btnDl4k.getAttribute('href');
      if (targetUrl && targetUrl !== '#') {
        triggerDirectDownload(targetUrl, 'fb4kdownloader_video_4k.mp4');
      }
    });
  }

  // 1080p Full HD Download Handler
  if (btnDlHd) {
    btnDlHd.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlHd.dataset.url || btnDlHd.getAttribute('href');
      if (targetUrl && targetUrl !== '#') {
        triggerDirectDownload(targetUrl, 'fb4kdownloader_video_1080p.mp4');
      }
    });
  }

  // 720p SD Download Handler
  if (btnDlSd) {
    btnDlSd.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlSd.dataset.url || btnDlSd.getAttribute('href');
      if (targetUrl && targetUrl !== '#') {
        triggerDirectDownload(targetUrl, 'fb4kdownloader_video_720p.mp4');
      }
    });
  }

  // MP3 Audio Download Handler
  if (btnDlMp3) {
    btnDlMp3.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlMp3.dataset.url || btnDlMp3.getAttribute('href');
      if (targetUrl && targetUrl !== '#') {
        triggerDirectDownload(targetUrl, 'fb4kdownloader_audio.mp3');
      }
    });
  }
});
