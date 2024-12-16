import { Direction, type Point } from "./types";
import { equals } from "./utils";

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
    return `${x},${y}>${Direction[this.facing]}`;
  }

  get fScore() {
    return this.gScore + this.hScore;
  }

  public print(loggingDisabled?: boolean): void {
    if (loggingDisabled) return;
    console.log(this.id);
  }

  public distance(node: Node): number {
    if (equals(this.pos, node.pos) && this.facing !== node.facing) return 1000;
    if (!equals(this.pos, node.pos) && this.facing === node.facing) return 1;
    return Number.POSITIVE_INFINITY;
  }
}
