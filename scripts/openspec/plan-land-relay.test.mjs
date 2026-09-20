import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { contentIdOf } from "../../tools/manual/src/store/content-id.mts";
import { heldIdsOf, takeRecommendations } from "./lib/held.mjs";
import { BRANCH, CHANGE, DIR, PROPOSAL, sandbox } from "./test/demo-store.mjs";
import { answer, stubRelay, urlOf } from "./test/stub-relay.mjs";

/**
 * Three things `plan-land.mjs` gained beside the terminal landing:
 *
 * - the landing commit cut from `main` — one artifact's own files, the record
 *   line, the round's row, the decisions the branch answered and the pages the
 *   proposal links, and none of the drafts the branch holds above it
 * - the hold (Q59, Q60) — an open `❓ <role> - recommended: <option>` row in
 *   `decisions.md` holds every landing until it is answered or waved through
 * - the relay (Q54, Q55) — a run bound to `.round/relay.json` asks its wake
 *   whether it is still the room's own, pushes the landing commit to a side
 *   ref, and asks the relay to move `main` onto it rather than pushing `main`
 *   itself
 *
 * `spawn`, not `spawnSync`: the stub relay runs in this same process, and a
 * synchronous child would block the event loop the stub needs to answer it.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
/** The ref the landing commit is pushed to for the relay to read it: this
 * run's own scratch ref, never the change's branch. */
const SIDE_REF = `refs/heads/claude/${CHANGE}-landing`;

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

/**
 * The relay a landing meets: `GET /alive` answered before anything is cut,
 * and the `POST /land` the test itself judges. Every landing in relay mode
 * asks the first question, so the stub answers it once here rather than in
 * each handler.
 */
function landingRelay(land, alive = 200) {
  return stubRelay((req, res, body) => {
    if (req.url.endsWith("/alive")) {
      answer(
        res,
        alive,
        alive === 200 ? { alive: true } : { reason: "closed" },
      );
      return;
    }
    land(req, res, body);
  });
}

/** The landing asked for and granted: the sha the relay was given. */
const granted = (seen) => (_req, res, body) => {
  Object.assign(seen, JSON.parse(body));
  answer(res, 200, { landed: seen.sha });
};

const ROW = ["--perspectives", "design,simpler", "--stood", "nothing stood"];

/** The branch as a wake leaves it: the artifact about to land redrawn, and
 * the next one after it drafted ahead and landed nowhere (`Q58`). Returns the
 * store, so a test reads `main`, `L` and the branch off the same fixture. */
function draftedAhead(files = {}) {
  const made = sandbox({ files });
  const { root, git } = made;
  writeFileSync(
    join(root, DIR, "ui-design.md"),
    "## Screens\n\nTwo screens, and a state each.\n",
  );
  writeFileSync(
    join(root, DIR, "tech-design.md"),
    "## Decisions\n\nThe drafted decision, waiting on the engineer.\n",
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "draft the design and the tech design ahead");
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);
  return made;
}

/** One file as a commit holds it. */
const textAt = (repo, commit, path) =>
  execFileSync("git", ["-C", repo, "show", `${commit}:${path}`], {
    encoding: "utf8",
  });

const shaOf = (repo, ref) =>
  execFileSync("git", ["-C", repo, "rev-parse", ref], {
    encoding: "utf8",
  }).trim();

/** Whether a remote holds a ref at all — what the side ref is read by after
 * the relay has answered. */
const holds = (repo, ref) =>
  execFileSync(
    "git",
    ["-C", repo, "for-each-ref", "--format=%(refname)", ref],
    {
      encoding: "utf8",
    },
  ).trim() !== "";

// ── The landing commit, cut from main ───────────────────────────────────────

