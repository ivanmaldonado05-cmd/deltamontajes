# Delta Montajes — rediseño de deltamontajes.com

Empresa paraguaya de ingeniería electromecánica (+30 años): instalación, mantenimiento y reparación de aire acondicionado, ventilación mecánica y refrigeración industrial. Representante / partner oficial de **Trane**. Reemplaza el sitio actual en Wix.

## Stack
- HTML + CSS + JS vanilla, sin build. Deploy en GitHub Pages (`.nojekyll`).
- CDN solo si aporta: GSAP + ScrollTrigger, Lenis. Carrusel mobile propio (scroll-snap) antes que Swiper.
- Todo respeta `prefers-reduced-motion`.

## Estructura
```
index.html        home (one-page con anclas)
obras.html        portfolio completo, masonry + filtros + modal
css/  js/
assets/img/brand    logos Delta (blanco, blanco compacto, color) + Trane (webp + png)
assets/img/obras    20 obras, nombre-<ancho>.webp (srcset)
assets/img/equipos  17 equipos (fotos de producto, fondo blanco)
assets/img/equipo   fotos de obra/personal en campo (hero, nosotros)
assets/logos        20 logos de clientes
```

## Contenido (extraído del Wix, 2026-10-14)
- Claim: "+30 años de calidad y confort".
- Quiénes somos: ingeniería electromecánica, capital y profesionales nacionales e internacionales, cobertura nacional, representantes de TRANE y distribuidores de marcas reconocidas. Repuestos originales.
- Servicios: Instalación, Mantenimiento (servicio técnico de todas las marcas, planes preventivo/correctivo), Reparación (técnicos nacionales e internacionales en todo el país).
- Diferenciales: Experiencia (specs técnicas y comerciales de cada producto) · Accesibilidad (cobertura en todo Paraguay).
- Contacto (actualizado 2026-11-05 con la presentación): 14 de Mayo 842 · +595 21 391-204/5 · cel./WhatsApp +595 981 409 748 · administracion@deltamontajes.com (principal en header, footer, schema y form; delta@conexion.com.py queda como segunda línea en el bloque de contacto) · facebook.com/deltasrlmontajes
- Horario: Lun–Vie 7:30–12:00 / 13:00–17:30 · Sáb 8:00–11:30

### Presentación oficial (PDF "Presentacion Delta S.R.L. 12-09-26", recibida 2026-11)
Fuente de las capacidades en TR, sistemas y ubicaciones corregidas abajo. Agregado de ahí: email administracion@, celular/WhatsApp, "Proyecto y fiscalización de obra" en el servicio Instalación. El PDF dice "VRV"; el sitio mantiene "VRF".

### Obras (orden del Wix → archivo; sistemas y TR actualizados con la presentación)
| Obra | Sistema | Archivo |
|---|---|---|
| Edificio Corporativo Toyotoshi (Mcal. López) | Agua fría + VRF | toyotoshi |
| Hotel Dazzler (CDE) | VRF | dazzler |
| IPS CDE | Agua fría 1.400 TR | ips-cde |
| Palacio de Justicia CDE | Agua fría 1.600 TR | palacio-justicia-cde |
| Polideportivo Arena SND | Rooftop 360 TR | polideportivo-arena-snd |
| Edificio DOT | VRF | edificio-dot |
| Edificio Corporativo Torre Boggiani (Caja Mutual) | Split 360 TR | torre-boggiani |
| Hotel Ibis | Agua fría 160 TR | hotel-ibis |
| Edificio Olier | Split 320 TR | edificio-olier |
| Palacio de Justicia Caazapá | Agua fría 80 TR | palacio-justicia-caazapa |
| Edificio Torre de Altea | Split 320 TR | torre-de-altea |
| Edificios Zuba II, III y IV | Split 350 TR | edificio-zuba |
| Edificio Ágora | Split 250 TR | edificio-agora |
| Toyotoshi San Lorenzo | Split 280 TR | toyotoshi-san-lorenzo |
| Edificio Corporativo MADES | Agua fría + VRF | edificio-mades |
| Edificio Genoa | Split | edificio-genoa |
| Divina Tower Apart Hotel | Split | divina-tower |
| Edificio Finesse | Split | edificio-finesse |
| Edificio Corporativo TOCSA | VRF | corporativo-tocsa |
| Edificio Bali V | Split | edificio-bali-v |

