/* =========================================================================
   Legacy Estate Sales — script.js
   Vanilla, dependency-free. Respects prefers-reduced-motion.
   ========================================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_OFFSET = 80;

  /* ---------- Sticky-nav state ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Smooth-scroll with nav offset ---------- */
  const scrollToTarget = (target) => {
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({
      top,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
    scrollToTarget(target);
    history.replaceState(null, '', href);
  });

  /* ---------- IntersectionObserver reveals ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    // hero reveals fire on load (staggered via inline transition delay)
    revealEls.forEach((el) => {
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      el.style.transitionDelay = delay + 'ms';
    });

    if ('IntersectionObserver' in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );

      revealEls.forEach((el) => {
        // hero is above the fold; reveal on next frame instead of waiting for IO
        if (el.closest('.hero')) {
          requestAnimationFrame(() => el.classList.add('is-visible'));
        } else {
          observer.observe(el);
        }
      });
    } else {
      // reduced motion or no IO: show immediately
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ---------- Hero parallax via wrapper (so it doesn't fight the ken-burns scale) ---------- */
  const heroBgWrap = document.querySelector('.hero__bg');
  if (heroBgWrap && !reduceMotion && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;
    const onParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroBgWrap.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ---------- Process connector draw-on-scroll ---------- */
  const processConnector = document.querySelector('.process__connector line');
  if (processConnector && 'IntersectionObserver' in window && !reduceMotion) {
    // viewBox 0 0 1000 4 -> path length ≈ 1000
    const length = 1000;
    processConnector.style.strokeDasharray = '6 8';
    processConnector.style.strokeDashoffset = length;
    processConnector.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(0.22, 1, 0.36, 1)';
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processConnector.style.strokeDashoffset = '0';
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    const processSection = document.querySelector('.process');
    if (processSection) sectionObserver.observe(processSection);
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  let lastFocusBeforeNav = null;

  const openMobileNav = () => {
    if (!mobileNav) return;
    lastFocusBeforeNav = document.activeElement;
    mobileNav.hidden = false;
    requestAnimationFrame(() => mobileNav.classList.add('is-open'));
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    const firstLink = mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { mobileNav.hidden = true; }, 280);
    if (lastFocusBeforeNav && typeof lastFocusBeforeNav.focus === 'function') {
      lastFocusBeforeNav.focus();
    }
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMobileNav() : openMobileNav();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
    });

    // focus trap inside mobile nav
    mobileNav.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !mobileNav.classList.contains('is-open')) return;
      const focusable = mobileNav.querySelectorAll('a, button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox && lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox && lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox && lightbox.querySelector('.lightbox__nav--next');
  const tiles = Array.from(document.querySelectorAll('[data-lightbox-src]'));

  let lightboxIndex = -1;
  let lastFocusBeforeLightbox = null;

  const openLightbox = (index) => {
    if (!lightbox || !tiles.length) return;
    lightboxIndex = (index + tiles.length) % tiles.length;
    const tile = tiles[lightboxIndex];
    lastFocusBeforeLightbox = document.activeElement;
    lightboxImg.src = tile.dataset.lightboxSrc;
    lightboxImg.alt = tile.dataset.lightboxAlt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn && closeBtn.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    document.body.classList.remove('no-scroll');
    if (lastFocusBeforeLightbox && typeof lastFocusBeforeLightbox.focus === 'function') {
      lastFocusBeforeLightbox.focus();
    }
  };

  const cycleLightbox = (delta) => openLightbox(lightboxIndex + delta);

  tiles.forEach((tile, i) => {
    tile.addEventListener('click', () => openLightbox(i));
  });

  if (lightbox) {
    closeBtn && closeBtn.addEventListener('click', closeLightbox);
    prevBtn && prevBtn.addEventListener('click', () => cycleLightbox(-1));
    nextBtn && nextBtn.addEventListener('click', () => cycleLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') cycleLightbox(-1);
      else if (e.key === 'ArrowRight') cycleLightbox(1);
      else if (e.key === 'Tab') {
        // simple focus trap among the lightbox controls
        const focusable = [closeBtn, prevBtn, nextBtn].filter(Boolean);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ---------- Update copyright year if it ever changes via JS ---------- */
  // (Intentionally hard-coded in HTML; no JS update needed.)
})();
