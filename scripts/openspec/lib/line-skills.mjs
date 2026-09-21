/**
 * The line skills, one per artifact of the chain, keyed by the directory each
 * lives in under `.claude/skills/` and naming the artifact it writes.
 *
 * One list, read by every test that walks the line skills - their word budget
 * and their shape - so a rename is one edit here and a directory the list
 * names that is not there fails as a named assertion, never as `ENOENT`.
 * `workflow-round` is the procedure the seven call and is read on its own.
 */
export const LINE_SKILLS = Object.freeze({
  "workflow-plan": "proposal.md",
  "workflow-design": "ui-design.md",
  "workflow-tech": "tech-design.md",
  "workflow-specify": "spec.md",
  "workflow-tasks": "tasks.md",
  "workflow-build": "task group",
  "workflow-land": "plan:land",
});

/** The path of a skill's instructions under the store's root. */
export const skillPath = (name) => `.claude/skills/${name}/SKILL.md`;
