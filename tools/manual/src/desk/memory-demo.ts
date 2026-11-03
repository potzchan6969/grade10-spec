import type { MarkInput, Surface } from "../api/desk.ts";
import type { Snapshot } from "../api/types.ts";
import { MemoryDesk } from "./memory-desk.ts";
import { runSpecFromSuites } from "./suite-run.ts";

const DEMO_SUITE = /\/store\/tests\/cart-tcs\.md$/;

/** A memory desk holding one run of the store's cart suite, part walked, so
 * `?desk=memory` shows the desk at work. */
export async function demoDesk(snapshot: Snapshot): Promise<MemoryDesk> {
  const desk = new MemoryDesk("chloe@9gag.com");
  const suites = (snapshot.suites ?? []).filter((one) =>
    DEMO_SUITE.test(one.path),
  );
  if (suites.length === 0) return desk;
  const spec = runSpecFromSuites(suites, {
    name: "store-stage1 · cart",
    env: "staging-1",
    selection: "the store's cart suite",
    source: snapshot.storeHead,
    phase: "store-launch-1",
  });
  const run = await desk.openRun(spec, "5");
  const view = await desk.run(run.id);
  let n = 0;
  const id = () => {
    n += 1;
    return `demo-${n}`;
  };
  const mark = (
    row: string,
    surface: Surface,
    value: MarkInput["value"],
    extra: Partial<MarkInput> = {},
  ) => desk.mark(run.id, [{ id: id(), row, surface, value, ...extra }]);
  const walked = view.rows.slice(0, Math.floor(view.rows.length / 3));
  for (const [at, row] of walked.entries()) {
    const failed = at % 11 === 7;
    await mark(
      row.key,
      "web",
      failed ? "fail" : "pass",
      failed ? { expectation: 0, triage: "bug" } : {},
    );
    if (at % 3 !== 0) continue;
    const blocked = at % 9 === 3;
    await mark(
      row.key,
      "mobile",
      blocked ? "blocked" : "pass",
      blocked ? { triage: "environment" } : {},
    );
  }
  const walk = spec.walks[0];
  if (walk)
    await desk.observe(
      run.id,
      [0, 1, 2].map((step) => ({ id: id(), walk: walk.id, step, seen: true })),
    );
  return desk;
}
