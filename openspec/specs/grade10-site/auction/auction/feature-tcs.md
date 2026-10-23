# grade10-site/auction/auction Test Cases

**Status:** reopened · 3/37
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** `grade10-site-auction-watchlist-SC-04` — signed-out watch from catalogue cards

## Walk 2: Collector places a bid inside the window

**Starting state:**

**Steps 1–2 setup:**

- customer(no bid on `<listing_43>`, card saved) is signed in and on `<listing_43>`.
- `<listing_43>` is in extended bidding.

**Steps 3–4 setup:**

- `<listing_44>` entered extended bidding and its recorded close has passed.

**Steps 5–8 setup:**

- `<listing_45>` is open inside its window, in `<currency>`, starting price `<start>`, with no accepted bid.
- customer(card linked, no bid on `<listing_45>`) is signed in and on `<listing_45>`.

**Steps 9–11 setup:**

- `<listing_46>` is open inside its window, in `<currency>`, starting price `<start>`, with no accepted bid.
- customer(card linked, no bid on `<listing_46>`) is signed in.

**Steps 12–14 setup:**

- `<listing_47>` is open inside its window, current bid `<current bid>`.
- customer A(card linked) and customer B(card linked) are signed in on separate sessions, neither holding a bid on `<listing_47>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_43 | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_44 | A listing whose extended bidding timer ran out with no new bid |

**Steps 5–8 data:**

| `<currency>` | `<start>` | `<opening price>` | `<next minimum>` | Fixture notes |
| --- | --- | --- | --- | --- |
| HKD | HKD280 | HKD280 | HKD290 | `<start>`: (range: 1000–79999 minor units), positive start; `<opening price>`: (range: 1000–79999 minor units), the start itself; `<next minimum>`: (range: 1000–79999 minor units) |
| HKD | HKD7 | HKD7 | HKD17 | `<start>`: (fixed boundary or equality), below the lowest increment; `<opening price>`: (fixed boundary or equality), the start itself; `<next minimum>`: (range: 1000–79999 minor units) |
| HKD | HKD0 | HKD10 | HKD20 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |
| USD | USD0 | USD1 | USD2 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |
| JPY | JPY0 | JPY100 | JPY200 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |

| Field | Value |
| --- | --- |
| listing_45 | The auction listing prepared with the state and timing in this case’s Pre-conditions and data row; bind its identity only |

**Steps 9–11 data:**

| `<currency>` | `<start>` | `<opening price>` | `<bid amount>` | Fixture notes |
| --- | --- | --- | --- | --- |
| HKD | HKD280 | HKD280 | HKD279.99 | `<start>`: (range: 1000–79999 minor units); `<opening price>`: (range: 1000–79999 minor units), the start itself; `<bid amount>`: (fixed boundary or equality), one minor unit below |
| USD | USD500 | USD500 | USD499.99 | `<start>`: (fixed tier boundary); `<opening price>`: (fixed tier boundary), the start itself; `<bid amount>`: (fixed boundary or equality), one minor unit below |
| JPY | JPY23,500 | JPY23,500 | JPY23,499 | `<start>`: (range: 15000–74999 minor units); `<opening price>`: (range: 15000–74999 minor units), the start itself; `<bid amount>`: (fixed boundary or equality), one minor unit below |
| HKD | HKD0 | HKD10 | HKD9.99 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<bid amount>`: (fixed boundary or equality), one minor unit below |
| USD | USD0 | USD1 | USD0.99 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<bid amount>`: (fixed boundary or equality), one minor unit below |
| JPY | JPY0 | JPY100 | JPY99 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<bid amount>`: (fixed boundary or equality), one minor unit below |

| Field | Value |
| --- | --- |
| listing_46 | The auction listing prepared with the state and timing in this case’s Pre-conditions and data row; bind its identity only |

**Steps 12–14 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_47 | An open HKD listing taking bids, led by customer C at `<current bid>` with maximum `<current bid>` | · |
| current bid | HKD4,960 | (range: 400000–799999 minor units) |
| increment | HKD80 | (fixed tier increment), the HK$4,000 tier |
| bid A | HKD5,210 | (range: 400000–799999 minor units) |
| bid B | HKD6,200 | (range: 400000–799999 minor units), above `<bid A>` |

### Route

1. Submit a bid at the minimum next bid.
2. Read Time left.
   - The bid is accepted. `g10.auction-auction.US2-TC8`
   - The close moves to `<extension duration>` after that bid. `g10.auction-auction.US2-TC8`
3. Submit a bid at the minimum next bid.
4. Read the listing's bids and recorded close.
5. Enter `<opening price>` in the custom maximum on the bid panel.
6. Place the bid.
7. Read Highest bid, the bid count and Recent Bids.
8. Read the minimum next bid.
   - The bid is accepted. `g10.auction-auction.US2-TC15`
   - Highest bid reads `<opening price>`, never 0. `g10.auction-auction.US2-TC15`
   - The bid count reads 1, and Recent Bids shows the bid as You. `g10.auction-auction.US2-TC15`
   - Step 8 reads `<next minimum>`, `<opening price>` plus its tier increment. `g10.auction-auction.US2-TC15`
9. Submit a bid of `<bid amount>` on `<listing_46>`.
10. Read the API response.
11. Read `<listing_46>`'s bids and bid count.
12. Submit `<bid A>` as customer A and `<bid B>` as customer B on `<listing_47>` at the same moment.
13. Read both API responses.
14. Read `<listing_47>` from the public listing API.

## Walk 3: Collector meets the identity bar on a high-value bid

**Starting state:**

**Steps 1–3 setup:**

- The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_12>`.
- `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Steps 4–8 setup:**

