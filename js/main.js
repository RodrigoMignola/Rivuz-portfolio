/* ==========================================================================
   Portfolio RIVUZ — main.js
   Vanilla JS. Todo lo que cambia contenido está en `projects` y `filters`.
   ========================================================================== */

/**
 * PROYECTOS — editá este array para agregar, quitar o reordenar proyectos.
 * No hace falta tocar el HTML.
 *
 *  title    Título visible de la card.
 *  type     "sitio" | "behance" | "galeria". Define la pastilla y qué pasa al hacer clic:
 *           sitio/behance → abre `url` en una pestaña nueva; galeria → abre la galería.
 *  status   "desarrollo" | "terminado" | "redesign". Lo usa el filtro (ver `filters`).
 *  url      Link externo (sitio / behance).
 *  gallery  Solo para type "galeria": lista de imágenes { src, alt } (WebP, 1200×1000 o similar).
 *  image    Miniatura WebP (recomendado 1200×1000). Se recorta con object-fit: cover.
 *  alt      Descripción breve de la miniatura.
 *  hero     false para no usarla en el collage del hero (se usan las primeras 6).
 */
const projects = [
  // TODO (todos): reemplazar las miniaturas placeholder y completar el `alt`
  { title: 'Tackr Jobs', type: 'sitio', status: 'terminado', url: 'https://tackrjobs.com/es', image: 'assets/projects/tackr-jobs.webp', alt: 'TODO: describir el diseño de Tackr Jobs' },
  { title: 'FOODTEX', type: 'sitio', status: 'desarrollo', url: 'https://foodtex-propuesta-2.netlify.app/', image: 'assets/projects/foodtex.webp', alt: 'TODO: describir el diseño de FOODTEX' },
  { title: 'BCM Products', type: 'sitio', status: 'desarrollo', url: 'https://bcm-products-motion.lihuensg.chatgpt.site/', image: 'assets/projects/bcm-products.webp', alt: 'TODO: describir el diseño de BCM Products' },
  { title: 'Tackr Scout', type: 'behance', status: 'terminado', url: 'https://www.behance.net/gallery/244458863/Tackr-Scout-UX-UI-Landing-Page', image: 'assets/projects/tackr-scout.webp', alt: 'TODO: describir el diseño de Tackr Scout' },
  { title: 'HLTV.org Redesign', type: 'behance', status: 'redesign', url: 'https://www.behance.net/gallery/199721495/HLTVorg-Redesign-UX-UI-Case-Study', image: 'assets/projects/hltv-redesign.webp', alt: 'TODO: describir el rediseño de HLTV.org' },
  {
    title: 'Basalto', type: 'galeria', status: 'terminado', image: 'assets/projects/basalto.webp', alt: 'TODO: describir el diseño de Basalto',
    // TODO: reemplazar por las imágenes finales de Basalto (assets/projects/basalto/)
    gallery: [
      { src: 'assets/projects/basalto/basalto-01.webp', alt: 'TODO: Basalto, imagen 1' },
      { src: 'assets/projects/basalto/basalto-02.webp', alt: 'TODO: Basalto, imagen 2' },
      { src: 'assets/projects/basalto/basalto-03.webp', alt: 'TODO: Basalto, imagen 3' },
      { src: 'assets/projects/basalto/basalto-04.webp', alt: 'TODO: Basalto, imagen 4' },
    ],
  },
  { title: 'Mariela Martinez Negocios Inmobiliarios', type: 'sitio', status: 'terminado', url: 'https://marielamartinezinmobiliaria.com.ar/', image: 'assets/projects/mariela-martinez.webp', alt: 'TODO: describir el diseño de Mariela Martinez Negocios Inmobiliarios' },
  { title: 'La Alameda', type: 'sitio', status: 'terminado', url: 'https://www.laalameda.com.ar/', image: 'assets/projects/la-alameda.webp', alt: 'TODO: describir el diseño de La Alameda' },
];

