#!/usr/bin/env node
/**
 * Fails on a path a re-read pushed outside its own change's directory.
 *
 * A re-read edits one change's artifacts and nothing else — the settings
 * denying `.github/**`, `packages/**`, `tools/**` and every other change's
 * directory are the agent's own limit, and this is the repository's: it
 * diffs the commits the job's own checkout carries against the sha the job
 * started at, and fails loudly rather than reverting quietly when one of
 * them touched a path the round has no business in.
 *
 *   node scripts/openspec/reread-guard.mjs <change> --before <sha> [--after <ref>] [--root <dir>]
 *
 * `--after` defaults to `HEAD`: the round commits locally before it pushes,
 * so the job's own checkout already carries whatever it wrote.
 */
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** What a workflow log reads as an annotation: every refusal here opens with
 * it, the usage refusal the parser prints included. */
const ERROR = "::error::";
const USAGE =
  "usage: node reread-guard.mjs <change> --before <sha> [--after <ref>] [--root <dir>]";

/** Every path a range of commits touched, oldest first. */
export function pushedPaths(root, before, after) {
  const stdout = execFileSync(
    "git",
    ["diff", "--name-only", "-z", before, after],
    { cwd: root, encoding: "utf8" },
  );
  return stdout.split("\0").filter(Boolean);
}

/** The paths of those that are not inside the change's own directory. */
export function outOfBounds(paths, change) {
  const allowed = `openspec/changes/${change}/`;
  return paths.filter((path) => !path.startsWith(allowed));
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2), {
    keys: ["before", "after", "root"],
    usage: USAGE,
    prefix: ERROR,
  });
  const [change] = positional;
  if (!change || !flags.before) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");
  const after = flags.after ?? "HEAD";

  const paths = pushedPaths(root, flags.before, after);
  const bad = outOfBounds(paths, change);
  if (bad.length > 0) {
    fail(
      `the re-read of \`${change}\` pushed outside its own directory:\n${bad
        .map((path) => `  ${path}`)
        .join("\n")}`,
    );
  }
  console.log(
    `${change}: ${paths.length} path(s) pushed, all inside openspec/changes/${change}/`,
  );
}

function fail(message) {
  console.error(`${ERROR}${message}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
