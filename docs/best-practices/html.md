# HTML — Serpientes y Escaleras

## Estructura y nomenclatura
- `index.html` único; un `<main>`, un `<h1>` y headings sin saltos; `lang="es"`, charset, viewport y `<title>` propio.
- IDs y clases en kebab-case; `js-` solo para hooks de JS; estado en `data-*`; nunca usar clases de estilo como estado.
- Archivos `css/styles.css` y `js/main.js`; JS con `defer`; sin `<style>`, `<script>` inline ni `onclick=""`.
- Tablero: `<div class="board-shell"><ol id="board" class="js-board" aria-label="Tablero de 100 casillas"></ol></div>` vacío; JS crea una vez 100 `<li data-cell="1..100">` con `createElement`.
- Salida: `<div class="board__start" aria-label="Salida, posición inicial">` con texto visible «Salida»; las fichas se crean una vez y se colocan ahí en posición 0.
- Controles nativos `<button>` para tirar y reiniciar; nunca `<div onclick>` ni `<span role="button">`.

## Fases (`data-phase` en `<body>`)
- `idle`: inicio y espera de turno; tablero visible y «Tirar dado» habilitado.
- `rolling`: dado girando ≤600 ms; botón con `aria-disabled="true"`.
- `moving`: ficha animándose ≤600 ms; botón con `aria-disabled="true"`.
- `won`: ganador anunciado; foco en «Jugar otra vez»; el reinicio vuelve a `idle`.

## Estado en HTML
- Solo `idle`, `rolling`, `moving` y `won`; estado inicial `idle`; transiciones `idle→rolling→moving→idle|won` y `won→idle`.
- Sin `menu`, sin selección de escenario y sin `data-theme`; la paleta fija vive en CSS.
- `data-player="1|2"` en el jugador activo; cada ficha usa `data-token` y `aria-label` con su posición o «Salida».

## Accesibilidad
- `aria-live="polite"` en un único contenedor de anuncios: dado, movimiento, serpiente/escalera y ganador.
- `aria-label` en botones solo-icono, en `board__start` y en casillas especiales: «Casilla 7, serpiente a 3».
- Orden DOM = orden visual; foco visible; sin `tabindex` positivo; no robar foco salvo al ganar.
- No anunciar cada frame del dado; solo el resultado final al entrar en `moving`.

## Separación de responsabilidades
- HTML declara estructura y estado inicial; JS crea casillas/fichas una vez, alterna atributos/clases y crea anuncios.
- Sin cálculos, textos de juego ni lógica de turnos dentro del HTML.

## Evitar
- Div-soup, IDs duplicados, tablas para layout, formularios sin `<label>`, `style=""`, `onclick=""` e `innerHTML`.

## Verificación
- [comando] `(Select-String index.html -Pattern '<h1').Count -eq 1`; `Select-String index.html -Pattern 'onclick=|style=|<script(?![^>]*\bsrc=)'` sin coincidencias.
- [comando] `Select-String index.html -Pattern '<li data-cell='` devuelve 0; el tablero se genera con `createElement` en `js/`.
- [ojo] Recorrer con Tab: foco visible, orden lógico y anuncios correctos en las 4 fases.
- [ojo] Verificar en el inspector 100 casillas generadas, salida visible «Salida» y nombres accesibles.
- [ojo] Confirmar que no existen `menu`, `data-theme` ni botones de selección de escenario.
