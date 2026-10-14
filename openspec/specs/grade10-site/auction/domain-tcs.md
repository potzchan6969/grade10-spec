# g10.auction-dmn Test Cases

**Status:** reopened · 2/28
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-14, tcs-rules r5

## Walk 1: Execute every domain case independently — phase 1

**Starting state:**

- An admin holds the catalogue grant.
- The admin is on `<grade10 auction admin listings url>`.
- `<listing_1>` exists with an empty gallery.
- A user is on `<grade10 auction url>`.
- `<listing_2>` and `<listing_3>` are published in different categories.
- Each of them has an image as its first gallery item.
- `<listing_4>` is live and its current bid is `<current bid>`.
- The user's browser runs no client-side scripts.
- `<listing_2>` is published and the catalogue lists it.
- The catalogue publishes no lot under `<no lot address>`.
- The reader's browser runs no client-side scripts.
- A user is signed in with `<card>` saved and is on `<listing_5>`.
- `<listing_5>` is live, holds no bids, and its starting price is `<starting price>`.
- `<listing_5>` holds more than one gallery image.
- A user is signed in with `<card>` saved and is on `<listing_4>`.
- `<listing_4>` is live, its current bid is `<current bid>` and its increment is `<increment>`.
- The user holds no bid on `<listing_4>` and does not watch it.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_1>` | A draft auction listing with an empty gallery |
| `<product>` | charizard-front.jpg, JPEG, 3.6 MB |
| `<alt text>` | 1999 Charizard PSA 10, front, shadowless 1st edition |
| `<listing_2>` | A published listing in Pokémon, gallery of three images |
| `<listing_3>` | A published listing in another category, first gallery item an image |
| `<listing_4>` | A live listing with bids, in USD |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| Item | `<surface>`: The auction catalogue at `<grade10 auction url>`; `<identity>`: the catalogue's own title and description; `<status>`: 200 |
| Item | `<surface>`: `<listing_2>`'s own address; `<identity>`: `<listing_2>`'s title, description and canonical address, in `og:title`, `og:description` and `og:url`; `<status>`: 200 |
| Item | `<surface>`: `<no lot address>`; `<identity>`: the site's not-found surface; `<status>`: 404 |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in USD |
| `<starting price>` | USD1,200 (range: 100000–499999 minor units) |
| `<bid amount>` | USD1,200 (fixed boundary or equality), equal to `<starting price>` |
| `<listing_4>` | A live listing with bids from other users, in USD, bid count `<bid count>` |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<increment>` | USD25 (fixed tier increment), the USD1,000 tier |
| `<bid amount>` | USD4,984 (fixed derived value), one major unit below `<current bid>` plus `<increment>` |
| `<bid count>` | 2 |

### Route

1. Open the media manager for `<listing_1>`.
2. Select `<product>` for a gallery slot.
   - shows a preview of `<product>` and stores nothing until step 3. g10.auction-dmn.US1-TC1
3. Confirm the upload and enter `<alt text>`.
4. Publish `<listing_1>`.
5. Navigate to `<grade10 auction url>` and find `<listing_1>`.
   - `<product>` is stored as the gallery's first item and shows at card size in the media manager. g10.auction-dmn.US1-TC1
   - The catalogue card for `<listing_1>` shows `<product>` at card size, with `<alt text>` as its accessible name. g10.auction-dmn.US1-TC1
6. Check the listing cards for `<listing_2>` and `<listing_3>`.
7. Open the card for `<listing_2>`.
   - Each card carries a card-size image, its title and its current standing, with money as minor units and its currency code. g10.auction-dmn.US2-TC1
   - No card offers Buy Now or a stock count. g10.auction-dmn.US2-TC1
   - opens `<listing_2>`'s own address without a page load, showing that lot. g10.auction-dmn.US2-TC1
8. Navigate to `<an open listing url>` for `<listing_4>`.
   - `<listing_4>`'s name, description, sale and current standing are in the response HTML. g10.auction-dmn.US2-TC2
9. Check the served page.
   - Money reads as minor units with its currency code, and no reserve or Buy Now price appears. g10.auction-dmn.US2-TC2
10. Fetch `<surface>`.
   - The head names `<identity>`, and names no other auction surface in its place. g10.auction-dmn.US2-TC3
11. Inspect the head for its title, meta description and Open Graph tags.
   - The response status is `<status>`. g10.auction-dmn.US2-TC3
12. Check the response status.
   - Every lot the catalogue holds is listed as an absolute URL of the serving environment. g10.auction-dmn.US2-TC3
13. Navigate to `<grade10 sitemap url>`.
   - No sitemap entry carries an unfilled parameter in place of a lot. g10.auction-dmn.US2-TC3
14. Step through the gallery thumbnails and open one image at zoom size.
   - The gallery walks in order at thumb, detail and zoom sizes. g10.auction-dmn.US3-TC1
15. Enter `<bid amount>` in the bid field and select **Place Bid**.
   - The bid is accepted in the one answer, with no Authorizing state before it. g10.auction-dmn.US3-TC1
16. Read Time left, Highest bid and Recent Bids.
   - Highest bid reads `<bid amount>`, the bid count reads 1, and Recent Bids shows the user's own bid as You. g10.auction-dmn.US3-TC1
17. Read `<card>`'s activity at the card provider.
   - shows nothing held or charged on `<card>`. g10.auction-dmn.US3-TC1
18. Enter `<bid amount>` in the bid field.
19. Read the bid form.
   - reads Min, naming `<current bid>` plus `<increment>`, and **Place Bid** is disabled, so nothing is sent. g10.auction-dmn.US3-TC2
20. Reload `<listing_4>` and read Highest bid, the bid count and Recent Bids.
   - reads Highest bid `<current bid>`, bid count `<bid count>`, and no row of the user's in Recent Bids. g10.auction-dmn.US3-TC2
21. Navigate to `<grade10 bids url>` and look for `<listing_4>`.
   - shows no entry for `<listing_4>`. g10.auction-dmn.US3-TC2
22. Navigate to `<my auctions url>` and look for `<listing_4>`.
   - shows no row for `<listing_4>`. g10.auction-dmn.US3-TC2

## Walk 2: Execute every domain case independently — phase 2

**Starting state:**

- User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
- `<listing_5>` is live, holds no bids, its starting price is `<starting price>` and its increment is `<increment>`.
- `<listing_6>` is live and its current bid is `<leader price>`.
- User A leads `<listing_6>` with a committed maximum of `<user A maximum>`.
- User B is signed in with a card saved and is on `<listing_6>`.
- A user is signed in and is on `<grade10 bids url>`.
- `<listing_10>` is live, the user holds one accepted manual bid and one auto-bid on it, and user B now leads it.
- `<listing_7>` is live, its current bid is `<current bid>`, and `<time left>` remains until its close.
- A user is signed in with `<card>` saved and is on `<listing_9>`.
- `<listing_9>` is live, carries an extension cap, and its recorded close already stands at that cap.
- Its recorded close is `<bid time>` away.
- customer A leads `<listing_8>` with maximum `<user A maximum>` and is on its lot page.
- customer B is signed in with a linked card, on a separate session, on the same lot page.
- `<listing_8>` is in extended bidding, and the recorded close is `<time left before bid>` away.
- `<listing_8>` is in extended bidding, led by customer A, and the recorded close is `<time left before bid>` away.
- customer A is on the lot page for `<listing_8>`.
- `<listing_8>` is set as a Featured slide.
- customer C is on `<grade10 auction url>` with `<listing_8>`'s Featured slide and All auctions card in view, on a device whose clock is `<device skew>`.
- customer B is signed in with a linked card, on a separate session, on the lot page for `<listing_8>`.
- User B is signed in, holds no bid on `<listing_6>`, and is on it.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in USD |
| `<starting price>` | USD1,280 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment at the USD5,000 tier for `<user B maximum>`) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<user B raise>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |
| `<listing_6>` | A live listing led by user A, in USD |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user A maximum>` |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |
| `<listing_10>` | A live listing the user has bid on manually and automatically, now led by user B |
| `<listing_7>` | A live listing with bids and a close approaching |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<time left>` | 7 minutes |
| `<listing_9>` | A live listing with an extension cap, its close already at the cap |
| `<extension window>` / `<extension duration>` | 1800 seconds (30 minutes) each |
| `<bid time>` | 3 minutes before the recorded close, inside `<extension window>` |
| `<new time left>` | Unchanged — the close stays at the cap |
| `<bid amount>` | USD4,985 (range: 100000–499999 minor units), at the minimum next bid |
| `<listing_8>` | A listing in extended bidding, led by customer A, current bid `<leader price>` |
| `<extension duration>` | 1800 seconds |
| `<time left before bid>` | 4 minutes |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user B maximum>` |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<user B maximum>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user A maximum>` |
| `<device skew>` | 4 minutes behind |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |

