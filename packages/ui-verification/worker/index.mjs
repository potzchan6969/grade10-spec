import { ArchiveError, createR2Archive } from "../src/archive.mjs";
import {
  createArchiveHandler,
  DEFAULT_LOCAL_ORIGINS,
} from "../src/archive-api.mjs";

const ACCESS_KEY_CACHE_MS = 10 * 60 * 1000;
const accessKeyCache = new Map();
const utf8 = new TextEncoder();

function constantTimeEqual(left, right) {
  const a = utf8.encode(left);
  const b = utf8.encode(right);
  let difference = a.byteLength ^ b.byteLength;
  const length = Math.max(a.byteLength, b.byteLength);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return difference === 0;
}

function decodeBase64Url(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const base64 = value
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(base64);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function parseJwtPart(value) {
  const bytes = decodeBase64Url(value);
  if (!bytes) return null;
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function validHttpsOrigin(value, name) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError(`${name} must be an absolute HTTPS URL`);
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new TypeError(`${name} must be an HTTPS origin`);
  }
  return url.origin;
}

function validateJwksUrl(value, issuer) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  ) {
    throw new TypeError(
      "ACCESS_JWKS_URL must use HTTPS except for loopback tests",
    );
  }
  if (url.username || url.password || url.hash)
    throw new TypeError(
      "ACCESS_JWKS_URL must not include credentials or a fragment",
    );
  if (url.protocol === "https:" && url.origin === issuer) return url.href;
  if (url.protocol === "https:") return url.href;
  if (!["localhost", "127.0.0.1"].includes(url.hostname))
    throw new TypeError("ACCESS_JWKS_URL HTTP is restricted to loopback tests");
  return url.href;
}

async function fetchAccessKeys(jwksUrl, fetcher = globalThis.fetch) {
  const cached = accessKeyCache.get(jwksUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.keys;
  let response;
  try {
    response = await fetcher(jwksUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch (cause) {
    throw new ArchiveError(
      503,
      "ACCESS_VALIDATION_UNAVAILABLE",
      "Access signing keys could not be reached",
      { cause },
    );
  }
  if (!response.ok)
    throw new ArchiveError(
      503,
      "ACCESS_VALIDATION_UNAVAILABLE",
      "Access signing keys could not be reached",
    );
  let document;
  try {
    document = await response.json();
  } catch (cause) {
    throw new ArchiveError(
      503,
      "ACCESS_VALIDATION_UNAVAILABLE",
      "Access returned invalid signing keys",
      { cause },
    );
  }
  if (!Array.isArray(document?.keys))
    throw new ArchiveError(
      503,
      "ACCESS_VALIDATION_UNAVAILABLE",
      "Access returned invalid signing keys",
    );
  accessKeyCache.set(jwksUrl, {
    keys: document.keys,
    expiresAt: Date.now() + ACCESS_KEY_CACHE_MS,
  });
  return document.keys;
}

async function verifyAccessToken(
  token,
  { issuer, audience, jwksUrl, fetcher = globalThis.fetch },
) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const header = parseJwtPart(parts[0]);
  const claims = parseJwtPart(parts[1]);
  const signature = decodeBase64Url(parts[2]);
  if (
    !header ||
    !claims ||
    !signature ||
    header.alg !== "RS256" ||
    typeof header.kid !== "string"
  )
    return null;
  if (
    header.crit !== undefined ||
    header.jku !== undefined ||
    header.x5u !== undefined ||
    header.b64 === false
  )
    return null;
  if (claims.iss !== issuer) return null;
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(audience)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(claims.exp) || claims.exp <= now - 30) return null;
  if (
    claims.nbf !== undefined &&
    (!Number.isFinite(claims.nbf) || claims.nbf > now + 30)
  )
    return null;
  if (
    typeof claims.sub !== "string" ||
    claims.sub.trim() === "" ||
    claims.sub.length > 255
  )
    return null;
  if (
    typeof claims.email !== "string" ||
    claims.email.trim() === "" ||
    claims.email.length > 320
  )
    return null;

  let keys = await fetchAccessKeys(jwksUrl, fetcher);
  let jwk = keys.find(
    (key) =>
      key.kid === header.kid &&
      key.kty === "RSA" &&
      (!key.use || key.use === "sig") &&
      (!key.alg || key.alg === "RS256"),
  );
  if (!jwk) {
    accessKeyCache.delete(jwksUrl);
    keys = await fetchAccessKeys(jwksUrl, fetcher);
    jwk = keys.find(
      (key) =>
        key.kid === header.kid &&
        key.kty === "RSA" &&
        (!key.use || key.use === "sig") &&
        (!key.alg || key.alg === "RS256"),
    );
  }
  if (!jwk) return null;

  let verified = false;
  try {
    const key = await globalThis.crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    verified = await globalThis.crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      key,
      signature,
      utf8.encode(`${parts[0]}.${parts[1]}`),
    );
  } catch {
    return null;
  }
  if (!verified) return null;
  return {
    kind: "human",
    reviewer: {
      subject: claims.sub,
      ...(claims.email === undefined ? {} : { email: claims.email }),
    },
  };
}

function allowedOriginsFromEnv(env) {
  const configured = env.ALLOWED_ORIGINS;
  if (configured === undefined || configured.trim() === "")
    return DEFAULT_LOCAL_ORIGINS;
  const origins = configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) return [];
  return origins.map((origin) => {
    const url = new URL(origin);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== origin ||
      url.username ||
      url.password
    ) {
      throw new TypeError(
        "ALLOWED_ORIGINS must contain only exact HTTP(S) origins",
      );
    }
    return origin;
  });
}

function createRemoteAuthorizer(env, fetcher = globalThis.fetch) {
  const publisherToken =
    typeof env.PUBLISHER_TOKEN === "string" ? env.PUBLISHER_TOKEN : "";
  const issuer = env.ACCESS_ISSUER
    ? validHttpsOrigin(env.ACCESS_ISSUER, "ACCESS_ISSUER")
    : null;
  const audience = typeof env.ACCESS_AUD === "string" ? env.ACCESS_AUD : "";
  const configuredJwks = env.ACCESS_JWKS_URL;
  const jwksUrl =
    issuer && audience
      ? validateJwksUrl(
          configuredJwks ?? new URL("/cdn-cgi/access/certs", issuer).href,
          issuer,
        )
      : null;

  return async (request, scope) => {
    const authorization = request.headers.get("authorization") ?? "";
    const bearer = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    const isPublisher =
      publisherToken.length > 0 &&
      bearer.length > 0 &&
      constantTimeEqual(bearer, publisherToken);
    if (scope === "publish") return isPublisher ? { kind: "publisher" } : null;
    if (isPublisher) return { kind: "publisher" };

    const assertion = request.headers.get("cf-access-jwt-assertion");
    if (!assertion || !issuer || !audience || !jwksUrl) return null;
    return verifyAccessToken(assertion, { issuer, audience, jwksUrl, fetcher });
  };
}

export function createWorker({ fetcher = globalThis.fetch } = {}) {
  return {
    async fetch(request, env) {
      const archive = createR2Archive(env.ARCHIVE);
      const handler = createArchiveHandler(archive, {
        authorize: createRemoteAuthorizer(env, fetcher),
        allowedOrigins: allowedOriginsFromEnv(env),
      });
      return handler(request);
    },
  };
}

export async function fetch(request, env) {
  return createWorker().fetch(request, env);
}

export default { fetch };
