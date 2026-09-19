import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { readLandings } from "../src/store/landings.mts";
import { writeStore } from "./tmp-store";

/**
 * What a change last landed, which is what says it has stopped moving. The
 * last commit touching the directory cannot say it: one repository-wide
 * reformat moves every change at once and resets every board. A landing is a
 * task ticked, a group claimed, or an artifact added — each a line or a file
 * this reader can see in the history of the change's own directory.
 */

const DAY = 86_400_000;
const CHANGE = "land-probe";
const DIR = `openspec/changes/${CHANGE}`;
const MANIFEST = "schema: grade10-planning\ncreated: 2026-09-01\n";
const PROPOSAL = "# Land probe\n\n## Why\n\nNobody has.\n";

/** A task list with `done` of its three tasks ticked, `owner` claiming the
 * group, and `note` varying the text without touching either. */
const tasksMd = (owner: string, done: number, note = "") =>
  [
    `## 1. Contracts (grade10-spec)${owner ? ` (owner: @${owner})` : ""}`,
    "",
    ...[1, 2, 3].map(
      (n) => `- [${n <= done ? "x" : " "}] 1.${n} Task ${n}${note}`,
    ),
    "",
  ].join("\n");

/** A git store whose change directory has a history, committed at fixed dates
 * so an elapsed day count is exact rather than approximately today. */
function repo() {
  const root = mkdtempSync(join(tmpdir(), "manual-landings-"));
  const git = (args: string[], daysAgo = 0) => {
    const at = new Date(Date.now() - daysAgo * DAY).toISOString();
    execFileSync(
      "git",
      ["-c", "user.email=manual@test", "-c", "user.name=manual", ...args],
      {
        cwd: root,
        stdio: "ignore",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    );
  };
  const write = (path: string, text: string) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  const commit = (message: string, daysAgo: number) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message], daysAgo);
  };
  git(["init", "--quiet", "."]);
  /** The change as it is proposed: the record, the proposal, no task list. */
  const propose = (daysAgo: number) => {
    write(`${DIR}/.openspec.yaml`, MANIFEST);
    write(`${DIR}/proposal.md`, PROPOSAL);
    commit("propose land-probe", daysAgo);
  };
  return { root, git, write, commit, propose };
}

const tasksOf = (root: string) =>
  readFileSync(join(root, DIR, "tasks.md"), "utf8");

/** Whole days between the landing the reader found and now. */
function daysSince(landed: string | undefined): number | undefined {
  if (landed === undefined) return undefined;
  return Math.round((Date.now() - Date.parse(landed)) / DAY);
}

const landedIn = (root: string) =>
  daysSince(readLandings(root, CHANGE, tasksOf(root), null));

describe("the landing a change is dated by", () => {
  it("is the newest commit that ticked a task", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("Complete land-probe 1.1", 7);

    expect(landedIn(root)).toBe(7);
  });

  it("is the newest commit that claimed a group", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("dana", 0));
    commit("Claim land-probe 1", 9);

    expect(landedIn(root)).toBe(9);
  });

  it("is not moved by a commit that ticks nothing and adds nothing", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 9);
    // One commit across the whole store: every task reworded, no box moved.
    write(`${DIR}/tasks.md`, tasksMd("", 1, " - reworded"));
    commit("style: one sentence per line", 0);

    expect(landedIn(root)).toBe(9);
  });

  it("is not moved by the record alone", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 11);
    write(
      `${DIR}/.openspec.yaml`,
      `${MANIFEST}thread: C0123ABCD/1758240000.123456\n`,
    );
    commit("record the thread", 1);

    expect(landedIn(root)).toBe(11);
  });

  it("is not moved by a tick taken back", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 14);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("Reopen land-probe 1.1", 2);

    expect(landedIn(root)).toBe(14);
  });

  it("is the newest commit that added an artifact of the change", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 12);
    write(`${DIR}/tech-design.md`, "## Context\n\nIt lands here.\n");
    commit("design land-probe", 4);

    expect(landedIn(root)).toBe(4);
  });

  it("is the tick where the tick is newer than the artifact", () => {
    const { root, write, commit, propose } = repo();
    propose(20);
    write(`${DIR}/decisions.md`, "## Goals\n\n- One.\n");
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("", 2));
    commit("Complete land-probe 1.2", 3);

    expect(landedIn(root)).toBe(3);
  });

  it("reads a change with no task list from its artifacts alone", () => {
    const { root, propose } = repo();
    propose(5);

    expect(daysSince(readLandings(root, CHANGE, undefined, null))).toBe(5);
  });
});

describe("when the history says nothing", () => {
  it("says nothing about a store that is not a git checkout", () => {
    const root = writeStore({
      [`${DIR}/.openspec.yaml`]: MANIFEST,
      [`${DIR}/proposal.md`]: PROPOSAL,
      [`${DIR}/tasks.md`]: tasksMd("dana", 1),
    });

    expect(readLandings(root, CHANGE, tasksOf(root), null)).toBeUndefined();
  });

  it("says nothing about a change no commit holds yet", () => {
    const { root, write, commit } = repo();
    write("README.md", "# The store\n");
    commit("the store before the change", 30);
    write(`${DIR}/tasks.md`, tasksMd("", 0));

    expect(readLandings(root, CHANGE, tasksOf(root), null)).toBeUndefined();
  });
});
