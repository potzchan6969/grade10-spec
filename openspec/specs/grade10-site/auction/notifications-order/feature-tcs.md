# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Post-close letters

**Starting state:**

- Reset the fixture to each case's declared **Pre-conditions** before running it.

**Shared test data:**

- Use each case's declared **Test data**. No case depends on another case's result.

### Route

1. Close `<lot_1>` with this winner. `g10.auction-notifications-order.US1-TC1`
2. Open the winner's inbox. `g10.auction-notifications-order.US1-TC1`
3. admin(operator) sends the invoice for `<lot_1>` with `<total>`. `g10.auction-notifications-order.US1-TC2`
4. Open the winner's inbox. `g10.auction-notifications-order.US1-TC2`
5. admin(operator) reissues the invoice for `<lot_1>`. `g10.auction-notifications-order.US1-TC3`
6. Open the winner's inbox and the send log. `g10.auction-notifications-order.US1-TC3`
7. Wait until 24 hours before the payment deadline. `g10.auction-notifications-order.US1-TC4`
8. Open the winner's inbox. `g10.auction-notifications-order.US1-TC4`
9. Wait until day 3 after invoice issue. `g10.auction-notifications-order.US1-TC5`
10. Open the winner's inbox for reminder kinds. `g10.auction-notifications-order.US1-TC5`
11. Deliver the payment confirmation webhook again. `g10.auction-notifications-order.US1-TC6`
12. Open the winner's inbox and the send log. `g10.auction-notifications-order.US1-TC6`
13. Wait for the setup overdue letter for `<lot_1>`. `g10.auction-notifications-order.US1-TC7`
14. Open the letter. `g10.auction-notifications-order.US1-TC7`
15. Read the letter body and the Contact Us link. `g10.auction-notifications-order.US1-TC7`
25. Open the payment overdue letter for `<lot_1>` and read the Contact Us `mailto:` subject and body. `g10.auction-notifications-order.US1-TC11`
26. Open `<the winner's auction order url>` for that order. `g10.auction-notifications-order.US1-TC11`
27. Click Contact Us and read Subject and Message. `g10.auction-notifications-order.US1-TC11`
28. Open the payment overdue letter for `<lot_1>`. `g10.auction-notifications-order.US1-TC12`
29. Read the letter body without activating Contact Us. `g10.auction-notifications-order.US1-TC12`
30. Open the letter named in the row for `<lot_1>`. `g10.auction-notifications-order.US1-TC13`
31. Inspect the Contact Us href. `g10.auction-notifications-order.US1-TC13`
32. Wait for the partial-payment letter for `<lot_1>`. `g10.auction-notifications-order.US1-TC14`
33. Open the letter. `g10.auction-notifications-order.US1-TC14`
34. Read the letter body and the Contact Us link. `g10.auction-notifications-order.US1-TC14`
35. Dispatch `<lot_1>`'s order with a carrier and a tracking number, and no tracker link. `g10.auction-notifications-order.US1-TC55`
36. Open the winner's inbox and read the shipped letter. `g10.auction-notifications-order.US1-TC55`

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

`<!-- trace:case id=g10.auction-notifications-order.TC-81s rev=1 covers=g10.auction-notifications-order.SC-2d0,g10.auction-notifications-order.SC-kkg,g10.auction-notifications-order.SC-s24,g10.auction-notifications-order.SC-dv3,g10.auction-notifications-order.SC-nrz,g10.auction-notifications-order.SC-7jz,g10.auction-notifications-order.SC-pnf,g10.auction-notifications-order.SC-wmw,g10.auction-notifications-order.SC-y5o,g10.auction-notifications-order.SC-3di,g10.auction-notifications-order.SC-18a,g10.auction-notifications-order.SC-4u6,g10.auction-notifications-order.SC-jw9,g10.auction-notifications-order.SC-qsh,g10.auction-notifications-order.SC-qmq,g10.auction-notifications-order.SC-pqi,g10.auction-notifications-order.SC-gec,g10.auction-notifications-order.SC-kas,g10.auction-notifications-order.SC-mva,g10.auction-notifications-order.SC-7pc,g10.auction-notifications-order.SC-ek4,g10.auction-notifications-order.SC-q85,g10.auction-notifications-order.SC-n3n,g10.auction-notifications-order.SC-dnr -->`
### g10.auction-notifications-order.US1-TC1: Winning a lot sends auction-won

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot that just closed with this winner |

