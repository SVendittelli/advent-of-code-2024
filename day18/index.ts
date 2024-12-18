import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Grid = string[][];

type Point = {
  x: number;
  y: number;
};

const outsideGrid = (grid: string[][], pos: Point): boolean =>
  pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

const newSeen = (grid: string[][]): boolean[][] =>
  grid.map((row) => new Array(row.length).fill(false));

const directions: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const run: Run = async () => {
  const filePath = "day18/test-input.txt";
  const lines = await readFile(filePath);

  const input = lines.map((line) => line.split(",").map(Number));
  const size = 7;

  const grid: Grid = new Array(size)
    .fill(null)
    .map((_) => new Array(size).fill(null).map((_) => "."));

  const print = (grid: Grid) => {
    grid.forEach((row) => console.log(row.join("")));
    console.log();
  };

  print(grid);

  const grids: Grid[] = [];
  //const max = input.length;
  const max = 12;
  for (let i = 0; i < max; ++i) {
    grids[i] = (grids[i - 1] ?? grid).map((row) => [...row]);
    const [x, y] = input[i];
    grids[i][y][x] = "#";
  }

  const walk = (
    grids: Grid[],
    curr: Point,
    path: Point[],
    seen: boolean[][],
    step: number,
  ): boolean => {
    //const grid = grids[step];
    const grid = grids.at(-1) as Grid;

    // walked off the grid
    if (outsideGrid(grid, curr)) return false;

    // reached a corrupted space
    if (grid[curr.y][curr.x] === "#") return false;

    // been here before
    if (seen[curr.y][curr.x]) return false;

    // Valid point on path
    seen[curr.y][curr.x] = true;

    // reached the end
    if (curr.y === size - 1 && curr.x === size - 1) return true;

    path.push(curr);

    for (let dir of directions) {
      const newPos: Point = { x: curr.x + dir.x, y: curr.y + dir.y };
      if (walk(grids, newPos, path, seen, step + 1)) {
        return true;
      }
    }

    path.pop();
    return false;
  };

  const path: Point[] = [];
  walk(grids, { x: 0, y: 0 }, path, newSeen(grids[0]), 0);

  const last = [...(grids.at(-1) as Grid)];
  path.forEach(({ x, y }) => (last[y][x] = "O"));

  print(last);

  return [path.length, 0];
};

export default run;
