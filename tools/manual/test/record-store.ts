/**
 * The store built to test one of the record's rules against a change's
 * `.openspec.yaml` alone — `hands`, `landed_by` and `awaiting` each key off
 * that one file over a schema and a record text the caller supplies, so the
 * store around it is the same for every one of them: the pages
 * `runChecks` needs to run at all, and nothing else in the change to
 * confuse the reading.
 */
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

export type Finding = {
  rule: string;
  level: string;
  path: string;
  reason: string;
};

/** The pages every fixture carries, so the manual has a landing page to
 * point a product at — none of the record rules read them, but `runChecks`
 * needs them to run its page families without a finding of its own. */
const PAGES: Record<string, string> = {
  "docs/prds/manual.yaml":
    "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
  "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
  "docs/prds/products/demo-product/index.md":
    "---\ntitle: Demo product\n---\n\nThe landing.\n",
};

/** One handle, `alice`, on the `pm` role — the team map `hands` and
 * `landed_by` both resolve a written handle against. */
export const TEAM = [
  "handles:",
  "  alice:",
  "    email: alice@example.com",
  "    roles: [pm]",
  "channels: {}",
  "",
].join("\n");

/** A minimal proposal, so a change reads as one with nothing to say about
 * itself but its record. */
export const proposalOf = (title: string): string =>
  [
    `# ${title}`,
    "",
    "## Why",
    "",
    "So the checker has a change to read.",
    "",
  ].join("\n");

/**
 * The files one change's fixture is built from: the pages, an optional team
 * map, the schema, the record over `.openspec.yaml`, the proposal, and
 * whatever else the caller's own case needs beside them.
 */
export function recordStoreFiles({
  change,
  schema,
  record,
  team,
  title = "Demo",
  files = {},
}: {
  change: string;
  schema: string;
  record: string;
  /** Omitted where the rule under test never resolves a handle. */
  team?: string;
  title?: string;
  files?: Record<string, string>;
}): Record<string, string> {
  const dir = `openspec/changes/${change}`;
  return {
    ...PAGES,
    ...(team !== undefined ? { "docs/prds/team.yaml": team } : {}),
    "openspec/schemas/demo-planning/schema.yaml": schema,
    [`${dir}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-15\n${record}`,
    [`${dir}/proposal.md`]: proposalOf(title),
    ...files,
  };
}

/** Runs `check:manual` over a set of files and returns the findings of one
 * rule alone. */
export async function findingsOf(
  files: Record<string, string>,
  rule: string,
): Promise<Finding[]> {
  const root = writeStore(files);
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings.filter((one) => one.rule === rule);
}

/**
 * A `findings(record, rule)` bound to one change, one schema and one team —
 * the shape every record-rule suite calls with, so a case reads as `await
 * findings("hands:\n  pm: alice\n", "hands")` rather than re-building the
 * fixture's files by hand each time.
 */
export function findingsFrom(opts: {
  change: string;
  schema: string;
  team?: string;
  title?: string;
}): (record: string, rule: string) => Promise<Finding[]> {
  return (record, rule) =>
    findingsOf(recordStoreFiles({ ...opts, record }), rule);
}