**Steps:**

1. Close `<lot_1>` with this winner.
2. Open the winner's inbox.

**Expected Results:**

* One auction-won letter names `<lot_1>` and the setup deadline.
* It names no amount owed.

`<!-- trace:case id=g10.auction-notifications-order.TC-8bw rev=1 covers=g10.auction-notifications-order.SC-2d0,g10.auction-notifications-order.SC-kkg,g10.auction-notifications-order.SC-s24,g10.auction-notifications-order.SC-dv3,g10.auction-notifications-order.SC-nrz,g10.auction-notifications-order.SC-7jz,g10.auction-notifications-order.SC-pnf,g10.auction-notifications-order.SC-wmw,g10.auction-notifications-order.SC-y5o,g10.auction-notifications-order.SC-3di,g10.auction-notifications-order.SC-18a,g10.auction-notifications-order.SC-4u6,g10.auction-notifications-order.SC-jw9,g10.auction-notifications-order.SC-qsh,g10.auction-notifications-order.SC-qmq,g10.auction-notifications-order.SC-pqi,g10.auction-notifications-order.SC-gec,g10.auction-notifications-order.SC-kas,g10.auction-notifications-order.SC-mva,g10.auction-notifications-order.SC-7pc,g10.auction-notifications-order.SC-ek4,g10.auction-notifications-order.SC-q85,g10.auction-notifications-order.SC-n3n,g10.auction-notifications-order.SC-dnr -->`
### g10.auction-notifications-order.US1-TC2: Invoice send is the first payment reminder

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has confirmed setup.
* admin(operator) can send the invoice for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order in Preparing Invoice |
| `<total>` | 312000 minor units HKD |

**Steps:**

1. admin(operator) sends the invoice for `<lot_1>` with `<total>`.
2. Open the winner's inbox.

**Expected Results:**

* One payment-reminder letter names `<total>` and the payment deadline.
* The deadline uses `Asia/Hong_Kong` and is labelled `GMT+8`.
* No separate invoice-sent letter exists.

`<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=1 covers=g10.auction-notifications-order.SC-2d0,g10.auction-notifications-order.SC-kkg,g10.auction-notifications-order.SC-s24,g10.auction-notifications-order.SC-dv3,g10.auction-notifications-order.SC-nrz,g10.auction-notifications-order.SC-7jz,g10.auction-notifications-order.SC-pnf,g10.auction-notifications-order.SC-wmw,g10.auction-notifications-order.SC-y5o,g10.auction-notifications-order.SC-3di,g10.auction-notifications-order.SC-18a,g10.auction-notifications-order.SC-4u6,g10.auction-notifications-order.SC-jw9,g10.auction-notifications-order.SC-qsh,g10.auction-notifications-order.SC-qmq,g10.auction-notifications-order.SC-pqi,g10.auction-notifications-order.SC-gec,g10.auction-notifications-order.SC-kas,g10.auction-notifications-order.SC-mva,g10.auction-notifications-order.SC-7pc,g10.auction-notifications-order.SC-ek4,g10.auction-notifications-order.SC-q85,g10.auction-notifications-order.SC-n3n,g10.auction-notifications-order.SC-dnr -->`
### g10.auction-notifications-order.US1-TC3: Reissue sends payment reminder only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a pending or expired invoice.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order whose invoice an operator can reissue |

**Steps:**

1. admin(operator) reissues the invoice for `<lot_1>`.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter for the new invoice.
* No invoice-reissued letter.

`<!-- trace:case id=g10.auction-notifications-order.TC-oqs rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->`
### g10.auction-notifications-order.US1-TC4: Final notice is 24 hours before the payment deadline

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
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a pending unpaid invoice.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending invoice and a known payment deadline |

**Steps:**

1. Wait until 24 hours before the payment deadline.
2. Open the winner's inbox.

**Expected Results:**

* One final-notice letter for `<lot_1>`.
* No letter waits until the deadline transition itself.

`<!-- trace:case id=g10.auction-notifications-order.TC-tvz rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->`
### g10.auction-notifications-order.US1-TC5: Paying early cancels later reminders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner of `<lot_1>`) pays on day 2 after the invoice was issued.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order whose invoice was issued two days ago and is now paid |

**Steps:**

1. Wait until day 3 after invoice issue.
2. Open the winner's inbox for reminder kinds.

**Expected Results:**

* No day-3, day-6, or final-notice payment reminder for that invoice.

