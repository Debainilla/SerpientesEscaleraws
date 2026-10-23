import { BOARD_DATA } from "./board-data.js";
import { BOARD_SIZE, DICE_MAX, checkWin, resolveMove, rollDice } from "./game.js";
import { applyAction, createInitialState } from "./state.js";
import { createInterface } from "./ui.js";

const TIMINGS = Object.freeze({
  dice: 500,
  token: 600,
});

const DICE_VALUES = [1, 2, 3, 4, 5, 6];

const ui = createInterface(BOARD_DATA);
let state = createInitialState();
let diceTimer = null;
let moveTimer = null;

function dispatch(action) {
  state = applyAction(state, action);
  ui.render(state);
}

function clearTimers() {
  window.clearTimeout(diceTimer);
  window.clearTimeout(moveTimer);
  diceTimer = null;
  moveTimer = null;
}

function describeMove(playerNumber, startPosition, dice, result) {
  if (!result.moved) {
    const remaining = BOARD_SIZE - startPosition;
    return `Jugador ${playerNumber} saca ${dice}. Necesita ${remaining} para llegar a ${BOARD_SIZE} y no se mueve.`;
  }

  let message = `Jugador ${playerNumber} saca ${dice} y llega a la casilla ${result.landing}.`;

  if (result.effect?.type === "snake") {
    message += ` Una serpiente lo baja a la casilla ${result.position}.`;
  } else if (result.effect?.type === "ladder") {
    message += ` Una escalera lo sube a la casilla ${result.position}.`;
  }

  return message;
}

function handleRoll() {
  if (state.phase !== "idle") {
    return;
  }

  const playerNumber = state.turn + 1;
  const startPosition = state.positions[state.turn];

  dispatch({ type: "ROLL" });

  let frame = 0;
  const interval = window.setInterval(() => {
    const preview = DICE_VALUES[frame % DICE_VALUES.length];
    ui.setDiceValue?.(preview);
    frame += 1;
  }, 250);

  diceTimer = window.setTimeout(() => {
    window.clearInterval(interval);
    diceTimer = null;

    const dice = rollDice();
    ui.setDiceValue?.(dice);
    const result = resolveMove(startPosition, dice, BOARD_DATA);

    dispatch({
      type: "MOVE",
      dice,
      position: result.position,
    });
    ui.announce(describeMove(playerNumber, startPosition, dice, result));

    moveTimer = window.setTimeout(() => {
      moveTimer = null;

      const hasWon = checkWin(state);

      dispatch({ type: "END_TURN", winner: hasWon });

      if (hasWon) {
        ui.announce(
          `Ganó el Jugador ${state.winner}. Pulsa Jugar otra vez para comenzar de nuevo.`,
        );
        ui.focusReset();
      } else {
        ui.announce(`Turno del Jugador ${state.turn + 1}.`);
      }
    }, TIMINGS.token);
  }, TIMINGS.dice);
}

function handleReset() {
  clearTimers();
  dispatch({ type: "RESET" });
  ui.announce("Juego reiniciado. Turno del Jugador 1.");
}

ui.rollButton.addEventListener("click", handleRoll);
ui.resetButton.addEventListener("click", handleReset);
window.addEventListener("pagehide", clearTimers);

ui.render(state);
ui.announce("Turno del Jugador 1. Pulsa Tirar dado.");
