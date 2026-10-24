# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** pending-review · 13/20
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page on the Grade10 site of the environment under test carries the bid panel: quick-bid presets, the custom maximum, the primary bid action and the linked-card slot. Card setup opens in a modal whose card field is the card provider's.
* Card details are the provider's test cards: any future expiry, such as 12/34, any postal code, such as 10101, and any CVC of the card's length, such as 123.

## Walk 1: Sign in, link a card, change it, bid, and move to another listing

Starting state:

- customer is signed out on `<listing a>`'s page; the account has no linked card and has not attested its age.
- `<listing b>` is open too; customer has bid on neither.

Shared test data:

| Field | Value |
| --- | --- |
| listing a | An open USD listing with recent public bids and no other bidder at the next valid bid |
| listing b | Another open USD listing |
| declining card | 4000 0000 0000 0002, the provider's generic-decline Visa |
| good card | 4242 4242 4242 4242, the provider's successful Visa |
| other card | 5555 5555 5555 4444, a Mastercard |

### Route

1. Read the bid panel.
   - The primary action offers sign-in to bid, with no Place bid or link-a-card offer. `g10.auction-bid-panel-enrollment.US1-TC1`
   - No highest-bid or outbid badge shows, and Recent bids stays. `g10.auction-bid-panel-enrollment.US1-TC2`
2. Sign in and read the bid panel.
   - The presets and the custom maximum show, disabled, and the primary action reads "Link a card to bid". `g10.auction-bid-panel-enrollment.US2-TC1`
3. Select the primary action and read the modal.
   - Setup opens, and no bid is placed. `g10.auction-bid-panel-enrollment.US2-TC1`
   - The title reads "Link a card to bid", the description says the card is charged only on a win and names no hold, and Continue reads "Link Card". `g10.auction-bid-panel-enrollment.US2-TC15`
4. Read Continue with the card field empty and the age attestation unchecked; then enter `<good card>` and tick the attestation.
   - Continue stays disabled until both are set, then enables, still reading "Link Card". `g10.auction-bid-panel-enrollment.US2-TC2`
5. Close the modal without continuing and read the panel.
   - The empty link prompt shows, and the amount controls stay disabled. `g10.auction-bid-panel-enrollment.US2-TC4`
6. Select a disabled preset, then try to type a maximum, then select the empty card slot.
   - Neither the preset nor the field opens setup; the empty slot does. `g10.auction-bid-panel-enrollment.US2-TC6`
7. Enter `<declining card>`, tick the attestation and select Link Card; then replace it with `<good card>` and select Link Card.
   - The first attempt shows a failure and keeps the modal open. `g10.auction-bid-panel-enrollment.US2-TC13`
   - The retry closes the modal, the slot shows `<good card>` with Change, and the presets and the custom maximum are enabled at once. `g10.auction-bid-panel-enrollment.US2-TC13`
   - The primary action offers to set a maximum, and nothing shows against `<good card>` at the card provider. `g10.auction-bid-panel-enrollment.US2-TC5`
8. Select Change on the linked card and read the modal.
   - The modal opens over the still-visible card row. `g10.auction-bid-panel-enrollment.US3-TC1`
   - It keeps its title and charged-only-on-a-win description, and the card field shows the card on file. `g10.auction-bid-panel-enrollment.US3-TC2`
   - The age attestation is already ticked; entering `<other card>` enables Link Card. `g10.auction-bid-panel-enrollment.US3-TC3`
9. Close the modal, enter the next valid bid in the custom maximum, and select the bid action.
   - Setup does not open, and the panel answers Leading with the maximum and the current bid, with no Authorizing state between. `g10.auction-bid-panel-enrollment.US4-TC2`
   - The answer is Leading in one step. `g10.auction-bid-panel-enrollment.US2-TC16`
   - The linked card stays, and Change is no longer offered. `g10.auction-bid-panel-enrollment.US2-TC8`
