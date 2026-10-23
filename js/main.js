import { BOARD_SIZE, checkWin, resolveMove, rollDice } from "./game.js";
import { getScenario, validateScenarios } from "./scenarios.js";
import { applyAction, createInitialState } from "./state.js";
import { createInterface } from "./ui.js";

const TIMINGS = Object.freeze({
  dice: 500,
  diceFace: 100,
  token: 600,
});

const DICE_VALUES = [1, 2, 3, 4, 5, 6];

validateScenarios();

let currentScenario = getScenario("selva");
const ui = createInterface(currentScenario.boardData);
let state = createInitialState();
let diceTimer = null;
let moveTimer = null;
let diceFaceTimer = null;

function dispatch(action) {
  state = applyAction(state, action);
  ui.render(state);
}

function clearDiceTumble() {
  window.clearInterval(diceFaceTimer);
  diceFaceTimer = null;
}

function clearTimers() {
  window.clearTimeout(diceTimer);
  window.clearTimeout(moveTimer);
  clearDiceTumble();
  diceTimer = null;
  moveTimer = null;
}

function startDiceTumble() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let frame = 0;

  diceFaceTimer = window.setInterval(() => {
    const preview = DICE_VALUES[frame % DICE_VALUES.length];
    ui.setDiceValue(preview);
    frame += 1;
  }, TIMINGS.diceFace);
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
  startDiceTumble();

  diceTimer = window.setTimeout(() => {
    clearDiceTumble();
    diceTimer = null;

    const dice = rollDice();
    ui.setDiceValue(dice);
    const result = resolveMove(startPosition, dice, currentScenario.boardData);

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

function handleScenarioSelect(event) {
  const button = event.target.closest(".js-scenario-select");

  if (!button || !ui.scenarioActions.contains(button)) {
    return;
  }

  const scenarioId = button.dataset.scenario;

  clearTimers();
  currentScenario = getScenario(scenarioId);
  state = createInitialState();
  ui.setScenario(currentScenario);
  ui.render(state);
  ui.showGame();
  ui.focusRoll();
  ui.announce(
    `Escenario ${currentScenario.name}. Turno del Jugador 1. Pulsa Tirar dado.`,
  );
}

function handleChangeScenario() {
  clearTimers();
  state = createInitialState();
  ui.showMenu();
  ui.focusMenu();
  ui.announce("Elige un escenario para comenzar.");
}

ui.rollButton.addEventListener("click", handleRoll);
ui.resetButton.addEventListener("click", handleReset);
ui.changeScenarioButton.addEventListener("click", handleChangeScenario);
ui.scenarioActions.addEventListener("click", handleScenarioSelect);
window.addEventListener("pagehide", clearTimers);

ui.showMenu();
ui.announce("Elige un escenario para comenzar.");