/** FILTROS — `id` debe coincidir con el `status` de los proyectos ("all" = todos). */
const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'desarrollo', label: 'En desarrollo' },
  { id: 'terminado', label: 'Terminados' },
  { id: 'redesign', label: 'ReDesign' },
];

/* Pastilla según el tipo; el color pastel según el estado */
const TYPES = {
  sitio: { label: 'Sitio web', hint: 'abre el sitio en una pestaña nueva' },
  behance: { label: 'Behance', hint: 'abre el caso en Behance en una pestaña nueva' },
  galeria: { label: 'Galería', hint: 'abre una galería de imágenes' },
};
const STATUS_TONE = { terminado: 'mint', desarrollo: 'peach', redesign: 'sky' };

/* Utilidades ------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const escapeHTML = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const media = {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
  finePointer: matchMedia('(hover: hover) and (pointer: fine)'),
  // Debe coincidir con el media query del acordeón en styles.css
  desktop: matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)'),
};
const motionOK = () => !media.reducedMotion.matches;

const pad = (n) => String(n).padStart(2, '0');

const ICON_ARROW_UP_RIGHT =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const ICON_EXPAND =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h5v5M9 20H4v-5M20 4l-6 6M4 20l6-6"/></svg>';

/* Hero: collage generado desde `projects` -------------------------------- */
function renderCollage() {
  const root = $('[data-collage]');
  if (!root) return;
  const items = projects.filter((p) => p.hero !== false && p.image).slice(0, 6);
  root.innerHTML = items
    .map(
      (p, i) => `
      <div class="collage__item" style="--i:${i};--depth:${[0.35, 0.6, 0.5, 0.3, 0.7, 0.45][i]}">
        <div class="collage__drift">
          <div class="polaroid">
            <img src="${escapeHTML(p.image)}" alt="" width="1200" height="1000" loading="lazy" decoding="async">
          </div>
        </div>
      </div>`
    )
    .join('');
}