10. Reload `<listing a>` and read the linked-card slot.
    - The card shows, with no Change. `g10.auction-bid-panel-enrollment.US4-TC1`
11. Open `<listing b>` and read the bid panel.
    - The slot shows the card on file with Change, the amount controls are enabled, and no setup opens. `g10.auction-bid-panel-enrollment.US5-TC1`

## g10.auction-bid-panel-enrollment.US1: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-8ml rev=1 -->
### g10.auction-bid-panel-enrollment.US1-TC1: A signed-out collector is offered sign-in instead of a bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer is signed out on `<listing_2>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A live listing with recent public bids |

**Steps:**

1. Read the bid panel's primary action.

**Expected Results:**

* It offers sign-in to bid; neither Place bid nor link-a-card is offered.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-dgs rev=1 covers=g10.auction-bid-panel-enrollment.SC-sjy,g10.auction-bid-panel-enrollment.SC-o29 -->
### g10.auction-bid-panel-enrollment.US1-TC2: Standing badges stay hidden while signed out

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer is signed out on `<listing_4>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A live listing with recent public bids |

**Steps:**

1. Read the bid panel's badges and Recent bids.

**Expected Results:**

* No highest-bid or outbid badge shows, and Recent bids stays.

---

## g10.auction-bid-panel-enrollment.US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** I can bid the moment the card is linked.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-lqi rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC1: With no card linked, the primary action opens setup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_6>`'s page.

**Steps:**

1. Read the presets, the custom maximum and the primary action.
2. Select the primary action.

**Expected Results:**

* Step 1 shows the presets and the custom maximum disabled, and the primary action reading "Link a card to bid".
* Step 2 opens setup, and no bid is placed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c5f rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC2: Setup needs both a card and the age attestation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) has setup open from `<listing_8>`'s bid action.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | 4242 4242 4242 4242, the provider's successful Visa |

**Steps:**

1. With the card field empty and the attestation unticked, read Continue.
2. Enter `<card>` and tick the attestation, then read Continue.

**Expected Results:**

* Step 1's Continue is disabled and reads "Link Card", not "Authorize".
* Step 2's Continue is enabled.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-b5y rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC4: Closing setup leaves no card linked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_12>`'s page.

**Steps:**

1. Select the primary action, then close setup without continuing.
2. Read the linked-card slot and the amount controls.

**Expected Results:**

* The empty link prompt shows, no card is on file, and the amount controls stay disabled.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-e02 rev=3 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC5: A linked card leaves the panel ready to bid at once, taking nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_14>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | 4242 4242 4242 4242, the provider's successful Visa |

**Steps:**

1. Select the primary action, enter `<card>`, tick the attestation and select Link Card.
2. Read the linked-card slot, the amount controls and the primary action.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* Step 1 closes setup.
* Step 2 shows the card with Change, the controls enabled at once, and the primary action offering to set or raise a maximum.
* Step 3 shows nothing taken from the card.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-3e2 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC6: Only the empty card slot opens setup

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_16>`'s page, its empty card slot showing.

**Steps:**

1. Select a disabled preset.
2. Try to type in the custom maximum.
3. Select the empty card slot.

**Expected Results:**

* Steps 1 and 2 do not open setup; step 3 does.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-av0 rev=2 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC8: An accepted bid locks the card's Change

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_20>` and is on its page.

**Steps:**

1. Enter the next valid bid in the custom maximum and select the bid action.
2. Read the linked-card slot once the bid is accepted.

**Expected Results:**

* Step 1 answers with the standing, with no Authorizing state between.
* Step 2 shows the card, with no Change.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-cld rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC13: A retry after a refused card completes the link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_30>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<declining card>` | 4000 0000 0000 0002, the provider's generic-decline Visa |
| `<good card>` | 4242 4242 4242 4242, the provider's successful Visa |

**Steps:**

1. Select the primary action, enter `<declining card>`, tick the attestation and select Link Card.
2. Replace the card with `<good card>` and select Link Card.
3. Read the linked-card slot and the amount controls.

**Expected Results:**

* Step 1 shows a failure and keeps setup open.
* Step 2 closes setup.
* Step 3 shows `<good card>` with Change, and the controls enabled.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-ywm rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC15: Setup says the card is charged only on a win

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_34>`'s page.

