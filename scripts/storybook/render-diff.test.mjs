import assert from "node:assert/strict";
import { test } from "node:test";

import { diffSnapshots, renderSignature } from "./render-diff.mjs";

const element = (tag, box, text = "") => ({ box, tag, text });

test("the same render gives the same signature", () => {
  const a = renderSignature([element("DIV", [0, 0, 10, 10], "Hi")]);
  const b = renderSignature([element("DIV", [0, 0, 10, 10], "Hi")]);
  assert.deepEqual(a, b);
});

test("a moved box changes layout and leaves text alone", () => {
  const a = renderSignature([element("DIV", [0, 0, 10, 10], "Hi")]);
  const b = renderSignature([element("DIV", [0, 4, 10, 10], "Hi")]);
  assert.notEqual(a.layout, b.layout);
  assert.equal(a.text, b.text);
});

test("new words change text and leave layout alone", () => {
  const a = renderSignature([element("DIV", [0, 0, 10, 10], "Hi")]);
  const b = renderSignature([element("DIV", [0, 0, 10, 10], "Hello")]);
  assert.equal(a.layout, b.layout);
  assert.notEqual(a.text, b.text);
});

test("diff names the reason per story and skips unchanged ones", () => {
  const same = { layout: "l", text: "t" };
  const changes = diffSnapshots(
    { a: same, b: same, c: same },
    {
      a: same,
      b: { ...same, layout: "x" },
      c: { ...same, text: "x" },
      d: same,
    },
  );
  assert.deepEqual(Object.fromEntries(changes), {
    b: "layout",
    c: "text",
    d: "added",
  });
});

test("a story that starts failing is named, one that keeps failing is not", () => {
  const ok = { layout: "l", text: "t" };
  const bad = { layout: "error", text: "error" };
  const changes = diffSnapshots(
    { a: ok, b: bad, c: bad },
    { a: bad, b: bad, c: ok, d: bad },
  );
  assert.deepEqual(Object.fromEntries(changes), {
    a: "error",
    c: "layout",
    d: "error",
  });
});
