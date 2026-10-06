#!/usr/bin/env node
/**
 * The pre-push half of landing on `main`, for each ref a push sends there:
 *
 * - a commit a gated tool already checked passes: `PUSH_MAIN_GATED` names it;
 * - a shared surface refuses: `pnpm push:main` sends it through a pull request
 *   that merges itself once green, and `PUSH_MAIN_SHARED=1` lets one through
 *   on purpose;
 * - anything else runs the fast gate, which reads the working tree, so only a
 *   clean `HEAD` can be pushed this way.
 *
 * Reads git's pre-push lines on stdin. Exit 1 refused, 2 could not run.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runGate } from "./gate.mjs";
import { classify } from "./paths.mjs";

const MAIN = "refs/heads/main";
const isZero = (sha) => !sha || /^0+$/.test(sha);

/**
 * `{ refusals, paths }` for the pushed lines: what refuses, and the paths the
 * gate checks for what does not. `pathsOf(remote, local)` is null when the
 * remote tip is not here, which the remote refuses as a non-fast-forward.
 */
export function review(lines, { gated, allowShared, head, clean, pathsOf }) {
  const refusals = [];
  const paths = new Set();
  for (const line of lines) {
    const [, local, remoteRef, remote] = line.trim().split(/\s+/);
    if (remoteRef !== MAIN || isZero(local) || local === gated) continue;
    const sent = isZero(remote) ? null : pathsOf(remote, local);
    if (!sent?.length) continue;
    const { route, shared } = classify(sent);
    if (route === "pr" && !allowShared) {
      refusals.push(
        `a shared surface goes through a pull request, not straight to main:\n${shared.map((path) => `  ${path}`).join("\n")}\nRun \`pnpm push:main\`, which opens one that merges itself once green.`,
      );
      continue;
    }
    if (local !== head || !clean) {
      refusals.push(
        `the gate reads the working tree, so it checks only a clean HEAD pushed to main: commit or stash, check out ${local.slice(0, 9)}, or run \`pnpm push:main\``,
      );
      continue;
    }
    for (const path of sent) paths.add(path);
  }
  return { refusals, paths: [...paths] };
}

function git(args) {
  return spawnSync("git", args, { encoding: "utf8" });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const { refusals, paths } = review(
      readFileSync(0, "utf8").split("\n").filter(Boolean),
      {
        gated: process.env.PUSH_MAIN_GATED,
        allowShared: process.env.PUSH_MAIN_SHARED === "1",
        head: git(["rev-parse", "HEAD"]).stdout.trim(),
        clean: !git([
          "status",
          "--porcelain",
          "--untracked-files=no",
        ]).stdout.trim(),
        pathsOf: (remote, local) => {
          if (git(["cat-file", "-e", `${remote}^{commit}`]).status !== 0)
            return null;
          const ran = git(["diff", "--name-only", remote, local]);
          if (ran.status !== 0) throw new Error(ran.stderr.trim());
          return ran.stdout.split("\n").filter(Boolean);
        },
      },
    );
    for (const refusal of refusals) console.error(`push to main: ${refusal}`);
    if (refusals.length) process.exit(1);
    if (!paths.length) process.exit(0);
    console.error(`push to main: gating ${paths.length} path(s)`);
    const failed = runGate(paths);
    if (failed.length) {
      console.error(
        `push to main: ${failed.join(", ")} failed, nothing pushed`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`push to main: ${error.message}`);
    process.exit(2);
  }
}