### Route

1. As user A, select **Set maximum**, enter `<user A maximum>` and **Confirm**.
   - After step 1 User A leads at `<starting price>`. g10.auction-dmn.US4-TC1
2. As user B, set a maximum of `<user B maximum>` and **Confirm**.
   - After step 2 user A still leads and Highest bid reads `<user B maximum>` plus `<increment>`. g10.auction-dmn.US4-TC1
3. As user A, reload `<listing_5>` and read Your maximum, Highest bid and standing.
   - User A reads Your maximum, Highest bid and their standing as three separate facts. g10.auction-dmn.US4-TC1
4. As user B, select **Raise**, enter `<user B raise>` and confirm.
   - After step 4 user B leads at `<user A maximum>` plus `<increment>`, with no bids recorded at the amounts in between. g10.auction-dmn.US4-TC1
5. As user B, set a maximum of `<user B maximum>` and confirm.
6. As user A, open `<listing_6>` and read the bid panel.
7. As user A, navigate to `<grade10 bids url>` and read the Active list.
   - User A reads Outbid, with Your maximum still `<user A maximum>` and Highest bid at `<user A maximum>` plus `<increment>`. g10.auction-dmn.US5-TC1
   - `<listing_6>` appears once under Active with outbid standing, its price and currency code, and its latest activity time. g10.auction-dmn.US5-TC1
8. Expand `<listing_10>`'s history.
9. Open `<listing_10>` from its summary.
   - User B's accepted bid and the user's own standing change sit in one order. g10.auction-dmn.US5-TC2
   - The user's own rows read as You and user B stays a listing pseudonym with no maximum shown. g10.auction-dmn.US5-TC2
   - lands on `<listing_10>`'s own page. g10.auction-dmn.US5-TC2
10. Fetch `<an open listing url>` for `<listing_7>` with client-side scripts disabled.
11. Open the same address with scripts enabled and watch Time left and Highest bid as scripts finish loading.
   - The served gallery, description and standing stay on screen, with no loading placeholder over them. g10.auction-dmn.US6-TC1
   - Time left counts on from the served value rather than jumping or blanking. g10.auction-dmn.US6-TC1
   - Highest bid still reads `<current bid>` once scripts have finished loading. g10.auction-dmn.US6-TC1
12. Submit a bid of `<bid amount>` at `<bid time>`.
   - The bid is accepted and Highest bid reads `<bid amount>`. g10.auction-dmn.US7-TC2
13. Read Time left and the recorded close.
   - Time left reads `<new time left>` and the recorded close does not move past the cap. g10.auction-dmn.US7-TC2
14. Navigate to `<grade10 bids url>` and expand `<listing_9>`.
   - The history shows the accepted bid beside an unchanged close. `<!-- archive fold: g10.auction-dmn.TC-wh3@2 (2026-09-17-revise-auction-extended-bidding) replaced the earlier extended-bidding case -->` g10.auction-dmn.US7-TC2
15. As customer A, read Time left on the lot page.
16. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
17. As customer A, without reloading, read Highest bid and Time left on the open lot page.
   - reads Highest bid `<user B maximum>` plus `<increment>`, and customer A still leads. g10.auction-dmn.US7-TC3
   - reads Time left `<extension duration>`, labelled Extended bidding, with no reload. g10.auction-dmn.US7-TC3
18. Wait `<extension duration>` with no further bid.
   - The lot closes after step 4, and no further bid is placed. g10.auction-dmn.US7-TC3
19. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
20. As customer C, without reloading, read `<listing_8>`'s All auctions card and Featured slide.
21. As customer A, without reloading, read Highest bid and Time left at the same moment.
   - The card, the slide and the lot page's Highest bid all read `<user A maximum>` plus `<increment>`. g10.auction-dmn.US7-TC4
   - The card's and the slide's Ends in and the lot page's Time left agree to the second. g10.auction-dmn.US7-TC4
   - The slide still reads LIVE BIDDING, with no Extended label. g10.auction-dmn.US7-TC4
   - Neither reads `<device skew>` off, and neither page reloaded. g10.auction-dmn.US7-TC4
22. Read the bid panel and Recent Bids.
   - Highest bid reads `<leader price>` and `<user A maximum>` is neither shown nor derivable from any public fact. g10.auction-dmn.US8-TC1
23. Read the public listing contract `<listing_6>`'s page is served from.
   - Recent Bids names other users by listing pseudonym only, with no card facts. g10.auction-dmn.US8-TC1
24. Sign out and open the same address.
   - The signed-out reader gets no private history and no maximum. g10.auction-dmn.US8-TC1

## Walk 3: Execute every domain case independently — phase 3

**Starting state:**

- No user is signed in.
- A user account holds an accepted bid on `<listing_11>`.
- customer A is signed in with a linked card and is on the lot page for `<listing_14>`.
- customer B is signed in with a linked card, on a separate session, and can bid on `<listing_14>`.
- The catalogue publishes no lot under `<no lot address>`.
- `<lot_1>` was published and listed in the catalogue, then an operator called it off.
- customer A bid on `<lot_1>` before it was called off, and has `<lot_1 address>` saved from when `<lot_1>` was published.
- `<lot_2>` is a complete draft holding `<lot_1>`'s released slug, with a different title.
- customer A leads `<listing_15>` at `<final price>` with maximum `<user A maximum>`.
- customer B committed `<user B maximum>` on `<listing_15>` and was outbid.
- customer A and customer B are signed in on separate sessions, both on the lot page for `<listing_15>`.
- `<listing_15>`'s recorded close is under a minute away, and no further bid will be placed.
- customer A leads `<listing_16>` at `<final price>`, and is on its lot page.
- customer C is on `<grade10 auction url>` with `<listing_16>`'s card in All auctions.
- `<listing_16>`'s recorded close is under a minute away, and no further bid will be placed.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_11>` | A live listing the user holds an accepted bid on |
| `<listing_14>` | An open USD listing with no bids, starting price `<starting price>` |
| `<starting price>` | USD280 (range: 10000–49999 minor units) |
| `<increment>` | USD10 (fixed tier increment), the USD step at `<user A maximum>` |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<user B maximum>` | USD920 (range: 50000–99999 minor units), above `<user A maximum>` |
| `<price after A>` | `<starting price>` |
| `<price after B>` | `<user A maximum>` plus `<increment>` |
| `<no lot address>` | An address under the auction's lots naming no published lot |
| lot_1 | A lot that was published, listed in the catalogue, then called off by an operator |
| lot_1 address | The address of `<lot_1>` from when it was published |
| `<listing_15>` | A USD listing in extended bidding, led by customer A |
| `<final price>` | USD5,750 (fixed derived value), `<user B maximum>` plus its USD50 increment |
| `<user A maximum>` | USD8,400 (fixed derived value), above `<final price>` |
| `<user B maximum>` | USD5,700 (fixed derived value), below `<final price>` |
| `<listing_16>` | A USD listing in extended bidding, led by customer A |
| `<final price>` | USD5,750 (fixed derived value) |

### Route

1. Navigate to `<grade10 bids url>`.
   - No private history is shown before sign-in. g10.auction-dmn.US8-TC2
2. Sign in as that user.
   - lands back on the bids index, showing that account's Active list with `<listing_11>` in it. `<!-- archive fold: g10.auction-dmn.TC-fp8@2 (2026-09-16-default-auction-bid-holds-off) replaced the earlier linked-card bid case -->` g10.auction-dmn.US8-TC2
3. As customer A, enter `<user A maximum>` in the custom maximum on the bid panel and confirm the bid.
   - accepts the bid at `<price after A>` in the one answer, and Change is unavailable. g10.auction-dmn.US8-TC3
4. As customer B, enter `<user B maximum>` in the custom maximum on the same lot and confirm the bid.
5. Read the bid panel.
6. Read both customers' card activity at the card provider.
   - Highest bid reads `<price after B>`, and customer B leads. g10.auction-dmn.US8-TC3
   - shows nothing held or charged on either card. g10.auction-dmn.US8-TC3
7. Navigate to `<no lot address>`.
   - The response has status 404 and the site's not-found surface is shown. g10.auction-dmn.US9-TC1
8. Check the response status.
   - Neither an empty lot page nor the catalogue is shown in its place. g10.auction-dmn.US9-TC1
9. Navigate to `<grade10 auction url>`.
10. Search the catalogue for the title of `<lot_1>`.
   - `<lot_1>` does not appear in the catalogue. g10.auction-dmn.US11-TC1
11. Navigate to `<lot_1 address>`.
   - The response is 404 and Page not found is shown. `<!-- review-note 2026-09-29, listing-page: SC-11 (g10.auction-listing-page.SC-vl7, "the control acts on the addressed lot and no other") has no feature-level case — no user journey walks two-lot isolation. Consider a domain case exercising that watching lot A from lot A's page does not watch lot B when watching cases are added to this suite. -->` g10.auction-dmn.US11-TC1
