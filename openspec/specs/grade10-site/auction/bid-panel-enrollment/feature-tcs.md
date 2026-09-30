# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-30, tcs-rules r4

## grade10-site-auction-bid-panel-enrollment-US1: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-53x rev=1 covers=g10.auction-bid-panel-enrollment.SC-sjy,g10.auction-bid-panel-enrollment.SC-o29 -->
### grade10-site-auction-bid-panel-enrollment-US1-TC1-1: Sign-in is offered instead of place bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer(signed out) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | A live lot taking bids, with recent public bids shown |

**Steps:**

1. Read the bid panel on <listing_1 url>.
2. Read the primary bid action.

**Expected Results:**

* The primary action offers sign-in to bid.
* Place bid and link a card are not offered.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-dgs rev=1 covers=g10.auction-bid-panel-enrollment.SC-sjy,g10.auction-bid-panel-enrollment.SC-o29 -->
### grade10-site-auction-bid-panel-enrollment-US1-TC2-1: Standing badges stay hidden while signed out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer(signed out) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | A live lot taking bids, with recent public bids shown |

**Steps:**

1. Read standing badges on the bid panel.
2. Read the recent-bids section.

**Expected Results:**

* Highest-bid and outbid badges are not shown.
* Recent bids stay visible.

---

## grade10-site-auction-bid-panel-enrollment-US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** the panel does not wait for a bid-time authorization that the
backend does not require.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-lqi rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC1-1: Link CTA opens setup when no card is linked

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Read the quick-bid presets and the custom maximum.
2. Read the primary bid action.
3. Click the primary bid action.

**Expected Results:**

* Quick-bid presets and the custom maximum are visible and disabled.
* The primary bid action reads "Link a card to bid".
* The setup modal opens.
* No bid is placed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c5f rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC2-1: Setup requires card and attestation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* The setup modal is open, from the bid action on this lot.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Leave the provider card field empty.
2. Leave age attestation unchecked.
3. Read the continue control.
4. Enter a card in the provider-hosted field.
5. Check age attestation.
6. Read the continue control.

**Expected Results:**

* Continue stays disabled while the card or attestation is missing.
* Continue reads "Link Card", not "Authorize".
* Continue enables once the card and attestation are both set.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-12t rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC3-1: Setup linking locks dismiss and controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) has submitted Link Card on <listing_2 url>.
* The card provider is mocked to leave linking in progress.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Read the continue control.
2. Read the provider field and age attestation.
3. Try to close the setup modal.

**Expected Results:**

* Continue reads "Linking" and is busy.
* The provider field and age attestation are not interactive.
* The setup modal cannot be dismissed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-b5y rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC4-1: Dismissing setup leaves no linked card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Close the setup modal without continuing.
3. Read the linked-card slot.
4. Read the quick-bid presets and the custom maximum.

**Expected Results:**

* No linked card is on file for bidding.
* The empty link prompt is shown.
* Amount controls stay visible and disabled.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-e02 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC5-1: Completing setup unlocks amount controls

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Enter a card in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the linked-card slot.
6. Read the quick-bid presets and the custom maximum.
7. Read the primary bid action.

**Expected Results:**

* The setup modal closes.
* The linked card is shown, with Change available.
* Quick-bid presets and the custom maximum are enabled.
* The primary bid action offers set or raise maximum.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-3e2 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC6-1: Empty linked-card slot opens setup

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* The empty linked-card slot is visible.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click a disabled quick-bid preset.
2. Try to type in the custom maximum.
3. Click the empty card slot.

**Expected Results:**

* The disabled preset does not open setup.
* The custom maximum does not open setup.
* The empty card slot opens the setup modal.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-y2d rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC7-1: Card linking leaves the collector ready to bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* Bid-time holds are off.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Enter a card in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the linked-card slot.
6. Read the quick-bid presets and the custom maximum.

**Expected Results:**

* The linked card is shown, with Change available.
* Quick-bid presets and the custom maximum are enabled at once.
* The panel does not wait for a bid-time hold.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-av0 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC8-1: An accepted bid moves directly to enrolled

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
* The card on file was linked by completing setup.
* Bid-time holds are off.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the custom maximum.
2. Click the bid action.
3. Read the bid panel after the bid is accepted.

