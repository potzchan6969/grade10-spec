import { describe, expect, it } from "vitest";
import {
  authAvailability,
  canRefresh,
  needsRefresh,
  REFRESH_MARGIN_MS,
  readRenewal,
  rememberRenewal,
  renewGrant,
  signInPath,
} from "../src/editor/auth";
import { STORAGE } from "../src/editor/config";
import type { KeyStore } from "../src/editor/github-store";

/** The renewal half of signing in: when a token is close enough to its end
 * to renew, whether the refresh token can still buy the next one, and that
 * the one call to the worker round-trips the grant. */

const NOW = Date.parse("2026-08-31T12:00:00Z");

function inMs(ms: number): string {
  return new Date(NOW + ms).toISOString();
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

describe("when a token needs renewing", () => {
  it("never, for a token with no expiry or no stored renewal", () => {
    expect(needsRefresh(null, NOW)).toBe(false);
    expect(
      needsRefresh(
        { expiresAt: null, refreshToken: "r", refreshExpiresAt: null },
        NOW,
      ),
    ).toBe(false);
  });

  it("inside the margin and past the end, not before", () => {
    const renewal = (expiresAt: string) => ({
      expiresAt,
      refreshToken: "r",
      refreshExpiresAt: null,
    });
    expect(needsRefresh(renewal(inMs(REFRESH_MARGIN_MS * 2)), NOW)).toBe(false);
    expect(needsRefresh(renewal(inMs(REFRESH_MARGIN_MS / 2)), NOW)).toBe(true);
    expect(needsRefresh(renewal(inMs(-1000)), NOW)).toBe(true);
    expect(needsRefresh(renewal("whenever"), NOW)).toBe(false);
  });

  it("can only refresh while the refresh token itself lives", () => {
    expect(canRefresh(null, NOW)).toBe(false);
    expect(
      canRefresh(
        { expiresAt: null, refreshToken: null, refreshExpiresAt: null },
        NOW,
      ),
    ).toBe(false);
    expect(
      canRefresh(
        { expiresAt: null, refreshToken: "r", refreshExpiresAt: null },
        NOW,
      ),
    ).toBe(true);
    expect(
      canRefresh(
        {
          expiresAt: null,
          refreshToken: "r",
          refreshExpiresAt: inMs(60_000),
        },
        NOW,
      ),
    ).toBe(true);
    expect(
      canRefresh(
        {
          expiresAt: null,
          refreshToken: "r",
          refreshExpiresAt: inMs(-60_000),
        },
        NOW,
      ),
    ).toBe(false);
  });
});

describe("the stored renewal", () => {
  it("round-trips, and reads nothing out of a mangled record", () => {
    const storage = memoryStore();
    const renewal = {
      expiresAt: inMs(1000),
      refreshToken: "r1",
      refreshExpiresAt: null,
    };
    rememberRenewal(storage, renewal);
    expect(readRenewal(storage)).toEqual(renewal);

    expect(readRenewal(memoryStore({ [STORAGE.grant]: "{" }))).toBeNull();
    expect(readRenewal(memoryStore())).toBeNull();
    expect(readRenewal(memoryStore({ [STORAGE.grant]: "{}" }))).toEqual({
      expiresAt: null,
      refreshToken: null,
      refreshExpiresAt: null,
    });
  });
});

describe("renewing through the worker", () => {
  const renewal = {
    expiresAt: inMs(1000),
    refreshToken: "refresh-1",
    refreshExpiresAt: null,
  };

  function answering(status: number, body: unknown) {
    const sent: { url: string; body: unknown }[] = [];
    const http = (async (input: string | URL | Request, init?: RequestInit) => {
      sent.push({
        url: String(input),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      });
      return new Response(JSON.stringify(body), { status });
    }) as typeof fetch;
    return { http, sent };
  }

  it("posts the refresh token and reads the grant back", async () => {
    const { http, sent } = answering(200, {
      token: "next",
      expiresAt: inMs(2000),
      refreshToken: "refresh-2",
      refreshExpiresAt: inMs(3000),
    });

    const grant = await renewGrant(renewal, http);

    expect(sent[0]).toEqual({
      url: "/auth/refresh",
      body: { refreshToken: "refresh-1" },
    });
    expect(grant).toEqual({
      token: "next",
      expiresAt: inMs(2000),
      refreshToken: "refresh-2",
      refreshExpiresAt: inMs(3000),
    });
  });

  it("throws the worker's reason when the renewal is refused", async () => {
    const { http } = answering(401, { message: "GitHub refused the exchange" });
    await expect(renewGrant(renewal, http)).rejects.toThrow(/refused/);
  });

  it("throws the status when the refusal says nothing", async () => {
    const { http } = answering(502, {});
    await expect(renewGrant(renewal, http)).rejects.toThrow(/502/);
  });
});

describe("whether sign-in exists here at all", () => {
  it("believes only an explicit yes", async () => {
    const yes = (async () =>
      new Response(JSON.stringify({ enabled: true }))) as typeof fetch;
    const no = (async () =>
      new Response(JSON.stringify({ enabled: false }))) as typeof fetch;
    const broken = (async () =>
      new Response("", { status: 404 })) as typeof fetch;
    const dead = (async () => {
      throw new Error("no network");
    }) as typeof fetch;

    expect(await authAvailability(yes)).toEqual({ enabled: true });
    expect(await authAvailability(no)).toEqual({ enabled: false });
    expect(await authAvailability(broken)).toEqual({ enabled: false });
    expect(await authAvailability(dead)).toEqual({ enabled: false });
  });
});

describe("where a sign-in starts", () => {
  it("carries the page to come back to, encoded", () => {
    expect(signInPath("/p/vault?tab=qa")).toBe(
      "/auth/login?back=%2Fp%2Fvault%3Ftab%3Dqa",
    );
  });
});