- The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, holds no bid on `<listing_12>`, and is on `<listing_12>`.
- `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Steps 9–11 setup:**

- The user is signed in with `<card>` saved on an account whose standing is `<account_standing>`, and is on `<listing_13>`.
- `<listing_13>` is live, inside its window, in USD, and its minimum next bid is at or below `<bid_amount>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| a verified account | An account whose standing is `verified` on the day of the bid | · |
| card | Visa ending 4242 | · |
| bar | USD15,000 | (fixed configured value), the bar Grade10 sets on a bid |
| listing_12 | A live USD listing whose minimum next bid is `<bar>` | · |
| bid at the bar | USD15,000 | (fixed boundary or equality), equal to `<bar>` |

**Steps 4–8 data:**

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

| Field | Value |
| --- | --- |
| grade10 bids url | The signed-in account bidding-history URL in the test environment; bind its URL only |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps 9–11 data:**

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

### Route

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.
   - The bid is forwarded and accepted as any other - no refusal names a verified identity. `g10.auction-auction.US4-TC1`
   - Highest bid reads `<bid at the bar>`, and the bid count rises by one. `g10.auction-auction.US4-TC1`
   - Step 3 shows nothing held or charged on `<card>`. `g10.auction-auction.US4-TC1`
4. Enter `<bid_amount>` in the bid field and select **Place Bid**.
5. Read the refusal on the bid form.
6. Reload `<listing_12>` and read Highest bid and the bid count.
7. Navigate to `<my auctions url>` and look for `<listing_12>`.
   - Step 7 shows no row for `<listing_12>`. `g10.auction-auction.US4-TC2`
8. Navigate to `<grade10 bids url>` and look for `<listing_12>`.
   - The bid is refused as needing a verified identity, and the form says: Bids this high need a verified identity. Verify from your account, then bid again. `g10.auction-auction.US4-TC2`
   - Highest bid and the bid count are unchanged; the auction records no bid. `g10.auction-auction.US4-TC2`
   - Step 8 shows no entry for `<listing_12>`. `g10.auction-auction.US4-TC2`
9. Enter `<bid_amount>` in the bid field and select **Place Bid**.
10. Read Highest bid.
11. Read the calls the run made to the identity store.
   - The bid is forwarded and accepted, and Highest bid reads `<bid_amount>`. `g10.auction-auction.US4-TC3`
   - No standing was read. `g10.auction-auction.US4-TC3`

## Walk 4: Collector reads the catalogue in one order

**Starting state:**

**Steps 1–2 setup:**

- The catalogue lists `<listing_48>`, `<listing_49>` and `<listing_50>`.

**Steps 3–4 setup:**

- The catalogue lists the six listings in **Test data**.

**Steps 5–6 setup:**

- `<listing_57>` and `<listing_58>` are both Active and close at the same time.

**Steps 7–8 setup:**

- customer is on `<grade10 auction catalogue url>`.
- At least one complete Featured slot is set for `<featured_listing>`.
- `<featured_listing>` is among the listings a collector can see.

**Steps 9–10 setup:**

- The Auction catalogue holds more listings than one page lists.

**Steps 11–12 setup:**

- customer is able to open `<grade10 auction catalogue url>`.
- No complete Featured slot is set.
- At least one listing is visible in All auctions.

**Steps 13–13 setup:**

- customer is on `<grade10 auction catalogue url>`.
- Featured may be present or absent.

**Steps 14–15 setup:**

- customer is able to open `<grade10 auction catalogue url>`.
- At least one complete Featured slot is set.
- No listings are available for All auctions.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_48 | An Active listing whose close is 18:00 UTC |
| listing_49 | An Upcoming listing whose start is 19:00 UTC |
| listing_50 | An Ended listing that closed at 12:00 UTC, before `<listing_48>` closes |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_51 | An Active listing closing at 18:00 UTC |
| listing_52 | An Active listing closing at 19:00 UTC |
| listing_53 | An Upcoming listing starting on 2026-10-01 |
| listing_54 | An Upcoming listing starting on 2026-10-02 |
| listing_55 | An Ended listing that closed on 2026-09-22 |
| listing_56 | An Ended listing that closed on 2026-09-15 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| listing_57 | An Active listing closing at 18:00 UTC |
| listing_58 | An Active listing closing at 18:00 UTC, a different listing record from `<listing_57>` |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| featured_listing | A published listing that fills a complete Featured slot |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 11–12 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 13–13 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the listings in listed order.
   - `<listing_48>` is listed before `<listing_49>`. `g10.auction-auction.US5-TC1`
   - `<listing_49>` is listed before `<listing_50>`. `g10.auction-auction.US5-TC1`
3. Navigate to `<grade10 auction catalogue url>`.
4. Read the listings in listed order.
   - `<listing_51>` is listed before `<listing_52>`. `g10.auction-auction.US5-TC2`
   - `<listing_53>` is listed before `<listing_54>`. `g10.auction-auction.US5-TC2`
   - `<listing_55>` is listed before `<listing_56>`. `g10.auction-auction.US5-TC2`
5. Read the API response for the Auction catalogue.
6. Read the API response for the Auction catalogue again.
7. Read the Featured band for `<featured_listing>`.
8. Read All auctions for `<featured_listing>` and the list order.
   - `<featured_listing>` appears in Featured and again in All auctions. `g10.auction-auction.US5-TC8`
   - All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible listing. `g10.auction-auction.US5-TC8`
9. Read the API response one page at a time to the end.
10. Read the API response for the whole catalogue.
11. Navigate to `<grade10 auction catalogue url>`.
12. Read the page sections.
   - No Featured band is present. `g10.auction-auction.US5-TC5`
   - All auctions is shown with listings in the catalogue resting order. `g10.auction-auction.US5-TC5`
13. Read the catalogue page for category chrome.
   - There is no Categories heading, no category tiles, and no busy filter chrome. `g10.auction-auction.US5-TC6`
   - The only sections are Featured when set, then All auctions. `g10.auction-auction.US5-TC6`
