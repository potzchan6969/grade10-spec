import type { ChangeSuite } from "./types";

/**
 * A change's suites, summed once: the Delivery row's automated count against
 * the total, and the Suite chip's own title, both read the same counts
 * rather than two reductions that could drift apart.
 */
export function suiteTotalsOf(suites: ChangeSuite[]): {
  total: number;
  draft: number;
  actual: number;
  deprecated: number;
  automated: number;
} {
  return suites.reduce(
    (sum, suite) => ({
      total: sum.total + suite.cases.total,
      draft: sum.draft + suite.cases.draft,
      actual: sum.actual + suite.cases.actual,
      deprecated: sum.deprecated + suite.cases.deprecated,
      automated: sum.automated + suite.cases.automated,
    }),
    { total: 0, draft: 0, actual: 0, deprecated: 0, automated: 0 },
  );
}
