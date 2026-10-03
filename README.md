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

- [ ] **Proyectos**: título, categoría, link, imagen y alt de cada uno (`js/main.js`).
- [ ] **Imágenes**: reemplazar los placeholders `assets/projects/proyecto-0X.webp`.
- [ ] **Contacto**: email, LinkedIn, Behance y WhatsApp (`index.html`, sección `#contacto`).
- [ ] **Nombre**: en el `<title>` y en el footer (`index.html`).
- [ ] **Open Graph**: cuando tengas la URL de Netlify, poné rutas absolutas en `og:image`
      (ej. `https://tu-sitio.netlify.app/assets/og-image.png`) y agregá `og:url`.

## Cómo editar los proyectos

Todo vive en el array `projects`, al principio de `js/main.js`. Las cards del carrusel y el
collage del hero se generan solas, así que no hace falta tocar el HTML.

```js
{
  title: 'Landing para Marca X',          // título visible
  category: 'Landing page',               // texto de la pastilla
  type: 'sitio',                          // 'imagen' | 'behance' | 'sitio'
  url: 'https://marcax.com',              // se abre en una pestaña nueva
  image: 'assets/projects/marca-x.webp',  // miniatura WebP
  alt: 'Home de Marca X con hero ilustrado y grilla de productos',
  tone: 'mint',                           // color de la pastilla: 'mint' | 'sky' | 'peach'
  // hero: false,                         // opcional: no usarla en el collage del hero
},
```

- **Agregar**: copiá un objeto y cambiá los datos. Se recomiendan entre 6 y 8 proyectos.
- **Reordenar**: mové los objetos dentro del array. El orden es el de las cards.
- **Collage del hero**: usa las primeras 6 imágenes con `hero` distinto de `false`
  (en mobile se ven 4).
- **Proyecto tipo imagen**: si el diseño es una imagen suelta, subí la versión grande a
  `assets/` y usá esa ruta en `url`.

### Imágenes

- Formato **WebP**, idealmente **1200 × 1000 px** (las cards recortan con `object-fit: cover`,
  conviene que lo importante quede centrado).
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
| Proyectos | Carrusel nativo con scroll-snap, la card centrada se destaca | Sección con pin: el scroll vertical avanza las cards y abre la activa; hover expande |
| Hero | Entrada animada + parallax de scroll | + parallax con el mouse |
| Cursor | Nativo | Punto propio que se convierte en una burbuja "Ver" sobre las cards |
| Botones | `:active` | Magnéticos |

**Accesibilidad y fallbacks**

- Con `prefers-reduced-motion: reduce` no se carga GSAP, no hay pin, parallax ni cursor, y todo
  queda visible en su estado final.
- Sin JavaScript, el hero y el contacto funcionan; las cards de proyectos necesitan JS
  porque se generan desde el array.
- La entrada del hero, el parallax de scroll, el revelado y la barra de progreso son CSS
  (`animation-timeline`), con fallback en JS para navegadores sin soporte.
- Se anima solo `transform` y `opacity`. La única excepción es el ancho de las cards en el
  acordeón de desktop: la imagen tiene ancho fijo y solo se recorta.

## Design system

- Canvas blanco, texto Portrait Ink `#08304c`, color solo en lavados pastel (mint, sky, peach).
- Arcoíris solo en **un CTA por vista** y en **una palabra en cursiva por titular**.
- Radios: cards 24px, botones 28px, tags 9999px. Sombras de varias capas, máximo 8% de opacidad.
- Tipografías: Plus Jakarta Sans (sustituta de Basier Circle) para titulares de 31px o más, con
  tracking negativo, y Switzer para UI y cuerpo.
