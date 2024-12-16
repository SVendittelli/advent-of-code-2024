import { DIRECTIONS } from "./constants";
import Node from "./Node";
import { Direction, type Input, type Point } from "./types";
import { add, turn } from "./utils";

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

  public getAdjacentNodes(point: Point, facing: Direction): Node[] {
    const nodes: Node[] = [];

    const options = [
      { point: add(point, DIRECTIONS[facing]), facing },
      { point, facing: turn(facing, true) },
      { point, facing: turn(facing, false) },
    ];

    for (let { point, facing } of options) {
      if (this.isOnGrid(point) && this.isWalkableAt(point, facing))
        nodes.push(this.getNodeAt(point, facing));
    }

    return nodes;
  }

  public getNodeAt(point: Point, facing: Direction): Node {
    return this.nodes[point.y][point.x][facing];
  }

  private isOnGrid({ x, y }: Point): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private isWalkableAt(point: Point, facing: Direction): boolean {
    return this.getNodeAt(point, facing).isWalkable;
  }

  private nodesFromInput(input: Input, height: number, width: number): Nodes {
    // Generate an empty grid
    const newNodes: Nodes = [];
    for (let y = 0; y < height; ++y) {
      newNodes[y] = [];
      for (let x = 0; x < width; ++x) {
        newNodes[y][x] = new Array(4) as NodeDirections;
        const isWalkable = input[y][x] !== "#";

        for (let dir = 0; dir < 4; ++dir) {
          const facing: Direction = dir;
          newNodes[y][x][dir] = new Node({ x, y, facing, isWalkable });
        }
      }
    }

    return newNodes;
  }
}
