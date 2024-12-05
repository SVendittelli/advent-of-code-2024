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

const pages = [];
for (let i = 0; i < linesPages.length; ++i) {
  const list = linesPages[i].split(",");
  const sorted = list.toSorted(comparator);
  const areEqual = list.every((el, id) => el === sorted[id]);
  if (areEqual) {
    const middle = Math.floor(list.length / 2);
    pages.push(list[middle]);
  }
}

const total1 = pages.reduce((acc, curr) => acc + +curr, 0);
console.log(total1);
