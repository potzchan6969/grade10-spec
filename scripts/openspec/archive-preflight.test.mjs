import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "archive-preflight.mjs",
);
const CHANGE = "build-alpha";
const hash = (text) => createHash("sha256").update(text).digest("hex");

function sandbox({
  implementation = true,
  openTasks = false,
  version = 1,
} = {}) {
  const root = mkdtempSync(join(tmpdir(), "archive-preflight-"));
  const dir = join(root, "openspec/changes", CHANGE);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, ".openspec.yaml"), "schema: grade10-planning\n");
  writeFileSync(
    join(dir, "tasks.md"),
    `## 1. Build it (grade10-site)\n\n- [x] 1.1 Implement it\n${openTasks ? "- [ ] 1.2 Verify it\n" : "- [x] 1.2 Verify it\n"}`,
  );
  const targetPath = "openspec/specs/site/search/spec.md";
  const targetText =
    "# Search\n\n## Requirements\n\n### Requirement: Search results\n\nThe system SHALL return matching items.\n\n### Requirement: Other results\n\nThe system SHALL retain the unrelated result.\n";
  mkdirSync(dirname(join(root, targetPath)), { recursive: true });
  writeFileSync(join(root, targetPath), targetText);
  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=archive@test", "-c", "user.name=archive", ...args],
      { cwd: root, stdio: "ignore" },
    );
  git("init", "--quiet", ".");
  git("add", "-A");
  git("commit", "--quiet", "-m", "store");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  const baselineCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();

  const targets = [
    { path: targetPath, anchors: ["Requirement: Search results"] },
  ];
  const identity =
    version === 2
      ? { version: 2, change: CHANGE, artifacts: [], contractTargets: targets }
      : { version: 1, change: CHANGE, artifacts: [] };
  const fingerprint = hash(`${JSON.stringify(identity, null, 2)}\n`);
  const acceptance = {
    version,
    change: CHANGE,
    baseline: "b".repeat(64),
    fingerprint,
    reviewedBy: "@pm",
    acceptedAt: "2026-09-25T00:00:00.000Z",
    artifacts: [],
    ...(version === 2 ? { contractTargets: targets } : {}),
  };
  const recordDir = join(dir, "acceptance");
  mkdirSync(recordDir, { recursive: true });
  writeFileSync(
    join(dir, "acceptance.json"),
    `${JSON.stringify(acceptance, null, 2)}\n`,
  );
  writeFileSync(
    join(recordDir, `${fingerprint}.json`),
    `${JSON.stringify(acceptance, null, 2)}\n`,
  );
  writeFileSync(
    join(recordDir, `${fingerprint}.snapshots.json`),
    `${JSON.stringify({ fingerprint, files: [] }, null, 2)}\n`,
  );
  if (implementation)
    writeFileSync(
      join(dir, "implementation.json"),
      `${JSON.stringify(
        version === 2
          ? {
              version: 2,
              acceptance: { fingerprint },
              contractBaseline: {
                repository: "9gag/grade10-spec",
                commit: baselineCommit,
                capturedAt: "2026-09-25T00:30:00.000Z",
                targets,
              },
              repositories: [
                {
                  repository: "grade10-site",
                  commit: "a".repeat(40),
                  components: ["web"],
                },
              ],
            }
          : {
              version: 1,
              fingerprint,
              repositories: [
                {
                  repository: "grade10-site",
                  commit: "a".repeat(40),
                  components: ["web"],
                },
              ],
            },
        null,
        2,
      )}\n`,
    );
  git("add", "-A");
  git("commit", "--quiet", "-m", "accepted implementation");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  return { root, dir, git, fingerprint, targetPath, targetText };
}

const run = (root, ...args) =>
  spawnSync(process.execPath, [SCRIPT, CHANGE, "--root", root, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1" },
  });

