import { readFile } from "../utils";

const path = "day01/input.txt";
const lines = await readFile(path);

const list1: number[] = [];
const list2: number[] = [];
const dict: Record<number, number> = {};

for (let i = 0; i < lines.length; ++i) {
  const line = lines[i];
  const endOfFirstWord = line.indexOf(" ");
  if (endOfFirstWord === -1) continue;

  const firstWord = +line.slice(0, endOfFirstWord);
  const lastWord = +line.slice(endOfFirstWord).trim();

  list1.push(firstWord);
  list2.push(lastWord);
  dict[lastWord] = dict[lastWord] ? dict[lastWord] + 1 : 1;
}

list1.sort();
list2.sort();

let acc1 = 0;
let acc2 = 0;
for (let i = 0; i < list1.length; ++i) {
  const diff = Math.abs(list1[i] - list2[i]);
  acc1 += diff;
  const score = list1[i] * (dict[list1[i]] ?? 0);
  acc2 += score;
}

console.log("part 1", acc1);
console.log("part 2", acc2);
