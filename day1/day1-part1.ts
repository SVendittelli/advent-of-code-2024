const path = "day1/input.txt";
const file = Bun.file(path);

const input = await file.text();
const lines = input.split("\n");

const list1: number[] = [];
const list2: number[] = [];

for (let i = 0; i < lines.length; ++i) {
  const line = lines[i];
  const endOfFirstWord = line.indexOf(" ");
  if (endOfFirstWord === -1) continue;

  const firstWord = +line.slice(0, endOfFirstWord);
  const lastWord = +line.slice(endOfFirstWord).trim();

  list1.push(firstWord);
  list2.push(lastWord);
}

list1.sort();
list2.sort();

let acc = 0;
for (let i = 0; i < list1.length; ++i) {
  const diff = Math.abs(list1[i] - list2[i]);
  acc += diff;
}

console.log(acc);
