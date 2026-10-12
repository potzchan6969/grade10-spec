# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** pending-review · 13/20
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Link a card and return ready to bid — phase 1

**Starting state:**

- customer(signed out) is on <listing_1 url>.
- customer(signed in, no linked card) is on <listing_2 url>.
- The setup modal is open, from the bid action on this listing.
- customer(signed in, no linked card) has submitted Link Card on <listing_2 url>.
- The card provider is mocked to leave linking in progress.

**Shared test data:**

| Item | Value |
| --- | --- |
| <listing_1> | A live listing taking bids, with recent public bids shown |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

### Route

1. Read the bid panel on <listing_1 url>.
   - The primary action offers sign-in to bid. g10.auction-bid-panel-enrollment.US1-TC1
2. Read the primary bid action.
   - Place bid and link a card are not offered. g10.auction-bid-panel-enrollment.US1-TC1
3. Read standing badges on the bid panel.
   - Highest-bid and outbid badges are not shown. g10.auction-bid-panel-enrollment.US1-TC2
4. Read the recent-bids section.
   - Recent bids stay visible. g10.auction-bid-panel-enrollment.US1-TC2
5. Read the quick-bid presets and the custom maximum.
6. Read the primary bid action.
7. Click the primary bid action.
   - Quick-bid presets and the custom maximum are visible and disabled. g10.auction-bid-panel-enrollment.US2-TC1
   - The primary bid action reads "Link a card to bid". g10.auction-bid-panel-enrollment.US2-TC1
   - The setup modal opens. g10.auction-bid-panel-enrollment.US2-TC1
   - No bid is placed. g10.auction-bid-panel-enrollment.US2-TC1
8. Leave the provider card field empty.
9. Leave age attestation unchecked.
10. Read the continue control.
11. Enter <the successful Visa> in the provider-hosted field.
12. Check age attestation.
13. Read the continue control.
   - Continue stays disabled while the card or attestation is missing. g10.auction-bid-panel-enrollment.US2-TC2
   - Continue reads "Link Card", not "Authorize". g10.auction-bid-panel-enrollment.US2-TC2
   - Continue enables once the card and attestation are both set. g10.auction-bid-panel-enrollment.US2-TC2
14. Read the continue control.
   - Continue reads "Linking" and is busy. g10.auction-bid-panel-enrollment.US2-TC3
15. Read the provider field and age attestation.
   - The provider field and age attestation are not interactive. g10.auction-bid-panel-enrollment.US2-TC3
16. Try to close the setup modal.
   - The setup modal cannot be dismissed. g10.auction-bid-panel-enrollment.US2-TC3
17. Click the primary bid action.
18. Close the setup modal without continuing.
19. Read the linked-card slot.
20. Read the quick-bid presets and the custom maximum.
   - No linked card is on file for bidding. g10.auction-bid-panel-enrollment.US2-TC4
   - The empty link prompt is shown. g10.auction-bid-panel-enrollment.US2-TC4
   - Amount controls stay visible and disabled. g10.auction-bid-panel-enrollment.US2-TC4
21. Click the primary bid action.
22. Enter `<the successful Visa>` in the provider-hosted field.
23. Check age attestation.
24. Click Link Card.
25. Read the linked-card slot.

## Walk 2: Link a card and return ready to bid — phase 2

**Starting state:**

- customer(signed in, no linked card) is on <listing_2 url>.
- The empty linked-card slot is visible.

**Shared test data:**

| Item | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| Expiry, CVC, postal code | Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| Item | Field: `<the refused card>`; Value: Card number; Value 3: Provider answer |
| Item | Field: Generic decline; Value: 4000 0000 0000 0002; Value 3: Declined by the issuer |
| Item | Field: Expired card; Value: 4000 0000 0000 0069; Value 3: Refused as expired |
| Item | Field: Incorrect CVC; Value: 4000 0000 0000 0127; Value 3: Refused for the CVC |
| Item | Field: Processing error; Value: 4000 0000 0000 0119; Value 3: Provider fails to process |
| <the declining Visa> | 4000 0000 0000 0002, the provider's generic-decline test card. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

### Route

1. Read the quick-bid presets and the custom maximum.
2. Read the primary bid action.
3. Check the card's activity at the card provider.
   - The setup modal closes. g10.auction-bid-panel-enrollment.US2-TC5
   - The linked-card slot shows the linked card, with Change available. g10.auction-bid-panel-enrollment.US2-TC5
   - Quick-bid presets and the custom maximum are enabled at once. g10.auction-bid-panel-enrollment.US2-TC5
   - The primary bid action offers set or raise maximum. g10.auction-bid-panel-enrollment.US2-TC5
   - Setup takes nothing from the card. g10.auction-bid-panel-enrollment.US2-TC5
