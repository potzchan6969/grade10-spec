# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened · 0/13
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Every listing is priced in USD, whole dollars. The step is chosen by the amount being beaten: +USD25 from USD200, +USD50 from USD500, +USD100 from USD1,000, +USD250 from USD2,500 and +USD500 from USD5,000.
* A bid is a maximum: Grade10 bids for its holder up to it, one step over the rival. No bid takes a card hold; a collector's card is read at the card provider's test dashboard, where nothing shows until an invoice is paid.
* `<g10url>` is the Grade10 site and `<adm url>` the admin console of the environment under test. My Auctions and the Bids page (`<g10url>/bids`) are the signed-in collector's own.

## Walk 1: A lot from the gallery to the close

Starting state:

- An operator is in `<adm url>` on `<listing>`, a published USD listing starting at USD400, closing in 20 minutes, with no image.
- customer A(signed out, has an account, no card) and customer B(signed in, card linked) are on separate sessions.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A published USD listing in no campaign |
| card | The card provider's test card 4242 4242 4242 4242 |

### Route

1. As the operator, add an image to `<listing>`'s gallery and confirm it.
   - The catalogue card and the listing gallery show it. `g10.auction-dmn.US1-TC1`
2. As customer A, open `<g10url>/auction`, open `<listing>`'s card, sign in from the bid panel, link `<card>` and bid USD400.
   - Leading at USD400 on the page, My Auctions and the Bids page. `g10.auction-dmn.US3-TC1`
3. As customer B, place a maximum of USD600; as customer A, raise to USD550.
   - customer A's raise is answered at USD600 and B leads; A reads Outbid everywhere, with nothing on the card. `g10.auction-dmn.US4-TC1`
4. As customer A, place USD575.
   - Refused, naming USD650; nothing moves on any surface. `g10.auction-dmn.US3-TC2`
5. Let `<listing>` close.
   - The card and the page turn to Sold without a reload; B reads Won, A Didn't win, alike on every surface. `g10.auction-dmn.US12-TC1`

## g10.auction-dmn.US1: Operator publishes a gallery a collector can shop

**As an** operator with catalogue grant,
**I want** the images and alt text I confirm on a draft listing to be what the
catalogue and the listing page show,
**so that** a collector shops the card I photographed rather than a placeholder.

<!-- trace:case id=g10.auction-dmn.TC-5l7 rev=2 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j,g10.auction-listing-media.SC-41j,g10.auction-listing-media.SC-j5f,g10.auction-listing-media.SC-1mk,g10.auction-listing-media.SC-su1,g10.auction-listing-media.SC-y9i,g10.auction-listing-media.SC-dva,g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
### g10.auction-dmn.US1-TC1: A confirmed gallery image reaches the catalogue card and the listing gallery

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-01

**Pre-conditions:**

* admin(holds auction:write) is on `<listing>`'s editor; `<listing>` is published with no image.

**Steps:**

1. Add a JPEG with alt text "Charizard front" to the gallery and confirm it.
2. As a signed-out visitor, open `<g10url>/auction` and find `<listing>`'s card.
3. Open the card.

**Expected Results:**

* Step 2: the card shows the image.
* Step 3: the listing's gallery shows it first, its alt text "Charizard front".

---

## g10.auction-dmn.US3: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my bid stands on, with nothing taken from it until I win.

<!-- trace:case id=g10.auction-dmn.TC-rl3 rev=4 -->
### g10.auction-dmn.US3-TC1: A signed-out visitor goes from the catalogue to an accepted first bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-05, grade10-site-auction-bid-panel-enrollment-US-01, grade10-site-auction-bid-panel-enrollment-US-02, grade10-site-auction-bid-panel-enrollment-US-04, grade10-site-auction-account-record-US-06, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer has an account with no card linked, and is signed out; `<listing>` is open at USD400 with no bid.

**Steps:**

1. Open `<g10url>/auction` and select `<listing>`'s card.
2. Select Sign in to bid on the bid panel and sign in.
3. Link the card provider's test card from the bid panel.
4. Place USD400.
5. Open My Auctions, then the Bids page.

