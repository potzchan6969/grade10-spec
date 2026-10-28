/*
 * Instruction text has one home per rule per load path, and the always-loaded
 * surfaces hold to a budget. Two things drift otherwise: a rule accretes into
 * AGENTS.md or a config.yaml `rules` block one commit at a time, and a skill
 * points at a rulebook section by name after the section was renamed. Raising
 * a budget is a commit that says why.
 */
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");
const words = (text) => text.split(/\s+/).filter(Boolean).length;

// Words. AGENTS.md loads on every path; each `rules.<artifact>` block loads on
// that artifact's path through the CLI. The schema instruction and template are
// the rules' home on the artifact path, so a block holds what only it says.
// The clarification format lives in AGENTS.md.
const AGENTS_BUDGET = 2970;
// The planning skills: each number is that skill's size after the pass that
// gave its rules one home. The next rule earns its words by cutting others, or
// raises this number in a commit that says why.
const SKILLS_BUDGET = {
  "planning-pm": 2740,
  // 1879 after design questions link to the shared clarification-request
  // shape instead of defining a competing one.
  "planning-design": 1879,
  // 1050 after the engineer lane gained its hand-off and archive guidance.
  // 1170 after the sweep, review preflight and cluster reconciliation steps.
  // 1185 after the rule that deployed evidence is never requested before archive.
  "planning-dev": 1185,
};
const RULES_BUDGET = {
  // 150 after the proposal lane gained its PRD and metric guardrails.
  proposal: 150,
  // Back to one block after the artifact split was undone: two passes over one
  // file, so one set of rules. 500 was the budget before the anchors; the
  // anchor and Purpose rules cost a little more than the journey cap and the
  // `Accepted by` rule they replaced.
  specs: 520,
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

test("each planning skill holds to its word budget", () => {
  for (const [name, budget] of Object.entries(SKILLS_BUDGET)) {
    const skill = `.claude/skills/${name}/SKILL.md`;
    assert.ok(
      existsSync(join(ROOT, skill)),
      `${skill} is not a skill; the budget names a directory that is not there`,
    );
    const count = words(read(skill));
    assert.ok(
      count <= budget,
      `${skill} is ${count} words; the budget is ${budget}. Point at the document that owns the rule, or raise the budget here and say why in the commit.`,
    );
  }
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

// Slash names. A `/<slug>` in backticks reads as a command to run, so a name a
// skill or a governance page writes is one a reader can load. Two other kinds
// wear the same shape: the manual's own routes, and the harness's built-in
// commands. `docs/references/` is explanatory and exempt.
const ROUTES = new Set([
  "in-flight",
  "my-turn",
  "pending",
  "qa",
  "recent",
  "references",
  "p",
  "guides",
  "platform",
  "vocabulary",
]);
const HARNESS = new Set(["add-dir", "compact", "tc", "sc"]);
// The application repository's own commands - `dev-help`'s restored router
// names them in its `Invoke` column, its `Here` column names this store's
// equivalent where one exists. They resolve to nothing under
// `.claude/skills/` here because they never lived here.
const APP_SKILLS = new Set([
  "implement",
  "implement-then-review",
  "tdd",
  "review-changes",
  "archive-change",
]);
const SLASH_TREES = [".claude/skills", "docs/governance"];

const markdownUnder = (dir) => {
  const found = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) found.push(...markdownUnder(path));
    else if (entry.name.endsWith(".md")) found.push(path);
  }
  return found.sort();
};

test("every slash name a skill or a governance page writes resolves to a skill", () => {
  const dangling = [];
  for (const tree of SLASH_TREES) {
    for (const path of markdownUnder(tree)) {
      const text = read(path);
      for (const m of text.matchAll(/`\/([a-z][a-z0-9-]*)`/g)) {
        const slug = m[1];
        if (ROUTES.has(slug) || HARNESS.has(slug) || APP_SKILLS.has(slug))
          continue;
        const skill = join(ROOT, ".claude/skills", slug, "SKILL.md");
        if (existsSync(skill)) continue;
        const line = text.slice(0, m.index).split("\n").length;
        dangling.push(`${path}:${line} \`/${slug}\``);
      }
    }
  }
  assert.deepEqual(
    dangling,
    [],
    "a `/<slug>` in backticks resolves to .claude/skills/<slug>/SKILL.md, or it is a manual route or a harness command on the lists above; a retired skill is swept from every page that named it",
  );
});
