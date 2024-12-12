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

const corners: Point[] = [
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];

/**
 * An array of the triplets of the cells in the two orthogonal cardinal
 * directions and the diagonal between them.
 */
const getCorners = ({ x, y }: Point): [Point, Point, Point][] =>
  corners.map((c) => [
    { x: x + c.x, y },
    { x: x + c.x, y: y + c.y },
    { x, y: y + c.y },
  ]);

const outsideGrid = (grid: string[], pos: Point): boolean =>
  pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length;

const isIn = (point: Point, array: Point[]): boolean =>
  !!array.find(({ x, y }) => point.x === x && point.y === y);

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

  for (let y = 0; y < input.length; ++y) {
    for (let x = 0; x < input[0].length; ++x) {
      const point = { x, y };
      if (!isIn(point, points)) {
        const region: Region = {
          id: input[y][x],
          perimiter: 0,
          points: [],
        };
        walk(input, point, newSeen(), region);
        regions.push(region);
        points = points.concat(region.points);
      }
    }
  }

  const fenceCost1 = regions.reduce(
    (acc, region) => acc + region.points.length * region.perimiter,
    0,
  );

  const fenceCost2 = regions.reduce((acc, region) => {
    // The number of corners is the same as the number of sides
    let sides = 0;
    // Visit every point, checking if it is a corner
    for (let point of region.points) {
      const corners = getCorners(point);
      // Check the four corner directions
      for (let corner of corners) {
        const inArray = corner.map((p) => isIn(p, region.points));
        // If neither adjacent cell is in then we're on an exterior corner
        if (!inArray[0] && !inArray[2]) {
          sides++;
        }
        // If both adjacent cells are in but not the diagonal then we're on an interior corner
        if (inArray[0] && !inArray[1] && inArray[2]) {
          sides++;
        }
      }
    }
    return acc + sides * region.points.length;
  }, 0);

  return [fenceCost1, fenceCost2];
};

export default run;
