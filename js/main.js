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
 *  focus    Opcional: qué parte de la imagen priorizar al recortar (object-position),
 *           ej. "72% 50%" = más hacia la derecha. Por defecto "50% 50%" (centro).
 *  hero     false para no usarla en el collage del hero (se usan las primeras 6).
 */
const projects = [
  { title: 'Tackr Scout', type: 'behance', status: 'terminado', url: 'https://www.behance.net/gallery/244458863/Tackr-Scout-UX-UI-Landing-Page', image: 'assets/projects/tackr-scout.webp', alt: 'Landing de Tackr Scout: dos celulares con la app de búsqueda de talento tech', focus: '50% 50%' },
  { title: 'FOODTEX', type: 'sitio', status: 'desarrollo', url: 'https://foodtex-propuesta-2.netlify.app/', image: 'assets/projects/foodtex.webp', alt: 'Hero de FOODTEX: “Tecnología que mueve tu industria” junto a una cinta transportadora industrial', focus: '0% 50%' },
  { title: '3D Design', type: 'behance', status: 'terminado', url: 'https://www.behance.net/rodrigomignola', image: 'assets/projects/3d-design.webp', alt: 'Render 3D de un teclado mecánico con teclas azules sobre fondo rojo', focus: '50% 50%' },
  { title: 'Tackr Jobs', type: 'sitio', status: 'terminado', url: 'https://tackrjobs.com/es', image: 'assets/projects/tackr-jobs.webp', alt: 'Home de Tackr Jobs: buscador de perfiles con IA y la pregunta “Hola, ¿qué perfil estás buscando hoy?”', focus: '50% 30%' },
  { title: 'BCM Products', type: 'sitio', status: 'desarrollo', url: 'https://bcm-products-motion.lihuensg.chatgpt.site/', image: 'assets/projects/bcm-products.webp', alt: 'Hero de BCM Products: “Un iPhone. Mil posibilidades.” con un iPhone bordó', focus: '100% 50%' },
  { title: 'HLTV.org Redesign', type: 'behance', status: 'redesign', url: 'https://www.behance.net/gallery/199721495/HLTVorg-Redesign-UX-UI-Case-Study', image: 'assets/projects/hltv-redesign.webp', alt: 'Portada del caso de estudio del rediseño de HLTV.org con la web en una notebook', focus: '62% 50%' },
  { title: 'La Alameda', type: 'sitio', status: 'terminado', url: 'https://www.laalameda.com.ar/', image: 'assets/projects/la-alameda.webp', alt: 'Home de La Alameda: “Elegí tu lote ideal” con el plano aéreo de los lotes', focus: '50% 40%' },
  {
    title: 'Basalto', type: 'galeria', status: 'terminado', image: 'assets/projects/basalto.webp', focus: '62% 50%',
    alt: 'Portada del caso Basalto: sitio web oscuro con detalles naranjas en notebook y celular',
    gallery: [
      { src: 'assets/projects/basalto/basalto-01-portada-2x.webp', alt: 'Portada del caso Basalto: el sitio en notebook y celular' },
      { src: 'assets/projects/basalto/basalto-02-home-desktop-2x.webp', alt: 'Home de Basalto en desktop, página completa' },
      { src: 'assets/projects/basalto/basalto-03-home-tablet-2x.webp', alt: 'Home de Basalto en tablet' },
      { src: 'assets/projects/basalto/basalto-04-home-mobile-2x.webp', alt: 'Home de Basalto en mobile, pantallas sucesivas' },
      { src: 'assets/projects/basalto/basalto-05-proyectos-2x.webp', alt: 'Página de proyectos de Basalto en desktop y mobile' },
      { src: 'assets/projects/basalto/basalto-06-caso-valsuar-2x.webp', alt: 'Caso Valsuar: página de caso de estudio de Basalto' },
      { src: 'assets/projects/basalto/basalto-07-contacto-2x.webp', alt: 'Página de contacto de Basalto' },
    ],
  },
  { title: 'Mariela Martinez Negocios Inmobiliarios', type: 'sitio', status: 'terminado', url: 'https://marielamartinezinmobiliaria.com.ar/', image: 'assets/projects/mariela-martinez.webp', alt: 'Home de Mariela Martinez Negocios Inmobiliarios: buscador de propiedades sobre una vista aérea de la ciudad', focus: '50% 50%' },
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

/* Hero: collage generado desde `projects` --------------------------------
   Estructura: item (posición + vuelo 3D con el scroll) > drift (inclinación con el mouse)
   > float (flotación 3D continua) > polaroid (ángulo, entrada y hover).
   Es decorativo para lectores de pantalla (aria-hidden); los links tienen tabindex -1
   porque esos mismos proyectos están accesibles en la sección Proyectos. */
const COLLAGE_DEPTH = [0.35, 0.6, 0.5, 0.3, 0.7, 0.45];

function renderCollage() {
  const root = $('[data-collage]');
  if (!root) return;
  const items = projects.filter((p) => p.hero !== false && p.image).slice(0, 6);
  root.innerHTML = items
    .map((p, i) => {
      const isGallery = p.type === 'galeria';
      const href = isGallery ? p.gallery?.[0]?.src || p.image : p.url;
      const attrs = isGallery
        ? `data-gallery="${projects.indexOf(p)}"`
        : 'target="_blank" rel="noopener noreferrer"';
      return `
      <div class="collage__item" style="--i:${i};--depth:${COLLAGE_DEPTH[i]}">
        <div class="collage__drift">
          <div class="collage__float">
            <a class="polaroid" href="${escapeHTML(href)}" ${attrs} tabindex="-1" data-cursor="view">
              <img src="${escapeHTML(p.image)}" alt="" width="1200" height="1000" loading="lazy" decoding="async"${p.focus ? ` style="object-position:${escapeHTML(p.focus)}"` : ''}>
              <span class="polaroid__label">${escapeHTML(p.title)}</span>
            </a>
          </div>
        </div>
      </div>`;
    })
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
            <img class="card__img" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.alt || p.title)}"${p.focus ? ` style="object-position:${escapeHTML(p.focus)}"` : ''} width="1200" height="1000" loading="lazy" decoding="async">
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
    onOpen: null,         // lo define el pin: mueve el carril para mostrar la card abierta
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
      if (this.onOpen) this.onOpen(open);
      else if (this.hovered !== null && isAccordion()) revealCard(open);
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

  // Acordeón sin pin (ej. reduced-motion): si la card abierta con el mouse queda cortada
  // en un borde, se desplaza el scroll horizontal lo justo para verla entera.
  let revealTimer = 0;
  function revealCard(i) {
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => { // esperar a que termine de expandirse
      const card = ctl.cards[i];
      if (!card) return;
      // deja asomar la card vecina para poder seguir con el mouse
      const peek = 80;
      const mR = i < ctl.cards.length - 1 ? peek : 24;
      const mL = i > 0 ? peek : 24;
      const vr = viewport.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      let delta = 0;
      if (r.right > vr.right - mR) delta = r.right - (vr.right - mR);
      else if (r.left < vr.left + mL) delta = r.left - (vr.left + mL);
      if (delta) viewport.scrollBy({ left: delta, behavior: motionOK() ? 'smooth' : 'auto' });
    }, 400);
  }
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
  // Además hay "hover-intent" (60ms): la card se abre cuando el mouse se detiene apenas un instante,
  // así cruzar la fila con el mouse no abre y cierra cards sin parar.
  let intent = 0;
  track.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isAccordion() || (!e.movementX && !e.movementY)) return;
    const k = ctl.cards.indexOf(e.target.closest('.card'));
    clearTimeout(intent);
    if (k < 0 || k === ctl.hovered) return;
    intent = setTimeout(() => {
      ctl.hovered = k;
      ctl.syncOpen();
    }, 60);
  });
  track.addEventListener('pointerleave', () => {
    clearTimeout(intent);
    ctl.hovered = null;
    ctl.syncOpen();
  });
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
    // ↑ ↓ recorren la imagen actual (las capturas de página completa son altas)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const slide = track.children[index];
      if (slide) { e.preventDefault(); slide.scrollBy({ top: e.key === 'ArrowDown' ? 160 : -160, behavior: motionOK() ? 'smooth' : 'auto' }); }
    }
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

  // Fallback para navegadores sin scroll-timeline (ej. Firefox): mismo "vuelo" que el CSS.
  // Las cards impares están a la izquierda (salen hacia la izquierda) y las pares a la derecha.
  if (!supportsScrollTimeline) {
    const content = $('.hero__content');
    let ticking = false;
    const onScroll = () => {
      const p = Math.min(scrollY / (innerHeight * 0.85), 1);
      items.forEach((el, i) => {
        const d = depth(el);
        const dir = i % 2 === 0 ? -1 : 1;
        const x = dir * (12 + d * 18) * innerWidth / 100 * p;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${(-200 * d * p).toFixed(1)}px, 0) rotate(${dir * 10 * p}deg) scale(${1 + (0.15 + d * 0.35) * p})`;
        el.style.opacity = String(1 - p);
      });
      if (content) {
        content.style.transform = `translate3d(0, ${60 * p}px, 0) scale(${1 - 0.06 * p})`;
        content.style.opacity = String(1 - p);
      }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  }

  // Mouse: solo puntero fino. Interpolación suave y rAF solo mientras hay movimiento.
  if (!media.finePointer.matches) return;
  const drifts = items.map((el) => ({ el: $('.collage__drift', el), d: depth(el) }));
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, heroVisible = true;

  const loop = () => {
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    drifts.forEach(({ el, d }) => {
      el.style.transform = `translate3d(${(cx * d * 16).toFixed(2)}px, ${(cy * d * 12).toFixed(2)}px, 0) ` +
        `rotateY(${(cx * 10).toFixed(2)}deg) rotateX(${(-cy * 8).toFixed(2)}deg)`;
    });
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

/* Luz sobre la grilla de puntos ------------------------------------------
   Un canvas dibuja solo los puntos "encendidos" encima de la grilla CSS (alineados con ella),
   así se dibujan unas decenas de puntos por frame y no toda la grilla.
   - Desktop: la luz sigue al mouse; si el mouse está quieto, recorre la pantalla sola.
   - Celular: recorre la pantalla sola y al tocar sale una onda de luz desde el dedo.
   Se apaga cuando el hero sale de pantalla o la pestaña está oculta. */
function initDotLight() {
  const canvas = $('[data-light]');
  const hero = $('.hero');
  if (!canvas || !hero || !motionOK()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const GRID = 22;                    // = background-size de .bg::before
  const R = media.finePointer.matches ? 180 : 130;
  let w = 0, h = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  let lx = w * 0.5, ly = h * 0.45, tx = lx, ty = ly;
  let lastMouse = -Infinity, intensity = 0, visible = true, raf = 0;
  const t0 = performance.now();
  const ripples = [];

  // Punto encendido: más grande y más azul/cian cuanto más cerca de la luz
  const dot = (x, y, f, alpha) => {
    ctx.fillStyle = `hsla(${221 - 32 * f}, 90%, ${55 + 6 * f}%, ${(0.18 + 0.72 * f) * alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + 1.7 * f, 0, Math.PI * 2);
    ctx.fill();
  };
  // Recorre solo las celdas de la grilla dentro de un radio
  const eachDot = (cx, cy, radius, fn) => {
    const x0 = Math.max(0, Math.floor((cx - radius) / GRID));
    const x1 = Math.min(Math.ceil(w / GRID), Math.ceil((cx + radius) / GRID));
    const y0 = Math.max(0, Math.floor((cy - radius) / GRID));
    const y1 = Math.min(Math.ceil(h / GRID), Math.ceil((cy + radius) / GRID));
    for (let gx = x0; gx <= x1; gx++) {
      for (let gy = y0; gy <= y1; gy++) {
        const x = gx * GRID + GRID / 2;
        const y = gy * GRID + GRID / 2;
        fn(x, y, Math.hypot(x - cx, y - cy));
      }
    }
  };

  const draw = (now) => {
    raf = 0;
    if (now - lastMouse > 2500) { // piloto automático (celular o mouse quieto)
      const s = (now - t0) / 1000;
      tx = w * (0.5 + 0.34 * Math.sin(s * 0.33));
      ty = h * (0.46 + 0.24 * Math.sin(s * 0.51 + 1.2));
    }
    lx += (tx - lx) * 0.07;
    ly += (ty - ly) * 0.07;
    intensity += ((visible ? 1 : 0) - intensity) * 0.08;

    ctx.clearRect(0, 0, w, h);
    if (intensity > 0.01) {
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.5);
      g.addColorStop(0, `rgba(37, 99, 235, ${0.09 * intensity})`);
      g.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(lx - R * 1.5, ly - R * 1.5, R * 3, R * 3);
      eachDot(lx, ly, R, (x, y, d) => { if (d < R) dot(x, y, 1 - d / R, intensity); });
    }
    for (let i = ripples.length - 1; i >= 0; i--) { // ondas al tocar
      const r = ripples[i];
      const age = (now - r.t) / 1000;
      if (age > 1.3) { ripples.splice(i, 1); continue; }
      const radius = 20 + age * 460;
      const band = 46;
      const fade = 1 - age / 1.3;
      eachDot(r.x, r.y, radius + band, (x, y, d) => {
        const k = 1 - Math.abs(d - radius) / band;
        if (k > 0) dot(x, y, k, fade);
      });
    }
    if (!document.hidden && (visible || intensity > 0.01 || ripples.length)) raf = requestAnimationFrame(draw);
  };
  const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(draw); };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX;
    ty = e.clientY;
    lastMouse = performance.now();
  }, { passive: true });
  hero.addEventListener('pointerdown', (e) => {
    ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    start();
  }, { passive: true });
  // Arranca cuando la página ya cargó (no compite con la carga inicial)
  const boot = () => {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(hero);
    document.addEventListener('visibilitychange', start);
    start();
  };
  const later = () => setTimeout(boot, 600);
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
}

