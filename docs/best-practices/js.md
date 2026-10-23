# JS — Serpientes y Escaleras
## Estructura y nomenclatura
- ES modules: `main.js`, `board-data.js`, `state.js`, `game.js`, `ui.js`; `main.js` es el único punto de entrada.
- `camelCase` para funciones/variables; `UPPER_SNAKE` para constantes; sin variables globales mutables.
- Cada módulo exporta una responsabilidad (datos, estado, reglas, DOM o arranque); sin imports circulares.

## Estado y fases
- Objeto único `state = { phase, turn, dice, positions, winner }`; `applyAction(state, action)` devuelve estado nuevo sin mutar; `createInitialState()` inicia en `idle`.
- `idle`: espera tirada; `rolling`: dado girando; `moving`: ficha moviéndose; `won`: partida terminada.
- Transiciones válidas: `idle→rolling`, `rolling→moving`, `moving→idle|won`, `won→idle`; el resto se ignora.
- El turno siempre pasa tras `moving`; sacar 6 no da tirada extra; solo `won` termina la partida.

## Datos del tablero
- `BOARD_DATA` en `board-data.js`: `{ snakes, ladders }` con 6 pares cada uno; sin DOM.
- Sin solapamientos, destinos 1–100, serpientes bajan, escaleras suben y no hay encadenamientos.

## Lógica pura
- `rollDice(rng = Math.random)` devuelve entero 1–6; sin DOM ni estado global.
- `resolveMove(position, dice, boardData)` parte de 0, no supera 100 y aplica un único efecto al aterrizar.
- `checkWin(state)` solo con posición 100; `BOARD_SIZE=100`, `DICE_MIN=1`, `DICE_MAX=6`.

## DOM y eventos
- `buildBoard()` una sola vez con `createElement`, `DocumentFragment` y 100 `<li>`; `data-cell`, `data-row`, `data-col`; sin `innerHTML`.
- SVG una vez con `createElementNS`, `preserveAspectRatio="xMidYMid meet"`, `aria-hidden`; sin estilos inline.
- Fichas una vez con `data-token`; en 0 van a `board__start` («Salida» + `aria-label`) y luego a la celda con `append`.
- `render(state)` actualiza fichas, dado, fase, clases y ARIA; delegación de eventos en `#board` y listeners únicos.

## Accesibilidad
- Actualizar `aria-live`, `aria-disabled`, `data-phase` y foco en cada transición; no anunciar frames del dado.
## Separación de responsabilidades
- `game.js` no toca DOM; `ui.js` no calcula reglas; `state.js` no lee DOM; `main.js` conecta módulos y timers.
## Evitar
- `var`, `==`, `eval`, `alert`/`confirm`, `innerHTML`, mutar `state`, lógica en handlers y listeners duplicados.

## Verificación
- [comando] `Select-String js -Recurse -Pattern 'innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|alert\(|confirm\('` sin coincidencias.
- [comando] `node --input-type=module -e "import('./js/board-data.js').then(({BOARD_DATA})=>{const s=Object.keys(BOARD_DATA.snakes).length,l=Object.keys(BOARD_DATA.ladders).length;if(s!==6||l!==6)process.exit(1)})"` pasa.
- [comando] `node --input-type=module -e "import('./js/game.js')"` termina sin `ReferenceError: document is not defined`.
- [ojo] Probar `idle→rolling→moving→idle|won`, reinicio, 6 sin turno extra y llegada exacta a 100.
- [ojo] Revisar 100 casillas, salida «Salida», SVG, fichas y anuncios en las 4 fases.
