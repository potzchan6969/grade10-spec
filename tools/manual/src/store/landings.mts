import { execFileSync } from "node:child_process";

/**
 * When a change last landed something, which is what says it has stopped
 * moving.
 *
 * `lastMoved` cannot say it. It is the newest commit touching the change's
 * directory, and one repository-wide commit — a reformat, a migration, a bulk
 * rename — moves every change in the store at once and resets every board on
 * the same morning. A landing is narrower and is a thing somebody did: a task
 * ticked, a group claimed, or an artifact added. Each is a line or a file the
 * change's own history carries, so the history is what answers it.
 *
 * Two walks, because the two facts are two diffs. A tick and a claim are lines
 * of `tasks.md`, read from its patch; an artifact is a file, read from the
 * added paths under the change directory. The later of the two is the answer.
 *
 * Undefined is an answer, not a failure: a store that is not a git checkout, a
 * change no commit holds yet, and a depth-1 clone all give it, and a caller
 * shows no age rather than reading it as 0.
 */

/** A tick and a claim as `docs/governance/task-ownership.md` spells them. */
const TICK = /-\s*\[[xX]\]/;
const OWNER = /\(owner:\s*@?[A-Za-z0-9][A-Za-z0-9._-]*\)/;

/** The record is not an artifact: `thread:`, `reviewed:` and `landed_by:` are
 * what a round writes about a change, never a thing it landed. */
const RECORD = ".openspec.yaml";

export function readLandings(
  root: string,
  id: string,
  tasks: string | undefined,
  commit: string | null,
): string | undefined {
  const dir = `openspec/changes/${id}`;
  const at = commit ?? "HEAD";
  const dates = [
    // A change with no task list has no line to tick and no group to claim,
    // so the walk that would read them is not made.
    tasks === undefined ? undefined : newestTick(root, at, `${dir}/tasks.md`),
    newestArtifact(root, at, dir),
  ].filter((one): one is string => one !== undefined);
  // By the instant, not the text: `%cI` is rendered in each commit's own
  // timezone, so two offsets sort the wrong way round as strings.
  return dates.sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1);
}

/**
 * The newest commit whose patch on `tasks.md` ticked a task or claimed a
 * group — counted against what the same commit took away.
 *
 * The net is what makes it a landing. A reformat rewrites every ticked line
 * and every claimed heading, so the patch shows each of them added and removed
 * at once; counting the additions alone would read that one commit as every
 * change in the store landing together, which is the reading this reader
 * exists to replace. A tick taken back is a fall, not a landing, so it does
 * not count either.
 */
function newestTick(
  root: string,
  at: string,
  file: string,
): string | undefined {
  const log = walk(root, [
    "log",
    "--format=%H%x00%cI",
    "-p",
    "--unified=0",
    "--no-renames",
    at,
    "--",
    file,
  ]);
  if (log === undefined) return undefined;
  let date: string | undefined;
  let net = 0;
  const close = () => {
    if (date !== undefined && net > 0) return date;
    return undefined;
  };
  for (const line of log.split("\n")) {
    if (line.includes("\0")) {
      // Newest first, so the first commit whose net rose is the answer.
      const landed = close();
      if (landed !== undefined) return landed;
      date = line.split("\0")[1];
      net = 0;
      continue;
    }
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    const marks = TICK.test(line) || OWNER.test(line) ? 1 : 0;
    if (line.startsWith("+")) net += marks;
    else if (line.startsWith("-")) net -= marks;
  }
  return close();
}

/** The newest commit that added a file of the change, the record aside. */
function newestArtifact(
  root: string,
  at: string,
  dir: string,
): string | undefined {
  const log = walk(root, [
    "log",
    "--format=%H%x00%cI",
    "--diff-filter=A",
    "--name-status",
    "--no-renames",
    at,
    "--",
    dir,
  ]);
  if (log === undefined) return undefined;
  let date: string | undefined;
  for (const line of log.split("\n")) {
    if (line.includes("\0")) {
      date = line.split("\0")[1];
      continue;
    }
    const path = line.split("\t")[1];
    if (path === undefined || path.endsWith(RECORD)) continue;
    // Newest first, so the first added artifact dates the landing.
    if (date !== undefined) return date;
  }
  return undefined;
}

/** One walk, or nothing where git cannot make it. A store with no repository
 * and a change no commit holds are the same answer here: no history dates it,
 * which is not the same as a landing today. */
function walk(root: string, args: string[]): string | undefined {
  try {
    return execFileSync("git", ["-c", "core.quotePath=false", ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return undefined;
  }
}
