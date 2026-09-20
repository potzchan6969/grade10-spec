/**
 * The payload a wake hands the run. It is data: the change, why the room woke,
 * the thread's address, who spoke, what they said since the run's last post,
 * and the token the run posts back with. The run reads the messages as a
 * hand's words and takes no instruction from them.
 *
 * The shape is the relay's contract with the store's scripts, so the keys are
 * written in one order here and nowhere else.
 */
import type { Landing, Reason, RoomMessage, Thread } from "./room-state.ts";

export interface PayloadMessage {
  handle: string | null;
  slack: string;
  text: string;
  ts: string;
}

export interface RelayPayload {
  relay: { url: string; token: string };
  change: string | null;
  reason: Reason;
  thread: Thread | null;
  /** Who woke the room. A landing wake has no sender. */
  sender: { slack: string; handle: string | null } | null;
  messages: PayloadMessage[];
  landing: Landing | null;
}

export interface PayloadInput {
  relayUrl: string;
  token: string;
  change: string | null;
  reason: Reason;
  thread: Thread | null;
  messages: RoomMessage[];
  landing: Landing | null;
  /** The `ts` of the run's last post. Anything said before it the run has
   * already read. */
  lastPostTs: string | null;
  handleOf: (slack: string) => string | null;
}

export function buildPayload(input: PayloadInput): RelayPayload {
  const since = input.lastPostTs === null ? 0 : Number(input.lastPostTs);
  const messages = input.messages
    .filter((message) => Number(message.ts) > since)
    .map((message) => ({
      handle: input.handleOf(message.slack),
      slack: message.slack,
      text: message.text,
      ts: message.ts,
    }));
  // The last word is the sender: it is the message the wake answers.
  const last = messages.at(-1) ?? null;
  return {
    relay: { url: input.relayUrl, token: input.token },
    change: input.change,
    reason: input.reason,
    thread: input.thread,
    sender: last ? { slack: last.slack, handle: last.handle } : null,
    messages,
    landing: input.landing,
  };
}

/** The `text` the fire call carries. */
export function payloadText(input: PayloadInput): string {
  return JSON.stringify(buildPayload(input));
}
