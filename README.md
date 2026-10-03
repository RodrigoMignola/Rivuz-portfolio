# Portfolio · Diseños creados en RIVUZ

Portfolio personal de Web Designer. Una sola página, mobile-first, sin build:
HTML + CSS + JavaScript vanilla. GSAP + ScrollTrigger (desde cdnjs) se cargan **solo en desktop**
para la sección de proyectos con pin.

El sistema visual sale de [`DESIGN.md`](DESIGN.md) (Portrait). Todos sus tokens están como
variables CSS al principio de `css/styles.css`.

```
index.html          Estructura y textos (nav, hero, proyectos, contacto, footer)
css/styles.css      Tokens del design system → base → componentes → motion
js/main.js          Array `projects`, render de cards, nav, cursor, animaciones, pin
assets/             Favicon, OG image e imágenes de proyectos (WebP)
netlify.toml        Publicación desde la raíz, sin build command
DESIGN.md           Design system de referencia
```

## Pendientes (TODO)

Buscá `TODO` en el proyecto (`grep -rn TODO index.html js css`). Falta completar:

- [ ] **Open Graph**: cuando tengas la URL de Netlify, poné rutas absolutas en `og:image`
      (ej. `https://tu-sitio.netlify.app/assets/og-image.png`) y agregá `og:url`.

## Cómo editar los proyectos

Todo vive en el array `projects`, al principio de `js/main.js`. Las cards, el filtro y el collage
del hero se generan solos, así que no hace falta tocar el HTML.

```js
{
  title: 'La Alameda',                     // título visible
  type: 'sitio',                           // 'sitio' | 'behance' | 'galeria'
  status: 'terminado',                     // 'desarrollo' | 'terminado' | 'redesign' (filtro)
  url: 'https://www.laalameda.com.ar/',    // sitio / behance: se abre en una pestaña nueva
  image: 'assets/projects/la-alameda.webp',// miniatura WebP
  alt: 'Home de La Alameda con …',
  // hero: false,                          // opcional: no usarla en el collage del hero
},
```

| `type` | Pastilla | Al hacer clic |
|---|---|---|
| `sitio` | Sitio web | Abre `url` en una pestaña nueva |
| `behance` | Behance | Abre el caso en Behance en una pestaña nueva |
| `galeria` | Galería | Abre una galería modal con las imágenes de `gallery` (para proyectos no públicos, ej. Basalto) |

El color de la pastilla depende del estado: mint = terminado, peach = en desarrollo, sky = redesign.

Proyecto tipo galería:

```js
{
  title: 'Basalto', type: 'galeria', status: 'terminado',
  image: 'assets/projects/basalto.webp', alt: '…',
  gallery: [
    { src: 'assets/projects/basalto/basalto-01.webp', alt: 'Home de Basalto' },
    { src: 'assets/projects/basalto/basalto-02.webp', alt: 'Ficha de producto' },
  ],
},
```

La galería se navega con swipe, con las flechas en pantalla o con el teclado (← →), y se cierra
con Esc, con la X o haciendo clic afuera.

### Filtro

Los botones salen del array `filters` en `js/main.js`. Cada `id` filtra por el `status` de los
proyectos (`all` muestra todos). Los contadores se calculan solos, y si un filtro queda sin proyectos
no se muestra.

```js
const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'desarrollo', label: 'En desarrollo' },
  { id: 'terminado', label: 'Terminados' },
  { id: 'redesign', label: 'ReDesign' },
];
```

### Imágenes

- Formato **WebP**, idealmente **1200 × 1000 px** (las cards recortan con `object-fit: cover`,
  conviene que lo importante quede centrado). En la galería se muestran completas.
- Peso recomendado: menos de 150 KB cada una.
- Para convertir: [squoosh.app](https://squoosh.app) o, por terminal,
  `cwebp -q 80 original.png -o assets/projects/nombre.webp`.

## Desarrollo local

No hay dependencias. Desde la raíz del repo:

```bash
python3 -m http.server 8080
# o
npx serve .
```

Y abrí `http://localhost:8080`. Conviene usar un servidor y no abrir el archivo directo, para que las
rutas y las fuentes se comporten igual que en producción.

## Deploy en Netlify

1. Subí el repo a GitHub.
2. En Netlify: **Add new site → Import an existing project** y elegí el repo.
3. Configuración (ya está en `netlify.toml`):
   - **Build command**: vacío
   - **Publish directory**: `.` (raíz)
4. Deploy. Cada push a la rama principal publica automáticamente.

Alternativa sin Git: arrastrá la carpeta del proyecto a <https://app.netlify.com/drop>.

## Comportamiento por dispositivo

| | Mobile / tablet | Desktop (puntero fino, ≥ 1024px) |
|---|---|---|
| Proyectos | Carrusel nativo con scroll-snap, la card centrada se destaca | Sección con pin: el scroll vertical avanza las cards y abre la activa; con el mouse, la card se expande y el carril se corre para mostrarla (se llega a todas). Con un solo proyecto filtrado no hay pin |
| Filtro | Las cards salen y entran escalonadas | Igual, y el pin se recalcula según la cantidad de cards |
| Intro | Cortina azul con la "R." que sube (solo primera visita de la sesión) | Igual |
| Hero | Cards flotando en 3D; al scrollear salen volando hacia los costados y el titular se aleja; brillo que recorre "RIVUZ" | + el collage se inclina con el mouse; hover en una card la endereza y muestra el nombre (clic abre el proyecto) |
| Luz | Recorre la grilla de puntos sola; al tocar sale una onda de luz | Sigue al mouse (si queda quieto, vuelve al recorrido automático) |
| Cursor | Nativo | Nativo + una burbuja "Ver" que aparece solo sobre las cards |
| Botones | `:active` | Magnéticos (suaves, máx. 6px) |
| Fondo | Grilla de puntos + 3 luces en triada (azul, rosa, lima) que derivan lento | Igual |

**Accesibilidad y fallbacks**

- Con `prefers-reduced-motion: reduce` no se carga GSAP, no hay intro, pin, parallax, luz, burbuja ni fondo animado, y todo
  queda visible en su estado final.
- Sin JavaScript, el hero y el contacto funcionan; las cards de proyectos necesitan JS
  porque se generan desde el array.
- La entrada del hero, el parallax de scroll, el revelado y la barra de progreso son CSS
  (`animation-timeline`), con fallback en JS para navegadores sin soporte.
- Se anima solo `transform` y `opacity`. La única excepción es el ancho de las cards en el
  acordeón de desktop: la imagen tiene ancho fijo y solo se recorta.

## Design system

- Canvas blanco con una grilla de puntos tenue y tres luces muy suaves en triada armónica
  (azul 221°, rosa 341°, lima 101°; tokens `--glow-hue-*`); texto Portrait Ink
  `#08304c`; color en lavados pastel (mint, sky, peach) en las pastillas.
- **Gradiente de marca azul/celeste** (`--gradient-brand`, reemplaza al arcoíris de DESIGN.md):
  solo en **un CTA por vista** y en **una palabra en cursiva por titular**. El favicon es `assets/favicon-rivuz.png`.
- Radios: cards 24px, botones 28px, tags 9999px. Sombras de varias capas, máximo 8% de opacidad.
- Tipografías: Plus Jakarta Sans (sustituta de Basier Circle) para titulares de 31px o más, con
  tracking negativo, y Switzer para UI y cuerpo.