12. As admin(holds auction:operate), create and publish `<lot_2>`, then, as customer A, navigate to `<lot_1 address>`.
   - The response is 200 and shows `<lot_2>`'s page with its own title. g10.auction-dmn.US11-TC1
13. As customer A, navigate to `<grade10 my auctions url>` and read `<lot_1>`'s row.
   - `<lot_1>` stays in My Auctions with its original bids and history, says the card was not charged and has no link to `<lot_2>`. g10.auction-dmn.US11-TC1
14. As admin(holds auction:operate), read `<lot_1>`'s code and reopen `<lot_1>`.
   - `<lot_1>` keeps its original code and shows canceled. g10.auction-dmn.US11-TC1
15. As customer A, search the catalogue for `<lot_1>`'s original title.
   - `<lot_1>` stays out of public browse and watchlist. g10.auction-dmn.US11-TC1
16. Wait through the recorded close on both pages, without reloading.
   - Once the close passes, both pages read Closed with no result until the close is recorded. g10.auction-dmn.US12-TC1
17. As customer A, read the lot's state.
   - reads Won and step 3 reads Did not win, with Highest bid `<final price>` on both. g10.auction-dmn.US12-TC1
18. As customer B, read the lot's state.
19. As customer A, navigate to `<my auctions url>`, select the Ended tab and find `<listing_15>`'s row.
   - 's row reads Won, with Current bid `<final price>`. g10.auction-dmn.US12-TC1
20. As customer B, navigate to `<my auctions url>`, select the Ended tab and find `<listing_15>`'s row.
   - 's row reads Didn't win, with Current bid `<final price>`, not `<user B maximum>`. g10.auction-dmn.US12-TC1
   - 's row reads "Your card was not charged.". g10.auction-dmn.US12-TC1
21. Wait through the recorded close on both pages, without reloading.
22. As customer A, read the lot's state once the result shows.
   - reads Won, with Highest bid `<final price>`. g10.auction-dmn.US12-TC2
23. As customer C, read `<listing_16>`'s card.
   - Once the close passes, customer A's page reads Closed with no result until the close is recorded. g10.auction-dmn.US12-TC2
   - Until then, customer C's card shows its existing closed state with `<final price>` and no result. g10.auction-dmn.US12-TC2
   - 's card reads Ended and names when it ended, with no watch control. g10.auction-dmn.US12-TC2
   - Neither page reloaded. g10.auction-dmn.US12-TC2

## g10.auction-dmn.US1: Operator publishes a gallery a collector can shop

**As an** operator with catalogue grant,
**I want** the images and alt text I confirm on a draft listing to be what the
catalogue and the listing page show,
**so that** a collector shops the card I photographed rather than a placeholder.

<!-- trace:case id=g10.auction-dmn.TC-5l7 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j,g10.auction-listing-media.SC-41j,g10.auction-listing-media.SC-j5f,g10.auction-listing-media.SC-1mk,g10.auction-listing-media.SC-su1,g10.auction-listing-media.SC-y9i,g10.auction-listing-media.SC-dva,g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
### g10.auction-dmn.US1-TC1: Confirmed gallery image reaches the catalogue card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-04, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin is on `<grade10 auction admin listings url>`.
* `<listing_1>` exists with an empty gallery.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft auction listing with an empty gallery |
| `<product>` | charizard-front.jpg, JPEG, 3.6 MB |
| `<alt text>` | 1999 Charizard PSA 10, front, shadowless 1st edition |

**Steps:**

1. Open the media manager for `<listing_1>`.
2. Select `<product>` for a gallery slot.
3. Confirm the upload and enter `<alt text>`.
4. Publish `<listing_1>`.
5. Navigate to `<grade10 auction url>` and find `<listing_1>`.

**Expected Results:**

* Step 2 shows a preview of `<product>` and stores nothing until step 3.
* `<product>` is stored as the gallery's first item and shows at card size in the media manager.
* The catalogue card for `<listing_1>` shows `<product>` at card size, with `<alt text>` as its accessible name.

---

## g10.auction-dmn.US2: Collector picks a lot out of the catalogue and opens it

**As a** collector,
**I want** to pick a lot off the auction catalogue and land on that lot's own
page,
**so that** the card I chose, its images, and where its bidding stands are what
I read.

<!-- trace:case id=g10.auction-dmn.TC-23e rev=1 -->
### g10.auction-dmn.US2-TC1: Catalogue card opens its own lot page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-05, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* A user is on `<grade10 auction url>`.
* `<listing_2>` and `<listing_3>` are published in different categories.
* Each of them has an image as its first gallery item.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published listing in Pokémon, gallery of three images |
| `<listing_3>` | A published listing in another category, first gallery item an image |

**Steps:**

1. Check the listing cards for `<listing_2>` and `<listing_3>`.
2. Open the card for `<listing_2>`.

**Expected Results:**

* Each card carries a card-size image, its title and its current standing, with money as minor units and its currency code.
* No card offers Buy Now or a stock count.
* Step 2 opens `<listing_2>`'s own address without a page load, showing that lot.

<!-- trace:case id=g10.auction-dmn.TC-yqv rev=3 -->
### g10.auction-dmn.US2-TC2: Lot page answers whole before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01, grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_4>` is live and its current bid is `<current bid>`.
* The user's browser runs no client-side scripts.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A live listing with bids, in USD |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |

**Steps:**

1. Navigate to `<an open listing url>` for `<listing_4>`.
2. Check the served page.

**Expected Results:**

* `<listing_4>`'s name, description, sale and current standing are in the response HTML.
* Money reads as minor units with its currency code, and no reserve or Buy Now price appears.

<!-- trace:case id=g10.auction-dmn.TC-qvl rev=2 -->
### g10.auction-dmn.US2-TC3: Each auction surface names itself and is discoverable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-03, grade10-site-auction-listing-page-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* `<listing_2>` is published and the catalogue lists it.
* The catalogue publishes no lot under `<no lot address>`.
* The reader's browser runs no client-side scripts.

**Test data:**

| `<surface>` | `<identity>` | `<status>` |
| --- | --- | --- |
| The auction catalogue at `<grade10 auction url>` | the catalogue's own title and description | 200 |
| `<listing_2>`'s own address | `<listing_2>`'s title, description and canonical address, in `og:title`, `og:description` and `og:url` | 200 |
| `<no lot address>` | the site's not-found surface | 404 |

**Steps:**

