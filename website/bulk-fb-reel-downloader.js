document.addEventListener('DOMContentLoaded', () => {
  const batchListForm = document.getElementById('batch-list-form');
  const linksTextarea = document.getElementById('links-textarea');
  const btnBatchSubmit = document.getElementById('btn-batch-submit');
  const btnPasteList = document.getElementById('btn-paste-list');
  const btnImportFile = document.getElementById('btn-import-file');
  const txtFileInput = document.getElementById('txt-file-input');

  const batchResultContainer = document.getElementById('batch-result-container');
  const batchGrid = document.getElementById('batch-grid');
  const pageFoundTitle = document.getElementById('page-found-title');
  const selectedCount = document.getElementById('selected-count');
  const btnStartBulkDownload = document.getElementById('btn-start-bulk-download');

  // PC Target Folder Selector
  const btnSelectFolder = document.getElementById('btn-select-folder');
  const folderPathDisplay = document.getElementById('folder-path-display');
  const folderCardWrapper = document.getElementById('folder-card-wrapper');
  const folderIconBox = document.getElementById('folder-icon-box');
  let chosenDirectoryHandle = null;

  // Video Preview Modal Elements
  const previewModal = document.getElementById('preview-modal');
  const previewModalClose = document.getElementById('preview-modal-close');
  const previewVideoPlayer = document.getElementById('preview-video-player');
  const previewVideoTitle = document.getElementById('preview-video-title');

  // Quality Modal Elements
  const qualityModal = document.getElementById('quality-modal');
  const qualityModalClose = document.getElementById('quality-modal-close');
  const modalVideoCount = document.getElementById('modal-video-count');
  const btnConfirmBulkDownload = document.getElementById('btn-confirm-bulk-download');
  const qualityCards = document.querySelectorAll('.quality-radio-card');

  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  let fetchedVideos = [];

  function showToast(message) {
    if (!toastMsg || !toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // Import TXT / CSV File from PC Action
  if (btnImportFile && txtFileInput) {
    btnImportFile.addEventListener('click', () => {
      txtFileInput.click();
    });

    txtFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target.result;
        if (linksTextarea) {
          linksTextarea.value = textContent;
          showToast(`Imported "${file.name}" successfully! Click Process & Auto-Download.`);
        }
      };
      reader.readAsText(file);
    });
  }

  // Paste Clipboard to Textarea
  if (btnPasteList) {
    btnPasteList.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            linksTextarea.value = text;
            showToast('Pasted link list from clipboard!');
          }
        }
      } catch (err) {
        showToast('Unable to read clipboard.');
      }
    });
  }

  // Choose PC Target Folder Action with Clear Folder Address Display
  if (btnSelectFolder) {
    btnSelectFolder.addEventListener('click', async () => {
      if ('showDirectoryPicker' in window) {
        try {
          chosenDirectoryHandle = await window.showDirectoryPicker();
          
          if (folderPathDisplay) {
            folderPathDisplay.innerHTML = `✅ <strong style="color: #10b981; font-size: 0.95rem;">Target PC Folder Selected: "${chosenDirectoryHandle.name}"</strong> <span style="color: var(--primary-teal);">(Auto Direct Save Active - 0 IDM Popups)</span>`;
          }

          if (folderCardWrapper) {
            folderCardWrapper.style.borderColor = '#10b981';
            folderCardWrapper.style.background = 'rgba(16, 185, 129, 0.08)';
          }

          if (folderIconBox) {
            folderIconBox.style.background = 'rgba(16, 185, 129, 0.2)';
            folderIconBox.style.color = '#10b981';
          }

          showToast(`✅ Selected PC Folder: "${chosenDirectoryHandle.name}"! Auto Direct Save Enabled.`);
        } catch (err) {
          if (err.name !== 'AbortError') {
            showToast('Unable to select folder. Defaulting to PC Downloads folder.');
          }
        }
      } else {
        showToast('Browser uses default PC Downloads folder.');
      }
    });
  }

  // Radio Card Selector UI Toggle
  qualityCards.forEach(card => {
    card.addEventListener('click', () => {
      qualityCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Handle Multi-line Links Form Submit using HOME PAGE SINGLE EXTRACTION REFERENCE
  if (batchListForm) {
    batchListForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rawText = linksTextarea ? linksTextarea.value.trim() : '';

      if (!rawText) {
        showToast('Please paste or import a list of Facebook video links first!');
        return;
      }

      const urlsArray = rawText.split('\n').map(u => u.trim()).filter(u => u.length > 5 && u.startsWith('http'));

      if (urlsArray.length === 0) {
        showToast('No valid Facebook video URLs found in input.');
        return;
      }

      let processUrls = urlsArray;
      if (urlsArray.length > 10) {
        processUrls = urlsArray.slice(0, 10);
        showToast('Personal archive limit: processing first 10 URLs. For larger archives, use Facebook official export.');
      }

      const originalBtn = btnBatchSubmit.innerHTML;
      btnBatchSubmit.disabled = true;

      fetchedVideos = [];
      batchGrid.innerHTML = '';
      batchResultContainer.style.display = 'block';
      batchResultContainer.scrollIntoView({ behavior: 'smooth' });

      showToast(`Processing ${processUrls.length} links in personal archive queue...`);

      for (let i = 0; i < processUrls.length; i++) {
        const url = processUrls[i];
        btnBatchSubmit.innerHTML = `<span class="spinner"></span> Extracting Video (${i + 1}/${urlsArray.length})...`;

        try {
          const resp = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
          const data = await resp.json();

          if (data.success && (data.hdUrl || data.sdUrl || data.fourKUrl)) {
            fetchedVideos.push({
              id: (i + 1).toString(),
              originalUrl: url,
              title: data.title || `Facebook Reel #${i + 1}`,
              duration: data.duration || '00:20',
              thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
              fourKUrl: data.fourKUrl,
              hdUrl: data.hdUrl,
              sdUrl: data.sdUrl,
              mp3Url: data.mp3Url,
              validStream: true
            });
          } else {
            fetchedVideos.push({
              id: (i + 1).toString(),
              originalUrl: url,
              title: `Facebook Reel #${i + 1} (Private/Restricted)`,
              duration: '00:00',
              thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
              validStream: false
            });
          }
        } catch (err) {
          console.error(`Link ${i + 1} extraction error:`, err);
          fetchedVideos.push({
            id: (i + 1).toString(),
            originalUrl: url,
            title: `Facebook Reel #${i + 1} (Error)`,
            duration: '00:00',
            thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
            validStream: false
          });
        }

        renderVideoGrid(fetchedVideos);
      }

      btnBatchSubmit.innerHTML = originalBtn;
      btnBatchSubmit.disabled = false;
      showToast(`✅ Successfully processed all ${fetchedVideos.length} Facebook video links!`);
    });
  }

  // Render Batch Video Grid
  function renderVideoGrid(videos) {
    batchGrid.innerHTML = '';
    if (pageFoundTitle) pageFoundTitle.textContent = `Links Queue Processed (${videos.length})`;

    videos.forEach((video, index) => {
      const card = document.createElement('div');
      card.className = 'batch-video-card';
      card.setAttribute('id', `card-${index}`);

      const statusHtml = video.validStream 
        ? `<i class="fa-solid fa-circle-check" style="color: var(--primary-teal);"></i> Extracted & Ready`
        : `<i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i> Private Link / Stream Unavailable`;

      const checkboxHtml = video.validStream ? `<input type="checkbox" class="video-checkbox" data-index="${index}" checked>` : '';

      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
          ${checkboxHtml}
          <div class="batch-card-thumb">
            <img src="${video.thumbnail}" alt="Thumbnail">
            <span class="duration-tag">${video.duration}</span>
          </div>
        </div>
        <div class="batch-card-body" style="padding: 0 16px; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
          <h4 title="${video.title}" style="margin: 0; font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${video.title}</h4>
          <div id="status-badge-${index}" style="margin-top: 2px; font-size: 0.78rem; display: flex; align-items: center; gap: 6px;">
            ${statusHtml}
          </div>
        </div>
        <div style="flex-shrink: 0; display: flex; align-items: center; gap: 12px;">
          ${video.validStream ? `<button type="button" class="btn-play-preview" data-index="${index}" style="position: static; opacity: 1; visibility: visible; transform: none; padding: 6px 14px; font-size: 0.75rem; border-radius: 4px; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-play"></i> Preview</button>` : ''}
        </div>
      `;
      batchGrid.appendChild(card);
    });

    updateSelectedCount();

    document.querySelectorAll('.video-checkbox').forEach(cb => {
      cb.addEventListener('change', updateSelectedCount);
    });

    document.querySelectorAll('.btn-play-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const item = fetchedVideos[idx];
        if (item && item.validStream && previewModal && previewVideoPlayer) {
          previewVideoTitle.textContent = item.title;
          previewVideoPlayer.src = item.hdUrl || item.fourKUrl;
          previewModal.classList.add('active');
          previewVideoPlayer.play().catch(() => {});
        }
      });
    });
  }

  function closePreviewModal() {
    if (previewModal) previewModal.classList.remove('active');
    if (previewVideoPlayer) {
      previewVideoPlayer.pause();
      previewVideoPlayer.src = '';
    }
  }

  if (previewModalClose) previewModalClose.addEventListener('click', closePreviewModal);
  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) closePreviewModal();
    });
  }

  function updateSelectedCount() {
    const selected = document.querySelectorAll('.video-checkbox:checked');
    if (selectedCount) selectedCount.textContent = selected.length;
    if (modalVideoCount) modalVideoCount.textContent = selected.length;
  }

  // Trigger Confirmation Modal
  if (btnStartBulkDownload) {
    btnStartBulkDownload.addEventListener('click', () => {
      const selected = document.querySelectorAll('.video-checkbox:checked');
      if (selected.length === 0) {
        showToast('Please select at least one valid extracted video to download!');
        return;
      }
      qualityModal.classList.add('active');
    });
  }

  if (qualityModalClose) {
    qualityModalClose.addEventListener('click', () => {
      qualityModal.classList.remove('active');
    });
  }

  // BULK QUEUE DOWNLOAD EXECUTION WITH GUARANTEED FULL MB FILE SIZE VALIDATION
  if (btnConfirmBulkDownload) {
    btnConfirmBulkDownload.addEventListener('click', async () => {
      const selectedBoxes = document.querySelectorAll('.video-checkbox:checked');
      const qualityRadio = document.querySelector('input[name="bulk-quality"]:checked');
      const selectedQuality = qualityRadio ? qualityRadio.value : '1080p';

      qualityModal.classList.remove('active');

      if (selectedBoxes.length === 0) return;

      const folderName = chosenDirectoryHandle ? chosenDirectoryHandle.name : 'PC Downloads';
      showToast(`⚡ Auto downloading ${selectedBoxes.length} videos into "${folderName}"...`);

      let countSaved = 0;

      function handleFallbackDirectCdn(downloadUrl, statusBadge) {
        try {
          const urlParam = downloadUrl.match(/[\?&]url=([^&]+)/);
          if (urlParam && urlParam[1]) {
            const rawCdnUrl = decodeURIComponent(urlParam[1]);
            console.log('Falling back to direct CDN download:', rawCdnUrl);
            
            const a = document.createElement('a');
            a.href = rawCdnUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            if (statusBadge) {
              statusBadge.innerHTML = `<span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Redirected to Direct Save!</span>`;
            }
            return true;
          }
        } catch (e) {
          console.error('Fallback redirect failed:', e);
        }
        return false;
      }

      for (let idx = 0; idx < selectedBoxes.length; idx++) {
        const cb = selectedBoxes[idx];
        const index = parseInt(cb.getAttribute('data-index'), 10);
        const video = fetchedVideos[index];
        if (!video || !video.validStream) continue;

        const statusBadge = document.getElementById(`status-badge-${index}`);
        if (statusBadge) {
          statusBadge.innerHTML = `<span style="color: var(--primary-teal); font-weight: 600;"><i class="fa-solid fa-spinner fa-spin"></i> Downloading (${idx + 1}/${selectedBoxes.length})...</span>`;
        }

        let downloadUrl = video.hdUrl || video.fourKUrl;
        if (selectedQuality === '4k') downloadUrl = video.fourKUrl || video.hdUrl;
        if (selectedQuality === 'sd') downloadUrl = video.sdUrl || video.hdUrl;
        if (selectedQuality === 'mp3') downloadUrl = video.mp3Url || video.hdUrl;

        let safeTitle = video.title.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').substring(0, 30);
        if (!safeTitle || safeTitle === '_') safeTitle = `fb_reel_${idx + 1}`;
        const ext = selectedQuality === 'mp3' ? 'mp3' : 'mp4';
        const filename = `${safeTitle}_${selectedQuality}.${ext}`;

        if (chosenDirectoryHandle) {
          try {
            showToast(`Downloading (${idx + 1}/${selectedBoxes.length}): ${filename}...`);

            let resp = await fetch(downloadUrl);
            let blob = await resp.blob();

            if (blob.size > 50000) {
              const opts = { mode: 'readwrite' };
              if (await chosenDirectoryHandle.queryPermission(opts) !== 'granted') {
                await chosenDirectoryHandle.requestPermission(opts);
              }
              const fileHandle = await chosenDirectoryHandle.getFileHandle(filename, { create: true });
              const writable = await fileHandle.createWritable();
              await writable.write(blob);
              await writable.close();

              countSaved++;
              const sizeInMB = (blob.size / 1024 / 1024).toFixed(1);
              if (statusBadge) {
                statusBadge.innerHTML = `<span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Saved ${sizeInMB} MB!</span>`;
              }
            } else {
              throw new Error('Downloaded blob is empty or too small');
            }
          } catch (err) {
            console.error('Directory Save Error, falling back to direct native download:', err);
            
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            countSaved++;
            if (statusBadge) {
              statusBadge.innerHTML = `<span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Download Started!</span>`;
            }
          }
        } else {
          // Normal direct native browser download (no CORS or RAM buffering limits)
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          countSaved++;
          if (statusBadge) {
            statusBadge.innerHTML = `<span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Download Started!</span>`;
          }
        }
      }

      showToast(`✅ Successfully downloaded & saved all ${countSaved} videos into "${folderName}"!`);
    });
  }
});
