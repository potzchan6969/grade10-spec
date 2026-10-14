# grade10-site/auction/auction Test Cases

**Status:** reopened · 14/63
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** `grade10-site-auction-watchlist-SC-04` — signed-out watch from catalogue cards

## Walk 1: Collector browses Auction listings and adjacent checks

**Starting state:**

- `<listing_11>` is published.
- customer(card linked, no bid on `<listing_25>`) is signed in.
- `<listing_25>` is open inside its window.
- `<listing_2>` is in extended bidding and its recorded close is `<close before bids>`.
- `<listing_3>` is in extended bidding and its recorded close is its scheduled close plus `<extension cap>`.
- `<listing_4>` is open with one accepted bid.
- `<listing_5>` is open with an accepted bid and extension duration 0.
- `<listing_6>` is open with scheduled close `<scheduled close>` and extension duration 1800s (30mins).
- `<listing_6>` holds the row's `<bids by close>`.
- `<listing_7>` is open with no accepted bid, scheduled close 20:00:00 UTC, and extension duration 1800s (30mins).
- `<listing_8>` and `<listing_9>` are both in extended bidding with recorded close 20:30 UTC.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_11>` | A published listing with extension duration 1800s (30mins) and an extension cap of 3600s (60mins) |
| `<listing_25>` | An open HKD listing taking bids, current bid `<current bid>` |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<bid amount>` | HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<close before bids>` | 20:30 UTC |
| `<first bid time>` | 20:10 UTC |
| `<second bid time>` | 20:35 UTC |
| `<close after first>` | 20:40 UTC |
| `<close after second>` | 21:05 UTC |
| `<listing_3>` | A listing in extended bidding whose recorded close already stands at its cap |
| `<scheduled close>` | 20:00 UTC |
| `<extension cap>` | 3600s (60mins), any cap the listing has already reached |
| `<result>` | 21:00 UTC |
| `<listing_4>` | An open listing, scheduled close `<scheduled close>`, extension duration `<short duration>` |
| `<short duration>` | 300s (5mins), any extension duration above 0 |
| `<result>` | 20:05 UTC |
| `<listing_5>` | An open listing with an accepted bid, extension duration 0s |
| Item | `<bids by close>`: None; `<scheduled close>`: 20:00 UTC; `<extended close>`: —; `<result>`: Closed at 20:00 UTC |
| Item | `<bids by close>`: One; `<scheduled close>`: 20:00 UTC; `<extended close>`: 20:30 UTC; `<result>`: Recorded close is 20:30 UTC; with no further bid, closed at 20:30 UTC |
| 19:59:00 UTC | 20:00:00 UTC, unchanged |
| 20:00:00 UTC | 20:30:00 UTC, the listing in extended bidding |
| `<listing_8>` | A listing with scheduled close 20:00 UTC, in extended bidding, extension duration 1800s (30mins) |
| `<listing_9>` | A second listing in the same state as `<listing_8>` |

### Route

1. Read the API response for `<listing_11>`.
   - It carries the scheduled close, the recorded close, the extension duration and the extension cap. g10.auction-auction.US1-TC2
   - It carries no extension window. g10.auction-auction.US1-TC2
   - It carries no reserve state. g10.auction-auction.US1-TC2
2. Submit `<bid amount>` on `<listing_25>`.
3. Read the API response.
   - accepts the bid in the one answer, by the listing's bid rules, with no wait on the card provider. g10.auction-auction.US2-TC5
4. Read the linked card's activity at the card provider.
   - shows nothing held or charged on the card for `<listing_25>`. g10.auction-auction.US2-TC5
5. Submit a valid bid at `<first bid time>`.
6. Read the recorded close.
7. Submit a valid bid at `<second bid time>`.
8. Read the recorded close.
   - The recorded close reads `<first bid time>` plus `<extension duration>` = `<close after first>`. g10.auction-auction.US2-TC10
   - The recorded close reads `<second bid time>` plus `<extension duration>` = `<close after second>`. g10.auction-auction.US2-TC10
9. Submit a valid bid.
   - The bid is accepted. g10.auction-auction.US2-TC11
10. Read the recorded close.
   - The recorded close reads `<scheduled close>` plus `<extension cap>`. g10.auction-auction.US2-TC11
11. Wait until the recorded close passes.
   - The listing closes at `<result>`. g10.auction-auction.US2-TC11
12. Wait for `<scheduled close>`.
   - The listing is in extended bidding. g10.auction-auction.US2-TC12
13. Read the recorded close.
   - The recorded close reads `<scheduled close>` plus `<short duration>` = `<result>`. g10.auction-auction.US2-TC12
14. Wait for the scheduled close.
   - The listing is closed at its scheduled close. g10.auction-auction.US2-TC13
15. Read the listing's state and recorded close.
   - It never entered extended bidding. g10.auction-auction.US2-TC13
16. Wait for `<scheduled close>`.
17. Read the listing's state and recorded close.
18. When the row has `<extended close>`, wait until `<extended close>` with no bid.
19. Read the listing's state.
   - The listing reads `<result>`. g10.auction-auction.US2-TC14
20. Submit a valid bid at `<bid time>`.
   - The bid is accepted. g10.auction-auction.US2-TC6
21. Read the recorded close.
   - The recorded close reads as the row states. g10.auction-auction.US2-TC6
22. Submit a valid bid on `<listing_8>` at 20:10 UTC.
   - `<listing_8>` reads 20:40 UTC. g10.auction-auction.US2-TC7
23. Read both recorded closes.
   - `<listing_9>` still reads 20:30 UTC. g10.auction-auction.US2-TC7

## Walk 2: Collector places a bid inside the window

**Starting state:**

- customer(no bid on `<listing_2>`, card saved) is signed in and on `<listing_2>`.
- `<listing_2>` is in extended bidding.
- `<listing_10>` entered extended bidding and its recorded close has passed.
- `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
- customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.
- `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
- customer(card linked, no bid on `<listing_22>`) is signed in.
- `<listing_26>` is open inside its window, current bid `<current bid>`.
- customer A(card linked) and customer B(card linked) are signed in on separate sessions, neither holding a bid on `<listing_26>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<listing_10>` | A listing whose extended bidding timer ran out with no new bid |
| Item | Currency: HKD; `<start>`: HKD280 (range: 1000–79999 minor units), positive start; `<opening price>`: HKD280 (range: 1000–79999 minor units), the start itself; `<next minimum>`: HKD290 (fixed derived value) |
| Item | Currency: HKD; `<start>`: HKD7 (fixed boundary or equality), below the lowest increment; `<opening price>`: HKD7 (range: 1–999 minor units), the start itself; `<next minimum>`: HKD17 (fixed derived value) |
| Item | Currency: HKD; `<start>`: HKD0 (fixed tier boundary), zero start; `<opening price>`: HKD10 (fixed boundary or equality), the lowest increment; `<next minimum>`: HKD20 (fixed derived value) |
| Item | Currency: USD; `<start>`: USD0 (fixed tier boundary), zero start; `<opening price>`: USD1 (fixed boundary or equality), the lowest increment; `<next minimum>`: USD2 (fixed derived value) |
| Item | Currency: JPY; `<start>`: JPY0 (fixed tier boundary), zero start; `<opening price>`: JPY100 (fixed boundary or equality), the lowest increment; `<next minimum>`: JPY200 (fixed derived value) |
| Item | Currency: HKD; `<start>`: HKD280 (range: 1000–79999 minor units); `<opening price>`: HKD280 (range: 1000–79999 minor units), the start itself; `<bid amount>`: HKD279.99 (fixed boundary or equality), one minor unit below |
| Item | Currency: USD; `<start>`: USD500 (fixed tier boundary); `<opening price>`: USD500 (fixed tier boundary), the start itself; `<bid amount>`: USD499.99 (fixed boundary or equality), one minor unit below |
| Item | Currency: JPY; `<start>`: JPY20,000 (range: 15000–74999 minor units); `<opening price>`: JPY20,000 (range: 15000–74999 minor units), the start itself; `<bid amount>`: JPY19,999 (fixed boundary or equality), one minor unit below |
| Item | Currency: HKD; `<start>`: HKD0 (fixed tier boundary), zero start; `<opening price>`: HKD10 (fixed boundary or equality), the lowest increment; `<bid amount>`: HKD9.99 (fixed boundary or equality), one minor unit below |
| Item | Currency: USD; `<start>`: USD0 (fixed tier boundary), zero start; `<opening price>`: USD1 (fixed boundary or equality), the lowest increment; `<bid amount>`: USD0.99 (fixed boundary or equality), one minor unit below |
| Item | Currency: JPY; `<start>`: JPY0 (fixed tier boundary), zero start; `<opening price>`: JPY100 (fixed boundary or equality), the lowest increment; `<bid amount>`: JPY99 (fixed boundary or equality), one minor unit below |
| `<listing_26>` | An open HKD listing taking bids, led by customer C at `<current bid>` with maximum `<current bid>` |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<increment>` | HKD80 (fixed tier increment), the HK$4,000 tier |
| `<bid A>` | HKD5,210 (range: 400000–799999 minor units) |
| `<bid B>` | HKD6,200 (range: 400000–799999 minor units), above `<bid A>` |

### Route

1. Submit a bid at the minimum next bid.
   - The bid is accepted. g10.auction-auction.US2-TC8
2. Read Time left.
   - The close moves to `<extension duration>` after that bid. g10.auction-auction.US2-TC8
3. Submit a bid at the minimum next bid.
   - Grade10 refuses the bid. g10.auction-auction.US2-TC9
4. Read the listing's bids and recorded close.
   - No accepted bid is added and the recorded close is unchanged. g10.auction-auction.US2-TC9
5. Enter the row's `<opening price>` in the custom maximum on the bid panel.
   - The bid is accepted. g10.auction-auction.US2-TC15
6. Place the bid.
   - Highest bid reads `<opening price>`, never 0. g10.auction-auction.US2-TC15
7. Read Highest bid, the bid count and Recent Bids.
   - The bid count reads 1, and Recent Bids shows the bid as You. g10.auction-auction.US2-TC15
8. Read the minimum next bid.
   - reads `<next minimum>`, `<opening price>` plus its tier increment. g10.auction-auction.US2-TC15
9. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
10. Read the API response.
11. Read `<listing_22>`'s bids and bid count.
   - Grade10 refuses the bid, naming `<opening price>` as the minimum. g10.auction-auction.US2-TC16
   - No accepted bid is recorded, and the bid count stays 0. g10.auction-auction.US2-TC16
12. Submit `<bid A>` as customer A and `<bid B>` as customer B on `<listing_26>` at the same moment.
   - Each response is one answer: accepted with a standing, or refused. g10.auction-auction.US2-TC19
13. Read both API responses.
   - customer B leads, and Highest bid reads `<bid A>` plus `<increment>`. g10.auction-auction.US2-TC19
14. Read `<listing_26>` from the public listing API.
   - No lower bid overwrites that Highest bid, whichever response arrived first. g10.auction-auction.US2-TC19

## Walk 3: Collector meets the identity bar on a high-value bid

**Starting state:**

- The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_12>`.
- `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.
- The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, holds no bid on `<listing_12>`, and is on `<listing_12>`.
- The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, and is on `<listing_13>`.
- `<listing_13>` is live, inside its window, in USD, and its minimum next bid is at or below `<bid_amount>`.

**Shared test data:**

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US4-TC1 | a verified account | An account whose standing is `verified` on the day of the bid | · |
| g10.auction-auction.US4-TC1 | card | Visa ending 4242 | · |
| g10.auction-auction.US4-TC1 | bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |
| g10.auction-auction.US4-TC1 | listing_12 | A live USD listing whose minimum next bid is `<bar>` | · |
| g10.auction-auction.US4-TC1 | bid at the bar | USD15,000 | (fixed boundary or equality), equal to `<bar>` |

| Case | `<account_standing>` | `<bid_amount>` | Outcome | Fixture notes |
| --- | --- | --- | --- | --- |
| g10.auction-auction.US4-TC2 | `unverified` | USD15,000 | Refused; no bid recorded | `<bid_amount>`: (fixed boundary or equality), exactly `<bar>` |
| g10.auction-auction.US4-TC2 | `unverified` | USD15,200 | Refused; no bid recorded | `<bid_amount>`: (range: >1500000 minor units), above `<bar>` |
| g10.auction-auction.US4-TC2 | `expired` | USD15,000 | Refused; no bid recorded | `<bid_amount>`: (fixed boundary or equality), exactly `<bar>` |
| g10.auction-auction.US4-TC2 | `expired` | USD15,200 | Refused; no bid recorded | `<bid_amount>`: (range: >1500000 minor units), above `<bar>` |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US4-TC2 | card | Visa ending 4242 | · |
| g10.auction-auction.US4-TC2 | bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |
| g10.auction-auction.US4-TC2 | listing_12 | A live USD listing whose minimum next bid is `<bar>` | · |

| Case | `<account_standing>` | `<bid_amount>` | Outcome | Fixture notes |
| --- | --- | --- | --- | --- |
| g10.auction-auction.US4-TC3 | `unverified` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| g10.auction-auction.US4-TC3 | `expired` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| g10.auction-auction.US4-TC3 | `verified` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| g10.auction-auction.US4-TC3 | `unverified` | USD14,999.00 | Forwarded; no standing read | `<bid_amount>`: (fixed boundary or equality), one dollar below `<bar>` |
| g10.auction-auction.US4-TC3 | `unverified` | USD14,999.99 | Forwarded; no standing read | `<bid_amount>`: (fixed boundary or equality), one cent below `<bar>` |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US4-TC3 | card | Visa ending 4242 | · |
| g10.auction-auction.US4-TC3 | bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US4-TC3 | listing_13 | A live USD listing inside its bidding window, minimum next bid at or below `<bid_amount>`; bind its identity only |

### Route

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.
   - The bid is forwarded and accepted as any other - no refusal names a verified identity. g10.auction-auction.US4-TC1
   - Highest bid reads `<bid at the bar>`, and the bid count rises by one. g10.auction-auction.US4-TC1
   - Step 3 shows nothing held or charged on `<card>`. g10.auction-auction.US4-TC1
4. Enter `<bid_amount>` in the bid field and select **Place Bid**.
5. Read the refusal on the bid form.
6. Reload `<listing_12>` and read Highest bid and the bid count.
7. Navigate to `<my auctions url>` and look for `<listing_12>`.
   - Step 7 shows no row for `<listing_12>`. g10.auction-auction.US4-TC2
8. Navigate to `<grade10 bids url>` and look for `<listing_12>`.
   - The bid is refused as needing a verified identity, and the form says: Bids this high need a verified identity. Verify from your account, then bid again. g10.auction-auction.US4-TC2
   - Highest bid and the bid count are unchanged; the auction records no bid. g10.auction-auction.US4-TC2
   - Step 8 shows no entry for `<listing_12>`. g10.auction-auction.US4-TC2
9. Enter `<bid_amount>` in the bid field and select **Place Bid**.
10. Read Highest bid.
11. Read the calls the run made to the identity store.
   - The bid is forwarded and accepted, and Highest bid reads `<bid_amount>`. g10.auction-auction.US4-TC3
   - No standing was read. g10.auction-auction.US4-TC3

## Walk 4: Collector reads the catalogue in one order

**Starting state:**

