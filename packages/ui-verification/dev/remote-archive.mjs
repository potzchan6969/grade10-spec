/**
 * A read-only window onto the hosted archive for the local workbench: every
 * GET or HEAD under /api goes to the deployed Worker as the person signed in
 * to Cloudflare Access, so the local panels and dashboard read real runs,
 * references and approvals. Writes are refused, because a local approve
 * would judge the hosted Storybook's reference, not this checkout's.
 */
import { execFile } from "node:child_process";
import { isIP } from "node:net";
import { promisify } from "node:util";

const run = promisify(execFile);
/** A token this close to its expiry is fetched again first. */
const EXPIRY_MARGIN_MS = 60 * 1000;
const FORWARDED_REQUEST_HEADERS = ["accept", "if-none-match", "range"];
const FORWARDED_RESPONSE_HEADERS = [
  "cache-control",
  "content-length",
  "content-range",
  "content-type",
  "etag",
  "x-content-type-options",
];

function isLoopbackHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "::1") return true;
  return isIP(host) === 4 && host.startsWith("127.");
}

/** The hosted Storybook origin, HTTPS except for a loopback test server. */
export function remoteOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError("UI_VERIFICATION_REMOTE must be an origin URL");
  }
  const secure =
    url.protocol === "https:" ||
    (url.protocol === "http:" && isLoopbackHost(url.hostname));
  if (
    !secure ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new TypeError(
      "UI_VERIFICATION_REMOTE must be an HTTPS origin, such as https://storybook.grade10-stg.com",
    );
  }
  return url.origin;
}

function expiryOf(token) {
  try {
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"),
    );
    return Number.isFinite(claims.exp) ? claims.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/**
 * The signed-in person's Access token for `origin`: `staticToken` when one is
 * given, else what `cloudflared access token` holds, cached until it nears
 * its expiry.
 */
export function createAccessTokenSource(
  origin,
  { staticToken = "", command = "cloudflared", runCommand = run } = {},
) {
  let cached = null;
  return async function accessToken({ refresh = false } = {}) {
    if (staticToken) return staticToken;
    if (!refresh && cached && cached.expiresAt - EXPIRY_MARGIN_MS > Date.now())
      return cached.token;
    cached = null;
    let output;
    try {
      ({ stdout: output } = await runCommand(command, [
        "access",
        "token",
        `--app=${origin}`,
      ]));
    } catch {
      output = "";
    }
    const token = String(output).trim();
    if (token.split(".").length !== 3) {
      throw new Error(
        `No Cloudflare Access token for ${origin}. Run \`cloudflared access login ${origin}\`, then press Refresh.`,
      );
    }
    cached = { token, expiresAt: expiryOf(token) };
    return token;
  };
}

function jsonResponse(status, code, error) {
  return new Response(JSON.stringify({ error, code }), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Access answers a missing or stale token with its login page, not the API.
function signedOut(response) {
  return (
    response.status === 401 ||
    response.status === 403 ||
    (response.status >= 300 && response.status < 400)
  );
}

export function createRemoteArchiveHandler({
  origin,
  accessToken,
  fetcher = globalThis.fetch,
}) {
  const remote = remoteOrigin(origin);
  return async function handleRemoteArchive(request) {
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return jsonResponse(
        405,
        "REMOTE_READ_ONLY",
        `This workbench reads the hosted archive at ${remote} and changes nothing there. Approve, capture and request changes on ${remote}.`,
      );
    }
    const incoming = new URL(request.url);
    const target = new URL(`${incoming.pathname}${incoming.search}`, remote);
    const send = async (refresh) => {
      const headers = new Headers({
        "cf-access-token": await accessToken({ refresh }),
      });
      for (const name of FORWARDED_REQUEST_HEADERS) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
      }
      return fetcher(target, { method, headers, redirect: "manual" });
    };

    let response;
    try {
      response = await send(false);
      if (signedOut(response)) response = await send(true);
    } catch (error) {
      return jsonResponse(
        502,
        "REMOTE_UNAVAILABLE",
        error instanceof Error ? error.message : `${remote} did not answer.`,
      );
    }
    if (signedOut(response)) {
      return jsonResponse(
        502,
        "REMOTE_SIGNED_OUT",
        `${remote} refused the Access token. Run \`cloudflared access login ${remote}\`, then press Refresh.`,
      );
    }
    const headers = new Headers();
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(method === "HEAD" ? null : response.body, {
      status: response.status,
      headers,
    });
  };
}
