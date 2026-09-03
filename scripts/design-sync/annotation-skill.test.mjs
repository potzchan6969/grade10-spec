import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("a supported harness opens the spec-owned annotation workflow", async () => {
  const skill = await readFile(
    new URL(
      "../../.claude/skills/reconcile-figma-annotations/SKILL.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(skill, /reconcile-figma-annotations/);
  assert.match(skill, /--scope spec/);
  assert.match(skill, /packages\/design-system/);
  assert.match(skill, /packages\/ui/);
  assert.match(skill, /figma:annotations:impact/);
  assert.match(skill, /implemented.*no-impact.*covered.*gap.*blocked/s);
  assert.match(skill, /fresh live observation/i);
  assert.match(skill, /planning-pm/);
  assert.match(skill, /grade10-spec/);
  assert.doesNotMatch(skill, /--scope product/);
  assert.doesNotMatch(skill, /external\/grade10-spec/);
});
