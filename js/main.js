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
};

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

/* Init ------------------------------------------------------------------- */
renderCollage();
initNav();
