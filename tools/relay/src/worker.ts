/**
 * The router. What it serves and nothing else: Slack's events, a Confirm
 * button pressed, the code host's push, the workflow's wake, the four calls a
 * running session makes, where `main` is and the socket a page listens on,
 * and 404.
 *
 * Slack is answered inside three seconds and the work happens in
 * `ctx.waitUntil`, because a Slack delivery that is not acknowledged is
 * retried. A push is answered by the live object itself, which is one hop with
 * no network behind it. Every rule the relay has lives in the modules this file
 * calls.
 *
 * It fails closed at the entry: a deployment missing one of the secrets
 * nothing works without answers 500 and names the secret, rather than
 * verifying every request against the empty string.
 */

import { equalBytes, utf8 } from "./bytes.ts";
import { type Env, missingSecret } from "./env.ts";
import { readFileAt } from "./github.ts";
import {
  IS_SHA,
  parseGithubEvent,
  verifyGithubSignature,
} from "./github-events.ts";
import { isUpgrade } from "./live-state.ts";
import type { Thread } from "./room-state.ts";
import { changeRoom } from "./rooms.ts";
import {
  callLive,
  callRoom,
  json,
  type LiveOp,
  type RoomOp,
  reasonOf,
} from "./rpc.ts";
import {
  actionPayload,
  type Confirm,
  confirmedBlocks,
  confirmedLine,
  type Presser,
  parseSlackAction,
  parseSlackRequest,
  postMessage,
  pressedLine,
  pressedMessage,
  routeMessage,
  type SlackMessage,
  type SlackPress,
  type SlackRoute,
  updateMessage,
  verifySlackSignature,
} from "./slack.ts";
import { slackHandles, TEAM_MAP } from "./team.ts";
import { verifyWakeToken } from "./token.ts";

export { Live } from "./live.ts";
export { Room } from "./room.ts";

/** One room, addressed by name: `change/<id>`, and `channel/ts` for a thread
 * whose change no run has named yet. */
function roomByName(env: Env, name: string): DurableObjectStub {
  return env.ROOM.get(env.ROOM.idFromName(name));
}

/** The one live object. `main` is one line, so every page listens to the same
 * object and a push is one call. */
function liveObject(env: Env): DurableObjectStub {
  return env.LIVE.get(env.LIVE.idFromName("main"));
}

/** What a browser needs to read the head from the manual's own origin, and to
 * read it again rather than a copy: any origin may read it, and an answer that
 * is true until the next push is cached nowhere. */
const HEAD_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
};

/** Every answer the head's surface writes carries them, not the object's alone:
 * a page refused by the entry's secret check, by the method gate or by a live
 * object that could not be reached reads the reason, where an answer with no
 * such header reaches it as a CORS error and nothing more. */
function withHead(path: string, answer: Response): Response {
  if (path !== "/head") return answer;
  const headers = new Headers(answer.headers);
  for (const [name, value] of Object.entries(HEAD_HEADERS))
    headers.set(name, value);
  return new Response(answer.body, { status: answer.status, headers });
}

/** The text as JSON, or null. One reading, so every surface answers a body it
 * cannot read the same way. */