**Expected Results:**

* Step 1 opens `<listing>`'s own page.
* Step 2 returns to the same listing, signed in.
* Step 3 shows the card on file and enables the bid.
* Step 4 is accepted: Leading at USD400, one alerts toast, nothing held on the card.
* Step 5: My Auctions lists `<listing>` once, Leading; the Bids page shows it under Active with a maximum set at USD400.

<!-- trace:case id=g10.auction-dmn.TC-5pk rev=4 -->
### g10.auction-dmn.US3-TC2: A refused bid shows on the bid form and moves nothing anywhere

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14, grade10-site-auction-auto-bidding-US-01, grade10-site-auction-bidding-history-US-02, grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, card linked) is Outbid on `<listing>` at a current bid of USD600, customer B leading with a maximum of USD800; Recent bids, My Auctions and the Bids page are noted.

**Test data:**

| `<bid>` | `<form says>` |
| --- | --- |
| USD625 | Minimum bid is USD650 (fixed derived: USD600 plus the USD50 step) |
| USD649 | Minimum bid is USD650 |

**Steps:**

1. Enter `<bid>` in the custom maximum and confirm.
2. Read Recent bids, then My Auctions and the Bids page.

**Expected Results:**

* Step 1: the bid form says `<form says>`.
* Step 2 matches the note: no new row, no standing change, no history entry.

---

## g10.auction-dmn.US4: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** to commit one maximum and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page, and nothing is taken
from my card until I win.

<!-- trace:case id=g10.auction-dmn.TC-r2v rev=3 -->
### g10.auction-dmn.US4-TC1: Two maxima settle at the lower one plus a step, and every surface tells both collectors so

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-listing-page-US-12, grade10-site-auction-notifications-US-03, grade10-site-auction-bidding-history-US-03, grade10-site-auction-bidding-history-US-05, grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A leads `<listing>` at USD400 with a maximum of USD400; customer A has its page open.
* customer B(signed in, card linked) is on the same page in another session.

**Steps:**

1. As customer B, place a maximum of USD600.
2. As customer A, read the open page without reloading.
3. As customer A, place a maximum of USD550.
4. As customer A, read the inbox, My Auctions and the Bids page, and expand `<listing>`.
5. As customer B, read Your maximum and Recent bids.

**Expected Results:**

* Step 2: the price moves to USD425 (USD400 plus the USD25 step) and customer A reads Outbid, live.
* Step 3: customer A's USD550 is answered automatically at USD600, capped at customer B's maximum; customer B still leads.
* Step 4: one You have been outbid letter; My Auctions reads Outbid with the next valid bid USD650; the Bids page lists Outbid, and its history names the movement that outbid You and offers the listing.
* Step 5: customer B reads Your maximum USD600; Recent bids shows the price under listing pseudonyms and never customer A's maximum.
* Neither card shows a hold or a charge.

---

## g10.auction-dmn.US6: Collector shares a listing link

**As a** collector,
**I want** a listing link I pass on to unfurl as that listing and open live,
**so that** whoever I send it to reads the card I meant, not the catalogue.

<!-- trace:case id=g10.auction-dmn.TC-wrl rev=3 -->
### g10.auction-dmn.US6-TC1: A shared listing link reads whole without scripts and stays the same as it comes alive

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-04, grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing>` is open with bids; a visitor holds its link, as a chat would carry it.

**Steps:**

1. With scripts turned off, open the link.
2. Turn scripts on and reload.

**Expected Results:**

* Step 1 shows the title, gallery, price, time left and Recent bids, nothing replaced by a placeholder.
* Step 2 shows the same price, standing and Recent bids, and the time left continues from what was served.

---

## g10.auction-dmn.US7: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

<!-- trace:case id=g10.auction-dmn.TC-wh3 rev=3 -->
### g10.auction-dmn.US7-TC3: A price-moving bid in the last minutes extends the close everywhere at once

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
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-12, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-12, grade10-site-auction-listing-page-US-13, grade10-site-auction-auction-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing>` is a Featured listing in its last minute, extension 30 minutes; customer A leads at USD400 with a maximum of USD700; customer B(signed in, card linked) is on its page; a third session has the catalogue open.

