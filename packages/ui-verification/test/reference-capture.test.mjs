import assert from "node:assert/strict";
import test from "node:test";
import { regionFits, storedRegion } from "../src/reference-capture.mjs";

const desktop = { width: 1440, height: 900 };

test("a reference region crops to the element box when it fits", () => {
  assert.deepEqual(
    storedRegion({ x: 10.4, y: 20.6, width: 300.2, height: 100.5 }, desktop, {
      wholeViewport: false,
      scored: true,
    }),
    { x: 10, y: 21, width: 300, height: 101 },
  );
});

test("a box off the screen compares the viewport away from the score profile", () => {
  const tall = { x: 0, y: 0, width: 1440, height: 2400 };
  assert.deepEqual(
    storedRegion(tall, desktop, { wholeViewport: false, scored: false }),
    { x: 0, y: 0, width: 1440, height: 900 },
  );
  assert.throws(
    () => storedRegion(tall, desktop, { wholeViewport: false, scored: true }),
    (error) => error.code === "REGION_OUTSIDE_VIEWPORT",
  );
});

test("a viewport case always compares the whole screen", () => {
  assert.deepEqual(
    storedRegion({ x: 5, y: 5, width: 5, height: 5 }, desktop, {
      wholeViewport: true,
      scored: true,
    }),
    { x: 0, y: 0, width: 1440, height: 900 },
  );
  assert.equal(regionFits({ x: 0, y: 0, width: 0, height: 5 }, desktop), false);
});
