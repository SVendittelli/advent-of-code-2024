import type { Run } from "~/utils/types";
import { readFile } from "~/utils";
import { Direction, type Input, type Point } from "./types";
import { Grid } from "./Grid";
import PriorityQueue from "./PriorityQueue";
import heuristic from "./heuristic";
import { equals } from "./utils";
import type Node from "./Node";

const backTrace = (
  cameFrom: Record<string, Set<Node>>,
  end: Node,
): Set<string> => {
  const seen: Set<string> = new Set();
  const points: Set<string> = new Set();
  let queue: Node[] = [end];

  while (queue.length) {
    let back = queue.shift();
    if (!back) break;
    seen.add(back.id);
    const {
      pos: { x, y },
    } = back;
    points.add(`${x},${y}`);
    (cameFrom[back.id] ?? []).forEach((node) => {
      if (!seen.has(node.id)) queue.push(node);
    });
  }

  return points;
};

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

  const start = grid.getNodeAt(startPos, Direction.E);
  start.print(loggingDiabled);

  let endScore: number = Number.POSITIVE_INFINITY;
  start.gScore = 0;
  start.hScore = heuristic(startPos, endPos);

  const open = new PriorityQueue([{ node: start, priority: 0 }]);
  const cameFrom: Record<string, Set<Node>> = {};

  let points: Set<string> = new Set();
  while (!open.isEmpty()) {
    const curr = open.dequeue();
    if (!curr) break;

    if (equals(curr.pos, endPos)) {
      const end = grid.getNodeAt(endPos, curr.facing);
      points = backTrace(cameFrom, end);
      endScore = end.gScore;
      end.print(loggingDiabled);
      break;
    }

    for (let neighbour of grid.getAdjacentNodes(curr.pos, curr.facing)) {
      const tentativeGScore = curr.gScore + curr.distance(neighbour);
      if (tentativeGScore <= neighbour.gScore) {
        cameFrom[neighbour.id] ??= new Set();
        if (tentativeGScore === neighbour.gScore) {
          cameFrom[neighbour.id].add(curr);
        } else {
          cameFrom[neighbour.id] = new Set([curr]);
        }
        neighbour.gScore = tentativeGScore;
        neighbour.hScore = heuristic(neighbour.pos, endPos);
        if (!open.contains(neighbour)) {
          open.enqueue(neighbour, neighbour.fScore);
        }
      }
    }
  }

  grid.print(points, loggingDiabled);

  return [endScore, points.size];
};

export default run;
