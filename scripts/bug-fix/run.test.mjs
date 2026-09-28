/*
 * The bug-fix rounds are held by this script, not by an agent's memory. These
 * tests drive `run.mjs` end to end against a throwaway repository and a fake
 * agent that answers each step from a scenario, and check every gate the
 * script owns: the lane, the red test, the green fix, the protected paths,
 * the verdicts, the round cap and a read step that writes.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN = join(HERE, "run.mjs");

const DIAGNOSIS = `Lane: bug
Lands in: here
Test: \`node check.mjs\`
Commit: fix(demo): return the fixed value

## Root Cause

\`src/value.mjs\` returns the wrong value.
`;
const CLEAN =
  "| # | Where | Finding | Principle | Verdict |\n| --- | --- | --- | --- | --- |";
const verdict = (word) =>
  `${CLEAN}\n| qa-1 | diagnosis | the test is wrong | Testable | ${word} - because |`;
const RED = {
  write: {
    "check.mjs":
      'import { value } from "./src/value.mjs";\nif (value !== "fixed") process.exit(1);\n',
  },
};
const GREEN = { write: { "src/value.mjs": 'export const value = "fixed";\n' } };

const HAPPY = {
  diagnose: [{ answer: DIAGNOSIS }],
  read: [{ answer: CLEAN }],
  verify: [{ answer: CLEAN }],
  "write-test": [RED],
  "write-fix": [GREEN],
  "verify-symptom": [{ answer: "Verified: yes\n\nRan node check.mjs." }],
};

/** A fake agent: answers the step named on the prompt's first line from the
 * scenario, in order, repeating the last answer once they run out. `read-*`
 * and `verify-diagnosis`/`verify-fix` fall back to the `read` and `verify`
 * keys. */
const FAKE = `#!/usr/bin/env node
const { readFileSync, writeFileSync, existsSync } = require("node:fs");
const [mode, promptFile] = process.argv.slice(2);
const step = /^# Step: (\\S+)/.exec(readFileSync(promptFile, "utf8"))[1];
const scenario = JSON.parse(readFileSync(process.env.FAKE_SCENARIO, "utf8"));
const key = step in scenario ? step : step.startsWith("read-") ? "read" : /^verify-(diagnosis|fix)$/.test(step) ? "verify" : step;
const state = existsSync(process.env.FAKE_STATE) ? JSON.parse(readFileSync(process.env.FAKE_STATE, "utf8")) : {};
const seen = state[key] ?? 0;
state[key] = seen + 1;
writeFileSync(process.env.FAKE_STATE, JSON.stringify(state));
const answers = scenario[key];
if (!answers) { console.error("no answer for " + step); process.exit(2); }
const answer = answers[Math.min(seen, answers.length - 1)];
for (const [path, text] of Object.entries(answer.write ?? {})) {
  require("node:fs").mkdirSync(require("node:path").dirname(path), { recursive: true });
  writeFileSync(path, text);
}
process.stdout.write(answer.answer ?? "done");
`;

function setup(scenario) {
  const dir = mkdtempSync(join(tmpdir(), "bug-fix-"));
  const repo = join(dir, "repo");
  const sh = (...args) =>
    execFileSync("git", args, { cwd: repo, encoding: "utf8" });
  execFileSync("git", ["init", "-q", repo]);
  sh("config", "user.email", "test@example.com");
  sh("config", "user.name", "test");
  execFileSync("mkdir", ["-p", join(repo, "src")]);
  writeFileSync(
    join(repo, "src/value.mjs"),
    'export const value = "broken";\n',
  );
  sh("add", "-A");
  sh("commit", "-qm", "base");
  const agent = join(dir, "agent.cjs");
  writeFileSync(agent, FAKE);
  chmodSync(agent, 0o755);
  writeFileSync(join(dir, "scenario.json"), JSON.stringify(scenario));
  writeFileSync(join(dir, "report.md"), "The value is broken.\n");
  const out = join(dir, "out");
  const run = (extra = []) =>
    spawnSync(
      process.execPath,
      [
        RUN,
        "--report",
        join(dir, "report.md"),
        "--agent",
        agent,
        "--out",
        out,
        "--repo",
        repo,
        ...extra,
      ],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          FAKE_SCENARIO: join(dir, "scenario.json"),
          FAKE_STATE: join(dir, "state.json"),
        },
      },
    );
  const result = () =>
    JSON.parse(readFileSync(join(out, "result.json"), "utf8"));
  const log = () => sh("log", "--format=%s").trim().split("\n");
  const calls = () => JSON.parse(readFileSync(join(dir, "state.json"), "utf8"));
  return { repo, out, run, result, log, calls, sh };
}

test("a clean run lands the red test, then the fix, and a PR body", () => {
  const t = setup(HAPPY);
  const done = t.run();
  assert.equal(done.status, 0, done.stderr);
  assert.equal(t.result().outcome, "fixed");
  assert.deepEqual(t.log(), [
    "fix(demo): return the fixed value",
    "test(demo): return the fixed value",
    "base",
  ]);
  assert.deepEqual(t.result().rounds, { diagnosis: 1, fix: 1 });
  assert.ok(existsSync(join(t.out, "pr.md")));
  assert.ok(
    readdirSync(join(t.out, "comments")).some((name) =>
      name.includes("diagnosis-round-1"),
    ),
  );
  // lane, root-cause, qa and simpler read the diagnosis; each its own call
  assert.equal(t.calls().read, 4 + 5);
});

