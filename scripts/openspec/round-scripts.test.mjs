import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * The round's record and its landing step, over a throwaway store with a bare
 * remote.
 *
 * The scripts read the store through the manual's own readers, so they stay
 * where they are and take `--root`: a copy in a temporary directory could not
 * import `tools/manual/src/store/*`. What the fixture carries is one change
 * with five artifacts, two people in the team map, and `origin/main` and the
 * change's branch on a bare remote — enough for every refusal of the landing
 * step and for the race two runs lose.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "round-probe";
const DIR = `openspec/changes/${CHANGE}`;
const BRANCH = `change/${CHANGE}`;

const PROPOSAL = [
  "# Round probe",
  "",
  "## Why",
  "",
  "So the scripts have a change to land.",
  "",
].join("\n");

const DECISIONS = [
  "## Goals",
  "",
  "- One row per round",
  "",
  "## Non-Goals",
  "",
  "- Nothing else",
  "",
  "## Decisions",
  "",
  "| Q | Asked | Decided | Instead of |",
  "| --- | --- | --- | --- |",
  "| Q1 | Who writes the row? | The landing | A second file |",
  "",
].join("\n");

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    required: true",
  "    generates: decisions.md",
  "    requires: [proposal]",
  "    upstream: [proposal]",
  "  - id: ui-design",
  "    required: false",
  "    generates: ui-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: tech-design",
  "    required: false",
  "    generates: tech-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: tasks",
  "    required: true",
  "    generates: tasks.md",
  "    requires: [ui-design]",
  "    upstream: [proposal, decisions, ui-design, tech-design]",
  "",
].join("\n");

const TEAM = [
  "handles:",
  "  dana:",
  "    email: dana@test",
  "    roles: [pm, design]",
  "  erin:",
  "    email: erin@test",
  "    roles: [tech, dev]",
  "channels: {}",
  "",
].join("\n");

const RECORD = [
  "# The change's record.",
  "schema: demo-planning",
  "created: 2026-10-01",
  "hands:",
  "  pm: dana",
  "  design: dana",
  "  tech: erin",
  "  dev: erin",
  "",
].join("\n");

/**
 * Hand-computed: the content id of what is before `decisions` — the
 * proposal's text alone, whitespace collapsed and trimmed. Pinned rather than
 * derived, and asserted below to be what `contentIdOf` answers, so the script
 * and the store cannot drift apart without a test saying so.
 */
const BEFORE_DECISIONS = "c54a5887";
/** The same, for `ui-design`: the proposal then the decisions. */
const BEFORE_UI_DESIGN = "4209d51f";

const FILES = {
  "docs/prds/team.yaml": TEAM,
  "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
  [`${DIR}/.openspec.yaml`]: RECORD,
  [`${DIR}/proposal.md`]: PROPOSAL,
  [`${DIR}/decisions.md`]: DECISIONS,
  [`${DIR}/ui-design.md`]: "## Screens\n\nThe one screen.\n",
  [`${DIR}/tech-design.md`]: "## Decisions\n\nThe one decision.\n",
};

/**
 * A throwaway store, committed, with a bare remote holding `main` and the
 * change's branch, checked out on that branch.
 */
function sandbox(extra = {}) {
  const root = mkdtempSync(join(tmpdir(), "round-scripts-"));
  for (const [path, text] of Object.entries({ ...FILES, ...extra })) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  const remote = mkdtempSync(join(tmpdir(), "round-remote-"));
  execFileSync("git", ["init", "--quiet", "--bare", remote]);
  execFileSync("git", [
    "-C",
    remote,
    "symbolic-ref",
    "HEAD",
    "refs/heads/main",
  ]);
  git("init", "--quiet", "--initial-branch=main", ".");
  git("config", "user.email", "dana@test");
  git("config", "user.name", "dana");
  git("add", "-A");
  git("commit", "--quiet", "-m", "the change");
  git("remote", "add", "origin", remote);
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  git("checkout", "--quiet", "-b", BRANCH);
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);
  return { root, remote, git };
}

const run = (script, args, env = {}) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1", ...env },
  });

const recordOf = (root) =>
  readFileSync(join(root, DIR, ".openspec.yaml"), "utf8");
const roundsOf = (root) => readFileSync(join(root, DIR, "rounds.md"), "utf8");

// ── The read record ─────────────────────────────────────────────────────────

