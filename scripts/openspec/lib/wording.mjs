/*
 * The words a message says, and nothing about who it reaches.
 *
 * Its own module, with no `node:` import of its own, because two readers
 * compose the same sentences: the push workflow, which sends them, and the
 * manual's Told now block, which shows a hand exactly what they are being
 * told. A second composer anywhere would have the manual say one thing and
 * Slack another about the same change, so every reader of a sentence reads it
 * from here — no module re-exports one.
 *
 * Slack `mrkdwn` is the one dialect here — `*bold*`, `` `code` `` and
 * `<url|title>`. The link is the caller's: the workflow builds it from the
 * workspace and the manual from its own route, and the sentence around it is
 * the same either way.
 */
import {
  moveOf,
  STAGE_LABEL,
} from "../../../tools/openspec-store/src/stages.ts";

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

/** A change's own page in the OpenSpec viewer: `<openspecUrl>/#/change/<id>`,
 * what a message links to where the record names no thread. */
export function changePageOf(openspecUrl, id) {
  return `${openspecUrl.replace(/\/$/, "")}/#/change/${encodeURIComponent(id)}`;
}

/**
 * The change, linked: its thread's permalink where the record names one, the
 * change page otherwise — title escaped, so a change named with `<` or `&`
 * reads as text and not as more `mrkdwn`.
 *
 * One function, because both scripts build this link the same way: the push
 * workflow's Your turn and Behind messages carry the thread where the record
 * names one, and the digest — which never reads a thread — always gets the
 * change page.
 */
export function linkOf({ openspecUrl, workspaceUrl, thread, id, title }) {
  const url =
    permalinkOf(workspaceUrl, thread) ?? changePageOf(openspecUrl, id);
  return linkedOf(url, title);
}

/** `<channel>/<ts>` as the record writes a thread, split for the API. */
export function threadPartsOf(thread) {
  const [channel, ts] = String(thread ?? "").split("/");
  return channel && ts ? { channel, ts } : undefined;
}

/** A thread's permalink: this workspace's host in front of the path
 * `wording.mjs` writes, which the manual puts Slack's own host in front of. */
export function permalinkOf(workspaceUrl, thread) {
  const path = threadPathOf(thread);
  if (!path || !workspaceUrl) return undefined;
  const host = workspaceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}${path}`;
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

/**
 * The body one hand of a stage is sent, and which of the two it is.
 *
 * Deployment availability has its own evidence path. This message is only
 * about the change's planning or implementation stage.
 */
export function toldBodyOf(at, role, { linked }) {
  const lines = [yourTurnText(at, role, linked)];
  return { kind: "your-turn", text: lines.join("\n") };
}
