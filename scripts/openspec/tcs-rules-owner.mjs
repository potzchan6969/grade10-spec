#!/usr/bin/env node
/*
 * The test-case rules change only by their owner's hand: the team map's
 * handle that `owns: [tcs-rules]`. Every other author's commit that changes
 * them is refused, by name.
 *
 *   pnpm run tcs:rules-owner                 commits on HEAD not on origin/main
 *   pnpm run tcs:rules-owner <base> <head>   commits in base..head
 *
 * The rules are the rulebook, the suite template and the `spec-to-tcs` skill,
 * as `lib/tcs-rules.mjs` lists them. A merge is not read: the commits it
 * brings in are.
 *
 * Exit 1 names every refused commit; exit 2 means the check could not run.
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isOwned } from "./lib/tcs-rules.mjs";
import { readTeamMap } from "./lib/team.mjs";

export { isOwned };

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function git(root, args) {
  const ran = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (ran.status !== 0)
    throw new Error(`git ${args.join(" ")} failed: ${ran.stderr.trim()}`);
  return ran.stdout;
}

const ZERO = /^0+$/;

/** Every commit in the range that changes an owned path and is not the
 * owner's: `{ sha, author, email, paths }`. */
export function refusedCommits(root, base, head) {
  const owners = new Set(
    Object.values(readTeamMap(root).handles)
      .filter((one) => (one.owns ?? []).includes("tcs-rules") && one.email)
      .map((one) => one.email),
  );
  const range = ZERO.test(base ?? "")
    ? `${head}~1..${head}`
    : `${base}..${head}`;
  const shas = git(root, ["rev-list", "--no-merges", range])
    .split("\n")
    .filter(Boolean);
  const refused = [];
  for (const sha of shas) {
    const [author, email] = git(root, [
      "show",
      "-s",
      "--format=%an%x00%ae",
      sha,
    ])
      .trim()
      .split("\0");
    if (owners.has(email.toLowerCase())) continue;
    const paths = git(root, [
      "diff-tree",
      "--no-commit-id",
      "--root",
      "-r",
      "--name-only",
      sha,
    ])
      .split("\n")
      .filter(Boolean)
      .filter(isOwned);
    if (paths.length) refused.push({ sha, author, email, paths });
  }
  return { owners: [...owners], refused };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const rootAt = args.indexOf("--root");
  const root = rootAt >= 0 ? resolve(args.splice(rootAt, 2)[1]) : HERE;
  const [base = "origin/main", head = "HEAD"] = args;
  try {
    const { owners, refused } = refusedCommits(root, base, head);
    if (owners.length === 0) {
      console.error(
        "tcs:rules-owner: no handle in docs/prds/team.yaml owns `tcs-rules`, so nobody may change the test-case rules - name their owner with `owns: [tcs-rules]`",
      );
      process.exit(1);
    }
    if (refused.length === 0) {
      console.log(
        "tcs:rules-owner: no commit changes the test-case rules but their owner's",
      );
      process.exit(0);
    }
    console.error(
      `tcs:rules-owner: the test-case rules change only by ${owners.join(", ")} (team.yaml's \`owns: [tcs-rules]\`):`,
    );
    for (const one of refused)
      console.error(
        `  ${one.sha.slice(0, 9)} by ${one.author} <${one.email}> changes ${one.paths.join(", ")}`,
      );
    console.error(
      "Take the change out of the commit and put it to the rules' owner instead. The conventions in tcs-conventions.md stay open to anyone.",
    );
    process.exit(1);
  } catch (error) {
    console.error(`tcs:rules-owner: ${error.message}`);
    process.exit(2);
  }
}
