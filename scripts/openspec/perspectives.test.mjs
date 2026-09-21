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
import { execFileSync, spawnSync } from "node:child_process";
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
/** The evidence a proposal cites beside the page it marks: explanatory, and
 * reached the same way — a round reads it and may correct it. */
const REFERENCE = "docs/references/round-notes.md";

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
  write(REFERENCE, "# Round Notes\n\nThe owner's draft.\n");
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

/** What the CLI said when it refused. A refusal is the point of these cases,
 * so a run that succeeded fails the test rather than being parsed. */
const cliRefuses = (root, args) => {
  try {
    execFileSync(process.execPath, [CLI, ...args, "--root", root], {
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch (error) {
    return `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
  return assert.fail("the run was expected to refuse");
};

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

/** Every key a change's `.openspec.yaml` can carry except `schema:`, plus the
 * waiver nobody may invent. */
const RECORD_KEYS = [
  "created:",
  "skip_specs",
  "promoted_by",
  "awaiting:",
  "page_waived",
  "decisions_waived",
  "design_waived",
  "ui_waived",
  "hands:",
  "landed_by",
  "reviewed",
  "thread:",
  "released_in",
  "deployed_at",
  "deployed_env",
  "deployed_build",
  "deploy_waived",
  "round_waived",
  "tasks_waived",
];

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
  // The whole reader set, not only its names: the reader of the words and the
  // always floor, and nothing else - `product`, `design`, `backend`,
  // `integration` and `operations` each need a trigger this diff never
  // raises, and `qa` reads the plan and the build rather than the trio.
  assert.deepEqual(readers, [
    {
      name: "reader",
      when: ["copy"],
      agent: ".claude/agents/reader.md",
      summonedBy: ["copy"],
    },
    {
      name: "simpler",
      when: ["always"],
      agent: ".claude/agents/simpler.md",
      summonedBy: [],
    },
  ]);
  // Two readers, so one verifier reads both readings together.
  assert.equal(verifierNeeded(readers), true);
});

test("the trio's readers are six, and QA is not one of them", () => {
  const root = fixture();
  const schema = planningSchema(root);

  for (const artifact of ["proposal", "decisions", "user-journeys"]) {
    const every = readersFor(schema, artifact, new Set(TRIGGERS));
    assert.deepEqual(names(every), [
      "backend",
      "design",
      "integration",
      "operations",
      "product",
      "reader",
      "simpler",
    ]);
  }
});

test("shared-planning-agent-rounds-SC-09 - a draft naming an export and a migration summons the readers of each", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const triggers = classifyDiff(EXPORT_AND_MIGRATION, schema, "decisions");

  assert.deepEqual([...triggers].sort(), ["export", "migration"]);
  const readers = readersFor(schema, "decisions", triggers);
  // `decisions.md` carries the trio's six readers and the floor, so this is
  // the artifact where the two triggers decide anything: `backend` comes for
  // the export, `operations` for the migration, and each reader says which
  // trigger fetched it. `product`, `reader`, `design` and `integration` need
  // triggers this diff raises nowhere.
  assert.deepEqual(readers, [
    {
      name: "backend",
      when: ["schema", "export"],
      agent: ".claude/agents/backend.md",
      summonedBy: ["export"],
    },
    {
      name: "operations",
      when: ["migration", "flag", "money", "deploy"],
      agent: ".claude/agents/operations.md",
      summonedBy: ["migration"],
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
  // Both modules, and every key the record can carry
  // (`docs/governance/prd-and-openspec.md`, the changes' record) but
  // `schema:`: the readers themselves are the schema's, so that one key is
  // read and no other is. A key named anywhere in either source would be a
  // round sized off the record.
  for (const module of ["lib/perspectives.mjs", "perspectives.mjs"]) {
    const source = readFileSync(join(HERE, module), "utf8");
    for (const key of RECORD_KEYS)
      assert.ok(
        !source.includes(key),
        `${module} sizes the round off the draft, not off ${key}`,
      );
  }
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

test("shared-planning-agent-rounds-SC-30 - a reference page the proposal cites is before the draft, as a page it marks is", () => {
  const root = fixture();
  writeFileSync(
    join(root, "openspec", "changes", "demo", "proposal.md"),
    [
      "# Demo",
      "",
      "## Why",
      "",
      `The page it marks: [Agent Rounds](../../../${PAGE}#the-walk).`,
      "",
      `The evidence it cites: [Round Notes](../../../${REFERENCE}).`,
      "",
    ].join("\n"),
  );

  // Both, in the order the proposal names them: the reference reaches the
  // reader, `writableBy` yields it, and a round may correct it.
  assert.deepEqual(bundleFor(root, "demo", "tech-design").upstream.slice(-2), [
    `${PAGE}#the-walk`,
    REFERENCE,
  ]);
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

test("the change may be read off a claude/<id> branch, where neither argument names one", () => {
  const root = fixture();
  execFileSync("git", ["init", "--quiet", "-b", "claude/demo", root]);
  execFileSync("git", ["-C", root, "config", "user.email", "a@test"]);
  execFileSync("git", ["-C", root, "config", "user.name", "a"]);
  execFileSync("git", ["-C", root, "add", "-A"]);
  execFileSync("git", [
    "-C",
    root,
    "commit",
    "--quiet",
    "-m",
    "the demo change",
  ]);

  const printed = cli(root, ["decisions", "--diff", diffOf(root, WORDS)]);

  assert.equal(printed.bundle.draft, "openspec/changes/demo/decisions.md");
});

// The one argv parser: `lib/args.mjs` refuses a valued option given no
// value, naming the flag beside the usage. This entry point reads its own
// arguments through it rather than a copy of the loop.
test("the CLI's usage refusal names the flag it was given no value for", () => {
  const result = spawnSync(process.execPath, [CLI, "decisions", "--diff"], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--diff needs a value/);
  assert.match(
    result.stderr,
    /usage: node scripts\/openspec\/perspectives\.mjs/,
  );
});

test("every trigger the requirement names is classified off a diff", () => {
  const cases = [
    // surface — a screen, a state, or a story
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
    ["system", "@@ -8,3 +8,4 @@\n+| `github` | the action |"],
    ["system", "@@ -8,3 +8,4 @@\n+| Figma | the component set |"],
    [
      "system",
      "@@ -8,3 +8,4 @@ ## Integrations\n+| the run spreadsheet | one tab per pass |",
    ],
    [
      "system",
      "@@ -8,3 +8,4 @@\n+| `https://api.example.com/rounds` | the hook |",
    ],
    // migration, flag, money, deploy
    ["migration", "@@ -8,3 +8,4 @@\n+## 4. The data migration (grade10)"],
    ["migration", "@@ -8,3 +8,4 @@\n+## Migration Plan"],
    ["flag", "@@ -8,3 +8,4 @@\n+| `flag: round-record` | off in production |"],
    ["flag", "@@ -8,3 +8,4 @@\n+| Flag | Off in |"],
    ["money", "@@ -8,3 +8,4 @@\n+| `amount` | integer minor units |"],
    ["money", "@@ -8,3 +8,4 @@\n+| `currency` | ISO 4217 |"],
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

test("a trigger is keyed on structure, never on a bare word in prose", () => {
  // Every trigger fetches a reader, so a bare word in a sentence summoned
  // operations to read a change that deploys nothing and backend to read one
  // that exports nothing. Each of these lines is prose about the product and
  // raises `copy` alone.
  const cases = [
    ["export", "@@ -8,3 +8,4 @@\n+The round exports nothing a consumer reads."],
    [
      "flag",
      "@@ -8,3 +8,4 @@\n+A finding nobody can act on is a red flag for the reader.",
    ],
    [
      "deploy",
      "@@ -8,3 +8,4 @@\n+We deploy Friday, so the walk runs Thursday.",
    ],
    [
      "money",
      "@@ -8,3 +8,4 @@\n+The money question is the product manager's to answer.",
    ],
    ["system", "@@ -8,3 +8,4 @@\n+The round posts its summary to Slack."],
  ];

  for (const [trigger, diff] of cases) {
    const raised = classifyDiff(diff, REAL_SCHEMA, "proposal");
    assert.ok(!raised.has(trigger), `${trigger} is not summoned by:\n${diff}`);
    assert.deepEqual([...raised], ["copy"]);
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
  const readers = readersFor(
    schema,
    "ui-design",
    classifyDiff("", schema, "ui-design"),
  );

  // `ui-design.md` raises nothing by its name: a design round that moved no
  // screen, no state, no story and no export is the floor alone, and a round
  // of one reader verifies itself. The triggers are read off the diff here,
  // never handed in, because the file rule is what this decides.
  assert.deepEqual(names(readers), ["simpler"]);
  assert.equal(verifierNeeded(readers), false);
});

test("a design's state summons the journeys walked and the inventory", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const diff = [
    "diff --git a/openspec/changes/demo/ui-design.md b/openspec/changes/demo/ui-design.md",
    "@@ -8,3 +8,4 @@ ## States",
    "+| Catalogue | empty | the filter matched nothing |",
    "",
  ].join("\n");

  const triggers = classifyDiff(diff, schema, "ui-design");

  assert.deepEqual([...triggers].sort(), ["surface"]);
  assert.deepEqual(names(readersFor(schema, "ui-design", triggers)), [
    "inventory",
    "journeys",
    "simpler",
  ]);
});

test("a design's Components table summons the inventory alone", () => {
  const root = fixture();
  const schema = planningSchema(root);
  const diff = [
    "diff --git a/openspec/changes/demo/ui-design.md b/openspec/changes/demo/ui-design.md",
    "@@ -8,3 +8,4 @@ ## Components",
    "+| `ListingTile` | `packages/ui` | the tile |",
    "",
  ].join("\n");

  const triggers = classifyDiff(diff, schema, "ui-design");

  // An export the design composes is the inventory's reading; the journeys
  // are walked when a screen, a state or a story moves.
  assert.deepEqual([...triggers].sort(), ["export"]);
  assert.deepEqual(names(readersFor(schema, "ui-design", triggers)), [
    "inventory",
    "simpler",
  ]);
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
// valid argument to the vendor CLI. `pnpm openspec` reaches the CLI whether
// or not this checkout installed the binary, so the run is made and its
// failure is the test's: a guard that skipped it made a green run mean
// nothing.
test("`openspec instructions` resolves every schema artifact id", () => {
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

test("a record whose YAML does not parse is refused, naming the file", () => {
  // Read as the default schema until now, so a record nobody could parse gave
  // a round the readers of a schema it never named.
  const root = fixture({ record: "schema: [grade10-planning\n" });

  const said = cliRefuses(root, [
    "demo",
    "decisions",
    "--diff",
    diffOf(root, ""),
  ]);

  assert.match(said, /openspec\/changes\/demo\/\.openspec\.yaml/);
});

test("a `schema:` the store has no file for is refused, naming the file", () => {
  const root = fixture({ record: "schema: no-such-schema\n" });

  const said = cliRefuses(root, [
    "demo",
    "decisions",
    "--diff",
    diffOf(root, ""),
  ]);

  assert.match(said, /openspec\/schemas\/no-such-schema\/schema\.yaml/);
});

test("planningSchema refuses a schema the store holds no file for", () => {
  // Answered with no artifacts and no readers until now, which is a round of
  // nobody reading a draft and nothing saying why.
  const root = fixture();

  assert.throws(
    () => planningSchema(root, "no-such-schema"),
    /openspec\/schemas\/no-such-schema\/schema\.yaml/,
  );
});
