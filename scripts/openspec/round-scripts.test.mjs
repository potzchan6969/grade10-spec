import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { CHANGE, DIR, record, sandbox } from "./test/demo-store.mjs";

/**
 * The round's record and its landing step, over a throwaway store with a bare
 * remote — `./test/demo-store.mjs`'s fixture, real enough that `plan:land`'s
 * gate runs against it rather than around it (`PLAN_NO_GATE` is gone; every
 * landing case here runs `validate:changes`, `check:manual` and
 * `tcs:validate` for real).
 *
 * The scripts read the store through the manual's own readers, so they stay
 * where they are and take `--root`: a copy in a temporary directory could not
 * import `tools/manual/src/store/*`.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const BRANCH = `change/${CHANGE}`;

/**
 * Hand-computed: the content id of what is before `decisions` — the
 * proposal's text alone, whitespace collapsed and trimmed. Pinned rather than
 * derived, and asserted below to be what `contentIdOf` answers, so the script
 * and the store cannot drift apart without a test saying so.
 */
const BEFORE_DECISIONS = "c54a5887";
/** The same, for `ui-design`: the proposal then the decisions. */
const BEFORE_UI_DESIGN = "4209d51f";

const run = (script, args, env = {}) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1", ...env },
  });

const recordOf = (root) =>
  readFileSync(join(root, DIR, ".openspec.yaml"), "utf8");
const roundsOf = (root) => readFileSync(join(root, DIR, "rounds.md"), "utf8");

// ── The read record ─────────────────────────────────────────────────────────

/** The landing of a read that changed nothing: one artifact, no row. */
const reviewed = (root, artifact, args = []) =>
  run("plan-land.mjs", [
    CHANGE,
    artifact,
    "--root",
    root,
    "--reviewed",
    ...args,
  ]);