14. Navigate to `<grade10 auction catalogue url>`.
15. Read the Featured band and the All auctions area.
   - Featured still shows the curated slide or slides. `g10.auction-auction.US5-TC7`
   - All auctions shows a message that there are no auctions. `g10.auction-auction.US5-TC7`

## Walk 5: Collector reads the catalogue in one order

**Starting state:**

**Steps 1–2 setup:**

- customer is on `<grade10 auction catalogue url>`.
- The Upcoming listing `<upcoming_listing>` is among All auctions.

**Steps 3–4 setup:**

- customer is able to open `<grade10 auction catalogue url>`.

**Steps 5–7 setup:**

- customer is on `<grade10 auction catalogue url>`.
- All auctions holds more listings than the first batch shows.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| upcoming_listing | A published Upcoming listing on All auctions |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Find `<upcoming_listing>` on All auctions.
2. Read its card for money and countdown.
   - The card shows no starting bid and no money amount. `g10.auction-auction.US5-TC11`
   - The card shows Opens in from the served open. `g10.auction-auction.US5-TC11`
3. Navigate to `<grade10 auction catalogue url>`.
4. Read the document canonical and share address.
5. Read the first batch of All auctions cards.
   - Listings from step 5 stay visible. `g10.auction-auction.US5-TC10`
6. Scroll near the end of the shown listings.
   - Step 6 shows Boneyard skeleton cards below the listings already shown, or the next batch lands without pagination controls. `g10.auction-auction.US5-TC10`
7. Wait for the next batch.
   - Step 7 shows additional listings below the first batch. `g10.auction-auction.US5-TC10`
   - The combined list stays in the catalogue resting order. `g10.auction-auction.US5-TC10`
   - No pagination controls appear. `g10.auction-auction.US5-TC10`

## Walk 6: Collector reads Featured on the catalogue

**Starting state:**

**Steps 1–2 setup:**

- customer is on `<grade10 auction catalogue url>`.
- Exactly one complete Featured slot is set for `<featured listing>` with `<front page image>`.

**Steps 3–5 setup:**

- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.
- The served current bid for `<featured listing>` is `<bid before>`.

**Steps 6–7 setup:**

- customer is on `<grade10 auction catalogue url>`.
- One complete Featured slot is set for a listing in `<listing_status>`, with countdown target `<served_time>`.

**Steps 8–9 setup:**

- customer is able to open `<grade10 auction catalogue url>`.
- Three complete Featured slots are set in operator order `<listing A>`, `<listing B>`, `<listing C>`.

**Steps 10–11 setup:**

- customer is able to open `<grade10 auction catalogue url>`.
- The only Featured slot holds an eligible listing and no front page image, or a front page image and no listing.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| featured listing | A published Active listing bound to the only complete Featured slot |
| front page image | The front page image uploaded for that slot |
| featured listing title | The public title of `<featured listing>`; bind the title only |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 3–5 data:**

| Field | Value |
| --- | --- |
| featured listing | A published Active listing on a complete Featured slide |
| bid before | The current bid amount shown on the slide |
| bid after | A **higher** served current bid for the same listing after first paint |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 6–7 data:**

| `<listing_status>` | `<served_time>` | `<expected_countdown>` |
| --- | --- | --- |
| Active | `<served_close>` | Relative Ends in to the served close |
| Upcoming | `<served_open>` | Relative Opens in to the served open; UPCOMING with no live status dot; View Auction; no money |

| Field | Value |
| --- | --- |
| served_close | The effective close returned for the Active listing; bind its datetime only |
| served_open | The scheduled opening returned for the Upcoming listing; bind its datetime only |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 8–9 data:**

| Field | Value |
| --- | --- |
| listing A | Published Active or Upcoming listing in Featured slot 1 |
| listing B | Published Active or Upcoming listing in Featured slot 2 |
| listing C | Published Active or Upcoming listing in Featured slot 3 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the single slide.
   - Featured band is present with one slide. `g10.auction-auction.US6-TC1`
   - The slide shows `<front page image>` as banner and slab, the title `<featured listing title>`, LIVE BIDDING with a live status dot, relative Ends in, the current bid, and Bid Now. `g10.auction-auction.US6-TC1`
3. Read the current bid on the Featured slide after first paint.
   - Step 3 shows `<bid before>`. `g10.auction-auction.US6-TC2`
4. Let the served current bid for `<featured listing>` become `<bid after>`.
5. Read the current bid on the Featured slide.
   - Step 5 shows `<bid after>` with a rolling number as the amount increases. `g10.auction-auction.US6-TC2`
6. Navigate to `<grade10 auction catalogue url>`.
7. Read the countdown and status chrome on the Featured slide.
   - The countdown matches this expected display: `<expected_countdown>`. `g10.auction-auction.US6-TC3`
   - Upcoming shows UPCOMING with no live status dot and View Auction, and shows no starting bid or money amount. `g10.auction-auction.US6-TC3`
8. Navigate to `<grade10 auction catalogue url>`.
9. Read the Featured slides from first to last.
   - Featured shows three slides in order `<listing A>`, then `<listing B>`, then `<listing C>`. `g10.auction-auction.US6-TC4`
10. Navigate to `<grade10 auction catalogue url>`.
11. Read whether a Featured band is present.
   - No Featured band is shown. `g10.auction-auction.US6-TC5`
   - All auctions is the catalogue content below the page chrome. `g10.auction-auction.US6-TC5`

## Walk 7: Collector advances Featured slides

**Starting state:**

**Steps 1–3 setup:**

- customer is on `<grade10 auction catalogue url>`.
- Two complete Featured slots are set for `<listing A>` then `<listing B>`.

**Steps 4–6 setup:**