**Expected Results:**

* The panel moves straight to enrolled.
* Change is not offered for this listing.
* No hold state is shown.
* The bid continues under auto-bidding and payment authorization.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-0h4 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC9-1: Default setup copy does not promise a bid-time hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* Bid-time holds are off.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Read the setup description.

**Expected Results:**

* The description reads "Link a card for bidding. You're only charged if you win."
* The description does not promise a bid-time hold.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-yrg rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC10-1: Enabled hold setup copy discloses the authorization

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* Bid-time holds are on.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Read the setup description.
3. Read the continue control.

**Expected Results:**

* The description says setting a maximum authorizes a hold.
* Continue reads "Link Card".

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-rik rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC11-1: Default payment-method tooltip does not promise a hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
* The card on file was linked by completing setup.
* Bid-time holds are off.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |

**Steps:**

1. Open the payment-method tooltip on the linked card.
2. Read the tooltip.

**Expected Results:**

* The tooltip authorizes the card for bidding.
* The tooltip does not promise a bid-time hold.

---

## grade10-site-auction-bid-panel-enrollment-US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vr7 rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### grade10-site-auction-bid-panel-enrollment-US3-TC1-1: Change opens the setup modal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
* The card on file was linked by completing setup.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |

**Steps:**

1. Read the linked-card row.
2. Click Change on the linked card.

**Expected Results:**

* The setup modal opens.
* The linked-card row stays visible behind the modal.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-iih rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### grade10-site-auction-bid-panel-enrollment-US3-TC2-1: Change reuses setup copy with prior card shown

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
* The card on file was linked by completing setup.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |

**Steps:**

1. Click Change on the linked card.
2. Read the modal title.
3. Read the modal description.
4. Read the provider field.

**Expected Results:**

* The title reads "Link a card to bid".
* The description says a maximum authorizes a hold, and a charge happens only on a win.
* The provider field shows the card already on file.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-shl rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### grade10-site-auction-bid-panel-enrollment-US3-TC3-1: Attestation is pre-checked when already given

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_4>) is on <listing_4 url>.
* The card on file was linked by completing setup on an earlier lot, with age attestation checked.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_4> | A new open listing this collector has not bid on; the card was linked on an earlier lot, and age was already attested |

**Steps:**

1. Click Change on the linked card.
2. Read age attestation.
3. Enter a card in the provider-hosted field.
4. Read the continue control.

**Expected Results:**

* Age attestation is already checked.
* Continue reads "Link Card" and enables once the card is entered.

---

## grade10-site-auction-bid-panel-enrollment-US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-74a rev=1 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### grade10-site-auction-bid-panel-enrollment-US4-TC1-1: Change is hidden after the first bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked) is on <listing_5 url>.
* The card on file was linked by completing setup.
* This collector's bid was accepted from the bid panel on this lot.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_5> | An open listing taking bids; this collector has a linked card and has placed a bid on it |

**Steps:**

1. Read the linked-card slot on the bid panel.

**Expected Results:**

* The linked card is shown.
* Change is not offered.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-5vi rev=1 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### grade10-site-auction-bid-panel-enrollment-US4-TC2-1: First maximum does not reopen setup

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
* The card on file was linked by completing setup.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the custom maximum.
2. Click the bid action.
3. Check whether the setup modal is open.
4. Read the bid panel.

**Expected Results:**

* The setup modal does not open.
* The bid continues under auto-bidding and payment authorization.

---

## grade10-site-auction-bid-panel-enrollment-US5: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c7l rev=1 covers=g10.auction-bid-panel-enrollment.SC-xwd -->
### grade10-site-auction-bid-panel-enrollment-US5-TC1-1: Card on file carries over to a new lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-05

**Pre-conditions:**

* customer(signed in, no bid on <listing_6>) is on <listing_6 url>.
* The card on file was linked by completing setup on an earlier lot.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_6> | A new open listing this collector has not bid on; the card was linked on an earlier lot |

**Steps:**

1. Read the linked-card slot.
2. Read the quick-bid presets and the custom maximum.
3. Check whether the setup modal is open.

**Expected Results:**

* The linked-card slot shows the card on file, with Change available.
* Quick-bid presets and the custom maximum are enabled.
* The setup modal does not open.
