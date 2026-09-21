import type { ThreadEvent } from "../api/types.ts";
import { walkGit } from "./git.mts";
import { changeOf } from "./read-landings.mts";

/**
 * Every change's own history on `main`, read as its thread tells it.
 *
 * The Slack thread carries the same events as replies — the change opened, a
 * draft landed, an artifact read again, a hand named, a group ticked — and
 * every one of them is a commit of the change's directory. So the commits are
 * what the mirror is read from: nothing is stored, and a store that is not a
 * checkout shows no thread rather than an empty one.
 *
 * Two walks for the whole store, not two per change, as `read-landings.mts`
 * reads its own two facts: one `git log --name-only` for every commit of every
 * change, and one `git log -p` over the three files whose own patch says what
 * happened — `hands:` is a line of the record, a tick is a line of `tasks.md`,
 * a question is a row of `decisions.md`, and none of them can be told from a
 * subject. Both are keyed by the change in the path, and each document is
 * handed its slice. Fifty-eight changes read on every composition cost two git
 * processes rather than two hundred and forty.
 *
 * Everything else is classified by the subject `plan:land` writes or kept as
 * the subject it carries — a commit nobody can name is still a thing that
 * happened, and dropping it would leave a gap in the thread.
 *
 * Read on `main`, the way every other reader of the store's history is: the
 * checkout the manual runs out of is ahead of `main` while a round drafts, and
 * a thread showing those commits would say the change had landed things nobody
 * else can see.
 *
 * A depth-1 checkout gives one event, which is honest: the history is not
 * there to be read.
 */

/** Where the changes live, as the walks are given it and as git prints the
 * paths back. */
const CHANGES = "openspec/changes";

/** `chore(openspec): land <target> of <id> on @<handle>`, as `plan:land`
 * writes it — and the same subject without a handle, which is a task group's
 * landing, proven by the tick rather than by a hand's line. */
const LANDED =
  /^chore\(openspec\): land (.+?) of (\S+?)(?: on @([A-Za-z0-9][\w.-]*))?$/;

/** `chore(openspec): <target> of <id> read again, nothing changed`. */
const READ_AGAIN =
  /^chore\(openspec\): (.+?) of (\S+?) read again, nothing changed$/;

/** A hunk header, whose trailing text is the nearest line above the hunk that
 * starts a block — for YAML, the top-level key the added lines sit under. */
const HUNK = /^@@ [^@]*@@\s*(.*)$/;

/** A top-level key of the record: `hands:`, `landed_by:`, `reviewed:`. */
const KEY = /^([a-z][a-z0-9_]*):\s*$/;

/** One entry of a record block: `  pm: "@robin"`. */
const ENTRY = /^\s+([a-z][a-z0-9._-]*):\s*"?@?([A-Za-z0-9][\w.-]*)"?\s*$/;

/** A ticked box and the task id under it, as `docs/governance/task-ownership.md`
 * spells them. */
const TICKED = /^-\s*\[[xX]\]\s*(\d+(?:\.\d+)*)/;

/** An added `## Decisions` row, by the `Q<n>` its first cell names — the one
 * thing that dates a held question, since the record carries no date for it. */
const ASKED_ROW = /^\+\s*\|\s*(Q\d+)\s*\|/;

/** One change's thread as the walks read it. */
export type ChangeThread = {
  /** Its commits, oldest first. */
  events: ThreadEvent[];
  /** When each `Q<n>` was asked, by its id: the commit that added its
   * `decisions.md` row. A row rewritten later keeps the date it was asked on,
   * because the walk reads back to the oldest commit that wrote it. */
  askedAt: Record<string, string>;
};

/** `commit` is the store's `main`, where the thread is read: a checkout
 * drafting a round sits ahead of it, and those commits are not in the thread
 * yet. `null` reads `HEAD`, which is a store whose `main` does not resolve. */
export function readChangeHistories(
  root: string,
  commit: string | null,
): Map<string, ChangeThread> {
  const at = commit ?? "HEAD";
  const { patch, askedAt } = patchesOf(root, at);
  const histories = new Map<string, ChangeThread>();

  for (const [id, commits] of commitsOf(root, at)) {
    const opened = commits.find((one) =>
      one.paths.some((path) => path.endsWith("/proposal.md")),
    );
    histories.set(id, {
      events: commits.map((one) =>
        eventOf(one, one === opened, patch.get(keyOf(one.sha, id)) ?? ""),
      ),
      askedAt: askedAt.get(id) ?? {},
    });
  }
  return histories;
}

type Commit = {
  sha: string;
  date: string;
  subject: string;
  /** The change's own files this commit touched, and no other change's. */
  paths: string[];
};

/** One commit's patch on one change: the key both walks meet on. */
const keyOf = (sha: string, id: string) => `${sha}\0${id}`;

/**
 * Every commit of every change, oldest first per change.
 *
 * A commit that touched two changes is an event in both threads, carrying the
 * paths of the change whose thread it is read in: a store-wide rename is one
 * commit and fifty-eight rows, each row naming that change's own files.
 */
