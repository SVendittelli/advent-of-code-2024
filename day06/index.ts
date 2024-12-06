import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Point = {
  x: number;
  y: number;
};

const run: Run = async () => {
  const filePath = "day06/input.txt";
  const lines = await readFile(filePath);
  const input = lines.map((line) => line.split(""));

  const outsideGrid = (grid: string[][], pos: Point): boolean =>
    pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

  const pointEqual = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y;
  };

  const turn = (dir: Point): Point => ({ x: -dir.y, y: dir.x });

  const walk = (
    grid: string[][],
    curr: Point,
    dir: Point,
    path: Point[],
    seen: Point[][][],
  ): boolean => {
    // The next place to go would be off the grid, i.e. done
    let look: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
    if (outsideGrid(grid, look)) {
      path.push(curr);
      return false;
    }

    // Seen before, i.e. in a loop
    const previousVisits = seen[curr.y][curr.x];
    if (previousVisits.some((prev) => pointEqual(dir, prev))) {
      return true;
    }

    // Recursion
    // 1. pre
    // track not only where has been visited, but in what direction
    seen[curr.y][curr.x].push(dir);
    path.push(curr);

    let next: Point = curr;
    if (grid[look.y][look.x] === "#") {
      // if there is an obsticle, turn but don't move we we can re-check
      dir = turn(dir);
    } else {
      // if the path is clear, move on
      next = { x: curr.x + dir.x, y: curr.y + dir.y };
    }

    // 2. recurse
    if (walk(grid, next, dir, path, seen)) {
      return true;
    }

    // 3. post
    return false;
  };

  /** Starting position */
  let start: Point = { x: 0, y: 0 };
  for (let row = 0; row < lines.length; ++row) {
    const line = lines[row];
    const col = line.indexOf("^");
    if (col >= 0) {
      start = { x: col, y: row };
      break;
    }
  }
  const up: Point = { x: 0, y: -1 };
  const path: Point[] = [];

  /** Make an empty array of all the places that have been visited */
  const newSeenArray = () => {
    const seen: Point[][][] = [];
    input.forEach((_) => seen.push([]));
    seen.forEach((row) => input[0].forEach((_) => row.push([])));
    return seen;
  };

  // walk the normal array
  walk(input, start, up, path, newSeenArray());

  const uniquePoints = path.filter(
    (a, i, arr) => arr.findIndex((b) => pointEqual(a, b)) === i,
  );

  // for every unique point on the path that isn't the start, replace it with a blocker and try to walk it
  let count = 0;
  uniquePoints
    .filter((point) => !pointEqual(start, point))
    .forEach(({ x, y }) => {
      input[y][x] = "#";
      if (walk(input, start, up, [], newSeenArray())) {
        ++count;
      }
      input[y][x] = ".";
    });

  return [uniquePoints.length, count];
};

export default run;