1. Fetch `<surface>`.
2. Inspect the head for its title, meta description and Open Graph tags.
3. Check the response status.
4. Navigate to `<grade10 sitemap url>`.

**Expected Results:**

* The head names `<identity>`, and names no other auction surface in its place.
* The response status is `<status>`.
* Every lot the catalogue holds is listed as an absolute URL of the serving environment.
* No sitemap entry carries an unfilled parameter in place of a lot.

---

## g10.auction-dmn.US3: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my bid stands on, with nothing taken from it until I win.

<!-- trace:case id=g10.auction-dmn.TC-rl3 rev=4 -->
### g10.auction-dmn.US3-TC1: Gallery study leads to an accepted first bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-bid-payment-method-US-01


**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_5>`.
* `<listing_5>` is live, holds no bids, and its starting price is `<starting price>`.
* `<listing_5>` holds more than one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in USD |
| `<starting price>` | USD1,200 (range: 100000–499999 minor units) |
| `<bid amount>` | USD1,200 (fixed boundary or equality), equal to `<starting price>` |

**Steps:**

1. Step through the gallery thumbnails and open one image at zoom size.
2. Enter `<bid amount>` in the bid field and select **Place Bid**.
3. Read Time left, Highest bid and Recent Bids.
4. Read `<card>`'s activity at the card provider.

**Expected Results:**

* The gallery walks in order at thumb, detail and zoom sizes.
* The bid is accepted in the one answer, with no Authorizing state before it.
* Highest bid reads `<bid amount>`, the bid count reads 1, and Recent Bids shows the user's own bid as You.
* Step 4 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-dmn.TC-5pk rev=4 -->
### g10.auction-dmn.US3-TC2: Bid below the next increment is refused on the bid form and recorded nowhere

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-01, grade10-site-auction-account-record-US-02


**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_4>`.
* `<listing_4>` is live, its current bid is `<current bid>` and its increment is `<increment>`.
* The user holds no bid on `<listing_4>` and does not watch it.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_4>` | A live listing with bids from other users, in USD, bid count `<bid count>` |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<increment>` | USD25 (fixed tier increment), the USD1,000 tier |
| `<bid amount>` | USD4,984 (fixed derived value), one major unit below `<current bid>` plus `<increment>` |
| `<bid count>` | 2 |

**Steps:**

1. Enter `<bid amount>` in the bid field.
2. Read the bid form.
3. Reload `<listing_4>` and read Highest bid, the bid count and Recent Bids.
4. Navigate to `<grade10 bids url>` and look for `<listing_4>`.
5. Navigate to `<my auctions url>` and look for `<listing_4>`.

**Expected Results:**

* Step 2 reads Min, naming `<current bid>` plus `<increment>`, and **Place Bid** is disabled, so nothing is sent.
* Step 3 reads Highest bid `<current bid>`, bid count `<bid count>`, and no row of the user's in Recent Bids.
* Step 4 shows no entry for `<listing_4>`.
* Step 5 shows no row for `<listing_4>`.

---

## g10.auction-dmn.US4: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** to commit one maximum and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page, and nothing is taken
from my card until I win.

<!-- trace:case id=g10.auction-dmn.TC-r2v rev=3 -->
### g10.auction-dmn.US4-TC1: Two maxima settle at the second-highest plus one increment

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02


**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
* `<listing_5>` is live, holds no bids, its starting price is `<starting price>` and its increment is `<increment>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in USD |
| `<starting price>` | USD1,280 (range: 100000–499999 minor units) |
| `<increment>` | USD25 (fixed tier increment) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<user B raise>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |

**Steps:**

1. As user A, select **Set maximum**, enter `<user A maximum>` and **Confirm**.
2. As user B, set a maximum of `<user B maximum>` and **Confirm**.
3. As user A, reload `<listing_5>` and read Your maximum, Highest bid and standing.
4. As user B, select **Raise**, enter `<user B raise>` and confirm.

**Expected Results:**

* After step 1 User A leads at `<starting price>`.
* After step 2 user A still leads and Highest bid reads `<user B maximum>` plus `<increment>`.
* User A reads Your maximum, Highest bid and their standing as three separate facts.
* After step 4 user B leads at `<user A maximum>` plus `<increment>`, with no bids recorded at the amounts in between.

---

## g10.auction-dmn.US5: Collector learns they were outbid and finds it in their bids

**As a** collector,
**I want** losing the lead to show on the lot and in my bids index,
**so that** I can see I was outbid and what the next bid must clear.

<!-- trace:case id=g10.auction-dmn.TC-0cq rev=4 -->
### g10.auction-dmn.US5-TC1: Outbid standing reaches the lot page and the bids index

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-01


**Pre-conditions:**

* `<listing_6>` is live and its current bid is `<leader price>`.
* User A leads `<listing_6>` with a committed maximum of `<user A maximum>`.
* User B is signed in with a card saved and is on `<listing_6>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in USD |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user A maximum>` |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |

**Steps:**

1. As user B, set a maximum of `<user B maximum>` and confirm.
2. As user A, open `<listing_6>` and read the bid panel.
3. As user A, navigate to `<grade10 bids url>` and read the Active list.

**Expected Results:**

* User A reads Outbid, with Your maximum still `<user A maximum>` and Highest bid at `<user A maximum>` plus `<increment>`.
* `<listing_6>` appears once under Active with outbid standing, its price and currency code, and its latest activity time.

<!-- trace:case id=g10.auction-dmn.TC-57p rev=1 -->
### g10.auction-dmn.US5-TC2: Outbid summary opens its explanation and its lot

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
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-03, grade10-site-auction-listing-page-US-05

**Pre-conditions:**

* A user is signed in and is on `<grade10 bids url>`.
* `<listing_10>` is live, the user holds one accepted manual bid and one auto-bid on it, and user B now leads it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A live listing the user has bid on manually and automatically, now led by user B |

**Steps:**

1. Expand `<listing_10>`'s history.
2. Open `<listing_10>` from its summary.

**Expected Results:**

* User B's accepted bid and the user's own standing change sit in one order.
* The user's own rows read as You and user B stays a listing pseudonym with no maximum shown.
* Step 2 lands on `<listing_10>`'s own page.

---

## g10.auction-dmn.US6: Collector shares a lot link

**As a** collector,
**I want** a lot link I pass on to unfurl as that lot and open live,
**so that** whoever I send it to reads the card I meant, not the catalogue.

<!-- trace:case id=g10.auction-dmn.TC-wrl rev=3 -->
### g10.auction-dmn.US6-TC1: Shared link unfurls as the lot and stays put on hydration

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
* **Trace:** grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-04, grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_7>` is live, its current bid is `<current bid>`, and `<time left>` remains until its close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A live listing with bids and a close approaching |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<time left>` | 7 minutes |

**Steps:**

1. Fetch `<an open listing url>` for `<listing_7>` with client-side scripts disabled.
2. Open the same address with scripts enabled and watch Time left and Highest bid as scripts finish loading.

**Expected Results:**

* The served gallery, description and standing stay on screen, with no loading placeholder over them.
* Time left counts on from the served value rather than jumping or blanking.
* Highest bid still reads `<current bid>` once scripts have finished loading.

---

## g10.auction-dmn.US7: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

<!-- trace:case id=g10.auction-dmn.TC-5yl rev=2 -->
### g10.auction-dmn.US7-TC2: Extension cap holds while the bid is still accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_9>`.
* `<listing_9>` is live, carries an extension cap, and its recorded close already stands at that cap.
* Its recorded close is `<bid time>` away.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A live listing with an extension cap, its close already at the cap |
| `<extension window>` / `<extension duration>` | 1800 seconds (30 minutes) each |
| `<bid time>` | 3 minutes before the recorded close, inside `<extension window>` |
| `<new time left>` | Unchanged — the close stays at the cap |
| `<bid amount>` | USD4,985 (range: 100000–499999 minor units), at the minimum next bid |

**Steps:**

1. Submit a bid of `<bid amount>` at `<bid time>`.
2. Read Time left and the recorded close.
3. Navigate to `<grade10 bids url>` and expand `<listing_9>`.

