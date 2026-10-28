import { execFile, execFileSync, spawn } from "node:child_process";
import { promisify } from "node:util";
import type { CommitInfo, HistoryEvent } from "../api/types.ts";
import { refsOf } from "./history.mts";
import { DEFAULT_MANUAL_DIR, type Roots } from "./roots.mts";

const exec = promisify(execFile);

/** One history walk builds the whole path → last-commit map. Spawning git per
 * file turns a snapshot into thousands of processes. */
export type GitIndex = {
  head: string;
  commitOf: (storePath: string) => CommitInfo | undefined;
  /** Last commit touching any file under a directory. */
  newestUnder: (storeDir: string) => CommitInfo | undefined;
  /** The newest commits of the same walk, newest first — the recent feed. */
  history: HistoryEvent[];
  /** Files as they stood at a revision, keyed by the `<sha>:<path>` asked
   * for; a path that revision does not carry is absent from the map. One
   * process serves the whole request, for the same reason. */
  readBlobs: (refs: string[]) => Promise<Map<string, string>>;
  /** The newest commit that changed how often `needle` occurs in `path` —
   * the one that wrote a record line holding it. Nothing where the history
   * holds none, or where there is no history to walk. */
  writerOf?: (path: string, needle: string) => string | undefined;
  /** Files as one commit holds them, keyed by path, in one call; a path the
   * commit holds no file at is absent. */
  filesAt?: (sha: string, paths: string[]) => Map<string, string>;
};

export const NO_GIT: GitIndex = {
  head: "",
  commitOf: () => undefined,
  newestUnder: () => undefined,
  history: [],
  readBlobs: async () => new Map(),
};

/** Enough to read a few weeks of the store; the feed is a feed, not an
 * archive, and every event rides the snapshot. */
const HISTORY_LIMIT = 100;

// `<oid> <type> <size>`; anything else is `<ref> missing`, with no body.
const BLOB_HEADER = /^[0-9a-f]{40,64} (?:blob|tree|commit|tag) (\d+)$/;

/** What a call is given beyond its arguments: a deadline, and the environment
 * it runs in. A call that reaches the network is given both — nothing else
 * here needs either. */
export type GitRun = { timeout?: number; env?: NodeJS.ProcessEnv };

/** `core.quotePath=false` keeps a non-ASCII path readable — quoted, git
 * escapes it into bytes nothing here would match, and the file silently
 * loses its commit info. */
export async function git(
  root: string,
  args: string[],
  run: GitRun = {},
): Promise<string> {
  const { stdout } = await exec(
    "git",
    ["-c", "core.quotePath=false", ...args],
    { cwd: root, maxBuffer: 256 * 1024 * 1024, ...run },
  );
  return stdout;
}

/** The git view over both roots. One repository, one walk — exactly the index
 * a same-root store always had. Two repositories, one walk each, merged.
 * `storeDirs` is what the walk reads of the store beside the pages. */
export async function readRootsGitIndex(
  roots: Roots,
  storeDirs: string[] = STORE_DIRS,
): Promise<GitIndex> {
  if (roots.own) {
    return readGitIndex(
      roots.store,
      [...storeDirs, roots.manual],
      roots.manual,
    );
  }
  const [store, content] = await Promise.all([
    readGitIndex(roots.store, storeDirs, roots.manual),
    readGitIndex(roots.content, [roots.manual], roots.manual),
  ]);
  return mergeGitIndexes(store, content, roots.manual);
}

/** What the store contributes to the manual's walk: the references it
 * renders beside the pages. */
export const STORE_DIRS = ["docs/references"];

/**
 * Routes by the path itself: the manual's own directory lives in the content
 * repository, everything else in the store. The head is the store's — it stamps the
 * snapshot the same way whichever repository the manual sits in. A blob ref
 * pairs a commit with a path from the same repository (the stale check builds
 * them that way), so the path decides where to ask; a cross-repository ref
 * simply resolves to nothing, which its caller already treats as "moved".
 */
export function mergeGitIndexes(
  store: GitIndex,
  content: GitIndex,
  manual = DEFAULT_MANUAL_DIR,
): GitIndex {
  const side = (path: string) =>
    path === manual || path.startsWith(`${manual}/`) ? content : store;
  return {
    head: store.head,
    commitOf: (path) => side(path).commitOf(path),
    newestUnder: (dir) => side(dir).newestUnder(dir),
    history: [...store.history, ...content.history]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, HISTORY_LIMIT),
    writerOf: (path, needle) => side(path).writerOf?.(path, needle),
    filesAt: (sha, paths) => {
      // A side with no history holds none of its paths, as `showAt` once said
      // path by path; the other side still answers for its own.
      const ofSide = (index: GitIndex) => {
        const own = paths.filter((path) => side(path) === index);
        return own.length > 0 ? (index.filesAt?.(sha, own) ?? []) : [];
      };
      return new Map([...ofSide(store), ...ofSide(content)]);
    },
    readBlobs: async (refs) => {
      const ofSide = (index: GitIndex) =>
        refs.filter((ref) => side(ref.slice(ref.indexOf(":") + 1)) === index);
      const answered = await Promise.all([
        store.readBlobs(ofSide(store)),
        content.readBlobs(ofSide(content)),
      ]);
      return new Map(answered.flatMap((found) => [...found]));
    },
  };
}

