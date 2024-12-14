import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Vector = { x: number; y: number };
type Robot = { p: Vector; v: Vector };

const run: Run = async () => {
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

  return [factor, 0];
};

export default run;
