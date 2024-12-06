import { readWholeFile } from "~/utils";
import type { Run } from "~/utils/types";

const run: Run = async () => {
  const path = "day03/input.txt";
  const input = await readWholeFile(path);

  const regex = /(?:mul|do|don't)\((?:(\d+),(\d+))?\)/g;
  const matches = input.matchAll(regex);

  let enabled = true;
  const [total1, total2] = matches
    .map(([match, num1, num2]) => {
      switch (match) {
        case "do()":
          enabled = true;
          return [0, 0];
        case "don't()":
          enabled = false;
          return [0, 0];
        default:
          const product = +num1 * +num2;
          return [product, enabled ? product : 0];
      }
    })
    .reduce(
      ([acc1, acc2], [curr1, curr2]) => [acc1 + curr1, acc2 + curr2],
      [0, 0],
    );

  return [total1, total2];
};
export default run;