**Expected Results:**

* The bid is accepted and Highest bid reads `<bid amount>`.
* Time left reads `<new time left>` and the recorded close does not move past the cap.
* The history shows the accepted bid beside an unchanged close.

`<!-- archive fold: g10.auction-dmn.TC-wh3@2 (2026-09-17-revise-auction-extended-bidding) replaced the earlier extended-bidding case -->`

<!-- trace:case id=g10.auction-dmn.TC-wh3 rev=3 -->
### g10.auction-dmn.US7-TC3: Price-moving auto-bid in extended bidding restarts the timer on the open page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-12, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_8>` with maximum `<user A maximum>` and is on its lot page.
* customer B is signed in with a linked card, on a separate session, on the same lot page.
* `<listing_8>` is in extended bidding, and the recorded close is `<time left before bid>` away.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing in extended bidding, led by customer A, current bid `<leader price>` |
| `<extension duration>` | 1800 seconds |
| `<time left before bid>` | 4 minutes |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user B maximum>` |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |

**Steps:**

1. As customer A, read Time left on the lot page.
2. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read Highest bid and Time left on the open lot page.
4. Wait `<extension duration>` with no further bid.

**Expected Results:**

* Step 3 reads Highest bid `<user B maximum>` plus `<increment>`, and customer A still leads.
* Step 3 reads Time left `<extension duration>`, labelled Extended bidding, with no reload.
* The lot closes after step 4, and no further bid is placed.

<!-- trace:case id=g10.auction-dmn.TC-n2z rev=2 -->
### g10.auction-dmn.US7-TC4: Catalogue card and open lot page agree after an extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-12, grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* `<listing_8>` is in extended bidding, led by customer A, and the recorded close is `<time left before bid>` away.
* customer A is on the lot page for `<listing_8>`.
* `<listing_8>` is set as a Featured slide.
* customer C is on `<grade10 auction url>` with `<listing_8>`'s Featured slide and All auctions card in view, on a device whose clock is `<device skew>`.
* customer B is signed in with a linked card, on a separate session, on the lot page for `<listing_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing in extended bidding, led by customer A, current bid `<leader price>` |
| `<time left before bid>` | 4 minutes |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD9,600 (range: 500000–999999 minor units), above `<user A maximum>` |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user A maximum>` |
| `<device skew>` | 4 minutes behind |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer C, without reloading, read `<listing_8>`'s All auctions card and Featured slide.
3. As customer A, without reloading, read Highest bid and Time left at the same moment.

**Expected Results:**

* The card, the slide and the lot page's Highest bid all read `<user A maximum>` plus `<increment>`.
* The card's and the slide's Ends in and the lot page's Time left agree to the second.
* The slide still reads LIVE BIDDING, with no Extended label.
* Neither reads `<device skew>` off, and neither page reloaded.

---

## g10.auction-dmn.US8: Collector's private bidding facts stay private

**As a** collector,
**I want** my maximum kept to my own account,
**so that** a rival, a signed-out visitor, or another storefront reads none of
it.

<!-- trace:case id=g10.auction-dmn.TC-nhf rev=4 -->
### g10.auction-dmn.US8-TC1: Rival reads the price but never the leader's maximum

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-04


**Pre-conditions:**

* `<listing_6>` is live and its current bid is `<leader price>`.
* User A leads `<listing_6>` with a committed maximum of `<user A maximum>`.
* User B is signed in, holds no bid on `<listing_6>`, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in USD |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |

**Steps:**

1. Read the bid panel and Recent Bids.
2. Read the public listing contract `<listing_6>`'s page is served from.
3. Sign out and open the same address.

**Expected Results:**

* Highest bid reads `<leader price>` and `<user A maximum>` is neither shown nor derivable from any public fact.
* Recent Bids names other users by listing pseudonym only, with no card facts.
* The signed-out reader gets no private history and no maximum.

<!-- trace:case id=g10.auction-dmn.TC-n6x rev=1 -->
### g10.auction-dmn.US8-TC2: Signed-out visitor keeps their destination

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* No user is signed in.
* A user account holds an accepted bid on `<listing_11>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A live listing the user holds an accepted bid on |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Sign in as that user.

**Expected Results:**

* No private history is shown before sign-in.
* Step 2 lands back on the bids index, showing that account's Active list with `<listing_11>` in it.

`<!-- archive fold: g10.auction-dmn.TC-fp8@2 (2026-09-16-default-auction-bid-holds-off) replaced the earlier linked-card bid case -->`

<!-- trace:case id=g10.auction-dmn.TC-fp8 rev=4 -->
### g10.auction-dmn.US8-TC3: A linked collector's bid stands at once on the card on file

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bid-panel-enrollment-US-02


**Pre-conditions:**

* customer A is signed in with a linked card and is on the lot page for `<listing_14>`.
* customer B is signed in with a linked card, on a separate session, and can bid on `<listing_14>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | An open USD listing with no bids, starting price `<starting price>` |
| `<starting price>` | USD280 (range: 10000–49999 minor units) |
| `<increment>` | USD10 (fixed tier increment), the USD step at `<user A maximum>` |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<user B maximum>` | USD920 (range: 50000–99999 minor units), above `<user A maximum>` |
| `<price after A>` | `<starting price>` |
| `<price after B>` | `<user A maximum>` plus `<increment>` |

**Steps:**

1. As customer A, enter `<user A maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer B, enter `<user B maximum>` in the custom maximum on the same lot and confirm the bid.
3. Read the bid panel.
4. Read both customers' card activity at the card provider.

**Expected Results:**

* Step 1 accepts the bid at `<price after A>` in the one answer, and Change is unavailable.
* Highest bid reads `<price after B>`, and customer B leads.
* Step 4 shows nothing held or charged on either card.

---

## g10.auction-dmn.US9: Collector meets a lot that is not there

**As a** collector,
**I want** a dead lot address to say so plainly,
**so that** I am never shown an empty page in place of a lot.

<!-- trace:case id=g10.auction-dmn.TC-0rf rev=1 -->
### g10.auction-dmn.US9-TC1: Address naming no published lot answers not found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03, grade10-site-auction-auction-US-01

**Pre-conditions:**

* The catalogue publishes no lot under `<no lot address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<no lot address>` | An address under the auction's lots naming no published lot |

**Steps:**

1. Navigate to `<no lot address>`.
2. Check the response status.

**Expected Results:**

* The response has status 404 and the site's not-found surface is shown.
* Neither an empty lot page nor the catalogue is shown in its place.

<!-- trace:case id=g10.auction-dmn.TC-13a rev=1 -->
### g10.auction-dmn.US9-TC2: Unavailable card capability fails the bid explicitly

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* `<listing_12>` is live and its current bid is `<current bid>`.
* The card authorization capability a bid needs is unavailable for the payment account `<listing_12>` runs on.
* A user is signed in with `<card>` saved, holds no accepted bid on `<listing_12>`, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A live listing whose payment account has no card authorization capability |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Enter `<bid amount>` and select **Place Bid**.
2. Navigate to `<grade10 bids url>` and expand `<listing_12>`.

**Expected Results:**

* The bid fails naming the unavailable capability, with no credentials, card, or address data shown.
* No bid, hold or fixture-backed outcome is created and Highest bid stays `<current bid>`.
* The attempt appears as a failed event with a safe payment reason, and `<listing_12>` carries failed-only standing.

<!-- trace:case id=g10.auction-dmn.TC-qus rev=1 -->
### g10.auction-dmn.US9-TC3: A repeated card authorization event changes the lot once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing_13>` is live and holds one accepted bid of 505000 minor units.
* That bid has exactly one recorded card authorization event.

**Test data:**

| `<event copy>` | `<outcome>` |
| --- | --- |
| The same event with its original provider event id | the recorded outcome is returned without a second state transition |
| The same event with a tampered body and its original signature | the event is rejected on signature |

**Steps:**

1. Deliver `<event copy>` to the auction.
2. Read `<listing_13>` and expand it at `<grade10 bids url>`.

**Expected Results:**

