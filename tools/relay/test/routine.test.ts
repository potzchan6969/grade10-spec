import { afterEach, describe, expect, it, vi } from "vitest";
import { fireRoutine } from "../src/routine.ts";

/** The fire call: one field, and the session it answers with. */

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the fire", () => {
  it("carries the payload as text and answers the session's url", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(
        JSON.stringify({
          claude_code_session_id: "s1",
          claude_code_session_url: "https://runs.example/s1",
        }),
      );
    });
    const fired = await fireRoutine(
      { url: "https://runner.example/fire", token: "the-routine-token" },
      '{"change":null}',
    );
    expect(fired).toEqual({
      ok: true,
      run: { url: "https://runs.example/s1" },
    });
    expect(calls[0].url).toBe("https://runner.example/fire");
    expect(calls[0].init.method).toBe("POST");
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer the-routine-token");
    expect(headers["anthropic-beta"]).toBe(
      "experimental-cc-routine-2026-04-01",
    );
    expect(headers["anthropic-version"]).toBe("2023-06-01");
    expect(headers["content-type"]).toBe("application/json");
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      text: '{"change":null}',
    });
  });

  it("answers what the runner said when it refuses the fire", async () => {
    vi.stubGlobal(
      "fetch",
      async () => new Response("no such routine", { status: 404 }),
    );
    expect(
      await fireRoutine(
        { url: "https://runner.example/fire", token: "t" },
        "{}",
      ),
    ).toEqual({
      ok: false,
      why: "the runner answered 404 no such routine",
    });
  });
});
