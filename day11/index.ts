import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

const run: Run = async () => {
  const filePath = "day11/input.txt";
  const input = (await readWholeFile(filePath))
    .split(" ")
    .map((stone) => +stone);

  const apply = (stone: number): number | number[] => {
    const asString = `${stone}`;
    if (stone === 0) {
      return stone + 1;
    } else if (asString.length % 2 === 0) {
      return [
        +asString.substring(0, asString.length / 2),
        +asString.substring(asString.length / 2),
      ];
    } else {
      return stone * 2024;
    }
  };

  let stones = input;
  for (let i = 0; i < 25; ++i) {
    stones = stones.map(apply).flat();
  }

  return [stones.length, 0];
};

export default run;
