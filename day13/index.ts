import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

type Coefficients = { x: number; y: number };
type Problem = { a: Coefficients; b: Coefficients; total: Coefficients };

const run: Run = async () => {
  const filePath = "day13/input.txt";
  const input = await readWholeFile(filePath);

  const problems: Problem[] = input.split("\n\n").map((group) => {
    const [a, b, total] = group
      .split("\n")
      .map((line) => line.split(": ")[1])
      .filter((line) => !!line)
      .map((line) => {
        const [x, y] = line.split(", ").map((part) => +part.slice(2));
        return { x, y };
      });
    return { a, b, total };
  });

  const reducer = (
    acc: { aTotal: number; bTotal: number },
    { a, b, total }: Problem,
  ): { aTotal: number; bTotal: number } => {
    const aCount = (b.y * total.x - b.x * total.y) / (b.y * a.x - b.x * a.y);
    const bCount = (total.x - a.x * aCount) / b.x;

    return Number.isInteger(aCount) && Number.isInteger(bCount)
      ? { aTotal: acc.aTotal + aCount, bTotal: acc.bTotal + bCount }
      : acc;
  };

  const { aTotal: a1, bTotal: b1 } = problems.reduce(reducer, {
    aTotal: 0,
    bTotal: 0,
  });
  const { aTotal: a2, bTotal: b2 } = problems
    .map(({ a, b, total: { x, y } }) => ({
      a,
      b,
      total: { x: x + 10000000000000, y: y + 10000000000000 },
    }))
    .reduce(reducer, {
      aTotal: 0,
      bTotal: 0,
    });

  return [3 * a1 + b1, 3 * a2 + b2];
};

export default run;
