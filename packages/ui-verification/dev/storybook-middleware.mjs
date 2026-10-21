import { realpathSync } from "node:fs";
import { isIP } from "node:net";
import { dirname, isAbsolute, resolve } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { createArchive } from "../src/archive.mjs";
import { createArchiveHandler } from "../src/archive-api.mjs";

const SPEC_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function sameDirectory(left, right) {
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

function findEnclosingAppRoot(specRoot) {
  let candidate = dirname(specRoot);
  for (;;) {
    if (
      sameDirectory(resolve(candidate, "external", "grade10-spec"), specRoot)
    ) {
      return candidate;
    }
    const parent = dirname(candidate);
    if (parent === candidate) return null;
    candidate = parent;
  }
}

export function resolveArchiveRoot({
  specRoot = SPEC_ROOT,
  env = process.env,
} = {}) {
  const override = env.UI_VERIFICATION_ARCHIVE;
  if (override !== undefined) {
    if (!isAbsolute(override)) {
      throw new TypeError("UI_VERIFICATION_ARCHIVE must be an absolute path");
    }
    return resolve(override);
  }

  const resolvedSpecRoot = resolve(specRoot);
  const root = findEnclosingAppRoot(resolvedSpecRoot) ?? resolvedSpecRoot;
  return resolve(root, ".cache", "ui-verification");
}

export function createLocalArchiveHandler(archive, archiveRoot) {
  if (typeof archiveRoot !== "string" || !isAbsolute(archiveRoot)) {
    throw new TypeError("archiveRoot must be an absolute path");
  }

  return createArchiveHandler(archive, {
    authorize: async (_request, scope) =>
      scope === "review"
        ? { kind: "human", reviewer: { subject: "local-development" } }
        : { kind: "publisher" },
    sameOrigin: true,
    storage: { kind: "filesystem", location: archiveRoot },
  });
}

function isLoopbackHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "::1") return true;
  return isIP(host) === 4 && host.startsWith("127.");
}

function isLoopbackAddress(address) {
  if (typeof address !== "string") return false;
  const normalized = address.startsWith("::ffff:")
    ? address.slice("::ffff:".length)
    : address;
  if (normalized === "::1") return true;
  return isIP(normalized) === 4 && normalized.startsWith("127.");
}

function deniedResponse() {
  return new Response(
    JSON.stringify({
      error: "local archive API accepts loopback same-origin requests only",
      code: "ORIGIN_NOT_ALLOWED",
    }),
    {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function requestUrlFor(request) {
  const hostHeader = request.headers.host;
  if (typeof hostHeader !== "string" || !hostHeader) return null;

  const protocol = request.socket?.encrypted ? "https:" : "http:";
  let base;
  try {
    base = new URL(`${protocol}//${hostHeader}`);
  } catch {
    return null;
  }
  if (
    base.username ||
    base.password ||
    base.pathname !== "/" ||
    base.search ||
    base.hash ||
    !isLoopbackHost(base.hostname) ||
    !isLoopbackAddress(request.socket?.remoteAddress)
  ) {
    return null;
  }

  let url;
  try {
    url = new URL(request.url ?? "/", base.origin);
  } catch {
    return null;
  }
  if (url.origin !== base.origin) return null;

  const origin = request.headers.origin;
  if (origin !== undefined && origin !== base.origin) return null;
  const method = request.method ?? "GET";
  if (origin === undefined && !["GET", "HEAD"].includes(method)) return null;
  return url;
}

function requestHeadersFor(request) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (value === undefined || HOP_BY_HOP_HEADERS.has(name)) continue;
    headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  return headers;
}

async function writeResponse(response, outgoing, method) {
  response.headers.forEach((value, name) => {
    outgoing.setHeader(name, value);
  });
  outgoing.statusCode = response.status;
  if (!response.body || method === "HEAD") {
    outgoing.end();
    return;
  }
  outgoing.end(Buffer.from(await response.arrayBuffer()));
}

export function createNodeArchiveMiddleware(handler) {
  return async function handleArchiveApi(request, response, next) {
    const requestPath = (request.url ?? "/").split("?", 1)[0];
    if (requestPath !== "/api" && !requestPath.startsWith("/api/")) {
      return next();
    }

    try {
      const url = requestUrlFor(request);
      if (!url) {
        return writeResponse(deniedResponse(), response, request.method);
      }

      const method = request.method ?? "GET";
      const body = ["GET", "HEAD"].includes(method)
        ? undefined
        : Readable.toWeb(request);
      const fetchRequest = new Request(url, {
        method,
        headers: requestHeadersFor(request),
        ...(body ? { body, duplex: "half" } : {}),
      });
      return writeResponse(await handler(fetchRequest), response, method);
    } catch (error) {
      return next(error);
    }
  };
}

export function installUiVerificationArchive(
  app,
  { specRoot = SPEC_ROOT, env = process.env } = {},
) {
  const archiveRoot = resolveArchiveRoot({ specRoot, env });
  const archive = createArchive(archiveRoot);
  const handler = createLocalArchiveHandler(archive, archiveRoot);
  app.use(createNodeArchiveMiddleware(handler));
}

export default installUiVerificationArchive;
