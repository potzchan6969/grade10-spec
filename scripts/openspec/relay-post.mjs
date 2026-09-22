#!/usr/bin/env node
/**
 * What a run tells the relay: a thread reply, that it is done, or which
 * change it opened.
 *
 * `.round/relay.json` is the wake's own file — the session writes the
 * Routine's payload there whole, before it does anything else; the `workflow-round`
 * skill names its six keys. `lib/relay.mjs` reads it and makes every call,
 * here and in `plan-land.mjs`; its token is scoped to this wake, signed by
 * the relay and expiring with its budget, so this script never holds a chat
 * token and never prints the one it is given. `--bind` tells the relay which
 * change a plan wake opened, so the change's room takes the thread as its
 * alias; the skill says when. A terminal round has no such file: it prints
 * what it would have posted and stops there, since a push is what tells the
 * thread outside a wake.
 *
 *   node scripts/openspec/relay-post.mjs --message-file <path>
 *     [--confirm <artifact|group>] [--held] [--root <dir>]
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
 * `--confirm <artifact|group>` rides a message: the summary is posted with one
 * button, `Confirm <artifact>` from `CONFIRM_LABEL` in `lib/relay.mjs`, and a
 * press is the same word as typing it. `--held` posts `Confirm with
 * recommendations` instead, which is the button while a held row is open. A
 * terminal round prints the text and then the label on its own line.
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
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tableRows } from "../../tools/manual/src/store/markdown.mts";
import { readQuestions } from "../../tools/manual/src/store/read-changes.mts";
import { parseArgs } from "./lib/args.mjs";
import { confirmOf, readWake, relayOf } from "./lib/relay.mjs";

/**
 * The modes, one row each: `read` takes the flag's value off the arguments,
 * `call` is what the wake is asked, `printed` is what a terminal round says
 * instead, `confirmed` is what a call that went through says, `nothing` is
 * the value that makes the whole run a no-op, and `button` is whether a
 * `--confirm` may ride this mode.
 */
const KINDS = {
  "message-file": {
    read: (flags) => messageFileText(flags["message-file"]),
    call: (relay, text, confirm) => relay.post(text, confirm),
    printed: (text, confirm) =>
      confirm ? `${text}\n[${confirm.label}]` : text,
    confirmed: () => "posted",
    nothing: (text) => text === "",
    button: true,
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
  // A held row addressed to another hand: the round's own reply in the
  // change's thread, mentioning that hand, with the row, the sentence it would
  // put on the page and the decision rows it touches quoted — posted once per
  // change, row and text (`shared-planning-agent-rounds-SC-86`).
  row: {
    read: (flags, root) => heldRowText(root, flags),
    call: (relay, text) => relay.post(text),
    printed: (text) => text,
    confirmed: () => "posted row",
    nothing: (text) => text === "",
    after: (root, flags, text) => rememberRow(root, flags, text),
  },
};

const MODES = Object.keys(KINDS);
const USAGE =
  "usage: node relay-post.mjs --message-file <path> [--confirm <artifact|group>] [--held] | --row <Q> --change <id> | --done | --bind <change> [--root <dir>]";

/** The file's trimmed text, or the empty string where it is missing or
 * blank — a round posts only when it has something to say. */
function messageFileText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").trim();
}

async function main() {
  const { flags } = parseArgs(process.argv.slice(2), {
    keys: ["message-file", "bind", "confirm", "root", "row", "change"],
    booleans: ["done", "held"],
    usage: USAGE,
  });
  const root = flags.root ?? process.cwd();
  const given = MODES.filter((one) => flags[one] !== undefined);
  if (given.length !== 1) {
    fail(`one of ${MODES.map((one) => `--${one}`).join(", ")}\n${USAGE}`);
  }
  const kind = KINDS[given[0]];
  const value = await kind.read(flags, root);
  const confirm = buttonOf(flags, kind);

  if (kind.nothing?.(value)) {
    console.log(given[0] === "row" ? "already posted" : "nothing to post");
    return;
  }

  let wake;
  try {
    wake = readWake(root);
  } catch (cause) {
    fail(cause.message);
  }
  if (!wake) {
    console.log(kind.printed(value, confirm));
    kind.after?.(root, flags, value);
    return;
  }

  let answer;
  try {
    answer = await kind.call(relayOf(wake), value, confirm);
  } catch (cause) {
    fail(`the relay could not be reached: ${cause.message}`);
    return;
  }
  if (answer.status < 200 || answer.status >= 300) {
    fail(`the relay refused: ${answer.status}\n${answer.text}`);
    return;
  }
  console.log(kind.confirmed(value));
  kind.after?.(root, flags, value);
}

