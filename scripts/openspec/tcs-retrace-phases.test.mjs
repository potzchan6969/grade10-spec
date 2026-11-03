/*
 * `pnpm tcs:retrace` moves the `::phase` blocks naming a renamed rule, as it
 * moves the cases tracing it - release-phases.md, Renames Carry It.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import {
  parsePage,
  serializePage,
} from "../../tools/manual/src/content/grammar.ts";
import { retraceBlocks } from "./tcs-retrace.mjs";

const STORE = "docs/prds/products/grade10-site/store";
const CART = `${STORE}/cart.md`;

const CART_PAGE = `---
title: Cart
---

## Gifts

::phase{id="store-launch-2" priority="P1" rules="wrap"}

::phase{id="store-launch-1" priority="P1" rules="card"}

- **Wrap** — paper
- 🚧 **Card** — a note
- **Note** — words
`;

const SUITE = `---
title: grade10-site/store/cart Test Cases
---

## cart#gifts: Gifts

### g10.cart.TC6: Gifts

**Classification:**

* **Status:** actual
* **Trace:** cart#gifts/wrap, cart#gifts/card, cart#gifts/note
`;

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "retrace-phases-"));
  for (const [name, content] of Object.entries({
    [CART]: CART_PAGE,
    [`${STORE}/tests/cart-tcs.md`]: SUITE,
  })) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), content);
  }
  return { root, read: (name) => readFileSync(join(root, name), "utf8") };
}

const canonical = (text) => assert.equal(serializePage(parsePage(text)), text);

test("renaming a rule moves the blocks that name it, as it moves the cases", () => {
  const { root, read } = fixture();
  writeFileSync(
    join(root, CART),
    CART_PAGE.replace("- 🚧 **Card** — a note", "- 🚧 **Gift Card** — a note"),
  );
  const moved = spawnSync(
    process.execPath,
    [
      join(import.meta.dirname, "tcs-retrace.mjs"),
      "cart#gifts/card",
      "cart#gifts/gift-card",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(moved.status, 0, moved.stderr);
  assert.match(moved.stdout, /cart\.md: 1 phase block/);
  const page = read(CART);
  canonical(page);
  assert.ok(
    page.includes(
      '::phase{id="store-launch-1" priority="P1" rules="gift-card"}',
    ),
  );
  assert.ok(
    read(`${STORE}/tests/cart-tcs.md`).includes(
      "cart#gifts/wrap, cart#gifts/gift-card, cart#gifts/note",
    ),
  );
});

test("renaming a section leaves its blocks where they are", () => {
  const { root, read } = fixture();
  writeFileSync(join(root, CART), CART_PAGE.replace("## Gifts", "## Presents"));
  const moved = spawnSync(
    process.execPath,
    [
      join(import.meta.dirname, "tcs-retrace.mjs"),
      "cart#gifts",
      "cart#presents",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(moved.status, 0, moved.stderr);
  assert.equal(read(CART), CART_PAGE.replace("## Gifts", "## Presents"));
  assert.ok(read(`${STORE}/tests/cart-tcs.md`).includes("cart#presents/card"));
});

test("a rename leaves a block under another section, or inside a block, alone", () => {
  const text = [
    "---",
    "title: Cart",
    "---",
    "",
    '::phase{id="a" priority="P0" rules="card,wrap"}',
    "",
    "## Gifts",
    "",
    '::phase{id="b" priority="P1" rules="card"}',
    "",
    "- **Card** — a note",
    "",
    ':::callout{kind="note"}',
    '::phase{id="b" priority="P1" rules="card"}',
    ":::",
    "",
    "## Wrapping",
    "",
    '::phase{id="b" priority="P1" rules="card"}',
    "",
  ].join("\n");
  const { text: out, lines } = retraceBlocks(
    text,
    "gifts",
    "card",
    "gift-card",
  );
  assert.equal(lines, 2);
  assert.deepEqual(
    out.split("\n").filter((line) => line.startsWith("::phase")),
    [
      '::phase{id="a" priority="P0" rules="gift-card,wrap"}',
      '::phase{id="b" priority="P1" rules="gift-card"}',
      '::phase{id="b" priority="P1" rules="card"}',
      '::phase{id="b" priority="P1" rules="card"}',
    ],
  );
});
