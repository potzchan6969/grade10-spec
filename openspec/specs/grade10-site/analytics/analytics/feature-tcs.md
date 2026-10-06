# grade10-site/analytics Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

**Out of suite:** none — every Feature set root group this change introduces
carries cases below. The capability is walked by nobody on their own; cases
trace those groups.

## Background

* A worker's waiting and held records are read in that worker's own database, its Mixpanel records by state; each sweep also reports the waiting count, the oldest record's age and the held count to Datadog, tagged by product.
* Mixpanel unreachable, a refused record or a lost answer is made by a stubbed Mixpanel on the worker's send path.
* A Mixpanel event is read in the Mixpanel project's events view, by its name and the fact's id.
* The store, auction and loyalty workers sweep every 5 minutes, the vault worker every 15 minutes.

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

<!-- trace:case id=g10.analytics-analytics.TC-ob4 rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC1-1: Signed-in event names user and device

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- customer(collector) is signed in on a browser that already has a device id.

**Steps:**

1. Record any Grade10 Mixpanel event for that visit.

**Expected Results:**

- The event is attributed to that collector's user id.
- The event still names that device.
- Audience is `collector`.

<!-- trace:case id=g10.analytics-analytics.TC-rtl rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC2-1: Anonymous event names only the device

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- customer is not signed in.

**Steps:**

1. Record any Grade10 Mixpanel event for that visit.

**Expected Results:**

- The event is attributed to the device.
- The event is not attributed to a user id.

<!-- trace:case id=g10.analytics-analytics.TC-hzq rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC3-1: Client cannot claim a user id

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Identity

**Pre-conditions:**

- customer is not signed in.

**Steps:**

1. Submit a client analytics event that names another person's user id.

**Expected Results:**

- The recorded event is not attributed to that user id.

<!-- trace:case id=g10.analytics-analytics.TC-i1k rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC4-1: Staff browsing the collector site are marked staff

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- admin(operator) is signed in on the collector site.

**Steps:**

1. Record any Grade10 Mixpanel event for that visit.

**Expected Results:**

- Audience is `staff`.

<!-- trace:case id=g10.analytics-analytics.TC-q84 rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC5-1: Ownerless paid order sits on the order alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- A paid order has no owner.

**Steps:**

1. Record Order Paid for that order.
2. Later claim the order for a member.

**Expected Results:**

- Order Paid is attributed to that order as a device, not a user id.
- Grade10 does not send Order Paid again on the claim.
- Mixpanel does not merge that order device onto the member.

<!-- trace:case id=g10.analytics-analytics.TC-8v8 rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC6-1: Sign-out and session expiry start a new device

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- customer(collector) was signed in on a browser.

**Steps:**

1. Sign out, then record the next analytics event from that browser.
2. On another visit, let the signed-in session expire, then record the next analytics event.

**Expected Results:**

- Each next event is attributed to a new device.
- Neither event is attributed to the previous collector.
- No Signed In or Signed Out Mixpanel event is recorded.

<!-- trace:case id=g10.analytics-analytics.TC-voq rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC7-1: Server emit that continues a visit keeps the device

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- A browser visit recorded Page Viewed under a device id Grade10 still holds.
- customer may be signed out at checkout.

**Steps:**

1. Accept checkout so Checkout Started is recorded.
2. Record Order Paid with Origin `web` for that order.
3. Record one other server event that continues the same visit.

**Expected Results:**

- Checkout Started, web Order Paid, and the other server event each name that `$device_id`.
- Browse events from that device can join the paid account after sign-in.

<!-- trace:case id=g10.analytics-analytics.TC-nxv rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC8-1: First-touch campaign on the landing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Events

**Pre-conditions:**

- A collector opens a page whose address carries UTM query keys.
- The first Page Viewed for that device is for a document that had a referrer.
- A lot address also carries UTM query keys.

**Steps:**

1. Record Page Viewed for the landing.
2. Record Lot Viewed for the lot.

**Expected Results:**

- Page Viewed and Lot Viewed carry the UTM Source, Medium, Campaign, and Content values that were present.
- The first Page Viewed includes Initial Referrer.

<!-- trace:case id=g10.analytics-analytics.TC-1pv rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC9-1: Account Created fires once when the store first knows a user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- An email has no account.
- Another email already has an account.

**Steps:**

1. Let the store create an unverified account for the new email.
2. Ask the store to create an account for the existing email.
3. Let the identity worker create, verify, or sign a person in.