**Steps:**

1. Select the primary action and read the title, the description and Continue.

**Expected Results:**

* The title reads "Link a card to bid", the description says the card is charged only on a win and names no hold or authorization, and Continue reads "Link Card".

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vbn rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC16: A committed maximum answers with its standing in one step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_36>`, which is `<setup>`, and is on its page.

**Test data:**

| `<setup>` | `<standing>` |
| --- | --- |
| Open with no bid, starting at `<opening price>` | Leading |
| Open, led by customer B with a maximum of `<rival maximum>`, current bid `<opening price>` | Outbid, with the next valid bid |

| Field | Value |
| --- | --- |
| `<opening price>` | USD280 (range: 20000–49999 minor units) |
| `<maximum>` | USD560 (range: 50000–83999 minor units), below `<rival maximum>` |
| `<rival maximum>` | USD840 (range: 84000–399999 minor units) |

**Steps:**

1. Enter `<maximum>` in the custom maximum and select the bid action.
2. Watch the panel until it settles.

**Expected Results:**

* The panel shows `<standing>` in one answer, with no Authorizing or other state between.

---

## g10.auction-bid-panel-enrollment.US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vr7 rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC1: Change opens setup over the card row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_38>` and is on its page.

**Steps:**

1. Select Change on the linked card.

**Expected Results:**

* Setup opens, and the card row stays visible behind it.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-iih rev=2 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC2: Changing the card keeps setup's words and shows the card on file

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_40>` and is on its page.

**Steps:**

1. Select Change and read the title, the description and the card field.

**Expected Results:**

* The title reads "Link a card to bid", the description says the card is charged only on a win and names no hold, and the card field shows the card on file.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-shl rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC3: An age already attested arrives ticked

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked on an earlier listing, age attested) has not bid on `<listing_42>` and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<other card>` | 5555 5555 5555 4444, a Mastercard unlike the card on file |

**Steps:**

1. Select Change and read the attestation.
2. Enter `<other card>` and read Continue.

**Expected Results:**

* Step 1's attestation is already ticked.
* Step 2's Continue reads "Link Card" and is enabled.

---

## g10.auction-bid-panel-enrollment.US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-74a rev=1 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC1: Change is gone after the first bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked) placed an accepted bid on `<listing_44>` from its bid panel and is on its page.

**Steps:**

1. Read the linked-card slot.

**Expected Results:**

* The card shows, with no Change.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-5vi rev=2 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC2: A first maximum leaves setup closed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_46>`, which has no other bidder, and is on its page.

**Steps:**

1. Enter the next valid bid in the custom maximum and select the bid action.
2. Read the panel.

**Expected Results:**

* Setup does not open.
* The panel shows Leading, with the maximum and the current bid.

---

## g10.auction-bid-panel-enrollment.US5: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c7l rev=1 covers=g10.auction-bid-panel-enrollment.SC-xwd -->
### g10.auction-bid-panel-enrollment.US5-TC1: A card on file carries over to a new listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-05

**Pre-conditions:**

* customer(signed in) linked a card on `<listing_48>`, `<activity there>`, has not bid on `<listing_49>`, and is on its page.

**Test data:**

| `<activity there>` |
| --- |
| placing no bid |
| then placing an accepted bid, so Change is gone there |

| Field | Value |
| --- | --- |
| `<listing_48>` | An open listing other than `<listing_49>` |
| `<listing_49>` | A new open listing |

**Steps:**

1. Read the linked-card slot, the amount controls, and whether setup opens.

**Expected Results:**

* The slot shows the card on file with Change, the controls are enabled, and setup does not open.

## Ungrouped

### g10.auction-bid-panel-enrollment.US2: Collector links a card when none is on file

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-12t rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC3: Setup locks while linking is in progress

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) selected Link Card on `<listing_10>`'s setup, and the card provider is made to hold the link in progress.

**Steps:**

1. Read Continue, the card field and the attestation.
2. Try to close setup.

**Expected Results:**

* Continue reads "Linking" and is busy; the card field and the attestation do not respond.
* Setup cannot be closed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-aoq rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC12: A refused card keeps setup open and links nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_28>`'s page.

