import type { Run } from "~/utils/types";
import { readFile } from "~/utils";
import { Direction, type Input } from "./types";
import { Grid } from "./Grid";

const run: Run = async () => {
  const filePath = "day16/test-input-1.txt";
  const input: Input = (await readFile(filePath)).map((row) => row.split(""));

  const grid = new Grid({ input });
  console.log(grid.height, grid.width);

  grid
    .getAdjacentNodes({ x: 1, y: 1 }, Direction.E)
    .forEach((node) => console.log(node.id));

  return [0, 0];
};

export default run;