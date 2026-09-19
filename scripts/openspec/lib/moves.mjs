/*
 * What a push moved: one reading of a tree, and the pure comparison of two
 * readings that says whose turn changed, what went newly behind, and the
 * message each of those is.
 *
 * Its own module, beside `notify.mjs`, so `movesBetween`, `newlyBehind` and
 * `messagesOf` are tested as what they are — a comparison over two plain
 * `Map`s, no git and no filesystem involved — without a fixture store to
 * drive them. `readingOf` is the one impure piece, kept here because both
 * halves of one push read a tree the same way; the push workflow's own
 * `readingAt`, which stands a worktree up to read the base, stays beside its
 * caller.
 */
import {
  behindOf,
  handOf,
  handOfArtifact,
  moveOf,
  STAGE_LABEL,
} from "../../../tools/manual/src/api/stages.ts";
import { addressOf, linkOf, threadPartsOf } from "./notify.mjs";
import { readChangesAt } from "./store-read.mjs";

/** Every change of one tree: its stage, whose turn it is, the handle each of
 * those roles names, and the artifacts behind what they were drawn from. */
export async function readingOf(root) {
  const { changes, artifactsOf } = await readChangesAt(root);
  const read = new Map();
  for (const change of changes) {
    const stage = change.stage;
    read.set(change.id, {
      id: change.id,
      title: change.title,
      stage,
      roles: handOf(change, stage, artifactsOf(change)),
      artifacts: artifactsOf(change),
      hands: change.hands ?? {},
      thread: change.thread,
      behind: behindOf(change, artifactsOf(change)),
    });
  }
  return read;
}

/**
 * Whose turn changed between the two readings.
 *
 * A move is the pair `(stage, hands)` changing: a role that holds the turn at
 * the head and did not hold it at the base is told, and so is one that held
 * it under another handle — removing the hand of the role a change sits on is
 * a move, which is what makes the role's channel hear about it once.
 */
export function movesBetween(base, head) {
  const moves = [];
  for (const [id, at] of head) {
    const was = base.get(id);
    for (const role of at.roles) {
      const held =
        was?.roles.includes(role) === true &&
        was.hands[role] === at.hands[role];
      if (held) continue;
      moves.push({ id, role, stage: at.stage, hand: at.hands[role] });
    }
  }
  return moves;
}

/** The earliest artifact of each change that was not behind at the base and
 * is behind at the head — the one the card names and the one the message goes
 * to. An artifact behind already is told about once and not again. */
export function newlyBehind(base, head) {
  const fresh = [];
  for (const [id, at] of head) {
    const was = new Set(
      (base.get(id)?.behind ?? []).map((one) => one.artifact),
    );
    const first = at.behind.find((one) => !was.has(one.artifact));
    if (!first) continue;
    fresh.push({
      id,
      artifact: first.artifact,
      // One of the two, never both: the commit dates single out what changed,
      // and a recorded content id says something moved without saying which.
      changed: first.changed ?? first.before ?? [],
    });
  }
  return fresh;
}

/** The change, linked: its thread where the record names one, the change page
 * where it does not. */
function linkedTitle(at, { manualUrl, workspaceUrl }) {
  return linkOf({
    manualUrl,
    workspaceUrl,
    thread: at.thread,
    id: at.id,
    title: at.title,
  });
}

/** A sentence opens with a capital; the table writes the move in the words a
 * lane heading shows it in. */
const opening = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/** One body, whoever it reaches: the hand's own inbox, or the role's channel
 * where the change names no hand for it, which is the same message and not a
 * second kind. */
function yourTurnText(at, role, linked) {
  const drafted = moveOf(at.stage, role);
  const lines = [`*Your turn* — ${linked} is at *${STAGE_LABEL[at.stage]}*.`];
  if (drafted?.command) {
    const command = drafted.command.replaceAll("<id>", at.id);
    lines.push(`${opening(drafted.move)}: \`${command}\``);
  }
  return lines.join("\n");
}

function stagingText(linked, sheetUrl) {
  const sheet = sheetUrl
    ? `<${sheetUrl}|the run sheet>`
    : // No per-change run tab exists in the store to link (decisions Q39), so
      // an unconfigured sheet is named in words rather than as a dead link.
      "the run sheet";
  return `*On staging* — ${linked} is on staging. Walk ${sheet}.`;
}

function behindText(behind, linked) {
  const changed = behind.changed.map((one) => `\`${one}\``).join(", ");
  return `*Behind* — \`${behind.artifact}\` on ${linked} is behind ${changed || "what it was drawn from"}.`;
}

/**
 * One message per move, addressed and keyed.
 *
 * The key is the move: `<change>:<stage>:<role>` for a turn and
 * `<change>:behind:<artifact>` for an artifact, so a re-run of one push reads
 * its own keys back and sends nothing twice, while a stage re-entered after a
 * revert is a different push and is told again. Each message also carries the
 * change's own id, so a caller filters a suppressed change by it directly
 * rather than splitting the key back apart.
 */
export function messagesOf(base, head, map, options) {
  const messages = [];
  const skipped = [];
  const take = (at, key, kind, role, hand, text) => {
    const address = addressOf(map, { role, hand });
    if (address.skipped) {
      skipped.push({ key, id: at.id, kind, hand, why: address.skipped });
      return;
    }
    const thread = threadPartsOf(at.thread);
    messages.push({
      key,
      id: at.id,
      kind,
      role,
      ...(hand ? { hand } : {}),
      to: address.to,
      channel: address.channel,
      // A reply only where the message lands in the thread's own channel: a
      // direct message is not a reply to it.
      ...(address.to === "channel" && thread?.channel === address.channel
        ? { threadTs: thread.ts }
        : {}),
      text,
    });
  };

  for (const move of movesBetween(base, head)) {
    const at = head.get(move.id);
    const linked = linkedTitle(at, options);
    const key = `${move.id}:${move.stage}:${move.role}`;
    // QA reaches staging to walk a pass, so QA's message names the sheet; the
    // release hand's is the ordinary Your turn (decisions Q18).
    const staging = move.stage === "on-staging" && move.role === "qa";
    take(
      at,
      key,
      staging ? "staging" : "your-turn",
      move.role,
      move.hand,
      staging
        ? stagingText(linked, options.sheetUrl)
        : yourTurnText(at, move.role, linked),
    );
  }

  for (const behind of newlyBehind(base, head)) {
    const at = head.get(behind.id);
    const role = at ? handOfArtifact(behind.artifact, at.artifacts) : undefined;
    if (!role) continue;
    take(
      at,
      `${behind.id}:behind:${behind.artifact}`,
      "behind",
      role,
      at.hands[role],
      behindText(behind, linkedTitle(at, options)),
    );
  }
  return { messages, skipped };
}