- customer is on `<grade10 auction catalogue url>` at a small viewport (below `md`).
- Two complete Featured slots are set for `<listing A>` then `<listing B>`.

**Steps 7–9 setup:**

- customer is on `<grade10 auction catalogue url>`.
- Three complete Featured slots are set for `<listing A>`, `<listing B>`, `<listing C>` in that order.

**Steps 10–11 setup:**

- customer is on `<grade10 auction catalogue url>`.
- Exactly one complete Featured slot is set.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 4–6 data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 7–9 data:**

| Field | Value |
| --- | --- |
| listing A | Published listing in Featured slot 1 |
| listing B | Published listing in Featured slot 2 |
| listing C | Published listing in Featured slot 3 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Read the visible Featured listing.
   - Step 1 shows `<listing A>`. `g10.auction-auction.US7-TC1`
2. Activate the progress control to advance to the next slide.
3. Read the visible Featured listing.
   - Step 3 shows `<listing B>`. `g10.auction-auction.US7-TC1`
   - Progress dots are present for the two slides. `g10.auction-auction.US7-TC1`
4. Read the visible Featured listing.
   - Step 4 shows `<listing A>`. `g10.auction-auction.US7-TC4`
5. Activate stage next on the Featured image.
6. Read the visible Featured listing.
   - Step 6 shows `<listing B>`. `g10.auction-auction.US7-TC4`
   - The stage image pages horizontally to `<listing B>`. `g10.auction-auction.US7-TC4`
   - Progress dots mark `<listing B>` current. `g10.auction-auction.US7-TC4`
7. Read the visible Featured listing.
8. Advance with the progress control until each remaining slide has been shown.
9. Read each visible Featured listing after each advance.
   - The visible listings are `<listing A>`, then `<listing B>`, then `<listing C>` without leaving the Featured band. `g10.auction-auction.US7-TC2`
10. Navigate to `<grade10 auction catalogue url>`.
11. Read the Featured progress control.
   - The single slide is shown. `g10.auction-auction.US7-TC3`
   - There is no multi-dot advance among slides. `g10.auction-auction.US7-TC3`
   - Stage previous/next is not required. `g10.auction-auction.US7-TC3`

## Walk 8: Collector opens a Featured listing

**Starting state:**

**Steps 1–2 setup:**

- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured listing>` visible.

**Steps 3–4 setup:**

- customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<upcoming listing>` visible.

**Steps 5–6 setup:**

- customer is on `<grade10 auction catalogue url>` with two complete Featured slides for `<listing A>` then `<listing B>`.
- The progress control has advanced so `<listing B>` is visible.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| featured listing | A published **Active** listing on the visible Featured slide |
| listing page url | That listing's details page address |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| upcoming listing | A published Upcoming listing on the visible Featured slide |
| listing page url | That listing's details page address |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| listing A | Published **Active** listing in Featured slot 1 |
| listing B | Published **Active** listing in Featured slot 2 |
| listing B page url | `<listing B>`'s details page address |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Activate Bid Now on the Featured slide.
2. Read the page that opens.
   - The browser opens `<listing page url>` — the details page for `<featured listing>`. `g10.auction-auction.US8-TC1`
3. Activate View Auction on the Featured slide.
4. Read the page that opens.
   - The browser opens `<listing page url>` — the details page for `<upcoming listing>`. `g10.auction-auction.US8-TC3`
5. Activate Bid Now on the visible Featured slide.
6. Read the page that opens.
   - The browser opens `<listing B page url>` — the details page for `<listing B>`, not `<listing A>`. `g10.auction-auction.US8-TC2`

## Walk 9: Collector watches from an All auctions card

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, not watching `<open listing>`) is on `<grade10 auction catalogue url>`.
- `<open listing>` appears on an All auctions card and is not closed.

**Steps 4–6 setup:**

- customer(signed in, watching `<open listing>`) is on `<grade10 auction catalogue url>`.
- `<open listing>` appears on an All auctions card and is not closed.

**Steps 7–8 setup:**

- customer(signed in) is on `<grade10 auction catalogue url>`.
- `<closed listing>` appears on an All auctions card.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| open listing | A published Active or Upcoming listing on an All auctions card |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 4–6 data:**

| Field | Value |
| --- | --- |
| open listing | A published Active or Upcoming listing the collector already watches |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| closed listing | A closed listing visible in All auctions |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

### Route

1. Activate watch on the All auctions card for `<open listing>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open listing>` is watched.
   - The card shows the watched state. `g10.auction-auction.US9-TC1`
   - `<open listing>` is watched the same way as from the listing page and My Auctions. `g10.auction-auction.US9-TC1`
4. Activate watch off on the All auctions card for `<open listing>`.
5. Read the card's watch state.
6. Open My Auctions and read whether `<open listing>` remains watched.
   - The card shows the unwatched state. `g10.auction-auction.US9-TC2`
   - `<open listing>` is no longer watched, same as unwatching from the listing page or My Auctions. `g10.auction-auction.US9-TC2`
7. Find the All auctions card for `<closed listing>`.
8. Read whether a watch control is present on that card.
   - The closed listing card shows no watch control. `g10.auction-auction.US9-TC3`

## Walk 11: Bidder keeps a listing open only by moving its price

**Starting state:**

**Steps 1–2 setup:**

- `<listing_66>` is in extended bidding with its recorded close `<time left before bid>` away.
- customer A leads `<listing_66>` at `<leader price>` with maximum `<customer A maximum>`.
- customer B(card linked) is signed in on a separate session, on the listing page for `<listing_66>`.

**Steps 3–6 setup:**

