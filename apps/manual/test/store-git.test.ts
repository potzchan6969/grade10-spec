import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { readGitIndex, readMainStates } from "../src/store/git.mts";

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

/** The plan is read at the store's main; a change not settled there cannot be
 * claimed or archived, and the board has to say so. The states are read off
 * the refs the clone has — `origin/main` here is a plain remote-tracking ref,
 * which is all the reader asks for. */
describe("where a change stands against origin/main", () => {
  function storeWith(): { root: string; run: Git } {
    const root = mkdtempSync(join(tmpdir(), "manual-main-"));
    const run = gitIn(root);
    run("init", "--quiet", ".");
    const write = (path: string, text: string) => {
      const file = join(root, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
    };
    write(
      "openspec/changes/settled/proposal.md",
      "# Settled\n\n## Why\n\nA.\n",
    );
    write("openspec/changes/settled/tasks.md", "## 1. G\n\n- [ ] 1.1 T\n");
    run("add", "-A");
    run("commit", "--quiet", "-m", "on main");
    run("update-ref", "refs/remotes/origin/main", "HEAD");
    write("openspec/changes/branch-only/proposal.md", "# B\n\n## Why\n\nB.\n");
    write("openspec/changes/settled/design.md", "## Context\n\nMoved on.\n");
    write("openspec/changes/settled/tasks.md", "## 1. G\n\n- [x] 1.1 T\n");
    run("add", "-A");
    run("commit", "--quiet", "-m", "ahead of main");
    return { root, run };
  }

  it("flags unmerged and diverged, and lets a checkmark churn tasks.md", async () => {
    const { root } = storeWith();
    const states = await readMainStates(root, ["settled", "branch-only"]);

    expect(states.get("branch-only")).toEqual({
      state: "unmerged",
      ref: "origin/main",
    });
    // design.md counts; the flipped checkbox in tasks.md deliberately not.
    expect(states.get("settled")).toEqual({
      state: "diverged",
      ref: "origin/main",
      files: 1,
    });
  });

  it("answers nothing at all for a clone with no shared branch", async () => {
    const { root, run } = storeWith();
    run("update-ref", "-d", "refs/remotes/origin/main");
    const states = await readMainStates(root, ["settled", "branch-only"]);

    expect(states.size).toBe(0);
  });

  it("says nothing once main has caught up", async () => {
    const { root, run } = storeWith();
    run("update-ref", "refs/remotes/origin/main", "HEAD");
    const states = await readMainStates(root, ["settled", "branch-only"]);

    expect(states.size).toBe(0);
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
