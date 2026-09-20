import { describe, expect, it } from "vitest";
import {
  HEAD_POLL_MS,
  type Line,
  type MainHead,
  type OpenLine,
  RECONNECT_MS,
  relayEndpoints,
  watchMainHead,
} from "../src/api/head";
import { fakeClock, fakeHttp, settle } from "./fake-net";

/**
 * Where `main` is, as the relay says it.
 *
 * No relay is the deployed default — the variable is unset until Operations
 * sets it — so the reading that opens nothing is as much of the contract as
 * the socket. The socket and the clock are both held here: a watch that
 * reconnected on its own schedule would be a test that sometimes passes.
 */

const HEAD: MainHead = {
  at: "2026-09-20T09:00:00.000Z",
  main: "9f1c2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  subject: "docs(planning): the surfaces round on both changes",
};

const RELAY = "https://relay.test";
const RELAY_URL = "/api/relay";

/** The lines a watch opened, each one still holding the events it was given —
 * a message arrives because the test hands it over, and a close because the
 * test says the line dropped. */
function fakeLines() {
  const opened: {
    url: string;
    closed: boolean;
    message: (text: string) => void;
    drop: () => void;
  }[] = [];
  const open: OpenLine = (url, events) => {
    const line = {
      closed: false,
      drop: events.closed,
      message: events.message,
      url,
    };
    opened.push(line);
    const handle: Line = {
      close: () => {
        line.closed = true;
      },
    };
    return handle;
  };
  const last = () => {
    const line = opened.at(-1);
    if (line === undefined) throw new Error("no line was opened");
    return line;
  };
  return { last, open, opened, urls: () => opened.map((one) => one.url) };
}

describe("the relay's own addresses", () => {
  it.each([
    ["https://relay.test", "wss://relay.test/live", "https://relay.test/head"],
    [
      "http://localhost:8787",
      "ws://localhost:8787/live",
      "http://localhost:8787/head",
    ],
    ["https://relay.test/", "wss://relay.test/live", "https://relay.test/head"],
    ["relay.test", "wss://relay.test/live", "https://relay.test/head"],
  ])("reads %s as one socket and one head", (relay, socket, head) => {
    expect(relayEndpoints(relay)).toEqual({ head, socket });
  });
});

describe("a relay with a socket", () => {
  const watch = () => {
    const { asked, http } = fakeHttp({ [RELAY_URL]: { url: RELAY } });
    const lines = fakeLines();
    const clock = fakeClock();
    const heads: MainHead[] = [];
    const stop = watchMainHead({
      http,
      onHead: (head) => heads.push(head),
      open: lines.open,
      wait: clock.wait,
    });
    return { asked, clock, heads, lines, stop };
  };

  it("opens the live line and reads each head off it", async () => {
    const { asked, heads, lines, stop } = watch();
    await settle();

    expect(asked).toEqual([RELAY_URL]);
    expect(lines.urls()).toEqual(["wss://relay.test/live"]);

    lines.last().message(JSON.stringify(HEAD));
    expect(heads).toEqual([HEAD]);

    stop();
    expect(lines.last().closed).toBe(true);
  });

  it("ignores a message that is not a head", async () => {
    const { heads, lines } = watch();
    await settle();

    for (const text of ["", "not json", "{}", '{"main":1}']) {
      lines.last().message(text);
    }

    expect(heads).toEqual([]);
  });

  it("waits longer each time the line drops", async () => {
    const { clock, lines } = watch();
    await settle();

    lines.last().drop();
    expect(clock.next()).toBe(RECONNECT_MS[0]);

    await clock.fire();
    expect(lines.urls()).toHaveLength(2);

    lines.last().drop();
    expect(clock.next()).toBe(RECONNECT_MS[1]);
  });

  it("starts the waits over once a head arrives", async () => {
    const { clock, lines } = watch();
    await settle();

    lines.last().drop();
    await clock.fire();
    lines.last().message(JSON.stringify(HEAD));
    lines.last().drop();

    expect(clock.next()).toBe(RECONNECT_MS[0]);
  });

  it("opens nothing more once it is stopped", async () => {
    const { clock, lines, stop } = watch();
    await settle();

    stop();
    lines.last().drop();

    expect(clock.waits).toEqual([]);
    expect(lines.urls()).toHaveLength(1);
  });
});

describe("a relay with no socket in the browser", () => {
  it("polls the relay's head every minute", async () => {
    const { asked, http } = fakeHttp({
      [RELAY_URL]: { url: RELAY },
      "https://relay.test/head": HEAD,
    });
    const clock = fakeClock();
    const heads: MainHead[] = [];

    watchMainHead({
      http,
      onHead: (head) => heads.push(head),
      open: null,
      wait: clock.wait,
    });
    await settle();

    expect(asked).toEqual([RELAY_URL, "https://relay.test/head"]);
    expect(heads).toEqual([HEAD]);
    expect(clock.next()).toBe(HEAD_POLL_MS);

    await clock.fire();
    expect(asked).toHaveLength(3);
    expect(heads).toHaveLength(2);
  });
});

describe("no relay", () => {
  it.each([
    ["the endpoint names none", { [RELAY_URL]: {} }],
    ["the endpoint names an empty one", { [RELAY_URL]: { url: "" } }],
    ["nothing serves the endpoint", {}],
  ])("does nothing where %s", async (_what, answers) => {
    const { http } = fakeHttp(answers);
    const lines = fakeLines();
    const clock = fakeClock();
    const heads: MainHead[] = [];

    watchMainHead({
      http,
      onHead: (head) => heads.push(head),
      open: lines.open,
      wait: clock.wait,
    });
    await settle();

    expect(lines.opened).toEqual([]);
    expect(clock.waits).toEqual([]);
    expect(heads).toEqual([]);
  });
});