**Test data:**

| `<card>` | `<provider answer>` |
| --- | --- |
| 4000 0000 0000 0002 | Declined by the issuer |
| 4000 0000 0000 0069 | Refused as expired |
| 4000 0000 0000 0127 | Refused for the CVC |
| 4000 0000 0000 0119 | The provider fails to process it |

**Steps:**

1. Select the primary action, enter `<card>`, tick the attestation and select Link Card; read setup.
2. Select the card field, then untick the attestation.
3. Close setup and read the card slot, the amount controls and the primary action.

**Expected Results:**

* Step 1 keeps setup open and shows a failure.
* Step 2: the card field takes focus, and the attestation unticks.
* Step 3 shows the empty link prompt, the controls disabled, and "Link a card to bid".

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-8yx rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC14: Card brands beyond Visa link through setup

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_32>`'s page.

**Test data:**

| `<brand>` | `<card>` | `<cvc>` |
| --- | --- | --- |
| Mastercard | 5555 5555 5555 4444 | 123 |
| American Express | 3782 822463 10005 | 1234, four digits |
| JCB | 3566 0020 2036 0505 | 123 |
| UnionPay | 6200 0000 0000 0005 | 123 |

**Steps:**

1. Select the primary action, enter `<card>` with `<cvc>`, tick the attestation and select Link Card.
2. Read setup and the linked-card slot.

**Expected Results:**

* Step 1 completes the link, or shows a failure; the tester notes which for `<brand>`.
* Step 2: a linked card shows `<brand>` in the slot.
* A refused brand is reported to the spec's author, not failed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-y2d rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC7: Card linking leaves the collector ready to bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Retirement:** Bid-time holds are retired, so no panel waits for one; replaced by `g10.auction-bid-panel-enrollment.US2-TC5`

**Pre-conditions:**

* Bid-time holds are off.

**Steps:**

1. Link a card through setup.

**Expected Results:**

* The panel does not wait for a bid-time hold.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-0h4 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC9: Default setup copy does not promise a bid-time hold

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Retirement:** Bid-time holds are retired; replaced by `g10.auction-bid-panel-enrollment.US2-TC15`

**Pre-conditions:**

* Bid-time holds are off.

**Steps:**

1. Read the setup description.

**Expected Results:**

* It does not promise a bid-time hold.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-yrg rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC10: Enabled hold setup copy discloses the authorization

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Retirement:** Bid-time holds are retired, so no setup copy discloses one; removed behaviour.

**Pre-conditions:**

* Bid-time holds are on.

**Steps:**

1. Read the setup description.

**Expected Results:**

* It says setting a maximum authorizes a hold.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-rik rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
#### g10.auction-bid-panel-enrollment.US2-TC11: Default payment-method tooltip does not promise a hold

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Retirement:** Bid-time holds are retired; replaced by `g10.auction-bid-panel-enrollment.US2-TC15`

**Pre-conditions:**

* Bid-time holds are off.

**Steps:**

1. Read the payment-method tooltip.

**Expected Results:**

* It does not promise a bid-time hold.

## Settled

- Setup links a card and takes nothing from it, and a committed maximum answers Leading, Outbid or the refusal with no authorization state between.
- The setup description and the Change modal say the card is charged only on a win, in the words the Bidding page decides.
- What the bid form says for a refused bid belongs to `grade10-site/auction/auction` and `grade10-site/auction/bid-payment-method`, not this suite.
