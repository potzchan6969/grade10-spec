import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { CommitInfo } from "../api/types.ts";

const run = promisify(execFile);

/** One history walk builds the whole path → last-commit map. Spawning git per
 * file turns a snapshot into thousands of processes. */
export type GitIndex = {
  head: string;
  commitOf: (storePath: string) => CommitInfo | undefined;
};

export const NO_GIT: GitIndex = { head: "", commitOf: () => undefined };

// sha1 today, sha256 in a repo that has moved on.
const COMMIT_LINE = /^([0-9a-f]{40,64}) (\S+)$/;

/** `core.quotePath=false` keeps a non-ASCII path readable — quoted, git
 * escapes it into bytes nothing here would match, and the file silently
 * loses its commit info. */
export async function git(root: string, args: string[]): Promise<string> {
  const { stdout } = await run("git", ["-c", "core.quotePath=false", ...args], {
    cwd: root,
    maxBuffer: 256 * 1024 * 1024,
  });
  return stdout;
}

export async function readGitIndex(
  root: string,
  paths: string[],
): Promise<GitIndex> {
  const head = (await git(root, ["rev-parse", "HEAD"])).trim();
  const log = await git(root, [
    "log",
    "--format=%H %cI",
    "--name-only",
    "--no-renames",
    "HEAD",
    "--",
    ...paths,
  ]);

  const commits = new Map<string, CommitInfo>();
  let headers = 0;
  let current: CommitInfo | undefined;
  for (const line of log.split("\n")) {
    if (line === "") continue;
    const header = COMMIT_LINE.exec(line);
    if (header) {
      headers += 1;
      current = { sha: header[1], date: header[2] };
      continue;
    }
    // Newest first, so the first sighting of a path is its last commit.
    if (current && !commits.has(line)) commits.set(line, current);
  }
  // Commit info is decoration, not content — a log this reader cannot parse
  // costs dates, not pages, so say it out loud and carry on.
  if (headers === 0 && log.trim() !== "") warnUnparsed(root);

  return { head, commitOf: (storePath) => commits.get(storePath) };
}

let warned = false;

function warnUnparsed(root: string): void {
  if (warned) return;
  warned = true;
  console.warn(
    `manual: git log in ${root} named no commit this reader recognizes — pages will show no commit info`,
  );
}
