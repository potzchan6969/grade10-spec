import { describe, expect, it } from "vitest";
import { headBody, headText, moved } from "../src/live-state.ts";
import { HEAD, NEXT } from "./fixtures.ts";

/** Where `main` is: the shape a page reads before any push and after one, and
 * the one move — the next head, and the broadcast that tells every open page. */

describe("the head a page reads", () => {
  it("names `main` as null before any push", () => {
    expect(headBody(null)).toEqual({ main: null });
    expect(headText(null)).toBe('{"main":null}');
  });

  it("names the commit, its time and its subject once one has landed", () => {
    expect(headBody(HEAD)).toEqual(HEAD);
    expect(JSON.parse(headText(HEAD))).toEqual(HEAD);
  });
});

describe("a move", () => {
  it("takes the push as the head and tells every open page", () => {
    const step = moved(null, HEAD);
    expect(step.head).toEqual(HEAD);
    expect(step.broadcast).toBe(headText(HEAD));
  });

  it("carries the same shape the socket was accepted with", () => {
    const { broadcast } = moved(HEAD, NEXT);
    expect(JSON.parse(String(broadcast))).toEqual(NEXT);
  });

  it("tells nobody twice about one commit", () => {
    // The code host retries a delivery it did not see answered, and a page told
    // twice would refresh twice for one move.
    const step = moved(HEAD, { ...HEAD, subject: "read again" });
    expect(step.head).toEqual(HEAD);
    expect(step.broadcast).toBe(null);
  });

  it("tells every page about the next commit", () => {
    const step = moved(HEAD, NEXT);
    expect(step.head).toEqual(NEXT);
    expect(step.broadcast).toBe(headText(NEXT));
  });
});
