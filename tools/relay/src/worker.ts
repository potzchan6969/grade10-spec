/**
 * The router. Three surfaces and nothing else: Slack's events, the workflow's
 * wake, the four calls a running session makes, and 404.
 *
 * Slack is answered inside three seconds and the work happens in
 * `ctx.waitUntil`, because a Slack delivery that is not acknowledged is
 * retried. Every rule the relay has lives in the modules this file calls.
 *
 * It fails closed at the entry: a deployment missing one of the secrets
 * nothing works without answers 500 and names the secret, rather than
 * verifying every request against the empty string.
 */

import { equalBytes, utf8 } from "./bytes.ts";
import { type Env, missingSecret } from "./env.ts";
import type { Thread } from "./room-state.ts";
import { changeRoom } from "./rooms.ts";
import { callRoom, json, type RoomOp } from "./rpc.ts";
import {
  parseSlackRequest,
  postMessage,
  routeMessage,
  verifySlackSignature,
} from "./slack.ts";
import { verifyWakeToken } from "./token.ts";

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

async function onSlackEvents(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const body = await request.text();
  const signed = await verifySlackSignature(
    env.SLACK_SIGNING_SECRET,
    {
      timestamp: request.headers.get("x-slack-request-timestamp"),
      signature: request.headers.get("x-slack-signature"),
      body,
    },
    Date.now(),
  );
  if (!signed) return json(401, { reason: "bad-signature" });
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
      `relay: the room for ${thread.channel}/${thread.ts} could not be reached: ${error instanceof Error ? error.message : String(error)}`,
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
    console.error(
      `relay: "${text}" did not post: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
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
    base?: string;
    head?: string;
  } | null;
  if (body === null) return notJson();
  const change = String(body.change ?? "").trim();
  const head = String(body.head ?? "").trim();
  if (change === "") return json(400, { reason: "no-change" });
  // The head is what keys the wake: the same push wakes the relay once,
  // however many times the workflow's step runs, and a wake with no head
  // would wake it again on every run. The base is the acknowledgment's own
  // line and nothing the room keeps.
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
    case "post":
      // A line the run has nothing to say in is still a line it may post;
      // the room is the token's, and the thread is the room's.
      return { op: { op: "post", wake, text: String(body.text ?? "") } };
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
    const alive = run !== null && run[2] === "alive";
    if (request.method !== (alive ? "GET" : "POST"))
      return json(405, { reason: alive ? "get-only" : "post-only" });
    if (path === "/slack/events") return onSlackEvents(request, env, ctx);
    if (path === "/wake") return onWake(request, env);
    if (run) return onRun(request, env, run[1], run[2]);
    return json(404, { reason: "no-route" });
  },
};
