import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import {
  check,
  citedRefs,
  gate,
  openChanges,
  parseCases,
  readPages,
} from "./pages.mjs";

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
- **Earned once** - an order earns once {#earn-once}

::story{id="loyalty-points--ledger"}

:::example{title="Shipping refunded" id="refund-shipping" tier="Gold"}
- Gengar single $139
:::

:::detail{title="Open work" for="engineer"}
- [ ] **Apple enrolment** - blocked: the Developer Program
- [x] **Bucket** - done
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
  assert.deepEqual(
    page.design.map((one) => one.text.split(" · ")[0]),
    ["story"],
  );
  assert.deepEqual(
    page.work.map((one) => one.text),
    ["**Apple enrolment** - blocked: the Developer Program"],
  );
  assert.equal(page.reviewed, "2026-10-18");
  assert.deepEqual(
    page.cases.map((one) => [one.id, one.section, one.source]),
    [
      ["earn-once", "Rules", "rule"],
      ["refund-shipping", "Rules", "example"],
      ["foreign-currency", "Rules", "cases"],
    ],
  );
  assert.equal(page.cases[0].expect, "**Earned once** - an order earns once");
  assert.deepEqual(page.cases[2].tags, ["smoke"]);
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

test("only a running test's title cites an id", () => {
  const root = store({
    "app/src/a.test.ts": [
      'it("site/loyalty/points#refund-shipping refunds", () => {});',
      "// site/loyalty/points#in-a-comment",
      'it.skip("site/loyalty/points#skipped", () => {});',
    ].join("\n"),
    "app/src/earn.ts": 'it("site/loyalty/points#not-a-test-file")',
    "app/docs/notes.md": "site/loyalty/points#a-note",
    "app/node_modules/b.test.ts": 'it("site/loyalty/points#ignored")',
    "app/vendor/spec/.git": "gitdir: ../../.git/modules/spec",
    "app/vendor/spec/c.test.ts": 'it("site/loyalty/points#submodule")',
  });
  const cited = citedRefs(join(root, "app"));
  assert.deepEqual(
    [...cited],
    [["site/loyalty/points#refund-shipping", ["src/a.test.ts:1"]]],
  );
});

test("the gate refuses a dangling citation and an uncited Always rule", () => {
  const root = store({
    "docs/prds/products/site/loyalty/points.md": `${PAGE}
## Always

- **One account** - one per person {#one-account}
- **Server clock** - never the device's {#server-clock}
`,
  });
  const { pages } = readPages(root);
  const cited = new Map([
    ["site/loyalty/points#one-account", ["a.test.ts:1"]],
    ["site/loyalty/points#typo", ["a.test.ts:2"]],
    ["other/thing#x", ["a.test.ts:3"]],
  ]);
  assert.deepEqual(gate(pages, cited, ["site/loyalty/points#server-clock"]), [
    "a.test.ts:2 cites site/loyalty/points#typo, which no page holds",
  ]);
  const failures = gate(pages, cited, ["site/loyalty/points#one-account"]);
  assert.equal(failures.length, 3);
  assert.match(
    failures[1],
    /server-clock is an Always rule no running test cites/,
  );
  assert.match(failures[2], /one-account is cited now/);
});

test("a vanished id and a live promise changed under its id warn", () => {
  const before = `---
title: Points
---

## Rules

- **Earned once** - an order earns once {#earn-once}
- 🚧 **Guest order** - never earns {#guest}
- **Till** - earns at the counter {#till}
`;
  const root = store({ "docs/prds/products/site/points.md": before });
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, stdio: "ignore" });
  git("init", "-q");
  git("add", ".");
  git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "base");
  writeFileSync(
    join(root, "docs/prds/products/site/points.md"),
    before
      .replace("an order earns once", "an order earns twice")
      .replace("never earns", "earns half")
      .replace("- **Till** - earns at the counter {#till}\n", ""),
  );
  const { warnings } = check(root, { base: "HEAD" });
  assert.equal(warnings.length, 2);
  assert.match(
    warnings[0],
    /site\/points#earn-once is live and its text changed/,
  );
  assert.match(warnings[1], /site\/points#till vanished/);
});

test("AGENTS.md past its limit fails", () => {
  const root = store({ "AGENTS.md": "line\n".repeat(151) });
  assert.match(check(root).failures[0], /AGENTS.md is 151 lines, over 150/);
});

test("a retired id or change must name what a page holds", () => {
  const root = store({
    "docs/prds/products/site/points.md": PAGE,
    "openspec/retired.tsv": [
      "id\tdisplay\tnow\tchange",
      "g10.points.SC-a\tsite-points-SC-1\tsite/points#earn-once",
      "g10.points.SC-b\tsite-points-SC-2\tsite/points#gone",
      "g10.points.SC-c\tsite-points-SC-3\tdropped: superseded",
    ].join("\n"),
    "openspec/retired-changes.tsv":
      "change\tpages\nearn-points\tsite/points site/nowhere\n",
  });
  assert.deepEqual(check(root).failures, [
    "openspec/retired.tsv:3 g10.points.SC-b names site/points#gone, which no page holds",
    "openspec/retired-changes.tsv:2 earn-points names no page site/nowhere",
  ]);
});

test("a still-open change claims the pages its proposal names", () => {
  const root = store({
    "openspec/changes/add-guest/proposal.md":
      "[Checkout](../../../docs/prds/products/site/store/checkout.md) and [Points](/p/site/loyalty/points)",
    "openspec/changes/archive/old/proposal.md": "/p/site/loyalty/tiers",
  });
  const byPage = openChanges(root);
  assert.deepEqual(byPage.get("site/store/checkout"), ["add-guest"]);
  assert.deepEqual(byPage.get("site/loyalty/points"), ["add-guest"]);
  assert.equal(byPage.has("site/loyalty/tiers"), false);
});
