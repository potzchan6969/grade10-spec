import { describe, expect, it } from "vitest";
import { readLandings } from "../src/store/read-landings.mts";
import { DAY, gitStore, MANIFEST, PROPOSAL, tasksMd } from "./git-store";
import { writeStore } from "./tmp-store";

/**
 * What each change last landed, which is what says it has stopped moving. The
 * last commit touching a directory cannot say it: one repository-wide reformat
 * moves every change at once and resets every board. A landing is a task
 * ticked, a group claimed, or an artifact added — each a line or a file the
 * history carries — and it is read for the whole store in two walks, so a
 * store of a hundred changes costs two.
 */

const CHANGE = "land-probe";
const DIR = `openspec/changes/${CHANGE}`;

/** A store with the change proposed: the record, the proposal, no task list. */
function store() {
  const built = gitStore("manual-landings-");
  const propose = (daysAgo: number, id = CHANGE) => {
    built.write(`openspec/changes/${id}/.openspec.yaml`, MANIFEST);
    built.write(`openspec/changes/${id}/proposal.md`, PROPOSAL);
    built.commit(`propose ${id}`, daysAgo);
  };
  return { ...built, propose };
}

/** Whole days between the landing the reader found and now. */
function daysSince(landed: string | undefined): number | undefined {
  if (landed === undefined) return undefined;
  return Math.round((Date.now() - Date.parse(landed)) / DAY);
}

const landedIn = (root: string, id = CHANGE) =>
  daysSince(readLandings(root, null).get(id));

describe("the landing a change is dated by", () => {
  it("is the newest commit that ticked a task", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("Complete land-probe 1.1", 7);

    expect(landedIn(root)).toBe(7);
  });

  it("is the newest commit that claimed a group", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("dana", 0));
    commit("Claim land-probe 1", 9);

    expect(landedIn(root)).toBe(9);
  });

  it("is not moved by a commit that ticks nothing and adds nothing", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 9);
    // One commit across the whole store: every task reworded, no box moved.
    write(`${DIR}/tasks.md`, tasksMd("", 1, " - reworded"));
    commit("style: one sentence per line", 0);

    expect(landedIn(root)).toBe(9);
  });

  it("is not moved by a commit that adds the record alone", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 11);
    // A second change, whose first commit is its record and nothing else:
    // `thread:`, `reviewed:` and `landed_by:` are what a round writes about a
    // change, never a thing it landed.
    write("openspec/changes/record-probe/.openspec.yaml", MANIFEST);
    commit("open record-probe", 1);

    expect(landedIn(root)).toBe(11);
    expect(landedIn(root, "record-probe")).toBeUndefined();
  });

  it("is not moved by a directory rename", () => {
    const { root, git, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("dana", 1));
    commit("plan land-probe", 13);
    git(["mv", DIR, "openspec/changes/renamed-probe"]);
    commit("rename the change", 0);

    // The rename ticked nothing and added nothing: every line and every file
    // it moved was already there.
    expect(landedIn(root, "renamed-probe")).toBe(13);
  });

  it("is not moved by a tick taken back", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 14);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("Reopen land-probe 1.1", 2);

    expect(landedIn(root)).toBe(14);
  });

  it("is the newest commit that added an artifact of the change", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 12);
    write(`${DIR}/tech-design.md`, "## Context\n\nIt lands here.\n");
    commit("design land-probe", 4);

    expect(landedIn(root)).toBe(4);
  });

  it("is the tick where the tick is newer than the artifact", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    write(`${DIR}/decisions.md`, "## Goals\n\n- One.\n");
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("plan land-probe", 12);
    write(`${DIR}/tasks.md`, tasksMd("", 2));
    commit("Complete land-probe 1.2", 3);

    expect(landedIn(root)).toBe(3);
  });

  it("reads a change with no task list from its artifacts alone", () => {
    const { root, propose } = store();
    propose(5);

    expect(landedIn(root)).toBe(5);
  });

  it("dates each change of the store from its own history", () => {
    const { root, write, commit, propose } = store();
    propose(20);
    propose(18, "other-probe");
    write(`${DIR}/tasks.md`, tasksMd("", 1));
    commit("plan land-probe", 10);
    write("openspec/changes/other-probe/tasks.md", tasksMd("dana", 0));
    commit("claim other-probe", 6);

    expect(landedIn(root)).toBe(10);
    expect(landedIn(root, "other-probe")).toBe(6);
  });
});

describe("when the history says nothing", () => {
  it("says nothing about a store that is not a git checkout", () => {
    const root = writeStore({
      [`${DIR}/.openspec.yaml`]: MANIFEST,
      [`${DIR}/proposal.md`]: PROPOSAL,
      [`${DIR}/tasks.md`]: tasksMd("dana", 1),
    });

    expect(readLandings(root, null).size).toBe(0);
  });

  it("says nothing about a change no commit holds yet", () => {
    const { root, write, commit } = store();
    write("README.md", "# The store\n");
    commit("the store before the change", 30);
    write(`${DIR}/tasks.md`, tasksMd("", 0));

    expect(readLandings(root, null).has(CHANGE)).toBe(false);
  });
});