/* Nav: se oculta al bajar y reaparece al subir ---------------------------- */
function initNav() {
  const header = $('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const delta = y - lastY;
    const focusInside = header.contains(document.activeElement);
    if (y < 80 || delta < -4 || focusInside) header.classList.remove('is-hidden');
    else if (delta > 4) header.classList.add('is-hidden');
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

/* Proyectos: render de cards (recibe la lista ya filtrada) --------------- */
function renderProjects(list) {
  const track = $('[data-projects-track]');
  if (!track) return [];

  track.innerHTML = list
    .map((p, i) => {
      const type = TYPES[p.type] || TYPES.sitio;
      const tone = STATUS_TONE[p.status] || 'sky';
      const isGallery = p.type === 'galeria';
      const id = projects.indexOf(p);
      // La galería es un link a la primera imagen (funciona sin JS); con JS abre el diálogo.
      const href = isGallery ? p.gallery?.[0]?.src || p.image : p.url;
      const attrs = isGallery
        ? `data-gallery="${id}" aria-haspopup="dialog"`
        : 'target="_blank" rel="noopener noreferrer"';
      return `
      <li class="card" style="--ci:${i}">
        <a class="card__link" href="${escapeHTML(href)}" ${attrs} data-cursor="view">
          <div class="card__frame">
            <img class="card__img" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.alt || p.title)}" width="1200" height="1000" loading="lazy" decoding="async">
            <span class="card__index" aria-hidden="true">${pad(i + 1)}</span>
            <div class="card__body">
              <span class="tag tag--${tone}">${type.label}</span>
              <h3 class="card__title">${escapeHTML(p.title)}</h3>
              <span class="card__arrow" aria-hidden="true">${isGallery ? ICON_EXPAND : ICON_ARROW_UP_RIGHT}</span>
            </div>
          </div>
          <span class="visually-hidden">(${type.hint})</span>
        </a>
      </li>`;
    })
    .join('');

  return $$('.card', track);
}

/**
 * Controlador de Proyectos.
 * - carrusel: card activa = la más cercana al centro del viewport (scroll-snap nativo).
 * - acordeón (desktop): card abierta = hover/foco, o la activa.
 * - pin (desktop + GSAP, ver initProjectsPin): la activa la decide el progreso del scroll.
 * Los listeners están delegados en el track, así sobreviven a los re-render del filtro.
 */
function initProjects(cards) {
  const section = $('[data-projects]');
  const viewport = $('[data-projects-viewport]');
  const track = $('[data-projects-track]');
  if (!section || !track) return null;

  const current = $('[data-count-current]');
  const total = $('[data-count-total]');
  const prevBtn = $('[data-prev]');
  const nextBtn = $('[data-next]');

  const ctl = {
    cards,
    active: 0,
    hovered: null,
    pinned: false,        // lo activa initProjectsPin
    goTo: null,           // lo define el pin para navegar con el scroll vertical
    onCardsChange: null,  // lo define el pin para reconstruirse al filtrar
    setActive(i) {
      const n = this.cards.length;
      i = Math.max(0, Math.min(n - 1, i));
      this.active = i;
      this.cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
      if (current) current.textContent = pad(n ? i + 1 : 0);
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= n - 1;
      this.syncOpen();
    },
    syncOpen() {
      const open = this.hovered ?? this.active;
      this.cards.forEach((c, k) => c.classList.toggle('is-open', k === open));
    },
    setCards(next) {
      this.cards = next;
      this.hovered = null;
      if (total) total.textContent = pad(next.length);
      viewport.scrollLeft = 0;
      this.setActive(0);
      this.onCardsChange?.();
    },
  };

  const isAccordion = () => media.desktop.matches;
  const applyMode = () => section.classList.toggle('is-accordion', isAccordion());
  applyMode();
  media.desktop.addEventListener('change', applyMode);

  // Navegación con las flechas (puntero fino) y con el foco
  const scrollToCard = (i) => {
    if (ctl.goTo) return ctl.goTo(i);
    const card = ctl.cards[i];
    if (!card) return;
    const target = card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
    viewport.scrollTo({ left: target, behavior: motionOK() ? 'smooth' : 'auto' });
    ctl.setActive(i);
  };
  prevBtn?.addEventListener('click', () => scrollToCard(ctl.active - 1));
  nextBtn?.addEventListener('click', () => scrollToCard(ctl.active + 1));

  // Carrusel: detectar la card centrada
  let raf = 0;
  const detectCentered = () => {
    raf = 0;
    if (ctl.pinned || isAccordion()) return;
    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    ctl.cards.forEach((c, k) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { bestDist = d; best = k; }
    });
    if (best !== ctl.active) ctl.setActive(best);
  };
  viewport.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(detectCentered); }, { passive: true });

  // Acordeón: hover y foco abren la card.
  // Se usa pointermove con movimiento real: al expandirse, las cards se desplazan bajo
  // un mouse quieto y pointerenter abriría la vecina (efecto "salto").
  track.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isAccordion() || (!e.movementX && !e.movementY)) return;
    const k = ctl.cards.indexOf(e.target.closest('.card'));
    if (k > -1 && k !== ctl.hovered) {
      ctl.hovered = k;
      ctl.syncOpen();
    }
  });
  track.addEventListener('pointerleave', () => { ctl.hovered = null; ctl.syncOpen(); });
  track.addEventListener('focusin', (e) => {
    const k = ctl.cards.indexOf(e.target.closest('.card'));
    if (k < 0) return;
    ctl.hovered = null;
    if (k !== ctl.active) scrollToCard(k); // centra la card enfocada (carrusel) o mueve el pin
    else ctl.syncOpen();
  });

  ctl.setCards(cards);
  requestAnimationFrame(detectCentered);
  return ctl;
}

