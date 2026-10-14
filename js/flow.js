/* Líneas de flujo de aire para el hero.
   Partículas que siguen un campo de flujo suave y dejan estela.
   Se pausa fuera de pantalla / pestaña oculta y no corre con reduced-motion. */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero__flow');
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var w = 0, h = 0, particles = [], running = false, visible = true, raf = 0, t = 0;

  function count() {
    // densidad según área, con techo para mantener el rendimiento
    return Math.round(Math.min(160, Math.max(50, (w * h) / 11000)));
  }

  function spawn(p, anywhere) {
    p.x = anywhere ? Math.random() * w : -20 - Math.random() * 120;
    p.y = Math.random() * h;
    p.life = 0;
    p.max = 260 + Math.random() * 380;
    p.speed = 0.6 + Math.random() * 1.1;
    p.cool = Math.random() < 0.55; // celeste vs blanco
    return p;
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = count();
    particles.length = Math.min(particles.length, n);
    while (particles.length < n) particles.push(spawn({}, true));
  }

  // Campo de flujo: corriente principal hacia la derecha con ondulación lenta
  function angle(x, y) {
    var nx = x / w, ny = y / h;
    return Math.sin(ny * 6.0 + t * 0.35) * 0.35 +
           Math.cos(nx * 4.0 - t * 0.25 + ny * 2.0) * 0.28 +
           Math.sin((nx + ny) * 9.0 + t * 0.5) * 0.08;
  }

  function frame() {
    if (!running) return;
    t += 0.016;

    // desvanecer estelas
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.075)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var a = angle(p.x, p.y);
      var nx = p.x + Math.cos(a) * p.speed * 1.6;
      var ny = p.y + Math.sin(a) * p.speed * 1.6;

      // alfa en campana según la vida
      var k = p.life / p.max;
      var alpha = Math.sin(Math.PI * k) * 0.42;
      ctx.strokeStyle = p.cool
        ? 'rgba(95,212,244,' + alpha.toFixed(3) + ')'
        : 'rgba(255,255,255,' + (alpha * 0.7).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      p.x = nx; p.y = ny; p.life++;
      if (p.life > p.max || p.x > w + 20 || p.y < -20 || p.y > h + 20) spawn(p, false);
    }
    raf = requestAnimationFrame(frame);
  }

  function update() {
    var should = visible && !document.hidden;
    if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  resize();
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }).observe(canvas);
  }
  // arrancar después del primer render para no competir con el LCP
  (window.requestIdleCallback || function (fn) { setTimeout(fn, 300); })(update);
})();
