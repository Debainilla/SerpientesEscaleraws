export const SCENARIOS = Object.freeze({
  selva: Object.freeze({
    id: "selva",
    name: "Selva",
    description: "Vides, lianas y truenos verdes.",
    themeClass: "theme-selva",
    colors: Object.freeze({
      bg: "#061a12",
      bgDeep: "#04110b",
      board: "#102b1d",
      cell: "#163826",
      cellAlt: "#1a422c",
      cellBorder: "#2f7a52",
      snake: "#7dd87d",
      snakeWash: "rgba(125, 216, 125, 0.16)",
      ladder: "#f5b700",
      ladderWash: "rgba(245, 183, 0, 0.18)",
      p1: "#ff8a5c",
      p1Ink: "#2b0d02",
      p2: "#58e2c2",
      p2Ink: "#03261d",
    }),
    boardData: Object.freeze({
      snakes: Object.freeze({
        17: 7,
        41: 18,
        63: 39,
        76: 52,
        88: 64,
        99: 81,
      }),
      ladders: Object.freeze({
        4: 25,
        9: 36,
        28: 54,
        46: 72,
        58: 83,
        70: 91,
      }),
    }),
  }),
  espacio: Object.freeze({
    id: "espacio",
    name: "Espacio",
    description: "Nebulosas, órbitas y gravedad cero.",
    themeClass: "theme-espacio",
    colors: Object.freeze({
      bg: "#050510",
      bgDeep: "#020208",
      board: "#101022",
      cell: "#16162b",
      cellAlt: "#1d1d3a",
      cellBorder: "#3f3f7a",
      snake: "#ff3fbf",
      snakeWash: "rgba(255, 63, 191, 0.16)",
      ladder: "#4d9bff",
      ladderWash: "rgba(77, 155, 255, 0.18)",
      p1: "#ff7ad9",
      p1Ink: "#2b0a24",
      p2: "#4d9bff",
      p2Ink: "#06122b",
    }),
    boardData: Object.freeze({
      snakes: Object.freeze({
        16: 6,
        43: 21,
        62: 35,
        74: 48,
        86: 59,
        98: 77,
      }),
      ladders: Object.freeze({
        5: 27,
        11: 38,
        29: 56,
        47: 73,
        60: 85,
        71: 92,
      }),
    }),
  }),
  oceano: Object.freeze({
    id: "oceano",
    name: "Océano",
    description: "Corales, corrientes y abismos azules.",
    themeClass: "theme-oceano",
    colors: Object.freeze({
      bg: "#041826",
      bgDeep: "#02121d",
      board: "#0b2436",
      cell: "#11364a",
      cellAlt: "#15425a",
      cellBorder: "#2a7aa3",
      snake: "#4dd0e1",
      snakeWash: "rgba(77, 208, 225, 0.16)",
      ladder: "#ff9f1a",
      ladderWash: "rgba(255, 159, 26, 0.18)",
      p1: "#ff9f1a",
      p1Ink: "#2b1400",
      p2: "#4dd0e1",
      p2Ink: "#02262b",
    }),
    boardData: Object.freeze({
      snakes: Object.freeze({
        18: 8,
        42: 19,
        61: 37,
        77: 53,
        89: 66,
        97: 75,
      }),
      ladders: Object.freeze({
        6: 26,
        10: 34,
        27: 55,
        45: 69,
        57: 84,
        72: 91,
      }),
    }),
  }),
});

export function getScenario(id) {
  return SCENARIOS[id] ?? SCENARIOS.selva;
}

export function validateScenarios() {
  const entries = Object.values(SCENARIOS);

  for (const scenario of entries) {
    const { snakes, ladders } = scenario.boardData;
    const snakeEntries = Object.entries(snakes);
    const ladderEntries = Object.entries(ladders);

    if (snakeEntries.length !== 6 || ladderEntries.length !== 6) {
      throw new Error(`Escenario ${scenario.id} debe tener 6 serpientes y 6 escaleras.`);
    }

    const snakeStarts = new Set();
    const ladderStarts = new Set();

    for (const [start, end] of snakeEntries) {
      const s = Number(start);
      const e = Number(end);

      if (s === 1 || s === 100 || e === 1 || e === 100) {
        throw new Error(`Serpiente inválida en ${scenario.id}: no puede iniciar/terminar en 1 o 100.`);
      }
      if (e >= s) {
        throw new Error(`Serpiente debe bajar en ${scenario.id}.`);
      }
      if (snakeStarts.has(s) || ladderStarts.has(s)) {
        throw new Error(`Inicio duplicado en ${scenario.id}.`);
      }

      snakeStarts.add(s);
    }

    for (const [start, end] of ladderEntries) {
      const s = Number(start);
      const e = Number(end);

      if (s === 1 || s === 100 || e === 1 || e === 100) {
        throw new Error(`Escalera inválida en ${scenario.id}: no puede iniciar/terminar en 1 o 100.`);
      }
      if (e <= s) {
        throw new Error(`Escalera debe subir en ${scenario.id}.`);
      }
      if (ladderStarts.has(s) || snakeStarts.has(s)) {
        throw new Error(`Inicio duplicado en ${scenario.id}.`);
      }

      ladderStarts.add(s);
    }

    for (const [start, end] of snakeEntries) {
      const e = Number(end);
      if (snakeStarts.has(e) || ladderStarts.has(e)) {
        throw new Error(`No debe haber cadena en ${scenario.id}.`);
      }
    }

    for (const [start, end] of ladderEntries) {
      const e = Number(end);
      if (snakeStarts.has(e) || ladderStarts.has(e)) {
        throw new Error(`No debe haber cadena en ${scenario.id}.`);
      }
    }
  }
}
