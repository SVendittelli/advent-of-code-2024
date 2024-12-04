import { readFile } from "../utils";

declare type Point = {
  x: number;
  y: number;
};

const path = "day04/input.txt";
const lines = await readFile(path);

const grid: string[][] = lines.map((line) => line.split(""));

const xmasDirections: [number, number][] = [
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
const checkXmas = (
  grid: string[][],
  curr: Point,
  [x, y]: [number, number],
  word: string,
): boolean => {
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
  if (checkXmas(grid, { x: curr.x + x, y: curr.y + y }, [x, y], word)) {
    return true;
  }

  word = word.slice(0, word.length - 1);
  return false;
};

const checkMas = (grid: string[][], curr: Point): boolean => {
  // can't be on the edge of the grid
  if (
    curr.x < 1 ||
    curr.x >= grid[0].length - 1 ||
    curr.y < 1 ||
    curr.y >= grid.length - 1
  ) {
    return false;
  }

  if (grid[curr.y][curr.x] !== "A") {
    return false;
  }

  const downDiag = [grid[curr.y - 1][curr.x - 1], grid[curr.y + 1][curr.x + 1]];
  const upDiag = [grid[curr.y + 1][curr.x - 1], grid[curr.y - 1][curr.x + 1]];

  return (
    downDiag.includes("M") &&
    downDiag.includes("S") &&
    upDiag.includes("M") &&
    upDiag.includes("S")
  );
};

let count1 = 0;
let count2 = 0;
for (let row = 0; row < grid.length; ++row) {
  for (let col = 0; col < grid.length; ++col) {
    let curr = { x: col, y: row };
    if (checkMas(grid, curr)) {
      ++count2;
    }

    for (let i = 0; i < xmasDirections.length; ++i) {
      const [x, y] = xmasDirections[i];
      let word = "";
      if (checkXmas(grid, curr, [x, y], word)) {
        ++count1;
      }
    }
  }
}

console.log("part 1", count1);
console.log("part 2", count2);
