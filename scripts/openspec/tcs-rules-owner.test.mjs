/*
 * `tcs-rules-owner.mjs` over a throwaway repository: the test-case rules -
 * the rulebook, the suite template and the `spec-to-tcs` skill - change only
 * by the team map's handle that owns them, and the conventions stay open.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { isOwned } from "./tcs-rules-owner.mjs";

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  "tcs-rules-owner.mjs",
);
const OWNER = "owner@example.com";
const OTHER = "other@example.com";
const RULEBOOK = "docs/governance/specs-to-test-cases.md";
const SKILL = ".claude/skills/spec-to-tcs/SKILL.md";
const CONVENTIONS = "docs/governance/tcs-conventions.md";

function repo() {
  const root = mkdtempSync(join(tmpdir(), "tcs-rules-owner-"));
  const run = (...args) => {
    const ran = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(ran.status, 0, ran.stderr);
    return ran.stdout.trim();
  };
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const commit = (email, message) => {
    run("add", "-A");
    run(
      "-c",
      `user.name=${email}`,
      "-c",
      `user.email=${email}`,
      "commit",
      "-q",
      "-m",
      message,
    );
    return run("rev-parse", "HEAD");
  };
  run("init", "-q");
  write(
    "docs/prds/team.yaml",
    `handles:\n  owner:\n    email: ${OWNER}\n    roles: [qa]\n    owns: [tcs-rules]\n  other:\n    email: ${OTHER}\n    roles: [dev]\n`,
  );
  write(RULEBOOK, "# Rules\n");
  write(SKILL, "# spec-to-tcs\n");
  write(CONVENTIONS, "# Conventions\n");
  const base = commit(OWNER, "base");
  return { root, write, commit, base };
}

const check = (root, base) =>
  spawnSync("node", [SCRIPT, "--root", root, base, "HEAD"], {
    encoding: "utf8",
  });

test("names the paths only the rules' owner may change", () => {
  assert.equal(isOwned(RULEBOOK), true);
  assert.equal(isOwned(SKILL), true);
  assert.equal(
    isOwned("openspec/schemas/grade10-planning/templates/feature-tcs.md"),
    true,
  );
  assert.equal(isOwned(CONVENTIONS), false);
  assert.equal(isOwned(".claude/skills/tcs-review/SKILL.md"), false);
  assert.equal(isOwned("scripts/openspec/validate-test-cases.mjs"), false);
});

test("passes the owner's change to the rules, and anyone's change to the conventions", () => {
  const { root, write, commit, base } = repo();
  write(RULEBOOK, "# Rules\n\n- a new rule\n");
  commit(OWNER, "owner changes a rule");
  write(CONVENTIONS, "# Conventions\n\n- a new writing line\n");
  commit(OTHER, "other changes a convention");
  const ran = check(root, base);
  assert.equal(ran.status, 0, ran.stderr);
});

test("refuses another author's change to the rules, naming the commit and the path", () => {
  const { root, write, commit, base } = repo();
  write(SKILL, "# spec-to-tcs\n\n- a step nobody asked for\n");
  const sha = commit(OTHER, "other changes the skill");
  const ran = check(root, base);
  assert.equal(ran.status, 1);
  assert.match(ran.stderr, new RegExp(sha.slice(0, 9)));
  assert.match(ran.stderr, /\.claude\/skills\/spec-to-tcs\/SKILL\.md/);
});
