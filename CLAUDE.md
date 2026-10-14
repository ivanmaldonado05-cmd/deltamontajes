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
- Contacto: 14 de Mayo 842 · +595 21 391-204/5 · delta@conexion.com.py · facebook.com/deltasrlmontajes
- Horario: Lun–Vie 7:30–12:00 / 13:00–17:30 · Sáb 8:00–11:30

### Obras (orden del Wix → archivo)
| Obra | Sistema | Archivo |
|---|---|---|
| Edificio Toyotoshi S.A. | Agua fría + VRF | toyotoshi |
| Dazzler (hotel) | VRF | dazzler |
| IPS CDE | Agua fría | ips-cde |
| Palacio de Justicia CDE | Agua fría | palacio-justicia-cde |
| Polideportivo Arena SND | ? | polideportivo-arena-snd |
| Edificio DOT | VRF | edificio-dot |
| Edificio Corporativo Torre Boggiani | Split | torre-boggiani |
| Hotel Ibis | Agua fría | hotel-ibis |
| Edificio Olier | Split | edificio-olier |
| Palacio de Justicia Caazapá | Agua fría | palacio-justicia-caazapa |
| Edificio Torre de Altea | Split | torre-de-altea |
| Edificio Zuba | Split | edificio-zuba |
| Edificio Ágora | Split | edificio-agora |
| Toyotoshi San Lorenzo | Split | toyotoshi-san-lorenzo |
| Edificio MADES | Agua fría | edificio-mades |
| Edificio Genoa | Split | edificio-genoa |
| Edificio Divina Tower | Split | divina-tower |
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
- obras.html: masonry con CSS grid (`grid-auto-rows: 8px` + `data-span` por atributo, no inline: Flip limpia los estilos inline). Deep link `obras.html#slug` abre el modal (las tarjetas de la home lo usan).
- Formulario: validación propia; mientras el action tenga `TU_ID_FORMSPREE` no envía y muestra el mail.
- GA4: el snippet no carga nada mientras el ID sea `G-XXXXXXXXXX`.
- Cache-busting: `?v=AAAAMMDDhhmm` en CSS/JS de ambas páginas; actualizarlo en cada push que toque CSS/JS (GitHub Pages cachea 10 min).
- Contenido repetido (logos, equipos, tarjetas de obras, obras.html completo) se generó con scripts one-off a partir de `js/obras-data.js`; hoy se edita directo en el HTML. obras.html copia header/footer de index.html: si cambian, actualizar ambos.
- SEO: `HVACBusiness` en JSON-LD, OG con `assets/img/og-image.jpg` (1200×630), `sitemap.xml`, `robots.txt`, favicon SVG + apple-touch-icon. Las URLs absolutas apuntan a www.deltamontajes.com (dominio final).
- Preview local: `npx serve delta-montajes -l 5077` (config `delta-montajes` en ../.claude/launch.json). Repo: github.com/ivanmaldonado05-cmd/deltamontajes (main → GitHub Pages).

## Pendientes con el cliente
- [ ] Número de WhatsApp (placeholder `595XXXXXXXXX`)
- [ ] Endpoint Formspree (placeholder)
- [ ] ID de GA4 (placeholder)
- [ ] Confirmar ciudad de "14 de Mayo 842": se asumió Asunción (Google Maps la ubica ahí) en mapa, footer y schema.org
- [ ] Sistema instalado en Polideportivo Arena SND (no figura en el Wix)
- [ ] El Wix lista "Palacio de Justicia Caazapá" dos veces; la home lo llama "Palacio de Justicia CDE". Asumido: la foto del edificio naranja = CDE, la de ladrillo = Caazapá. Confirmar.
- [ ] Ubicación de cada obra: asumidas sin confirmar Asunción (Toyotoshi, Dazzler, SND, DOT, Boggiani, Ibis, MADES); CDE, Caazapá y San Lorenzo salen del nombre; el resto figura como "Paraguay" (`ubicacionConfirmada:false` en obras-data.js)
- [ ] Fotos en mejor resolución: varias obras son ≤ 660 px (IPS CDE, Boggiani, Divina Tower, Ágora, Toyotoshi San Lorenzo) y muchas son renders, no fotos reales de la instalación
- [ ] Fotos reales de equipos instalados (las actuales son imágenes de catálogo con fondo blanco)
- [ ] Cifras reales para los contadores: hoy +20 obras y +20 clientes (lo que muestra el Wix) y 17 departamentos de cobertura
- [ ] Descripciones de obras: redactadas a partir del sistema y tipo de edificio; validar con el cliente
- [ ] Más fotos por obra para la galería del modal (hoy 1 por obra, 2 en SND)
- [ ] Filtro "Ventilación" en obras: no hay obras de ventilación cargadas; agregar si el cliente tiene
- [ ] Instagram / LinkedIn si existen (hoy solo Facebook)
