import assert from "node:assert/strict";
import test from "node:test";
import previewWorker from "../../worker/index.mjs";

const PUBLISHER_TOKEN = "test-publisher-token";

function fakeR2Bucket() {
  const values = new Map();
  const bucket = {
    listCalls: 0,
    async put(key, body, options = {}) {
      if (values.has(key) && options.onlyIf?.etagDoesNotMatch === "*") {
        return null;
      }
      const bytes = new Uint8Array(body);
      values.set(key, bytes);
      return { key, etag: `etag-${values.size}` };
    },
    async get(key) {
      const bytes = values.get(key);
      if (!bytes) return null;
      return {
        arrayBuffer: async () =>
          bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength,
          ),
      };
    },
    async list({ prefix, limit = 1000, cursor }) {
      bucket.listCalls += 1;
      const keys = [...values.keys()]
        .filter((key) => key.startsWith(prefix) && (!cursor || key > cursor))
        .sort();
      const objects = keys.slice(0, limit).map((key) => ({ key }));
      const truncated = keys.length > limit;
      return {
        objects,
        truncated,
        cursor: truncated ? objects.at(-1)?.key : undefined,
      };
    },
  };
  return bucket;
}

function assetBinding() {
  const requests = [];
  return {
    requests,
    async fetch(request) {
      requests.push(request);
      return new Response("storybook asset", {
        headers: { "Content-Type": "text/plain" },
      });
    },
  };
}

test("static assets bypass the archive binding", async () => {
  const assets = assetBinding();
  const request = new Request("https://storybook.grade10-stg.com/index.html");

  const response = await previewWorker.fetch(request, { ASSETS: assets });

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "storybook asset");
  assert.deepEqual(assets.requests, [request]);
});

test("API requests return a visible 503 when the R2 binding is missing", async () => {
  const assets = assetBinding();
  const request = new Request("https://storybook.grade10-stg.com/api/runs");

  const response = await previewWorker.fetch(request, { ASSETS: assets });

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "archive storage is unavailable",
    code: "ARCHIVE_UNAVAILABLE",
  });
  assert.deepEqual(assets.requests, []);
});

test("same-origin API requests use the R2 archive and publisher authorization", async () => {
  const assets = assetBinding();
  const archive = fakeR2Bucket();
  const request = new Request(
    "https://storybook.grade10-stg.com/api/runs?limit=10",
    {
      headers: {
        Authorization: `Bearer ${PUBLISHER_TOKEN}`,
        Origin: "https://storybook.grade10-stg.com",
      },
    },
  );

  const response = await previewWorker.fetch(request, {
    ASSETS: assets,
    ARCHIVE: archive,
    PUBLISHER_TOKEN,
  });

  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://storybook.grade10-stg.com",
  );
  assert.deepEqual(await response.json(), { runs: [] });
  assert.ok(archive.listCalls > 0);
  assert.deepEqual(assets.requests, []);
});

test("API requests still require publisher authentication", async () => {
  const assets = assetBinding();
  const request = new Request("https://storybook.grade10-stg.com/api/runs", {
    headers: { Origin: "https://storybook.grade10-stg.com" },
  });

  const response = await previewWorker.fetch(request, {
    ASSETS: assets,
    ARCHIVE: fakeR2Bucket(),
  });

  assert.equal(response.status, 401);
  assert.equal((await response.json()).code, "UNAUTHORIZED");
  assert.deepEqual(assets.requests, []);
});

test("API preflight allows the configured Access service-token headers", async () => {
  const assets = assetBinding();
  const request = new Request("https://storybook.grade10-stg.com/api/runs", {
    method: "OPTIONS",
    headers: {
      Origin: "https://storybook.grade10-stg.com",
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers":
        "authorization, cf-access-client-id, cf-access-client-secret",
    },
  });

  const response = await previewWorker.fetch(request, {
    ASSETS: assets,
    ARCHIVE: fakeR2Bucket(),
  });

  assert.equal(response.status, 204);
  const allowedHeaders = response.headers
    .get("access-control-allow-headers")
    .toLowerCase();
  assert.match(allowedHeaders, /cf-access-client-id/);
  assert.match(allowedHeaders, /cf-access-client-secret/);
});

test("an explicit origin allowlist is preserved by the preview wrapper", async () => {
  const assets = assetBinding();
  const request = new Request("https://storybook.grade10-stg.com/api/runs", {
    headers: {
      Authorization: `Bearer ${PUBLISHER_TOKEN}`,
      Origin: "https://attacker.example.test",
    },
  });

  const response = await previewWorker.fetch(request, {
    ASSETS: assets,
    ARCHIVE: fakeR2Bucket(),
    PUBLISHER_TOKEN,
    ALLOWED_ORIGINS: "https://storybook.grade10-stg.com",
  });

  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "ORIGIN_NOT_ALLOWED");
  assert.deepEqual(assets.requests, []);
});

test("non-API paths, including prefixed API-looking paths, use static assets", async () => {
  const assets = assetBinding();
  const request = new Request(
    "https://storybook.grade10-stg.com/storybook/api/runs",
  );

  const response = await previewWorker.fetch(request, { ASSETS: assets });

  assert.equal(response.status, 200);
  assert.deepEqual(assets.requests, [request]);
});