`<!-- trace:case id=g10.auction-notifications-order.TC-xwr rev=1 covers=g10.auction-notifications-order.SC-mcc,g10.auction-notifications-order.SC-d23 -->`
### g10.auction-notifications-order.US1-TC6: A retried payment confirmation sends nothing twice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery discipline

**Pre-conditions:**

* The payment-received letter for `<lot_1>` has already been sent.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order whose payment-received letter was sent |

**Steps:**

1. Deliver the payment confirmation webhook again.
2. Open the winner's inbox and the send log.

**Expected Results:**

* No second payment-received letter.

`<!-- trace:case id=g10.auction-notifications-order.TC-gv0 rev=1 covers=g10.auction-notifications-order.SC-hhx -->`
### g10.auction-notifications-order.US1-TC7: A post-close letter Contact Us link carries the ready mailto

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and the letter in the row is due.

**Test data:**

| Letter | Fixture |
| --- | --- |
| Setup overdue | A won lot whose setup overdue letter is due |
| Payment overdue | A won lot whose payment overdue letter is due |
| Order cancelled | A won lot whose order cancelled letter is due |
| Delivered | A won lot whose delivered letter is due |

**Steps:**

1. Wait for the letter named in the row for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the ready email for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.
`<!-- trace:case id=g10.auction-notifications-order.TC-7nr rev=1 covers=g10.auction-notifications-order.SC-xbe -->`
### g10.auction-notifications-order.US1-TC8: Payment overdue letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* The payment deadline for `<lot_1>` has just passed unpaid.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose payment overdue letter is due |
| `<invoice_id>` | The issued invoice id on that order |

**Steps:**

1. Wait for the payment overdue letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order `<invoice_id>`: payment overdue`.
* The mailto includes a body with the matching order facts.

`<!-- trace:case id=g10.auction-notifications-order.TC-l79 rev=1 covers=g10.auction-notifications-order.SC-fza -->`
### g10.auction-notifications-order.US1-TC9: Cancelled letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* admin(operator) has cancelled the unpaid order for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose order cancelled letter is due |

**Steps:**

1. Wait for the order cancelled letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

`<!-- trace:case id=g10.auction-notifications-order.TC-wcd rev=1 covers=g10.auction-notifications-order.SC-kn8 -->`
### g10.auction-notifications-order.US1-TC10: Delivered letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* The carrier has confirmed delivery for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose delivered letter is due |
| `<invoice_id>` | The paid invoice id on that order |

**Steps:**

1. Wait for the delivered letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

`<!-- trace:case id=g10.auction-notifications-order.TC-y9r rev=1 covers=g10.auction-notifications-order.SC-xbe -->`
### g10.auction-notifications-order.US1-TC11: Overdue letter mailto matches Winner Order subject and body for the same order

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and can open `<the winner's auction order url>` for the same payment-overdue order.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot in Payment Overdue with a payment overdue letter already sent |
| `<invoice_id>` | The issued invoice id on that order |

**Steps:**

1. Open the payment overdue letter for `<lot_1>` and read the Contact Us `mailto:` subject and body.
2. Open `<the winner's auction order url>` for that order.
3. Click Contact Us and read Subject and Message.

**Expected Results:**

* Letter mailto subject equals the dialog Subject `Auction order `<invoice_id>`: payment overdue`.
* Letter mailto body matches the dialog Message order facts.

`<!-- trace:case id=g10.auction-notifications-order.TC-emn rev=1 covers=g10.auction-notifications-order.SC-xbe -->`
### g10.auction-notifications-order.US1-TC12: Letter Contact Us still names the address when no mail client will open

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) opens a payment overdue letter in a browser mail surface that does not hand off to a system mail client.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose payment overdue letter is open |

**Steps:**

1. Open the payment overdue letter for `<lot_1>`.
2. Read the letter body without activating Contact Us.

**Expected Results:**

* The letter body still shows `support@grade10.com` for the collector to copy by hand.

`<!-- trace:case id=g10.auction-notifications-order.TC-8ag rev=1 covers=g10.auction-notifications-order.SC-fza,g10.auction-notifications-order.SC-kn8 -->`
### g10.auction-notifications-order.US1-TC13: Overdue cancelled and delivered Contact Us are not a bare support mailto

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and the letter in the row is the latest for that order.

**Test data:**

