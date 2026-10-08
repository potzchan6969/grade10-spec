# grade10-site/store/product-listing Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-listing-US16: Collector opens a card from the listing

**As a** collector browsing the listing,
**I want** a card's name to open its product, as its photo does,
**so that** the name I read first takes me to the product I came for.

<!-- trace:case id=g10.store-product-listing.TC-fjr rev=1 covers=g10.store-product-listing.SC-o14,g10.store-product-listing.SC-biu -->
### grade10-site-store-product-listing-US16-TC1-1: Card's name and photo each open its own product page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* The catalogue lists more cards for sale than the listing's first page shows.
* `<card_1>` is for sale and shows on the listing's first page at rest.
* `<card_2>` is for sale and shows only after scrolling past the first page.

**Test data:**

| Card | Control | Outcome |
| --- | --- | --- |
| `<card_1>` | its name | `<card_1>`'s product page |
| `<card_1>` | its photo | `<card_1>`'s product page |
| `<card_2>` | its name | `<card_2>`'s product page |

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Scroll until the row's **Card** shows in the grid.
3. Click the row's **Control** on that card.

**Expected Results:**

* Step 3 opens the row's **Outcome**, at `<lang>/store/products/<handle>` for that card.
* The product page names the row's **Card**, not a neighbouring card.

<!-- trace:case id=g10.store-product-listing.TC-xoj rev=1 covers=g10.store-product-listing.SC-o14,g10.store-product-listing.SC-biu -->
### grade10-site-store-product-listing-US16-TC2-1: Sold-out card opens from neither its name nor its photo

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* `<card_3>` is sold out by the recipe "Sell a card out".

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Scroll until `<card_3>` shows in the grid.
3. Move the pointer over `<card_3>`'s name.
4. Click `<card_3>`'s name.
5. Click `<card_3>`'s photo.

**Expected Results:**

* `<card_3>` shows as sold out.
* Step 3 leaves the name plain text, not underlined.
* Steps 4 and 5 leave the listing open at `<grade10 browse listing url>`.

<!-- trace:case id=g10.store-product-listing.TC-jzg rev=1 covers=g10.store-product-listing.SC-o14,g10.store-product-listing.SC-biu -->
### grade10-site-store-product-listing-US16-TC3-1: Card's name opens its product page from the keyboard

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* `<card_1>` is for sale and shows on the listing's first page at rest.

**Steps:**

1. Navigate to `<grade10 browse listing url>`.
2. Press Tab until focus reaches `<card_1>`'s name.
3. Press Enter.

**Expected Results:**

* Step 2 underlines `<card_1>`'s name while it holds focus.
* Step 3 opens `<card_1>`'s product page, at `<lang>/store/products/<handle>` for that card.

<!-- trace:case id=g10.store-product-listing.TC-ksq rev=1 covers=g10.store-product-listing.SC-o14,g10.store-product-listing.SC-biu -->
### grade10-site-store-product-listing-US16-TC4-1: Card already in the cart still opens from its name

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-16

**Pre-conditions:**

* `<card_4>` is for sale and shows on the listing's first page at rest.
* customer(signed in, one `<card_4>` in the cart) is on `<grade10 browse listing url>`.

**Steps:**

1. Look at `<card_4>` in the grid.
2. Click `<card_4>`'s name.

**Expected Results:**

* Step 1 shows `<card_4>` as in the cart.
* Step 2 opens `<card_4>`'s product page, at `<lang>/store/products/<handle>` for that card.

## Settled

- **A listing card's name is a button** - the listing gives its cards no address, so a card's name opens on Enter and Space and is not a link that opens in a new tab; the listing gives its tiles their addresses in its own round

## Reconciliation

- **Raised, settled** - the 2026-10-06 blind pass asked whether a listing card's name is a link to its product's address or a button that opens it in place; landed as Q15 from the listing's wiring, which passes a callback and no address, and the Product Listing Blocks decision that the listing gives its tiles addresses in its own round: a button, recorded under Settled, no case and no scenario. US16-TC3 presses Enter, which opens a button and a link alike, so it stands
- **Kept** - US16-TC3 opens a card from its name by the keyboard on the listing itself, where the shared suite does so only on a tile in Storybook. US16-TC4 opens a card already in the cart, a tile state none of US16-TC1's cards is in
- **Contradicted** - none: where a case and a scenario state the same outcome they agree
- **Walked** - `grade10-site-store-product-listing-SC-55` by US16-TC1, whose rows press a card's name and its photo, and a card's name past the first page, by US16-TC3 from the keyboard and by US16-TC4 on a card in the cart; `grade10-site-store-product-listing-SC-56` by US16-TC2
- **Uncovered** - none of this delta's scenarios
- **Beyond the scenarios** - US16-TC2's plain name on hover and US16-TC3's underline on keyboard focus are the shared rules that a name which does not open is plain and one that opens is underlined, proven on the tile by the shared suite; they stay here as the listing's own view of them
- **Out of suite** - the name as the card's one keyboard stop is the shared tile's, walked by the shared suite; the listing adds nothing to it
- **Across levels** - the store's `grade10-site-store-e2e-US1-TC1-2` opens a card from this listing, so this change re-words it to a card for sale in its `domain-tcs.md`
- **QA2, 2026-10-07** - each case re-read against `grade10-site-store-product-listing-SC-55` and `grade10-site-store-product-listing-SC-56`: nothing contradicted, raised or uncovered, and no case changed
- **Blind** - the 2026-10-06 pass below read this delta's anchors after they moved and wrote US16-TC3 and US16-TC4; it read US16-TC1 and US16-TC2 and left them as they were

**Run:** Blind feature pass (QA1) on 2026-10-06 for `activate-listing-tile-by-name`, `grade10-site/store/product-listing`. Read the caller's isolated bundle only: the durable Purpose and Feature set and the delta Feature set, the delta `user-journeys.md`, the change's `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with scenario ids stripped, `openspec/config.yaml` context, the PRD pages `grade10-site/store/product-listing`, `grade10-site/store/product-page` and the Product Tile section of `shared/ui/store-product-listing`, this suite with its Reconciliation stripped and its Settled, and the change's `domain-tcs.md` with its Reconciliation stripped; plus `docs/governance/specs-to-test-cases.md` and `docs/governance/tcs-conventions.md`. Denied and not opened: every Requirements section, `tech-design.md`, `tasks.md`, the rest of `openspec/specs/` and `openspec/changes/`, the archive, and the application repository.
