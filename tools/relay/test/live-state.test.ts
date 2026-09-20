import { describe, expect, it } from "vitest";
import { type Head, headBody, headText, moved } from "../src/live-state.ts";

/** Where `main` is: the shape a page reads before any push and after one, and
 * the one move — the next head, and the broadcast that tells every open page. */

const HEAD: Head = {
  main: "d6fde92930d4715a2b49857d24b940956b26d2d3",
  at: "2026-09-20T14:02:11+08:00",
  subject: "docs(planning): the live line",
};

const NEXT: Head = {
  main: "9f1c0a7b2d3e4f5061728394a5b6c7d8e9f01234",
  at: "2026-09-20T15:11:02+08:00",
  subject: "feat(relay): the eighth secret",
};

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
    expect(step.commands).toEqual([
      { kind: "broadcast", text: headText(HEAD) },
    ]);
  });

  it("carries the same shape the socket was accepted with", () => {
    const [command] = moved(HEAD, NEXT).commands;
    expect(command).toEqual({ kind: "broadcast", text: headText(NEXT) });
    expect(JSON.parse(command.text)).toEqual(NEXT);
  });

  it("tells nobody twice about one commit", () => {
    // The code host retries a delivery it did not see answered, and a page told
    // twice would refresh twice for one move.
    const step = moved(HEAD, { ...HEAD, subject: "read again" });
    expect(step.head).toEqual(HEAD);
    expect(step.commands).toEqual([]);
  });

  it("tells every page about the next commit", () => {
    const step = moved(HEAD, NEXT);
    expect(step.head).toEqual(NEXT);
    expect(step.commands).toHaveLength(1);
  });
});
