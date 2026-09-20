import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseSlackRequest,
  postMessage,
  routeMessage,
  signSlackRequest,
  verifySlackSignature,
  wordOf,
} from "../src/slack.ts";

/** The Slack side: the v0 signature over the body as it arrived, the events the
 * relay ignores, the word a message says, the room it wakes, and the one call
 * that posts. */

const SECRET = "8f742231b10e8888abcd99yyyzzz85a5";
const BODY = '{"type":"event_callback","event_id":"Ev1"}';
const TIMESTAMP = "1700000000";
// HMAC-SHA256 of `v0:1700000000:{"type":"event_callback","event_id":"Ev1"}`
// under the secret above, computed away from this code.
const SIGNATURE =
  "v0=6462f70d015421bf083caf5eaa3239cac303b5959b170bcf79d340b06ae43983";
const NOW = 1_700_000_000_000;

const APP = "U0APP";
const CHANNEL = "C0PLAN";

function envelope(event: Record<string, unknown>): unknown {
  return {
    type: "event_callback",
    event_id: "Ev1",
    authorizations: [{ user_id: APP }],
    event: { type: "message", channel: CHANNEL, ...event },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the v0 signature", () => {
  it("accepts the hand-computed vector", async () => {
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: TIMESTAMP, signature: SIGNATURE, body: BODY },
        NOW,
      ),
    ).toBe(true);
  });

  it("signs what it verifies", async () => {
    expect(await signSlackRequest(SECRET, TIMESTAMP, BODY)).toBe(SIGNATURE);
  });

  it("refuses a body that changed under the signature", async () => {
    expect(
      await verifySlackSignature(
        SECRET,
        {
          timestamp: TIMESTAMP,
          signature: SIGNATURE,
          body: '{"type":"event_callback","event_id":"Ev2"}',
        },
        NOW,
      ),
    ).toBe(false);
  });

  it("refuses another secret's signature", async () => {
    expect(
      await verifySlackSignature(
        "another-signing-secret",
        { timestamp: TIMESTAMP, signature: SIGNATURE, body: BODY },
        NOW,
      ),
    ).toBe(false);
  });

  it("refuses a timestamp outside the five-minute window", async () => {
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: TIMESTAMP, signature: SIGNATURE, body: BODY },
        NOW + 6 * 60_000,
      ),
    ).toBe(false);
  });

  it("accepts one inside the window", async () => {
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: TIMESTAMP, signature: SIGNATURE, body: BODY },
        NOW + 4 * 60_000,
      ),
    ).toBe(true);
  });

  it("refuses a request with no signature and no timestamp", async () => {
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: null, signature: null, body: BODY },
        NOW,
      ),
    ).toBe(false);
  });
});

describe("the word a message says", () => {
  it("strips the app's mention, trims and folds the case", () => {
    expect(wordOf(`<@${APP}> Land`)).toBe("land");
    expect(wordOf("  LAND WITH RECOMMENDATIONS  ")).toBe(
      "land with recommendations",
    );
  });

  it("leaves a mention inside a sentence where it is", () => {
    expect(wordOf(`please <@${APP}> land`)).toBe("please <@u0app> land");
  });
});