test("a diagnosis whose lane is change stops before any code", () => {
  const t = setup({
    ...HAPPY,
    diagnose: [{ answer: DIAGNOSIS.replace("Lane: bug", "Lane: change") }],
  });
  t.run();
  assert.equal(t.result().outcome, "change");
  assert.deepEqual(t.log(), ["base"]);
});

test("a defect in another repository stops as moved", () => {
  const t = setup({
    ...HAPPY,
    diagnose: [
      {
        answer: DIAGNOSIS.replace(
          "Lands in: here",
          "Lands in: 9gag/grade10-spec",
        ),
      },
    ],
  });
  t.run();
  assert.equal(t.result().outcome, "moved");
});

test("a finding that stands sends the diagnosis back, then the run goes on", () => {
  const t = setup({
    ...HAPPY,
    verify: [{ answer: verdict("stands") }, { answer: CLEAN }],
    "revise-diagnosis": [{ answer: DIAGNOSIS }],
  });
  t.run();
  assert.equal(t.result().outcome, "fixed");
  assert.equal(t.calls()["revise-diagnosis"], 1);
  assert.equal(t.result().rounds.diagnosis, 2);
});

test("findings that keep standing stop the run at the round cap", () => {
  const t = setup({
    ...HAPPY,
    verify: [{ answer: verdict("stands") }],
    "revise-diagnosis": [{ answer: DIAGNOSIS }],
  });
  t.run(["--rounds", "2"]);
  assert.equal(t.result().outcome, "unsettled");
  assert.deepEqual(t.log(), ["base"]);
});

test("an asks stops the run for a person", () => {
  const t = setup({ ...HAPPY, verify: [{ answer: verdict("asks") }] });
  t.run();
  assert.equal(t.result().outcome, "asks");
});

test("a verdict table the script cannot read never passes as clean", () => {
  const t = setup({
    ...HAPPY,
    verify: [{ answer: `${CLEAN}\n| qa-1 | x | y | z | maybe |` }],
  });
  t.run();
  assert.equal(t.result().outcome, "unreadable");
});

test("a test that passes on the unfixed tree is refused, and the tree is left clean", () => {
  const t = setup({
    ...HAPPY,
    "write-test": [{ write: { "check.mjs": "process.exit(0);\n" } }],
  });
  t.run();
  assert.equal(t.result().outcome, "no-red");
  assert.deepEqual(t.log(), ["base"]);
  assert.equal(t.sh("status", "--porcelain"), "");
});

test("a fix that edits the test or a protected path is refused and retried", () => {
  const t = setup({
    ...HAPPY,
    "write-fix": [
      {
        write: {
          "check.mjs": "process.exit(0);\n",
          "src/value.mjs": 'export const value = "fixed";\n',
        },
      },
      {
        write: {
          ".github/workflows/x.yml": "on: push\n",
          "src/value.mjs": 'export const value = "fixed";\n',
        },
      },
      GREEN,
    ],
  });
  t.run();
  assert.equal(t.result().outcome, "fixed");
  assert.equal(t.calls()["write-fix"], 3);
  assert.equal(existsSync(join(t.repo, ".github")), false);
});

test("a fix the checks refuse is not committed", () => {
  const t = setup(HAPPY);
  t.run(["--check", "exit 1", "--rounds", "1"]);
  assert.equal(t.result().outcome, "no-green");
  assert.deepEqual(t.log(), ["test(demo): return the fixed value", "base"]);
});

test("a review finding that stands amends the fix commit", () => {
  const t = setup({
    ...HAPPY,
    verify: [
      { answer: CLEAN },
      { answer: verdict("stands") },
      { answer: CLEAN },
    ],
    "revise-fix": [
      {
        write: {
          "src/value.mjs": 'export const value = "fixed"; // reviewed\n',
        },
      },
    ],
  });
  t.run();
  assert.equal(t.result().outcome, "fixed");
  assert.equal(t.log().length, 3);
  assert.match(readFileSync(join(t.repo, "src/value.mjs"), "utf8"), /reviewed/);
});

test("a symptom the verification cannot confirm is not reported fixed", () => {
  const t = setup({
    ...HAPPY,
    "verify-symptom": [{ answer: "Verified: no\n\nStill broken at 390px." }],
  });
  t.run();
  assert.equal(t.result().outcome, "unverified");
  assert.equal(existsSync(join(t.out, "pr.md")), false);
});

test("a read step that changes the tree fails the run loudly", () => {
  const t = setup({
    ...HAPPY,
    diagnose: [{ answer: DIAGNOSIS, write: { "src/value.mjs": "x\n" } }],
  });
  const done = t.run();
  assert.equal(done.status, 1);
  assert.match(done.stderr, /changed the tree during diagnose/);
});

test("a diagnosis missing its keyed lines is asked once, then refused", () => {
  const t = setup({
    ...HAPPY,
    diagnose: [{ answer: "It is broken." }],
    "complete-diagnosis": [{ answer: "Still no fields." }],
  });
  t.run();
  assert.equal(t.result().outcome, "unreadable");
});
