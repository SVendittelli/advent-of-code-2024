import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

const run: Run = async () => {
  const filePath = "day07/input.txt";
  const lines = await readFile(filePath);

  const input = lines.map((line) => {
    const [big, list] = line.split(": ");
    return [+big, list.split(" ").map((el) => +el)] as const;
  });

  const exec = (
    goal: number,
    list: number[],
    acc: number,
    checkConcat: boolean,
  ): boolean => {
    if (list.length <= 0) {
      return acc === goal;
    }
    if (acc > goal) return false;

    const value = list[0];
    const result =
      exec(goal, list.slice(1), acc + value, checkConcat) ||
      exec(goal, list.slice(1), acc * value, checkConcat) ||
      (checkConcat &&
        exec(goal, list.slice(1), +`${acc}${value}`, checkConcat));
    return result;
  };

  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < input.length; ++i) {
    const [goal, list] = input[i];
    if (exec(goal, list, 0, false)) {
      sum1 += goal;
    }
    if (exec(goal, list, 0, true)) {
      sum2 += goal;
    }
  }

  return [sum1, sum2];
};

export default run;
