import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

const run: Run = async () => {
  const filePath = "day13/input.txt";
  const input = await readWholeFile(filePath);

  const problems = input.split("\n\n").map((group) => {
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

  const { aTotal: a, bTotal: b } = problems.reduce(
    (acc, { a, b, total }) => {
      const aCount = (b.y * total.x - b.x * total.y) / (b.y * a.x - b.x * a.y);
      const bCount = (total.x - a.x * aCount) / b.x;

      return Number.isInteger(aCount) && Number.isInteger(bCount)
        ? { aTotal: acc.aTotal + aCount, bTotal: acc.bTotal + bCount }
        : acc;
    },
    { aTotal: 0, bTotal: 0 },
  );

  return [3 * a + b, 0];
};

export default run;