- The catalogue lists `<listing_14>`, `<listing_15>` and `<listing_16>`.
- The catalogue lists the six listings in `<listing_17>`, `<listing_18>`, `<listing_19>`, `<listing_20>`, `<listing_21>`, `<listing_22>`.
- `<listing_23>` and `<listing_24>` are both Active and close at the same time.
- The Auction catalogue holds more listings than one page lists.
- customer is able to open `<grade10 auction catalogue url>`.
- No complete Featured slot is set.
- At least one listing is visible in All auctions.
- customer is on `<grade10 auction catalogue url>`.
- Featured may be present or absent.
- At least one complete Featured slot is set.
- No listings are available for All auctions.
- At least one complete Featured slot is set for `<featured listing>`.
- `<featured listing>` is among the listings a collector can see.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_14>` | An Active listing whose close is 18:00 UTC |
| `<listing_15>` | An Upcoming listing whose start is 19:00 UTC |
| `<listing_16>` | An Ended listing that closed at 12:00 UTC, before `<listing_14>` closes |
| `<listing_17>` | An Active listing closing at 18:00 UTC |
| `<listing_18>` | An Active listing closing at 19:00 UTC |
| `<listing_19>` | An Upcoming listing starting on 2026-10-01 |
| `<listing_20>` | An Upcoming listing starting on 2026-10-02 |
| `<listing_21>` | An Ended listing that closed on 2026-09-22 |
| `<listing_22>` | An Ended listing that closed on 2026-09-15 |
| `<listing_23>` | An Active listing closing at 18:00 UTC |
| `<listing_24>` | An Active listing closing at 18:00 UTC, a different listing record from `<listing_23>` |
| `<featured listing>` | A published listing that fills a complete Featured slot |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
   - `<listing_14>` is listed before `<listing_15>`. g10.auction-auction.US5-TC1
2. Read the listings in listed order.
   - `<listing_15>` is listed before `<listing_16>`. g10.auction-auction.US5-TC1
3. Navigate to `<grade10 auction catalogue url>`.
4. Read the listings in listed order.
   - `<listing_17>` is listed before `<listing_18>`. g10.auction-auction.US5-TC2
   - `<listing_19>` is listed before `<listing_20>`. g10.auction-auction.US5-TC2
   - `<listing_21>` is listed before `<listing_22>`. g10.auction-auction.US5-TC2
5. Read the API response for the Auction catalogue.
6. Read the API response for the Auction catalogue again.
   - `<listing_23>` and `<listing_24>` are in the same order both times. g10.auction-auction.US5-TC3
7. Read the API response one page at a time to the end.
8. Read the API response for the whole catalogue.
   - Both readings list the listings in the same order. g10.auction-auction.US5-TC4
   - No listing is listed twice. g10.auction-auction.US5-TC4
   - No listing is missing. g10.auction-auction.US5-TC4
9. Navigate to `<grade10 auction catalogue url>`.
   - No Featured band is present. g10.auction-auction.US5-TC5
10. Read the page sections.
   - All auctions is shown with listings in the catalogue resting order. g10.auction-auction.US5-TC5
11. Read the catalogue page for category chrome.
   - There is no Categories heading, no category tiles, and no busy filter chrome. g10.auction-auction.US5-TC6
   - The only sections are Featured when set, then All auctions. g10.auction-auction.US5-TC6
12. Navigate to `<grade10 auction catalogue url>`.
   - Featured still shows the curated slide or slides. g10.auction-auction.US5-TC7
13. Read the Featured band and the All auctions area.
   - All auctions shows a message that there are no auctions. g10.auction-auction.US5-TC7
14. Read the Featured band for `<featured listing>`.
   - `<featured listing>` appears in Featured and again in All auctions. g10.auction-auction.US5-TC8
15. Read All auctions for `<featured listing>` and the list order.
   - All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible listing. g10.auction-auction.US5-TC8

## Walk 5: Collector reads the catalogue in one order

**Starting state:**

- customer is able to open `<grade10 auction catalogue url>`.
- customer is on `<grade10 auction catalogue url>`.
- All auctions holds more listings than the first batch shows.
- An Upcoming listing is among All auctions.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<upcoming listing>` | A published Upcoming listing on All auctions |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the document canonical and share address.
   - Canonical and share address are `/auction` with no category query. g10.auction-auction.US5-TC9
3. Read the first batch of All auctions cards.
4. Scroll near the end of the shown listings.
   - shows Boneyard skeleton cards below the listings already shown, or the next batch lands without pagination controls. g10.auction-auction.US5-TC10
5. Wait for the next batch.
   - shows additional listings below the first batch. g10.auction-auction.US5-TC10
   - Lots from step 1 stay visible. g10.auction-auction.US5-TC10
   - The combined list stays in the catalogue resting order. g10.auction-auction.US5-TC10
   - No pagination controls appear. g10.auction-auction.US5-TC10
6. Find `<upcoming listing>` on All auctions.
   - The card shows no starting bid and no money amount. g10.auction-auction.US5-TC11
7. Read its card for money and countdown.
   - The card shows Opens in from the served open. g10.auction-auction.US5-TC11

## Walk 6: Collector reads Featured on the catalogue

**Starting state:**

- customer is on `<grade10 auction catalogue url>`.
- Exactly one complete Featured slot is set for `<featured listing>` with `<front page image>`.
- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.
- The served current bid for `<featured listing>` is `<bid before>`.
- One complete Featured slot is set for a listing in `<listing_status>`, with countdown target `<served_time>`.
- customer is able to open `<grade10 auction catalogue url>`.
- Three complete Featured slots are set in operator order `<listing A>`, `<listing B>`, `<listing C>`.
- The only Featured slot holds an eligible listing and no front page image, or a front page image and no listing.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US6-TC1 | featured listing | A published Active listing bound to the only complete Featured slot |
| g10.auction-auction.US6-TC1 | front page image | The front page image uploaded for that slot |
| g10.auction-auction.US6-TC1 | featured listing title | The public title of `<featured listing>`; bind the title only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US6-TC2 | featured listing | A published Active listing on a complete Featured slide |
| g10.auction-auction.US6-TC2 | bid before | The current bid amount shown on the slide |
| g10.auction-auction.US6-TC2 | bid after | A **higher** served current bid for the same listing after first paint |

| Case | `<listing_status>` | `<served_time>` | `<expected_countdown>` |
| --- | --- | --- | --- |
| g10.auction-auction.US6-TC3 | Active | `<served_close>` | Relative Ends in to the served close |
| g10.auction-auction.US6-TC3 | Upcoming | `<served_open>` | Relative Opens in to the served open; UPCOMING with no live status dot; View Auction; no money |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US6-TC3 | served_close | The effective close returned for the Active listing; bind its datetime only |
| g10.auction-auction.US6-TC3 | served_open | The scheduled opening returned for the Upcoming listing; bind its datetime only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US6-TC4 | listing A | Published Active or Upcoming listing in Featured slot 1 |
| g10.auction-auction.US6-TC4 | listing B | Published Active or Upcoming listing in Featured slot 2 |
| g10.auction-auction.US6-TC4 | listing C | Published Active or Upcoming listing in Featured slot 3 |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the single slide.
   - Featured band is present with one slide. g10.auction-auction.US6-TC1
   - The slide shows `<front page image>` as banner and slab, the title `<featured listing title>`, LIVE BIDDING with a live status dot, relative Ends in, the current bid, and Bid Now. g10.auction-auction.US6-TC1
3. Read the current bid on the Featured slide after first paint.
   - Step 3 shows `<bid before>`. g10.auction-auction.US6-TC2
4. Let the served current bid for `<featured listing>` become `<bid after>`.
5. Read the current bid on the Featured slide.
   - Step 5 shows `<bid after>` with a rolling number as the amount increases. g10.auction-auction.US6-TC2
6. Navigate to `<grade10 auction catalogue url>`.
7. Read the countdown and status chrome on the Featured slide.
   - The countdown matches this expected display: `<expected_countdown>`. g10.auction-auction.US6-TC3
   - Upcoming shows UPCOMING with no live status dot and View Auction, and shows no starting bid or money amount. g10.auction-auction.US6-TC3
8. Navigate to `<grade10 auction catalogue url>`.
9. Read the Featured slides from first to last.
   - Featured shows three slides in order `<listing A>`, then `<listing B>`, then `<listing C>`. g10.auction-auction.US6-TC4
10. Navigate to `<grade10 auction catalogue url>`.
11. Read whether a Featured band is present.
   - No Featured band is shown. g10.auction-auction.US6-TC5
   - All auctions is the catalogue content below the page chrome. g10.auction-auction.US6-TC5

## Walk 7: Collector advances Featured slides

**Starting state:**

- customer is on `<grade10 auction catalogue url>`.
- Two complete Featured slots are set for `<listing A>` then `<listing B>`.
- customer is on `<grade10 auction catalogue url>` at a small viewport (below `md`).
- Three complete Featured slots are set for `<listing A>`, `<listing B>`, `<listing C>` in that order.
- Exactly one complete Featured slot is set.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US7-TC1 | listing A | Published listing in Featured slot 1 |
| g10.auction-auction.US7-TC1 | listing B | Published listing in Featured slot 2 |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US7-TC4 | listing A | Published listing in Featured slot 1 |
| g10.auction-auction.US7-TC4 | listing B | Published listing in Featured slot 2 |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US7-TC2 | listing A | Published listing in Featured slot 1 |
| g10.auction-auction.US7-TC2 | listing B | Published listing in Featured slot 2 |
| g10.auction-auction.US7-TC2 | listing C | Published listing in Featured slot 3 |

### Route

1. Read the visible Featured listing.
   - Step 1 shows `<listing A>`. g10.auction-auction.US7-TC1
2. Activate the progress control to advance to the next slide.
3. Read the visible Featured listing.
   - Step 3 shows `<listing B>`. g10.auction-auction.US7-TC1
   - Progress dots are present for the two slides. g10.auction-auction.US7-TC1
4. Read the visible Featured listing.
   - Step 4 shows `<listing A>`. g10.auction-auction.US7-TC4
5. Activate stage next on the Featured image.
6. Read the visible Featured listing.
   - Step 6 shows `<listing B>`. g10.auction-auction.US7-TC4
   - The stage image pages horizontally to `<listing B>`. g10.auction-auction.US7-TC4
   - Progress dots mark `<listing B>` current. g10.auction-auction.US7-TC4
7. Read the visible Featured listing.
8. Advance with the progress control until each remaining slide has been shown.
9. Read each visible Featured listing after each advance.
   - The visible listings are `<listing A>`, then `<listing B>`, then `<listing C>` without leaving the Featured band. g10.auction-auction.US7-TC2
10. Navigate to `<grade10 auction catalogue url>`.
11. Read the Featured progress control.
   - The single slide is shown. g10.auction-auction.US7-TC3
   - There is no multi-dot advance among slides. g10.auction-auction.US7-TC3
   - Stage previous/next is not required. g10.auction-auction.US7-TC3

## Walk 8: Collector opens a Featured listing

**Starting state:**

- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.
- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<upcoming listing>` visible.
- customer is on `<grade10 auction catalogue url>` with two complete Featured slides for `<listing A>` then `<listing B>`.
- The progress control has advanced so `<listing B>` is visible.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US8-TC1 | featured listing | A published **Active** listing on the visible Featured slide |
| g10.auction-auction.US8-TC1 | listing page url | That listing's details page address |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US8-TC3 | upcoming listing | A published Upcoming listing on the visible Featured slide |
| g10.auction-auction.US8-TC3 | listing page url | That listing's details page address |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US8-TC2 | listing A | Published **Active** listing in Featured slot 1 |
| g10.auction-auction.US8-TC2 | listing B | Published **Active** listing in Featured slot 2 |
| g10.auction-auction.US8-TC2 | listing B page url | `<listing B>`'s details page address |

### Route

1. Activate Bid Now on the Featured slide.
2. Read the page that opens.
   - The browser opens `<listing page url>` — the details page for `<featured listing>`. g10.auction-auction.US8-TC1
3. Activate View Auction on the Featured slide.
4. Read the page that opens.
   - The browser opens `<listing page url>` — the details page for `<upcoming listing>`. g10.auction-auction.US8-TC3
5. Activate Bid Now on the visible Featured slide.
6. Read the page that opens.
   - The browser opens `<listing B page url>` — the details page for `<listing B>`, not `<listing A>`. g10.auction-auction.US8-TC2

## Walk 9: Collector watches from an All auctions card

**Starting state:**

- customer(signed in, not watching `<open listing>`) is on `<grade10 auction catalogue url>`.
- `<open listing>` appears on an All auctions card and is not closed.
- customer(signed in, watching `<open listing>`) is on `<grade10 auction catalogue url>`.
- customer(signed in) is on `<grade10 auction catalogue url>`.
- `<closed listing>` appears on an All auctions card.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US9-TC1 | open listing | A published Active or Upcoming listing on an All auctions card |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US9-TC2 | open listing | A published Active or Upcoming listing the collector already watches |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US9-TC3 | closed listing | A closed listing visible in All auctions |

### Route

1. Activate watch on the All auctions card for `<open listing>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open listing>` is watched.
   - The card shows the watched state. g10.auction-auction.US9-TC1
   - `<open listing>` is watched the same way as from the listing page and My Auctions. g10.auction-auction.US9-TC1
4. Activate watch off on the All auctions card for `<open listing>`.
5. Read the card's watch state.
6. Open My Auctions and read whether `<open listing>` remains watched.
   - The card shows the unwatched state. g10.auction-auction.US9-TC2
   - `<open listing>` is no longer watched, same as unwatching from the listing page or My Auctions. g10.auction-auction.US9-TC2
7. Find the All auctions card for `<closed listing>`.
8. Read whether a watch control is present on that card.
   - The closed listing card shows no watch control. g10.auction-auction.US9-TC3

## Walk 10: Bidder is held to the close with everyone else

**Starting state:**

- `<listing_4>` is in extended bidding and its recorded close is 20:30:00 UTC.
- customer A(card linked) is signed in and on the listing page for `<listing_4>`.
- `<listing_5>` has scheduled close 20:00:00 UTC and its extension terms are the row's.
- customer B's bid was accepted on `<listing_5>` at `<last accepted>`.
- Settling `<listing_5>` is held back, so its close is not yet recorded at `<bid time>`.
- customer A(card linked) is signed in and can bid on `<listing_5>`.
- `<listing_6>` is open with one accepted bid.
- customer A leads `<listing_7>`.
- `<listing_7>`'s recorded close is about two minutes away, and no other bid will be placed.
- customer A leads `<listing_8>`, and no other bid will be placed.
- The listing's own alarm is disabled for `<listing_8>`.
- ❓ The spec does not identify the surface where the tester waits for `<listing_8>` to close.
- `<listing_11>` is in the row's state, and no page has it open.
- Nobody reads `<listing_11>` until step 2.
- `<listing_12>` is in extended bidding.
- No session is signed in.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_4>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap, led by customer B |
| `<bid time>` | 20:29:59 UTC, one second before the recorded close |
| `<bid amount>` | HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |
| `<new close>` | 20:59:59 UTC, `<bid time>` plus 1800s |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: 600s (10mins); `<last accepted>`: 20:05:00 UTC; `<effective close>`: 20:10:00 UTC, the cap; `<bid time>`: 20:10:00 UTC, at the limit |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: 600s (10mins); `<last accepted>`: 20:05:00 UTC; `<effective close>`: 20:10:00 UTC, the cap; `<bid time>`: 20:10:01 UTC |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: None; `<last accepted>`: 20:10:00 UTC; `<effective close>`: 20:40:00 UTC, the recorded close; `<bid time>`: 20:40:00 UTC, at the limit |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: None; `<last accepted>`: 20:10:00 UTC; `<effective close>`: 20:40:00 UTC, the recorded close; `<bid time>`: 20:40:01 UTC |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: 0s; `<last accepted>`: 19:58:00 UTC; `<effective close>`: 20:00:00.001 UTC, one millisecond after the scheduled close; `<bid time>`: 20:00:00.001 UTC, at the limit |
| Item | `<extension duration>`: 1800s (30mins); `<extension cap>`: 0s; `<last accepted>`: 19:58:00 UTC; `<effective close>`: 20:00:00.001 UTC, one millisecond after the scheduled close; `<bid time>`: 20:00:01 UTC |
| Item | `<extension duration>`: 0s; `<extension cap>`: None; `<last accepted>`: 19:58:00 UTC; `<effective close>`: 20:00:00.001 UTC, one millisecond after the scheduled close; `<bid time>`: 20:00:00.001 UTC, at the limit |
| Item | `<extension duration>`: 0s; `<extension cap>`: None; `<last accepted>`: 19:58:00 UTC; `<effective close>`: 20:00:00.001 UTC, one millisecond after the scheduled close; `<bid time>`: 20:00:01 UTC |
| Item | `<extension duration>`: Field; `<extension cap>`: Value |
| Item | `<extension duration>`: `<bid amount>`; `<extension cap>`: HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |
| `<listing_6>` | An open listing, scheduled close 20:00:00 UTC, extension duration 1800s (30mins), extension cap 0s |
| `<listing_7>` | An HKD listing in extended bidding, led by customer A |
| `<sweep interval>` | 300s (5mins) |
| A read of `<listing_8>` more than 2s after its recorded close | Right after that read answers |
| Nobody before the five-minute sweep | The next sweep, at most 300s (5mins) after the recorded close |
| Item | `<listing_11>` state: An HKD listing in extended bidding, led by customer A at `<leader price>`, extension duration 1800s (30mins), no cap; `<close>`: its recorded close; `<result>`: Closed, customer A winning at `<leader price>` |
| Item | `<listing_11>` state: An open HKD listing with no accepted bid, extension duration 1800s (30mins); `<close>`: its scheduled close; `<result>`: Closed unsold, never in extended bidding |
| Item | `<listing_11>` state: Field; `<close>`: Value |
| Item | `<listing_11>` state: `<leader price>`; `<close>`: HKD4,960 (range: 400000–799999 minor units) |
| Item | `<listing_11>` state: `<sweep interval>`; `<close>`: 300s (5mins) |
| `<listing_12>` | An HKD listing, scheduled close 20:00:00 UTC, recorded close 20:25:00 UTC, extension duration 1800s (30mins), extension cap 3600s (60mins) |

### Route

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_4>`.
   - The bid is accepted when placed, with no wait for a payment. g10.auction-auction.US11-TC4
   - customer A leads and Highest bid reads `<bid amount>`. g10.auction-auction.US11-TC4
   - The recorded close reads `<new close>`. g10.auction-auction.US11-TC4
