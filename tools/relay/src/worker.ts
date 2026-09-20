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
import { parseGithubEvent, verifyGithubSignature } from "./github-events.ts";
import { isUpgrade } from "./live.ts";
import { readFileAt } from "./github.ts";
import type { Thread } from "./room-state.ts";
import { changeRoom } from "./rooms.ts";
import { callLive, callRoom, json, type RoomOp } from "./rpc.ts";
import {
  actionPayload,
  type Confirm,
  confirmedBlocks,
  confirmedLine,
  parseSlackAction,
  parseSlackRequest,
  postMessage,
  pressedLine,
  pressedMessage,
  routeMessage,
  type SlackPress,
  type SlackRoute,
  updateMessage,
  verifySlackSignature,
} from "./slack.ts";
import { TEAM_MAP, TeamCache } from "./team.ts";
import { verifyWakeToken } from "./token.ts";

export { Live } from "./live.ts";
export { Room } from "./room.ts";

/** A commit, as the code host spells one. A landing names the sha the relay
 * is to move `main` to, and a sha that is not one is a call the relay refuses
 * before it reads anything. */
const IS_SHA = /^[0-9a-f]{40}$/;

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

/** What went wrong, in the words a log can read. */
const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

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
    queue(env, route.thread, roomByName(env, route.room), {
      op: "enqueue",
      reason: route.reason,
      requireRoom: route.requireRoom,
      // Slack retries a delivery it did not see acknowledged, and one message
      // is one channel and one `ts` however many times it arrives.
      dedupe: `slack:${event.message.channel}/${event.message.ts}`,
      thread: route.thread,
      message: {
        slack: event.message.user,
        text: event.message.text,
        ts: event.message.ts,
      },
    }),
  );
  return json(200, { queued: true });
}

/**
 * The work behind the answer Slack already read. The room's answer is read
 * rather than dropped: a message that reached no room is a hand waiting for a
 * reply that is never coming, so the thread is told.
 */
async function queue(
  env: Env,
  thread: Thread,
  room: DurableObjectStub,
  op: RoomOp,
): Promise<void> {
  let why: string;
  try {
    const answer = await callRoom(room, op);
    if (answer.ok) return;
    why = `the room answered ${answer.status}`;
  } catch (error) {
    console.error(
      `relay: the room for ${thread.channel}/${thread.ts} could not be reached: ${reasonOf(error)}`,
    );
    why = "the room could not be reached";
  }
  await tell(env, thread, `This message did not reach a round: ${why}.`);
}

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
  if (action.kind === "ignored") return empty();
  const route = routeMessage(
    pressedMessage(action.press),
    env.PLANNING_CHANNEL,
  );
  if (!route) return empty();
  ctx.waitUntil(pressed(env, route, action.press));
  return empty();
}

/**
 * The work behind the answer Slack already read: the word queued as the
 * thread reply it stands for, the echo that puts it in the transcript, and
 * the button taken off the message.
 */
async function pressed(
  env: Env,
  route: SlackRoute,
  press: SlackPress,
): Promise<void> {
  await queue(env, route.thread, roomByName(env, route.room), {
    op: "enqueue",
    reason: route.reason,
    requireRoom: route.requireRoom,
    // One press is one channel and one `action_ts`, however many times Slack
    // delivers it.
    dedupe: `slack-action:${press.channel}/${press.actionTs}`,
    thread: route.thread,
    message: { slack: press.user, text: press.word, ts: press.actionTs },
  });
  const handle = await pressedBy(env, press);
  await tell(env, route.thread, pressedLine(press, handle));
  await taken(env, press, handle);
}

/** Who pressed, through the team map at `main`. Null is the map not naming
 * them, which the thread says rather than the relay guessing — the landing
 * check reads the same map and refuses the word. One press is a person's own
 * act, so the map is read for it rather than held between presses; the
 * landing's own reading is the room's. */
