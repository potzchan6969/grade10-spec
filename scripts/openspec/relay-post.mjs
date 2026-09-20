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
 *   node scripts/openspec/relay-post.mjs --done [--root <dir>]
 *   node scripts/openspec/relay-post.mjs --bind <change> [--root <dir>]
 *
 * One table below holds the three, keyed by the flag that names each: the
 * call it makes on the wake, the line a terminal round prints instead, and
 * what a call that went through says. A reply is the file the round wrote —
 * `.round/thread.txt` — and never a string on the command line: a summary
 * with a newline, a quote or a Slack link in it is a file, and one that is
 * spliced into an argument is a quoting bug waiting for the run that writes
 * it.
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

/**
 * The modes, one row each: `read` takes the flag's value off the arguments,
 * `call` is what the wake is asked, `printed` is what a terminal round says
 * instead, `confirmed` is what a call that went through says, and `nothing`
 * is the value that makes the whole run a no-op.
 */
const KINDS = {
  "message-file": {
    read: (flags) => messageFileText(flags["message-file"]),
    call: (relay, text) => relay.post(text),
    printed: (text) => text,
    confirmed: () => "posted",
    nothing: (text) => text === "",
  },
  done: {
    read: () => true,
    call: (relay) => relay.done(),
    printed: () => "done",
    confirmed: () => "done",
  },
  bind: {
    read: (flags) => flags.bind,
    call: (relay, change) => relay.bind(change),
    printed: (change) => `bind ${change}`,
    confirmed: (change) => `bound ${change}`,
  },
};

const MODES = Object.keys(KINDS);
const USAGE =
  "usage: node relay-post.mjs --message-file <path> | --done | --bind <change> [--root <dir>]";

/** The file's trimmed text, or the empty string where it is missing or
 * blank — a round posts only when it has something to say. */
function messageFileText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").trim();
}

async function main() {
  const { flags } = parseArgs(process.argv.slice(2), {
    keys: ["message-file", "bind", "root"],
    booleans: ["done"],
    usage: USAGE,
  });
  const root = flags.root ?? process.cwd();
  const given = MODES.filter((one) => flags[one] !== undefined);
  if (given.length !== 1) {
    fail(`one of ${MODES.map((one) => `--${one}`).join(", ")}\n${USAGE}`);
  }
  const kind = KINDS[given[0]];
  const value = kind.read(flags);

  if (kind.nothing?.(value)) {
    console.log("nothing to post");
    return;
  }

  let wake;
  try {
    wake = readWake(root);
  } catch (cause) {
    fail(cause.message);
  }
  if (!wake) {
    console.log(kind.printed(value));
    return;
  }

  let answer;
  try {
    answer = await kind.call(relayOf(wake), value);
  } catch (cause) {
    fail(`the relay could not be reached: ${cause.message}`);
    return;
  }
  if (answer.status < 200 || answer.status >= 300) {
    fail(`the relay refused: ${answer.status}\n${answer.text}`);
    return;
  }
  console.log(kind.confirmed(value));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((cause) => fail(cause.message));
}
