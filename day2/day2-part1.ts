const path = "day2/input.txt";
const file = Bun.file(path);

const input = await file.text();
const lines = input.trim().split("\n");

const safetyChecker = (levels: number[]) => {
  let direction = Math.sign(levels[0] - levels[1]);
  if (direction === 0) return false;

  for (let i = 0; i < levels.length - 1; ++i) {
    const newDirection = Math.sign(levels[i] - levels[i + 1]);
    const diff = Math.abs(levels[i] - levels[i + 1]);
    if (newDirection !== direction || diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
};

let count = 0;
for (let i = 0; i < lines.length; ++i) {
  const line = lines[i];
  const levels = line.split(" ").map((level) => +level);

  if (safetyChecker(levels)) ++count;
}

console.log(count);
