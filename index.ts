import { parseArgs } from "util";
import { allDays, lastDay, numberToDay } from "./utils";
import type { Day } from "./utils/types";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    day: {
      type: "string",
      short: "d",
    },
    all: {
      type: "boolean",
      short: "a",
    },
  },
  strict: true,
  allowPositionals: true,
});

const runDay = async (day: Day) => {
  console.group(day);
  await import(`./${day}`);
  console.groupEnd();
};

if (values.all) {
  // Run all the days
  const days = await allDays();

  for (let i = 0; i < days.length; ++i) {
    const day = days[i];
    await runDay(day);
  }
} else if (values.day) {
  // Run a specific day
  const day = numberToDay(+values.day);
  await runDay(day);
} else {
  // Run last day
  const day = await lastDay();
  await runDay(day);
}
