import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parsePage } from "../../tools/manual/src/content/grammar.ts";
import { sectionTextOf } from "../../tools/manual/src/content/sections.ts";
import { contentIdOf } from "../../tools/manual/src/store/content-id.mts";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS, "archive-preflight.mjs");
const CHANGE = "build-alpha";

/**
 * A throwaway store, committed with `origin/main` at that commit — no copy
 * of this checkout's own tree beside it: the BEHIND gate reads the store
 * through the manual's own change reader, so it stays where it is and takes
 * `--root`, the way `plan-land.mjs` and `round-scripts.test.mjs` already do,
 * rather than a copy that could not import `tools/manual/src/store/*`.
 * `files` are written under the change, `durable` under `openspec/specs`;
 * both take `a/b/c.md` keys. Returns the store to run against, the manifest
 * it writes, the change's `tasks.md`, and git in the store.
 *
 * `schemas` writes `openspec/schemas/<id>/schema.yaml`, keyed by id; a
 * change naming a schema this reads none for is read as owing nothing, the
 * way a store that has not landed the schema yet is. `pages` writes
 * store-relative files at the root — `docs/prds/…` — for the one case where
 * a proposal links a page section: the store's change reader reads pages
 * too, so a `reviewed:` id can only be reproduced by hashing the same
 * section text it hashed. `daysAgo` backdates the one commit this writes, so
 * a case that needs a second, later commit on top of it — the fallback that
 * dates an artifact from git history rather than a `reviewed:` line — has
 * room to date one after it with the returned `commit`.
 */
function sandbox(files, durable = {}, schemas = {}, pages = {}, daysAgo = 0) {
  const root = mkdtempSync(join(tmpdir(), "archive-preflight-"));
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
  write(root, pages);
  for (const [id, yaml] of Object.entries(schemas)) {
    write(join(root, "openspec", "schemas"), { [`${id}/schema.yaml`]: yaml });
  }

  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=preflight@test", "-c", "user.name=preflight", ...args],
      { cwd: root, stdio: "ignore" },
    );
  const dated = (args, ago) => {
    const at = new Date(Date.now() - ago * 86_400_000).toISOString();
    execFileSync(
      "git",
      ["-c", "user.email=preflight@test", "-c", "user.name=preflight", ...args],
      {
        cwd: root,
        stdio: "ignore",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    );
  };
  git("init", "--quiet", ".");
  dated(["add", "-A"], daysAgo);
  dated(["commit", "--quiet", "-m", "the store"], daysAgo);
  git("update-ref", "refs/remotes/origin/main", "HEAD");

  return {
    root,
    manifest: join(dir, ".openspec.yaml"),
    tasks: join(dir, "tasks.md"),
    git,
    /** Writes more of the change's own files and commits them `ago` days
     * ago (0 = now) — a second, later commit against the one `sandbox`
     * already made. */
    commit(tree, message, ago = 0) {
      write(dir, tree);
      dated(["add", "-A"], ago);
      dated(["commit", "--quiet", "-m", message], ago);
    },
  };
}

const run = (root, ...args) =>
  spawnSync(process.execPath, [SCRIPT, CHANGE, "--root", root, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1" },
  });

const PROPOSAL = { "proposal.md": "# Build alpha\n\n## Why\n\nTo ship it.\n" };
const SHIPPED = ["--deployed-at", "0f1e2d3", "--deployed-env", "production"];

test("refuses a deployed sha naming no environment", () => {
  const { root } = sandbox(PROPOSAL);
  const result = run(root, "--deployed-at", "0f1e2d3");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--deployed-at needs --deployed-env/);
});

