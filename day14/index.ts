import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Vector = { x: number; y: number };
type Robot = { p: Vector; v: Vector };

const run: Run = async (disableLogging) => {
  const filePath = "day14/input.txt";
  const lines = await readFile(filePath);

  const width = 101;
  const height = 103;

  const robots: Robot[] = lines.map((line) => {
    const [p, v] = line.split(" ").map((half) => {
      const [x, y] = half
        .slice(2)
        .split(",")
        .map((co) => +co);
      return { x, y };
    });
    return { p, v };
  });

  const move = (robots: Robot[], count: number): Robot[] => {
    return robots.map(({ p, v }) => ({
      p: {
        x: (width + ((p.x + count * v.x) % width)) % width,
        y: (height + ((p.y + count * v.y) % height)) % height,
      },
      v,
    }));
  };

  const calculateSaftyFactor = (robots: Robot[]) => {
    const empty = { "0": [], "1": [], "2": [], "3": [], "4": [] };
    const quadrants = {
      ...empty,
      ...Object.groupBy(robots, ({ p: { x, y } }) => {
        switch (true) {
          case x < Math.floor(width / 2) && y < Math.floor(height / 2):
            return 1;
          case x > Math.floor(width / 2) && y < Math.floor(height / 2):
            return 2;
          case x < Math.floor(width / 2) && y > Math.floor(height / 2):
            return 3;
          case x > Math.floor(width / 2) && y > Math.floor(height / 2):
            return 4;
          default:
            return 0;
        }
      }),
    };

    const factor =
      quadrants[1].length *
      quadrants[2].length *
      quadrants[3].length *
      quadrants[4].length;

    return factor;
  };

  const factor = calculateSaftyFactor(move(robots, 100));

  const print = (robots: Robot[]) => {
    if (disableLogging) return;
    const grid = new Array(height)
      .fill(null)
      .map((_) => new Array(width).fill(null).map((_) => 0));
    robots.forEach(({ p }) => (grid[p.y][p.x] = grid[p.y][p.x] + 1));
    grid.forEach((row) =>
      console.log(row.map((value) => `${value || " "}`).join("")),
    );
  };

  let lowest = Number.MAX_SAFE_INTEGER;
  let overlap = false;
  let rs: Robot[] = robots;
  for (let i = 0; !overlap; ++i) {
    rs = move(robots, i);
    overlap = !rs.some(
      ({ p }, i) =>
        rs.findIndex(({ p: { x, y } }) => p.x === x && p.y === y) !== i,
    );
    if (overlap) {
      lowest = Math.min(lowest, i);
    }
  }
  print(rs);

  return [factor, lowest];
};

export default run;
