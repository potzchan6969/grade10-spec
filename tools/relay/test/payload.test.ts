import { describe, expect, it } from "vitest";
import { buildPayload, payloadText } from "../src/payload.ts";

/** The payload is the relay's contract with the store's scripts: the same keys,
 * in the same order, whatever woke the room. */

const THREAD = { channel: "C0PLAN", ts: "1700000000.000100" };

const handles: Record<string, string> = { U0PM: "@ecchochan" };

const input = {
  relayUrl: "https://grade10-relay.workers.dev",
  token: "eyJ0b2tlbiI6MX0.c2lnbmF0dXJl",
  change: "nav-cart-count-badge",
  reason: "message" as const,
  thread: THREAD,
  messages: [{ slack: "U0PM", text: "land", ts: "1700000002.000100" }],
  landing: null,
  lastPostTs: null,
  handleOf: (slack: string) => handles[slack] ?? null,
};

describe("the payload", () => {
  it("carries the contract's keys in the contract's order", () => {
    const payload = buildPayload(input);
    expect(Object.keys(payload)).toEqual([
      "relay",
      "change",
      "reason",
      "thread",
      "sender",
      "messages",
      "landing",
    ]);
    expect(payload).toEqual({
      relay: {
        url: "https://grade10-relay.workers.dev",
        token: "eyJ0b2tlbiI6MX0.c2lnbmF0dXJl",
      },
      change: "nav-cart-count-badge",
      reason: "message",
      thread: THREAD,
      sender: { slack: "U0PM", handle: "@ecchochan" },
      messages: [
        {
          handle: "@ecchochan",
          slack: "U0PM",
          text: "land",
          ts: "1700000002.000100",
        },
      ],
      landing: null,
    });
  });

  it("names the wake token and no other credential", () => {
    expect(payloadText(input)).toContain(
      '"token":"eyJ0b2tlbiI6MX0.c2lnbmF0dXJl"',
    );
    expect(payloadText(input)).not.toContain("xoxb");
  });

  it("leaves the handle null for a member the team map does not name", () => {
    const payload = buildPayload({
      ...input,
      messages: [{ slack: "U0NEW", text: "hello", ts: "1700000002.000100" }],
    });
    expect(payload.messages[0].handle).toBe(null);
    expect(payload.sender).toEqual({ slack: "U0NEW", handle: null });
  });

  it("carries the messages since the run's last post", () => {
    const payload = buildPayload({
      ...input,
      lastPostTs: "1700000002.000100",
      messages: [
        { slack: "U0PM", text: "already read", ts: "1700000001.000100" },
        { slack: "U0PM", text: "the post itself", ts: "1700000002.000100" },
        { slack: "U0PM", text: "said since", ts: "1700000003.000100" },
      ],
    });
    expect(payload.messages.map((message) => message.text)).toEqual([
      "said since",
    ]);
  });

  it("has no sender on a landing wake", () => {
    const payload = buildPayload({
      ...input,
      reason: "landing",
      messages: [],
      landing: { base: "aaaaaaa", head: "bbbbbbb" },
    });
    expect(payload.sender).toBe(null);
    expect(payload.landing).toEqual({ base: "aaaaaaa", head: "bbbbbbb" });
    expect(payload.messages).toEqual([]);
  });

  it("carries a null change until the run names one", () => {
    const payload = buildPayload({ ...input, change: null, reason: "plan" });
    expect(payload.change).toBe(null);
    expect(payload.reason).toBe("plan");
  });
});
