#!/usr/bin/env node
/**
 * What a run tells the relay: a thread reply, that it is done, or which
 * change it opened.
 *
 * `.round/relay.json` is the wake's own file — the run writes the payload's
 * `relay`, `change`, `sender` and `thread` there first, before it does
 * anything else. `lib/relay.mjs` reads it and makes every call, here and in
 * `plan-land.mjs`; its token is scoped to this wake, signed by the relay and
 * expiring with its budget, so this script never holds a chat token and never
 * prints the one it is given. A terminal round has no such file: it prints
 * what it would have posted and stops there, since a push is what tells the
 * thread outside a wake.
 *
 *   node scripts/openspec/relay-post.mjs --message-file <path> [--root <dir>]
 *   node scripts/openspec/relay-post.mjs --text "<text>" [--root <dir>]
 *   node scripts/openspec/relay-post.mjs --done [--root <dir>]
 *   node scripts/openspec/relay-post.mjs --bind <change> [--root <dir>]
 *
 * `--bind` is the plan's own call, made right after `openspec new change`: it
 * warms the room's mapping with the change the run opened, and never defines
 * it — the record's `thread:` at `main` is what a landing wake resolves.
 * Whether a wake is still the room's own is `reread-guard.mjs --alive`, asked
 * before a push rather than after a post.
 *
 * `--root` is where `.round/relay.json` is read from, the current directory
 * by default. A missing or empty `--message-file` posts nothing and makes no
 * request: the round found nothing to say. With `ROUND_WAKE=relay` in the
 * environment and no such file, every mode fails rather than prints.
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import { readWake, relayOf } from "./lib/relay.mjs";

const USAGE =
  'usage: node relay-post.mjs --message-file <path> | --text "<text>" | --done | --bind <change> [--root <dir>]';

/** The one action this call makes, read off which flag was given: `post` for
 * a message (from a file or given directly), `done`, or `bind`. */
function actionOf(flags) {
  const modes = ["message-file", "text", "done", "bind"].filter(
    (key) => flags[key] !== undefined,
  );
  if (modes.length !== 1)
    fail(`one of --message-file, --text, --done, --bind\n${USAGE}`);
  if (flags.done) return { kind: "done" };
  if (flags.bind !== undefined) return { kind: "bind", change: flags.bind };
  if (flags.text !== undefined)
    return { kind: "post", text: flags.text.trim() };
  const text = messageFileText(flags["message-file"]);
  return { kind: "post", text };
}

/** The file's trimmed text, or the empty string where it is missing or
 * blank — a round posts only when it has something to say. */
function messageFileText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").trim();
}

/** What the action prints when there is no relay to post it through. */
function printed(action) {
  if (action.kind === "done") return "done";
  if (action.kind === "bind") return `bind ${action.change}`;
  return action.text;
}

/** The call one action makes on the wake, through the one client. */
function callFor(relay, action) {
  if (action.kind === "done") return relay.done();
  if (action.kind === "bind") return relay.bind(action.change);
  return relay.post(action.text);
}

/** What a successful call prints — nothing that could double as a log of the
 * token, which the client's own path and header carry. */
function confirmed(action) {
  if (action.kind === "done") return "done";
  if (action.kind === "bind") return `bound ${action.change}`;
  return "posted";
}

async function main() {
  const { flags } = parseArgs(process.argv.slice(2), {
    keys: ["message-file", "text", "bind", "root"],
    booleans: ["done"],
    usage: USAGE,
  });
  const root = flags.root ?? process.cwd();
  const action = actionOf(flags);

  if (action.kind === "post" && action.text === "") {
    console.log("nothing to post");
    return;
  }

  const wake = readWake(root);
  if (!wake) {
    console.log(printed(action));
    return;
  }

  let answer;
  try {
    answer = await callFor(relayOf(wake), action);
  } catch (cause) {
    fail(`the relay could not be reached: ${cause.message}`);
    return;
  }
  if (answer.status < 200 || answer.status >= 300) {
    fail(`the relay refused: ${answer.status}\n${answer.text}`);
    return;
  }
  console.log(confirmed(action));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