**Test data:**

| `<customer B bid>` | `<price after>` |
| --- | --- |
| A maximum of USD800, past customer A's | USD750 (USD700 plus the USD50 step), customer B leading |
| A maximum of USD500, answered by customer A's | USD550 (USD500 plus the USD50 step), customer A leading |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the open page, the catalogue card and the Featured slide, without reloading.

**Expected Results:**

* The price reads `<price after>`, and every surface reads the same new close, 30 minutes on, with its timer restarted.

<!-- trace:case id=g10.auction-dmn.TC-5yl rev=2 -->
### g10.auction-dmn.US7-TC2: Extensions stop at the cap while bids are still accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-12

**Pre-conditions:**

* `<listing>` has an extension cap, and its close has been pushed out to the cap; customer B(signed in, card linked) is on its page in the last minute.

**Steps:**

1. As customer B, place a maximum past the leader's.
2. Read the page's close and Recent bids.

**Expected Results:**

* The bid is accepted and leads, and the close stays at the cap.

---

## g10.auction-dmn.US9: Collector meets a listing that is not there

**As a** collector,
**I want** a dead listing address to say so plainly,
**so that** I am never shown an empty page in place of a listing.

<!-- trace:case id=g10.auction-dmn.TC-0rf rev=1 -->
### g10.auction-dmn.US9-TC1: An address that names no public listing shows Page not found, and a reused one opens its new listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03, grade10-site-auction-listing-page-US-01, grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* `<address>` is `<g10url>/auction/listings/<slug>` in the state the row names.

**Test data:**

| `<state>` | `<page>` |
| --- | --- |
| Never used | Page not found |
| A draft listing's | Page not found |
| Released by a hidden listing, unused since | Page not found |
| Released, then taken by a newly published listing | The new listing |

**Steps:**

1. Open `<address>`, and search the catalogue for the slug's words.

**Expected Results:**

* The address shows `<page>`; the catalogue lists only a published listing.

---

## g10.auction-dmn.US12: Bidders follow a listing through its close to their record

**As a** bidder,
**I want** the listing page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-dmn.TC-3iz rev=3 -->
### g10.auction-dmn.US12-TC1: At the close every surface turns at once and reads one result for the winner and the losing bidder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-lot-status-US-01, grade10-site-auction-account-record-US-04, grade10-site-auction-account-record-US-10, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* customer B leads `<listing>` at USD600 over customer A's maximum of USD550; customer D watches it without bidding; it closes in a minute, with its page and the catalogue open.

**Steps:**

1. Let `<listing>` close, without reloading either page.
2. As customer B, read the page and My Auctions.
3. As customer A, read the page, My Auctions and the inbox.
4. As customer D, read the inbox.

**Expected Results:**

* Step 1: the page and the catalogue card turn to Sold for USD600 without a reload.
* Step 2: Won, at USD600, with View order.
* Step 3: Did not win on the page; My Auctions reads Didn't win at USD600, the card not charged; one You did not win letter naming USD600 and customer A's bid.
* Step 4: one Lot watched, sold letter naming Sold for USD600.

<!-- trace:case id=g10.auction-domain.TC-k4p rev=6 covers=g10.auction-winner-order.SC-ug0,g10.auction-winner-order.SC-fq4 -->
### g10.auction-dmn.US12-TC3: A winner opens the order, pays the total shown, and the documents agree

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-02, winner-order-US-01, winner-order-US-24, winner-order-US-25, winner-order-US-26, winner-order-US-27

**Pre-conditions:**

* customer won `<listing>` at USD101; an operator will quote Shipping & Handling USD10.01.

**Test data:**

| `<currency>` | `<method>` | `<total>` |
| --- | --- | --- |
| USD | Card, USD rule 4.4% plus USD0.30 | USD137.56 (fixed derived: USD131.21 grossed up by the rule) |
| HKD | Card, HKD rule 3.4% plus HKD2.35 | HKD1,068.69 (fixed derived: HKD1,030.00 grossed up by the rule) |

