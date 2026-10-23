# AGENTS.md

## Objetivo del proyecto

Serpientes y Escaleras es un juego web sin frameworks ni bundler, implementado con HTML, CSS y JavaScript vanilla. La versión actual usa un tablero de 10×10 (100 casillas) y un único escenario con sus propias serpientes, escaleras y colores fijos. Los escenarios adicionales se agregarán después.

Las fases actuales son `idle`, `rolling`, `moving` y `won`; no hay menú ni selección de escenario. La implementación debe mantener HTML semántico, CSS temático y JavaScript modular, siguiendo las guías de `docs/best-practices/`.

## Estructura actual

```text
SerpientesEscaleraws/
├─ AGENTS.md
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ main.js
│  ├─ board-data.js
│  ├─ state.js
│  ├─ game.js
│  └─ ui.js
└─ docs/
   ├─ design.md
   └─ best-practices/
      ├─ html.md
      ├─ css.md
      └─ js.md
```

`docs/design.md` describe el diseño; la implementación vive en `index.html`, `css/styles.css` y `js/`.

## Lectura obligatoria antes de escribir o modificar código

**SIEMPRE**, antes de escribir o modificar cualquier archivo de código, debes leer completos estos documentos, desde la raíz del proyecto:

1. `docs/best-practices/html.md`
2. `docs/best-practices/css.md`
3. `docs/best-practices/js.md`

No empieces a editar hasta haber leído los tres. Si una instrucción contradice estas guías, pregunta antes de aplicar el cambio.
