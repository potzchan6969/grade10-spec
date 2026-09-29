# grade10-site/analytics Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

**Out of suite:** none — every Feature set root group this change introduces
carries cases below. The capability is walked by nobody on their own; cases
trace those groups.

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

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

### grade10-site-analytics-US1-TC12-1: Auction funnel events

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

- customer(collector) can open a live lot, link a card, watch, and bid.

**Steps:**

1. Open a lot page.
2. Watch the lot without bidding.
3. Link a card and place an accepted maximum.
4. Let the engine place an auto-bid step under that maximum.
5. Capture a bid hold.
6. Close the listing with this collector as winner and pay the invoice.

**Expected Results:**

- Mixpanel records Lot Viewed (not Product Viewed), Lot Watched, Card Linked, Bid Placed once for the accepted maximum, Auction Won, and Invoice Paid.
- Mixpanel does not record Bid Placed for the auto-bid step, Invoice Paid for the hold capture, or Lot Watched because a bid was placed.

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

## Settled

- Contact fields stay off Mixpanel for this change; whether `$email`,
  `$name`, and `$phone` land later waits on Consent and Mixpanel erasure.
- Signed In and Signed Out are not Mixpanel events; session end rotates
  the device instead.
- Mixpanel is not the money, points, or loan ledger.

## Reconciliation

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
