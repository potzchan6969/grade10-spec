import { ArchiveError } from "./archive.mjs";

const DEFAULT_LOCAL_ORIGINS = [
  "http://localhost:6006",
  "http://127.0.0.1:6006",
];
const MAX_JSON_BYTES = 1 * 1024 * 1024;
const MAX_OBJECT_BYTES = 20 * 1024 * 1024;
const METHODS = "GET, POST, PUT, OPTIONS";
const HEADERS =
  "Authorization, Content-Type, Cf-Access-Jwt-Assertion, Cf-Access-Client-Id, Cf-Access-Client-Secret";

function responseHeaders(origin, allowedOrigin) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    Vary: "Origin",
  });
  if (origin && allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", METHODS);
    headers.set("Access-Control-Allow-Headers", HEADERS);
    headers.set("Access-Control-Expose-Headers", "ETag");
  }
  return headers;
}

function jsonResponse(value, status, headers) {
  const next = new Headers(headers);
  next.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(value), { status, headers: next });
}

function jsonError(error, headers) {
  if (error instanceof ArchiveError) {
    return jsonResponse(
      { error: error.message, code: error.code },
      error.status,
      headers,
    );
  }
  if (error instanceof TypeError || error instanceof SyntaxError) {
    return jsonResponse(
      { error: error.message, code: "INVALID_REQUEST" },
      400,
      headers,
    );
  }
  console.error("[ui-verification-archive] request failed", error);
  return jsonResponse(
    { error: "archive request failed", code: "INTERNAL_ERROR" },
    500,
    headers,
  );
}

async function readLimited(request, limit) {
  const contentLength = request.headers.get("content-length");
  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > limit)
  ) {
    throw new ArchiveError(
      413,
      "BODY_TOO_LARGE",
      `request body cannot exceed ${limit} bytes`,
    );
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        throw new ArchiveError(
          413,
          "BODY_TOO_LARGE",
          `request body cannot exceed ${limit} bytes`,
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function readJson(request) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    throw new ArchiveError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "request must use application/json",
    );
  }
  const bytes = await readLimited(request, MAX_JSON_BYTES);
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new ArchiveError(
      400,
      "INVALID_JSON",
      "request body must contain valid JSON",
    );
  }
}

function parseLimit(value) {
  if (value === null || value === "") return undefined;
  if (!/^\d+$/.test(value)) throw new TypeError("limit must be an integer");
  const limit = Number(value);
  if (limit < 1 || limit > 100)
    throw new TypeError("limit must be from 1 to 100");
  return limit;
}

function queryOptions(url, names) {
  const result = {};
  for (const name of names) {
    const value = url.searchParams.get(name);
    if (value !== null && value !== "") result[name] = value;
  }
  result.limit = parseLimit(url.searchParams.get("limit"));
  return result;
}

function routeScope(method, pathname) {
  if (method === "GET") return "read";
  if (method === "PUT" && pathname === "/api/objects") return "publish";
  if (method === "POST" && pathname === "/api/reviews") return "review";
  if (
    method === "POST" &&
    ["/api/runs", "/api/assessments", "/api/calibrations"].includes(pathname)
  )
    return "publish";
  return null;
}

function hasScope(identity, scope) {
  if (!identity) return false;
  if (scope === "read")
    return identity.kind === "publisher" || identity.kind === "human";
  if (scope === "publish") return identity.kind === "publisher";
  return scope === "review" && identity.kind === "human" && identity.reviewer;
}

function pathRunId(pathname) {
  const prefix = "/api/runs/";
  if (!pathname.startsWith(prefix)) return null;
  const encoded = pathname.slice(prefix.length);
  if (!encoded || encoded.includes("/")) return null;
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}

