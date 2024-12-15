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
const LEFT_BOX = "[";
const RIGHT_BOX = "]";
const BLANK = ".";
const WALL = "#";
const ROBOT = "@";

const gps = ({ x, y }: Vector): number => 100 * y + x;
const add = (a: Vector, b: Vector): Vector => ({ x: a.x + b.x, y: a.y + b.y });
const equals = (a: Vector, b: Vector): boolean => a.x === b.x && a.y === b.y;
const opposite = ({ x, y }: Vector): Vector => ({ x: -x, y: -y });
const enqueue = (queue: Vector[], vec: Vector) => {
  if (queue.findIndex((el) => equals(vec, el)) === -1) queue.push(vec);
  return queue;
};

const run: Run = async (disableLogging) => {
  const filePath = "day15/input.txt";
  const [gridInput, directionsInput] = (await readWholeFile(filePath)).split(
    "\n\n",
  );

  const printGrid = (grid: Grid) => {
    if (!disableLogging) grid.forEach((row) => console.log(row.join("")));
  };

  const grid1: Grid = gridInput.split("\n").map((row) => row.split(""));
  const grid2: Grid = gridInput.split("\n").map((row) =>
    row
      .replaceAll(BOX, LEFT_BOX + RIGHT_BOX)
      .replaceAll(BLANK, BLANK + BLANK)
      .replaceAll(WALL, WALL + WALL)
      .replaceAll(ROBOT, ROBOT + BLANK)
      .split(""),
  );

  const directions: Vector[] = directionsInput
    .replaceAll("\n", "")
    .split("")
    .map((char) => directionsMap[char]);

  printGrid(grid1);
  printGrid(grid2);

  let robot1: Vector = { x: 0, y: 0 };
  grid1.forEach((row, y) => {
    const x = row.indexOf(ROBOT);
    if (x >= 0) robot1 = { x, y };
  });
  let robot2: Vector = { x: 0, y: 0 };
  grid2.forEach((row, y) => {
    const x = row.indexOf(ROBOT);
    if (x >= 0) robot2 = { x, y };
  });

  const pushWideHorizontal = (
    grid: Grid,
    free: Vector,
    robot: Vector,
    dir: Vector,
  ) => {
    let leftBox = dir.x < 0;
    let curr = free;
    while (!equals(curr, robot)) {
      grid[curr.y][curr.x] = leftBox ? LEFT_BOX : RIGHT_BOX;
      leftBox = !leftBox;
      curr = add(curr, { y: 0, x: -dir.x });
    }
  };

  const otherHalfOfWideBox = (grid: Grid, half: Vector): Vector => {
    const value = grid[half.y][half.x];
    if (value === LEFT_BOX) {
      return add(half, { y: 0, x: 1 });
    } else if (value === RIGHT_BOX) {
      return add(half, { y: 0, x: -1 });
    }
    return half;
  };

  const pushWideVertical = (grid: Grid, robot: Vector, dir: Vector): Grid => {
    let wipGrid: Grid = grid.map((row) => row.map((col) => col));

    let queue: Vector[] = [];
    const toMove: Vector[] = [robot];
    const next = add(robot, dir);
    const other = otherHalfOfWideBox(grid, next);
    queue = enqueue(queue, next);
    queue = enqueue(queue, other);

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr) break;
      toMove.push(curr);

      switch (grid[curr.y][curr.x]) {
        case WALL:
          return [];
        case LEFT_BOX:
        case RIGHT_BOX:
          const look = add(curr, dir);
          const value = grid[look.y][look.x];
          queue = enqueue(queue, look);
          if (value === LEFT_BOX || value === RIGHT_BOX) {
            queue = enqueue(queue, otherHalfOfWideBox(grid, look));
          }
          continue;
        case BLANK: {
          const oppositeDir = opposite(dir);
          let wipCurr = curr;
          let look = add(curr, oppositeDir);
          while (true) {
            let value = grid[look.y][look.x];
            if (toMove.findIndex((visited) => equals(look, visited)) === -1) {
              wipGrid[wipCurr.y][wipCurr.x] = BLANK;
              break;
            }
            wipGrid[wipCurr.y][wipCurr.x] = value === WALL ? BLANK : value;
            if (value !== LEFT_BOX && value !== RIGHT_BOX) break;
            wipCurr = look;
            look = add(look, oppositeDir);
          }
          continue;
        }
      }
    }

    return wipGrid;
  };

  const attempt = (grid: Grid, robot: Vector, direction: Vector): Vector => {
    let pushingBox = false;
    let pushingWideBox = false;

    let position = robot;
    while (true) {
      position = add(position, direction);
      switch (grid[position.y][position.x]) {
        case WALL:
          return robot;
        case BOX:
          pushingBox = true;
          continue;
        case LEFT_BOX:
        case RIGHT_BOX:
          pushingWideBox = true;
          continue;
        case BLANK:
          const { x, y } = add(robot, direction);
          if (pushingBox) {
            grid[position.y][position.x] = BOX;
          }
          if (pushingWideBox) {
            if (direction.y === 0) {
              pushWideHorizontal(grid, position, robot, direction);
            } else {
              const wipGrid = pushWideVertical(grid, robot, direction);
              wipGrid.forEach((row, y) =>
                row.forEach((value, x) => (grid[y][x] = value)),
              );
              if (wipGrid.length === 0) return robot;
            }
          }
          grid[robot.y][robot.x] = BLANK;
          grid[y][x] = ROBOT;
          return { x, y };
      }
    }
  };

  for (let i = 0; i < directions.length; ++i) {
    robot1 = attempt(grid1, robot1, directions[i]);
    robot2 = attempt(grid2, robot2, directions[i]);
  }

  const totalGps = (grid: Grid) => {
    let acc = 0;
    for (let y = 0; y < grid.length; ++y) {
      for (let x = 0; x < grid[y].length; ++x) {
        const value = grid[y][x];
        if (value === BOX || value == LEFT_BOX) {
          acc += gps({ x, y });
        }
      }
    }
    return acc;
  };

  printGrid(grid1);
  printGrid(grid2);

  return [totalGps(grid1), totalGps(grid2)];
};

export default run;