/**
 * The reply a held row makes to the hand it waits on. The row is read
 * through the manual's own question reader, so the hand and the
 * recommendation are the ones the change page shows; the sentence it would
 * put on the page is every line of a page the proposal links that cites the
 * row; the rows it touches are every other decision row that names it. A row
 * that is not held is refused: a decided row asks nobody anything. An empty
 * text means the same reply was posted already.
 */
async function heldRowText(root, flags) {
  const change = flags.change;
  if (!change) fail(`--row rides --change <id>\n${USAGE}`);
  const id = flags.row;
  const dir = join(root, "openspec", "changes", change);
  const decisions = readTextOr(join(dir, "decisions.md"));
  const held = readQuestions(
    decisions,
    handsOf(readTextOr(join(dir, ".openspec.yaml"))),
  ).find((one) => one.id === id);
  if (!held) {
    fail(
      `${id} is not held: a row asks a hand only while its Decision cell opens ❓ — a decided row is nobody's question`,
    );
  }
  const rows = tableRows(decisions) ?? [];
  const own = rows.find((cells) => cells[0] === id) ?? [];
  // The rows it touches: those the row names, and those that name it.
  const ownText = own.join(" | ");
  const touched = rows.filter(
    (cells) =>
      /^Q\d+$/.test(cells[0] ?? "") &&
      cells[0] !== id &&
      (ownText.includes(cells[0]) || cells.join(" | ").includes(id)),
  );
  const pages = pagesLinkedBy(root, dir);
  const onPage = pages.flatMap(({ file, text }) =>
    text
      .split("\n")
      .filter((line) => line.includes(`\`${id}\``))
      .map((line) => `${file}: ${line.trim()}`),
  );
  const hand = held.hand.startsWith("@") ? held.hand : `@${held.hand}`;
  const text = [
    `${hand} — ${id} waits on you (${held.role}).`,
    `> ${own.join(" | ")}`,
    onPage.length > 0
      ? `The sentence it would put on the page:\n${onPage.map((one) => `> ${one}`).join("\n")}`
      : "It puts no sentence on a page.",
    touched.length > 0
      ? `The rows it touches:\n${touched.map((cells) => `> ${cells.join(" | ")}`).join("\n")}`
      : "It touches no other row.",
    `Answer with \`${id}: <your answer>\`, or \`${id}\` to take the recommendation.`,
  ].join("\n");
  return rowsSent(root).has(rowKey(change, id, text)) ? "" : text;
}

const readTextOr = (path) =>
  existsSync(path) ? readFileSync(path, "utf8") : "";

/** The `hands:` block of the record, role to handle, read without git: the
 * record is the one file this reply needs, and a terminal round has no wake. */
function handsOf(record) {
  const hands = {};
  const block = /^hands:\n((?:[ \t]+\S.*\n?)+)/m.exec(record);
  for (const line of block?.[1].split("\n") ?? []) {
    const pair = /^\s+([a-z]+):\s*"?(@?[\w.-]+)"?\s*$/.exec(line);
    if (pair) hands[pair[1]] = pair[2];
  }
  return hands;
}

/** The pages the proposal links, as `[…](../../../docs/prds/….md#…)`. */
function pagesLinkedBy(root, dir) {
  const proposal = readTextOr(join(dir, "proposal.md"));
  const seen = new Set();
  const pages = [];
  for (const match of proposal.matchAll(
    /\]\(([^)\s]*docs\/prds\/[^)\s#]+\.md)(?:#[^)]*)?\)/g,
  )) {
    const file = resolve(dir, match[1]);
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    pages.push({
      file: file.slice(root.length + 1),
      text: readFileSync(file, "utf8"),
    });
  }
  return pages;
}

const ROWS_SENT = ".round/rows.txt";
const rowKey = (change, id, text) =>
  `${change}/${id}/${createHash("sha1").update(text).digest("hex").slice(0, 12)}`;
const rowsSent = (root) =>
  new Set(readTextOr(join(root, ROWS_SENT)).split("\n").filter(Boolean));
function rememberRow(root, flags, text) {
  const file = join(root, ROWS_SENT);
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${rowKey(flags.change, flags.row, text)}\n`);
}

/**
 * The button this call carries, or nothing. A button rides a message: it is
 * the word the summary waits on, and `--done` and `--bind` say nothing in the
 * thread for a hand to answer. A `--confirm` the chain issues no button for
 * is refused by name rather than posted as a label nobody wrote.
 */
function buttonOf(flags, kind) {
  if (flags.confirm === undefined && flags.held !== true) return undefined;
  if (!kind.button) fail(`--confirm and --held ride --message-file\n${USAGE}`);
  const confirm = confirmOf(flags.confirm, flags.held === true);
  if (!confirm)
    fail(
      `--confirm names an artifact of the chain or a task group's number, not ${flags.confirm}\n${USAGE}`,
    );
  return confirm;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((cause) => fail(cause.message));
}
