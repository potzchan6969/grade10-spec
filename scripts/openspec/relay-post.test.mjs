import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * What a run tells the relay: a thread reply, that it is done, or which
 * change it opened — through the wake token the relay signed, never a
 * chat token of the run's own. A `node:http` stub stands in for the relay,
 * so the request itself (its path, its body, its headers) is what each test
 * reads, not a mock of the fetch call.
 *
 * `spawn`, not `spawnSync`: the stub server runs in this same process, and a
 * synchronous child would block the event loop the server needs to answer
 * it — the two would deadlock until the child's own network call timed out.
 */

const SCRIPT = fileURLToPath(new URL("./relay-post.mjs", import.meta.url));
const TOKEN = "wake-token-abc123";

function run(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SCRIPT, ...args]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

function bareRoot() {
  return mkdtempSync(join(tmpdir(), "relay-post-"));
}

/** A root whose `.round/relay.json` points at `url`, the way a wake writes it
 * (relay-contract.md, Store-side scripts). */
function relayRoot(url, token = TOKEN) {
  const root = bareRoot();
  mkdirSync(join(root, ".round"), { recursive: true });
  writeFileSync(
    join(root, ".round", "relay.json"),
    JSON.stringify({
      relay: { url, token },
      change: "demo-change",
      sender: { handle: "@dana" },
      thread: { channel: "C1", ts: "1.1" },
    }),
  );
  return root;
}

/** A `node:http` server standing in for the relay: `handler` reads the
 * request and decides the answer. */
function stubRelay(handler) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => handler(req, res, body));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const urlOf = (server) => `http://127.0.0.1:${server.address().port}`;

// ── No relay bound: a terminal round posts nothing ──────────────────────────

test("with no .round/relay.json, --text prints the message and exits 0", async () => {
  const result = await run([
    "--text",
    "the read again changed nothing",
    "--root",
    bareRoot(),
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /the read again changed nothing/);
});

test("with no .round/relay.json, --done prints done", async () => {
  const result = await run(["--done", "--root", bareRoot()]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /done/);
});

test("with no .round/relay.json, --bind prints the change it would have bound", async () => {
  const result = await run(["--bind", "demo-change", "--root", bareRoot()]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /demo-change/);
});

// ── An empty message posts nothing, relay bound or not ──────────────────────

test("an empty message file posts nothing, and makes no request", async () => {
  const server = await stubRelay(() => {
    throw new Error("the relay should not have been called");
  });
  const root = relayRoot(urlOf(server));
  const file = join(root, "thread.txt");
  writeFileSync(file, "\n");

  const result = await run(["--message-file", file, "--root", root]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing to post/);
});

test("a --message-file that does not exist posts nothing either", async () => {
  const server = await stubRelay(() => {
    throw new Error("the relay should not have been called");
  });
  const root = relayRoot(urlOf(server));

  const result = await run([
    "--message-file",
    join(root, "never-written.txt"),
    "--root",
    root,
  ]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing to post/);
});

// ── With a relay bound: the request itself ──────────────────────────────────

test("shared-planning-agent-rounds-SC-74 - a run posts through the relay with its wake token and holds no chat token", async () => {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: JSON.parse(body),
    };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  });
  const root = relayRoot(urlOf(server));
  const file = join(root, "thread.txt");
  writeFileSync(file, "the read again changed nothing\n");

  const result = await run(["--message-file", file, "--root", root]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.method, "POST");
  assert.equal(seen.url, `/runs/${TOKEN}/post`);
  assert.deepEqual(seen.body, { text: "the read again changed nothing" });
  // The wake token rides the path, not a bearer header: nothing here is a
  // chat token, and nothing needs to be.
  assert.equal(seen.headers.authorization, undefined);
  assert.ok(!result.stdout.includes(TOKEN));
  assert.ok(!result.stderr.includes(TOKEN));
});

test("--text posts the given text directly, with no file", async () => {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = { url: req.url, body: JSON.parse(body) };
    res.writeHead(200);
    res.end("{}");
  });
  const root = relayRoot(urlOf(server));

  const result = await run([
    "--text",
    "Reading… <https://example.test|Run>",
    "--root",
    root,
  ]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.url, `/runs/${TOKEN}/post`);
  assert.deepEqual(seen.body, { text: "Reading… <https://example.test|Run>" });
});

test("--done posts to /done with an empty body", async () => {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = { method: req.method, url: req.url, body };
    res.writeHead(200);
    res.end("{}");
  });
  const root = relayRoot(urlOf(server));

  const result = await run(["--done", "--root", root]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.method, "POST");
  assert.equal(seen.url, `/runs/${TOKEN}/done`);
  assert.deepEqual(JSON.parse(seen.body), {});
});

test("--bind posts the change to /bind", async () => {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = { url: req.url, body: JSON.parse(body) };
    res.writeHead(200);
    res.end("{}");
  });
  const root = relayRoot(urlOf(server));

  const result = await run(["--bind", "demo-change", "--root", root]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.url, `/runs/${TOKEN}/bind`);
  assert.deepEqual(seen.body, { change: "demo-change" });
});

// ── A refusal from the relay ─────────────────────────────────────────────────

test("a non-2xx answer prints the status and body to stderr and exits 1, and holds no token", async () => {
  const server = await stubRelay((_req, res) => {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("this wake has expired");
  });
  const root = relayRoot(urlOf(server));

  const result = await run(["--text", "land", "--root", root]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /403/);
  assert.match(result.stderr, /this wake has expired/);
  assert.ok(!result.stderr.includes(TOKEN));
  assert.ok(!result.stdout.includes(TOKEN));
});

// ── Usage ────────────────────────────────────────────────────────────────────

test("refuses with no mode given", async () => {
  const result = await run(["--root", bareRoot()]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /usage: node relay-post\.mjs/);
});

test("refuses two modes at once", async () => {
  const result = await run(["--text", "a", "--done", "--root", bareRoot()]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /usage: node relay-post\.mjs/);
});
