/**
 * The Slack side: the v0 signature, the envelope read down to one message, the
 * events that are ignored, the word a message says, the room it wakes, the
 * Confirm button and the press it sends back, and the two calls that post.
 *
 * Nothing here holds state. The signature's clock and the app's own user id
 * arrive as arguments so both rules can be read in a test.
 */
import { equalBytes, fromHex, hmacSha256, toHex } from "./bytes.ts";
import type { Thread } from "./room-state.ts";
import { threadRoom } from "./rooms.ts";

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

/** The two words that land, as `wordOf` leaves them. */
export const LANDING_WORDS = ["land", "land with recommendations"];

/** Whether a message is one of them, and nothing else: a landing is one of
 * two words however the rest of the thread reads. */
export function isLandingWord(text: string | null): boolean {
  return LANDING_WORDS.includes(wordOf(text ?? ""));
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
  return (named ?? appUser).trim();
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
    const thread = { channel: message.channel, ts: message.ts };
    return {
      room: threadRoom(thread),
      thread,
      reason: "plan",
      requireRoom: false,
    };
  }
  const thread = { channel: message.channel, ts: message.threadTs };
  return {
    room: threadRoom(thread),
    thread,
    reason: "message",
    requireRoom: !message.mentionsApp,
  };
}

/** The one `action_id` the relay issues, and the only one it answers: a
 * button somebody else's app drew is not this relay's word. */
export const CONFIRM_ACTION = "confirm";

/** The button a run asks for. Both words are the run's own — the relay
 * composes no label and invents no word. */
export interface Confirm {
  /** What the button reads, such as `Confirm proposal`. */
  label: string;
  /** The word a press says, as a thread reply would say it. */
  word: string;
}

/** One Block Kit block. The relay draws three shapes and nothing else, so
 * this is what the two calls take rather than a model of Block Kit. */
export type SlackBlock = Record<string, unknown>;

/** A line and one button under it. The text stays the message's own `text`
 * too, which is what a notification and a client with no blocks read. */
export function confirmBlocks(text: string, confirm: Confirm): SlackBlock[] {
  return [
    { type: "section", text: { type: "mrkdwn", text } },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: confirm.label },
          action_id: CONFIRM_ACTION,
          value: confirm.word,
          style: "primary",
        },
      ],
    },
  ];
}

/** The same line with the button gone and a context line in its place: the
 * press is in, and nobody presses twice. */
export function confirmedBlocks(text: string, note: string): SlackBlock[] {
  return [
    { type: "section", text: { type: "mrkdwn", text } },
    { type: "context", elements: [{ type: "mrkdwn", text: note }] },
  ];
}

/** One press, read down to what the relay does with it. */
export interface SlackPress {
  channel: string;
  /** The thread the press belongs to: the root of the message the button is
   * on. */
  threadTs: string;
  /** The message the button is on, which the relay updates. */
  messageTs: string;
  /** The press's own timestamp, which keys it. */
  actionTs: string;
  user: string;
  /** The word this press says. */
  word: string;
  /** What the pressed button reads, which the thread quotes. */
  label: string;
  /** The message's own text, which the update keeps. */
  text: string;
}

export type SlackPressIgnored =
  | "not-block-actions"
  | "not-a-confirm"
  | "no-thread";

export type SlackAction =
  | { kind: "confirm"; press: SlackPress }
  | { kind: "ignored"; why: SlackPressIgnored };

interface ActionEnvelope {
  type?: string;
  user?: { id?: string };
  container?: {
    channel_id?: string;
    message_ts?: string;
    thread_ts?: string;
  };
  message?: { text?: string; ts?: string; thread_ts?: string };
  actions?: {
    action_id?: string;
    value?: string;
    action_ts?: string;
    text?: { text?: string };
  }[];
}

/**
 * An interaction arrives as a form with one field, `payload`, holding the
 * JSON. The field is read off the body as it arrived, because that body is
 * what the signature covers.
 */
