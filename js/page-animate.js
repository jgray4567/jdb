/* ── JDB Page Animate — scroll-triggered fade-up, v1 ── */
(function () {
  'use strict';

  /* ── Injected styles ── */
  var css = [
    /* Page wrapper fades in instantly on load */
    '.page-wrapper, .page-wrapper-anthem {',
    '  animation: paFadeIn 0.45s ease both;',
    '}',
    '@keyframes paFadeIn {',
    '  from { opacity: 0; }',
    '  to   { opacity: 1; }',
    '}',

    /* Animated elements start hidden */
    '.pa-item {',
    '  opacity: 0;',
    '  transform: translateY(26px);',
    '  transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),',
    '              transform 0.6s cubic-bezier(0.22,1,0.36,1);',
    '}',
    '.pa-item.pa-in {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '}',

    /* Respect reduced-motion */
    '@media (prefers-reduced-motion: reduce) {',
    '  .page-wrapper, .page-wrapper-anthem { animation: none; }',
    '  .pa-item { opacity: 1; transform: none; transition: none; }',
    '}',
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Elements to animate ── */
  var TARGETS = [
    /* Section headings */
    '.jdb-section-title',
    '.jdb-h3',
    '.jdb-h3-event',
    '.jdb-h3-international',
    '.heading-3',
    '.heading-7',
    '.heading-9',
    '.heading-h2',
    /* Body text */
    '.jdb-paragraph',
    '.paragraph',
    /* Images / thumbnails */
    '.jdb-thumbnail',
    '.jdb-thumbnail-copy',
    /* Grid rows */
    '.w-row',
    /* Cards */
    '.card',
    /* Bio page columns */
    '.section-3 .w-col',
    /* Section intros */
    '.section-intro',
    /* Events */
    '.events-section-head',
    /* Anthem board */
    '.anthemboard',
    /* Feature section (index) */
    '.sb-headline',
    '.sb-image-wrap',
    '.sb-body',
    '.sb-legacy-heading',
    '.sb-con-record',
  ].join(',');

  function init() {
    var all = Array.prototype.slice.call(document.querySelectorAll(TARGETS));

    /* Filter out anything inside the nav or footer */
    all = all.filter(function (el) {
      return !el.closest('.bn-bar') && !el.closest('.footer');
    });

    if (!all.length) return;

    /* Group siblings so stagger applies per-parent */
    var parentMap = new Map();
    all.forEach(function (el) {
      el.classList.add('pa-item');
      var key = el.parentElement || document.body;
      if (!parentMap.has(key)) parentMap.set(key, []);
      parentMap.get(key).push(el);
    });

    /* Stagger delay: 80 ms per sibling */
    parentMap.forEach(function (siblings) {
      siblings.forEach(function (el, i) {
        el.style.transitionDelay = (i * 80) + 'ms';
      });
    });

    /* IntersectionObserver — reveal on scroll */
    if (!('IntersectionObserver' in window)) {
      /* Fallback for old browsers */
      all.forEach(function (el) { el.classList.add('pa-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pa-in');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.07,
      rootMargin: '0px 0px -36px 0px',
    });

    all.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
