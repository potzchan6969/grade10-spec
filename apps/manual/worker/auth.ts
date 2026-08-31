import { STORAGE } from "../src/editor/config.ts";

/**
 * The one dynamic corner of an otherwise static site: `/auth/*`, the GitHub
 * App sign-in. The browser can hold no secret, so this worker holds the app's
 * client secret and does the two exchanges that need it — authorization code
 * for a user token, and refresh token for the next one. Everything else the
 * editor does still talks to GitHub directly with the token this hands over.
 *
 * `run_worker_first` routes only `/auth/*` here; every other path is served
 * straight from the built assets, so the site stays static where it can be.
 *
 * One-time setup, recorded here because nothing else can check it: register
 * a GitHub App (permissions: Contents read and write, Actions read; callback
 * URL `https://<host>/auth/callback`; webhooks off), install it on the store
 * repository, put its client id in `wrangler.jsonc` vars, and
 * `wrangler secret put GITHUB_OAUTH_CLIENT_SECRET`. Until both are set,
 * `/auth/config` answers disabled and the site stays read-only.
 */

const AUTHORIZE = "https://github.com/login/oauth/authorize";
const EXCHANGE = "https://github.com/login/oauth/access_token";

/** The state cookie: proof the callback answers a sign-in this site started,
 * carrying the page to land back on. Path-scoped to /auth, dead in ten
 * minutes either way. */
const COOKIE = "manual.oauth";
const COOKIE_TTL_S = 600;

type Assets = { fetch(request: Request): Promise<Response> };

export type AuthEnv = {
  GITHUB_OAUTH_CLIENT_ID?: string;
  GITHUB_OAUTH_CLIENT_SECRET?: string;
  ASSETS?: Assets;
};

export type IssuedGrant = {
  token: string;
  expiresAt: string | null;
  refreshToken: string | null;
  refreshExpiresAt: string | null;
};

const DISABLED =
  "Sign-in is not configured: the worker is missing GITHUB_OAUTH_CLIENT_ID or GITHUB_OAUTH_CLIENT_SECRET.";

/** The `/auth/*` surface, or null for a path that belongs to the assets. */
export async function handleAuth(
  request: Request,
  env: AuthEnv,
  http: typeof fetch = fetch,
  now: () => number = Date.now,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/auth/")) return null;

  switch (url.pathname) {
    case "/auth/config":
      return json({ enabled: enabled(env) });
    case "/auth/login":
      return login(url, env);
    case "/auth/callback":
      return callback(request, url, env, http, now);
    case "/auth/refresh":
      return refresh(request, env, http, now);
    default:
      return json({ message: `no auth endpoint at ${url.pathname}` }, 404);
  }
}

export default {
  async fetch(request: Request, env: AuthEnv): Promise<Response> {
    const answered = await handleAuth(request, env);
    if (answered) return answered;
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return json({ message: "not found" }, 404);
  },
};

function enabled(env: AuthEnv): boolean {
  return Boolean(env.GITHUB_OAUTH_CLIENT_ID && env.GITHUB_OAUTH_CLIENT_SECRET);
}

function login(url: URL, env: AuthEnv): Response {
  if (!enabled(env)) return json({ message: DISABLED }, 503);

  const back = safeBack(url.searchParams.get("back"));
  const state = crypto.randomUUID();
  const authorize = new URL(AUTHORIZE);
  authorize.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID ?? "");
  authorize.searchParams.set("redirect_uri", `${url.origin}/auth/callback`);
  authorize.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      "set-cookie": stateCookie(
        `${state}:${encodeURIComponent(back)}`,
        COOKIE_TTL_S,
      ),
    },
  });
}

async function callback(
  request: Request,
  url: URL,
  env: AuthEnv,
  http: typeof fetch,
  now: () => number,
): Promise<Response> {
  if (!enabled(env)) return json({ message: DISABLED }, 503);

  const held = stateFromCookie(request.headers.get("cookie"));
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!held || !state || held.state !== state) {
    return failurePage(
      "This sign-in did not start on this site, or took longer than ten minutes. Go back to the manual and sign in again.",
      400,
    );
  }
  if (!code) {
    const said = url.searchParams.get("error_description");
    return failurePage(said ?? "GitHub sent no code back.", 400);
  }

  const answer = await exchange(http, {
    client_id: env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
    code,
    redirect_uri: `${url.origin}/auth/callback`,
  });
  if ("refusal" in answer) return failurePage(answer.refusal, 502);

  return landingPage(grantOf(answer.body, now()), held.back);
}