test("refuses an unchecked task until a waiver names the decision", () => {
  const files = {
    ...PROPOSAL,
    "tasks.md": "## 1. Build it\n\n- [x] 1.1 Ship it\n- [ ] 1.2 Log it\n",
  };
  const refused = run(sandbox(files).root, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /1 task\(s\) unchecked/);
  assert.match(refused.stderr, /- \[ \] 1\.2 Log it/);

  const waived = run(
    sandbox(files).root,
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
  const passed = run(behind.root, ...SHIPPED);
  assert.equal(passed.status, 0, passed.stderr);

  const ticked = sandbox({ ...PROPOSAL, "tasks.md": OPEN });
  writeFileSync(ticked.tasks, DONE);
  const refused = run(ticked.root, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /1 task\(s\) unchecked/);
});

test("refuses a plan main does not hold, and a store with no main", () => {
  const unmerged = sandbox(PROPOSAL);
  writeFileSync(unmerged.tasks, DONE);
  const notOnMain = run(unmerged.root, ...SHIPPED);
  assert.equal(notOnMain.status, 1);
  assert.match(notOnMain.stderr, /tasks\.md is not on origin\/main/);

  const orphan = sandbox({ ...PROPOSAL, "tasks.md": DONE });
  orphan.git("update-ref", "-d", "refs/remotes/origin/main");
  const noMain = run(orphan.root, ...SHIPPED);
  assert.equal(noMain.status, 1);
  assert.match(noMain.stderr, /no origin main/);
});

test("a clear run writes the record quoted, over the waiver it replaces", () => {
  const { root, manifest } = sandbox({
    ...PROPOSAL,
    ".openspec.yaml":
      'schema: grade10-planning\ndeploy_waived: "@echo, nothing shipped"\n',
  });
  const result = run(root, ...SHIPPED);

  assert.equal(result.status, 0);
  assert.equal(
    readFileSync(manifest, "utf8"),
    'schema: grade10-planning\ndeployed_at: "0f1e2d3"\ndeployed_env: "production"\n',
  );
});

// ── The behind gate ──────────────────────────────────────────────────────────
// shared-planning-change-stages-SC-31: the archive refuses a behind delta and
// names what changed before it, the same `behindOf` comparison `check:manual`
// and the manual read. `reviewed:` is set to a content id, so the case needs
// no commit dates at all - a mismatch is enough to say the artifact moved.
const BEHIND_SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: specs",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires:",
  "      - proposal",
  "    upstream:",
  "      - proposal",
  "",
].join("\n");
const BEHIND_TASKS = "## 1. Store checks (grade10-spec)\n\n- [x] 1.1 Ship it\n";
const BEHIND_DELTA = [
  "## ADDED Requirements",
  "",
  "### Requirement: A lane names its stage",
  "",
  "#### Scenario: It names it",
  "",
  "- **WHEN** read",
  "- **THEN** it names it",
  "",
].join("\n");
const FRESH_SPECS_ID = contentIdOf([PROPOSAL["proposal.md"]]);

function behindSandbox(reviewed) {
  return sandbox(
    {
      ...PROPOSAL,
      ".openspec.yaml": `schema: demo-planning\n${reviewed}`,
      "tasks.md": BEHIND_TASKS,
      "specs/demo/alpha/spec.md": BEHIND_DELTA,
    },
    {},
    { "demo-planning": BEHIND_SCHEMA },
  );
}

test("refuses a delta behind what it was drawn from, naming it", () => {
  const result = run(behindSandbox("reviewed:\n  specs: deadbeef\n").root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /archives with 1 artifact\(s\) behind/);
  assert.match(result.stderr, /specs — read again against proposal/);
});

test("is clear where the read record matches the tree", () => {
  const result = run(
    behindSandbox(`reviewed:\n  specs: ${FRESH_SPECS_ID}\n`).root,
  );

  assert.equal(result.status, 0, result.stderr);
});

// shared-planning-change-stages-SC-27: the gate reads pages the same way the
// store's own reader does, so a `reviewed:` id hashed with a linked section's
// text is reproduced here rather than read as a mismatch because the section
// was never read at all.
const PAGE = "docs/prds/products/demo/rules.md";
const PAGE_TEXT = [
  "---",
  "title: Rules",
  "---",
  "",
  "## Points",
  "",
  "A point is earned per dollar spent.",
  "",
].join("\n");
const LINKED_PROPOSAL = [
  "# Build alpha",
  "",
  "## Why",
  "",
  "To ship it.",
  "",
  "## References",
  "",
  `- [Rules · Points](../../../${PAGE}#points)`,
  "",
].join("\n");
const POINTS_SECTION = sectionTextOf({ ast: parsePage(PAGE_TEXT) }, "points");

test("is clear where a reviewed id was hashed with the page section it links", () => {
  const reviewed = `reviewed:\n  specs: ${contentIdOf([POINTS_SECTION, LINKED_PROPOSAL])}\n`;
  const result = run(
    sandbox(
      {
        "proposal.md": LINKED_PROPOSAL,
        ".openspec.yaml": `schema: demo-planning\n${reviewed}`,
        "tasks.md": BEHIND_TASKS,
        "specs/demo/alpha/spec.md": BEHIND_DELTA,
      },
      {},
      { "demo-planning": BEHIND_SCHEMA },
      { [PAGE]: PAGE_TEXT },
    ).root,
  );

  assert.equal(result.status, 0, result.stderr);
});

