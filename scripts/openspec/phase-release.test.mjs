/*
 * `pnpm phase:checked` and `pnpm phase:release` against a fixture store:
 * docs/prds/products/shared/planning/release-phases.md#releasing-a-phase.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { readPhases } from "../../tools/manual/src/api/phases.ts";
import {
  parsePage,
  serializePage,
} from "../../tools/manual/src/content/grammar.ts";
import { loadVerdicts } from "./lib/desk-verdicts.mjs";

const SCRIPT = join(import.meta.dirname, "phase-release.mjs");
const STORE = "docs/prds/products/grade10-site/store";
const CART = `${STORE}/cart.md`;
const TIERS = "docs/prds/products/site/loyalty/tiers.md";
const REGISTRY = "docs/prds/phases.yaml";

const PHASES = `# The release phases.
phases:
  - id: store-launch-1
    name: Store Launch 1
    env: staging-1
  # the next one
  - id: store-launch-2
    name: Store Launch 2
    env: staging-1
`;

const CART_PAGE = `---
title: Cart
---

Opening words.

::phase{id="store-launch-1" priority="P1"}

## Reviewing

- 🚧 **Current Read** — the drawer waits for the shop
  - 🚧 **Unresolved** — a line the shop cannot read stays
- **Edits** — a quantity changes in place

## Promo Code

::phase{id="store-launch-2" priority="P1" rules="held-codes"}

- 🚧 **Typed** — a code takes its cut
- 🚧 **Held Codes** — a member's codes are listed
  - 🚧 **Expired** — an expired code is greyed

## Points

- 🚧 **Use Max** — the ceiling
- ❓ **Cap** — how far. Product confirms

## Totals

::phase{id="store-launch-1" priority="P0"}

- 🚧 **Sum** — the lines add up

## Shipping

::phase{id="store-launch-2" priority="P1"}

::phase{id="store-launch-1" priority="P2" rules="express"}

- **Standard** — a parcel
- 🚧 **Express** — next day

## Gifts

::phase{id="store-launch-2" priority="P1" rules="wrap"}

::phase{id="store-launch-1" priority="P1" rules="card"}

- **Wrap** — paper
- 🚧 **Card** — a note
- **Note** — words

:::detail{title="Product decisions" for="pm"}
- 🚧 **Never a line** — a decision row
:::
`;

const TIERS_PAGE = `---
title: Tiers
spec: site/loyalty/tiers
---

::phase{id="store-launch-1" priority="P1"}

## Tiers

- 🚧 **Gold** — a tier
`;

const tc = (id, trace) => `### ${id}: Case ${id}

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Trace:** ${trace}
`;

const SUITE = `---
title: grade10-site/store/cart Test Cases
---

## cart#reviewing: Reviewing

${tc("g10.cart.TC1", "cart#reviewing/current-read, cart#reviewing/unresolved, cart#reviewing/edits")}
## cart#totals: Totals

${tc("g10.cart.TC2", "cart#totals/sum")}
## cart#points: Points

${tc("g10.cart.TC3", "cart#points/use-max, cart#points/cap")}
## cart#promo-code: Promo Code

${tc("g10.cart.TC4", "cart#promo-code/typed, cart#promo-code/held-codes, cart#promo-code/expired")}
## cart#shipping: Shipping

${tc("g10.cart.TC5", "cart#shipping/standard, cart#shipping/express")}
## cart#gifts: Gifts

${tc("g10.cart.TC6", "cart#gifts/wrap, cart#gifts/card, cart#gifts/note")}`;

function fixture(extra = {}) {
  const root = mkdtempSync(join(tmpdir(), "phase-release-"));
  const files = {
    [REGISTRY]: PHASES,
    [CART]: CART_PAGE,
    [TIERS]: TIERS_PAGE,
    [`${STORE}/tests/cart-tcs.md`]: SUITE,
    ...extra,
  };
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), content);
  }
  const git = (...args) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });
  git("init", "--quiet", "--initial-branch=main");
  git("config", "user.email", "qa@example.com");
  git("config", "user.name", "QA");
  git("config", "commit.gpgsign", "false");
  git("add", ".");
  git("commit", "--quiet", "-m", "store");
  return { root, git, read: (name) => readFileSync(join(root, name), "utf8") };
}

const marks = (row, values) =>
  Object.entries(values).map(([surface, value], seq) => ({
    id: `${row}-${surface}`,
    row,
    surface,
    value,
    by: "qa@example.com",
    at: "2026-11-03T00:00:00Z",
    seq,
  }));

/** Desk verdicts with each case's marks on staging-1. */
function verdicts(root, byCase) {
  const file = join(root, "..", `${root.split("/").at(-1)}-verdicts.json`);
  const cases = Object.fromEntries(
    Object.entries(byCase).map(([id, values]) => [
      id,
      { run: "run-1", rows: [{ key: id, marks: marks(id, values) }] },
    ]),
  );
  writeFileSync(
    file,
    JSON.stringify({ runs: [], cases: { "staging-1": cases }, excluded: {} }),
  );
  return file;
}

