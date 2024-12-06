import { readFile } from "../utils";

declare type Point = {
  x: number;
  y: number;
};

const path = "day06/input.txt";
const lines = await readFile(path);
const input = lines.map((line) => line.split(""));

const start = lines
  .map((line, i) => ({ x: line.indexOf("^"), y: i }))
  .filter(({ x }) => x >= 0)[0];
const up: Point = { x: 0, y: -1 };

const outsideGrid = (grid: string[][], pos: Point): boolean =>
  pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

const walk = (grid: string[][], curr: Point, dir: Point) => {
  // Base
  if (outsideGrid(grid, curr)) {
    return false;
  }

  grid[curr.y][curr.x] = "X";
  let next: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
  if (outsideGrid(grid, next)) {
    return false;
  }

  // Recursion
  // 1. pre
  if (grid[next.y][next.x] === "#") {
    dir = { x: -dir.y, y: dir.x };
    next = { x: curr.x + dir.x, y: curr.y + dir.y };
  }

  // 2. recurse
  if (walk(grid, next, dir)) {
    return true;
  }
  // 3. post
  return false;
};

walk(input, start, up);

const total1 = input.reduce(
  (acc, curr) => acc + curr.filter((val) => val === "X").length,
  0,
);
console.log("part 1:", total1);