**Expected Results:**

- Mixpanel records Account Created once for the new user id.
- Mixpanel does not record Account Created for the existing email request.
- The identity worker records no Mixpanel event.

<!-- trace:case id=g10.analytics-analytics.TC-03a rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC10-1: Browser may send client names only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Events

**Pre-conditions:**

- None.

**Steps:**

1. Submit Order Paid from the browser.
2. Submit Bid Placed from the browser.

**Expected Results:**

- Ingest rejects both submissions.

<!-- trace:case id=g10.analytics-analytics.TC-xjo rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC11-1: Store funnel client and server events

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
* **Trace:** Events

**Pre-conditions:**

- customer(member) has a cart on the Grade10 site.
- The store will accept checkout.

**Steps:**

1. Open a page via in-page navigation.
2. Open a product from the merchandised row.
3. Add the product, open the cart, then accept checkout.
4. Complete payment so Order Paid lands.

**Expected Results:**

- Mixpanel records Page Viewed, Product Viewed with Source `Row`, Product Added, Cart Opened, Checkout Started, and Order Paid.
- Order Paid carries Member true, Points Earned, Points Spent, and Tier when the programme priced the spend.
- A refused checkout records no Checkout Started.

<!-- trace:case id=g10.analytics-analytics.TC-6r6 rev=3 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC12-3: Auction funnel events

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
* **Trace:** Events

**Pre-conditions:**

