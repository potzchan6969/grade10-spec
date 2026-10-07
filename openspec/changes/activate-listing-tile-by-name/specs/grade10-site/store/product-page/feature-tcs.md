# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-page-US2: Collector opens a card from the storefront

**As a** collector,
**I want** to reach a card's own address from the grid without a page load,
**so that** the card I opened is the one I land on, at an address that answers
on its own.

<!-- trace:case id=g10.store-product-page.TC-3jw rev=2 covers=g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-product-page-US2-TC1-2: Card opens from each storefront grid at its own address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**

* `<card_1>` is for sale and shows on the listing's first page at rest.
* `<card_2>` is for sale and shows in the front door's row of cards.
* `<card_3>`'s rail shows `<card_4>`, for sale, set by the recipe "Choose picks on a staging-shop card".

**Test data:**

| Start | Card | Control |
| --- | --- | --- |
| `<grade10 browse listing url>` | `<card_1>` | its name |
| `<grade10 browse listing url>` | `<card_1>` | its photo |
| `<grade10 store url>` | `<card_2>` in the front door's row of cards | its name |
| `<card_3>`'s product page | `<card_4>` in the rail under the card | its name |

**Steps:**

1. Navigate to the row's **Start**.
2. Scroll until the row's **Card** shows.
3. Click the row's **Control** on that card.
4. Reload the page.

**Expected Results:**

* Step 3 opens the row's **Card**'s page, at `<lang>/store/products/<handle>` for that card.
* Step 3 renders that page without a full document load.
* Step 4 renders the same card at the same address.

## Settled

- **A card's page opens at its top** - a navigation to a new entry starts at the top, by the site's navigation rule, so a card opened from the rail low on a page shows from its top; the product page states no rule of its own

## Reconciliation

- **Re-worded** - US2-TC1 opened any published card from the grid by its photo; the requirement now holds only for a card that opens, and names the listing, the front door's row and the rail under a card as the surfaces that say which, so the blind pass made it one row per surface and control, each card for sale (Q12, Q3). Its meaning moved, so it is revision 2
- **Shared with** - `add-store-product-status` carries US2-TC1 at revision 1, the photo press on the grid; the fold refuses that copy once this one lands, so that change rewrites its case against revision 2
- **Raised, settled** - the 2026-10-06 blind pass asked where a card's page starts when it opens without a page load; landed as Q16 from `grade10-site/site/navigation`'s requirement that a new entry starts at the top, which runs on every surface: recorded under Settled, no case and no scenario here, since the site's navigation suite walks it
- **Walked** - `grade10-site-store-product-page-SC-05` by US2-TC1, its four rows the listing's name and photo, the front door's row and the rail
- **Beyond the scenarios** - US2-TC1's step 4 reloads the address it landed on and finds the same card; that an address answers on its own is `grade10-site-store-product-page-SC-01`'s, walked by US1-TC1, and the step stays as this case's check that the address is that card's
- **Out of suite** - which cards open, and from which control, is the surface's rule: a sold-out card on the listing by `grade10-site/store/product-listing`'s US16-TC2, a sold-out card on the front door's row by `grade10-site-store-e2e-US3-TC1-1`
- **Contradicted** - none: where the case and a scenario state the same outcome they agree
- **Carried, not this change's** - `grade10-site-store-product-page-SC-06` and its case US2-TC2 are unchanged on the durable suite
- **QA2, 2026-10-07** - US2-TC1 re-read against `grade10-site-store-product-page-SC-05` at revision 2: nothing contradicted, raised or uncovered, and the case is unchanged
- **Blind** - the 2026-10-06 pass below read this delta's anchors and the rail's page, and rewrote US2-TC1 from the durable case

**Run:** Blind feature pass (QA1) on 2026-10-06 for `activate-listing-tile-by-name`, `grade10-site/store/product-page`. Read the caller's isolated bundle only: the durable Purpose and Feature set and the delta Feature set, the delta `user-journeys.md`, the change's `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with scenario ids stripped, `openspec/config.yaml` context, the PRD pages `grade10-site/store/product-listing`, `grade10-site/store/product-page` and the Product Tile section of `shared/ui/store-product-listing`, the PRD page `grade10-site/store/cross-sell` for the rail, this suite with its Reconciliation stripped and its Settled, and the change's `domain-tcs.md` with its Reconciliation stripped; plus `docs/governance/specs-to-test-cases.md` and `docs/governance/tcs-conventions.md`. Denied and not opened: every Requirements section, `tech-design.md`, `tasks.md`, the rest of `openspec/specs/` and `openspec/changes/`, the archive, and the application repository.
