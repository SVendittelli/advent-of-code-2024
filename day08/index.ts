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

  const antinodesByFrequency: Record<string, Location[]> = {};
  for (let frequency in antennas) {
    antinodesByFrequency[frequency] ??= [];
    const freqPairs: Pair[] = antennas[frequency].flatMap((a, i) =>
      antennas[frequency]
        .slice(i + 1)
        .map((b) => ({ a, b, displacement: { x: b.x - a.x, y: b.y - a.y } })),
    );
    freqPairs.forEach(({ a, b, displacement }) => {
      antinodesByFrequency[frequency].push({
        x: a.x - displacement.x,
        y: a.y - displacement.y,
      });
      antinodesByFrequency[frequency].push({
        x: b.x + displacement.x,
        y: b.y + displacement.y,
      });
    });
  }

  const antinodes = Object.values(antinodesByFrequency)
    .flat()
    .filter(
      (antinode) =>
        antinode.x >= 0 &&
        antinode.x < lines[0].length &&
        antinode.y >= 0 &&
        antinode.y < lines.length,
    );
  const uniqueAntinodes = antinodes.filter(
    (loc, idx) =>
      antinodes.findIndex((el) => el.x === loc.x && el.y === loc.y) === idx,
  );

  return [uniqueAntinodes.length, 0];
};

export default run;
