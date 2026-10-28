/*
 * The readers a bug fix's rounds dispatch. These tests hold
 * `lib/perspectives.mjs` to that: the triggers classified off a diagnosis or
 * a fix's diff, and the readers whose `when` the diff summons plus every
 * `always`.
 *
 * The readers are data in the `bug:` block of
 * `openspec/schemas/grade10-planning/schema.yaml`; these tests read that
 * file, never a second copy of the table.
 */
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  classifyDiff,
  perspectivesOf,
  planningSchema,
  readersFor,
  TRIGGERS,
  verifierNeeded,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SCHEMA = "openspec/schemas/grade10-planning/schema.yaml";
const PAGE = "docs/prds/products/shared/planning/change-stages.md";

/** A store with the real schema. */
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), "perspectives-"));
  mkdirSync(join(root, "openspec", "schemas", "grade10-planning"), {
    recursive: true,
  });
  copyFileSync(join(ROOT, SCHEMA), join(root, SCHEMA));
  return root;
};

const names = (readers) => readers.map(({ name }) => name).sort();
const REAL_SCHEMA = planningSchema(ROOT);

// A page's words and nothing else.
const WORDS = [
  `diff --git a/${PAGE} b/${PAGE}`,
  `--- a/${PAGE}`,
  `+++ b/${PAGE}`,
  "@@ -3,3 +3,4 @@ ## Messages",
  " Slack tells one person, once per move.",
  "+A hand reads one message that is theirs.",
  "",
].join("\n");

/** A fix that lands code alone: one changed line in a component file. */
const CODE_ONLY = [
  "diff --git a/packages/ui/src/blocks/points/points.tsx b/packages/ui/src/blocks/points/points.tsx",
  "--- a/packages/ui/src/blocks/points/points.tsx",
  "+++ b/packages/ui/src/blocks/points/points.tsx",
  "@@ -1,2 +1,3 @@",
  "+export const points = 1;",
].join("\n");

/** Code beside a migration. */
const CODE_AND_MIGRATION = [
  CODE_ONLY,
  "diff --git a/apps/backend/migrations/0042_points.md b/apps/backend/migrations/0042_points.md",
  "--- a/apps/backend/migrations/0042_points.md",
  "+++ b/apps/backend/migrations/0042_points.md",
  "@@ -0,0 +1,3 @@",
  "+## 4. The migration (grade10)",
].join("\n");

/** Prose alone: a manual page. */
const PROSE = WORDS;

/** A catalog's words: what a reader sees, in a file that is not markdown. */
const CATALOG_ONLY = [
  "diff --git a/packages/i18n/messages/shared/en/product.json b/packages/i18n/messages/shared/en/product.json",
  "--- a/packages/i18n/messages/shared/en/product.json",
  "+++ b/packages/i18n/messages/shared/en/product.json",
  "@@ -19,3 +19,3 @@",
  '+  "youMayAlsoLike": "More like this",',
].join("\n");

test("a fix that lands code is read by the build's three readings, QA and the simpler thing", () => {
  const readers = readersFor(
    REAL_SCHEMA,
    "bug:fix",
    classifyDiff(CODE_ONLY, "bug:fix"),
  );
  assert.deepEqual(names(readers), [
    "code-smell",
    "conventions",
    "missing-pieces",
    "qa",
    "simpler",
  ]);
  assert.equal(verifierNeeded(readers), true);
});

test("a fix that lands a catalog's words is read as words, not code", () => {
  const readers = readersFor(
    REAL_SCHEMA,
    "bug:fix",
    classifyDiff(CATALOG_ONLY, "bug:fix"),
  );
  assert.ok(names(readers).includes("reader"));
  assert.ok(!names(readers).includes("missing-pieces"));
});

test("a migration beside the code summons operations", () => {
  const triggers = classifyDiff(CODE_AND_MIGRATION, "bug:fix");
  assert.ok(triggers.has("migration"));
  assert.ok(
    names(readersFor(REAL_SCHEMA, "bug:fix", triggers)).includes("operations"),
  );
});