test("archive refuses without a durable acceptance record or implementation attestation", () => {
  const missing = sandbox({ implementation: false });
  const noImplementation = run(missing.root);
  assert.equal(noImplementation.status, 1);
  assert.match(noImplementation.stderr, /implementation.json is required/);

  const accepted = sandbox();
  writeFileSync(
    join(accepted.dir, "implementation.json"),
    JSON.stringify({
      version: 1,
      fingerprint: "f".repeat(64),
      repositories: [
        {
          repository: "grade10-site",
          commit: "a".repeat(40),
          components: ["web"],
        },
      ],
    }),
  );
  accepted.git("add", "-A");
  accepted.git("commit", "--quiet", "-m", "stale implementation");
  accepted.git("update-ref", "refs/remotes/origin/main", "HEAD");
  const stale = run(accepted.root);
  assert.equal(stale.status, 1);
  assert.match(
    stale.stderr,
    /does not attest an available current or historical acceptance/,
  );
});

test("archive verifies implementation and prints a move without asking for deployment evidence or folding again", () => {
  const { root, fingerprint } = sandbox();
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(fingerprint));
  assert.match(
    result.stdout,
    /git -C .* mv openspec\/changes\/build-alpha openspec\/changes\/archive/,
  );
  assert.doesNotMatch(result.stdout, /openspec archive/);
  assert.doesNotMatch(result.stdout, /deploy(?:ed|ment|_waived)/i);
});

test("archive compares only the claimed v2 requirement targets", () => {
  const { root, git, targetPath, targetText } = sandbox({ version: 2 });
  writeFileSync(
    join(root, targetPath),
    targetText.replace("unrelated result.", "new unrelated result."),
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "sibling durable advance");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
});

test("archive requires a complete compatibility acknowledgement for a changed v2 target", () => {
  const { root, dir, git, targetPath, targetText } = sandbox({ version: 2 });
  writeFileSync(
    join(root, targetPath),
    targetText.replace("matching items.", "ranked matching items."),
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "selected durable advance");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  const missing = run(root);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /compatibilityAcknowledgement is required/);

  const record = JSON.parse(
    readFileSync(join(dir, "implementation.json"), "utf8"),
  );
  record.compatibilityAcknowledgement = {
    reviewedBy: "@engineer",
    reviewedAt: "2026-09-25T02:00:00.000Z",
    changes: [
      {
        path: targetPath,
        anchors: ["Requirement: Search results"],
        classification: "semantic",
        reason: "Ranking preserves the implemented result set.",
      },
    ],
  };
  writeFileSync(
    join(dir, "implementation.json"),
    `${JSON.stringify(record, null, 2)}\n`,
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "incomplete compatibility acknowledgement");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  const noEvidence = run(root);
  assert.equal(noEvidence.status, 1);
  assert.match(noEvidence.stderr, /needs non-empty evidence/);

  record.compatibilityAcknowledgement.changes[0].evidence = [
    "apps/site/tests/search.test.ts",
  ];
  writeFileSync(
    join(dir, "implementation.json"),
    `${JSON.stringify(record, null, 2)}\n`,
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "complete compatibility acknowledgement");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  const acknowledged = run(root);
  assert.equal(acknowledged.status, 0, acknowledged.stderr);
  assert.match(acknowledged.stdout, /acknowledged contract change/);
});

test("archive keeps v1 records archivable as a documented migration path", () => {
  const { root } = sandbox();
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /predates contract-baseline tracking/);
});

test("archive refuses acceptance or implementation evidence that is only local to the checkout", () => {
  const { root, git } = sandbox();
  git("update-ref", "refs/remotes/origin/main", "HEAD~1");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /on origin\/main/);
  assert.match(result.stderr, /acceptance\.json/);
});

test("archive still refuses unfinished implementation tasks", () => {
  const { root } = sandbox({ openTasks: true });
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /1 task\(s\) unchecked/);
});

test("unknown flags are refused by the store archive command", () => {
  const { root } = sandbox();
  const result = run(root, "--availability-receipt", "receipt-123");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown argument: --availability-receipt/);
});
