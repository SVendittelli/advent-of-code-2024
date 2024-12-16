import { Direction, type Point } from "./types";

export const add = (a: Point, b: Point): Point => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const turn = (direction: Direction, clockwise: boolean) => {
  let newDirection: Direction;

  switch (direction) {
    case Direction.E:
      newDirection = clockwise ? Direction.S : Direction.N;
      break;
    case Direction.S:
      newDirection = clockwise ? Direction.W : Direction.E;
      break;
    case Direction.W:
      newDirection = clockwise ? Direction.N : Direction.S;
      break;
    case Direction.N:
      newDirection = clockwise ? Direction.E : Direction.W;
      break;
  }

  return newDirection;
};
