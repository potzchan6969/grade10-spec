import { afterEach, describe, expect, it, vi } from "vitest";
import { type Env, REQUIRED_SECRETS } from "../src/env.ts";
import { signGithubEvent } from "../src/github-events.ts";
import type { Head } from "../src/live-state.ts";
import type { LiveOp, RoomOp } from "../src/rpc.ts";
import { signSlackRequest } from "../src/slack.ts";
import { mintWakeToken } from "../src/token.ts";
import worker from "../src/worker.ts";
import {
  APP,
  BOT_TOKEN,
  CHANNEL,
  REPO,
  SIGNING,
  stubNamespace,
  TOKEN_SECRET,
  testEnv,
  WAKE,
  WEBHOOK_SECRET,
} from "./fixtures.ts";

/** The router: the entry that refuses a deployment missing a secret, Slack
 * answered inside three seconds with the work behind it, the workflow's wake,
 * and the four calls a running session makes. Every room is a stub here — the
 * room itself is read in `room.test.ts`. */

const ROOM_ID = "7f9c0a1b2c3d4e5f60718293a4b5c6d7";
const OTHER_ROOM_ID = "0123456789abcdef0123456789abcdef";
const SHA = "abc1230000000000000000000000000000000000";

interface Sent {
  room: string;
  op: RoomOp;
}

/** The rooms of one test: every op they were sent, and what they answer. */
function rooms(
  sent: Sent[],
  answer: () => Response = () =>
    new Response(JSON.stringify({ queued: true }), { status: 200 }),
): Partial<Env> {
  return {
    ROOM: stubNamespace(async (room, request) => {
      sent.push({ room, op: (await request.json()) as RoomOp });
      return answer();
    }),
  };
}

/** What the live object was asked: an op, or the socket a page is opening. */
interface Asked {
  name: string;
  op: LiveOp | null;
  upgrade: boolean;
}

/** The live object of one test: every ask it took, and what it answers. */
function liveStub(
  asked: Asked[],
  answer: () => Response = () =>
    new Response(JSON.stringify({ told: 0 }), { status: 200 }),
): Partial<Env> {
  return {
    LIVE: stubNamespace(async (name, request) => {
      // An upgrade is forwarded as it arrived, and carries no body to read.
      const upgrade = (request.headers.get("upgrade") ?? "") !== "";
      asked.push({
        name,
        op: upgrade ? null : ((await request.json()) as LiveOp),
        upgrade,
      });
      return answer();
    }),
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

describe("the entry", () => {
  it("refuses a deployment with a secret unset, and names it", async () => {
    expect(REQUIRED_SECRETS).toEqual([
      "SLACK_SIGNING_SECRET",
      "SLACK_BOT_TOKEN",
      "ROUTINE_FIRE_URL",
      "ROUTINE_TOKEN",
      "GITHUB_TOKEN",
      "TOKEN_SECRET",
      "WAKE_TOKEN",
      "GITHUB_WEBHOOK_SECRET",
    ]);
    for (const secret of REQUIRED_SECRETS) {
      const response = await worker.fetch(
        new Request("https://relay.example/wake", { method: "POST" }),
        testEnv({ [secret]: "  " }),
        context([]),
      );
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        reason: "missing-secret",
        secret,
      });
    }
  });

  it("names the secret and never its value", async () => {
    const response = await worker.fetch(
      new Request("https://relay.example/wake", { method: "POST" }),
      testEnv({ TOKEN_SECRET: "" }),
      context([]),
    );
    expect(await response.text()).not.toContain(WAKE);
  });
});