export function createArchiveHandler(
  archive,
  { authorize = async () => null, allowedOrigins = DEFAULT_LOCAL_ORIGINS } = {},
) {
  const origins = new Set(allowedOrigins);

  return async function handleArchiveRequest(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    const originAllowed = !origin || origins.has(origin);
    const headers = responseHeaders(origin, originAllowed);
    if (!originAllowed)
      return jsonResponse(
        { error: "origin is not allowed", code: "ORIGIN_NOT_ALLOWED" },
        403,
        headers,
      );

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const scope = routeScope(request.method, url.pathname);
    if (!scope) {
      return jsonResponse(
        { error: "route not found", code: "NOT_FOUND" },
        404,
        headers,
      );
    }
    let identity;
    try {
      identity = await authorize(request, scope);
    } catch (error) {
      if (error instanceof ArchiveError && error.status !== 401)
        return jsonError(error, headers);
      return jsonResponse(
        { error: "authentication required", code: "UNAUTHORIZED" },
        401,
        headers,
      );
    }
    if (!hasScope(identity, scope)) {
      return jsonResponse(
        { error: "authentication required", code: "UNAUTHORIZED" },
        401,
        headers,
      );
    }

    try {
      if (request.method === "PUT" && url.pathname === "/api/objects") {
        const key = url.searchParams.get("key");
        if (!key) throw new TypeError("key query parameter is required");
        const contentType = request.headers
          .get("content-type")
          ?.split(";", 1)[0]
          .trim()
          .toLowerCase();
        if (contentType !== "image/png")
          throw new ArchiveError(
            415,
            "UNSUPPORTED_MEDIA_TYPE",
            "object uploads must use image/png",
          );
        const bytes = await readLimited(request, MAX_OBJECT_BYTES);
        const result = await archive.putObject(key, bytes);
        return jsonResponse(
          { key, created: result.created },
          result.created ? 201 : 200,
          headers,
        );
      }

      if (request.method === "GET" && url.pathname === "/api/objects") {
        const key = url.searchParams.get("key");
        if (!key) throw new TypeError("key query parameter is required");
        const bytes = await archive.getObject(key);
        if (!bytes)
          return jsonResponse(
            { error: "image object was not found", code: "OBJECT_NOT_FOUND" },
            404,
            headers,
          );
        const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
        const etag = Array.from(new Uint8Array(digest), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
        const response = new Response(bytes, { status: 200, headers });
        response.headers.set("Content-Type", "image/png");
        response.headers.set(
          "Cache-Control",
          "private, max-age=31536000, immutable",
        );
        response.headers.set("ETag", `"${etag}"`);
        return response;
      }

      if (request.method === "POST" && url.pathname === "/api/runs") {
        const manifest = await readJson(request);
        const existed = await archive.getRun(manifest.runId).then(Boolean);
        const run = await archive.sealRun(manifest);
        return jsonResponse(run, existed ? 200 : 201, headers);
      }

      if (request.method === "GET" && url.pathname === "/api/runs") {
        return jsonResponse(
          await archive.listRuns(queryOptions(url, ["caseId", "cursor"])),
          200,
          headers,
        );
      }

      const runId = request.method === "GET" ? pathRunId(url.pathname) : null;
      if (runId !== null) {
        const run = await archive.getRun(runId);
        if (!run)
          return jsonResponse(
            { error: "run was not found", code: "RUN_NOT_FOUND" },
            404,
            headers,
          );
        return jsonResponse(run, 200, headers);
      }

      if (request.method === "GET" && url.pathname === "/api/reviews") {
        return jsonResponse(
          await archive.listReviews(
            queryOptions(url, ["runId", "caseId", "cursor"]),
          ),
          200,
          headers,
        );
      }

      if (request.method === "POST" && url.pathname === "/api/reviews") {
        const review = await archive.createReview(
          await readJson(request),
          identity.reviewer,
        );
        return jsonResponse(review, 201, headers);
      }

      if (request.method === "GET" && url.pathname === "/api/assessments") {
        return jsonResponse(
          await archive.listAssessments(
            queryOptions(url, ["runId", "caseId", "cursor"]),
          ),
          200,
          headers,
        );
      }

      if (request.method === "POST" && url.pathname === "/api/assessments") {
        const assessment = await archive.createAssessment(
          await readJson(request),
        );
        return jsonResponse(assessment, 201, headers);
      }

      if (request.method === "GET" && url.pathname === "/api/calibrations") {
        return jsonResponse(
          await archive.listCalibrations(
            queryOptions(url, [
              "assessmentId",
              "profileId",
              "scorerId",
              "scorerVersion",
              "scorerModel",
              "contractHash",
              "rubricVersion",
              "labelPolicyVersion",
              "cursor",
            ]),
          ),
          200,
          headers,
        );
      }

      if (request.method === "POST" && url.pathname === "/api/calibrations") {
        const calibration = await archive.createCalibration(
          await readJson(request),
        );
        return jsonResponse(calibration, 201, headers);
      }

      return jsonResponse(
        { error: "route not found", code: "NOT_FOUND" },
        404,
        headers,
      );
    } catch (error) {
      return jsonError(error, headers);
    }
  };
}

export { DEFAULT_LOCAL_ORIGINS };
