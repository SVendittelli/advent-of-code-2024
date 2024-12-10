import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Point = {
  x: number;
  y: number;
};

const outsideGrid = (grid: number[][], pos: Point): boolean =>
  pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

const newSeen = (grid: number[][]): boolean[][] =>
  grid.map((row) => new Array(row.length).fill(null).map((_) => false));

const directions: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const run: Run = async () => {
  const filePath = "day10/input.txt";
  const lines = await readFile(filePath);
  const grid = lines.map((line) => line.split("").map((cell) => +cell));

  const starts: Point[] = [];
  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === 0) {
        starts.push({ x, y });
      }
    }),
  );

  const walk = (
    grid: number[][],
    curr: Point,
    path: Point[],
    seen: boolean[][],
    paths: Point[][],
    noDuplicates: boolean,
  ): boolean => {
    // walked off the grid
    if (outsideGrid(grid, curr)) return false;
    if (seen[curr.y][curr.x]) return false;

    // current point not exactly 1 more than the last
    const lastPoint = path.at(-1);
    if (
      lastPoint &&
      grid[curr.y][curr.x] !== grid[lastPoint.y][lastPoint.x] + 1
    ) {
      return false;
    }

    // Valid point on path
    seen[curr.y][curr.x] = noDuplicates && true;

    // reached a 9
    if (grid[curr.y][curr.x] === 9) return true;

    path.push(curr);

    for (let dir of directions) {
      const newPos: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
      if (walk(grid, newPos, path, seen, paths, noDuplicates)) {
        paths.push([...path]);
      }
    }

    path.pop();
    return false;
  };

  let scorePaths: Point[][] = [];
  let ratingPaths: Point[][] = [];
  for (let start of starts) {
    walk(grid, start, [], newSeen(grid), scorePaths, true);
    walk(grid, start, [], newSeen(grid), ratingPaths, false);
  }

  return [scorePaths.length, ratingPaths.length];
};

export default run;
