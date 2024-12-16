import type { Direction, Point } from "./types";

export type NodeParams = {
  x: number;
  y: number;
  facing: Direction;
  isWalkable: boolean;
};

export default class Node {
  readonly id: string;
  readonly pos: Point;
  readonly facing: Direction;

  private _isWalkable: boolean;

  constructor({ x, y, facing, isWalkable }: NodeParams) {
    this.pos = { x, y };
    this.facing = facing;
    this.id = `${y},${x}>${facing}`;

    this._isWalkable = isWalkable;
  }

  get isWalkable() {
    return this._isWalkable;
  }
  set isWalkable(isWalkable: boolean) {
    this._isWalkable = isWalkable;
  }
}