3. As customer A, place `<bid amount>` at `<bid time>`.
   - is refused. g10.auction-auction.US11-TC5
4. Read the API response for `<listing_5>`.
5. Let settling resume.
6. Read the listing's result.
   - At step 2 no accepted bid is added, the recorded close does not move, and `<listing_5>` is still not recorded closed. g10.auction-auction.US11-TC5
   - At step 4 `<listing_5>` is closed with customer B winning. g10.auction-auction.US11-TC5
7. Wait for the scheduled close.
   - `<listing_6>` never entered extended bidding. g10.auction-auction.US11-TC6
8. Read the API response for `<listing_6>`.
   - It is closed at 20:00:00 UTC, with its one bidder winning. g10.auction-auction.US11-TC6
9. Wait for the recorded close.
10. Read the API response for `<listing_7>`.
   - reads `<listing_7>` closed, customer A winning, before the next sweep, well inside `<sweep interval>`. g10.auction-auction.US11-TC7
11. Wait for `<listing_8>`'s recorded close.
12. Let `<who reaches it>` reach `<listing_8>`.
13. Read the API response for `<listing_8>`.
   - `<listing_8>` is recorded closed `<recorded by>`, with customer A winning. g10.auction-auction.US11-TC8
   - Before then, `<listing_8>` takes no bid and reports no result. g10.auction-auction.US11-TC8
14. Wait until 10 seconds past `<close>`.
   - `<listing_11>` reads `<result>`, recorded within seconds of `<close>`. g10.auction-auction.US11-TC9
15. Read the API response for `<listing_11>`.
   - The close is recorded before the next sweep, well inside `<sweep interval>`. g10.auction-auction.US11-TC9
16. Read `<listing_12>` from the public listing API.
   - gives scheduled close 20:00:00 UTC and recorded close 20:25:00 UTC. g10.auction-auction.US11-TC10
   - gives extension duration 1800s and extension cap 3600s. g10.auction-auction.US11-TC10
17. Read the auction service's time from its public time read.
18. One second later, read the public time again.
   - Steps 2 and 3 each give the auction service's time when it answered, not the caller's. g10.auction-auction.US11-TC10
   - 's answer is about one second after step 2's, not a cached copy. g10.auction-auction.US11-TC10

## Walk 11: Bidder keeps a listing open only by moving its price

**Starting state:**

- `<listing_9>` is in extended bidding with its recorded close `<time left before bid>` away.
- customer A leads `<listing_9>` at `<leader price>` with maximum `<user A maximum>`.
- customer B(card linked) is signed in on a separate session, on the listing page for `<listing_9>`.
- `<listing_10>` is in extended bidding, its recorded close `<close before raise>`.
- customer A leads `<listing_10>` at `<leader price>` with maximum `<user A maximum>`, and is on its listing page.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before bid>` | 5 minutes |
| `<leader price>` | HKD1,260 (range: 80000–399999 minor units) |
| `<user A maximum>` | HKD2,360 (range: 80000–399999 minor units) |
| `<user B maximum>` | HKD2,360 (fixed boundary or equality), equal to `<user A maximum>` |
| `<listing_10>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap |
| `<close before raise>` | 3 minutes after the raise |
| `<leader price>` | HKD5,460 (range: 400000–799999 minor units) |
| `<user A maximum>` | HKD8,400 (range: 800000–3999999 minor units) |
| `<raised maximum>` | HKD9,600 (range: 800000–3999999 minor units) |

### Route

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.
   - Highest bid reads `<user B maximum>`. g10.auction-auction.US12-TC1
   - customer A still leads, as the earlier maximum. g10.auction-auction.US12-TC1
   - Time left reads `<extension duration>` from customer B's bid. g10.auction-auction.US12-TC1
3. Select **Raise**, enter `<raised maximum>` and confirm.
   - Your maximum reads `<raised maximum>`. g10.auction-auction.US12-TC2
4. Read Your maximum, Highest bid and Time left.
   - Highest bid stays `<leader price>`. g10.auction-auction.US12-TC2
5. Wait until `<close before raise>` with no further bid.
   - The recorded close stays `<close before raise>`, and Time left keeps counting to it. g10.auction-auction.US12-TC2
6. Read the listing's result.
   - The listing closes at `<close before raise>`, customer A winning at `<leader price>`. g10.auction-auction.US12-TC2

## Walk 12: Runner-up takes the lead when the leader's account is erased

**Starting state:**

- `<listing_27>` is open inside its window, with maxima `<customer A maximum>`, `<customer B maximum>` and `<customer C maximum>` committed in the order stated in Test data.
- customer A leads `<listing_27>` at `<price before>`.
- customer A has no unpaid order or open fulfilment, so nothing stops the erasure.
- customer B is signed in on a separate session.
- `<listing_28>` is open inside its window, and customer A holds its only maximum of `<customer A maximum>`.
- `<listing_32>` is open inside its window, with maxima committed in this order: `<committed_maxima>`, and Highest bid `<price before>`.
- The erased customer has no unpaid order or open fulfilment, so nothing stops the erasure.

**Shared test data:**

| Case | `<customer A maximum>` | `<customer B maximum>` | `<customer C maximum>` | `<price before>` | `<price after>` | `<leader_after>` | Fixture notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| g10.auction-auction.US13-TC1 | HKD2,300 | HKD1,700 | HKD1,350 | HKD1,740 | HKD1,390 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units); `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed derived value), customer B's maximum plus 4000; `<price after>`: (fixed derived value), customer C's maximum plus 4000 |
| g10.auction-auction.US13-TC1 | HKD2,300 | HKD1,360 | HKD1,350 | HKD1,400 | HKD1,360 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units); `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed derived value), customer B's maximum plus 4000; `<price after>`: (fixed derived value), capped at customer B's maximum |
| g10.auction-auction.US13-TC1 | HKD1,750 | HKD1,750 | HKD1,350 | HKD1,750 | HKD1,390 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units), second; `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed boundary or equality), equal maxima, customer A earlier; `<price after>`: (fixed boundary or equality), customer C's maximum plus 4000 |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US13-TC1 | listing_27 | An open HKD listing, starting price HKD280 (range: 1000–79999 minor units), scheduled close more than an hour away | · |
| g10.auction-auction.US13-TC1 | increment | HKD40 | (fixed tier increment), the HK$800 tier, at every maximum above |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US13-TC2 | listing_28 | An open HKD listing, starting price `<starting_price>`, led by customer A alone at the starting price | · |
| g10.auction-auction.US13-TC2 | customer A maximum | HKD2,350 | (range: 80000–399999 minor units) |
| g10.auction-auction.US13-TC2 | starting_price | HKD280 | (range: 1000–79999 minor units), the opening price of `<listing_28>` |

| Case | `<committed_maxima>` | `<price before>` | `<erased_customer>` | `<leader_after>` | `<price after>` | Fixture notes |
| --- | --- | --- | --- | --- | --- | --- |
| g10.auction-auction.US13-TC3 | customer A 23000, customer B 17000, customer C 13500 | 17500 | customer B | customer A | 14000 | `<price after>`: customer C's maximum plus 500 |
| g10.auction-auction.US13-TC3 | customer A 23000 raised to 47000 after customer B 22800, customer C 10500 | 23000 | customer C | customer A | 23000 | `<price after>`: unchanged: customer B's maximum plus 500 is 23300, above `<price before>` |
| g10.auction-auction.US13-TC3 | customer A 23000, customer B 17000, customer C 12500 | 17500 | customer C | customer A | 17500 | `<price after>`: unchanged, on the same bid |
| g10.auction-auction.US13-TC3 | customer A 23000, customer B 17000 | 17500 | customer A | customer B | 10000 | `<price after>`: the opening price |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US13-TC3 | listing_32 | An open USD listing, opening price USD100 (fixed tier boundary), scheduled close more than an hour away; every amount above is in USD minor units | · |
| g10.auction-auction.US13-TC3 | increment | USD5 | (fixed tier increment), the USD 100 tier, at every next maximum above |

### Route

1. Read `<listing_27>` from the public listing API.
   - Step 1 reads Highest bid `<price before>`, led by customer A. g10.auction-auction.US13-TC1
2. Erase customer A's account through the account-erasure procedure.
3. Read `<listing_27>` from the public listing API.
   - Step 3 reads Highest bid `<price after>`, the next maximum left plus one increment, capped at the new leader's maximum. g10.auction-auction.US13-TC1
   - Step 3's Highest bid is never above `<price before>`. g10.auction-auction.US13-TC1
4. As customer B, read their own standing on `<listing_27>`.
   - Step 4 reads `<leader_after>` as leader, with their own maximum unchanged. g10.auction-auction.US13-TC1
   - customer A's maxima appear nowhere on `<listing_27>`. g10.auction-auction.US13-TC1
5. Erase customer A's account through the account-erasure procedure.
6. Read `<listing_28>` from the public listing API.
   - `<listing_28>` has no leader and no current bid. g10.auction-auction.US13-TC2
   - The next bid must reach `<starting_price>`, the opening price. g10.auction-auction.US13-TC2
   - customer A's maximum appears nowhere on `<listing_28>`. g10.auction-auction.US13-TC2
7. Read `<listing_32>` from the public listing API, noting its scheduled close.
   - Step 7 reads Highest bid `<price before>`. g10.auction-auction.US13-TC3
8. Erase `<erased_customer>`'s account through the account-erasure procedure.
9. Read `<listing_32>` from the public listing API.
   - Step 9 reads Highest bid `<price after>`, led by `<leader_after>`. g10.auction-auction.US13-TC3
   - Step 9's Highest bid is never above `<price before>`. g10.auction-auction.US13-TC3
   - Step 9's scheduled close is the one noted at Step 7. g10.auction-auction.US13-TC3
   - The erased customer's maxima appear nowhere on `<listing_32>`. g10.auction-auction.US13-TC3

## Walk 13: Bidder reads why a bid was refused, and nothing else moves

**Starting state:**

- customer(card linked, account in `<account_state>`) is signed in and on the listing page for `<listing_29>`.
- customer holds no bid on `<listing_29>` and does not watch it.
- `<listing_29>` is in `<listing_state>`.
- customer A leads `<listing_30>` at `<current bid>`, and is signed in on the lot page.
- customer B(card linked, no bid on `<listing_30>`) is signed in on a separate session, on the same lot page.
- customer(card linked) is signed in and on the lot page for `<listing_31>`, holding the row's standing before the bid.
- The network is manipulated to drop the bid at the row's point.
- customer(card linked, account in good standing) is signed in on `<listing_29>`.
- The next bid answer is mocked as `AMOUNT_TOO_HIGH`, with the row's ceiling and server-message fields.
- The custom maximum draft equals `<valid draft>`.

**Shared test data:**

| Case | Refused when | `<account_state>` | `<listing_state>` | `<amount_entered>` | `<refusal_message>` | Fixture notes |
| --- | --- | --- | --- | --- | --- | --- |
| g10.auction-auction.US14-TC1 | Below the next minimum | In good standing | Open, minimum next bid `<next minimum>` | HKD5,280 | Minimum bid is, naming `<next minimum>` | `<amount_entered>`: (fixed derived value), one major unit below `<next minimum>` |
| g10.auction-auction.US14-TC1 | Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. | · |
| g10.auction-auction.US14-TC1 | Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. | · |
| g10.auction-auction.US14-TC1 | After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. | · |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US14-TC1 | listing_29 | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` | · |
| g10.auction-auction.US14-TC1 | current bid | HKD5,210 | (range: 400000–799999 minor units) |
| g10.auction-auction.US14-TC1 | next minimum | HKD5,290 | (fixed derived value), `<current bid>` plus its 8000 increment |
| g10.auction-auction.US14-TC1 | bid count | 3 | · |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US14-TC2 | `<listing_30>` | An open HKD listing led by customer A, maximum HKD8,400 (range: 800000–3999999 minor units) |
| g10.auction-auction.US14-TC2 | `<current bid>` | HKD5,210 (range: 400000–799999 minor units) |
| g10.auction-auction.US14-TC2 | `<below minimum>` | HKD5,280 (fixed derived value), one major unit below `<current bid>` plus its 8000 increment |

| Case | Standing before | Bid sent | Dropped | The bid form reads | Standing after |
| --- | --- | --- | --- | --- | --- |
| g10.auction-auction.US14-TC3 | No bid | A first maximum of `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| g10.auction-auction.US14-TC3 | No bid | A first maximum of `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| g10.auction-auction.US14-TC3 | Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| g10.auction-auction.US14-TC3 | Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US14-TC3 | `<listing_31>` | An open HKD listing with no other bidder, starting price HKD280 (range: 1000–79999 minor units) |
| g10.auction-auction.US14-TC3 | `<maximum>` | HKD560 (range: 1000–79999 minor units) |
| g10.auction-auction.US14-TC3 | `<raised maximum>` | HKD920 (range: 80000–399999 minor units) |

| Case | Ceiling field | Server-message field |
| --- | --- | --- |
| g10.auction-auction.US14-TC4 | `<ceiling>` | A distinct server-message marker |
| g10.auction-auction.US14-TC4 | Absent | A distinct server-message marker |
| g10.auction-auction.US14-TC4 | `<ceiling>` | Absent |
| g10.auction-auction.US14-TC4 | Absent | Absent |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-auction.US14-TC4 | listing_29 | An open HKD listing led by customer B, current bid HKD5,210 (range: 400000–799999 minor units) and bid count 3 |
| g10.auction-auction.US14-TC4 | valid draft | 5130 whole major units, the listing's next minimum |
| g10.auction-auction.US14-TC4 | ceiling | HKD80,000,000 (fixed configured value) |

### Route

1. Enter `<amount_entered>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
   - Step 3 shows `<refusal_message>` on the bid form. g10.auction-auction.US14-TC1
4. Reload the listing page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
   - Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer. g10.auction-auction.US14-TC1
   - Step 4 shows no Leading or Outbid standing for the customer. g10.auction-auction.US14-TC1
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
   - Step 5 shows no row for `<listing_29>`. g10.auction-auction.US14-TC1
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.
   - Step 6 shows no entry for `<listing_29>`. g10.auction-auction.US14-TC1
7. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
   - Step 7 is refused on customer B's bid form. g10.auction-auction.US14-TC2
8. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
   - Step 8 reads Highest bid `<current bid>`, Recent Bids unchanged, and customer A still Leading. g10.auction-auction.US14-TC2
9. As customer A, navigate to `<my auctions url>` and read `<listing_30>`'s row.
   - Step 9's row reads Leading, with Current bid `<current bid>`. g10.auction-auction.US14-TC2
10. As customer A, read their mailbox for a letter about `<listing_30>` sent after step 1.
   - Step 10 finds no new-bid or outbid letter. g10.auction-auction.US14-TC2
11. Enter the row's bid in the custom maximum on the bid panel.
12. Place the bid.
13. Wait until the bid form settles.
14. Read the bid form.
   - Step 14 reads the row's words on the bid form, never both placed and refused. g10.auction-auction.US14-TC3
15. Reload the lot page and read the bid panel's standing.
   - Step 15 reads the row's standing after. g10.auction-auction.US14-TC3
16. Navigate to `<my auctions url>` and look for `<listing_31>`.
   - Step 16 agrees with the row's standing after. g10.auction-auction.US14-TC3
17. Place the bid.
18. Wait for the mocked refusal answer.
19. Read the bid form and custom maximum field.
   - Step 19: no maximum-bid or generic refusal message appears. g10.auction-auction.US14-TC4
   - Step 19: no server message or toast appears. g10.auction-auction.US14-TC4
   - Step 19: pending bid status ends and the action is usable. g10.auction-auction.US14-TC4
   - Step 19: the displayed draft remains `<valid draft>`. g10.auction-auction.US14-TC4
20. Read the number of bid attempts sent.
   - Step 20: exactly one attempt is sent, without automatic retry. g10.auction-auction.US14-TC4
21. Reload the listing and read its public bids and standing.
   - Step 21: the price, leader, bid count and public bids remain unchanged. g10.auction-auction.US14-TC4
   - Step 21: customer has no Leading or Outbid standing. g10.auction-auction.US14-TC4
22. Read My Auctions and Bidding History for `<listing_29>`.
   - Step 22: neither surface records the refused attempt. g10.auction-auction.US14-TC4

## Walk 14: Collector reads a house-led close and its order

**Starting state:**

- `<listing_1>` is led by `<leader>` at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
- The leader has this bidding setup: `<leader_setup>`.
- customer C has never bid on `<listing_1>` and is on its listing page.
- `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at `<commit_time>`.
- `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
- customer C is on the listing page for `<listing_2>`.
- `<listing_4>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, and the house leads with this bidding setup: `<bidding_at_close>`, its recorded close a few minutes away, no further bid coming.
- customer A(card linked) bid on `<listing_4>` as described by `<bidding_at_close>`.

