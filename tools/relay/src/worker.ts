/**
 * The router. Four surfaces and nothing else: Slack's events, the workflow's
 * wake, the four calls a running session makes, and 404.
 *
 * Slack is answered inside three seconds and the work happens in
 * `ctx.waitUntil`, because a Slack delivery that is not acknowledged is
 * retried. Every rule the relay has lives in the modules this file calls.
 */

import { equalBytes, utf8 } from "./bytes.ts";
import type { Env } from "./env.ts";
import type { RoomOp } from "./room.ts";
import type { Landing } from "./room-state.ts";
import {
  parseSlackRequest,
  routeMessage,
  verifySlackSignature,
} from "./slack.ts";
import { verifyWakeToken } from "./token.ts";

export { Room } from "./room.ts";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** One room, addressed by name: `channel/ts` for a thread, `change/<id>` for
 * the address a landing wake is sent to. */
function roomByName(env: Env, name: string): DurableObjectStub {
  return env.ROOM.get(env.ROOM.idFromName(name));
}

function callRoom(room: DurableObjectStub, op: RoomOp): Promise<Response> {
  return room.fetch(
    new Request("https://relay.invalid/room", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(op),
    }),
  );
}

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
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return json(400, { reason: "not-json" });
  }
  const event = parseSlackRequest(parsed);
  if (event.kind === "url_verification")
    return json(200, { challenge: event.challenge });
  if (event.kind === "ignored") return json(200, { ignored: event.why });
  const route = routeMessage(event.message, env.PLANNING_CHANNEL);
  if (!route) return json(200, { ignored: "not-addressed" });
  const [channel, ts] = route.room.split("/");
  ctx.waitUntil(
    callRoom(roomByName(env, route.room), {
      op: "enqueue",
      reason: route.reason,
      requireRoom: route.requireRoom,
      eventId: event.message.eventId,
      thread: { channel, ts },
      message: {
        slack: event.message.user,
        text: event.message.text,
        ts: event.message.ts,
      },
    }),
  );
  return json(200, { queued: true });
}

async function onWake(request: Request, env: Env): Promise<Response> {
  const given = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!equalBytes(utf8(given), utf8(env.WAKE_TOKEN)))
    return json(401, { reason: "bad-token" });
  const body = (await request.json()) as {
    change?: string;
    base?: string;
    head?: string;
  };
  if (!body.change) return json(400, { reason: "no-change" });
  const landing: Landing | undefined =
    body.base && body.head ? { base: body.base, head: body.head } : undefined;
  await callRoom(roomByName(env, `change/${body.change}`), {
    op: "enqueue",
    reason: "landing",
    landing,
  });
  return json(200, { queued: true });
}

async function onRun(
  request: Request,
  env: Env,
  token: string,
  call: string,
): Promise<Response> {
  const claims = await verifyWakeToken(env.TOKEN_SECRET, token, Date.now());
  if (!claims) return json(401, { reason: "bad-token" });
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const room = env.ROOM.get(env.ROOM.idFromString(claims.room));
  switch (call) {
    case "bind":
      return callRoom(room, {
        op: "bind",
        wake: claims.wake,
        change: String(body.change ?? ""),
      });
    case "post":
      return callRoom(room, {
        op: "post",
        wake: claims.wake,
        text: String(body.text ?? ""),
      });
    case "land":
      return callRoom(room, {
        op: "land",
        wake: claims.wake,
        sha: String(body.sha ?? ""),
        kind: body.kind === "reviewed" ? "reviewed" : "word",
        artifact: String(body.artifact ?? ""),
      });
    case "done":
      return callRoom(room, {
        op: "done",
        wake: claims.wake,
        summary: body.summary === undefined ? undefined : String(body.summary),
      });
    default:
      return json(404, { reason: "unknown-call" });
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (request.method !== "POST") return json(405, { reason: "post-only" });
    if (path === "/slack/events") return onSlackEvents(request, env, ctx);
    if (path === "/wake") return onWake(request, env);
    const run = /^\/runs\/([^/]+)\/(bind|post|land|done)$/.exec(path);
    if (run) return onRun(request, env, run[1], run[2]);
    return json(404, { reason: "no-route" });
  },
};
