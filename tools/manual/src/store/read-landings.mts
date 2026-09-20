import { execFileSync } from "node:child_process";

/**
 * When each change last landed something, which is what says it has stopped
 * moving.
 *
 * `lastMoved` cannot say it. It is the newest commit touching the change's
 * directory, and one repository-wide commit — a reformat, a migration, a bulk
 * rename — moves every change in the store at once and resets every board on
 * the same morning. A landing is narrower and is a thing somebody did: a task
 * ticked, a group claimed, or an artifact added. Each is a line or a file the
 * history carries, so the history is what answers it.
 *
 * Two walks for the whole store, not two per change. The two facts are two
 * diffs — a tick and a claim are lines of a `tasks.md`, read from its patch;
 * an artifact is a file, read from the added paths — and each walk reads every
 * change's in one pass, keyed by the change id in the path. A store of a
 * hundred changes costs two git processes rather than two hundred.
 *
 * A change the walks never name is not in the map, which is an answer and not
 * a failure: a store that is not a git checkout, a change no commit holds yet,
 * and a depth-1 clone all give it, and a caller shows no age rather than
 * reading it as 0.
 */

/** A tick and a claim as `docs/governance/task-ownership.md` spells them. */
const TICK = /-\s*\[[xX]\]/;
const OWNER = /\(owner:\s*@?[A-Za-z0-9][A-Za-z0-9._-]*\)/;

/** The change a store path belongs to. The walks are given a pathspec under
 * the store's own `openspec/changes`, but the paths git prints are relative to
 * the repository root — a store inside a checkout, like the demo store, is
 * read by the same pattern as one at the root. */
const CHANGE_OF = /(?:^|\/)openspec\/changes\/([^/]+)\//;

/** The record is not an artifact: `thread:`, `reviewed:` and `landed_by:` are
 * what a round writes about a change, never a thing it landed. */
const RECORD = ".openspec.yaml";

/** The archive is not in flight, and nothing dates a finished change. */
const ARCHIVE = "archive";

export function readLandings(
  root: string,
  commit: string | null,
): Map<string, string> {
  const at = commit ?? "HEAD";
  const landed = new Map<string, string>();
  // By the instant, not the text: `%cI` is rendered in each commit's own
  // timezone, so two offsets sort the wrong way round as strings.
  const date = (id: string, when: string) => {
    const held = landed.get(id);
    if (held === undefined || Date.parse(when) > Date.parse(held)) {
      landed.set(id, when);
    }
  };
  newestTicks(root, at, date);
  newestArtifacts(root, at, date);
  return landed;
}

/**
 * Every change's newest commit whose patch on its `tasks.md` ticked a task or
 * claimed a group — counted against what the same commit took away.
 *
 * The net is what makes it a landing. A reformat rewrites every ticked line
 * and every claimed heading, so the patch shows each of them added and removed
 * at once; counting the additions alone would read that one commit as every
 * change in the store landing together, which is the reading this reader
 * exists to replace. A tick taken back is a fall, not a landing, so it does
 * not count either.
 *
 * One patch walk over every task list, keyed by the `+++ b/` header — the path
 * the hunks under it belong to. `--follow` would carry a renamed file's own
 * history, but it takes one pathspec and this walk takes them all, so renames
 * are detected with `-M` instead: a rename on its own changes no line, so it
 * ticks nothing and lands nothing.
 */
function newestTicks(
  root: string,
  at: string,
  date: (id: string, when: string) => void,
): void {
  const log = walk(root, [
    "log",
    "--format=%H%x00%cI",
    "-p",
    "--unified=0",
    "-M",
    at,
    "--",
    "openspec/changes/*/tasks.md",
  ]);
  if (log === undefined) return;
  let when: string | undefined;
  let id: string | undefined;
  /** Per change of this commit: the ticks and claims added, less those taken
   * away. Newest first, so the first commit whose net rose is the answer. */
  let net = new Map<string, number>();
  const close = () => {
    if (when === undefined) return;
    for (const [change, count] of net) if (count > 0) date(change, when);
  };
  for (const line of log.split("\n")) {
    if (line.includes("\0")) {
      close();
      when = line.split("\0")[1];
      id = undefined;
      net = new Map();
      continue;
    }
    if (line.startsWith("+++")) {
      id = changeOf(line.slice(4).trim());
      continue;
    }
    if (line.startsWith("---") || id === undefined) continue;
    const marks = TICK.test(line) || OWNER.test(line) ? 1 : 0;
    if (marks === 0) continue;
    if (line.startsWith("+")) net.set(id, (net.get(id) ?? 0) + marks);
    else if (line.startsWith("-")) net.set(id, (net.get(id) ?? 0) - marks);
  }
  close();
}

/** Every change's newest commit that added a file of it, the record aside. A
 * renamed file is not an added one — `-M` is what tells them apart, and an `R`
 * entry is a file that was already there. */
function newestArtifacts(
  root: string,
  at: string,
  date: (id: string, when: string) => void,
): void {
  const log = walk(root, [
    "log",
    "--format=%H%x00%cI",
    "--name-status",
    "-M",
    "--diff-filter=A",
    at,
    "--",
    "openspec/changes",
  ]);
  if (log === undefined) return;
  let when: string | undefined;
  for (const line of log.split("\n")) {
    if (line.includes("\0")) {
      when = line.split("\0")[1];
      continue;
    }
    const [status, path] = line.split("\t");
    if (when === undefined || path === undefined) continue;
    if (status.startsWith("R") || path.endsWith(RECORD)) continue;
    const id = changeOf(path);
    if (id !== undefined) date(id, when);
  }
}

/** The change a path names, or nothing for a path outside a change directory
 * and for the archive, which holds no change still in flight. Exported: the
 * thread's own walks key their commits by the same pattern, and two readings
 * of one path shape would drift the day the archive moves. */
export function changeOf(path: string): string | undefined {
  const id = CHANGE_OF.exec(path)?.[1];
  return id === ARCHIVE ? undefined : id;
}

/** One walk, or nothing where git cannot make it. A store with no repository
 * and a store no commit holds are the same answer here: no history dates
 * anything, which is not the same as every change landing today. A failure is
 * said out loud once, because a board with no ages on it is a reading nobody
 * would otherwise question. */
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
    `manual: git log in ${root} would not walk the changes — no change will show an age`,
  );
}
