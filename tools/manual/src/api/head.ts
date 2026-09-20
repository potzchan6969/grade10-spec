import { useCallback, useEffect, useState } from "react";
import type {
  CheckoutStanding,
  DeployedHead,
  PullOutcome,
  RelayUrl,
} from "./types";

/**
 * Where `main` is, read from the two places that know: the relay, which hears
 * every push, and the dev server, which can see the checkout it is running
 * out of.
 *
 * A page is a reading of one commit. The snapshot it booted from names that
 * commit, so everything here answers one question — has `main` moved past it —
 * and nothing here decides what to do about it: the banner does.
 *
 * The relay's url is not built in. It arrives as `/api/relay`, written at
 * build from `RELAY_URL`, so the same bundle works with a relay, without one,
 * and against a different one. No relay means no socket, no poll, and no
 * banner.
 */

/** What the relay says `main` is: the commit, when the push arrived, and the
 * first line of its message. The socket sends it and `GET /head` answers it. */
export type MainHead = {
  main: string;
  at: string;
  subject: string;
};

/** The relay's head, read on a timer where no line will hold. */
export const HEAD_POLL_MS = 60_000;

/** How long a dropped line waits before it is opened again, and then again.
 * A relay that is being deployed is back within seconds; one that is down
 * stays down, and a page reconnecting every second all afternoon is a page
 * hammering it. Every rung walked and the head is read on a timer instead. */
export const RECONNECT_MS = [1_000, 2_000, 5_000, 15_000, 30_000] as const;

/** What a page sends to keep the line honest. The relay answers it without
 * waking the object that holds the head. */
export const PING = "ping";

/** How often it is sent, and how many intervals may go by with nothing
 * arriving before the line is treated as dropped. A socket the network has
 * abandoned stays open in name for as long as nobody asks. */
export const PING_MS = 30_000;
export const QUIET_PINGS = 2;

/** The standing of the checkout, read while the manual runs locally. */
export const CHECKOUT_POLL_MS = 60_000;

const RELAY = "/api/relay";
const HEAD = "/api/head";
const UPSTREAM = "/api/upstream";
const PULL = "/api/pull";

/** The clock, so a test holds it: run `run` after `after` ms, and a cancel. */
export type Wait = (after: number, run: () => void) => () => void;

/** The clock the app itself runs on. */
export const onTimers: Wait = (after, run) => {
  const timer = setTimeout(run, after);
  return () => clearTimeout(timer);
};

/**
 * One poll loop, the shape every reading here takes: read, wait, read again,
 * until the cancel it returns is called.
 *
 * `next` is read each time round, so a loop that backs off as the page waits
 * says so in its own `next`. `start` is whether the first read is now or one
 * `next()` from now — a page that has just read something is not asking again
 * in the same breath.
 */
export function every(
  wait: Wait,
  next: () => number,
  read: () => void | Promise<void>,
  start: "now" | "later" = "now",
): () => void {
  let stopped = false;
  let cancel: (() => void) | null = null;
  const tick = async () => {
    if (stopped) return;
    await read();
    if (stopped) return;
    cancel = wait(next(), () => void tick());
  };
  if (start === "now") void tick();
  else cancel = wait(next(), () => void tick());
  return () => {
    stopped = true;
    cancel?.();
  };
}

/** One open line to the relay. Closing it and pinging it are all a caller
 * needs to do with it; what arrives on it arrives through the events it was
 * opened with. */
export type Line = { close: () => void; send: (text: string) => void };

/** How a line is opened. The browser's own `WebSocket` is one, and a test is
 * another — the watch never names `WebSocket` itself, so its reconnects can
 * be driven rather than waited for. */
export type OpenLine = (
  url: string,
  events: { message: (text: string) => void; closed: () => void },
) => Line;

export type HeadWatch = {
  /** Called with each head `main` reaches, in the order they arrive. */
  onHead: (head: MainHead) => void;
  http?: typeof fetch;
  /** `null` where the browser has no socket: the watch polls the relay's own
   * head instead. */
  open?: OpenLine | null;
  wait?: Wait;
};

/** The relay's two addresses, from the one url the build was given: the live
 * line, and the head to poll where no socket can be opened. A url with no
 * scheme is read as `https`, the only scheme a deployed relay answers on. */
export function relayEndpoints(relay: string): {
  socket: string;
  head: string;
} {
  const base = /^[a-z]+:\/\//i.test(relay) ? relay : `https://${relay}`;
  const at = base.endsWith("/") ? base : `${base}/`;
  const socket = new URL("live", at);
  socket.protocol = socket.protocol === "http:" ? "ws:" : "wss:";
  return { head: new URL("head", at).toString(), socket: socket.toString() };
}

