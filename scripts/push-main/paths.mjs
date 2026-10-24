/**
 * Which fast checks a set of changed paths owes.
 *
 * Every path lands on `main` directly, shared or not: teammates push `main`
 * rather than open pull requests, so the gate that runs before the push is
 * what checks the paths. Planning text owes the planning checks, a status file
 * owes only its change's validation, stories and whatever cites them owe the
 * story check, and the agent instructions owe parity.
 */

import { isOwned } from "../openspec/lib/tcs-rules.mjs";

/** Files a planning tool rewrites to record where a change stands. */
const STATUS =
  /^openspec\/changes\/(?!archive\/)([^/]+)\/(tasks\.md|rounds\.md|implementation\.json|acceptance\.json|\.openspec\.yaml)$/;

const PLANNING = /^(openspec\/|docs\/)/;
const AGENT =
  /^(\.claude\/|\.codex\/|\.cursor\/|(AGENTS|AGENT|CLAUDE|GEMINI)\.md$)/;
const CHANGE = /^openspec\/changes\/(?!archive\/)([^/]+)\//;
/** Where a story lives, or a story id is cited. */
const STORIES =
  /^(apps\/preview\/|packages\/ui\/src\/|packages\/design-system\/src\/|docs\/|openspec\/)/;

/**
 * `{ checks }` for the paths a push sends: what the gate runs, cheapest first.
 * A push that only moves status lines owes the change validation for those
 * changes alone, so a burst of claims stays fast.
 */
export function classify(paths) {
  const checks = [];
  if (paths.length) checks.push({ id: "biome" });

  const planning = paths.filter((path) => PLANNING.test(path));
  if (planning.length && planning.every((path) => STATUS.test(path))) {
    const ids = [...new Set(planning.map((path) => path.match(STATUS)[1]))];
    for (const id of ids) checks.push({ id: "changes", change: id });
  } else if (planning.length) {
    checks.push({ id: "changes" }, { id: "test-cases" }, { id: "manual" });
  }

  if (paths.some((path) => STORIES.test(path) && !STATUS.test(path)))
    checks.push({ id: "stories" });
  if (paths.some((path) => AGENT.test(path))) checks.push({ id: "parity" });
  if (paths.some(isOwned)) checks.push({ id: "rules-owner" });
  return { checks };
}

/** The change ids a set of paths touches, for the summary line. */
export const changesOf = (paths) => [
  ...new Set(paths.map((path) => path.match(CHANGE)?.[1]).filter(Boolean)),
];
