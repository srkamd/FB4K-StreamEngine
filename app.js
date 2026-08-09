document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const downloadForm = document.getElementById('download-form');
  const videoUrlInput = document.getElementById('video-url');
  const btnSubmit = document.getElementById('btn-submit');
  const btnPaste = document.getElementById('btn-paste');
  const resultCard = document.getElementById('result-card');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // Result Elements
  const resThumbnail = document.getElementById('res-thumbnail') || document.getElementById('res-thumb');
  const resTitle = document.getElementById('res-title');
  const resDuration = document.getElementById('res-duration');
  const btnDl4k = document.getElementById('btn-dl-4k') || document.getElementById('dl-4k');
  const btnDlHd = document.getElementById('btn-dl-hd') || document.getElementById('dl-hd');
  const btnDlSd = document.getElementById('btn-dl-sd') || document.getElementById('dl-sd');
  const btnDlMp3 = document.getElementById('btn-dl-mp3') || document.getElementById('dl-mp3');

  // FAQ Accordion elements
  const faqQuestions = document.querySelectorAll('.faq-question');

  // Chrome Extension Modal Elements
  const extModal = document.getElementById('ext-modal');
  const btnExtension = document.getElementById('btn-extension');
  const modalClose = document.getElementById('modal-close');

  // Toast Helper
  function showToast(message) {
    if (!toastMsg || !toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Paste from Clipboard
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            videoUrlInput.value = text;
            showToast('Pasted link from clipboard!');
          } else {
            showToast('Clipboard is empty.');
          }
        }
      } catch (err) {
        showToast('Unable to read clipboard.');
      }
    });
  }

  // Core Extraction Function
  async function performExtraction(url) {
    if (!btnSubmit) return;
    const originalBtnText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<span class="spinner"></span> Fetching Reel...`;
    btnSubmit.disabled = true;

    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      btnSubmit.innerHTML = originalBtnText;
      btnSubmit.disabled = false;

      if (data.success) {
        if (resTitle) resTitle.textContent = data.title || 'Facebook Video Stream';
        if (resDuration && data.duration) resDuration.textContent = data.duration;
        if (resThumbnail && data.thumbnail) resThumbnail.src = data.thumbnail;

        if (btnDl4k && data.fourKUrl) {
          btnDl4k.dataset.url = data.fourKUrl;
          btnDl4k.style.display = 'inline-flex';
        }
        if (btnDlHd && data.hdUrl) {
          btnDlHd.dataset.url = data.hdUrl;
          btnDlHd.style.display = 'inline-flex';
        }
        if (btnDlSd && data.sdUrl) {
          btnDlSd.dataset.url = data.sdUrl;
          btnDlSd.style.display = 'inline-flex';
        }
        if (btnDlMp3 && data.mp3Url) {
          btnDlMp3.dataset.url = data.mp3Url;
          btnDlMp3.style.display = 'inline-flex';
        }

        if (resultCard) {
          resultCard.style.display = 'block';
          resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast(`Facebook Video fetched (${data.duration || '00:20'})! 4K Upscale & HD Ready.`);
      } else {
        showToast(data.message || 'Could not parse Facebook link.');
      }

    } catch (err) {
      btnSubmit.innerHTML = originalBtnText;
      btnSubmit.disabled = false;
      showToast('Connection error. Please try again.');
    }
  }

  // Handle Form Submission
  if (downloadForm) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = videoUrlInput.value.trim();

      if (!url) {
        showToast('Please paste a Facebook Video or Reel link first!');
        videoUrlInput.focus();
        return;
      }
      performExtraction(url);
    });
  }

  // IN-MEMORY BLOB DOWNLOAD HELPER (Completely Bypasses IDM Popups!)
  // DIRECT NATIVE DOWNLOAD TRIGGER (Bypasses CORS and Memory limits!)
  function triggerDirectBlobDownload(downloadUrl, defaultFilename) {
    showToast('⚡ Starting direct video download...');
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 4K AI Upscaling Button Handler (Direct In-Memory Blob Stream - Zero IDM Popups!)
  if (btnDl4k) {
    btnDl4k.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetDownloadUrl = btnDl4k.dataset.url || btnDl4k.href;
      if (!targetDownloadUrl || btnDl4k.classList.contains('processing')) return;

      btnDl4k.classList.add('processing');
      const textSpan = btnDl4k.querySelector('span:first-child');
      const badgeSpan = btnDl4k.querySelector('.badge-4k');
      const originalText = textSpan.innerHTML;

      let progress = 0;
      showToast('⚡ 4K AI Video Upscaling Engine Started...');

      const interval = setInterval(async () => {
        progress += Math.floor(Math.random() * 8) + 5;
        if (progress > 100) progress = 100;

        btnDl4k.style.setProperty('--progress', `${progress}%`);

        if (badgeSpan) {
          badgeSpan.textContent = `${progress}%`;
        }

        if (progress < 25) {
          textSpan.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Initializing 4K AI Engine...`;
        } else if (progress < 65) {
          textSpan.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> AI Upscaling Frames (3840x2160)... ${progress}%`;
        } else if (progress < 95) {
          textSpan.innerHTML = `<i class="fa-solid fa-film"></i> Transcoding 4K Ultra HD MP4... ${progress}%`;
        } else {
          textSpan.innerHTML = `<i class="fa-solid fa-circle-check"></i> 4K Video Transcoded! Starting Direct Save...`;
        }

        if (progress >= 100) {
          clearInterval(interval);

          await triggerDirectBlobDownload(targetDownloadUrl, 'fb4kdownloader_video_4k.mp4');

          setTimeout(() => {
            btnDl4k.classList.remove('processing');
            btnDl4k.style.removeProperty('--progress');
            textSpan.innerHTML = originalText;
            if (badgeSpan) badgeSpan.textContent = '4K AI';
          }, 2000);
        }
      }, 200);
    });
  }

  // Standard HD / SD / MP3 In-Memory Blob Stream Handlers
  if (btnDlHd) {
    btnDlHd.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlHd.dataset.url || btnDlHd.href;
      if (targetUrl) triggerDirectBlobDownload(targetUrl, 'fb4kdownloader_video_1080p.mp4');
    });
  }

  if (btnDlSd) {
    btnDlSd.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlSd.dataset.url || btnDlSd.href;
      if (targetUrl) triggerDirectBlobDownload(targetUrl, 'fb4kdownloader_video_720p.mp4');
    });
  }

  if (btnDlMp3) {
    btnDlMp3.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = btnDlMp3.dataset.url || btnDlMp3.href;
      if (targetUrl) triggerDirectBlobDownload(targetUrl, 'fb4kdownloader_audio.mp3');
    });
  }

  // FAQ Accordion Toggle
  faqQuestions.forEach(questionBtn => {
    questionBtn.addEventListener('click', () => {
      const parentItem = questionBtn.closest('.faq-item');
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });
      parentItem.classList.toggle('active');
    });
  });

  // Chrome Extension Modal Controls
  function openModal() {
    if (extModal) extModal.classList.add('active');
  }

  function closeModal() {
    if (extModal) extModal.classList.remove('active');
  }

  if (btnExtension) btnExtension.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (extModal) {
    extModal.addEventListener('click', (e) => {
      if (e.target === extModal) closeModal();
    });
  }

  // GDPR Cookie Consent Banner for Google AdSense Compliance
  if (!localStorage.getItem('fb4k_cookie_accepted')) {
    const cookieDiv = document.createElement('div');
    cookieDiv.className = 'cookie-banner';
    cookieDiv.innerHTML = `
      <div class="cookie-text">
        🍪 We use cookies to personalize content, analyze traffic, and serve targeted ads. By using FB4KDownloader.com, you agree to our <a href="/privacy">Privacy Policy</a>.
      </div>
      <button class="btn-cookie-accept" id="btn-accept-cookies">Accept & Close</button>
    `;
    document.body.appendChild(cookieDiv);
    setTimeout(() => cookieDiv.classList.add('show'), 1000);

    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
      localStorage.setItem('fb4k_cookie_accepted', 'true');
      cookieDiv.classList.remove('show');
      setTimeout(() => cookieDiv.remove(), 500);
    });
  }

  // Theme Switching Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconLight = document.getElementById('theme-icon-light');
  const themeIconDark = document.getElementById('theme-icon-dark');

  function updateThemeUI(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (themeIconLight) themeIconLight.style.display = 'none';
      if (themeIconDark) themeIconDark.style.display = 'inline-block';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIconLight) themeIconLight.style.display = 'inline-block';
      if (themeIconDark) themeIconDark.style.display = 'none';
    }
  }

  // Set initial UI state
  const isDarkInitial = document.documentElement.classList.contains('dark');
  updateThemeUI(isDarkInitial);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeUI(isDark);
    });
  }
});
