import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import type { CommitInfo } from "../api/types.ts";

const run = promisify(execFile);

/** One history walk builds the whole path → last-commit map. Spawning git per
 * file turns a snapshot into thousands of processes. */
export type GitIndex = {
  head: string;
  commitOf: (storePath: string) => CommitInfo | undefined;
  /** Files as they stood at a revision, keyed by the `<sha>:<path>` asked
   * for; a path that revision does not carry is absent from the map. One
   * process serves the whole request, for the same reason. */
  readBlobs: (refs: string[]) => Promise<Map<string, string>>;
};

export const NO_GIT: GitIndex = {
  head: "",
  commitOf: () => undefined,
  readBlobs: async () => new Map(),
};

// sha1 today, sha256 in a repo that has moved on.
const COMMIT_LINE = /^([0-9a-f]{40,64}) (\S+)$/;
// `<oid> <type> <size>`; anything else is `<ref> missing`, with no body.
const BLOB_HEADER = /^[0-9a-f]{40,64} (?:blob|tree|commit|tag) (\d+)$/;

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

  return {
    head,
    commitOf: (storePath) => commits.get(storePath),
    readBlobs: (refs) => readBlobs(root, refs),
  };
}

/** `cat-file --batch` answers in the order it was asked, and says nothing but
 * a header line for a ref it cannot resolve — so the reply is walked against
 * the request rather than searched. Sizes are bytes, which is why the buffer
 * is sliced before it is decoded. */
async function readBlobs(
  root: string,
  refs: string[],
): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  if (refs.length === 0) return found;

  const out = await catFile(root, refs);
  let offset = 0;
  for (const ref of refs) {
    const end = out.indexOf(0x0a, offset);
    if (end === -1) break;
    const size = BLOB_HEADER.exec(out.toString("utf8", offset, end))?.[1];
    offset = end + 1;
    if (size === undefined) continue;
    found.set(ref, out.toString("utf8", offset, offset + Number(size)));
    offset += Number(size) + 1;
  }
  return found;
}

function catFile(root: string, refs: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "git",
      ["-c", "core.quotePath=false", "cat-file", "--batch"],
      { cwd: root },
    );
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => out.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => err.push(chunk));
    child.on("error", reject);
    child.stdin.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve(Buffer.concat(out));
      reject(
        new Error(
          `git cat-file in ${root} exited ${code}: ${Buffer.concat(err).toString("utf8").trim()}`,
        ),
      );
    });
    child.stdin.end(`${refs.join("\n")}\n`);
  });
}

let warned = false;

function warnUnparsed(root: string): void {
  if (warned) return;
  warned = true;
  console.warn(
    `manual: git log in ${root} named no commit this reader recognizes — pages will show no commit info`,
  );
}