### Equipos
- Climatización: split pared, cassette, piso techo, baja silueta, multisplit, VRF, rooftop
- Agua fría: chiller tornillo, chiller scroll, chiller modular, manejadoras
- Ventilación y conductos: conductos chapa galvanizada, conductos Alupir, conducto textil, rejas Trox, ventiladores centrífugos, ventiladores axiales

### Clientes (20, todos identificados)
Sudameris, Ibis, Tu Financiera, Sallustro, Caja Mutual de Cooperativistas del Paraguay, IPS, Toyotoshi, Grupo A.J. Vierci, Envaco, Atlas Grupo Editorial, Tecnoedil S.A., Benítez Bittar Constructora, AGB Constructora, TOSA Terminal Occidental, Tecinci, Implenia Constructora, Alsina & Wood Asociados, S3 Constructora, Quadra Constructora, Punto a Punto S.R.L.

## Sistema de diseño (aprobado 2026-10-14)
- **Concepto:** plano técnico + flujo de aire. Grilla de plano, marcas de corte, datos en mono, líneas de aire animadas (canvas) en el hero.
- **Colores** (tokens en `css/styles.css` :root): ink `#0B0D1F` (fondos oscuros), índigo `#36307A` y cobalto `#20408A` (marca, sampleados del logo), air `#5FD4F4` (solo acentos de aire/foco, nunca texto sobre claro), neutros fríos paper `#F6F8FB` / mist `#E6ECF4` / slate `#5A6378`. Rojo Trane solo dentro del bloque Trane.
- **Tipografías:** Archivo (títulos, `font-stretch: 112%`, 800, itálica para énfasis como el logo) · IBM Plex Sans (texto) · IBM Plex Mono (etiquetas técnicas, cifras).
- **Fotos del hero:** gris + duotono cobalto (`mix-blend-mode: color`) para unificar fotos de calidad dispar.

## Secciones del home (orden)
hero → `#cifras` (contadores) → clientes (marquee 2 filas) → `#servicios` (3 tarjetas + tabs de equipos `#equipos`) → `#obras` (8 destacadas, scroll horizontal fijado) → `#trane` → `#nosotros` (por qué Delta) → `#proceso` (4 pasos con línea) → CTA final → `#contacto` (form + mapa) → footer.

## Decisiones
- JS: `js/main.js` (común a las 2 páginas: Lenis, header, menú, hero, reveals, contadores, tabs, obras fijadas, proceso, parallax, form, cursor, transición de página), `js/flow.js` (canvas de aire del hero), `js/obras-data.js` (datos de las 20 obras, fuente única) y `js/obras.js` (masonry, filtros con GSAP Flip, modal `<dialog>`). GSAP 3.12.5 (+ScrollTrigger, +Flip en obras) y Lenis 1.1.13 por CDN, todo con `defer`.
- **Regla anti "página en blanco":** el contenido solo se oculta para animarlo cuando JS confirmó GSAP (clase `reveal-on`). Los reveals se disparan al entrar, salir o volver, y un barrido revela lo que ya quedó arriba si la página abre scrolleada (recarga, atrás, `#ancla`). El hero tiene fallback a 2,5 s. No volver a usar `once: true` solo con `onEnter`.
- En `start()` el pin de obras se crea ANTES que los demás ScrollTrigger (los de abajo miden con el espacio del pin).
- Header: transparente sobre el hero, se compacta (84→64 px) pasados 40 px, se oculta bajando. Menú mobile < 1024 px con focus trap y Escape.
- Hero: slideshow de 3 fotos de campo, split-text por líneas, badge Trane + specs. Entre 1024 y 1279 px los CTAs van debajo del texto.
- Obras destacadas: ≥1024 px pin + translateX con scrub; < 1024 px scroll-snap nativo. Las fotos se precargan 1200 px antes (con transform el lazy-load nativo no las ve).
- Capacidad: campo `tr` en obras-data.js; se muestra como "1.600 TR · Agua fría" en las tarjetas (home y obras.html) y en la fila "Capacidad" del modal (oculta si no hay dato). Filtro "Sistema rooftop" agregado por SND. Las tarjetas se sincronizaron con un script one-off desde obras-data.js.
- obras.html: masonry con CSS grid (`grid-auto-rows: 8px` + `data-span` por atributo, no inline: Flip limpia los estilos inline). Deep link `obras.html#slug` abre el modal (las tarjetas de la home lo usan).
- Formulario: validación propia; mientras el action tenga `TU_ID_FORMSPREE` no envía y muestra el mail.
- GA4: el snippet no carga nada mientras el ID sea `G-XXXXXXXXXX`.
- Cache-busting: `?v=AAAAMMDDhhmm` en CSS/JS de ambas páginas; actualizarlo en cada push que toque CSS/JS (GitHub Pages cachea 10 min).
- Contenido repetido (logos, equipos, tarjetas de obras, obras.html completo) se generó con scripts one-off a partir de `js/obras-data.js`; hoy se edita directo en el HTML. obras.html copia header/footer de index.html: si cambian, actualizar ambos.
- SEO: `HVACBusiness` en JSON-LD, OG con `assets/img/og-image.jpg` (1200×630), `sitemap.xml`, `robots.txt`, favicon SVG + apple-touch-icon. Las URLs absolutas apuntan a www.deltamontajes.com (dominio final).
- Deploy (2026-11-06): Hostinger, sitio PHP/HTML `deltamontajes.com`, integración GitHub (rama main → public_html). `.htaccess`: bloquea CLAUDE.md, redirige deltamontajes.com → www solo con HTTPS activo (el http→https lo hace "Forzar HTTPS" de Hostinger), caché y gzip. LIVE desde 2026-11-06: DNS sigue en Wix (no se pudo desvincular el dominio del sitio Wix: lo paga una tarjeta del cliente), A @ → 185.213.81.230, CNAME www → deltamontajes.com, MX Google Workspace y TXT sin tocar. SSL Let's Encrypt (Lifetime SSL de Hostinger) y http→https ya activos.
- Preview local: `npx serve delta-montajes -l 5077` (config `delta-montajes` en ../.claude/launch.json). Repo: github.com/ivanmaldonado05-cmd/deltamontajes (main → Hostinger; GitHub Pages pendiente de desactivar).