**Shared test data:**

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US1-TC3 | listing_1 | A published HKD listing in extended bidding | · |
| g10.auction-auction.US1-TC3 | customer A maximum | 500000 minor units | (HK$5,000.00) |
| g10.auction-auction.US1-TC3 | final price | 508000 minor units | `<customer A maximum>` plus its 8000 increment |

| Case | `<leader>` | `<leader_setup>` |
| --- | --- | --- |
| g10.auction-auction.US1-TC3 | the house | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| g10.auction-auction.US1-TC3 | customer B | customer B, with maximum 600000 minor units and no internal bid on the listing |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US1-TC4 | listing_2 | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap | · |
| g10.auction-auction.US1-TC4 | starting price | 400000 minor units | (HK$4,000.00) |
| g10.auction-auction.US1-TC4 | house maximum | 600000 minor units | (HK$6,000.00) |
| g10.auction-auction.US1-TC4 | extension duration | 1800s | (30mins) |

| Case | Row | `<commit_time>` |
| --- | --- | --- |
| g10.auction-auction.US1-TC4 | Before the close | 1 minute from now, before the scheduled close |
| g10.auction-auction.US1-TC4 | At the scheduled close | Exactly the scheduled close |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-auction.US1-TC5 | listing_4 | A published HKD listing in no campaign, starting price `<starting price>` | · |
| g10.auction-auction.US1-TC5 | starting price | 400000 minor units | (HK$4,000.00) |
| g10.auction-auction.US1-TC5 | house maximum | 600000 minor units | (HK$6,000.00) |
| g10.auction-auction.US1-TC5 | internal bidder | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test | · |

| Case | Row | `<bidding_at_close>` | `<winning_bid>` | Fixture notes |
| --- | --- | --- | --- | --- |
| g10.auction-auction.US1-TC5 | House over a collector | The house leads over customer A's maximum of 500000 | 508000 | `<winning_bid>`: customer A's maximum plus its 8000 increment |
| g10.auction-auction.US1-TC5 | House alone | No collector bid | `<starting price>` | · |

### Route

1. Wait through the recorded close without reloading.
2. As customer C, read the listing's state, Highest bid and Recent bids.
   - Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym. g10.auction-auction.US1-TC3
3. Read the API response for `<listing_1>`'s public facts.
   - Step 3 reads the listing closed with a winner at `<final price>`, the winner by pseudonym only. g10.auction-auction.US1-TC3
4. Open `<grade10 auction url>` and read `<listing_1>`'s card.
   - Step 4's card reads Ended, as any sold listing's card does. g10.auction-auction.US1-TC3
   - The House row and the Collector row read alike in every step, save the pseudonym. g10.auction-auction.US1-TC3
5. Wait until the scheduled close passes and read Time left.
   - Step 5 reads extended bidding, the close `<extension duration>` after the scheduled close. g10.auction-auction.US1-TC4
6. Wait until the extended close passes.
7. Read the listing's state, Highest bid and Recent bids.
   - Step 7 reads sold at `<starting price>`, one bid, under the house's listing pseudonym. g10.auction-auction.US1-TC4
8. Wait until `<listing_4>`'s recorded close passes.
9. Read the orders the API holds for `<listing_4>`.
   - Step 9 holds one order, `<internal bidder>`'s, flagged internal, at `<winning_bid>`. g10.auction-auction.US1-TC5
10. Read the order's invoice and payments.
   - Step 10: no invoice is issued and no payment is recorded. g10.auction-auction.US1-TC5
11. In the House over a collector row, read customer A's card charges since the close.
   - Step 11 holds no charge for `<listing_4>`. g10.auction-auction.US1-TC5
12. Read the API response for `<listing_4>`'s public facts.
   - Step 12 reads the listing closed with a winner at `<winning_bid>`, the winner by pseudonym only. g10.auction-auction.US1-TC5

## g10.auction-auction.US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### g10.auction-auction.US1-TC2: Public listing read exposes the close and extension policy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_11>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A published listing with extension duration 1800s (30mins) and an extension cap of 3600s (60mins) |

**Steps:**

1. Read the API response for `<listing_11>`.

**Expected Results:**

* It carries the scheduled close, the recorded close, the extension duration and the extension cap.
* It carries no extension window.
* It carries no reserve state.

<!-- trace:case id=g10.auction-auction.TC-m16 rev=1 covers=g10.auction-auction.SC-fec,g10.auction-auction.SC-a4f -->
### g10.auction-auction.US1-TC3: A listing the house leads at the close reads sold like any other

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
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_1>` is led by `<leader>` at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
* The leader has this bidding setup: `<leader_setup>`.
* customer C has never bid on `<listing_1>` and is on its listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A published HKD listing in extended bidding | · |
| customer A maximum | 500000 minor units | (HK$5,000.00) |
| final price | 508000 minor units | `<customer A maximum>` plus its 8000 increment |

| `<leader>` | `<leader_setup>` |
| --- | --- |
| the house | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| customer B | customer B, with maximum 600000 minor units and no internal bid on the listing |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the listing's state, Highest bid and Recent bids.
3. Read the API response for `<listing_1>`'s public facts.
4. Open `<grade10 auction url>` and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3 reads the listing closed with a winner at `<final price>`, the winner by pseudonym only.
* Step 4's card reads Ended, as any sold listing's card does.
* The House row and the Collector row read alike in every step, save the pseudonym.

<!-- trace:case id=g10.auction-auction.TC-fkn rev=1 covers=g10.auction-auction.SC-cqt,g10.auction-auto-bidding.SC-szf -->
### g10.auction-auction.US1-TC4: A listing whose only bid is the house's extends and closes sold at the starting price

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at `<commit_time>`.
* `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
* customer C is on the listing page for `<listing_2>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_2 | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap | · |
| starting price | 400000 minor units | (HK$4,000.00) |
| house maximum | 600000 minor units | (HK$6,000.00) |
| extension duration | 1800s | (30mins) |

| Row | `<commit_time>` |
| --- | --- |
| Before the close | 1 minute from now, before the scheduled close |
| At the scheduled close | Exactly the scheduled close |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes.
3. Read the listing's state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads extended bidding, the close `<extension duration>` after the scheduled close.
* Step 3 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

<!-- trace:case id=g10.auction-auction.TC-dij rev=1 covers=g10.auction-auction.SC-14a,g10.auction-auction.SC-cqt -->
### g10.auction-auction.US1-TC5: A close the house leads opens the internal bidder's order and charges nobody

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_4>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, and the house leads with this bidding setup: `<bidding_at_close>`, its recorded close a few minutes away, no further bid coming.
* customer A(card linked) bid on `<listing_4>` as described by `<bidding_at_close>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_4 | A published HKD listing in no campaign, starting price `<starting price>` | · |
| starting price | 400000 minor units | (HK$4,000.00) |
| house maximum | 600000 minor units | (HK$6,000.00) |
| internal bidder | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test | · |

| Row | `<bidding_at_close>` | `<winning_bid>` | Fixture notes |
| --- | --- | --- | --- |
| House over a collector | The house leads over customer A's maximum of 500000 | 508000 | `<winning_bid>`: customer A's maximum plus its 8000 increment |
| House alone | No collector bid | `<starting price>` | · |

**Steps:**

1. Wait until `<listing_4>`'s recorded close passes.
2. Read the orders the API holds for `<listing_4>`.
3. Read the order's invoice and payments.
4. In the House over a collector row, read customer A's card charges since the close.
5. Read the API response for `<listing_4>`'s public facts.

**Expected Results:**

* Step 2 holds one order, `<internal bidder>`'s, flagged internal, at `<winning_bid>`.
* Step 3: no invoice is issued and no payment is recorded.
* Step 4 holds no charge for `<listing_4>`.
* Step 5 reads the listing closed with a winner at `<winning_bid>`, the winner by pseudonym only.

---

## g10.auction-auction.US2: Collector places a bid inside the window

**As a** bidder,
**I want** a listing I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the listing's cap.

<!-- trace:case id=g10.auction-auction.TC-b19 rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC5: A bid stands when accepted, with nothing held on the card

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* customer(card linked, no bid on `<listing_25>`) is signed in.
* `<listing_25>` is open inside its window.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | An open HKD listing taking bids, current bid `<current bid>` |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<bid amount>` | HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |

**Steps:**

1. Submit `<bid amount>` on `<listing_25>`.
2. Read the API response.
3. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2 accepts the bid in the one answer, by the listing's bid rules, with no wait on the card provider.
* Step 3 shows nothing held or charged on the card for `<listing_25>`.

<!-- trace:case id=g10.auction-auction.TC-rj4 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC10: Bid during extended bidding restarts the timer

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_2>` is in extended bidding and its recorded close is `<close before bids>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<close before bids>` | 20:30 UTC |
| `<first bid time>` | 20:10 UTC |
| `<second bid time>` | 20:35 UTC |
| `<close after first>` | 20:40 UTC |
| `<close after second>` | 21:05 UTC |

**Steps:**

1. Submit a valid bid at `<first bid time>`.
2. Read the recorded close.
3. Submit a valid bid at `<second bid time>`.
4. Read the recorded close.

**Expected Results:**

* The recorded close reads `<first bid time>` plus `<extension duration>` = `<close after first>`.
* The recorded close reads `<second bid time>` plus `<extension duration>` = `<close after second>`.

<!-- trace:case id=g10.auction-auction.TC-4fd rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC11: Extension cap holds the timer at the cap

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_3>` is in extended bidding and its recorded close is its scheduled close plus `<extension cap>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A listing in extended bidding whose recorded close already stands at its cap |
| `<scheduled close>` | 20:00 UTC |
| `<extension cap>` | 3600s (60mins), any cap the listing has already reached |
| `<result>` | 21:00 UTC |

**Steps:**

1. Submit a valid bid.
2. Read the recorded close.
3. Wait until the recorded close passes.

**Expected Results:**

* The bid is accepted.
* The recorded close reads `<scheduled close>` plus `<extension cap>`.
* The listing closes at `<result>`.

<!-- trace:case id=g10.auction-auction.TC-sge rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC12: Listing's own duration sets how long extended bidding runs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_4>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open listing, scheduled close `<scheduled close>`, extension duration `<short duration>` |
| `<scheduled close>` | 20:00 UTC |
| `<short duration>` | 300s (5mins), any extension duration above 0 |
| `<result>` | 20:05 UTC |

**Steps:**

1. Wait for `<scheduled close>`.
2. Read the recorded close.

**Expected Results:**

* The listing is in extended bidding.
* The recorded close reads `<scheduled close>` plus `<short duration>` = `<result>`.

<!-- trace:case id=g10.auction-auction.TC-o03 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC13: Extension off closes the listing at its scheduled close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_5>` is open with an accepted bid and extension duration 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | An open listing with an accepted bid, extension duration 0s |

**Steps:**

1. Wait for the scheduled close.
2. Read the listing's state and recorded close.

**Expected Results:**

* The listing is closed at its scheduled close.
* It never entered extended bidding.

<!-- trace:case id=g10.auction-auction.TC-ftw rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC14: Bids by the close decide whether extended bidding starts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_6>` is open with scheduled close `<scheduled close>` and extension duration 1800s (30mins).
* `<listing_6>` holds the row's `<bids by close>`.

**Test data:**

| `<bids by close>` | `<scheduled close>` | `<extended close>` | `<result>` |
| --- | --- | --- | --- |
| None | 20:00 UTC | — | Closed at 20:00 UTC |
| One | 20:00 UTC | 20:30 UTC | Recorded close is 20:30 UTC; with no further bid, closed at 20:30 UTC |

**Steps:**

1. Wait for `<scheduled close>`.
2. Read the listing's state and recorded close.
3. When the row has `<extended close>`, wait until `<extended close>` with no bid.
4. Read the listing's state.

**Expected Results:**

* The listing reads `<result>`.

<!-- trace:case id=g10.auction-auction.TC-m7f rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC6: When a bid lands against the scheduled close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_7>` is open with no accepted bid, scheduled close 20:00:00 UTC, and extension duration 1800s (30mins).

**Test data:**

| `<bid time>` | Recorded close right after the bid |
| --- | --- |
| 19:59:00 UTC | 20:00:00 UTC, unchanged |
| 20:00:00 UTC | 20:30:00 UTC, the listing in extended bidding |

**Steps:**

1. Submit a valid bid at `<bid time>`.
2. Read the recorded close.

**Expected Results:**

* The bid is accepted.
* The recorded close reads as the row states.

<!-- trace:case id=g10.auction-auction.TC-iid rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC7: Each listing runs its own timer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_8>` and `<listing_9>` are both in extended bidding with recorded close 20:30 UTC.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing with scheduled close 20:00 UTC, in extended bidding, extension duration 1800s (30mins) |
| `<listing_9>` | A second listing in the same state as `<listing_8>` |

**Steps:**

1. Submit a valid bid on `<listing_8>` at 20:10 UTC.
2. Read both recorded closes.

**Expected Results:**

* `<listing_8>` reads 20:40 UTC.
* `<listing_9>` still reads 20:30 UTC.

<!-- trace:case id=g10.auction-auction.TC-q6k rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC8: Collector with no earlier bid bids during extended bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(no bid on `<listing_2>`, card saved) is signed in and on `<listing_2>`.
* `<listing_2>` is in extended bidding.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted.
* The close moves to `<extension duration>` after that bid.

<!-- trace:case id=g10.auction-auction.TC-ott rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC9: Bid after extended bidding ends is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_10>` entered extended bidding and its recorded close has passed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A listing whose extended bidding timer ran out with no new bid |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read the listing's bids and recorded close.

**Expected Results:**

* Grade10 refuses the bid.
* No accepted bid is added and the recorded close is unchanged.

<!-- trace:case id=g10.auction-auction.TC-edh rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC15: First bid at the opening price is accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/opening-price.spec.ts`

**Pre-conditions:**

* `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<next minimum>` |
| --- | --- | --- | --- |
| HKD | HKD280 (range: 1000–79999 minor units), positive start | HKD280 (range: 1000–79999 minor units), the start itself | HKD290 (range: 1000–79999 minor units) |
| HKD | HKD7 (fixed boundary or equality), below the lowest increment | HKD7 (fixed boundary or equality), the start itself | HKD17 (range: 1000–79999 minor units) |
| HKD | HKD0 (fixed tier boundary), zero start | HKD10 (fixed boundary or equality), the lowest increment | HKD20 (fixed boundary or equality) |
| USD | USD0 (fixed tier boundary), zero start | USD1 (fixed boundary or equality), the lowest increment | USD2 (fixed boundary or equality) |
| JPY | JPY0 (fixed tier boundary), zero start | JPY100 (fixed boundary or equality), the lowest increment | JPY200 (fixed boundary or equality) |

**Steps:**

1. Enter the row's `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.
4. Read the minimum next bid.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.
* Step 4 reads `<next minimum>`, `<opening price>` plus its tier increment.

<!-- trace:case id=g10.auction-auction.TC-8rd rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC16: First bid below the opening price is refused, naming it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_22>`) is signed in.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<bid amount>` |
| --- | --- | --- | --- |
| HKD | HKD280 (range: 1000–79999 minor units) | HKD280 (range: 1000–79999 minor units), the start itself | HKD279.99 (fixed boundary or equality), one minor unit below |
| USD | USD500 (fixed tier boundary) | USD500 (fixed tier boundary), the start itself | USD499.99 (fixed boundary or equality), one minor unit below |
| JPY | JPY23,500 (range: 15000–74999 minor units) | JPY23,500 (range: 15000–74999 minor units), the start itself | JPY23,499 (fixed boundary or equality), one minor unit below |
| HKD | HKD0 (fixed tier boundary), zero start | HKD10 (fixed boundary or equality), the lowest increment | HKD9.99 (fixed boundary or equality), one minor unit below |
| USD | USD0 (fixed tier boundary), zero start | USD1 (fixed boundary or equality), the lowest increment | USD0.99 (fixed boundary or equality), one minor unit below |
| JPY | JPY0 (fixed tier boundary), zero start | JPY100 (fixed boundary or equality), the lowest increment | JPY99 (fixed boundary or equality), one minor unit below |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<opening price>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

