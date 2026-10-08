# grade10-site/auction/availability Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-08, tcs-rules r4

## grade10-site-auction-availability-US1: Collector in a restricted region shops the store

**As a** collector in a region where auctions are not offered,
**I want** the store and the rest of the site to work as usual,
**so that** the restriction costs me only what I cannot legally have.

### grade10-site-auction-availability-US1-TC1-1: Navigation shows no Auction item

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* A request judged to come from a region where auctions are not offered.

**Steps:**

1. Open any store page.
2. Read the primary navigation on a wide viewport.
3. Open the compact menu drawer on a narrow viewport.

**Expected Results:**

* No Auction item renders in the primary navigation or the drawer.
* Every non-auction navigation item renders unchanged.

### grade10-site-auction-availability-US1-TC2-1: Account menu shows no auction entries

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* A signed-in collector whose request is judged restricted.

**Steps:**

1. Open the account menu.

**Expected Results:**

* No My Auctions, watchlist or auction order entry renders.
* Every non-auction account entry renders unchanged.

### grade10-site-auction-availability-US1-TC3-1: Store and non-auction pages work unchanged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* A request judged restricted.

**Steps:**

1. Browse the store: home, listing, product detail, cart.
2. Check any page for a watch control, bid panel or auction link.

**Expected Results:**

* Each store page renders and works as it does for an unrestricted
  collector.
* No watch control, bid panel or auction call-to-action renders anywhere.

### grade10-site-auction-availability-US1-TC4-1: Moving to an unrestricted region restores auctions

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* A collector whose earlier request in the same session was judged
  restricted, now requesting from an unrestricted region.

**Steps:**

1. Load the store home from the unrestricted region.

**Expected Results:**

* The Auction navigation item and every auction surface return for the new
  request; the earlier restricted verdict is not carried.

## grade10-site-auction-availability-US2: Collector in a restricted region opens an auction link

**As a** collector in a restricted region who followed an auction link,
**I want** a page that says auctions are not available to me and points me at
the store,
**so that** a shared link or an email never lands me on a broken page.

### grade10-site-auction-availability-US2-TC1-1: The catalogue address answers the restriction page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* A request judged restricted.

**Steps:**

1. Enter the auction catalogue address directly.

**Expected Results:**

* The restriction page renders: it names that auctions are not available in
  the collector's region and offers a link to the store.
* It is not the not-found surface and not the catalogue.

### grade10-site-auction-availability-US2-TC2-1: A lot address answers the restriction page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* A request judged restricted; a live lot with a public address.

**Steps:**

1. Enter the lot's address directly, as an email or shared link would.

**Expected Results:**

* The restriction page renders rather than the lot — no gallery, status or
  bid panel is served.

### grade10-site-auction-availability-US2-TC3-1: Account auction addresses answer the restriction page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* A signed-in collector whose request is judged restricted; open items —
  My Auctions, the watchlist, a winner order — awaiting the ❓ decision on
  whether commitments already made keep read access.

**Steps:**

1. Enter the My Auctions address.
2. Enter a winner-order address.

**Expected Results:**

* Each answers the restriction page, or — if the ❓ decision lands on
  read-only access — a read-only rendering of the commitment with no action
  controls. This case is **Blocked:** the open-commitments decision on the
  Bidding page, owed by Product.

## grade10-site-auction-availability-US3: Collector in a restricted region tries to act on an auction

**As a** collector in a restricted region who sends a bid, a watch or an
order action anyway,
**I want** the action refused before it reaches the auction,
**so that** no commitment is recorded that cannot be settled.

### grade10-site-auction-availability-US3-TC1-1: A sent bid records nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* A live lot; a bid sent from a restricted region by any client, not only
  the site.

**Steps:**

1. Send the bid against the lot.

**Expected Results:**

* The bid is refused.
* The lot's price, leader and maximums do not change; no bid, watch or
  My Auctions row is recorded.

### grade10-site-auction-availability-US3-TC2-1: A sent watch or order action records nothing

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* A watch, unwatch or winner-order action sent from a restricted region.

**Steps:**

1. Send each action.

**Expected Results:**

* Each is refused; no watch or order change is recorded.

### grade10-site-auction-availability-US3-TC3-1: An auction read opened by hand returns nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* A request for auction data — a lot read, a standing read, a live-update
  channel — from a restricted region.

**Steps:**

1. Request the read or open the channel directly.

**Expected Results:**

* It is refused and no lot, standing or order data is returned.

## grade10-site-auction-availability-US4: Collector in an unrestricted region uses auctions

**As a** collector in a region where auctions are offered,
**I want** every auction surface to work exactly as it does today,
**so that** a rule meant for other regions never touches me.

### grade10-site-auction-availability-US4-TC1-1: Unrestricted requests see every auction surface

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-04

**Pre-conditions:**

* A request from a region where auctions are offered.

**Steps:**

1. Open the catalogue, a lot, and the account menu.

**Expected Results:**

* Every auction surface renders exactly as before the change; the
  restriction page never appears.

### grade10-site-auction-availability-US4-TC2-1: A missing region signal fails open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-04

**Pre-conditions:**

* A request whose region cannot be judged — no signal, or an unreadable one.

**Steps:**

1. Open the auction catalogue.

**Expected Results:**

* The catalogue renders normally: an unreadable signal never locks a
  collector out.

## Settled

None yet — this is the suite's first run.

## Reconciliation

- **Raised** — whether an auction data read or live-update channel from a
  restricted region is refused the way a mutation is: folded as
  `grade10-site-auction-availability-SC-11a`, walked by
  `grade10-site-auction-availability-US3-TC3-1`
- **Raised** — whether the restriction page is indexable or emits `noindex`:
  escalated, ❓ on the Auction Display page owed by Product
- **Deferred** — what a restricted signed-in collector with a standing bid,
  watched lot or unpaid invoice still sees: ❓ on the Bidding page owed by
  Product; `grade10-site-auction-availability-US2-TC3-1` stays **Blocked**
  on that answer
- **Uncovered anchors** — none: every journey carries at least one case

**Run:** Read only the isolated bundle — the capability's `## Purpose` and
`## Feature set`, `user-journeys.md`, `decisions.md`, `ui-design.md`, the
Auction Display and Bidding pages, and `openspec/config.yaml` context —
plus `docs/governance/specs-to-test-cases.md` for shape; denied the
capability's `## Requirements`, every other spec under `openspec/`, and
`openspec/changes/archive/`.
