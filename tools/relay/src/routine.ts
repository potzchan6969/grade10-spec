/**
 * The fire call. Every firing is a fresh session with the store cloned; the
 * Routine's prompt is fixed and the payload is the only thing that changes, so
 * this call carries one field.
 *
 * A fire the runner refuses is an answer, not an exception: the room posts
 * what the runner said and frees itself, so a thread is never left holding a
 * wake that never started.
 */
import type { RunHandle } from "./room-state.ts";

export interface RoutineCall {
  /** ROUTINE_FIRE_URL: the runner's fire endpoint for the one Routine. */
  url: string;
  token: string;
}

/** A fire the runner took, with the session it named or nothing where it
 * named none, or a fire it refused. */
export type Fired =
  | { ok: true; run: RunHandle | null }
  | { ok: false; why: string };

export async function fireRoutine(
  call: RoutineCall,
  text: string,
): Promise<Fired> {
  const response = await fetch(call.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${call.token}`,
      "anthropic-beta": "experimental-cc-routine-2026-04-01",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  // The status and nothing else: the runner's body is the runner's, and a
  // thread is no place for it — what a hand needs is which failure this was.
  if (!response.ok)
    return { ok: false, why: `the runner answered ${response.status}` };
  const body = (await response.json()) as { claude_code_session_url?: unknown };
  const url =
    typeof body.claude_code_session_url === "string"
      ? body.claude_code_session_url.trim()
      : "";
  // A fire the runner took but named no session for leaves the room with no
  // run: the ack and the budget line both say the run did not start, which is
  // all the relay can see.
  return { ok: true, run: url === "" ? null : { url } };
}
