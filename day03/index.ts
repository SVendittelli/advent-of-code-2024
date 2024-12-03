import { readFile } from "../utils";

const path = "day03/input.txt";
const lines = await readFile(path);

const input = lines.join(" ");

const regex = /(mul\([0-9]{1,3},[0-9]{1,3}\))|(do\(\))|(don't\(\))/g;
const matches = input.matchAll(regex);

let enabled = true;
const [total1, total2] = matches
  .map(([match]) => {
    switch (match) {
      case "do()":
        enabled = true;
        break;
      case "don't()":
        enabled = false;
        break;
      default:
        const comma = match.indexOf(",");
        const num1 = +match.substring(4, comma);
        const num2 = +match.substring(comma + 1, match.length - 1);
        return [num1 * num2, enabled ? num1 * num2 : 0];
    }
  })
  .map((x) => x ?? [0, 0])
  .reduce(
    ([acc1, acc2], [curr1, curr2]) => [acc1 + curr1, acc2 + curr2],
    [0, 0],
  );

console.log("part 1", total1);
console.log("part 2", total2);
