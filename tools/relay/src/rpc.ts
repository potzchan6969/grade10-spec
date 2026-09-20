/**
 * The wire between the router and a room, and the one JSON answer every
 * surface here writes.
 *
 * A room is reached by a POST whose body is an op, so there is one place that
 * builds that request and one type it accepts: a call the room does not know
 * is a call this file does not let anybody make.
 */
import type { EnqueueInput, RoomState } from "./room-state.ts";

export type LandKind = "word" | "reviewed";

export type RoomOp =
  | ({ op: "enqueue"; dedupe?: string; requireRoom?: boolean } & EnqueueInput)
  | { op: "takeover"; change: string; state: RoomState }
  | { op: "bind"; wake: number; change: string }
  | { op: "post"; wake: number; text: string }
  | { op: "land"; wake: number; sha: string; kind: LandKind; artifact: string }
  | { op: "done"; wake: number }
  | { op: "alive"; wake: number };

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
  return stub.fetch(
    new Request("https://relay.invalid/room", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(op),
    }),
  );
}
