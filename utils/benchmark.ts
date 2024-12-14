import { run, bench } from "mitata";
import type { Day } from "~/utils/types";
import { allDays, runDay } from ".";

const benchAll = async () => {
  const days = await allDays();

  bench("$day", async function* benchmark(state: any) {
    const day = state.get("day");
    yield async () => await runDay(day);
  }).args("day", days);

  return run();
};

const benchDay = async (day: Day) => {
  bench(async () => await runDay(day, true));

  return run({ format: "quiet" }).then(({ benchmarks }) => benchmarks);
};

const NANO_SECONDS = 1_000_000_000;

export const generateReport = async (day: Day) => {
  const benchmarks = await benchDay(day);
  const { stats } = benchmarks[0].runs[0];
  if (!stats) return;
  const results = {
    avg: stats.avg / NANO_SECONDS,
    min: stats.min / NANO_SECONDS,
    max: stats.max / NANO_SECONDS,
  };

  const path = `${day}/README.md`;
  const current = await Bun.file(path).text();
  const splits = current.split("```");
  splits[1] = "json\n" + JSON.stringify(results, null, 2) + "\n";

  Bun.write(path, splits.join("```"));
};

if (import.meta.path === Bun.main) {
  await benchAll();
}
