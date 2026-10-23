import { BOARD_SIZE, DICE_MAX, DICE_MIN } from "./game.js";

export function createInitialState() {
  return {
    phase: "idle",
    turn: 0,
    dice: null,
    positions: [0, 0],
    winner: null,
  };
}

export function applyAction(state, action) {
  if (!action || typeof action.type !== "string") {
    return state;
  }

  switch (action.type) {
    case "ROLL": {
      if (state.phase !== "idle") {
        return state;
      }

      return {
        ...state,
        phase: "rolling",
        dice: null,
      };
    }

    case "MOVE": {
      if (state.phase !== "rolling") {
        return state;
      }

      const isValidDice =
        Number.isInteger(action.dice) &&
        action.dice >= DICE_MIN &&
        action.dice <= DICE_MAX;
      const isValidPosition =
        Number.isInteger(action.position) &&
        action.position >= 0 &&
        action.position <= BOARD_SIZE;

      if (!isValidDice || !isValidPosition) {
        return state;
      }

      const positions = [...state.positions];
      positions[state.turn] = action.position;

      return {
        ...state,
        phase: "moving",
        dice: action.dice,
        positions,
      };
    }

    case "END_TURN": {
      if (state.phase !== "moving") {
        return state;
      }

      if (action.winner === true) {
        return {
          ...state,
          phase: "won",
          winner: state.turn + 1,
        };
      }

      return {
        ...state,
        phase: "idle",
        turn: state.turn === 0 ? 1 : 0,
        winner: null,
      };
    }

    case "RESET": {
      return createInitialState();
    }

    default:
      return state;
  }
}
