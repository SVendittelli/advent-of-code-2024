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
  seen: (Point | undefined)[][],
) => {
  // Base
  let look: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
  if (outsideGrid(grid, look)) {
    // The next place to go would be off the grid
    path.push(curr);
    return true;
  }

  // Seen before
  const visit = seen[curr.y][curr.x];
  if (visit && pointEqual(dir, visit)) {
    path = [];
    return false;
  }

  // Recursion
  // 1. pre
  seen[curr.y][curr.x] = dir;
  path.push(curr);

  if (grid[look.y][look.x] === "#") {
    dir = turn(dir);
  }
  const next: Point = { x: curr.x + dir.x, y: curr.y + dir.y };

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
const seen: (Point | undefined)[][] = [];
input.forEach((_) => seen.push(new Array(input[0].length).fill(false)));

walk(input, start, up, mazePath, seen);

console.log("part 1:", new Set(mazePath.map((el) => `${el.x},${el.y}`)).size);
