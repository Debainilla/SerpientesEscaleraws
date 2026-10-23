import { BOARD_SIZE, DICE_MAX } from "./game.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const GRID_SIZE = 10;
const DIGIT_SEGMENTS = Object.freeze({
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
});

function getCellGeometry(cell) {
  const zeroBasedIndex = cell - 1;
  const zeroBasedRow = Math.floor(zeroBasedIndex / GRID_SIZE);
  const rawColumn = zeroBasedIndex % GRID_SIZE;
  const column = zeroBasedRow % 2 === 0 ? rawColumn : GRID_SIZE - 1 - rawColumn;

  return {
    row: GRID_SIZE - zeroBasedRow,
    column: column + 1,
    x: column + 0.5,
    y: GRID_SIZE - zeroBasedRow - 0.5,
  };
}

function createSvgElement(name) {
  return document.createElementNS(SVG_NS, name);
}

function formatCoordinate(value) {
  return value.toFixed(2);
}

function createSnake(source, target) {
  const start = getCellGeometry(source);
  const end = getCellGeometry(target);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const bendX = -dy * 0.22;
  const bendY = dx * 0.22;

  const path = createSvgElement("path");
  path.setAttribute("class", "board__snake");
  path.setAttribute(
    "d",
    [
      `M ${formatCoordinate(start.x)} ${formatCoordinate(start.y)}`,
      `C ${formatCoordinate(start.x + dx * 0.3 + bendX)} ${formatCoordinate(start.y + dy * 0.3 + bendY)}`,
      `${formatCoordinate(start.x + dx * 0.7 - bendX)} ${formatCoordinate(start.y + dy * 0.7 - bendY)}`,
      `${formatCoordinate(end.x)} ${formatCoordinate(end.y)}`,
    ].join(" "),
  );

  const head = createSvgElement("circle");
  head.setAttribute("class", "board__snake-head");
  head.setAttribute("cx", formatCoordinate(start.x));
  head.setAttribute("cy", formatCoordinate(start.y));
  head.setAttribute("r", "0.22");

  return [path, head];
}

function createLadder(source, target) {
  const start = getCellGeometry(source);
  const end = getCellGeometry(target);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const offsetX = -Math.sin(angle) * 0.14;
  const offsetY = Math.cos(angle) * 0.14;
  const rungCount = Math.max(3, Math.round(distance * 1.4));
  const elements = [];

  const leftRail = createSvgElement("line");
  leftRail.setAttribute("class", "board__ladder-rail");
  leftRail.setAttribute("x1", formatCoordinate(start.x + offsetX));
  leftRail.setAttribute("y1", formatCoordinate(start.y + offsetY));
  leftRail.setAttribute("x2", formatCoordinate(end.x + offsetX));
  leftRail.setAttribute("y2", formatCoordinate(end.y + offsetY));
  elements.push(leftRail);

  const rightRail = createSvgElement("line");
  rightRail.setAttribute("class", "board__ladder-rail");
  rightRail.setAttribute("x1", formatCoordinate(start.x - offsetX));
  rightRail.setAttribute("y1", formatCoordinate(start.y - offsetY));
  rightRail.setAttribute("x2", formatCoordinate(end.x - offsetX));
  rightRail.setAttribute("y2", formatCoordinate(end.y - offsetY));
  elements.push(rightRail);

  for (let index = 1; index < rungCount; index += 1) {
    const ratio = index / rungCount;
    const x = start.x + dx * ratio;
    const y = start.y + dy * ratio;
    const rung = createSvgElement("line");
    rung.setAttribute("class", "board__ladder-rung");
    rung.setAttribute("x1", formatCoordinate(x + offsetX));
    rung.setAttribute("y1", formatCoordinate(y + offsetY));
    rung.setAttribute("x2", formatCoordinate(x - offsetX));
    rung.setAttribute("y2", formatCoordinate(y - offsetY));
    elements.push(rung);
  }

  return elements;
}

