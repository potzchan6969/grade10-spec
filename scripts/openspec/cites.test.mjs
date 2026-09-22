/*
 * `lib/cites.mjs`: whether a file cites an id. One helper, one verdict, so the
 * landing's `--tests` check and the suite validator's Manual-row check read
 * an id the same way (`shared-planning-agent-rounds-SC-98`,
 * `shared-planning-agent-rounds-SC-106`).
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { citesId } from "./lib/cites.mjs";

test("shared-planning-agent-rounds-SC-98 - an id is cited with a boundary after it, so SC-1 never matches SC-12", () => {
  const text = [
    "test('demo-alpha-SC-12 - the twelfth', () => {});",
    "// demo-alpha-US1-TC12-1 is the case",
  ].join("\n");
  assert.equal(citesId(text, "demo-alpha-SC-12"), true);
  assert.equal(citesId(text, "demo-alpha-SC-1"), false);
  assert.equal(citesId(text, "demo-alpha-US1-TC12-1"), true);
  assert.equal(citesId(text, "demo-alpha-US1-TC1-1"), false);
  assert.equal(citesId("", "demo-alpha-SC-1"), false);
});

// Decides shared-planning-agent-rounds-US12-TC5-1.
test("shared-planning-agent-rounds-SC-98 - an id in backticks, brackets or a title is a citation; a longer id that starts with it is not", () => {
  assert.equal(citesId("`demo-alpha-SC-7`", "demo-alpha-SC-7"), true);
  assert.equal(citesId("[demo-alpha-US1-TC7-1]", "demo-alpha-US1-TC7-1"), true);
  assert.equal(citesId("demo-alpha-SC-70 stands", "demo-alpha-SC-7"), false);
  assert.equal(citesId("demo-alpha-SC-7a", "demo-alpha-SC-7"), true);
});
