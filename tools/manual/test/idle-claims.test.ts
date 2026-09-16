import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { readIdleClaims } from "../src/store/idle.mts";
import {
  readArchivedChanges,
  readChanges,
} from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

/**
 * How long a claim has sat still is the one thing on a task group that no file
 * states. It is read from the git history of `tasks.md` by `openspec-viewer`'s
 * published `lib/store`, through the submodule, so what is tested here is the
 * seam rather than the inference: that a real history produces the age a
 * reader would act on, that the number reaches the group it belongs to, and
 * that every way the reading can be unavailable leaves the change intact.
 *
 * The inference itself is tested in the viewer, against histories built the
 * same way. Restating its edges here would be a second suite to disagree with
 * the first.
 */

/**
 * The reading is optional by design: `idle.mts` returns nothing at all when
 * the viewer submodule is not initialised, and the manual renders exactly what
 * it rendered before. So the tests that assert a real age skip themselves
 * rather than fail in a clone that has not run `git submodule update`. CI
 * checks the submodule out, which is what stops this skipping quietly forever.
 */
const VIEWER = fileURLToPath(
  new URL("../../openspec-viewer/lib/store.mjs", import.meta.url),
);
const withViewer = describe.skipIf(!existsSync(VIEWER));

const DAY = 86_400_000;
const CHANGE = "add-gift-cards";

/** A group with an owner and `done` of its three tasks checked off. `note`
 * varies the text without touching ownership or a checkbox — a real commit
 * that must not reset the clock, the way rewording a task does not. */
const tasksMd = (owner: string, done: number, note = "") =>
  [
    `## 1. Contracts (grade10-spec)${owner ? ` (owner: @${owner})` : ""}`,
    "",
    ...[1, 2, 3].map(
      (n) => `- [${n <= done ? "x" : " "}] 1.${n} Task ${n}${note}`,
    ),
    "",
    "## 2. Adoption (grade10)",
    "",
    "- [ ] 2.1 Wire it up",
    "",
  ].join("\n");

const MANIFEST = "schema: grade10-planning\n";
const PROPOSAL = "# Gift cards\n\n## Why\n\nNobody can buy one.\n";

/** A store whose `tasks.md` has a history, committed at fixed dates so an
 * elapsed day count is exact rather than approximately today. */
function storeWithHistory(
  states: [owner: string, done: number, ago: number][],
) {
  const root = mkdtempSync(join(tmpdir(), "manual-idle-"));
  const dir = join(root, "openspec", "changes", CHANGE);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, ".openspec.yaml"), MANIFEST);
  writeFileSync(join(dir, "proposal.md"), PROPOSAL);

  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, stdio: "ignore" });
  git("init", "-q");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");

  for (const [owner, done, ago] of states) {
    writeFileSync(join(dir, "tasks.md"), tasksMd(owner, done, ` (${ago})`));
    const at = new Date(Date.now() - ago * DAY).toISOString();
    git("add", "-A");
    execFileSync("git", ["commit", "-q", "-m", `${owner} ${done}`], {
      cwd: root,
      stdio: "ignore",
      env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
    });
  }
  return root;
}

/** The claims of the task list the checkout holds, dated from HEAD — how a
 * change only this checkout has is read. */
const claimsOf = (root: string) =>
  readIdleClaims(
    root,
    CHANGE,
    readFileSync(join(root, "openspec", "changes", CHANGE, "tasks.md"), "utf8"),
    null,
  );

withViewer("dating a claim", () => {
  it("dates it from the newest checkmark, and says so", () => {
    // Claimed nine days ago, last checkmark four days ago.
    const root = storeWithHistory([
      ["dana", 0, 9],
      ["dana", 1, 4],
    ]);
    const claim = claimsOf(root).get("1");

    expect(claim?.source).toBe("progress");
    expect(claim?.days).toBe(4);
    expect(Date.parse(claim?.since ?? "")).not.toBeNaN();
  });

  it("dates it from the claim when nothing has been checked off", () => {
    const root = storeWithHistory([
      ["dana", 0, 11],
      ["dana", 0, 5],
    ]);
    const claim = claimsOf(root).get("1");

    expect(claim?.source).toBe("claim");
    // The stretch began at the older commit: rewording a task is not progress.
    expect(claim?.days).toBe(11);
  });

  it("says nothing about a group nobody has claimed", () => {
    const root = storeWithHistory([["", 0, 6]]);
    expect(claimsOf(root).has("1")).toBe(false);
    // Group 2 is unclaimed in every fixture here, so it never gets an age.
    expect(claimsOf(root).has("2")).toBe(false);
  });

  it("says nothing about a group whose work is done", () => {
    const root = storeWithHistory([
      ["dana", 0, 9],
      ["dana", 3, 8],
    ]);
    expect(claimsOf(root).has("1")).toBe(false);
  });

  it("says nothing when the history cannot account for the owner", () => {
    // The tag reached the working copy without ever being committed, so there
    // is no commit to date the claim from.
    const root = storeWithHistory([["", 0, 6]]);
    writeFileSync(
      join(root, "openspec", "changes", CHANGE, "tasks.md"),
      tasksMd("dana", 0),
    );
    expect(claimsOf(root).has("1")).toBe(false);
  });
});

describe("when the reading is unavailable", () => {
  it("leaves a store that is not a git checkout without ages", () => {
    const root = writeStore({
      [`openspec/changes/${CHANGE}/.openspec.yaml`]: MANIFEST,
      [`openspec/changes/${CHANGE}/proposal.md`]: PROPOSAL,
      [`openspec/changes/${CHANGE}/tasks.md`]: tasksMd("dana", 0),
    });
    expect(claimsOf(root).size).toBe(0);
  });
});

withViewer("what the change carries", () => {
  it("hands the age to the group whose number it was read against", () => {
    const root = storeWithHistory([
      ["dana", 0, 9],
      ["dana", 1, 4],
    ]);
    const [change] = readChanges(root, NO_GIT, null);
    const [contracts, adoption] = change.taskGroups;

    expect(contracts.num).toBe("1");
    expect(contracts.idle?.days).toBe(4);
    // Keyed by number, not by position or title: the convention makes the
    // number the address, and an unclaimed group must not inherit an age.
    expect(adoption.num).toBe("2");
    expect(adoption.idle).toBeUndefined();
  });

  it("never dates an archived change, which is finished", () => {
    const root = storeWithHistory([
      ["dana", 0, 9],
      ["dana", 1, 4],
    ]);
    // The same change, moved to where the archive reads it from.
    execFileSync("git", ["mv", `openspec/changes/${CHANGE}`, "archived-tmp"], {
      cwd: root,
      stdio: "ignore",
    });
    mkdirSync(join(root, "openspec", "changes", "archive"), {
      recursive: true,
    });
    execFileSync(
      "git",
      ["mv", "archived-tmp", `openspec/changes/archive/2026-09-01-${CHANGE}`],
      { cwd: root, stdio: "ignore" },
    );

    const [archived] = readArchivedChanges(root, NO_GIT);
    expect(archived.taskGroups.every((group) => !group.idle)).toBe(true);
  });
});