const PASS = { web: "pass", mobile: "pass" };

const run = (root, args, env = {}) =>
  spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      CF_ACCESS_CLIENT_ID: "",
      CF_ACCESS_CLIENT_SECRET: "",
      ...env,
    },
  });

/** The fingerprint a release's dry run prints for a person to confirm. */
function fingerprintOf(root, phase, file, date) {
  const dry = run(root, ["release", phase, "--date", date, "--verdicts", file]);
  assert.equal(dry.status, 0, dry.stderr);
  const found = /^Fingerprint: ([0-9a-f]{64})$/m.exec(dry.stdout);
  assert.ok(found, dry.stdout);
  return found[1];
}

/** A release written with the fingerprint its dry run printed. */
const release = (root, phase, file, date) =>
  run(root, [
    "release",
    phase,
    "--write",
    "--date",
    date,
    "--verdicts",
    file,
    "--confirmed",
    fingerprintOf(root, phase, file, date),
  ]);

const canonical = (text) => assert.equal(serializePage(parsePage(text)), text);

test("checked takes the 🚧 off the lines of passed units only, in one commit", () => {
  const { root, git, read } = fixture();
  const file = verdicts(root, {
    "g10.cart.TC1": PASS,
    "g10.cart.TC3": PASS,
    "g10.cart.TC4": PASS,
  });

  const dry = run(root, [
    "checked",
    "store-launch-1",
    "--dry-run",
    "--verdicts",
    file,
  ]);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /3 units passed, 4 lines lose the 🚧/);
  assert.match(dry.stdout, /11: - 🚧 \*\*Current Read\*\*/);
  assert.equal(read(CART), CART_PAGE);

  const done = run(root, ["checked", "store-launch-1", "--verdicts", file]);
  assert.equal(done.status, 0, done.stderr);
  const page = read(CART);
  canonical(page);
  for (const kept of [
    "- 🚧 **Held Codes**",
    "  - 🚧 **Expired**",
    "- 🚧 **Sum**",
    "- 🚧 **Express**",
    "- 🚧 **Never a line**",
    "- ❓ **Cap**",
  ])
    assert.ok(page.includes(kept), kept);
  for (const off of [
    "- **Current Read**",
    "  - **Unresolved**",
    "- **Typed**",
    "- **Use Max**",
  ])
    assert.ok(page.includes(off), off);
  assert.equal(git("status", "--porcelain"), "");
  const log = git("log", "--format=%B", "-1");
  assert.match(log, /^docs\(store\): check Store Launch 1's passed units/);
  assert.match(log, /- P1 grade10-site\/store\/cart#promo-code/);
  assert.equal(git("rev-list", "--count", "HEAD").trim(), "2");
});

test("a release's dry run says what launches, moves and comes off, and writes nothing", () => {
  const { root, read } = fixture();
  const file = verdicts(root, { "g10.cart.TC1": PASS, "g10.cart.TC2": PASS });
  const dry = run(root, [
    "release",
    "store-launch-1",
    "--date",
    "2026-12-01",
    "--verdicts",
    file,
  ]);
  assert.equal(dry.status, 0, dry.stderr);
  const out = dry.stdout;
  assert.match(
    out,
    /Launches \(2\):\n {2}P0 {2}grade10-site\/store\/cart#totals {2}Passed\n {2}P1 {2}grade10-site\/store\/cart#reviewing {2}Passed/,
  );
  assert.match(out, /Moves to Store Launch 2 \(5\):/);
  for (const moved of [
    "cart#gifts",
    "cart#points",
    "cart#promo-code",
    "cart#shipping",
    "site/loyalty/tiers",
  ])
    assert.ok(out.includes(moved), moved);
  assert.match(out, /Marks that come off \(3\):/);
  assert.match(out, /Sign-off: every P0 unit passed/);
  const fingerprint = /^Fingerprint: ([0-9a-f]{64})$/m.exec(out)?.[1];
  assert.ok(fingerprint, out);
  assert.ok(
    out.includes(
      `pnpm phase:release store-launch-1 --write --date 2026-12-01 --verdicts ${file} --confirmed ${fingerprint}`,
    ),
    out,
  );
  assert.equal(read(CART), CART_PAGE);
  assert.equal(read(REGISTRY), PHASES);
});

test("sign-off refuses a P0 not passed, a question in a launching unit and an untriaged automated fail", () => {
  const { root, git, read } = fixture();
  const file = verdicts(root, {
    "g10.cart.TC1": { web: "pass", mobile: "pass", autoWeb: "fail" },
    "g10.cart.TC2": { web: "fail", mobile: "pass" },
    "g10.cart.TC3": PASS,
  });
  const dry = run(root, ["release", "store-launch-1", "--verdicts", file]);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /Sign-off refused:/);
  assert.match(
    dry.stdout,
    /P0 grade10-site\/store\/cart#totals has not passed: Failing/,
  );
  assert.match(
    dry.stdout,
    /grade10-site\/store\/cart#points launches holding 1 question/,
  );
  assert.match(
    dry.stdout,
    /grade10-site\/store\/cart#reviewing has 1 automated fail not triaged/,
  );

  const write = run(root, [
    "release",
    "store-launch-1",
    "--write",
    "--verdicts",
    file,
  ]);
  assert.equal(write.status, 1);
  assert.match(write.stderr, /does not sign off — nothing written/);
  assert.equal(read(CART), CART_PAGE);
  assert.equal(git("rev-list", "--count", "HEAD").trim(), "1");
});