export function actionPayload(body: string): unknown | null {
  const payload = new URLSearchParams(body).get("payload");
  if (payload === null) return null;
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
}

/**
 * The payload as one press, or the reason it is ignored. Slack sends every
 * interaction of the app to the one request URL, so a view, a shortcut and
 * another app's button all arrive here and none of them is a word.
 *
 * The thread is the container's, then the message's, then the message the
 * button is on — a button on a message with no thread of its own is its own
 * root, which is where a reply to it would go.
 */
export function parseSlackAction(raw: unknown): SlackAction {
  const body = (raw ?? {}) as ActionEnvelope;
  if (body.type !== "block_actions")
    return { kind: "ignored", why: "not-block-actions" };
  const action = body.actions?.[0];
  const word = String(action?.value ?? "").trim();
  if (!action || action.action_id !== CONFIRM_ACTION || word === "")
    return { kind: "ignored", why: "not-a-confirm" };
  const channel = String(body.container?.channel_id ?? "");
  const messageTs = String(
    body.container?.message_ts ?? body.message?.ts ?? "",
  );
  const threadTs = String(
    body.container?.thread_ts ?? body.message?.thread_ts ?? messageTs,
  );
  if (channel === "" || threadTs === "")
    return { kind: "ignored", why: "no-thread" };
  return {
    kind: "confirm",
    press: {
      channel,
      threadTs,
      messageTs,
      actionTs: String(action.action_ts ?? messageTs),
      user: String(body.user?.id ?? ""),
      word,
      label: String(action.text?.text ?? word),
      text: String(body.message?.text ?? ""),
    },
  };
}

/** The press as the thread reply it stands for: the same word, said by the
 * member who pressed it, in the thread the button is in. A press is routed
 * and queued exactly as that reply, so a button and a typed word are one
 * word. */
export function pressedMessage(press: SlackPress): SlackMessage {
  return {
    channel: press.channel,
    ts: press.actionTs,
    threadTs: press.threadTs,
    user: press.user,
    text: press.word,
    mentionsApp: false,
  };
}

/** What the thread reads when a button is pressed, so the transcript carries
 * the word whichever way it was said. A member the team map does not name
 * says so: the relay lands nothing on a word it cannot attribute. */
export function pressedLine(press: SlackPress, handle: string | null): string {
  return handle
    ? `@${handle} pressed *${press.label}*`
    : `<@${press.user}> pressed *${press.label}* — the team map does not name this member, so nothing lands on it`;
}

/** The context line that takes the button's place. */
export function confirmedLine(
  press: SlackPress,
  handle: string | null,
): string {
  return `Confirmed by ${handle ? `@${handle}` : `<@${press.user}>`}`;
}

/** Post to a thread, or to the channel when there is no thread. `blocks`
 * draws the line as Block Kit, with `text` left as the fallback. Returns the
 * posted `ts`. */
export async function postMessage(
  token: string,
  channel: string,
  text: string,
  threadTs?: string,
  blocks?: SlackBlock[],
): Promise<string> {
  const posted = (await slackCall(token, "chat.postMessage", {
    channel,
    text,
    ...(threadTs ? { thread_ts: threadTs } : {}),
    ...(blocks ? { blocks } : {}),
  })) as { ts?: string };
  return String(posted.ts ?? "");
}

/** One message's blocks replaced, its text kept. What a press leaves behind:
 * the caller logs a refusal rather than failing on it, since the word is
 * already queued. */
export async function updateMessage(
  token: string,
  channel: string,
  ts: string,
  text: string,
  blocks: SlackBlock[],
): Promise<void> {
  await slackCall(token, "chat.update", { channel, ts, text, blocks });
}

/** One call on Slack's web API, answered or thrown. A call that does not land
 * is the run's only voice going missing, so it stops the step rather than
 * being swallowed. */
async function slackCall(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  const answered = (await response.json()) as {
    ok?: boolean;
    error?: string;
  };
  if (!answered.ok) throw new Error(`slack ${method}: ${answered.error}`);
  return answered as Record<string, unknown>;
}
