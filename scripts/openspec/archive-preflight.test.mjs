import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
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

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "build-alpha";

/** The script roots itself on its own location, so a throwaway store carries a
 * throwaway copy of it, committed with `origin/main` at that commit. `files`
 * are written under the change, `durable` under `openspec/specs`; both take
 * `a/b/c.md` keys. Returns the copy to run, the manifest it writes, the
 * change's `tasks.md`, and git in the store. */
function sandbox(files, durable = {}) {
  const root = mkdtempSync(join(tmpdir(), "archive-preflight-"));
  const scripts = join(root, "scripts", "openspec");
  mkdirSync(scripts, { recursive: true });
  for (const name of ["archive-preflight.mjs", "store-main.mjs"]) {
    copyFileSync(join(SCRIPTS, name), join(scripts, name));
  }
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

  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=preflight@test", "-c", "user.name=preflight", ...args],
      { cwd: root, stdio: "ignore" },
    );
  git("init", "--quiet", ".");
  git("add", "-A");
  git("commit", "--quiet", "-m", "the store");
  git("update-ref", "refs/remotes/origin/main", "HEAD");

  return {
    script: join(scripts, "archive-preflight.mjs"),
    manifest: join(dir, ".openspec.yaml"),
    tasks: join(dir, "tasks.md"),
    git,
  };
}

