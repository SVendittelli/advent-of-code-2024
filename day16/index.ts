import type { Run } from "~/utils/types";
import { readFile } from "~/utils";
import { Direction, type Input, type Point } from "./types";
import { Grid } from "./Grid";
import PriorityQueue from "./PriorityQueue";
import heuristic from "./heuristic";
import { equals } from "./utils";
import type Node from "./Node";

const run: Run = async (loggingDiabled) => {
  const filePath = "day16/input.txt";
  const input: Input = (await readFile(filePath)).map((row) => row.split(""));

  let startPos: Point = { x: 0, y: 0 };
  let endPos: Point = { x: 0, y: 0 };
  input.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value === "S") {
        startPos = { x, y };
      } else if (value === "E") {
        endPos = { x, y };
      }
    }),
  );

  const grid = new Grid({ input });
  //console.log(grid.height, grid.width);

  //grid
  //  .getAdjacentNodes({ x: 1, y: 1 }, Direction.E)
  //  .forEach((node) => console.log(node.id));

  const start = grid.getNodeAt(startPos, Direction.E);
  start.gScore = 0;
  start.hScore = heuristic(startPos, endPos);

  const open = new PriorityQueue([{ node: start, priority: 0 }]);
  const cameFrom: Map<string, Node> = new Map();

  let success = false;
  let path: Node[] = [];
  while (!open.isEmpty()) {
    //console.group("queue");
    //open.print(loggingDiabled);
    //console.groupEnd();
    const curr = open.dequeue();
    if (!curr) break;
    //console.group("curr", curr.id);

    if (equals(curr.pos, endPos)) {
      success = true;
      let back = grid.getNodeAt(endPos, curr.facing);
      while (!equals(back.pos, start.pos)) {
        path.push(back);
        back = cameFrom.get(back.id) as Node;
      }
      break;
      // return the reconscructed path
    }

    for (let neighbour of grid.getAdjacentNodes(curr.pos, curr.facing)) {
      //console.group("neighbour of", curr.id);
      //neighbour.print(loggingDiabled);
      //console.log("curr g", curr.gScore);
      //console.log("curr d", curr.distance(neighbour));

      const tentativeGScore = curr.gScore + curr.distance(neighbour);
      //console.log("tent g", tentativeGScore, "nei g", neighbour.gScore);
      if (tentativeGScore < neighbour.gScore) {
        //console.log("worth visiting");
        cameFrom.set(neighbour.id, curr);
        neighbour.gScore = tentativeGScore;
        neighbour.hScore = heuristic(neighbour.pos, endPos);
        //console.log("checking if neighbour is already in the queue");
        if (!open.contains(neighbour)) {
          //console.log("not in queue, enqueueing");
          open.enqueue(neighbour, neighbour.fScore);
        }
      }
      //console.groupEnd();
    }

    //console.log("neightbours done");
    //console.groupEnd();
  }

  console.log("done", success);

  return [path[0].gScore, 0];
};

export default run;
