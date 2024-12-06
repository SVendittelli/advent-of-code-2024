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
import { generateReport } from "~/utils/benchmark";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    all: {
      type: "boolean",
      short: "a",
    },
    benchmark: {
      type: "boolean",
      short: "b",
    },
    day: {
      type: "string",
      short: "d",
    },
  },
  strict: true,
  allowPositionals: true,
});

/** Solve a problem for a given day */
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

/** Generate performance benchmarks for a given day */
const report = async (day: Day) => {
  console.group(day);
  console.log("generate report...");
  await generateReport(day);
  console.log("done");
  console.groupEnd();
};

/** Execute either solution of benchmark for a given day, based on passed flags */
const exec = async (day: Day) => {
  if (values.benchmark) {
    return report(day);
  } else {
    return run(day);
  }
};

if (values.all) {
  // Run all the days
  const days = await allDays();

  for (let i = 0; i < days.length; ++i) {
    const day = days[i];
    await exec(day);
  }
} else if (values.day) {
  // Run a specific day
  const day = numberToDay(+values.day);
  await exec(day);
} else {
  // Run last day
  const day = await lastDay();
  await exec(day);
}
