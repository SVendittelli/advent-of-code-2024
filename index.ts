import { parseArgs } from "util";
import { allDays, numberToDay } from "./utils";

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
  const day = numberToDay(+values.day);
  await import(`./${day}`);
} else {
  // Run all days
  const days = await allDays();

  for (let i = 0; i < days.length; ++i) {
    const day = days[i];
    console.group(day);
    await import(`./${day}`);
    console.groupEnd();
  }
}