* customer(collector) is signed in, with no card linked.
* `<lot_1>` is live, with no bid from this collector.
* customer B(card linked) is signed in on a separate session, ready to bid on `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A live HKD lot, current bid 480000 minor units, next minimum 488000 minor units |
| `<card>` | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |
| `<refused maximum>` | 400000 minor units, below the next minimum |
| `<accepted maximum>` | 600000 minor units, at or above the next minimum |
| `<rival maximum>` | 550000 minor units, below `<accepted maximum>` |

**Steps:**

1. Open the lot page for `<lot_1>`.
2. Click Watch on the lot page.
3. Link `<card>` from the bid panel.
4. Enter `<refused maximum>` in the custom maximum on the bid panel and confirm the bid.
5. Enter `<accepted maximum>` in the custom maximum and confirm the bid.
6. As customer B, place `<rival maximum>`, so Grade10 places an auto-bid step under `<accepted maximum>`.
7. Let `<lot_1>` close with this collector as winner, and pay the invoice.
8. Read this collector's events for `<lot_1>` in the Mixpanel project.

**Expected Results:**

* Step 4 is refused on the bid form.
* Step 8 shows Lot Viewed, not Product Viewed.
* Step 8 shows Lot Watched once, from step 2 and not from a bid.
* Step 8 shows Card Linked, Auction Won and Invoice Paid once each.
* Step 8 shows Bid Placed once, for `<accepted maximum>`, when step 5 is accepted.
* Step 8 shows no Bid Placed for `<refused maximum>` or for the auto-bid step.
* Step 8 shows no Bidder Outbid for this collector.

<!-- trace:case id=g10.analytics-analytics.TC-ac6 rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC13-1: Loyalty facts on Mixpanel

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Events

**Pre-conditions:**

- customer(member) can redeem a reward and receive a wallet pass.
- A till can identify the member and take a paid sale.

**Steps:**

1. Redeem a reward with points.
2. Issue a member card to a wallet.
3. Succeed a till identification, then take a till paid order for that session.
4. Refuse a till identification.

**Expected Results:**

- Mixpanel records Reward Redeemed, Pass Added, and Member Identified with how they were found.
- Till Order Paid has Origin `pos` and that Session ID.
- A refused till identification records no Member Identified.

<!-- trace:case id=g10.analytics-analytics.TC-8io rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### grade10-site-analytics-US1-TC14-1: Vault conversion funnel join

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Events

**Pre-conditions:**

- A financed vault case can move from submit through payout and identity bind.

**Steps:**

1. Submit the case, book a visit, make and accept an offer, record payout, and bind identity.

**Expected Results:**

- Mixpanel records Vault Case Submitted, Vault Visit Booked, Vault Offer Made, Vault Offer Accepted, Vault Payout Recorded, and Identity Bound.
- Financed cases per week are still read from the vault ledger, not from Mixpanel alone.

<!-- trace:case id=g10.analytics-analytics.TC-sca rev=1 covers=g10.analytics-analytics.SC-o7d,g10.analytics-analytics.SC-syh,g10.analytics-analytics.SC-d0t,g10.analytics-analytics.SC-icd -->
### grade10-site-analytics-US1-TC15-1: User profile snapshot for a user id only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** User profile

**Pre-conditions:**

- customer(member on Silver) has a user id.
- An anonymous device has recorded a browse event.

**Steps:**

1. Move the member from Silver to Gold.
2. Submit a user-profile update from the browser.
3. Record an analytics event for the anonymous device.

**Expected Results:**

- The Mixpanel user profile's Tier is `Gold`.
- Mixpanel does not take the browser update as the person.
- Mixpanel holds no user profile for the anonymous device.
- The profile does not carry `$email`, `$name`, or `$phone`.

<!-- trace:case id=g10.analytics-analytics.TC-k4b rev=1 covers=g10.analytics-analytics.SC-4pj,g10.analytics-analytics.SC-xtj,g10.analytics-analytics.SC-xjq,g10.analytics-analytics.SC-n19,g10.analytics-analytics.SC-77x,g10.analytics-analytics.SC-3pq,g10.analytics-analytics.SC-b8p,g10.analytics-analytics.SC-2py,g10.analytics-analytics.SC-y2g,g10.analytics-analytics.SC-1h1,g10.analytics-analytics.SC-w73,g10.analytics-analytics.SC-3nr,g10.analytics-analytics.SC-5cv,g10.analytics-analytics.SC-kpf,g10.analytics-analytics.SC-ya9,g10.analytics-analytics.SC-lw5,g10.analytics-analytics.SC-8vy -->
### grade10-site-analytics-US1-TC16-1: Collector IP for geolocation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Identity

**Pre-conditions:**

- A browser posts a client event batch to `/api/track` from a known client IP.
- A checkout request captured that collector IP.
- A tier change has no collector IP on hand.

**Steps:**

1. Accept the client batch.
2. Record Order Paid for the checkout order from the worker.
3. Write the user profile for the tier change.

**Expected Results:**

- Client and Order Paid Mixpanel sends carry the collector IP for geolocation and do not store IP as a property.
- Order Paid does not use the worker's address as the person's location.
- The profile write sets `$ip` to `0` and does not set location from the worker.

<!-- trace:case id=g10.analytics-analytics.TC-ao3 rev=1 covers=g10.analytics-analytics.SC-xi3,g10.analytics-analytics.SC-5sa,g10.analytics-analytics.SC-27a -->
### grade10-site-analytics-US1-TC17-1: Refusals stay off Mixpanel

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Refusals

**Pre-conditions:**

- None.

**Steps:**

1. Record any Grade10 Mixpanel event.
2. Use a Grade10 admin console as an operator.
3. Implement this capability without a ZZZ storefront emit catalog.

**Expected Results:**

- No Mixpanel event carries email, name, phone, address, KYC payload, coupon codes, or a stored IP.
- Admin console use records no Mixpanel event.
- Grade10 records the catalog and ZZZ is not required to emit storefront events.

<!-- trace:case id=g10.analytics-analytics.TC-jsp rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC18-1: Committed fact reaches Mixpanel on the worker's next sweep

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery

**Pre-conditions:**

* The row's worker has a Mixpanel token.
* Mixpanel accepts sends.
* Nothing waits to be sent from the row's worker.

**Test data:**

| Worker | Fact | Server event | Arrives within |
| --- | --- | --- | --- |
| Store | customer(collector) pays `<order_1>` | Order Paid | 5 minutes |
| Auction | customer(bidder) places a maximum on `<lot_1>` | Bid Placed | 5 minutes |
| Loyalty | customer(member) redeems `<reward_1>` with points | Reward Redeemed | 5 minutes |
| Vault | admin(treasurer) records the payout on `<vault case_1>` | Vault Payout Recorded | 15 minutes |

**Steps:**

1. Commit the row's fact.
2. Read the worker's waiting records count before its next sweep.
3. Wait the row's arrival bound, one sweep interval.
4. Read the row's server event in the Mixpanel project.
5. Read the worker's waiting records count again.

**Expected Results:**

* Step 2 shows one waiting record.
* Step 4 shows the row's server event once, for that fact.
* Step 5 shows zero waiting records.

<!-- trace:case id=g10.analytics-analytics.TC-u5k rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC19-1: Rolled-back fact sends nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends.
* The auction's write of a maximum on `<lot_2>` is made to fail before it commits.

**Steps:**

1. Place a maximum on `<lot_2>` as customer(bidder).
2. Read `<lot_2>`'s bids.
3. Read the auction worker's waiting records count.
4. Wait 5 minutes.
5. Search the Mixpanel project for Bid Placed on `<lot_2>`.

**Expected Results:**

* Step 2 shows no bid from that maximum.
* Step 3 shows zero waiting records.
* Step 5 finds no Bid Placed for `<lot_2>`.

<!-- trace:case id=g10.analytics-analytics.TC-hqt rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC20-1: Record survives a worker that stops after the commit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends.
* The auction worker is made to stop straight after the commit of the request that places a maximum.

**Steps:**

1. Place a maximum on `<lot_1>` as customer(bidder).
2. Read the auction worker's waiting records count.
3. Wait 5 minutes.
4. Read Bid Placed for `<lot_1>` in the Mixpanel project.

**Expected Results:**

* Step 1's maximum is accepted.
* Step 2 shows one waiting record.
* Step 4 shows one Bid Placed for that maximum.

<!-- trace:case id=g10.analytics-analytics.TC-gnk rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC21-1: Outage of hours drains once Mixpanel recovers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker for `<outage length>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<outage length>` | 21600s (6 hours), past the 360s (6 minutes) the old requeues lasted |
| `<paid orders>` | `<order_3>`, `<order_4>`, `<order_5>`, paid at spread times inside the outage |

**Steps:**

1. Pay each of `<paid orders>` as customer(collector) during the outage.
2. Read the store worker's waiting records count and the oldest record's age before the outage ends.
3. End the outage.
4. Wait 20 minutes.
5. Read Order Paid for each of `<paid orders>` in the Mixpanel project.
6. Read the store worker's waiting records count.

**Expected Results:**

* Every order in step 1 is paid; none is refused for the outage.
* Step 2 shows three waiting records, the oldest aged from `<order_3>`'s payment.
* Step 2 shows zero held records.
* Step 5 shows Order Paid once for each of `<paid orders>`.
* Step 6 shows zero waiting records.

<!-- trace:case id=g10.analytics-analytics.TC-kbo rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC22-1: Send accepted but seen as failed counts once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The loyalty worker has a Mixpanel token.
* Mixpanel accepts the loyalty worker's next send, and the worker is made to see that send as failed.

**Steps:**

1. Redeem `<reward_1>` with points as customer(member).
2. Wait for the loyalty worker's sweep to send and see the send fail.
3. Wait for the next sweep.
4. Read Reward Redeemed for `<reward_1>` in the Mixpanel project.
5. Read the loyalty worker's waiting records count.

**Expected Results:**

* Step 3's sweep sends the same record again, with the same `$insert_id`, event name, time and distinct_id.
* Step 4 shows Reward Redeemed once.
* Step 5 shows zero waiting records.

<!-- trace:case id=g10.analytics-analytics.TC-e7f rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC23-1: Replayed paid webhook keeps one Order Paid record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker.
* customer(collector) has paid `<order_6>`, and its Order Paid waits on the store worker.

**Steps:**

1. Read the store worker's waiting Order Paid records for `<order_6>`.
2. Deliver `<order_6>`'s paid-order webhook to the store again.
3. Wait for the store's next sweep.
4. Read the store worker's waiting Order Paid records for `<order_6>` again.
5. Make Mixpanel reachable.
6. Wait 20 minutes.
7. Read Order Paid for `<order_6>` in the Mixpanel project.

**Expected Results:**

* Step 1 shows one waiting record.
* Step 4 still shows one waiting record.
* Step 7 shows Order Paid once for `<order_6>`.

<!-- trace:case id=g10.analytics-analytics.TC-kxi rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC24-1: Refused record in a batch is held, the rest sent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends, except that it refuses the record for `<refused event>`.
* Nothing waits or is held on the auction worker.

**Test data:**

| Field | Value |
| --- | --- |
| `<batch events>` | Lot Watched on `<lot_1>`, Lot Watched on `<lot_3>`, Bid Placed on `<lot_1>`, by one customer(bidder), committed before one sweep |
| `<refused event>` | Bid Placed on `<lot_1>` |

**Steps:**

1. Commit the facts behind `<batch events>` before the auction worker's next sweep.
2. Wait for the sweep.
3. Read `<batch events>` in the Mixpanel project.
4. Read the auction worker's waiting and held records counts.
5. Read the auction's held-records alarm in Datadog.
6. Wait for two more sweeps.
7. Read the held records count and `<refused event>` in the Mixpanel project again.

**Expected Results:**

* Step 3 shows Lot Watched once each for `<lot_1>` and `<lot_3>`, and no Bid Placed.
* Step 4 shows zero waiting records and one held record.
* Step 5 shows the alarm raised for the held record.
* Step 7 shows one held record and still no Bid Placed; nothing sent it or dropped it.

<!-- trace:case id=g10.analytics-analytics.TC-kqh rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC25-1: Held profile write never lands over a later one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer A(member on Silver) has a user id, and their Mixpanel user profile's Tier is `Silver`.
* customer B(member on Silver) has a user id.
* The loyalty worker has a Mixpanel token.
* Mixpanel refuses the profile write that sets customer A's Tier to `Gold`, and accepts every other send.

**Steps:**

1. Move customer A from Silver to Gold.
2. Move customer B from Silver to Gold before the loyalty worker's next sweep.
3. Wait for the loyalty worker's sweep.
4. Read the loyalty worker's held records count.
5. Move customer A from Gold to Black.
6. Wait for the loyalty worker's next sweep.
7. Read customer A's Mixpanel user profile's Tier.
8. Wait for two more sweeps.
9. Read customer A's Mixpanel user profile's Tier again.

**Expected Results:**

* Step 4 shows one held record, customer A's Gold write.
* Step 7 shows Tier `Black`; the held write did not delay it.
* Step 9 still shows Tier `Black`.

<!-- trace:case id=g10.analytics-analytics.TC-3cx rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC26-1: Profile ends on the latest write after an outage

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(member on Silver) has a user id, and the Mixpanel user profile's Tier is `Silver`.
* The loyalty worker has a Mixpanel token.
* Mixpanel is made unreachable from the loyalty worker.

**Steps:**

1. Move the member from Silver to Gold.
2. Wait for a sweep to fail.
3. Move the member from Gold to Black.
4. Wait for a sweep to fail.
5. Make Mixpanel reachable.
6. Wait 20 minutes.
7. Read the Mixpanel user profile's Tier.
8. Read the loyalty worker's waiting records count.

**Expected Results:**

* Step 7 shows Tier `Black`.
* Step 8 shows zero waiting records.

<!-- trace:case id=g10.analytics-analytics.TC-uyx rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC27-1: Erased account's waiting and held records go with it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(member on Silver) has a user id.
* The loyalty worker has a Mixpanel token.
* The member's `<held record>` is held on the loyalty worker.
* Mixpanel is made unreachable from the loyalty worker, and the member's `<waiting record>` waits there.

**Test data:**

| Field | Value |
| --- | --- |
| `<held record>` | Reward Redeemed for `<reward_2>`, refused by Mixpanel |
| `<waiting record>` | Reward Redeemed for `<reward_3>`, redeemed during the outage |

**Steps:**

1. Erase the member's account.
2. Read the loyalty worker's waiting and held records for the member.
3. Make Mixpanel reachable.
4. Wait 20 minutes.
5. Search the Mixpanel project for the member's user id.

**Expected Results:**

* Step 2 shows neither `<held record>` nor `<waiting record>`, waiting or held.
* Step 5 finds no Reward Redeemed for `<reward_2>` or `<reward_3>`.
* Step 5 finds the profile write the erasure itself made: Member false, no Tier.

<!-- trace:case id=g10.analytics-analytics.TC-qhu rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC28-1: Worker with an empty token writes no record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker runs with an empty Mixpanel token since its last deploy.
* Nothing waits or is held on the store worker.

**Steps:**

1. Pay `<order_9>` as customer(collector).
2. Read `<order_9>`'s payment state.
3. Read the store worker's waiting and held records counts.
4. Read the store worker's log since that deploy.

**Expected Results:**

* Step 2 shows `<order_9>` paid.
* Step 3 shows zero waiting and zero held records.
* Step 4 shows the store's Mixpanel records are off, its token empty.

<!-- trace:case id=g10.analytics-analytics.TC-mlg rev=1 covers=g10.analytics-analytics.SC-pih,g10.analytics-analytics.SC-knh,g10.analytics-analytics.SC-de4,g10.analytics-analytics.SC-r2p,g10.analytics-analytics.SC-5it,g10.analytics-analytics.SC-v9d,g10.analytics-analytics.SC-yhx,g10.analytics-analytics.SC-22m,g10.analytics-analytics.SC-mer,g10.analytics-analytics.SC-brm,g10.analytics-analytics.SC-kt8,g10.analytics-analytics.SC-ehg,g10.analytics-analytics.SC-9wu -->
### grade10-site-analytics-US1-TC29-1: Browser batch failure stays best effort

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(collector) is signed in on `<grade10 store url>`.
* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker.
* Nothing waits or is held on the store worker.

**Steps:**

1. Open `<product_1>`'s page on `<grade10 store url>`.
2. Wait for the browser to post its client batch to `/api/track`.
3. Read the store worker's waiting and held records counts.
4. Make Mixpanel reachable.
5. Wait for the browser's next flush, with the page still open.
6. Read Product Viewed for `<product_1>` in the Mixpanel project.

**Expected Results:**

* Step 2's `/api/track` answers 500.
* Step 3 shows zero waiting and zero held records; neither the batch nor its Audience write waits.
* Step 5 sends the batch with the same `$insert_id`s.
* Step 6 shows Product Viewed once.

## Settled

- Contact fields stay off Mixpanel for this change; whether `$email`,
  `$name`, and `$phone` land later waits on Consent and Mixpanel erasure.
- Signed In and Signed Out are not Mixpanel events; session end rotates
  the device instead.
- Mixpanel is not the money, points, or loan ledger.
- An event with neither a user nor a device is refused and its fact still
  commits; no Delivery rule states it, since Q13 decided it and today's send
  path already runs it.
- Bid Placed fires when a maximum is accepted; no card hold is taken or captured at bid time, so nothing in the auction funnel records one (decisions Q1).

## Reconciliation

**Run:** 2026-09-29 · blind pass read `## Purpose` and `## Feature set`,
`user-journeys.md` (Walked by nobody), `proposal.md`, `decisions.md`, and
Product Analytics · Delivery and Mixpanel Events. Denied: every
`## Requirements` section and `openspec/changes/archive/`. The durable suite
was read for ids only, its `## Reconciliation` stripped.

