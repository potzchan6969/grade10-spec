# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

**Out of suite:** shared-ui-store-cart-SC-01 - the store-cart export set in `packages/ui/src/index.test.ts`; shared-ui-store-cart-SC-22 - the type assertions in the same test, run by `pnpm run typecheck`; shared-ui-store-cart-SC-43 - the same test, which finds neither slot export

## Background

* `<shared ui storybook url>` is this store's Storybook, served by `pnpm storybook`; the drawer's stories sit under Store Cart.
* Every line in a cart below holds quantity 1.

## shared-ui-store-cart-US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

<!-- trace:case id=g10.shared-store-cart.TC-nqc rev=2 covers=g10.shared-store-cart.SC-e4c -->
### shared-ui-store-cart-US2-TC1-2: A cart with few lines lists only those lines

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The cart drawer renders `<cart_1>`, loaded, every line active.

**Test data:**

| `<cart_1>` | Lines | Why |
| --- | --- | --- |
| One line | 1 | the smallest cart that is not empty |
| Four lines | 4 | one below the five rows the drawer used to fill |

**Steps:**

1. Open the cart drawer on `<cart_1>`.
2. Look at the drawer body.
3. Look at the header and the footer.

**Expected Results:**

* Step 2 shows exactly the row count in **Lines**.
* No dashed or placeholder row follows the last line.
* No empty state shows.
* No edge fade shows while every line fits in the body.
* Step 3: the count badge reads the row count in **Lines**.
* Footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-5iw rev=2 covers=g10.shared-store-cart.SC-j31,g10.shared-store-cart.SC-utr -->
### shared-ui-store-cart-US2-TC2-2: Overflowing lines scroll with an edge fade

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* None.

**Steps:**

1. Navigate to the Store Cart/CartDrawer Overflow Items story at `<shared ui storybook url>`.
2. Look at the top and bottom edges of the drawer body.
3. Scroll the drawer body to its end.
4. Look at the top and bottom edges again.

**Expected Results:**

* Step 2: a fade at the bottom edge, none at the top.
* Step 3 reaches every line; no placeholder row anywhere.
* Step 4: a fade at the top edge, none at the bottom.

<!-- trace:case id=g10.shared-store-cart.TC-kz7 rev=2 covers=g10.shared-store-cart.SC-xfz -->
### shared-ui-store-cart-US2-TC3-2: An empty cart shows the empty state with its description

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Empty State story supplies `<empty title>` and `<empty description>` on the drawer copy.

**Test data:**

| Field | Value |
| --- | --- |
| `<empty title>` | the story's empty-cart title |
| `<empty description>` | the story's line under that title |

**Steps:**

1. Navigate to the Store Cart/CartDrawer Empty State story at `<shared ui storybook url>`.
2. Look at the drawer body.
3. Look at the header.
4. Look below the body for the footer.

**Expected Results:**

* Step 2 shows a cart icon, then `<empty title>`.
* `<empty description>` shows under the title.
* No button in the body.
* No item row and no placeholder row.
* Step 3: no count badge; the close control still shows.
* Step 4: no footer, no price summary, no Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-7h8 rev=1 covers=g10.shared-store-cart.SC-9dd -->
### shared-ui-store-cart-US2-TC4-1: Sold-out item is excluded from the count badge

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The cart drawer renders `<cart_5>`, loaded.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_5>` | 1 active line and 1 sold-out line |

**Steps:**

1. Open the cart drawer on `<cart_5>`.
2. Look at the header.

**Expected Results:**

* The count badge reads `1`.

<!-- trace:case id=g10.shared-store-cart.TC-6tu rev=1 covers=g10.shared-store-cart.SC-62u -->
### shared-ui-store-cart-US2-TC5-1: An empty cart without a description shows icon and title alone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The cart drawer renders a cart with no lines, loaded.
* The drawer copy supplies `<empty title>` and no empty description.

**Test data:**

| Field | Value |
| --- | --- |
| `<empty title>` | any non-empty title |

**Steps:**

1. Open the cart drawer.
2. Look at the drawer body.

**Expected Results:**

* Cart icon, then `<empty title>`.
* No line under the title, and no blank line in its place.
* No button in the body.

<!-- trace:case id=g10.shared-store-cart.TC-ze9 rev=1 covers=g10.shared-store-cart.SC-tou -->
### shared-ui-store-cart-US2-TC6-1: A cart of only sold-out lines lists them, not the empty state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The cart drawer renders `<cart_2>`, loaded.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_2>` | 2 lines, both sold out, none delisted |

