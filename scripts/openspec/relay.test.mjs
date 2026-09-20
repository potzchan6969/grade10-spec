import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { planningSchema } from "./lib/perspectives.mjs";
import {
  CONFIRM_LABEL,
  confirmOf,
  RELAY_FILE,
  readWake,
  relayOf,
} from "./lib/relay.mjs";
import { stubRelay, urlOf } from "./test/stub-relay.mjs";

/**
 * The one client of the relay: the wake's own file, and the five calls a run
 * makes on it. A `node:http` stub stands in for the relay, so what each test
 * reads is the request itself — its method, its path, its headers and its
 * body — rather than a mock of `fetch`.
 *
 * The loud failures run in a child, as an entry point reads them: `readWake`
 * throws rather than exiting, and the child prints the message and exits 1 the
 * way `relay-post.mjs`, `plan-land.mjs` and `reread-guard.mjs` each do.
 */

const ROOT = join(import.meta.dirname, "..", "..");
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

/** `readWake` in a child that reports a thrown refusal the way every entry
 * point of it does: the message alone, and exit 1. */
const readWakeIn = (root, env = {}) =>
  spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { readWake } from ${JSON.stringify(LIB)};
       try {
         console.log(JSON.stringify(readWake(${JSON.stringify(root)})));
       } catch (cause) {
         console.error(cause.message);
         process.exit(1);
       }`,
    ],
    { encoding: "utf8", env: { ...process.env, ...env } },
  );

// ── The wake's file ─────────────────────────────────────────────────────────

test("shared-planning-agent-rounds-SC-74 - readWake answers nothing where there is no wake: a terminal round", () => {
  assert.equal(readWake(bareRoot()), null);
});

test("shared-planning-agent-rounds-SC-74 - readWake reads the url, the token, the change, the sender and the thread", () => {
  const wake = readWake(wakeRoot("https://relay.test/"));

  // The trailing slash goes: every path the client builds opens with one.
  assert.equal(wake.url, "https://relay.test");
  assert.equal(wake.token, TOKEN);
  assert.equal(wake.change, "demo-change");
  assert.equal(wake.sender.handle, "dana");
  assert.deepEqual(wake.thread, { channel: "C1", ts: "1.1" });
  assert.equal(wake.messages.length, 1);
});

test("shared-planning-agent-rounds-SC-74 - ROUND_WAKE=relay with no file fails loudly, naming the file", () => {
  const result = readWakeIn(bareRoot(), { ROUND_WAKE: "relay" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.round\/relay\.json/);
  assert.match(result.stderr, /ROUND_WAKE=relay/);
  assert.equal(result.stderr.trim().split("\n").length, 1);
});

test("shared-planning-agent-rounds-SC-74 - a wake's file that is not JSON fails loudly, naming the file", () => {
  const result = readWakeIn(wakeRoot("https://relay.test", "{ not json"));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.round\/relay\.json is not JSON/);
  assert.equal(result.stderr.trim().split("\n").length, 1);
});

test("shared-planning-agent-rounds-SC-74 - a wake's file naming no url and token fails loudly", () => {
  const result = readWakeIn(
    wakeRoot("https://relay.test", JSON.stringify({ change: "demo-change" })),
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /names no relay\.url and relay\.token/);
});

// ── The calls ───────────────────────────────────────────────────────────────

/** Every call's request, read off the stub: the method, the path, the headers
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

test("shared-planning-agent-rounds-SC-74 - post asks /post with the text, the wake's token riding the path", async () => {
  const { seen, result } = await seenFor((relay) => relay.post("one line"));

  assert.equal(seen.method, "POST");
  assert.equal(seen.url, `/runs/${TOKEN}/post`);
  // The path carries the token and the relay verifies it there, so no call
  // bears it twice: a header nothing reads is a token in one more log.
  assert.equal(seen.authorization, undefined);
  assert.deepEqual(seen.body, { text: "one line" });
  assert.equal(result.status, 200);
});

test("post asks /post with the button the round wrote", async () => {
  const { seen } = await seenFor((relay) =>
    relay.post("your word on the proposal", {
      label: "Confirm proposal",
      word: "land",
    }),
  );

  assert.equal(seen.url, `/runs/${TOKEN}/post`);
  assert.deepEqual(seen.body, {
    text: "your word on the proposal",
    confirm: { label: "Confirm proposal", word: "land" },
  });
});

test("shared-planning-agent-rounds-SC-74 - done asks /done with an empty body", async () => {
  const { seen } = await seenFor((relay) => relay.done());

  assert.equal(seen.url, `/runs/${TOKEN}/done`);
  assert.deepEqual(seen.body, {});
  assert.equal(seen.authorization, undefined);
});

test("shared-planning-agent-rounds-SC-74 - bind asks /bind with the change the run opened", async () => {
  const { seen } = await seenFor((relay) => relay.bind("nav-cart-count"));

  assert.equal(seen.url, `/runs/${TOKEN}/bind`);
  assert.deepEqual(seen.body, { change: "nav-cart-count" });
});

test("shared-planning-agent-rounds-SC-73 - land asks /land with the sha, the kind and the artifact", async () => {
  const { seen } = await seenFor((relay) =>
    relay.land({ sha: "abc123", kind: "word", artifact: "ui-design" }),
  );

  assert.equal(seen.url, `/runs/${TOKEN}/land`);
  assert.equal(seen.authorization, undefined);
  assert.deepEqual(seen.body, {
    sha: "abc123",
    kind: "word",
    artifact: "ui-design",
  });
});

test("shared-planning-agent-rounds-SC-74 - alive is a GET, and its status is the answer", async () => {
  const { seen, result } = await seenFor((relay) => relay.alive(), {
    status: 401,
    body: { reason: "this wake is closed" },
  });

  assert.equal(seen.method, "GET");
  assert.equal(seen.url, `/runs/${TOKEN}/alive`);
  assert.equal(seen.authorization, undefined);
  assert.equal(result.status, 401);
  assert.equal(result.body.reason, "this wake is closed");
});

test("shared-planning-agent-rounds-SC-73 - a refusal is answered, never thrown: the caller judges the status", async () => {
  const { result } = await seenFor(
    (relay) => relay.land({ sha: "abc", kind: "word", artifact: "specs" }),
    { status: 403, body: { reason: "not this hand's word" } },
  );

  assert.equal(result.status, 403);
  assert.equal(result.body.reason, "not this hand's word");
});

test("shared-planning-agent-rounds-SC-74 - a relay nobody can reach is thrown, since no status says so", async () => {
  const wake = readWake(wakeRoot("http://127.0.0.1:1"));

  await assert.rejects(() => relayOf(wake).done());
});

// ── The button's words ─────────────────────────────────────────────

test("every artifact of the chain has a label, and its word is land", () => {
  // The chain is the schema's, read the way every other reader of it reads:
  // a ninth artifact lands with no button and `--confirm` refuses its name,
  // which is this assertion and not a second list.
  assert.deepEqual(
    Object.keys(CONFIRM_LABEL),
    planningSchema(ROOT).artifacts.map((one) => one.id),
  );
  for (const [artifact, label] of Object.entries(CONFIRM_LABEL)) {
    assert.deepEqual(confirmOf(artifact), { label, word: "land" });
  }
  // One hand's three artifacts share one button, so a product manager never
  // confirms the proposal twice; the Specified stage's button is the one that
  // says requirements.
  assert.equal(CONFIRM_LABEL.decisions, "Confirm proposal");
  assert.equal(CONFIRM_LABEL["user-journeys"], "Confirm proposal");
  assert.equal(CONFIRM_LABEL.specs, "Confirm requirements");
  assert.equal(CONFIRM_LABEL["test-cases"], "Confirm requirements");
});

test("a task group's button names the group, and a name the chain does not issue has none", () => {
  assert.deepEqual(confirmOf("2"), { label: "Confirm group 2", word: "land" });
  assert.deepEqual(confirmOf("10"), {
    label: "Confirm group 10",
    word: "land",
  });
  assert.equal(confirmOf("rounds"), null);
  assert.equal(confirmOf(""), null);
  assert.equal(confirmOf(undefined), null);
});

test("a group is the same group however the round spells it", () => {
  // The store issues four spellings of a group and `roundArtifactOf` reads
  // them all, so a round that writes `group 5` in its row asks for the same
  // button as one that writes `5`.
  const group = { label: "Confirm group 5", word: "land" };
  assert.deepEqual(confirmOf("5"), group);
  assert.deepEqual(confirmOf("5."), group);
  assert.deepEqual(confirmOf("group 5"), group);
  assert.deepEqual(confirmOf("Group 5"), group);
  assert.deepEqual(confirmOf(" group 5 "), group);
  // A task and the round's own `apply` are not a group: each is refused by
  // name rather than posted as a button for the group it sits in.
  assert.equal(confirmOf("5.13"), null);
  assert.equal(confirmOf("apply"), null);
});

test("a held row's button confirms the recommendations", () => {
  const held = {
    label: "Confirm with recommendations",
    word: "land with recommendations",
  };
  assert.deepEqual(confirmOf(undefined, true), held);
  // While a held row is open the label is the row's, whatever artifact the
  // round is on.
  assert.deepEqual(confirmOf("specs", true), held);
});