- `<listing_67>` is in extended bidding, its recorded close `<close before raise>`.
- customer A leads `<listing_67>` at `<leader price>` with maximum `<customer A maximum>`, and is on its listing page.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_66 | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |
| time left before bid | 5 minutes | · |
| leader price | HKD1,260 | (range: 80000–399999 minor units) |
| customer A maximum | HKD2,360 | (range: 80000–399999 minor units) |
| customer B maximum | HKD2,360 | (fixed boundary or equality), equal to `<customer A maximum>` |

**Steps 3–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_67 | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap | · |
| close before raise | 3 minutes after the raise | · |
| leader price | HKD5,460 | (range: 400000–799999 minor units) |
| customer A maximum | HKD8,400 | (range: 800000–3999999 minor units) |
| raised maximum | HKD9,600 | (range: 800000–3999999 minor units) |

### Route

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.
   - Highest bid reads `<customer B maximum>`. `g10.auction-auction.US12-TC1`
   - customer A still leads, as the earlier maximum. `g10.auction-auction.US12-TC1`
   - Time left reads `<extension duration>` from customer B's bid. `g10.auction-auction.US12-TC1`
3. Select **Raise**, enter `<raised maximum>` and confirm.
4. Read Your maximum, Highest bid and Time left.
5. Wait until `<close before raise>` with no further bid.
6. Read the listing's result.
   - Your maximum reads `<raised maximum>`. `g10.auction-auction.US12-TC2`
   - Highest bid stays `<leader price>`. `g10.auction-auction.US12-TC2`
   - The recorded close stays `<close before raise>`, and Time left keeps counting to it. `g10.auction-auction.US12-TC2`
   - The listing closes at `<close before raise>`, customer A winning at `<leader price>`. `g10.auction-auction.US12-TC2`

## Walk 13: Bidder reads why a bid was refused, and nothing else moves

**Starting state:**

**Steps 1–6 setup:**

- customer(card linked, account in `<account_state>`) is signed in and on the listing page for `<listing_29>`.
- customer holds no bid on `<listing_29>` and does not watch it.
- `<listing_29>` is in `<listing_state>`.

**Steps 7–10 setup:**

- customer A leads `<listing_68>` at `<current bid>`, and is signed in on the listing page.
- customer B(card linked, no bid on `<listing_68>`) is signed in on a separate session, on the same listing page.

**Steps 11–16 setup:**

- customer(card linked) is signed in and on the listing page for `<listing_69>`, with this standing: `<standing_before>`.
- The network is manipulated to drop `<dropped_stage>`.

**Steps 17–22 setup:**

- customer(card linked, account in good standing) is signed in on `<listing_70>`.
- customer holds no bid on `<listing_70>` and does not watch it.
- The next bid answer is mocked as `AMOUNT_TOO_HIGH`, with ceiling field `<ceiling_field>` and server-message field `<server_message_field>`.
- The custom maximum draft equals `<valid draft>`.

**Shared test data:**

**Steps 1–6 data:**

| Refused when | `<account_state>` | `<listing_state>` | `<amount_entered>` | `<refusal_message>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| Below the next minimum | In good standing | Open, minimum next bid moved to `<next minimum>` after the page showed HKD5,280, the page's live updates held back | HKD5,280 | Minimum bid is, naming `<next minimum>` | `<amount_entered>`: (fixed derived value), one major unit below `<next minimum>` |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. | · |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. | · |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. | · |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_29 | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` | · |
| current bid | HKD5,210 | (range: 400000–799999 minor units) |
| next minimum | HKD5,290 | (fixed derived value), `<current bid>` plus its 8000 increment |
| bid count | 3 | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The signed-in account bidding-history URL in the test environment; bind its URL only |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps 7–10 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_68 | An open HKD listing led by customer A, maximum HKD8,400 (range: 800000–3999999 minor units) | · |
| current bid | HKD5,210 | (range: 400000–799999 minor units) |
| below minimum | HKD5,280 | (fixed derived value), one major unit below `<current bid>` plus its 8000 increment |

| Field | Value |
| --- | --- |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps 11–16 data:**

| `<standing_before>` | `<bid_amount>` | `<dropped_stage>` | `<expected_bid_form>` | `<standing_after>` |
| --- | --- | --- | --- | --- |
| No bid | `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| No bid | `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_69 | An open HKD listing with no other bidder, starting price HKD280 (range: 1000–79999 minor units) | · |
| maximum | HKD560 | (range: 1000–79999 minor units) |
| raised maximum | HKD920 | (range: 80000–399999 minor units) |

| Field | Value |
| --- | --- |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps 17–22 data:**

| `<ceiling_field>` | `<server_message_field>` |
| --- | --- |
| `<ceiling>` | QA_SERVER_MESSAGE_MARKER |
| Absent | QA_SERVER_MESSAGE_MARKER |
| `<ceiling>` | Absent |
| Absent | Absent |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_70 | An open HKD listing led by customer B, current bid HKD5,210 (range: 400000–799999 minor units) and bid count 3 | · |
| valid draft | 5130 whole major units, the listing's next minimum | · |
| ceiling | HKD80,000,000 | (fixed configured value) |

### Route

