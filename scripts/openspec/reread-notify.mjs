#!/usr/bin/env node
/**
 * What the re-read job says on the change's own thread, or its channel.
 *
 * The agent never holds `SLACK_BOT_TOKEN` — it writes what it read to a file
 * — so a plain step, with no writable path the agent must stay off, posts
 * that file's text here. The same script says what happened when the run
 * dies before it writes one: `if: failure()` calls it with no `--message` and
 * gets the one line naming the change and the run.
 *
 *   node scripts/openspec/reread-notify.mjs <change> \
 *     [--message-file <path>] [--run-url <url>] \
 *     [--channel <id>] [--root <dir>] [--send]
 *
 * A `--message-file` that is missing or empty is not an error: a re-read
 * that found nothing to say about that step (the thread summary the round
 * did not write because it landed nothing) posts nothing rather than an
 * empty line.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sendAll, threadPartsOf } from "./lib/notify.mjs";
import { openRecord, writtenValue } from "./lib/record.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node reread-notify.mjs <change> [--message-file <path>] [--message <text>] [--run-url <url>] [--channel <id>] [--root <dir>] [--send]";

/** The one line a dead run leaves behind, naming the change and the run a
 * hand can open to see why. */
export function failureMessageOf(change, runUrl) {
  const link = runUrl ? ` <${runUrl}|Run>` : "";
  return `*Read again failed* — the read again for \`${change}\` did not finish.${link}`;
}

/** Where this change's message goes: its own thread where the record names
 * one, the fallback channel otherwise. Throws where neither is there, since a
 * message with nowhere to go is a misconfigured run, not a silent no-op. */
export function addressFor(root, change, fallbackChannel) {
  const { doc } = openRecord(root, change);
  const thread = writtenValue(doc, "thread");
  const parts = threadPartsOf(thread);
  if (parts) return { channel: parts.channel, threadTs: parts.ts };
  if (!fallbackChannel) {
    throw new Error(
      `\`${change}\` has no thread: in its record and no --channel was given`,
    );
  }
  return { channel: fallbackChannel };
}

/** The message file's text, or nothing where the file is missing or blank —
 * the round writes it only when it has something to say. */
function fileMessage(path) {
  if (!path || !existsSync(path)) return undefined;
  const text = readFileSync(path, "utf8").trim();
  return text === "" ? undefined : text;
}

async function main() {
  const { positional, flags } = parse(process.argv.slice(2));
  const [change] = positional;
  if (!change) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");

  // A thread-summary call (`--message-file`) that found nothing written has
  // nothing to say — the round posts only when it read or landed something —
  // so it skips rather than falling through to the failure line below, which
  // is for the step that has no file to point at at all.
  if (
    flags["message-file"] &&
    fileMessage(flags["message-file"]) === undefined
  ) {
    console.log(`${change}: nothing to post`);
    return;
  }
  const message =
    fileMessage(flags["message-file"]) ??
    flags.message ??
    failureMessageOf(change, flags["run-url"]);

  const address = addressFor(root, change, flags.channel);
  if (!flags.send) {
    console.log(
      `→ ${address.channel}${address.threadTs ? ` (thread ${address.threadTs})` : ""}\n${message}`,
    );
    return;
  }
  await sendAll(
    [
      {
        key: `${change}:reread`,
        to: "channel",
        channel: address.channel,
        ...(address.threadTs ? { threadTs: address.threadTs } : {}),
        text: message,
      },
    ],
    { token: process.env.SLACK_BOT_TOKEN },
  );
  console.log(`${change}: posted to ${address.channel}`);
}

function parse(argv) {
  const flags = {};
  const positional = [];
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === "--send") {
      flags.send = true;
      continue;
    }
    const named =
      /^--(message-file|message|run-url|channel|root)(?:=(.*))?$/.exec(arg);
    if (named) {
      let value = named[2];
      if (value === undefined) {
        at += 1;
        value = argv[at];
      }
      if (value === undefined) fail(`--${named[1]} needs a value\n${USAGE}`);
      flags[named[1]] = value;
      continue;
    }
    if (arg.startsWith("-")) fail(`unknown option ${arg}\n${USAGE}`);
    positional.push(arg);
  }
  return { positional, flags };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
