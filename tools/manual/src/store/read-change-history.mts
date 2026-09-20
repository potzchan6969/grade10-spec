import { execFileSync } from "node:child_process";
import type { ThreadEvent } from "../api/types.ts";

/**
 * A change's own history on `main`, read as its thread tells it.
 *
 * The Slack thread carries the same events as replies — the change opened, a
 * draft landed, an artifact read again, a hand named, a group ticked — and
 * every one of them is a commit of the change's directory. So the commits are
 * what the mirror is read from: nothing is stored, and a store that is not a
 * checkout shows no thread rather than an empty one.
 *
 * One walk per change, and one extra call only for the commits that touch the
 * two files whose own patch says what happened: `hands:` is a line of the
 * record and a tick is a line of `tasks.md`, and neither can be told from a
 * subject. Everything else is classified by the subject `plan:land` writes or
 * kept as the subject it carries — a commit nobody can name is still a thing
 * that happened, and dropping it would leave a gap in the thread.
 *
 * Read on `main`, the way every other reader of the store's history is: the
 * checkout the manual runs out of is ahead of `main` while a round drafts, and
 * a thread showing those commits would say the change had landed things nobody
 * else can see.
 *
 * A depth-1 checkout gives one event, which is honest: the history is not
 * there to be read.
 */

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

/** `commit` is the store's `main`, where the thread is read: a checkout
 * drafting a round sits ahead of it, and those commits are not in the thread
 * yet. `null` reads `HEAD`, which is a store whose `main` does not resolve. */
export function readChangeHistory(
  root: string,
  dir: string,
  commit: string | null,
): ThreadEvent[] {
  const log = walk(root, [
    "log",
    "--format=%H%x00%cI%x00%s",
    "--name-only",
    "--no-renames",
    commit ?? "HEAD",
    "--",
    dir,
  ]);
  if (log === undefined) return [];

  const commits: Commit[] = [];
  for (const line of log.split("\n")) {
    if (line === "") continue;
    // A path can never hold a NUL, so the separator alone tells a header from
    // a file name.
    if (line.includes("\0")) {
      const [sha, date, subject] = line.split("\0");
      commits.push({ sha, date, subject, paths: [] });
      continue;
    }
    commits.at(-1)?.paths.push(line);
  }
  // Oldest first: a thread is read from the message that opened it.
  commits.reverse();

  const opened = commits.find((commit) =>
    commit.paths.some((path) => path.endsWith("/proposal.md")),
  );
  return commits.map((commit) => eventOf(root, dir, commit, commit === opened));
}

type Commit = {
  sha: string;
  date: string;
  subject: string;
  paths: string[];
};

/** What one commit was. The subject decides first, because a landing says so
 * itself; then the commit that brought the proposal; then the patch, for the
 * two things only a patch can say. */
function eventOf(
  root: string,
  dir: string,
  commit: Commit,
  opened: boolean,
): ThreadEvent {
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

  const record = commit.paths.some((path) => path.endsWith("/.openspec.yaml"));
  const tasks = commit.paths.some((path) => path.endsWith("/tasks.md"));
  if (!record && !tasks) return { ...base, kind: "commit" };

  const patch = patchOf(root, sha, [
    ...(record ? [`${dir}/.openspec.yaml`] : []),
    ...(tasks ? [`${dir}/tasks.md`] : []),
  ]);
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

/** One patch, or nothing: the classification loses a hand and a tick, never a
 * row — the commit is in the thread either way. */
function patchOf(root: string, sha: string, paths: string[]): string {
  return (
    walk(root, ["show", "--unified=0", "--no-color", sha, "--", ...paths]) ?? ""
  );
}

/** One git call, or nothing where git cannot make it. A store with no
 * repository and a change no commit holds are the same answer: no history
 * tells this change's thread, which is not the same as nothing happening. */
function walk(root: string, args: string[]): string | undefined {
  try {
    return execFileSync("git", ["-c", "core.quotePath=false", ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    });
  } catch {
    warnUnwalked(root);
    return undefined;
  }
}

let warned = false;

function warnUnwalked(root: string): void {
  if (warned) return;
  warned = true;
  console.warn(
    `manual: git log in ${root} would not walk a change's own history — no change will show its thread`,
  );
}
