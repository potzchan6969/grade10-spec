#!/usr/bin/env node
/**
 * What a run tells the relay: a thread reply, that it is done, or which
 * change it opened.
 *
 * `.round/relay.json` is the wake's own file — the run writes the payload's
 * `relay`, `change`, `sender` and `thread` there first, before it does
 * anything else. Its `token` is scoped to this wake, signed by the relay and
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
 * `--root` is where `.round/relay.json` is read from, the current directory
 * by default. A missing or empty `--message-file` posts nothing and makes no
 * request: the round found nothing to say.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";

const USAGE =
  'usage: node relay-post.mjs --message-file <path> | --text "<text>" | --done | --bind <change> [--root <dir>]';
const RELAY_FILE = join(".round", "relay.json");

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

/** The relay this wake was given, or nothing where the round is running from
 * a terminal with no wake behind it. */
function relayOf(root) {
  const file = join(root, RELAY_FILE);
  if (!existsSync(file)) return undefined;
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (cause) {
    fail(`${RELAY_FILE} is not JSON: ${cause.message}`);
  }
  const relay = parsed.relay;
  if (!relay?.url || !relay?.token) {
    fail(`${RELAY_FILE} names no relay.url and relay.token`);
  }
  return relay;
}

/** What the action prints when there is no relay to post it through. */
function printed(action) {
  if (action.kind === "done") return "done";
  if (action.kind === "bind") return `bind ${action.change}`;
  return action.text;
}

/** The relay's own path and body for one action — the token rides the path,
 * never a header, because it is scoped to this wake rather than a chat app. */
function requestFor(relay, action) {
  if (action.kind === "done")
    return { path: `/runs/${relay.token}/done`, body: {} };
  if (action.kind === "bind")
    return {
      path: `/runs/${relay.token}/bind`,
      body: { change: action.change },
    };
  return { path: `/runs/${relay.token}/post`, body: { text: action.text } };
}

/** What a successful call prints — nothing that could double as a log of the
 * token, which the path above already carries. */
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

  const relay = relayOf(root);
  if (!relay) {
    console.log(printed(action));
    return;
  }

  const { path, body } = requestFor(relay, action);
  let response;
  try {
    response = await fetch(`${relay.url}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    fail(`the relay could not be reached: ${cause.message}`);
    return;
  }
  const text = await response.text().catch(() => "");
  if (response.status < 200 || response.status >= 300) {
    fail(`the relay refused: ${response.status}\n${text}`);
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