function parseJson(text: string): unknown | null {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function readJson(request: Request): Promise<unknown | null> {
  return parseJson(await request.text());
}

const notJson = () => json(400, { reason: "not-json" });
/** Whether Slack signed this body. An event and a press are verified the same
 * way, over the bytes as they arrived. */
function slackSigned(
  request: Request,
  env: Env,
  body: string,
): Promise<boolean> {
  return verifySlackSignature(
    env.SLACK_SIGNING_SECRET,
    {
      timestamp: request.headers.get("x-slack-request-timestamp"),
      signature: request.headers.get("x-slack-signature"),
      body,
    },
    Date.now(),
  );
}

async function onSlackEvents(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const body = await request.text();
  if (!(await slackSigned(request, env, body)))
    return json(401, { reason: "bad-signature" });
  const parsed = parseJson(body);
  if (parsed === null) return notJson();
  const event = parseSlackRequest(parsed, env.SLACK_APP_USER);
  if (event.kind === "url_verification")
    return json(200, { challenge: event.challenge });
  if (event.kind === "ignored") return json(200, { ignored: event.why });
  const route = routeMessage(event.message, env.PLANNING_CHANNEL);
  if (!route) return json(200, { ignored: "not-addressed" });
  ctx.waitUntil(
    queueMessage(
      env,
      route,
      event.message,
      // Slack retries a delivery it did not see acknowledged, and one message
      // is one channel and one `ts` however many times it arrives.
      `slack:${event.message.channel}/${event.message.ts}`,
    ),
  );
  return json(200, { queued: true });
}

/** One line queued on the room a route names. A press is queued by this same
 * call, because a press is the word: the two differ in the key that dedupes
 * them and in nothing else. */
function queueMessage(
  env: Env,
  route: SlackRoute,
  message: SlackMessage,
  dedupe: string,
): Promise<Queued> {
  return queue(env, route.thread, roomByName(env, route.room), {
    op: "enqueue",
    reason: route.reason,
    requireRoom: route.requireRoom,
    dedupe,
    thread: route.thread,
    message: {
      slack: message.user,
      text: message.text,
      ts: message.ts,
    },
  });
}

/** What a room answered an op with: the line queued, or the reason nothing
 * was and whether the thread has been told of it already. A 200 is not a word
 * queued — the room answers one for a reply that opens no room and for a
 * delivery it has already taken — so the caller reads the answer rather than
 * the status. */
type Queued = { queued: true } | { queued: false; why: string; told: boolean };

/**
 * The work behind the answer Slack already read. The room's answer is read
 * rather than dropped: a message that reached no room is a hand waiting for a
 * reply that is never coming, so the thread is told what the room could not
 * be asked or what it answered. A refusal of the room's own rules is answered
 * to the caller, which knows whether that is a thread's line or nothing at
 * all — a reply that opens no room says nothing, a press on a summary whose
 * room is gone does.
 */
async function queue(
  env: Env,
  thread: Thread,
  room: DurableObjectStub,
  op: RoomOp,
): Promise<Queued> {
  let why: string;
  try {
    const answer = await callRoom(room, op);
    if (answer.ok) {
      const read = (parseJson(await answer.text()) ?? {}) as {
        queued?: unknown;
        why?: unknown;
      };
      if (read.queued === true) return { queued: true };
      return {
        queued: false,
        why: String(read.why ?? "the room queued nothing"),
        told: false,
      };
    }
    why = `the room answered ${answer.status}`;
  } catch (error) {
    console.error(
      `relay: the room for ${thread.channel}/${thread.ts} could not be reached: ${reasonOf(error)}`,
    );
    why = "the room could not be reached";
  }
  await tell(env, thread, didNotReach(why));
  return { queued: false, why, told: true };
}

/** The one sentence for a word that reached no round. The room refuses by its
 * own rules in one token, which says nothing to a hand reading the thread, so
 * each is spelled here. */
function didNotReach(why: string): string {
  return `This message did not reach a round: ${ROOM_REFUSED[why] ?? why}.`;
}

/** The room's own refusals, in the thread's words. */
const ROOM_REFUSED: Record<string, string> = {
  "no-room": "no round is open on this thread",
};

/** One line in the thread, from the relay's own token. A post that fails
 * itself is logged: there is nowhere else to say it. */
async function tell(env: Env, thread: Thread, text: string): Promise<void> {
  try {
    await postMessage(env.SLACK_BOT_TOKEN, thread.channel, text, thread.ts);
  } catch (error) {
    console.error(`relay: "${text}" did not post: ${reasonOf(error)}`);
  }
}

/** Slack reads a 2xx body on an interaction as a message to draw in the
 * thread, so a press is answered with nothing at all. */
const empty = () => new Response(null, { status: 200 });

/**
 * A Confirm button pressed. The press is the word: it is routed exactly as a
 * thread reply saying it, so a button and a typed word reach the same room
 * through the same rules, and a press outside the planning channel wakes as
 * much as a message there — nothing.
 *
 * Slack is answered inside three seconds and the work happens in
 * `ctx.waitUntil`, as an event is.
 */
async function onSlackActions(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const body = await request.text();
  if (!(await slackSigned(request, env, body)))
    return json(401, { reason: "bad-signature" });
  const payload = actionPayload(body);
  // A signed body with no press in it is Slack's own, not a bad request:
  // `ssl_check=1` arrives here when the request URL is saved, and a 400 would
  // fail that save.
  if (payload === null) return empty();
  const action = parseSlackAction(payload);
  if (action.kind === "ignored") return ignored(action.why);
  const route = routeMessage(
    pressedMessage(action.press),
    env.PLANNING_CHANNEL,
  );
  if (!route) return ignored("not-addressed");
  ctx.waitUntil(pressed(env, route, action.press));
  return empty();
}

/** A press the relay does nothing with. Slack draws a 2xx body in the thread,
 * so the reason is said in the log: an answer carrying it would post it. */
function ignored(why: string): Response {
  console.log(`relay: a press was ignored: ${why}`);
  return empty();
}

/**
 * The work behind the answer Slack already read: the word queued as the
 * thread reply it stands for, the echo that puts it in the transcript, and
 * the button taken off the message.
 *
 * The echo and the button follow the word rather than the press: a press the
 * room did not take is a word that lands nothing, so nothing says it did and
 * the button stands to be pressed again.
 */
async function pressed(
  env: Env,
  route: SlackRoute,
  press: SlackPress,
): Promise<void> {
  const answer = await queueMessage(
    env,
    route,
    pressedMessage(press),
    // One press is one channel and one `action_ts`, however many times Slack
    // delivers it.
    `slack-action:${press.channel}/${press.actionTs}`,
  );
  if (!answer.queued) {
    // A duplicate is Slack delivering one press twice: the press before it
    // echoed the word and took the button off, so its retry says nothing.
    if (!answer.told && answer.why !== "duplicate")
      await tell(env, route.thread, didNotReach(answer.why));
    return;
  }
  const presser = await pressedBy(env, press);
  await tell(env, route.thread, pressedLine(press, presser));
  await taken(env, press, presser);
}

/** Who pressed, through the team map at `main`: the handle, the map naming
 * nobody, or the map not being readable at all. The three are apart because
 * only the second lands nothing — the landing check reads the same map and
 * refuses that word, where a map the relay could not read says nothing about
 * whom it names. One press is a person's own act, so the map is read once for
 * it and held nowhere; the landing's own reading is the room's. */
async function pressedBy(env: Env, press: SlackPress): Promise<Presser> {
  try {
    const handle = slackHandles(
      await readFileAt(
        { repo: env.REPO, token: env.GITHUB_TOKEN },
        TEAM_MAP,
        "main",
      ),
    ).get(press.user);
    return handle ? { handle } : { map: "unknown" };
  } catch (error) {
    console.error(
      `relay: the team map could not be read for ${press.user}: ${reasonOf(error)}`,
    );
    return { map: "unreadable" };
  }
}

/** The button off the message, a context line in its place, so nobody presses
 * twice. An update that fails is logged and nothing more: the word is already
 * queued and the thread already says who pressed it. */
async function taken(
  env: Env,
  press: SlackPress,
  presser: Presser,
): Promise<void> {
  try {
    await updateMessage(
      env.SLACK_BOT_TOKEN,
      press.channel,
      press.messageTs,
      press.text,
      confirmedBlocks(press.text, confirmedLine(press, presser)),
    );
  } catch (error) {
    console.error(
      `relay: the button on ${press.channel}/${press.messageTs} did not come off: ${reasonOf(error)}`,
    );
  }
}

/**
 * One ask of the live object, answered as the object answered it. A failure is
 * named and logged rather than left to reject the fetch handler, which is the
 * shape `queue()` holds for a room: an object the relay could not reach is a
 * line in the log and a reason in the code host's own delivery record.
 */
async function askLive(env: Env, op: LiveOp, what: string): Promise<Response> {
  try {
    return await callLive(liveObject(env), op);
  } catch (error) {
    console.error(
      `relay: the live object could not ${what}: ${reasonOf(error)}`,
    );
    return json(502, { reason: "live-unreachable" });
  }
}

/**
 * The code host's push. The webhook is subscribed to `push` alone, so a
 * delivery that is not a push, or not this store's `main`, is answered with the
 * reason and tells nobody: the head a page compares its own snapshot with is
 * this store's.
 */
async function onGithubEvents(request: Request, env: Env): Promise<Response> {
  const body = await request.text();
  const signed = await verifyGithubSignature(env.GITHUB_WEBHOOK_SECRET, {
    signature: request.headers.get("x-hub-signature-256"),
    body,
  });
  if (!signed) return json(401, { reason: "bad-signature" });
  const parsed = parseJson(body);
  if (parsed === null) return notJson();
  const event = parseGithubEvent(
    request.headers.get("x-github-event"),
    parsed,
    env.REPO,
  );
  // The delivery the code host sends the moment the webhook is saved, which is
  // that leg's smoke test.
  if (event.kind === "ping") return json(200, { pong: true });
  if (event.kind === "ignored") return json(200, { ignored: event.why });
  // The object's answer is the delivery's: the code host reads that the move
  // reached the object, rather than an ack the relay wrote before it knew.
  return askLive(env, { op: "moved", push: event.push }, "take the push");
}

/** Where `main` is, for a page that is polling and for one whose socket the
 * relay could not take. The object's answer is passed through as it stands;
 * the head's own headers are the entry's. */
async function onHead(env: Env): Promise<Response> {
  return askLive(env, { op: "head" }, "answer where `main` is");
}

/** A page's socket. The upgrade is the live object's to accept, and a read that
 * is not one is told so rather than left waiting. */
async function onLive(request: Request, env: Env): Promise<Response> {
  if (!isUpgrade(request)) return json(426, { reason: "upgrade-required" });
  return liveObject(env).fetch(request);
}

async function onWake(request: Request, env: Env): Promise<Response> {
  const given = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!equalBytes(utf8(given), utf8(env.WAKE_TOKEN)))
    return json(401, { reason: "bad-token" });
  const body = (await readJson(request)) as {
    change?: string;
    head?: string;
  } | null;
  if (body === null) return notJson();
  const change = String(body.change ?? "").trim();
  const head = String(body.head ?? "").trim();
  if (change === "") return json(400, { reason: "no-change" });
  // The head is what keys the wake: the same push wakes the relay once,
  // however many times the workflow's step runs, and a wake with no head
  // would wake it again on every run.
  if (head === "") return json(400, { reason: "no-head" });
  // The room's answer is the wake's answer: the workflow reads whether it
  // queued anything, and a duplicate says so rather than reading as a wake.
  return callRoom(roomByName(env, changeRoom(change)), {
    op: "enqueue",
    reason: "landing",
    change,
    dedupe: `wake:${change}/${head}`,
  });
}

