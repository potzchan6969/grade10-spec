import { afterEach, describe, expect, it, vi } from "vitest";
import {
  actionPayload,
  confirmBlocks,
  confirmedBlocks,
  confirmedLine,
  isLandingWord,
  parseSlackAction,
  parseSlackRequest,
  postMessage,
  pressedLine,
  pressedMessage,
  routeMessage,
  signSlackRequest,
  updateMessage,
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

  it("takes land and land with recommendations, trimmed and in any case", () => {
    expect(isLandingWord("land")).toBe(true);
    expect(isLandingWord("  Land With Recommendations ")).toBe(true);
    expect(isLandingWord("LAND")).toBe(true);
  });

  it("takes a landing word behind a mention of the app", () => {
    expect(isLandingWord(`<@${APP}> land`)).toBe(true);
    expect(isLandingWord(`  <@${APP}>  land with recommendations`)).toBe(true);
  });

  it("is no landing word at all inside a sentence", () => {
    expect(isLandingWord("land the proposal please")).toBe(false);
    expect(isLandingWord("ship it")).toBe(false);
    expect(isLandingWord(`please <@${APP}> land`)).toBe(false);
    expect(isLandingWord(null)).toBe(false);
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

describe("a press", () => {
  const PAYLOAD = {
    type: "block_actions",
    user: { id: "U0PM" },
    container: {
      channel_id: CHANNEL,
      message_ts: "1700000005.000100",
      thread_ts: "1700000000.000100",
    },
    message: {
      text: "*What is next* — your word on the proposal",
      ts: "1700000005.000100",
      thread_ts: "1700000000.000100",
    },
    actions: [
      {
        action_id: "confirm",
        value: "land",
        action_ts: "1700000009.000100",
        text: { type: "plain_text", text: "Confirm proposal" },
      },
    ],
  };

  const form = (payload: unknown) =>
    `payload=${encodeURIComponent(JSON.stringify(payload))}`;

  const pressed = (over: Record<string, unknown> = {}) =>
    parseSlackAction({ ...PAYLOAD, ...over });

  it("reads the form's one field", () => {
    expect(actionPayload(form(PAYLOAD))).toEqual(PAYLOAD);
  });

  it("reads no payload from a body that names none, or names one that is not JSON", () => {
    expect(actionPayload("")).toBe(null);
    expect(actionPayload("ssl_check=1")).toBe(null);
    expect(actionPayload("payload=not-json")).toBe(null);
  });

  it("reads a block_actions payload down to one press", () => {
    expect(pressed()).toEqual({
      kind: "confirm",
      press: {
        channel: CHANNEL,
        threadTs: "1700000000.000100",
        messageTs: "1700000005.000100",
        actionTs: "1700000009.000100",
        user: "U0PM",
        word: "land",
        label: "Confirm proposal",
        text: "*What is next* — your word on the proposal",
      },
    });
  });

  it("takes the thread from the message, then from the message the button is on", () => {
    const fromMessage = pressed({
      container: { channel_id: CHANNEL, message_ts: "1700000005.000100" },
    });
    expect(fromMessage.kind === "confirm" && fromMessage.press.threadTs).toBe(
      "1700000000.000100",
    );
    // A button on a message with no thread of its own: a reply to it opens
    // the thread, so the message is its own root.
    const alone = pressed({
      container: { channel_id: CHANNEL, message_ts: "1700000005.000100" },
      message: { text: "no thread here", ts: "1700000005.000100" },
    });
    expect(alone.kind === "confirm" && alone.press.threadTs).toBe(
      "1700000005.000100",
    );
  });

  it("ignores an interaction that is not a press", () => {
    expect(pressed({ type: "view_submission" })).toEqual({
      kind: "ignored",
      why: "not-block-actions",
    });
    expect(parseSlackAction(null)).toEqual({
      kind: "ignored",
      why: "not-block-actions",
    });
  });

  it("ignores a button the relay did not issue, and one saying no word", () => {
    expect(
      pressed({ actions: [{ action_id: "somebody-else", value: "land" }] }),
    ).toEqual({ kind: "ignored", why: "not-a-confirm" });
    expect(pressed({ actions: [{ action_id: "confirm", value: " " }] })).toEqual(
      { kind: "ignored", why: "not-a-confirm" },
    );
    expect(pressed({ actions: [] })).toEqual({
      kind: "ignored",
      why: "not-a-confirm",
    });
  });

  it("ignores a press that names no thread and no message", () => {
    expect(pressed({ container: {}, message: {} })).toEqual({
      kind: "ignored",
      why: "no-thread",
    });
  });

  it("is the thread reply that says the word", () => {
    const press = pressed();
    if (press.kind !== "confirm") throw new Error("the press was ignored");
    expect(pressedMessage(press.press)).toEqual({
      channel: CHANNEL,
      ts: "1700000009.000100",
      threadTs: "1700000000.000100",
      user: "U0PM",
      text: "land",
      mentionsApp: false,
    });
    // Routed exactly as a reply saying it: the thread's own room, and no room
    // opened by a press.
    expect(routeMessage(pressedMessage(press.press), CHANNEL)).toEqual({
      room: `${CHANNEL}/1700000000.000100`,
      thread: { channel: CHANNEL, ts: "1700000000.000100" },
      reason: "message",
      requireRoom: true,
    });
    expect(routeMessage(pressedMessage(press.press), "C0OTHER")).toBe(null);
  });

  it("refuses a press the signing secret does not sign", async () => {
    const body = form(PAYLOAD);
    const signature = await signSlackRequest(SECRET, TIMESTAMP, body);
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: TIMESTAMP, signature, body },
        NOW,
      ),
    ).toBe(true);
    // The form as it arrived is what is signed: a payload read and written
    // back has another signature.
    expect(
      await verifySlackSignature(
        SECRET,
        { timestamp: TIMESTAMP, signature, body: form(PAYLOAD.actions[0]) },
        NOW,
      ),
    ).toBe(false);
  });

  it("says in the thread who pressed it, and what the map does not name", () => {
    const press = pressed();
    if (press.kind !== "confirm") throw new Error("the press was ignored");
    expect(pressedLine(press.press, "ecchochan")).toBe(
      "@ecchochan pressed *Confirm proposal*",
    );
    expect(pressedLine(press.press, null)).toBe(
      "<@U0PM> pressed *Confirm proposal* — the team map does not name this member, so nothing lands on it",
    );
    expect(confirmedLine(press.press, "ecchochan")).toBe(
      "Confirmed by @ecchochan",
    );
    expect(confirmedLine(press.press, null)).toBe("Confirmed by <@U0PM>");
  });
});