- **Uncovered anchors** - none; every Delivery leaf carries a case.
- **Folded in** - a worker stopping right after the commit still sends
  (TC20) and the erasure's own profile write is still sent (TC27) became
  lines of the scenarios on those rules.
- **Dropped and recorded** - an event with no user and no device is refused
  and the fact commits (Q13); it runs today, is no Delivery leaf, and the
  outline's first draft of it as a requirement was removed.
- **Raised** - five questions, each answered in `decisions.md` under
  `## Raised`: a backlog drained over several sweeps, which answers are a
  refusal, a token emptied with records waiting, device-only records at
  erasure, and a held profile write passed by a later one.

**Run:** 2026-09-18 · blind pass read `## Purpose` and `## Feature set`,
`user-journeys.md` (Walked by nobody), `proposal.md`, and the Analytics /
Mixpanel Events PRD pages. Denied: every `## Requirements` section and
`openspec/changes/archive/`. No prior durable `feature-tcs.md` for id
continuity.

- **Uncovered anchors** — none. All four Feature set root groups this
  change introduces — Identity, Events, User profile, Refusals —
  carry at least one case.
- **Raised** — none new; Consent, Mixpanel erasure, and Contact fields
  already sit on the proposal's open questions and the Mixpanel Events
  decisions table.

| Finding | Disposition |
| --- | --- |
| Invoice Paid never fires on a bid hold capture | **Removed:** a bid takes no card hold, so nothing captures one; `grade10-site-analytics-US1-TC12-1` rewritten as `grade10-site-analytics-US1-TC12-2` without the step |

**Run:** 2026-10-02, from the delta against the durable suite. It is a statement, not proof.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Renumbered** - QA1's case was written as `grade10-site-analytics-US1-TC12-1`, below main's `grade10-site-analytics-US1-TC12-2`, which `my-auctions-without-bid-holds` wrote. It adds a refused maximum to the same funnel, so it is `grade10-site-analytics-US1-TC12-3`
- **Folded in** - `grade10-site-analytics-SC-59` by `grade10-site-analytics-US1-TC12-3`; `grade10-site-analytics-SC-18`, `grade10-site-analytics-SC-19` and `grade10-site-analytics-SC-21` stand by it as by main's revision
- **Added by QA2** - in `grade10-site-analytics-US1-TC12-3`, that no Bidder Outbid is recorded for this collector, the second half of `grade10-site-analytics-SC-59`
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