async function onRun(
  request: Request,
  env: Env,
  token: string,
  call: string,
): Promise<Response> {
  const claims = await verifyWakeToken(env.TOKEN_SECRET, token, Date.now());
  if (!claims) return json(401, { reason: "bad-token" });
  const room = env.ROOM.get(env.ROOM.idFromString(claims.room));
  // The one GET: a question with no body, asked before every push.
  if (call === "alive")
    return callRoom(room, { op: "alive", wake: claims.wake });
  const body = (await readJson(request)) as Record<string, unknown> | null;
  if (body === null) return notJson();
  const chosen = opOf(call, claims.wake, body);
  if (!chosen) return json(404, { reason: "unknown-call" });
  if ("bad" in chosen) return json(400, { reason: chosen.bad });
  return callRoom(room, chosen.op);
}

/** The op one call makes, the field it refused, or nothing for a call the
 * relay does not serve. */
function opOf(
  call: string,
  wake: number,
  body: Record<string, unknown>,
): { op: RoomOp } | { bad: string } | null {
  const field = (name: string): string => String(body[name] ?? "").trim();
  switch (call) {
    case "bind": {
      const change = field("change");
      if (change === "") return { bad: "no-change" };
      return { op: { op: "bind", wake, change } };
    }
    // A line the run has nothing to say in is still a line it may post; the
    // room is the token's, and the thread is the room's.
    case "post":
      return {
        op: {
          op: "post",
          wake,
          text: String(body.text ?? ""),
          confirm: confirmOf(body.confirm),
        },
      };
    case "land": {
      const sha = field("sha");
      if (!IS_SHA.test(sha)) return { bad: "bad-sha" };
      const artifact = field("artifact");
      if (artifact === "") return { bad: "no-artifact" };
      return {
        op: {
          op: "land",
          wake,
          sha,
          kind: body.kind === "reviewed" ? "reviewed" : "word",
          artifact,
        },
      };
    }
    case "done":
      return { op: { op: "done", wake } };
    default:
      return null;
  }
}