<!-- trace:case id=g10.auction-auction.TC-94a rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC17: Start on a tier boundary takes that tier's increment, not the one below

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_23>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_23>`) is signed in.

**Test data:**

| Currency | `<start>`, on a tier boundary | `<first-bid minimum>` | `<bid amount>`, the start plus the lower tier's increment |
| --- | --- | --- | --- |
| USD | 10000 minor units (USD 100.00) | 10500 minor units (USD 105.00) | 10100 minor units (USD 101.00) |
| HKD | 80000 minor units (HKD 800.00) | 84000 minor units (HKD 840.00) | 81000 minor units (HKD 810.00) |
| JPY | 15000 minor units (JPY 15,000) | 15500 minor units (JPY 15,500) | 15100 minor units (JPY 15,100) |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_23>`.
2. Read the API response.
3. Read `<listing_23>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<first-bid minimum>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

<!-- trace:case id=g10.auction-auction.TC-m75 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC18: Minimum next bid before any bid is the starting price plus its increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_24>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.

**Test data:**

| Currency | `<start>` | `<tier increment>` | `<first-bid minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 1000 minor units (HKD 10.00) | 21000 minor units (HKD 210.00) |
| HKD | 0 minor units (HKD 0.00) | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| USD | 0 minor units (USD 0.00) | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| USD | 10000 minor units (USD 100.00), on a tier boundary | 500 minor units (USD 5.00) | 10500 minor units (USD 105.00) |
| JPY | 0 minor units (JPY 0) | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Read `<listing_24>` from the public listing API.
2. Read the API response's minimum next bid.

**Expected Results:**

* The minimum next bid reads `<start>` plus `<tier increment>` = `<first-bid minimum>`.
* It never reads `<start>` itself, and never 0.

<!-- trace:case id=g10.auction-auction.TC-5m3 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### g10.auction-auction.US2-TC19: Two bids at once are judged one after the other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/backend/grade10/auction/test/pg/catalogueBatch1.spec.ts`

**Pre-conditions:**

* `<listing_26>` is open inside its window, current bid `<current bid>`.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, neither holding a bid on `<listing_26>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | An open HKD listing taking bids, led by customer C at `<current bid>` with maximum `<current bid>` |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<increment>` | HKD80 (fixed tier increment), the HK$4,000 tier |
| `<bid A>` | HKD5,210 (range: 400000–799999 minor units) |
| `<bid B>` | HKD6,200 (range: 400000–799999 minor units), above `<bid A>` |

**Steps:**

1. Submit `<bid A>` as customer A and `<bid B>` as customer B on `<listing_26>` at the same moment.
2. Read both API responses.
3. Read `<listing_26>` from the public listing API.

**Expected Results:**

* Each response is one answer: accepted with a standing, or refused.
* customer B leads, and Highest bid reads `<bid A>` plus `<increment>`.
* No lower bid overwrites that Highest bid, whichever response arrived first.

---

## g10.auction-auction.US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a listing,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the listing closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=3 covers=g10.auction-auction.SC-d78 -->
### g10.auction-auction.US4-TC1: Verified bidder's bid at the bar is forwarded as any other

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
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| a verified account | An account whose standing is `verified` on the day of the bid | · |
| card | Visa ending 4242 | · |
| bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |
| listing_12 | A live USD listing whose minimum next bid is `<bar>` | · |
| bid at the bar | USD15,000 | (fixed boundary or equality), equal to `<bar>` |

**Steps:**

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* The bid is forwarded and accepted as any other - no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and the bid count rises by one.
* Step 3 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=3 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-l64 -->
### g10.auction-auction.US4-TC2: Bidder without a verified standing is held at the storefront at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, holds no bid on `<listing_12>`, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| `<account_standing>` | `<bid_amount>` | Outcome | Fixture notes |
| --- | --- | --- | --- |
| `unverified` | USD15,000 | Refused; no bid recorded | `<bid_amount>`: (fixed boundary or equality), exactly `<bar>` |
| `unverified` | USD15,200 | Refused; no bid recorded | `<bid_amount>`: (range: >1500000 minor units), above `<bar>` |
| `expired` | USD15,000 | Refused; no bid recorded | `<bid_amount>`: (fixed boundary or equality), exactly `<bar>` |
| `expired` | USD15,200 | Refused; no bid recorded | `<bid_amount>`: (range: >1500000 minor units), above `<bar>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |
| listing_12 | A live USD listing whose minimum next bid is `<bar>` | · |

**Steps:**

1. Enter `<bid_amount>` in the bid field and select **Place Bid**.
2. Read the refusal on the bid form.
3. Reload `<listing_12>` and read Highest bid and the bid count.
4. Navigate to `<my auctions url>` and look for `<listing_12>`.
5. Navigate to `<grade10 bids url>` and look for `<listing_12>`.

**Expected Results:**

* The bid is refused as needing a verified identity, and the form says: Bids this high need a verified identity. Verify from your account, then bid again.
* Highest bid and the bid count are unchanged; the auction records no bid.
* Step 4 shows no row for `<listing_12>`.
* Step 5 shows no entry for `<listing_12>`.

<!-- trace:case id=g10.auction-auction.TC-49i rev=2 covers=g10.auction-auction.SC-ndj,g10.auction-auction.SC-99a -->
### g10.auction-auction.US4-TC3: Bid below the bar asks nothing of any bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, and is on `<listing_13>`.
* `<listing_13>` is live, inside its window, in USD, and its minimum next bid is at or below `<bid_amount>`.

**Test data:**

| `<account_standing>` | `<bid_amount>` | Outcome | Fixture notes |
| --- | --- | --- | --- |
| `unverified` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| `expired` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| `verified` | USD520 | Forwarded; no standing read | `<bid_amount>`: (range: >0 and <1500000 minor units) |
| `unverified` | USD14,999.00 | Forwarded; no standing read | `<bid_amount>`: (fixed boundary or equality), one dollar below `<bar>` |
| `unverified` | USD14,999.99 | Forwarded; no standing read | `<bid_amount>`: (fixed boundary or equality), one cent below `<bar>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |

| Field | Value |
| --- | --- |
| listing_13 | A live USD listing inside its bidding window, minimum next bid at or below `<bid_amount>`; bind its identity only |

**Steps:**

1. Enter `<bid_amount>` in the bid field and select **Place Bid**.
2. Read Highest bid.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The bid is forwarded and accepted, and Highest bid reads `<bid_amount>`.
* No standing was read.

---

## g10.auction-auction.US5: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the listings I can bid on, soonest to close first, and to keep that order as I read on — below Featured when Featured is present, with no category section —,
**so that** what I can still bid on is in front of me and reading further never shows me a listing twice or skips one.

<!-- trace:case id=g10.auction-auction.TC-91h rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC1: Open lots lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists `<listing_14>`, `<listing_15>` and `<listing_16>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | An Active lot whose close is 18:00 UTC |
| `<listing_15>` | An Upcoming lot whose start is 19:00 UTC |
| `<listing_16>` | An Ended lot that closed at 12:00 UTC, before `<listing_14>` closes |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Read the lots in listed order.

**Expected Results:**

* `<listing_14>` is listed before `<listing_15>`.
* `<listing_15>` is listed before `<listing_16>`.

<!-- trace:case id=g10.auction-auction.TC-yh1 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC2: Each status has its own order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists the six lots in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_17>` | An Active lot closing at 18:00 UTC |
| `<listing_18>` | An Active lot closing at 19:00 UTC |
| `<listing_19>` | An Upcoming lot starting on 2026-10-01 |
| `<listing_20>` | An Upcoming lot starting on 2026-10-02 |
| `<listing_21>` | An Ended lot that closed on 2026-09-22 |
| `<listing_22>` | An Ended lot that closed on 2026-09-15 |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Read the lots in listed order.

**Expected Results:**

* `<listing_17>` is listed before `<listing_18>`.
* `<listing_19>` is listed before `<listing_20>`.
* `<listing_21>` is listed before `<listing_22>`.

<!-- trace:case id=g10.auction-auction.TC-yj3 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC3: A tie is settled the same way every read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* `<listing_23>` and `<listing_24>` are both Active and close at the same time.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_23>` | An Active lot closing at 18:00 UTC |
| `<listing_24>` | An Active lot closing at 18:00 UTC, a different lot record from `<listing_23>` |

**Steps:**

1. Read the API response for the Auction catalogue.
2. Read the API response for the Auction catalogue again.

**Expected Results:**

* `<listing_23>` and `<listing_24>` are in the same order both times.

<!-- trace:case id=g10.auction-auction.TC-c4u rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC4: Paging does not change the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction.spec.ts`

**Pre-conditions:**

* The Auction catalogue holds more lots than one page lists.

**Steps:**

1. Read the API response one page at a time to the end.
2. Read the API response for the whole catalogue.

**Expected Results:**

* Both readings list the lots in the same order.
* No lot is listed twice.
* No lot is missing.

<!-- trace:case id=g10.auction-auction.TC-2gb rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC5: Empty Featured leaves All auctions only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* No complete Featured slot is set.
* At least one lot is visible in All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the page sections.

**Expected Results:**

* No Featured band is present.
* All auctions is shown with lots in the catalogue resting order.

<!-- trace:case id=g10.auction-auction.TC-izg rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC6: Catalogue shows no category chrome

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Featured may be present or absent.

**Steps:**

1. Read the catalogue page for category chrome.

**Expected Results:**

* There is no Categories heading, no category tiles, and no busy filter chrome.
* The only sections are Featured when set, then All auctions.

<!-- trace:case id=g10.auction-auction.TC-j25 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC7: Empty All auctions still shows Featured when slots are set

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
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set.
* No lots are available for All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the All auctions area.

**Expected Results:**

* Featured still shows the curated slide or slides.
* All auctions shows a message that there are no auctions.

<!-- trace:case id=g10.auction-auction.TC-yqf rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC8: Featured lots also appear in All auctions resting order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set for `<featured lot>`.
* `<featured lot>` is among the lots a collector can see.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published lot that fills a complete Featured slot |

**Steps:**

1. Read the Featured band for `<featured lot>`.
2. Read All auctions for `<featured lot>` and the list order.

**Expected Results:**

* `<featured lot>` appears in Featured and again in All auctions.
* All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible lot.

<!-- trace:case id=g10.auction-auction.TC-q56 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC9: Catalogue address stays indexable at /auction without category query

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
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the document canonical and share address.

**Expected Results:**

* Canonical and share address are `/auction` with no category query.

<!-- trace:case id=g10.auction-auction.TC-90r rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC10: More All auctions lots load on scroll

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* All auctions holds more lots than the first batch shows.

**Steps:**

1. Read the first batch of All auctions cards.
2. Scroll near the end of the shown lots.
3. Wait for the next batch.

**Expected Results:**

* Step 2 shows Boneyard skeleton cards below the lots already shown, or the next batch lands without pagination controls.
* Step 3 shows additional lots below the first batch.
* Lots from step 1 stay visible.
* The combined list stays in the catalogue resting order.
* No pagination controls appear.

<!-- trace:case id=g10.auction-auction.TC-apa rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC11: An Upcoming All auctions card shows no money

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* An Upcoming lot is among All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot on All auctions |

**Steps:**

1. Find `<upcoming lot>` on All auctions.
2. Read its card for money and countdown.

**Expected Results:**

* The card shows no starting bid and no money amount.
* The card shows Opens in from the served open.

---

## g10.auction-auction.US6: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image, title,
status, countdown, current bid and Bid Now —,
**so that** the listings the house leads with are what I meet first.

<!-- trace:case id=g10.auction-auction.TC-5my rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC1: One Featured slide shows front page image title status countdown bid and Bid Now

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set for `<featured listing>` with `<front page image>`.

**Test data:**

| Field | Value |
| --- | --- |
| featured listing | A published Active listing bound to the only complete Featured slot |
| front page image | The front page image uploaded for that slot |
| featured listing title | The public title of `<featured listing>`; bind the title only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the single slide.

**Expected Results:**

* Featured band is present with one slide.
* The slide shows `<front page image>` as banner and slab, the title `<featured listing title>`, LIVE BIDDING with a live status dot, relative Ends in, the current bid, and Bid Now.

<!-- trace:case id=g10.auction-auction.TC-zwc rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC2: Current bid rolls when the served amount increases

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.
* The served current bid for `<featured listing>` is `<bid before>`.

**Test data:**

| Field | Value |
| --- | --- |
| featured listing | A published Active listing on a complete Featured slide |
| bid before | The current bid amount shown on the slide |
| bid after | A **higher** served current bid for the same listing after first paint |

**Steps:**

1. Read the current bid on the Featured slide after first paint.
2. Let the served current bid for `<featured listing>` become `<bid after>`.
3. Read the current bid on the Featured slide.

**Expected Results:**

* Step 1 shows `<bid before>`.
* Step 3 shows `<bid after>` with a rolling number as the amount increases.

<!-- trace:case id=g10.auction-auction.TC-htt rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC3: Client countdown uses served close or open by listing status

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* One complete Featured slot is set for a listing in `<listing_status>`, with countdown target `<served_time>`.

**Test data:**

| `<listing_status>` | `<served_time>` | `<expected_countdown>` |
| --- | --- | --- |
| Active | `<served_close>` | Relative Ends in to the served close |
| Upcoming | `<served_open>` | Relative Opens in to the served open; UPCOMING with no live status dot; View Auction; no money |

| Field | Value |
| --- | --- |
| served_close | The effective close returned for the Active listing; bind its datetime only |
| served_open | The scheduled opening returned for the Upcoming listing; bind its datetime only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the countdown and status chrome on the Featured slide.

**Expected Results:**

* The countdown matches this expected display: `<expected_countdown>`.
* Upcoming shows UPCOMING with no live status dot and View Auction, and shows no starting bid or money amount.

<!-- trace:case id=g10.auction-auction.TC-d55 rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC4: Three Featured slides appear in operator order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* Three complete Featured slots are set in operator order `<listing A>`, `<listing B>`, `<listing C>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing A | Published Active or Upcoming listing in Featured slot 1 |
| listing B | Published Active or Upcoming listing in Featured slot 2 |
| listing C | Published Active or Upcoming listing in Featured slot 3 |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured slides from first to last.

**Expected Results:**

* Featured shows three slides in order `<listing A>`, then `<listing B>`, then `<listing C>`.

<!-- trace:case id=g10.auction-auction.TC-b8d rev=1 covers=g10.auction-auction.SC-kis,g10.auction-auction.SC-3g8,g10.auction-auction.SC-8d7,g10.auction-auction.SC-rl4,g10.auction-auction.SC-wea -->
### g10.auction-auction.US6-TC5: Incomplete Featured slot is not shown

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* The only Featured slot holds an eligible listing and no front page image, or a front page image and no listing.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read whether a Featured band is present.

**Expected Results:**

* No Featured band is shown.
* All auctions is the catalogue content below the page chrome.

---

## g10.auction-auction.US7: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe,
**so that** I can reach every curated listing without leaving the band.

<!-- trace:case id=g10.auction-auction.TC-72n rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC1: Progress advances between two Featured slides

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Two complete Featured slots are set for `<listing A>` then `<listing B>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |

**Steps:**

1. Read the visible Featured listing.
2. Activate the progress control to advance to the next slide.
3. Read the visible Featured listing.

**Expected Results:**

* Step 1 shows `<listing A>`.
* Step 3 shows `<listing B>`.
* Progress dots are present for the two slides.

<!-- trace:case id=g10.auction-auction.TC-fbj rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC4: On a small viewport, stage next advances between two Featured slides

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` at a small viewport (below `md`).
* Two complete Featured slots are set for `<listing A>` then `<listing B>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |

**Steps:**

1. Read the visible Featured listing.
2. Activate stage next on the Featured image.
3. Read the visible Featured listing.

**Expected Results:**

* Step 1 shows `<listing A>`.
* Step 3 shows `<listing B>`.
* The stage image pages horizontally to `<listing B>`.
* Progress dots mark `<listing B>` current.

<!-- trace:case id=g10.auction-auction.TC-9ji rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC2: Progress reaches every slide when three are set

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Three complete Featured slots are set for `<listing A>`, `<listing B>`, `<listing C>` in that order.

**Test data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |
| listing C | Published listing in Featured slot 3 |

**Steps:**

1. Read the visible Featured listing.
2. Advance with the progress control until each remaining slide has been shown.
3. Read each visible Featured listing after each advance.

**Expected Results:**

* The visible listings are `<listing A>`, then `<listing B>`, then `<listing C>` without leaving the Featured band.

<!-- trace:case id=g10.auction-auction.TC-7lv rev=1 covers=g10.auction-auction.SC-94x -->
### g10.auction-auction.US7-TC3: A single Featured slide needs no multi-dot advance

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured progress control.

**Expected Results:**

* The single slide is shown.
* There is no multi-dot advance among slides.
* Stage previous/next is not required.

---

