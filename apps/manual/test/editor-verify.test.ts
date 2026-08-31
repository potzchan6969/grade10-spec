import { describe, expect, it } from "vitest";
import { REPO, STORAGE } from "../src/editor/config";
import type { KeyStore } from "../src/editor/github-store";
import {
  daysUntil,
  expiryNote,
  fingerprintOf,
  readVerdict,
  rememberVerdict,
  TOKEN_EXPIRY_HEADER,
  verifyToken,
} from "../src/editor/verify";

/** A token in storage is not access. These pin the two questions every
 * sign-in is asked, and — because GitHub answers "app not installed" and
 * "repo not yours" with the same 404 — that the refusal names both. */

const REPO_API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const EXPIRES = "2026-09-29 12:00:00 UTC";

type Answer = { status: number; body?: unknown; expires?: string };

function github(routes: (url: string) => Answer) {
  const seen: string[] = [];
  const http = (async (input: string | URL | Request) => {
    const url = String(input);
    seen.push(url);
    const answer = routes(url);
    return new Response(
      answer.body === undefined ? "" : JSON.stringify(answer.body),
      {
        status: answer.status,
        headers: answer.expires
          ? { [TOKEN_EXPIRY_HEADER]: answer.expires }
          : undefined,
      },
    );
  }) as typeof fetch;
  return { http, seen };
}

/** The repository answers, and it answers with contents. */
function reachable(expires?: string) {
  return github((url) =>
    url.endsWith("/user")
      ? { status: 200, body: { login: "echo" }, expires }
      : { status: 200, body: [] },
  );
}

function memoryStore(seed: Record<string, string> = {}): KeyStore {
  const held = new Map<string, string>(Object.entries(seed));
  return {
    get: (key) => held.get(key) ?? null,
    set: (key, value) => {
      held.set(key, value);
    },
    remove: (key) => {
      held.delete(key);
    },
  };
}

describe("verifying a token", () => {
  it("asks who it belongs to, then whether it reaches the repo", async () => {
    const { http, seen } = reachable(EXPIRES);

    const result = await verifyToken("pat", http);

    expect(result).toEqual({
      ok: true,
      verdict: {
        fingerprint: fingerprintOf("pat"),
        login: "echo",
        expires: EXPIRES,
      },
    });
    expect(seen).toEqual([
      "https://api.github.com/user",
      `${REPO_API}/contents/`,
    ]);
  });

  it("carries no expiry when GitHub named none", async () => {
    const { http } = reachable();
    const result = await verifyToken("pat", http);
    expect(result).toMatchObject({ ok: true, verdict: { expires: null } });
  });

  it("calls a 401 a bad token, and never reaches the repo", async () => {
    const { http, seen } = github(() => ({
      status: 401,
      body: { message: "Bad credentials" },
    }));

    const result = await verifyToken("pat", http);

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining("401"),
    });
    expect(seen).toEqual(["https://api.github.com/user"]);
  });

  it("names both halves of a 404 — the app not installed and the repo out of reach", async () => {
    const { http } = github((url) =>
      url.endsWith("/user")
        ? { status: 200, body: { login: "echo" } }
        : { status: 404, body: { message: "Not Found" } },
    );

    const result = await verifyToken("pat", http);

    expect(result.ok).toBe(false);
    const reason = result.ok ? "" : result.reason;
    expect(reason).toContain("404");
    expect(reason).toMatch(/not installed/);
    expect(reason).toMatch(/cannot see/);
    expect(reason).toContain(REPO.owner);
  });

  it("says a 403 is the contents permission, not the repository", async () => {
    const { http } = github((url) =>
      url.endsWith("/user")
        ? { status: 200, body: { login: "echo" } }
        : { status: 403, body: { message: "Resource not accessible" } },
    );

    const result = await verifyToken("pat", http);

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining("Contents: read and write"),
    });
  });

  it("repeats whatever else GitHub said rather than guessing", async () => {
    const { http } = github((url) =>
      url.endsWith("/user")
        ? { status: 200, body: { login: "echo" } }
        : { status: 500, body: { message: "Server Error" } },
    );

    await expect(verifyToken("pat", http)).resolves.toEqual({
      ok: false,
      reason: expect.stringContaining("Server Error"),
    });
  });

  it("refuses an answer with nobody in it", async () => {
    const { http } = github(() => ({ status: 200, body: {} }));
    await expect(verifyToken("pat", http)).resolves.toMatchObject({
      ok: false,
    });
  });
});

describe("the verdict that survives a reload", () => {
  it("counts only for the token it was issued for", () => {
    const storage = memoryStore();
    rememberVerdict(storage, {
      fingerprint: fingerprintOf("pat"),
      login: "echo",
      expires: null,
    });

    expect(readVerdict(storage, "pat")).toMatchObject({ login: "echo" });
    expect(readVerdict(storage, "another pat")).toBeNull();
    expect(readVerdict(storage, null)).toBeNull();
  });

  it("keeps no second copy of the token", () => {
    const storage = memoryStore();
    rememberVerdict(storage, {
      fingerprint: fingerprintOf("github_pat_secret"),
      login: "echo",
      expires: null,
    });
    expect(storage.get(STORAGE.verified)).not.toContain("github_pat_secret");
  });

  it("reads nothing out of a mangled record", () => {
    expect(readVerdict(memoryStore({ [STORAGE.verified]: "{" }), "pat")).toBe(
      null,
    );
    expect(
      readVerdict(memoryStore({ [STORAGE.verified]: "{}" }), "pat"),
    ).toBeNull();
  });
});

describe("what the dialog says about the end of a token", () => {
  const now = new Date("2026-09-01T00:00:00Z");

  it("reads GitHub's own spelling of a date", () => {
    expect(daysUntil(EXPIRES, now)).toBe(29);
    expect(daysUntil("2026-09-29T12:00:00Z", now)).toBe(29);
    expect(daysUntil("whenever", now)).toBeNull();
    expect(daysUntil(null, now)).toBeNull();
  });

  it("stays quiet for a token with a month left", () => {
    expect(expiryNote(EXPIRES, now)).toEqual({
      text: "expires on 2026-09-29",
      urgent: false,
    });
  });

  it("warns inside the last week", () => {
    const note = expiryNote("2026-09-04 12:00:00 UTC", now);
    expect(note?.urgent).toBe(true);
    expect(note?.text).toContain("in 4 days");
  });

  it("says an expired token is expired", () => {
    expect(expiryNote("2026-08-01 12:00:00 UTC", now)).toEqual({
      text: "expired on 2026-08-01",
      urgent: true,
    });
  });

  it("says nothing at all when GitHub named no expiry", () => {
    expect(expiryNote(null, now)).toBeNull();
  });
});
