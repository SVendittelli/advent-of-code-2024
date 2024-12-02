import { parseArgs } from "util";
import { readdir } from "node:fs/promises";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    day: {
      type: "string",
      short: "d",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.day) {
  // Run a specific day
  const day = `${values.day}`.padStart(2, "0");
  import(`./day${day}`);
} else {
  // Run all days
  const directories = (await readdir(import.meta.dir, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

  const days = directories.filter((dir) => /day[0-9]+/.test(dir)).toSorted();

  for (let i = 0; i < days.length; ++i) {
    const day = days[i];
    console.group(day);
    await import(`./${day}`);
    console.groupEnd();
  }
}
