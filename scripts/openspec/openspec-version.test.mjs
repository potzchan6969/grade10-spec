/*
 * The OpenSpec CLI is pinned in three places: the `openspec` script in
 * package.json, and `OPENSPEC_VERSION` in the two workflows that install it
 * globally. One version, or the store validates one way locally and another
 * in CI.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const SCRIPT = /"openspec":\s*"pnpm dlx @fission-ai\/openspec@([^"\s]+)"/;
const WORKFLOW = /^\s*OPENSPEC_VERSION:\s*([^\s#]+)/m;
const WORKFLOWS = [
  ".github/workflows/lint.yml",
  ".github/workflows/manual.yml",
];

test("package.json pins the CLI the workflows install", () => {
  const script = SCRIPT.exec(read("package.json"));
  assert.ok(
    script,
    "package.json has no `openspec` script pinning @fission-ai/openspec",
  );
  for (const file of WORKFLOWS) {
    const pinned = WORKFLOW.exec(read(file));
    assert.ok(pinned, `${file} sets no OPENSPEC_VERSION`);
    assert.equal(
      pinned[1],
      script[1],
      `${file} installs ${pinned[1]}; package.json runs ${script[1]}`,
    );
  }
});