test("a written release records the day, removes the phase's blocks and moves what did not pass, in one commit", () => {
  const { root, git, read } = fixture();
  const file = verdicts(root, { "g10.cart.TC1": PASS, "g10.cart.TC2": PASS });
  const write = release(root, "store-launch-1", file, "2026-12-01");
  assert.equal(write.status, 0, write.stderr + write.stdout);

  const registry = read(REGISTRY);
  assert.equal(
    registry,
    PHASES.replace(
      "    env: staging-1\n  # the next one",
      "    env: staging-1\n    released: 2026-12-01\n  # the next one",
    ),
  );
  assert.equal(readPhases(registry)[0].released, "2026-12-01");

  const page = read(CART);
  canonical(page);
  assert.equal(
    page,
    `---
title: Cart
---

Opening words.

## Reviewing

- **Current Read** — the drawer waits for the shop
  - **Unresolved** — a line the shop cannot read stays
- **Edits** — a quantity changes in place

## Promo Code

::phase{id="store-launch-2" priority="P1"}

::phase{id="store-launch-2" priority="P1" rules="held-codes"}

- 🚧 **Typed** — a code takes its cut
- 🚧 **Held Codes** — a member's codes are listed
  - 🚧 **Expired** — an expired code is greyed

## Points

::phase{id="store-launch-2" priority="P1"}

- 🚧 **Use Max** — the ceiling
- ❓ **Cap** — how far. Product confirms

## Totals

- **Sum** — the lines add up

## Shipping

::phase{id="store-launch-2" priority="P1"}

::phase{id="store-launch-2" priority="P2" rules="express"}

- **Standard** — a parcel
- 🚧 **Express** — next day

## Gifts

::phase{id="store-launch-2" priority="P1"}

::phase{id="store-launch-2" priority="P1" rules="wrap,card"}

- **Wrap** — paper
- 🚧 **Card** — a note
- **Note** — words

:::detail{title="Product decisions" for="pm"}
- 🚧 **Never a line** — a decision row
:::
`,
  );
  const tiers = read(TIERS);
  canonical(tiers);
  assert.equal(
    tiers,
    TIERS_PAGE.replace('id="store-launch-1"', 'id="store-launch-2"'),
  );

  assert.equal(git("status", "--porcelain"), "");
  assert.equal(git("rev-list", "--count", "HEAD").trim(), "2");
  const log = git("log", "--format=%B", "-1");
  assert.match(
    log,
    /^docs\(planning\): release Store Launch 1\n\nReleased 2026-12-01\./,
  );
  assert.match(
    log,
    /Released:\n- P0 grade10-site\/store\/cart#totals\n- P1 grade10-site\/store\/cart#reviewing/,
  );
  assert.match(log, /Moved to Store Launch 2:\n(- P[12] .+\n?){5}/);
  assert.deepEqual(
    git("show", "--name-only", "--format=", "HEAD").trim().split("\n").sort(),
    [REGISTRY, CART, TIERS].sort(),
  );
});