## g10.auction-auction.US8: Collector opens a Featured listing

**As a** collector on a Featured slide,
**I want** Bid Now when the listing is Active, or View Auction when it is Upcoming,
to open that listing's details page,
**so that** I land on the listing the catalogue led with.

<!-- trace:case id=g10.auction-auction.TC-ytf rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC1: Bid Now opens an Active listing details page

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| featured listing | A published **Active** listing on the visible Featured slide |
| listing page url | That listing's details page address |

**Steps:**

1. Activate Bid Now on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<listing page url>` — the details page for `<featured listing>`.

<!-- trace:case id=g10.auction-auction.TC-2aj rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC3: View Auction opens an Upcoming listing details page

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<upcoming listing>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| upcoming listing | A published Upcoming listing on the visible Featured slide |
| listing page url | That listing's details page address |

**Steps:**

1. Activate View Auction on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<listing page url>` — the details page for `<upcoming listing>`.

<!-- trace:case id=g10.auction-auction.TC-0qt rev=1 covers=g10.auction-auction.SC-sh8,g10.auction-auction.SC-b2i -->
### g10.auction-auction.US8-TC2: Bid Now on a later Active slide opens that slide's listing

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with two complete Featured slides for `<listing A>` then `<listing B>`.
* The progress control has advanced so `<listing B>` is visible.

**Test data:**

| Field | Value |
| --- | --- |
| listing A | Published **Active** listing in Featured slot 1 |
| listing B | Published **Active** listing in Featured slot 2 |
| listing B page url | `<listing B>`'s details page address |

**Steps:**

1. Activate Bid Now on the visible Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<listing B page url>` — the details page for `<listing B>`, not `<listing A>`.

---

## g10.auction-auction.US9: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that listing the same way as on the listing page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

<!-- trace:case id=g10.auction-auction.TC-fjy rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC1: Watch on from an All auctions card

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, not watching `<open listing>`) is on `<grade10 auction catalogue url>`.
* `<open listing>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| open listing | A published Active or Upcoming listing on an All auctions card |

**Steps:**

1. Activate watch on the All auctions card for `<open listing>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open listing>` is watched.

**Expected Results:**

* The card shows the watched state.
* `<open listing>` is watched the same way as from the listing page and My Auctions.

<!-- trace:case id=g10.auction-auction.TC-8nw rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC2: Watch off from an All auctions card

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, watching `<open listing>`) is on `<grade10 auction catalogue url>`.
* `<open listing>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| open listing | A published Active or Upcoming listing the collector already watches |

**Steps:**

1. Activate watch off on the All auctions card for `<open listing>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open listing>` remains watched.

**Expected Results:**

* The card shows the unwatched state.
* `<open listing>` is no longer watched, same as unwatching from the listing page or My Auctions.

<!-- trace:case id=g10.auction-auction.TC-txe rev=1 covers=g10.auction-auction.SC-na4,g10.auction-auction.SC-epv -->
### g10.auction-auction.US9-TC3: Closed listing card shows no watch control

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<grade10 auction catalogue url>`.
* `<closed listing>` appears on an All auctions card.

**Test data:**

| Field | Value |
| --- | --- |
| closed listing | A closed listing visible in All auctions |

**Steps:**

1. Find the All auctions card for `<closed listing>`.
2. Read whether a watch control is present on that card.

**Expected Results:**

* The closed listing card shows no watch control.

---

## g10.auction-auction.US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a listing to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

<!-- trace:case id=g10.auction-auction.TC-wbb rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC4: A bid placed in the last second counts when accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* `<listing_4>` is in extended bidding and its recorded close is 20:30:00 UTC.
* customer A(card linked) is signed in and on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap, led by customer B |
| `<bid time>` | 20:29:59 UTC, one second before the recorded close |
| `<bid amount>` | HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |
| `<new close>` | 20:59:59 UTC, `<bid time>` plus 1800s |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_4>`.

**Expected Results:**

* The bid is accepted when placed, with no wait for a payment.
* customer A leads and Highest bid reads `<bid amount>`.
* The recorded close reads `<new close>`.

<!-- trace:case id=g10.auction-auction.TC-zkx rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC5: No bid counts at or after the effective close while the close is unrecorded

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* `<listing_5>` has scheduled close 20:00:00 UTC and its extension terms are the row's.
* customer B's bid was accepted on `<listing_5>` at `<last accepted>`.
* Settling `<listing_5>` is held back, so its close is not yet recorded at `<bid time>`.
* customer A(card linked) is signed in and can bid on `<listing_5>`.

**Test data:**

| `<extension duration>` | `<extension cap>` | `<last accepted>` | `<effective close>` | `<bid time>` |
| --- | --- | --- | --- | --- |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:00 UTC, at the limit |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:01 UTC |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:00 UTC, at the limit |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:01 UTC |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<bid amount>` | HKD5,210 (range: 400000–799999 minor units), at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_5>`.
3. Let settling resume.
4. Read the lot's result.

**Expected Results:**

* Step 1 is refused.
* At step 2 no accepted bid is added, the recorded close does not move, and `<listing_5>` is still not recorded closed.
* At step 4 `<listing_5>` is closed with customer B winning.

<!-- trace:case id=g10.auction-auction.TC-x7e rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC6: Extension cap of 0 closes the lot at its scheduled close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* `<listing_6>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An open listing, scheduled close 20:00:00 UTC, extension duration 1800s (30mins), extension cap 0s |

**Steps:**

1. Wait for the scheduled close.
2. Read the API response for `<listing_6>`.

**Expected Results:**

* `<listing_6>` never entered extended bidding.
* It is closed at 20:00:00 UTC, with its one bidder winning.

<!-- trace:case id=g10.auction-auction.TC-xee rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC7: A due lot is recorded closed at its close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_7>`.
* `<listing_7>`'s recorded close is about two minutes away, and no other bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer A |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait for the recorded close.
2. Read the API response for `<listing_7>`.

**Expected Results:**

* Step 2 reads `<listing_7>` closed, customer A winning, before the next sweep, well inside `<sweep interval>`.

<!-- trace:case id=g10.auction-auction.TC-32a rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC8: A lot whose alarm missed is still settled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_8>`, and no other bid will be placed.
* The lot's own alarm is disabled for `<listing_8>`.

**Test data:**

| `<who reaches it>` | `<recorded by>` |
| --- | --- |
| A read of `<listing_8>` more than 2s after its recorded close | Right after that read answers |
| Nobody before the five-minute sweep | The next sweep, at most 300s (5mins) after the recorded close |

**Steps:**

1. Wait for `<listing_8>`'s recorded close.
2. Let `<who reaches it>` reach `<listing_8>`.
3. Read the API response for `<listing_8>`.

**Expected Results:**

* `<listing_8>` is recorded closed `<recorded by>`, with customer A winning.
* Before then, `<listing_8>` takes no bid and reports no result.

<!-- trace:case id=g10.auction-auction.TC-cr9 rev=2 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC9: A lot no page has open is recorded closed at its close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`

**Pre-conditions:**

* `<listing_11>` is in the row's state, and no page has it open.
* Nobody reads `<listing_11>` until step 2.

**Test data:**

| `<listing_11>` state | `<close>` | `<result>` |
| --- | --- | --- |
| An HKD listing in extended bidding, led by customer A at `<leader price>`, extension duration 1800s (30mins), no cap | its recorded close | Closed, customer A winning at `<leader price>` |
| An open HKD listing with no accepted bid, extension duration 1800s (30mins) | its scheduled close | Closed unsold, never in extended bidding |

| Field | Value |
| --- | --- |
| `<leader price>` | HKD4,960 (range: 400000–799999 minor units) |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait until 10 seconds past `<close>`.
2. Read the API response for `<listing_11>`.

**Expected Results:**

* `<listing_11>` reads `<result>`, recorded within seconds of `<close>`.
* The close is recorded before the next sweep, well inside `<sweep interval>`.

<!-- trace:case id=g10.auction-auction.TC-yrr rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC10: Public reads give the close terms and the service's time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/catalogue.spec.ts`, `grade10:apps/backend/grade10/auction/test/worker/routes.spec.ts`

**Pre-conditions:**

* `<listing_12>` is in extended bidding.
* No session is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An HKD listing, scheduled close 20:00:00 UTC, recorded close 20:25:00 UTC, extension duration 1800s (30mins), extension cap 3600s (60mins) |

**Steps:**

1. Read `<listing_12>` from the public listing API.
2. Read the auction service's time from its public time read.
3. One second later, read the public time again.

**Expected Results:**

* Step 1 gives scheduled close 20:00:00 UTC and recorded close 20:25:00 UTC.
* Step 1 gives extension duration 1800s and extension cap 3600s.
* Steps 2 and 3 each give the auction service's time when it answered, not the caller's.
* Step 3's answer is about one second after step 2's, not a cached copy.

<!-- trace:case id=g10.auction-auction.TC-piw rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC1: Payment confirmed before the effective close counts the bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_1>`.
* customer B leads `<listing_1>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_1>` state | `<placed at>` | `<confirm time>` | `<recorded close after>` |
| --- | --- | --- | --- |
| Open, scheduled close 20:00:00 UTC | 19:59:50 UTC | 19:59:58 UTC | 20:00:00 UTC, unchanged |
| Extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap | 20:29:50 UTC | 20:29:58 UTC | 20:59:58 UTC, `<confirm time>` plus 1800s |
| Open, scheduled close 20:00:00 UTC, extension duration 0s | 19:59:55 UTC | 20:00:00.000 UTC, exactly the scheduled close, at the limit | 20:00:00 UTC, unchanged |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 521000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Read the API response for `<listing_1>` after `<confirm time>`.

**Expected Results:**

* The bid is accepted at `<confirm time>`, and customer A leads.
* Highest bid reads `<bid amount>`.
* The recorded close reads `<recorded close after>`.
* With no further bid, `<listing_1>` closes at `<recorded close after>` with customer A winning.

<!-- trace:case id=g10.auction-auction.TC-ppq rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC2: Payment confirmed after the effective close loses and releases its hold

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_2>`.
* customer B leads `<listing_2>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_2>` state | `<recorded close>` | `<effective close>` | `<placed at>` | `<confirm time>` |
| --- | --- | --- | --- | --- |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:01 UTC |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:00.000 UTC, exactly the effective close, at the limit |
| Open, extension duration 0s | 20:00:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 19:59:55 UTC | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 521000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel.
4. Read customer A's card authorization for `<listing_2>`.

**Expected Results:**

* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* Highest bid stays `<leader price>`, and customer B still leads.
* The recorded close stays `<recorded close>`.
* customer A's authorization for `<bid amount>` is released.
* `<listing_2>` closes with customer B winning at `<leader price>`.

<!-- trace:case id=g10.auction-auction.TC-2di rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC3: Lone first bid still confirming at the scheduled close leaves the lot unsold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* `<listing_3>` is open with no accepted bid.
* customer A(card linked) is signed in and on the lot page for `<listing_3>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing with no bids, scheduled close 20:00:00 UTC, extension duration 1800s (30mins) |
| `<starting price>` | 120000 minor units |
| `<placed at>` | 19:59:55 UTC |
| `<confirm time>` | 20:00:03 UTC, after the scheduled close |

**Steps:**

1. As customer A, place `<starting price>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel and the lot's result.
4. Read customer A's card authorization for `<listing_3>`.

**Expected Results:**

* `<listing_3>` never enters extended bidding.
* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* `<listing_3>` closes unsold at 20:00:00 UTC, reading Ended with No bids.
* customer A's authorization is released.

<!-- trace:case id=g10.auction-auction.TC-lfy rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp -->
### g10.auction-auction.US11-TC11: Leader's raise confirmed after the close loses, the earlier lead stands

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A leads `<listing_13>` at `<leader price>` with maximum `<user A maximum>`, its authorization held.
* customer A's authorization for `<raised maximum>` is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An HKD listing in extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<raised maximum>` | 900000 minor units |
| `<placed at>` | 20:29:55 UTC |
| `<confirm time>` | 20:30:01 UTC, after the effective close |

**Steps:**

1. As customer A, raise the maximum to `<raised maximum>` at `<placed at>`.
2. Wait until `<listing_13>` is recorded closed.
3. Read the API response for `<listing_13>`.
4. Read customer A's card authorizations for `<listing_13>`.

**Expected Results:**

* `<listing_13>` closes at 20:30:00 UTC, customer A winning at `<leader price>`.
* customer A's maximum stays `<user A maximum>`.
* The authorization for `<raised maximum>` is released.
* The authorization for `<user A maximum>` is kept.

<!-- trace:case id=g10.auction-auction.TC-itn rev=1 covers=none -->
### g10.auction-auction.US11-TC12: A lot the house leads at the close reads sold like any other

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_1>` is led as the row states at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
* customer C has never bid on `<listing_1>` and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in extended bidding |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<final price>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | Leader |
| --- | --- |
| House | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| Collector | customer B, with maximum 600000 minor units and no internal bid on the lot |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the lot's state, Highest bid and Recent bids.
3. Read the API response for `<listing_1>`'s public facts.
4. Open <grade10 auction url> and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3 reads the lot closed with a winner at `<final price>`, the winner by pseudonym only.
* Step 4's card reads Ended, as any sold lot's card does.
* The House row and the Collector row read alike in every step, save the pseudonym.

<!-- trace:case id=g10.auction-auction.TC-xcm rev=1 covers=none -->
### g10.auction-auction.US11-TC13: A lot whose only bid is the house's extends and closes sold at the starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at the row's commit time.
* `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
* customer C is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<extension duration>` | 1800s (30mins) |

| Row | Commit time |
| --- | --- |
| Before the close | 1 minute from now, before the scheduled close |
| At the scheduled close | Exactly the scheduled close |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes.
3. Read the lot's state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads extended bidding, the close `<extension duration>` after the scheduled close.
* Step 3 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

---

## g10.auction-auction.US12: Bidder keeps a listing open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the listing's price,
**so that** a leader cannot keep a listing open by raising their own maximum.

<!-- trace:case id=g10.auction-auction.TC-lmv rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC1: Equal maximum at a higher price extends the lot

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
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_9>` is in extended bidding with its recorded close `<time left before bid>` away.
* customer A leads `<listing_9>` at `<leader price>` with maximum `<user A maximum>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_9>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before bid>` | 5 minutes |
| `<leader price>` | HKD1,260 (range: 80000–399999 minor units) |
| `<user A maximum>` | HKD2,360 (range: 80000–399999 minor units) |
| `<user B maximum>` | HKD2,360 (fixed boundary or equality), equal to `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<user B maximum>`.
* customer A still leads, as the earlier maximum.
* Time left reads `<extension duration>` from customer B's bid.

<!-- trace:case id=g10.auction-auction.TC-gqo rev=1 covers=g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3 -->
### g10.auction-auction.US12-TC2: Leader raising their own maximum leaves the close where it was

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
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_10>` is in extended bidding, its recorded close `<close before raise>`.
* customer A leads `<listing_10>` at `<leader price>` with maximum `<user A maximum>`, and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap |
| `<close before raise>` | 3 minutes after the raise |
| `<leader price>` | HKD5,460 (range: 400000–799999 minor units) |
| `<user A maximum>` | HKD8,400 (range: 800000–3999999 minor units) |
| `<raised maximum>` | HKD9,600 (range: 800000–3999999 minor units) |

**Steps:**

1. Select **Raise**, enter `<raised maximum>` and confirm.
2. Read Your maximum, Highest bid and Time left.
3. Wait until `<close before raise>` with no further bid.
4. Read the lot's result.

**Expected Results:**

* Your maximum reads `<raised maximum>`.
* Highest bid stays `<leader price>`.
* The recorded close stays `<close before raise>`, and Time left keeps counting to it.
* The lot closes at `<close before raise>`, customer A winning at `<leader price>`.

<!-- trace:case id=g10.auction-auction.TC-2g4 rev=1 covers=g10.auction-auto-bidding.SC-pfm,g10.auction-auto-bidding.SC-ax3 -->
### g10.auction-auction.US12-TC3: A house change restarts the timer only when it moves the price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* `<listing_3>` is in extended bidding with its recorded close `<time left before change>` away.
* `<listing_3>`'s internal bid of `<house maximum>` is committed, and the bidding has this setup: `<bidding_setup>`.
* admin(holds auction:reserve) is on `<listing_3>`'s editor in the admin.
* customer C is on the listing page for `<listing_3>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_3 | A published HKD listing in extended bidding, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |
| time left before change | 5 minutes | · |
| house maximum | 600000 minor units | (HK$6,000.00) |