1. Enter `<amount_entered>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
   - Step 3 shows `<refusal_message>` on the bid form. `g10.auction-auction.US14-TC1`
4. Reload the listing page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
   - Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer. `g10.auction-auction.US14-TC1`
   - Step 4 shows no Leading or Outbid standing for the customer. `g10.auction-auction.US14-TC1`
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
   - Step 5 shows no row for `<listing_29>`. `g10.auction-auction.US14-TC1`
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.
   - Step 6 shows no entry for `<listing_29>`. `g10.auction-auction.US14-TC1`
7. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
   - Step 7 is refused on customer B's bid form. `g10.auction-auction.US14-TC2`
8. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
   - Step 8 reads Highest bid `<current bid>`, Recent Bids unchanged, and customer A still Leading. `g10.auction-auction.US14-TC2`
9. As customer A, navigate to `<my auctions url>` and read `<listing_68>`'s row.
   - Step 9's row reads Leading, with Current bid `<current bid>`. `g10.auction-auction.US14-TC2`
10. As customer A, read their mailbox for a letter about `<listing_68>` sent after step 1.
   - Step 10 finds no new-bid or outbid letter. `g10.auction-auction.US14-TC2`
11. Enter `<bid_amount>` in the custom maximum on the bid panel.
12. Place the bid.
13. Wait until the bid form settles.
14. Read the bid form.
   - Step 14 reads `<expected_bid_form>` on the bid form, never both placed and refused. `g10.auction-auction.US14-TC3`
15. Reload the listing page and read the bid panel's standing.
   - Step 15 reads `<standing_after>`. `g10.auction-auction.US14-TC3`
16. Navigate to `<my auctions url>` and look for `<listing_69>`.
   - Step 16 agrees with `<standing_after>`. `g10.auction-auction.US14-TC3`
17. Place the bid.
18. Wait for the mocked refusal answer.
19. Read the bid form and custom maximum field.
   - Step 19: no maximum-bid or generic refusal message appears. `g10.auction-auction.US14-TC4`
   - Step 19: no server message or toast appears. `g10.auction-auction.US14-TC4`
   - Step 19: pending bid status ends and the action is usable. `g10.auction-auction.US14-TC4`
   - Step 19: the displayed draft remains `<valid draft>`. `g10.auction-auction.US14-TC4`
20. Read the number of bid attempts sent.
   - Step 20: exactly one attempt is sent, without automatic retry. `g10.auction-auction.US14-TC4`
21. Reload the listing and read its public bids and standing.
   - Step 21: the price, leader, bid count and public bids remain unchanged. `g10.auction-auction.US14-TC4`
   - Step 21: customer has no Leading or Outbid standing. `g10.auction-auction.US14-TC4`
22. Read My Auctions and Bidding History for `<listing_70>`.
   - Step 22: neither surface records the refused attempt. `g10.auction-auction.US14-TC4`

## Walk 14: Collector reads a house-led close and its order

**Starting state:**

**Steps 1–4 setup:**

- `<listing_1>` is led by `<leader>` at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
- The leader has this bidding setup: `<leader_setup>`.
- customer C has never bid on `<listing_1>` and is on its listing page.

**Steps 5–7 setup:**

- `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at `<commit_time>`.
- `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
- customer C is on the listing page for `<listing_2>`.

**Steps 8–12 setup:**

- `<listing_4>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, and the house leads with this bidding setup: `<bidding_at_close>`, its recorded close a few minutes away, no further bid coming.
- customer A(card linked) bid on `<listing_4>` as described by `<bidding_at_close>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A published HKD listing in extended bidding | · |
| customer A maximum | 500000 minor units | (HK$5,000.00) |
| final price | 508000 minor units | `<customer A maximum>` plus its 8000 increment |

| `<leader>` | `<leader_setup>` |
| --- | --- |
| the house | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| customer B | customer B, with maximum 600000 minor units and no internal bid on the listing |

| Field | Value |
| --- | --- |
| grade10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps 5–7 data:**

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

**Steps 8–12 data:**

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

### Route

1. Wait through the recorded close without reloading.
2. As customer C, read the listing's state, Highest bid and Recent bids.
   - Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym. `g10.auction-auction.US1-TC3`
3. Read the API response for `<listing_1>`'s public facts.
   - Step 3 reads the listing closed with a winner at `<final price>`, the winner by pseudonym only. `g10.auction-auction.US1-TC3`
4. Open `<grade10 auction url>` and read `<listing_1>`'s card.
   - Step 4's card reads Ended, as any sold listing's card does. `g10.auction-auction.US1-TC3`
   - The House row and the Collector row read alike in every step, save the pseudonym. `g10.auction-auction.US1-TC3`
5. Wait until the scheduled close passes and read Time left.
   - Step 5 reads extended bidding, the close `<extension duration>` after the scheduled close. `g10.auction-auction.US1-TC4`
6. Wait until the extended close passes.
7. Read the listing's state, Highest bid and Recent bids.
   - Step 7 reads sold at `<starting price>`, one bid, under the house's listing pseudonym. `g10.auction-auction.US1-TC4`
8. Wait until `<listing_4>`'s recorded close passes.
9. Read the orders the API holds for `<listing_4>`.
10. Read the order's invoice and payments.
11. In the House over a collector row, read customer A's card charges since the close.
12. Read the API response for `<listing_4>`'s public facts.

## Walk 15: Additional fixture checks

**Starting state:**

**Steps 1–2 setup:**

- `<listing_3>` is in extended bidding with its recorded close `<time left before change>` away.
- `<listing_3>`'s internal bid of `<house maximum>` is committed, and the bidding has this setup: `<bidding_setup>`.
- admin(holds auction:reserve) is on `<listing_3>`'s editor in the admin.
- customer C is on the listing page for `<listing_3>`.

**Shared test data:**

**Steps 1–2 data:**

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

### Route

1. As the admin, make this house change: `<house_change>` and click Save.
   - Step 1 is accepted. `g10.auction-auction.US12-TC3`
2. As customer C, read Highest bid, the leader and Time left.
   - Step 2 reads Highest bid `<highest_bid_after>` and Time left `<time_left_after>`. `g10.auction-auction.US12-TC3`

## g10.auction-auction.US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

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

| Field | Value |
| --- | --- |
| grade10 auction url | The auction base URL in the test environment; bind its URL only |

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

---

## g10.auction-auction.US2: Collector places a bid inside the window

**As a** bidder,
**I want** a listing I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the listing's cap.

<!-- trace:case id=g10.auction-auction.TC-q6k rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### g10.auction-auction.US2-TC8: Collector with no earlier bid bids during extended bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(no bid on `<listing_43>`, card saved) is signed in and on `<listing_43>`.
* `<listing_43>` is in extended bidding.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_43 | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted.
* The close moves to `<extension duration>` after that bid.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/opening-price.spec.ts`