async function refresh(
  request: Request,
  env: AuthEnv,
  http: typeof fetch,
  now: () => number,
): Promise<Response> {
  if (!enabled(env)) return json({ message: DISABLED }, 503);
  if (request.method !== "POST") {
    return json({ message: "refresh is a POST" }, 405);
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const refreshToken = body?.refreshToken;
  if (typeof refreshToken !== "string" || refreshToken === "") {
    return json({ message: "refreshToken is required" }, 400);
  }

  const answer = await exchange(http, {
    client_id: env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  if ("refusal" in answer) return json({ message: answer.refusal }, 401);

  return json(grantOf(answer.body, now()));
}

/** GitHub's token endpoint answers refusals as 200s with an `error` field, so
 * the status alone proves nothing — only an `access_token` does. */
async function exchange(
  http: typeof fetch,
  payload: Record<string, unknown>,
): Promise<{ body: Record<string, unknown> } | { refusal: string }> {
  const answer = await http(EXCHANGE, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = (await answer.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!answer.ok || typeof body.access_token !== "string") {
    const said = body.error_description ?? body.error;
    return {
      refusal: `GitHub refused the exchange: ${typeof said === "string" ? said : `HTTP ${answer.status}`}`,
    };
  }
  return { body };
}

function grantOf(body: Record<string, unknown>, at: number): IssuedGrant {
  return {
    token: String(body.access_token),
    expiresAt: expiry(body.expires_in, at),
    refreshToken:
      typeof body.refresh_token === "string" ? body.refresh_token : null,
    refreshExpiresAt: expiry(body.refresh_token_expires_in, at),
  };
}

/** `expires_in` seconds as an ISO instant — absent when the app has token
 * expiration switched off, and null is exactly what that means here. */
function expiry(seconds: unknown, at: number): string | null {
  return typeof seconds === "number"
    ? new Date(at + seconds * 1000).toISOString()
    : null;
}

/** Only a same-site path is a place to land back on — anything else, the
 * home page. `//host` is how a path smuggles an origin, so it fails too. */
export function safeBack(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.includes("\\")) return "/";
  return value;
}

function stateCookie(value: string, maxAge: number): string {
  return `${COOKIE}=${value}; Max-Age=${maxAge}; Path=/auth; HttpOnly; Secure; SameSite=Lax`;
}

function stateFromCookie(
  header: string | null,
): { state: string; back: string } | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== COOKIE) continue;
    const [state, back] = rest.join("=").split(":");
    if (!state) return null;
    return { state, back: safeBack(decodeURIComponent(back ?? "")) };
  }
  return null;
}

/**
 * The landing page is the handover: the token reaches localStorage under the
 * same keys the app reads, the stale verdict is cleared so the session
 * re-verifies, and the browser goes back where the sign-in started. The
 * payload rides in a JSON script tag with `<` escaped, so no token ever
 * needs HTML escaping rules of its own.
 */
function landingPage(grant: IssuedGrant, back: string): Response {
  const payload = JSON.stringify({
    keys: {
      token: STORAGE.token,
      grant: STORAGE.grant,
      verified: STORAGE.verified,
    },
    grant,
    back,
  }).replace(/</g, "\\u003c");

  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Signed in — Grade10 Manual</title>
<script type="application/json" id="handover">${payload}</script>
<script>
(() => {
  const data = JSON.parse(document.getElementById("handover").textContent);
  try {
    localStorage.setItem(data.keys.token, data.grant.token);
    localStorage.setItem(data.keys.grant, JSON.stringify({
      expiresAt: data.grant.expiresAt,
      refreshToken: data.grant.refreshToken,
      refreshExpiresAt: data.grant.refreshExpiresAt,
    }));
    localStorage.removeItem(data.keys.verified);
  } catch {}
  location.replace(data.back);
})();
</script>
<p>Signed in — returning to the manual…</p>
</html>
`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "set-cookie": stateCookie("", 0),
    },
  });
}

function failurePage(reason: string, status: number): Response {
  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign-in failed — Grade10 Manual</title>
<p>${escapeHtml(reason)}</p>
<p><a href="/">Back to the manual</a></p>
</html>
`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "set-cookie": stateCookie("", 0),
    },
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