export async function readGitIndex(
  root: string,
  paths: string[],
  manual = DEFAULT_MANUAL_DIR,
): Promise<GitIndex> {
  const head = (await git(root, ["rev-parse", "HEAD"])).trim();
  const log = await git(root, [
    "log",
    "--format=%H%x00%cI%x00%s",
    "--name-only",
    "--no-renames",
    "HEAD",
    "--",
    ...paths,
  ]);

  const commits = new Map<string, CommitInfo>();
  const dirs = new Map<string, CommitInfo>();
  const history: HistoryEvent[] = [];
  let headers = 0;
  let current: CommitInfo | undefined;
  let touched: string[] = [];

  // A commit that touched no listed file — a merge, mostly — is noise in a
  // feed of what changed.
  const closeEvent = () => {
    if (current && touched.length > 0 && history.length < HISTORY_LIMIT) {
      history.push({ ...current, refs: refsOf(touched, manual) });
    }
    touched = [];
  };

  for (const line of log.split("\n")) {
    if (line === "") continue;
    // A path can never hold a NUL, so the separator alone tells a header from
    // a file name — no pattern has to guess which it is looking at.
    if (line.includes("\0")) {
      closeEvent();
      const [sha, date, subject] = line.split("\0");
      headers += 1;
      current = { sha, date, subject };
      continue;
    }
    if (!current) continue;
    touched.push(line);
    // Newest first, so the first sighting of a path is its last commit.
    if (commits.has(line)) continue;
    commits.set(line, current);
    rollUp(dirs, line, current);
  }
  closeEvent();
  // Commit info is decoration, not content — a log this reader cannot parse
  // costs dates, not pages, so say it out loud and carry on.
  if (headers === 0 && log.trim() !== "") warnUnparsed(root);

  // A file at a commit never changes, and many changes read the same ones.
  const blobsAt = new Map<string, string | undefined>();
  return {
    head,
    commitOf: (storePath) => commits.get(storePath),
    newestUnder: (storeDir) => dirs.get(storeDir),
    history,
    readBlobs: (refs) => readBlobs(root, refs),
    writerOf: remembered(
      (path, needle) =>
        quietGit(root, [
          "log",
          "-1",
          "--format=%H",
          "-S",
          needle,
          head,
          "--",
          path,
        ])?.trim() || undefined,
    ),
    filesAt: (sha, paths) => {
      const refs = paths.map((path) => `${sha}:${path}`);
      const unread = [...new Set(refs.filter((ref) => !blobsAt.has(ref)))];
      if (unread.length > 0) {
        const blobs = blobsOf(catFileSync(root, unread), unread);
        for (const ref of unread) blobsAt.set(ref, blobs.get(ref));
      }
      return new Map(
        paths.flatMap((path, at) => {
          const text = blobsAt.get(refs[at]);
          return text === undefined ? [] : [[path, text]];
        }),
      );
    },
  };
}

/** Many changes ask who wrote the same line; each answer is fixed for the
 * index's life, so git is asked once. */
function remembered(
  read: (a: string, b: string) => string | undefined,
): (a: string, b: string) => string | undefined {
  const answers = new Map<string, string | undefined>();
  return (a, b) => {
    const key = `${a}\0${b}`;
    if (!answers.has(key)) answers.set(key, read(a, b));
    return answers.get(key);
  };
}

/** One synchronous git call whose refusal is an answer: a commit that holds
 * no such file, or a history too shallow to hold the commit. */
function quietGit(root: string, args: string[]): string | undefined {
  try {
    return execFileSync("git", ["-c", "core.quotePath=false", ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    });
  } catch {
    return undefined;
  }
}

/** A file's commit answers for every directory above it. The walk is
 * newest-first and a path sets all its ancestors at once, so an ancestor
 * already claimed was claimed by a newer commit — and so was everything above
 * it. */
function rollUp(
  dirs: Map<string, CommitInfo>,
  path: string,
  commit: CommitInfo,
): void {
  for (
    let cut = path.lastIndexOf("/");
    cut > 0;
    cut = path.lastIndexOf("/", cut - 1)
  ) {
    const dir = path.slice(0, cut);
    if (dirs.has(dir)) return;
    dirs.set(dir, commit);
  }
}

/** `cat-file --batch` answers in the order it was asked, and says nothing but
 * a header line for a ref it cannot resolve — so the reply is walked against
 * the request rather than searched. Sizes are bytes, which is why the buffer
 * is sliced before it is decoded. */
export async function readBlobs(
  root: string,
  refs: string[],
): Promise<Map<string, string>> {
  if (refs.length === 0) return new Map();
  return blobsOf(await catFile(root, refs), refs);
}

/** `catFile` for a caller that cannot wait. A ref git cannot resolve is a
 * header line, not a failure, so a throw here is git itself refusing. */
function catFileSync(root: string, refs: string[]): Buffer {
  return execFileSync(
    "git",
    ["-c", "core.quotePath=false", "cat-file", "--batch"],
    {
      cwd: root,
      input: `${refs.join("\n")}\n`,
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 256 * 1024 * 1024,
    },
  );
}

function blobsOf(out: Buffer, refs: string[]): Map<string, string> {
  const found = new Map<string, string>();
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

/** A git call whose empty answer is an answer — a ref that does not exist, a
 * tree with nothing in it, a directory that is not a repository — rather than
 * a reason to fail the build. */
export async function tryGit(
  root: string,
  args: string[],
  run: GitRun = {},
): Promise<string | null> {
  try {
    return await git(root, args, run);
  } catch {
    return null;
  }
}

const unparsed = new Set<string>();

function warnUnparsed(root: string): void {
  if (unparsed.has(root)) return;
  unparsed.add(root);
  console.warn(
    `manual: git log in ${root} named no commit this reader recognizes — pages will show no commit info`,
  );
}
