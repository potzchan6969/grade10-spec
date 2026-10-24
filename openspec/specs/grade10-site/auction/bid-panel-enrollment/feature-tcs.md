# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** reopened · 5/9
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page carries the bid panel: quick-bid presets, the custom maximum, the primary bid action and the linked-card slot. Card setup opens in a modal titled "Link a card to bid", with the card provider's card field and the age attestation.
* Cards are the provider's test cards, any future expiry such as 12/34, any postal code such as 10101, and a CVC of the card's length.
* Linking a card takes nothing from it, and a bid takes no hold.

## Walk 1: Sign in, link a card, change it, bid, and move to another listing

Starting state:

- customer has an account with no card linked, and is signed out on `<listing A>`'s page.

Shared test data:

| Field | Value |
| --- | --- |
| listing A | An open USD listing with no bid, starting at USD280 |
| listing B | Another open USD listing |
| card | 4242 4242 4242 4242 |
| other card | 5555 5555 5555 4444 |

### Route

1. Select the primary bid action and sign in.
   - Sign-in is offered first, with no standing badge shown. `g10.auction-bid-panel-enrollment.US1-TC1`
2. Select the primary action, enter `<card>`, tick the attestation and select Link Card.
   - The panel is ready to bid, the card in its slot with Change, nothing taken. `g10.auction-bid-panel-enrollment.US2-TC5`
3. Select Change, enter `<other card>` and link it.
   - Setup's words, the card on file shown, the attestation already ticked. `g10.auction-bid-panel-enrollment.US3-TC1`
4. Place a maximum of USD560.
   - Leading in one step, with no authorizing state; Change is gone. `g10.auction-bid-panel-enrollment.US4-TC2`
5. Open `<listing B>`.
   - The card carries over, with Change, the controls enabled. `g10.auction-bid-panel-enrollment.US5-TC1`

## g10.auction-bid-panel-enrollment.US1: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-8ml rev=1 -->
### g10.auction-bid-panel-enrollment.US1-TC1: A signed-out visitor is offered sign-in, and sees no standing badge

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* A signed-out visitor with an account is on `<listing>`'s page, live with public bids.

**Steps:**

1. Read the bid panel's badges and Recent bids.
2. Select the primary bid action, and sign in.

**Expected Results:**

* Step 1 shows no highest-bid or outbid badge, and Recent bids as for anyone.
* Step 2 offers sign-in before any bid, and returns to `<listing>`.

---

## g10.auction-bid-panel-enrollment.US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** I can bid the moment the card is linked.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-lqi rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC1: With no card linked, only the primary action and the empty slot open setup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no card linked) is on `<listing>`'s page.

**Steps:**

1. Read the amount controls, then select a preset and type in the custom maximum.
2. Select the primary action, close setup, then select the empty card slot.

**Expected Results:**

* Step 1: the controls show but are disabled, and nothing opens setup.
* Step 2: each opens setup.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c5f rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC2: Setup asks for a card and the attestation, says a card is charged only on a win, and locks while linking

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

**Pre-conditions:**

* customer(signed in, no card linked) has setup open from `<listing>`'s bid action; the provider is made to hold the link in progress at step 3.

**Steps:**

1. Read the title, the description and Continue, with the card field empty and the attestation unticked.
2. Enter 4242 4242 4242 4242 and tick the attestation, and read Continue.
3. Select Link Card, then read setup and try to close it.

**Expected Results:**

* Step 1: "Link a card to bid", a description saying the card is charged only on a win and naming no hold or authorization, and Continue reading Link Card, disabled.
* Step 2: Continue is enabled.
* Step 3: Continue reads Linking and is busy, the card field and attestation do not respond, and setup cannot be closed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-b5y rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC4: Closing setup, or a refused card, links nothing

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

* customer(signed in, no card linked) is on `<listing>`'s page.

**Test data:**

