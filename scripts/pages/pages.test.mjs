import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { check, citedRefs, parseCases, readPages } from "./pages.mjs";

function store(files) {
  const root = mkdtempSync(join(tmpdir(), "pages-"));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

const PAGE = `---
title: Points
---

## Rules

- 🚧 **Guest order** - never earns
- ❓ **Launch name** - not settled
- 🎨 **Empty ledger** - needs a design

:::example{title="Shipping refunded" id="refund-shipping" tier="Gold"}
- Gengar single $139
:::
`;

const CASES = `---
reviewed: 2026-10-18
---

## Rules

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| foreign-currency | a USD order | it completes | refused, no points | smoke |
`;

test("a page carries its marks and its cases, examples and rows alike", () => {
  const root = store({
    "docs/prds/products/site/loyalty/points.md": PAGE,
    "docs/cases/site/loyalty/points.md": CASES,
  });
  const [page] = readPages(root).pages;
  assert.equal(page.id, "site/loyalty/points");
  assert.equal(page.building.length, 1);
  assert.equal(page.open.length, 1);
  assert.equal(page.design.length, 1);
  assert.equal(page.reviewed, "2026-10-18");
  assert.deepEqual(
    page.cases.map((one) => [one.id, one.section, one.source]),
    [
      ["refund-shipping", "Rules", "example"],
      ["foreign-currency", "Rules", "cases"],
    ],
  );
  assert.deepEqual(page.cases[1].tags, ["smoke"]);
  assert.deepEqual(check(root), { failures: [], warnings: [] });
});

test("a cases file refuses a reused id, a bad id and a row with no Then", () => {
  const { rows } = parseCases(
    "| Id | Then |\n| --- | --- |\n| a | x |\n| Bad_Id | x |\n| b | |\n",
  );
  assert.deepEqual(
    rows.map((row) => row.id),
    ["a", "Bad_Id", "b"],
  );
  const root = store({
    "docs/prds/products/site/x.md": PAGE,
    "docs/cases/site/x.md":
      "| Id | Then |\n| --- | --- |\n| refund-shipping | x |\n| Bad_Id | x |\n| b | |\n",
  });
  const { failures } = check(root);
  assert.equal(failures.length, 3);
  assert.match(failures[0], /used twice/);
  assert.match(failures[1], /kebab-case/);
  assert.match(failures[2], /no Then/);
});

test("a cases file with no page fails, and unnamed examples warn", () => {
  const root = store({
    "docs/prds/products/site/x.md": PAGE.replace(' id="refund-shipping"', ""),
    "docs/cases/site/x.md": "| Id | Then |\n| --- | --- |\n| a | x |\n",
    "docs/cases/site/gone.md": "| Id | Then |\n| --- | --- |\n| a | x |\n",
  });
  const { failures, warnings } = check(root);
  assert.deepEqual(failures, [
    "docs/cases/site/gone.md names no page: docs/prds/products/site/gone.md",
  ]);
  assert.equal(warnings.length, 1);
});

test("a test that names a case automates it", () => {
  const root = store({
    "app/a.test.ts": `// site/loyalty/points#refund-shipping\nit("x")`,
    "app/node_modules/b.ts": "site/loyalty/points#ignored",
  });
  assert.deepEqual(
    [...citedRefs(join(root, "app"))],
    ["site/loyalty/points#refund-shipping"],
  );
});
