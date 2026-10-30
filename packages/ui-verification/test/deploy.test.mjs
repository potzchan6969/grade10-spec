import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { artifactDigest, RECEIPT_FILE } from "../dev/deploy.mjs";

test("the artifact digest covers every built file but the receipt", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-receipt-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "assets"));
  await writeFile(join(root, "index.html"), "<html></html>");
  await writeFile(join(root, "assets", "app.js"), "console.log(1)");
  const before = await artifactDigest(root);
  await writeFile(join(root, RECEIPT_FILE), "{}");
  assert.equal(await artifactDigest(root), before);
  await writeFile(join(root, "assets", "app.js"), "console.log(2)");
  assert.notEqual(await artifactDigest(root), before);
});