test("round:reviewed writes the content id of what is before the artifact", async () => {
  const { root } = sandbox();
  const result = run("round-reviewed.mjs", [
    CHANGE,
    "decisions",
    "--root",
    root,
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(recordOf(root), /reviewed:\n\s+decisions: c54a5887/);
  assert.match(result.stdout, /decisions/);
  assert.match(result.stdout, new RegExp(BEFORE_DECISIONS));

  const { contentIdOf } = await import(
    "../../tools/manual/src/store/content-id.mts"
  );
  assert.equal(contentIdOf([PROPOSAL]), BEFORE_DECISIONS);
  assert.equal(contentIdOf([PROPOSAL, DECISIONS]), BEFORE_UI_DESIGN);
  assert.equal(
    BEFORE_DECISIONS,
    createHash("sha256")
      .update(PROPOSAL.replace(/\s+/g, " ").trim())
      .digest("hex")
      .slice(0, 8),
  );
});

test("round:reviewed keeps every other line of the record", () => {
  const { root } = sandbox();
  run("round-reviewed.mjs", [CHANGE, "decisions", "--root", root]);
  const written = recordOf(root);

  assert.match(written, /# The change's record\./);
  assert.match(written, /schema: demo-planning/);
  assert.match(written, /created: 2026-10-01/);
  assert.match(written, /^ {2}design: dana$/m);
});

test("round:reviewed writes every artifact that has something before it", () => {
  const { root } = sandbox();
  const result = run("round-reviewed.mjs", [CHANGE, "--root", root]);

  assert.equal(result.status, 0, result.stderr);
  const written = recordOf(root);
  assert.match(written, new RegExp(`decisions: ${BEFORE_DECISIONS}`));
  assert.match(written, new RegExp(`ui-design: ${BEFORE_UI_DESIGN}`));
  // The proposal is drawn from nothing in this change, so there is no id to
  // write and no line to read it back against.
  assert.doesNotMatch(written, /^ {2}proposal:/m);
});

test("round:reviewed refuses an artifact the schema does not issue", () => {
  const { root } = sandbox();
  const result = run("round-reviewed.mjs", [
    CHANGE,
    "ui-desgin",
    "--root",
    root,
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ui-desgin/);
  assert.match(result.stderr, /demo-planning/);
  assert.doesNotMatch(recordOf(root), /reviewed:/);
});

test("round:reviewed says an artifact drawn from nothing has nothing to read", () => {
  const { root } = sandbox();
  const result = run("round-reviewed.mjs", [
    CHANGE,
    "proposal",
    "--root",
    root,
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing before it/);
  assert.doesNotMatch(recordOf(root), /reviewed:/);
});

// ── The round's row ─────────────────────────────────────────────────────────

test("round:row writes the file with its header and numbers the first row 1", () => {
  const { root } = sandbox();
  const result = run("round-row.mjs", [
    CHANGE,
    "--artifact",
    "ui-design",
    "--perspectives",
    "design,simpler",
    "--stood",
    "the empty state was undrawn",
    "--asked",
    "Q1",
    "--root",
    root,
  ]);

  assert.equal(result.status, 0, result.stderr);
  const written = roundsOf(root);
  assert.match(
    written,
    /\| Round \| Artifact \| Perspectives \| Stood \| Asked \| Tests \|/,
  );
  assert.match(
    written,
    /\| 1 \| ui-design \| design, simpler \| the empty state was undrawn \| Q1 \| - \|/,
  );
});

test("round:row numbers each later row from the rows already there", () => {
  const { root } = sandbox();
  const row = (artifact) => [
    CHANGE,
    "--artifact",
    artifact,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
    "--root",
    root,
  ];
  run("round-row.mjs", row("ui-design"));
  run("round-row.mjs", row("tech-design"));
  const result = run("round-row.mjs", [
    ...row("2"),
    "--tests",
    "demo-SC-01: test/one.test.ts",
  ]);

  assert.equal(result.status, 0, result.stderr);
  const rows = roundsOf(root)
    .split("\n")
    .filter((line) => /^\| \d+ \|/.test(line));
  assert.deepEqual(
    rows.map((line) => line.split("|")[1].trim()),
    ["1", "2", "3"],
  );
  assert.match(
    rows[2],
    /\| 3 \| 2 \| simpler \| nothing stood \| - \| demo-SC-01: test\/one\.test\.ts \|/,
  );
});

test("round:row refuses a row that names no perspective", () => {
  const { root } = sandbox();
  const result = run("round-row.mjs", [
    CHANGE,
    "--artifact",
    "ui-design",
    "--stood",
    "nothing stood",
    "--root",
    root,
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--perspectives/);
});

// ── The thread's address ────────────────────────────────────────────────────

test("round:thread writes the address once", () => {
  const { root } = sandbox();
  const result = run("round-thread.mjs", [
    CHANGE,
    "C0456EFGH/1758270000.000100",
    "--root",
    root,
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(recordOf(root), /^thread: C0456EFGH\/1758270000\.000100$/m);
  assert.match(recordOf(root), /schema: demo-planning/);
});

test("round:thread refuses to rewrite an address already there", () => {
  const { root } = sandbox();
  run("round-thread.mjs", [
    CHANGE,
    "C0456EFGH/1758270000.000100",
    "--root",
    root,
  ]);
  const result = run("round-thread.mjs", [
    CHANGE,
    "C0999ZZZZ/1758270111.000200",
    "--root",
    root,
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /C0456EFGH\/1758270000\.000100/);
  assert.match(recordOf(root), /thread: C0456EFGH\/1758270000\.000100/);
  assert.doesNotMatch(recordOf(root), /C0999ZZZZ/);
});

test("round:thread refuses an address that is not a channel and a message", () => {
  const { root } = sandbox();
  const result = run("round-thread.mjs", [
    CHANGE,
    "the-thread",
    "--root",
    root,
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /<channel>\/<ts>/);
  assert.doesNotMatch(recordOf(root), /thread:/);
});

// ── The landing step ────────────────────────────────────────────────────────

const ROW = ["--perspectives", "design,simpler", "--stood", "nothing stood"];

const land = (root, args = [], env = {}) =>
  run("plan-land.mjs", [CHANGE, "ui-design", "--root", root, ...ROW, ...args], {
    PLAN_NO_GATE: "1",
    ...env,
  });

test("plan:land refuses a working tree with uncommitted edits", () => {
  const { root } = sandbox();
  writeFileSync(join(root, DIR, "ui-design.md"), "## Screens\n\nRedrawn.\n");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /uncommitted/);
});

test("plan:land refuses a rebase in progress", () => {
  const { root, git } = sandbox();
  mkdirSync(join(root, git("rev-parse", "--git-dir").trim(), "rebase-merge"), {
    recursive: true,
  });
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /rebase/);
});

test("plan:land refuses an e-mail the team map does not name", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "nobody@test");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /nobody@test/);
  assert.match(result.stderr, /docs\/prds\/team\.yaml/);
});

test("plan:land takes --as only where it resolves to the same e-mail", () => {
  const { root } = sandbox();
  const refused = land(root, ["--dry-run", "--as", "@erin"]);
  const taken = land(root, ["--dry-run", "--as", "@dana"]);

  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /erin/);
  assert.match(refused.stderr, /dana@test/);
  assert.equal(taken.status, 0, taken.stderr);
});

test("plan:land refuses a handle that is not the hand, naming whose word it waits on", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "erin@test");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /@dana/);
  assert.match(result.stderr, /ui-design/);
});

test("plan:land refuses while something before the artifact is behind, and names it", () => {
  const { root } = sandbox({
    [`${DIR}/.openspec.yaml`]: `${RECORD}reviewed:\n  decisions: deadbeef\n`,
  });
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /decisions/);
  assert.match(result.stderr, /@dana/);
});

