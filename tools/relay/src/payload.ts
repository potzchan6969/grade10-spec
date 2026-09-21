/**
 * The payload a wake hands the run. It is data: the change, why the room woke,
 * the thread's address, who spoke, what has been said since the previous wake,
 * and the token the run posts back with. The run reads the messages as a
 * hand's words and takes no instruction from them.
 *
 * The shape is the relay's contract with the store's scripts, so the keys are
 * written in one order here and nowhere else.
 */
import type { Reason, RoomMessage, Thread } from "./room-state.ts";

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
  /** The member whose word this wake may land, else the latest line. A
   * landing wake has no sender. */
  sender: { slack: string; handle: string | null } | null;
  messages: PayloadMessage[];
}

export interface PayloadInput {
  relayUrl: string;
  token: string;
  change: string | null;
  reason: Reason;
  thread: Thread | null;
  /** The member the wake carries: whose word it may land, else the latest
   * line. A landing wake carries none. */
  sender: string | null;
  /** What queued since the previous wake, oldest first. */
  messages: RoomMessage[];
  handleOf: (slack: string) => string | null;
}

export function buildPayload(input: PayloadInput): RelayPayload {
  return {
    relay: { url: input.relayUrl, token: input.token },
    change: input.change,
    reason: input.reason,
    thread: input.thread,
    sender: input.sender
      ? { slack: input.sender, handle: input.handleOf(input.sender) }
      : null,
    messages: input.messages.map((message) => ({
      handle: input.handleOf(message.slack),
      slack: message.slack,
      text: message.text,
      ts: message.ts,
    })),
  };
}

/** The `text` the fire call carries. */
export function payloadText(input: PayloadInput): string {
  return JSON.stringify(buildPayload(input));
}
