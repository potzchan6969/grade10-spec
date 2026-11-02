import assert from "node:assert/strict";
import test from "node:test";
import {
  createAccessTokenSource,
  createRemoteArchiveHandler,
  remoteOrigin,
} from "../dev/remote-archive.mjs";
import { installUiVerificationArchive } from "../dev/storybook-middleware.mjs";

const ORIGIN = "https://storybook.example.com";

function jwt(expiresInSeconds) {
  const part = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${part({ alg: "RS256" })}.${part({
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })}.signature`;
}

test("the remote origin is HTTPS, or HTTP on loopback only", () => {
  assert.equal(remoteOrigin("https://storybook.example.com"), ORIGIN);
  assert.equal(remoteOrigin("http://127.0.0.1:8787"), "http://127.0.0.1:8787");
  for (const value of [
    "http://storybook.example.com",
    "https://storybook.example.com/api",
    "https://user:pass@storybook.example.com",
    "storybook.example.com",
  ]) {
    assert.throws(() => remoteOrigin(value), TypeError, value);
  }
});

test("a read goes to the hosted Worker with the signed-in person's Access token", async () => {
  const calls = [];
  const handler = createRemoteArchiveHandler({
    origin: ORIGIN,
    accessToken: async () => "person-token",
    fetcher: async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response('{"runs":[]}', {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "CF_Authorization=secret",
        },
      });
    },
  });

  const response = await handler(
    new Request("http://localhost:6006/api/runs?caseId=vc_1&cursor=", {
      headers: { Accept: "application/json", Cookie: "local=1" },
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { runs: [] });
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${ORIGIN}/api/runs?caseId=vc_1&cursor=`);
  assert.equal(calls[0].init.redirect, "manual");
  assert.equal(calls[0].init.headers.get("cf-access-token"), "person-token");
  assert.equal(calls[0].init.headers.get("accept"), "application/json");
  assert.equal(calls[0].init.headers.get("cookie"), null);
});

test("a write never reaches the hosted Worker", async () => {
  let called = false;
  const handler = createRemoteArchiveHandler({
    origin: ORIGIN,
    accessToken: async () => "person-token",
    fetcher: async () => {
      called = true;
      return new Response(null);
    },
  });

  const response = await handler(
    new Request("http://localhost:6006/api/approvals", {
      method: "POST",
      body: "{}",
    }),
  );

  assert.equal(response.status, 405);
  assert.equal((await response.json()).code, "REMOTE_READ_ONLY");
  assert.equal(called, false);
});

test("reading scores is the one POST that reaches the hosted Worker", async () => {
  const calls = [];
  const handler = createRemoteArchiveHandler({
    origin: ORIGIN,
    accessToken: async () => "person-token",
    fetcher: async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response('{"scores":{}}', {
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  const body = JSON.stringify({ keys: ["a|whole|b|whole"] });
  const response = await handler(
    new Request("http://localhost:6006/api/scores/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].url, `${ORIGIN}/api/scores/read`);
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.body, body);
  assert.equal(calls[0].init.headers.get("content-type"), "application/json");

  const queue = await handler(
    new Request("http://localhost:6006/api/scores", {
      method: "POST",
      body: body,
    }),
  );
  assert.equal(queue.status, 405, "asking for scores still writes");
  assert.equal(calls.length, 1);
});

test("a refused token is fetched again once, then the person is told to sign in", async () => {
  const refreshes = [];
  const statuses = [302, 200];
  const handler = createRemoteArchiveHandler({
    origin: ORIGIN,
    accessToken: async ({ refresh }) => {
      refreshes.push(refresh);
      return refresh ? "fresh" : "stale";
    },
    fetcher: async () => new Response("{}", { status: statuses.shift() }),
  });
  assert.equal(
    (await handler(new Request("http://localhost:6006/api/runs"))).status,
    200,
  );
  assert.deepEqual(refreshes, [false, true]);

  const signedOut = createRemoteArchiveHandler({
    origin: ORIGIN,
    accessToken: async () => "stale",
    fetcher: async () => new Response("", { status: 403 }),
  });
  const response = await signedOut(
    new Request("http://localhost:6006/api/runs"),
  );
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, "REMOTE_SIGNED_OUT");
  assert.match(body.error, /cloudflared access login https:\/\/storybook/);
});

test("the token comes from cloudflared, cached until it nears its expiry", async () => {
  const commands = [];
  let token = jwt(3600);
  const source = createAccessTokenSource(ORIGIN, {
    runCommand: async (command, args) => {
      commands.push([command, ...args]);
      return { stdout: `${token}\n` };
    },
  });

  assert.equal(await source(), token);
  assert.equal(await source(), token);
  assert.deepEqual(commands, [
    ["cloudflared", "access", "token", `--app=${ORIGIN}`],
  ]);
  token = jwt(3600);
  assert.equal(await source({ refresh: true }), token);
  assert.equal(commands.length, 2);

  const missing = createAccessTokenSource(ORIGIN, {
    runCommand: async () => {
      throw new Error("Unable to find token");
    },
  });
  await assert.rejects(missing(), /cloudflared access login/);

  const given = createAccessTokenSource(ORIGIN, {
    staticToken: "given",
    runCommand: async () => assert.fail("cloudflared is not asked"),
  });
  assert.equal(await given(), "given");
});

test("Storybook mounts the remote archive and refuses it beside a local one", async () => {
  const uses = [];
  installUiVerificationArchive(
    { use: (middleware) => uses.push(middleware) },
    {
      env: {
        UI_VERIFICATION_REMOTE: ORIGIN,
        UI_VERIFICATION_REMOTE_TOKEN: "given",
      },
    },
  );
  assert.equal(uses.length, 1);

  assert.throws(
    () =>
      installUiVerificationArchive(
        { use: () => {} },
        {
          env: {
            UI_VERIFICATION_REMOTE: ORIGIN,
            UI_VERIFICATION_ARCHIVE: "/tmp/archive",
          },
        },
      ),
    /not both/,
  );
});
