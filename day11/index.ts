import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

const numDigits = (num: number): number => {
  return (Math.log(num) * Math.LOG10E + 1) | 0;
};
const firstHalf = (num: number, length: number): number => {
  return Math.floor(num / Math.pow(10, length / 2));
};
const secondHalf = (num: number, length: number): number => {
  return num % Math.pow(10, length / 2);
};
const addToCount = <K>(
  oldMap: Map<K, number>,
  newMap: Map<K, number>,
  oldValue: K,
  newValue: K,
) => {
  let newCount = (newMap.get(newValue) ?? 0) + (oldMap.get(oldValue) ?? 0);
  newMap.set(newValue, newCount);
};

const run: Run = async () => {
  const filePath = "day11/input.txt";
  const input = (await readWholeFile(filePath))
    .split(" ")
    .map((stone) => +stone);

  /** Count of total stones with a given value */
  let countByValue: Map<number, number> = new Map();
  /** Set of the different values of stones */
  let stones: Set<number> = new Set();

  input.forEach((stone) => {
    countByValue.set(stone, 1);
    stones.add(stone);
  });

  const iterate = (depth: number) => {
    for (let i = 0; i < depth; ++i) {
      const newCountByValue: Map<number, number> = new Map();
      const newStones: Set<number> = new Set();

      for (let stone of stones) {
        if (stone === 0) {
          const value = 1;
          newStones.add(value);
          addToCount(countByValue, newCountByValue, stone, value);
          continue;
        }

        const length = numDigits(stone);
        if (length % 2 === 0) {
          const first = firstHalf(stone, length);
          const second = secondHalf(stone, length);

          newStones.add(first);
          addToCount(countByValue, newCountByValue, stone, first);

          newStones.add(second);
          addToCount(countByValue, newCountByValue, stone, second);
          continue;
        }

        const value = stone * 2024;
        newStones.add(value);
        addToCount(countByValue, newCountByValue, stone, value);
      }

      countByValue = newCountByValue;
      stones = newStones;
    }
  };

  iterate(25);
  const part1 = stones
    .values()
    .reduce((acc, stone) => acc + (countByValue.get(stone) ?? 0), 0);

  iterate(75 - 25);
  const part2 = stones
    .values()
    .reduce((acc, stone) => acc + (countByValue.get(stone) ?? 0), 0);

  return [part1, part2];
};

export default run;
