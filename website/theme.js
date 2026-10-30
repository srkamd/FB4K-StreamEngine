/* ==========================================================================
   FB4KDownloader Theme v4: UI Behaviour & Global Helpers
   Mobile-first, dependency-free.
   ========================================================================== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var header = $('.site-header'), nav = $('#nav'), toggle = $('.nav-toggle');
  var menuBtn = $('.menu-btn'), submenu = $('#res-menu');

  function setOpen(btn, panel, open) {
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(toggle, nav, open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  if (menuBtn && submenu) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menuBtn, submenu, menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }

  document.addEventListener('click', function (e) {
    if (submenu && !e.target.closest('.has-menu')) setOpen(menuBtn, submenu, false);
    if (nav && nav.classList.contains('is-open') && !e.target.closest('.site-header')) setOpen(toggle, nav, false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setOpen(menuBtn, submenu, false);
    setOpen(toggle, nav, false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) {
      setOpen(toggle, nav, false);
      if (submenu) setOpen(menuBtn, submenu, false);
    }
  });

  /* Back to Top */
  var top = $('.to-top');
  function onScroll() {
    if (top) top.classList.toggle('is-visible', window.scrollY > 500);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 4);
  }
  if (top) {
    top.addEventListener('click', function () {
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Tool UI feedback helpers */
  function say(text, kind) {
    var msg = $('#tool-msg');
    if (!msg) return;
    msg.textContent = text || '';
    msg.className = 'tool-msg' + (kind === 'ok' ? ' is-ok' : kind === 'error' ? ' is-error' : '');
  }

  function setLoading(on) {
    var dlBtn = $('#download-btn'), result = $('#result');
    if (!dlBtn) return;
    var label = dlBtn.querySelector('.label') || dlBtn;
    dlBtn.classList.toggle('is-loading', !!on);
    dlBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    if (label && label.classList && label.classList.contains('label')) {
      if (on) {
        dlBtn.dataset.origLabel = label.textContent;
        label.textContent = 'Fetching...';
      } else if (dlBtn.dataset.origLabel) {
        label.textContent = dlBtn.dataset.origLabel;
      }
    }
    var thumb = $('#result-thumb');
    if (thumb) thumb.classList.toggle('is-loading', !!on && result && !result.hidden);
  }

  function showResult(d) {
    var result = $('#result');
    if (!result) return;
    d = d || {};
    var t = $('#result-title'), th = $('#result-thumb'), du = $('#result-time');
    if (t && d.title) t.textContent = d.title;
    if (th && d.thumb) {
      if (th.tagName === 'IMG') th.src = d.thumb;
      else th.style.backgroundImage = 'url("' + String(d.thumb).replace(/"/g, '%22') + '")';
    }
    if (du && d.duration) du.textContent = d.duration;
    if (d.links) {
      var rows = result.querySelectorAll('[data-format]');
      for (var i = 0; i < rows.length; i++) {
        var fmt = rows[i].getAttribute('data-format');
        var u = d.links[fmt];
        if (u) {
          rows[i].setAttribute('href', u);
          rows[i].dataset.url = u;
        }
      }
    }
    result.hidden = false;
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.FB4K = { setLoading: setLoading, showResult: showResult, say: say };

  /* Paste button handling */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#paste-btn')) return;
    var input = $('#url-input');
    if (!input) return;
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      input.focus();
      say('Long-press the box and choose Paste.');
      return;
    }
    navigator.clipboard.readText().then(function (text) {
      var clean = (text || '').trim();
      input.value = clean;
      input.focus();
      say(clean ? 'Link pasted. Press Download.' : 'Clipboard is empty.', clean ? 'ok' : '');
    }).catch(function () {
      input.focus();
      say('Clipboard blocked. Long-press the box and choose Paste.');
    });
  });

  /* Auto-update copyright year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Cookie Consent Banner Injection & Handler */
  try {
    if (!localStorage.getItem('fb4k_cookie_consent')) {
      var banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'cookie-banner is-visible';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Cookie consent');
      banner.innerHTML = '<div class="wrap cookie-inner">' +
        '<p>We use essential cookies and basic telemetry to ensure fast, secure service and support creators. By using our site, you agree to our <a href="/privacy">Privacy Policy</a>.</p>' +
        '<div class="cookie-actions">' +
        '<button id="cookie-accept" class="btn btn-accent btn-sm">Accept Cookies</button>' +
        '<a href="/privacy" class="btn btn-ghost btn-sm">Learn More</a>' +
        '</div></div>';
      document.body.appendChild(banner);

      document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'cookie-accept') {
          localStorage.setItem('fb4k_cookie_consent', 'true');
          banner.classList.remove('is-visible');
          setTimeout(function () { banner.remove(); }, 300);
        }
      });
    }
  } catch (err) {}
})();
