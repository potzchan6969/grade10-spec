/**
 * The fire call. Every firing is a fresh session with the store cloned; the
 * Routine's prompt is fixed and the payload is the only thing that changes, so
 * this call carries one field.
 */
import type { RunHandle } from "./room-state.ts";

export interface RoutineCall {
  /** ROUTINE_FIRE_URL: the runner's fire endpoint for the one Routine. */
  url: string;
  token: string;
}

export async function fireRoutine(
  call: RoutineCall,
  text: string,
): Promise<RunHandle> {
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
  if (!response.ok)
    throw new Error(
      `routine fire: ${response.status} ${await response.text()}`,
    );
  const body = (await response.json()) as {
    claude_code_session_id?: string;
    claude_code_session_url?: string;
  };
  return {
    id: String(body.claude_code_session_id ?? ""),
    url: String(body.claude_code_session_url ?? ""),
  };
}
