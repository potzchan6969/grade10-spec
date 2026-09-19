/*
 * Monday's digest: one direct message per person, and nothing to anybody with
 * nothing to say.
 *
 *   node scripts/openspec/digest.mjs [--root <dir>] [--team <path>]
 *                                    [--sent-keys <file>] [--send]
 *                                    [--manual-url <url>] [--now <iso>]
 *
 * Six lines, from the same derivation every surface reads: the questions
 * addressed to them, the changes on them now, the changes nothing has moved
 * for a week, the artifacts something before them moved past, the waits they
 * wrote, and the changes a released dependency has freed. Five of the six are
 * the page's own list; the sixth — a freed dependency — and a written wait are
 * lines here rather than messages of their own (decisions Q31).
 *
 * The push workflow tells a hand the day a change reaches them. This is for
 * the week that went by without one: a question nobody answered, a change
 * nobody moved, an artifact nobody read again.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import {
  handOf,
  IDLE_FROM,
  overlaysOf,
  STAGE_LABEL,
  TIME_ZONE,
} from "../../tools/manual/src/api/stages.ts";
import { dayIn, daysBetween } from "../../tools/manual/src/api/time.ts";
import {
  addressOf,
  appendSentKeys,
  printable,
  readSentKeys,
  sendAll,
} from "./lib/notify.mjs";
import { readChangesAt } from "./lib/store-read.mjs";
import { readTeamMap, TEAM_MAP } from "./lib/team.mjs";

/** A behind artifact is listed from the seventh day it has been behind, and a
 * dependency freed a change within the last seven days is still news — one
 * bound, the week the digest covers. */
const AFTER_DAYS = IDLE_FROM;

const changePage = (manualUrl, id) =>
  `${manualUrl.replace(/\/$/, "")}/in-flight/${encodeURIComponent(id)}`;

/**
 * The week a digest is for, on the Hong Kong clock — the zone every day count
 * in this store is read on.
 *
 * It keys the message: one digest per person per week, so a re-run of
 * Monday's job says nothing twice. ISO weeks, because Thursday's year is the
 * only way a week that straddles New Year belongs to one year.
 */
