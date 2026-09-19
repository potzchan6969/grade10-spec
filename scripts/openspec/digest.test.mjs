import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { weekOf } from "./digest.mjs";

/**
 * Monday's digest, over one store committed at fixed dates.
 *
 * Every line the digest can say is a fact somebody has to have left in the
 * store days ago — a question nobody answered, a change nothing has moved, an
 * artifact something before it moved past — so the fixture is a git history
 * and not a directory: the day count is the point of four of the six lines.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const DAY = 86_400_000;

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    hand: pm",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    hand: pm",
  "    required: true",
  "    generates: decisions.md",
  "    requires: [proposal]",
  "    upstream: [proposal]",
  "  - id: ui-design",
  "    hand: design",
  "    required: false",
  "    generates: ui-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: tasks",
  "    hand: dev",
  "    required: true",
  "    generates: tasks.md",
  "    requires: [decisions]",
  "    upstream: [decisions]",
  "",
].join("\n");

const TEAM = [
  "handles:",
  "  dana:",
  "    email: dana@test",
  "    slack: U-DANA",
  "    roles: [pm, design, dev]",
  "  erin:",
  "    email: erin@test",
  "    slack: U-ERIN",
  "    roles: [tech]",
  "channels:",
  "  pm: C-PM",
  "",
].join("\n");

const proposalOf = (title, note = "") =>
  [`# ${title}`, "", "## Why", "", `Nobody has.${note}`, ""].join("\n");

const DECIDED = [
  "## Decisions",
  "",
  "| Q | Asked | Decided | Instead of |",
  "| --- | --- | --- | --- |",
  "| Q1 | Which bound? | ❓ pm - seven days | A month |",
  "",
].join("\n");

function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "digest-store-"));
  const git = (args, daysAgo = 0) => {
    const at = new Date(Date.now() - daysAgo * DAY).toISOString();
    return execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    ).trim();
  };
  const write = (files) => {
    for (const [path, text] of Object.entries(files)) {
      const file = join(root, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
    }
  };
  const commit = (message, daysAgo = 0) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message], daysAgo);
    return git(["rev-parse", "HEAD"]);
  };
  git(["init", "--quiet", "--initial-branch=main", "."]);
  write({
    "docs/prds/team.yaml": TEAM,
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
  });
  return { root, git, write, commit };
}

const digest = (root, args = []) => {
  const done = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "digest.mjs"),
      "--root",
      root,
      "--manual-url",
      "https://spec.test/planning",
      ...args,
    ],
    { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } },
  );
  return { ...done, read: () => JSON.parse(done.stdout) };
};

/** One week of one person: a change on them with a question nobody answered
 * and a wait written on it, idle since it landed; an artifact something before
 * it moved past nine days ago; and a change a released dependency freed. */
function week() {
  const { root, write, commit } = sandbox();
  write({
    "openspec/changes/ask-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "  design: dana",
      "awaiting:",
      '  ui-design: "2026-10-05 waiting on the brand review"',
      "",
    ].join("\n"),
    "openspec/changes/ask-it/proposal.md": proposalOf("Ask it"),
    "openspec/changes/ask-it/decisions.md": DECIDED,
  });
  commit("propose ask-it", 10);
  write({
    "openspec/changes/behind-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "",
    ].join("\n"),
    "openspec/changes/behind-it/proposal.md": proposalOf("Behind it"),
    "openspec/changes/behind-it/decisions.md": DECIDED.replace(
      "❓ pm -",
      "It is",
    ),
  });
  commit("propose behind-it", 20);
  write({
    "openspec/changes/behind-it/proposal.md": proposalOf(
      "Behind it",
      " Again.",
    ),
  });
  commit("reword behind-it", 9);
  write({
    "openspec/changes/dep-done/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "released_in: v1.2",
      "",
    ].join("\n"),
    "openspec/changes/dep-done/proposal.md": proposalOf("Dep done"),
    "openspec/changes/freed-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  dev: dana",
      "depends_on:",
      "  - dep-done",
      "",
    ].join("\n"),
    "openspec/changes/freed-it/proposal.md": proposalOf("Freed it"),
    "openspec/changes/quiet-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  tech: erin",
      "",
    ].join("\n"),
    "openspec/changes/quiet-it/proposal.md": proposalOf("Quiet it"),
  });
  commit("release the dependency", 3);
  return root;
}

test("shared-planning-change-stages-SC-48 - the digest says all six kinds of line in one message", () => {
  const { read } = digest(week());
  const { messages } = read();

  assert.equal(messages.length, 1);
  const [message] = messages;
  assert.equal(message.handle, "dana");
  assert.equal(message.channel, "U-DANA");
  assert.equal(message.to, "member");
  assert.deepEqual([...new Set(message.lines.map((one) => one.kind))].sort(), [
    "behind",
    "freed",
    "idle",
    "now",
    "question",
    "waiting",
  ]);
});

test("the digest's lines name what each is about", () => {
  const { read } = digest(week());
  const { messages } = read();
  const of = (kind) => messages[0].lines.filter((one) => one.kind === kind);

  assert.match(of("now")[0].text, /Ask it/);
  assert.match(of("question")[0].text, /Q1/);
  assert.match(of("question")[0].text, /Which bound/);
  assert.equal(of("idle")[0].days, 10);
  assert.match(of("behind")[0].text, /decisions/);
  assert.equal(of("behind")[0].days, 9);
  assert.match(of("waiting")[0].text, /brand review/);
  assert.match(of("freed")[0].text, /dep-done/);
  assert.match(messages[0].text, /Ask it/);
});

test("shared-planning-change-stages-SC-50 - the digest reaches nobody with nothing to say", () => {
  const { read } = digest(week());
  const { messages } = read();

  assert.deepEqual(
    messages.map((one) => one.handle),
    ["dana"],
  );
});

