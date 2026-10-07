import assert from "node:assert/strict";
import test from "node:test";

import { previousSuccessfulHead } from "./select-deployed-base.mjs";

const current = { id: 2313, number: 2313, head: "current" };
const thisRun = {
  id: current.id,
  run_number: current.number,
  head_sha: current.head,
  conclusion: "success",
};

test("selects the most recent successful deploy before the triggering run", () => {
  const runs = [
    { id: 2314, run_number: 2314, head_sha: "later", conclusion: "success" },
    thisRun,
    { id: 2312, run_number: 2312, head_sha: "previous", conclusion: "success" },
    { id: 2311, run_number: 2311, head_sha: "failed", conclusion: "failure" },
    { id: 934, run_number: 934, head_sha: "old", conclusion: "success" },
  ];
  assert.equal(previousSuccessfulHead(runs, current), "previous");
});

test("refuses a stale listing instead of selecting an old deploy", () => {
  const stale = [
    { id: 934, run_number: 934, head_sha: "old", conclusion: "success" },
  ];
  assert.throws(
    () => previousSuccessfulHead(stale, current),
    /missing from its run listing/,
  );
});

test("returns no base when the current run is the first successful deploy", () => {
  assert.equal(previousSuccessfulHead([thisRun], current), "");
});
