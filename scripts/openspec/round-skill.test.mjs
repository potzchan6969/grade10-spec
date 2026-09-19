/*
 * The round is a procedure with one home. These tests hold the `round` skill
 * and the seven line skills to what the capability says they are: six steps,
 * four moves, the perspectives read from the schema through one CLI rather
 * than copied into prose, a question in the `Q<n>` grammar, a re-read that
 * goes oldest first, and the reader definitions under `.claude/agents/`.
 * Written before the skills, in the shape of
 * `scripts/design-sync/annotation-skill.test.mjs`.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");
// A claim is prose, and prose wraps. Every phrase below is matched against the
// file with its line breaks collapsed and without regard to case, so a rewrap
// or a bold lead never fails a claim the file still makes.
const claims = (path) => read(path).replace(/\s+/g, " ");

const ROUND = ".claude/skills/round/SKILL.md";
const LINES = {
  plan: "proposal.md",
  design: "ui-design.md",
  tech: "tech-design.md",
  specify: "spec.md",
  tasks: "tasks.md",
  build: "task group",
  land: "plan:land",
};

// Paths this change's other groups deliver: group 1.4 writes the perspectives
// reader and its CLI, and the team map lands with
// `stage-changes-and-notify-hands`. Delete an entry as its file lands - an
// unresolved path is the finding this test exists for.
const PENDING = new Set([
  "scripts/openspec/perspectives.mjs",
  "scripts/openspec/lib/perspectives.mjs",
  "docs/prds/team.yaml",
]);

const frontMatter = (text) => {
  const block = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert.ok(block, "a skill or reader definition opens with front matter");
  const keys = {};
  for (const line of block[1].split("\n")) {
    const pair = /^([a-z-]+):\s*(.*)$/.exec(line);
    if (pair) keys[pair[1]] = pair[2].trim();
  }
  return keys;
};

// Every repository path a document names, whether in a code span, in prose or
// as a relative link target. A placeholder (`<change>`, a glob) names no file.
const pathsNamed = (path, text) => {
  const found = new Set();
  const own = dirname(path);
  const keep = (raw, base) => {
    const cleaned = raw.replace(/[.,;:)`'"]+$/, "");
    if (!cleaned || /[<>*…|]/.test(cleaned)) return;
    found.add(normalize(join(base, cleaned)));
  };
  const top =
    /(?:^|[\s(`"])((?:\.claude|\.codex|\.cursor|\.github|apps|docs|openspec|packages|scripts|tools)\/[A-Za-z0-9._/-]+)/g;
  for (const m of text.matchAll(top)) keep(m[1], ".");
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|#|mailto:)/.test(m[1])) continue;
    keep(m[1].split("#")[0], own);
  }
  return [...found];
};

const assertPathsResolve = (path) => {
  const missing = pathsNamed(path, read(path)).filter(
    (named) => !PENDING.has(named) && !existsSync(resolve(ROOT, named)),
  );
  assert.deepEqual(
    missing,
    [],
    `${path} names a path that resolves to nothing; fix the path or land the file`,
  );
};

test("the round skill claims the six steps", () => {
  const skill = claims(ROUND);
  for (const step of ["Ask", "Draft", "Challenge", "Verify", "Read", "Land"]) {
    assert.match(
      skill,
      new RegExp(`\\|\\s*${step}\\s*\\|`),
      `step ${step} is a row of the six steps`,
    );
  }
  assert.match(skill, /six steps/i);
});

test("the round skill claims the four moves", () => {
  const skill = claims(ROUND);
  for (const move of ["Answer", "Remark", "Land", "Edit"]) {
    assert.match(
      skill,
      new RegExp(`\\|\\s*${move}\\s*\\|`),
      `move ${move} is a row of the four moves`,
    );
  }
  assert.match(skill, /four moves/i);
  // The two that are not a reply, and the two rules that shape a remark.
  assert.match(skill, /applied as written/i);
  assert.match(skill, /the hand's word for the lines it touched/i);
});

test("the round skill reads its perspectives through the CLI", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /node scripts\/openspec\/perspectives\.mjs <artifact\|group> --diff/,
  );
  assert.match(skill, /readers/i);
  assert.match(skill, /bundle/i);
  assert.match(skill, /`always`/);
  assert.match(skill, /verifies itself/i);
});

test("the round skill carries no copy of the perspectives table", () => {
  const skill = claims(ROUND);
  assert.doesNotMatch(
    skill,
    /\|\s*Artifact\s*\|\s*Perspectives/i,
    "the artifact-to-readers table is the schema's",
  );
  assert.doesNotMatch(
    skill,
    /`(surface|schema|export|system|migration|flag|money|deploy|copy)`/,
    "a `when` trigger other than `always` is the schema's to name",
  );
  for (const name of [
    "code smell",
    "the design system's inventory",
    "order and dependencies",
  ]) {
    assert.ok(
      !skill.includes(name),
      `the perspective "${name}" is named in the schema, not in the skill`,
    );
  }
});

test("the round skill writes a question in the Q<n> grammar", () => {
  const skill = claims(ROUND);
  assert.match(skill, /`Q<n>`/);
  assert.match(skill, /❓ <role> - recommended: <option>/);
  assert.match(skill, /Instead of/i);
  assert.match(skill, /never reused/i);
  assert.match(skill, /❓ line/i);
});

test("the round skill reads a landing's artifacts oldest first", () => {
  const skill = claims(ROUND);
  assert.match(skill, /oldest first/i);
  assert.match(skill, /round:reviewed/i);
  assert.match(skill, /stops? there/i);
  assert.match(skill, /extend/i);
  assert.match(skill, /supersede/i);
  assert.match(skill, /split/i);
});

test("the round skill names the agents directory and never the submodule", () => {
  const skill = claims(ROUND);
  assert.match(skill, /\.claude\/agents\//);
  assert.doesNotMatch(skill, /external\/grade10-spec/);
  assert.match(skill, /plan:land/i);
  assert.match(skill, /round:row/i);
  assert.match(skill, /round:thread/i);
  // The round writes the thread line to a file; a plain step posts it.
  assert.match(skill, /\.round\/thread\.txt/);
  assert.doesNotMatch(skill, /SLACK_BOT_TOKEN/);
});

test("every path the round skill names resolves", () => {
  assertPathsResolve(ROUND);
});

test("each line skill names its artifact and follows the round", () => {
  for (const [name, artifact] of Object.entries(LINES)) {
    const path = `.claude/skills/${name}/SKILL.md`;
    const skill = claims(path);
    assert.equal(frontMatter(read(path)).name, name);
    assert.ok(
      skill.includes(artifact),
      `/${name} names the artifact it writes (${artifact})`,
    );
    assert.match(
      skill,
      /follow `round`|\/round/,
      `/${name} calls the round rather than restating it`,
    );
    assert.doesNotMatch(skill, /external\/grade10-spec/);
    assertPathsResolve(path);
  }
});

test("the readers are defined once, read-only, and see no other reader", () => {
  const mapping = read(".claude/agents/README.md");
  const agents = [
    ...mapping.matchAll(/`\.claude\/agents\/([a-z-]+\.md)`/g),
  ].map((m) => m[1]);
  assert.ok(agents.length > 0, "the README maps each perspective to a reader");
  assert.ok(
    new Set(agents).has("verifier.md"),
    "the verifier is one of the definitions",
  );
  for (const file of new Set(agents)) {
    const path = `.claude/agents/${file}`;
    const keys = frontMatter(read(path));
    assert.ok(keys.description, `${path} carries a description`);
    assert.match(keys.model, /^(opus|sonnet)$/, `${path} names its model`);
    assert.equal(
      keys.tools,
      "Read, Grep, Glob, Bash",
      `${path} is read-only: it reports findings and writes nothing`,
    );
    assert.match(
      claims(path),
      /never another reader's/i,
      `${path} says it is given no other reader's findings`,
    );
    assertPathsResolve(path);
  }
});