4. Click a disabled quick-bid preset.
   - The disabled preset does not open setup. g10.auction-bid-panel-enrollment.US2-TC6
5. Try to type in the custom maximum.
   - The custom maximum does not open setup. g10.auction-bid-panel-enrollment.US2-TC6
6. Click the empty card slot.
   - The empty card slot opens the setup modal. g10.auction-bid-panel-enrollment.US2-TC6
7. Click the primary bid action.
8. Enter <the refused card> in the provider-hosted field.
9. Check age attestation.
10. Click Link Card.
11. Read the setup modal.
   - the setup modal stays open, and a failure is shown. g10.auction-bid-panel-enrollment.US2-TC12
12. Click into the provider-hosted field.
   - the provider field accepts focus. g10.auction-bid-panel-enrollment.US2-TC12
13. Uncheck age attestation.
   - age attestation unchecks. g10.auction-bid-panel-enrollment.US2-TC12
14. Close the setup modal.
15. Read the linked-card slot.
   - the empty link prompt is shown. g10.auction-bid-panel-enrollment.US2-TC12
16. Read the quick-bid presets and the custom maximum.
   - presets and the custom maximum are visible and disabled. g10.auction-bid-panel-enrollment.US2-TC12
17. Read the primary bid action.
   - the primary bid action reads "Link a card to bid". g10.auction-bid-panel-enrollment.US2-TC12
18. Click the primary bid action.
19. Enter `<the declining Visa>` in the provider-hosted field.
20. Check age attestation.
21. Click Link Card.
22. Replace the card with `<the successful Visa>`.
23. Click Link Card.
24. Read the linked-card slot.
25. Read the quick-bid presets and the custom maximum.
   - The first link attempt shows a failure and leaves the setup modal open. g10.auction-bid-panel-enrollment.US2-TC13
   - The successful retry closes the setup modal. g10.auction-bid-panel-enrollment.US2-TC13
   - The linked-card slot shows the successful card, with Change available. g10.auction-bid-panel-enrollment.US2-TC13
   - Quick-bid presets and the custom maximum are enabled. g10.auction-bid-panel-enrollment.US2-TC13

## Walk 3: Link a card and return ready to bid — phase 3

**Starting state:**

- customer(signed in, no linked card) is on `<listing_2 url>`.
- customer(signed in, no linked card) is on <listing_2 url>.
- customer(signed in, card linked on <the earlier listing>, no bid on <listing_6>) is on <listing_6 url>.

**Shared test data:**

| Item | Value |
| --- | --- |
| listing_2 | An open listing taking bids; this collector has no linked card |
| Expiry, CVC, postal code | Any future expiry, such as 12/34, any CVC of the brand's length (4 digits for American Express, 3 otherwise), and any postal code |
| `<the brand card>` | Card number |
| Mastercard | 5555 5555 5555 4444 |
| American Express | 3782 822463 10005 |
| JCB | 3566 0020 2036 0505 |
| UnionPay | 6200 0000 0000 0005 |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <listing_6> | A new open listing this collector has not bid on; the card was linked on an earlier listing |
| Item | Field: `<the earlier listing>`; Value: What this collector did there; Value 3: Change on <listing_6> |
| Item | Field: Another open listing; Value: Linked the card through setup, placed no bid; Value 3: Offered |
| Item | Field: Another open listing; Value: Linked the card through setup, then placed an accepted bid, so Change is no longer offered there; Value 3: Offered |

### Route

1. Click the primary bid action.
2. Enter `<the brand card>` in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
   - the link completes, or a failure is shown; note which per brand. g10.auction-bid-panel-enrollment.US2-TC14
5. Read the setup modal and the linked-card slot.
   - a linked brand shows in the linked-card slot. g10.auction-bid-panel-enrollment.US2-TC14
   - Any refused brand is reported to the spec's author, not failed. g10.auction-bid-panel-enrollment.US2-TC14
6. Click the primary bid action.
   - The title reads "Link a card to bid". g10.auction-bid-panel-enrollment.US2-TC15
7. Read the setup title.
   - The description says the card is charged only on a win. g10.auction-bid-panel-enrollment.US2-TC15
8. Read the setup description.
   - The description names no hold or authorization. g10.auction-bid-panel-enrollment.US2-TC15
