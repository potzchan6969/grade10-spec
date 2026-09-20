/**
 * Where `main` is, pure. One transition — a push arrived — and the next state
 * with the one command the object carries out.
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

/** The head to every socket the object holds. */
export type LiveCommand = { kind: "broadcast"; text: string };

export interface LiveStep {
  head: Head;
  commands: LiveCommand[];
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
  if (head && head.main === push.main) return { head, commands: [] };
  const next: Head = {
    main: push.main,
    at: push.at,
    subject: push.subject,
  };
  return {
    head: next,
    commands: [{ kind: "broadcast", text: headText(next) }],
  };
}
