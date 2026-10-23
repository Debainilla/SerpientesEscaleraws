# CSS — Serpientes y Escaleras
## Estructura y nomenclatura
- `css/styles.css` único y mobile-first; sin `@import`; sin frameworks ni preprocesadores.
- BEM ligero (`.board__cell--active`); estados `is-*` (`.is-hidden`, `.is-rolling`); prohibido estilar por `#id`.
- Componentes usan solo `var(--token)`; ningún `#hex`, `rgb()` o `hsl()` fuera de `:root`.

## Tema fijo y movimiento
- En `:root`: colores fijos (`--color-board`, `--color-p1`, `--color-p2`, `--color-snake`, `--color-ladder`), spacing 4/8/12/16/24/32, radios y tokens `--motion-dice`, `--motion-token`, `--motion-ui`.
- Sin `data-theme`, sin temas alternativos y sin colores en HTML o JS.

| Elemento | Duración |
|---|---|
| Dado | 600 ms |
| Ficha | 600 ms |
| UI | 300 ms |

## Layout y responsive
- Tablero: `display:grid; grid-template-columns:repeat(10,1fr); aspect-ratio:1/1`; 100 casillas sin posición absoluta.
- Salida: `board__start` visible y con texto «Salida»; fichas en posición 0 con grid/flex, sin posición absoluta.
- Tablero con `clamp()`/`--board-size`; tipografía `clamp()`; contenedor `max-width` y padding con tokens.

## Accesibilidad
- `:focus-visible` con outline ≥2 px y contraste ≥3:1; nunca `outline:none` sin sustituto visible.
- Texto ≥4.5:1; controles ≥44×44 px; serpientes/escaleras no se distinguen solo por color.
- `@media (prefers-reduced-motion: reduce)` elimina animaciones y transiciones, sin cambiar el layout.
## SVG, fichas y estado
- SVG superpuesto con `grid-area:1/1/-1/-1`, `aria-hidden` y `pointer-events:none`; trazos con `vector-effect:non-scaling-stroke`.
- Serpientes/escaleras usan `stroke:var(--color-snake)`/`var(--color-ladder)`; sin colores literales ni `element.style`.
- Fichas centradas con grid en su celda, separadas por `[data-token]`; `is-moving` anima `transform`/`opacity` 600 ms.
- JS alterna clases y atributos; CSS no lee estado desde estilos inline.
## Separación y evitar
- CSS no define texto con significado mediante `content`; sin `!important` salvo utilidad documentada; JS solo clases/atributos, nunca `element.style`.
- Floats, anidamiento >3, selectores universales agresivos, magic numbers, `data-theme`, posiciones absolutas y duraciones fuera de tokens.

## Verificación
- [comando] `Select-String css/styles.css -Pattern '!important|@import|outline:\s*none|transition:\s*all|data-theme'` sin coincidencias.
- [comando] `Select-String css/styles.css -Pattern '\d+ms'` devuelve solo 600, 600 y 300, todos en `:root`.
- [comando] `Select-String css/styles.css -Pattern '#[0-9a-fA-F]{3,8}|rgb\(|hsl\('` lista solo líneas de `:root`.
- [ojo] Revisar contraste, foco, salida «Salida» y que las fichas no usen `position:absolute`.
- [ojo] Confirmar que el SVG usa `vector-effect` y que no hay temas ni `data-theme`.