describe("/slack/events", () => {
  it("echoes a url_verification challenge", async () => {
    const response = await slack(testEnv(), [], {
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
      testEnv(),
      context([]),
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ reason: "bad-signature" });
  });

  it("refuses a signed body that is not JSON", async () => {
    const body = "not json at all";
    const timestamp = String(Math.floor(Date.now() / 1000));
    const response = await worker.fetch(
      new Request("https://relay.example/slack/events", {
        method: "POST",
        headers: {
          "x-slack-request-timestamp": timestamp,
          "x-slack-signature": await signSlackRequest(SIGNING, timestamp, body),
        },
        body,
      }),
      testEnv(),
      context([]),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "not-json" });
  });

  it("opens a room on a first sentence and answers before the work", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const response = await slack(env, [], mention(`<@${APP}> plan the badge`));
    expect(response.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].room).toBe(`${CHANNEL}/1700000000.000100`);
    expect(sent[0].op).toEqual({
      op: "enqueue",
      reason: "plan",
      requireRoom: false,
      dedupe: `slack:${CHANNEL}/1700000000.000100`,
      thread: { channel: CHANNEL, ts: "1700000000.000100" },
      message: {
        slack: "U0PM",
        text: `<@${APP}> plan the badge`,
        ts: "1700000000.000100",
      },
    });
  });

  it("keys one message by its channel and its ts, whatever the event id", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    await slack(env, [], mention(`<@${APP}> plan the badge`));
    await slack(
      env,
      [],
      mention(`<@${APP}> plan the badge`, { event_id: "Ev2" }),
    );
    expect(sent).toHaveLength(2);
    expect(sent[0].op).toEqual(sent[1].op);
  });

  it("wakes nothing for the app's own reply", async () => {
    const sent: Sent[] = [];
    const response = await slack(
      testEnv(rooms(sent)),
      [],
      mention("Reading… https://runs.example/s1", { bot_id: "B0" }),
    );
    expect(await response.json()).toEqual({ ignored: "bot_id" });
    expect(sent).toEqual([]);
  });

  it("wakes nothing outside the planning channel", async () => {
    const sent: Sent[] = [];
    const response = await slack(
      testEnv(rooms(sent)),
      [],
      mention(`<@${APP}> plan the badge`, { channel: "C0OTHER" }),
    );
    expect(await response.json()).toEqual({ ignored: "not-addressed" });
    expect(sent).toEqual([]);
  });

  it("posts the failure line in the thread where the room refused the message", async () => {
    const posts: unknown[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      posts.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ ok: true, ts: "1.9" }));
    });
    const sent: Sent[] = [];
    const env = testEnv(
      rooms(
        sent,
        () =>
          new Response(JSON.stringify({ reason: "host-unavailable" }), {
            status: 503,
          }),
      ),
    );
    const response = await slack(env, [], mention(`<@${APP}> plan the badge`));
    // Slack is answered inside three seconds either way; the work behind the
    // answer is what says it failed.
    expect(response.status).toBe(200);
    expect(posts).toEqual([
      {
        channel: CHANNEL,
        text: "This message did not reach a round: the room answered 503.",
        thread_ts: "1700000000.000100",
      },
    ]);
  });

  it("posts the failure line where the room could not be reached at all", async () => {
    const posts: unknown[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      posts.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ ok: true, ts: "1.9" }));
    });
    const told = vi.spyOn(console, "error").mockImplementation(() => {});
    const env = testEnv({
      ROOM: stubNamespace(async () => {
        throw new Error("the room could not be started");
      }),
    });
    const response = await slack(env, [], mention(`<@${APP}> plan the badge`));
    expect(response.status).toBe(200);
    expect(posts).toEqual([
      {
        channel: CHANNEL,
        text: "This message did not reach a round: the room could not be reached.",
        thread_ts: "1700000000.000100",
      },
    ]);
    expect(told).toHaveBeenCalledTimes(1);
    told.mockRestore();
  });

  it("holds the bot token in the deployment alone", async () => {
    const posts: RequestInit[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      posts.push(init);
      return new Response(JSON.stringify({ ok: true, ts: "1.9" }));
    });
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent, () => new Response("{}", { status: 500 })));
    await slack(env, [], mention(`<@${APP}> plan the badge`));
    expect((posts[0].headers as Record<string, string>).authorization).toBe(
      `Bearer ${BOT_TOKEN}`,
    );
  });
});

