/**
 * Where `main` is, pure: the shape a page reads, the one transition — a push
 * arrived — and the reading that says a request is a page opening a socket.
 *
 * The object that holds the sockets decides nothing, so the whole of "one
 * broadcast per move, and a delivery that arrives twice is one move" is read in
 * a test with no runtime, no storage and no socket.
 */

/** Where `main` is, as a page reads it. */
export interface Head {
  /** The commit `main` now points at. */
  main: string;
  /** When that commit was made, ISO 8601 as the code host sends it. */
  at: string;
  /** The first line of its message. */
  subject: string;
}

/** The head, or the shape before any push: a relay deployed and not yet told
 * anything answers a page rather than nothing. */
export type HeadBody = Head | { main: null };

/** One shape for the socket and for `/head`, so a page that reads one and then
 * the other reads the same keys. */
export const headBody = (head: Head | null): HeadBody => head ?? { main: null };

/** The head as a socket is sent it. */
export const headText = (head: Head | null): string =>
  JSON.stringify(headBody(head));

/** What a move leaves: where `main` is now, and the one text every open page is
 * sent, or nothing for a move that tells nobody. */
export interface LiveStep {
  head: Head;
  broadcast: string | null;
}

/**
 * `main` moved. The next head is the push's, and every open page is told it
 * once.
 *
 * A push whose commit is the head already stored tells nobody: the code host
 * retries a delivery it did not see answered, and a page told twice would
 * refresh twice for one move.
 */
export function moved(head: Head | null, push: Head): LiveStep {
  if (head && head.main === push.main) return { head, broadcast: null };
  return { head: push, broadcast: headText(push) };
}

/** A read of `/live` is a page opening a socket. The header is the whole of the
 * ask, and a read without it is a browser that cannot. */
export const isUpgrade = (request: Request): boolean =>
  (request.headers.get("upgrade") ?? "").toLowerCase() === "websocket";
