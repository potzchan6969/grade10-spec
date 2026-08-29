import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { readGitIndex } from "../src/store/git.mts";

/** The git reader against real repositories, because both things it gets
 * wrong are things only git can show: how it prints a path, and how long a
 * sha is. */

const PAGE = "manual/pägé.md";

function repoWith(page: string, format: "sha1" | "sha256"): string {
  const root = mkdtempSync(join(tmpdir(), "manual-git-"));
  const run = (...args: string[]) => execFileSync("git", args, { cwd: root });
  run("init", "--quiet", `--object-format=${format}`, ".");
  const file = join(root, page);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, "---\ntitle: Page\n---\n");
  run("add", "-A");
  run(
    "-c",
    "user.email=manual@test",
    "-c",
    "user.name=manual",
    "commit",
    "--quiet",
    "-m",
    "the page",
  );
  return root;
}

describe.each(["sha1", "sha256"] as const)("a %s repository", (format) => {
  it("still names the commit a page last moved in", async () => {
    const root = repoWith(PAGE, format);

    const index = await readGitIndex(root, ["manual"]);
    const commit = index.commitOf(PAGE);

    expect(commit?.sha).toBe(index.head);
    expect(commit?.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