describe("/wake", () => {
  async function wake(env: Env, body: unknown, token = WAKE) {
    return worker.fetch(
      new Request("https://relay.example/wake", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      env,
      context([]),
    );
  }

  it("shared-planning-agent-rounds-SC-66 - A landing wakes the relay once per change", async () => {
    const sent: Sent[] = [];
    const response = await wake(testEnv(rooms(sent)), {
      change: "nav-cart-count-badge",
      reason: "landing",
      head: "bbbbbbb",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ queued: true });
    expect(sent).toEqual([
      {
        room: "change/nav-cart-count-badge",
        op: {
          op: "enqueue",
          reason: "landing",
          change: "nav-cart-count-badge",
          dedupe: "wake:nav-cart-count-badge/bbbbbbb",
        },
      },
    ]);
  });

  it("refuses a wake with the wrong token", async () => {
    const sent: Sent[] = [];
    const response = await wake(
      testEnv(rooms(sent)),
      { change: "nav-cart-count-badge" },
      "not-the-wake-token",
    );
    expect(response.status).toBe(401);
    expect(sent).toEqual([]);
  });

  it("refuses a wake that names no change, and a body that is not JSON", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const noChange = await wake(env, { head: "bbb" });
    expect(noChange.status).toBe(400);
    expect(await noChange.json()).toEqual({ reason: "no-change" });
    const notJson = await wake(env, "{");
    expect(notJson.status).toBe(400);
    expect(await notJson.json()).toEqual({ reason: "not-json" });
    expect(sent).toEqual([]);
  });

  it("refuses a wake that names no head", async () => {
    const sent: Sent[] = [];
    // The head is what keys the wake: without it one push wakes the relay
    // as many times as its step runs.
    const response = await wake(testEnv(rooms(sent)), {
      change: "nav-cart-count-badge",
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "no-head" });
    expect(sent).toEqual([]);
  });

  it("answers with what the room answered", async () => {
    const sent: Sent[] = [];
    const response = await wake(
      testEnv(
        rooms(
          sent,
          () =>
            new Response(JSON.stringify({ queued: false, why: "duplicate" }), {
              status: 200,
            }),
        ),
      ),
      { change: "nav-cart-count-badge", head: "bbbbbbb" },
    );
    expect(await response.json()).toEqual({ queued: false, why: "duplicate" });
    expect(sent).toHaveLength(1);
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
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      env,
      context([]),
    );
  }

  it("shared-planning-agent-rounds-SC-74 - A run posts through the relay and never holds the token", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
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

  it("asks the token's room whether the wake is alive, on a GET with no body", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const get = (method: string, who = token) =>
      worker.fetch(
        new Request(`https://relay.example/runs/${who}/alive`, { method }),
        env,
        context([]),
      );
    const bad = await get("GET", "not.atoken");
    expect(bad.status).toBe(401);
    expect(sent).toEqual([]);
    const posted = await get("POST");
    expect(posted.status).toBe(405);
    expect(await posted.json()).toEqual({ reason: "get-only" });
    const asked = await get("GET");
    expect(asked.status).toBe(200);
    expect(sent).toEqual([{ room: ROOM_ID, op: { op: "alive", wake: 1 } }]);
  });

  it("refuses a token past its budget", async () => {
    const sent: Sent[] = [];
    const token = await mintWakeToken(TOKEN_SECRET, {
      ...claims,
      exp: Date.now() - 1,
    });
    const response = await call(testEnv(rooms(sent)), token, "post", {
      text: "late",
    });
    expect(response.status).toBe(401);
    expect(sent).toEqual([]);
  });

  it("carries bind, land and done to the token's own room", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    await call(env, token, "bind", { change: "nav-cart-count-badge" });
    await call(env, token, "land", {
      sha: SHA,
      kind: "reviewed",
      artifact: "proposal",
    });
    await call(env, token, "done", { summary: "landed the proposal" });
    expect(sent.map((one) => one.op)).toEqual([
      { op: "bind", wake: 1, change: "nav-cart-count-badge" },
      {
        op: "land",
        wake: 1,
        sha: SHA,
        kind: "reviewed",
        artifact: "proposal",
      },
      { op: "done", wake: 1 },
    ]);
    expect(new Set(sent.map((one) => one.room))).toEqual(new Set([ROOM_ID]));
  });

  it("reads a post's text alone, whatever else its body names", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    // A run cannot address another thread, another room or another wake by
    // asking: the room and the wake are the token's.
    await call(env, token, "post", {
      text: "drafted",
      channel: "C0ELSEWHERE",
      thread_ts: "1700000000.000900",
      wake: 9,
    });
    expect(sent).toEqual([
      { room: ROOM_ID, op: { op: "post", wake: 1, text: "drafted" } },
    ]);
  });

  it("carries one room's token to that room's thread and to no other", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const mine = await mintWakeToken(TOKEN_SECRET, claims);
    const theirs = await mintWakeToken(TOKEN_SECRET, {
      ...claims,
      room: OTHER_ROOM_ID,
    });
    await call(env, mine, "post", { text: "for my thread" });
    await call(env, theirs, "post", { text: "for theirs" });
    expect(sent).toEqual([
      { room: ROOM_ID, op: { op: "post", wake: 1, text: "for my thread" } },
      {
        room: OTHER_ROOM_ID,
        op: { op: "post", wake: 1, text: "for theirs" },
      },
    ]);
  });

  it("refuses a bind that names no change", async () => {
    const sent: Sent[] = [];
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const response = await call(testEnv(rooms(sent)), token, "bind", {
      change: "  ",
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "no-change" });
    expect(sent).toEqual([]);
  });

  it("refuses a landing whose sha is not a commit, and one naming no artifact", async () => {
    const sent: Sent[] = [];
    const env = testEnv(rooms(sent));
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    for (const sha of ["", "abc123", `${SHA}0`, `${SHA.slice(1)}z`]) {
      const response = await call(env, token, "land", {
        sha,
        kind: "word",
        artifact: "proposal",
      });
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ reason: "bad-sha" });
    }
    const noArtifact = await call(env, token, "land", {
      sha: SHA,
      kind: "word",
      artifact: " ",
    });
    expect(noArtifact.status).toBe(400);
    expect(await noArtifact.json()).toEqual({ reason: "no-artifact" });
    expect(sent).toEqual([]);
  });

  it("refuses a body that is not JSON", async () => {
    const sent: Sent[] = [];
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const response = await call(testEnv(rooms(sent)), token, "post", "{");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "not-json" });
    expect(sent).toEqual([]);
  });

  it("knows no other call", async () => {
    const token = await mintWakeToken(TOKEN_SECRET, claims);
    const response = await call(testEnv(), token, "archive", {});
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ reason: "unknown-call" });
  });
});

