# Diseño — Serpientes y Escaleras
## Alcance y reglas
- Un escenario fijo, 2 jugadores alternos; sin menú, selección ni temas. Inicio en `idle`, Jugador 1; posición 0 en `board__start` («Salida» + `aria-label`), fuera de las 100 casillas.
- Dado 1–6 con RNG inyectable; si `posición + dado > 100` no mueve; gana solo al llegar exacto a 100.
- Serpiente/escalera se aplica una vez al aterrizar, sin encadenar; sacar 6 no da turno extra y el turno siempre pasa salvo victoria.
## Mapa único
| Serpientes | Escaleras |
|---|---|
| 17→7, 54→34, 62→19, 87→24, 93→73, 99→78 | 3→22, 8→30, 28→84, 51→67, 72→91, 80→97 |
Sin solapamientos: cabezas {17,54,62,87,93,99} y bases {3,8,28,51,72,80} son disjuntas; destinos 1–100; serpientes bajan y escaleras suben.
## Tablero
- `index.html`: `<div class="board-shell"><ol id="board" aria-label="Tablero de 100 casillas"></ol></div>`; las 100 casillas de la cuadrícula 10×10 se crean una vez con `createElement` en `DocumentFragment` y un `append`.
- Zigzag: `row=floor((n-1)/10)`, `col=(n-1)%10`; si `row` es impar, `col=9-col`; `data-row=10-row`, `data-col=col+1`; CSS mapea `grid-row`/`grid-column`. Casilla 1 abajo-izquierda, 100 arriba-izquierda.
## Dibujo y fichas
- SVG en `board-shell` con `viewBox="0 0 10 10"`, `preserveAspectRatio="xMidYMid meet"`, `aria-hidden`, `createElementNS` y `vector-effect:non-scaling-stroke`.
- Serpientes: `path` curvo cabeza→cola; escaleras: dos líneas con peldaños; clases CSS con `var(--color-snake)`/`var(--color-ladder)`.
- Fichas: 2 `span` con `data-token`; en 0 van a `board__start`, luego a la celda con `append`; CSS las centra y separa. `is-moving` anima `transform`/`opacity` 600 ms.
- Sin `element.style`, posiciones absolutas ni colores literales; al reiniciar las fichas vuelven a «Salida».
## Estructura
```text
./
├─ AGENTS.md
├─ index.html
├─ css/styles.css
├─ js/{main,board-data,state,game,ui}.js
└─ docs/{design.md,best-practices/}
```
## Módulos
- `board-data.js`: `BOARD_DATA` con 6 pares de cada tipo. `game.js`: reglas puras `rollDice`, `resolveMove`, `checkWin`.
- `state.js`: `createInitialState`/`applyAction` inmutable. `ui.js`: crea tablero/SVG/fichas una vez y `render(state)`. `main.js`: listeners y timers.
## Estados
- Estado: `{ phase:'idle', turn:0, dice:null, positions:[0,0], winner:null }`.
- `idle`: inicio/turno; `rolling`: dado 600 ms; `moving`: ficha 600 ms; `won`: ganador y reinicio a `idle`.
## Duraciones
| Elemento | Duración |
|---|---|
| Dado | 600 ms |
| Ficha | 600 ms |
| UI | 300 ms |
## Ejecución — abrir con servidor local (`python -m http.server 8000` → `http://localhost:8000`); nunca `file://` por los ES modules.
