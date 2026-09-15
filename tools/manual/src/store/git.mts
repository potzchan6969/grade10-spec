import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import type { CommitInfo, HistoryEvent, MainState } from "../api/types.ts";
import { refsOf } from "./history.mts";
import { DEFAULT_MANUAL_DIR, type Roots } from "./roots.mts";

const run = promisify(execFile);

/** One history walk builds the whole path → last-commit map. Spawning git per
 * file turns a snapshot into thousands of processes. */
export type GitIndex = {
  head: string;
  commitOf: (storePath: string) => CommitInfo | undefined;
  /** Last commit touching any file under a directory. A change moves when any
   * of its files does — a plan with no tasks.md still moves. */
  newestUnder: (storeDir: string) => CommitInfo | undefined;
  /** The newest commits of the same walk, newest first — the recent feed. */
  history: HistoryEvent[];
  /** Files as they stood at a revision, keyed by the `<sha>:<path>` asked
   * for; a path that revision does not carry is absent from the map. One
   * process serves the whole request, for the same reason. */
  readBlobs: (refs: string[]) => Promise<Map<string, string>>;
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

/** The git view over both roots. One repository, one walk — exactly the index
 * a same-root store always had. Two repositories, one walk each, merged. */
export async function readRootsGitIndex(roots: Roots): Promise<GitIndex> {
  if (roots.own) {
    return readGitIndex(
      roots.store,
      [...STORE_DIRS, roots.manual],
      roots.manual,
    );
  }
  const [store, content] = await Promise.all([
    readGitIndex(roots.store, STORE_DIRS, roots.manual),
    readGitIndex(roots.content, [roots.manual], roots.manual),
  ]);
  return mergeGitIndexes(store, content, roots.manual);
}

/** What the store contributes to the walk: the specs and changes, and the
 * references the manual renders beside them. */
export const STORE_DIRS = ["openspec", "docs/references"];

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

  return {
    head,
    commitOf: (storePath) => commits.get(storePath),
    newestUnder: (storeDir) => dirs.get(storeDir),
    history,
    readBlobs: (refs) => readBlobs(root, refs),
  };
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

/** A git call whose empty answer is an answer — a ref that does not exist, a
 * tree with nothing in it — rather than a reason to fail the build. */
async function tryGit(root: string, args: string[]): Promise<string | null> {
  try {
    return await git(root, args);
  } catch {
    return null;
  }
}

/**
 * The store's main, where `pnpm plan` records every claim and checkmark:
 * `origin/HEAD` where the clone recorded it, because which branch a store
 * calls main is the store's decision, else `origin/main`. Read from the refs
 * the clone already has; a build never fetches. Throws where neither
 * resolves, since the checkout's own branch would show claims main never had.
 */
export async function resolveMain(
  root: string,
): Promise<{ ref: string; commit: string }> {
  const head = (
    await tryGit(root, ["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"])
  )?.trim();
  const ref = head ? head.replace(/^refs\/remotes\//, "") : "origin/main";
  const commit = (
    await tryGit(root, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`])
  )?.trim();
  if (!commit) {
    throw new Error(
      `${root} has no ${ref}: claims and checkmarks are read on the store's main — run \`git remote set-head origin --auto\` in the store`,
    );
  }
  return { ref, commit };
}

const CHANGES_DIR = "openspec/changes";
const CHANGE_FILE = /^openspec\/changes\/([^/]+)\/(.+)$/;

/** The store's main as the board reads it. */
export type StoreMain = {
  ref: string;
  commit: string;
  /** Changes in development on main; the archive is not one of them. */
  changes: Set<string>;
  /** Each change's `tasks.md` on main, where it has one. */
  tasks: Map<string, string>;
  /** Files of each change whose checkout copy differs from main. `tasks.md`
   * counts only where main has none, because every claim and checkmark moves
   * it on main. */
  differing: Map<string, number>;
};

export async function readMain(root: string): Promise<StoreMain> {
  const { ref, commit } = await resolveMain(root);
  const [listed, diffed, untracked] = await Promise.all([
    // A main with no changes directory has no changes, not a failure.
    tryGit(root, ["ls-tree", "-d", "--name-only", `${commit}:${CHANGES_DIR}`]),
    git(root, [
      "diff",
      "--name-only",
      "--no-renames",
      commit,
      "--",
      CHANGES_DIR,
    ]),
    git(root, [
      "ls-files",
      "--others",
      "--exclude-standard",
      "--",
      CHANGES_DIR,
    ]),
  ]);
  const changes = new Set(
    (listed ?? "")
      .split("\n")
      .filter((name) => name !== "" && name !== "archive"),
  );

  const tasksRef = (id: string) => `${commit}:${CHANGES_DIR}/${id}/tasks.md`;
  const blobs = await readBlobs(root, [...changes].map(tasksRef));
  const tasks = new Map<string, string>();
  for (const id of changes) {
    const text = blobs.get(tasksRef(id));
    if (text !== undefined) tasks.set(id, text);
  }

  const differing = new Map<string, number>();
  for (const file of `${diffed}\n${untracked}`.split("\n")) {
    const [, id, rest] = CHANGE_FILE.exec(file) ?? [];
    if (!id || id === "archive" || (rest === "tasks.md" && tasks.has(id)))
      continue;
    differing.set(id, (differing.get(id) ?? 0) + 1);
  }

  return { ref, commit, changes, tasks, differing };
}

/** A change main does not hold cannot be claimed, and a checkout copy that
 * differs from main is not the settled brief. */
export function mainStateOf(
  main: StoreMain,
  id: string,
): MainState | undefined {
  if (!main.changes.has(id)) return { state: "unmerged", ref: main.ref };
  const files = main.differing.get(id);
  return files ? { state: "diverged", ref: main.ref, files } : undefined;
}

let warned = false;

function warnUnparsed(root: string): void {
  if (warned) return;
  warned = true;
  console.warn(
    `manual: git log in ${root} named no commit this reader recognizes — pages will show no commit info`,
  );
}