**Pre-conditions:**

* `<listing_45>` is open inside its window, in `<currency>`, starting price `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_45>`) is signed in and on `<listing_45>`.

**Test data:**

| `<currency>` | `<start>` | `<opening price>` | `<next minimum>` | Fixture notes |
| --- | --- | --- | --- | --- |
| HKD | HKD280 | HKD280 | HKD290 | `<start>`: (range: 1000–79999 minor units), positive start; `<opening price>`: (range: 1000–79999 minor units), the start itself; `<next minimum>`: (range: 1000–79999 minor units) |
| HKD | HKD7 | HKD7 | HKD17 | `<start>`: (fixed boundary or equality), below the lowest increment; `<opening price>`: (fixed boundary or equality), the start itself; `<next minimum>`: (range: 1000–79999 minor units) |
| HKD | HKD0 | HKD10 | HKD20 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |
| USD | USD0 | USD1 | USD2 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |
| JPY | JPY0 | JPY100 | JPY200 | `<start>`: (fixed tier boundary), zero start; `<opening price>`: (fixed boundary or equality), the lowest increment; `<next minimum>`: (fixed boundary or equality) |

| Field | Value |
| --- | --- |
| listing_45 | The auction listing prepared with the state and timing in this case’s Pre-conditions and data row; bind its identity only |

**Steps:**

1. Enter `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.
4. Read the minimum next bid.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.
* Step 4 reads `<next minimum>`, `<opening price>` plus its tier increment.

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

| Field | Value |
| --- | --- |
| grade10 bids url | The signed-in account bidding-history URL in the test environment; bind its URL only |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

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
### g10.auction-auction.US5-TC1: Open listings lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists `<listing_48>`, `<listing_49>` and `<listing_50>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_48 | An Active listing whose close is 18:00 UTC |
| listing_49 | An Upcoming listing whose start is 19:00 UTC |
| listing_50 | An Ended listing that closed at 12:00 UTC, before `<listing_48>` closes |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the listings in listed order.

**Expected Results:**

* `<listing_48>` is listed before `<listing_49>`.
* `<listing_49>` is listed before `<listing_50>`.

<!-- trace:case id=g10.auction-auction.TC-yh1 rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC2: Each status has its own order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists the six listings in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| listing_51 | An Active listing closing at 18:00 UTC |
| listing_52 | An Active listing closing at 19:00 UTC |
| listing_53 | An Upcoming listing starting on 2026-10-01 |
| listing_54 | An Upcoming listing starting on 2026-10-02 |
| listing_55 | An Ended listing that closed on 2026-09-22 |
| listing_56 | An Ended listing that closed on 2026-09-15 |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the listings in listed order.

**Expected Results:**

* `<listing_51>` is listed before `<listing_52>`.
* `<listing_53>` is listed before `<listing_54>`.
* `<listing_55>` is listed before `<listing_56>`.

<!-- trace:case id=g10.auction-auction.TC-2gb rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC5: Empty Featured leaves All auctions only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* No complete Featured slot is set.
* At least one listing is visible in All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the page sections.

**Expected Results:**

* No Featured band is present.
* All auctions is shown with listings in the catalogue resting order.

<!-- trace:case id=g10.auction-auction.TC-izg rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC6: Catalogue shows no category chrome

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Featured may be present or absent.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set.
* No listings are available for All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the All auctions area.

**Expected Results:**

* Featured still shows the curated slide or slides.
* All auctions shows a message that there are no auctions.

<!-- trace:case id=g10.auction-auction.TC-yqf rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC8: Featured listings also appear in All auctions resting order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set for `<featured_listing>`.
* `<featured_listing>` is among the listings a collector can see.

**Test data:**

| Field | Value |
| --- | --- |
| featured_listing | A published listing that fills a complete Featured slot |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Read the Featured band for `<featured_listing>`.
2. Read All auctions for `<featured_listing>` and the list order.

**Expected Results:**

* `<featured_listing>` appears in Featured and again in All auctions.
* All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible listing.

<!-- trace:case id=g10.auction-auction.TC-90r rev=1 covers=g10.auction-auction.SC-5vk,g10.auction-auction.SC-c4r,g10.auction-auction.SC-icd,g10.auction-auction.SC-zvy,g10.auction-auction.SC-zv8,g10.auction-auction.SC-4je,g10.auction-auction.SC-7l1,g10.auction-auction.SC-tb4,g10.auction-auction.SC-iyy,g10.auction-auction.SC-cys,g10.auction-auction.SC-ned,g10.auction-auction.SC-fs8 -->
### g10.auction-auction.US5-TC10: More All auctions listings load on scroll

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* All auctions holds more listings than the first batch shows.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Read the first batch of All auctions cards.
2. Scroll near the end of the shown listings.
3. Wait for the next batch.

**Expected Results:**

