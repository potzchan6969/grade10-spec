/*
 * tcs-rules r7 checks in `validate-test-cases.mjs`: the Grade10 store's cases
 * live only in its PRD folder and trace PRD sections; a walk saves setup
 * across cases along one route; `UI matching <story-id>` names a real story.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { headingAnchor } from "./lib/store-suites.mjs";
import { runValidator, specFiles } from "./test/suite-store.mjs";

function store(files) {
  const root = mkdtempSync(join(tmpdir(), "r7-"));
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

const out = (root) => {
  const r = runValidator(root);
  return { status: r.status, text: r.stdout + r.stderr };
};

const PROPS = (trace, status = "draft") => [
  "**Classification:**",
  "",
  "* **Severity:** major",
  "* **Priority:** high",
  `* **Status:** ${status}`,
  "* **Behaviour:** positive",
  "* **Type:** functional",
  "* **Suites:** regression",
  "* **Automation status:** manual",
  "* **Testability:** manual",
  `* **Trace:** ${trace}`,
  "",
  "**Pre-conditions:**",
  "None.",
  "",
  "**Steps:**",
  "",
  "1. Open the page.",
  "",
  "**Expected Results:**",
  "",
  "* The page shows.",
  "",
];

const PRD = "docs/prds/products/grade10-site/store";
const PAGE = [
  "---",
  "spec: grade10-site/store/order-detail",
  "---",
  "",
  "# Order detail",
  "",
  "## Product Pictures",
  "",
  "Each item shows its picture.",
  "",
].join("\n");

const storeSuite = (lines) =>
  ["# grade10-site/store/order-detail Test Cases", "", ...lines].join("\n");

test("the heading anchor is the one the manual writes", () => {
  assert.equal(headingAnchor("Product Pictures"), "product-pictures");
  assert.equal(
    headingAnchor("`Track Order` & refunds"),
    "track-order--refunds",
  );
});

test("a store suite under openspec is refused, in a change or durable", () => {
  const root = store({
    "openspec/specs/grade10-site/store/order-detail/feature-tcs.md": storeSuite(
      ["**Status:** pending-review · 0/0", ""],
    ),
    "openspec/changes/demo/specs/grade10-site/store/order-detail/feature-tcs.md":
      storeSuite(["**Status:** pending-review · 0/0", ""]),
  });
  const { status, text } = out(root);
  assert.notEqual(status, 0, text);
  assert.equal(
    text.match(/a Grade10 store suite under openspec/g)?.length,
    2,
    text,
  );
});

test("a store suite traces PRD sections and names its capabilities", () => {
  const good = store({
    "openspec/specs/grade10-site/store/order-detail/spec.md": "# x\n",
    [`${PRD}/order-detail.md`]: PAGE,
    [`${PRD}/tests/orderDetails-tcs.md`]: storeSuite([
      "**Status:** pending-review · 0/1",
      "**Capabilities:** grade10-site/store/order-detail",
      "",
      "## order-detail#product-pictures: Product Pictures",
      "",
      "### g10.store-order-detail.TC1: Each item shows its picture",
      "",
      ...PROPS("order-detail#product-pictures"),
    ]),
  });
  const ok = out(good);
  assert.equal(ok.status, 0, ok.text);
  assert.doesNotMatch(ok.text, /orderDetails-tcs\.md/);

  const bad = store({
    [`${PRD}/order-detail.md`]: PAGE,
    [`${PRD}/tests/orderDetails-tcs.md`]: storeSuite([
      "**Status:** pending-review · 0/3",
      "",
      "### g10.store-order-detail.TC1: Unknown anchor",
      "",
      ...PROPS("order-detail#pictures"),
      "### g10.store-order-detail.TC2: Unknown page",
      "",
      ...PROPS("refunds-page#product-pictures"),
      "### g10.store-order-detail.US1-TC3: Old journey trace",
      "",
      ...PROPS("g10.store-order-detail.US1"),
    ]),
  });
  const { status, text } = out(bad);
  assert.notEqual(status, 0, text);
  assert.match(text, /carries no `\*\*Capabilities:\*\*` line/);
  assert.match(text, /order-detail\.md has no heading with that anchor/);
  assert.match(text, /refunds-page\.md does not exist/);
  assert.match(
    text,
    /traces `g10\.store-order-detail\.US1`, an openspec anchor/,
  );
});

test("a walk of one case, a catch-all or strung setups warns", () => {
  const base = "openspec/specs/demo/alpha";
  const root = store({
    ...specFiles(base),
    [`${base}/feature-tcs.md`]: [
      "# demo/alpha Test Cases",
      "",
      "**Status:** pending-review · 0/2",
      "**Drafts styled:** 2026-10-23, tcs-rules r7",
      "",
      "## Walk 1: Additional fixture checks",
      "",
      "**Starting state:**",
      "",
      "**Steps 1–1 setup:**",
      "",
      "- One thing.",
      "",
      "**Steps 2–2 setup:**",
      "",
      "- Another thing.",
      "",
      "### Route",
      "",
      "1. Open the page.",
      "   - It shows. `demo-alpha-US1-TC1-1`",
      "",
      "## demo-alpha-US1: Collector does the thing",
      "",
      "**As a** collector,",
      "**I want** the thing,",
      "**so that** it is done.",
      "",
      "### demo-alpha-US1-TC1-1: The thing happens",
      "",
      ...PROPS("demo-alpha-US-01"),
      "### demo-alpha-US1-TC2-1: The thing happens again",
      "",
      ...PROPS("demo-alpha-US-01"),
      "* UI matching `demo-alpha--nothing-like-it`",
      "",
    ].join("\n"),
  });
  const { text } = out(root);
  assert.match(text, /covers [01] cases? — a walk saves setup/);
  assert.match(text, /breaks its setup or data into 2 step-range blocks/);
  assert.match(text, /is a catch-all or a continuation/);
  assert.match(text, /UI matching demo-alpha--nothing-like-it` names no story/);
});

test("a walk cut into step ranges is refused under the current rules", () => {
  const base = "openspec/specs/demo/alpha";
  const suite = (styled) =>
    [
      "# demo/alpha Test Cases",
      "",
      "**Status:** pending-review · 0/2",
      `**Drafts styled:** 2026-10-23, tcs-rules ${styled}`,
      "",
      "## Walk 1: Do the thing twice",
      "",
      "Starting state:",
      "",
      "- customer is on the page.",
      "",
      "Steps 2 to 2 data:",
      "",
      "| Field | Value |",
      "| --- | --- |",
      "| thing | One |",
      "",
      "### Route",
      "",
      "1. Open the page.",
      "   - It shows. `demo-alpha-US1-TC1-1`",
      "2. Open it again.",
      "   - It shows again. `demo-alpha-US1-TC2-1`",
      "",
      "## demo-alpha-US1: Collector does the thing",
      "",
      "**As a** collector,",
      "**I want** the thing,",
      "**so that** it is done.",
      "",
      "### demo-alpha-US1-TC1-1: The thing happens",
      "",
      ...PROPS("demo-alpha-US-01"),
      "### demo-alpha-US1-TC2-1: The thing happens again",
      "",
      ...PROPS("demo-alpha-US-01"),
    ].join("\n");
  const rules = {
    "docs/governance/specs-to-test-cases.md": "---\ntcs_rules_rev: 7\n---\n",
  };
  const current = out(
    store({
      ...rules,
      ...specFiles(base),
      [`${base}/feature-tcs.md`]: suite("r7"),
    }),
  );
  // The report prints errors before warnings, each under its count.
  const errorsOf = (text) =>
    /\d+ errors?\n([\s\S]*?)(?:\n\d+ warnings?\n|$)/.exec(text)?.[1] ?? "";
  assert.match(
    errorsOf(current.text),
    /breaks its setup or data into 1 step-range block/,
  );
  assert.notEqual(current.status, 0, current.text);
  const older = out(
    store({
      ...rules,
      ...specFiles(base),
      [`${base}/feature-tcs.md`]: suite("r5"),
    }),
  );
  assert.match(older.text, /breaks its setup or data into 1 step-range block/);
  assert.doesNotMatch(errorsOf(older.text), /step-range/);
  // A change's suite is held to it when acceptance validates its fold.
  const change = "openspec/changes/demo-change/specs/demo/alpha";
  const inChange = out(
    store({
      ...rules,
      ...specFiles(base),
      ...specFiles(change),
      [`${change}/feature-tcs.md`]: suite("r7"),
    }),
  );
  assert.match(
    inChange.text,
    /breaks its setup or data into 1 step-range block/,
  );
  assert.doesNotMatch(errorsOf(inChange.text), /step-range/);
});

test("a suite beside a capability nobody walks is warned, not refused", () => {
  const base = "openspec/specs/demo/alpha";
  const files = specFiles(base);
  files[`${base}/user-journeys.md`] =
    "**Walked by:** nobody on their own - demo/beta's journeys reach it\n";
  files[`${base}/feature-tcs.md`] = [
    "# demo/alpha Test Cases",
    "",
    "**Status:** pending-review · 0/0",
    "",
  ].join("\n");
  const { status, text } = out(store(files));
  assert.equal(status, 0, text);
  assert.match(text, /`\*\*Walked by:\*\* nobody`.*owes no suite of its own/);
});

test("a suite beside a makers-only capability is refused", () => {
  const base = "openspec/specs/demo/alpha";
  const files = specFiles(base);
  files[`${base}/user-journeys.md`] =
    "**Walked by:** makers only - a QA door no customer or admin reaches\n";
  files[`${base}/feature-tcs.md`] = [
    "# demo/alpha Test Cases",
    "",
    "**Status:** pending-review · 0/0",
    "",
  ].join("\n");
  const { status, text } = out(store(files));
  assert.notEqual(status, 0, text);
  assert.match(text, /`\*\*Walked by:\*\* makers only`.*owes no test cases/);
});