* `<outcome>`.
* One accepted bid, one hold, and one history entry stand for that bid.
* No bid, hold, release, capture or order state is duplicated.

---

## g10.auction-dmn.US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot gone from browse and search,
**so that** its former address answers the current lot or Page not found.

<!-- trace:case id=g10.auction-dmn.TC-dw9 rev=4 -->
### g10.auction-dmn.US11-TC1: Released address follows its new public holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02, grade10-site-auction-listing-page-US-03, grade10-site-auction-listing-page-US-01, grade10-site-auction-lot-status-US-03


**Pre-conditions:**

* `<lot_1>` was published and listed in the catalogue, then an operator called it off.
* customer A bid on `<lot_1>` before call off.
* `<original_code>` is its reserved code from admin.
* The account history was recorded before call off.
* customer A has `<lot_1 address>` saved from when `<lot_1>` was published.
* `<lot_2>` is a complete draft holding the released slug, with a different title.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | A lot that was published, listed in the catalogue, then called off by an operator |
| lot_1 address | The address of `<lot_1>` from when it was published |
| lot_2 | A replacement draft with the same slug and a different title |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Search the catalogue for the title of `<lot_1>`.
3. Navigate to `<lot_1 address>`.
4. As customer A, read `<lot_1>` in My Auctions.
5. As admin(holds auction:operate), read `<lot_1>`'s code.
6. Create `<lot_2>`.
7. Publish `<lot_2>`.
8. As customer A, navigate to `<lot_1 address>`.
9. Navigate to `<grade10 my auctions url>`.
10. As admin(holds auction:operate), reopen `<lot_1>`.
11. As customer A, search its original title in the catalogue.

**Expected Results:**

* Step 2: `<lot_1>` does not appear in the catalogue.
* Step 3 returns 404 and Page not found.
* Step 8 returns 200 and `<lot_2>`'s page.
* Step 8 shows `<lot_2>`'s title, not `<lot_1>`'s.
* Step 9 still lists `<lot_1>` for customer A.
* Steps 4 and 9 retain `<lot_1>`'s original bids/history.
* Both rows say the card was not charged.
* Neither row links to `<lot_2>`.
* Step 5 keeps `<original_code>` reserved on `<lot_1>`.
* The replacement has a different code.
* Step 10 shows canceled with `<original_code>` unchanged.
* Step 11 does not find `<lot_1>`.
* `<lot_1>` stays out of public browse and watchlist after reuse.

---

## g10.auction-dmn.US12: Bidders follow a lot through its close to their record

**As a** bidder,
**I want** the lot page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-dmn.TC-3iz rev=3 -->
### g10.auction-dmn.US12-TC1: Winner and losing bidder read one result on the lot and My Auctions

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
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-account-record-US-10, grade10-site-auction-account-record-US-04


**Pre-conditions:**

* customer A leads `<listing_15>` at `<final price>` with maximum `<user A maximum>`.
* customer B committed `<user B maximum>` on `<listing_15>` and was outbid.
* customer A and customer B are signed in on separate sessions, both on the lot page for `<listing_15>`.
* `<listing_15>`'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | A USD listing in extended bidding, led by customer A |
| `<final price>` | USD5,750 (fixed derived value), `<user B maximum>` plus its USD50 increment |
| `<user A maximum>` | USD8,400 (fixed derived value), above `<final price>` |
| `<user B maximum>` | USD5,700 (fixed derived value), below `<final price>` |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state.
3. As customer B, read the lot's state.
4. As customer A, navigate to `<my auctions url>`, select the Ended tab and find `<listing_15>`'s row.
5. As customer B, navigate to `<my auctions url>`, select the Ended tab and find `<listing_15>`'s row.

**Expected Results:**

* Once the close passes, both pages read Closed with no result until the close is recorded.
* Step 2 reads Won and step 3 reads Did not win, with Highest bid `<final price>` on both.
* Step 4's row reads Won, with Current bid `<final price>`.
* Step 5's row reads Didn't win, with Current bid `<final price>`, not `<user B maximum>`.
* Step 5's row reads "Your card was not charged.".

<!-- trace:case id=g10.auction-dmn.TC-8w7 rev=3 -->
### g10.auction-dmn.US12-TC2: Catalogue card and lot page turn at the close without a reload

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14


**Pre-conditions:**

* customer A leads `<listing_16>` at `<final price>`, and is on its lot page.
* customer C is on `<grade10 auction url>` with `<listing_16>`'s card in All auctions.
* `<listing_16>`'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | A USD listing in extended bidding, led by customer A |
| `<final price>` | USD5,750 (fixed derived value) |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state once the result shows.
3. As customer C, read `<listing_16>`'s card.

**Expected Results:**

* Once the close passes, customer A's page reads Closed with no result until the close is recorded.
* Until then, customer C's card shows its existing closed state with `<final price>` and no result.
* Step 2 reads Won, with Highest bid `<final price>`.
* Step 3's card reads Ended and names when it ended, with no watch control.
* Neither page reloaded.

<!-- trace:case id=g10.auction-domain.TC-k4p rev=3 covers=g10.auction-winner-order.SC-ug0,g10.auction-winner-order.SC-fq4 -->
### g10.auction-dmn.US12-TC3: A winner chooses HKD and sees the card fee after both order totals

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
* **Trace:** grade10-site-auction-auction-US-02, winner-order-US-01, winner-order-US-24, winner-order-US-25, winner-order-US-26

**Pre-conditions:**

* Customer A won `<listing_19>` at a USD winning bid and is on its order setup page.
* HKD Card is offered, and Payment Settings holds an HKD card rule of 3.4 per cent and 235 minor units.
* No settlement currency or payment method is preselected.
* No invoice has been sent for `<listing_19>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_19>` | A closed USD lot won by customer A |
| `<winning bid>` | USD101.00 (10100 minor units) |
| `<buyer's premium>` | USD20.20 (2020 minor units) |
| `<shipping>` | USD10.01 (1001 minor units) |
| `<settlement currency>` | HKD, selected by customer A |
| `<payment method>` | Card, selected by customer A |
| `<USD total>` | USD131.21 (13121 minor units) |
| `<HKD total>` | HKD1,031.00 (103100 minor units) |
| `<HKD card fee>` | HKD38.73 (3873 minor units) from the gross-up rule on the HKD subtotal |
| `<amount payable>` | HKD1,069.73 (106973 minor units) |

**Steps:**

1. Read the setup choices and Order Summary before making a selection.
2. Select HKD, then Card; confirm the address and setup, then read the Order Summary before invoice send.
3. As an operator, quote the order with Shipping & Handling of `<shipping>` and send its invoice.
4. Reopen the winner's order and read its Pending Payment status and Order Summary, totals and fee rows.
5. Read the invoice amount payable.

**Expected Results:**

* Step 1 has no preselected settlement currency or payment method, and no HKD total or fee appears before an invoice exists.
* Step 2 commits the winner's explicit HKD settlement and Card choices.
* Before the invoice is sent, the summary has no HKD total or fee.
* Step 3 sends an invoice after the quote includes `<shipping>`.
* Step 4 reads Pending Payment and lists the winning bid, buyer's premium and shipping in USD.
* Step 4 shows `<USD total>`, then `<HKD total>`; the HKD fee of `<HKD card fee>` appears after the separator, below both totals.
* The HKD card fee is calculated from the HKD subtotal of 103100 minor units using its 3.4 per cent plus 235 minor-unit rule. It is not included in either total, and no USD fee line appears.
* Step 5 reads `<amount payable>` in HKD, equal to the invoice's Order Total.
* The order summary names no USD winning bid or exchange rate under HKD settlement.

---

## g10.auction-dmn.US13: Collectors bid against a house maximum through the close

