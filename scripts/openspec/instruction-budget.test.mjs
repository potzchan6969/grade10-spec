/*
 * Instruction text has one home per rule per load path, and the always-loaded
 * surfaces hold to a budget. Two things drift otherwise: a rule accretes into
 * AGENTS.md or a config.yaml `rules` block one commit at a time, and a skill
 * points at a rulebook section by name after the section was renamed. Raising
 * a budget is a commit that says why.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");
const words = (text) => text.split(/\s+/).filter(Boolean).length;

// Words. AGENTS.md loads on every path; each `rules.<artifact>` block loads on
// that artifact's path through the CLI. The schema instruction and template are
// the rules' home on the artifact path, so a block holds what only it says.
const AGENTS_BUDGET = 2500;
const RULES_BUDGET = {
  proposal: 110,
  specs: 500,
  "user-journeys": 90,
  "test-cases": 40,
  "ui-design": 40,
  "tech-design": 40,
  tasks: 40,
};

test("AGENTS.md holds to its word budget", () => {
  const count = words(read("AGENTS.md"));
  assert.ok(
    count <= AGENTS_BUDGET,
    `AGENTS.md is ${count} words; the budget is ${AGENTS_BUDGET}. Move the rule to the document that owns it and link the heading, or raise the budget here and say why in the commit.`,
  );
});

test("each config.yaml rules block holds to its word budget", () => {
  const config = read("openspec/config.yaml");
  const rules = config.split(/^rules:\s*$/m)[1]?.split(/^[a-z]/m)[0] ?? "";
  const blocks = {};
  let key = null;
  for (const line of rules.split("\n")) {
    const head = /^ {2}([a-z-]+):\s*$/.exec(line);
    if (head) {
      key = head[1];
      blocks[key] = 0;
      continue;
    }
    if (key && /^ {4}- /.test(line)) blocks[key] += words(line.slice(6));
  }
  assert.deepEqual(
    Object.keys(blocks).sort(),
    Object.keys(RULES_BUDGET).sort(),
    "every rules block has a budget here, and no budget names a block that is gone",
  );
  for (const [artifact, count] of Object.entries(blocks)) {
    assert.ok(
      count <= RULES_BUDGET[artifact],
      `rules.${artifact} is ${count} words; the budget is ${RULES_BUDGET[artifact]}. The schema instruction and template already load on this path — write the rule there once, or raise the budget here and say why.`,
    );
  }
});

// Pointers. The two QA skills point at the rulebook by section name in bold.
// A bold phrase mid-sentence in those skills is a pointer, and it resolves to
// a heading or a bold bullet lead in the rulebook, or to a heading in the
// skill itself. Bold that opens a step, a bullet or a field is a label, not a
// pointer, and is skipped.
const RULEBOOK = "docs/governance/specs-to-test-cases.md";
const SKILLS = [
  ".claude/skills/spec-to-tcs/SKILL.md",
  ".claude/skills/tcs-review/SKILL.md",
];
const squash = (text) => text.replace(/\s+/g, " ").trim();
// A code span never carries a pointer, and its text is not part of one.
const prose = (path) =>
  read(path).replace(/`[^`\n]*`/g, (span) => " ".repeat(span.length));

const rulebookTargets = () => {
  const text = prose(RULEBOOK);
  const targets = new Set();
  for (const m of text.matchAll(/^#{1,4} (.+?)\s*$/gm)) {
    targets.add(squash(m[1]));
    if (m[1].includes(":")) targets.add(squash(m[1].split(":")[0]));
  }
  for (const m of text.matchAll(/^\s*[-*] \*\*([^*]+)\*\*/gm))
    targets.add(squash(m[1]));
  return targets;
};

const pointers = (path) => {
  const text = prose(path);
  const own = new Set(
    [...text.matchAll(/^#{1,4} (.+?)\s*$/gm)].map((m) => squash(m[1])),
  );
  const found = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*/g)) {
    const phrase = squash(m[1]);
    const before = text.slice(0, m.index);
    const lineStart = before.slice(before.lastIndexOf("\n") + 1);
    if (/^\s*(?:[-*]|\d+\.)?\s*$/.test(lineStart)) continue; // label leads a line
    if (/[.,:;?!]$/.test(phrase)) continue; // a label, or a field
    if (own.has(phrase)) continue;
    found.push({ phrase, line: before.split("\n").length });
  }
  return found;
};

test("every bold pointer in the QA skills names a rulebook section", () => {
  const targets = rulebookTargets();
  const dangling = [];
  for (const skill of SKILLS) {
    for (const { phrase, line } of pointers(skill)) {
      if (!targets.has(phrase)) dangling.push(`${skill}:${line} **${phrase}**`);
    }
  }
  assert.deepEqual(
    dangling,
    [],
    `bold mid-sentence in a QA skill is a pointer into ${RULEBOOK}; each one names a heading or a bold bullet lead there, in the rulebook's own casing`,
  );
});
