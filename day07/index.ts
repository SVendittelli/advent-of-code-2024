import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

const run: Run = async () => {
  const filePath = "day07/input.txt";
  const lines = await readFile(filePath);

  const input = lines.map((line) => {
    const [big, list] = line.split(": ");
    return [+big, list.split(" ").map((el) => +el)] as const;
  });

  const operations: ((a: number, b: number) => number)[] = [
    (a, b) => a * b,
    (a, b) => a + b,
  ];

  const exec = (
    big: number,
    list: number[],
    index: number,
    acc: number,
  ): boolean => {
    if (acc === big) return true;
    if (acc > big) return false;
    if (index > list.length) return false;

    for (let operation of operations) {
      if (exec(big, list, index + 1, operation(acc, list[index]))) {
        return true;
      }
    }

    return false;
  };

  let sum1 = 0;
  for (let i = 0; i < input.length; ++i) {
    const [big, list] = input[i];
    let acc = 0;
    if (exec(big, list, 0, acc)) {
      sum1 += big;
    }
  }

  return [sum1, 0];
};

export default run;