/** What a surface is: the method it answers and what answers it, in one row.
 * Two lists would have to agree — a surface added to the dispatch and not to
 * the method list refuses the read it serves, and nothing says so. */
interface Surface {
  method: "GET" | "POST";
  handler: (
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ) => Promise<Response>;
}

/** Everything the relay serves. The two a page reads are GET; everything else
 * is a POST, and a read where a write belongs is refused before anything is
 * verified. The run's four calls are a path with a token in it, so the entry
 * reads those off one regex instead. */
const SURFACES: Record<string, Surface> = {
  "/slack/events": { method: "POST", handler: onSlackEvents },
  "/slack/actions": { method: "POST", handler: onSlackActions },
  "/github/events": {
    method: "POST",
    handler: (request, env) => onGithubEvents(request, env),
  },
  "/head": { method: "GET", handler: (_request, env) => onHead(env) },
  "/live": { method: "GET", handler: (request, env) => onLive(request, env) },
  "/wake": { method: "POST", handler: (request, env) => onWake(request, env) },
};

/** The button a post asks for, or nothing — which is the field left off the
 * op, as a post that asks for no button leaves it off. Both words are the
 * run's own — the relay composes no label — so a post that names neither is a
 * line. */
function confirmOf(given: unknown): Confirm | undefined {
  const asked = (given ?? {}) as { label?: unknown; word?: unknown };
  const label = String(asked.label ?? "").trim();
  const word = String(asked.word ?? "").trim();
  if (label === "" || word === "") return undefined;
  return { label, word };
}

/** What the path answers. It is read before the secret check so the head's own
 * headers reach every answer a page can be given. */
async function served(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  path: string,
): Promise<Response> {
  const missing = missingSecret(env);
  if (missing) return json(500, { reason: "missing-secret", secret: missing });
  const run = /^\/runs\/([^/]+)\/([a-z]+)$/.exec(path);
  const surface = SURFACES[path];
  const method = run ? (run[2] === "alive" ? "GET" : "POST") : surface?.method;
  if (method && request.method !== method)
    return json(405, { reason: method === "GET" ? "get-only" : "post-only" });
  if (surface) return surface.handler(request, env, ctx);
  if (run) return onRun(request, env, run[1], run[2]);
  return json(404, { reason: "no-route" });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const path = new URL(request.url).pathname;
    return withHead(path, await served(request, env, ctx, path));
  },
};
