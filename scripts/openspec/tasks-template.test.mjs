/*
 * The tasks artifact's payload: the instruction `openspec instructions tasks`
 * prints and the template it copies. Nothing else in this store reads the
 * template, so what holds its shape is this file - each group opens with its
 * test task, ends with its verification step, and the last group is the walk,
 * the same rule `.claude/skills/workflow-tasks/SKILL.md` gives the engineer
 * who writes the plan and `.claude/skills/workflow-build/SKILL.md` gives the
 * one who builds a group.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const SCHEMA = "openspec/schemas/grade10-planning";
const SKILL = ".claude/skills/workflow-tasks/SKILL.md";

/** The `tasks` row of the schema: its instruction and its template. */
const artifact = () => {
  const found = YAML.parse(read(`${SCHEMA}/schema.yaml`)).artifacts.find(
    (one) => one.id === "tasks",
  );
  assert.ok(found, "the schema names no `tasks` artifact");
  return found;
};

/** The template the schema names, as groups of checkbox lines. */
const groups = () => {
  const found = [];
  for (const line of read(`${SCHEMA}/templates/${artifact().template}`).split(
    "\n",
  )) {
    if (line.startsWith("## "))
      found.push({ heading: line.slice(3), tasks: [] });
    else if (line.startsWith("- [ ] ")) found.at(-1)?.tasks.push(line.slice(6));
  }
  assert.ok(found.length > 1, "the template holds fewer than two groups");
  for (const group of found)
    assert.ok(
      group.tasks.length > 1,
      `group \`${group.heading}\` holds fewer than two tasks`,
    );
  return found;
};

// shared-planning-agent-rounds-SC-57: the tests a group's scenario ids name
// land in their own commit, before its code, so the test task is the group's
// first line and the box an engineer ticks last.
test("shared-planning-agent-rounds-SC-57 - every group of the tasks template opens with its test task", () => {
  for (const { heading, tasks } of groups()) {
    assert.match(
      tasks[0],
      /\btests?\b|\bwalks?\b/i,
      `group \`${heading}\` opens with a task that names neither its tests nor its walk`,
    );
  }
});

test("every group of the tasks template ends with its verification step", () => {
  for (const { heading, tasks } of groups()) {
    assert.match(
      tasks.at(-1),
      /verif|Verify:/i,
      `group \`${heading}\` ends with no verification step`,
    );
  }
});

// shared-planning-agent-rounds-SC-59: the last group walks every journey of
// every capability the change specifies and leaves the walks as its
// end-to-end suite.
test("shared-planning-agent-rounds-SC-59 - the tasks template's last group is the walk", () => {
  const last = groups().at(-1);

  assert.match(
    last.heading,
    /\bwalk\b/i,
    "the template's last group heading does not name the walk",
  );
  assert.match(
    last.tasks.join("\n"),
    /journey/i,
    "the walk group names no journey to walk",
  );
});

test("the tasks instruction carries the skill's rule for the group's test task", () => {
  const { instruction } = artifact();
  const skill = read(SKILL);

  for (const rule of [/own commit/, /ticked last/, /the walk/i]) {
    assert.match(skill, rule, `${SKILL} no longer states ${rule}`);
    assert.match(
      instruction,
      rule,
      `the instruction leaves ${rule} to the skill alone`,
    );
  }
  assert.doesNotMatch(
    instruction,
    /never split|test-first inside each task/i,
    "the instruction still refuses the test task the skill asks for",
  );
});
