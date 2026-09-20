#!/usr/bin/env node
/**
 * Fails on a path a re-read pushed outside what it may write.
 *
 * A re-read edits one change's artifacts and the pages its proposal links —
 * `lib/writable.mjs` is that boundary. This is the repository's own limit
 * rather than the agent's: the session runs it itself before every push it
 * makes, and it fails loudly rather than reverting quietly when one of the
 * commits it made touched a path the round has no business in — a page the
 * proposal never linked included, since `docs/prds/` and `docs/references/`
 * are where the pages it may mark and the evidence it may correct live, and
 * nothing narrower denies the rest of them up front. The relay checks its own
 * coarser set again before it moves `main` — the change's own directory and
 * those two trees whole (Q55) — so a session that skipped this guard is still
 * caught, just later and more broadly.
 *
 *   node scripts/openspec/reread-guard.mjs <change> <artifact|group> [--alive] [--root <dir>]
 *
 * The target is the round's own: an artifact is held to the set above, and a
 * task group is held to nothing here. A group pushes code — a package, a
 * script, a workflow — which no writable set of an artifact round can hold,
 * so the paths are not read for one at all; what it may write is what its
 * own tasks name, and `plan:preflight` is what holds it to them.
 *
 * The commits it reads are what this run made, which is two facts about a
 * checkout and not one range: the landings, which `.round/landed` names and
 * which `main` holds already because the landing is what pushed them, and
 * every commit on `HEAD` that `main` does not hold — the drafts, pushed to
 * the change's branch or about to be. Their union is what is read, so a
 * `main` that moved under the run is no part of it: `plan:land` rebases the
 * branch on a moved `origin/main`, and every commit `main` gained while the
 * round was reading arrives in the checkout and would otherwise read as a
 * path the re-read pushed.
 *
 * `--alive` asks the relay, before the paths are read, whether this run's
 * wake is still the room's own: a run whose lease the relay has closed under
 * it — its budget spent, or a second wake queued on the change — stops here
 * rather than pushing work no thread is waiting for. With no wake there is
 * nothing to ask and nothing to refuse, which is the terminal round.
 *
 * There is no range to pass: the union above is read from the checkout
 * itself, so a start sha would select nothing and is refused as any other
 * unknown option is.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import { commitPaths, LANDED, landedShas } from "./lib/landed.mjs";
import { isGroup } from "./lib/perspectives.mjs";
import { readWake, relayOf } from "./lib/relay.mjs";
import { isWritable, writableBy } from "./lib/writable.mjs";
import { git, storeMain } from "./store-main.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** What a workflow log reads as an annotation: every refusal here opens with
 * it, the usage refusal the parser prints included. */
const ERROR = "::error::";
const USAGE =
  "usage: node reread-guard.mjs <change> <artifact|group> [--alive] [--root <dir>]";

/** The paths of those the writable set does not hold. */
export function outOfBounds(paths, writable) {
  return paths.filter((path) => !isWritable(writable, path));
}

/**
 * The commits this run made: the landings it named, and everything `HEAD`
 * holds that `main` does not. Read with no fetch — the checkout's own
 * `origin/main` is what the run has been landing against — and each sha
 * once, since a landing that is also unpushed is one commit either way.
 *
 * A checkout with no `main`, and a `rev-list` git refused, both throw: what
 * this run pushed is the whole of what the guard holds it to, and a run that
 * cannot be read is not a run that pushed nothing.
 */
function runCommits(root) {
  const main = storeMain(root, { fetch: false });
  if (!main)
    throw new Error(
      "no origin/main in this checkout: the guard cannot say what this run pushed",
    );
  const listed = git(root, ["rev-list", "HEAD", "--not", main.ref]);
  if (listed === null)
    throw new Error(`git rev-list HEAD --not ${main.ref} refused in ${root}`);
  const unpushed = listed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    ref: main.ref,
    shas: [...new Set([...landedShas(root), ...unpushed])],
  };
}

/** The wake this run was fired with, asked whether it is still the room's
 * own. Nothing to ask from a terminal round, which holds no wake. */
async function checkAlive(root) {
  const wake = readWake(root);
  if (!wake) {
    console.log("no wake to ask about: this run pushes on its own word");
    return;
  }
  let answer;
  try {
    answer = await relayOf(wake).alive();
  } catch (cause) {
    fail(`the relay could not be reached: ${cause.message}`);
    return;
  }
  if (answer.status !== 200) {
    fail(
      `this run's wake is not the room's any more (${answer.status}) — it pushes nothing further`,
    );
    return;
  }
  console.log("the wake is alive");
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2), {
    keys: ["root"],
    booleans: ["alive"],
    usage: USAGE,
    prefix: ERROR,
  });
  const [change, target] = positional;
  if (!change || !target) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");

  if (flags.alive) await checkAlive(root);

  // A task group's own work is code, which no writable set holds: the wake is
  // still asked, and the paths are not read.
  if (isGroup(target)) {
    console.log("a task group writes what its tasks name - no path check here");
    return;
  }

  const writable = writableBy(root, change);
  const { ref, shas } = runCommits(root);
  const paths = commitPaths(root, shas);
  const read = `the ${shas.length} commit(s) this run made — ${LANDED}, and HEAD above ${ref}`;
  const bad = outOfBounds(paths, writable);
  if (bad.length > 0) {
    fail(
      `the re-read of \`${change}\` pushed outside what it may write:\n${bad
        .map((path) => `  ${path}`)
        .join("\n")}\nIt writes ${writable.join(", ")}. Read from ${read}.`,
    );
  }
  console.log(
    `${change}: ${paths.length} path(s) in ${read}, all inside ${writable.join(", ")}`,
  );
}

function fail(message) {
  console.error(`${ERROR}${message}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((cause) => fail(cause.message));
}