/* Filtro de proyectos: reorganiza las cards con una transición breve ---- */
function initFilters(ctl) {
  const root = $('[data-filters]');
  const track = $('[data-projects-track]');
  const status = $('[data-filter-status]');
  if (!root || !ctl) return;

  const countFor = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.status === id).length);
  const available = filters.filter((f) => f.id === 'all' || countFor(f.id) > 0);
  root.innerHTML = available
    .map((f) => `
      <button class="filter" type="button" data-filter="${f.id}" aria-pressed="${f.id === 'all'}">
        <span>${escapeHTML(f.label)}</span><span class="filter__count" aria-hidden="true">${countFor(f.id)}</span>
      </button>`)
    .join('');
  const buttons = $$('.filter', root);

  let currentFilter = 'all';
  let busy = false;

  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('.filter');
    if (!btn || btn.dataset.filter === currentFilter || busy) return;
    busy = true;
    currentFilter = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    // mantener visible el botón elegido en mobile (el grupo scrollea en horizontal)
    btn.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: motionOK() ? 'smooth' : 'auto' });

    const list = currentFilter === 'all' ? projects : projects.filter((p) => p.status === currentFilter);
    const animate = motionOK();

    if (animate) {
      track.classList.add('is-leaving');
      await wait(220);
    }
    ctl.setCards(renderProjects(list));
    track.classList.remove('is-leaving');
    if (animate) {
      track.classList.add('is-entering');
      setTimeout(() => track.classList.remove('is-entering'), 700 + list.length * 70);
    }
    if (status) status.textContent = `${list.length} ${list.length === 1 ? 'proyecto' : 'proyectos'}: ${btn.textContent.replace(/\d+/g, '').trim()}`;
    busy = false;
  });
}

/* Galería (proyectos type "galeria"): diálogo modal con carrusel nativo -- */
function initGallery() {
  const dialog = $('[data-gallery-dialog]');
  const track = $('[data-gallery-track]');
  if (!dialog || !track || typeof dialog.showModal !== 'function') return; // sin soporte: el link abre la imagen
  const title = $('[data-gallery-title]', dialog);
  const count = $('[data-gallery-count]', dialog);
  const prev = $('[data-gallery-prev]', dialog);
  const next = $('[data-gallery-next]', dialog);
  let index = 0;
  let total = 0;
  let opener = null;

  const update = () => {
    index = Math.round(track.scrollLeft / track.clientWidth) || 0;
    count.textContent = `${index + 1} / ${total}`;
    prev.disabled = index <= 0;
    next.disabled = index >= total - 1;
  };
  const go = (i) => {
    track.scrollTo({ left: i * track.clientWidth, behavior: motionOK() ? 'smooth' : 'auto' });
  };
  let raf = 0;
  track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  const close = async () => {
    if (!dialog.open) return;
    if (motionOK()) {
      dialog.classList.add('is-closing');
      await wait(250);
      dialog.classList.remove('is-closing');
    }
    dialog.close();
  };
  $('[data-gallery-close]', dialog).addEventListener('click', close);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); }); // Esc con animación
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return; // clic en el fondo (fuera del panel)
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

  // Abrir: clic delegado en las cards con data-gallery
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-gallery]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const project = projects[+link.dataset.gallery];
    if (!project?.gallery?.length) return;
    e.preventDefault();
    opener = link;
    total = project.gallery.length;
    title.textContent = project.title;
    track.innerHTML = project.gallery
      .map((img, i) => `
        <li class="gallery__slide">
          <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.alt || `${project.title}, imagen ${i + 1}`)}" width="1200" height="1000" ${i ? 'loading="lazy"' : ''} decoding="async">
        </li>`)
      .join('');
    dialog.showModal();
    track.scrollLeft = 0;
    update();
  });
}

/* ==========================================================================
   MOTION
   Regla: si el usuario pide reduced-motion, nada de esto se inicializa.
   ========================================================================== */
