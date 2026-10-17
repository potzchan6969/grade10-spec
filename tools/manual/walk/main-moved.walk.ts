import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { openManual } from "./setup";

/**
 * `shared-planning-change-stages-US-10`: a hosted page hears `main` move from
 * the relay and says so. The relay is the walk's own: `/api/relay` names it on
 * `window.fetch`, and its socket is a stand-in on `window.WebSocket` the walk
 * sends heads down, both installed before the shell mounts because the shell
 * reads both through the globals. Everything else reaches the fixture.
 */
const RELAY = "https://relay.walk.test";

class Socket extends EventTarget {
  static open: Socket[] = [];
  readonly url: string;
  constructor(url: string) {
    super();
    this.url = url;
    Socket.open.push(this);
  }
  send(): void {}
  close(): void {
    this.dispatchEvent(new Event("close"));
  }
  /** What the relay sends down the line. */
  head(main: string, subject: string, at: string): void {
    this.dispatchEvent(
      new MessageEvent("message", {
        data: JSON.stringify({ at, main, subject }),
      }),
    );
  }
}

const real = { fetch: window.fetch, socket: window.WebSocket };
let relay: Record<string, unknown>;

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status: 200,
  });

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

beforeEach(() => {
  relay = { url: RELAY };
  Socket.open = [];
  window.WebSocket = Socket as unknown as typeof WebSocket;
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      input instanceof Request ? input.url : String(input),
      window.location.origin,
    );
    if (url.pathname === "/api/relay") return json(relay);
    if (url.origin === RELAY) return json({ main: null });
    return real.fetch.call(window, input, init);
  }) as typeof fetch;
});

afterEach(() => {
  window.fetch = real.fetch;
  window.WebSocket = real.socket;
});

async function theLine(): Promise<Socket> {
  await expect.poll(() => Socket.open.length).toBeGreaterThan(0);
  return Socket.open[Socket.open.length - 1];
}

test("shared-planning-change-stages-US10-TC1-1 - an open page names what landed on `main`", async () => {
  await openManual("/");
  (await theLine()).head(
    "a".repeat(40),
    "feat(store): gift cards",
    minutesAgo(2),
  );

  await expect
    .element(
      page.getByText(/moved 2 minutes ago — feat\(store\): gift cards\./),
    )
    .toBeVisible();
  await expect
    .element(
      page.getByText(/rebuilds in a few minutes and refreshes on its own/),
    )
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: "Refresh now" }))
    .toBeVisible();
});

test("shared-planning-change-stages-US10-TC4-1 - two landings leave one notice naming the later", async () => {
  await openManual("/");
  const line = await theLine();
  line.head("a".repeat(40), "feat(store): gift cards", minutesAgo(3));
  line.head("c".repeat(40), "fix(store): gift card balance", minutesAgo(1));

  await expect
    .element(page.getByText(/fix\(store\): gift card balance\./))
    .toBeVisible();
  await expect
    .element(page.getByText(/feat\(store\): gift cards\./))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole("button", { name: "Refresh now" }))
    .toBeVisible();
  expect(
    page.getByRole("button", { name: "Refresh now" }).elements(),
  ).toHaveLength(1);
});

test("shared-planning-change-stages-US10-TC5-1 - no relay, no banner", async () => {
  relay = {};
  await openManual("/");

  await expect.element(page.getByRole("heading").first()).toBeVisible();
  expect(Socket.open).toHaveLength(0);
  await expect
    .element(page.getByRole("button", { name: "Refresh now" }))
    .not.toBeInTheDocument();
});