/**
 * Listens for `main` moving, and says so through `onHead`.
 *
 * One line, with a handoff. A page opens the socket and reads each head off
 * it; a line that drops is opened again on the ladder, and once every rung has
 * been walked the relay's own head is read on a timer until a line holds
 * again — a network that allows https and blocks the upgrade is told that way.
 * A browser with no socket at all starts on the timer, and no relay listens to
 * nothing, which is what the hosted site does until Operations names one.
 *
 * Returns the stop: it closes the line and cancels whatever was waiting, so a
 * page that navigated away is not still listening.
 */
export function watchMainHead(watch: HeadWatch): () => void {
  const http = watch.http ?? fetch;
  const open = watch.open === undefined ? browserLine() : watch.open;
  const wait = watch.wait ?? onTimers;

  let stopped = false;
  let line: Line | null = null;
  let cancelLadder: (() => void) | null = null;
  let cancelPing: (() => void) | null = null;
  let stopPoll: (() => void) | null = null;

  void (async () => {
    const relay = await readRelay(http);
    if (stopped || relay === null) return;
    const addresses = addressesOf(relay);
    // A url nobody can read is a relay nobody can listen to: no line, no
    // timer, and no banner.
    if (addresses === null) return;
    const { socket, head } = addresses;

    /** The relay's head on a timer, started once and stopped by a line that
     * holds. */
    const poll = () => {
      if (stopPoll !== null) return;
      stopPoll = every(wait, () => HEAD_POLL_MS, async () => {
        const found = headOf(await readJson(http, head));
        if (found !== null) watch.onHead(found);
      });
    };

    if (!open) {
      poll();
      return;
    }

    // How many times the line has dropped without a head arriving — what the
    // next wait is read off, and what a head resets.
    let drops = 0;

    const connect = () => {
      /** This line's own life, so its drop is said once however it arrives:
       * the page closing a quiet line and the runtime closing a dead one are
       * the same drop. */
      let alive = true;
      /** Frames since the last ping, and the pings that brought nothing back:
       * a line nothing arrives on is open in name only. */
      let frames = 0;
      let quiet = 0;

      const dropped = () => {
        if (!alive) return;
        alive = false;
        line = null;
        cancelPing?.();
        if (stopped) return;
        cancelLadder = wait(
          RECONNECT_MS[Math.min(drops, RECONNECT_MS.length - 1)],
          connect,
        );
        drops += 1;
        if (drops >= RECONNECT_MS.length) poll();
      };

      const ping = () => {
        quiet = frames === 0 ? quiet + 1 : 0;
        frames = 0;
        if (quiet >= QUIET_PINGS) {
          line?.close();
          dropped();
          return;
        }
        line?.send(PING);
        cancelPing = wait(PING_MS, ping);
      };

      line = open(socket, {
        closed: dropped,
        message: (text) => {
          frames += 1;
          const found = headOf(parse(text));
          if (found === null) return;
          drops = 0;
          // The line is the reading again; the timer that stood in for it
          // stops, and the next exhausted ladder starts it over.
          stopPoll?.();
          stopPoll = null;
          watch.onHead(found);
        },
      });
      cancelPing = wait(PING_MS, ping);
    };
    connect();
  })();

  return () => {
    stopped = true;
    cancelLadder?.();
    cancelPing?.();
    stopPoll?.();
    line?.close();
  };
}

/** The head `main` is at, or nothing at all — which is every page that has no
 * relay to listen to. */
export function useMainHead(): MainHead | null {
  const [head, setHead] = useState<MainHead | null>(null);
  useEffect(() => watchMainHead({ onHead: setHead }), []);
  return head;
}

/** The head the site this page came from was built at. Nothing where the
 * endpoint does not answer, which is a page served by neither transport. */
export async function readDeployedHead(
  http: typeof fetch = fetch,
): Promise<string | null> {
  const answer = await readJson<DeployedHead>(http, HEAD);
  const head = answer?.storeHead;
  return typeof head === "string" && head !== "" ? head : null;
}

/** How the checkout stands against `main`. Nothing where no dev server is
 * behind the page, which is the hosted site. */
export async function readCheckout(
  http: typeof fetch = fetch,
): Promise<CheckoutStanding | null> {
  const answer = await ask<CheckoutStanding>(http, UPSTREAM);
  return answer?.status === 200 ? answer.read : null;
}

/** The pull, in the endpoint's own words: what landed, or the line the reader
 * is shown instead. Every other answer is carried as a line too — a press the
 * reader is told nothing about is the one failure this banner cannot have. */
export async function pullMain(
  http: typeof fetch = fetch,
): Promise<PullOutcome> {
  const answer = await ask<Partial<Record<string, unknown>>>(http, PULL, {
    method: "POST",
  });
  if (answer === null) {
    return { error: "No dev server answered the pull." };
  }
  const read = answer.read;
  if (read.pulled === true && typeof read.head === "string") {
    return { head: read.head, pulled: true };
  }
  if (typeof read.error === "string" && read.error.trim() !== "") {
    return { error: read.error };
  }
  return { error: "The dev server did not say how the pull went." };
}

