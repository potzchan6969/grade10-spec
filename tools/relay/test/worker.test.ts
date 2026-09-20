import { afterEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../src/env.ts";
import type { RoomOp } from "../src/room.ts";
import { signSlackRequest } from "../src/slack.ts";
import { mintWakeToken } from "../src/token.ts";
import worker from "../src/worker.ts";

/** The router: Slack answered inside three seconds with the work behind it, the
 * workflow's wake, and the four calls a running session makes. Every room is a
 * stub here — the state machine is read in `room-state.test.ts`. */

const SIGNING = "the-signing-secret";
const WAKE = "the-workflow's-wake-token";
const TOKEN_SECRET = "the-relay's-own-hmac-secret";
const CHANNEL = "C0PLAN";
const APP = "U0APP";
const ROOM_ID = "7f9c0a1b2c3d4e5f60718293a4b5c6d7";

interface Sent {
  room: string;
  op: RoomOp;
}

function testEnv(sent: Sent[]): Env {
  const namespace = {
    idFromName: (name: string) => ({ toString: () => `name:${name}` }),
    idFromString: (hex: string) => ({ toString: () => hex }),
    get: (id: { toString(): string }) => ({
      fetch: async (request: Request) => {
        sent.push({
          room: id.toString(),
          op: (await request.json()) as RoomOp,
        });
        return new Response(JSON.stringify({ queued: true }), { status: 200 });
      },
    }),
  };
  return {
    ROOM: namespace as unknown as DurableObjectNamespace,
    PLANNING_CHANNEL: CHANNEL,
    REPO: "9gag/grade10-spec",
    RELAY_URL: "https://grade10-relay.workers.dev",
    SLACK_SIGNING_SECRET: SIGNING,
    SLACK_BOT_TOKEN: "xoxb-in-the-environment-alone",
    ROUTINE_FIRE_URL: "https://runner.example/fire",
    ROUTINE_TOKEN: "the-routine-token",
    GITHUB_TOKEN: "the-code-host-token",
    TOKEN_SECRET,
    WAKE_TOKEN: WAKE,
  };
}

function context(waits: Promise<unknown>[]): ExecutionContext {
  return {
    waitUntil: (promise: Promise<unknown>) => waits.push(promise),
    passThroughOnException: () => {},
  } as unknown as ExecutionContext;
}

async function slack(env: Env, waits: Promise<unknown>[], event: unknown) {
  const body = JSON.stringify(event);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const response = await worker.fetch(
    new Request("https://relay.example/slack/events", {
      method: "POST",
      headers: {
        "x-slack-request-timestamp": timestamp,
        "x-slack-signature": await signSlackRequest(SIGNING, timestamp, body),
        "content-type": "application/json",
      },
      body,
    }),
    env,
    context(waits),
  );
  await Promise.all(waits);
  return response;
}

function mention(text: string, over: Record<string, unknown> = {}) {
  return {
    type: "event_callback",
    event_id: "Ev1",
    authorizations: [{ user_id: APP }],
    event: {
      type: "message",
      channel: CHANNEL,
      user: "U0PM",
      ts: "1700000000.000100",
      text,
      ...over,
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("/slack/events", () => {
  it("echoes a url_verification challenge", async () => {
    const response = await slack(testEnv([]), [], {
      type: "url_verification",
      challenge: "3eZbrw1a",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ challenge: "3eZbrw1a" });
  });

  it("refuses a request the signing secret does not sign", async () => {
    const response = await worker.fetch(
      new Request("https://relay.example/slack/events", {
        method: "POST",
        headers: {
          "x-slack-request-timestamp": String(Math.floor(Date.now() / 1000)),
          "x-slack-signature":
            "v0=0000000000000000000000000000000000000000000000000000000000000000",
        },
        body: "{}",
      }),
      testEnv([]),
      context([]),
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ reason: "bad-signature" });
  });

  it("opens a room on a first sentence and answers before the work", async () => {
    const sent: Sent[] = [];
    const env = testEnv(sent);
    const response = await slack(env, [], mention(`<@${APP}> plan the badge`));
    expect(response.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].room).toBe(`name:${CHANNEL}/1700000000.000100`);
    expect(sent[0].op).toEqual({
      op: "enqueue",
      reason: "plan",
      requireRoom: false,
      eventId: "Ev1",
      thread: { channel: CHANNEL, ts: "1700000000.000100" },
      message: {
        slack: "U0PM",
        text: `<@${APP}> plan the badge`,
        ts: "1700000000.000100",
      },
    });
  });

  it("wakes nothing for the app's own reply", async () => {
    const sent: Sent[] = [];
    const response = await slack(
      testEnv(sent),
      [],
      mention("Reading… https://runs.example/s1", { bot_id: "B0" }),
    );
    expect(await response.json()).toEqual({ ignored: "bot_id" });
    expect(sent).toEqual([]);
  });

  it("wakes nothing outside the planning channel", async () => {
    const sent: Sent[] = [];
    const response = await slack(
      testEnv(sent),
      [],
      mention(`<@${APP}> plan the badge`, { channel: "C0OTHER" }),
    );
    expect(await response.json()).toEqual({ ignored: "not-addressed" });
    expect(sent).toEqual([]);
  });
});

describe("/wake", () => {
  it("shared-planning-agent-rounds-SC-66 - the /wake endpoint queues one wake per landing", async () => {
    const sent: Sent[] = [];
    const response = await worker.fetch(
      new Request("https://relay.example/wake", {
        method: "POST",
        headers: {
          authorization: `Bearer ${WAKE}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          change: "nav-cart-count-badge",
          reason: "landing",
          base: "aaaaaaa",
          head: "bbbbbbb",
        }),
      }),
      testEnv(sent),
      context([]),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ queued: true });
    expect(sent).toEqual([
      {
        room: "name:change/nav-cart-count-badge",
        op: {
          op: "enqueue",
          reason: "landing",
          landing: { base: "aaaaaaa", head: "bbbbbbb" },
        },
      },
    ]);
  });

  it("refuses a wake with the wrong token", async () => {
    const sent: Sent[] = [];
    const response = await worker.fetch(
      new Request("https://relay.example/wake", {
        method: "POST",
        headers: { authorization: "Bearer not-the-wake-token" },
        body: JSON.stringify({ change: "nav-cart-count-badge" }),
      }),
      testEnv(sent),
      context([]),
    );
    expect(response.status).toBe(401);
    expect(sent).toEqual([]);
  });
});

describe("/runs/:token", () => {
  const claims = { room: ROOM_ID, wake: 1, exp: Date.now() + 30 * 60_000 };

  async function call(
    env: Env,
    token: string,
    name: string,
    body: unknown,
  ): Promise<Response> {
    return worker.fetch(
      new Request(`https://relay.example/runs/${token}/${name}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      env,
      context([]),
    );
  }

  it("shared-planning-agent-rounds-SC-74 - a post needs a valid wake token", async () => {
    const sent: Sent[] = [];
    const env = testEnv(sent);
    const bad = await call(env, "not.atoken", "post", { text: "drafted" });
    expect(bad.status).toBe(401);
    expect(await bad.json()).toEqual({ reason: "bad-token" });
    expect(sent).toEqual([]);

    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const good = await call(env, token, "post", { text: "drafted" });
    expect(good.status).toBe(200);
    expect(sent).toEqual([
      { room: ROOM_ID, op: { op: "post", wake: 1, text: "drafted" } },
    ]);
  });

  it("refuses a token past its budget", async () => {
    const sent: Sent[] = [];
    const token = await mintWakeToken(TOKEN_SECRET, {
      ...claims,
      exp: Date.now() - 1,
    });
    const response = await call(testEnv(sent), token, "post", { text: "late" });
    expect(response.status).toBe(401);
    expect(sent).toEqual([]);
  });

  it("carries bind, land and done to the token's own room", async () => {
    const sent: Sent[] = [];
    const env = testEnv(sent);
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    await call(env, token, "bind", { change: "nav-cart-count-badge" });
    await call(env, token, "land", {
      sha: "abc123",
      kind: "reviewed",
      artifact: "proposal",
    });
    await call(env, token, "done", { summary: "landed the proposal" });
    expect(sent.map((one) => one.op)).toEqual([
      { op: "bind", wake: 1, change: "nav-cart-count-badge" },
      {
        op: "land",
        wake: 1,
        sha: "abc123",
        kind: "reviewed",
        artifact: "proposal",
      },
      { op: "done", wake: 1, summary: "landed the proposal" },
    ]);
    expect(new Set(sent.map((one) => one.room))).toEqual(new Set([ROOM_ID]));
  });

  it("knows no other call", async () => {
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const response = await call(testEnv([]), token, "archive", {});
    expect(response.status).toBe(404);
  });
});

describe("everything else", () => {
  it("answers a path it does not serve with 404 and a read with 405", async () => {
    const env = testEnv([]);
    expect(
      (
        await worker.fetch(
          new Request("https://relay.example/nowhere", { method: "POST" }),
          env,
          context([]),
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await worker.fetch(
          new Request("https://relay.example/wake"),
          env,
          context([]),
        )
      ).status,
    ).toBe(405);
  });
});
