/*
 * The round is a procedure with one home. These tests hold the `round` skill
 * and the seven line skills to what the capability says they are: six steps,
 * four moves, the perspectives read from the schema through one CLI rather
 * than copied into prose, a question in the `Q<n>` grammar, a re-read that
 * goes oldest first, and the reader definitions under `.claude/agents/`.
 * Written before the skills, in the shape of
 * `scripts/design-sync/annotation-skill.test.mjs`.
 *
 * The readers a claim can name are enumerated from the schema itself, through
 * `lib/perspectives.mjs` - never a copy of `.claude/agents/README.md`'s old
 * table, which this change deletes - so a reader the schema stops dispatching
 * drops out of this test's world on its own.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { planningSchema, TRIGGERS } from "./lib/perspectives.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");
// A claim is prose, and prose wraps. Every phrase below is matched against the
// file with its line breaks collapsed and without regard to case, so a rewrap
// or a bold lead never fails a claim the file still makes.
const claims = (path) => read(path).replace(/\s+/g, " ");

const ROUND = ".claude/skills/round/SKILL.md";
const DESIGN = ".claude/skills/design/SKILL.md";
const SPECIFY = ".claude/skills/specify/SKILL.md";
const LINES = {
  plan: "proposal.md",
  design: "ui-design.md",
  tech: "tech-design.md",
  specify: "spec.md",
  tasks: "tasks.md",
  build: "task group",
  land: "plan:land",
};

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
    (named) => !existsSync(resolve(ROOT, named)),
  );
  assert.deepEqual(
    missing,
    [],
    `${path} names a path that resolves to nothing; fix the path or land the file`,
  );
};

// A markdown heading's GitHub-style slug: lower-cased, apostrophes dropped,
// every other run of non-alphanumerics collapsed to one hyphen, as
// `instruction-budget.test.mjs` reads a rulebook's own headings.
const slug = (heading) =>
  heading
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const headingSlugs = (path) => {
  const found = new Set();
  for (const m of read(path).matchAll(/^#{1,6}\s+(.+?)\s*$/gm))
    found.add(slug(m[1]));
  return found;
};

// Every link this document carries into another markdown file's anchor
// resolves to a heading actually there - the same failure mode
// `instruction-budget.test.mjs` guards against for a bold pointer into a
// rulebook, applied here to `](path#anchor)` links.
const assertAnchorsResolve = (path) => {
  const own = dirname(path);
  const bad = [];
  for (const m of read(path).matchAll(/\]\(([^)\s#]+\.md)#([^)\s]+)\)/g)) {
    const target = normalize(join(own, m[1]));
    if (!existsSync(resolve(ROOT, target))) continue; // named by assertPathsResolve
    if (!headingSlugs(target).has(m[2]))
      bad.push(`${path} -> ${target}#${m[2]}`);
  }
  assert.deepEqual(
    bad,
    [],
    "a link's anchor names a heading its target does not carry",
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

test("shared-planning-agent-rounds-SC-01 - a draft reaches its hand read and verified", () => {
  const skill = claims(ROUND);
  assert.match(skill, /put nothing on `main`/i);
  assert.match(skill, /one reply, of one screen/i);
  assert.match(skill, /a finding that falls is shown nowhere/i);
});

test("shared-planning-agent-rounds-SC-02 - nothing lands without the hand's word", () => {
  const skill = claims(ROUND);
  assert.match(skill, /On the hand's word/i);
  assert.match(skill, /stays on the change's branch until the hand's word/i);
});

test("shared-planning-agent-rounds-SC-03 - a finding that stands changes the draft", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /a finding that stands is applied to the draft\s+before step 5/i,
  );
  assert.match(skill, /Apply what stands\. Then write the summary\./i);
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

test("shared-planning-agent-rounds-SC-11 - a question answered by its id alone", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /`Q<n>: <answer>`, or `Q<n>` alone \| The answer, or the recommendation where the id stands alone/i,
  );
});

test("shared-planning-agent-rounds-SC-12 - a remark is applied and re-read narrowly", () => {
  const skill = claims(ROUND);
  assert.match(skill, /a remark re-runs only the perspectives the/i);
  assert.match(skill, /edited lines summon, and the reply names them/i);
  // The round writes no row: the landing names the remark in its own row.
  assert.match(skill, /the remark named in the landing's row as what stood/i);
});

test("shared-planning-agent-rounds-SC-13 - a remark settles a question that was asked", () => {
  const skill = claims(ROUND);
  assert.match(skill, /a decisions row where it settles a choice one asked/i);
});

test("shared-planning-agent-rounds-SC-14 - a hand's own push is their word", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /Edit \| A push to the change's branch, from a terminal or the code host \| Nothing: the push is the hand's word/i,
  );
});

test("shared-planning-agent-rounds-SC-15 - a reply the round cannot apply is answered", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /answer with what you could not do; the\s+question it names stays open, and nothing reaches `main` on that reply/i,
  );
});

test("shared-planning-agent-rounds-SC-16 - a remark on a page's marked lines", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /from the product manager it is\s+applied to the page as written; from any other hand it becomes a ❓ line on\s+the page for the product manager/i,
  );
});

test("shared-planning-agent-rounds-SC-06 - the requirements' round takes two readings", () => {
  const skill = claims(SPECIFY);
  assert.match(skill, /the two independent readings of the change's anchors/i);
  assert.match(skill, /neither reader seeing the other's output/i);
  assert.match(skill, /no agent decides between them/i);
  assert.match(
    skill,
    /the product manager's word at the reconciliation\s+lands `spec\.md` and `feature-tcs\.md` together/i,
  );
});

test("shared-planning-agent-rounds-SC-07 - a reading raises what it cannot settle", () => {
  const skill = claims(SPECIFY);
  assert.match(
    skill,
    /a disagreement or a question neither\s+reading can settle is a numbered `Q<n>` row for them/i,
  );
});

test("the round skill reads its perspectives through the CLI", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /node scripts\/openspec\/perspectives\.mjs <artifact\|group> --diff/,
  );
  assert.match(skill, /readers/i);
  assert.match(skill, /bundle/i);
  assert.match(skill, /verifier/i);
  assert.match(skill, /`always`/);
  assert.match(skill, /verifies itself/i);
  // The diff command a round runs before it asks for its readers, and what a
  // round with nothing on it yet is read as.
  assert.match(
    skill,
    /git diff \$\(git merge-base origin\/main HEAD\)\.\.\.HEAD -- openspec\/changes\/<change> > \.round\/diff/,
  );
  assert.match(skill, /--change <change>/);
  assert.match(skill, /the floor alone/i);
});

test("the round skill carries no copy of the perspectives table", () => {
  const skill = claims(ROUND);
  assert.doesNotMatch(
    skill,
    /\|\s*Artifact\s*\|\s*Perspectives/i,
    "the artifact-to-readers table is the schema's",
  );
  const triggers = TRIGGERS.filter((one) => one !== "always");
  assert.ok(triggers.length > 0, "there is at least one non-always trigger");
  assert.doesNotMatch(
    skill,
    new RegExp(`\`(${triggers.join("|")})\``),
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

test("shared-planning-agent-rounds-SC-20 - a design needs a frame nobody drew", () => {
  const skill = claims(DESIGN);
  assert.match(skill, /The frames come from the designer/i);
  assert.match(
    skill,
    /A screen no frame in the ask covers writes a dated\s+`awaiting: ui-design:/i,
  );
  assert.match(skill, /the draft describes no screen of its own in its place/i);
});

test("shared-planning-agent-rounds-SC-21 - a preference becomes a numbered question", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /a preference or a product decision is the next unused `Q<n>`/i,
  );
  assert.match(skill, /❓ <role> - recommended: <option>/);
  assert.match(skill, /Instead of/i);
});

test("shared-planning-agent-rounds-SC-22 - a question id is never reused", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /the next number the change has not used, per change and never\s+reused: not a withdrawn row's, not an answered one's/i,
  );
});

test("shared-planning-agent-rounds-SC-23 - an open row holds no stage", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /an open row holds no stage and no tick\. The one question\s+that holds a landing is a goal or a non-goal that moved/i,
  );
});

test("shared-planning-agent-rounds-SC-24 - a draft needs a value nobody confirmed", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /a product detail the draft needs that the page does not\s+state is a ❓ line on the page/i,
  );
  assert.match(
    skill,
    /a product detail on the page is not also a numbered\s+row/i,
  );
});

test("shared-planning-agent-rounds-SC-25 - a finding names a state and a mechanism", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /A state a reader sees \| A `## States` bullet in `ui-design\.md`/i,
  );
  assert.match(skill, /A mechanism \| A decision in `tech-design\.md`/i);
});

test("the round skill writes a question in the Q<n> grammar", () => {
  const skill = claims(ROUND);
  assert.match(skill, /`Q<n>`/);
  assert.match(skill, /❓ <role> - recommended: <option>/);
  assert.match(skill, /Instead of/i);
  assert.match(skill, /never reused/i);
  assert.match(skill, /❓ line/i);
});

test("shared-planning-agent-rounds-SC-40 - a read that edits opens a round", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /write no `reviewed:` line\. Open a round for that\s+artifact's hand, naming what reached it, and stop there/i,
  );
});

test("shared-planning-agent-rounds-SC-41 - artifacts are read oldest first, and the read stops at the first edit", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /\*\*Oldest first\*\* — read every artifact after the one that moved, in the order of the upstream set/i,
  );
  assert.match(
    skill,
    /What comes after\s+is read again once that round lands/i,
  );
});

test("shared-planning-agent-rounds-SC-42 - a landing with nothing after it says nothing more", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /\*\*Nothing after it\*\* — read nothing and say nothing beyond the landing line/i,
  );
});

test("the round skill reads a landing's artifacts oldest first", () => {
  const skill = claims(ROUND);
  assert.match(skill, /oldest first/i);
  assert.match(skill, /extend/i);
  assert.match(skill, /supersede/i);
  assert.match(skill, /split/i);
});

test("shared-planning-agent-rounds-SC-45 - a moved goal asks the product manager", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /ask the product manager one numbered\s+question with three answers, and rewrite nothing in place/i,
  );
});

test("shared-planning-agent-rounds-SC-46 - nothing lands until the answer", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /nothing after `decisions\.md`\s+lands until it arrives/i,
  );
});

test("shared-planning-agent-rounds-SC-47 - each answer opens or closes what it names", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /\|\s*extend\s*\|.*the moved goal, and everything after the proposal is read again/i,
  );
  assert.match(
    skill,
    /\|\s*supersede\s*\|.*a new change opens from the moved goal/i,
  );
  assert.match(skill, /\|\s*split\s*\|.*a new change takes the moved part/i);
});

test("shared-planning-agent-rounds-SC-48 - a late answer reaches the requirements", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /a row landing in `decisions\.md`'s `## Raised`\s+puts `spec\.md` and `feature-tcs\.md` behind/i,
  );
  assert.match(skill, /both are read again before `tasks\.md` lands/i);
});

test("shared-planning-agent-rounds-SC-49 - the requirements pass reads the design", () => {
  const skill = claims(SPECIFY);
  assert.match(
    skill,
    /the requirements pass reads `tech-design\.md` beside\s+`ui-design\.md`; a requirement contradicting either is not written/i,
  );
});

test("shared-planning-agent-rounds-SC-50 - a requirement reaching the design writes the wait", () => {
  const skill = claims(SPECIFY);
  assert.match(skill, /awaiting: tech-design:/);
  assert.match(skill, /it holds no stage/i);
});

test("shared-planning-agent-rounds-SC-65 - a round from a terminal is the same round", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /What is wanted, said in the thread, in a terminal, or as a push the hand makes/i,
  );
});

test("shared-planning-agent-rounds-SC-68 - a resumed run continues from what is pushed", () => {
  const skill = claims(ROUND);
  assert.match(
    skill,
    /\*\*The branch\*\* — `change\/<id>`: what is already drafted and pushed/i,
  );
  assert.match(
    skill,
    /A run that died mid-draft is picked up, never re-drafted: the files and the thread are the only state a round keeps/i,
  );
});

test("every path the round skill names resolves", () => {
  assertPathsResolve(ROUND);
  assertAnchorsResolve(ROUND);
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
    assertAnchorsResolve(path);
  }
});

// The readers a round may dispatch, enumerated from the schema itself rather
// than from a prose table: every distinct `agent` any artifact's
// `perspectives:` or the schema's `apply:` block names, plus the verifier,
// which no schema row names because it is dispatched by verdict rather than
// by trigger.
const readerFiles = () => {
  const schema = planningSchema(ROOT);
  const files = new Set([".claude/agents/verifier.md"]);
  for (const artifact of schema.artifacts)
    for (const { agent } of artifact.perspectives) files.add(agent);
  for (const { agent } of schema.apply) files.add(agent);
  return [...files].sort();
};

test("the readers are defined once, read-only, and see no other reader", () => {
  const agents = readerFiles();
  assert.ok(agents.length > 0, "the schema dispatches at least one reader");
  assert.ok(
    agents.includes(".claude/agents/verifier.md"),
    "the verifier is one of the definitions",
  );
  for (const path of agents) {
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
    assertAnchorsResolve(path);
  }
});

test("shared-planning-agent-rounds-SC-31 - the tech and build readers name a principle per finding", () => {
  for (const file of ["tech", "build"]) {
    const text = readFileSync(
      join(ROOT, ".claude/agents", `${file}.md`),
      "utf8",
    );
    assert.match(
      text,
      /system-design\.md/,
      `${file}.md cites the governance page`,
    );
    assert.match(
      text,
      /\| Principle \|/,
      `${file}.md returns a principle per finding`,
    );
  }
});

test("every reader's stance names Nitpick, the store's own label", () => {
  for (const path of readerFiles()) {
    assert.match(
      claims(path),
      /\*\*Nitpick\*\*/,
      `${path} labels its claim-not-a-preference bullet Nitpick, as docs/governance/system-design.md does`,
    );
  }
});
