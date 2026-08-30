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

type Git = (...args: string[]) => void;

function gitIn(root: string): Git {
  return (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=manual@test", "-c", "user.name=manual", ...args],
      { cwd: root },
    );
}

function writePage(root: string, page: string): void {
  const file = join(root, page);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, "---\ntitle: Page\n---\n");
}

function repoWith(page: string, format: "sha1" | "sha256"): string {
  const root = mkdtempSync(join(tmpdir(), "manual-git-"));
  const run = gitIn(root);
  run("init", "--quiet", `--object-format=${format}`, ".");
  writePage(root, page);
  run("add", "-A");
  run("commit", "--quiet", "-m", "the page");
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

  it("reads the subject and the file that commit touched", async () => {
    const index = await readGitIndex(repoWith(PAGE, format), ["manual"]);

    expect(index.history).toEqual([
      {
        sha: index.head,
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        subject: "the page",
        refs: [{ kind: "page", path: PAGE }],
      },
    ]);
  });
});

/** A merge touches no file of its own, and a feed of "merged branch" says
 * nothing about what changed. */
describe("a repository with a merge", () => {
  it("keeps the commits that touched a file and drops the merge", async () => {
    const root = repoWith("manual/a.md", "sha1");
    const run = gitIn(root);
    const commitPage = (page: string, said: string) => {
      writePage(root, page);
      run("add", "-A");
      run("commit", "--quiet", "-m", said);
    };
    run("checkout", "--quiet", "-b", "side");
    commitPage("manual/b.md", "the second page");
    run("checkout", "--quiet", "-");
    commitPage("manual/c.md", "the third page");
    run("merge", "--no-ff", "--quiet", "side", "-m", "merge side");

    const index = await readGitIndex(root, ["manual"]);
    const subjects = index.history.map((event) => event.subject);

    expect(subjects).toHaveLength(3);
    expect(subjects).not.toContain("merge side");
  });
});
