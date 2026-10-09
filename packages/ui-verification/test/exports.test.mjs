import assert from "node:assert/strict";
import test from "node:test";

test("published subpaths resolve through the package exports", async () => {
  for (const subpath of [
    "model",
    "archive",
    "archive-api",
    "calibration",
    "scoring",
    "worker",
  ]) {
    await assert.doesNotReject(
      () => import(`@grade10/ui-verification/${subpath}`),
    );
  }
});
