#!/usr/bin/env node
/**
 * Put the commits ahead of `origin/main` onto `main`:
 *
 *   pnpm push:main            rebase, gate, push to main (or open a PR)
 *   pnpm push:main --pr       always through a pull request
 *   pnpm push:main --dry-run  rebase and gate, push nothing
 *
 * 1. refuse a dirty tree or nothing to push
 * 2. fetch and rebase onto origin/main; a conflict aborts the rebase and names
 *    the files, so the tree is exactly as it was
 * 3. route by path (`paths.mjs`): planning text goes straight to `main`, a
 *    shared surface goes through a pull request that merges itself once green
 * 4. run the fast gate (`gate.mjs`) on what the push sends
 * 5. push; `main` moving under the push is a fetch, rebase and gate again,
 *    three times at most
 *
 * Exit 0 pushed (or dry run passed), 1 the gate failed, 2 refused or a
 * conflict, 3 the push kept losing its race.
 */

import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { changedPaths, runGate } from "./gate.mjs";
import { changesOf, classify } from "./paths.mjs";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ATTEMPTS = 3;
const args = new Set(process.argv.slice(2));
const forcePr = args.has("--pr");
const dryRun = args.has("--dry-run");

function git(argv, { allowFail = false, env } = {}) {
  const ran = spawnSync("git", argv, {
    cwd: ROOT,
    encoding: "utf8",
    env: env ? { ...process.env, ...env } : process.env,
  });
  if (ran.status !== 0 && !allowFail) {
    stop(2, `git ${argv.join(" ")} failed:\n${ran.stderr.trim()}`);
  }
  return ran;
}

function stop(code, message) {
  console.error(`push:main: ${message}`);
  process.exit(code);
}

function rebase() {
  git(["fetch", "--quiet", "origin", "main"]);
  const ran = git(["rebase", "origin/main"], { allowFail: true });
  if (ran.status === 0) return;
  const conflicted = git(["diff", "--name-only", "--diff-filter=U"], {
    allowFail: true,
  }).stdout.trim();
  git(["rebase", "--abort"], { allowFail: true });
  stop(
    2,
    `rebasing onto origin/main conflicts; the rebase was aborted and nothing moved.\n${conflicted || ran.stderr.trim()}\nResolve as /spec-push describes, then run this again.`,
  );
}

function gate() {
  const paths = changedPaths("origin/main");
  const { route, shared, checks } = classify(paths);
  const changes = changesOf(paths);
  console.error(
    `push:main: ${paths.length} path(s)${changes.length ? `, change(s) ${changes.join(", ")}` : ""}; ${checks.length} check(s)`,
  );
  const failed = runGate(paths);
  if (failed.length) stop(1, `gate failed: ${failed.join(", ")}`);
  return { route: forcePr ? "pr" : route, shared };
}

function pushMain() {
  const head = git(["rev-parse", "HEAD"]).stdout.trim();
  const ran = git(["push", "origin", "HEAD:refs/heads/main"], {
    allowFail: true,
    env: { PUSH_MAIN_GATED: head },
  });
  if (ran.status === 0) return { ok: true, head };
  if (/\[rejected\]|non-fast-forward|fetch first/.test(ran.stderr)) {
    return { ok: false };
  }
  stop(2, `push refused:\n${ran.stderr.trim()}`);
}

function openPr(shared) {
  let branch = git(["branch", "--show-current"]).stdout.trim();
  if (!branch || branch === "main") {
    branch = `push/${git(["rev-parse", "--short", "HEAD"]).stdout.trim()}`;
    git(["switch", "-c", branch]);
  }
  git([
    "push",
    "--force-with-lease",
    "-u",
    "origin",
    `HEAD:refs/heads/${branch}`,
  ]);
  console.error(
    `push:main: shared surface (${shared.slice(0, 5).join(", ")}${shared.length > 5 ? ", …" : ""}) goes through a pull request`,
  );
  const gh = (argv) => spawnSync("gh", argv, { cwd: ROOT, encoding: "utf8" });
  const existing = gh(["pr", "view", branch, "--json", "url", "-q", ".url"]);
  const created =
    existing.status === 0
      ? existing
      : gh(["pr", "create", "--fill", "--head", branch, "--base", "main"]);
  if (created.status !== 0) {
    console.error(
      `push:main: branch ${branch} pushed; open its pull request by hand and turn on auto-merge (gh is unavailable here: ${created.stderr.trim()})`,
    );
    return;
  }
  const url = created.stdout.trim().split("\n").pop();
  const merge = gh(["pr", "merge", url, "--auto", "--merge"]);
  console.error(
    merge.status === 0
      ? `push:main: ${url} merges itself once its checks pass`
      : `push:main: ${url} opened; auto-merge refused (${merge.stderr.trim()}), merge it when green`,
  );
}

if (git(["status", "--porcelain", "--untracked-files=no"]).stdout.trim()) {
  stop(2, "the tree has uncommitted changes: commit them first");
}
git(["fetch", "--quiet", "origin", "main"]);
if (
  !git(["rev-list", "--count", "origin/main..HEAD"])
    .stdout.trim()
    .match(/^[1-9]/)
) {
  stop(2, "nothing ahead of origin/main to push");
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  rebase();
  const { route, shared } = gate();
  if (dryRun) {
    console.error(
      `push:main: dry run, would go to ${route === "pr" ? "a pull request" : "main"}`,
    );
    process.exit(0);
  }
  if (route === "pr") {
    openPr(shared);
    process.exit(0);
  }
  const pushed = pushMain();
  if (pushed.ok) {
    console.error(`push:main: main is now ${pushed.head.slice(0, 9)}`);
    process.exit(0);
  }
  console.error("push:main: main moved under the push; reading it again");
}
stop(3, `main kept moving: lost the race ${ATTEMPTS} times, nothing pushed`);
