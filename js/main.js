/* ==========================================================================
   Portfolio RIVUZ — main.js
   Vanilla JS. Todo lo que cambia contenido está en `projects`.
   ========================================================================== */

/**
 * PROYECTOS — editá este array para agregar, quitar o reordenar proyectos.
 * No hace falta tocar el HTML.
 *
 *  title     Título visible de la card.
 *  category  Texto de la pastilla (ej. "Landing page", "E-commerce").
 *  type      "imagen" | "behance" | "sitio" (solo informativo, se usa en el aria-label).
 *  url       Link que se abre en una pestaña nueva. Para type "imagen" podés apuntar
 *            a un archivo de /assets (ej. "assets/projects/mi-diseño-full.webp").
 *  image     Miniatura WebP (recomendado 1200×1000). Se muestra recortada (object-fit: cover).
 *  alt       Descripción breve de la imagen.
 *  tone      Color pastel de la pastilla: "mint" | "sky" | "peach".
 *  hero      false para no usarla en el collage del hero (se usan las primeras 6).
 */
const projects = [
  // TODO: reemplazar título, categoría, link e imagen por los del proyecto real
  { title: 'Proyecto 01', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-01.webp', image: 'assets/projects/proyecto-01.webp', alt: 'TODO: describir el diseño del proyecto 01', tone: 'mint' },
  { title: 'Proyecto 02', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-02.webp', image: 'assets/projects/proyecto-02.webp', alt: 'TODO: describir el diseño del proyecto 02', tone: 'sky' },
  { title: 'Proyecto 03', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-03.webp', image: 'assets/projects/proyecto-03.webp', alt: 'TODO: describir el diseño del proyecto 03', tone: 'peach' },
  { title: 'Proyecto 04', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-04.webp', image: 'assets/projects/proyecto-04.webp', alt: 'TODO: describir el diseño del proyecto 04', tone: 'mint' },
  { title: 'Proyecto 05', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-05.webp', image: 'assets/projects/proyecto-05.webp', alt: 'TODO: describir el diseño del proyecto 05', tone: 'sky' },
  { title: 'Proyecto 06', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-06.webp', image: 'assets/projects/proyecto-06.webp', alt: 'TODO: describir el diseño del proyecto 06', tone: 'peach' },
  { title: 'Proyecto 07', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-07.webp', image: 'assets/projects/proyecto-07.webp', alt: 'TODO: describir el diseño del proyecto 07', tone: 'mint' },
  { title: 'Proyecto 08', category: 'TODO categoría', type: 'imagen', url: 'assets/projects/proyecto-08.webp', image: 'assets/projects/proyecto-08.webp', alt: 'TODO: describir el diseño del proyecto 08', tone: 'sky' },
];

/* Utilidades ------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const escapeHTML = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const media = {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
  finePointer: matchMedia('(hover: hover) and (pointer: fine)'),
  // Debe coincidir con el media query del acordeón en styles.css
  desktop: matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)'),
};

const pad = (n) => String(n).padStart(2, '0');

const ICON_ARROW_UP_RIGHT =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

/* Hero: collage generado desde `projects` -------------------------------- */
function renderCollage() {
  const root = $('[data-collage]');
  if (!root) return;
  const items = projects.filter((p) => p.hero !== false && p.image).slice(0, 6);
  root.innerHTML = items
    .map(
      (p, i) => `
      <div class="collage__item" style="--i:${i}" data-depth="${[0.35, 0.6, 0.5, 0.3, 0.7, 0.45][i]}">
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

/* Proyectos: render de cards ------------------------------------------- */
function renderProjects() {
  const track = $('[data-projects-track]');
  if (!track) return [];
  const typeLabel = { imagen: 'imagen', behance: 'Behance', sitio: 'sitio web' };

  track.innerHTML = projects
    .map((p, i) => {
      const tone = ['mint', 'sky', 'peach'].includes(p.tone) ? p.tone : 'sky';
      const opens = typeLabel[p.type] ? `Abre ${typeLabel[p.type]} en una pestaña nueva` : 'Se abre en una pestaña nueva';
      return `
      <li class="card" data-index="${i}">
        <a class="card__link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer" data-cursor="view">
          <div class="card__frame">
            <img class="card__img" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.alt || p.title)}" width="1200" height="1000" loading="lazy" decoding="async">
            <span class="card__index" aria-hidden="true">${pad(i + 1)}</span>
            <div class="card__body">
              <span class="tag tag--${tone}">${escapeHTML(p.category)}</span>
              <h3 class="card__title">${escapeHTML(p.title)}</h3>
              <span class="card__arrow" aria-hidden="true">${ICON_ARROW_UP_RIGHT}</span>
            </div>
          </div>
          <span class="visually-hidden">(${opens})</span>
        </a>
      </li>`;
    })
    .join('');

  const total = $('[data-count-total]');
  if (total) total.textContent = pad(projects.length);
  return $$('.card', track);
}

/**
 * Controlador de Proyectos.
 * - carrusel: card activa = la más cercana al centro del viewport (scroll-snap nativo).
 * - acordeón (desktop): card abierta = hover/foco, o la activa.
 * - pin (desktop + GSAP, ver initProjectsPin): la activa la decide el progreso del scroll.
 */
function initProjects(cards) {
  const section = $('[data-projects]');
  const viewport = $('[data-projects-viewport]');
  const track = $('[data-projects-track]');
  if (!section || !cards.length) return null;

  const current = $('[data-count-current]');
  const prevBtn = $('[data-prev]');
  const nextBtn = $('[data-next]');

  const ctl = {
    active: 0,
    hovered: null,
    pinned: false, // lo activa initProjectsPin
    goTo: null,    // lo sobreescribe el pin para navegar por scroll vertical
    setActive(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      this.active = i;
      cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
      if (current) current.textContent = pad(i + 1);
      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) nextBtn.disabled = i === cards.length - 1;
      this.syncOpen();
    },
    syncOpen() {
      const open = this.hovered ?? this.active;
      cards.forEach((c, k) => c.classList.toggle('is-open', k === open));
    },
  };

  const isAccordion = () => media.desktop.matches;
  const applyMode = () => section.classList.toggle('is-accordion', isAccordion());
  applyMode();
  media.desktop.addEventListener('change', applyMode);

  // Navegación con las flechas (puntero fino)
  const scrollToCard = (i) => {
    if (ctl.goTo) return ctl.goTo(i);
    const card = cards[i];
    const target = card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
    viewport.scrollTo({ left: target, behavior: media.reducedMotion.matches ? 'auto' : 'smooth' });
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
    cards.forEach((c, k) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { bestDist = d; best = k; }
    });
    if (best !== ctl.active) ctl.setActive(best);
  };
  viewport.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(detectCentered); }, { passive: true });

  // Acordeón: hover y foco abren la card
  cards.forEach((c, k) => {
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !isAccordion()) return;
      ctl.hovered = k;
      ctl.syncOpen();
    });
    c.addEventListener('focusin', () => {
      ctl.hovered = null;
      if (ctl.pinned && ctl.goTo) ctl.goTo(k);
      else ctl.setActive(k);
    });
  });
  track.addEventListener('pointerleave', () => { ctl.hovered = null; ctl.syncOpen(); });

  ctl.setActive(0);
  requestAnimationFrame(detectCentered);
  return ctl;
}

/* Init ------------------------------------------------------------------- */
renderCollage();
const projectCards = renderProjects();
const projectsCtl = initProjects(projectCards);
initNav();