| Row | `<bidding_setup>` | `<house_change>` | `<highest_bid_after>` | `<time_left_after>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| Raise past the leader | customer A leads at 608000 with maximum 700000 | Raise to 800000 | 708000 | `<extension duration>` from the raise | `<highest_bid_after>`: customer A's maximum plus its 8000 increment, the house leading |
| Raise while leading | The house leads at 508000 over customer A's maximum of 500000 | Raise to 800000 | 508000 | `<time left before change>`, less the time taken | `<highest_bid_after>`: unchanged |
| Lower while leading | The house leads at 508000 over customer A's maximum of 500000 | Lower to 550000 | 508000 | `<time left before change>`, less the time taken | `<highest_bid_after>`: unchanged |

**Steps:**

1. As the admin, make this house change: `<house_change>` and click Save.
2. As customer C, read Highest bid, the leader and Time left.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads Highest bid `<highest_bid_after>` and Time left `<time_left_after>`.

---

## g10.auction-auction.US13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a listing,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the listing keeps a leader and I never pay more than the price stood at before.

<!-- trace:case id=g10.auction-auction.TC-ptt rev=1 covers=g10.auction-auction.SC-qs1,g10.auction-auction.SC-hlm,g10.auction-auction.SC-z26,g10.auction-auction.SC-43o,g10.auction-auction.SC-t9v,g10.auction-auction.SC-rmq,g10.auction-auction.SC-5oc -->
### g10.auction-auction.US13-TC1: Highest maximum left leads, priced from the maxima left

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_27>` is open inside its window, with maxima `<customer A maximum>`, `<customer B maximum>` and `<customer C maximum>` committed in the order stated in Test data.
* customer A leads `<listing_27>` at `<price before>`.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.
* customer B is signed in on a separate session.

**Test data:**

| `<customer A maximum>` | `<customer B maximum>` | `<customer C maximum>` | `<price before>` | `<price after>` | `<leader_after>` | Fixture notes |
| --- | --- | --- | --- | --- | --- | --- |
| HKD2,300 | HKD1,700 | HKD1,350 | HKD1,740 | HKD1,390 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units); `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed derived value), customer B's maximum plus 4000; `<price after>`: (fixed derived value), customer C's maximum plus 4000 |
| HKD2,300 | HKD1,360 | HKD1,350 | HKD1,400 | HKD1,360 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units); `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed derived value), customer B's maximum plus 4000; `<price after>`: (fixed derived value), capped at customer B's maximum |
| HKD1,750 | HKD1,750 | HKD1,350 | HKD1,750 | HKD1,390 | customer B | `<customer A maximum>`: (range: 80000–399999 minor units), first; `<customer B maximum>`: (range: 80000–399999 minor units), second; `<customer C maximum>`: (range: 80000–399999 minor units); `<price before>`: (fixed boundary or equality), equal maxima, customer A earlier; `<price after>`: (fixed boundary or equality), customer C's maximum plus 4000 |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_27 | An open HKD listing, starting price HKD280 (range: 1000–79999 minor units), scheduled close more than an hour away | · |
| increment | HKD40 | (fixed tier increment), the HK$800 tier, at every maximum above |

**Steps:**

1. Read `<listing_27>` from the public listing API.
2. Erase customer A's account through the account-erasure procedure.
3. Read `<listing_27>` from the public listing API.
4. As customer B, read their own standing on `<listing_27>`.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`, led by customer A.
* Step 3 reads Highest bid `<price after>`, the next maximum left plus one increment, capped at the new leader's maximum.
* Step 3's Highest bid is never above `<price before>`.
* Step 4 reads `<leader_after>` as leader, with their own maximum unchanged.
* customer A's maxima appear nowhere on `<listing_27>`.

<!-- trace:case id=g10.auction-auction.TC-y3z rev=1 covers=g10.auction-auction.SC-qs1,g10.auction-auction.SC-hlm,g10.auction-auction.SC-z26,g10.auction-auction.SC-43o,g10.auction-auction.SC-t9v,g10.auction-auction.SC-rmq,g10.auction-auction.SC-5oc -->
### g10.auction-auction.US13-TC2: Erasing the only bidder leaves the listing with no leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_28>` is open inside its window, and customer A holds its only maximum of `<customer A maximum>`.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_28 | An open HKD listing, starting price `<starting_price>`, led by customer A alone at the starting price | · |
| customer A maximum | HKD2,350 | (range: 80000–399999 minor units) |
| starting_price | HKD280 | (range: 1000–79999 minor units), the opening price of `<listing_28>` |

**Steps:**

1. Erase customer A's account through the account-erasure procedure.
2. Read `<listing_28>` from the public listing API.

**Expected Results:**

* `<listing_28>` has no leader and no current bid.
* The next bid must reach `<starting_price>`, the opening price.
* customer A's maximum appears nowhere on `<listing_28>`.

<!-- trace:case id=g10.auction-auction.TC-lxa rev=1 covers=g10.auction-auction.SC-qs1,g10.auction-auction.SC-hlm,g10.auction-auction.SC-z26,g10.auction-auction.SC-43o,g10.auction-auction.SC-t9v,g10.auction-auction.SC-rmq,g10.auction-auction.SC-5oc -->
### g10.auction-auction.US13-TC3: Erasing a bidder re-prices the listing from the maxima left, never upward

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_32>` is open inside its window, with maxima committed in this order: `<committed_maxima>`, and Highest bid `<price before>`.
* The erased customer has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| `<committed_maxima>` | `<price before>` | `<erased_customer>` | `<leader_after>` | `<price after>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| customer A 23000, customer B 17000, customer C 13500 | 17500 | customer B | customer A | 14000 | `<price after>`: customer C's maximum plus 500 |
| customer A 23000 raised to 47000 after customer B 22800, customer C 10500 | 23000 | customer C | customer A | 23000 | `<price after>`: unchanged: customer B's maximum plus 500 is 23300, above `<price before>` |
| customer A 23000, customer B 17000, customer C 12500 | 17500 | customer C | customer A | 17500 | `<price after>`: unchanged, on the same bid |
| customer A 23000, customer B 17000 | 17500 | customer A | customer B | 10000 | `<price after>`: the opening price |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_32 | An open USD listing, opening price USD100 (fixed tier boundary), scheduled close more than an hour away; every amount above is in USD minor units | · |
| increment | USD5 | (fixed tier increment), the USD 100 tier, at every next maximum above |

**Steps:**

1. Read `<listing_32>` from the public listing API, noting its scheduled close.
2. Erase `<erased_customer>`'s account through the account-erasure procedure.
3. Read `<listing_32>` from the public listing API.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`.
* Step 3 reads Highest bid `<price after>`, led by `<leader_after>`.
* Step 3's Highest bid is never above `<price before>`.
* Step 3's scheduled close is the one noted at step 1.
* The erased customer's maxima appear nowhere on `<listing_32>`.

---

## g10.auction-auction.US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** above-ceiling attempts to show no maximum-bid message and other refusals to say why on the bid form, with no trace of a refused bid anywhere else,
**so that** an oversized entry does not interrupt my review and I never read a bid I did not place as one I did.

<!-- trace:case id=g10.auction-auction.TC-r0p rev=2 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### g10.auction-auction.US14-TC1: A refused bid says why on the bid form and places nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked, account in `<account_state>`) is signed in and on the listing page for `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* `<listing_29>` is in `<listing_state>`.

**Test data:**

| Refused when | `<account_state>` | `<listing_state>` | `<amount_entered>` | `<refusal_message>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| Below the next minimum | In good standing | Open, minimum next bid `<next minimum>` | HKD5,280 | Minimum bid is, naming `<next minimum>` | `<amount_entered>`: (fixed derived value), one major unit below `<next minimum>` |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. | · |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. | · |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. | · |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_29 | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` | · |
| current bid | HKD5,210 | (range: 400000–799999 minor units) |
| next minimum | HKD5,290 | (fixed derived value), `<current bid>` plus its 8000 increment |
| bid count | 3 | · |

**Steps:**

1. Enter `<amount_entered>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
4. Reload the listing page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.

**Expected Results:**

* Step 3 shows `<refusal_message>` on the bid form.
* Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer.
* Step 4 shows no Leading or Outbid standing for the customer.
* Step 5 shows no row for `<listing_29>`.
* Step 6 shows no entry for `<listing_29>`.

<!-- trace:case id=g10.auction-auction.TC-dim rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC2: A rival's refused bid moves nothing for the leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_30>` at `<current bid>`, and is signed in on the lot page.
* customer B(card linked, no bid on `<listing_30>`) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | An open HKD listing led by customer A, maximum HKD8,400 (range: 800000–3999999 minor units) |
| `<current bid>` | HKD5,210 (range: 400000–799999 minor units) |
| `<below minimum>` | HKD5,280 (fixed derived value), one major unit below `<current bid>` plus its 8000 increment |

**Steps:**

1. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
2. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
3. As customer A, navigate to `<my auctions url>` and read `<listing_30>`'s row.
4. As customer A, read their mailbox for a letter about `<listing_30>` sent after step 1.

**Expected Results:**

* Step 1 is refused on customer B's bid form.
* Step 2 reads Highest bid `<current bid>`, Recent Bids unchanged, and customer A still Leading.
* Step 3's row reads Leading, with Current bid `<current bid>`.
* Step 4 finds no new-bid or outbid letter.

<!-- trace:case id=g10.auction-auction.TC-m0b rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv -->
### g10.auction-auction.US14-TC3: A bid whose answer is lost reads by the bidder's standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer(card linked) is signed in and on the lot page for `<listing_31>`, holding the row's standing before the bid.
* The network is manipulated to drop the bid at the row's point.

**Test data:**

| Standing before | Bid sent | Dropped | The bid form reads | Standing after |
| --- | --- | --- | --- | --- |
| No bid | A first maximum of `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| No bid | A first maximum of `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value |
| --- | --- |
| `<listing_31>` | An open HKD listing with no other bidder, starting price HKD280 (range: 1000–79999 minor units) |
| `<maximum>` | HKD560 (range: 1000–79999 minor units) |
| `<raised maximum>` | HKD920 (range: 80000–399999 minor units) |

**Steps:**

1. Enter the row's bid in the custom maximum on the bid panel.
2. Place the bid.
3. Wait until the bid form settles.
4. Read the bid form.
5. Reload the lot page and read the bid panel's standing.
6. Navigate to `<my auctions url>` and look for `<listing_31>`.

**Expected Results:**

* Step 4 reads the row's words on the bid form, never both placed and refused.
* Step 5 reads the row's standing after.
* Step 6 agrees with the row's standing after.

<!-- trace:case id=g10.auction-auction.TC-55k rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### g10.auction-auction.US14-TC4: Defensive ceiling refusal shows no message or retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(card linked, account in good standing) is signed in on `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* The next bid answer is mocked as `AMOUNT_TOO_HIGH`, with the row's ceiling and server-message fields.
* The custom maximum draft equals `<valid draft>`.

**Test data:**

| Ceiling field | Server-message field |
| --- | --- |
| `<ceiling>` | A distinct server-message marker |
| Absent | A distinct server-message marker |
| `<ceiling>` | Absent |
| Absent | Absent |

| Field | Value |
| --- | --- |
| listing_29 | An open HKD listing led by customer B, current bid HKD5,210 (range: 400000–799999 minor units) and bid count 3 |
| valid draft | 5130 whole major units, the listing's next minimum |
| ceiling | HKD80,000,000 (fixed configured value) |

**Steps:**

1. Place the bid.
2. Wait for the mocked refusal answer.
3. Read the bid form and custom maximum field.
4. Read the number of bid attempts sent.
5. Reload the listing and read its public bids and standing.
6. Read My Auctions and Bidding History for `<listing_29>`.

**Expected Results:**

* Step 3: no maximum-bid or generic refusal message appears.
* Step 3: no server message or toast appears.
* Step 3: pending bid status ends and the action is usable.
* Step 3: the displayed draft remains `<valid draft>`.
* Step 4: exactly one attempt is sent, without automatic retry.
* Step 5: the price, leader, bid count and public bids remain unchanged.
* Step 5: customer has no Leading or Outbid standing.
* Step 6: neither surface records the refused attempt.

## Settled

- `g10.auction-auction.US3` is retired by `refused-bid-is-not-a-bid`; its deprecated case content is removed from the durable suite.
- Retired marker IDs folded here: `g10.auction-auction.TC-tmg`, `g10.auction-auction.TC-g81`, `g10.auction-auction.TC-m5k`, `g10.auction-auction.TC-9qw`, `g10.auction-auction.TC-nna`, `g10.auction-auction.TC-ghi`
- A lot only the house bid on, its commit at or before the scheduled close, enters extended bidding and closes sold at the opening price, as any lone bid does (Q21)
- A lot the house leads at its close is sold to its internal bidder: the close opens that internal bidder's order, flagged internal, with no invoice and no charge to any card, and sends it no letter; collectors still read the lot sold under the house's pseudonym (Q2, Q5, Q33, Q51)
- None this run. The blind reading's one question, whether the US$15,000 figure is a requirement of this capability, went to `decisions.md` `## Raised` and landed as Q22.

## Reconciliation

Run: durable carry for add-account-identity-gate; the feature set, journey and suite were reconciled against the carried requirements.

- **Uncovered anchors:** none.

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, redrafted from the re-frozen Purpose, Feature set and `user-journeys.md` with no flag, the change's `proposal.md`, `decisions.md` with `## Raised`, the linked pages under `docs/prds/`, the durable suite and the change's `domain-tcs.md`, with this delta's scenarios, `tech-design.md`, `tasks.md` and the built listing read in grade10. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive.

| Finding | Disposition |
| --- | --- |
| US2-TC15-2: a first bid at the opening price is accepted, in each currency, a start below the lowest increment included | **Folded in:** `grade10-site-auction-auction-SC-62` (Q19). QA2 added the next-minimum step its AND clause asserts |
| US2-TC16-2: a first bid one minor unit below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-64`, `grade10-site-auction-auction-SC-63`; the 0-start rows bid 99 rather than 1, the same partition |
| US2-TC17-1, US2-TC18-1: the first bid must reach the starting price plus its increment | **Rejected:** Q19, Q27 - the first bid meets the opening price; both stay `deprecated` |
| US11-TC1-1: a payment confirmed before the effective close counts, at the scheduled close with extension off included | **Folded in:** `grade10-site-auction-auction-SC-69`, `grade10-site-auction-auction-SC-21`, `grade10-site-auction-auction-SC-83` (Q34). QA2 added the close with customer A winning that SC-83 asserts |
| US11-TC2-1: a payment confirmed at or after the effective close loses, its hold released, "Your bid did not go through." alone | **Folded in:** `grade10-site-auction-auction-SC-67`; the words are `grade10-site-auction-listing-page-SC-45` (Q13) |
| US11-TC3-1: a lone first bid still confirming at the scheduled close leaves the lot unsold | **Folded in:** `grade10-site-auction-auction-SC-68`; Ended with No bids is `grade10-site-auction-listing-page-SC-46` |
| US11-TC4-1: with holds off a bid counts when placed | **Folded in:** `grade10-site-auction-auction-SC-86` |
| US11-TC5-1: no bid counts at or after the effective close, under a cap, no cap, a cap of 0 and extension off, while the close is unrecorded | **Folded in:** `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-87`, `grade10-site-auction-auction-SC-74`, `grade10-site-auction-auction-SC-05` (Q14, Q34) |
| US11-TC6-1: a cap of 0 closes the lot at its scheduled close | **Folded in:** `grade10-site-auction-auction-SC-84`; the refused bid after it is TC5-1's cap-0 rows |
| US11-TC7-1: a due lot is recorded closed at its close, and its close lag is read | **Folded in:** `grade10-site-auction-auction-SC-70` for the close. **Rejected** for the lag: it is the proposal's metric, emitted as `auction.close.lag_ms` (`tech-design.md`, task 5.5), not something a collector meets. QA2 dropped the lag step |
| US11-TC8-1: a lot whose alarm missed is settled by a read after it answers, else by the sweep | **Folded in:** `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72` |
| US11-TC9-2: a lot no page has open is recorded closed at its close, sold or unsold | **Folded in:** `grade10-site-auction-auction-SC-70` |
| US11-TC10-1: public reads give the close terms and the service's time | **Folded in:** `grade10-site-auction-auction-SC-80`; the terms are durable `grade10-site-auction-auction-SC-13`. QA2 added the second read SC-80 asserts |
| US11-TC11-1: a leader's raise confirmed after the close loses, its hold released, the earlier lead and hold kept | **Folded in:** `grade10-site-auction-auction-SC-67` and the requirement's Confirms table; the kept hold is durable One hold per bidder |
| US12-TC1-1: equal maxima at a higher price extend | **Folded in:** `grade10-site-auction-auction-SC-82` (Q5) |
| US12-TC2-1: a leader raising their own maximum leaves the close | **Folded in:** `grade10-site-auction-auction-SC-81` (Q5) |
| QA1 raised: between the effective close and the recorded close, what minimum next bid does the public read give? | **Settled by the artifacts:** `grade10-site/auction/bid-increments` takes the minimum from the amount being beaten, whatever the window, and the built read and live frame publish it unchanged; rule 7 and `grade10-site-auction-auction-SC-74` count no bid at it; the lot page shows Closed with its bid controls disabled and My Auctions drops it (`grade10-site-auction-account-record-SC-65`). Written to `## Settled`; no case asserts the raw value |
| `grade10-site-auction-auction-SC-73`: two settles at once close the lot once | **Out of suite:** a race no walk can time; task 5.1's settle tests in grade10 decide it |
| `grade10-site-auction-auction-SC-75`: an older update or read does not replace a newer one | **Out of suite:** a race no walk can time; tasks 3.1 and 7.1, the version triggers and `higherVersion` tests in grade10, decide it |
| `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-77`: live updates carry only public facts; a page with no live line catches up by polling | **Out of suite:** `grade10-site-auction-listing-page-US12-TC6-1` and `grade10-site-auction-listing-page-US12-TC3-1` walk them on the lot page; task 6.1's frame tests hold the payload |
| `grade10-site-auction-auction-SC-79`: a lot called off while pages are open leaves them | **Out of suite:** no journey walks a call-off; task 7.1's `gone` frame test and task 6.1's frame tests in grade10 decide it |
| Unchanged window scenarios restated by the modified block - `SC-04`, `SC-07`, `SC-07a`, `SC-07b`, `SC-08`, `SC-19`, `SC-20`, `SC-22`, `SC-23a`, `SC-24` | **Out of suite:** the durable suite's US2-TC5-1 to US2-TC14-1; this change does not alter what they verify |

