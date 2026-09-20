import type { Line, OpenLine } from "../src/api/head";

/**
 * The three seams every live reading is driven through: the network, the clock
 * and the line.
 *
 * The banner and the head watch both read an endpoint on a timer, and a test
 * that waited for either would be a test that sometimes passes. One helper, so
 * the poll in `head.test.ts` and the poll in `main-moved.test.tsx` are held the
 * same way.
 */

/** A settled microtask queue: a watch reads its first endpoint before it opens
 * or schedules anything, so every case awaits that read. */
export const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

/** A `fetch` that answers the urls it was given and 404s the rest, recording
 * what was asked, in order. */
export function fakeHttp(answers: Record<string, unknown>) {
  const asked: string[] = [];
  const http = (async (input: string | URL) => {
    const url = String(input);
    asked.push(url);
    const answer = answers[url];
    if (answer === undefined) return new Response("no", { status: 404 });
    return new Response(JSON.stringify(answer), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  }) as typeof fetch;
  return { asked, http };
}

type Waiting = { after: number; run: () => void; cancelled?: true };

/** The clock a watch schedules on: every wait is recorded with its delay, and
 * a test fires it when it means to rather than when a timer would. */
export function fakeClock() {
  const waits: Waiting[] = [];
  const wait = (after: number, run: () => void) => {
    const one: Waiting = { after, run };
    waits.push(one);
    return () => {
      one.cancelled = true;
    };
  };
  /** The delay the newest wait was scheduled for. */
  const next = () => waits.at(-1)?.after;
  /**
   * Run a wait, the way a timer would, and let what it started settle.
   *
   * The newest by default. `after` names one by its delay instead — what a
   * case means where two loops are waiting at once and the newest is not the
   * one it is driving.
   */
  const fire = async (after?: number) => {
    const one =
      after === undefined
        ? waits.at(-1)
        : waits.findLast(
            (one) => one.after === after && one.cancelled !== true,
          );
    if (one === undefined) {
      throw new Error(
        after === undefined ? "nothing is waiting" : `nothing waits ${after}ms`,
      );
    }
    one.run();
    await settle();
  };
  return { fire, next, wait, waits };
}

/** The lines a watch opened, each one still holding the events it was given —
 * a message arrives because the test hands it over, and a close because the
 * test says the line dropped. What the page sent on it is recorded, so the
 * ping that keeps the line honest is read here rather than waited for. */
export function fakeLines() {
  const opened: {
    url: string;
    closed: boolean;
    sent: string[];
    message: (text: string) => void;
    drop: () => void;
  }[] = [];
  const open: OpenLine = (url, events) => {
    const line = {
      closed: false,
      drop: events.closed,
      message: events.message,
      sent: [] as string[],
      url,
    };
    opened.push(line);
    const handle: Line = {
      close: () => {
        line.closed = true;
      },
      send: (text) => {
        line.sent.push(text);
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
