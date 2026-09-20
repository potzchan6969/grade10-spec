import { describe, expect, it } from "vitest";
import {
  CHECKOUT_POLL_MS,
  HEAD_POLL_MS,
  type MainHead,
  PING,
  PING_MS,
  QUIET_PINGS,
  RECONNECT_MS,
  relayEndpoints,
  watchCheckout,
  watchMainHead,
} from "../src/api/head";
import type { CheckoutStanding } from "../src/api/types";
import { fakeClock, fakeHttp, fakeLines, settle } from "./fake-net";

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
const RELAY_HEAD = "https://relay.test/head";
const UPSTREAM = "/api/upstream";

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
    const { asked, http } = fakeHttp({
      [RELAY_URL]: { url: RELAY },
      [RELAY_HEAD]: HEAD,
    });
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

    expect(clock.waits.filter((one) => one.cancelled !== true)).toEqual([]);
    expect(lines.urls()).toHaveLength(1);
  });

  it("shared-planning-change-stages-SC-72 - reads the relay's head once the reconnects stop finding a line", async () => {
    // A network that allows https and blocks the upgrade reconnects forever
    // and is told nothing. Every rung walked, and the head is read on a timer
    // until a line holds again.
    const { asked, clock, heads, lines } = watch();
    await settle();

    for (const _rung of RECONNECT_MS) {
      lines.last().drop();
      await clock.fire();
    }

    expect(asked).toContain(RELAY_HEAD);
    expect(heads).toEqual([HEAD]);
    expect(clock.next()).toBe(HEAD_POLL_MS);
  });

  it("stops reading the head once a line holds again", async () => {
    const { asked, clock, lines } = watch();
    await settle();
    for (const _rung of RECONNECT_MS) {
      lines.last().drop();
      await clock.fire();
    }
    const read = asked.filter((url) => url === RELAY_HEAD).length;

    lines.last().message(JSON.stringify(HEAD));
    await clock.fire();

    expect(asked.filter((url) => url === RELAY_HEAD)).toHaveLength(read);
  });

  it("pings the line, and drops it where two pings bring nothing back", async () => {
    // The relay answers `ping` with `pong` without waking, so a line that
    // brings nothing back for two intervals is open in name only.
    const { clock, lines } = watch();
    await settle();
    lines.last().message(JSON.stringify(HEAD));

    expect(clock.next()).toBe(PING_MS);

    await clock.fire();
    expect(lines.last().sent).toEqual([PING]);

    for (let quiet = 1; quiet <= QUIET_PINGS; quiet += 1) {
      await clock.fire();
    }

    expect(lines.opened[0].closed).toBe(true);
    expect(clock.next()).toBe(RECONNECT_MS[0]);
  });

  it("keeps the line while something is arriving on it", async () => {
    const { clock, lines } = watch();
    await settle();

    for (let ping = 0; ping < QUIET_PINGS + 2; ping += 1) {
      await clock.fire();
      lines.last().message('{"main":null}');
    }

    expect(lines.last().closed).toBe(false);
    expect(lines.last().sent).toHaveLength(QUIET_PINGS + 2);
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
    // A variable nobody can read is a relay nobody can listen to: the page
    // shows no banner rather than failing inside a watch nothing is awaiting.
    ["the url cannot be read", { [RELAY_URL]: { url: "https://[oops" } }],
  ])(
    "shared-planning-change-stages-SC-75 - does nothing where %s",
    async (_what, answers) => {
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
    },
  );
});

describe("the checkout the page is run out of", () => {
  it("reads the standing now, and again every minute", async () => {
    const standing: CheckoutStanding = { ahead: 0, behind: 2, dirty: false };
    const { asked, http } = fakeHttp({ [UPSTREAM]: standing });
    const clock = fakeClock();
    const read: CheckoutStanding[] = [];

    const stop = watchCheckout({
      http,
      onStanding: (one) => read.push(one),
      wait: clock.wait,
    });
    await settle();

    expect(asked).toEqual([UPSTREAM]);
    expect(read).toEqual([standing]);
    expect(clock.next()).toBe(CHECKOUT_POLL_MS);

    await clock.fire();
    expect(read).toHaveLength(2);

    stop();
    await clock.fire();
    expect(read).toHaveLength(2);
  });

  it("says nothing where no dev server answers", async () => {
    const { http } = fakeHttp({});
    const clock = fakeClock();
    const read: CheckoutStanding[] = [];

    watchCheckout({
      http,
      onStanding: (one) => read.push(one),
      wait: clock.wait,
    });
    await settle();

    expect(read).toEqual([]);
    expect(clock.next()).toBe(CHECKOUT_POLL_MS);
  });
});
