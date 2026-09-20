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
import { callRoom, json, type RoomOp } from "./rpc.ts";
import {
  parseSlackRequest,
  routeMessage,
  verifySlackSignature,
} from "./slack.ts";
import { verifyWakeToken } from "./token.ts";

export { Room } from "./room.ts";

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
    callRoom(roomByName(env, route.room), {
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
  if (!body.change) return json(400, { reason: "no-change" });
  await callRoom(roomByName(env, `change/${body.change}`), {
    op: "enqueue",
    reason: "landing",
    change: body.change,
    // The head is the landing: the same push wakes the relay once, however
    // many times the workflow's step runs. The base is the acknowledgment's
    // own line and nothing the room keeps.
    ...(body.head ? { dedupe: `wake:${body.change}/${body.head}` } : {}),
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
  const body = (await readJson(request)) as Record<string, unknown> | null;
  if (body === null) return notJson();
  const room = env.ROOM.get(env.ROOM.idFromString(claims.room));
  const op = opOf(call, claims.wake, body);
  if (!op) return json(404, { reason: "unknown-call" });
  return callRoom(room, op);
}

/** The op one call makes, or nothing for a call the relay does not serve. */
function opOf(
  call: string,
  wake: number,
  body: Record<string, unknown>,
): RoomOp | null {
  switch (call) {
    case "bind":
      return { op: "bind", wake, change: String(body.change ?? "") };
    case "post":
      return { op: "post", wake, text: String(body.text ?? "") };
    case "land":
      return {
        op: "land",
        wake,
        sha: String(body.sha ?? ""),
        kind: body.kind === "reviewed" ? "reviewed" : "word",
        artifact: String(body.artifact ?? ""),
      };
    case "done":
      return { op: "done", wake };
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
    if (request.method !== "POST") return json(405, { reason: "post-only" });
    if (path === "/slack/events") return onSlackEvents(request, env, ctx);
    if (path === "/wake") return onWake(request, env);
    const run = /^\/runs\/([^/]+)\/([a-z]+)$/.exec(path);
    if (run) return onRun(request, env, run[1], run[2]);
    return json(404, { reason: "no-route" });
  },
};
