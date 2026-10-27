/**
 * The wire between the router and a room, and the one JSON answer every
 * surface here writes.
 *
 * An object is reached by a POST whose body is an op, so there is one place that
 * builds that request and one type it accepts: a call the object does not know
 * is a call this file does not let anybody make.
 */
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

/** What went wrong, in the words a log can read. Every surface here says a
 * failure the same way, so one reading answers the router and the room
 * alike. */
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

function call(
  stub: DurableObjectStub,
  name: string,
  op: RoomOp,
): Promise<Response> {
  return stub.fetch(
    new Request(`https://relay.invalid/${name}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(op),
    }),
  );
}