test("shared-planning-change-stages-SC-49 - the digest leaves an artifact behind six days off the week", () => {
  const { root, write, commit } = sandbox();
  write({
    "openspec/changes/fresh-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "",
    ].join("\n"),
    "openspec/changes/fresh-it/proposal.md": proposalOf("Fresh it"),
    "openspec/changes/fresh-it/decisions.md": "## Goals\n\n- One\n",
  });
  commit("propose fresh-it", 20);
  write({
    "openspec/changes/fresh-it/proposal.md": proposalOf("Fresh it", " Again."),
  });
  commit("reword fresh-it", 6);

  const { messages } = digest(root).read();

  assert.deepEqual(
    (messages[0]?.lines ?? []).filter((one) => one.kind === "behind"),
    [],
  );
});

test("shared-planning-change-stages-SC-49 - a stale reviewed: id is listed once what changed is old enough", () => {
  const { root, write, commit } = sandbox();
  write({
    "openspec/changes/stale-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "  design: dana",
      "reviewed:",
      "  ui-design: '00000000'",
      "",
    ].join("\n"),
    "openspec/changes/stale-it/proposal.md": proposalOf("Stale it"),
    "openspec/changes/stale-it/decisions.md": "## Goals\n\n- One\n",
    "openspec/changes/stale-it/ui-design.md": "## Screens\n\nOne screen.\n",
  });
  // A `reviewed:` id already on the branch, wrong from the day it was
  // written: the digest still counts its days from the newest of what is
  // before the artifact, an id carrying no date of its own.
  commit("propose stale-it, already read against a stale id", 8);

  const { messages } = digest(root).read();
  const behind = (messages[0]?.lines ?? []).filter(
    (one) => one.kind === "behind" && one.change === "stale-it",
  );

  assert.equal(behind.length, 1);
  assert.equal(behind[0].days, 8);
});

test("the digest lists a page's open question beside the decisions rows", () => {
  const { root, write, commit } = sandbox();
  write({
    "docs/prds/products/demo-product/rules.md": [
      "---",
      "title: Rules",
      "summary: One rule the badge turns on.",
      "---",
      "",
      "## Points",
      "",
      "A point is earned per dollar spent.",
      "",
      "- ❓ design - Whether the badge shows at zero points",
      "",
    ].join("\n"),
    "openspec/changes/page-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "  design: dana",
      "",
    ].join("\n"),
    "openspec/changes/page-it/proposal.md": [
      "# Page it",
      "",
      "## Why",
      "",
      "So the badge's rule is settled before the page.",
      "",
      "## References",
      "",
      "- [Rules · Points](../../../docs/prds/products/demo-product/rules.md#points)",
      "",
    ].join("\n"),
    "openspec/changes/page-it/decisions.md": "## Goals\n\n- One outcome.\n",
  });
  commit("propose page-it", 1);

  const { messages } = digest(root).read();

  assert.equal(messages.length, 1);
  const [message] = messages;
  assert.equal(message.handle, "dana");
  const question = message.lines.find(
    (one) => one.kind === "question" && one.change === "page-it",
  );
  assert.ok(question, "expected the page's open question in the digest");
  assert.match(question.text, /badge shows at zero points/);
});

test("the digest keys one message per person per week", () => {
  const keys = join(mkdtempSync(join(tmpdir(), "digest-keys-")), "sent.txt");
  const root = week();

  const first = digest(root, ["--sent-keys", keys]).read();
  const second = digest(root, ["--sent-keys", keys]).read();

  assert.match(first.messages[0].key, /^dana:digest:\d{4}-W\d{2}$/);
  assert.deepEqual(second.messages, []);
});

// A week that straddles New Year belongs to one year: the ISO week is read
// off its own Thursday, so the last day of one calendar year and the first of
// the next can share one key.
test("weekOf keys a week that straddles New Year by its own Thursday", () => {
  assert.equal(weekOf(Date.parse("2026-12-31T12:00:00+08:00")), "2026-W53");
  assert.equal(weekOf(Date.parse("2027-01-01T12:00:00+08:00")), "2026-W53");
});

test("weekOf starts a new key once the new ISO year's Monday arrives", () => {
  assert.equal(weekOf(Date.parse("2027-01-04T09:00:00+08:00")), "2027-W01");
});

test("shared-planning-change-stages-SC-49 - the digest counts a behind artifact's own days, not the change's last commit", () => {
  const { root, write, commit } = sandbox();
  write({
    "openspec/changes/behind-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "",
    ].join("\n"),
    "openspec/changes/behind-it/proposal.md": proposalOf("Behind it"),
    "openspec/changes/behind-it/decisions.md": DECIDED.replace(
      "❓ pm -",
      "It is",
    ),
  });
  commit("propose behind-it", 20);
  write({
    "openspec/changes/behind-it/proposal.md": proposalOf(
      "Behind it",
      " Again.",
    ),
  });
  // What puts `decisions` behind: `proposal.md` reworded 9 days ago.
  commit("reword behind-it", 9);
  write({
    "openspec/changes/behind-it/.openspec.yaml": [
      "schema: demo-planning",
      "created: 2026-10-01",
      "hands:",
      "  pm: dana",
      "  design: dana",
      "",
    ].join("\n"),
  });
  // A later, unrelated commit on the same change: naming a second hand moves
  // `lastMoved` to 2 days ago without touching what `decisions` is behind.
  commit("name a designer", 2);

  const { messages } = digest(root).read();

  const behind = (messages[0]?.lines ?? []).find(
    (one) => one.kind === "behind",
  );
  assert.ok(behind, "expected `decisions` behind by its own, older date");
  assert.equal(behind.days, 9);
});