export function weekOf(now) {
  const day = dayIn(now, TIME_ZONE);
  if (day === undefined) return "undated";
  const date = new Date(day * 86_400_000);
  const weekday = (date.getUTCDay() + 6) % 7;
  const thursday = new Date(date.getTime() + (3 - weekday) * 86_400_000);
  const firstDay = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  const week =
    Math.floor((thursday.getTime() - firstDay) / (7 * 86_400_000)) + 1;
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * The changes a release has carried: the key `released_in:` on a change in
 * flight, and every change in the archive.
 *
 * `depends_on:` naming one of these blocks nothing, which is what the Blocked
 * overlay reads and what makes a change freed.
 */
function releasedOf({ changes, archived }) {
  const released = new Map();
  for (const change of changes) {
    if (change.releasedIn === undefined) continue;
    // The commit that wrote the key is the day it was released, as near as
    // the store can date it: nothing else here says when a cut happened.
    released.set(change.id, { id: change.id, on: change.lastMoved });
  }
  // An archived change is dated by its directory's own prefix, which a rebase
  // cannot move.
  for (const change of archived) {
    released.set(change.id, { id: change.id, on: change.shippedOn });
  }
  return released;
}

/** The roles one handle holds on one change, from the change's own `hands:` —
 * never from the map's `roles`, which says what a person may take and not
 * what this change gave them. */
const rolesOf = (change, handle) =>
  Object.entries(change.hands ?? {})
    .filter(([, named]) => named === handle)
    .map(([role]) => role);

/**
 * What one person has to read this week.
 *
 * Every line names the change it is about, so the message reads as a list of
 * changes and not a list of facts. A person the change names nowhere gets
 * none of them: the digest is per person, and a role the change leaves
 * unnamed is a channel's to answer, not an inbox's.
 */
function linesFor(handle, changes, ctx) {
  const lines = [];
  for (const change of changes) {
    const held = rolesOf(change, handle);
    const stage = change.stage ?? "proposed";
    const onThem = handOf(change, stage).some((role) => held.includes(role));
    const named = `<${changePage(ctx.manualUrl, change.id)}|${change.title}>`;
    // The overlays are read from the schema's own order, so each change asks
    // for its own artifacts rather than the store's first schema.
    const overlays = overlaysOf(change, {
      ...ctx,
      artifacts: ctx.artifactsOf(change),
    });

    if (onThem) {
      lines.push({
        kind: "now",
        change: change.id,
        text: `${named} — ${STAGE_LABEL[stage]}`,
      });
    }
    for (const question of change.questions ?? []) {
      if (question.hand !== handle) continue;
      lines.push({
        kind: "question",
        change: change.id,
        id: question.id,
        text: `${question.id ? `${question.id} ` : ""}on ${named} — ${question.text}`,
      });
    }
    const idle = overlays.find((one) => one.kind === "idle");
    if (onThem && idle) {
      lines.push({
        kind: "idle",
        change: change.id,
        days: idle.days,
        text: `${named} — nothing landed for ${idle.days} days`,
      });
    }
    // The earliest behind artifact, as the card and the Behind message name
    // it. The day it went behind is the change's last commit: what put it
    // behind is a commit on this change or on a page it links, and the
    // reading carries the item rather than its date.
    const behind = overlays.find((one) => one.kind === "behind");
    const since =
      change.lastMoved === undefined
        ? undefined
        : daysBetween(change.lastMoved, ctx.now, TIME_ZONE);
    if (behind?.hand === handle && (since ?? 0) >= AFTER_DAYS) {
      lines.push({
        kind: "behind",
        change: change.id,
        days: since,
        artifact: behind.artifact,
        text: `\`${behind.artifact}\` on ${named} — behind for ${since} days`,
      });
    }
    for (const wait of overlays) {
      if (wait.kind !== "waiting" || wait.hand !== handle) continue;
      lines.push({
        kind: "waiting",
        change: change.id,
        text: `${named} — waiting: ${wait.text}`,
      });
    }
    for (const id of change.dependsOn ?? []) {
      const dep = ctx.releases.get(id);
      const freed =
        dep?.on === undefined
          ? undefined
          : daysBetween(dep.on, ctx.now, TIME_ZONE);
      if (held.length === 0 || freed === undefined || freed > AFTER_DAYS) {
        continue;
      }
      lines.push({
        kind: "freed",
        change: change.id,
        text: `${named} — \`${id}\` is released, so nothing blocks it`,
      });
    }
  }
  return lines;
}

/** The message, grouped by kind in the order the page lists them. */
const HEADINGS = [
  ["now", "On you now"],
  ["question", "Open questions"],
  ["idle", "Nothing moved"],
  ["behind", "Behind"],
  ["waiting", "Waiting"],
  ["freed", "Freed"],
];

function textOf(lines) {
  const blocks = [];
  for (const [kind, heading] of HEADINGS) {
    const held = lines.filter((one) => one.kind === kind);
    if (held.length === 0) continue;
    blocks.push(
      `*${heading}*\n${held.map((one) => `- ${one.text}`).join("\n")}`,
    );
  }
  return `*Your week*\n\n${blocks.join("\n\n")}`;
}

/** Every person's digest: the lines they have, addressed and keyed. */
export function digestOf(read, map, ctx) {
  const messages = [];
  const skipped = [];
  const week = weekOf(ctx.now);
  for (const handle of Object.keys(map.handles)) {
    const lines = linesFor(handle, read.changes, ctx);
    // A quiet week reaches nobody's inbox.
    if (lines.length === 0) continue;
    const key = `${handle}:digest:${week}`;
    const address = addressOf(map, { hand: handle, role: undefined });
    if (address.skipped) {
      skipped.push({ key, handle, why: address.skipped });
      continue;
    }
    messages.push({
      key,
      kind: "digest",
      handle,
      to: address.to,
      channel: address.channel,
      lines,
      text: textOf(lines),
    });
  }
  return { messages, skipped };
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((argument) => argument !== "--"),
    options: {
      root: { type: "string" },
      team: { type: "string", default: TEAM_MAP },
      "sent-keys": { type: "string" },
      send: { type: "boolean", default: false },
      now: { type: "string" },
      "manual-url": {
        type: "string",
        default: "https://spec.grade10-stg.com/planning",
      },
    },
  });
  const root = values.root
    ? resolve(values.root)
    : resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const read = await readChangesAt(root);
  const now = values.now ? Date.parse(values.now) : Date.now();
  const releases = releasedOf(read);
  const told = digestOf(read, readTeamMap(root, values.team), {
    now,
    released: new Set(releases.keys()),
    releases,
    manualUrl: values["manual-url"],
    artifactsOf: read.artifactsOf,
  });
  const sent = readSentKeys(values["sent-keys"]);
  const messages = told.messages.filter((one) => !sent.has(one.key));

  for (const one of told.skipped) {
    process.stderr.write(`nothing sent for ${one.key}: ${one.why}\n`);
  }
  if (values.send) {
    const token = process.env.SLACK_BOT_TOKEN;
    try {
      appendSentKeys(values["sent-keys"], await sendAll(messages, { token }));
    } catch (cause) {
      appendSentKeys(values["sent-keys"], cause.sent ?? []);
      throw cause;
    }
  } else if (messages.length > 0) {
    process.stderr.write(`${printable(messages)}\n`);
    appendSentKeys(
      values["sent-keys"],
      messages.map((one) => one.key),
    );
  }
  process.stdout.write(
    JSON.stringify({ week: weekOf(now), messages, skipped: told.skipped }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
