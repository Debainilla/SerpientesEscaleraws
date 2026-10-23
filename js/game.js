export const BOARD_SIZE = 100;
export const DICE_MIN = 1;
export const DICE_MAX = 6;

export function rollDice(rng = Math.random) {
  const value =
    Math.floor(Number(rng()) * (DICE_MAX - DICE_MIN + 1)) + DICE_MIN;

  if (!Number.isFinite(value)) {
    return DICE_MIN;
  }

  return Math.min(DICE_MAX, Math.max(DICE_MIN, value));
}

export function resolveMove(position, dice, boardData) {
  const target = position + dice;

  if (target > BOARD_SIZE) {
    return {
      moved: false,
      position,
      landing: null,
      effect: null,
    };
  }

  const snakes = boardData.snakes;
  const ladders = boardData.ladders;
  let destination = target;
  let effect = null;

  if (snakes[target] !== undefined) {
    destination = snakes[target];
    effect = { type: "snake", from: target, to: destination };
  } else if (ladders[target] !== undefined) {
    destination = ladders[target];
    effect = { type: "ladder", from: target, to: destination };
  }

  return {
    moved: true,
    position: destination,
    landing: target,
    effect,
  };
}

export function checkWin(state) {
  return state.positions[state.turn] === BOARD_SIZE;
}
