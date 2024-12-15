import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

type Vector = { x: number; y: number };
type Grid = string[][];

const directionsMap: Record<string, Vector> = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

const BOX = "O";
const BLANK = ".";
const WALL = "#";
const ROBOT = "@";

const gps = ({ x, y }: Vector): number => 100 * y + x;
const add = (a: Vector, b: Vector): Vector => ({ x: a.x + b.x, y: a.y + b.y });

const run: Run = async (disableLogging) => {
  const filePath = "day15/input.txt";
  const [gridInput, directionsInput] = (await readWholeFile(filePath)).split(
    "\n\n",
  );

  const printGrid = (grid: Grid) => {
    if (!disableLogging) grid.forEach((row) => console.log(row.join("")));
  };

  const grid1: Grid = gridInput.split("\n").map((row) => row.split(""));
  const directions: Vector[] = directionsInput
    .replaceAll("\n", "")
    .split("")
    .map((char) => directionsMap[char]);

  let robot: Vector = { x: 0, y: 0 };
  grid1.forEach((row, y) => {
    const x = row.indexOf(ROBOT);
    if (x >= 0) robot = { x, y };
  });

  const attempt = (grid: Grid, robot: Vector, direction: Vector): Vector => {
    let pushingBox = false;

    let position = robot;
    while (true) {
      position = add(position, direction);
      switch (grid[position.y][position.x]) {
        case WALL:
          return robot;
        case BOX:
          pushingBox = true;
          continue;
        case BLANK:
          const { x, y } = add(robot, direction);
          if (pushingBox) {
            grid[position.y][position.x] = BOX;
          }
          grid[robot.y][robot.x] = BLANK;
          grid[y][x] = ROBOT;
          return { x, y };
      }
    }
  };

  for (let i = 0; i < directions.length; ++i) {
    robot = attempt(grid1, robot, directions[i]);
  }

  const totalGps = (grid: Grid) => {
    let acc = 0;
    for (let y = 0; y < grid.length; ++y) {
      for (let x = 0; x < grid[y].length; ++x) {
        if (grid[y][x] == BOX) {
          acc += gps({ x, y });
        }
      }
    }
    return acc;
  };

  return [totalGps(grid1), 0];
};

export default run;
