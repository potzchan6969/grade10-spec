import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(
  new URL("./archive-preflight.mjs", import.meta.url),
);
const CHANGE = "build-alpha";

/** The script roots itself on its own location, so a throwaway store carries a
 * throwaway copy of it. `files` are written under the change, `durable` under
 * `openspec/specs`; both take `a/b/c.md` keys. Returns the copy to run and the
 * manifest it writes. */
function sandbox(files, durable = {}) {
  const root = mkdtempSync(join(tmpdir(), "archive-preflight-"));
  const script = join(root, "scripts", "openspec", "archive-preflight.mjs");
  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(SCRIPT, script);
  const dir = join(root, "openspec", "changes", CHANGE);
  mkdirSync(dir, { recursive: true });
  const write = (base, tree) => {
    for (const [name, content] of Object.entries(tree)) {
      const file = join(base, ...name.split("/"));
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
    }
  };
  write(dir, files);
  write(join(root, "openspec", "specs"), durable);
  return { script, manifest: join(dir, ".openspec.yaml") };
}

const run = (script, ...args) =>
  spawnSync(process.execPath, [script, CHANGE, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

const PROPOSAL = { "proposal.md": "# Build alpha\n\n## Why\n\nTo ship it.\n" };
const SHIPPED = ["--deployed-at", "0f1e2d3", "--deployed-env", "production"];

test("refuses a deployed sha naming no environment", () => {
  const { script } = sandbox(PROPOSAL);
  const result = run(script, "--deployed-at", "0f1e2d3");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--deployed-at needs --deployed-env/);
});

test("refuses an unchecked task until a waiver names the decision", () => {
  const files = {
    ...PROPOSAL,
    "tasks.md": "## 1. Build it\n\n- [x] 1.1 Ship it\n- [ ] 1.2 Log it\n",
  };
  const refused = run(sandbox(files).script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /1 task\(s\) unchecked/);
  assert.match(refused.stderr, /- \[ \] 1\.2 Log it/);

  const waived = run(
    sandbox(files).script,
    ...SHIPPED,
    "--tasks-waived",
    "@echo, the logging ships separately",
  );
  assert.equal(waived.status, 0);
});

test("a clear run writes the record quoted, over the waiver it replaces", () => {
  const { script, manifest } = sandbox({
    ...PROPOSAL,
    ".openspec.yaml":
      'schema: grade10-planning\ndeploy_waived: "@echo, nothing shipped"\n',
  });
  const result = run(script, ...SHIPPED);

  assert.equal(result.status, 0);
  assert.equal(
    readFileSync(manifest, "utf8"),
    'schema: grade10-planning\ndeployed_at: "0f1e2d3"\ndeployed_env: "production"\n',
  );
});

// ── The carry gate ──────────────────────────────────────────────────────────
// A capability that archives cleanly, and the pieces to break one at a time.
const CAP = "site/store/listing";
const PURPOSE = "## Purpose\n\nCollectors find a card and buy it.\n\n";
const FEATURE_SET = "## Feature set\n\n- Search\n\n";
const REQUIREMENTS = "## Requirements\n\n### Requirement: Search\n\nIt searches.\n";
const STORY = "### listing-US-01: Collector searches the catalogue\n\n**As a** collector,\n**I want** to search,\n**so that** I find a card.\n";
const SUITE = "# Feature test cases\n\n## Settled\n\n- A sold listing is not an error state · refused 2026-09-01\n";

const CARRIED = {
  ...PROPOSAL,
  [`specs/${CAP}/spec.md`]: PURPOSE + FEATURE_SET + REQUIREMENTS,
  [`specs/${CAP}/user-journeys.md`]: `# User journeys\n\n## ADDED User journeys\n\n${STORY}`,
  [`specs/${CAP}/feature-tcs.md`]: SUITE,
};
const DURABLE = {
  [`${CAP}/spec.md`]: PURPOSE + FEATURE_SET + REQUIREMENTS,
  [`${CAP}/user-journeys.md`]: `# User journeys\n\n${STORY}`,
  [`${CAP}/feature-tcs.md`]: SUITE,
};

test("a change whose sections all landed is clear", () => {
  const result = run(sandbox(CARRIED, DURABLE).script, ...SHIPPED);
  assert.equal(result.status, 0);
});

test("refuses a durable purpose the change replaced and archive left behind", () => {
  const stale = {
    ...DURABLE,
    [`${CAP}/spec.md`]:
      "## Purpose\n\nCollectors browse.\n\n" + FEATURE_SET + REQUIREMENTS,
  };
  const result = run(sandbox(CARRIED, stale).script, ...SHIPPED);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /`## Purpose`/);
  assert.match(result.stderr, /still holds a different one/);
});

test("refuses a removed journey that leaves no tombstone, and takes one that does", () => {
  const files = {
    ...CARRIED,
    [`specs/${CAP}/user-journeys.md`]: `# User journeys\n\n## REMOVED User journeys\n\n${STORY}\n**Reason:** search is gone.\n`,
  };
  const deleted = {
    ...DURABLE,
    [`${CAP}/user-journeys.md`]: "# User journeys\n",
  };
  const refused = run(sandbox(files, deleted).script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /listing-US-01` is removed and leaves no/);

  const both = {
    ...DURABLE,
    [`${CAP}/user-journeys.md`]: `# User journeys\n\n${STORY}\n## Retired\n\n- \`listing-US-01\` - removed in \`build-alpha\`\n`,
  };
  const stillWritten = run(sandbox(files, both).script, ...SHIPPED);
  assert.equal(stillWritten.status, 1);
  assert.match(stillWritten.stderr, /still written above it/);

  const tombstoned = {
    ...DURABLE,
    [`${CAP}/user-journeys.md`]:
      "# User journeys\n\n## Retired\n\n- `listing-US-01` - Collector searches the catalogue · removed in `build-alpha` · 2026-09-15\n",
  };
  assert.equal(run(sandbox(files, tombstoned).script, ...SHIPPED).status, 0);
});

test("refuses a carried Reconciliation that keeps its scenario ids", () => {
  const withIds = {
    ...DURABLE,
    [`${CAP}/feature-tcs.md`]:
      SUITE +
      "\n## Reconciliation\n\n- `listing-SC-04` covers the empty result · accepted\n",
  };
  const result = run(sandbox(CARRIED, withIds).script, ...SHIPPED);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /scenario id\(s\) not stripped \(listing-SC-04\)/);
});

test("refuses a suite carried without its Settled lines, waiver or no waiver", () => {
  const dropped = {
    ...DURABLE,
    [`${CAP}/feature-tcs.md`]: "# Feature test cases\n",
  };
  const result = run(sandbox(CARRIED, dropped).script, ...SHIPPED);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /drops 1 `## Settled` line/);

  const forced = run(
    sandbox(CARRIED, dropped).script,
    ...SHIPPED,
    "--journeys-copied",
  );
  assert.equal(forced.status, 1);
  assert.match(forced.stderr, /none of this is waivable/);
});

test("a suite with no durable file yet is a promise --journeys-copied can make", () => {
  const { [`${CAP}/feature-tcs.md`]: _suite, ...missing } = DURABLE;
  const refused = run(sandbox(CARRIED, missing).script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /feature-tcs\.md`  · nothing durable yet/);

  const acknowledged = run(
    sandbox(CARRIED, missing).script,
    ...SHIPPED,
    "--journeys-copied",
  );
  assert.equal(acknowledged.status, 0);
});
