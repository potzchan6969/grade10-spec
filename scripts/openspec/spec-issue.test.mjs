import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { idsInText } from "../../tools/manual/src/store/issued-ids.mts";
import {
  idsMainHolds,
  nextCaseOf,
  nextLetterOf,
  nextOf,
  rewrite,
  rewritesOf,
} from "./spec-issue.mjs";

/**
 * `allocate-ids-across-open-changes`: the next id issued by a command from the
 * branch and the fetched `main`, and a branch's ids `main` already holds moved
 * above them with every citation inside the change.
 */

const CLI = join(dirname(fileURLToPath(import.meta.url)), "spec-issue.mjs");

const issued = (text, where = "one", file = "x/spec.md") =>
  idsInText(text, where, file);

test("shared-planning-agent-rounds-US-20 - the next journey, scenario, case and letter are one past what is issued", () => {
  const ids = [
    ...issued(
      "## ADDED Requirements\n\n#### Scenario: alpha-SC-07 - one\n\n#### Scenario: alpha-SC-12 - two\n",
    ),
    ...issued(
      "## ADDED User journeys\n\n### alpha-US-03: Reader\n",
      "two",
      "y/user-journeys.md",
    ),
    ...issued(
      "### alpha-US3-TC1-1: one\n\n### alpha-US3-TC4-2: two\n\n### g10.demo-beta.US2-TC5: three\n",
      "two",
      "y/feature-tcs.md",
    ),
  ];
  assert.equal(nextOf(ids, "alpha", "SC"), "alpha-SC-13");
  assert.equal(nextOf(ids, "alpha", "US"), "alpha-US-04");
  assert.equal(nextCaseOf(ids, "alpha-US-03"), "alpha-US3-TC5-1");
  assert.equal(nextCaseOf(ids, "g10.demo-beta.US2"), "g10.demo-beta.US2-TC6");
  assert.equal(nextLetterOf(ids, "alpha-SC-07"), "alpha-SC-07a");
});

test("a rewrite is bounded, so SC-1 never rewrites SC-12, and a journey takes its cases", () => {
  const pairs = rewritesOf(
    new Map([
      ["alpha-SC-1", "alpha-SC-13"],
      ["alpha-US-01", "alpha-US-04"],
    ]),
  );
  assert.equal(
    rewrite(
      "alpha-SC-1, alpha-SC-12, `alpha-US-01`, ### alpha-US1-TC2-1: x, alpha-US-1-TC3",
      pairs,
    ),
    "alpha-SC-13, alpha-SC-12, `alpha-US-04`, ### alpha-US4-TC2-1: x, alpha-US-4-TC3",
  );
});

/** A store with `one` on its published `main`, and a branch adding `two`
 * that issues the same scenario, journey and case. */
function store() {
  const root = mkdtempSync(join(tmpdir(), "spec-issue-"));
  const bare = mkdtempSync(join(tmpdir(), "spec-issue-remote-"));
  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      { cwd: root, encoding: "utf8" },
    );
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const change = (id, trace) => {
    const dir = `openspec/changes/${id}/specs/demo/alpha`;
    write(
      `${dir}/spec.md`,
      "## ADDED Requirements\n\n### Requirement: Alpha\n\nAlpha SHALL count.\n\n#### Scenario: alpha-SC-01 - it counts\n**Serves:** alpha-US-01 - Reader counts\n\n- **WHEN** asked\n- **THEN** it counts\n",
    );
    write(
      `${dir}/user-journeys.md`,
      "## ADDED User journeys\n\n### alpha-US-01: Reader counts\n\nThey count.\n",
    );
    write(
      `${dir}/feature-tcs.md`,
      `# demo/alpha Test Cases\n\n## alpha-US-01: Reader counts\n\n<!-- trace:case id=${trace} rev=1 -->\n### alpha-US1-TC1-1: The count rises\n\n* **Trace:** alpha-SC-01\n`,
    );
    write(
      `openspec/changes/${id}/tasks.md`,
      "## 1. Count (grade10-spec)\n\n- [ ] 1.1 Count - `alpha-SC-01`\n",
    );
  };
  execFileSync("git", ["init", "--quiet", "--bare", bare]);
  git("init", "--quiet", "--initial-branch=main", ".");
  change("one", "g10.demo-alpha.TC-aaa");
  git("add", "-A");
  git("commit", "--quiet", "-m", "one");
  git("remote", "add", "origin", bare);
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  git("fetch", "--quiet", "origin");
  git("checkout", "--quiet", "-b", "claude/two");
  change("two", "g10.demo-alpha.TC-bbb");
  git("add", "-A");
  git("commit", "--quiet", "-m", "two");
  return { root, git };
}

test("shared-planning-agent-rounds-US-21 - move lifts the branch's ids main holds above it, citations and cases with them", () => {
  const { root } = store();

  const result = spawnSync(
    process.execPath,
    [CLI, "move", "two", "--root", root],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /read main at [0-9a-f]{40}/);
  const dir = join(root, "openspec/changes/two");
  const spec = readFileSync(join(dir, "specs/demo/alpha/spec.md"), "utf8");
  assert.match(spec, /Scenario: alpha-SC-02 - it counts/);
  assert.match(spec, /\*\*Serves:\*\* alpha-US-02 - Reader counts/);
  assert.match(
    readFileSync(join(dir, "specs/demo/alpha/user-journeys.md"), "utf8"),
    /### alpha-US-02: Reader counts/,
  );
  const suite = readFileSync(
    join(dir, "specs/demo/alpha/feature-tcs.md"),
    "utf8",
  );
  assert.match(suite, /## alpha-US-02: Reader counts/);
  assert.match(suite, /### alpha-US2-TC1-1: The count rises/);
  assert.match(suite, /\*\*Trace:\*\* alpha-SC-02/);
  assert.match(readFileSync(join(dir, "tasks.md"), "utf8"), /`alpha-SC-02`/);
  // The change on main is not touched.
  assert.match(
    readFileSync(
      join(root, "openspec/changes/one/specs/demo/alpha/spec.md"),
      "utf8",
    ),
    /alpha-SC-01/,
  );
  // Nothing is held twice once moved.
  assert.deepEqual(idsMainHolds(root, "two", { fetch: false }), []);
});

test("shared-planning-agent-rounds-US-21 - acceptance names each id main holds and the command that moves it", () => {
  const { root } = store();

  const held = idsMainHolds(root, "two", { fetch: false });

  assert.ok(held.length >= 3, held.join("\n"));
  assert.ok(
    held.every((one) =>
      one.endsWith(
        "move this change's ids with `pnpm run spec:issue move two`",
      ),
    ),
  );
  assert.ok(
    held.some((one) => one.startsWith("`alpha-SC-01` is issued by `one`")),
  );
});
