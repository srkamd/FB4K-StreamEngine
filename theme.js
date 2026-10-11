/* FB4KDownloader theme: UI behaviour only (no libraries, ~1 KB).
   Your existing download logic is NOT touched by this file. */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.nav-toggle');
  var menuBtn = document.querySelector('.menu-btn');
  var submenu = document.getElementById('res-menu');

  function setOpen(btn, panel, open) {
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.classList.toggle('is-open', open);
  }

  // Mobile hamburger
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(toggle, nav, open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Resources dropdown
  if (menuBtn && submenu) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menuBtn, submenu, menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }

  // Close on outside click / Escape
  document.addEventListener('click', function (e) {
    if (submenu && !e.target.closest('.has-menu')) setOpen(menuBtn, submenu, false);
    if (nav && nav.classList.contains('is-open') && !e.target.closest('.site-header')) {
      setOpen(toggle, nav, false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setOpen(menuBtn, submenu, false);
    setOpen(toggle, nav, false);
  });

  // Reset mobile state when resizing to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) setOpen(toggle, nav, false);
  });

  // Header shadow on scroll
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 4);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