test("the last phase cannot move a unit, and names the ones it would", () => {
  const { root, read } = fixture();
  const file = verdicts(root, {});
  const write = run(root, [
    "release",
    "store-launch-2",
    "--write",
    "--verdicts",
    file,
  ]);
  assert.equal(write.status, 1);
  assert.match(
    write.stdout,
    /Store Launch 2 is the last phase, so nothing can move: .*grade10-site\/store\/cart#promo-code/,
  );
  assert.equal(read(CART), CART_PAGE);
});

test("without the service token or a saved answer, one line names what is missing", async () => {
  const { root } = fixture();
  const refused = run(root, ["release", "store-launch-1"], {
    CF_ACCESS_CLIENT_ID: "id",
  });
  assert.equal(refused.status, 1);
  assert.equal(refused.stderr.trim().split("\n").length, 1, refused.stderr);
  assert.match(
    refused.stderr,
    /CF_ACCESS_CLIENT_SECRET is not set — .*Blocker; pass --verdicts <file>/,
  );

  const asked = [];
  const answer = { runs: [], cases: {}, excluded: {} };
  const read = await loadVerdicts({
    env: {
      CF_ACCESS_CLIENT_ID: "id",
      CF_ACCESS_CLIENT_SECRET: "secret",
      DESK_URL: "https://desk.test/",
    },
    fetchImpl: async (url, init) => {
      asked.push([url, init.headers]);
      return new Response(JSON.stringify(answer), { status: 200 });
    },
  });
  assert.deepEqual(read, answer);
  assert.equal(asked[0][0], "https://desk.test/api/desk/verdicts");
  assert.equal(asked[0][1]["CF-Access-Client-Id"], "id");
  assert.equal(asked[0][1]["CF-Access-Client-Secret"], "secret");
  await assert.rejects(
    loadVerdicts({
      env: { CF_ACCESS_CLIENT_ID: "id", CF_ACCESS_CLIENT_SECRET: "s" },
      fetchImpl: async () =>
        new Response('{"error":"forbidden"}', { status: 403 }),
    }),
    /answered 403: \{"error":"forbidden"\}/,
  );
});