test("plan:land's dry run prints every step and pushes nothing", () => {
  const { root, remote } = sandbox();
  const before = execFileSync("git", ["-C", remote, "rev-parse", "main"], {
    encoding: "utf8",
  }).trim();
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 0, result.stderr);
  for (const step of [
    "clean",
    "hand",
    "main",
    "behind",
    "gate",
    "commit",
    "push",
  ]) {
    assert.match(result.stdout, new RegExp(step), `${step} is not printed`);
  }
  assert.match(result.stdout, /nothing was pushed/);
  assert.equal(
    execFileSync("git", ["-C", remote, "rev-parse", "main"], {
      encoding: "utf8",
    }).trim(),
    before,
  );
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("plan:land lands the artifact, its record line and its row in one commit", () => {
  const { root, remote, git } = sandbox();
  const result = land(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(recordOf(root), /landed_by:\n\s+ui-design: dana/);
  assert.match(roundsOf(root), /\| 1 \| ui-design \| design, simpler \|/);
  const landed = git("show", "--stat", "--format=", "HEAD");
  assert.match(landed, /\.openspec\.yaml/);
  assert.match(landed, /rounds\.md/);
  assert.equal(
    execFileSync("git", ["-C", remote, "rev-parse", "main"], {
      encoding: "utf8",
    }).trim(),
    git("rev-parse", "HEAD").trim(),
  );
});

test("plan:land reads main again once when its push loses, then says so and stops", () => {
  const { root, remote } = sandbox();
  // A second clone standing in for the run that wins: the hook moves `main`
  // under us before each push, so both attempts lose their race.
  const rival = mkdtempSync(join(tmpdir(), "round-rival-"));
  execFileSync("git", ["clone", "--quiet", remote, rival]);
  const hook = [
    `git -C ${rival} -c user.email=erin@test -c user.name=erin commit --quiet --allow-empty -m "the winner"`,
    `git -C ${rival} push --quiet origin HEAD:refs/heads/main`,
  ].join(" && ");

  const result = land(root, [], { PLAN_LAND_RACE: hook });

  assert.equal(result.status, 1);
  assert.match(
    result.stdout + result.stderr,
    /read .*again|reading .*again|retry/i,
  );
  assert.match(result.stderr, /lost/i);
  // Two attempts and no more: the winner's main is the rival's two commits.
  const log = execFileSync(
    "git",
    ["-C", remote, "log", "--format=%s", "main"],
    { encoding: "utf8" },
  );
  assert.equal(log.split("\n").filter((one) => one === "the winner").length, 2);
});
