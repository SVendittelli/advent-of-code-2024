import { Direction, type Point } from "./types";

export const DIRECTIONS: Record<Direction, Point> = {
  [Direction.E]: { x: 1, y: 0 },
  [Direction.S]: { x: 0, y: 1 },
  [Direction.W]: { x: -1, y: 0 },
  [Direction.N]: { x: 0, y: 1 },
};