9. Read the continue control.
   - Continue reads "Link Card". g10.auction-bid-panel-enrollment.US2-TC15
10. Read the linked-card slot.
   - The linked-card slot shows the card on file, with Change available. g10.auction-bid-panel-enrollment.US5-TC1
11. Read the quick-bid presets and the custom maximum.
   - Quick-bid presets and the custom maximum are enabled. g10.auction-bid-panel-enrollment.US5-TC1
12. Check whether the setup modal is open.
   - The setup modal does not open. g10.auction-bid-panel-enrollment.US5-TC1

## Walk 4: Change or lock the linked card before bidding

**Starting state:**

- customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.
- customer(signed in, card linked, no bid on <listing_11>) is on <listing_11 url>.
- <listing_11> is in the row's state.
- customer(signed in, card linked on an earlier listing, age already attested, no bid on <listing_4>) is on <listing_4 url>.
- customer(signed in, card linked) is on <listing_5 url>.
- This collector's bid was accepted from the bid panel on this listing.
- customer(signed in, card linked, no bid on <listing_7>) is on <listing_7 url>.

**Shared test data:**

| Item | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |
| Item | <listing_11> state: Open, no bid, starting price 20000 minor units (HKD 200.00); <maximum>: 50000 minor units (HKD 500.00); Standing shown: Leading |
| Item | <listing_11> state: Open, led by customer B with maximum 80000 minor units (HKD 800.00), current bid 20000 minor units (HKD 200.00); <maximum>: 50000 minor units (HKD 500.00), below customer B's maximum; Standing shown: Outbid, with the next valid bid |
| <listing_4> | A new open listing this collector has not bid on; the card was linked on an earlier listing, and age was already attested |
| <the other card> | 5555 5555 5555 4444, a Mastercard. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <listing_5> | An open listing taking bids; this collector has a linked card and has placed a bid on it |
| <listing_7> | An open listing taking bids with no other bidder; this collector has a linked card and has not bid on it |

### Route

1. Enter `<maximum>` in the custom maximum.
   - The bid panel shows the accepted bid's standing without an Authorizing state between the click and the answer. g10.auction-bid-panel-enrollment.US2-TC8
2. Click the bid action.
   - The linked card remains visible. g10.auction-bid-panel-enrollment.US2-TC8
3. Read the linked-card slot after the bid is accepted.
   - Change is not offered for this listing. g10.auction-bid-panel-enrollment.US2-TC8
4. Enter `<maximum>` in the custom maximum.
5. Click the bid action.
6. Watch the bid panel until it settles.
   - The bid panel shows the row's expected standing in one answer: Leading or Outbid. g10.auction-bid-panel-enrollment.US2-TC16
   - No Authorizing or other in-between state shows between the click and the standing. g10.auction-bid-panel-enrollment.US2-TC16
7. Read the linked-card row.
   - The setup modal opens. g10.auction-bid-panel-enrollment.US3-TC1
8. Click Change on the linked card.
   - The linked-card row stays visible behind the modal. g10.auction-bid-panel-enrollment.US3-TC1
9. Click Change on the linked card.
   - The title reads "Link a card to bid". g10.auction-bid-panel-enrollment.US3-TC2
10. Read the modal title.
   - The description says the card is charged only on a win. g10.auction-bid-panel-enrollment.US3-TC2
11. Read the modal description.
   - The description names no hold or authorization. g10.auction-bid-panel-enrollment.US3-TC2
12. Read the provider-hosted field.
   - The provider-hosted field indicates the card already on file. g10.auction-bid-panel-enrollment.US3-TC2
13. Click Change on the linked card.
14. Read age attestation.
15. Enter <the other card> in the provider-hosted field.
16. Read the continue control.
   - Age attestation is already checked. g10.auction-bid-panel-enrollment.US3-TC3
   - Continue reads "Link Card" and enables once <the other card> is entered. g10.auction-bid-panel-enrollment.US3-TC3
17. Read the linked-card slot on the bid panel.
   - The linked card is shown. g10.auction-bid-panel-enrollment.US4-TC1
   - Change is not offered. g10.auction-bid-panel-enrollment.US4-TC1
18. Enter `<maximum>` in the custom maximum.
19. Click the bid action.
20. Check whether the setup modal is open.
21. Read the bid panel.
   - The setup modal does not open. g10.auction-bid-panel-enrollment.US4-TC2
   - The panel shows Leading with the collector's maximum and current bid. g10.auction-bid-panel-enrollment.US4-TC2

