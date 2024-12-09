import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

const range = (start: number, length: number): number[] => {
  return new Array(length).fill(null).map((_, i) => start + i);
};

const run: Run = async () => {
  const filePath = "day09/input.txt";
  const input = await readWholeFile(filePath);

  const digits = input.split("").map((char: string) => +char);

  let isFile = true;
  let drive: number[] = [];
  let id = 0;
  let lastBlockEnd = 0;
  for (let i = 0; i < digits.length; ++i) {
    drive = drive.concat(new Array(digits[i]).fill(isFile ? id : -1));
    if (isFile) ++id;
    isFile = !isFile;
    lastBlockEnd += digits[i];
  }

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
  return [checksum1, 0];
};

export default run;
