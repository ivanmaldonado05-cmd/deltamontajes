/* obras.html — masonry, filtros animados y modal con galería */
(function () {
  'use strict';

  var OBRAS = window.OBRAS || [];
  var SIS = window.SISTEMAS || {};
  var grid = document.querySelector('.masonry');
  if (!grid) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFlip = typeof window.gsap !== 'undefined' && typeof window.Flip !== 'undefined';
  if (hasFlip) gsap.registerPlugin(Flip);
  var items = Array.prototype.slice.call(grid.querySelectorAll('.masonry__item'));

  /* ---------- Masonry con CSS grid: cada ítem ocupa filas según su proporción ---------- */
  var ROW = 8;
  // los spans van por atributo (no inline): Flip limpia los estilos inline al terminar
  (function () {
    var css = '';
    for (var n = 1; n <= 200; n++) css += '.masonry.is-masonry [data-span="' + n + '"]{grid-row-end:span ' + n + '}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  })();
  function layout() {
    grid.classList.add('is-masonry');
    var gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
    items.forEach(function (it) {
      if (it.classList.contains('is-out')) return;
      var w = it.getBoundingClientRect().width;
      var ratio = parseFloat(it.getAttribute('data-ratio')) || 0.75;
      // limitar extremos para que la grilla respire
      ratio = Math.min(Math.max(ratio, 0.56), 1.3);
      var h = w * ratio;
      it.setAttribute('data-span', Math.min(200, Math.ceil((h + gap) / (ROW + gap))));
    });
  }
  layout();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });

  /* ---------- Filtros ---------- */
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var status = document.querySelector('[data-filter-status]');
  function apply(key) {
    var state = hasFlip && !reduceMotion ? Flip.getState(items) : null;
    var shown = 0;
    items.forEach(function (it) {
      var match = key === 'all' || (' ' + it.getAttribute('data-sistemas') + ' ').indexOf(' ' + key + ' ') > -1;
      it.classList.toggle('is-out', !match);
      if (match) shown++;
    });
    layout();
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === key ? 'true' : 'false'); });
    if (status) status.textContent = shown + (shown === 1 ? ' obra' : ' obras') + (key === 'all' ? '' : ' con ' + SIS[key]);
    if (state) {
      Flip.from(state, {
        duration: 0.7, ease: 'expo.out', absolute: true, scale: true, nested: true,
        onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }); },
        onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }); },
        onComplete: function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); }
      });
    }
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
  });

  /* ---------- Modal ---------- */
  var dialog = document.querySelector('.obra-modal');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var $ = function (sel) { return dialog.querySelector(sel); };
  var img = $('[data-modal-img]'), thumbs = $('[data-modal-thumbs]');
  var current = -1, lastFocus = null;

  function photos(o) {
    var list = [{ base: 'assets/img/obras/' + o.slug, w: o.img, ratio: o.ratio }];
    (o.extra || []).forEach(function (x) { list.push({ base: x.src, w: x.w, ratio: x.ratio }); });
    return list;
  }
  function setPhoto(p, alt) {
    var max = p.w[p.w.length - 1];
    img.removeAttribute('srcset');
    img.src = p.base + '-' + max + '.webp';
    img.srcset = p.w.map(function (w) { return p.base + '-' + w + '.webp ' + w + 'w'; }).join(', ');
    img.sizes = '(min-width: 1024px) 60vw, 100vw';
    img.width = max; img.height = Math.round(max * p.ratio);
    img.alt = alt;
  }
  function visibleList() { return OBRAS.filter(function (o) { var el = document.getElementById(o.slug); return el && !el.classList.contains('is-out'); }); }

  function fill(slug) {
    var list = visibleList();
    var i = list.findIndex(function (o) { return o.slug === slug; });
    if (i < 0) { list = OBRAS; i = OBRAS.findIndex(function (o) { return o.slug === slug; }); }
    if (i < 0) return false;
    var o = list[i];
    current = OBRAS.indexOf(o);
    var ph = photos(o);
    setPhoto(ph[0], o.nombre + ', ' + o.ubicacion);
    thumbs.innerHTML = '';
    thumbs.hidden = ph.length < 2;
    ph.forEach(function (p, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'obra-modal__thumb';
      b.setAttribute('aria-label', 'Foto ' + (k + 1) + ' de ' + ph.length);
      b.setAttribute('aria-pressed', k === 0 ? 'true' : 'false');
      b.innerHTML = '<img src="' + p.base + '-' + p.w[0] + '.webp" alt="" loading="lazy">';
      b.addEventListener('click', function () {
        setPhoto(p, o.nombre + ' — foto ' + (k + 1));
        thumbs.querySelectorAll('button').forEach(function (t) { t.setAttribute('aria-pressed', t === b ? 'true' : 'false'); });
      });
      thumbs.appendChild(b);
    });
    $('[data-modal-count]').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    $('[data-modal-title]').textContent = o.nombre;
    $('[data-modal-sys]').textContent = o.sistemas.length ? o.sistemas.map(function (s) { return SIS[s]; }).join(' + ') : 'Climatización';
    $('[data-modal-loc]').textContent = o.ubicacion;
    $('[data-modal-tipo]').textContent = o.tipo;
    $('[data-modal-desc]').textContent = o.desc;
    $('[data-modal-prev]').dataset.slug = list[(i - 1 + list.length) % list.length].slug;
    $('[data-modal-next]').dataset.slug = list[(i + 1) % list.length].slug;
    if (history.replaceState) history.replaceState(null, '', '#' + o.slug);
    return true;
  }

  function open(slug) {
    if (!fill(slug)) return;
    lastFocus = document.activeElement;
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('modal-open');
      if (window.__lenis) window.__lenis.stop();
    }
  }
  function close() { dialog.close(); }
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('modal-open');
    if (window.__lenis) window.__lenis.start();
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    var back = current > -1 ? document.querySelector('[data-obra="' + OBRAS[current].slug + '"]') : lastFocus;
    if (back) back.focus();
  });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-obra]');
    if (b) open(b.getAttribute('data-obra'));
  });
  $('[data-modal-close]').addEventListener('click', close);
  $('[data-modal-prev]').addEventListener('click', function () { fill(this.dataset.slug); });
  $('[data-modal-next]').addEventListener('click', function () { fill(this.dataset.slug); });
  // click en el fondo cierra
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') $('[data-modal-next]').click();
    if (e.key === 'ArrowLeft') $('[data-modal-prev]').click();
  });

  // deep link desde la home: obras.html#slug
  var hash = decodeURIComponent(location.hash.slice(1));
  if (hash && OBRAS.some(function (o) { return o.slug === hash; })) {
    setTimeout(function () { open(hash); }, 650);
  }
})();