const HEAD: Head = {
  main: "d6fde92930d4715a2b49857d24b940956b26d2d3",
  at: "2026-09-20T14:02:11+08:00",
  subject: "docs(planning): the live line",
};

/** A push of `main`, with whatever this test changes of it. */
function push(over: Record<string, unknown> = {}): unknown {
  return {
    ref: "refs/heads/main",
    after: HEAD.main,
    repository: { full_name: REPO },
    head_commit: {
      timestamp: HEAD.at,
      message: `${HEAD.subject}\n\nThe body a page never shows.`,
    },
    ...over,
  };
}

describe("/github/events", () => {
  async function delivery(
    env: Env,
    event: string,
    body: unknown,
    signature?: string,
  ) {
    const text = typeof body === "string" ? body : JSON.stringify(body);
    return worker.fetch(
      new Request("https://relay.example/github/events", {
        method: "POST",
        headers: {
          "x-github-event": event,
          "x-hub-signature-256":
            signature ?? (await signGithubEvent(WEBHOOK_SECRET, text)),
          "content-type": "application/json",
        },
        body: text,
      }),
      env,
      context([]),
    );
  }

  it("tells the live object where `main` is", async () => {
    const asked: Asked[] = [];
    const response = await delivery(testEnv(liveStub(asked)), "push", push());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ told: 0 });
    expect(asked).toEqual([
      { name: "main", op: { op: "moved", ...HEAD }, upgrade: false },
    ]);
  });

  it("answers the ping the code host sends when the webhook is saved", async () => {
    const asked: Asked[] = [];
    const response = await delivery(testEnv(liveStub(asked)), "ping", {
      zen: "Keep it logically awesome.",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ pong: true });
    expect(asked).toEqual([]);
  });

  it("refuses a delivery the webhook secret does not sign", async () => {
    const asked: Asked[] = [];
    const env = testEnv(liveStub(asked));
    const wrong = await delivery(
      env,
      "push",
      push(),
      await signGithubEvent("another-secret", JSON.stringify(push())),
    );
    expect(wrong.status).toBe(401);
    expect(await wrong.json()).toEqual({ reason: "bad-signature" });
    const none = await delivery(env, "push", push(), "");
    expect(none.status).toBe(401);
    expect(asked).toEqual([]);
  });

  it("names the secret in no answer it writes", async () => {
    const response = await delivery(testEnv(), "push", push(), "sha256=00");
    expect(await response.text()).not.toContain(WEBHOOK_SECRET);
  });

  it("tells nobody about another branch, another repository or no commit", async () => {
    const asked: Asked[] = [];
    const env = testEnv(liveStub(asked));
    for (const [body, why] of [
      [
        push({ ref: "refs/heads/claude/tell-open-pages-main-moved" }),
        "another-branch",
      ],
      [
        push({ repository: { full_name: "9gag/grade10" } }),
        "another-repository",
      ],
      [push({ head_commit: null }), "no-commit"],
    ] as const) {
      const response = await delivery(env, "push", body);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ignored: why });
    }
    const other = await delivery(env, "issues", {});
    expect(await other.json()).toEqual({ ignored: "not-a-push" });
    expect(asked).toEqual([]);
  });

  it("refuses a body that is not JSON, and a read", async () => {
    const asked: Asked[] = [];
    const env = testEnv(liveStub(asked));
    const broken = await delivery(env, "push", "{");
    expect(broken.status).toBe(400);
    expect(await broken.json()).toEqual({ reason: "not-json" });
    const read = await worker.fetch(
      new Request("https://relay.example/github/events"),
      env,
      context([]),
    );
    expect(read.status).toBe(405);
    expect(await read.json()).toEqual({ reason: "post-only" });
    expect(asked).toEqual([]);
  });
});

