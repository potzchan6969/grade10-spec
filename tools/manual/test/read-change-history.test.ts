import { describe, expect, it } from "vitest";
import { readChangeHistories } from "../src/store/read-change-history.mts";
import { gitStore, MANIFEST, PROPOSAL, tasksMd } from "./git-store";
import { writeStore } from "./tmp-store";

/**
 * A change's own history on `main`, classified the way the thread tells it: a
 * landing and a re-read by the subject the landing writes, a hand and a tick
 * by what the commit's own patch changed, and anything else as the subject it
 * carries.
 *
 * Over a repository that really holds the commits, because the classification
 * is a reading of git: a fixture of plain objects would prove the shape and
 * nothing about the walk. The commit the walks are given is `main`'s, the way
 * every other reader of the store's history is given it, and two walks answer
 * for every change in the store at once.
 */

const CHANGE = "thread-probe";
const DIR = `openspec/changes/${CHANGE}`;

/** A store whose change is open: the record, the proposal, no task list. */
function store() {
  const built = gitStore("manual-thread-");
  built.write(`${DIR}/.openspec.yaml`, MANIFEST);
  built.write(`${DIR}/proposal.md`, PROPOSAL);
  built.commit(`Open ${CHANGE}`, 20);
  return built;
}

/** One change's thread, off the store-wide walks. */
const thread = (root: string, at: string | null = null, change = CHANGE) =>
  readChangeHistories(root, at).get(change) ?? [];

const kinds = (root: string) => thread(root).map((event) => event.kind);

describe("what the walk makes of each commit", () => {
  it("opens on the commit that added the proposal", () => {
    const { root } = store();
    const [opened, ...rest] = thread(root);

    expect(opened.kind).toBe("opened");
    expect(opened.subject).toBe(`Open ${CHANGE}`);
    expect(opened.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(rest).toHaveLength(0);
  });

  it("reads a landing's target and the handle whose word landed it", () => {
    const { root, write, commit } = store();
    write(`${DIR}/decisions.md`, "# Decisions\n\n## Goals\n\nOne.\n");
    commit(`chore(openspec): land decisions of ${CHANGE} on @robin`, 14);

    const landed = thread(root).at(-1);

    expect(landed?.kind).toBe("landed");
    expect(landed?.target).toBe("decisions");
    expect(landed?.handle).toBe("robin");
  });

  it("reads a task group's landing, which names no handle", () => {
    const { root, write, commit } = store();
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit(`chore(openspec): land 1 of ${CHANGE}`, 10);

    const landed = thread(root).at(-1);

    expect(landed?.kind).toBe("landed");
    expect(landed?.target).toBe("1");
    expect(landed?.handle).toBeUndefined();
  });

  it("reads a re-read that changed nothing", () => {
    const { root, write, commit } = store();
    write(`${DIR}/.openspec.yaml`, `${MANIFEST}reviewed:\n  specs: abc123\n`);
    commit(
      `chore(openspec): specs of ${CHANGE} read again, nothing changed`,
      9,
    );

    const reread = thread(root).at(-1);

    expect(reread?.kind).toBe("read-again");
    expect(reread?.target).toBe("specs");
  });

  it("reads a hand the record's patch wrote, under `hands:` and nowhere else", () => {
    const { root, write, commit } = store();
    write(
      `${DIR}/.openspec.yaml`,
      `${MANIFEST}hands:\n  pm: "@robin"\nlanded_by:\n  proposal: "@robin"\n`,
    );
    commit("Name the hands", 8);

    const hand = thread(root).at(-1);

    expect(hand?.kind).toBe("hand");
    expect(hand?.hands).toEqual([{ role: "pm", handle: "robin" }]);
  });

  it("reads the task ids a commit ticked, and not a reformat that ticks nothing", () => {
    const { root, write, commit } = store();
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit("Plan it", 7);
    write(`${DIR}/tasks.md`, tasksMd("", 2));
    commit("Complete 1.1 and 1.2", 5);
    write(`${DIR}/tasks.md`, tasksMd("", 2, " - reworded"));
    commit("style: one sentence per line", 3);

    const events = thread(root);
    const ticked = events.find((event) => event.kind === "tick");

    expect(ticked?.ticked).toEqual(["1.1", "1.2"]);
    expect(events.at(-1)?.kind).toBe("commit");
    expect(events.at(-1)?.subject).toBe("style: one sentence per line");
  });

  it("keeps every other commit as the subject it carries", () => {
    const { root, write, commit } = store();
    write(`${DIR}/proposal.md`, `${PROPOSAL}\nAnd nobody can spend one.\n`);
    commit("docs(planning): say what a gift card cannot do", 2);

    const last = thread(root).at(-1);

    expect(last?.kind).toBe("commit");
    expect(last?.subject).toBe(
      "docs(planning): say what a gift card cannot do",
    );
  });
});

describe("the order and the edges", () => {
  it("reads oldest first, the way a thread is read", () => {
    const { root, write, commit } = store();
    write(`${DIR}/decisions.md`, "# Decisions\n");
    commit(`chore(openspec): land decisions of ${CHANGE} on @robin`, 14);
    write(`${DIR}/tasks.md`, tasksMd("", 0));
    commit(`chore(openspec): land tasks of ${CHANGE} on @erin`, 6);

    expect(kinds(root)).toEqual(["opened", "landed", "landed"]);
    expect(thread(root).map((one) => one.target)).toEqual([
      undefined,
      "decisions",
      "tasks",
    ]);
  });

  it("shows nothing a commit past main's carries", () => {
    const { root, write, commit, head } = store();
    const main = head();
    write(`${DIR}/decisions.md`, "# Decisions\n");
    commit(`chore(openspec): land decisions of ${CHANGE} on @robin`, 1);

    // The branch is ahead of main, which is where the manual's own checkout
    // sits while a round drafts: the thread is main's history and nothing else.
    expect(thread(root, main).map((one) => one.kind)).toEqual(["opened"]);
    expect(kinds(root)).toEqual(["opened", "landed"]);
  });

  it("reads every change of the store in one pass", () => {
    const { root, write, commit } = store();
    const other = "openspec/changes/second-probe";
    write(`${other}/.openspec.yaml`, MANIFEST);
    write(`${other}/proposal.md`, PROPOSAL);
    write(`${other}/tasks.md`, tasksMd("", 1));
    commit("Open second-probe", 4);

    const histories = readChangeHistories(root, null);

    expect([...histories.keys()].sort()).toEqual(["second-probe", CHANGE]);
    // The commit that opened the second change touched no file of the first,
    // so it is no row of its thread.
    expect(histories.get(CHANGE)).toHaveLength(1);
    expect(histories.get("second-probe")?.map((one) => one.kind)).toEqual([
      "opened",
    ]);
  });

  it("says nothing for a store git cannot walk", () => {
    const root = writeStore({
      [`${DIR}/.openspec.yaml`]: MANIFEST,
      [`${DIR}/proposal.md`]: PROPOSAL,
    });

    expect(readChangeHistories(root, null).size).toBe(0);
  });

  it("says nothing for a change no commit holds", () => {
    const { root } = store();

    expect(thread(root, null, "never-opened")).toEqual([]);
  });
});
