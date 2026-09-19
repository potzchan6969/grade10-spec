/*
 * A round's size is read from the draft. These tests hold
 * `lib/perspectives.mjs` and its CLI to that: the ten triggers classified off
 * a diff, the readers whose `when` the diff summons plus every `always`, a
 * bundle that is the draft and what is before it and nothing else, and a
 * record key that changes none of it.
 *
 * The perspectives themselves are data in
 * `openspec/schemas/grade10-planning/schema.yaml`; these tests read that file,
 * never a second copy of the table.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bundleFor,
  classifyDiff,
  planningSchema,
  readersFor,
  TRIGGERS,
  verifierNeeded,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CLI = join(HERE, "perspectives.mjs");
const SCHEMA = "openspec/schemas/grade10-planning/schema.yaml";
const PAGE = "docs/prds/products/shared/planning/agent-rounds.md";

const names = (readers) => readers.map(({ name }) => name).sort();
// The real schema, for the tests that only need a valid `artifactOf` lookup
// and are not exercising a change's own files.
const REAL_SCHEMA = planningSchema(ROOT);
const triggersOf = (diff, artifact = "") =>
  [...classifyDiff(diff, REAL_SCHEMA, artifact)].sort();

/** A store with the real schema and one change whose files are all present,
 * so a bundle is read off a tree rather than off this file's idea of one. */
const fixture = ({ record } = {}) => {
  const root = mkdtempSync(join(tmpdir(), "perspectives-"));
  const write = (rel, text) => {
    const path = join(root, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  mkdirSync(join(root, "openspec", "schemas", "grade10-planning"), {
    recursive: true,
  });
  copyFileSync(join(ROOT, SCHEMA), join(root, SCHEMA));
  write(PAGE, "# Agent Rounds\n\n## The Walk\n\nThe round reads the draft.\n");
  const change = "openspec/changes/demo";
  write(
    `${change}/proposal.md`,
    [
      "# Demo",
      "",
      "## Why",
      "",
      `The page it marks: [Agent Rounds](../../../${PAGE}#the-walk).`,
      "",
    ].join("\n"),
  );
  write(`${change}/decisions.md`, "# Decisions\n");
  write(`${change}/ui-design.md`, "# UI Design\n");
  write(`${change}/tech-design.md`, "# Tech Design\n");
  write(`${change}/tasks.md`, "# Tasks\n");
  write(
    `${change}/specs/shared/planning/demo/user-journeys.md`,
    "# Journeys\n",
  );
  write(`${change}/specs/shared/planning/demo/spec.md`, "# Spec\n");
  write(`${change}/specs/shared/planning/demo/feature-tcs.md`, "# Cases\n");
  if (record !== undefined) write(`${change}/.openspec.yaml`, record);
  return root;
};

const diffOf = (root, text) => {
  const path = join(root, "draft.diff");
  writeFileSync(path, text);
  return path;
};

const cli = (root, args) =>
  JSON.parse(
    execFileSync(process.execPath, [CLI, ...args, "--root", root], {
      encoding: "utf8",
    }),
  );

// A page's words and nothing else: the diff a PM's remark leaves behind.
const WORDS = [
  `diff --git a/${PAGE} b/${PAGE}`,
  `--- a/${PAGE}`,
  `+++ b/${PAGE}`,
  "@@ -3,3 +3,4 @@ ## The Walk",
  " The round reads the draft.",
  "+A hand answers a numbered question and the round writes the answer down.",
  "",
].join("\n");

// A public export and a migration group: two triggers, two readers, and a
// diff with no prose line in it, so nothing else is summoned.
const EXPORT_AND_MIGRATION = [
  "diff --git a/openspec/changes/demo/tech-design.md b/openspec/changes/demo/tech-design.md",
  "--- a/openspec/changes/demo/tech-design.md",
  "+++ b/openspec/changes/demo/tech-design.md",
  "@@ -10,6 +10,7 @@ ## Service Interfaces",
  "+| `roundReaders(change, artifact)` | new export | the readers of one draft |",
  "diff --git a/openspec/changes/demo/tasks.md b/openspec/changes/demo/tasks.md",
  "--- a/openspec/changes/demo/tasks.md",
  "+++ b/openspec/changes/demo/tasks.md",
  "@@ -20,0 +21,3 @@",
  "+## 4. The migration (grade10)",
  "+",
  "+- [ ] 4.1 Backfill the rows",
  "",
].join("\n");

test("shared-planning-agent-rounds-SC-08 - a proposal's words reach the reader of the words and the floor", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const triggers = classifyDiff(
    readFileSync(diffOf(root, WORDS), "utf8"),
    schema,
    "proposal",
  );

  assert.deepEqual([...triggers].sort(), ["copy"]);
  const readers = readersFor(schema, "proposal", triggers);
  // The whole reader set, not only its names: `product` and `reader` both
  // read words, the always floor is `qa` and `simpler`, and nothing else -
  // `design`, `backend`, `integration` and `operations` need a trigger this
  // diff never raises.
  assert.deepEqual(readers, [
    {
      name: "product",
      when: ["surface", "copy"],
      agent: ".claude/agents/product.md",
      summonedBy: ["copy"],
    },
    {
      name: "reader",
      when: ["copy"],
      agent: ".claude/agents/reader.md",
      summonedBy: ["copy"],
    },
    {
      name: "qa",
      when: ["always"],
      agent: ".claude/agents/qa.md",
      summonedBy: [],
    },
    {
      name: "simpler",
      when: ["always"],
      agent: ".claude/agents/simpler.md",
      summonedBy: [],
    },
  ]);
  assert.equal(verifierNeeded(readers), true);
});

test("shared-planning-agent-rounds-SC-09 - a tech design with an export and a migration dispatches its four readings", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const triggers = classifyDiff(EXPORT_AND_MIGRATION, schema, "tech-design");

  assert.deepEqual([...triggers].sort(), ["export", "migration"]);
  const readers = readersFor(schema, "tech-design", triggers);
  // `tech-design.md` is the tech reader's own subject, so all four of its
  // readings run every round whatever the diff raises - `export` and
  // `migration` change nothing here, which is the whole reader set saying so:
  // each reading is its own dispatch, sharing `tech.md` with the other three
  // rather than being merged into one because they share an agent.
  assert.deepEqual(readers, [
    {
      name: "deterministic",
      when: ["always"],
      agent: ".claude/agents/tech.md",
      summonedBy: [],
    },
    {
      name: "simple",
      when: ["always"],
      agent: ".claude/agents/tech.md",
      summonedBy: [],
    },
    {
      name: "consistent",
      when: ["always"],
      agent: ".claude/agents/tech.md",
      summonedBy: [],
    },
    {
      name: "testable",
      when: ["always"],
      agent: ".claude/agents/tech.md",
      summonedBy: [],
    },
    {
      name: "simpler",
      when: ["always"],
      agent: ".claude/agents/simpler.md",
      summonedBy: [],
    },
  ]);
  assert.equal(verifierNeeded(readers), true);
});