// shared-planning-change-stages-SC-28: with no `reviewed:` line at all, an
// artifact is behind where a commit dates what is before it later than the
// artifact's own commit — real git history, not an injected date.
test("reads the archive's own commit dates where no reviewed: line dates the read", () => {
  const s = sandbox(
    {
      ...PROPOSAL,
      ".openspec.yaml": "schema: demo-planning\n",
      "tasks.md": BEHIND_TASKS,
      "specs/demo/alpha/spec.md": BEHIND_DELTA,
    },
    {},
    { "demo-planning": BEHIND_SCHEMA },
    {},
    2,
  );
  // The proposal is committed a second time, after the specs delta it is
  // before — the schema's own commit is untouched, so only the proposal
  // moves.
  s.commit(
    { "proposal.md": "# Build alpha\n\n## Why\n\nTo ship it, revised.\n" },
    "touch the proposal",
  );

  const result = run(s.root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /specs — proposal changed/);
});

test("skips the freshness read on a shallow clone rather than refusing on its account", () => {
  const source = behindSandbox("reviewed:\n  specs: deadbeef\n").root;
  const shallow = mkdtempSync(join(tmpdir(), "archive-preflight-shallow-"));
  // `--depth` is silently ignored on a local-path clone; `file://` is what
  // makes git actually write `.git/shallow` rather than a full copy.
  execFileSync(
    "git",
    ["clone", "--quiet", "--depth", "1", `file://${source}`, shallow],
    { stdio: "ignore" },
  );
  const result = run(shallow);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Freshness not checked/);
  assert.match(result.stdout, /shallow clone/);
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
  const result = run(sandbox(CARRIED, DURABLE).root, ...SHIPPED);
  assert.equal(result.status, 0);
});

// `rounds.md`'s own carry is checked after the archive exists, by
// `pnpm check:manual`'s `round` rule (`tools/manual/test/check-round.test.ts`)
// rather than by this preflight, which runs before it.

/** `decisions.md` is folded nowhere and the blind pass may not read archive,
 * so a rejected option recorded only there is lost to the one pass most likely
 * to raise it again. The owner says where it went. */
