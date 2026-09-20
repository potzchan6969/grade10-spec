import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { heldRowsOf, takeRecommendations } from "./lib/held.mjs";
import { BRANCH, CHANGE, DIR, sandbox } from "./test/demo-store.mjs";

/**
 * Two things `plan-land.mjs` gained beside the terminal landing:
 *
 * - the hold (Q59, Q60) — an open `❓ <role> - recommended: <option>` row in
 *   `decisions.md` holds every landing until it is answered or waved through
 * - the relay (Q54, Q55) — a run bound to `.round/relay.json` asks the relay
 *   to move `main` instead of pushing it directly
 *
 * `spawn`, not `spawnSync`: the relay tests below run a `node:http` stub in
 * this same process, and a synchronous child would block the event loop the
 * stub needs to answer it.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));

function run(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [join(SCRIPTS, "plan-land.mjs"), ...args],
      { env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1", ...env } },
    );
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

const recordOf = (root) =>
  readFileSync(join(root, DIR, ".openspec.yaml"), "utf8");
const decisionsOf = (root) =>
  readFileSync(join(root, DIR, "decisions.md"), "utf8");

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

/** `.round/relay.json` as a wake writes it: the sender is who the relay
 * resolved the Slack member to, never a git config lookup. `sender: null` is
 * what the push workflow's own wake carries — no Slack message stands behind
 * it, so no handle does either. */
function writeRelayFile(root, url, sender = "@dana", token = "wake-tok-1") {
  mkdirSync(join(root, ".round"), { recursive: true });
  writeFileSync(
    join(root, ".round", "relay.json"),
    JSON.stringify({
      relay: { url, token },
      change: CHANGE,
      sender: sender === null ? null : { handle: sender },
      thread: { channel: "C1", ts: "1.1" },
    }),
  );
}

const ROW = ["--perspectives", "design,simpler", "--stood", "nothing stood"];

// ── lib/held.mjs, tested without git ────────────────────────────────────────

const TABLE = (decided) =>
  [
    "## Goals",
    "",
    "- One row per round",
    "",
    "## Non-Goals",
    "",
    "- Nothing else",
    "",
    "## Decisions",
    "",
    "| Q | Asked | Decided | Instead of |",
    "| --- | --- | --- | --- |",
    "| Q1 | Who lands it? | The landing | A second file |",
    `| Q2 | How big is the round? | ${decided} | Four readers on every draft |`,
    "",
  ].join("\n");

test("heldRowsOf finds only the row whose Decided cell opens with ❓", () => {
  const markdown = TABLE("❓ pm - recommended: the simpler thing alone");

  const held = heldRowsOf(markdown);

  assert.equal(held.length, 1);
  assert.equal(held[0].id, "Q2");
  assert.equal(held[0].role, "pm");
  assert.equal(held[0].recommendation, "the simpler thing alone");
});

test("heldRowsOf reads a recommendation to the end of the cell, not the row", () => {
  const held = heldRowsOf(
    TABLE(
      "❓ pm - recommended: no - QA reads the plan and the build, so the trio names six",
    ),
  );

  assert.equal(
    held[0].recommendation,
    "no - QA reads the plan and the build, so the trio names six",
  );
});

test("heldRowsOf answers nothing where every row is already decided", () => {
  assert.deepEqual(heldRowsOf(TABLE("The simpler thing alone")), []);
});

test("heldRowsOf stops at the table's own section, never the Raised table below it", () => {
  const markdown = `${TABLE("The landing")}\n## Raised\n\n| Capability | Raised | Landed |\n| --- | --- | --- |\n| demo | ❓ something raised, never decided | Q1 |\n`;

  assert.deepEqual(heldRowsOf(markdown), []);
});

test("takeRecommendations rewrites only the held cell, keeping every other row and column", () => {
  const markdown = TABLE("❓ pm - recommended: the simpler thing alone");

  const rewritten = takeRecommendations(markdown);

  assert.match(
    rewritten,
    /\| Q2 \| How big is the round\? \| the simpler thing alone \| Four readers on every draft \|/,
  );
  assert.match(
    rewritten,
    /\| Q1 \| Who lands it\? \| The landing \| A second file \|/,
  );
  assert.doesNotMatch(rewritten, /❓/);
});

test("takeRecommendations returns the markdown unchanged where nothing is held", () => {
  const markdown = TABLE("The simpler thing alone");

  assert.equal(takeRecommendations(markdown), markdown);
});

// ── SC-72: a held row holds the landing ─────────────────────────────────────

const HELD_DECISIONS = TABLE("❓ pm - recommended: the simpler thing alone");