test("shared-planning-agent-rounds-SC-10 - a record key neither adds a reader nor removes one", () => {
  const plain = fixture();
  const waived = fixture({
    record: "schema: grade10-planning\nround_waived: the artifact is small\n",
  });
  for (const root of [plain, waived]) diffOf(root, EXPORT_AND_MIGRATION);
  const args = ["demo", "decisions", "--diff"];

  const before = cli(plain, [...args, join(plain, "draft.diff")]);
  const after = cli(waived, [...args, join(waived, "draft.diff")]);

  assert.deepEqual(after.readers, before.readers);
  assert.equal(after.verifier, before.verifier);
  const source = readFileSync(join(HERE, "lib", "perspectives.mjs"), "utf8");
  for (const key of ["openspec.yaml", "round_waived"])
    assert.ok(
      !source.includes(key),
      `the size is read from the draft, not ${key}`,
    );
});

test("reads the change's own schema: rather than always grade10-planning", () => {
  const root = fixture({ record: "schema: demo-planning\n" });
  const dir = join(root, "openspec", "schemas", "demo-planning");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "schema.yaml"),
    [
      "name: demo-planning",
      "version: 1",
      "artifacts:",
      "  - id: tech-design",
      "    generates: tech-design.md",
      "    requires: []",
      "    upstream: []",
      "    perspectives:",
      "      - name: distinct",
      "        agent: .claude/agents/distinct.md",
      "        when: always",
      "",
    ].join("\n"),
  );

  const result = cli(root, ["demo", "tech-design", "--diff", diffOf(root, "")]);

  assert.deepEqual(
    result.readers.map((one) => one.name),
    ["distinct"],
  );
});

