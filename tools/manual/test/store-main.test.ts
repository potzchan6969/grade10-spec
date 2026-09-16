import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { rootsOf } from "../src/store/roots.mts";
import { readHeads, readStore } from "../src/store/snapshot.mts";

/** `pnpm plan` lands every claim and checkmark on the store's main and never
 * writes a checkout, so the board reads each task list there. A checkout on a
 * planning branch, or one behind main, would otherwise show claims main has
 * moved past. */

const CLEAN = fileURLToPath(new URL("./fixtures/check/clean", import.meta.url));
const SCHEMAS = fileURLToPath(
  new URL("../../../openspec/schemas", import.meta.url),
);
const VIEWER = fileURLToPath(
  new URL("../../openspec-viewer/lib/store.mjs", import.meta.url),
);
const DAY = 86_400_000;
const PROPOSAL = "# Build it\n\n## Why\n\nNobody has.\n";

const tasksMd = (owner: string, done: number) =>
  [
    `## 1. Build it (grade10-spec)${owner ? ` (owner: @${owner})` : ""}`,
    "",
    `- [${done >= 1 ? "x" : " "}] 1.1 Write it`,
    `- [${done >= 2 ? "x" : " "}] 1.2 Ship it`,
    "",
  ].join("\n");

/** The clean fixture as a git checkout, `origin/main` a plain remote-tracking
 * ref, commits dated a given number of days ago. */
function checkout() {
  const root = mkdtempSync(join(tmpdir(), "manual-main-"));
  cpSync(CLEAN, root, { recursive: true });
  const git = (args: string[], daysAgo = 0) => {
    const at = new Date(Date.now() - daysAgo * DAY).toISOString();
    return execFileSync(
      "git",
      ["-c", "user.email=manual@test", "-c", "user.name=manual", ...args],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    ).trim();
  };
  const write = (change: string, file: string, text: string) => {
    const path = join(root, "openspec", "changes", change, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  const commit = (message: string, daysAgo = 0) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message], daysAgo);
  };
  git(["init", "--quiet", "."]);
  return { root, git, write, commit };
}

/** Planned nine days ago; claimed with a checkmark on main four days ago; the
 * checkout still on the branch the plan was written on. */
function behindMain(): string {
  const { root, git, write, commit } = checkout();
  write("build-it", "proposal.md", PROPOSAL);
  write("build-it", "tasks.md", tasksMd("", 0));
  commit("plan build-it", 9);
  git(["branch", "planning"]);
  write("build-it", "tasks.md", tasksMd("dana", 1));
  commit("Complete build-it 1.1", 4);
  git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
  git(["checkout", "--quiet", "planning"]);
  return root;
}

const changeOf = async (root: string, id: string) =>
  (await readStore(rootsOf(root))).snapshot.changes.find(
    (one) => one.id === id,
  );

describe("the plan the board reads", () => {
  it("shows a checkout behind main the claims main records", async () => {
    const change = await changeOf(behindMain(), "build-it");

    expect(change?.taskGroups).toMatchObject([
      { num: "1", owner: "dana", done: 1, total: 2 },
    ]);
    expect(change?.owners).toEqual(["dana"]);
    // Only tasks.md is older here, and every claim moves it.
    expect(change?.mainState).toBeUndefined();
  });

  it.skipIf(!existsSync(VIEWER))(
    "dates the claim from main's history",
    async () => {
      const change = await changeOf(behindMain(), "build-it");

      expect(change?.taskGroups[0].idle).toMatchObject({
        days: 4,
        source: "progress",
      });
    },
  );

  it("keeps the task list of a change only this checkout has", async () => {
    const { root, git, write, commit } = checkout();
    commit("the store");
    git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    write("branch-only", "proposal.md", PROPOSAL);
    write("branch-only", "tasks.md", tasksMd("erin", 0));
    commit("plan branch-only");

    const change = await changeOf(root, "branch-only");

    expect(change?.taskGroups).toMatchObject([{ owner: "erin" }]);
    expect(change?.mainState).toEqual({
      state: "unmerged",
      ref: "origin/main",
    });
  });

  it("refuses a checkout with no main rather than show its own claims", async () => {
    const { root, commit } = checkout();
    commit("the store");

    await expect(readStore(rootsOf(root))).rejects.toThrow(
      "has no origin/main",
    );
  });

  it("re-reads when only main moves", async () => {
    const { root, git, commit } = checkout();
    commit("the store");
    git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    const before = await readHeads(rootsOf(root));

    const claim = git([
      "commit-tree",
      "HEAD^{tree}",
      "-p",
      "HEAD",
      "-m",
      "claim",
    ]);
    git(["update-ref", "refs/remotes/origin/main", claim]);

    expect(await readHeads(rootsOf(root))).not.toBe(before);
  });

  it("counts a plan written where main holds one, and only there", async () => {
    const { root, git, write, commit } = checkout();
    cpSync(SCHEMAS, join(root, "openspec", "schemas"), { recursive: true });
    for (const id of ["merged-plan", "branch-plan"]) {
      write(id, ".openspec.yaml", "schema: grade10-planning\n");
      write(id, "proposal.md", PROPOSAL);
    }
    commit("propose both");
    git(["branch", "planning"]);
    write("merged-plan", "tasks.md", tasksMd("dana", 0));
    commit("plan merged-plan");
    git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    git(["checkout", "--quiet", "planning"]);
    write("branch-plan", "tasks.md", tasksMd("", 0));
    commit("plan branch-plan");

    const { snapshot, documents } = await readStore(rootsOf(root));
    const change = (id: string) =>
      snapshot.changes.find((one) => one.id === id);
    const tasksTab = (id: string) =>
      documents
        .find((one) => one.id === id)
        ?.artifacts.find((one) => one.kind === "tasks")?.present;

    expect(change("merged-plan")?.written).toContain("tasks");
    expect(tasksTab("merged-plan")).toBe(true);
    expect(change("branch-plan")?.written).not.toContain("tasks");
    expect(tasksTab("branch-plan")).toBe(false);
    // A plan main lacks is not claim churn: the board says it is unmerged.
    expect(change("branch-plan")?.mainState).toEqual({
      state: "diverged",
      ref: "origin/main",
      files: 1,
    });
  });
});
