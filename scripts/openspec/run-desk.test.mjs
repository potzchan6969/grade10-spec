/*
 * The run sheet's side of the release phases and the run desk
 * (docs/prds/products/shared/planning/release-phases.md): selecting by phase
 * through the manual's own unit reader, the RunSpec a confirmed selection
 * opens on the desk, re-running a run's failed and blocked rows, and the
 * print commit of a desk run with its check against the desk.
 */
import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { handle } from "../../tools/run-desk/src/http.ts";
import { aCase, aSpec, deskInMemory } from "../../tools/run-desk/test/desk.ts";
import {
  checkPrintedRuns,
  deskAccess,
  deskRunOf,
  parsePrintCommit,
  printCommitMessage,
  printedRunOf,
} from "./lib/printed-run-message.mjs";
import { deskSourceAt, rerunSpecOf } from "./lib/run-desk.mjs";
import { selectionSnapshot } from "./lib/run-sheet-records.mjs";
import { runSpecOf } from "./lib/run-spec.mjs";
import {
  inReadingOrder,
  selectCases,
  unitSelection,
} from "./lib/select-cases.mjs";
import { commitDeskRun, deskRunBranch } from "./run-sheet-record.mjs";

const PHASES = `phases:
  - id: store-launch-1
    name: Store Launch 1
    env: staging-2
  - id: store-launch-2
    name: Store Launch 2
    env: staging-1
`;

const CART = `---
title: Cart Drawer
spec: grade10-site/store/cart-drawer
---

The drawer over the page.

## Reviewing the Cart

::phase{id="store-launch-1" priority="P0"}

::phase{id="store-launch-2" priority="P1" rules="empty"}

- **Opening** — the drawer opens over the page
- **Empty** — an empty cart says so

## Points

::phase{id="store-launch-1" priority="P1"}

- **Use Max** — the ceiling
`;

const WIDGET = `---
title: Widget
spec: demo/thing/widget
---

::phase{id="store-launch-1" priority="P1"}

## Reading

- **Read** — a collector reads the lot

## Later

::phase{id="store-launch-2" priority="P2"}

- **Bid** — a collector bids
`;

const classification = ({ status = "actual", trace, testability = "manual" }) =>
  `**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** ${status}
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** ${testability}
* **Trace:** ${trace}
`;

const STORE = `# grade10-site/store/cart Test Cases

**Status:** pending-review · 2/3

## Background

**Shared test data:**

| Field | Value |
| --- | --- |
| \`<listing url>\` | \`<g10url>/store/collections\` |
| \`<product A>\` | a booster box for sale at HKD880 |

## Walk 1: Open the cart and read it

**Starting state:**

- customer on \`<listing url>\` with \`<product A>\` in the cart

### Route

1. Select Cart.
   - The drawer over the page \`g10.store-cart.TC1\`
2. Remove the line.
   - The empty message \`g10.store-cart.TC2\`

## cart#reviewing-the-cart: Reviewing the Cart

<!-- trace:case id=g10.store-cart.TC-q5a rev=3 -->
### g10.store-cart.TC1: The cart opens over the page

Runs once per row of **Test data**.

${classification({ trace: "cart#reviewing-the-cart/opening", testability: "automation, manual" })}
**Pre-conditions:**

* customer is on the row's page.

**Test data:**

| Page | Lines |
| --- | --- |
| \`<listing url>\` | one |
| the auction listings page | six |

**Steps:**

1. Select Cart.
2. Scroll the lines.

**Expected Results:**

* Step 1 opens the drawer over the row's page.
* The row's lines, scrolled to the end.

### g10.store-cart.TC2: An empty cart says so

${classification({ trace: "cart#reviewing-the-cart/empty" })}
**Steps:**

1. Open Cart with no lines.

**Expected Results:**

* The empty message shows.

## cart#points: Points

### g10.store-cart.TC3: Use Max takes the ceiling

${classification({ status: "draft", trace: "cart#points/use-max" })}
**Steps:**

1. Select Use max.

**Expected Results:**

* The points row at the ceiling.
`;