### g10.auction-bid-panel-enrollment.US1-TC1: Sign-in is offered instead of place bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer(signed out) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | A live listing taking bids, with recent public bids shown |

**Steps:**

1. Read the bid panel on <listing_1 url>.
2. Read the primary bid action.

**Expected Results:**

* The primary action offers sign-in to bid.
* Place bid and link a card are not offered.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-dgs rev=1 covers=g10.auction-bid-panel-enrollment.SC-sjy,g10.auction-bid-panel-enrollment.SC-o29 -->
### g10.auction-bid-panel-enrollment.US1-TC2: Standing badges stay hidden while signed out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-01

**Pre-conditions:**

* customer(signed out) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | A live listing taking bids, with recent public bids shown |

**Steps:**

1. Read standing badges on the bid panel.
2. Read the recent-bids section.

**Expected Results:**

* Highest-bid and outbid badges are not shown.
* Recent bids stay visible.

---

## g10.auction-bid-panel-enrollment.US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** I can bid the moment the card is linked.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-lqi rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC1: Link CTA opens setup when no card is linked

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
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
### g10.auction-bid-panel-enrollment.US2-TC2: Setup requires card and attestation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.
* The setup modal is open, from the bid action on this listing.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

**Steps:**

1. Leave the provider card field empty.
2. Leave age attestation unchecked.
3. Read the continue control.
4. Enter <the successful Visa> in the provider-hosted field.
5. Check age attestation.
6. Read the continue control.

**Expected Results:**

* Continue stays disabled while the card or attestation is missing.
* Continue reads "Link Card", not "Authorize".
* Continue enables once the card and attestation are both set.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-12t rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC3: Setup linking locks dismiss and controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
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
### g10.auction-bid-panel-enrollment.US2-TC4: Dismissing setup leaves no linked card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
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

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-e02 rev=3 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC5: Successful setup leaves the panel ready to bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

**Steps:**

1. Click the primary bid action.
2. Enter `<the successful Visa>` in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the linked-card slot.
6. Read the quick-bid presets and the custom maximum.
7. Read the primary bid action.
8. Check the card's activity at the card provider.

**Expected Results:**

* The setup modal closes.
* The linked-card slot shows the linked card, with Change available.
* Quick-bid presets and the custom maximum are enabled at once.
* The primary bid action offers set or raise maximum.
* Setup takes nothing from the card.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-3e2 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC6: Empty linked-card slot opens setup

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
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
### g10.auction-bid-panel-enrollment.US2-TC7: Card linking leaves the collector ready to bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-av0 rev=2 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC8: An accepted bid locks card change

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter `<maximum>` in the custom maximum.
2. Click the bid action.
3. Read the linked-card slot after the bid is accepted.

**Expected Results:**

* The bid panel shows the accepted bid's standing without an Authorizing state between the click and the answer.
* The linked card remains visible.
* Change is not offered for this listing.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-0h4 rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC9: Default setup copy does not promise a bid-time hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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
### g10.auction-bid-panel-enrollment.US2-TC10: Enabled hold setup copy discloses the authorization

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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
### g10.auction-bid-panel-enrollment.US2-TC11: Default payment-method tooltip does not promise a hold

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-aoq rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC12: A refused card link keeps setup open and links nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| Expiry, CVC, postal code | Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

| `<the refused card>` | Card number | Provider answer |
| --- | --- | --- |
| Generic decline | 4000 0000 0000 0002 | Declined by the issuer |
| Expired card | 4000 0000 0000 0069 | Refused as expired |
| Incorrect CVC | 4000 0000 0000 0127 | Refused for the CVC |
| Processing error | 4000 0000 0000 0119 | Provider fails to process |

**Steps:**

1. Click the primary bid action.
2. Enter <the refused card> in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the setup modal.
6. Click into the provider-hosted field.
7. Uncheck age attestation.
8. Close the setup modal.
9. Read the linked-card slot.
10. Read the quick-bid presets and the custom maximum.
11. Read the primary bid action.

**Expected Results:**

* Step 5: the setup modal stays open, and a failure is shown.
* Step 6: the provider field accepts focus.
* Step 7: age attestation unchecks.
* Step 9: the empty link prompt is shown.
* Step 10: presets and the custom maximum are visible and disabled.
* Step 11: the primary bid action reads "Link a card to bid".

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-cld rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC13: A successful retry completes card linking

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the declining Visa> | 4000 0000 0000 0002, the provider's generic-decline test card. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