test("shared-planning-agent-rounds-SC-72 - a held row holds the landing until answered or waved through", async () => {
  const { root } = sandbox({
    files: { [`${DIR}/decisions.md`]: HELD_DECISIONS },
  });

  const refused = await run([
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--dry-run",
    ...ROW,
  ]);

  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /held: Q2/);
  assert.match(refused.stderr, /land with recommendations/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("shared-planning-agent-rounds-SC-72 - land with recommendations takes every held row and stages the rewrite", async () => {
  const { root, git } = sandbox({
    files: { [`${DIR}/decisions.md`]: HELD_DECISIONS },
  });

  const taken = await run([
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--with-recommendations",
    ...ROW,
  ]);

  assert.equal(taken.status, 0, taken.stderr);
  assert.match(taken.stdout, /Q2/);
  assert.match(
    decisionsOf(root),
    /\| Q2 \| How big is the round\? \| the simpler thing alone \| Four readers on every draft \|/,
  );
  assert.doesNotMatch(decisionsOf(root), /❓/);
  // Staged into the landing commit itself, not a commit of its own.
  const landed = git("show", "--stat", "--format=", "HEAD");
  assert.match(landed, /decisions\.md/);
  assert.match(landed, /\.openspec\.yaml/);
});

test("a landing with no held row lands clean, taking nothing as recommended", async () => {
  const { root } = sandbox();

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing is held/);
  assert.doesNotMatch(result.stdout, /as recommended/);
});

test("--reviewed asks nobody's word and is never held by an open row", async () => {
  const { root } = sandbox({
    files: { [`${DIR}/decisions.md`]: HELD_DECISIONS },
  });

  const result = await run([CHANGE, "decisions", "--root", root, "--reviewed"]);

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /held:/);
});

// ── SC-73: a run lands through the relay ────────────────────────────────────

test("shared-planning-agent-rounds-SC-73 - a run lands through the relay, asked with the sha, the kind and the artifact", async () => {
  let seen;
  const server = await stubRelay((req, res, body) => {
    seen = { method: req.method, url: req.url, body: JSON.parse(body) };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ landed: JSON.parse(body).sha }));
  });
  const { root, remote } = sandbox();
  writeRelayFile(root, urlOf(server));
  const beforeMain = execFileSync("git", ["-C", remote, "rev-parse", "main"], {
    encoding: "utf8",
  }).trim();

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.method, "POST");
  assert.equal(seen.url, "/runs/wake-tok-1/land");
  assert.equal(seen.body.kind, "word");
  assert.equal(seen.body.artifact, "ui-design");
  assert.match(result.stdout, /landed/);
  // The branch carries the landing commit; a real relay would move `main`
  // from it, but this stub never touches the bare remote at all.
  const branchSha = execFileSync(
    "git",
    ["-C", remote, "rev-parse", `refs/heads/${BRANCH}`],
    { encoding: "utf8" },
  ).trim();
  assert.equal(seen.body.sha, branchSha);
  const mainAfter = execFileSync("git", ["-C", remote, "rev-parse", "main"], {
    encoding: "utf8",
  }).trim();
  assert.equal(mainAfter, beforeMain);
});

test("shared-planning-agent-rounds-SC-73 - a 409 re-reads main once and retries, then lands", async () => {
  let calls = 0;
  const server = await stubRelay((_req, res, body) => {
    calls += 1;
    if (calls === 1) {
      res.writeHead(409, { "content-type": "application/json" });
      res.end(JSON.stringify({ reason: "not-fast-forward" }));
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ landed: JSON.parse(body).sha }));
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(calls, 2);
  assert.match(result.stdout, /reading it again and retrying/);
  assert.match(result.stdout, /landed/);
});

test("shared-planning-agent-rounds-SC-73 - a 403 stops at once, naming the relay's reason", async () => {
  let calls = 0;
  const server = await stubRelay((_req, res) => {
    calls += 1;
    res.writeHead(403, { "content-type": "application/json" });
    res.end(JSON.stringify({ reason: "not this hand's word" }));
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.equal(calls, 1);
  assert.match(result.stderr, /not this hand's word/);
});

test("relay mode reads the hand from sender.handle, never git config user.email", async () => {
  const server = await stubRelay((_req, res, body) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ landed: JSON.parse(body).sha }));
  });
  const { root, git } = sandbox();
  git("config", "user.email", "nobody@test");
  writeRelayFile(root, urlOf(server), "@dana");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /dana/);
});

test("relay mode refuses a hand the record does not name, the same as a terminal landing", async () => {
  const server = await stubRelay((_req, res) => {
    res.writeHead(200);
    res.end("{}");
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), "@erin");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /@dana/);
  assert.match(result.stderr, /ui-design/);
});

test("relay mode's --as is refused unless it matches the relay's own sender", async () => {
  const server = await stubRelay((_req, res) => {
    res.writeHead(200);
    res.end("{}");
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), "@dana");

  const result = await run([
    CHANGE,
    "ui-design",
    "--root",
    root,
    "--as",
    "@erin",
    ...ROW,
  ]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /erin/);
  assert.match(result.stderr, /dana/);
});

// ── A wake with no word behind it (the push workflow's own) ────────────────

test("a landing wake with sender: null refuses a word landing: nobody said land", async () => {
  const server = await stubRelay((_req, res) => {
    res.writeHead(200);
    res.end("{}");
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), null);

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /nobody said land/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("a landing wake with sender: null still lands a --reviewed read, which asks nobody's word", async () => {
  let seen;
  const server = await stubRelay((_req, res, body) => {
    seen = JSON.parse(body);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ landed: seen.sha }));
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), null);

  const result = await run([CHANGE, "decisions", "--root", root, "--reviewed"]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.kind, "reviewed");
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});
