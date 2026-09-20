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
  /** When the push arrived, ISO 8601 by this object's own clock. The commit's
   * own time is the author's, and a page and the relay share no other clock —
   * what a page shows is how long ago the move reached here. */
  at: string;
  /** The first line of its message. */
  subject: string;
}

/** What a push names: the commit and its subject. The stamp is not the push's
 * to give, so a delivery replayed an hour later is still stamped when it
 * arrived. */
export type Push = Omit<Head, "at">;

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
 * `main` moved. The next head is the push's, stamped `now`, and every open
 * page is told it once.
 *
 * A push whose commit is the head already stored tells nobody and is stamped
 * again by nothing: the code host retries a delivery it did not see answered,
 * and a page told twice would refresh twice for one move.
 */
export function moved(
  head: Head | null,
  push: Push,
  now: () => string,
): LiveStep {
  if (head && head.main === push.main) return { head, broadcast: null };
  // The keys in the order the shape names them: a page reads the text, and two
  // orders of the same head read as two heads in a log.
  const next: Head = { main: push.main, at: now(), subject: push.subject };
  return { head: next, broadcast: headText(next) };
}

/** A read of `/live` is a page opening a socket. The header is the whole of the
 * ask, and a read without it is a browser that cannot. */
export const isUpgrade = (request: Request): boolean =>
  (request.headers.get("upgrade") ?? "").toLowerCase() === "websocket";
