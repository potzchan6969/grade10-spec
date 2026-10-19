# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened · 0/1
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-08, tcs-rules r4

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
| `<listing_4>` | A live listing with bids, in HKD |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| Item | `<surface>`: The auction catalogue at `<grade10 auction url>`; `<identity>`: the catalogue's own title and description; `<status>`: 200 |
| Item | `<surface>`: `<listing_2>`'s own address; `<identity>`: `<listing_2>`'s title, description and canonical address, in `og:title`, `og:description` and `og:url`; `<status>`: 200 |
| Item | `<surface>`: `<no lot address>`; `<identity>`: the site's not-found surface; `<status>`: 404 |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in HKD |
| `<starting price>` | HKD1,200 (range: 80000–399999 minor units) |
| `<bid amount>` | HKD1,200 (fixed boundary or equality), equal to `<starting price>` |
| `<listing_4>` | A live listing with bids from other users, in HKD, bid count `<bid count>` |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<increment>` | HKD80 (fixed tier increment), the HK$4,000 tier |
| `<bid amount>` | HKD5,039 (fixed derived value), one major unit below `<current bid>` plus `<increment>` |
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
| `<listing_5>` | A live listing with no bids, in HKD |
| `<starting price>` | HKD1,280 (range: 80000–399999 minor units) |
| `<increment>` | HKD260 (fixed tier increment) |
| `<user A maximum>` | HKD8,400 (range: 800000–3999999 minor units) |
| `<user B maximum>` | HKD5,700 (range: 400000–799999 minor units), below `<user A maximum>` |
| `<user B raise>` | HKD9,600 (range: 800000–3999999 minor units), above `<user A maximum>` |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | HKD5,460 (range: 400000–799999 minor units) |
| `<increment>` | HKD200 (fixed tier increment), the HK$8,000 tier at `<user A maximum>` |
| `<user A maximum>` | HKD8,400 (range: 800000–3999999 minor units) |
| `<user B maximum>` | HKD9,600 (range: 800000–3999999 minor units), above `<user A maximum>` |
| `<listing_10>` | A live listing the user has bid on manually and automatically, now led by user B |
| `<listing_7>` | A live listing with bids and a close approaching |
| `<current bid>` | HKD4,960 (range: 400000–799999 minor units) |
| `<time left>` | 7 minutes |
| `<listing_9>` | A live listing with an extension cap, its close already at the cap |
| `<extension window>` / `<extension duration>` | 1800 seconds (30 minutes) each |
| `<bid time>` | 3 minutes before the recorded close, inside `<extension window>` |
| `<new time left>` | Unchanged — the close stays at the cap |
| `<bid amount>` | HKD5,040 (range: 400000–799999 minor units), at the minimum next bid |
| `<listing_8>` | A listing in extended bidding, led by customer A, current bid `<leader price>` |
| `<extension duration>` | 1800 seconds |
| `<time left before bid>` | 4 minutes |
| `<leader price>` | HKD5,460 (range: 400000–799999 minor units) |
| `<increment>` | HKD80 (fixed tier increment), the HK$4,000 tier at `<user B maximum>` |
| `<user A maximum>` | HKD8,400 (range: 800000–3999999 minor units) |
| `<user B maximum>` | HKD5,700 (range: 400000–799999 minor units), below `<user A maximum>` |
| `<user B maximum>` | HKD9,600 (range: 800000–3999999 minor units), above `<user A maximum>` |
| `<increment>` | HKD200 (fixed tier increment), the HK$8,000 tier at `<user A maximum>` |
| `<device skew>` | 4 minutes behind |
| `<leader price>` | HKD5,460 (range: 400000–799999 minor units) |

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
| `<listing_14>` | An open HKD listing with no bids, starting price `<starting price>` |
| `<starting price>` | HKD280 (range: 1000–79999 minor units) |
| `<increment>` | HKD10 (fixed tier increment), the HKD step at `<user A maximum>` |
| `<user A maximum>` | HKD560 (range: 1000–79999 minor units) |
| `<user B maximum>` | HKD920 (range: 80000–399999 minor units), above `<user A maximum>` |
| `<price after A>` | `<starting price>` |
| `<price after B>` | `<user A maximum>` plus `<increment>` |
| `<no lot address>` | An address under the auction's lots naming no published lot |
| lot_1 | A lot that was published, listed in the catalogue, then called off by an operator |
| lot_1 address | The address of `<lot_1>` from when it was published |
| `<listing_15>` | An HKD listing in extended bidding, led by customer A |
| `<final price>` | HKD5,780 (fixed derived value), `<user B maximum>` plus its 8000 increment |
| `<user A maximum>` | HKD8,400 (fixed derived value), above `<final price>` |
| `<user B maximum>` | HKD5,700 (fixed derived value), below `<final price>` |
| `<listing_16>` | An HKD listing in extended bidding, led by customer A |
| `<final price>` | HKD5,780 (fixed derived value) |

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

## g10.auction-dmn.US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot gone from browse and search,
**so that** its former address answers the current lot or Page not found.

<!-- trace:case id=g10.auction-dmn.TC-dw9 rev=4 covers=g10.auction-lot-status.SC-pe2 -->
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

## Reconciliation

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
