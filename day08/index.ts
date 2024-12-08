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
const backwards = (pos: Location, dir: Location): Location => ({
  x: pos.x - dir.x,
  y: pos.y - dir.y,
});
const forwards = (pos: Location, dir: Location): Location => ({
  x: pos.x + dir.x,
  y: pos.y + dir.y,
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
  for (let row = 0; row < lines.length; ++row) {
    for (let col = 0; col < lines[0].length; ++col) {
      const frequency = lines[row][col];
      if (frequency === ".") continue;
      antennas[frequency] ??= [];
      antennas[frequency].push({ x: col, y: row });
    }
  }

  const antinodes: Location[] = [];
  const harmonicAntinodes: Location[] = [];
  for (let frequency in antennas) {
    const freqPairs: Pair[] = antennas[frequency].flatMap((a, i) =>
      antennas[frequency]
        .slice(i + 1)
        .map((b) => ({ a, b, displacement: { x: b.x - a.x, y: b.y - a.y } })),
    );
    freqPairs.forEach(({ a, b, displacement }) => {
      // part 1
      let prev = backwards(a, displacement);
      let prevOnMap = isOnMap(lines, prev);
      if (prevOnMap) antinodes.push(prev);
      let next = forwards(b, displacement);
      let nextOnMap = isOnMap(lines, next);
      if (nextOnMap) antinodes.push(next);

      // part 2
      prev = backwards(b, displacement);
      prevOnMap = isOnMap(lines, prev);
      while (prevOnMap) {
        harmonicAntinodes.push(prev);
        prev = backwards(prev, displacement);
        prevOnMap = isOnMap(lines, prev);
      }
      next = forwards(a, displacement);
      nextOnMap = isOnMap(lines, next);
      while (nextOnMap) {
        harmonicAntinodes.push(next);
        next = forwards(next, displacement);
        nextOnMap = isOnMap(lines, next);
      }
    });
  }

  const uniqueAntinodes = filterUnique(antinodes);
  const uniqueHarmonicAntinodes = filterUnique(harmonicAntinodes);

  return [uniqueAntinodes.length, uniqueHarmonicAntinodes.length];
};

export default run;