test("shared-planning-agent-rounds-SC-04 - the landing commit carries the artifact that landed and not the draft above it", async () => {
  const { root, remote } = draftedAhead();
  const before = shaOf(remote, "main");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);

  assert.equal(result.status, 0, result.stderr);
  // `main` moved as a plain fast-forward onto the landing commit, which was
  // cut from the `main` this run read.
  const landing = shaOf(remote, "main");
  assert.equal(shaOf(remote, `${landing}^`), before);
  // The tree of `L`: the design as the branch drew it, the tech design as
  // `main` still holds it.
  assert.match(
    textAt(remote, landing, `${DIR}/ui-design.md`),
    /Two screens, and a state each/,
  );
  assert.match(
    textAt(remote, landing, `${DIR}/tech-design.md`),
    /^## Decisions\n\nThe one decision\.\n$/,
  );
  assert.match(
    textAt(remote, landing, `${DIR}/.openspec.yaml`),
    /ui-design: dana/,
  );
  assert.match(
    textAt(remote, landing, `${DIR}/rounds.md`),
    /\| 1 \| ui-design \|/,
  );
  // And the branch still holds the draft, sitting above the landing.
  assert.match(
    textAt(remote, `refs/heads/${BRANCH}`, `${DIR}/tech-design.md`),
    /waiting on the engineer/,
  );
  assert.equal(
    shaOf(remote, `refs/heads/${BRANCH}~0`) === landing,
    false,
    "the branch is the landing plus the draft above it",
  );
  assert.ok(
    execFileSync(
      "git",
      [
        "-C",
        remote,
        "merge-base",
        "--is-ancestor",
        landing,
        `refs/heads/${BRANCH}`,
      ],
      { encoding: "utf8" },
    ) === "",
  );
});

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

test("heldIdsOf finds only the row whose Decided cell opens with ❓", () => {
  const markdown = TABLE("❓ pm - recommended: the simpler thing alone");

  assert.deepEqual(heldIdsOf(markdown), ["Q2"]);
});

test("heldIdsOf answers nothing where every row is already decided", () => {
  assert.deepEqual(heldIdsOf(TABLE("The simpler thing alone")), []);
});

test("heldIdsOf refuses a held row it cannot take, naming the row", () => {
  // A ❓ cell the question reader cannot route — no role by the grammar — and
  // one it can route but that recommends nothing: both are rows a landing
  // with recommendations would silently leave held.
  assert.throws(() => heldIdsOf(TABLE("❓ something nobody decided")), /Q2/);
  assert.throws(
    () => heldIdsOf(TABLE("❓ pm - the simpler thing alone")),
    /Q2/,
  );
});

test("heldIdsOf stops at the table's own section, never the Raised table below it", () => {
  // The Raised row is a `Q<n>` in its first cell with a ❓ in its third: the
  // shape of a held row, in a section the reader never reads.
  const markdown = `${TABLE("The landing")}\n## Raised\n\n| Q | Capability | Raised | Landed |\n| --- | --- | --- | --- |\n| Q9 | demo | ❓ pm - recommended: a second file | |\n`;

  assert.deepEqual(heldIdsOf(markdown), []);
  assert.equal(takeRecommendations(markdown), markdown);
});

test("takeRecommendations rewrites only the held cell, keeping every other row and column", () => {
  const markdown = TABLE("❓ pm - recommended: the simpler thing alone");

  const rewritten = takeRecommendations(markdown);

  // The row reads as answered, and says by whom: nobody's word settled it,
  // the round took the option it recommended (Q60).
  assert.match(
    rewritten,
    /\| Q2 \| How big is the round\? \| the simpler thing alone - decided by the round \| Four readers on every draft \|/,
  );
  assert.match(
    rewritten,
    /\| Q1 \| Who lands it\? \| The landing \| A second file \|/,
  );
  assert.doesNotMatch(rewritten, /❓/);
});

test("takeRecommendations takes a cell once: a second pass changes nothing", () => {
  const once = takeRecommendations(
    TABLE("❓ pm - recommended: the one option"),
  );

  assert.equal(takeRecommendations(once), once);
});

test("takeRecommendations returns the markdown unchanged where nothing is held", () => {
  const markdown = TABLE("The simpler thing alone");

  assert.equal(takeRecommendations(markdown), markdown);
});

// ── SC-72: two held rows hold the landing ───────────────────────────────────

/** The two rows the scenario names, both held on the product manager. */
const HELD_DECISIONS = [
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
  "| Q1 | Who lands it? | ❓ pm - recommended: the landing itself | A second file |",
  "| Q2 | How big is the round? | ❓ pm - recommended: the simpler thing alone | Four readers on every draft |",
  "",
].join("\n");

