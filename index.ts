import { parseArgs } from "util";
import {
  allDays,
  lastDay,
  numberToDay,
  runDay,
  timerStart,
  timerStop,
} from "~/utils";
import type { Day } from "~/utils/types";

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

const run = async (day: Day) => {
  console.group(day);
  console.log("running...");
  const start = timerStart("done");
  const [part1, part2] = await runDay(day);
  console.log("part 1", part1);
  console.log("part 2", part2);
  timerStop(start);
  console.groupEnd();
};

if (values.all) {
  // Run all the days
  const days = await allDays();

  const start = timerStart("all");
  for (let i = 0; i < days.length; ++i) {
    const day = days[i];
    await run(day);
  }
  timerStop(start);
} else if (values.day) {
  // Run a specific day
  const day = numberToDay(+values.day);
  await run(day);
} else {
  // Run last day
  const day = await lastDay();
  await run(day);
}
