import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Point = {
  x: number;
  y: number;
};

type Region = {
  id: string;
  perimiter: number;
  points: Point[];
};

const outsideGrid = (grid: string[], pos: Point): boolean =>
  pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

const run: Run = async () => {
  const filePath = "day12/input.txt";
  const input = await readFile(filePath);

  const directions: Point[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  const walk = (
    grid: string[],
    curr: Point,
    seen: boolean[][],
    region: Region,
  ): boolean => {
    const { x, y } = curr;
    if (outsideGrid(grid, curr)) {
      region.perimiter += 1;
      return false;
    }

    if (grid[y][x] !== region.id) {
      region.perimiter += 1;
      return false;
    }

    if (seen[y][x]) return false;
    seen[y][x] = true;

    region.points.push(curr);

    for (let dir of directions) {
      walk(grid, { x: x + dir.x, y: y + dir.y }, seen, region);
    }

    return true;
  };

  const newSeen = () =>
    new Array(input.length)
      .fill(null)
      .map((_) => new Array(input[0].length).fill(false));

  const regions: Region[] = [];
  let points: Point[] = [];

  for (let row = 0; row < input.length; ++row) {
    for (let col = 0; col < input[0].length; ++col) {
      if (!(points.findIndex(({ x, y }) => x === col && y === row) >= 0)) {
        const region: Region = {
          id: input[row][col],
          perimiter: 0,
          points: [],
        };
        walk(input, { x: col, y: row }, newSeen(), region);
        regions.push(region);
        points = points.concat(region.points);
      }
    }
  }

  const fenceCost = regions.reduce(
    (acc, region) => acc + region.points.length * region.perimiter,
    0,
  );

  return [fenceCost, 0];
};

export default run;
