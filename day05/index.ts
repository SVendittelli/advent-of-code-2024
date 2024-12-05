import { readFile } from "../utils";

const pathOrder = "day05/input-order.txt";
const pathPages = "day05/input-pages.txt";
const linesOrder = await readFile(pathOrder);
const linesPages = await readFile(pathPages);

const map = {};
for (let i = 0; i < linesOrder.length; ++i) {
  const [smaller, larger] = linesOrder[i].split("|");
  map[smaller] = { lessThan: [...(map[smaller]?.lessThan ?? []), larger] };
}

const comparator = (a, b) => {
  const mapping = map[a];
  if (!mapping) return 0;

  return mapping.lessThan.includes(b) ? -1 : 1;
};

const pages1 = [];
const pages2 = [];
for (let i = 0; i < linesPages.length; ++i) {
  const list = linesPages[i].split(",");
  const sorted = list.toSorted(comparator);
  const areEqual = list.every((el, id) => el === sorted[id]);
  const middle = Math.floor(list.length / 2);
  if (areEqual) {
    pages1.push(sorted[middle]);
  } else {
    pages2.push(sorted[middle]);
  }
}

const total1 = pages1.reduce((acc, curr) => acc + +curr, 0);
const total2 = pages2.reduce((acc, curr) => acc + +curr, 0);
console.log("part 1", total1);
console.log("part 2", total2);