| `<attempt>` | `<setup shows>` |
| --- | --- |
| Open setup, enter 4242 4242 4242 4242 and close without continuing | nothing more |
| Link 4000 0000 0000 0002 | a decline by the issuer |
| Link 4000 0000 0000 0069 | the card expired |
| Link 4000 0000 0000 0127 | a CVC refusal |
| Link 4000 0000 0000 0119 | a failure to process |

**Steps:**

1. Make `<attempt>`, with the attestation ticked, and read setup.
2. Close setup and read the card slot, the amount controls and the primary action.

**Expected Results:**

* Step 1 shows `<setup shows>`, setup staying open after a refusal.
* Step 2: the slot is empty, the controls disabled, and the primary action still opens setup.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-e02 rev=3 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC5: A linked card leaves the panel ready to bid at once, taking nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no card linked) is on `<listing>`'s page, `<before>`.

**Test data:**

| `<card>` | `<brand>` | `<before>` |
| --- | --- | --- |
| 4242 4242 4242 4242 | Visa | with no attempt yet |
| 4242 4242 4242 4242 | Visa | after 4000 0000 0000 0002 was declined in the same setup |
| 5555 5555 5555 4444 | Mastercard | with no attempt yet |
| 3782 822463 10005, CVC 1234 | American Express | with no attempt yet |
| 3566 0020 2036 0505 | JCB | with no attempt yet |
| 6200 0000 0000 0005 | UnionPay | with no attempt yet |

**Steps:**

1. Link `<card>` with the attestation ticked.
2. Read the panel, and the card on the provider's test dashboard.

**Expected Results:**

* Setup closes; the slot shows `<brand>` with Change, the amount controls are enabled, and the dashboard shows nothing taken.
* A brand the provider refuses is reported to the spec's author, not failed.

---

## g10.auction-bid-panel-enrollment.US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vr7 rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC1: Change opens the same setup over the card on file, the age already ticked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in) linked 4242 4242 4242 4242 and attested age on an earlier listing, and has not bid on `<listing>`, on whose page it is.

**Steps:**

1. Select Change and read setup.
2. Enter 5555 5555 5555 4444 and select Link Card.

**Expected Results:**

* Step 1: the same title and description, the card field showing the card on file, and the attestation already ticked.
* Step 2 links the Mastercard; the slot shows it with Change.

---

## g10.auction-bid-panel-enrollment.US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-5vi rev=2 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC2: A first maximum answers with its standing in one step and leaves setup closed

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing>`, which is `<setup>`, and is on its page.

**Test data:**

| `<setup>` | `<standing>` |
| --- | --- |
| open with no bid, starting at USD280 | Leading |
| led by customer B with a maximum of USD840, at USD280 | Outbid, with the next valid bid |

**Steps:**

1. Place a maximum of USD560 and watch the panel until it settles.

**Expected Results:**

* It reads `<standing>` in one step, with no authorizing or confirming state, and setup does not open.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-74a rev=1 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC1: Change is gone once a bid on the listing is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing>` and is on its page, the slot showing Change.

**Steps:**

1. Place the next valid bid.
2. Read the slot, and reload.

**Expected Results:**

* The slot shows the card on file with no Change, before and after the reload.

---

## g10.auction-bid-panel-enrollment.US5: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c7l rev=1 covers=g10.auction-bid-panel-enrollment.SC-xwd -->
### g10.auction-bid-panel-enrollment.US5-TC1: A card on file carries over to a new listing, ready to bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-05

**Pre-conditions:**

* customer(signed in) linked a card on `<listing A>`, `<activity there>`, and has not bid on `<listing B>`, on whose page it is.

**Test data:**

| `<activity there>` |
| --- |
| placing no bid |
| then placing an accepted bid, so Change is gone there |

**Steps:**

1. Read the slot, the amount controls, and whether setup opens.

**Expected Results:**

* The slot shows the card on file with Change, the controls are enabled, and setup does not open.