/* Intro: se quita del DOM al terminar (la animación es CSS; esto es solo limpieza) */
function initIntro() {
  const intro = $('[data-intro]');
  if (!intro) return;
  if (!document.documentElement.classList.contains('has-intro')) { intro.remove(); return; }
  const done = () => intro.remove();
  intro.addEventListener('animationend', (e) => { if (e.target === intro) done(); });
  setTimeout(done, 3000); // red de seguridad
}

/* Botones magnéticos (desktop) */
function initMagnetic() {
  if (!media.finePointer.matches || !motionOK()) return;
  $$('[data-magnetic]').forEach((el) => {
    const strength = el.classList.contains('btn-gradient') ? 0.16 : 0.1;
    const max = 6; // px: desplazamiento máximo, para que no se sienta "nervioso"
    const clamp = (v) => Math.max(-max, Math.min(max, v));
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = clamp((e.clientX - (r.left + r.width / 2)) * strength);
      const y = clamp((e.clientY - (r.top + r.height / 2)) * strength);
      el.classList.add('is-magnet');
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnet');
      el.style.translate = '';
    });
  });
}

/* Burbuja "Ver" sobre las cards (solo puntero fino).
   El cursor nativo se mantiene siempre: la burbuja lo acompaña con un retardo suave. */
function initCursor() {
  if (!media.finePointer.matches || !motionOK()) return;
  const bubble = document.createElement('div');
  bubble.className = 'cursor-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  bubble.textContent = 'Ver';
  document.body.append(bubble);

  let x = 0, y = 0, bx = 0, by = 0, raf = 0, active = false;
  const loop = () => {
    bx += (x - bx) * 0.25;
    by += (y - by) * 0.25;
    bubble.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
    raf = Math.abs(x - bx) + Math.abs(y - by) > 0.2 ? requestAnimationFrame(loop) : 0;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    const over = !!e.target.closest?.('[data-cursor="view"]');
    if (over && !active) { bx = x; by = y; } // aparece donde está el mouse, sin "viajar"
    active = over;
    bubble.classList.toggle('is-visible', over);
    if (over && !raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  const hide = () => { active = false; bubble.classList.remove('is-visible'); };
  document.addEventListener('pointerleave', hide);
  addEventListener('blur', hide);
  addEventListener('scroll', () => { if (active) hide(); }, { passive: true }); // el contenido se movió bajo el mouse
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
    // El CSS usa scroll-behavior: smooth (anclas del nav). Mientras ScrollTrigger recalcula
    // mueve el scroll internamente: si ese movimiento es "suave", mide mal y el pin queda
    // corrido (la sección terminaba encima del hero al filtrar). Se desactiva solo durante el cálculo.
    const root = document.documentElement;
    ScrollTrigger.addEventListener('refreshInit', () => { root.style.scrollBehavior = 'auto'; });
    ScrollTrigger.addEventListener('refresh', () => { root.style.scrollBehavior = ''; });
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
        gsap.to(track, { x: xFor(i), duration: instant ? 0 : 0.9, ease: 'power3.out', overwrite: true });

      // Card abierta con el mouse: correr el carril lo mínimo para que se vea entera
      // (así se llega con el mouse a las cards de los costados). Sin hover vuelve a la activa.
      const revealX = (i) => {
        const n = count();
        const vw = viewport.clientWidth;
        // deja asomar la mitad de la card vecina: siempre hay "a dónde ir" con el mouse
        const peek = gap + narrow * 0.5;
        const mR = i < n - 1 ? peek : 24;
        const mL = i > 0 ? peek : 24;
        const totalW = padL + padR + wide + (n - 1) * (narrow + gap);
        const left = padL + i * (narrow + gap);
        const right = left + wide;
        let x = gsap.getProperty(track, 'x');
        if (right + x > vw - mR) x = vw - mR - right;
        if (left + x < mL) x = mL - left;
        return Math.max(Math.min(x, 0), Math.min(vw - totalW, 0));
      };

      // Un solo pin para siempre. Al filtrar NO se destruye ni se recrea (eso dejaba la
      // sección "pegada" encima del hero): solo se recalcula con ScrollTrigger.refresh().
      // El largo depende de la cantidad de cards visibles (con 1 card queda casi en 0).
      const span = () => Math.max(1, Math.round((count() - 1) * innerHeight * 0.7));
      section.classList.add('is-pinned');
      ctl.pinned = true;
      viewport.scrollLeft = 0;
      measure();
      const st = ScrollTrigger.create({
        trigger: pinEl,
        pin: true,
        start: 'top top',
        end: () => '+=' + span(),
        invalidateOnRefresh: true,
        onRefresh: () => { measure(); moveTo(ctl.active, true); },
        onUpdate: (self) => {
          const i = Math.round(self.progress * Math.max(count() - 1, 0));
          if (i !== ctl.active) {
            ctl.hovered = null; // al scrollear manda el scroll, aunque el mouse esté sobre una card
            ctl.setActive(i);
            moveTo(i);
          }
        },
      });

      // Flechas y foco con teclado: navegan moviendo el scroll vertical
      ctl.goTo = (i) => {
        const n = count();
        i = Math.max(0, Math.min(n - 1, i));
        const y = n > 1 ? st.start + (st.end - st.start) * (i / (n - 1)) : st.start;
        scrollTo({ top: y, behavior: 'smooth' });
      };
      ctl.onOpen = (i) => {
        if (ctl.hovered === null) moveTo(ctl.active);
        else gsap.to(track, { x: revealX(i), duration: 0.9, ease: 'power3.out', overwrite: true });
      };
      moveTo(ctl.active, true);

      // Al filtrar: recalcular el pin y volver al inicio de la sección
      ctl.onCardsChange = () => {
        gsap.set(track, { x: 0 });
        ScrollTrigger.refresh();
        scrollTo({ top: st.start, behavior: 'instant' });
        moveTo(0, true);
      };

      return () => {
        st?.kill(true);
        section.classList.remove('is-pinned');
        ctl.pinned = false;
        ctl.goTo = null;
        ctl.onCardsChange = null;
        ctl.onOpen = null;
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

/* Contacto: copiar el email al portapapeles -------------------------------- */
function initCopyEmail() {
  const btn = $('[data-copy]');
  if (!btn) return;
  const tip = $('[data-copy-tip]', btn);
  const status = $('[data-copy-status]');
  const text = btn.dataset.copy;
  let timer = 0;

  // Respaldo para navegadores sin Clipboard API (o sin https)
  const legacyCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  };
  // Último recurso: dejar el email seleccionado para copiarlo a mano
  const selectText = () => {
    const range = document.createRange();
    range.selectNodeContents($('.email-copy__text', btn));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const feedback = (msg, copied) => {
    tip.textContent = msg;
    if (status) status.textContent = msg;
    btn.classList.toggle('is-copied', copied);
    btn.classList.add('is-tip');
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.classList.remove('is-copied', 'is-tip');
      tip.textContent = 'Copiar';
      if (status) status.textContent = '';
    }, 2000);
  };

  btn.addEventListener('click', async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) {
      ok = legacyCopy();
    }
    if (ok) feedback('¡Copiado!', true);
    else { selectText(); feedback('Seleccionado: copialo con Ctrl+C', false); }
  });
}

/* Footer: año actual */
function initYear() {
  const el = $('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* Init ------------------------------------------------------------------- */
initIntro();
renderCollage();
const projectsCtl = initProjects(renderProjects(projects));
initFilters(projectsCtl);
initGallery();
initNav();
initYear();
initCopyEmail();
initProgressFallback();
initRevealFallback();
initCollageParallax();
initDotLight();
initMagnetic();
initCursor();
initProjectsPin(projectsCtl);
