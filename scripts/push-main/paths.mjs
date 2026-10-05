/**
 * Where a set of changed paths lands, and which fast checks they owe.
 *
 * Planning text — a change's folder, a durable spec, a page — lands straight on
 * `main`: each change owns its own folder, so two people rarely meet there.
 * A shared surface — the packages, the preview and email apps, the tooling, the
 * schema, the agent instructions — goes through a pull request that merges
 * itself once CI is green, because every other change builds on it and the
 * pull request is where its full checks run.
 */

const SHARED = [
  /^packages\//,
  /^apps\//,
  /^scripts\//,
  /^tools\//,
  /^openspec\/schemas\//,
  /^openspec\/config\.yaml$/,
  /^\.github\//,
  /^\.githooks\//,
  /^\.claude\//,
  /^\.codex\//,
  /^\.cursor\//,
  /^(AGENTS|AGENT|CLAUDE|GEMINI)\.md$/,
  /^package\.json$/,
  /^pnpm-(lock|workspace)\.yaml$/,
  /^biome\.json$/,
  /^tsconfig[^/]*\.json$/,
  /^skills-lock\.json$/,
];

/** Files a planning tool rewrites to record where a change stands. */
const STATUS =
  /^openspec\/changes\/(?!archive\/)([^/]+)\/(tasks\.md|rounds\.md|implementation\.json|acceptance\.json|\.openspec\.yaml)$/;

const PLANNING = /^(openspec\/|docs\/prds\/)/;
const AGENT =
  /^(\.claude\/|\.codex\/|\.cursor\/|(AGENTS|AGENT|CLAUDE|GEMINI)\.md$)/;
const CHANGE = /^openspec\/changes\/(?!archive\/)([^/]+)\//;

export const isShared = (path) => SHARED.some((pattern) => pattern.test(path));

/**
 * `{ route, shared, checks }` for the paths a push sends. `route` is `main` or
 * `pr`; `shared` names the paths that made it `pr`; `checks` is what the gate
 * runs, cheapest first. A push that only moves status lines owes the change
 * validation for those changes alone, so a burst of claims stays fast.
 */
export function classify(paths) {
  const shared = paths.filter(isShared);
  const checks = [];
  if (paths.length) checks.push({ id: "biome" });

  const planning = paths.filter((path) => PLANNING.test(path));
  if (planning.length && planning.every((path) => STATUS.test(path))) {
    const ids = [...new Set(planning.map((path) => path.match(STATUS)[1]))];
    for (const id of ids) checks.push({ id: "changes", change: id });
  } else if (planning.length) {
    checks.push({ id: "changes" }, { id: "test-cases" }, { id: "manual" });
  }

  if (paths.some((path) => AGENT.test(path))) checks.push({ id: "parity" });
  return { route: shared.length ? "pr" : "main", shared, checks };
}

/** The change ids a set of paths touches, for the summary line. */
export const changesOf = (paths) => [
  ...new Set(paths.map((path) => path.match(CHANGE)?.[1]).filter(Boolean)),
];
