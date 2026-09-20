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

/** What the relay says `main` is: the commit, when it landed, and the first
 * line of its message. The socket sends it and `GET /head` answers it. */
export type MainHead = {
  main: string;
  at: string;
  subject: string;
};

/** The relay's head, polled where the browser has no socket. */
export const HEAD_POLL_MS = 60_000;

/** How long a dropped line waits before it is opened again, and then again.
 * A relay that is being deployed is back within seconds; one that is down
 * stays down, and a page reconnecting every second all afternoon is a page
 * hammering it. */
export const RECONNECT_MS = [1_000, 2_000, 5_000, 15_000, 30_000] as const;

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

/** One open line to the relay. Closing it is all a caller needs to do with
 * it; what arrives on it arrives through the events it was opened with. */
export type Line = { close: () => void };

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
 * Three readings, in the order the deployment takes them: a relay with a
 * socket is the live one; a relay with no socket in the browser is polled;
 * no relay at all does nothing, which is what the hosted site does until
 * Operations names one.
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
  let cancel: (() => void) | null = null;

  void (async () => {
    const relay = await readRelay(http);
    if (stopped || relay === null) return;
    const { socket, head } = relayEndpoints(relay);

    if (open) {
      // How many times the line has dropped without a head arriving — what
      // the next wait is read off, and what a head resets.
      let drops = 0;
      const connect = () => {
        line = open(socket, {
          closed: () => {
            line = null;
            if (stopped) return;
            cancel = wait(
              RECONNECT_MS[Math.min(drops, RECONNECT_MS.length - 1)],
              connect,
            );
            drops += 1;
          },
          message: (text) => {
            const found = headOf(parse(text));
            if (found === null) return;
            drops = 0;
            watch.onHead(found);
          },
        });
      };
      connect();
      return;
    }

    const poll = async () => {
      const found = headOf(await readJson(http, head));
      if (stopped) return;
      if (found !== null) watch.onHead(found);
      cancel = wait(HEAD_POLL_MS, () => void poll());
    };
    await poll();
  })();

  return () => {
    stopped = true;
    cancel?.();
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
 * this, because nothing there would answer. The poll is a minute, and the
 * dev server's own fetch is throttled to the same minute, so a second tab
 * costs a status call rather than a second fetch.
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
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      await read();
      if (stopped) return;
      timer = setTimeout(() => void tick(), CHECKOUT_POLL_MS);
    };
    void tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [active, read]);

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
 * so the drop is said once. */
function browserLine(): OpenLine | null {
  if (typeof WebSocket === "undefined") return null;
  return (url, events) => {
    const socket = new WebSocket(url);
    socket.addEventListener("message", (event) =>
      events.message(String(event.data)),
    );
    socket.addEventListener("close", () => events.closed());
    socket.addEventListener("error", () => socket.close());
    return { close: () => socket.close() };
  };
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
