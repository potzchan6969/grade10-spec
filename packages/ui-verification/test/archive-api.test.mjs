import assert from "node:assert/strict";
import test from "node:test";
import { createArchiveHandler } from "../src/archive-api.mjs";

test("Access service-token headers are accepted on same-origin preflight", async () => {
  const handler = createArchiveHandler(
    {},
    {
      allowedOrigins: ["https://storybook.example.test"],
    },
  );
  const response = await handler(
    new Request("https://storybook.example.test/api/runs", {
      method: "OPTIONS",
      headers: {
        Origin: "https://storybook.example.test",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers":
          "authorization, cf-access-client-id, cf-access-client-secret",
      },
    }),
  );

  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://storybook.example.test",
  );
  const allowedHeaders = response.headers
    .get("access-control-allow-headers")
    .toLowerCase();
  assert.match(allowedHeaders, /cf-access-client-id/);
  assert.match(allowedHeaders, /cf-access-client-secret/);
});

test("archive info reports configured storage metadata to authenticated readers", async () => {
  const storage = {
    kind: "filesystem",
    location: "/tmp/ui-verification",
  };
  const handler = createArchiveHandler(
    {},
    {
      authorize: async (_request, scope) =>
        scope === "read" ? { kind: "publisher" } : null,
      storage,
    },
  );
  const response = await handler(
    new Request("http://localhost:6006/api/archive-info"),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { storage });
});

test("archive info requires read authorization", async () => {
  const handler = createArchiveHandler(
    {},
    {
      authorize: async () => null,
      storage: { kind: "r2", location: "Storybook archive" },
    },
  );
  const response = await handler(
    new Request("http://localhost:6006/api/archive-info"),
  );

  assert.equal(response.status, 401);
});