test("a diagnosis with no screen in it is read by its four `always` readers", () => {
  const readers = readersFor(
    REAL_SCHEMA,
    "bug:diagnosis",
    classifyDiff("", "bug:diagnosis"),
  );
  assert.deepEqual(names(readers), ["lane", "qa", "root-cause", "simpler"]);
});

test("`code` is a changed line in any file that is neither markdown nor a message catalog, and no markdown line", () => {
  const code = classifyDiff(CODE_AND_MIGRATION, "bug:fix");
  assert.ok(code.has("code"));
  const prose = classifyDiff(PROSE, "bug:fix");
  assert.ok(!prose.has("code"));
  assert.ok(prose.has("copy"));
  const yaml = classifyDiff(
    "diff --git a/openspec/schemas/grade10-planning/schema.yaml b/openspec/schemas/grade10-planning/schema.yaml\n@@ -1,2 +1,3 @@\n+    - name: reader",
    "bug:fix",
  );
  assert.ok(yaml.has("code"));
  assert.ok(!yaml.has("copy"));
  const catalog = classifyDiff(CATALOG_ONLY, "bug:fix");
  assert.ok(catalog.has("copy"));
  assert.ok(!catalog.has("code"));
});

test("a rename, a mode change or a binary diff of a code file changes no line, so raises no `code`", () => {
  const file = "packages/ui/src/blocks/points/points.tsx";
  const moved = "packages/ui/src/blocks/points/balance.tsx";
  for (const diff of [
    `diff --git a/${file} b/${file}\nold mode 100644\nnew mode 100755`,
    `diff --git a/${file} b/${moved}\nsimilarity index 100%\nrename from ${file}\nrename to ${moved}`,
    `diff --git a/${file} b/${file}\nBinary files a/${file} and b/${file} differ`,
  ])
    assert.ok(!classifyDiff(diff, "bug:fix").has("code"), diff);
  const edited = `diff --git a/${file} b/${moved}\nsimilarity index 90%\nrename from ${file}\nrename to ${moved}\n--- a/${file}\n+++ b/${moved}\n@@ -1,2 +1,2 @@\n-export const points = 1;\n+export const balance = 1;`;
  assert.ok(classifyDiff(edited, "bug:fix").has("code"));
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
      classifyDiff(diff, "bug:fix").has(trigger),
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
    const raised = classifyDiff(diff, "bug:fix");
    assert.ok(!raised.has(trigger), `${trigger} is not summoned by:\n${diff}`);
    assert.deepEqual([...raised], ["copy"]);
  }
});

test("a trigger is one of those the requirement tables", () => {
  assert.deepEqual([...TRIGGERS].sort(), [
    "always",
    "code",
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
  const diff = [WORDS, CODE_AND_MIGRATION].join("\n");
  for (const trigger of classifyDiff(diff, "bug:fix"))
    assert.ok(
      TRIGGERS.includes(trigger),
      `${trigger} is a trigger the schema names`,
    );
});

test("every reader the schema dispatches resolves on disk", () => {
  const entries = [...REAL_SCHEMA.bug.diagnosis, ...REAL_SCHEMA.bug.fix];
  assert.ok(entries.length > 0, "the schema records the bug rounds' readers");
  for (const { name, when, agent } of entries) {
    assert.ok(when.length > 0, `${name} carries a \`when\` a diff can summon`);
    for (const one of when)
      assert.ok(
        TRIGGERS.includes(one),
        `${name}'s \`when\` ${one} is a trigger`,
      );
    assert.ok(existsSync(resolve(ROOT, agent)), `the reader ${agent} resolves`);
  }
});

test("a target that is no bug round is refused", () => {
  assert.throws(
    () => perspectivesOf(REAL_SCHEMA, "proposal"),
    /not a bug round/,
  );
});

test("planningSchema refuses a schema the store holds no file for", () => {
  const root = fixture();

  assert.throws(
    () => planningSchema(root, "no-such-schema"),
    /openspec\/schemas\/no-such-schema\/schema\.yaml/,
  );
});
