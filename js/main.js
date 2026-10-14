/* Delta Montajes — interacciones principales */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var lenis = null;

  /* ---------- Smooth scroll (Lenis) ---------- */
  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    if (hasGsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function loop(time) { lenis.raf(time); requestAnimationFrame(loop); })(0);
    }
  }

  function scrollToHash(hash) {
    var target = hash === '#top' ? 0 : document.querySelector(hash);
    if (target === null) return;
    var header = document.querySelector('.site-header');
    var offset = target === 0 ? 0 : -(header ? 64 : 0);
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else if (target === 0) window.scrollTo({ top: 0 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
    if (target !== 0) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    if (hash.length < 2) return;
    if (hash !== '#top' && !document.querySelector(hash)) return;
    e.preventDefault();
    if (menu.isOpen()) menu.close(false);
    scrollToHash(hash);
    history.pushState(null, '', hash === '#top' ? location.pathname : hash);
  });

  /* ---------- Header: compacto al scrollear, se oculta bajando ---------- */
  var header = document.querySelector('.site-header');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-compact', y > 40);
    var goingDown = y > lastY;
    header.classList.toggle('is-hidden', goingDown && y > window.innerHeight * 0.9 && !document.body.classList.contains('menu-open'));
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  // mostrar el header si recibe foco por teclado
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  /* ---------- Menú mobile ---------- */
  var menu = (function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.getElementById('mobile-menu');
    var open = false;
    var closeTimer;

    function focusables() {
      return [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a[href], button')));
    }
    function trap(e) {
      if (e.key === 'Escape') { close(true); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    function openMenu() {
      clearTimeout(closeTimer);
      open = true;
      panel.hidden = false;
      // forzar reflow para que la transición corra
      void panel.offsetWidth;
      panel.classList.add('is-open');
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
      header.classList.remove('is-hidden');
      if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', trap);
      setTimeout(function () { var l = panel.querySelector('a'); if (l) l.focus({ preventScroll: true }); }, 350);
    }
    function close(returnFocus) {
      if (!open) return;
      open = false;
      panel.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      if (lenis) lenis.start(); else document.body.style.overflow = '';
      document.removeEventListener('keydown', trap);
      closeTimer = setTimeout(function () { panel.hidden = true; }, reduceMotion ? 0 : 700);
      if (returnFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () { open ? close(true) : openMenu(); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) close(false); });
    return { isOpen: function () { return open; }, close: close };
  })();

  /* ---------- Hero: slideshow de fotos ---------- */
  (function () {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
    if (slides.length < 2 || reduceMotion) return;
    var i = 0;
    function load(img) {
      if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    }
    window.addEventListener('load', function () {
      slides.slice(1).forEach(load);
      setInterval(function () {
        if (document.hidden || window.scrollY > window.innerHeight) return;
        slides[i].classList.remove('is-active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('is-active');
      }, 7000);
    });
  })();

  /* ---------- Hero: split-text + entrada ---------- */
  function splitLines(el) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', text);
    // tokens conservando <em>
    var tokens = [];
    Array.prototype.forEach.call(el.childNodes, function (node) {
      var isEm = node.nodeType === 1 && node.tagName === 'EM';
      node.textContent.split(/\s+/).forEach(function (w) { if (w) tokens.push({ w: w, em: isEm }); });
    });
    el.innerHTML = '';
    var words = tokens.map(function (tk) {
      var s = document.createElement('span');
      s.className = 'split-word';
      s.setAttribute('aria-hidden', 'true');
      if (tk.em) { var em = document.createElement('em'); em.textContent = tk.w; s.appendChild(em); }
      else s.textContent = tk.w;
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      return s;
    });
    // agrupar por línea según offsetTop
    var lines = [], current = null, top = null;
    words.forEach(function (w) {
      if (w.offsetTop !== top) { top = w.offsetTop; current = []; lines.push(current); }
      current.push(w);
    });
    el.innerHTML = '';
    lines.forEach(function (line) {
      var l = document.createElement('span');
      l.className = 'split-line';
      l.setAttribute('aria-hidden', 'true');
      line.forEach(function (w, idx) {
        l.appendChild(w);
        if (idx < line.length - 1) l.appendChild(document.createTextNode(' '));
      });
      el.appendChild(l);
    });
    return words;
  }

  function heroIntro() {
    var title = document.querySelector('.hero [data-split]');
    var fades = document.querySelectorAll('.hero [data-hero="fade"]');
    if (!title) return;
    if (reduceMotion || !hasGsap) { root.classList.add('anim-fallback'); return; }

    var words = splitLines(title);
    gsap.set(title, { visibility: 'visible' });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__slide.is-active', { scale: 1.18, duration: 2.4, ease: 'power3.out' }, 0)
      .from('.hero__tint', { opacity: 0.4, duration: 1.6 }, 0)
      .from(words, { yPercent: 110, rotate: 4, duration: 1.2, stagger: 0.05 }, 0.2)
      .fromTo(fades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.75)
      .from('.crop', { opacity: 0, scale: 0.4, duration: 0.8, stagger: 0.06 }, 0.9)
      .from('.site-header__inner > *', { opacity: 0, y: -16, duration: 0.9, stagger: 0.08 }, 0.3);

    // re-split al cambiar el ancho (los cortes de línea cambian)
    var lastW = window.innerWidth, rt;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rt);
      rt = setTimeout(function () {
        tl.progress(1);
        var html = title.getAttribute('aria-label').replace('no pueden fallar.', '<em>no pueden fallar.</em>');
        title.innerHTML = html;
        splitLines(title);
      }, 200);
    });
  }

  // Parallax suave de la foto del hero
  function heroParallax() {
    if (reduceMotion || !hasGsap || !window.ScrollTrigger) return;
    gsap.to('.hero__media', {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__content', {
      yPercent: -8, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Botones magnéticos (solo desktop) ---------- */
  function magnetic() {
    if (reduceMotion || !finePointer || !hasGsap) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function start() {
    root.classList.add('hero-ready');
    heroIntro();
    heroParallax();
    magnetic();
  }

  // esperar fuentes para medir líneas correctamente (con techo de 1.2 s)
  var started = false;
  function go() { if (!started) { started = true; start(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 1200);
  } else go();
})();
