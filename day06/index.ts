import { readFile } from "../utils";

declare type Point = {
  x: number;
  y: number;
};

const path = "day06/input.txt";
const lines = await readFile(path);
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
  // Base
  let look: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
  if (outsideGrid(grid, look)) {
    // The next place to go would be off the grid
    path.push(curr);
    return false;
  }

  // Seen before
  const previousVisits = seen[curr.y][curr.x];
  if (previousVisits.some((prev) => pointEqual(dir, prev))) {
    return true;
  }

  // Recursion
  // 1. pre
  seen[curr.y][curr.x].push(dir);
  path.push(curr);

  let next: Point = curr;
  if (grid[look.y][look.x] === "#") {
    dir = turn(dir);
  } else {
    next = { x: curr.x + dir.x, y: curr.y + dir.y };
  }

  // 2. recurse
  if (walk(grid, next, dir, path, seen)) {
    return true;
  }

  // 3. post
  return false;
};

const start = lines
  .map((line, i) => ({ x: line.indexOf("^"), y: i }))
  .filter(({ x }) => x >= 0)[0];
const up: Point = { x: 0, y: -1 };
const mazePath: Point[] = [];
const newSeen = () => {
  const seen: Point[][][] = [];
  input.forEach((_) => seen.push([]));
  seen.forEach((row) => input[0].forEach((_) => row.push([])));
  return seen;
};

walk(input, start, up, mazePath, newSeen());

let count = 0;
mazePath
  .filter((point) => !pointEqual(start, point))
  .filter((a, i, arr) => arr.findIndex((b) => pointEqual(a, b)) === i)
  .forEach(({ x, y }) => {
    input[y][x] = "#";
    if (walk(input, start, up, [], newSeen())) {
      ++count;
    }
    input[y][x] = ".";
  });

console.log("part 1:", new Set(mazePath.map((el) => `${el.x},${el.y}`)).size);
console.log("part 2:", count);
