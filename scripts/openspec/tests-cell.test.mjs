/*
 * A group's `Tests` cell, read and held without a checkout: the boundaries
 * `lib/tests-cell.mjs` draws. The landing's own refusals, one of each kind,
 * run end to end in `round-scripts.test.mjs`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkTestsCell, parseTestsCell } from "./lib/tests-cell.mjs";

const SC57 = "shared-planning-agent-rounds-SC-57";
const SC58 = "shared-planning-agent-rounds-SC-58";

/** A tree of `path → text`: a path it holds is a file, and nothing else is. */
const held = (files, cell, cited = [SC57, SC58]) =>
  checkTestsCell({
    entries: parseTestsCell(cell),
    cited,
    isFile: (path) => path in files,
    textOf: (path) => files[path],
  });

test("an entry is its id, its paths and its other words", () => {
  assert.deepEqual(
    parseTestsCell(
      `\`${SC57}\`: scripts/a.test.mjs, walked by hand; walked by hand: scripts/b.test.mjs`,
    ),
    [
      { id: SC57, paths: ["scripts/a.test.mjs"], words: ["walked by hand"] },
      {
        id: undefined,
        paths: ["scripts/b.test.mjs"],
        words: ["walked by hand"],
      },
    ],
  );
});

test("shared-planning-agent-rounds-SC-58 - the ids left out are named, and no others", () => {
  const { missing } = held({}, `\`${SC57}\`: scripts/a.test.mjs`);
  assert.deepEqual(missing, [SC58]);
});

test("shared-planning-agent-rounds-SC-58 - an id that only begins a longer one is not named", () => {
  const { missing } = held(
    {},
    `\`${SC57}\`: scripts/a.test.mjs; \`${SC58}0\`: scripts/b.test.mjs`,
  );
  assert.deepEqual(missing, [SC58]);
});

test("shared-planning-agent-rounds-SC-58 - an id a path carries credits nothing: only an entry's own id does", () => {
  const { missing } = held(
    { [`tests/${SC57}.test.ts`]: `// ${SC57}` },
    `\`${SC58}\`: tests/${SC57}.test.ts`,
  );
  assert.deepEqual(missing, [SC57]);
});

test("shared-planning-agent-rounds-SC-58 - every path is held, the second of an id and one no id opens", () => {
  const { absent } = held(
    { "scripts/a.test.mjs": `${SC57} ${SC58}` },
    [
      `\`${SC57}\`: scripts/a.test.mjs, scripts/nowhere.test.mjs`,
      `\`${SC58}\`: scripts/a.test.mjs`,
      "walked by hand: scripts/elsewhere.test.mjs",
    ].join("; "),
  );
  assert.deepEqual(absent, [
    "scripts/nowhere.test.mjs",
    "scripts/elsewhere.test.mjs",
  ]);
});

test("shared-planning-agent-rounds-SC-98 - a file is held to the id its entry credits, bounded", () => {
  const { uncited } = held(
    { "scripts/b.test.mjs": `// ${SC58}0 and ${SC57}` },
    `\`${SC57}\`: scripts/b.test.mjs; \`${SC58}\`: scripts/b.test.mjs`,
  );
  assert.deepEqual(uncited, [{ id: SC58, path: "scripts/b.test.mjs" }]);
});

test("a cell that names a test for every cited id, each carrying it, is held to nothing", () => {
  assert.deepEqual(
    held(
      { "scripts/a.test.mjs": `${SC57} ${SC58}` },
      `\`${SC57}\`: scripts/a.test.mjs; \`${SC58}\`: scripts/a.test.mjs`,
    ),
    { missing: [], absent: [], uncited: [] },
  );
});
