import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { RELAY_FILE, readWake, relayOf } from "./lib/relay.mjs";

/**
 * The one client of the relay: the wake's own file, and the five calls a run
 * makes on it. A `node:http` stub stands in for the relay, so what each test
 * reads is the request itself — its method, its path, its bearer and its
 * body — rather than a mock of `fetch`.
 *
 * The loud failures run in a child: `readWake` exits the process rather than
 * throwing, because a run that lost the payload it was given has nothing to
 * carry on with, and a test that called it in this one would take the runner
 * down with it.
 */

const LIB = pathToFileURL(
  join(import.meta.dirname, "lib", "relay.mjs"),
).toString();
const TOKEN = "wake-tok-42";

const bareRoot = () => mkdtempSync(join(tmpdir(), "relay-lib-"));

/** A root whose `.round/relay.json` is the payload a wake writes, or whatever
 * `text` says where a test wants it malformed. */
function wakeRoot(url, text) {
  const root = bareRoot();
  mkdirSync(join(root, ".round"), { recursive: true });
  writeFileSync(
    join(root, RELAY_FILE),
    text ??
      JSON.stringify({
        relay: { url, token: TOKEN },
        change: "demo-change",
        reason: "message",
        sender: { slack: "U1", handle: "dana" },
        thread: { channel: "C1", ts: "1.1" },
        messages: [{ handle: "dana", text: "land", ts: "1.2" }],
      }),
  );
  return root;
}

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

/** `readWake` in a child, so its exit is its own. */
const readWakeIn = (root, env = {}) =>
  spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { readWake } from ${JSON.stringify(LIB)};
       console.log(JSON.stringify(readWake(${JSON.stringify(root)})));`,
    ],
    { encoding: "utf8", env: { ...process.env, ...env } },
  );

// ── The wake's file ─────────────────────────────────────────────────────────

test("readWake answers nothing where there is no wake: a terminal round", () => {
  assert.equal(readWake(bareRoot()), null);
});

test("readWake reads the url, the token, the change, the sender and the thread", () => {
  const wake = readWake(wakeRoot("https://relay.test/"));

  // The trailing slash goes: every path the client builds opens with one.
  assert.equal(wake.url, "https://relay.test");
  assert.equal(wake.token, TOKEN);
  assert.equal(wake.change, "demo-change");
  assert.equal(wake.sender.handle, "dana");
  assert.deepEqual(wake.thread, { channel: "C1", ts: "1.1" });
  assert.equal(wake.messages.length, 1);
});

test("ROUND_WAKE=relay with no file fails loudly, naming the file", () => {
  const result = readWakeIn(bareRoot(), { ROUND_WAKE: "relay" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.round\/relay\.json/);
  assert.match(result.stderr, /ROUND_WAKE=relay/);
  assert.equal(result.stderr.trim().split("\n").length, 1);
});

test("a wake's file that is not JSON fails loudly, naming the file", () => {
  const result = readWakeIn(wakeRoot("https://relay.test", "{ not json"));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.round\/relay\.json is not JSON/);
});

test("a wake's file naming no url and token fails loudly", () => {
  const result = readWakeIn(
    wakeRoot("https://relay.test", JSON.stringify({ change: "demo-change" })),
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /names no relay\.url and relay\.token/);
});

// ── The calls ───────────────────────────────────────────────────────────────

/** Every call's request, read off the stub: the method, the path, the bearer
 * and the body. */
async function seenFor(call, answer = { status: 200, body: {} }) {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = {
      method: req.method,
      url: req.url,
      authorization: req.headers.authorization,
      body: body === "" ? undefined : JSON.parse(body),
    };
    res.writeHead(answer.status, { "content-type": "application/json" });
    res.end(JSON.stringify(answer.body));
  });
  const wake = readWake(wakeRoot(urlOf(server)));
  const result = await call(relayOf(wake));
  server.close();
  return { seen, result };
}

test("post asks /post with the text, bearing the wake's token", async () => {
  const { seen, result } = await seenFor((relay) => relay.post("one line"));

  assert.equal(seen.method, "POST");
  assert.equal(seen.url, `/runs/${TOKEN}/post`);
  assert.equal(seen.authorization, `Bearer ${TOKEN}`);
  assert.deepEqual(seen.body, { text: "one line" });
  assert.equal(result.status, 200);
});

test("done asks /done with an empty body", async () => {
  const { seen } = await seenFor((relay) => relay.done());

  assert.equal(seen.url, `/runs/${TOKEN}/done`);
  assert.deepEqual(seen.body, {});
});

test("bind asks /bind with the change the run opened", async () => {
  const { seen } = await seenFor((relay) => relay.bind("nav-cart-count"));

  assert.equal(seen.url, `/runs/${TOKEN}/bind`);
  assert.deepEqual(seen.body, { change: "nav-cart-count" });
});

test("land asks /land with the sha, the kind and the artifact", async () => {
  const { seen } = await seenFor((relay) =>
    relay.land({ sha: "abc123", kind: "word", artifact: "ui-design" }),
  );

  assert.equal(seen.url, `/runs/${TOKEN}/land`);
  assert.deepEqual(seen.body, {
    sha: "abc123",
    kind: "word",
    artifact: "ui-design",
  });
});

test("alive is a GET, and its status is the answer", async () => {
  const { seen, result } = await seenFor((relay) => relay.alive(), {
    status: 401,
    body: { reason: "this wake is closed" },
  });

  assert.equal(seen.method, "GET");
  assert.equal(seen.url, `/runs/${TOKEN}/alive`);
  assert.equal(seen.authorization, `Bearer ${TOKEN}`);
  assert.equal(result.status, 401);
  assert.equal(result.body.reason, "this wake is closed");
});

test("a refusal is answered, never thrown: the caller judges the status", async () => {
  const { result } = await seenFor(
    (relay) => relay.land({ sha: "abc", kind: "word", artifact: "specs" }),
    { status: 403, body: { reason: "not this hand's word" } },
  );

  assert.equal(result.status, 403);
  assert.equal(result.body.reason, "not this hand's word");
});

test("a relay nobody can reach is thrown, since no status says so", async () => {
  const wake = readWake(wakeRoot("http://127.0.0.1:1"));

  await assert.rejects(() => relayOf(wake).done());
});
