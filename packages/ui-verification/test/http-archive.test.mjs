import assert from "node:assert/strict";
import test from "node:test";
import { createHttpArchive } from "../src/archive.mjs";

test("HTTP archive sends publisher and paired Access credentials without logging them", async () => {
  const publisherToken = "publisher-token-secret";
  const accessClientId = "access-client-id";
  const accessClientSecret = "access-client-secret";
  let request;
  const logs = [];
  const previous = {
    error: console.error,
    log: console.log,
    warn: console.warn,
  };
  console.error = (...values) => logs.push(values);
  console.log = (...values) => logs.push(values);
  console.warn = (...values) => logs.push(values);
  try {
    const archive = createHttpArchive("https://archive.example.test", {
      token: publisherToken,
      accessClientId,
      accessClientSecret,
      fetcher: async (url, options) => {
        request = { url: new URL(url), headers: new Headers(options.headers) };
        return new Response(JSON.stringify({ runs: [] }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    });

    assert.deepEqual(await archive.listRuns(), { runs: [] });

    assert.equal(request.url.href, "https://archive.example.test/api/runs");
    assert.equal(
      request.headers.get("authorization"),
      `Bearer ${publisherToken}`,
    );
    assert.equal(request.headers.get("cf-access-client-id"), accessClientId);
    assert.equal(
      request.headers.get("cf-access-client-secret"),
      accessClientSecret,
    );
  } finally {
    console.error = previous.error;
    console.log = previous.log;
    console.warn = previous.warn;
  }

  const output = JSON.stringify(logs);
  assert.equal(output.includes(publisherToken), false);
  assert.equal(output.includes(accessClientId), false);
  assert.equal(output.includes(accessClientSecret), false);
});

test("HTTP archive requires both Access service token values", () => {
  assert.throws(
    () =>
      createHttpArchive("https://archive.example.test", {
        accessClientId: "access-client-id",
      }),
    /accessClientId and accessClientSecret must be provided together/i,
  );
  assert.throws(
    () =>
      createHttpArchive("https://archive.example.test", {
        accessClientSecret: "access-client-secret",
      }),
    /accessClientId and accessClientSecret must be provided together/i,
  );
});

test("HTTP archive tells fetch to reject redirects that could forward Access credentials", async () => {
  let requestOptions;
  const archive = createHttpArchive("https://archive.example.test", {
    accessClientId: "access-client-id",
    accessClientSecret: "access-client-secret",
    fetcher: async (_url, options) => {
      requestOptions = options;
      return new Response(JSON.stringify({ runs: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  await archive.listRuns();

  assert.equal(requestOptions.redirect, "error");
});

test("HTTP archive does not log Access credentials when the service rejects a request", async () => {
  const accessClientId = "access-client-id";
  const accessClientSecret = "access-client-secret";
  const logs = [];
  const previous = console.error;
  console.error = (...values) => logs.push(values);
  try {
    const archive = createHttpArchive("https://archive.example.test", {
      accessClientId,
      accessClientSecret,
      fetcher: async () =>
        new Response(JSON.stringify({ error: "authentication required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
    });
    await assert.rejects(archive.listRuns(), { status: 401 });
  } finally {
    console.error = previous;
  }

  const output = JSON.stringify(logs);
  assert.equal(output.includes(accessClientId), false);
  assert.equal(output.includes(accessClientSecret), false);
});