**As a** collector,
**I want** to compete for a lot to its close, with each bid, extension, result and letter decided by the auction rules,
**so that** what I read, and what I am told, is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-88l rev=2 -->
### g10.auction-dmn.US13-TC1: The house outbids a collector and the lot closes sold under its pseudonym

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-notifications-US-03, grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer A(card linked) leads <listing_17> at <starting price> with maximum <user A maximum>, email alerts on, and will not bid again.
* <listing_17> has an internal bid of <house maximum>, its <commit time> still ahead.
* customer D watches <listing_17>, email alerts on, and will not bid.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_17> | A published USD listing, starting price <starting price>, extension duration <extension duration>, no cap |
| <starting price> | USD4,000 (400000 minor units) |
| <house maximum> | USD6,000 (600000 minor units) |
| <user A maximum> | USD5,000 (500000 minor units), below <house maximum> |
| <final price> | USD5,050 (505000 minor units): <user A maximum> plus the USD50 increment at the $5,000 tier |
| <commit time> | 5 minutes before the scheduled close |
| <extension duration> | 1800s (30mins) |

**Steps:**

1. Wait until <commit time> passes.
2. As customer A, read the standing, Highest bid and Recent bids on the lot page for <listing_17>.
3. Read the mail sent to customer A.
4. Wait through the scheduled close and the extended close, with no further bid.
5. As customer A, read the lot's state.
6. As customer A, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_17>'s row.
7. Read the mail sent to customer A and customer D at the close.

**Expected Results:**

* Step 2 reads Outbid, Highest bid <final price>.
* Step 2: Recent bids lists customer A at <starting price>, then the house at <final price> under its listing pseudonym.
* Step 3: one You have been outbid letter, and no New bid letter.
* Step 4: the lot enters extended bidding at the scheduled close and closes <extension duration> after it.
* Step 5 reads Did not win, sold at <final price>, the crowned row the house's pseudonym.
* Step 6's row reads Didn't win, with Current bid <final price> and "Your card was not charged."
* Step 7: customer A gets one You did not win letter with Winning bid <final price>; customer D gets one Lot watched, sold letter with Sold for <final price>.
* At close, the internal order is created automatically with HKD settlement and FPS bank transfer selected; no winner setup or operator setup step occurs, and no letter is sent for that internal order. The operator can send its invoice.

<!-- trace:case id=g10.auction-domain.TC-su0 rev=2 -->
### g10.auction-dmn.US13-TC2: A collector beats the house in extended bidding and wins

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-12, grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-01

**Pre-conditions:**

* <listing_18>'s internal bid of <house maximum> is committed, and the house leads at <leader price> over customer A's maximum <user A maximum>.
* <listing_18> is in extended bidding with its recorded close <time left before bid> away.
* customer B(card linked) is signed in on the lot page for <listing_18>, on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_18> | A published USD listing in extended bidding, extension duration <extension duration>, no cap |
| <house maximum> | USD6,000 (600000 minor units) |
| <user A maximum> | USD5,000 (500000 minor units) |
| <leader price> | USD5,050 (505000 minor units): <user A maximum> plus the USD50 increment at the $5,000 tier |
| <user B maximum> | USD7,000 (700000 minor units), above <house maximum> |
| <final price> | USD6,050 (605000 minor units): <house maximum> plus the USD50 increment at the $5,000 tier |
| <extension duration> | 1800s (30mins) |
| <time left before bid> | 5 minutes |

**Steps:**

1. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm.
2. As customer B, read the standing, Highest bid and Time left.
3. Wait through the recorded close, with no further bid.
4. As customer B, read the lot's state.
5. As customer B, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_18>'s row.

**Expected Results:**

* Step 2 reads Leading, Highest bid <final price>.
* Step 2: Time left reads <extension duration> from customer B's bid.
* Step 4 reads Won, with Highest bid <final price>.
* Step 5's row reads Won with View order, Current bid <final price>.

---

## Ungrouped

### g10.auction-dmn.US1: Operator publishes a gallery a collector can shop

<!-- trace:case id=g10.auction-dmn.TC-acb rev=1 -->
#### g10.auction-dmn.US1-TC2: Unsupported file never reaches the gallery or the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin is on `<grade10 auction admin listings url>`.
* `<listing_2>` is published with three gallery images.

**Test data:**

| `<product>` | `<refusal>` |
| --- | --- |
| grading-report.pdf, PDF, 1.3 MB | its type is not JPEG, PNG, WebP or AVIF |
| charizard-back.jpg, JPEG, 113 MB | it is above the 104857600-byte bound |

**Steps:**

1. Open the media manager for `<listing_2>`.
2. Select `<product>` for a gallery slot.
3. Navigate to `<grade10 auction url>` and find `<listing_2>`.

**Expected Results:**

* `<product>` is refused because `<refusal>`.
* `<listing_2>` still holds its three gallery images in their order.
* The catalogue card for `<listing_2>` is unchanged.

### g10.auction-dmn.US4: Collector commits a maximum and is bid to the lead

<!-- trace:case id=g10.auction-dmn.TC-cru rev=4 -->
#### g10.auction-dmn.US4-TC2: Auto-bid raises the leader on their behalf, with nothing taken from the card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bidding-history-US-02


**Pre-conditions:**

* `<listing_6>` is live, its current bid is `<leader price>` and its increment is `<increment>`.
* User A leads `<listing_6>` with a committed maximum of `<user A maximum>`, placed on `<card>`.
* User B is signed in with a card saved and is on `<listing_6>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_6>` | A live listing led by user A, in USD |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<increment>` | USD50 (fixed tier increment), the USD5,000 tier at `<user B maximum>` |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–999999 minor units), below `<user A maximum>` |

**Steps:**

1. As user B, set a maximum of `<user B maximum>` and confirm.
2. As user A, open `<listing_6>` and read Highest bid, Your maximum and Recent Bids.
3. As user A, navigate to `<grade10 bids url>` and expand `<listing_6>`.
4. Read `<card>`'s activity at the card provider.

**Expected Results:**

* Highest bid reads `<user B maximum>` plus `<increment>` and user A still leads, Your maximum `<user A maximum>`.
* The bid count includes the raise, and the history shows it as placed on user A's behalf rather than as a manual bid.
* Step 4 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-dmn.TC-b5t rev=4 -->
#### g10.auction-dmn.US4-TC3: Lowering a maximum is refused on the bid form and the lead holds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-02


**Pre-conditions:**

* `<listing_6>` is live and its current bid is `<leader price>`.
* User A leads `<listing_6>` with a committed maximum of `<user A maximum>` and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in USD |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<lower maximum>` | USD3,400 (range: 100000–499999 minor units), below `<user A maximum>` |

**Steps:**

1. Navigate to `<grade10 bids url>`, expand `<listing_6>` and count its history lines.
2. Navigate back to `<listing_6>`.
3. Select **Raise** and enter `<lower maximum>`.
4. Read the bid form, Your maximum, Highest bid and the leader.
5. Navigate to `<grade10 bids url>` and expand `<listing_6>`.
6. Navigate to `<my auctions url>` and read `<listing_6>`'s row.

**Expected Results:**

* Step 4 reads Min, naming the smallest maximum above `<user A maximum>`, and **Place Bid** is disabled, so nothing is sent.
* Step 4 reads Your maximum `<user A maximum>`, Highest bid `<leader price>`, and user A Leading.
* Step 5 shows the same history lines as step 1, with no line for the refused attempt.
* Step 6's row reads Leading, with Current bid `<leader price>`.

### g10.auction-dmn.US10: Exploratory passes

<!-- trace:case id=g10.auction-dmn.TC-cnk rev=1 -->
#### g10.auction-dmn.US10-TC1: Roam the catalogue-to-bid path for one hour

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-media-US-05, grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* The catalogue publishes lots in every state — scheduled, live, ending soon, closed — across more than one category.
* Among them, one lot has a single gallery image and one has none.
* A user is signed in with `<card>` saved and is on `<grade10 auction url>`.

**Steps:**

1. Reach lots by every route — card, browser Back, typed address, shared link, the bids index.
2. Vary the pass: minutes left, sub-minute, slow network, small viewport, each locale under `/tc` and `/sc`.
3. Bid, raise a maximum, and reload at awkward moments on the lots you opened.
4. Note every surprise with the address, the lot state, and what you did.

**Expected Results:**

