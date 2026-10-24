/*
 * The paths the test-case rules live in, which only their owner may change -
 * the team map's handle that `owns: [tcs-rules]`: the rulebook, the suite
 * template and the `spec-to-tcs` skill, which decide what every suite holds.
 * The conventions say only how a case reads, and stay open. Read by
 * `tcs-rules-owner.mjs`, and by the push gate to know when it owes that check;
 * dependency-free so the gate's path reading stays so.
 */

/** What the owner alone may change. A trailing `/` names a directory. */
export const OWNED = [
  "docs/governance/specs-to-test-cases.md",
  "openspec/schemas/grade10-planning/templates/feature-tcs.md",
  ".claude/skills/spec-to-tcs/",
];

export const isOwned = (path) =>
  OWNED.some((one) =>
    one.endsWith("/") ? path.startsWith(one) : path === one,
  );
