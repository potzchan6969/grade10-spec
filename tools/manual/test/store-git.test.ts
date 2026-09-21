import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  mainStateOf,
  readGitIndex,
  readMain,
  walkGit,
} from "../src/store/git.mts";

/** The git reader against real repositories, because both things it gets
 * wrong are things only git can show: how it prints a path, and how long a
 * sha is. */

const PAGE = "docs/prds/pägé.md";

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

    const index = await readGitIndex(root, ["docs/prds"]);
    const commit = index.commitOf(PAGE);

    expect(commit?.sha).toBe(index.head);
    expect(commit?.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("reads the subject and the file that commit touched", async () => {
    const index = await readGitIndex(repoWith(PAGE, format), ["docs/prds"]);

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

/** The plan is read at the store's main; a change missing there cannot be
 * claimed, a checkout copy that differs from it is not the settled brief, and
 * the board has to say both. Main is read off the refs the clone has —
 * `origin/main` here is a plain remote-tracking ref, which is all the reader
 * asks for. */
describe("a walk git refuses", () => {
  /** A walk on a ref that does not resolve: what a store whose `main` the
   * clone does not hold gives, and what a depth-1 checkout gives past its one
   * commit. */
  const refused = (root: string) =>
    walkGit(root, ["log", "--format=%H", "no-such-ref"], "no thread");

  /** An empty repository, so the refusal is the ref's and not the directory's
   * wherever the temp directory sits. */
  const plain = () => {
    const root = mkdtempSync(join(tmpdir(), "manual-unwalked-"));
    execFileSync("git", ["init", "-q", root]);
    return root;
  };

  it("answers nothing, says what is lost and carries git's own words", () => {
    const root = plain();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      expect(refused(root)).toBeUndefined();

      const said = warn.mock.calls.map((call) => String(call[0])).join("\n");
      expect(said).toContain(root);
      expect(said).toContain("log");
      expect(said).toContain("no thread");
      // git's own reason, not a line that only says something failed.
      expect(said).toContain("no-such-ref");
    } finally {
      warn.mockRestore();
    }
  });

  it("says it once per root, and again for another store", () => {
    const one = plain();
    const two = plain();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      refused(one);
      refused(one);
      expect(warn).toHaveBeenCalledTimes(1);

      refused(two);
      expect(warn).toHaveBeenCalledTimes(2);
    } finally {
      warn.mockRestore();
    }
  });
});

describe("the store's main", () => {
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

  it("reads each task list as main holds it, not as the checkout does", async () => {
    const main = await readMain(storeWith().root);

    expect(main.ref).toBe("origin/main");
    expect([...main.changes]).toEqual(["settled"]);
    expect(main.tasks.get("settled")).toBe("## 1. G\n\n- [ ] 1.1 T\n");
  });

  it("flags unmerged and diverged, and lets a checkmark churn tasks.md", async () => {
    const main = await readMain(storeWith().root);

    expect(mainStateOf(main, "branch-only")).toEqual({
      state: "unmerged",
      ref: "origin/main",
    });
    // design.md counts; the flipped checkbox in tasks.md deliberately not.
    expect(mainStateOf(main, "settled")).toEqual({
      state: "diverged",
      ref: "origin/main",
      files: 1,
    });
  });

  it("counts a file moved out of a change against the change it left", async () => {
    const { root, run } = storeWith();
    run(
      "mv",
      "openspec/changes/settled/proposal.md",
      "openspec/changes/branch-only/moved.md",
    );
    const main = await readMain(root);

    expect(mainStateOf(main, "settled")).toEqual({
      state: "diverged",
      ref: "origin/main",
      files: 2,
    });
  });

  it("reads the branch origin/HEAD names, and refuses one origin lacks", async () => {
    const { root, run } = storeWith();
    run("update-ref", "refs/remotes/origin/trunk", "HEAD");
    run(
      "symbolic-ref",
      "refs/remotes/origin/HEAD",
      "refs/remotes/origin/trunk",
    );
    const main = await readMain(root);

    expect(main.ref).toBe("origin/trunk");
    expect([...main.changes].sort()).toEqual(["branch-only", "settled"]);

    run("symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/gone");
    await expect(readMain(root)).rejects.toThrow(
      "has no origin/gone: claims and checkmarks are read on the store's main — run `git remote set-head origin --auto`",
    );
  });

  it("refuses a clone with no main to read claims at", async () => {
    const { root, run } = storeWith();
    run("update-ref", "-d", "refs/remotes/origin/main");

    await expect(readMain(root)).rejects.toThrow("has no origin/main");
  });

  it("says nothing once main has caught up", async () => {
    const { root, run } = storeWith();
    run("update-ref", "refs/remotes/origin/main", "HEAD");
    const main = await readMain(root);

    expect(mainStateOf(main, "settled")).toBeUndefined();
    expect(mainStateOf(main, "branch-only")).toBeUndefined();
  });
});

/** A merge touches no file of its own, and a feed of "merged branch" says
 * nothing about what changed. */
describe("a repository with a merge", () => {
  it("keeps the commits that touched a file and drops the merge", async () => {
    const root = repoWith("docs/prds/a.md", "sha1");
    const run = gitIn(root);
    const commitPage = (page: string, said: string) => {
      writePage(root, page);
      run("add", "-A");
      run("commit", "--quiet", "-m", said);
    };
    run("checkout", "--quiet", "-b", "side");
    commitPage("docs/prds/b.md", "the second page");
    run("checkout", "--quiet", "-");
    commitPage("docs/prds/c.md", "the third page");
    run("merge", "--no-ff", "--quiet", "side", "-m", "merge side");

    const index = await readGitIndex(root, ["docs/prds"]);
    const subjects = index.history.map((event) => event.subject);

    expect(subjects).toHaveLength(3);
    expect(subjects).not.toContain("merge side");
  });
});
