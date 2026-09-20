/*
 * The words a message says, and nothing about who it reaches.
 *
 * Its own module, with no `node:` import of its own, because two readers
 * compose the same sentences: the push workflow, which sends them, and the
 * manual's Told now block, which shows a hand exactly what they are being
 * told. A second composer anywhere would have the manual say one thing and
 * Slack another about the same change. `moves.mjs` re-exports the four
 * bodies and `notify.mjs` the escape, so nothing that already read them from
 * there changes.
 *
 * Slack `mrkdwn` is the one dialect here — `*bold*`, `` `code` `` and
 * `<url|title>`. The link is the caller's: the workflow builds it from the
 * workspace and the manual from its own route, and the sentence around it is
 * the same either way.
 */
import {
  moveOf,
  ROLE_LABEL,
  STAGE_LABEL,
} from "../../../tools/manual/src/api/stages.ts";

/** A title, safe for Slack's `mrkdwn`: the three characters its own markup
 * reads as syntax, turned into entities before anything builds a link or a
 * line around one. */
export function escapeSlackText(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * A thread's own path on Slack: the channel and the timestamp with its
 * separator taken out, which is the form Slack resolves. Nothing for a record
 * that names no thread, which is what the change page is the link for.
 *
 * The host is the caller's, which is the whole reason this is a path: the push
 * workflow has the workspace's own and the manual has only Slack's, whose
 * redirect lands a signed-in reader in theirs. `chat.getPermalink` would
 * answer the same thing and spends a call per hand on a value the record
 * already holds.
 */
export function threadPathOf(thread) {
  const [channel, ts] = String(thread ?? "").split("/");
  if (!channel || !ts) return undefined;
  return `/archives/${channel}/p${ts.replace(".", "")}`;
}

/** A title, linked, in Slack's own `mrkdwn`: every message that names a
 * change names it this way, so the escape and the brackets are written once —
 * a change titled with an `&` or a `<` reads as text and not as more markup. */
export function linkedOf(url, title) {
  return `<${url}|${escapeSlackText(title)}>`;
}

/** A sentence opens with a capital; the table writes the move in the words a
 * lane heading shows it in. */
const opening = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/**
 * One body, whoever it reaches: the hand's own inbox, or the role's channel
 * where the change names no hand for it, which is the same message and not a
 * second kind.
 *
 * `at` is the change as a reading: its `id`, which the command is written
 * with, and its `stage`. `linked` is the change already linked, because only
 * the caller knows where its reader can reach it.
 */
export function yourTurnText(at, role, linked) {
  const drafted = moveOf(at.stage, role);
  const lines = [`*Your turn* — ${linked} is at *${STAGE_LABEL[at.stage]}*.`];
  if (drafted?.command) {
    const command = drafted.command.replaceAll("<id>", at.id);
    lines.push(`${opening(drafted.move)}: \`${command}\``);
  }
  return lines.join("\n");
}

/** QA reaches staging to walk a pass, so QA's message names the sheet. */
export function stagingText(linked, sheetUrl) {
  const sheet = sheetUrl
    ? `<${sheetUrl}|the run sheet>`
    : // No per-change run tab exists in the store to link (decisions Q39), so
      // an unconfigured sheet is named in words rather than as a dead link.
      "the run sheet";
  return `*On staging* — ${linked} is on staging. Walk ${sheet}.`;
}

/**
 * The body one hand of a stage is sent, and which of the two it is.
 *
 * The rule is part of the message, so it lives with the words: QA reaches
 * staging to walk a pass, so QA's own message names the run sheet, and every
 * other hand of that stage - the release hand - gets the ordinary Your turn
 * (decisions Q18). The kind rides back because the caller keys the message by
 * it; written a second time anywhere, the manual and Slack would differ about
 * which sentence a hand was sent.
 */
export function toldBodyOf(at, role, { linked, sheetUrl }) {
  return at.stage === "on-staging" && role === "qa"
    ? { kind: "staging", text: stagingText(linked, sheetUrl) }
    : { kind: "your-turn", text: yourTurnText(at, role, linked) };
}

/** The artifact that is behind, and what moved before it. */
export function behindText(behind, linked) {
  const changed = behind.changed.map((one) => `\`${one}\``).join(", ");
  return `*Behind* — \`${behind.artifact}\` on ${linked} is behind ${changed || "what it was drawn from"}.`;
}

/**
 * One reply in the change's thread: what landed, whose word landed it, where
 * the change stands now, and whose turn it is.
 *
 * The change is not linked and not named — the reply hangs in its own thread,
 * where every reader already has it. A role of the stage the change names no
 * hand for is named as open, never left out and never written as its channel:
 * the reply is read by everybody on the change, so an unnamed hand is the one
 * thing in it somebody has to act on, and a stage with no role at all is the
 * only `nobody`. Nothing here says who pushed the landing; the caller decides
 * whether the reply is owed at all.
 */
export function landedText(at, landed) {
  const words = new Map();
  for (const { artifact, by } of landed) {
    words.set(by, [...(words.get(by) ?? []), `\`${artifact}\``]);
  }
  const what = [...words]
    .map(([by, artifacts]) => `${artifacts.join(", ")} by @${by}`)
    .join(", ");
  const turns = at.roles.map((role) =>
    at.hands[role]
      ? `@${at.hands[role]} (${ROLE_LABEL[role]})`
      : `${ROLE_LABEL[role]} (open)`,
  );
  const turn = turns.length > 0 ? turns.join(", ") : "nobody";
  return `*Landed* — ${what} · now at *${STAGE_LABEL[at.stage]}* · your turn: ${turn}`;
}