export function createInterface(boardData) {
  const dom = {
    board: document.querySelector(".js-board"),
    boardShell: document.querySelector(".board-shell"),
    die: document.querySelector(".js-die"),
    counter: document.querySelector(".js-counter"),
    counterDigits: [...document.querySelectorAll(".js-counter-digit")],
    rollButton: document.querySelector(".js-roll"),
    resetButton: document.querySelector(".js-reset"),
    turnStatus: document.querySelector(".js-turn-status"),
    announcer: document.querySelector(".js-announcer"),
    playerCards: [...document.querySelectorAll(".js-player")],
    playerPositions: [...document.querySelectorAll(".js-player-position")],
  };

  if (
    !dom.board ||
    !dom.boardShell ||
    !dom.die ||
    !dom.counter ||
    dom.counterDigits.length !== 2 ||
    !dom.rollButton ||
    !dom.resetButton ||
    !dom.turnStatus ||
    !dom.announcer
  ) {
    throw new Error("No se encontraron los elementos principales de la interfaz.");
  }

  const boardFragment = document.createDocumentFragment();

  for (let cellNumber = 1; cellNumber <= BOARD_SIZE; cellNumber += 1) {
    const geometry = getCellGeometry(cellNumber);
    const cell = document.createElement("li");
    const number = document.createElement("span");
    const snakeTarget = boardData.snakes[cellNumber];
    const ladderTarget = boardData.ladders[cellNumber];
    let accessibleLabel = `Casilla ${cellNumber}`;

    cell.className = "board__cell";
    cell.dataset.cell = String(cellNumber);
    cell.dataset.row = String(geometry.row);
    cell.dataset.col = String(geometry.column);

    if (snakeTarget !== undefined) {
      cell.dataset.effect = "snake";
      accessibleLabel += `, serpiente a ${snakeTarget}`;
    } else if (ladderTarget !== undefined) {
      cell.dataset.effect = "ladder";
      accessibleLabel += `, escalera a ${ladderTarget}`;
    }

    if (cellNumber === BOARD_SIZE) {
      accessibleLabel += ", meta";
    }

    cell.setAttribute("aria-label", accessibleLabel);

    number.className = "board__number";
    number.textContent = String(cellNumber);
    number.setAttribute("aria-hidden", "true");

    cell.append(number);
    boardFragment.append(cell);
  }

  dom.board.append(boardFragment);

  const svg = createSvgElement("svg");
  svg.setAttribute("class", "board__paths");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  Object.entries(boardData.snakes).forEach(([source, target]) => {
    createSnake(source, target).forEach((element) => {
      svg.append(element);
    });
  });

  Object.entries(boardData.ladders).forEach(([source, target]) => {
    createLadder(source, target).forEach((element) => {
      svg.append(element);
    });
  });

  dom.boardShell.append(svg);

  const tokens = [1, 2].map((playerNumber) => {
    const token = document.createElement("span");
    token.className = `token token--p${playerNumber}`;
    token.dataset.token = String(playerNumber);
    token.setAttribute("role", "img");
    token.setAttribute("aria-label", `Ficha del Jugador ${playerNumber} en Salida`);
    token.textContent = String(playerNumber);
    getCell(1).append(token);
    return token;
  });

  let activeCell = null;

  function getCell(position) {
    return dom.board.querySelector(`[data-cell="${position}"]`);
  }

  function getActivePlayer(state) {
    return state.phase === "won" ? state.winner : state.turn + 1;
  }

  function render(state) {
    const activePlayer = getActivePlayer(state);

    document.body.dataset.phase = state.phase;
    document.body.dataset.player = String(state.turn + 1);

    const counterValue = state.dice === null ? "00" : String(state.dice).padStart(2, "0");

    dom.counter.classList.toggle("is-rolling", state.phase === "rolling");
    dom.die.dataset.value = String(state.dice === null ? 0 : state.dice);
    dom.die.classList.toggle("is-rolling", state.phase === "rolling");

    dom.counterDigits.forEach((digitElement, index) => {
      const digit = counterValue[index];
      const activeSegments = DIGIT_SEGMENTS[digit];

      digitElement.dataset.digit = digit;
      digitElement.querySelectorAll(".counter__segment").forEach((segment) => {
        segment.classList.toggle(
          "is-on",
          activeSegments.includes(segment.dataset.segment),
        );
      });
    });

    const canRoll = state.phase === "idle";

    dom.rollButton.disabled = !canRoll;
    dom.rollButton.setAttribute("aria-disabled", String(!canRoll));
    dom.resetButton.textContent =
      state.phase === "won" ? "Jugar otra vez" : "Reiniciar";

    dom.turnStatus.textContent =
      state.phase === "won"
        ? `Ganó el Jugador ${state.winner}`
        : `Turno del Jugador ${state.turn + 1}`;

    if (activeCell) {
      activeCell.classList.remove("board__cell--active");
      activeCell = null;
    }

    dom.playerCards.forEach((card, index) => {
      const playerNumber = index + 1;
      const isActive = activePlayer === playerNumber;
      const position = state.positions[index];

      card.setAttribute("aria-current", isActive ? "true" : "false");
      dom.playerPositions[index].textContent =
        position === 0 ? "Salida" : `Casilla ${position}`;
    });

    tokens.forEach((token, index) => {
      const playerNumber = index + 1;
      const position = state.positions[index];
      const target = getCell(position === 0 ? 1 : position);

      if (target && token.parentElement !== target) {
        target.append(token);
      }

      token.classList.toggle(
        "is-moving",
        state.phase === "moving" && state.turn === index,
      );
      token.setAttribute(
        "aria-label",
        position === 0
          ? `Ficha del Jugador ${playerNumber} en Salida`
          : `Ficha del Jugador ${playerNumber} en la casilla ${position}`,
      );
    });

    if (activePlayer !== null) {
      const activePosition = state.positions[activePlayer - 1];

      if (activePosition > 0) {
        activeCell = getCell(activePosition);

        if (activeCell) {
          activeCell.classList.add("board__cell--active");
        }
      }
    }
  }

  function setDiceValue(value) {
    if (!Number.isInteger(value) || value < 0 || value > DICE_MAX) {
      return;
    }

    dom.die.dataset.value = String(value);
  }

  function announce(message) {
    dom.announcer.textContent = message;
  }

  function focusReset() {
    dom.resetButton.focus();
  }

  return {
    render,
    setDiceValue,
    announce,
    focusReset,
    rollButton: dom.rollButton,
    resetButton: dom.resetButton,
  };
}