- **Covered at domain** — `g10.auction-dmn.US7-TC3` walks `grade10-site-auction-auction-SC-06`: a price-moving bid in extended bidding restarts the close
- **Covered at domain** — `g10.auction-dmn.US7-TC4` walks `grade10-site-auction-auction-SC-65` and `grade10-site-auction-auction-SC-66`: the card moves with a bid and counts to the new close
- **Covered at domain** — `g10.auction-dmn.US12-TC2` walks `grade10-site-auction-auction-SC-88`: the card shows its closed state with no result, then the result, without a reload

**Uncovered anchors:** none. `grade10-site-auction-auction-US-02`, `-US-11` and `-US-12` each have their cases, and the `Catalogue`, `Closing a due lot`, `Live relay` and `Public contract` groups are walked here, at domain or by the tests named above.

**Run:** Blind suite from `.round/blind-input` (Purpose/Feature set, journeys, proposal, decisions, ui-design without scenario dispositions, PRD Catalogue/Featured excerpts, existing site feature-tcs with Reconciliation stripped). Denied: `openspec/specs/` requirements, archive, and any `## Requirements`. Scenario pass read `.round/scenario-input` including durable site requirements and tech-design; denied all feature-tcs and blind drafts.

### Raised, folded
- Empty All auctions with Featured still present → `grade10-site-auction-auction-SC-41`
- Catalogue address `/auction` with no category query → `grade10-site-auction-auction-SC-42`
- Featured absent when no complete eligible slide (including Ended-at-read) → `grade10-site-auction-auction-SC-30`
- Incomplete slot not shown → `grade10-admin-auction-featured-SC-02` (site coverage via SC-30)
- Same lot in two slots refused → `grade10-admin-auction-featured-SC-06`
- Replace in place → stated on fill requirement; covered by fill scenarios
- View Auction on Upcoming Featured → `grade10-site-auction-auction-SC-58`
- Bid rolls only on increase after first paint → `grade10-site-auction-auction-SC-32`
- All auctions infinite scroll and load-more skeletons → `grade10-site-auction-auction-SC-59`, `SC-60`
- Upcoming hides money on Featured and All auctions → `grade10-site-auction-auction-SC-33`, `SC-61`

### Raised, rejected
- Auto-advance as a required product behaviour — journey and decisions name collector advance (progress; on small viewports stage previous/next or swipe); auto-play is CarouselProgress presentation only
- Signed-out watch behaviour on All auctions cards — already required by `grade10-site/auction/watchlist`; not restated here

### Uncovered anchors
- **Out of suite:** signed-out watch from catalogue — `grade10-site/auction/watchlist` feature suite (`grade10-site-auction-watchlist-SC-04`)

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auction-SC-23` by `g10.auction-auction.US2-TC5`; `grade10-site-auction-auction-SC-10`, moved to `grade10-site-auction-auction-US-02` with grade10-site-auction-auction-US-03 retired, by `g10.auction-auction.US2-TC19`; `grade10-site-auction-auction-SC-86` by `g10.auction-auction.US11-TC4`; `grade10-site-auction-auction-SC-16` by `g10.auction-auction.US4-TC2`; `grade10-site-auction-auction-SC-89` by the first row of `g10.auction-auction.US14-TC1`; `grade10-site-auction-auction-SC-90` by `grade10-site-auction-account-record-US2-TC6-1` and `grade10-site-auction-bidding-history-US1-TC7-1`; `grade10-site-auction-auction-SC-91` by the rows of `g10.auction-auction.US14-TC1`, with the card refusals in `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1` and the bar in `g10.auction-auction.US4-TC2`; `grade10-site-auction-auction-SC-94` and `grade10-site-auction-auction-SC-95` by `g10.auction-auction.US14-TC3`; `grade10-site-auction-auction-SC-96` by `g10.auction-auction.US13-TC1`; `grade10-site-auction-auction-SC-101` by `g10.auction-auction.US13-TC2`
- **Covered at domain** - `g10.auction-dmn.US4-TC3` reads the bid form's words for a maximum not raised, the row of `grade10-site-auction-auction-SC-91` this suite leaves to it
- **Added by QA2** - `g10.auction-auction.US13-TC3`, one row each for `grade10-site-auction-auction-SC-97`, `grade10-site-auction-auction-SC-98`, `grade10-site-auction-auction-SC-99` and `grade10-site-auction-auction-SC-100`: erasing a bidder who is not the leader, a leader whose maximum outgrew the price, and one maximum left. It also reads that the scheduled close does not move. No blind case erased anyone but the leader
- **Corrected** - `g10.auction-auction.US13-TC2` read only that Highest bid is never above the price before; `grade10-site-auction-auction-SC-101` states no leader and no current bid, with the next bid at the opening price, and the case reads that. `g10.auction-auction.US2-TC19` traced the Feature set group Card on file; it traces `grade10-site-auction-auction-US-02`
- **Revised** - `g10.auction-auction.US2-TC5`, `g10.auction-auction.US4-TC1` and `g10.auction-auction.US4-TC2` stop reading a hold, so they move up a revision and back to draft. `g10.auction-auction.US2-TC15`, `g10.auction-auction.US2-TC16`, `g10.auction-auction.US11-TC4`, `g10.auction-auction.US11-TC5`, `g10.auction-auction.US12-TC1` and `g10.auction-auction.US12-TC2` lose the hold switch pre-condition only, a draft restyle with `<v>` kept
- **Deprecated** - every `grade10-site-auction-auction-US3` case, with its journey; `g10.auction-auction.US11-TC1`, `g10.auction-auction.US11-TC2`, `g10.auction-auction.US11-TC3` and `g10.auction-auction.US11-TC11`, which read a payment confirming around the close
- **Raised, answered** - Q15: a first bid whose answer is lost still bookmarks the lot, with no alerts toast. Q16: re-standing a lot after an erasure writes no letter to its new leader. Both as grade10 runs, recommended; answers in `## Settled`
- **Settled by the artifacts** - a refused attempt on a lot later sold leaves that collector reading as a non-bidder (Q6); an erasure never moves the close (the erasure requirement's rule 6); the refusal log names the floor or the ceiling the refusal names (the refusal requirement)
- **Out of suite** - `grade10-site-auction-auction-SC-92` and the invalid-amount row, which the bid form checks before sending, and the refusal order of `grade10-site-auction-auction-SC-91`: grade10's `bidRefusalCopy.test.ts` and `usePlaceBid.test.tsx`, since a person cannot make the auction send its own words or several refusals at once. `grade10-site-auction-auction-SC-93`: the operational log has no customer surface; grade10's refusal-log test, task 2.1. `grade10-site-auction-auction-SC-102`: grade10's `eraseBidder.spec.ts`, since the re-stood lot must then reach its close
- **Reworded** - `grade10-site-auction-auction-SC-04` and `grade10-site-auction-auction-SC-08` lose the card authorization from what they assert, "no accepted bid or card authorization" reading "no bid" and "card authorization facts" reading "card facts", with the same meaning; their coverage is as on main
- **Retired** - grade10-site-auction-auction-SC-67, grade10-site-auction-auction-SC-68 and grade10-site-auction-auction-SC-69, a payment confirming around the close, leave "A bid counts when it is accepted" (Q3); grade10-site-auction-auction-SC-09, grade10-site-auction-auction-SC-11, grade10-site-auction-auction-SC-12, grade10-site-auction-auction-SC-14 and grade10-site-auction-auction-SC-15 retire with their removed requirements. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none. The window and settle scenarios changed only in their hold wording and their Serves lines, and the durable `grade10-site-auction-auction-US2` and `grade10-site-auction-auction-US11` cases still assert them; `grade10-site-auction-auction-SC-73` stays out of suite as main records

**Run:** QA1 read only `/private/tmp/issue-1008-01a11f70-1791528937777/qa1-input`: frozen outline and journey, proposal, decisions, UI states, linked PRDs, configuration, continuity cases and the auction domain suite. Requirements, scenario markers and coverage, technical design, tasks, reconciliation and archives were excluded. QA2 reconciled that blind output with independent Dev output and durable continuity markers at checkpoint `7e827ba031b8083adb5d16105a7bae40e689d3e2`, against fetched main `68548f870`.

| Case or scenario | Disposition |
| --- | --- |
| US14-TC1-2 | **Folded in** - removes the impossible oversized UI row; retains below-minimum, suspended, banned and closed-listing messages and no-record checks. SC-89 and ordinary SC-91 refusal branches remain covered |
| US14-TC4-1 | **Folded in** - SC-103 and the silent SC-91 branch. Tests with/without ceiling and server-message fields, no generic copy or toast, unchanged draft and exactly one request |
| SC-90 | **Out of suite** - unchanged Outbid-row refusal is walked by `grade10-site-auction-account-record-US2-TC6-1` and `grade10-site-auction-bidding-history-US1-TC7-1` |
| SC-91, remaining refusal rows | **Out of suite** - existing card-refusal cases `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1`; identity refusal `g10.auction-auction.US4-TC2`; lowering refusal `g10.auction-dmn.US4-TC3`. Invalid local input and refusal ordering remain mapper/usePlaceBid tests |
| SC-92 | **Out of suite** - grade10's `bidRefusalCopy.test.ts` and ListingView regressions in tasks 2.1 and 2.3 retain generic ordinary unknown-code handling and prevent rendering server words. Revision 2 excludes AMOUNT_TOO_HIGH, including a response with a server message, as Q3 settles. TC4 fully asserts that silent exception through SC-103. This clarification changes no frozen anchor or ordinary refusal outcome |
| SC-93 | **Out of suite** - unchanged backend refusal-log tests verify the operator-only entry; no customer surface exposes it |
| US14-TC2-1 and US14-TC3-1 | **Retained** - rival refusal and lost-answer behavior are unchanged; they remain durable and are retained by the fold without copying them into the active suite |

- **Settled presentation** - Q3 rejects a response-driven reset or retry. Field correction is separate; the defensive answer ends pending status silently and leaves the reviewed draft unchanged. It neither accepts a bid nor alters backend validation or logs.
- **Continuity** - Unchanged cases remain in the durable suite with their issued IDs, revisions, covers, classifications and behavior; the acceptance fold retains them without copying them into this narrow active suite. TC1 is draft at revision 2; new TC4 is draft at revision 1. No broader case is dropped or reclassified.
- **Domain** - `g10.auction-dmn.US3-TC2` keeps its below-minimum message and no-record assertions. No domain suite changes are needed.
- **Tasks** - Tasks 2.1 to 2.3 verify adapter, mapper and view behavior; task 4.2 walks defensive and ordinary refusals. Tasks 4.3 and 4.4 record execution evidence after implementation. Planning does not classify draft cases as automated or passed.
- **Questions** - None. Frozen Q3/Q4 settle the defensive exception and preserve other refusal mappings.

**Run:** QA2 round 6, 2026-10-12, over the round-4 run below. Dev's round-6 reading raised `grade10-site-auction-auction-SC-106` to revision 2, added `grade10-site-auction-auction-SC-107` and `grade10-site-auction-auction-SC-108` under the Feature set group `Closing a lot the house leads`, and retired the two Bought in scenarios they replace. QA1's round-6 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, added one case here. QA2 read both, the delta specs, `decisions.md` through Q58, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Round 6, folded in** - `g10.auction-auction.US1-TC5` (new) by `grade10-site-auction-auction-SC-107` and the order half of `grade10-site-auction-auction-SC-106`: its House alone row opens the internal bidder's order at the starting price. `g10.auction-auction.US1-TC4` keeps `grade10-site-auction-auction-SC-106`'s collector read and its version
- **Round 6, anchors** - `grade10-site-auction-auction-SC-107` serves the Feature set group `Closing a lot the house leads`; its case traces `grade10-site-auction-auction-US-01`, the journey whose close it reads. Joined on the behaviour
- **Round 6, out of suite** - `grade10-site-auction-auction-SC-108` by the backend tests of task 4.1, a double settle opening one order, since a person cannot make the timer and a read settle at one moment; the admin reads of the internal order are `grade10-admin-auction-internal-bid-US6-TC1-2`'s and `grade10-admin-auction-internal-bid-US6-TC3-2`'s
- **Round 6, settled** - the stale line that the house is never a lot's winner is rewritten under Q5, Q33 and Q51
- **Round 6, rejected** - none
- **Round 6, raised** - none
- **Round 6, contradicted** - none

**Run, round 4:** QA2 round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `g10.auction-auction.US1-TC3` by `grade10-site-auction-auction-SC-02` and `grade10-site-auction-auction-SC-109`; `g10.auction-auction.US1-TC4` by `grade10-site-auction-auction-SC-106` and `grade10-site-auction-auto-bidding-SC-39`, its At the scheduled close row by Q21; `g10.auction-auction.US12-TC3` by `grade10-site-auction-auto-bidding-SC-40` and `grade10-site-auction-auto-bidding-SC-41`, its Lower while leading row by the auto-bidding rule that an accepted lower does not move the close
- **Re-homed** - `grade10-site-auction-auction-SC-109` and `grade10-site-auction-auction-SC-106` now serve `grade10-site-auction-auction-US-01`, beside `grade10-site-auction-auction-SC-02`, so `g10.auction-auction.US11-TC12` and `g10.auction-auction.US11-TC13` traced a journey none of their scenarios serves. Their runs are unchanged as `g10.auction-auction.US1-TC3` and `g10.auction-auction.US1-TC4`, the next unused numbers under US1 (an archived change issued `TC1-2`); the US11 ids, issued in this change and never accepted, are kept `deprecated` with `covers=none`
- **Anchors** - `g10.auction-auction.US1-TC4` also covers `grade10-site-auction-auto-bidding-SC-39`, which serves `grade10-site-auction-auto-bidding-US-05`, and `g10.auction-auction.US12-TC3` covers auto-bidding scenarios serving that capability's journeys; joined on the behaviour
- **Covered at domain** - `grade10-site-auction-auction-SC-109` is also walked by `g10.auction-dmn.US13-TC1`; `grade10-site-auction-auction-SC-02` by `g10.auction-dmn.US13-TC2`
- **Out of suite** - the round-4 Bought in scenarios were retired in round 6; `grade10-site-auction-auction-SC-01` and `grade10-site-auction-auction-SC-03` are unchanged and stay with the durable suite
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none

**Cases** - `TC-zsd@3`, `TC-5gi@3`, and `TC-49i@2` remain drafts. `TC-49i` adds the $14,999.00 below-bar row within its existing case. No case identity changed.

| Scenario | Case and disposition |
| --- | --- |
| SC-d78 | `TC-zsd` covers the verified bid at the threshold. |
| SC-uhh, SC-l64 | `TC-5gi` covers the held unverified bid at or above the threshold, its form guidance, and the absence of a recorded bid. |
| SC-ndj, SC-99a | `TC-49i` covers the below-threshold route without verification checks or standing reads. |

All five scenarios on `grade10-site-auction-auction-US-04` are covered. The identity-store-absent bar requirement remains an unchanged gap. It has no scenario in this change and no durable case. The existing launch check verifies the USD 15,000 bar configuration value.