## Pendientes con el cliente
- [ ] Confirmar que +595 981 409 748 tiene WhatsApp (ya está en botón flotante, footer y bloque de contacto) y si delta@conexion.com.py sigue activo
- [ ] Endpoint Formspree (placeholder)
- [ ] ID de GA4 (placeholder)
- [ ] Confirmar ciudad de "14 de Mayo 842": se asumió Asunción (Google Maps la ubica ahí) en mapa, footer y schema.org
- [ ] Ubicación de cada obra: asumidas sin confirmar Asunción (SND, DOT, Boggiani, Ibis, MADES); Toyotoshi (Mcal. López) y Dazzler (CDE) salen de la presentación; CDE, Caazapá y San Lorenzo salen del nombre; el resto figura como "Paraguay" (`ubicacionConfirmada:false` en obras-data.js)
- [ ] Fotos en mejor resolución: varias obras son ≤ 660 px (IPS CDE, Boggiani, Divina Tower, Ágora, Toyotoshi San Lorenzo) y muchas son renders, no fotos reales de la instalación
- [ ] Fotos reales de equipos instalados (las actuales son imágenes de catálogo con fondo blanco)
- [ ] Cifras reales para los contadores: hoy +20 obras y +20 clientes (lo que muestra el Wix) y 17 departamentos de cobertura
- [ ] Descripciones de obras: redactadas a partir del sistema, tipo de edificio y TR; validar con el cliente
- (resuelto 2026-11-05) Sistema de SND = rooftop 360 TR; fotos de Palacio de Justicia CDE/Caazapá confirmadas (la naranja tiene el cartel de CDE)
- [ ] Más fotos por obra para la galería del modal (hoy 1 por obra, 2 en SND)
- [ ] Filtro "Ventilación" en obras: no hay obras de ventilación cargadas; agregar si el cliente tiene
- [ ] TR de las obras que la presentación no informa: Toyotoshi, Dazzler, DOT, MADES, Genoa, Divina Tower, Finesse, TOCSA, Bali V
- [ ] Obras de la presentación que no están en el sitio (faltan fotos): Royal Plaza 280 TR, Ventura San Vicente 200 TR, HONDA Asunción 180 TR, Margareta 200 TR, María Antonia 220 TR, Palacio de Justicia Cap. Bado 80 TR, Liga Encarnacena, Hospitales de Contingencia, Ball Corporation 300 TR, Aqua Village (VRV), Shopping Los Jardines 300 TR agua fría, Centro Acuático Olímpico (VRV + agua fría), Cooperativa Universitaria (VRV), More Mariscal y Fibonacci (multi-split), Tienda ACE 240 TR rooftop, SND Polideportivo Tenis de mesa 120 TR rooftop
- [ ] Clientes del PDF que no están en el marquee: Conempa, González Acosta & Wood, Gómez Abente Constructora, Ball Corporation
- [ ] Instagram / LinkedIn si existen (hoy solo Facebook)