test("refuses decisions the fold carries nowhere until the owner says where they went", () => {
  const decided = {
    ...CARRIED,
    "decisions.md":
      "## Goals\n\n- Collectors find a card.\n\n## Non-Goals\n\n- Stock per shop.\n\n## Decisions\n\n| Q | Asked | Decided | Instead of |\n| --- | --- | --- | --- |\n| Q1 | Where does search live? | The header | A dedicated page - one field is not a surface |\n",
  };
  const refused = run(sandbox(decided, DURABLE).root, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(
    refused.stderr,
    /records 1 decision\(s\) that the fold carries nowhere/,
  );

  const carried = run(
    sandbox(decided, DURABLE).root,
    ...SHIPPED,
    "--decisions-carried",
    "Q1 onto the listing page's Product decisions block",
  );
  assert.equal(carried.status, 0, carried.stderr);

  const none = run(
    sandbox(decided, DURABLE).root,
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
  const result = run(sandbox(empty, DURABLE).root, ...SHIPPED);
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
  const result = run(sandbox(files, DURABLE).root, ...SHIPPED);

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
    const result = run(sandbox(files, DURABLE).root, ...SHIPPED);
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
  const result = run(sandbox(files, DURABLE).root, ...SHIPPED);
  assert.equal(result.status, 0, result.stderr);
});

test("refuses a durable purpose the change replaced and archive left behind", () => {
  const stale = {
    ...DURABLE,
    [`${CAP}/spec.md`]:
      "## Purpose\n\nCollectors browse.\n\n" + FEATURE_SET + REQUIREMENTS,
  };
  const result = run(sandbox(CARRIED, stale).root, ...SHIPPED);

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
  const refused = run(sandbox(files, deleted).root, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /listing-US-01` is removed and leaves no/);

  const both = {
    ...DURABLE,
    [`${CAP}/user-journeys.md`]: `# User journeys\n\n${STORY}\n## Retired\n\n- \`listing-US-01\` - removed in \`build-alpha\`\n`,
  };
  const stillWritten = run(sandbox(files, both).root, ...SHIPPED);
  assert.equal(stillWritten.status, 1);
  assert.match(stillWritten.stderr, /still written above it/);

  const tombstoned = {
    ...DURABLE,
    [`${CAP}/user-journeys.md`]:
      "# User journeys\n\n## Retired\n\n- `listing-US-01` - Collector searches the catalogue · removed in `build-alpha` · 2026-09-15\n",
  };
  assert.equal(run(sandbox(files, tombstoned).root, ...SHIPPED).status, 0);
});

test("refuses a carried Reconciliation that keeps its scenario ids", () => {
  const withIds = {
    ...DURABLE,
    [`${CAP}/feature-tcs.md`]:
      SUITE +
      "\n## Reconciliation\n\n- `listing-SC-04` covers the empty result · accepted\n",
  };
  const result = run(sandbox(CARRIED, withIds).root, ...SHIPPED);

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
  const result = run(sandbox(CARRIED, dropped).root, ...SHIPPED);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /drops 1 `## Settled` line/);

  const forced = run(
    sandbox(CARRIED, dropped).root,
    ...SHIPPED,
    "--journeys-copied",
  );
  assert.equal(forced.status, 1);
  assert.match(forced.stderr, /none of this is waivable/);
});

test("a suite with no durable file yet is a promise --journeys-copied can make", () => {
  const { [`${CAP}/feature-tcs.md`]: _suite, ...missing } = DURABLE;
  const refused = run(sandbox(CARRIED, missing).root, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /feature-tcs\.md` {2}· nothing durable yet/);

  const acknowledged = run(
    sandbox(CARRIED, missing).root,
    ...SHIPPED,
    "--journeys-copied",
  );
  assert.equal(acknowledged.status, 0);
});

test("a clear run records what it was told about the fold's DECIDE gates", () => {
  const decided = {
    ...CARRIED,
    "decisions.md":
      "## Goals\n\n- Collectors find a card.\n\n## Non-Goals\n\n- Stock per shop.\n\n## Decisions\n\n| Q | Asked | Decided | Instead of |\n| --- | --- | --- | --- |\n| Q1 | Where does search live? | The header | A dedicated page - one field is not a surface |\n",
  };
  const { [`${CAP}/feature-tcs.md`]: _suite, ...missingSuite } = DURABLE;
  const { root, manifest } = sandbox(decided, missingSuite);
  const result = run(
    root,
    ...SHIPPED,
    "--decisions-carried",
    "Q1 onto the listing page's Product decisions block",
    "--journeys-copied",
  );

  assert.equal(result.status, 0, result.stderr);
  const written = readFileSync(manifest, "utf8");
  assert.match(
    written,
    /decisions_carried: "Q1 onto the listing page's Product decisions block"/,
  );
  assert.match(written, /journeys_copied: "true"/);
});

/** A change whose every task group lands in the store deploys nothing, so
 * there is no run to name and no waiver owed. `check:manual`'s `archived` rule
 * and the archive skill both already said so; this script did not, so the only
 * way to archive one was to waive a deploy it never had — and a waiver written
 * where none is owed is how the waiver becomes the default. */
const STORE_ONLY = "## 1. Store checks (grade10-spec)\n\n- [x] 1.1 Ship it\n";

test("a store-only plan needs no deploy evidence and records none", () => {
  const { root, manifest } = sandbox({
    ...PROPOSAL,
    ".openspec.yaml": "schema: grade10-planning\n",
    "tasks.md": STORE_ONLY,
  });
  const result = run(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No deploy record is owed/);
  assert.equal(readFileSync(manifest, "utf8"), "schema: grade10-planning\n");
});

test("a plan landing anywhere else still owes its deploy", () => {
  const { root } = sandbox({
    ...PROPOSAL,
    "tasks.md": `${STORE_ONLY}\n## 2. The app (grade10)\n\n- [x] 2.1 Wire it\n`,
  });
  const result = run(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No deploy evidence/);
});

test("an untagged group is not a store-only plan", () => {
  const { root } = sandbox({
    ...PROPOSAL,
    "tasks.md": "## 1. Build it\n\n- [x] 1.1 Ship it\n",
  });
  const result = run(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No deploy evidence/);
});