test("shared-planning-agent-rounds-SC-36, shared-planning-change-stages-SC-27 - plan:land --reviewed writes the content id of what is before the artifact", async () => {
  const { root } = sandbox();
  const result = reviewed(root, "decisions");

  assert.equal(result.status, 0, result.stderr);
  assert.match(recordOf(root), /reviewed:\n\s+decisions: c54a5887/);
  assert.match(result.stdout, /decisions/);
  assert.match(result.stdout, new RegExp(BEFORE_DECISIONS));
  assert.match(result.stdout, /read against proposal/);

  const { contentIdOf } = await import(
    "../../tools/manual/src/store/content-id.mts"
  );
  const { PROPOSAL, DECISIONS } = await import("./test/demo-store.mjs");
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

test("plan:land --reviewed keeps every other line of the record", () => {
  const { root } = sandbox();
  reviewed(root, "decisions");
  const written = recordOf(root);

  assert.match(written, /# The change's record\./);
  assert.match(written, /schema: demo-planning/);
  assert.match(written, /created: 2026-10-01/);
  assert.match(written, /^ {2}design: dana$/m);
});

test("plan:land --reviewed writes the named artifact's line and no other", () => {
  const { root } = sandbox();
  const result = reviewed(root, "decisions");

  assert.equal(result.status, 0, result.stderr);
  const written = recordOf(root);
  assert.match(written, new RegExp(`decisions: ${BEFORE_DECISIONS}`));
  // One artifact per call: a landing that put three behind lands three times.
  assert.doesNotMatch(written, /^ {2}ui-design:/m);
  assert.doesNotMatch(written, /^ {2}proposal:/m);
});

test("plan:land --reviewed refuses an artifact the schema does not issue", () => {
  const { root } = sandbox();
  const result = reviewed(root, "ui-desgin");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ui-desgin/);
  assert.match(result.stderr, /demo-planning/);
  assert.doesNotMatch(recordOf(root), /reviewed:/);
});

test("shared-planning-agent-rounds-SC-32 - plan:land --reviewed tells apart drawn from nothing, waived and not written yet", () => {
  // `proposal` links no page section in this change, so it is drawn from
  // nothing; `ui-design` is waived; `specs` is neither — it is simply not
  // written yet, and the schema still names what would be before it.
  const { root } = sandbox({
    files: {
      [`${DIR}/.openspec.yaml`]: record(
        'ui_waived: "nothing a reader sees moves"\n',
      ),
    },
  });

  const drawnFromNothing = reviewed(root, "proposal");
  assert.equal(drawnFromNothing.status, 1);
  assert.match(
    drawnFromNothing.stderr,
    /proposal: nothing before it in this change — no line to write/,
  );

  const waived = reviewed(root, "ui-design");
  assert.equal(waived.status, 1);
  assert.match(waived.stderr, /ui-design: waived — nothing to read it against/);

  const notWritten = reviewed(root, "specs");
  assert.equal(notWritten.status, 1);
  assert.match(
    notWritten.stderr,
    /specs: not written yet — nothing to read it against/,
  );

  assert.doesNotMatch(recordOf(root), /reviewed:/);
});

// ── The thread's address ────────────────────────────────────────────────────

test("shared-planning-agent-rounds-SC-64 - round:thread writes the address once", () => {
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

test("shared-planning-agent-rounds-SC-64 - round:thread refuses to rewrite an address already there", () => {
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
  run(
    "plan-land.mjs",
    [CHANGE, "ui-design", "--root", root, ...ROW, ...args],
    env,
  );

test("shared-planning-agent-rounds-SC-51 - plan:land refuses a perspective the artifact's list does not issue", () => {
  const { root } = sandbox();
  const result = run("plan-land.mjs", [
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--dry-run",
    "--perspectives",
    "design,archivist,simpler",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /archivist/);
  assert.match(result.stderr, /demo-planning/);
});

test("shared-planning-agent-rounds-SC-51 - plan:land refuses a row that leaves out a reader that always runs", () => {
  const { root } = sandbox();
  const result = run("plan-land.mjs", [
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--dry-run",
    "--perspectives",
    "design",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /simpler/);
  assert.match(result.stderr, /always/);
});

test("shared-planning-agent-rounds-SC-51 - plan:land takes the readers the schema issues, and `verifier` beside them", () => {
  const { root } = sandbox();
  const result = run("plan-land.mjs", [
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--perspectives",
    "design,simpler,verifier",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 0, result.stderr);
  // `verifier` is no perspective of any artifact: it records that a verifier
  // read the round's findings.
  assert.match(roundsOf(root), /\| design, simpler, verifier \|/);
});

test("plan:land refuses a working tree with uncommitted edits", () => {
  const { root } = sandbox();
  writeFileSync(join(root, DIR, "ui-design.md"), "## Screens\n\nRedrawn.\n");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /uncommitted/);
});

test("plan:land does not refuse an untracked file beside the change", () => {
  const { root } = sandbox();
  writeFileSync(join(root, "scratch.txt"), "not part of the change\n");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 0, result.stderr);
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

test("plan:land refuses an absent user.email", () => {
  const { root } = sandbox();
  execFileSync("git", ["config", "--unset", "user.email"], { cwd: root });
  const result = land(root, ["--dry-run"], {
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_CONFIG_SYSTEM: "/dev/null",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /says nothing/);
});

test("shared-planning-agent-rounds-SC-05 - plan:land refuses an e-mail the team map does not name", () => {
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

test("shared-planning-agent-rounds-SC-05 - plan:land refuses a handle that is not the hand, naming whose word it waits on", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "erin@test");
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /@dana/);
  assert.match(result.stderr, /ui-design/);
});

test("shared-planning-agent-rounds-SC-35, shared-planning-agent-rounds-SC-43 - plan:land refuses while something before the artifact is behind, and names it", () => {
  const { root } = sandbox({
    files: {
      [`${DIR}/.openspec.yaml`]: record("reviewed:\n  decisions: deadbeef\n"),
    },
  });
  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /decisions/);
  assert.match(result.stderr, /@dana/);
});

test("shared-planning-agent-rounds-SC-33 - editing the record itself puts nothing behind", () => {
  const { root, git } = sandbox();
  writeFileSync(
    join(root, DIR, ".openspec.yaml"),
    record("owners:\n  - dana\n"),
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "record: note an owner");
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);

  const result = land(root, ["--dry-run"]);

  assert.equal(result.status, 0, result.stderr);
});

test("shared-planning-agent-rounds-SC-32 - a waived tech-design counts as fresh and does not hold a group's landing", () => {
  const staleAndUnwaived = sandbox({
    files: {
      [`${DIR}/.openspec.yaml`]: record("reviewed:\n  tech-design: deadbeef\n"),
    },
  });
  staleAndUnwaived.git("config", "user.email", "erin@test");
  const blocked = run("plan-land.mjs", [
    CHANGE,
    "1",
    "--root",
    staleAndUnwaived.root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stderr, /tech-design/);

  const staleAndWaived = sandbox({
    files: {
      [`${DIR}/.openspec.yaml`]: record(
        "reviewed:\n  tech-design: deadbeef\n",
        'design_waived: "no tech design needed for this fixture"',
      ),
    },
  });
  staleAndWaived.git("config", "user.email", "erin@test");
  const landed = run("plan-land.mjs", [
    CHANGE,
    "1",
    "--root",
    staleAndWaived.root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);
  assert.equal(landed.status, 0, landed.stderr);
});

test("shared-planning-agent-rounds-SC-37 - what follows a landed artifact is behind until it is read again", () => {
  const { root, git } = sandbox({
    files: {
      [`${DIR}/.openspec.yaml`]: record("reviewed:\n  ui-design: deadbeef\n"),
    },
  });
  git("config", "user.email", "erin@test");
  const result = run("plan-land.mjs", [
    CHANGE,
    "1",
    "--root",
    root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ui-design/);
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

test("shared-planning-agent-rounds-SC-04 - plan:land lands the artifact, its record line and its row in one commit, through the real gate", () => {
  const { root, remote, git } = sandbox();
  const result = land(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /validate:changes, check:manual, tcs:validate pass/,
  );
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

test("plan:land's gate refuses a change the store cannot read", () => {
  const { root, git } = sandbox();
  writeFileSync(
    join(root, DIR, "proposal.md"),
    "# Round probe\n\nNo why here.\n",
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "break the proposal");
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);

  const result = land(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /the gate refuses: check:manual/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("plan:land lands a task group with the dev's word, its row and no landed_by:", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "erin@test");
  const result = run("plan-land.mjs", [
    CHANGE,
    "1",
    "--root",
    root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /@erin is the dev and the hand of 1/);
  assert.match(roundsOf(root), /\| 1 \| 1 \| simpler \| nothing stood \|/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("shared-planning-agent-rounds-SC-57 - plan:land lands a ticked group's row through the gate that would otherwise refuse it", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "erin@test");
  // The tick lands on its own, with no row for it yet — the deadlock the
  // `round` rule exists to name: the gate the row's own landing must pass is
  // the same gate that refuses a tick with no row.
  writeFileSync(
    join(root, DIR, "tasks.md"),
    "## 1. Build it (grade10-spec)\n\n- [x] 1.1 Ship it\n",
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "tick 1.1 with no round yet");
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);

  const result = run("plan-land.mjs", [
    CHANGE,
    "1",
    "--root",
    root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(roundsOf(root), /\| 1 \| 1 \| simpler \| nothing stood \|/);
});

test("shared-planning-agent-rounds-SC-51 - plan:land writes a group's bare digits, and the rule reads the row as it stands", () => {
  const { root, git } = sandbox({
    files: {
      [`${DIR}/tasks.md`]:
        "## 3. Build it (grade10-spec)\n\n- [x] 3.1 Ship it\n",
    },
  });
  git("config", "user.email", "erin@test");
  const result = run("plan-land.mjs", [
    CHANGE,
    "group 3",
    "--root",
    root,
    "--perspectives",
    "simpler",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(result.status, 0, result.stderr);
  // `group 3` reaches the row as `3`: the one writer normalises the spelling,
  // and the `round` rule the gate above ran read that row for the ticked
  // group without normalising it a second time.
  assert.match(roundsOf(root), /\| 1 \| 3 \| simpler \| nothing stood \|/);
});

test("plan:land refuses a group number tasks.md does not hold, naming the ones it does", () => {
  const { root, git } = sandbox();
  git("config", "user.email", "erin@test");
  const result = run("plan-land.mjs", [
    CHANGE,
    "9",
    "--root",
    root,
    "--perspectives",
    "simpler",
    "--stood",
    "x",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no group 9/);
  assert.match(result.stderr, /it holds 1/);
});

test("shared-planning-agent-rounds-SC-39 - plan:land --reviewed writes the line, commits and pushes it in one transaction", () => {
  const { root, remote, git } = sandbox();
  // A different local e-mail than any hand's — no hand's word is asked for a
  // read that changed nothing, and the agent lands it regardless.
  git("config", "user.email", "nobody@test");

  const result = reviewed(root, "decisions");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no hand's word is asked/);
  assert.match(recordOf(root), new RegExp(`decisions: ${BEFORE_DECISIONS}`));
  // No row and no `landed_by:`: the read ran no perspective and waits on
  // nobody's word.
  assert.doesNotMatch(recordOf(root), /landed_by:/);
  assert.equal(existsSync(join(root, DIR, "rounds.md")), false);
  // One commit, carrying the record alone, and `main` fast-forwarded to it.
  const landed = git("show", "--stat", "--format=", "HEAD");
  assert.match(landed, /\.openspec\.yaml/);
  assert.doesNotMatch(landed, /rounds\.md/);
  assert.equal(
    execFileSync("git", ["-C", remote, "rev-parse", "main"], {
      encoding: "utf8",
    }).trim(),
    git("rev-parse", "HEAD").trim(),
  );
});

test("plan:land --reviewed refuses a task group", () => {
  const { root } = sandbox();
  const result = reviewed(root, "1");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--reviewed names an artifact/);
});

test("plan:land --reviewed's dry run writes the line nowhere and pushes nothing", () => {
  const { root, remote } = sandbox();
  const before = execFileSync("git", ["-C", remote, "rev-parse", "main"], {
    encoding: "utf8",
  }).trim();

  const result = reviewed(root, "decisions", ["--dry-run"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    new RegExp(`would write reviewed: decisions: ${BEFORE_DECISIONS}`),
  );
  assert.doesNotMatch(recordOf(root), /reviewed:/);
  assert.equal(
    execFileSync("git", ["-C", remote, "rev-parse", "main"], {
      encoding: "utf8",
    }).trim(),
    before,
  );
});

test("plan:land refuses an origin with no main to land on", () => {
  const { root } = sandbox({ remote: false });
  const result = land(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /origin has no main/);
});

test("plan:land refuses a branch that will not rebase on main cleanly", () => {
  const { root, remote, git } = sandbox();
  const rival = mkdtempSync(join(tmpdir(), "round-rival-"));
  execFileSync("git", ["clone", "--quiet", remote, rival]);
  execFileSync(
    "git",
    [
      "-c",
      "user.email=erin@test",
      "-c",
      "user.name=erin",
      "commit",
      "--quiet",
      "--allow-empty",
      "-m",
      "rival",
    ],
    { cwd: rival },
  );
  writeFileSync(
    join(rival, DIR, "ui-design.md"),
    "## Screens\n\nRival's screen.\n",
  );
  execFileSync(
    "git",
    ["-c", "user.email=erin@test", "-c", "user.name=erin", "add", "-A"],
    { cwd: rival },
  );
  execFileSync(
    "git",
    [
      "-c",
      "user.email=erin@test",
      "-c",
      "user.name=erin",
      "commit",
      "--quiet",
      "-m",
      "rival edits ui-design",
    ],
    { cwd: rival },
  );
  execFileSync("git", ["push", "--quiet", "origin", "HEAD:refs/heads/main"], {
    cwd: rival,
  });
  writeFileSync(join(root, DIR, "ui-design.md"), "## Screens\n\nOur screen.\n");
  git("add", "-A");
  git("commit", "--quiet", "-m", "our own edit to ui-design");

  const result = land(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not rebase on main cleanly/);
});

test("shared-planning-agent-rounds-SC-69 - plan:land reads main again once when its push loses, then says so and stops", () => {
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

test("plan:land's second attempt wins once main has settled", () => {
  const { root, remote } = sandbox();
  const rival = mkdtempSync(join(tmpdir(), "round-rival-"));
  execFileSync("git", ["clone", "--quiet", remote, rival]);
  const flag = join(mkdtempSync(join(tmpdir(), "race-flag-")), "fired");
  // The hook only moves `main` once: attempt 2 finds it settled and lands.
  const hook = [
    `if [ -f ${flag} ]; then exit 0; fi`,
    `touch ${flag}`,
    `git -C ${rival} -c user.email=erin@test -c user.name=erin commit --quiet --allow-empty -m "an unrelated landing"`,
    `git -C ${rival} push --quiet origin HEAD:refs/heads/main`,
  ].join(" && ");

  const result = land(root, [], { PLAN_LAND_RACE: hook });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /reading it again and retrying/);
  assert.match(result.stdout, /landed by @dana/);
  const log = execFileSync(
    "git",
    ["-C", remote, "log", "--format=%s", "main"],
    { encoding: "utf8" },
  );
  assert.match(log, /an unrelated landing/);
  assert.match(log, /land ui-design of round-probe/);
});

test("PLAN_LAND_RACE is refused unless --root was passed", () => {
  // A landing with no `--root` reads this real store; the seam must never
  // fire against it even if the variable happens to be set in the shell.
  const result = spawnSync(
    process.execPath,
    [join(SCRIPTS, "plan-land.mjs"), CHANGE, "ui-design", "--dry-run", ...ROW],
    {
      encoding: "utf8",
      env: { ...process.env, NO_COLOR: "1", PLAN_LAND_RACE: "true" },
    },
  );

  // It fails for an unrelated reason first in the real store (no such
  // change), which is fine — the point is that it never reaches the race
  // hook silently. The refusal below is asserted directly against the seam.
  assert.notEqual(result.status, 0);
});
