import assert from "node:assert/strict";
import { test } from "node:test";
import { chunk, MAX_CHUNKS, SPLIT_COMMITS } from "./chunks.mjs";
import { merge } from "./merge.mjs";

let n = 0;
const commit = (over) => ({
  short: (0x1000000 + n++).toString(16),
  author: "someone",
  scope: null,
  areas: ["Product pages"],
  changes: [],
  added: 1,
  removed: 1,
  ...over,
});
const many = (count, over) => Array.from({ length: count }, () => commit(over));

test("a quiet day stays one chunk", () => {
  const out = chunk({
    day: "2026-10-20",
    commits: many(5, { scope: "loyalty" }),
  });
  assert.equal(out.split, false);
  assert.equal(out.chunks.length, 1);
  assert.equal(out.chunks[0].id, "the-day");
});

test("a change proposed here and built in the application shares one chunk", () => {
  const out = chunk({
    day: "2026-10-20",
    commits: [
      ...many(20, { changes: ["member-pass"] }),
      ...many(20, { scope: "auction", areas: ["Blocks"] }),
    ],
    build: {
      commits: many(15, { changes: ["member-pass"], scope: "loyalty" }),
    },
  });
  assert.equal(out.split, true);
  const pass = out.chunks.find((c) => c.id === "member-pass");
  assert.equal(pass.spec.length, 20);
  assert.equal(pass.build.length, 15);
});

test("a busy day never dispatches more than MAX_CHUNKS agents", () => {
  const commits = Array.from({ length: 60 }, (_, i) =>
    many(5, { scope: `scope-${i}`, areas: [`area-${i % 7}`] }),
  ).flat();
  const out = chunk({ day: "2026-10-20", commits });
  assert.ok(out.chunks.length <= MAX_CHUNKS);
  const cap = Math.max(SPLIT_COMMITS, Math.ceil(300 / MAX_CHUNKS));
  for (const c of out.chunks.slice(0, -1))
    assert.ok(c.spec.length <= cap, `${c.id} holds ${c.spec.length}`);
  assert.equal(
    out.chunks.reduce((s, c) => s + c.spec.length, 0),
    300,
  );
});

test("report-only bot commits join no chunk", () => {
  const out = chunk({
    day: "2026-10-20",
    commits: [commit({ author: "github-actions[bot]" }), commit({})],
  });
  assert.equal(out.bots.length, 1);
  assert.equal(out.chunks[0].spec.length, 1);
});

const plan = {
  chunks: [
    { id: "a", spec: ["aaaaaaa1"], build: [] },
    { id: "b", spec: ["bbbbbbb1"], build: ["ccccccc1"] },
  ],
};

test("merge puts chunk cards first, keeps the lead's, and replaces its own on a second run", () => {
  const parts = {
    a: {
      changes: [{ id: "one", commits: ["aaaaaaa"] }],
      plan: [{ name: "s1" }],
    },
    b: {
      changes: [{ id: "two", commits: ["bbbbbbb", "ccccccc1"] }],
      followups: [{ id: "f" }],
    },
  };
  const data = { changes: [{ id: "one", commits: [] }, { id: "where" }] };
  const out = merge(plan, parts, data);
  assert.deepEqual(out.errors, []);
  assert.deepEqual(
    out.data.changes.map((c) => c.id),
    ["one", "two", "where"],
  );
  assert.deepEqual(out.data.followups, [{ id: "f" }]);
  assert.deepEqual(out.plan, [{ name: "s1" }]);
  assert.deepEqual(merge(plan, parts, out.data).data, out.data);
});

test("merge refuses a missing chunk, a shared id and another chunk's commit", () => {
  const out = merge(
    plan,
    { a: { changes: [{ id: "x", commits: ["bbbbbbb"] }] } },
    { changes: [] },
  );
  assert.equal(out.errors.length, 2);
  assert.match(out.errors[0], /not this chunk's/);
  assert.match(out.errors[1], /chunks\/b\.json is missing/);
  const twice = merge(
    plan,
    { a: { changes: [{ id: "x" }] }, b: { changes: [{ id: "x" }] } },
    { changes: [] },
  );
  assert.match(twice.errors[0], /another chunk's id/);
});