**Steps:**

1. Open the order from My Auctions, confirm the address, and pick `<currency>` and `<method>`.
2. Once the invoice is sent, pay `<total>`.
3. Open the invoice PDF, the receipt PDF and the Payment received letter.

**Expected Results:**

* Step 2 charges exactly `<total>`.
* Step 3: all three list Winning Bid USD101.00, Buyer's Premium USD20.20 and Shipping & Handling USD10.01, and the same Order Total `<total>`.

<!-- trace:case id=g10.auction-dmn.TC-7dr rev=1 -->
### g10.auction-dmn.US12-TC5: A call-off ends the listing for its bidders on every surface and sends nothing more

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-lot-status-US-03, grade10-site-auction-account-record-US-04, grade10-site-auction-bidding-history-US-01, grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid on open `<listing>` and customer D watches it; admin(holds auction:operate) is on its editor.

**Steps:**

1. Call off `<listing>`.
2. As customer A, read the listing page, My Auctions and the Bids page.
3. Let `<listing>`'s scheduled close pass, then read customer A's and customer D's inboxes.

**Expected Results:**

* Step 2: the page reads Canceled with no bid panel; My Auctions reads Didn't win, the card not charged; the Bids page lists it under Completed, Canceled.
* Step 3: no close letter to either.

---

## g10.auction-dmn.US13: Collectors bid against a house maximum through the close

**As a** collector,
**I want** to compete for a listing to its close, with each bid, extension, result and letter decided by the auction rules,
**so that** what I read, and what I am told, is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-88l rev=3 -->
### g10.auction-dmn.US13-TC1: A house maximum bids like a collector's, under its own pseudonym, through the close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-12, grade10-site-auction-notifications-US-03, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Pre-conditions:**

* `<listing>` is open at USD4,000 with an internal bid of USD6,000 committing in a few minutes; customer A leads at USD4,000 with a maximum of USD5,000; customer D watches it.

**Test data:**

| `<customer A act>` | `<close>` |
| --- | --- |
| None | The house wins at USD5,500 (fixed derived: USD5,000 plus the USD500 step) |
| In the last minute, raise to USD7,000 | customer A wins at USD6,500 (fixed derived: USD6,000 plus the USD500 step), after one extension |

**Steps:**

1. Wait until the internal bid commits, and read Recent bids and customer A's inbox.
2. `<customer A act>`, then let `<listing>` close.
3. Read the page, customer A's My Auctions and inbox, and customer D's inbox.

**Expected Results:**

* Step 1: the house leads at USD5,500 under a listing pseudonym, as any bidder; customer A gets one You have been outbid naming no house.
* Step 3 reads `<close>`: the page reads Sold at that price; customer A reads Won or Didn't win to match, and a lost row says the card was not charged; customer D gets one Lot watched, sold; no letter names the house.

---

## g10.auction-dmn.US10: Exploratory passes

**As a** tester,
**I want** a timed pass off the scripted paths,
**so that** what no case names is still looked at.

<!-- trace:case id=g10.auction-dmn.TC-cnk rev=1 -->
### g10.auction-dmn.US10-TC1: An hour's exploratory pass finds nothing out of step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* Two collectors with cards linked, and several open listings, some closing within the hour.

**Test data:**

| `<charter>` |
| --- |
| From the catalogue to a bid: search, sort, Featured, watch, open, link a card, bid |
| Competing maxima and the closing minutes: raises, ties, refusals, extensions |

**Steps:**

1. Roam `<charter>` for one hour, noting every surface that disagrees with another.

**Expected Results:**

* Every surface reads the same price, standing and close at the same moment, and every refusal names its reason.

---

## Settled

- No domain case reads a card hold, a card authorization or a payment confirmation; a case that reads the card reads that nothing is held or charged on it.
- A refused attempt is not a bid: it shows on the bid form that made it and nowhere in the bidder's history, My Auctions or the lot's public record.
- A losing row on My Auctions reads "Your card was not charged."
