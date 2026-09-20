/**
 * The Slack side: the v0 signature, the envelope read down to one message, the
 * events that are ignored, the word a message says, the room it wakes, and the
 * one call that posts.
 *
 * Nothing here holds state. The signature's clock and the app's own user id
 * arrive as arguments so both rules can be read in a test.
 */
import { equalBytes, fromHex, hmacSha256, toHex } from "./bytes.ts";
import type { Thread } from "./room-state.ts";

/** Slack's replay window. A request signed longer ago than this is refused
 * whatever its signature says. */
export const SIGNATURE_WINDOW_MS = 5 * 60 * 1000;

export interface SlackMessage {
  channel: string;
  ts: string;
  /** The thread's root, or null for a top-level message. */
  threadTs: string | null;
  user: string;
  text: string;
  mentionsApp: boolean;
}

export type SlackIgnored =
  | "bot_id"
  | "subtype"
  | "own-message"
  | "not-a-message"
  | "no-event";

export type SlackRequest =
  | { kind: "url_verification"; challenge: string }
  | { kind: "message"; message: SlackMessage }
  | { kind: "ignored"; why: SlackIgnored };

/**
 * Slack signs `v0:<timestamp>:<body>` with the signing secret and sends the
 * HMAC as `v0=<hex>`. The body must be the bytes as they arrived: a body read
 * as JSON and written back has a different signature.
 */
export async function verifySlackSignature(
  secret: string,
  request: {
    timestamp: string | null;
    signature: string | null;
    body: string;
  },
  nowMs: number,
): Promise<boolean> {
  const { timestamp, signature, body } = request;
  if (!timestamp || !signature) return false;
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds)) return false;
  if (Math.abs(nowMs - seconds * 1000) > SIGNATURE_WINDOW_MS) return false;
  if (!signature.startsWith("v0=")) return false;
  const expected = await hmacSha256(secret, `v0:${timestamp}:${body}`);
  return equalBytes(fromHex(signature.slice(3)), expected);
}

/** The hex signature of a body, for the workflow's own smoke test and for a
 * test's fixtures. */
export async function signSlackRequest(
  secret: string,
  timestamp: string,
  body: string,
): Promise<string> {
  return `v0=${toHex(await hmacSha256(secret, `v0:${timestamp}:${body}`))}`;
}

/**
 * The word a message says: the app's mention off the front, the ends trimmed,
 * the case folded. `<@U0APP> Land` and `land` are the same word, and a
 * mention in the middle of a sentence is left where it is — the message is
 * then a sentence and not a word.
 */
export function wordOf(text: string): string {
  return text
    .replace(/^\s*<@[^>]+>/, "")
    .trim()
    .toLowerCase();
}

interface SlackEnvelope {
  type?: string;
  challenge?: string;
  authorizations?: { user_id?: string }[];
  event?: {
    type?: string;
    subtype?: string;
    bot_id?: string;
    channel?: string;
    ts?: string;
    thread_ts?: string;
    user?: string;
    text?: string;
  };
}

/**
 * The envelope as one message, or the reason it is ignored. An edit, a join and
 * the app's own reply all arrive on the same subscription as a hand's sentence,
 * and a reply the relay itself posted would otherwise wake the room again.
 *
 * `appUser` is the app's own member id from the deployment; the envelope's
 * `authorizations` carries it too and is read first. An app the relay cannot
 * name is an app nobody addressed: a message that mentions somebody else
 * would otherwise open a room.
 */
export function parseSlackRequest(raw: unknown, appUser: string): SlackRequest {
  const body = (raw ?? {}) as SlackEnvelope;
  if (body.type === "url_verification")
    return {
      kind: "url_verification",
      challenge: String(body.challenge ?? ""),
    };
  const event = body.event;
  if (body.type !== "event_callback" || !event)
    return { kind: "ignored", why: "no-event" };
  if (event.type !== "message" && event.type !== "app_mention")
    return { kind: "ignored", why: "not-a-message" };
  if (event.bot_id) return { kind: "ignored", why: "bot_id" };
  if (event.subtype) return { kind: "ignored", why: "subtype" };
  const app = appOf(body, appUser);
  if (app && event.user === app) return { kind: "ignored", why: "own-message" };
  const text = String(event.text ?? "");
  return {
    kind: "message",
    message: {
      channel: String(event.channel ?? ""),
      ts: String(event.ts ?? ""),
      threadTs:
        event.thread_ts && event.thread_ts !== event.ts
          ? event.thread_ts
          : null,
      user: String(event.user ?? ""),
      text,
      mentionsApp: app ? text.includes(`<@${app}>`) : false,
    },
  };
}

/** The app's own member id: the envelope's, or the deployment's where the
 * envelope names none. */
function appOf(body: SlackEnvelope, appUser: string): string {
  const named = body.authorizations?.find((one) => one.user_id)?.user_id;
  return String(named ?? appUser ?? "").trim();
}

export interface SlackRoute {
  /** The room the message wakes, by name: `channel/ts` of the thread's root
   * until a run names the change the thread is about. */
  room: string;
  /** The thread the room posts to, beside the name rather than inside it. */
  thread: Thread;
  reason: "plan" | "message";
  /** A thread reply that mentions nobody wakes a room that already exists and
   * opens none. */
  requireRoom: boolean;
}

/**
 * Which room a message wakes, and why. A message outside the planning channel
 * and a top-level message that mentions nobody wake nothing.
 */
export function routeMessage(
  message: SlackMessage,
  planningChannel: string,
): SlackRoute | null {
  if (message.channel !== planningChannel) return null;
  if (message.threadTs === null) {
    if (!message.mentionsApp) return null;
    // The change is unknown until the run names it, so a first sentence is a
    // plan wake on a room keyed by the sentence itself.
    return {
      room: `${message.channel}/${message.ts}`,
      thread: { channel: message.channel, ts: message.ts },
      reason: "plan",
      requireRoom: false,
    };
  }
  return {
    room: `${message.channel}/${message.threadTs}`,
    thread: { channel: message.channel, ts: message.threadTs },
    reason: "message",
    requireRoom: !message.mentionsApp,
  };
}

/** Post to a thread, or to the channel when there is no thread. Returns the
 * posted `ts`. */
export async function postMessage(
  token: string,
  channel: string,
  text: string,
  threadTs?: string,
): Promise<string> {
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(
      threadTs ? { channel, text, thread_ts: threadTs } : { channel, text },
    ),
  });
  const posted = (await response.json()) as {
    ok?: boolean;
    ts?: string;
    error?: string;
  };
  // A post that does not land is the run's only voice going missing, so it
  // stops the step rather than being swallowed.
  if (!posted.ok) throw new Error(`slack chat.postMessage: ${posted.error}`);
  return String(posted.ts ?? "");
}
