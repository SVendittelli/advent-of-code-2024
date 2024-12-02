import { mkdir } from "node:fs/promises";
import { dayToNumber, lastDay, numberToDay } from ".";
import type { Day } from "./types";

const newReadme = (day: Day) =>
  `# ${day}

https://adventofcode.com/2024/day/${dayToNumber(day)}
`;

const newIndex = (day: Day) =>
  `import { readFile } from "../utils";

const path = "${day}/input.txt";
const lines = await readFile(path);
`;

const last = await lastDay();
const lastNumber = dayToNumber(last);
const day = numberToDay(lastNumber + 1);
await mkdir(numberToDay(lastNumber + 1), { recursive: true });

const files = [
  { name: "README.md", data: newReadme(day) },
  { name: "index.ts", data: newIndex(day) },
  { name: "input.txt", data: "" },
  { name: "test-input.txt", data: "" },
];

for (let file of files) {
  await Bun.write(`${day}/${file.name}`, file.data);
}
