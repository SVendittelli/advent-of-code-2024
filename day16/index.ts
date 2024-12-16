import type { Run } from "~/utils/types";
import { readFile } from "~/utils";
import { Direction, type Input, type Point } from "./types";
import { Grid } from "./Grid";
import PriorityQueue from "./PriorityQueue";
import heuristic from "./heuristic";
import { equals } from "./utils";

const run: Run = async (loggingDiabled) => {
  const filePath = "day16/test-input-1.txt";
  const input: Input = (await readFile(filePath)).map((row) => row.split(""));

  let startPos: Point = { x: 0, y: 0 };
  let end: Point = { x: 0, y: 0 };
  input.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value === "S") {
        startPos = { x, y };
      } else if (value === "E") {
        end = { x, y };
      }
    }),
  );

  const grid = new Grid({ input });
  console.log(grid.height, grid.width);

  grid
    .getAdjacentNodes({ x: 1, y: 1 }, Direction.E)
    .forEach((node) => console.log(node.id));

  const start = grid.getNodeAt(startPos, Direction.E);
  start.gScore = 0;
  start.hScore = heuristic(startPos, end, 1);

  const open = new PriorityQueue([{ node: start, priority: 0 }]);
  const cameFrom: Map<string, string> = new Map();

  while (!open.isEmpty()) {
    open.print(loggingDiabled);
    const curr = open.dequeue();
    if (!curr) break;
    console.log("curr", curr.id);

    if (equals(curr.pos, end)) {
      // return the reconscructed path
    }
  }

  return [0, 0];
};

export default run;
