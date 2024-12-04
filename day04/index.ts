import { readFile } from "../utils";

declare type Point = {
  x: number;
  y: number;
};

const path = "day04/input.txt";
const lines = await readFile(path);

const grid: string[][] = lines.map((line) => line.split(""));

const directions: [number, number][] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const partials = ["", "X", "XM", "XMA"];
const check = (
  grid: string[][],
  curr: Point,
  [x, y]: [number, number],
  word: string,
) => {
  // Base case
  if (word === "XMAS") {
    return true;
  }

  if (
    curr.x < 0 ||
    curr.x >= grid[0].length ||
    curr.y < 0 ||
    curr.y >= grid.length
  ) {
    return false;
  }

  if (!partials.includes(word)) {
    return false;
  }

  // Recursion
  // 1. pre
  word = word + grid[curr.y][curr.x];

  // 2. recurse
  if (check(grid, { x: curr.x + x, y: curr.y + y }, [x, y], word)) {
    return true;
  }

  word = word.slice(0, word.length - 1);
  return false;
};

check(grid, { x: 3, y: 9 }, [-1, -1], "");

let count = 0;
for (let row = 0; row < grid.length; ++row) {
  for (let col = 0; col < grid.length; ++col) {
    let curr = { x: col, y: row };

    for (let i = 0; i < directions.length; ++i) {
      const [x, y] = directions[i];
      let word = "";
      if (check(grid, curr, [x, y], word)) {
        if (curr.y === 9) {
          //console.log([curr.x, curr.y], [x, y]);
        }
        ++count;
      }
    }
  }
}

console.log(count);
