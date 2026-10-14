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
    lenis = window.__lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
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
    if (reduceMotion || !hasGsap || !window.ScrollTrigger || !document.querySelector('.hero__media')) return;
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


  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  var motionOK = !reduceMotion && hasST;

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Reveals escalonados ---------- */
  function reveals() {
    if (!motionOK) return;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    root.classList.add('reveal-on');
    function show(batch, instant) {
      batch = batch.filter(function (el) { return !el.__shown; });
      if (!batch.length) return;
      batch.forEach(function (el) { el.__shown = true; });
      if (instant) gsap.set(batch, { opacity: 1, y: 0, clearProps: 'transform' });
      else gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true, clearProps: 'transform' });
    }
    // cualquier cruce del trigger (entrar, salir o volver) revela: nunca queda contenido oculto
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      onEnter: function (b) { show(b); },
      onLeave: function (b) { show(b, true); },
      onEnterBack: function (b) { show(b); }
    });
    // si la página abre ya scrolleada (recarga, botón atrás, link con #), mostrar lo que quedó arriba
    function sweep() {
      var vh = window.innerHeight;
      show(els.filter(function (el) { return el.getBoundingClientRect().bottom < 0; }), true);
      show(els.filter(function (el) { var r = el.getBoundingClientRect(); return r.bottom >= 0 && r.top < vh * 0.88; }));
    }
    ScrollTrigger.addEventListener('refresh', sweep);
    sweep();
  }

  /* ---------- Contadores ---------- */
  function counters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || !motionOK) return;
    els.forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      var obj = { v: 0 };
      el.textContent = '0';
      var done = false;
      function run() {
        if (done) return;
        done = true;
        gsap.to(obj, { v: end, duration: 2, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(obj.v); } });
      }
      ScrollTrigger.create({ trigger: el, start: 'top 90%', onEnter: run, onLeave: run, onEnterBack: run });
      // abierta ya más abajo: mostrar el valor final
      if (el.getBoundingClientRect().bottom < 0) { done = true; el.textContent = end; }
    });
  }

  /* ---------- Tabs de equipos (patrón ARIA) ---------- */
  function tabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabsEls = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabsEls.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
        if (focus) tab.focus();
        if (hasST) ScrollTrigger.refresh();
      }
      tabsEls.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t, false); });
        t.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight') n = tabsEls[(i + 1) % tabsEls.length];
          else if (e.key === 'ArrowLeft') n = tabsEls[(i - 1 + tabsEls.length) % tabsEls.length];
          else if (e.key === 'Home') n = tabsEls[0];
          else if (e.key === 'End') n = tabsEls[tabsEls.length - 1];
          if (n) { e.preventDefault(); select(n, true); }
        });
      });
    });
  }

  /* ---------- Obras: scroll horizontal fijado (desktop) / swipe (mobile) ---------- */
  function works() {
    var section = document.querySelector('.works');
    if (!section) return;
    var viewport = section.querySelector('.works__viewport');
    var track = section.querySelector('.works__track');
    var bar = section.querySelector('.works__progress span');

    // progreso con scroll nativo (mobile / sin GSAP)
    function nativeProgress() {
      var max = viewport.scrollWidth - viewport.clientWidth;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? viewport.scrollLeft / max : 0) + ')';
    }
    viewport.addEventListener('scroll', nativeProgress, { passive: true });
    nativeProgress();

    if (!motionOK) return;
    // en el carrusel fijado las fotos se mueven con transform: precargarlas antes de llegar
    ScrollTrigger.create({
      trigger: section, start: 'top bottom+=1200', once: true,
      onEnter: function () { section.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; }); }
    });
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': function () {
        section.classList.add('is-pinned');
        viewport.scrollLeft = 0;
        var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        var tween = gsap.to(track, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: section.querySelector('.works__pin'),
            start: 'top top',
            end: function () { return '+=' + distance(); },
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: function (self) { if (bar) bar.style.transform = 'scaleX(' + self.progress + ')'; }
          }
        });
        // parallax interno de cada foto mientras se desplaza
        section.querySelectorAll('.work-card__media img').forEach(function (img) {
          gsap.fromTo(img, { xPercent: -6 }, {
            xPercent: 6, ease: 'none',
            scrollTrigger: { trigger: img.closest('.work-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
          });
        });
        return function () { section.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'x' }); };
      }
    });
  }

  /* ---------- Proceso: línea de progreso ---------- */
  function processLine() {
    var line = document.querySelector('.steps__line span');
    if (!line || !motionOK) return;
    var steps = document.querySelectorAll('.step');
    gsap.to(line, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 65%', end: 'bottom 65%', scrub: 0.4 }
    });
    steps.forEach(function (s) {
      ScrollTrigger.create({
        trigger: s, start: 'top 65%',
        onEnter: function () { s.classList.add('is-active'); },
        onLeave: function () { s.classList.add('is-active'); },
        onLeaveBack: function () { s.classList.remove('is-active'); }
      });
    });
  }

  /* ---------- Parallax suave en imágenes ---------- */
  function parallax() {
    if (!motionOK) return;
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- Navegación activa ---------- */
  function activeNav() {
    var links = document.querySelectorAll('.nav__list a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = map[e.target.id];
        if (!a || !e.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Formulario de contacto ---------- */
  function contactForm() {
    var form = document.querySelector('.form');
    if (!form) return;
    var status = form.querySelector('.form__status');
    var rules = {
      nombre: function (v) { return v.trim().length >= 3 || 'Ingresá tu nombre y apellido.'; },
      telefono: function (v) { return v.replace(/\D/g, '').length >= 7 || 'Ingresá un teléfono válido.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Ingresá un email válido.'; },
      servicio: function (v) { return !!v || 'Elegí el tipo de servicio.'; },
      mensaje: function (v) { return v.trim().length >= 10 || 'Contanos un poco más (mínimo 10 caracteres).'; }
    };
    function check(field) {
      var res = rules[field.name](field.value);
      var err = document.getElementById('e-' + field.name);
      if (res === true) { field.removeAttribute('aria-invalid'); if (err) err.textContent = ''; return true; }
      field.setAttribute('aria-invalid', 'true'); if (err) err.textContent = res; return false;
    }
    Object.keys(rules).forEach(function (name) {
      var f = form.elements[name];
      f.addEventListener('blur', function () { if (f.value) check(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid')) check(f); });
      f.addEventListener('change', function () { if (f.getAttribute('aria-invalid')) check(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (name) { var f = form.elements[name]; if (!check(f) && !firstBad) firstBad = f; });
      status.className = 'form__status';
      if (firstBad) { firstBad.focus(); status.textContent = 'Revisá los campos marcados.'; status.classList.add('is-error'); return; }

      var endpoint = form.getAttribute('action');
      if (/TU_ID_FORMSPREE/.test(endpoint)) {
        // [PENDIENTE] sin endpoint real: avisar y ofrecer el mail
        status.innerHTML = 'El formulario todavía no está conectado. Escribinos a <a href="mailto:delta@conexion.com.py">delta@conexion.com.py</a>.';
        status.classList.add('is-error');
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = 'Enviando…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('envío');
          form.reset();
          status.textContent = '¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.';
          status.classList.add('is-ok');
          if (window.gtag) window.gtag('event', 'generate_lead', { form: 'contacto' });
        })
        .catch(function () {
          status.innerHTML = 'No pudimos enviar el mensaje. Probá de nuevo o llamanos al <a href="tel:+59521391204">021 391 204</a>.';
          status.classList.add('is-error');
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Cursor personalizado (solo desktop) ---------- */
  function cursor() {
    if (reduceMotion || !finePointer || !hasGsap) return;
    var el = document.querySelector('.cursor');
    if (!el) return;
    root.classList.add('has-cursor', 'cursor-hidden');
    var dot = el.querySelector('.cursor__dot'), ring = el.querySelector('.cursor__ring');
    var dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) {
      root.classList.remove('cursor-hidden');
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { root.classList.add('cursor-hidden'); });
    document.addEventListener('pointerover', function (e) {
      root.classList.toggle('cursor-hover', !!e.target.closest('a, button, [role="tab"], .logo-tile, .masonry__item'));
    });
  }

  /* ---------- Transición entre páginas ---------- */
  function pageTransitions() {
    var veil = document.querySelector('.page-veil');
    if (!veil || reduceMotion) return;
    try {
      if (sessionStorage.getItem('veil') === '1') {
        sessionStorage.removeItem('veil');
        veil.classList.add('no-anim', 'is-in');
        void veil.offsetWidth;
        veil.classList.remove('no-anim', 'is-in');
        veil.classList.add('is-out');
      }
    } catch (err) { /* sin storage: sin transición */ }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (!/(\.html|\/)$/.test(url.pathname)) return;
      e.preventDefault();
      try { sessionStorage.setItem('veil', '1'); } catch (err) { /* nada */ }
      veil.classList.remove('is-out');
      veil.classList.add('is-in');
      setTimeout(function () { location.href = a.href; }, 600);
    });
    // al volver con el botón atrás (bfcache) el velo no debe quedar puesto
    window.addEventListener('pageshow', function (e) { if (e.persisted) { veil.classList.remove('is-in'); veil.classList.add('is-out'); } });
  }

  function start() {
    root.classList.add('hero-ready');
    heroIntro();
    heroParallax();
    // el pin de obras se crea primero: los triggers que vienen después deben medir con su espacio ya agregado
    works();
    magnetic();
    reveals();
    counters();
    processLine();
    parallax();
    cursor();
    if (hasST) {
      if (document.readyState === 'complete') ScrollTrigger.refresh();
      else window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  // lo que no depende de animaciones arranca ya
  tabs();
  activeNav();
  contactForm();
  pageTransitions();

  // esperar fuentes para medir líneas correctamente (con techo de 1.2 s)
  var started = false;
  function go() { if (!started) { started = true; start(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 1200);
  } else go();
})();
