import { run, bench } from "mitata";
import { allDays, runDay } from ".";

const days = await allDays();

bench("$day", async function* benchmark(state: any) {
  const day = state.get("day");
  yield async () => await runDay(day);
}).args("day", days);

await run();