test("shared-planning-agent-rounds-SC-30 - a bundle is the draft and what is before it, and nothing else", () => {
  const root = fixture();
  const bundle = bundleFor(root, "demo", "tech-design");

  assert.deepEqual(Object.keys(bundle).sort(), ["draft", "upstream"]);
  assert.equal(bundle.draft, "openspec/changes/demo/tech-design.md");
  assert.deepEqual(bundle.upstream, [
    "openspec/changes/demo/proposal.md",
    "openspec/changes/demo/decisions.md",
    "openspec/changes/demo/specs/shared/planning/demo/user-journeys.md",
    `${PAGE}#the-walk`,
  ]);
  // The schema draws the tech design beside the UI design, never from it, and
  // nothing after it is before it.
  for (const later of ["ui-design.md", "spec.md", "feature-tcs.md", "tasks.md"])
    assert.ok(
      !bundle.upstream.some((one) => one.endsWith(later)),
      `${later} is not upstream of the tech design`,
    );
});

test("shared-planning-agent-rounds-SC-30 - the round hands every reader one bundle and no other reader's output", () => {
  const root = fixture();
  const printed = cli(root, [
    "demo",
    "decisions",
    "--diff",
    diffOf(root, EXPORT_AND_MIGRATION),
  ]);

  assert.deepEqual(Object.keys(printed).sort(), [
    "bundle",
    "readers",
    "verifier",
  ]);
  assert.deepEqual(Object.keys(printed.bundle).sort(), ["draft", "upstream"]);
  for (const reader of printed.readers)
    assert.deepEqual(Object.keys(reader).sort(), [
      "agent",
      "name",
      "summonedBy",
      "when",
    ]);
  assert.equal(printed.bundle.draft, "openspec/changes/demo/decisions.md");
});

test("a task group is read against the schema's apply block", () => {
  const root = fixture();
  const printed = cli(root, [
    "demo",
    "3",
    "--diff",
    diffOf(root, EXPORT_AND_MIGRATION),
  ]);

  // build's four readings and qa and simpler always run; operations joins
  // because the diff names a migration group.
  assert.deepEqual(names(printed.readers), [
    "code-smell",
    "conventions",
    "missing-pieces",
    "operations",
    "qa",
    "simpler",
    "simplicity",
  ]);
  assert.equal(printed.bundle.draft, "openspec/changes/demo/tasks.md");
});

test("the change may be named by the flag rather than the first argument", () => {
  const root = fixture();
  const printed = cli(root, [
    "decisions",
    "--change",
    "demo",
    "--diff",
    diffOf(root, WORDS),
  ]);

  assert.equal(printed.bundle.draft, "openspec/changes/demo/decisions.md");
});

test("every trigger the requirement names is classified off a diff", () => {
  const cases = [
    // surface — a screen, a state, or a story
    [
      "surface",
      "diff --git a/openspec/changes/demo/ui-design.md b/openspec/changes/demo/ui-design.md\n@@ -1,2 +1,3 @@\n+| Tile | `packages/ui` |",
    ],
    [
      "surface",
      "@@ -1,2 +1,3 @@\n+`ListingTile::story` shows the sold-out tile",
    ],
    ["surface", "@@ -1,2 +1,3 @@\n+::figma node-id=12:34"],
    ["surface", "@@ -8,3 +8,4 @@ ## Screens\n+| Catalogue | one column |"],
    ["surface", "@@ -8,3 +8,4 @@\n+## States"],
    // schema — a data model
    ["schema", "@@ -8,3 +8,4 @@\n+## Data model"],
    [
      "schema",
      "@@ -8,3 +8,4 @@ ## Database Schema\n+| `points_ledger` | `amount` | integer |",
    ],
    // export — a public export or an interface
    ["export", "@@ -8,3 +8,4 @@\n+- **Export** `roundRow` from the store"],
    ["export", "@@ -8,3 +8,4 @@\n+## Service Interfaces"],
    ["export", "@@ -8,3 +8,4 @@\n+## API Contracts"],
    [
      "export",
      "@@ -8,3 +8,4 @@ ## Components\n+| `ListingTile` | `packages/ui` | the tile |",
    ],
    // system — another system reached
    ["system", "@@ -8,3 +8,4 @@\n+The round posts its summary to Slack."],
    ["system", "@@ -8,3 +8,4 @@\n+| `github` | the action |"],
    ["system", "@@ -8,3 +8,4 @@\n+| Figma | the component set |"],
    [
      "system",
      "@@ -8,3 +8,4 @@\n+| `https://api.example.com/rounds` | the hook |",
    ],
    // migration, flag, money, deploy
    ["migration", "@@ -8,3 +8,4 @@\n+## 4. The data migration (grade10)"],
    ["migration", "@@ -8,3 +8,4 @@\n+## Migration Plan"],
    ["flag", "@@ -8,3 +8,4 @@\n+| `flag: round-record` | off in production |"],
    ["money", "@@ -8,3 +8,4 @@\n+| `amount` | integer minor units |"],
    ["money", "@@ -8,3 +8,4 @@\n+| `currency` | ISO 4217 |"],
    ["money", "@@ -8,3 +8,4 @@\n+| `money` | the amount held |"],
    ["deploy", "@@ -8,3 +8,4 @@\n+## Deploy"],
    [
      "deploy",
      "diff --git a/.github/workflows/proposal-notify.yml b/.github/workflows/proposal-notify.yml\n@@ -1,2 +1,3 @@\n+  reread:",
    ],
    // copy — a page's words, or words a reader sees
    [
      "copy",
      `diff --git a/${PAGE} b/${PAGE}\n@@ -1,2 +1,3 @@\n+| Points | the balance |`,
    ],
    ["copy", "@@ -8,3 +8,4 @@ ## Copy\n+| `title` | Your points |"],
    [
      "copy",
      "@@ -8,3 +8,4 @@\n+The hand answers the numbered question in the thread.",
    ],
  ];

  for (const [trigger, diff] of cases) {
    assert.ok(
      classifyDiff(diff, REAL_SCHEMA, "proposal").has(trigger),
      `${trigger} is summoned by:\n${diff}`,
    );
  }
});