/** The same table with both rows answered by hand, which is what the hand's
 * own edit leaves on the branch. */
const ANSWERED = HELD_DECISIONS.replace(/❓ pm - recommended: /g, "").replace(
  "the landing itself",
  "The landing itself",
);

test("shared-planning-agent-rounds-SC-72 - two held rows hold the landing, and the refusal names both", async () => {
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
  assert.match(refused.stderr, /held: Q1, Q2/);
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
  assert.match(taken.stdout, /Q1, Q2/);
  // Both cells rewritten, each with the option its own row recommended.
  assert.match(
    decisionsOf(root),
    /\| Q1 \| Who lands it\? \| the landing itself - decided by the round \| A second file \|/,
  );
  assert.match(
    decisionsOf(root),
    /\| Q2 \| How big is the round\? \| the simpler thing alone - decided by the round \| Four readers on every draft \|/,
  );
  assert.doesNotMatch(decisionsOf(root), /❓/);
  // Staged into the landing commit itself, not a commit of its own.
  const landed = git("show", "--stat", "--format=", "HEAD");
  assert.match(landed, /decisions\.md/);
  assert.match(landed, /\.openspec\.yaml/);
});

test("shared-planning-agent-rounds-SC-72 - the same word lands once both rows are answered", async () => {
  const { root, git } = sandbox({
    files: { [`${DIR}/decisions.md`]: HELD_DECISIONS },
  });
  const argv = [CHANGE, "ui-design", "--root", root, ...ROW];

  const refused = await run(argv);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /held: Q1, Q2/);

  // The hand answers both rows on the branch, and the identical word lands —
  // no flag, nothing taken as recommended.
  writeFileSync(join(root, DIR, "decisions.md"), ANSWERED);
  git("add", "-A");
  git("commit", "--quiet", "-m", "answer Q1 and Q2");

  const landed = await run(argv);

  assert.equal(landed.status, 0, landed.stderr);
  assert.match(landed.stdout, /nothing is held/);
  assert.doesNotMatch(landed.stdout, /as recommended/);
  assert.match(recordOf(root), /landed_by:\n\s+ui-design: dana/);
});

