import type { Run } from "~/utils/types";
import { readFile } from "~/utils";

type Location = {
  x: number;
  y: number;
};
type Antennas = Record<string, Location[]>;
type Pair = {
  a: Location;
  b: Location;
  displacement: { x: number; y: number };
};

const isOnMap = (map: string[], loc: Location): boolean =>
  loc.x >= 0 && loc.x < map[0].length && loc.y >= 0 && loc.y < map.length;
const diff = (a: Location, b: Location): Location => ({
  x: a.x - b.x,
  y: a.y - b.y,
});
const sum = (a: Location, b: Location): Location => ({
  x: a.x + b.x,
  y: a.y + b.y,
});
const filterUnique = (list: Location[]): Location[] =>
  list.filter(
    (el1, idx) =>
      list.findIndex((el2) => el1.x === el2.x && el1.y === el2.y) === idx,
  );

const run: Run = async () => {
  const filePath = "day08/input.txt";
  const lines = await readFile(filePath);

  const antennas: Antennas = {};
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[0].length; ++x) {
      const frequency = lines[y][x];
      if (frequency === ".") continue;
      antennas[frequency] ??= [];
      antennas[frequency].push({ x, y });
    }
  }

  const antinodes: Location[] = [];
  const harmonicAntinodes: Location[] = [];
  for (let frequency in antennas) {
    const freqPairs: Pair[] = antennas[frequency].flatMap((a, i) =>
      antennas[frequency]
        .slice(i + 1)
        .map((b) => ({ a, b, displacement: diff(b, a) })),
    );

    freqPairs.forEach(({ a, b, displacement }) => {
      // part 1
      let prev = diff(a, displacement);
      let prevOnMap = isOnMap(lines, prev);
      if (prevOnMap) antinodes.push(prev);
      let next = sum(b, displacement);
      let nextOnMap = isOnMap(lines, next);
      if (nextOnMap) antinodes.push(next);

      // part 2
      prev = diff(b, displacement);
      prevOnMap = isOnMap(lines, prev);
      while (prevOnMap) {
        harmonicAntinodes.push(prev);
        prev = diff(prev, displacement);
        prevOnMap = isOnMap(lines, prev);
      }
      next = sum(a, displacement);
      nextOnMap = isOnMap(lines, next);
      while (nextOnMap) {
        harmonicAntinodes.push(next);
        next = sum(next, displacement);
        nextOnMap = isOnMap(lines, next);
      }
    });
  }

  const uniqueAntinodes = filterUnique(antinodes);
  const uniqueHarmonicAntinodes = filterUnique(harmonicAntinodes);

  return [uniqueAntinodes.length, uniqueHarmonicAntinodes.length];
};

export default run;