test("a trigger is one of the ten the requirement tables", () => {
  assert.deepEqual([...TRIGGERS].sort(), [
    "always",
    "copy",
    "deploy",
    "export",
    "flag",
    "migration",
    "money",
    "schema",
    "surface",
    "system",
  ]);
  const diff = [WORDS, EXPORT_AND_MIGRATION].join("\n");
  for (const trigger of triggersOf(diff, "tasks"))
    assert.ok(
      TRIGGERS.includes(trigger),
      `${trigger} is a trigger the schema names`,
    );
});

test("an empty diff leaves the floor and nothing else", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const readers = readersFor(
    schema,
    "tech-design",
    classifyDiff("", schema, "tech-design"),
  );

  // `tech-design.md` is the tech reader's own subject, so all four of its
  // readings run every round, with the floor: five readers in all, so one
  // verifier reconciles them - a round is sized by how many read the draft,
  // not by how many the diff summoned.
  assert.deepEqual(names(readers), [
    "consistent",
    "deterministic",
    "simple",
    "simpler",
    "testable",
  ]);
  assert.equal(verifierNeeded(readers), true);
});

test("a round of one reader in all dispatches no verifier", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const readers = readersFor(schema, "ui-design", new Set());

  assert.deepEqual(names(readers), ["simpler"]);
  assert.equal(verifierNeeded(readers), false);
});

test("the requirements and the cases have no readers: the two blind readings are theirs", () => {
  const root = fixture();
  const schema = planningSchema(root);

  for (const artifact of ["specs", "test-cases"])
    assert.deepEqual(readersFor(schema, artifact, new Set(["copy"])), []);
});

test("every reader the schema dispatches resolves on disk", () => {
  const schema = planningSchema(ROOT);
  const entries = [
    ...schema.artifacts.flatMap(({ perspectives }) => perspectives),
    ...schema.apply,
  ];

  assert.ok(
    entries.length > 0,
    "the schema records the readers of every artifact",
  );
  for (const { name, when, agent } of entries) {
    assert.ok(name, "a perspective carries its name");
    assert.ok(when.length > 0, `${name} carries a \`when\` a draft can summon`);
    for (const one of when)
      assert.ok(
        TRIGGERS.includes(one),
        `${name}'s \`when\` ${one} is a trigger`,
      );
    assert.ok(
      existsSync(resolve(ROOT, agent)),
      `the reader ${agent} of ${name} resolves`,
    );
  }
});

// SC-28: the same table answers every artifact's round - `openspec
// instructions` reads the schema the same way, so every id it names is a
// valid argument to the vendor CLI. Needs the workspace's `openspec` binary,
// which `pnpm openspec` otherwise reaches over `pnpm dlx`; skip rather than
// fail where this checkout has not installed it.
test("`openspec instructions` resolves every schema artifact id", () => {
  if (!existsSync(join(ROOT, "node_modules", ".bin", "openspec"))) {
    console.log(
      "[SKIP] node_modules/.bin/openspec is not installed in this checkout",
    );
    return;
  }
  const artifacts = REAL_SCHEMA.artifacts;
  assert.ok(artifacts.length > 0, "the schema names artifacts to check");
  for (const { id } of artifacts) {
    assert.doesNotThrow(() =>
      execFileSync(
        "pnpm",
        [
          "openspec",
          "instructions",
          id,
          "--change",
          "run-a-round-on-every-artifact",
        ],
        { cwd: ROOT, stdio: "pipe" },
      ),
    );
  }
});