test("shared-planning-agent-rounds-SC-72 - land with recommendations reads the drafts after the decisions again against the rows it took", async () => {
  // The drafts above the decisions were drawn from those recommendations, so
  // the same commit that answers the rows records them as read again against
  // them and nothing goes behind (Q60).
  const { root, remote } = draftedAhead({
    [`${DIR}/decisions.md`]: HELD_DECISIONS,
  });

  const taken = await run([
    CHANGE,
    "decisions",
    "--root",
    root,
    "--with-recommendations",
    "--perspectives",
    "verifier",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(taken.status, 0, taken.stderr);
  const record = textAt(remote, "main", `${DIR}/.openspec.yaml`);
  assert.match(record, /landed_by:\n\s+decisions: dana/);
  assert.match(
    record,
    /reviewed:\n(?:\s+\S+: [0-9a-f]{8}\n)*\s+ui-design: [0-9a-f]{8}/,
  );
  assert.match(record, /\s+tech-design: [0-9a-f]{8}/);
  // `tasks` is not drafted on this branch: nothing to read again, no line.
  assert.doesNotMatch(record, /\s+tasks: [0-9a-f]{8}/);
  assert.match(taken.stdout, /read again against Q1, Q2/);
});

test("shared-planning-agent-rounds-SC-72 - the reviewed: ids are the branch's own texts, not the drafts main still holds", async () => {
  // Every draft above the decisions is on the branch, `tasks` included, and
  // `main` holds an older text of each. The id `tasks` is read again against
  // is computed from what the branch drew it from — the recommendations as
  // this landing writes them and the drafts beside them — never from the
  // landing commit's tree, which carries `main`'s drafts of everything the
  // landing does not itself land.
  const UI = "## Screens\n\nTwo screens, and a state each.\n";
  const TECH =
    "## Decisions\n\nThe drafted decision, waiting on the engineer.\n";
  const TASKS =
    "## 1. Build it (grade10-spec)\n\n- [ ] 1.1 Ship it, and say so\n";
  const { root, remote, git } = draftedAhead({
    [`${DIR}/decisions.md`]: HELD_DECISIONS,
  });
  writeFileSync(join(root, DIR, "tasks.md"), TASKS);
  git("add", "-A");
  git("commit", "--quiet", "-m", "draft the plan ahead too");
  git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);

  const taken = await run([
    CHANGE,
    "decisions",
    "--root",
    root,
    "--with-recommendations",
    "--perspectives",
    "verifier",
    "--stood",
    "nothing stood",
  ]);

  assert.equal(taken.status, 0, taken.stderr);
  const record = textAt(remote, "main", `${DIR}/.openspec.yaml`);
  // `tasks`' upstream, in the schema's order: the proposal, the decisions as
  // the landing answers them, then the two drafts above them.
  const branchId = contentIdOf([
    PROPOSAL,
    takeRecommendations(HELD_DECISIONS),
    UI,
    TECH,
  ]);
  const landingTreeId = contentIdOf([
    PROPOSAL,
    takeRecommendations(HELD_DECISIONS),
    "## Screens\n\nThe one screen.\n",
    "## Decisions\n\nThe one decision.\n",
  ]);
  assert.notEqual(branchId, landingTreeId);
  assert.match(record, new RegExp(`\\s+tasks: ${branchId}`));
  assert.doesNotMatch(record, new RegExp(`\\s+tasks: ${landingTreeId}`));
});

test("a wake was expected and no relay.json is there: the landing fails loudly", async () => {
  const { root } = sandbox();

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW], {
    ROUND_WAKE: "relay",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\.round\/relay\.json/);
  assert.match(result.stderr, /ROUND_WAKE=relay/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
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

// ── What the landing carries beside the artifact ─────────────────────────────

test("shared-planning-agent-rounds-SC-04 - the landing carries the decisions the branch answered, whatever artifact it lands", async () => {
  // Nothing was held: the branch answered the rows itself, and the landing of
  // the artifact above them carries that answer rather than leaving `main`
  // with a question the branch settled.
  const { root, remote, git } = sandbox({
    files: { [`${DIR}/decisions.md`]: HELD_DECISIONS },
  });
  writeFileSync(join(root, DIR, "decisions.md"), ANSWERED);
  git("add", "-A");
  git("commit", "--quiet", "-m", "answer both rows");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    textAt(remote, "main", `${DIR}/decisions.md`),
    /\| Q1 \| Who lands it\? \| The landing itself \|/,
  );
});

test("shared-planning-agent-rounds-SC-73 - the landing carries a page the proposal links and leaves one it does not", async () => {
  const PAGE = "docs/prds/products/demo-product/index.md";
  const UNLINKED = "docs/prds/index.md";
  const { root, remote, git } = sandbox({
    files: {
      [`${DIR}/proposal.md`]: `${PROPOSAL}\nThe page it marks: [Demo product](../../../${PAGE}).\n`,
    },
  });
  writeFileSync(
    join(root, PAGE),
    "---\ntitle: Demo product\n---\n\nThe landing, and the line the round wrote.\n",
  );
  writeFileSync(
    join(root, UNLINKED),
    "---\ntitle: Demo\n---\n\nA demo store, rewritten by the wrong round.\n",
  );
  git("add", "-A");
  git("commit", "--quiet", "-m", "mark the page, and reach past it");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);

  assert.equal(result.status, 0, result.stderr);
  // The page the proposal links is in the landing commit; the page nothing
  // links stays as `main` holds it, the same set the guard holds a push to.
  assert.match(textAt(remote, "main", PAGE), /the line the round wrote/);
  assert.doesNotMatch(textAt(remote, "main", UNLINKED), /wrong round/);
});

// ── SC-73: a run lands through the relay ────────────────────────────────────

test("shared-planning-agent-rounds-SC-73 - a run lands through the relay, asked with the sha, the kind and the artifact", async () => {
  let seen;
  const server = await landingRelay((req, res, body) => {
    seen = { method: req.method, url: req.url, body: JSON.parse(body) };
    answer(res, 200, { landed: JSON.parse(body).sha });
  });
  const { root, remote } = sandbox();
  writeRelayFile(root, urlOf(server));
  const beforeMain = shaOf(remote, "main");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.method, "POST");
  assert.equal(seen.url, "/runs/wake-tok-1/land");
  assert.equal(seen.body.kind, "word");
  assert.equal(seen.body.artifact, "ui-design");
  assert.match(result.stdout, /landed/);
  // A real relay would move `main` from the sha it was given; this stub never
  // touches the bare remote at all.
  const mainAfter = shaOf(remote, "main");
  assert.equal(mainAfter, beforeMain);
});

