#!/usr/bin/env node
/**
 * Fails on a path a re-read pushed outside what it may write.
 *
 * A re-read edits one change's artifacts and the pages its proposal links —
 * `lib/writable.mjs` is that boundary, and `reread-settings.mjs` denies the
 * rest to the agent. This is the repository's own limit rather than the
 * agent's: it diffs the commits the job's own checkout carries against the
 * sha the job started at, and fails loudly rather than reverting quietly when
 * one of them touched a path the round has no business in — a page the
 * proposal never linked included, which the settings leave open because
 * `docs/prds/` is where the pages it may mark live.
 *
 *   node scripts/openspec/reread-guard.mjs <change> --before <sha> [--root <dir>]
 *
 * The range ends at `HEAD`: the round commits locally before it pushes, so
 * the job's own checkout already carries whatever it wrote, and a range
 * ending anywhere else is a guard reading somebody else's work.
 */
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
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
  const paths = pushedPaths(root, flags.before, "HEAD");
  const bad = outOfBounds(paths, writable);
  if (bad.length > 0) {
    fail(
      `the re-read of \`${change}\` pushed outside what it may write:\n${bad
        .map((path) => `  ${path}`)
        .join("\n")}\nIt writes ${writable.join(", ")}.`,
    );
  }
  console.log(
    `${change}: ${paths.length} path(s) pushed, all inside ${writable.join(", ")}`,
  );
}

function fail(message) {
  console.error(`${ERROR}${message}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
