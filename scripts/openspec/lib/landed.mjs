/**
 * What this run committed: `.round/landed`, one sha per line.
 *
 * The guard behind a re-read asks which paths the run pushed, and the range
 * the job started at answers wrongly: `plan:land` rebases the change's branch
 * on a moved `origin/main`, so every commit `main` gained while the round was
 * reading arrives in the checkout and reads as a path the re-read pushed. The
 * landing is the only thing that commits during a run, so it names its own
 * commits here and the guard reads those alone.
 *
 * Beside `.round/thread.txt`, which the round writes for the step that posts:
 * one workspace directory for what a run tells the job about itself, ignored
 * by git and never committed.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Where the file sits, root-relative — what a refusal names. */
export const LANDED = ".round/landed";

/** One sha appended, the directory made where the run has written nothing
 * yet. Every landing calls this once, so a run that lands three `reviewed:`
 * lines names three commits. */
export function appendLanded(root, sha) {
  const file = join(root, LANDED);
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${sha}\n`);
}

/** The shas the file names, in the order they were committed; empty where the
 * run wrote no file, which is what the guard's fallback reads. */
export function landedShas(root) {
  const file = join(root, LANDED);
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
