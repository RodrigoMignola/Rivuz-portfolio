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

  // Acordeón: hover y foco abren la card.
  // Se usa pointermove con movimiento real: al expandirse, las cards se desplazan bajo
  // un mouse quieto y pointerenter abriría la vecina (efecto "salto").
  track.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isAccordion() || (!e.movementX && !e.movementY)) return;
    const card = e.target.closest('.card');
    const k = card ? cards.indexOf(card) : -1;
    if (k > -1 && k !== ctl.hovered) {
      ctl.hovered = k;
      ctl.syncOpen();
    }
  });
  cards.forEach((c, k) => {
    c.addEventListener('focusin', () => {
      ctl.hovered = null;
      if (k !== ctl.active) scrollToCard(k); // centra la card enfocada (carrusel) o mueve el pin
      else ctl.syncOpen();
    });
  });
  track.addEventListener('pointerleave', () => { ctl.hovered = null; ctl.syncOpen(); });

  ctl.setActive(0);
  requestAnimationFrame(detectCentered);
  return ctl;
}

/* ==========================================================================
   MOTION
   Regla: si el usuario pide reduced-motion, nada de esto se inicializa.
   ========================================================================== */
const motionOK = () => !media.reducedMotion.matches;
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
  const cards = $$('.card', track);
  const n = cards.length;
  if (n < 2) return;

  const setup = () => {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(PIN_QUERY, () => {
      section.classList.add('is-pinned');
      viewport.scrollLeft = 0;
      ctl.pinned = true;

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
      const xFor = (i) => {
        const vw = viewport.clientWidth;
        const total = padL + padR + wide + (n - 1) * (narrow + gap);
        const center = padL + i * (narrow + gap) + wide / 2;
        return Math.max(Math.min(vw / 2 - center, 0), Math.min(vw - total, 0));
      };
      const moveTo = (i, instant) =>
        gsap.to(track, { x: xFor(i), duration: instant ? 0 : 0.7, ease: 'expo.out', overwrite: true });

      measure();
      const st = ScrollTrigger.create({
        trigger: pinEl,
        pin: true,
        start: 'top top',
        end: () => '+=' + Math.round((n - 1) * innerHeight * 0.55),
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power2.out' },
        onRefresh: () => { measure(); moveTo(ctl.active, true); },
        onUpdate: (self) => {
          const i = Math.round(self.progress * (n - 1));
          if (i !== ctl.active) { ctl.setActive(i); moveTo(i); }
        },
      });

      // Flechas y foco con teclado: navegan moviendo el scroll vertical
      ctl.goTo = (i) => {
        i = Math.max(0, Math.min(n - 1, i));
        const y = st.start + (st.end - st.start) * (i / (n - 1));
        scrollTo({ top: y, behavior: 'smooth' });
      };
      moveTo(ctl.active, true);

      return () => {
        section.classList.remove('is-pinned');
        ctl.pinned = false;
        ctl.goTo = null;
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
const projectCards = renderProjects();
const projectsCtl = initProjects(projectCards);
initNav();
initYear();
initProgressFallback();
initRevealFallback();
initCollageParallax();
initMagnetic();
initCursor();
initProjectsPin(projectsCtl);