describe("the envelope", () => {
  it("answers a url_verification with its challenge", () => {
    expect(
      parseSlackRequest({ type: "url_verification", challenge: "abc" }, APP),
    ).toEqual({ kind: "url_verification", challenge: "abc" });
  });

  it("ignores a bot's own message", () => {
    expect(
      parseSlackRequest(
        envelope({ bot_id: "B0", ts: "1.1", text: "Reading…" }),
        APP,
      ),
    ).toEqual({ kind: "ignored", why: "bot_id" });
  });

  it("ignores an edit, a join and everything else with a subtype", () => {
    expect(
      parseSlackRequest(
        envelope({ subtype: "message_changed", ts: "1.1", text: "land" }),
        APP,
      ),
    ).toEqual({ kind: "ignored", why: "subtype" });
  });

  it("ignores the app's own user", () => {
    expect(
      parseSlackRequest(
        envelope({ user: APP, ts: "1.1", text: "Reading…" }),
        APP,
      ),
    ).toEqual({ kind: "ignored", why: "own-message" });
  });

  it("ignores an event that is not a message, and an envelope with none", () => {
    expect(
      parseSlackRequest(
        { type: "event_callback", event: { type: "channel_join" } },
        APP,
      ),
    ).toEqual({ kind: "ignored", why: "not-a-message" });
    expect(parseSlackRequest({ type: "event_callback" }, APP)).toEqual({
      kind: "ignored",
      why: "no-event",
    });
  });

  it("reads a thread reply down to one message", () => {
    expect(
      parseSlackRequest(
        envelope({
          user: "U0PM",
          ts: "1700000002.000100",
          thread_ts: "1700000000.000100",
          text: "land",
        }),
        APP,
      ),
    ).toEqual({
      kind: "message",
      message: {
        channel: CHANNEL,
        ts: "1700000002.000100",
        threadTs: "1700000000.000100",
        user: "U0PM",
        text: "land",
        mentionsApp: false,
      },
    });
  });

  it("reads a top-level message as its own thread root", () => {
    const parsed = parseSlackRequest(
      envelope({
        user: "U0PM",
        ts: "1700000000.000100",
        thread_ts: "1700000000.000100",
        text: `<@${APP}> plan the cart badge`,
      }),
      APP,
    );
    expect(parsed.kind === "message" && parsed.message.threadTs).toBe(null);
    expect(parsed.kind === "message" && parsed.message.mentionsApp).toBe(true);
  });

  it("takes the app's member id from the deployment where the envelope names none", () => {
    const parsed = parseSlackRequest(
      {
        type: "event_callback",
        event: {
          type: "message",
          channel: CHANNEL,
          user: "U0PM",
          ts: "1.1",
          text: `<@${APP}> plan it`,
        },
      },
      APP,
    );
    expect(parsed.kind === "message" && parsed.message.mentionsApp).toBe(true);
  });

  it("reads an app it cannot name as an app nobody addressed", () => {
    // A mention of somebody else would otherwise open a room.
    const parsed = parseSlackRequest(
      {
        type: "event_callback",
        event: {
          type: "message",
          channel: CHANNEL,
          user: "U0PM",
          ts: "1.1",
          text: "<@U0SOMEBODY> have a look",
        },
      },
      "",
    );
    expect(parsed.kind === "message" && parsed.message.mentionsApp).toBe(false);
  });
});

describe("the room a message wakes", () => {
  const message = {
    channel: CHANNEL,
    ts: "1700000000.000100",
    threadTs: null,
    user: "U0PM",
    text: `<@${APP}> plan the cart badge`,
    mentionsApp: true,
  };

  it("opens a room on a top-level message that mentions the app", () => {
    expect(routeMessage(message, CHANNEL)).toEqual({
      room: `${CHANNEL}/1700000000.000100`,
      thread: { channel: CHANNEL, ts: "1700000000.000100" },
      reason: "plan",
      requireRoom: false,
    });
  });

  it("wakes nothing on a top-level message that mentions nobody", () => {
    expect(routeMessage({ ...message, mentionsApp: false }, CHANNEL)).toBe(
      null,
    );
  });

  it("wakes nothing outside the planning channel", () => {
    expect(routeMessage(message, "C0OTHER")).toBe(null);
  });

  it("wakes the thread's room on a reply that mentions the app", () => {
    expect(
      routeMessage(
        {
          ...message,
          ts: "1700000002.000100",
          threadTs: "1700000000.000100",
        },
        CHANNEL,
      ),
    ).toEqual({
      room: `${CHANNEL}/1700000000.000100`,
      thread: { channel: CHANNEL, ts: "1700000000.000100" },
      reason: "message",
      requireRoom: false,
    });
  });

  it("wakes a reply that mentions nobody only where the room exists", () => {
    expect(
      routeMessage(
        {
          ...message,
          mentionsApp: false,
          ts: "1700000002.000100",
          threadTs: "1700000000.000100",
        },
        CHANNEL,
      ),
    ).toMatchObject({ requireRoom: true });
  });
});

describe("posting", () => {
  it("shared-planning-agent-rounds-SC-74 - A run posts through the relay and never holds the token", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(
        JSON.stringify({ ok: true, ts: "1700000003.000100" }),
      );
    });
    const ts = await postMessage(
      "xoxb-from-the-environment",
      CHANNEL,
      "Reading… https://runs.example/1",
      "1700000000.000100",
    );
    expect(ts).toBe("1700000003.000100");
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://slack.com/api/chat.postMessage");
    expect(
      (calls[0].init.headers as Record<string, string>).authorization,
    ).toBe("Bearer xoxb-from-the-environment");
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      channel: CHANNEL,
      text: "Reading… https://runs.example/1",
      thread_ts: "1700000000.000100",
    });
  });

  it("posts to the channel when there is no thread", async () => {
    const bodies: string[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      bodies.push(String(init.body));
      return new Response(JSON.stringify({ ok: true, ts: "1.1" }));
    });
    await postMessage("xoxb", CHANNEL, "no thread here");
    expect(JSON.parse(bodies[0])).toEqual({
      channel: CHANNEL,
      text: "no thread here",
    });
  });

  it("stops on a post Slack refused", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response(JSON.stringify({ ok: false, error: "channel_not_found" })),
    );
    await expect(postMessage("xoxb", CHANNEL, "hello")).rejects.toThrow(
      "channel_not_found",
    );
  });
});
