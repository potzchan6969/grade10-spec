/*
 * The tasks artifact's payload: the instruction `openspec instructions tasks`
 * prints and the template it copies. Nothing else in this store reads the
 * template, so what holds its shape is this file - each group opens with its
 * test task, ends with its verification step, carries its repository tag, and
 * the last group is the walk, which flips the cases it decides. The skills
 * point at the instruction rather than restating it, so the rule has one home
 * and this file holds that home.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import {
  isWalkGroup,
  taskGroupHeading,
} from "../../tools/manual/src/store/read-changes.mts";

const ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const SCHEMA = "openspec/schemas/grade10-planning";
const SKILL = ".claude/skills/workflow-tasks/SKILL.md";
/** The rules the instruction is the one home of: the group's test task, its
 * own commit and its tick, the walk, and the flip the walk's commit makes. */
const RULES = [
  /Open every group but the walk with its test task/,
  /own commit/,
  /ticked last/,
  /The last group is the walk/,
  /pnpm run tcs:automated <case…> --decided-by <walk path>/,
  /named in the walk's `rounds\.md` row/,
];

/** The `tasks` row of the schema: its instruction and its template. */
const artifact = YAML.parse(read(`${SCHEMA}/schema.yaml`)).artifacts.find(
  (one) => one.id === "tasks",
);
assert.ok(artifact, "the schema names no `tasks` artifact");

/** The instruction as one line, so a rule folded over several matches as
 * the sentence it is. */
const instruction = artifact.instruction.replace(/\s+/g, " ");

/** The template the schema names, as groups of checkbox lines. */
const groups = [];
for (const line of read(`${SCHEMA}/templates/${artifact.template}`).split(
  "\n",
)) {
  if (line.startsWith("## "))
    groups.push({ heading: line.slice(3), tasks: [] });
  else if (line.startsWith("- [ ] ")) groups.at(-1)?.tasks.push(line.slice(6));
}
assert.ok(groups.length > 1, "the template holds fewer than two groups");
for (const group of groups)
  assert.ok(
    group.tasks.length > 1,
    `group \`${group.heading}\` holds fewer than two tasks`,
  );
const walk = groups.at(-1);

// shared-planning-agent-rounds-SC-57: the tests a group's scenario ids name
// land in their own commit, before its code, so the test task is the group's
// first line and the box an engineer ticks last. The walk group is its own
// test task, so it is read by the case below instead.
test("shared-planning-agent-rounds-SC-57 - every group of the tasks template but the walk opens with its test task", () => {
  for (const { heading, tasks } of groups.slice(0, -1)) {
    assert.match(
      tasks[0],
      /\btests\b/i,
      `group \`${heading}\` opens with a task that does not name its tests`,
    );
    assert.match(
      tasks[0],
      /`<capability>-SC-\d+`/,
      `group \`${heading}\`'s test task carries no scenario id hint`,
    );
    // The clause an engineer copies into a real plan: the order the tests
    // land in, and when the box is ticked.
    for (const rule of [/own commit/, /ticked last/]) {
      assert.match(
        tasks[0],
        rule,
        `group \`${heading}\`'s test task no longer says ${rule}`,
      );
    }
  }
});

test("every group of the tasks template ends with its verification step", () => {
  for (const { heading, tasks } of groups) {
    assert.match(
      tasks.at(-1),
      /^\d+\.\d+ Verify:/,
      `group \`${heading}\` ends with no verification step`,
    );
  }
});

test("every group heading of the tasks template carries its repository tag", () => {
  // `docs/governance/task-ownership.md`: a group names its repository by
  // clone name, never "here", because two repositories read the plan.
  for (const { heading } of groups) {
    assert.match(
      heading,
      /\(<!-- grade10-spec or grade10 -->\)$/,
      `group \`${heading}\` ends with no repository tag`,
    );
  }
});

// shared-planning-agent-rounds-SC-59: the last group walks every journey of
// every capability the change specifies, leaves the walks as its end-to-end
// suite, and the same commit flips each case the walk decides.
// Proves part of shared-planning-agent-rounds-US11-TC2-1.
test("shared-planning-agent-rounds-SC-90 - the walk group uses draft cases during planning and defers human QA until deployment", () => {
  const template = read(`${SCHEMA}/templates/${artifact.template}`);
  const walkText = template.slice(template.indexOf("## 3. The walk"));
  assert.match(walkText, /Uses draft `feature-tcs\.md` as its input/i);
  assert.doesNotMatch(walkText, /tcs-review|tcs-run-sheet/i);
  assert.match(instruction, /draft suite.*as its planning input/i);
  assert.match(instruction, /human QA after deployment/i);
  assert.match(
    instruction,
    /never a task, walk input, acceptance gate or archive gate/i,
  );
  assert.doesNotMatch(walkText, /Needs `feature-tcs\.md` reviewed/);
});

test("shared-planning-agent-rounds-SC-59 - the tasks template's last group is the walk, and flips the cases it decides", () => {
  assert.ok(
    isWalkGroup(taskGroupHeading(walk.heading)?.title ?? ""),
    "the template's last group heading does not name the walk",
  );
  // `check:manual`'s `walk_last` rule finds the walk by this title alone.
  assert.match(
    instruction,
    /The last group is the walk, titled `The walk`, or `The walk - <what it walks>`/,
  );
  assert.match(walk.tasks[0], /journey/i, "the walk group names no journey");
  // The flip as the store refuses it otherwise: a case of an in-flight change
  // owes the test that decides it, and the manual cases are named in the
  // walk's own row as well as in the suite.
  assert.match(
    walk.tasks.join("\n"),
    /pnpm run tcs:automated <case…> --decided-by <walk path>/,
    "the walk group names no flip of the cases it decides, or one with no decider",
  );
  assert.match(
    walk.tasks.join("\n"),
    /`rounds\.md` row/,
    "the walk group does not name the manual cases in its row",
  );
});

test("the tasks instruction holds the rule for the group's test task and the walk's flip, and no example", () => {
  for (const rule of RULES) {
    assert.match(instruction, rule, `the instruction no longer states ${rule}`);
  }
  assert.doesNotMatch(
    instruction,
    /never split|test-first inside each task/i,
    "the instruction still refuses the test task it asks for",
  );
  // The template is the example: a second one in the instruction is a copy
  // that drifts the day either changes.
  assert.doesNotMatch(
    instruction,
    /Example:|```/,
    "the instruction carries an example beside the template",
  );
});

test("the plan's skill points at the instruction and restates none of its rules", () => {
  // The rule has one home on the plan's path: the skill names the command
  // that prints it and the file that holds it, and carries no copy a later
  // edit could drift.
  const skill = read(SKILL);

  assert.match(skill, /openspec instructions tasks/);
  assert.match(skill, /scripts\/openspec\/tasks-template\.test\.mjs/);
  assert.doesNotMatch(
    skill,
    /own commit|ticked last|end to end|tcs:automated/,
    `${SKILL} restates a rule the instruction holds`,
  );
});

test("the apply guidance says the group's tests land first, as the instruction does", () => {
  // `openspec/config.yaml`'s apply guidance is the bare CLI's path, where no
  // skill loads, so it carries the rule in its own words and is held here to
  // the instruction's two clauses rather than left to drift.
  const guidance = YAML.parse(
    read("openspec/config.yaml"),
  ).operations.apply.guidance.find((one) => /^Work test-first/.test(one));

  assert.ok(guidance, "the apply guidance no longer opens with test-first");
  for (const rule of [/own commit/, /ticked last/]) {
    assert.match(guidance, rule, `the apply guidance no longer says ${rule}`);
  }
});