test("shared-planning-agent-rounds-SC-73 - the sha a wake asks the relay to land is cut from main, with no draft above it", async () => {
  const seen = {};
  const server = await landingRelay(granted(seen));
  const { root, remote } = draftedAhead();
  writeRelayFile(root, urlOf(server));
  const before = shaOf(remote, "main");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  // The relay is asked about a commit sitting directly on the `main` this run
  // read, carrying the design that landed and not the tech design drafted
  // above it — the relay's own fast-forward is all that is left to do.
  assert.equal(shaOf(remote, `${seen.sha}^`), before);
  assert.match(
    textAt(remote, seen.sha, `${DIR}/ui-design.md`),
    /Two screens, and a state each/,
  );
  assert.match(
    textAt(remote, seen.sha, `${DIR}/tech-design.md`),
    /^## Decisions\n\nThe one decision\.\n$/,
  );
  // The branch this run pushed carries the draft, above that same commit.
  assert.match(
    textAt(remote, `refs/heads/${BRANCH}`, `${DIR}/tech-design.md`),
    /waiting on the engineer/,
  );
});

test("shared-planning-agent-rounds-SC-73 - the relay reads the landing off a side ref, and the branch moves only after it", async () => {
  let during;
  const { root, remote } = draftedAhead();
  const branchBefore = shaOf(remote, `refs/heads/${BRANCH}`);
  const server = await landingRelay((_req, res, body) => {
    const { sha } = JSON.parse(body);
    // What the remote holds while the relay is being asked: the landing
    // commit on a side ref of its own, and the branch untouched.
    during = {
      sha,
      side: shaOf(remote, SIDE_REF),
      branch: shaOf(remote, `refs/heads/${BRANCH}`),
    };
    answer(res, 200, { landed: sha });
  });
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(during.side, during.sha);
  assert.equal(during.branch, branchBefore);
  // The side ref is this run's own scratch: gone once the relay has answered,
  // and the branch rebased onto the landing afterwards.
  assert.equal(holds(remote, SIDE_REF), false);
  assert.notEqual(shaOf(remote, `refs/heads/${BRANCH}`), branchBefore);
});

test("shared-planning-agent-rounds-SC-73 - a side ref that will not push stops the landing, and nothing is cut again", async () => {
  let asked = 0;
  const { root, remote } = draftedAhead();
  const branchBefore = shaOf(remote, `refs/heads/${BRANCH}`);
  const server = await landingRelay((_req, res, body) => {
    asked += 1;
    answer(res, 200, { landed: JSON.parse(body).sha });
  });
  writeRelayFile(root, urlOf(server));
  // A ref of its own under the side ref's name: git cannot create
  // `…-landing` while `…-landing/held` exists. The push it refuses is this
  // run's own scratch ref, which no other run races it for — so there is
  // nothing to read again and nothing to retry.
  execFileSync("git", [
    "-C",
    remote,
    "update-ref",
    `${SIDE_REF}/held`,
    shaOf(remote, "main"),
  ]);

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /the landing's side ref/);
  assert.match(result.stderr, new RegExp(SIDE_REF));
  assert.equal(asked, 0, "the relay was never asked to move main");
  assert.doesNotMatch(result.stdout, /retrying/);
  assert.equal(shaOf(remote, `refs/heads/${BRANCH}`), branchBefore);
});