**Steps:**

1. Click the primary bid action.
2. Enter `<the declining Visa>` in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Replace the card with `<the successful Visa>`.
6. Click Link Card.
7. Read the linked-card slot.
8. Read the quick-bid presets and the custom maximum.

**Expected Results:**

* The first link attempt shows a failure and leaves the setup modal open.
* The successful retry closes the setup modal.
* The linked-card slot shows the successful card, with Change available.
* Quick-bid presets and the custom maximum are enabled.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-8yx rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC14: Card brands beyond Visa link through setup

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on `<listing_2 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | An open listing taking bids; this collector has no linked card |
| Expiry, CVC, postal code | Any future expiry, such as 12/34, any CVC of the brand's length (4 digits for American Express, 3 otherwise), and any postal code |

| `<the brand card>` | Card number |
| --- | --- |
| Mastercard | 5555 5555 5555 4444 |
| American Express | 3782 822463 10005 |
| JCB | 3566 0020 2036 0505 |
| UnionPay | 6200 0000 0000 0005 |

**Steps:**

1. Click the primary bid action.
2. Enter `<the brand card>` in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the setup modal and the linked-card slot.

**Expected Results:**

* Step 4: the link completes, or a failure is shown; note which per brand.
* Step 5: a linked brand shows in the linked-card slot.
* Any refused brand is reported to the spec's author, not failed.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-ywm rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC15: Setup copy says the card is charged only on a win

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Read the setup title.
3. Read the setup description.
4. Read the continue control.

**Expected Results:**

* The title reads "Link a card to bid".
* The description says the card is charged only on a win.
* The description names no hold or authorization.
* Continue reads "Link Card".

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vbn rev=1 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### g10.auction-bid-panel-enrollment.US2-TC16: A committed maximum answers with standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_11>) is on <listing_11 url>.
* <listing_11> is in the row's state.

**Test data:**

| <listing_11> state | <maximum> | Standing shown |
| --- | --- | --- |
| Open, no bid, starting price 20000 minor units (HKD 200.00) | 50000 minor units (HKD 500.00) | Leading |
| Open, led by customer B with maximum 80000 minor units (HKD 800.00), current bid 20000 minor units (HKD 200.00) | 50000 minor units (HKD 500.00), below customer B's maximum | Outbid, with the next valid bid |

**Steps:**

1. Enter `<maximum>` in the custom maximum.
2. Click the bid action.
3. Watch the bid panel until it settles.

**Expected Results:**

* The bid panel shows the row's expected standing in one answer: Leading or Outbid.
* No Authorizing or other in-between state shows between the click and the standing.

---

## g10.auction-bid-panel-enrollment.US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-vr7 rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC1: Change opens the setup modal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.

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

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-iih rev=2 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC2: Change setup keeps copy and prior card

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |

**Steps:**

1. Click Change on the linked card.
2. Read the modal title.
3. Read the modal description.
4. Read the provider-hosted field.

**Expected Results:**

* The title reads "Link a card to bid".
* The description says the card is charged only on a win.
* The description names no hold or authorization.
* The provider-hosted field indicates the card already on file.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-shl rev=1 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### g10.auction-bid-panel-enrollment.US3-TC3: Attestation is pre-checked when already given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked on an earlier listing, age already attested, no bid on <listing_4>) is on <listing_4 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_4> | A new open listing this collector has not bid on; the card was linked on an earlier listing, and age was already attested |
| <the other card> | 5555 5555 5555 4444, a Mastercard. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

**Steps:**

1. Click Change on the linked card.
2. Read age attestation.
3. Enter <the other card> in the provider-hosted field.
4. Read the continue control.

**Expected Results:**

* Age attestation is already checked.
* Continue reads "Link Card" and enables once <the other card> is entered.

---

## g10.auction-bid-panel-enrollment.US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-74a rev=1 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC1: Change is hidden after the first bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked) is on <listing_5 url>.
* This collector's bid was accepted from the bid panel on this listing.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_5> | An open listing taking bids; this collector has a linked card and has placed a bid on it |

**Steps:**

1. Read the linked-card slot on the bid panel.

**Expected Results:**

* The linked card is shown.
* Change is not offered.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-5vi rev=2 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### g10.auction-bid-panel-enrollment.US4-TC2: First maximum leaves setup closed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-panel-enrollment.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_7>) is on <listing_7 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_7> | An open listing taking bids with no other bidder; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter `<maximum>` in the custom maximum.
2. Click the bid action.
3. Check whether the setup modal is open.
4. Read the bid panel.

**Expected Results:**

* The setup modal does not open.
* The panel shows Leading with the collector's maximum and current bid.

---

## g10.auction-bid-panel-enrollment.US5: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-c7l rev=1 covers=g10.auction-bid-panel-enrollment.SC-xwd -->
### g10.auction-bid-panel-enrollment.US5-TC1: Card on file carries over to a new listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-05

**Pre-conditions:**

* customer(signed in, card linked on <the earlier listing>, no bid on <listing_6>) is on <listing_6 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_6> | A new open listing this collector has not bid on; the card was linked on an earlier listing |

| `<the earlier listing>` | What this collector did there | Change on <listing_6> |
| --- | --- | --- |
| Another open listing | Linked the card through setup, placed no bid | Offered |
| Another open listing | Linked the card through setup, then placed an accepted bid, so Change is no longer offered there | Offered |

**Steps:**

1. Read the linked-card slot.
2. Read the quick-bid presets and the custom maximum.
3. Check whether the setup modal is open.

**Expected Results:**

* The linked-card slot shows the card on file, with Change available.
* Quick-bid presets and the custom maximum are enabled.
* The setup modal does not open.

## Settled

- Archived cases from `2026-09-11-add-bid-panel-enrollment` (`grade10-site-auction-bid-panel-enrollment-US1-TC1-1`, `grade10-site-auction-bid-panel-enrollment-US1-TC2-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC1-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC2-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC3-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC4-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC6-1`, `grade10-site-auction-bid-panel-enrollment-US3-TC1-1`, `grade10-site-auction-bid-panel-enrollment-US3-TC3-1`, `grade10-site-auction-bid-panel-enrollment-US4-TC1-1`, `grade10-site-auction-bid-panel-enrollment-US4-TC2-1`, `grade10-site-auction-bid-panel-enrollment-US5-TC1-1`) are represented by the matching current journey cases; `US4-TC2-1` is represented by the current `g10.auction-bid-panel-enrollment.US4-TC2` draft.
- Archived cases from `2026-09-16-default-auction-bid-holds-off` (`grade10-site-auction-bid-panel-enrollment-US2-TC7-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC9-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC10-1`, `grade10-site-auction-bid-panel-enrollment-US2-TC11-1`) remain as deprecated cases; their hold-specific readings are no longer live behaviour.
- Archived case `grade10-site-auction-bid-panel-enrollment-US4-TC2-2` from `2026-10-03-refused-bid-is-not-a-bid` is represented by current `g10.auction-bid-panel-enrollment.US4-TC2`, whose route asserts the first accepted bid without reopening setup.
- Setup links a card and takes nothing from it, and a committed maximum answers Leading, Outbid or the refusal with no authorization state between; the cases that read a hold switch, a hold state or hold copy are rewritten or were already deprecated (decisions Q1, Q5).
- The setup description and the Change modal say the card is charged only on a win, in the words the Bidding page decides.
- What the bid form says for a refused bid is `grade10-site/auction/auction`'s US14 and `grade10-site/auction/bid-payment-method`'s card refusals, not this suite's.
- The panel after card linking is `editable`, the code's name, and the linked-card tooltip scenario keeps its title (decisions Q18).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bid-panel-enrollment-SC-15` by `grade10-site-auction-bid-panel-enrollment-US2-TC5-3`; `grade10-site-auction-bid-panel-enrollment-SC-16` by `grade10-site-auction-bid-panel-enrollment-US2-TC8-2`; `grade10-site-auction-bid-panel-enrollment-SC-20`'s Leading and Outbid by `grade10-site-auction-bid-panel-enrollment-US2-TC16-1`, and its refusal under the bid action by `grade10-site-auction-auction-US14-TC1-1`; the Setup modal leaf by `grade10-site-auction-bid-panel-enrollment-US2-TC15-1` and `grade10-site-auction-bid-panel-enrollment-US3-TC2-2`
- **Corrected** - `grade10-site-auction-bid-panel-enrollment-US2-TC16-1` traced the Feature set group Bid commit; it traces its section's journey, `grade10-site-auction-bid-panel-enrollment-US-02`
- **Raised, answered** - Q18: the panel state `editable`, the code's name, replaces `authorization-editable`, and `shared-ui-auction-listing-SC-30` keeps its title, since its steps never named a hold; answer in `## Settled`
- **Contradicted** - none
- **Uncovered anchors** - none
