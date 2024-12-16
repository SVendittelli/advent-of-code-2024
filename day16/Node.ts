import type { Direction, Point } from "./types";

export type NodeParams = {
  x: number;
  y: number;
  facing: Direction;
  isWalkable: boolean;
};

export default class Node {
  readonly pos: Point;
  readonly facing: Direction;

  gScore: number;
  hScore: number;
  isWalkable: boolean;

  constructor({ x, y, facing, isWalkable }: NodeParams) {
    this.pos = { x, y };
    this.facing = facing;
    this.isWalkable = isWalkable;

    this.gScore = Number.POSITIVE_INFINITY;
    this.hScore = Number.POSITIVE_INFINITY;
  }

  get id() {
    const { x, y } = this.pos;
    return `${x},${y}>${this.facing}`;
  }

  get fScore() {
    return this.gScore + this.hScore;
  }
}