const supportsScrollTimeline = CSS.supports?.('animation-timeline: scroll()');
const supportsViewTimeline = CSS.supports?.('animation-timeline: view()');

/* Barra de progreso: fallback JS si no hay scroll-timeline en CSS */
function initProgressFallback() {
  if (supportsScrollTimeline) return;
  const bar = $('[data-progress]');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : 0);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}

/* Revelado al scroll: fallback con IntersectionObserver */
function initRevealFallback() {
  if (supportsViewTimeline || !motionOK() || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-io');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
}

/* Collage del hero: parallax con el mouse (desktop) + fallback JS del parallax de scroll */
function initCollageParallax() {
  const hero = $('.hero');
  const items = $$('.collage__item');
  if (!hero || !items.length || !motionOK()) return;
  const depth = (el) => parseFloat(el.style.getPropertyValue('--depth')) || 0.5;

  // Fallback para navegadores sin scroll-timeline (ej. Firefox)
  if (!supportsScrollTimeline) {
    let ticking = false;
    const onScroll = () => {
      const p = Math.min(scrollY / innerHeight, 1);
      items.forEach((el) => { el.style.transform = `translate3d(0, ${(-240 * depth(el) * p).toFixed(1)}px, 0)`; });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  }

  // Mouse: solo puntero fino. Interpolación suave y rAF solo mientras hay movimiento.
  if (!media.finePointer.matches) return;
  const drifts = items.map((el) => ({ el: $('.collage__drift', el), d: depth(el) }));
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, heroVisible = true;

  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    drifts.forEach(({ el, d }) => { el.style.transform = `translate3d(${(cx * d * 36).toFixed(2)}px, ${(cy * d * 28).toFixed(2)}px, 0)`; });
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('pointermove', (e) => {
    if (!heroVisible || e.pointerType !== 'mouse') return;
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
}

/* Botones magnéticos (desktop) */
function initMagnetic() {
  if (!media.finePointer.matches || !motionOK()) return;
  $$('[data-magnetic]').forEach((el) => {
    const strength = el.classList.contains('btn-rainbow') ? 0.35 : 0.25;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.classList.add('is-magnet');
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnet');
      el.style.translate = '';
    });
  });
}

/* Cursor personalizado: punto + burbuja "Ver" sobre las cards (solo puntero fino) */
function initCursor() {
  if (!media.finePointer.matches || !motionOK()) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<div class="cursor__dot"></div><div class="cursor__bubble">Ver</div>';
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');

  const dot = $('.cursor__dot', cursor);
  const bubble = $('.cursor__bubble', cursor);
  let x = -100, y = -100, bx = x, by = y, raf = 0;

  const loop = () => {
    bx += (x - bx) * 0.2;
    by += (y - by) * 0.2;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    bubble.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
    raf = Math.abs(x - bx) + Math.abs(y - by) > 0.1 ? requestAnimationFrame(loop) : 0;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    cursor.classList.add('is-visible');
    const target = e.target.closest?.('a, button, [data-cursor]');
    cursor.classList.toggle('is-view', target?.dataset.cursor === 'view');
    cursor.classList.toggle('is-link', !!target && target.dataset.cursor !== 'view');
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  addEventListener('blur', () => cursor.classList.remove('is-visible'));
}

/* Proyectos en desktop: pin con GSAP ScrollTrigger.
   El scroll vertical avanza las cards en horizontal y abre la activa. */
const GSAP_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const ST_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
const PIN_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });

let gsapLoading = null;
function loadGSAP() {
  gsapLoading ??= loadScript(GSAP_SRC).then(() => loadScript(ST_SRC));
  return gsapLoading;
}

function initProjectsPin(ctl) {
  if (!ctl) return;
  const section = $('[data-projects]');
  const pinEl = $('[data-projects-pin]');
  const viewport = $('[data-projects-viewport]');
  const track = $('[data-projects-track]');

  const setup = () => {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(PIN_QUERY, () => {
      // Medidas reales (CSS vars resueltas) para calcular dónde queda cada card
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;height:0;width:var(--card-wide)';
      section.append(probe);
      let wide = 0, narrow = 0, gap = 0, padL = 0, padR = 0;
      const measure = () => {
        wide = probe.offsetWidth;
        const cs = getComputedStyle(track);
        gap = parseFloat(cs.columnGap) || 0;
        padL = parseFloat(cs.paddingLeft) || 0;
        padR = parseFloat(cs.paddingRight) || 0;
        narrow = parseFloat(getComputedStyle(section).getPropertyValue('--card-narrow')) || 128;
      };
      const count = () => ctl.cards.length;
      const xFor = (i) => {
        const n = count();
        const vw = viewport.clientWidth;
        const totalW = padL + padR + wide + (n - 1) * (narrow + gap);
        const center = padL + i * (narrow + gap) + wide / 2;
        return Math.max(Math.min(vw / 2 - center, 0), Math.min(vw - totalW, 0));
      };
      const moveTo = (i, instant) =>
        gsap.to(track, { x: xFor(i), duration: instant ? 0 : 0.7, ease: 'expo.out', overwrite: true });

      let st = null;
      // (Re)construye el pin según la cantidad de cards visibles (cambia con el filtro)
      const build = () => {
        st?.kill();
        st = null;
        ctl.goTo = null;
        gsap.set(track, { x: 0 });
        const n = count();
        const pinnable = n > 1;
        section.classList.toggle('is-pinned', pinnable);
        ctl.pinned = pinnable;
        if (!pinnable) return;
        viewport.scrollLeft = 0;
        measure();
        st = ScrollTrigger.create({
          trigger: pinEl,
          pin: true,
          start: 'top top',
          end: () => '+=' + Math.round((count() - 1) * innerHeight * 0.55),
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power2.out' },
          onRefresh: () => { measure(); moveTo(ctl.active, true); },
          onUpdate: (self) => {
            const i = Math.round(self.progress * (count() - 1));
            if (i !== ctl.active) { ctl.setActive(i); moveTo(i); }
          },
        });
        // Flechas y foco con teclado: navegan moviendo el scroll vertical
        ctl.goTo = (i) => {
          i = Math.max(0, Math.min(count() - 1, i));
          const y = st.start + (st.end - st.start) * (i / (count() - 1));
          scrollTo({ top: y, behavior: 'smooth' });
        };
        moveTo(ctl.active, true);
      };

      build();
      // Al filtrar: reconstruir y volver al inicio de la sección (sin saltos raros)
      ctl.onCardsChange = () => {
        build();
        ScrollTrigger.refresh();
        const top = st ? st.start : pinEl.getBoundingClientRect().top + scrollY;
        scrollTo({ top, behavior: 'instant' });
      };

      return () => {
        st?.kill();
        section.classList.remove('is-pinned');
        ctl.pinned = false;
        ctl.goTo = null;
        ctl.onCardsChange = null;
        probe.remove();
        gsap.set(track, { clearProps: 'transform' });
      };
    });

    // Recalcular cuando cargan las fuentes (cambian alturas)
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  };

  const maybeLoad = () => {
    if (!matchMedia(PIN_QUERY).matches) return;
    loadGSAP().then(setup).catch(() => { /* sin CDN: queda el acordeón con scroll nativo */ });
  };
  const mq = matchMedia(PIN_QUERY);
  if (mq.matches) maybeLoad();
  else mq.addEventListener('change', maybeLoad, { once: true });
}

/* Footer: año actual */
function initYear() {
  const el = $('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* Init ------------------------------------------------------------------- */
renderCollage();
const projectsCtl = initProjects(renderProjects(projects));
initFilters(projectsCtl);
initGallery();
initNav();
initYear();
initProgressFallback();
initRevealFallback();
initCollageParallax();
initMagnetic();
initCursor();
initProjectsPin(projectsCtl);