| Letter | `<lot_1>` |
| --- | --- |
| Setup overdue | A won lot whose setup overdue letter is open |
| Payment overdue | A won lot whose payment overdue letter is open |
| Order cancelled | A won lot whose order cancelled letter is open |
| Delivered | A won lot whose delivered letter is open |

**Steps:**

1. Open the letter named in the row for `<lot_1>`.
2. Inspect the Contact Us href.

**Expected Results:**

* The href includes a subject query.
* The href includes a body query.
* The href is not only `mailto:support@grade10.com`.

`<!-- trace:case id=g10.auction-notifications-order.TC-dwz rev=1 covers=g10.auction-notifications-order.SC-0sv -->`
### g10.auction-notifications-order.US1-TC14: Partial-payment letter Contact Us carries the ready mailto without the balance

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* An operator has recorded a partial payment on the order for `<lot_1>` and the partial-payment letter is due.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose partial-payment letter is due |
| `<invoice_id>` | The current invoice id on that order |
| `<receipt_ids>` | Receipt ids recorded so far |

**Steps:**

1. Wait for the partial-payment letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order `<invoice_id>`: partial payment`.
* The mailto body may list `<receipt_ids>` and does not name the remaining balance.

`<!-- trace:case id=g10.auction-notifications-order.TC-i2x rev=1 covers=g10.auction-notifications-order.SC-bgc -->`
### g10.auction-notifications-order.US1-TC55: A shipped letter with no tracker link leads with the order

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* `<lot_1>`'s order reads Preparing Shipment.

**Steps:**

1. Dispatch `<lot_1>`'s order with a carrier and a tracking number, and no tracker link.
2. Open the winner's inbox and read the shipped letter.

**Expected Results:**

* The primary action is View order, and it opens `<lot_1>`'s Winner Order.
* The tracking number reads as plain text, not a link.
* The letter offers no track-and-trace action.

## Settled

- Cancelled and delivered subject reason fragments are `cancelled` and `delivered`
- Partial-payment letter Contact Us is in scope with the same ready mailto
- Subject uses the order's current invoice id after a reissue
- Delivered letter names the address and time recorded on the order at carrier confirmation
- One payment reminder per reissue; a repeated confirmation of the same reissue sends nothing twice
- Reissue parks superseded reminders and starts the day-3 / day-6 sequence for the new invoice — durable Reminder cadence; not restated as a new root here
- Mute applies to listing alert mail in `notifications`, not to winner order letters
- Contact Us uses the same ready email as Winner Order: letters prefill
`mailto:support@grade10.com` and name that address in the body

- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-18-add-winner-setup-overdue-mail** — `order-mail-US1-TC1-1` → `g10.auction-notifications-order.US1-TC1`; `order-mail-US1-TC2-1` → `g10.auction-notifications-order.US1-TC2`; `order-mail-US1-TC50-1` → current journey cases are the replacement record; `order-mail-US1-TC54-1` → current journey cases are the replacement record; `order-mail-US1-TC51-1` → current journey cases are the replacement record.
  - **2026-09-18-email-trigger-revision** — `order-mail-US1-TC13-1` → `g10.auction-notifications-order.US1-TC13`; `order-mail-US1-TC14-1` → `g10.auction-notifications-order.US1-TC14`; `order-mail-US1-TC15-1` → current journey cases are the replacement record; `order-mail-US1-TC16-1` → current journey cases are the replacement record; `order-mail-US1-TC17-1` → current journey cases are the replacement record; `order-mail-US1-TC18-1` → current journey cases are the replacement record; `order-mail-US1-TC19-1` → current journey cases are the replacement record.
- `g10.auction-notifications-order.US1-TC8`, `g10.auction-notifications-order.US1-TC9` and `g10.auction-notifications-order.US1-TC10` fold into `g10.auction-notifications-order.US1-TC7`; the surviving case runs each post-close letter row.
- **Archived replacement records — 2026-10-12 suite rewrite** — `order-mail-US1-TC3-1` → `g10.auction-notifications-order.US1-TC3`; `order-mail-US1-TC4-1` → `g10.auction-notifications-order.US1-TC4`; `order-mail-US1-TC5-1` → `g10.auction-notifications-order.US1-TC5`; `order-mail-US1-TC6-1` → `g10.auction-notifications-order.US1-TC6`; `order-mail-US1-TC7-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC8-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC9-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC10-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC11-1` → `g10.auction-notifications-order.US1-TC11`; `order-mail-US1-TC12-1` → `g10.auction-notifications-order.US1-TC12`.