* No surface blanks, duplicates a lot, or drops a placeholder over content already served.
* Money reads as minor units with its currency code wherever it appears, in every locale.
* A lot with one image shows no thumbnail strip and a lot with none still renders.
* No lot offers Buy Now, a stock count, or a reserve state.
* Every surprise is written up with enough detail to reproduce cold.

<!-- trace:case id=g10.auction-dmn.TC-6dl rev=3 -->
#### g10.auction-dmn.US10-TC2: Roam competing maxima and the closing minutes for one hour

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing_5>` is live, its increment is `<increment>`, and its extension duration is `<extension duration>`.
* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
* Network manipulation is available to delay a bid response.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in USD |
| `<increment>` | The USD increment at the amount being beaten |
| `<extension duration>` | 1800 seconds |

**Steps:**

1. Trade maxima - equal, one `<increment>` apart, far above, far below - including two submitted at the same moment.
2. Delay one user's bid response, then submit the other's before it lands.
3. Push into extended bidding repeatedly, then let one full `<extension duration>` pass.
4. Read each user's standing and their `<grade10 bids url>` history after every exchange.

**Expected Results:**

* Highest bid is never above the leader's maximum and is never reached through a ladder of intermediate bids.
* An equal later maximum is accepted, does not take the lead, and is not reported as a refusal.
* A delayed lower bid never becomes the current bid over a higher one.
* Each user reads only their own maximum, and every standing change is explained by an event in their own history.
* A refused attempt shows on the bid form only, never in either user's history.
* Every surprise is written up with the amounts, the order, and the timing that produced it.

## Settled

- No domain case reads a card hold, a card authorization, a payment confirmation or a bid-time hold switch; the cases that did are rewritten or deprecated (decisions Q1, Q5). A case that reads the card reads that nothing is held or charged on it.
- A refused attempt is not a bid: it shows on the bid form that made it and nowhere in the bidder's history, My Auctions or the lot's public record (decisions Q6).
- A losing row on My Auctions reads "Your card was not charged." (decision Q2).
- HKD increments follow the Bidding page's schedule: HK$80 from HK$4,000 and HK$200 from HK$8,000.
- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-16-default-auction-bid-holds-off** — `grade10-site-auction-e2e-US08-TC1-1` → `g10.auction-dmn.US8-TC1`.
  - **2026-09-17-revise-auction-extended-bidding** — `grade10-site-auction-e2e-US07-TC01-2` → current journey cases are the replacement record.
  - **2026-09-18-add-collector-lot-status** — `grade10-site-auction-e2e-US11-TC01-1` → `g10.auction-dmn.US11-TC1`.
  - **2026-10-02-relay-auction-live-state** — `grade10-site-auction-e2e-US07-TC03-2` → `g10.auction-dmn.US7-TC3`; `grade10-site-auction-e2e-US07-TC04-1` → `g10.auction-dmn.US7-TC4`; `grade10-site-auction-e2e-US12-TC01-1` → `g10.auction-dmn.US12-TC1`; `grade10-site-auction-e2e-US12-TC02-1` → `g10.auction-dmn.US12-TC2`.
  - **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-e2e-US03-TC01-2` → `g10.auction-dmn.US3-TC1`; `grade10-site-auction-e2e-US03-TC02-2` → `g10.auction-dmn.US3-TC2`; `grade10-site-auction-e2e-US04-TC01-1` → `g10.auction-dmn.US4-TC1`; `grade10-site-auction-e2e-US04-TC02-2` → current journey cases are the replacement record; `grade10-site-auction-e2e-US04-TC03-2` → current journey cases are the replacement record; `grade10-site-auction-e2e-US05-TC01-2` → `g10.auction-dmn.US5-TC1`; `grade10-site-auction-e2e-US08-TC01-2` → `g10.auction-dmn.US8-TC1`; `grade10-site-auction-e2e-US08-TC03-2` → `g10.auction-dmn.US8-TC3`; `grade10-site-auction-e2e-US09-TC02-1` → `g10.auction-dmn.US9-TC2`; `grade10-site-auction-e2e-US09-TC03-1` → `g10.auction-dmn.US9-TC3`; `grade10-site-auction-e2e-US10-TC02-2` → current journey cases are the replacement record; `grade10-site-auction-e2e-US12-TC01-1` → `g10.auction-dmn.US12-TC1`.
- Bid fixtures in this suite use the current USD schedule. Settlement choices and invoice facts remain in the winner-order case; TC-k4p joins the auction close to the winner setup and invoiced summary.

## Reconciliation

**Run:** QA2, 2026-10-08. QA1's levels pass composed these paths from every `user-journeys.md` in the domain and the domain's PRD pages, before the feature readings and without any `## Requirements` section, `tech-design.md` or the archive. QA2 joined each composed case to the scenarios its journeys accept, after Q26 to Q29 landed. It is a statement, not proof.

- **Folded in** - `g10.auction-dmn.US13-TC1` walks the house's commit, the outbid letter, extended bidding and the close, asserting `grade10-site-auction-auto-bidding-SC-33`, `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-auction-SC-109`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51`; `g10.auction-dmn.US13-TC2` walks a collector beating the house in extended bidding, asserting `grade10-site-auction-auction-SC-02` and the durable extended-bidding rule
- **Anchors** - QA2 round 4: `grade10-site-auction-auction-SC-02` and `grade10-site-auction-auction-SC-109` now serve `grade10-site-auction-auction-US-01`, so both traces gain that journey; the paths and assertions are unchanged
- **Round 6** - QA2, 2026-10-12: Dev's round-6 reading opens the internal bidder's order at a house win and sends it no letter. `g10.auction-dmn.US13-TC1` and `g10.auction-dmn.US13-TC2` assert only collector reads and letters, which that leaves unchanged, so both keep their version; the internal order is walked by `grade10-admin-auction-e2e-US4-TC2-1`
- **Rejected** - none
- **Raised** - none
- **Uncovered anchors** - none

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - TC-dw9@4 checks the original code and no-charge bidder history before and after reuse, with public removal and replacement lookup. It does not drive cancellation, the non-bidder session or full metadata/hydration, so it receives no scenario link for those outcomes. SC14 is fully checked by lot-status TC-byf@3; SC55 by listing-page TC-2it@3. The other 26 inherited cases retain their identities, bodies and classifications.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - TC-dw9@4 now carries one link, SC07 (the catalogue and search no longer list the called-off lot). It was linked to SC06, SC07, SC08, SC13, SC-11, SC54 and SC55. None of the others is asserted by this route: it has no draft or unsold control (SC06), no watchlist step (SC08), no listing-data read (SC-11), no code-only request (SC13), no client navigation or client lookup (SC54) and no served metadata or hydration read (SC55). The earlier line that the case received no link is corrected by this one. Those scenarios stay covered by TC-7m2@4, TC-x03@2, TC-2it@3 and durable lot-status cases.
- **Coverage** - No uncovered scenario at this level. The case asserts the new outcome: 404 before reuse, the new holder's page after reuse, the bidder row unchanged, the code reserved. It is the one domain case on the released-address path and is traced at domain by US-02, US-03 and US-01.
- **Contradictions** - None in this delta: all 3 durable walks are carried and Walk 3 steps 7-15 match TC-dw9@4. The old case title and 200 result are replaced.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Current cases** - `TC-k4p@3` covers winner-order SC-ug0 and SC-fq4. Its reopened sent order shows USD lines 101.00, 20.20 and 10.01; converted HKD lines 793.00, 159.00 and 79.00; USD subtotal 131.21; HKD subtotal 1,031.00; HKD gross-up fee 38.73 outside both subtotals; and payable 1,069.73 HKD. It checks that no HKD total or fee appears before confirmation and invoice creation.

`TC-wrl` remains draft with `automation, manual` testability and manual automation status. Its corrected current-bid range is 30,000 to 30,500 USD minor units. The domain cases do not claim full coverage of other site feature scenarios based on representative cases.

**Planned verification** - Tasks 7.7-7.9 cover schedule outcomes and auction-history reads. Task 7.10 covers the live bid, Outbid state and 132,500 USD-minor next minimum in SC-43. Planned tasks are not execution evidence. No product test or approval is claimed.