**Steps:**

1. Open the cart drawer on `<cart_2>`.
2. Look at the drawer body.

**Expected Results:**

* Both lines show, each marked sold out.
* No empty state shows.
* No count badge in the header.
* Footer shows the price summary and Checkout.

<!-- trace:case id=g10.shared-store-cart.TC-hqg rev=1 covers=g10.shared-store-cart.SC-xfz -->
### shared-ui-store-cart-US2-TC7-1: Removing the last line turns the drawer to the empty state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The cart drawer is open on `<cart_3>`, loaded, and the consumer drops a line when its remove control is clicked.
* The drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_3>` | 1 active line |
| `<empty title>` | any non-empty title |

**Steps:**

1. Click the remove control on the only line.
2. Look at the drawer body.
3. Look at the header and below the body.

**Expected Results:**

* Step 2: the line is gone; cart icon and `<empty title>` show.
* No placeholder row shows.
* Step 3: no count badge, no footer.
* The drawer stays open.

<!-- trace:case id=g10.shared-store-cart.TC-bzg rev=1 covers=g10.shared-store-cart.SC-gx1 -->
### shared-ui-store-cart-US2-TC8-1: The drawer body composed alone shows the empty state from its own copy

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* The Empty story supplies `<empty title>` and `<empty description>` on the body's own props, not through a drawer.

**Test data:**

| Field | Value |
| --- | --- |
| `<empty title>` | the story's empty-cart title |
| `<empty description>` | the story's line under that title |

**Steps:**

1. Navigate to the Store Cart/CartDrawerBody Empty story at `<shared ui storybook url>`.
2. Look at the body.

**Expected Results:**

* Cart icon, then `<empty title>`, then `<empty description>`.
* No button, no item row, no placeholder row.

---

## shared-ui-store-cart-US3: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

<!-- trace:case id=g10.shared-store-cart.TC-vgm rev=2 covers=g10.shared-store-cart.SC-dvb -->
### shared-ui-store-cart-US3-TC1-2: Opening a cart with lines shows skeletons, never the empty state

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
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* None.

**Steps:**

1. Navigate to the Store Cart/CartDrawer Fetching On Open story at `<shared ui storybook url>`.
2. Click Open Cart.
3. Within the first second, look at the drawer body.
4. Within the same second, look at the header and the footer.

**Expected Results:**

* Step 3: line rows show as skeletons.
* No empty state and no placeholder row.
* Step 4: count badge, subtotal, discount and estimated total show as skeletons.
* Checkout is disabled.

<!-- trace:case id=g10.shared-store-cart.TC-8me rev=1 covers=g10.shared-store-cart.SC-4pd,g10.shared-store-cart.SC-xfz -->
### shared-ui-store-cart-US3-TC2-1: A cart with no lines opened while loading stays blank until the read ends

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-03

**Pre-conditions:**

* The cart drawer opens on a cart with no lines while the status-and-price read is in flight.
* The drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<empty title>` | any non-empty title |

**Steps:**

1. Open the cart drawer.
2. Look at the drawer body.
3. Look at the header and below the body.
4. Let the read finish with no lines.
5. Look at the drawer body and the header.

**Expected Results:**

* Step 2: body is blank; no empty state, no row skeletons.
* Step 3: count badge shows as a skeleton; no footer.
* Step 5: cart icon and `<empty title>` show.
* Count badge gone; still no footer.

---

## shared-ui-store-cart-US6: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

<!-- trace:case id=g10.shared-store-cart.TC-ulg rev=1 covers=g10.shared-store-cart.SC-psl -->
### shared-ui-store-cart-US6-TC4-1: A cart of only delisted lines ends on the empty state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-06

**Pre-conditions:**

* The cart drawer opens on `<cart_4>` while the status-and-price read is in flight.
* The read returns every line of `<cart_4>` as no longer in the catalogue.
* The drawer copy supplies `<empty title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cart_4>` | 2 lines, both delisted |
| `<empty title>` | any non-empty title |

