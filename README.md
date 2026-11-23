# Maracaibo — Premium Cinematic Website (demo privada)

Rediseño cinematográfico de **Maracaibo** (cocina venezolana y fusión caribeña · 1218 John F. Kennedy Blvd, Union City, NJ 07087 · (201) 300-4445).
Demostración privada para presentar al propietario. **No es la web oficial** y no sustituye a [maracaibonj.com](https://www.maracaibonj.com/).

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger + Flip) · Lenis (scroll suave sólo en escritorio) · Fraunces + Manrope (auto-alojadas).

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

Parámetros útiles: `?intro=skip` (entra directo a la web) · `?intro=play` (fuerza la intro).

## Introducción cinematográfica

`src/components/CinematicIntro.tsx` — usa el video auténtico proporcionado (Higgsfield, `spliced.mp4`), re-codificado sin audio:

| Archivo | Uso |
| --- | --- |
| `public/video/intro-1080.{mp4,webm}` | Escritorio / pantallas grandes (≈5.6 MB / 4.5 MB) |
| `public/video/intro-720.{mp4,webm}` | Pantallas pequeñas, `saveData` o redes lentas |
| `public/video/intro-portrait.{mp4,webm}` | Móviles en vertical (recorte central 9:16, ≈1.8 MB) |
| `public/video/intro-poster*.jpg` | Fotograma de respaldo |

Comportamiento: autoplay · muted · playsInline · sin controles · sin bucle · «Skip intro» (y tecla Esc) · se recuerda en `sessionStorage` · respeta `prefers-reduced-motion` (no se reproduce) · si el navegador bloquea el autoplay aparece «Play the film» · si el video falla o la red se atasca, se muestra el póster y continúa la transición. Al llegar a la recepción la escena se oscurece, aparece el logotipo MARACAIBO y una cortina revela la portada con la **fotografía real** de la misma recepción. La intro se identifica en pantalla como «Concept film · AI-rendered».

## Contenido y fuentes

Toda la información visible procede de páginas oficiales de `maracaibonj.com` (o su ficha oficial de OpenTable), verificada el 2026-11-23:

- `src/data/restaurant.ts` — dirección, teléfono, horario (página /contact), enlaces oficiales, textos oficiales y lista `pendingVerification`.
- `src/data/menu.ts` — **menú**: sólo platos confirmados en `maracaibonj.com/items/...`, cada uno con su URL de origen. `price: null` ⇒ la web muestra «See official menu» (nunca se inventa un precio).

### ⚠️ Pendiente de verificar / datos que faltan

La web oficial está protegida por un desafío anti-bots de Cloudflare, por lo que **no se pudo leer el menú completo** desde el entorno de desarrollo. Por eso:

1. **Menú completo** (todas las categorías, descripciones y precios). Las categorías actuales son agrupaciones provisionales.
2. Parrilla Maracaibo, Maracaibo Sampler, parrilladas, pabellón, tequeños, patacones, postres y cócteles — no se publicaron porque no se pudieron verificar nombre/precio.
3. Salones **Turpial / Araguaney** y capacidades — no aparecen en fuentes oficiales accesibles.
4. **Programa VIP** — no se encontró página oficial.
5. **Eventos / música en vivo** — no se encontró calendario; la web enlaza a /events.
6. **Pedidos online** — se enlaza a `/popmenu-order` (sistema oficial). Una copia indexada mostraba «No menus available»: verificar estado real antes de la presentación.
7. **Fotografía**: sólo hay 3 fotos reales (≈800–1280 px). Faltan fotos de alta resolución de platos, bebidas y salones de eventos.

Para completar el menú basta con añadir objetos a `menuItems` en `src/data/menu.ts` (o enviar el menú en PDF/capturas para importarlo).

## Imágenes (`public/images/`)

| Archivo | Origen |
| --- | --- |
| `reception.{avif,webp}`, `reception-640.webp` | Foto real proporcionada (recepción) |
| `dining-room-bar.webp` | Foto real proporcionada (salón y barra), recortado el borde de captura |
| `signature-platter.webp` | Foto real proporcionada (bandeja), recortado el borde de captura |
| `concept-facade.webp`, `concept-vestibule.webp` | Fotogramas del video IA — siempre etiquetados «Concept still · AI-rendered» |
| `og-image.jpg` | Derivada de la foto de recepción |

## Modo demostración

- Sin pagos, carritos, reservas ni pedidos simulados: todos los botones abren los servicios oficiales (Popmenu, OpenTable, páginas oficiales).
- El formulario de eventos privados es **sólo visual**: no envía ni guarda datos y lo indica en pantalla.
- `noindex` (meta + `robots.txt` + cabecera `X-Robots-Tag`) para que la demo no compita con la web oficial en buscadores.
- El mapa de Google sólo se carga al pulsar «Load interactive map».

## Despliegue

Listo para Vercel (`vercel.json`) o Netlify (`netlify.toml`): importar el repositorio, build `npm run build`, salida `dist/`. Para Cloudflare Pages / GitHub Pages / cualquier hosting estático, subir el contenido de `dist/`.

### Para pasar a producción (si el propietario aprueba)

1. Importar el menú completo y fotografías en alta resolución.
2. Conectar el formulario de eventos (correo/CRM del restaurante) o eliminarlo y mantener el enlace oficial.
3. Quitar `noindex` (index.html, `public/robots.txt`, `vercel.json`/`netlify.toml`) y apuntar el dominio.
4. Revisar con el restaurante horarios festivos, programa VIP y salones de eventos.
