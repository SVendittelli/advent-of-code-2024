const path = "day1/input.txt";
const file = Bun.file(path);

const input = await file.text();
const lines = input.split("\n");

const list1: number[] = [];
const dict: Record<number, number> = {};

for (let i = 0; i < lines.length; ++i) {
  const line = lines[i];
  const endOfFirstWord = line.indexOf(" ");
  if (endOfFirstWord === -1) continue;

  const firstWord = +line.slice(0, endOfFirstWord);
  const lastWord = +line.slice(endOfFirstWord).trim();

  list1.push(firstWord);
  dict[lastWord] = dict[lastWord] ? dict[lastWord] + 1 : 1;
}

let acc = 0;
for (let i = 0; i < list1.length; ++i) {
  const score = list1[i] * (dict[list1[i]] ?? 0);
  acc += score;
}

console.log(acc);