async function pressedBy(env: Env, press: SlackPress): Promise<string | null> {
  const team = new TeamCache(() =>
    readFileAt({ repo: env.REPO, token: env.GITHUB_TOKEN }, TEAM_MAP, "main"),
  );
  try {
    return await team.handleOf(press.user);
  } catch (error) {
    console.error(
      `relay: the team map could not be read for ${press.user}: ${reasonOf(error)}`,
    );
    return null;
  }
}

/** The button off the message, a context line in its place, so nobody presses
 * twice. An update that fails is logged and nothing more: the word is already
 * queued and the thread already says who pressed it. */
async function taken(
  env: Env,
  press: SlackPress,
  handle: string | null,
): Promise<void> {
  try {
    await updateMessage(
      env.SLACK_BOT_TOKEN,
      press.channel,
      press.messageTs,
      press.text,
      confirmedBlocks(press.text, confirmedLine(press, handle)),
    );
  } catch (error) {
    console.error(
      `relay: the button on ${press.channel}/${press.messageTs} did not come off: ${reasonOf(error)}`,
    );
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
  return callLive(liveObject(env), { op: "moved", head: event.head });
}

/** Where `main` is, for a page that is polling and for one whose socket the
 * relay could not take. */
async function onHead(env: Env): Promise<Response> {
  const answer = await callLive(liveObject(env), { op: "head" });
  return new Response(await answer.text(), {
    status: answer.status,
    headers: { "content-type": "application/json", ...HEAD_HEADERS },
  });
}

/** A page's socket. The upgrade is the live object's to accept, and a read that
 * is not one is told so rather than left waiting. */
async function onLive(request: Request, env: Env): Promise<Response> {
  if (!isUpgrade(request)) return json(426, { reason: "upgrade-required" });
  return liveObject(env).fetch(request);
}

/** The preflight a browser sends before it reads `/head` from another
 * origin. */
const preflight = (): Response =>
  new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-max-age": "86400",
    },
  });

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
    case "post": {
      // A line the run has nothing to say in is still a line it may post;
      // the room is the token's, and the thread is the room's.
      const text = String(body.text ?? "");
      const confirm = confirmOf(body.confirm);
      return {
        op: confirm
          ? { op: "post", wake, text, confirm }
          : { op: "post", wake, text },
      };
    }
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

/** Which method a surface answers: the two a page reads are GET, the one
 * question a run asks before every push is GET, and everything else is a POST.
 * A read where a write belongs is refused before anything is verified. */
function methodOf(path: string, run: RegExpExecArray | null): "GET" | "POST" {
  if (run) return run[2] === "alive" ? "GET" : "POST";
  return path === "/head" || path === "/live" ? "GET" : "POST";
}

/** The button a post asks for, or nothing. Both words are the run's own — the
 * relay composes no label — so a post that names neither is a line. */
function confirmOf(given: unknown): Confirm | null {
  const asked = (given ?? {}) as { label?: unknown; word?: unknown };
  const label = String(asked.label ?? "").trim();
  const word = String(asked.word ?? "").trim();
  if (label === "" || word === "") return null;
  return { label, word };
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const missing = missingSecret(env);
    if (missing)
      return json(500, { reason: "missing-secret", secret: missing });
    const path = new URL(request.url).pathname;
    const run = /^\/runs\/([^/]+)\/([a-z]+)$/.exec(path);
    if (request.method === "OPTIONS" && path === "/head") return preflight();
    const method = methodOf(path, run);
    if (request.method !== method)
      return json(405, { reason: method === "GET" ? "get-only" : "post-only" });
    if (path === "/slack/events") return onSlackEvents(request, env, ctx);
    if (path === "/github/events") return onGithubEvents(request, env);
    if (path === "/head") return onHead(env);
    if (path === "/live") return onLive(request, env);
    if (path === "/slack/actions") return onSlackActions(request, env, ctx);
    if (path === "/wake") return onWake(request, env);
    if (run) return onRun(request, env, run[1], run[2]);
    return json(404, { reason: "no-route" });
  },
};