test("shared-planning-agent-rounds-SC-73 - a 409 re-reads main once and cuts the second landing from the main that moved", async () => {
  const asked = [];
  const server = await landingRelay((_req, res, body) => {
    const { sha } = JSON.parse(body);
    asked.push(sha);
    if (asked.length === 1) {
      answer(res, 409, { reason: "not-fast-forward" });
      return;
    }
    answer(res, 200, { landed: sha });
  });
  const { root, remote } = sandbox();
  writeRelayFile(root, urlOf(server));
  // A rival landing that moves `main` under the first ask, driven the way the
  // terminal races are: the hook runs once, just before this run's own push.
  const rival = mkdtempSync(join(tmpdir(), "relay-rival-"));
  execFileSync("git", ["clone", "--quiet", remote, rival]);
  const flag = join(mkdtempSync(join(tmpdir(), "relay-flag-")), "fired");
  const hook = [
    `if [ -f ${flag} ]; then exit 0; fi`,
    `touch ${flag}`,
    `git -C ${rival} -c user.email=erin@test -c user.name=erin commit --quiet --allow-empty -m "an unrelated landing"`,
    `git -C ${rival} push --quiet origin HEAD:refs/heads/main`,
  ].join(" && ");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW], {
    PLAN_LAND_RACE: hook,
  });
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(asked.length, 2);
  assert.match(result.stdout, /reading it again and retrying/);
  // The second sha sits on the `main` that moved, not on the one this run
  // first read.
  assert.equal(shaOf(remote, `${asked[1]}^`), shaOf(remote, "main"));
  assert.notEqual(asked[0], asked[1]);
});

test("shared-planning-agent-rounds-SC-73 - a 403 stops at once, naming the relay's reason and leaving the branch where it was", async () => {
  let calls = 0;
  const { root, remote } = draftedAhead();
  const branchBefore = shaOf(remote, `refs/heads/${BRANCH}`);
  const server = await landingRelay((_req, res) => {
    calls += 1;
    answer(res, 403, { reason: "not-the-hand" });
  });
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.equal(calls, 1);
  assert.match(result.stderr, /403/);
  // The check that refused, in words rather than as the relay's own token,
  // naming the artifact the word was for - `relay-refusal.test.mjs` holds
  // the sentence for every check.
  assert.match(result.stderr, /the word was not the hand's/);
  assert.match(result.stderr, /ui-design/);
  assert.doesNotMatch(result.stderr, /^not-the-hand$/m);
  // Nothing of the branch moved, and the side ref is gone.
  assert.equal(shaOf(remote, `refs/heads/${BRANCH}`), branchBefore);
  assert.equal(holds(remote, SIDE_REF), false);
});

test("shared-planning-agent-rounds-SC-73 - a status the relay gives for no reason stops the run, naming it", async () => {
  const server = await landingRelay((_req, res) => {
    answer(res, 500, {});
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /500/);
  assert.doesNotMatch(result.stdout, /retrying/);
});

test("shared-planning-agent-rounds-SC-73 - a wake the relay has closed lands nothing, and cuts nothing", async () => {
  const { root, remote } = sandbox();
  const before = shaOf(remote, "main");
  const server = await landingRelay(() => {
    throw new Error("the relay should never have been asked to land");
  }, 401);
  writeRelayFile(root, urlOf(server));

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /401/);
  assert.equal(result.stderr.trim().split("\n").length, 1);
  assert.equal(shaOf(remote, "main"), before);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("relay mode reads the hand from sender.handle, never git config user.email", async () => {
  const seen = {};
  const server = await landingRelay(granted(seen));
  const { root, git } = sandbox();
  git("config", "user.email", "nobody@test");
  writeRelayFile(root, urlOf(server), "@dana");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /dana/);
});

test("relay mode refuses a hand the record does not name, the same as a terminal landing", async () => {
  const server = await landingRelay((_req, res) => answer(res, 200));
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), "@erin");

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /@dana/);
  assert.match(result.stderr, /ui-design/);
});

test("relay mode's --as is refused unless it matches the relay's own sender", async () => {
  const server = await landingRelay((_req, res) => answer(res, 200));
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
  const server = await landingRelay((_req, res) => answer(res, 200));
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), null);

  const result = await run([CHANGE, "ui-design", "--root", root, ...ROW]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /nobody said land/);
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});

test("shared-planning-agent-rounds-SC-77 - a landing wake with sender: null still lands a --reviewed read, which asks nobody's word", async () => {
  const seen = {};
  const server = await landingRelay(granted(seen));
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server), null);

  const result = await run([CHANGE, "decisions", "--root", root, "--reviewed"]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.kind, "reviewed");
  assert.doesNotMatch(recordOf(root), /landed_by:/);
});