test("a written release needs the fingerprint of the dry run a person confirmed", () => {
  const { root, git, read } = fixture();
  const file = verdicts(root, { "g10.cart.TC1": PASS, "g10.cart.TC2": PASS });
  const confirmed = fingerprintOf(root, "store-launch-1", file, "2026-12-01");
  const write = (args) =>
    run(root, [
      "release",
      "store-launch-1",
      "--write",
      "--date",
      "2026-12-01",
      "--verdicts",
      file,
      ...args,
    ]);

  const bare = write([]);
  assert.equal(bare.status, 1);
  assert.match(bare.stderr, /--confirmed <fingerprint>/);

  verdicts(root, {
    "g10.cart.TC1": PASS,
    "g10.cart.TC2": PASS,
    "g10.cart.TC5": PASS,
  });
  const moved = write(["--confirmed", confirmed]);
  assert.equal(moved.status, 1);
  assert.match(moved.stderr, /not the release confirmed/);

  assert.equal(read(CART), CART_PAGE);
  assert.equal(read(REGISTRY), PHASES);
  assert.equal(git("rev-list", "--count", "HEAD").trim(), "1");
});

const WISHLIST = `${STORE}/wishlist.md`;
const wishlistSuite = (traces) => `---
title: grade10-site/store/wishlist Test Cases
---

## wishlist#saving: Saving

${traces.map((trace, at) => tc(`g10.wish.TC${at + 1}`, trace)).join("\n")}`;

test("a release keeps its launched lines out of a later phase's block above them", () => {
  const page = `---
title: Wishlist
---

::phase{id="store-launch-2" priority="P1"}

## Saving

::phase{id="store-launch-1" priority="P0"}

- **Heart** — a tap saves
- **List** — the saved items

## Sharing

::phase{id="store-launch-1" priority="P0" rules="link"}

- **Link** — a link to the list
- **Embed** — a list on another page

## Later

- **Import** — another shop's list
`;
  const { root, read } = fixture({
    [WISHLIST]: page,
    [`${STORE}/tests/wishlist-tcs.md`]: wishlistSuite([
      "wishlist#saving/heart, wishlist#saving/list",
      "wishlist#sharing/link",
    ]),
  });
  const file = verdicts(root, {
    "g10.cart.TC1": PASS,
    "g10.cart.TC2": PASS,
    "g10.wish.TC1": PASS,
    "g10.wish.TC2": PASS,
  });
  const write = release(root, "store-launch-1", file, "2026-12-01");
  assert.equal(write.status, 0, write.stderr + write.stdout);
  const written = read(WISHLIST);
  canonical(written);
  assert.equal(
    written,
    `---
title: Wishlist
---

## Saving

- **Heart** — a tap saves
- **List** — the saved items

## Sharing

::phase{id="store-launch-2" priority="P1" rules="embed"}

- **Link** — a link to the list
- **Embed** — a list on another page

## Later

::phase{id="store-launch-2" priority="P1"}

- **Import** — another shop's list
`,
  );
});

test("a release no edit can keep out of a later phase's block refuses, naming each line", () => {
  const page = `---
title: Wishlist
---

::phase{id="store-launch-2" priority="P1"}

## Sharing

::phase{id="store-launch-1" priority="P0" rules="link"}

The list can be shared.

- **Link** — a link to the list
- **Embed** — a list on another page
`;
  const { root, git, read } = fixture({
    [WISHLIST]: page,
    [`${STORE}/tests/wishlist-tcs.md`]: wishlistSuite([
      "wishlist#sharing/link",
    ]),
  });
  const file = verdicts(root, {
    "g10.cart.TC1": PASS,
    "g10.cart.TC2": PASS,
    "g10.wish.TC1": PASS,
  });
  const dry = run(root, ["release", "store-launch-1", "--verdicts", file]);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(
    dry.stdout,
    /wishlist\.md: `\*\*Link\*\* — a link to the list` stays in store-launch-2/,
  );
  assert.doesNotMatch(dry.stdout, /^Fingerprint:/m);

  const write = run(root, [
    "release",
    "store-launch-1",
    "--write",
    "--verdicts",
    file,
    "--confirmed",
    "0".repeat(64),
  ]);
  assert.equal(write.status, 1);
  assert.match(write.stderr, /launched lines stay under another phase/);
  assert.equal(read(WISHLIST), page);
  assert.equal(read(CART), CART_PAGE);
  assert.equal(git("rev-list", "--count", "HEAD").trim(), "1");
});