function commitsOf(root: string, at: string): Map<string, Commit[]> {
  const log = walkGit(
    root,
    [
      "log",
      "--format=%H%x00%cI%x00%s",
      "--name-only",
      "--no-renames",
      at,
      "--",
      CHANGES,
    ],
    "no change will show its thread",
  );
  if (log === undefined) return new Map();

  const commits = new Map<string, Commit[]>();
  let header: Omit<Commit, "paths"> | undefined;
  /** This commit's record per change, so its second path joins the first. */
  let ofCommit = new Map<string, Commit>();

  for (const line of log.split("\n")) {
    if (line === "") continue;
    // A path can never hold a NUL, so the separator alone tells a header from
    // a file name.
    if (line.includes("\0")) {
      const [sha, date, subject] = line.split("\0");
      header = { sha, date, subject };
      ofCommit = new Map();
      continue;
    }
    const id = changeOf(line);
    if (header === undefined || id === undefined) continue;
    const held = ofCommit.get(id);
    if (held) {
      held.paths.push(line);
      continue;
    }
    const commit: Commit = { ...header, paths: [line] };
    ofCommit.set(id, commit);
    commits.set(id, [...(commits.get(id) ?? []), commit]);
  }
  // Oldest first: a thread is read from the message that opened it.
  for (const list of commits.values()) list.reverse();
  return commits;
}

/** What one walk of the patches says: the classification's own patch per
 * commit and change, and when each change's questions were asked. */
type Patches = {
  patch: Map<string, string>;
  askedAt: Map<string, Record<string, string>>;
};

/**
 * The patch each commit made to one change's record and task list, and the
 * commit each of its `Q<n>` rows arrived in.
 *
 * One walk over the three files for the whole store: the `+++ b/` header names
 * the path the hunks under it belong to, the way `read-landings.mts` reads its
 * ticks, so a commit's record and task list land under one key and read
 * exactly as one `git show` of both printed them. The decisions table is read
 * as it goes rather than kept: nothing classifies a commit by it, and what a
 * held row needs is one date.
 *
 * Newest first, so a row seen again in an older commit overwrites the date
 * already held: a question is dated by the commit that asked it and not by the
 * one that answered it.
 */
function patchesOf(root: string, at: string): Patches {
  const log = walkGit(
    root,
    [
      "log",
      "--format=%H%x00%cI",
      "-p",
      "--unified=0",
      at,
      "--",
      `${CHANGES}/*/.openspec.yaml`,
      `${CHANGES}/*/tasks.md`,
      `${CHANGES}/*/decisions.md`,
    ],
    "no thread will show a hand, a tick or a held row",
  );
  const askedAt = new Map<string, Record<string, string>>();
  if (log === undefined) return { patch: new Map(), askedAt };

  const held = new Map<string, string[]>();
  let sha = "";
  let when = "";
  let id: string | undefined;
  let decisions = false;
  for (const line of log.split("\n")) {
    if (line.includes("\0")) {
      [sha, when] = line.split("\0");
      id = undefined;
      decisions = false;
      continue;
    }
    if (line.startsWith("+++")) {
      const path = line.slice(4).trim();
      id = changeOf(path);
      decisions = path.endsWith("/decisions.md");
      continue;
    }
    if (id === undefined) continue;
    if (decisions) {
      const asked = ASKED_ROW.exec(line)?.[1];
      if (asked !== undefined) {
        askedAt.set(id, { ...askedAt.get(id), [asked]: when });
      }
      continue;
    }
    const key = keyOf(sha, id);
    const lines = held.get(key);
    if (lines) lines.push(line);
    else held.set(key, [line]);
  }
  return {
    patch: new Map([...held].map(([key, lines]) => [key, lines.join("\n")])),
    askedAt,
  };
}

/** What one commit was. The subject decides first, because a landing says so
 * itself; then the commit that brought the proposal; then the patch, for the
 * two things only a patch can say. */
function eventOf(commit: Commit, opened: boolean, patch: string): ThreadEvent {
  const { sha, date, subject } = commit;
  const base = { sha, date, subject };

  const landed = LANDED.exec(subject);
  if (landed) {
    return {
      ...base,
      kind: "landed",
      target: landed[1],
      ...(landed[3] ? { handle: landed[3] } : {}),
    };
  }
  const reread = READ_AGAIN.exec(subject);
  if (reread) return { ...base, kind: "read-again", target: reread[1] };
  if (opened) return { ...base, kind: "opened" };

  const hands = handsIn(patch);
  if (hands.length > 0) return { ...base, kind: "hand", hands };
  const ticked = tickedIn(patch);
  if (ticked.length > 0) return { ...base, kind: "tick", ticked };
  return { ...base, kind: "commit" };
}

/** The hands one commit's record wrote: an added entry under `hands:` and
 * under no other key, because `landed_by:` and `reviewed:` write the same
 * shape of line. A hunk with no line of its own above it carries the key in
 * its header; one that adds the whole block carries it as an added line. */
function handsIn(patch: string): { role: string; handle: string }[] {
  const hands: { role: string; handle: string }[] = [];
  let key: string | null = null;
  for (const line of patch.split("\n")) {
    const hunk = HUNK.exec(line);
    if (hunk) {
      key = KEY.exec(hunk[1].trim())?.[1] ?? null;
      continue;
    }
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    const added = line.slice(1);
    const opened = KEY.exec(added);
    if (opened) {
      key = opened[1];
      continue;
    }
    const entry = key === "hands" ? ENTRY.exec(added) : null;
    if (entry) hands.push({ role: entry[1], handle: entry[2] });
  }
  return hands;
}

/** The task ids one commit ticked: a box added checked, less the boxes it
 * took away checked. A reformat rewrites every ticked line and would
 * otherwise read as every task landing at once, which is the reading
 * `read-landings.mts` exists to avoid making twice. */
function tickedIn(patch: string): string[] {
  const added: string[] = [];
  const removed = new Set<string>();
  for (const line of patch.split("\n")) {
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    const sign = line[0];
    if (sign !== "+" && sign !== "-") continue;
    const id = TICKED.exec(line.slice(1).trim())?.[1];
    if (id === undefined) continue;
    if (sign === "+") added.push(id);
    else removed.add(id);
  }
  return added.filter((id) => !removed.has(id));
}
