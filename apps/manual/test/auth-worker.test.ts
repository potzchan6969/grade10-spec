import { describe, expect, it } from "vitest";
import { STORAGE } from "../src/editor/config";
import worker, { type AuthEnv, handleAuth, safeBack } from "../worker/auth.ts";

/** The sign-in worker against a mocked GitHub. What is pinned: the state
 * cookie proves a callback answers a sign-in this site started, the exchange
 * happens server-side and lands the token under the app's own storage keys,
 * and a refusal never leaks a token into the page. */

const ORIGIN = "https://spec.grade10-stg.com";
const EXCHANGE = "https://github.com/login/oauth/access_token";

const ENV: AuthEnv = {
  GITHUB_OAUTH_CLIENT_ID: "Iv1.manual",
  GITHUB_OAUTH_CLIENT_SECRET: "app-secret",
};

type Sent = { url: string; body: Record<string, unknown> };

function github(status: number, body: unknown) {
  const sent: Sent[] = [];
  const http = (async (input: string | URL | Request, init?: RequestInit) => {
    sent.push({
      url: String(input),
      body: init?.body
        ? (JSON.parse(String(init.body)) as Record<string, unknown>)
        : {},
    });
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  return { http, sent };
}

const NOW = Date.parse("2026-08-31T00:00:00Z");

function ask(
  path: string,
  init?: RequestInit,
  http: typeof fetch = github(500, {}).http,
): Promise<Response | null> {
  return handleAuth(
    new Request(`${ORIGIN}${path}`, init),
    ENV,
    http,
    () => NOW,
  );
}

describe("the auth worker", () => {
  it("says whether sign-in is configured", async () => {
    const enabled = await ask("/auth/config");
    expect(await enabled?.json()).toEqual({ enabled: true });

    const disabled = await handleAuth(new Request(`${ORIGIN}/auth/config`), {});
    expect(await disabled?.json()).toEqual({ enabled: false });
  });

  it("leaves non-auth paths to the assets", async () => {
    expect(await ask("/p/grade10-store/loyalty")).toBeNull();

    let served: string | null = null;
    const env: AuthEnv = {
      ASSETS: {
        fetch: (request: Request) => {
          served = request.url;
          return Promise.resolve(new Response("page"));
        },
      },
    };
    const answer = await worker.fetch(new Request(`${ORIGIN}/p/vault`), env);
    expect(await answer.text()).toBe("page");
    expect(served).toBe(`${ORIGIN}/p/vault`);
  });

  it("starts a sign-in with a state cookie carrying the way back", async () => {
    const answer = await ask("/auth/login?back=%2Fp%2Fvault%3Ftab%3Dqa");

    expect(answer?.status).toBe(302);
    const to = new URL(answer?.headers.get("location") ?? "");
    expect(to.origin + to.pathname).toBe(
      "https://github.com/login/oauth/authorize",
    );
    expect(to.searchParams.get("client_id")).toBe("Iv1.manual");
    expect(to.searchParams.get("redirect_uri")).toBe(`${ORIGIN}/auth/callback`);
    const state = to.searchParams.get("state");
    expect(state).toBeTruthy();

    const cookie = answer?.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`manual.oauth=${state}:%2Fp%2Fvault%3Ftab%3Dqa`);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("never sends a sign-in back to another origin", async () => {
    for (const back of [
      "https://evil.example",
      "//evil.example",
      "/p\\evil",
      "",
    ]) {
      expect(safeBack(back)).toBe("/");
    }
    expect(safeBack("/p/vault")).toBe("/p/vault");

    const answer = await ask(
      `/auth/login?back=${encodeURIComponent("https://evil.example")}`,
    );
    expect(answer?.headers.get("set-cookie")).toContain("manual.oauth=");
    expect(answer?.headers.get("set-cookie")).not.toContain("evil");
  });

  it("refuses a callback whose state does not match, exchanging nothing", async () => {
    const { http, sent } = github(200, { access_token: "tok" });

    const missing = await ask("/auth/callback?code=abc&state=s1", {}, http);
    expect(missing?.status).toBe(400);

    const mismatched = await ask(
      "/auth/callback?code=abc&state=s1",
      { headers: { cookie: "manual.oauth=other:%2F" } },
      http,
    );
    expect(mismatched?.status).toBe(400);
    expect(await mismatched?.text()).toContain("did not start on this site");
    expect(sent).toHaveLength(0);
  });

  it("exchanges the code and hands the grant to the app's own storage keys", async () => {
    const { http, sent } = github(200, {
      access_token: "user-token",
      expires_in: 28800,
      refresh_token: "refresh-1",
      refresh_token_expires_in: 15897600,
    });

    const answer = await ask(
      "/auth/callback?code=abc&state=s1",
      { headers: { cookie: "manual.oauth=s1:%2Fp%2Fvault" } },
      http,
    );

    expect(sent[0].url).toBe(EXCHANGE);
    expect(sent[0].body).toMatchObject({
      client_id: "Iv1.manual",
      client_secret: "app-secret",
      code: "abc",
    });

    expect(answer?.status).toBe(200);
    const html = (await answer?.text()) ?? "";
    expect(html).toContain(STORAGE.token);
    expect(html).toContain(STORAGE.grant);
    expect(html).toContain(STORAGE.verified);
    expect(html).toContain("user-token");
    expect(html).toContain("refresh-1");
    expect(html).toContain(new Date(NOW + 28800 * 1000).toISOString());
    expect(html).toContain("/p/vault");
    // The state cookie dies with the callback that answered it.
    expect(answer?.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("escapes the payload so no value can close the script tag", async () => {
    const { http } = github(200, { access_token: "</script><b>x" });

    const answer = await ask(
      "/auth/callback?code=abc&state=s1",
      { headers: { cookie: "manual.oauth=s1:%2F" } },
      http,
    );

    const html = (await answer?.text()) ?? "";
    expect(html).not.toContain("</script><b>");
    expect(html).toContain("\\u003c/script>");
  });

  it("repeats GitHub's refusal without minting anything — a 200 with an error is still a refusal", async () => {
    const { http } = github(200, {
      error: "bad_verification_code",
      error_description: "The code passed is incorrect or expired.",
    });

    const answer = await ask(
      "/auth/callback?code=abc&state=s1",
      { headers: { cookie: "manual.oauth=s1:%2F" } },
      http,
    );

    expect(answer?.status).toBe(502);
    const html = (await answer?.text()) ?? "";
    expect(html).toContain("incorrect or expired");
    expect(html).not.toContain("localStorage");
  });

  it("trades a refresh token for the next grant", async () => {
    const { http, sent } = github(200, {
      access_token: "next-token",
      expires_in: 28800,
      refresh_token: "refresh-2",
      refresh_token_expires_in: 15897600,
    });

    const answer = await ask(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken: "refresh-1" }),
      },
      http,
    );

    expect(sent[0].body).toMatchObject({
      grant_type: "refresh_token",
      refresh_token: "refresh-1",
    });
    expect(await answer?.json()).toEqual({
      token: "next-token",
      expiresAt: new Date(NOW + 28800 * 1000).toISOString(),
      refreshToken: "refresh-2",
      refreshExpiresAt: new Date(NOW + 15897600 * 1000).toISOString(),
    });
  });

  it("answers a refused refresh with the reason, as a 401", async () => {
    const { http } = github(200, {
      error: "bad_refresh_token",
      error_description: "The refresh token passed is no good.",
    });

    const answer = await ask(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken: "old" }) },
      http,
    );

    expect(answer?.status).toBe(401);
    expect(await answer?.json()).toEqual({
      message: expect.stringContaining("no good"),
    });
  });

  it("refuses a refresh that is not a POST with a token", async () => {
    expect((await ask("/auth/refresh"))?.status).toBe(405);
    expect(
      (await ask("/auth/refresh", { method: "POST", body: "{}" }))?.status,
    ).toBe(400);
  });

  it("answers everything under /auth it does not know with a 404", async () => {
    expect((await ask("/auth/whatever"))?.status).toBe(404);
  });
});
