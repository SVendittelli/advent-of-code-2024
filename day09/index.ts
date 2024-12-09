import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

type Segment = {
  start: number;
  length: number;
};
type FileSegment = Segment & { id: number };

const range = (start: number, length: number): number[] => {
  return new Array(length).fill(null).map((_, i) => start + i);
};

const run: Run = async () => {
  const filePath = "day09/input.txt";
  const input = await readWholeFile(filePath);

  const digits = input.split("").map((char: string) => +char);

  let isFile = true;
  let drive: number[] = [];
  const files: FileSegment[] = [];
  const free: Segment[] = [];
  let id = 0;
  let lastBlockEnd = 0;

  for (let i = 0; i < digits.length; ++i) {
    const length = digits[i];

    // Part 1
    drive = drive.concat(new Array(length).fill(isFile ? id : -1));

    // Part 2
    if (isFile) {
      files.push({
        id,
        start: lastBlockEnd,
        length,
      });
    } else {
      free.push({
        start: lastBlockEnd,
        length,
      });
    }

    // Post updates
    if (isFile) ++id;
    isFile = !isFile;
    lastBlockEnd += length;
  }

  // Part 1
  let firstFreeBlockIndex = drive.indexOf(-1);
  let lastFileBlockIndex = drive.findLastIndex((el) => el !== -1);

  while (firstFreeBlockIndex < lastFileBlockIndex) {
    drive[firstFreeBlockIndex] = drive[lastFileBlockIndex];
    drive[lastFileBlockIndex] = -1;

    firstFreeBlockIndex = drive.indexOf(-1);
    lastFileBlockIndex = drive.findLastIndex((el) => el !== -1);
  }

  const checksum1 = drive.reduce(
    (acc, el, idx) => (el !== -1 ? acc + el * idx : acc),
    0,
  );

  // Part 2
  for (let i = files.length - 1; i >= 0; --i) {
    for (let j = 0; j < free.length; ++j) {
      if (files[i].start < free[j].start) break;
      if (free[j].length >= files[i].length) {
        files[i].start = free[j].start;
        free[j].start += files[i].length;
        free[j].length -= files[i].length;
      }
    }
  }

  const checksum2 = files
    .flatMap(({ id, start, length }) =>
      range(start, length).map((block) => block * id),
    )
    .reduce((acc, el) => acc + el, 0);

  return [checksum1, checksum2];
};

export default run;
