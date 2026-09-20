/**
 * The wire between the router and a Durable Object — a room, and the one object
 * that holds where `main` is — and the one JSON answer every surface here
 * writes.
 *
 * An object is reached by a POST whose body is an op, so there is one place that
 * builds that request and one type it accepts: a call the object does not know
 * is a call this file does not let anybody make.
 */
import type { Head } from "./live-state.ts";
import type { EnqueueInput, Thread } from "./room-state.ts";
import type { Confirm } from "./slack.ts";

export type LandKind = "word" | "reviewed";

export type RoomOp =
  | ({ op: "enqueue"; dedupe?: string; requireRoom?: boolean } & EnqueueInput)
  | { op: "alias"; change: string; thread: Thread }
  | { op: "bind"; wake: number; change: string }
  /** `confirm` is the button under the line: the run's own label and word,
   * which a press says back as a thread reply. */
  | { op: "post"; wake: number; text: string; confirm?: Confirm }
  | { op: "land"; wake: number; sha: string; kind: LandKind; artifact: string }
  | { op: "done"; wake: number }
  | { op: "alive"; wake: number };

/** What the live object is asked: `main` moved, or where is it. A page's socket
 * is not an op — the upgrade is forwarded as it arrived, because the object
 * answers it with the socket itself. */
export type LiveOp = { op: "moved"; head: Head } | { op: "head" };

/** What went wrong, in the words a log can read. Every surface here says a
 * failure the same way, so one reading answers the router, the room and the
 * live object alike. */
export const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** One op to one room. The url is a name the room never reads: a Durable
 * Object is addressed by its stub, not by a path. */
export function callRoom(
  stub: DurableObjectStub,
  op: RoomOp,
): Promise<Response> {
  return call(stub, "room", op);
}

/** One op to the live object. */
export function callLive(
  stub: DurableObjectStub,
  op: LiveOp,
): Promise<Response> {
  return call(stub, "live", op);
}

function call(
  stub: DurableObjectStub,
  name: string,
  op: RoomOp | LiveOp,
): Promise<Response> {
  return stub.fetch(
    new Request(`https://relay.invalid/${name}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(op),
    }),
  );
}