describe("the blocks", () => {
  it("is the line and one button", () => {
    expect(
      confirmBlocks("your word on the proposal", {
        label: "Confirm proposal",
        word: "land",
      }),
    ).toEqual([
      {
        type: "section",
        text: { type: "mrkdwn", text: "your word on the proposal" },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Confirm proposal" },
            action_id: "confirm",
            value: "land",
            style: "primary",
          },
        ],
      },
    ]);
  });

  it("is the line and a context line once the press is in", () => {
    expect(
      confirmedBlocks("your word on the proposal", "Confirmed by @ecchochan"),
    ).toEqual([
      {
        type: "section",
        text: { type: "mrkdwn", text: "your word on the proposal" },
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "Confirmed by @ecchochan" }],
      },
    ]);
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

  it("carries the blocks a button needs, with the text as the fallback", async () => {
    const bodies: string[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      bodies.push(String(init.body));
      return new Response(JSON.stringify({ ok: true, ts: "1.1" }));
    });
    const blocks = confirmBlocks("your word", {
      label: "Confirm proposal",
      word: "land",
    });
    await postMessage("xoxb", CHANNEL, "your word", "1.1", blocks);
    expect(JSON.parse(bodies[0])).toEqual({
      channel: CHANNEL,
      text: "your word",
      thread_ts: "1.1",
      blocks,
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

describe("updating", () => {
  it("replaces the message's blocks, keeping its text", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ ok: true, ts: "1.1" }));
    });
    const blocks = confirmedBlocks("your word", "Confirmed by @ecchochan");
    await updateMessage("xoxb", CHANNEL, "1700000005.000100", "your word", blocks);
    expect(calls[0].url).toBe("https://slack.com/api/chat.update");
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      channel: CHANNEL,
      ts: "1700000005.000100",
      text: "your word",
      blocks,
    });
  });

  it("stops on an update Slack refused, for the caller to log", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response(JSON.stringify({ ok: false, error: "message_not_found" })),
    );
    await expect(
      updateMessage("xoxb", CHANNEL, "1.1", "your word", []),
    ).rejects.toThrow("message_not_found");
  });
});
