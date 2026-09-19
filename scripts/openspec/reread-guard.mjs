#!/usr/bin/env node
/**
 * Fails on a path a re-read pushed outside what it may write.
 *
 * A re-read edits one change's artifacts and the pages its proposal links —
 * `lib/writable.mjs` is that boundary, and `reread-settings.mjs` denies the
 * rest to the agent. This is the repository's own limit rather than the
 * agent's: it reads the paths of the commits this run made and fails loudly
 * rather than reverting quietly when one of them touched a path the round has
 * no business in — a page the proposal never linked included, which the
 * settings leave open because `docs/prds/` is where the pages it may mark
 * live.
 *
 *   node scripts/openspec/reread-guard.mjs <change> --before <sha> [--root <dir>]
 *
 * The commits this run made are the ones `plan:land` named in `.round/landed`
 * as it committed them. The range `<before>..HEAD` is not those: the landing
 * rebases the change's branch on a moved `origin/main`, so every commit
 * `main` gained while the round was reading arrives in the job's checkout and
 * would read as a path the re-read pushed. `--before` is the fallback for a
 * run that committed nothing through the landing, and the guard says which of
 * the two it read.
 */
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import { LANDED, landedShas } from "./lib/landed.mjs";
import { isWritable, writableBy } from "./lib/writable.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** What a workflow log reads as an annotation: every refusal here opens with
 * it, the usage refusal the parser prints included. */
const ERROR = "::error::";
const USAGE =
  "usage: node reread-guard.mjs <change> --before <sha> [--root <dir>]";

/** Every path a range of commits touched, oldest first. */
export function pushedPaths(root, before, after) {
  const stdout = execFileSync(
    "git",
    ["diff", "--name-only", "-z", before, after],
    { cwd: root, encoding: "utf8" },
  );
  return stdout.split("\0").filter(Boolean);
}

/** Every path a named set of commits touched, each commit against its own
 * parent and each path once: what this run wrote, whatever else the checkout
 * gained while it ran. */
export function commitPaths(root, shas) {
  const paths = new Set();
  for (const sha of shas) {
    const stdout = execFileSync(
      "git",
      ["diff-tree", "--no-commit-id", "--name-only", "-r", "-z", sha],
      { cwd: root, encoding: "utf8" },
    );
    for (const path of stdout.split("\0").filter(Boolean)) paths.add(path);
  }
  return [...paths];
}

/** The paths of those the writable set does not hold. */
export function outOfBounds(paths, writable) {
  return paths.filter((path) => !isWritable(writable, path));
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2), {
    keys: ["before", "root"],
    usage: USAGE,
    prefix: ERROR,
  });
  const [change] = positional;
  if (!change || !flags.before) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");

  const writable = writableBy(root, change);
  const shas = landedShas(root);
  const paths =
    shas.length > 0
      ? commitPaths(root, shas)
      : pushedPaths(root, flags.before, "HEAD");
  const read =
    shas.length > 0
      ? `the ${shas.length} commit(s) ${LANDED} names`
      : `${flags.before}..HEAD, no ${LANDED} to read`;
  const bad = outOfBounds(paths, writable);
  if (bad.length > 0) {
    fail(
      `the re-read of \`${change}\` pushed outside what it may write:\n${bad
        .map((path) => `  ${path}`)
        .join("\n")}\nIt writes ${writable.join(", ")}. Read from ${read}.`,
    );
  }
  console.log(
    `${change}: ${paths.length} path(s) pushed in ${read}, all inside ${writable.join(", ")}`,
  );
}

function fail(message) {
  console.error(`${ERROR}${message}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