const FEATURE = `# demo/thing/widget Test Cases

## demo.thing.US1: A collector reads

**As a** collector,
**I want** to read the lot,
**so that** I know what I bid on.

<!-- trace:case id=demo.thing.TC-abc rev=2 -->
### demo.thing.US1-TC1: Read the lot

${classification({ trace: "demo-thing-widget-US-01" })}
**Steps:**

1. Open the lot.

**Expected Results:**

* The lot is visible.

<!-- trace:case id=demo.thing.TC-def rev=1 -->
### demo.thing.US1-TC2: Read a closed lot

${classification({ trace: "demo-thing-widget-US-01" })}
**Steps:**

1. Open a closed lot.

**Expected Results:**

* The lot reads closed.
`;

const FILES = {
  "docs/prds/phases.yaml": PHASES,
  "docs/prds/products/grade10-site/store/cart.md": CART,
  "docs/prds/products/grade10-site/store/tests/cart-tcs.md": STORE,
  "docs/prds/products/demo/widget.md": WIDGET,
  "openspec/specs/demo/thing/widget/feature-tcs.md": FEATURE,
};

const git = (root, args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

function repo(t) {
  const dir = mkdtempSync(join(tmpdir(), "run-desk-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const root = join(dir, "repo");
  const origin = join(dir, "origin.git");
  mkdirSync(root);
  execFileSync("git", ["init", "--bare", "-b", "main", origin], {
    stdio: "pipe",
  });
  execFileSync("git", ["init", "-b", "main", root], { stdio: "pipe" });
  git(root, ["config", "user.email", "test@example.com"]);
  git(root, ["config", "user.name", "Run desk test"]);
  for (const [path, text] of Object.entries(FILES)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  git(root, ["add", "."]);
  git(root, ["commit", "-q", "-m", "test: source"]);
  git(root, ["remote", "add", "origin", origin]);
  execFileSync("git", ["push", "-q", "-u", "origin", "main"], {
    cwd: root,
    stdio: "pipe",
  });
  return { root, sha: git(root, ["rev-parse", "HEAD"]) };
}

const ids = (source, options) =>
  source.candidates
    .filter(unitSelection(source.release, options).keeps)
    .map((one) => one.tc.id)
    .sort();

test("a phase brings its store sections by the rules their cases trace, and its capabilities' suites", (t) => {
  const { root, sha } = repo(t);
  const source = deskSourceAt(root, sha);
  const first = unitSelection(source.release, { phase: "store-launch-1" });
  assert.deepEqual(
    first.units.map((unit) => [unit.key, unit.priority, unit.step]).sort(),
    [
      [
        "docs/prds/products/grade10-site/store/cart.md#points@store-launch-1",
        "P1",
        "prepared",
      ],
      [
        "docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart@store-launch-1",
        "P0",
        "reviewed",
      ],
      ["spec:demo/thing/widget@store-launch-1", "P1", "reviewed"],
    ],
  );
  assert.deepEqual(ids(source, { phase: "store-launch-1" }), [
    "demo.thing.US1-TC1",
    "demo.thing.US1-TC2",
    "g10.store-cart.TC1",
    "g10.store-cart.TC3",
  ]);
  assert.deepEqual(ids(source, { phase: "store-launch-2" }), [
    "demo.thing.US1-TC1",
    "demo.thing.US1-TC2",
    "g10.store-cart.TC2",
  ]);
  assert.deepEqual(
    first.spans.map(({ unit, others }) => [unit.spec, others]),
    [["demo/thing/widget", ["store-launch-2"]]],
  );
});

test("--ready leaves out a unit with draft cases; a release priority narrows to its units", (t) => {
  const { root, sha } = repo(t);
  const source = deskSourceAt(root, sha);
  assert.deepEqual(ids(source, { phase: "store-launch-1", ready: true }), [
    "demo.thing.US1-TC1",
    "demo.thing.US1-TC2",
    "g10.store-cart.TC1",
  ]);
  assert.deepEqual(
    ids(source, { phase: "store-launch-1", releasePriority: "p0" }),
    ["g10.store-cart.TC1"],
  );
  assert.deepEqual(ids(source, { section: "cart#reviewing-the-cart" }), [
    "g10.store-cart.TC1",
    "g10.store-cart.TC2",
  ]);
  assert.deepEqual(
    ids(source, {
      phase: "store-launch-2",
      section: "cart#reviewing-the-cart",
    }),
    ["g10.store-cart.TC2"],
  );
});

test("an unknown phase, priority or section stops with what the store holds", (t) => {
  const { root, sha } = repo(t);
  const { release } = deskSourceAt(root, sha);
  assert.throws(
    () => unitSelection(release, { phase: "store-launch-9" }),
    /No phase `store-launch-9`; phases.yaml lists store-launch-1, store-launch-2/,
  );
  assert.throws(
    () => unitSelection(release, { releasePriority: "P3" }),
    /P0, P1, P2, not P3/,
  );
  assert.throws(
    () => unitSelection(release, { section: "cart#nowhere" }),
    /`cart` has no section `nowhere`; it has reviewing-the-cart, points/,
  );
});

test("a store case reaches the desk with its section, its rows, its walk and the suite's placeholders", (t) => {
  const { root, sha } = repo(t);
  const source = deskSourceAt(root, sha);
  const { picked } = selectCases(
    source.candidates.filter(
      unitSelection(source.release, { phase: "store-launch-1" }).keeps,
    ),
    { includeAutomated: true },
  );
  const ordered = inReadingOrder(
    picked.filter((one) => one.tc.id !== "demo.thing.US1-TC2"),
  );
  const snapshot = selectionSnapshot(ordered, {
    name: "sl1",
    env: "staging-2",
    selection: "phase store-launch-1",
    phase: "store-launch-1",
    excluded: [{ id: "demo.thing.US1-TC2", reason: "launches later" }],
  });
  const spec = runSpecOf(ordered, {
    snapshot,
    texts: source.texts,
    release: source.release,
    source: sha,
    phase: "store-launch-1",
  });
  assert.equal(spec.fingerprint, snapshot.fingerprint);
  assert.equal(spec.phase, "store-launch-1");
  assert.deepEqual(spec.exclusions, [
    { id: "demo.thing.US1-TC2", reason: "launches later" },
  ]);
  const one = spec.cases.find((found) => found.id === "g10.store-cart.TC1");
  assert.deepEqual(one, {
    id: "g10.store-cart.TC1",
    marker: "g10.store-cart.TC-q5a",
    rev: 3,
    title: "The cart opens over the page",
    suite: "docs/prds/products/grade10-site/store/tests/cart-tcs.md",
    level: "feature",
    product: "grade10-site",
    domain: "store",
    capability: "cart",
    severity: "major",
    priority: "high",
    status: "actual",
    traces: ["cart#reviewing-the-cart/opening"],
    page: "docs/prds/products/grade10-site/store/cart.md",
    section: "reviewing-the-cart",
    sectionTitle: "Reviewing the Cart",
    phase: "store-launch-1",
    lead: "Runs once per row of **Test data**.",
    given: ["customer is on the row's page."],
    steps: ["Select Cart.", "Scroll the lines."],
    expect: [
      { step: 1, text: "opens the drawer over the row's page." },
      { text: "The row's lines, scrolled to the end." },
    ],
    other: [
      {
        label: "Test data",
        text: "| Page | Lines |\n| --- | --- |\n| `<listing url>` | one |\n| the auction listings page | six |",
      },
    ],
    data: {
      header: ["Page", "Lines"],
      rows: [
        ["`<listing url>`", "one"],
        ["the auction listings page", "six"],
      ],
    },
    surfaces: ["web", "mobile"],
  });
  assert.deepEqual(spec.walks, [
    {
      id: "cart-tcs.md#walk-1",
      title: "Open the cart and read it",
      suite: "docs/prds/products/grade10-site/store/tests/cart-tcs.md",
      start: ["customer on `<listing url>` with `<product A>` in the cart"],
      route: [
        {
          step: "Select Cart.",
          expect: "The drawer over the page",
          cases: ["g10.store-cart.TC1"],
        },
        { step: "Remove the line.", expect: "The empty message", cases: [] },
      ],
    },
  ]);
  assert.deepEqual(spec.placeholders, {
    "<listing url>": "`<g10url>/store/collections`",
    "<product A>": "a booster box for sale at HKD880",
  });
  const feature = spec.cases.find((found) => found.id === "demo.thing.US1-TC1");
  assert.equal(
    feature.journey,
    "demo.thing.US1: A collector reads\nAs a collector,\nI want to read the lot,\nso that I know what I bid on.",
  );
  assert.equal(feature.page, undefined);
});

const record = (sha, overrides = {}) => ({
  run: {
    id: "r7",
    name: "Store Launch 1 P0",
    env: "staging-1",
    phase: "store-launch-1",
    state: "finalized",
    source: sha,
    ...overrides,
  },
  spec: {
    name: "Store Launch 1 P0",
    env: "staging-1",
    phase: "store-launch-1",
    selection: "phase store-launch-1, P0",
    source: sha,
    fingerprint: "f".repeat(64),
    cases: [
      { id: "g10.store-cart.TC1", marker: "g10.store-cart.TC-q5a", rev: 3 },
      { id: "g10.store-cart.TC2" },
    ],
    walks: [],
    placeholders: {},
    exclusions: [],
  },
});

test("a desk print commit names the desk run and its phase, and reads back", () => {
  const run = deskRunOf(record("a".repeat(40)));
  const message = printCommitMessage(run);
  assert.equal(
    message,
    `chore(qa): record Store Launch 1 P0 desk run

Run: Store Launch 1 P0
Desk: r7
Test environment: staging-1
Phase: store-launch-1
Source: ${"a".repeat(40)}

Printed cases:
- g10.store-cart.TC1 | TC-q5a@3
- g10.store-cart.TC2 | unmarked
`,
  );
  assert.deepEqual(parsePrintCommit(message), run);
  const sheet = parsePrintCommit(`chore: x

Run: 3-auction
Sheet: sheet-id
Tab: 42
Test environment: staging-1
Phase: auction
Source: ${"b".repeat(40)}

Printed cases:
- a.US1-TC1 | unmarked`);
  assert.equal(sheet.phase, "auction");
  assert.equal(sheet.desk, undefined);
  assert.throws(
    () =>
      parsePrintCommit(
        `Run: x\nDesk: r7\nTest environment: staging-1\nSource: ${"a".repeat(40)}\n`,
      ),
    /no case list/,
  );
});

const fakeDesk = (answers, seen = []) => ({
  access: deskAccess({
    CF_ACCESS_CLIENT_ID: "client-id",
    CF_ACCESS_CLIENT_SECRET: "client-secret",
    DESK_URL: "https://desk.example",
  }),
  fetcher: async (url, init) => {
    seen.push({ url, headers: init.headers });
    const path = url.replace("https://desk.example/api/desk", "");
    const found = answers[path];
    return {
      ok: Boolean(found),
      status: found ? 200 : 404,
      headers: { get: () => "application/json" },
      json: async () => found ?? { error: "no such run" },
    };
  },
});

test("a desk run's print commit is one empty commit, repeats as a no-op, and checks against the desk", async (t) => {
  const { root, sha } = repo(t);
  assert.throws(
    () => commitDeskRun(root, record(sha, { state: "open" })),
    /finalize first/,
  );
  const live = record(sha);
  const result = commitDeskRun(root, live);
  assert.equal(result.branch, deskRunBranch(deskRunOf(live)));
  assert.equal(commitDeskRun(root, live).changed, false);
  assert.deepEqual(
    parsePrintCommit(git(root, ["show", "-s", "--format=%B", "HEAD"])),
    printedRunOf(live),
  );

  const seen = [];
  const desk = fakeDesk({ "/runs/r7/record": live }, seen);
  assert.equal(
    await checkPrintedRuns(root, { desk: desk.access, fetcher: desk.fetcher }),
    1,
  );
  assert.equal(seen[0].url, "https://desk.example/api/desk/runs/r7/record");
  assert.equal(seen[0].headers["CF-Access-Client-Id"], "client-id");

  const reopened = fakeDesk({
    "/runs/r7/record": record(sha, { state: "open" }),
  });
  await assert.rejects(
    checkPrintedRuns(root, {
      desk: reopened.access,
      fetcher: reopened.fetcher,
    }),
    /Desk run r7 is open; only a finalized or closed run can merge/,
  );
  const bumped = record(sha);
  bumped.spec.cases[0].rev = 4;
  const stale = fakeDesk({ "/runs/r7/record": bumped });
  await assert.rejects(
    checkPrintedRuns(root, { desk: stale.access, fetcher: stale.fetcher }),
    /stale/,
  );
  await assert.rejects(
    checkPrintedRuns(root, { desk: deskAccess({}) }),
    /Access service token is missing: set CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET/,
  );
});

test("a desk record whose revision is not at its source refuses a print commit", (t) => {
  const { root, sha } = repo(t);
  const wrong = record(sha);
  wrong.spec.cases[0].rev = 9;
  assert.throws(
    () => commitDeskRun(root, wrong),
    /g10.store-cart.TC1 is not at TC-q5a@9/,
  );
});

test("a re-run takes the failed and blocked rows, a per-row case only its rows", () => {
  const mark = (row, surface, value, seq) => ({
    id: `${row}-${surface}-${seq}`,
    row,
    surface,
    value,
    by: "qa@example.com",
    at: "2026-11-03T00:00:00Z",
    seq,
  });
  const view = {
    run: { id: "r5", name: "Store", state: "finalized" },
    spec: {
      name: "Store",
      env: "staging-1",
      selection: "store",
      source: "a".repeat(40),
      fingerprint: "x",
      cases: [
        {
          id: "c1",
          data: { header: ["Page"], rows: [["one"], ["two"], ["three"]] },
          surfaces: ["web", "mobile"],
        },
        { id: "c2", surfaces: ["web", "mobile"] },
        { id: "c3", surfaces: ["web"] },
      ],
      walks: [
        {
          id: "w",
          title: "w",
          suite: "s",
          start: [],
          route: [{ step: "s", expect: "e", cases: ["c1", "c3"] }],
        },
      ],
      placeholders: {},
      exclusions: [],
    },
    rows: [
      { key: "c1#1", case: "c1", index: 1 },
      { key: "c1#2", case: "c1", index: 2 },
      { key: "c1#3", case: "c1", index: 3 },
      { key: "c2", case: "c2", index: 0 },
      { key: "c3", case: "c3", index: 0 },
    ],
    marks: [
      mark("c1#1", "web", "pass", 1),
      mark("c1#1", "mobile", "pass", 2),
      mark("c1#2", "web", "fail", 3),
      mark("c1#3", "web", "pass", 4),
      mark("c1#3", "mobile", "pass", 5),
      mark("c2", "web", "blocked", 6),
      mark("c3", "web", "fail", 7),
      mark("c3", "web", "pass", 8),
    ],
  };
  const { spec, rows } = rerunSpecOf(view);
  assert.deepEqual(rows, ["c1#2", "c2"]);
  assert.deepEqual(
    spec.cases.map((one) => [one.id, one.rows, one.data?.rows.length]),
    [
      ["c1", [2], 3],
      ["c2", undefined, undefined],
    ],
  );
  assert.equal(spec.rerunOf, "r5");
  assert.equal(spec.name, "Store re-run");
  assert.deepEqual(spec.walks[0].route[0].cases, ["c1"]);
  assert.match(spec.fingerprint, /^[0-9a-f]{64}$/);
  assert.equal(rerunSpecOf(view).spec.fingerprint, spec.fingerprint);
  assert.deepEqual(rerunSpecOf(view, { only: ["blocked"] }).rows, ["c2"]);
});

const SCRIPT = fileURLToPath(new URL("./run-sheet.mjs", import.meta.url));

test("without the Access service token the run sheet says so and names the way round it", (t) => {
  const env = { ...process.env, NO_COLOR: "1" };
  delete env.CF_ACCESS_CLIENT_ID;
  delete env.CF_ACCESS_CLIENT_SECRET;
  const run = spawnSync(
    process.execPath,
    [SCRIPT, "--desk", "--dry-run", "--rerun", "r5"],
    { env, encoding: "utf8" },
  );
  assert.equal(run.status, 1);
  assert.match(
    run.stderr,
    /The run desk's Access service token is missing: set CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET \(a known Blocker\)/,
  );
  assert.match(run.stderr, /--rerun-record <file>/);

  const dir = mkdtempSync(join(tmpdir(), "run-desk-cli-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, "run.json");
  writeFileSync(
    file,
    JSON.stringify({
      run: { id: "r5", name: "Store", state: "finalized" },
      spec: {
        name: "Store",
        env: "staging-1",
        source: "a".repeat(40),
        cases: [{ id: "c2", surfaces: ["web"] }],
        walks: [],
      },
      rows: [{ key: "c2", case: "c2", index: 0 }],
      marks: [{ id: "m", row: "c2", surface: "web", value: "fail", seq: 1 }],
    }),
  );
  const out = join(dir, "rerun.json");
  const offline = spawnSync(
    process.execPath,
    [SCRIPT, "--desk", "--dry-run", "--rerun-record", file, "--out", out],
    { env, encoding: "utf8" },
  );
  assert.equal(offline.status, 0, offline.stderr);
  assert.match(
    offline.stdout,
    /Re-run of r5 \(Store\): 1 fail and blocked rows in 1 cases/,
  );
  assert.match(offline.stdout, new RegExp(`RunSpec: ${out}`));
});

/** An in-memory desk behind HTTP on a local port, for the run sheet's CLI. */
async function deskServer(t) {
  const { store } = deskInMemory();
  const posted = [];
  const server = createServer(async (incoming, outgoing) => {
    const chunks = [];
    for await (const chunk of incoming) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    if (incoming.method === "POST")
      posted.push([incoming.url, JSON.parse(body.toString("utf8"))]);
    const request = new Request(`http://desk${incoming.url}`, {
      method: incoming.method,
      headers: incoming.headers,
      ...(body.length > 0 ? { body } : {}),
    });
    const { response } = await handle(store, request, "qa@grade10.com");
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  t.after(() => server.close());
  return { store, posted, url: `http://127.0.0.1:${server.address().port}` };
}

function runSheet(args, env) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], { env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => done({ status, stdout, stderr }));
  });
}

test("the re-run that opens is the one confirmed, with its rows' numbers, and re-runs again", async (t) => {
  const desk = await deskServer(t);
  const dir = mkdtempSync(join(tmpdir(), "run-desk-rerun-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const env = {
    ...process.env,
    NO_COLOR: "1",
    DESK_URL: desk.url,
    CF_ACCESS_CLIENT_ID: "id",
    CF_ACCESS_CLIENT_SECRET: "secret",
  };
  const first = desk.store.open(
    aSpec({
      cases: [
        aCase("TC1", {
          data: { header: ["tier"], rows: [["Gold"], ["Silver"], ["Bronze"]] },
        }),
        aCase("TC2"),
      ],
      walks: [],
    }),
    "qa@grade10.com",
  );
  const mark = (row, value, surface = "web") => ({
    id: `${row}/${surface}/${value}`,
    row,
    surface,
    value,
  });
  const marked = (run, ...marks) => {
    for (const one of marks)
      desk.store.mark(run, { marks: [one] }, "qa@grade10.com");
  };
  marked(
    first.id,
    mark("TC1#1", "fail"),
    mark("TC1#2", "pass"),
    mark("TC1#2", "pass", "mobile"),
    mark("TC1#3", "fail"),
    mark("TC2", "pass"),
    mark("TC2", "pass", "mobile"),
  );

  async function rerun(id, name, only = []) {
    const out = join(dir, `${name}.json`);
    const base = ["--desk", "--rerun", id, ...only, "--out", out];
    const dry = await runSheet([...base, "--dry-run", "--name", name], env);
    assert.equal(dry.status, 0, dry.stderr);
    const listed = [...dry.stdout.matchAll(/^ {2}(\S+)$/gm)].map((m) => m[1]);
    const fingerprint = /Fingerprint: (\w+)/.exec(dry.stdout)[1];
    const confirmed = JSON.parse(readFileSync(out, "utf8"));
    const opened = await runSheet(
      [...base, "--open", "--name", name, "--confirmed", fingerprint],
      env,
    );
    assert.equal(opened.status, 0, opened.stderr);
    const [path, sent] = desk.posted.at(-1);
    assert.equal(path, "/api/desk/runs");
    assert.deepEqual(sent, confirmed);
    const run = desk.store.runs()[0];
    assert.equal(run.rerunOf, id);
    assert.equal(run.fingerprint, fingerprint);
    const view = desk.store.view(run.id);
    assert.deepEqual(
      view.rows.map((row) => row.key),
      listed,
    );
    return { run, listed };
  }

  const again = await rerun(first.id, "again");
  assert.deepEqual(again.listed, ["TC1#1", "TC1#3"]);
  marked(
    again.run.id,
    mark("TC1#1", "pass"),
    mark("TC1#1", "pass", "mobile"),
    mark("TC1#3", "fail"),
  );
  const third = await rerun(again.run.id, "third", ["--only", "failed"]);
  assert.deepEqual(third.listed, ["TC1#3"]);
});