export type CheckoutWatch = {
  /** Called with each standing that was read, in the order they were read. */
  onStanding: (standing: CheckoutStanding) => void;
  http?: typeof fetch;
  wait?: Wait;
};

/**
 * Reads how the checkout stands, now and every minute after.
 *
 * Beside the two head watches rather than inside the hook, so the minute and
 * the answer nobody serves are driven by a test. The dev server's own fetch is
 * throttled to the same minute, so a second tab costs a status call rather
 * than a second fetch.
 */
export function watchCheckout(watch: CheckoutWatch): () => void {
  const http = watch.http ?? fetch;
  const wait = watch.wait ?? onTimers;
  return every(wait, () => CHECKOUT_POLL_MS, async () => {
    const found = await readCheckout(http);
    if (found !== null) watch.onStanding(found);
  });
}

export type CheckoutReading = {
  standing: CheckoutStanding | null;
  /** The reason the last press was refused, until the next one. */
  refused: string | null;
  pulling: boolean;
  pull: () => void;
  /** Read `origin` again now — what the banner calls the moment the relay
   * says `main` moved. */
  reread: () => void;
};

/**
 * The checkout's standing, while `active`.
 *
 * `active` is the dev server being there at all: the hosted site never reads
 * this, because nothing there would answer.
 */
export function useCheckout(active: boolean): CheckoutReading {
  const [standing, setStanding] = useState<CheckoutStanding | null>(null);
  const [refused, setRefused] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);

  const read = useCallback(async () => {
    const found = await readCheckout();
    if (found !== null) setStanding(found);
  }, []);

  useEffect(() => {
    if (!active) return;
    return watchCheckout({ onStanding: setStanding });
  }, [active]);

  // Stable, because the banner reads `origin` again from an effect: a new
  // identity per render would make that effect a read per render.
  const reread = useCallback(() => void read(), [read]);

  const pull = useCallback(() => {
    setRefused(null);
    setPulling(true);
    void (async () => {
      const outcome = await pullMain();
      await read();
      setPulling(false);
      setRefused("error" in outcome ? outcome.error : null);
    })();
  }, [read]);

  return { pull, pulling, refused, reread, standing };
}

/** The browser's socket as one line. A socket that errors closes right after,
 * so the drop is said once, and a send on a socket the network has already
 * taken away closes it rather than throwing into the ping. */
function browserLine(): OpenLine | null {
  if (typeof WebSocket === "undefined") return null;
  return (url, events) => {
    const socket = new WebSocket(url);
    socket.addEventListener("message", (event) =>
      events.message(String(event.data)),
    );
    socket.addEventListener("close", () => events.closed());
    socket.addEventListener("error", () => socket.close());
    return {
      close: () => socket.close(),
      send: (text) => {
        try {
          socket.send(text);
        } catch {
          socket.close();
        }
      },
    };
  };
}

/** The relay's addresses, or nothing where the url it was given is not one.
 * The variable is typed by hand into the repository's settings, so a value the
 * browser cannot read is a value a reader would otherwise never hear about. */
function addressesOf(relay: string): { socket: string; head: string } | null {
  try {
    return relayEndpoints(relay);
  } catch {
    return null;
  }
}

async function readRelay(http: typeof fetch): Promise<string | null> {
  const answer = await readJson<RelayUrl>(http, RELAY);
  const relay = answer?.url;
  return typeof relay === "string" && relay.trim() !== "" ? relay.trim() : null;
}

/** A head as it arrives, or nothing: a relay mid-deploy can answer a page
 * with anything, and a reading nobody can use is not a move. */
function headOf(value: unknown): MainHead | null {
  const head = (value ?? {}) as Record<string, unknown>;
  const { main, at, subject } = head;
  if (typeof main !== "string" || main === "") return null;
  if (typeof at !== "string" || typeof subject !== "string") return null;
  return { at, main, subject };
}

function parse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** One answer that was read, or nothing at all. A dev server answers
 * `index.html` for a path it does not serve and the hosted site 404s the dev
 * endpoints, so neither is a failure a reader should ever see. */
async function ask<T>(
  http: typeof fetch,
  url: string,
  init?: RequestInit,
): Promise<{ status: number; read: T } | null> {
  try {
    const response = await http(url, init);
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("json")) return null;
    return { read: (await response.json()) as T, status: response.status };
  } catch {
    return null;
  }
}

async function readJson<T>(http: typeof fetch, url: string): Promise<T | null> {
  const answer = await ask<T>(http, url);
  return answer?.status === 200 ? answer.read : null;
}
