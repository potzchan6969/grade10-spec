/**
 * The store's main, where `pnpm plan` records every claim and checkmark whatever
 * branch a clone is on: `origin/HEAD` where the clone recorded it, because which
 * branch a store calls main is the store's decision, else `origin/main`. The
 * preflights read plan state there rather than from the checkout.
 */

import { execFileSync } from "node:child_process";

const run = (root, args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: Infinity,
    stdio: ["ignore", "pipe", "pipe"],
  });

/** Git's answer, trimmed, or null where git refused; a git that never ran
 * throws. */
export function git(root, args) {
  try {
    return run(root, args).trim();
  } catch (error) {
    if (typeof error.status !== "number") throw error;
    return null;
  }
}

/**
 * Main's ref and the commit it points at, or null for a clone with no main.
 * Fetched first unless `fetch` is false, since a claim made a minute ago is
 * otherwise invisible. Best-effort — offline is not an error. PLAN_NO_FETCH=1
 * skips it, for the preflights that read plan state and spare themselves a
 * network call.
 *
 * `fetch: "always"` ignores `PLAN_NO_FETCH`: a landing is not a landing on a
 * `main` it did not read, so `plan-land.mjs` passes this rather than the
 * plain `true` every preflight does.
 */
export function storeMain(root, { fetch = true } = {}) {
  const ref =
    git(root, ["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"])?.replace(
      /^refs\/remotes\//,
      "",
    ) ?? "origin/main";
  const skip =
    fetch === false ||
    (fetch !== "always" && process.env.PLAN_NO_FETCH === "1");
  if (!skip)
    git(root, [
      "fetch",
      "--quiet",
      "origin",
      `+refs/heads/${ref.replace(/^origin\//, "")}:refs/remotes/${ref}`,
    ]);
  const commit = git(root, [
    "rev-parse",
    "--verify",
    "--quiet",
    `${ref}^{commit}`,
  ]);
  return commit ? { ref, commit } : null;
}

/** A store file as it stands at a commit, or null where that commit has none
 * — and null for that reason alone: any other refusal throws with git's
 * words, since a file read as absent fails a check that should pass. */
/** Whether git's refusal to show a path at a commit means the commit holds no
 * such path; git names an unknown full sha the same way, hence the probe. */
export const absentAt = (root, commit, stderr) =>
  /does not exist in|exists on disk, but not in/.test(stderr) &&
  git(root, ["cat-file", "-e", `${commit}^{commit}`]) !== null;

export function textAt(root, commit, path) {
  try {
    return run(root, ["show", `${commit}:${path}`]);
  } catch (error) {
    const said = String(error.stderr ?? "");
    if (absentAt(root, commit, said)) return null;
    throw new Error(
      `git show ${commit}:${path} refused in ${root}: ${(said || error.message).trim()}`,
      { cause: error },
    );
  }
}
