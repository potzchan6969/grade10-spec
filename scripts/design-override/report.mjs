#!/usr/bin/env node
/*
 * The report on `main`: a comment for the designer on every pushed commit
 * that stops, with or without its `Design-Override:` line. Never blocks, never
 * reverts. Exits 2 when it cannot read the history or post a comment.
 *
 *   node report.mjs <before> <after>   GITHUB_REPOSITORY names the repository
 */
import { spawnSync } from "node:child_process";
import { evaluate, loadSettings } from "./evaluate.mjs";
import { commentBody, MARKER } from "./format.mjs";
import { git, isZero, refuseShallow } from "./git.mjs";

function gh(args, input) {
  const done = spawnSync("gh", args, { encoding: "utf8", input });
  if (done.status !== 0) {
    throw new Error(
      `gh ${args.join(" ")} failed: ${(done.stderr || done.error?.message || "").trim()}`,
    );
  }
  return done.stdout;
}

function alreadyTold(repo, sha) {
  const pages = gh([
    "api",
    "--paginate",
    "--slurp",
    `repos/${repo}/commits/${sha}/comments`,
  ]);
  return JSON.parse(pages)
    .flat()
    .some((comment) => comment.body.includes(MARKER));
}

function main([before, after]) {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!before || !after || !repo)
    throw new Error(
      "usage: GITHUB_REPOSITORY=<owner/repo> report.mjs <before> <after>",
    );
  refuseShallow();
  const settings = loadSettings();
  const range = isZero(before) ? [`${after}^!`] : [`${before}..${after}`];
  const shas = git(["rev-list", "--reverse", ...range])
    .split("\n")
    .filter(Boolean);
  for (const sha of shas) {
    const result = evaluate(settings, sha);
    if (result.stops.length === 0) continue;
    if (alreadyTold(repo, sha)) {
      console.log(`${sha.slice(0, 8)} already told`);
      continue;
    }
    const body = JSON.stringify({
      body: commentBody(result, settings.designers),
    });
    gh(
      [
        "api",
        "--method",
        "POST",
        `repos/${repo}/commits/${sha}/comments`,
        "--input",
        "-",
      ],
      body,
    );
    console.log(`${sha.slice(0, 8)} told`);
  }
}

try {
  main(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`Design Override report failed: ${error.message}\n`);
  process.exitCode = 2;
}
