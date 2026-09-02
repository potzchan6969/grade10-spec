import assert from "node:assert/strict";
import test from "node:test";
import { omissions } from "./values.mjs";

const paintedFrame = {
  type: "FRAME",
  fill: "#112233FF",
  stroke: null,
};

const resolveToken = (name) =>
  ({
    overlay: "color-mix(in oklab, var(--foreground) 30%, transparent)",
    foreground: "var(--foreground)",
  })[name] ?? null;

test("opacity-modified semantic color tokens still claim the fill", () => {
  for (const className of ["bg-overlay/30", "bg-foreground/50"]) {
    assert.deepEqual(
      omissions(className, paintedFrame, resolveToken),
      [],
      className,
    );
  }
});

test("opacity-modified unknown tokens remain unclaimed", () => {
  assert.deepEqual(omissions("bg-unknown/30", paintedFrame, resolveToken), [
    "draws #112233FF, no bg-* class claims it",
  ]);
});
