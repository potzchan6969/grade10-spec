import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { textAt } from "./store-main.mjs";

function storeWith(files) {
  const root = mkdtempSync(join(tmpdir(), "store-main-"));
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git("init", "-q");
  for (const [path, text] of Object.entries(files))
    writeFileSync(join(root, path), text);
  git("add", "-A");
  git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "files");
  return root;
}

test("textAt reads a file larger than Node's default output buffer", () => {
  const large = `${"x".repeat(3 * 1024 * 1024)}\n`;
  const root = storeWith({ "large.json": large });
  assert.equal(textAt(root, "HEAD", "large.json"), large);
});

test("textAt answers null only for a path the commit does not hold", () => {
  const root = storeWith({ "kept.md": "kept\n" });
  assert.equal(textAt(root, "HEAD", "absent.md"), null);
  writeFileSync(join(root, "uncommitted.md"), "local\n");
  assert.equal(textAt(root, "HEAD", "uncommitted.md"), null);
});

test("textAt throws git's words for any other refusal", () => {
  const root = storeWith({ "kept.md": "kept\n" });
  for (const commit of ["0".repeat(40), "no-such-ref"])
    assert.throws(
      () => textAt(root, commit, "kept.md"),
      new RegExp(`git show ${commit}:kept\\.md refused in .*: fatal:`, "s"),
    );
});
