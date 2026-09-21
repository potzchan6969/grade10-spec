/**
 * What this run committed: `.round/landed`, one sha per line — and the one
 * reader of what a commit or a range of them touched.
 *
 * The guard behind a re-read asks which paths the run pushed, and the range
 * the job started at answers wrongly: `plan:land` rebases the change's branch
 * on a moved `origin/main`, so every commit `main` gained while the round was
 * reading arrives in the checkout and reads as a path the re-read pushed. The
 * landing is the only thing that commits during a run, so it names its own
 * commits here and the guard reads those and the ones `main` does not hold
 * yet.
 *
 * `changedPaths` is that reading, and the landing's own menu of what the
 * branch changed against `main`: one `git diff --name-only` in the store
 * rather than one beside each caller, since a second copy is what drifts the
 * day a path with a space in it arrives.
 *
 * Beside `.round/thread.txt`, which the round writes for the step that posts:
 * one workspace directory for what a run tells the job about itself, ignored
 * by git and never committed.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { git } from "../store-main.mjs";

/** Where the file sits, root-relative — what a refusal names. */
export const LANDED = ".round/landed";

/** The empty tree, git's own well-known object: what a commit with no parent
 * is read against, so one reader answers for every commit. */
const NOTHING = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

/** One sha appended, the directory made where the run has written nothing
 * yet. Every landing calls this once, so a run that lands three `reviewed:`
 * lines names three commits. */
export function appendLanded(root, sha) {
  const file = join(root, LANDED);
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${sha}\n`);
}

/** The shas the file names, in the order they were committed; empty where the
 * run wrote no file. */
export function landedShas(root) {
  const file = join(root, LANDED);
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

/** Every path that changed between two commits, in git's own order and each
 * once: `-z`, so a path with a space or a quote in it is one entry rather
 * than a line git decided to quote.
 *
 * A git that refused throws. There is no reading of a diff git would not
 * give: an empty answer is a range that changed nothing, and a refusal is
 * this reader broken — a sha the checkout does not hold, or no repository at
 * all — which a caller that took it for "nothing" would pass silently. */
export function changedPaths(root, base, after) {
  const listed = git(root, ["diff", "--name-only", "-z", base, after]);
  if (listed === null)
    throw new Error(`git diff ${base}..${after} refused in ${root}`);
  return listed.split("\0").filter(Boolean);
}

/** A commit's first parent, or `NOTHING` where it has none. `^@` names every
 * parent a commit has, which tells the two silences apart that `<sha>^` gives
 * as one: an empty answer is a commit with no parent, read against the empty
 * tree, and `null` is git refusing the sha at all. */
function parentOf(root, sha) {
  const parents = git(root, ["rev-parse", "--quiet", `${sha}^@`]);
  if (parents === null)
    throw new Error(`git rev-parse ${sha}^@ refused in ${root}`);
  return (
    parents
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)[0] ?? NOTHING
  );
}

/** Every path a named set of commits touched, each commit against its own
 * parent and each path once: what a run wrote, whatever else the checkout
 * gained while it ran. A path one commit wrote and the next took back is
 * still a path the run wrote, which is why this reads the commits rather
 * than their sum. */
export function commitPaths(root, shas) {
  const paths = new Set();
  for (const sha of shas) {
    for (const path of changedPaths(root, parentOf(root, sha), sha))
      paths.add(path);
  }
  return [...paths];
}
