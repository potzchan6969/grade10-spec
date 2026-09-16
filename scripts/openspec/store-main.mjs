/**
 * The store's main, where `pnpm plan` records every claim and checkmark whatever
 * branch a clone is on: `origin/HEAD` where the clone recorded it, because which
 * branch a store calls main is the store's decision, else `origin/main`. The
 * preflights read plan state there rather than from the checkout.
 */

import { execFileSync } from "node:child_process";

/** Git's answer, trimmed, or null where git refused. */
export function git(root, args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Main's ref and the commit it points at, or null for a clone with no main.
 * Fetched first unless `fetch` is false, since a claim made a minute ago is
 * otherwise invisible. Best-effort — offline is not an error. PLAN_NO_FETCH=1
 * skips it.
 */
export function storeMain(root, { fetch = true } = {}) {
  const ref =
    git(root, ["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"])?.replace(
      /^refs\/remotes\//,
      "",
    ) ?? "origin/main";
  if (fetch && process.env.PLAN_NO_FETCH !== "1")
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

/** A store file as it stands at a commit, or null where that commit has none. */
export const textAt = (root, commit, path) =>
  git(root, ["show", `${commit}:${path}`]);
