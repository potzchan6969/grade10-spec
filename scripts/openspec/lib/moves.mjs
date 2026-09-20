/*
 * What a push moved: one reading of a tree, and the pure comparison of two
 * readings that says whose turn changed, what went newly behind, what landed,
 * and the message each of those is.
 *
 * Its own module, beside `notify.mjs`, so `movesBetween`, `newlyBehind`,
 * `landedBetween` and `messagesOf` are tested as what they are — a comparison
 * over two plain `Map`s, no git and no filesystem involved — without a
 * fixture store to drive them. `readingOf` is the one impure piece, kept here
 * because both halves of one push read a tree the same way; the push
 * workflow's own `readingAt`, which stands a worktree up to read the base,
 * stays beside its caller.
 */
import {
  behindOf,
  handOf,
  handOfArtifact,
} from "../../../tools/manual/src/api/stages.ts";
import { addressOf, linkOf, threadPartsOf } from "./notify.mjs";
import { readChangesAt } from "./store-read.mjs";
import {
  behindText,
  landedText,
  stagingText,
  yourTurnText,
} from "./wording.mjs";

/** The three bodies, re-exported: they moved to `wording.mjs` so the manual's
 * Told now block composes the same sentences without dragging a `node:fs`
 * import into the browser, and every reader that had them from here still
 * does. */
export { behindText, landedText, stagingText, yourTurnText };

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
      landedBy: change.landedBy ?? {},
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
    fresh.push({ id, artifact: first.artifact, changed: first.changed });
  }
  return fresh;
}

/**
 * What each change's `landed_by:` gained or changed between the two readings.
 *
 * One entry per change, naming the artifacts that landed and the handle whose
 * word landed each, in the record's own order — which is the order the
 * landing wrote them in. An entry that changed hands is a landing too: the
 * artifact reached `main` again on somebody else's word.
 */
export function landedBetween(base, head) {
  const landings = [];
  for (const [id, at] of head) {
    const was = base.get(id)?.landedBy ?? {};
    const landed = Object.entries(at.landedBy)
      .filter(([artifact, by]) => was[artifact] !== by)
      .map(([artifact, by]) => ({ artifact, by }));
    if (landed.length > 0) landings.push({ id, landed });
  }
  return landings;
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

/**
 * One message per move, addressed and keyed.
 *
 * The key is the move: `<change>:<stage>:<role>` for a turn,
 * `<change>:behind:<artifact>` for an artifact and `<change>:landed:<head>`
 * for a landing, so a re-run of one push reads its own keys back and sends
 * nothing twice, while a stage re-entered after a revert is a different push
 * and is told again. `options.pushHead` is the push's own head, the one thing
 * a landing's key needs. Each message also carries the change's own id, so a
 * caller filters a change it drops by it directly rather than splitting the
 * key back apart.
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

  // The thread hears what landed before the hands are told whose turn it is.
  // Every landing the change has a thread for is composed here, and whether
  // it is owed at all is the caller's: a run's own landing marks its commit
  // and the caller drops it, which takes a git call and cannot be read from
  // two `Map`s. The key is the push's own head, so a re-run of one push posts
  // nothing twice.
  for (const { id, landed } of landedBetween(base, head)) {
    const at = head.get(id);
    const thread = threadPartsOf(at.thread);
    if (!thread) continue;
    messages.push({
      key: `${id}:landed:${options.pushHead}`,
      id,
      kind: "landed",
      to: "channel",
      channel: thread.channel,
      threadTs: thread.ts,
      text: landedText(at, landed),
    });
  }

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