**Steps:**

1. Open the cart drawer.
2. Let the read finish.
3. Look at the drawer body.
4. Look at the header, below the body, and the toasts.

**Expected Results:**

* Step 3: no line of `<cart_4>` shows, not even sold out.
* Cart icon and `<empty title>` show.
* Step 4: no count badge, no footer.
* Exactly one removal toast shows.

## Settled

- A cart of only sold-out lines is not empty: it lists them with the footer and no count badge.
- A cart nobody has read stays loading, never the empty state.

## Reconciliation

- **Folded** — each case agrees with the scenario it reaches: US2-TC1-2 walks `shared-ui-store-cart-SC-23` at one line and four, US2-TC2-2 `shared-ui-store-cart-SC-24`, US2-TC3-2 `shared-ui-store-cart-SC-25`, US2-TC4-1 `shared-ui-store-cart-SC-05`, US2-TC5-1 `shared-ui-store-cart-SC-41`, US3-TC1-2 `shared-ui-store-cart-SC-08`, US3-TC2-1 `shared-ui-store-cart-SC-40` and then `shared-ui-store-cart-SC-25` once the read ends, and US6-TC4-1 `shared-ui-store-cart-SC-42`
- **Folded, edge fade** — US2-TC1-2 and US2-TC2-2 see the fade only at an edge with more lines past it. The durable `shared-ui-store-cart-SC-07` states the `scroll-fade` class; the fade by edge is how the design-system utility draws it, so no scenario is owed
- **Folded, body alone** — US2-TC8-1 walks `shared-ui-store-cart-SC-44`, which serves the export contract group. The case sits under US-02 because a suite's sections are journeys, and the shopper meets the same empty state whether the application composes the drawer or the body
- **Folded as a route** — US2-TC7-1 reaches `shared-ui-store-cart-SC-25` by removing the last line rather than by opening an empty cart. The drawer derives the empty state on every render, so no scenario is owed. Its drawer staying open follows from the dismissal requirement: the drawer closes only by its close control, the backdrop or Escape
- **Raised, landed, folded** — US2-TC6-1 asked what a cart of only sold-out lines shows (R3). A sold-out line stays visible, the badge draws only a positive count, and the footer follows the listed lines. Q8 records it, `shared-ui-store-cart-SC-45` states it, and the badge requirement shows no badge at a count of 0
- **Raised, landed** — US3-TC2-1's blank body asked what a failed first read shows (R4). Q9 has the consumer hold `loading` until it has read the lines, stated in the loading requirement and walked by US3-TC2-1. The Grade10 host ended `loading` on a failed review over a basket it never read; this change fixes the host and proves it with a host test on `shared-ui-store-cart-SC-40`
- **Corrected** — US3-TC1-2 now clicks Open Cart and looks within the first second, since the Fetching On Open story opens closed and its read lasts 0.8 seconds
- **Contradicted** — none
- **Uncovered anchors** — none. `shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-22` and `shared-ui-store-cart-SC-43` are Out of suite, proven by the package's public-entry test and `pnpm run typecheck`; `shared-ui-store-cart-SC-13` stays walked by the durable US6-TC3-1
- **Revised in place** — US2-TC1, US2-TC2, US2-TC3 and US3-TC1 move to revision 2 and carry the durable `trace:case` markers, so the fold replaces the five-row cases. `shared-ui-store-cart-SC-02` to `shared-ui-store-cart-SC-04` retire with the five-row requirement
- **Carried for its marker** — US2-TC4-1 is the durable case restyled, its behaviour unchanged; its marker now covers only the badge scenario
- **Markers** — the delta carries the durable markers of `shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-05`, `shared-ui-store-cart-SC-13` and `shared-ui-store-cart-SC-08`, the last at revision 2. New case and scenario numbers collide with no other active change on the capability

**Run:** Blind feature pass (QA1) on 2026-10-06 for `cart-drawer-empty-state`, `shared/ui/store-cart`. Reconciled (QA2) on 2026-10-06 in a fresh context against the delta `spec.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, `decisions.md`, the Cart Drawer page, the durable spec and suite, the active changes on the capability, the block and its stories at `packages/ui/src/blocks/store-cart/`, and the Grade10 host it cites.
