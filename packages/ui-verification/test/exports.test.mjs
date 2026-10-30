import assert from "node:assert/strict";
import test from "node:test";

test("published subpaths resolve through the package exports", async () => {
  for (const subpath of [
    "model",
    "pixel-diff",
    "archive",
    "archive-api",
    "capture-coordinator",
    "local-coordinator",
    "reference-capture",
    "scoring",
    "worker",
  ]) {
    await assert.doesNotReject(
      () => import(`@grade10/ui-verification/${subpath}`),
    );
  }
});
