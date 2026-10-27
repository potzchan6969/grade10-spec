import { execFileSync } from "node:child_process";
import { git, readBlobs, tryGit } from "../../manual/src/store/git.mts";
import type { MainState } from "./types.ts";

/**
 * One synchronous git call, or nothing where git cannot make it.
 *
 * The readers that walk the store's own history run at composition time and
 * lose dates and threads rather than pages when a walk is refused, so a
 * refusal is an answer here and not a failure — a store with no repository, a
 * depth-1 clone and a ref that does not resolve all give it.
 *
 * Said out loud once per root, because a board with no ages on it and a
 * thread with no rows in it are readings nobody would otherwise question, and
 * said with everything a reader needs to act: the call that refused, what the
 * store loses by it (`lost`), and what git itself said. Per root rather than
 * per process, so a second store is not silenced by the first one's answer.
 */
export function walkGit(
  root: string,
  args: string[],
  lost: string,
): string | undefined {
  try {
    return execFileSync("git", ["-c", "core.quotePath=false", ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 256 * 1024 * 1024,
    });
  } catch (cause) {
    warnUnwalked(root, args, lost, cause);
    return undefined;
  }
}

const unwalked = new Set<string>();

function warnUnwalked(
  root: string,
  args: string[],
  lost: string,
  cause: unknown,
): void {
  if (unwalked.has(root)) return;
  unwalked.add(root);
  const said = String((cause as { stderr?: string })?.stderr ?? "").trim();
  console.warn(
    `manual: \`git ${args[0]}\` in ${root} refused — ${lost}${said ? `: ${said}` : ""}`,
  );
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
