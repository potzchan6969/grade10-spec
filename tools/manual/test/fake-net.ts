/**
 * The two seams every live reading is driven through: the network and the
 * clock.
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
  /** Run the newest wait, the way a timer would, and let what it started
   * settle. */
  const fire = async () => {
    const one = waits.at(-1);
    if (one === undefined) throw new Error("nothing is waiting");
    one.run();
    await settle();
  };
  return { fire, next, wait, waits };
}
