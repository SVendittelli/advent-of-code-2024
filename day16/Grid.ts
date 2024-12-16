import Node from "./Node";
import type { Input, Point } from "./types";
import { DIRECTIONS } from "./constants";

type GridParams = {
  input: Input;
};
type NodeDirections = [Node, Node, Node, Node];
type Nodes = NodeDirections[][];

export class Grid {
  readonly height: number;
  readonly width: number;

  /** All the nnodes in the grid, with each direction */
  private nodes: Nodes;

  constructor({ input }: GridParams) {
    this.height = input.length;
    this.width = input[0]?.length ?? 0;
    this.nodes = this.nodesFromInput(input, this.height, this.width);
  }

  public getNodeDirectionsAt({ x, y }: Point): NodeDirections {
    return this.nodes[y][x];
  }

  private isOnGrid({ x, y }: Point): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private nodesFromInput(input: Input, height: number, width: number): Nodes {
    // Generate an empty grid
    const newNodes: Nodes = [];
    for (let y = 0; y < height; ++y) {
      newNodes[y] = [];
      for (let x = 0; x < width; ++x) {
        newNodes[y][x] = new Array(4) as NodeDirections;
        for (let dirIdx = 0; dirIdx < 4; ++dirIdx) {
          const facing = DIRECTIONS[dirIdx];
          let isWalkable = input[y][x] !== "#";

          switch (facing) {
            case "E":
              isWalkable &&= input[y][x - 1] !== "#";
              break;
            case "S":
              isWalkable &&= input[y - 1][x] !== "#";
              break;
            case "W":
              isWalkable &&= input[y][x + 1] !== "#";
              break;
            case "N":
              isWalkable &&= input[y + 1][x] !== "#";
              break;
          }

          newNodes[y][x][dirIdx] = new Node({ x, y, facing, isWalkable });
        }
      }
    }

    return newNodes;
  }
}