describe("/head", () => {
  it("answers where `main` is, readable from any origin and cached nowhere", async () => {
    const asked: Asked[] = [];
    const env = testEnv(
      liveStub(
        asked,
        () => new Response(JSON.stringify(HEAD), { status: 200 }),
      ),
    );
    const response = await worker.fetch(
      new Request("https://relay.example/head"),
      env,
      context([]),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(HEAD);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(asked).toEqual([
      { name: "main", op: { op: "head" }, upgrade: false },
    ]);
  });

  it("answers the preflight a browser sends before it reads the head", async () => {
    const response = await worker.fetch(
      new Request("https://relay.example/head", { method: "OPTIONS" }),
      testEnv(),
      context([]),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toBe(
      "GET, OPTIONS",
    );
  });

  it("refuses a write of the head", async () => {
    const asked: Asked[] = [];
    const response = await worker.fetch(
      new Request("https://relay.example/head", { method: "POST" }),
      testEnv(liveStub(asked)),
      context([]),
    );
    expect(response.status).toBe(405);
    expect(await response.json()).toEqual({ reason: "get-only" });
    expect(asked).toEqual([]);
  });
});

describe("/live", () => {
  it("hands a page's upgrade to the live object", async () => {
    const asked: Asked[] = [];
    const response = await worker.fetch(
      new Request("https://relay.example/live", {
        headers: { upgrade: "WebSocket" },
      }),
      testEnv(liveStub(asked)),
      context([]),
    );
    expect(response.status).toBe(200);
    expect(asked).toEqual([{ name: "main", op: null, upgrade: true }]);
  });

  it("tells a read that is not an upgrade so, and opens nothing", async () => {
    const asked: Asked[] = [];
    const env = testEnv(liveStub(asked));
    const plain = await worker.fetch(
      new Request("https://relay.example/live"),
      env,
      context([]),
    );
    expect(plain.status).toBe(426);
    expect(await plain.json()).toEqual({ reason: "upgrade-required" });
    const written = await worker.fetch(
      new Request("https://relay.example/live", { method: "POST" }),
      env,
      context([]),
    );
    expect(written.status).toBe(405);
    expect(await written.json()).toEqual({ reason: "get-only" });
    expect(asked).toEqual([]);
  });
});

describe("everything else", () => {
  it("answers a path it does not serve with 404 and a read with 405", async () => {
    const env = testEnv();
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