const run = (script, ...args) =>
  spawnSync(process.execPath, [script, CHANGE, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1" },
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

const DONE = "## 1. Build it\n\n- [x] 1.1 Ship it\n- [x] 1.2 Log it\n";
const OPEN = "## 1. Build it\n\n- [x] 1.1 Ship it\n- [ ] 1.2 Log it\n";

test("reads the checkmarks on the store's main, not in this checkout", () => {
  const behind = sandbox({ ...PROPOSAL, "tasks.md": DONE });
  writeFileSync(behind.tasks, OPEN);
  const passed = run(behind.script, ...SHIPPED);
  assert.equal(passed.status, 0, passed.stderr);

  const ticked = sandbox({ ...PROPOSAL, "tasks.md": OPEN });
  writeFileSync(ticked.tasks, DONE);
  const refused = run(ticked.script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /1 task\(s\) unchecked/);
});

test("refuses a plan main does not hold, and a store with no main", () => {
  const unmerged = sandbox(PROPOSAL);
  writeFileSync(unmerged.tasks, DONE);
  const notOnMain = run(unmerged.script, ...SHIPPED);
  assert.equal(notOnMain.status, 1);
  assert.match(notOnMain.stderr, /tasks\.md is not on origin\/main/);

  const orphan = sandbox({ ...PROPOSAL, "tasks.md": DONE });
  orphan.git("update-ref", "-d", "refs/remotes/origin/main");
  const noMain = run(orphan.script, ...SHIPPED);
  assert.equal(noMain.status, 1);
  assert.match(noMain.stderr, /no origin main/);
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

test("treats a store-only plan with an owner tag as store-only", () => {
  const result = run(
    sandbox({
      ...PROPOSAL,
      "tasks.md":
        "## 1. Store work (grade10-spec) (owner: @echo)\n\n- [x] 1.1 Ship it\n",
    }).script,
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No deploy record is owed/);
});

// ── The carry gate ──────────────────────────────────────────────────────────
// A capability that archives cleanly, and the pieces to break one at a time.
const CAP = "site/store/listing";
const PURPOSE = "## Purpose\n\nCollectors find a card and buy it.\n\n";
const FEATURE_SET = "## Feature set\n\n- Search\n\n";
const REQUIREMENTS =
  "## Requirements\n\n### Requirement: Search\n\nIt searches.\n";
const STORY =
  "### listing-US-01: Collector searches the catalogue\n\n**As a** collector,\n**I want** to search,\n**so that** I find a card.\n";
const SUITE =
  "# Feature test cases\n\n## Settled\n\n- A sold listing is not an error state · refused 2026-09-01\n";

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

/** `decisions.md` is folded nowhere and the blind pass may not read archive,
 * so a rejected option recorded only there is lost to the one pass most likely
 * to raise it again. The owner says where it went. */
test("refuses decisions the fold carries nowhere until the owner says where they went", () => {
  const decided = {
    ...CARRIED,
    "decisions.md":
      "## Goals\n\n- Collectors find a card.\n\n## Non-Goals\n\n- Stock per shop.\n\n## Decisions\n\n| Q | Asked | Decided | Instead of |\n| --- | --- | --- | --- |\n| Q1 | Where does search live? | The header | A dedicated page - one field is not a surface |\n",
  };
  const refused = run(sandbox(decided, DURABLE).script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(
    refused.stderr,
    /records 1 decision\(s\) that the fold carries nowhere/,
  );

  const carried = run(
    sandbox(decided, DURABLE).script,
    ...SHIPPED,
    "--decisions-carried",
    "Q1 onto the listing page's Product decisions block",
  );
  assert.equal(carried.status, 0, carried.stderr);

  const none = run(
    sandbox(decided, DURABLE).script,
    ...SHIPPED,
    "--decisions-carried",
    "none",
  );
  assert.equal(none.status, 0, none.stderr);
});

test("asks nothing of a change whose decisions table is empty", () => {
  const empty = {
    ...CARRIED,
    "decisions.md":
      "## Goals\n\n- Collectors find a card.\n\n## Non-Goals\n\n- Stock per shop.\n\n## Decisions\n\n| Q | Asked | Decided | Instead of |\n| --- | --- | --- | --- |\n",
  };
  const result = run(sandbox(empty, DURABLE).script, ...SHIPPED);
  assert.equal(result.status, 0, result.stderr);
});

test("refuses a scenario the fold would land with no anchor", () => {
  const files = {
    ...CARRIED,
    [`specs/${CAP}/spec.md`]:
      PURPOSE +
      FEATURE_SET +
      REQUIREMENTS +
      "\n#### Scenario: listing-SC-01 - It searches\n\n- **WHEN** asked\n- **THEN** it searches\n",
  };
  const result = run(sandbox(files, DURABLE).script, ...SHIPPED);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /1 scenario\(s\) carrying no `\*\*Serves:\*\*` line/,
  );
  assert.match(result.stderr, /listing-SC-01/);
});

test("takes the anchor written as its own line or as a bullet", () => {
  for (const serves of [
    "**Serves:** listing-US-01 - Collector searches the catalogue",
    "- **Serves:** `Search`",
  ]) {
    const files = {
      ...CARRIED,
      [`specs/${CAP}/spec.md`]:
        PURPOSE +
        FEATURE_SET +
        REQUIREMENTS +
        `\n#### Scenario: listing-SC-01 - It searches\n${serves}\n\n- **WHEN** asked\n- **THEN** it searches\n`,
    };
    const result = run(sandbox(files, DURABLE).script, ...SHIPPED);
    assert.equal(result.status, 0, `${serves} was refused: ${result.stderr}`);
  }
});

test("says nothing about a scenario that predates permanent ids", () => {
  const files = {
    ...CARRIED,
    [`specs/${CAP}/spec.md`]:
      PURPOSE +
      FEATURE_SET +
      REQUIREMENTS +
      "\n#### Scenario: It searches\n\n- **WHEN** asked\n- **THEN** it searches\n",
  };
  const result = run(sandbox(files, DURABLE).script, ...SHIPPED);
  assert.equal(result.status, 0, result.stderr);
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
  assert.match(
    result.stderr,
    /scenario id\(s\) not stripped \(listing-SC-04\)/,
  );
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
  assert.match(refused.stderr, /feature-tcs\.md` {2}· nothing durable yet/);

  const acknowledged = run(
    sandbox(CARRIED, missing).script,
    ...SHIPPED,
    "--journeys-copied",
  );
  assert.equal(acknowledged.status, 0);
});

/** A change whose every task group lands in the store deploys nothing, so
 * there is no run to name and no waiver owed. `check:manual`'s `archived` rule
 * and the archive skill both already said so; this script did not, so the only
 * way to archive one was to waive a deploy it never had — and a waiver written
 * where none is owed is how the waiver becomes the default. */
const STORE_ONLY = "## 1. Store checks (grade10-spec)\n\n- [x] 1.1 Ship it\n";

test("a store-only plan needs no deploy evidence and records none", () => {
  const { script, manifest } = sandbox({
    ...PROPOSAL,
    ".openspec.yaml": "schema: grade10-planning\n",
    "tasks.md": STORE_ONLY,
  });
  const result = run(script);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No deploy record is owed/);
  assert.equal(readFileSync(manifest, "utf8"), "schema: grade10-planning\n");
});

test("a plan landing anywhere else still owes its deploy", () => {
  const { script } = sandbox({
    ...PROPOSAL,
    "tasks.md": `${STORE_ONLY}\n## 2. The app (grade10)\n\n- [x] 2.1 Wire it\n`,
  });
  const result = run(script);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No deploy evidence/);
});

test("an untagged group is not a store-only plan", () => {
  const { script } = sandbox({
    ...PROPOSAL,
    "tasks.md": "## 1. Build it\n\n- [x] 1.1 Ship it\n",
  });
  const result = run(script);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No deploy evidence/);
});
