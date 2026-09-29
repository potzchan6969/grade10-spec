/*
 * What the rounds read back from an agent: the diagnosis's keyed lines, a
 * verdict table, and the paths a fix may not touch.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseDiagnosis,
  parseFindings,
  parseVerdicts,
  parseVerified,
  protectedPaths,
} from "./lib/parse.mjs";

test("a diagnosis yields its four keyed lines, bold or plain", () => {
  const said = parseDiagnosis(
    "**Lane:** Bug - restores the design\nLands in: `here`\nTest: `pnpm exec vitest run x`\nCommit: `fix(ui): keep the ring`\n",
  );
  assert.deepEqual(
    { ...said, missing: said.missing.length },
    {
      lane: "bug",
      landsIn: "here",
      test: "pnpm exec vitest run x",
      subject: "fix(ui): keep the ring",
      missing: 0,
    },
  );
});

test("a diagnosis missing a line names it, and a subject that is not a fix is missing", () => {
  const said = parseDiagnosis(
    "Lane: bug\nTest: node t.mjs\nCommit: feat(ui): add a ring\n",
  );
  assert.deepEqual(said.missing, [
    "Lands in: here|<owner/repo>",
    "Test: `<command>`",
    "Commit: fix(<domain>): <outcome>",
  ]);
});

test("verdict rows are read off the last cell, and anything else is unread", () => {
  const rows = parseVerdicts(
    "| # | Where | Finding | Principle | Verdict |\n| --- | --- | --- | --- | --- |\n| qa-1 | a | b | c | stands - why |\n| s-1 | a | b | c | `falls` - why |\n| t-1 | a | b | c | asks - recommend x |\n| t-2 | a | b | c | maybe |",
  );
  assert.deepEqual(
    rows.map(({ verdict }) => verdict),
    ["stands", "falls", "asks", "unread"],
  );
});

test("a verdict in bold or code, as a verifier writes one, is still read", () => {
  const rows = parseVerdicts(
    "| qa 1 | a | b | - | **stands** — the template requires it |\n| s 1 | a | b | c | *falls* - fine |\n| t 1 | a | b | c | `asks` - which |",
  );
  assert.deepEqual(
    rows.map(({ verdict }) => verdict),
    ["stands", "falls", "asks"],
  );
  const lone = parseFindings(
    "| 1 | a | b | **blocks** |\n| 2 | a | b | *note* |",
  );
  assert.deepEqual(
    lone.map(({ verdict }) => verdict),
    ["stands", "falls"],
  );
});

test("a lone reader's blocks and fix findings stand, its notes fall", () => {
  const rows = parseFindings(
    "| # | Where | Finding | Severity |\n| --- | --- | --- | --- |\n| 1 | a | b | blocks |\n| 2 | a | b | `fix` |\n| 3 | a | b | note |",
  );
  assert.deepEqual(
    rows.map(({ verdict }) => verdict),
    ["stands", "stands", "falls"],
  );
});

test("only an explicit yes verifies", () => {
  assert.equal(parseVerified("Verified: yes\nran it"), true);
  assert.equal(parseVerified("**Verified:** no"), false);
  assert.equal(parseVerified("It looks verified."), false);
});

test("CI, manifests, instructions, the planning record and a pin are protected; code is not", () => {
  assert.deepEqual(
    protectedPaths([
      ".github/workflows/x.yml",
      "packages/ui/package.json",
      "pnpm-lock.yaml",
      "AGENTS.md",
      ".claude/skills/x/SKILL.md",
      "openspec/specs/a/spec.md",
      "docs/prds/products/a.md",
      "external/grade10-spec",
      "apps/web/tsconfig.app.json",
      "packages/ui/src/blocks/a.tsx",
      "docs/governance/bug-fixes.md",
    ]),
    [
      ".github/workflows/x.yml",
      "packages/ui/package.json",
      "pnpm-lock.yaml",
      "AGENTS.md",
      ".claude/skills/x/SKILL.md",
      "openspec/specs/a/spec.md",
      "docs/prds/products/a.md",
      "external/grade10-spec",
      "apps/web/tsconfig.app.json",
    ],
  );
});