* Step 2 shows Boneyard skeleton cards below the listings already shown, or the next batch lands without pagination controls.
* Step 3 shows additional listings below the first batch.
* Listings from step 1 stay visible.
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/catalogue-access.spec.ts`

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* The Upcoming listing `<upcoming_listing>` is among All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| upcoming_listing | A published Upcoming listing on All auctions |

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

**Steps:**

1. Find `<upcoming_listing>` on All auctions.
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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* The only Featured slot holds an eligible listing and no front page image, or a front page image and no listing.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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

| Field | Value |
| --- | --- |
| grade10 auction catalogue url | The public auction catalogue URL in the test environment; bind its URL only |

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
### g10.auction-auction.US12-TC1: Equal maximum at a higher price extends the listing

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
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_66>` is in extended bidding with its recorded close `<time left before bid>` away.
* customer A leads `<listing_66>` at `<leader price>` with maximum `<customer A maximum>`.
* customer B(card linked) is signed in on a separate session, on the listing page for `<listing_66>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_66 | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |
| time left before bid | 5 minutes | · |
| leader price | HKD1,260 | (range: 80000–399999 minor units) |
| customer A maximum | HKD2,360 | (range: 80000–399999 minor units) |
| customer B maximum | HKD2,360 | (fixed boundary or equality), equal to `<customer A maximum>` |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<customer B maximum>`.
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* `<listing_67>` is in extended bidding, its recorded close `<close before raise>`.
* customer A leads `<listing_67>` at `<leader price>` with maximum `<customer A maximum>`, and is on its listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_67 | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap | · |
| close before raise | 3 minutes after the raise | · |
| leader price | HKD5,460 | (range: 400000–799999 minor units) |
| customer A maximum | HKD8,400 | (range: 800000–3999999 minor units) |
| raised maximum | HKD9,600 | (range: 800000–3999999 minor units) |

**Steps:**

1. Select **Raise**, enter `<raised maximum>` and confirm.
2. Read Your maximum, Highest bid and Time left.
3. Wait until `<close before raise>` with no further bid.
4. Read the listing's result.

**Expected Results:**

* Your maximum reads `<raised maximum>`.
* Highest bid stays `<leader price>`.
* The recorded close stays `<close before raise>`, and Time left keeps counting to it.
* The listing closes at `<close before raise>`, customer A winning at `<leader price>`.

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

---

## g10.auction-auction.US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** above-ceiling attempts to show no maximum-bid message and other refusals to say why on the bid form, with no trace of a refused bid anywhere else,
**so that** an oversized entry does not interrupt my review and I never read a bid I did not place as one I did.

<!-- trace:case id=g10.auction-auction.TC-r0p rev=3 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### g10.auction-auction.US14-TC1: A refused bid says why on the bid form and places nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
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
| Below the next minimum | In good standing | Open, minimum next bid moved to `<next minimum>` after the page showed HKD5,280, the page's live updates held back | HKD5,280 | Minimum bid is, naming `<next minimum>` | `<amount_entered>`: (fixed derived value), one major unit below `<next minimum>` |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. | · |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. | · |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. | · |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_29 | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` | · |
| current bid | HKD5,210 | (range: 400000–799999 minor units) |
| next minimum | HKD5,290 | (fixed derived value), `<current bid>` plus its 8000 increment |
| bid count | 3 | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The signed-in account bidding-history URL in the test environment; bind its URL only |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_68>` at `<current bid>`, and is signed in on the listing page.
* customer B(card linked, no bid on `<listing_68>`) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_68 | An open HKD listing led by customer A, maximum HKD8,400 (range: 800000–3999999 minor units) | · |
| current bid | HKD5,210 | (range: 400000–799999 minor units) |
| below minimum | HKD5,280 | (fixed derived value), one major unit below `<current bid>` plus its 8000 increment |

| Field | Value |
| --- | --- |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps:**

1. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
2. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
3. As customer A, navigate to `<my auctions url>` and read `<listing_68>`'s row.
4. As customer A, read their mailbox for a letter about `<listing_68>` sent after step 1.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/auction-bids.spec.ts`

**Pre-conditions:**

* customer(card linked) is signed in and on the listing page for `<listing_69>`, with this standing: `<standing_before>`.
* The network is manipulated to drop `<dropped_stage>`.

**Test data:**

| `<standing_before>` | `<bid_amount>` | `<dropped_stage>` | `<expected_bid_form>` | `<standing_after>` |
| --- | --- | --- | --- | --- |
| No bid | `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| No bid | `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_69 | An open HKD listing with no other bidder, starting price HKD280 (range: 1000–79999 minor units) | · |
| maximum | HKD560 | (range: 1000–79999 minor units) |
| raised maximum | HKD920 | (range: 80000–399999 minor units) |

| Field | Value |
| --- | --- |
| my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps:**

1. Enter `<bid_amount>` in the custom maximum on the bid panel.
2. Place the bid.
3. Wait until the bid form settles.
4. Read the bid form.
5. Reload the listing page and read the bid panel's standing.
6. Navigate to `<my auctions url>` and look for `<listing_69>`.

**Expected Results:**

* Step 4 reads `<expected_bid_form>` on the bid form, never both placed and refused.
* Step 5 reads `<standing_after>`.
* Step 6 agrees with `<standing_after>`.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(card linked, account in good standing) is signed in on `<listing_70>`.
* customer holds no bid on `<listing_70>` and does not watch it.
* The next bid answer is mocked as `AMOUNT_TOO_HIGH`, with ceiling field `<ceiling_field>` and server-message field `<server_message_field>`.
* The custom maximum draft equals `<valid draft>`.

**Test data:**

| `<ceiling_field>` | `<server_message_field>` |
| --- | --- |
| `<ceiling>` | QA_SERVER_MESSAGE_MARKER |
| Absent | QA_SERVER_MESSAGE_MARKER |
| `<ceiling>` | Absent |
| Absent | Absent |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_70 | An open HKD listing led by customer B, current bid HKD5,210 (range: 400000–799999 minor units) and bid count 3 | · |
| valid draft | 5130 whole major units, the listing's next minimum | · |
| ceiling | HKD80,000,000 | (fixed configured value) |

**Steps:**

1. Place the bid.
2. Wait for the mocked refusal answer.
3. Read the bid form and custom maximum field.
4. Read the number of bid attempts sent.
5. Reload the listing and read its public bids and standing.
6. Read My Auctions and Bidding History for `<listing_70>`.

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
