# grade10-site/auction/listing-page Test Cases

**Status:** reopened · 0/57
**Reviewed:** 2026-09-01, lapsed 2026-09-29
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector opens a lot at its own address and adjacent checks

**Starting state:**

- No additional setup is named by these cases.

### Route

1. Navigate to <a published lot url>.
   - Response status is 200 and the lot page renders. g10.auction-listing-page.US1-TC1
2. Check the rendered page.
   - URL contains <lang>. g10.auction-listing-page.US1-TC1
3. Check the page source.
   - Page source carries that lot's name, description, and bidding standing. g10.auction-listing-page.US1-TC1
4. Navigate to <a published lot url> and note name, standing, title, meta description and `og:url`.
   - Each response carries its own lot's name and standing. g10.auction-listing-page.US1-TC2
5. Navigate to <a second published lot url> and note the same.
   - Each response carries its own title, meta description and `og:url`. g10.auction-listing-page.US1-TC2
6. Navigate to <a published lot url>.
   - Page source carries `og:title`, `og:description` and `og:url` naming that lot and its own address. g10.auction-listing-page.US2-TC1
7. Check the page source for `og:title`, `og:description` and `og:url`.
   - None of them names the auction catalogue in its place. g10.auction-listing-page.US2-TC1

## Walk 2: Collector opens an address that names no lot

**Starting state:**

- `<draft lot>` is a draft that is not published.

**Shared test data:**

| Item | Value |
| --- | --- |
| draft lot | A draft lot that is not published |
| draft lot url | That lot's canonical address |

### Route

1. Navigate to <a lot address naming no published lot>.
2. Check the rendered page.
3. Check the response status.
   - Response status is 404. g10.auction-listing-page.US3-TC1
   - The site's not-found surface is on screen. g10.auction-listing-page.US3-TC1
4. Navigate to <a published lot url>.
   - Response status is 200. g10.auction-listing-page.US3-TC2
5. Check the response status and the rendered page.
   - The page is that lot's page. g10.auction-listing-page.US3-TC2
6. Navigate to `<draft lot url>`.
7. Check the response status.
   - response status is 404. g10.auction-listing-page.US3-TC3
8. Check the rendered page.
   - the site's Page not found screen is on screen, not the lot and not the catalogue. g10.auction-listing-page.US3-TC3

## Walk 3: Collector reads a live lot while scripts load

**Starting state:**

- No additional setup is named by these cases.

### Route

1. Navigate to <a published lot url>.
2. Note the served name, description and standing in the document.
3. Wait until scripts finish loading.
4. Check the same fields on screen.
   - The same lot is on screen with its served name, description and standing still present. g10.auction-listing-page.US4-TC1
   - None of them is replaced by a loading placeholder. g10.auction-listing-page.US4-TC1
5. Navigate to <a published lot url>.
6. Note how long bidding has left in the document.
7. Wait until scripts finish loading.
8. Check how long bidding has left on screen.
   - What is on screen continues from what the document carried, rather than contradicting it. g10.auction-listing-page.US4-TC2

## Walk 4: Collector reaches a lot from the catalogue

**Starting state:**

- No additional setup is named by these cases.

### Route

1. Navigate to <grade10 auction url>.
2. Open <a published lot> the catalogue lists.
   - The browser is on that lot's address, showing that lot's page. g10.auction-listing-page.US5-TC1
3. Fetch `<grade10 sitemap url>`.
   - `<a published lot>`'s address is listed as an absolute URL of the serving environment. g10.auction-listing-page.US5-TC2
4. Check every sitemap entry.
   - No entry carries an unfilled parameter in place of a lot. g10.auction-listing-page.US5-TC2

## Walk 5: Watch an auction and open My Auctions from the toast

**Starting state:**

- customer(signed in, no bid on <lot_1>, not watching <lot_1>) is on <lot_1 url>.
- customer(signed out) is on <lot_1 url>.

**Shared test data:**

| Item | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, not watched and not bid on by this collector |
| <lot_1> | An open lot taking bids |

### Route

1. Note the current bid, time left and bid panel.
2. Click the Watch control.
   - the control reads Watching. g10.auction-listing-page.US6-TC1
   - a toast says email alerts are on, with View My Auctions. g10.auction-listing-page.US6-TC1
   - current bid, time left and bid panel are unchanged. g10.auction-listing-page.US6-TC1
3. Click View My Auctions in the toast.
   - My Auctions opens and lists <lot_1> once, Your Standing `--`. g10.auction-listing-page.US6-TC1
   - <lot_1>'s email alerts switch is on. g10.auction-listing-page.US6-TC1
4. Click the Watch control.
   - sign-in is offered; no toast says email alerts are on. g10.auction-listing-page.US6-TC2
5. Sign in using the offered sign-in flow.
   - the collector returns to <lot_1 url>. g10.auction-listing-page.US6-TC2
   - the control reads Watch; nothing was watched before sign-in. g10.auction-listing-page.US6-TC2

## Walk 6: Unwatch from the auction and undo

**Starting state:**

- customer(signed in, watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Shared test data:**

| Item | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, watched with email alerts on, not bid on by this collector |

### Route

1. Click the Watching control.
   - the control reads Watch. g10.auction-listing-page.US7-TC1
   - a toast says the lot left My Auctions, with Undo. g10.auction-listing-page.US7-TC1
   - current bid, time left and bid panel are unchanged. g10.auction-listing-page.US7-TC1
2. Open <grade10 my auctions url> in a new tab.
   - <lot_2> is not listed. g10.auction-listing-page.US7-TC1
3. Click the Watching control.
4. Click Undo in the toast.
   - the control reads Watching again. g10.auction-listing-page.US7-TC2
5. Open <grade10 my auctions url> in a new tab.
   - <lot_2> is listed once, Your Standing `--`. g10.auction-listing-page.US7-TC2
   - <lot_2>'s email alerts switch is on. g10.auction-listing-page.US7-TC2

## Walk 7: After bidding, Watching stays locked and adjacent checks

**Starting state:**

- customer(signed in, enrolled to bid, not watching <lot_3>, no bid on <lot_3>) is on <lot_3 url>.
- customer A(signed in, has bid on <lot_4>, outbid) is on <lot_4 url>.
- <closed lot> is closed as the row states.

**Shared test data:**

| Item | Value |
| --- | --- |
| <lot_3> | An open lot taking bids, with no bid from this collector |
| <first bid> | The next valid bid shown on the bid panel |
| <lot_4> | An open lot taking bids, where customer A bid before and customer B now leads |
| <raise> | The next valid bid shown on the bid panel |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

### Route

1. Place <first bid> from the bid panel.
   - a toast says email alerts are on. g10.auction-listing-page.US8-TC1
   - the control reads Watching, disabled. g10.auction-listing-page.US8-TC1
2. Click the Watching control.
   - nothing changes; no Unwatch toast. g10.auction-listing-page.US8-TC1
3. Reload <lot_3 url>.
   - the control still reads Watching, disabled; no alerts toast. g10.auction-listing-page.US8-TC1
4. Place <raise> from the bid panel.
   - No toast says email alerts are on. g10.auction-listing-page.US8-TC2
   - The control reads Watching, disabled. g10.auction-listing-page.US8-TC2
5. Navigate to <closed lot url>.
   - the lot page renders. g10.auction-listing-page.US9-TC1
6. Check the lot image area and the bid panel area.
   - no Watch or Watching control shows anywhere on the lot page. g10.auction-listing-page.US9-TC1

## Walk 8: Collector quotes a published lot

**Starting state:**

- A published lot exists at its own address.
- The lot's listing code is known from the admin listing screen.
- A published lot exists and its listing code is known from the admin listing screen.

### Route

1. Open `<a published lot's address>`.
2. View the page's response source before any script runs.
3. Identify each occurrence of the lot's listing code and inspect its context.
   - The source names the lot by its title. g10.auction-listing-page.US10-TC1
   - The only code occurrence is the lower-case suffix of the canonical address; no labelled listing-code or payment-reference field is present. g10.auction-listing-page.US10-TC1
4. Open `<a published lot's address>` and let the page finish loading its scripts.
5. View the rendered page and its current source.
6. Identify each occurrence of the lot's listing code in both.
   - The rendered page has no labelled listing-code or payment-reference field. g10.auction-listing-page.US10-TC2
   - Every code occurrence in the source is the lower-case suffix of the canonical address. g10.auction-listing-page.US10-TC2
7. Fetch the share-preview metadata for `<a published lot's address>`.
   - The preview's title and description have no labelled listing-code or payment-reference field. g10.auction-listing-page.US10-TC3
8. Search the preview's title, description and url for the lot's listing code.
   - Its URL is the canonical address ending in the lower-case listing-code suffix. Previously cached preview content may persist; the test does not require a purge or regeneration. A fresh preview fetch must satisfy the absence above. g10.auction-listing-page.US10-TC3
9. Open `<a published lot's address>`.
10. Read the browser tab title and the page's meta description.
   - Neither the tab title nor the meta description contains the listing code. g10.auction-listing-page.US10-TC4
11. Open `<a published lot's address>`.
12. View the page's response source.
13. Search any data embedded in the document, outside the visible text, for the lot's listing code.
   - No field in the embedded data carries the listing code. g10.auction-listing-page.US10-TC5
14. Open `<a published lot's address>` and let the page finish loading.
15. Inspect the responses the page's own client-side requests receive.
16. Search those responses for the lot's listing code.
   - No page response contains a separate listing-code or payment-reference field. g10.auction-listing-page.US10-TC6
17. Open the auction's lot-address path, substituting the lot's listing code for its usual identifier.
   - The address does not resolve to that lot's page. g10.auction-listing-page.US10-TC7
   - The site's not-found surface is shown, the same as for any address naming no published lot. g10.auction-listing-page.US10-TC7
18. Open `<a published lot's address>` as a signed-out visitor and search the page and its source for the lot's listing code.
   - Neither view has a labelled listing-code or payment-reference field; the canonical address may end in the lower-case code suffix. g10.auction-listing-page.US10-TC8
19. Open the same address signed in as a registered collector and repeat the search.
   - The title and address shown are identical in both views. g10.auction-listing-page.US10-TC8

## Walk 9: Collector quotes a published lot

**Starting state:**

- A lot's auction has closed with a winning bid, so an order now exists on that lot.
- The catalogue publishes no lot for `<a lot address naming no published lot>`.
- A previously published listing has canonical address `<listing_url>` and code `<listing_code>`.
- The listing has been removed from browse and search without being explicitly deleted.
- A preview for `<listing_url>` was cached while the listing was publicly available.
- The listing is subsequently removed from browse and search, without explicit deletion.
- An authorized admin or the winner knows `<listing_code>`.

### Route

1. Open the lot's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.
   - The page and preview contain no labelled listing-code or payment-reference field. g10.auction-listing-page.US10-TC9
   - The code appears only as the lower-case suffix of the canonical address. g10.auction-listing-page.US10-TC9
4. Fetch `<a lot address naming no published lot>`.
   - Response status is 404. g10.auction-listing-page.US10-TC10
5. Search the response, including any error detail, for a listing code.
   - No listing code appears anywhere in the response. g10.auction-listing-page.US10-TC10
6. Browse the auction catalogue and search for the listing.
7. Open `<listing_url>` directly.
8. Inspect the rendered page, response source and fresh share-preview metadata.
   - Browse and search do not return the listing. g10.auction-listing-page.US10-TC11
   - `<listing_url>` still returns its public listing page. g10.auction-listing-page.US10-TC11
   - The page and fresh preview identify the listing by its public title and canonical URL. g10.auction-listing-page.US10-TC11
   - Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata. g10.auction-listing-page.US10-TC11
   - Removal from browse and search does not release or replace `<listing_url>` or `<listing_code>`. g10.auction-listing-page.US10-TC11
9. Request the existing cached preview for `<listing_url>`.
10. Inspect its title, description, URL, image and embedded metadata.
   - The cached preview may continue to show previously cached public listing metadata and `<listing_url>`. g10.auction-listing-page.US10-TC12
   - It contains no separate listing code or payment reference, internal/provider reference, winner data or admin-only data. g10.auction-listing-page.US10-TC12
   - A persistent preview does not make the listing discoverable through browse or search. g10.auction-listing-page.US10-TC12

## Walk 10: Collector contacts support about a lot

**Starting state:**

- A published lot exists at its own address.
- The lot's listing code is known from the admin listing screen.
- A published lot exists and its listing code is known from a leak or from another surface.
- A lot's auction has closed with a winning bid, so an order now exists on that lot.
- A listing has an allocated canonical address and listing code.

### Route

1. Open `<a published lot's address>`.
2. Inspect the visible page and its source for a labelled listing-code or payment-reference field.
   - The page has no labelled listing-code or payment-reference field for the collector to copy; its canonical address may end in the lower-case code suffix. g10.auction-listing-page.US11-TC1
3. Attempt to open the lot's address by substituting its listing code for the lot's usual identifier.
   - The listing code does not resolve to the lot. g10.auction-listing-page.US11-TC2
   - No working link to the lot can be built from the code alone. g10.auction-listing-page.US11-TC2
4. Open the lot's own address on the public listing page.
   - The title and canonical address are unchanged by the order. g10.auction-listing-page.US11-TC3
5. Note its title and address, and search the page for the lot's listing code.
   - The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix. g10.auction-listing-page.US11-TC3
6. Call the listing off before close.
7. Open its canonical address directly.
8. Search browse and search results for the listing.
9. Try the listing code as the address.
   - The canonical address still resolves to the called-off listing. g10.auction-listing-page.US11-TC4
   - The listing is absent from browse and search. g10.auction-listing-page.US11-TC4
   - The listing code does not resolve as a public route. g10.auction-listing-page.US11-TC4

## Walk 11: Collector sees another bid on the lot without reloading

**Starting state:**

- `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
- customer A is on the lot page for `<listing_1>`.
- customer B(card linked) is signed in on a separate session, on the same lot page.
- `<listing_2>` is open with one accepted bid, its scheduled close under a minute away.
- customer A is on the lot page for `<listing_2>`.
- `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
- customer A is on the lot page for `<listing_1>`, with the browser's live connection to the auction blocked.
- customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<user A maximum>`, and is on its lot page.
- customer A(signed in) leads `<listing_8>` with maximum `<user A maximum>`.
- customer C(signed out) is on the lot page for `<listing_8>`, with the browser's network inspector recording its live connection.
- `<listing_1>` is open in USD, before its scheduled close, with no bid.
- customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the lot page for `<listing_1>`, in English.
- `<listing_5>` is open in USD, before its scheduled close, with no bid.
- customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the lot page for `<listing_5>`, in English.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids, scheduled close more than an hour away |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid count>` | 3 |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |
| `<listing_2>` | An open USD listing with one accepted bid, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<listing_8>` | An open USD listing, scheduled close more than an hour away |
| `<user A maximum>` | USD5,280 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD6,160 (range: 500000–999999 minor units), above `<user A maximum>` |
| `<increment>` | USD80 (fixed tier increment), the US$4,000 tier |
| `<user A maximum>` | USD9,280 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD6,160 (range: 500000–999999 minor units), below `<user A maximum>` |
| `<maximum>` | At least two increments above the opening price |
| `<higher maximum>` | At least two increments above `<maximum>` |

### Route

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.
   - Highest bid reads `<bid amount>` on customer A's page. g10.auction-listing-page.US12-TC1
   - The bid count reads `<bid count>` plus 1. g10.auction-listing-page.US12-TC1
   - Time left still counts to the scheduled close. g10.auction-listing-page.US12-TC1
   - customer A's page did not reload. g10.auction-listing-page.US12-TC1
3. Watch Time left through the scheduled close, without reloading.
4. Read Time left and its label.
   - Time left never reads Closed at the scheduled close. g10.auction-listing-page.US12-TC2
   - Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`. g10.auction-listing-page.US12-TC2
   - The page did not reload. g10.auction-listing-page.US12-TC2
5. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
6. As customer A, wait on the page without reloading.
7. Read Highest bid and the bid count.
   - Highest bid reads `<bid amount>` and the bid count includes customer B's bid. g10.auction-listing-page.US12-TC3
   - customer A's page did not reload. g10.auction-listing-page.US12-TC3
8. Take customer A's browser offline.
9. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
10. Bring customer A's browser back online, without reloading.
11. As customer A, read Highest bid and the bid count.
   - Highest bid reads `<bid amount>` and the bid count includes customer B's bid. g10.auction-listing-page.US12-TC4
   - customer A's page did not reload. g10.auction-listing-page.US12-TC4
12. As customer A, read the standing on the bid panel.
   - reads Leading, with Your maximum `<user A maximum>`. g10.auction-listing-page.US12-TC5
13. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
14. As customer A, without reloading, read the standing, Highest bid and the next valid bid.
   - reads Outbid, with no reload. g10.auction-listing-page.US12-TC5
   - reads Highest bid `<user A maximum>` plus `<increment>`. g10.auction-listing-page.US12-TC5
   - shows the next valid bid, Highest bid plus its increment. g10.auction-listing-page.US12-TC5
15. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
16. As customer C, read every message the live connection received after step 1.
   - shows an update carrying the new price, bid count and close. g10.auction-listing-page.US12-TC6
   - No message carries `<user A maximum>`, an account id, an email or a card detail. g10.auction-listing-page.US12-TC6
   - Any bidder a message names appears only by the lot's pseudonym. g10.auction-listing-page.US12-TC6
17. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
18. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
19. As customer B, read the Recent bids rows at `<maximum>`.
   - customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A leads and set `<maximum>` first, whatever time each row shows. g10.auction-listing-page.US12-TC7
   - customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one. g10.auction-listing-page.US12-TC7
20. Hover the Info control on customer B's row at `<maximum>`.
   - the tip reads When maximums match, the earlier one leads. g10.auction-listing-page.US12-TC7
21. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
22. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
23. As customer C, enter `<higher maximum>` in the custom maximum on the bid panel and confirm it.
24. As customer C, read the current price and the Recent bids rows at `<maximum>`.
   - the current price is above `<maximum>`, and customer C's row leads Recent bids. g10.auction-listing-page.US12-TC8
   - customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A set `<maximum>` first, whatever time each row shows. g10.auction-listing-page.US12-TC8
   - customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one. g10.auction-listing-page.US12-TC8
25. Hover the Info control on customer B's row at `<maximum>`.
   - the tip reads When maximums match, the earlier one leads. g10.auction-listing-page.US12-TC8

## Walk 12: Collector sees another bid on the lot without reloading and adjacent checks

**Starting state:**

- collector A has `<listing_3>` open with a live line.
- customer B(card linked, email `<email_mike>`) can bid on `<listing_3>` from another session.
- `<listing_3>` is open, its close about 12 minutes away.
- customer A is on the lot page for `<listing_3>` on a device whose clock is `<device skew>`.
- customer B is on the same lot page on a device whose clock is correct.
- `<listing_4>` is open with no accepted bid, its close under a minute away.
- customer A is on the lot page for `<listing_4>`.
- customer A is on the lot page for `<listing_3>`.
- The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Shared test data:**

| Item | Value |
| --- | --- |
| email_mike | `mike@example.com` |
| Item | `<device skew>`: 4 minutes ahead |
| Item | `<device skew>`: 4 minutes behind |
| Item | `<device skew>`: Field; Value 2: Value |
| Item | `<device skew>`: `<listing_3>`; Value 2: An open USD listing, close about 12 minutes away |
| `<listing_4>` | An open USD listing with no bids, extension duration 1800s (30mins) |
| `<last moment>` | 0.4 seconds before the close |
| Item | `<away>`: customer A's device sleeps for 45 seconds |
| Item | `<away>`: customer A's browser goes offline for 45 seconds, then reconnects |
| Item | `<away>`: customer A switches to another tab for 45 seconds, then back |
| Item | `<away>`: Field; Value 2: Value |
| Item | `<away>`: `<listing_3>`; Value 2: An open USD listing, close about 12 minutes away |
| Item | `<away>`: `<clock change>`; Value 2: customer A's device clock set 90 seconds ahead |
| `<listing_3>` | An open USD listing, close about 12 minutes away |
| `<correction>` | 0.6 seconds, under a second |

### Route

1. As collector A, watch Recent Bids.
   - The new row appears without a reload. g10.auction-listing-page.US12-TC9
2. As customer B, place an accepted public bid on `<listing_3>`.
   - Its avatar shows `M`. g10.auction-listing-page.US12-TC9
3. As collector A, without reloading, find customer B's new Recent Bids row.
   - Its readable label is a listing pseudonym, not an email. g10.auction-listing-page.US12-TC9
4. Read Time left on customer A's page and customer B's page at the same moment.
   - Both pages read the same Time left, to the second, at step 1. g10.auction-listing-page.US13-TC1
5. Wait 45 seconds.
   - Both pages read the same Time left, to the second, at step 3. g10.auction-listing-page.US13-TC1
6. Read Time left on both pages at the same moment.
   - Neither page is off by `<device skew>`. g10.auction-listing-page.US13-TC1
7. Watch Time left from 10 seconds before the close.
   - Through step 1 Time left shows whole seconds only, never tenths. g10.auction-listing-page.US13-TC2
8. Read Time left at `<last moment>`.
   - At step 2 Time left reads 1 second, never 0. g10.auction-listing-page.US13-TC2
9. Read Time left just after the close passes.
   - At step 3 Time left reads 0 or the lot reads Closed. g10.auction-listing-page.US13-TC2
10. Make `<clock change>` while `<away>`.
11. Return to the lot page, without reloading.
12. Read Time left on customer A's page and customer B's page at the same moment.
   - Both pages read the same Time left, to the second. g10.auction-listing-page.US13-TC3
13. Switch to another tab.
14. Switch back to the lot page.
15. Watch Time left for 5 seconds.
   - Time left never reads a higher value than it read the moment before. g10.auction-listing-page.US13-TC4

## Walk 13: Bidder waits on a closed lot for its result

**Starting state:**

- `<listing_5>` is in the state the row gives, its close under a minute away, and no further bid will be placed.
- `<viewer>` is signed in and on the lot page for `<listing_5>`.
- customer A leads `<listing_6>` and is on its lot page.
- `<listing_6>`'s close is under a minute away, and no further bid will be placed.
- Recording `<listing_6>`'s close is held back until the next sweep.
- customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
- customer A(card linked) is signed in and on the lot page for `<listing_9>`, and has never bid on it.
- Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.
- `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
- customer A(card linked) is signed in and on the lot page for `<listing_10>`.
- `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
- customer A is on the lot page for `<listing_11>`, with its live updates delayed by 5 seconds.
- customer C(card linked) is signed in on a separate session, on the same lot page.
- `<listing_2>` is live in USD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
- customer C is on the lot page for `<listing_2>`, in English.
- `<listing_3>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
- `<listing_4>` is past its close with no bid, its close recorded with no winner.
- customer C is signed in on a separate session.

**Shared test data:**

| Item | Value |
| --- | --- |
| Item | `<listing_5>`: Led by customer A; `<viewer>`: customer A; `<result>`: Won |
| Item | `<listing_5>`: Led by customer A, customer B outbid; `<viewer>`: customer B; `<result>`: Did not win |
| Item | `<listing_5>`: Open with no accepted bid; `<viewer>`: customer A; `<result>`: Ended, with No bids under it |
| `<listing_6>` | A USD listing led by customer A |
| `<listing_9>` | A USD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |
| `<listing_10>` | An open USD listing with no bids, starting price USD280 (range: 10000–49999 minor units), extension duration 1800s (30mins), no cap |
| `<bid amount>` | USD280 (range: 10000–49999 minor units), the opening price |
| `<listing_11>` | A USD listing in extended bidding, led by customer B, extension duration 1800s (30mins), no cap |
| `<bid amount>` | At or above the minimum next bid |

### Route

1. Watch the lot through its close, without reloading.
   - Once the close passes, the page reads Closed with no result. g10.auction-listing-page.US14-TC1
2. Read the lot's state until the result appears.
   - The page then reads `<result>`, without a reload. g10.auction-listing-page.US14-TC1
3. Watch the lot through its close, without reloading.
4. Wait 30 seconds.
5. Reload the lot page.
6. Wait until the close is recorded.
   - Through steps 1 to 3 the page reads Closed with no result. g10.auction-listing-page.US14-TC2
   - No step shows Won, Did not win or Ended before the close is recorded. g10.auction-listing-page.US14-TC2
   - After step 4 the page reads Won, without a reload. g10.auction-listing-page.US14-TC2
7. Wait until 5 seconds after the close, by the auction's clock.
8. Place `<bid amount>`.
9. Read the bid panel.
10. Unblock the auction, reload the lot page and wait until the close is recorded.
11. Read the lot's state and the bid panel.
   - At step 3 the bid panel reads "Your bid did not go through." alone. g10.auction-listing-page.US14-TC4
   - No new label or wording appears for the refused bid. g10.auction-listing-page.US14-TC4
   - At step 5 Highest bid reads `<leader price>`. g10.auction-listing-page.US14-TC4
   - At step 5 customer A's page shows neither Won nor Did not win. g10.auction-listing-page.US14-TC4
12. Wait until 5 seconds after the scheduled close, by the auction's clock.
13. Place `<bid amount>`.
14. Read the bid panel.
15. Unblock the auction, reload the lot page and wait until the close is recorded.
16. Read Time left, the lot's state and the bid panel.
   - At step 3 the bid panel reads "Your bid did not go through." alone. g10.auction-listing-page.US14-TC5
   - At step 5 Time left never read Extended bidding. g10.auction-listing-page.US14-TC5
   - At step 5 the lot reads Ended, with No bids under it. g10.auction-listing-page.US14-TC5
   - At step 5 the page shows neither Won nor Did not win. g10.auction-listing-page.US14-TC5
17. As customer C, place `<bid amount>` 1 second before the recorded close.
18. As customer A, watch Time left through the recorded close, without reloading.
19. As customer A, read the lot's state and the bid panel once the update arrives.
   - Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled. g10.auction-listing-page.US14-TC6
   - At step 3 Time left is labelled Extended bidding and counts to customer C's bid time plus 1800s. g10.auction-listing-page.US14-TC6
   - At step 3 the bid controls are enabled. g10.auction-listing-page.US14-TC6
   - No step shows Won, Did not win or Ended, and the page did not reload. g10.auction-listing-page.US14-TC6
20. As customer C, read Recent bids before the close.
   - no row shows a crown. g10.auction-listing-page.US14-TC7
21. Wait for the close to be recorded as sold to customer A, without reloading.
22. As customer C, read Recent bids again.
   - customer A's winning row shows a crown named Winner after the amount. g10.auction-listing-page.US14-TC7
   - no other row, customer B's included, shows a crown. g10.auction-listing-page.US14-TC7
23. As customer C, open the lot page for `<listing_3>` and read Recent bids.
   - the lot reads Closed and no row shows a crown. g10.auction-listing-page.US14-TC8
24. As customer C, open the lot page for `<listing_4>` and read Recent bids.
   - the lot reads Ended with No bids under it, Recent bids holds no row, and no crown shows. g10.auction-listing-page.US14-TC8

## Walk 14: Collector tells Recent Bids rivals apart by avatar letter

**Starting state:**

- `<listing_1>` is open in USD.
- customer A(card linked, email `<email_ada>`) and customer B(card linked, email `<email_bob>`) each have an accepted public bid on `<listing_1>`.
- A collector is on the lot page for `<listing_1>` in English.
- customer A(signed in, card linked, email `<email_ada>`) has an accepted public bid on open `<listing_2>` and is on that lot page.

**Shared test data:**

| Item | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| email_bob | `bob@example.com` |

### Route

1. Open Recent Bids on the lot page.
2. Find customer A's public row and customer B's public row.
   - Customer A's avatar shows `A`. g10.auction-listing-page.US15-TC1
   - Customer B's avatar shows `B`. g10.auction-listing-page.US15-TC1
   - Neither row shows an email or personal name. g10.auction-listing-page.US15-TC1
   - Readable labels stay listing pseudonyms or You, not an email-prefixed form. g10.auction-listing-page.US15-TC1
3. Open Recent Bids.
   - The You row's avatar shows `A`. g10.auction-listing-page.US15-TC2
4. Find the row marked You.
   - The row still shows the You badge. g10.auction-listing-page.US15-TC2

## g10.auction-listing-page.US1: Collector opens a lot at its own address

**As a** collector,
**I want** a lot's address to answer with that lot's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

### g10.auction-listing-page.US1-TC1: Lot answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**
The catalogue publishes <a published lot>. JavaScript disabled in the browser.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Response status is 200 and the lot page renders.
* URL contains <lang>.
* Page source carries that lot's name, description, and bidding standing.

<!-- trace:case id=g10.auction-listing-page.TC-82e rev=2 -->
### g10.auction-listing-page.US1-TC2: Two lots answer as two pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**
The catalogue publishes two lots.

**Steps:**

1. Navigate to <a published lot url> and note name, standing, title, meta description and `og:url`.
2. Navigate to <a second published lot url> and note the same.

**Expected Results:**

* Each response carries its own lot's name and standing.
* Each response carries its own title, meta description and `og:url`.

<!-- trace:case id=g10.auction-listing-page.TC-2it rev=4 -->
### g10.auction-listing-page.US1-TC3: Reused address serves only its eligible current holder

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
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* customer has `<reused_address>` saved before `<old_lot>` was called off.
* `<new_lot>` is the eligible current holder in `<replacement_state>`.
* No bid or standing change occurs during this pass.
* The browser runs no client-side scripts.

**Test data:**

| Field | Value |
| --- | --- |
| old_lot | A called-off listing with a different title and description |
| new_lot | The eligible current holder, with its own title, description and bidding standing |
| reused_address | The original address shared by both listings |

| `<replacement_state>` |
| --- |
| Published, open to collectors |
| Closed, retained by public lookup |
| Settled, retained by public lookup |

**Steps:**

1. Navigate to `<reused_address>`.
2. Read the served page.
3. Inspect its title, description and Open Graph metadata.
4. Inspect embedded data and fresh share-preview metadata.
5. Enable scripts on this same address.
6. Read the hydrated page and client lookup data.

**Expected Results:**

* Step 1 returns 200 at `<reused_address>`.
* Step 2 shows `<new_lot>`'s content and standing.
* Step 3 names `<new_lot>` and `<reused_address>`.
* No content or fresh metadata identifies `<old_lot>`.
* No redirect or called-off page appears.
* Step 4 names only `<new_lot>` as the current holder.
* Preview title, description and URL identify `<new_lot>`.
* No separate listing-code or payment-reference field appears.
* A code appears only within the full canonical address.
* The served document title and meta description name `<new_lot>`.
* Its canonical address and og:url equal `<reused_address>`.
* og:title and og:description name `<new_lot>`.
* Step 6 keeps the same `<new_lot>`, title, description and bidding standing.
* No placeholder, old-lot content or separate code field replaces served content.

<!-- trace:case id=g10.auction-listing-page.TC-tof rev=3 -->
### g10.auction-listing-page.US1-TC4: Client navigation opens the eligible replacement lot

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
* **Trace:** grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* customer has `<reused_address>` saved before `<old_lot>` was called off.
* `<new_lot>` is public and holds that released slug.
* customer is on the auction catalogue with scripts running.
* A saved link in this session names `<reused_address>`.

**Test data:**

| Field | Value |
| --- | --- |
| old_lot | A called-off listing with a different title and description |
| new_lot | The eligible current holder, with its own title and description |
| reused_address | The original address shared by both listings |

**Steps:**

1. Open the saved link through client navigation.
2. Read the lot page after its lookup completes.
3. Reload `<reused_address>`.
4. Read the served page.
5. Inspect hydrated DOM, lookup response and fresh preview metadata.

**Expected Results:**

* Step 2 shows `<new_lot>`'s content and standing.
* The address remains `<reused_address>`.
* Step 3 returns 200.
* Step 4 shows the same `<new_lot>`.
* No content identifies `<old_lot>`.
* No redirect or called-off page appears.
* Step 5 names `<new_lot>`, its title and full address.
* Neither `<old_lot>` nor its data appears.
* No separate listing-code or payment-reference field appears.

---

## g10.auction-listing-page.US2: Collector shares a lot link

**As a** collector,
**I want** a lot link to unfurl as that lot and its own canonical address,
**so that** a link I pass on names the lot it points at instead of the auction
catalogue.

<!-- trace:case id=g10.auction-listing-page.TC-89i rev=2 -->
### g10.auction-listing-page.US2-TC1: Shared lot link unfurls as that lot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-02

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the page source for `og:title`, `og:description` and `og:url`.

**Expected Results:**

* Page source carries `og:title`, `og:description` and `og:url` naming that lot and its own address.
* None of them names the auction catalogue in its place.

---

## g10.auction-listing-page.US3: Collector opens an address that names no lot

**As a** collector,
**I want** an address under the auction's lots that names no published lot to
answer with the site's not-found surface,
**so that** I am never shown an empty lot page or the catalogue in its place.

<!-- trace:case id=g10.auction-listing-page.TC-3xv rev=2 -->
### g10.auction-listing-page.US3-TC1: Unknown lot address returns not-found

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**
The catalogue publishes no lot for <a lot address naming no published lot>.

**Steps:**

1. Navigate to <a lot address naming no published lot>.
2. Check the rendered page.
3. Check the response status.

**Expected Results:**

* Response status is 404.
* The site's not-found surface is on screen.

<!-- trace:case id=g10.auction-listing-page.TC-6r8 rev=2 -->
### g10.auction-listing-page.US3-TC2: Published lot address returns the lot page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**
The catalogue publishes <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 200.
* The page is that lot's page.

<!-- trace:case id=g10.auction-listing-page.TC-pdz rev=5 -->
### g10.auction-listing-page.US3-TC3: Unavailable original address serves Page not found

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
* **Trace:** grade10-site-auction-listing-page-US-03


Runs once per row of **Test data**.

**Pre-conditions:**

* customer is outside the business and has `<original_address>` saved.
* The original listing is in `<state>`.
* No eligible public listing holds its original slug.
* The browser runs no client-side scripts.
* For called-off rows, the collector watched the original before call off.

**Test data:**

| `<state>` | `<original_address>` |
| --- | --- |
| Draft, never published | The draft's address |
| Called off in this pass | Its saved address before call off |
| Called off before this release | Its saved address before call off |
| Called off, slug saved by a new unpublished draft | The shared slug's address |
| Called off, slug held by a created unpublished replacement | The shared slug's address |

**Steps:**

1. Navigate to `<original_address>`.
2. Check the response status.
3. Check the served page.
4. Inspect its response body and embedded data.
5. Open the original listing code alone as the lot address.
6. Inspect that response and page.
7. Open the original collector's watchlist.
8. Search for the called-off original listing.

**Expected Results:**

* Step 2 returns 404.
* Step 3 shows Page not found.
* Neither original listing nor unpublished replacement appears.
* No empty lot page, redirect or catalogue replaces it.
* Step 4 contains no original-lot or replacement-lot data.
* Step 4 contains no listing code or payment reference.
* Step 5 returns 404.
* Step 6 shows Page not found with no lot data or code.
* Step 8 does not show the called-off original in the watchlist.
* An unpublished replacement does not appear there either.

<!-- trace:case id=g10.auction-listing-page.TC-x03 rev=3 -->
### g10.auction-listing-page.US3-TC4: Client navigation refuses an ineligible released address

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* customer is on the auction catalogue with scripts running.
* `<old_lot>` is called off and `<holder_state>` applies.
* A saved link in this session names `<released_address>`.

**Test data:**

| `<holder_state>` | `<released_address>` |
| --- | --- |
| No listing holds the released slug | `<old_lot>`'s former address |
| A new unpublished draft holds the released slug | `<old_lot>`'s former address |
| A created unpublished replacement holds the released slug | `<old_lot>`'s former address |

**Steps:**

1. Open the saved link through client navigation.
2. Read the page after its lookup completes.
3. Inspect the client lookup response.
4. Reload the address.
5. Open the original code alone through client navigation.
6. Reload that code-only address.

**Expected Results:**

* Step 2 shows Page not found.
* Neither `<old_lot>` nor the unpublished holder appears.
* Step 3 contains no lot data or listing code.
* Step 4 returns 404 with the same not-found surface.
* Steps 5 and 6 show Page not found, with no lot data.
* Step 6 returns 404 and no listing code.
* No redirect, empty lot page or catalogue replaces it.

---

## g10.auction-listing-page.US4: Collector reads a live lot while scripts load

**As a** collector,
**I want** the lot I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

<!-- trace:case id=g10.auction-listing-page.TC-wka rev=2 -->
### g10.auction-listing-page.US4-TC1: Served lot stays on screen after scripts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-04

**Pre-conditions:**
<a published lot> is on the catalogue.

**Steps:**

1. Navigate to <a published lot url>.
2. Note the served name, description and standing in the document.
3. Wait until scripts finish loading.
4. Check the same fields on screen.

**Expected Results:**

* The same lot is on screen with its served name, description and standing still present.
* None of them is replaced by a loading placeholder.

<!-- trace:case id=g10.auction-listing-page.TC-e6y rev=2 -->
### g10.auction-listing-page.US4-TC2: Clock value continues from the served document

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-04

**Pre-conditions:**
a bidding countdown is shown on <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Note how long bidding has left in the document.
3. Wait until scripts finish loading.
4. Check how long bidding has left on screen.

**Expected Results:**

* What is on screen continues from what the document carried, rather than contradicting it.

---

## g10.auction-listing-page.US5: Collector reaches a lot from the catalogue

**As a** collector,
**I want** to open a lot's own address from the catalogue without a page load,
**so that** the lot I picked out of the list is the page I land on.

<!-- trace:case id=g10.auction-listing-page.TC-fe3 rev=2 -->
### g10.auction-listing-page.US5-TC1: Catalogue opens the lot's own address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-05

**Pre-conditions:**
The collector is viewing the auction catalogue, which lists <a published lot>.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Open <a published lot> the catalogue lists.

**Expected Results:**

* The browser is on that lot's address, showing that lot's page.

<!-- trace:case id=g10.auction-listing-page.TC-edm rev=3 -->
### g10.auction-listing-page.US5-TC2: Sitemap lists each published lot

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-05

**Decided by:** `grade10:apps/frontend/grade10/src/serving/sitemap.test.tsx`

**Pre-conditions:**
The catalogue holds `<a published lot>`.

**Steps:**

1. Fetch `<grade10 sitemap url>`.
2. Check every sitemap entry.

**Expected Results:**

* `<a published lot>`'s address is listed as an absolute URL of the serving environment.
* No entry carries an unfilled parameter in place of a lot.

---

## g10.auction-listing-page.US6: Watch an auction and open My Auctions from the toast

**As a** collector on a lot I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that lot without hunting for the account page.

<!-- trace:case id=g10.auction-listing-page.TC-4op rev=2 -->
### g10.auction-listing-page.US6-TC1: Watch announces alerts on and opens My Auctions

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
* **Trace:** grade10-site-auction-listing-page-US-06

**Pre-conditions:**

* customer(signed in, no bid on <lot_1>, not watching <lot_1>) is on <lot_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Note the current bid, time left and bid panel.
2. Click the Watch control.
3. Click View My Auctions in the toast.

**Expected Results:**

* Step 2: the control reads Watching.
* Step 2: a toast says email alerts are on, with View My Auctions.
* Step 2: current bid, time left and bid panel are unchanged.
* Step 3: My Auctions opens and lists <lot_1> once, Your Standing `--`.
* Step 3: <lot_1>'s email alerts switch is on.

<!-- trace:case id=g10.auction-listing-page.TC-sip rev=2 -->
### g10.auction-listing-page.US6-TC2: Signed-out viewer is offered sign-in, no watch

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-06

**Pre-conditions:**

* customer(signed out) is on <lot_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids |

**Steps:**

1. Click the Watch control.
2. Sign in using the offered sign-in flow.

**Expected Results:**

* Step 1: sign-in is offered; no toast says email alerts are on.
* Step 2: the collector returns to <lot_1 url>.
* Step 2: the control reads Watch; nothing was watched before sign-in.

---

## g10.auction-listing-page.US7: Unwatch from the auction and undo

**As a** collector who watched a lot without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the lot again.

<!-- trace:case id=g10.auction-listing-page.TC-pjv rev=2 -->
### g10.auction-listing-page.US7-TC1: Unwatch removes the lot and turns alerts off

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer(signed in, watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, watched with email alerts on, not bid on by this collector |

**Steps:**

1. Click the Watching control.
2. Open <grade10 my auctions url> in a new tab.

**Expected Results:**

* Step 1: the control reads Watch.
* Step 1: a toast says the lot left My Auctions, with Undo.
* Step 1: current bid, time left and bid panel are unchanged.
* Step 2: <lot_2> is not listed.

<!-- trace:case id=g10.auction-listing-page.TC-i5l rev=2 -->
### g10.auction-listing-page.US7-TC2: Undo restores the watch with alerts on

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
* **Trace:** grade10-site-auction-listing-page-US-07

**Pre-conditions:**

* customer(signed in, watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, watched with email alerts on, not bid on by this collector |

**Steps:**

1. Click the Watching control.
2. Click Undo in the toast.
3. Open <grade10 my auctions url> in a new tab.

**Expected Results:**

* Step 2: the control reads Watching again.
* Step 3: <lot_2> is listed once, Your Standing `--`.
* Step 3: <lot_2>'s email alerts switch is on.

---

## g10.auction-listing-page.US8: After bidding, Watching stays locked

**As a** bidder on this lot,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the lot,
**so that** I am not invited to unwatch money I already put down, and I am not toasted on every revisit.

<!-- trace:case id=g10.auction-listing-page.TC-jhd rev=2 -->
### g10.auction-listing-page.US8-TC1: First bid locks Watching and toasts alerts once

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
* **Trace:** grade10-site-auction-listing-page-US-08

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching <lot_3>, no bid on <lot_3>) is on <lot_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | An open lot taking bids, with no bid from this collector |
| <first bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Place <first bid> from the bid panel.
2. Click the Watching control.
3. Reload <lot_3 url>.

**Expected Results:**

* Step 1: a toast says email alerts are on.
* Step 1: the control reads Watching, disabled.
* Step 2: nothing changes; no Unwatch toast.
* Step 3: the control still reads Watching, disabled; no alerts toast.

<!-- trace:case id=g10.auction-listing-page.TC-amc rev=2 -->
### g10.auction-listing-page.US8-TC2: A second bid on the lot shows no alerts toast

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-08

**Pre-conditions:**

* customer A(signed in, has bid on <lot_4>, outbid) is on <lot_4 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | An open lot taking bids, where customer A bid before and customer B now leads |
| <raise> | The next valid bid shown on the bid panel |

**Steps:**

1. Place <raise> from the bid panel.

**Expected Results:**

* No toast says email alerts are on.
* The control reads Watching, disabled.

---

## g10.auction-listing-page.US9: Closed lot has no watch control

**As a** collector on a closed lot (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

<!-- trace:case id=g10.auction-listing-page.TC-84a rev=2 -->
### g10.auction-listing-page.US9-TC1: A closed lot shows no watch control

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-09

**Pre-conditions:**

* <closed lot> is closed as the row states.

**Test data:**

| Closed lot | Viewer |
| --- | --- |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

**Steps:**

1. Navigate to <closed lot url>.
2. Check the lot image area and the bid panel area.

**Expected Results:**

* Step 1: the lot page renders.
* Step 2: no Watch or Watching control shows anywhere on the lot page.

---

## g10.auction-listing-page.US10: Collector quotes a published lot

**As a** collector browsing a listing,
**I want** to reference and share a lot by its title and URL,
**so that** I can discuss it with others and return to it easily.

<!-- trace:case id=g10.auction-listing-page.TC-nis rev=2 -->
### g10.auction-listing-page.US10-TC1: Listing code absent from the response before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source before any script runs.
3. Identify each occurrence of the lot's listing code and inspect its context.

**Expected Results:**

* The source names the lot by its title.
* The only code occurrence is the lower-case suffix of the canonical address; no labelled listing-code or payment-reference field is present.

<!-- trace:case id=g10.auction-listing-page.TC-87q rev=4 -->
### g10.auction-listing-page.US10-TC2: Listing code absent from the page once scripts finish running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.
* Its bidding standing stays unchanged during the pass.
* The browser initially runs no scripts.

**Steps:**

1. Open `<a published lot's address>` with scripts disabled.
2. Record its served title, description and bidding standing.
3. Enable scripts on the same address.
4. Read the hydrated page, DOM, source and document metadata.
5. Inspect every listing-code occurrence.

**Expected Results:**

* Step 2 provides the addressed lot's title, description and bidding standing.
* Step 4 keeps those same served values after hydration.
* No placeholder replaces served content.
* Hydrated DOM and document metadata name the same lot.
* No separate listing-code or payment-reference field appears.
* A code occurs only within the full canonical address.

<!-- trace:case id=g10.auction-listing-page.TC-5rp rev=4 -->
### g10.auction-listing-page.US10-TC3: Listing code absent from the shared-link preview

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Fetch the share-preview metadata for `<a published lot's address>`.
2. Search the preview's title, description and url for the lot's listing code.
3. Inspect the preview image and embedded metadata.
4. Read the same address's document title and meta description.

**Expected Results:**

* The preview's title and description have no labelled listing-code or payment-reference field.
* Its URL is the canonical address ending in the lower-case listing-code suffix.

Previously cached preview content may persist; the test does not require a
purge or regeneration. A fresh preview fetch must satisfy the absence above.
* The preview identifies the public lot by title and full address.
* Image and embedded metadata expose no separate code or payment reference.
* Step 4 identifies the same public lot by title and description.
* Neither document field contains a listing code or payment reference.

<!-- trace:case id=g10.auction-listing-page.TC-zq9 rev=3 -->
### g10.auction-listing-page.US10-TC4: Listing code absent from the page title and meta description

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Read the browser tab title and the page's meta description.
3. Compare the title and description with the addressed lot.

**Expected Results:**

* Neither the tab title nor the meta description contains the listing code.
* Both identify the addressed lot, never the auction catalogue.

<!-- trace:case id=g10.auction-listing-page.TC-udy rev=2 -->
### g10.auction-listing-page.US10-TC5: Listing code absent from the page's embedded data

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source.
3. Search any data embedded in the document, outside the visible text, for the lot's listing code.

**Expected Results:**

* No field in the embedded data carries the listing code.

<!-- trace:case id=g10.auction-listing-page.TC-yjo rev=2 -->
### g10.auction-listing-page.US10-TC6: Listing code absent from the page's own network responses

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` and let the page finish loading.
2. Inspect the responses the page's own client-side requests receive.
3. Search those responses for the lot's listing code.

**Expected Results:**

* No page response contains a separate listing-code or payment-reference field.

<!-- trace:case id=g10.auction-listing-page.TC-cbx rev=2 -->
### g10.auction-listing-page.US10-TC7: Listing code does not resolve as a lot address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists and its listing code is known from the admin listing screen.

**Steps:**

1. Open the auction's lot-address path, substituting the lot's listing code for its usual identifier.

**Expected Results:**

* The address does not resolve to that lot's page.
* The site's not-found surface is shown, the same as for any address naming no published lot.

<!-- trace:case id=g10.auction-listing-page.TC-udv rev=2 -->
### g10.auction-listing-page.US10-TC8: Listing code stays absent regardless of the collector's signed-in state

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` as a signed-out visitor and search the page and its source for the lot's listing code.
2. Open the same address signed in as a registered collector and repeat the search.

**Expected Results:**

* Neither view has a labelled listing-code or payment-reference field; the canonical address may end in the lower-case code suffix.
* The title and address shown are identical in both views.

<!-- trace:case id=g10.auction-listing-page.TC-6de rev=3 -->
### g10.auction-listing-page.US10-TC9: Listing code stays absent once an order exists on the lot

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
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.
4. Inspect hydrated DOM, page lookup responses, title and description.

**Expected Results:**

* The page and preview contain no labelled listing-code or payment-reference field.
* The code appears only as the lower-case suffix of the canonical address.
* All surfaces name the same lot and its full address.
* Title and description contain no listing code or payment reference.
* Embedded and network data contain no separate code or payment reference.

<!-- trace:case id=g10.auction-listing-page.TC-y7l rev=3 -->
### g10.auction-listing-page.US10-TC10: An address naming no lot carries no listing code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* The catalogue publishes no lot for `<a lot address naming no published lot>`.

**Steps:**

1. Fetch `<a lot address naming no published lot>`.
2. Search the response, including any error detail, for a listing code.
3. Check the not-found page and embedded data.

**Expected Results:**

* Response status is 404.
* No listing code appears anywhere in the response.
* No lot content or separate payment reference appears.

<!-- trace:case id=g10.auction-listing-page.TC-90g rev=3 -->
### g10.auction-listing-page.US10-TC11: Closed and settled listings retain their public addresses

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
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A previously published listing has canonical address `<listing_url>` and code `<listing_code>`.
* The listing is closed or settled, and removed from browse and search without explicit deletion.
* The listing was not called off.

**Steps:**

1. Browse the auction catalogue and search for the listing.
2. Open `<listing_url>` directly.
3. Inspect the rendered page, response source and fresh share-preview metadata.

**Expected Results:**

* Browse and search do not return the listing.
* `<listing_url>` still returns its public listing page.
* The page and fresh preview identify the listing by its public title and canonical URL.
* Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata.
* Removal from browse and search does not release or replace `<listing_url>` or `<listing_code>`.

<!-- trace:case id=g10.auction-listing-page.TC-k71 rev=2 -->
### g10.auction-listing-page.US10-TC12: A cached preview may persist after browse/search removal without private data

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
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A preview for `<listing_url>` was cached while the listing was publicly available.
* The listing is subsequently removed from browse and search, without explicit deletion.
* An authorized admin or the winner knows `<listing_code>`.

**Steps:**

1. Request the existing cached preview for `<listing_url>`.
2. Inspect its title, description, URL, image and embedded metadata.

**Expected Results:**

* The cached preview may continue to show previously cached public listing metadata and `<listing_url>`.
* It contains no separate listing code or payment reference, internal/provider reference, winner data or admin-only data.
* A persistent preview does not make the listing discoverable through browse or search.

---

## g10.auction-listing-page.US11: Collector contacts support about a lot

**As a** collector contacting support about a lot,
**I want** support to quickly identify which lot I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

<!-- trace:case id=g10.auction-listing-page.TC-du4 rev=4 -->
### g10.auction-listing-page.US11-TC1: No listing code available on the page for the collector to send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Read the public lot title and full address.
3. Inspect the page and source for a separate code field.
4. As admin(support), find the public lot by that title.
5. Open the matched lot.

**Expected Results:**

* Step 2 provides the public title and full address.
* Step 3 offers no separate code or payment reference.
* Step 4 finds the lot without a listing code.
* Support lookup shows no separate listing-code or payment-reference field.
* Step 5 identifies the same lot by title and full address.
* The opened public lot shows no separate code to support.

<!-- trace:case id=g10.auction-listing-page.TC-wxd rev=2 -->
### g10.auction-listing-page.US11-TC2: A listing code known from elsewhere gives no working link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists and its listing code is known from a leak or from another surface.

**Steps:**

1. Attempt to open the lot's address by substituting its listing code for the lot's usual identifier.

**Expected Results:**

* The listing code does not resolve to the lot.
* No working link to the lot can be built from the code alone.

<!-- trace:case id=g10.auction-listing-page.TC-h6y rev=3 -->
### g10.auction-listing-page.US11-TC3: Title and address stay the collector's only reference once an order exists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. Note its title and address.
3. Inspect DOM, source, embedded data and fresh preview metadata.
4. As admin(support), find and open the lot by title.

**Expected Results:**

* The title and canonical address are unchanged by the order.
* The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix.
* Step 3 exposes no separate code or payment reference.
* Step 4 finds the same lot without a code.

<!-- trace:case id=g10.auction-listing-page.TC-sa9 rev=3 -->
### g10.auction-listing-page.US11-TC4: Called-off listing remains directly accessible

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A listing has an allocated canonical address and listing code.

**Steps:**

1. Call the listing off before close.
2. Open its canonical address directly.
3. Search browse and search results for the listing.
4. Try the listing code as the address.

**Expected Results:**

* The canonical address still resolves to the called-off listing.
* The listing is absent from browse and search.
* The listing code does not resolve as a public route.

**Retired:** Permanent called-off access is replaced by released-address cases in US3 and the auction domain cancellation walk.

---

## g10.auction-listing-page.US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

<!-- trace:case id=g10.auction-listing-page.TC-3rf rev=2 -->
### g10.auction-listing-page.US12-TC1: Another session's bid shows its price and bid count without a reload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids, scheduled close more than an hour away |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid count>` | 3 |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.

**Expected Results:**

* Highest bid reads `<bid amount>` on customer A's page.
* The bid count reads `<bid count>` plus 1.
* Time left still counts to the scheduled close.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-d35 rev=2 -->
### g10.auction-listing-page.US12-TC2: Scheduled close with a bid turns to Extended bidding without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_2>` is open with one accepted bid, its scheduled close under a minute away.
* customer A is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open USD listing with one accepted bid, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |

**Steps:**

1. Watch Time left through the scheduled close, without reloading.
2. Read Time left and its label.

**Expected Results:**

* Time left never reads Closed at the scheduled close.
* Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`.
* The page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-b7y rev=2 -->
### g10.auction-listing-page.US12-TC3: A page with no live line still catches up without a reload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`, with the browser's live connection to the auction blocked.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids, scheduled close more than an hour away |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, wait on the page without reloading.
3. Read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-nz3 rev=2 -->
### g10.auction-listing-page.US12-TC4: A page that lost its line catches up when it returns

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open USD listing with bids, scheduled close more than an hour away |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps:**

1. Take customer A's browser offline.
2. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
3. Bring customer A's browser back online, without reloading.
4. As customer A, read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-5ps rev=3 covers=g10.auction-listing-page.SC-7c2 -->
### g10.auction-listing-page.US12-TC5: Leader's own standing turns to Outbid without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<user A maximum>`, and is on its lot page.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open USD listing, scheduled close more than an hour away |
| `<current bid>` | USD1200 (120000 USD minor units) |
| `<user A maximum>` | USD1275 (127500 USD minor units) |
| `<user B maximum>` | USD1300 (130000 USD minor units), above `<user A maximum>` |
| `<increment>` | USD25 (2500 USD minor units), the USD1000 tier increment |

**Steps:**

1. As customer A, read the standing on the bid panel.
2. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read the standing, Highest bid and the next valid bid.

**Expected Results:**

* Step 1 reads Leading, with Your maximum `<user A maximum>`.
* Step 3 reads Outbid, with no reload.
* Step 3 reads Highest bid 130000 USD minor units, `<user A maximum>` plus `<increment>`.
* Step 3 shows 132500 USD minor units as the minimum next valid bid.

<!-- trace:case id=g10.auction-listing-page.TC-wzt rev=2 -->
### g10.auction-listing-page.US12-TC6: Live updates name no bidder and no maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/listings/live.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` with maximum `<user A maximum>`.
* customer C(signed out) is on the lot page for `<listing_8>`, with the browser's network inspector recording its live connection.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open USD listing, scheduled close more than an hour away |
| `<user A maximum>` | USD9,280 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD6,160 (range: 500000–999999 minor units), below `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer C, read every message the live connection received after step 1.

**Expected Results:**

* Step 2 shows an update carrying the new price, bid count and close.
* No message carries `<user A maximum>`, an account id, an email or a card detail.
* Any bidder a message names appears only by the lot's pseudonym.

<!-- trace:case id=g10.auction-listing-page.TC-0yw rev=2 -->
### g10.auction-listing-page.US12-TC7: A tied maximum that came second carries the earlier-leads tip

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open in USD, before its scheduled close, with no bid.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the lot page for `<listing_1>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer B, read the Recent bids rows at `<maximum>`.
4. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 3: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A leads and set `<maximum>` first, whatever time each row shows.
* Step 3: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 4: the tip reads When maximums match, the earlier one leads.

<!-- trace:case id=g10.auction-listing-page.TC-7nz rev=2 -->
### g10.auction-listing-page.US12-TC8: An older tie lower down keeps the earlier-leads tip

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_5>` is open in USD, before its scheduled close, with no bid.
* customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the lot page for `<listing_5>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |
| `<higher maximum>` | At least two increments above `<maximum>` |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer C, enter `<higher maximum>` in the custom maximum on the bid panel and confirm it.
4. As customer C, read the current price and the Recent bids rows at `<maximum>`.
5. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 4: the current price is above `<maximum>`, and customer C's row leads Recent bids.
* Step 4: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A set `<maximum>` first, whatever time each row shows.
* Step 4: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 5: the tip reads When maximums match, the earlier one leads.

<!-- trace:case id=g10.auction-listing-page.TC-avc rev=2 -->
### g10.auction-listing-page.US12-TC9: A live bid arrives with its email avatar letter

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* collector A has `<listing_3>` open with a live line.
* customer B(card linked, email `<email_mike>`) can bid on `<listing_3>` from another session.

**Test data:**

| Field | Value |
| --- | --- |
| email_mike | `mike@example.com` |

**Steps:**

1. As collector A, watch Recent Bids.
2. As customer B, place an accepted public bid on `<listing_3>`.
3. As collector A, without reloading, find customer B's new Recent Bids row.

**Expected Results:**

* The new row appears without a reload.
* Its avatar shows `M`.
* Its readable label is a listing pseudonym, not an email.

---

## g10.auction-listing-page.US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the lot's countdown to agree with every other page on that lot, whatever my device's clock says,
**so that** the time I see left is the time I have.

<!-- trace:case id=g10.auction-listing-page.TC-o3v rev=2 -->
### g10.auction-listing-page.US13-TC1: Countdown agrees across devices whose clocks disagree

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the lot page for `<listing_3>` on a device whose clock is `<device skew>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<device skew>` |
| --- |
| 4 minutes ahead |
| 4 minutes behind |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing, close about 12 minutes away |

**Steps:**

1. Read Time left on customer A's page and customer B's page at the same moment.
2. Wait 45 seconds.
3. Read Time left on both pages at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second, at step 1.
* Both pages read the same Time left, to the second, at step 3.
* Neither page is off by `<device skew>`.

<!-- trace:case id=g10.auction-listing-page.TC-56e rev=2 -->
### g10.auction-listing-page.US13-TC2: Last second never reads 0 while the lot takes bids

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
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_4>` is open with no accepted bid, its close under a minute away.
* customer A is on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open USD listing with no bids, extension duration 1800s (30mins) |
| `<last moment>` | 0.4 seconds before the close |

**Steps:**

1. Watch Time left from 10 seconds before the close.
2. Read Time left at `<last moment>`.
3. Read Time left just after the close passes.

**Expected Results:**

* Through step 1 Time left shows whole seconds only, never tenths.
* At step 2 Time left reads 1 second, never 0.
* At step 3 Time left reads 0 or the lot reads Closed.

<!-- trace:case id=g10.auction-listing-page.TC-iu2 rev=2 -->
### g10.auction-listing-page.US13-TC3: Countdown corrects itself after the page was away

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the lot page for `<listing_3>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<away>` |
| --- |
| customer A's device sleeps for 45 seconds |
| customer A's browser goes offline for 45 seconds, then reconnects |
| customer A switches to another tab for 45 seconds, then back |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing, close about 12 minutes away |
| `<clock change>` | customer A's device clock set 90 seconds ahead |

**Steps:**

1. Make `<clock change>` while `<away>`.
2. Return to the lot page, without reloading.
3. Read Time left on customer A's page and customer B's page at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second.

<!-- trace:case id=g10.auction-listing-page.TC-ncg rev=2 -->
### g10.auction-listing-page.US13-TC4: A sub-second correction never makes the countdown jump up

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the lot page for `<listing_3>`.
* The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open USD listing, close about 12 minutes away |
| `<correction>` | 0.6 seconds, under a second |

**Steps:**

1. Switch to another tab.
2. Switch back to the lot page.
3. Watch Time left for 5 seconds.

**Expected Results:**

* Time left never reads a higher value than it read the moment before.

---

## g10.auction-listing-page.US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

<!-- trace:case id=g10.auction-listing-page.TC-ffc rev=2 -->
### g10.auction-listing-page.US14-TC1: Closed shows until the close is recorded, then the result

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_5>` is in the state the row gives, its close under a minute away, and no further bid will be placed.
* `<viewer>` is signed in and on the lot page for `<listing_5>`.

**Test data:**

| `<listing_5>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Read the lot's state until the result appears.

**Expected Results:**

* Once the close passes, the page reads Closed with no result.
* The page then reads `<result>`, without a reload.

<!-- trace:case id=g10.auction-listing-page.TC-iet rev=2 -->
### g10.auction-listing-page.US14-TC2: A delayed close keeps Closed and never guesses a result

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_6>` and is on its lot page.
* `<listing_6>`'s close is under a minute away, and no further bid will be placed.
* Recording `<listing_6>`'s close is held back until the next sweep.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A USD listing led by customer A |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Wait 30 seconds.
3. Reload the lot page.
4. Wait until the close is recorded.

**Expected Results:**

* Through steps 1 to 3 the page reads Closed with no result.
* No step shows Won, Did not win or Ended before the close is recorded.
* After step 4 the page reads Won, without a reload.

<!-- trace:case id=g10.auction-listing-page.TC-jic rev=2 -->
### g10.auction-listing-page.US14-TC3: A bid still confirming at the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* Bid-time holds are on.
* customer B leads `<listing_7>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_7>`.
* customer A's card authorization is held until after the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A USD listing in extended bidding, led by customer B |
| `<bid amount>` | 521000 minor units, at or above the minimum next bid |

**Steps:**

1. Place `<bid amount>` 5 seconds before the close.
2. Read the bid panel.
3. Wait until the close is recorded.
4. Read the bid panel and the lot's state.

**Expected Results:**

* At step 2 the bid panel reads Authorizing….
* At step 4 the bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* The lot reads Did not win for customer A, with customer B's price as Highest bid.

<!-- trace:case id=g10.auction-listing-page.TC-51a rev=3 -->
### g10.auction-listing-page.US14-TC4: A bid reaching the auction after the close reads in existing words

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_9>`, and has never bid on it.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A USD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | USD4,960 (range: 100000–499999 minor units) |
| `<bid amount>` | USD5,210 (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps:**

1. Wait until 5 seconds after the close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* No new label or wording appears for the refused bid.
* At step 5 Highest bid reads `<leader price>`.
* At step 5 customer A's page shows neither Won nor Did not win.

<!-- trace:case id=g10.auction-listing-page.TC-1pq rev=3 -->
### g10.auction-listing-page.US14-TC5: A lone first bid refused past the close leaves the lot Ended with No bids

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_10>`.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An open USD listing with no bids, starting price USD280 (range: 10000–49999 minor units), extension duration 1800s (30mins), no cap |
| `<bid amount>` | USD280 (range: 10000–49999 minor units), the opening price |

**Steps:**

1. Wait until 5 seconds after the scheduled close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read Time left, the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* At step 5 Time left never read Extended bidding.
* At step 5 the lot reads Ended, with No bids under it.
* At step 5 the page shows neither Won nor Did not win.

<!-- trace:case id=g10.auction-listing-page.TC-ecq rev=2 -->
### g10.auction-listing-page.US14-TC6: A later close turns a Closed page back to Extended bidding

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
* customer A is on the lot page for `<listing_11>`, with its live updates delayed by 5 seconds.
* customer C(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A USD listing in extended bidding, led by customer B, extension duration 1800s (30mins), no cap |
| `<bid amount>` | At or above the minimum next bid |

**Steps:**

1. As customer C, place `<bid amount>` 1 second before the recorded close.
2. As customer A, watch Time left through the recorded close, without reloading.
3. As customer A, read the lot's state and the bid panel once the update arrives.

**Expected Results:**

* Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled.
* At step 3 Time left is labelled Extended bidding and counts to customer C's bid time plus 1800s.
* At step 3 the bid controls are enabled.
* No step shows Won, Did not win or Ended, and the page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-4ba rev=2 -->
### g10.auction-listing-page.US14-TC7: A sold lot crowns its winning bid and no other

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_2>` is live in USD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
* customer C is on the lot page for `<listing_2>`, in English.

**Steps:**

1. As customer C, read Recent bids before the close.
2. Wait for the close to be recorded as sold to customer A, without reloading.
3. As customer C, read Recent bids again.

**Expected Results:**

* Step 1: no row shows a crown.
* Step 3: customer A's winning row shows a crown named Winner after the amount.
* Step 3: no other row, customer B's included, shows a crown.

<!-- trace:case id=g10.auction-listing-page.TC-hqd rev=2 -->
### g10.auction-listing-page.US14-TC8: A lot without a winner crowns no bid

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
* `<listing_4>` is past its close with no bid, its close recorded with no winner.
* customer C is signed in on a separate session.

**Steps:**

1. As customer C, open the lot page for `<listing_3>` and read Recent bids.
2. As customer C, open the lot page for `<listing_4>` and read Recent bids.

**Expected Results:**

* Step 1: the lot reads Closed and no row shows a crown.
* Step 2: the lot reads Ended with No bids under it, Recent bids holds no row, and no crown shows.

---

## g10.auction-listing-page.US15: Collector tells Recent Bids rivals apart by avatar letter

**As a** collector,
**I want** each Recent Bids avatar on the lot to show that bidder's email
initial while the label stays Bidder N,
**so that** I can tell who bid what without reading a name or email.

<!-- trace:case id=g10.auction-listing-page.TC-ava rev=2 -->
### g10.auction-listing-page.US15-TC1: Rival Recent Bids avatars show different email letters

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* `<listing_1>` is open in USD.
* customer A(card linked, email `<email_ada>`) and customer B(card linked, email `<email_bob>`) each have an accepted public bid on `<listing_1>`.
* A collector is on the lot page for `<listing_1>` in English.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| email_bob | `bob@example.com` |

**Steps:**

1. Open Recent Bids on the lot page.
2. Find customer A's public row and customer B's public row.

**Expected Results:**

* Customer A's avatar shows `A`.
* Customer B's avatar shows `B`.
* Neither row shows an email or personal name.
* Readable labels stay listing pseudonyms or You, not an email-prefixed form.

<!-- trace:case id=g10.auction-listing-page.TC-avb rev=2 -->
### g10.auction-listing-page.US15-TC2: The viewer row still uses the email letter under You

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
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* customer A(signed in, card linked, email `<email_ada>`) has an accepted public bid on open `<listing_2>` and is on that lot page.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |

**Steps:**

1. Open Recent Bids.
2. Find the row marked You.

**Expected Results:**

* The You row's avatar shows `A`.
* The row still shows the You badge.

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the lot page never reads Authorizing… (decisions Q3).
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the lot's result is decided as if it was never sent (decisions Q6).
- A row tied on amount with a row above it carries the earlier-leads tip at any older tie lower down Recent bids, not only at the current price; the row above carries none (`bid-history-winner-priority` Q4).
- Rows tied on amount are listed the leading or won row first, then the row of the bidder who set that maximum earlier, and keep that order once both are outbid; the tip goes on the row of the later maximum (`bid-history-winner-priority` Q6).

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-18-add-collector-lot-status** — `grade10-site-auction-listing-page-US3-TC3-1` → `g10.auction-listing-page.US3-TC3`
- **2026-10-02-relay-auction-live-state** — `grade10-site-auction-listing-page-US12-TC1-1` → `g10.auction-listing-page.US12-TC1`; `grade10-site-auction-listing-page-US12-TC2-1` → `g10.auction-listing-page.US12-TC2`; `grade10-site-auction-listing-page-US12-TC3-1` → `g10.auction-listing-page.US12-TC3`; `grade10-site-auction-listing-page-US12-TC4-1` → `g10.auction-listing-page.US12-TC4`; `grade10-site-auction-listing-page-US12-TC5-1` → `g10.auction-listing-page.US12-TC5`; `grade10-site-auction-listing-page-US12-TC6-1` → `g10.auction-listing-page.US12-TC6`; `grade10-site-auction-listing-page-US13-TC1-1` → `g10.auction-listing-page.US13-TC1`; `grade10-site-auction-listing-page-US13-TC2-1` → `g10.auction-listing-page.US13-TC2`; `grade10-site-auction-listing-page-US13-TC3-1` → `g10.auction-listing-page.US13-TC3`; `grade10-site-auction-listing-page-US13-TC4-1` → `g10.auction-listing-page.US13-TC4`; `grade10-site-auction-listing-page-US14-TC1-1` → `g10.auction-listing-page.US14-TC1`; `grade10-site-auction-listing-page-US14-TC2-1` → `g10.auction-listing-page.US14-TC2`; `grade10-site-auction-listing-page-US14-TC3-1` → `g10.auction-listing-page.US14-TC3`; `grade10-site-auction-listing-page-US14-TC4-1` → `g10.auction-listing-page.US14-TC4`; `grade10-site-auction-listing-page-US14-TC5-1` → `g10.auction-listing-page.US14-TC5`; `grade10-site-auction-listing-page-US14-TC6-1` → `g10.auction-listing-page.US14-TC6`
- **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-listing-page-US12-TC5-1` → `g10.auction-listing-page.US12-TC5`; `grade10-site-auction-listing-page-US14-TC3-1` → `g10.auction-listing-page.US14-TC3`; `grade10-site-auction-listing-page-US14-TC4-2` → `g10.auction-listing-page.US14-TC4`; `grade10-site-auction-listing-page-US14-TC5-2` → `g10.auction-listing-page.US14-TC5`; `grade10-site-auction-listing-page-US14-TC6-1` → `g10.auction-listing-page.US14-TC6`
- **2026-10-06-define-public-auction-identifiers** — `grade10-site-auction-listing-page-US10-TC1-1` → `g10.auction-listing-page.US10-TC1`; `grade10-site-auction-listing-page-US10-TC2-1` → `g10.auction-listing-page.US10-TC2`; `grade10-site-auction-listing-page-US10-TC3-1` → `g10.auction-listing-page.US10-TC3`; `grade10-site-auction-listing-page-US10-TC4-1` → `g10.auction-listing-page.US10-TC4`; `grade10-site-auction-listing-page-US10-TC5-1` → `g10.auction-listing-page.US10-TC5`; `grade10-site-auction-listing-page-US10-TC6-1` → `g10.auction-listing-page.US10-TC6`; `grade10-site-auction-listing-page-US10-TC7-1` → `g10.auction-listing-page.US10-TC7`; `grade10-site-auction-listing-page-US10-TC8-1` → `g10.auction-listing-page.US10-TC8`; `grade10-site-auction-listing-page-US10-TC9-1` → `g10.auction-listing-page.US10-TC9`; `grade10-site-auction-listing-page-US10-TC10-1` → `g10.auction-listing-page.US10-TC10`; `grade10-site-auction-listing-page-US10-TC11-1` → `g10.auction-listing-page.US10-TC11`; `grade10-site-auction-listing-page-US10-TC12-1` → `g10.auction-listing-page.US10-TC12`; `grade10-site-auction-listing-page-US11-TC1-1` → `g10.auction-listing-page.US11-TC1`; `grade10-site-auction-listing-page-US11-TC2-1` → `g10.auction-listing-page.US11-TC2`; `grade10-site-auction-listing-page-US11-TC3-1` → `g10.auction-listing-page.US11-TC3`; `grade10-site-auction-listing-page-US11-TC4-1` → `g10.auction-listing-page.US11-TC4`
- **2026-10-07-bid-history-winner-priority** — `grade10-site-auction-listing-page-US12-TC7-1` → `g10.auction-listing-page.US12-TC7`; `grade10-site-auction-listing-page-US12-TC8-1` → `g10.auction-listing-page.US12-TC8`; `grade10-site-auction-listing-page-US14-TC7-1` → `g10.auction-listing-page.US14-TC7`; `grade10-site-auction-listing-page-US14-TC8-1` → `g10.auction-listing-page.US14-TC8`
- **2026-10-07-email-initial-bid-avatars** — `grade10-site-auction-listing-page-US15-TC1-1` → `g10.auction-listing-page.US15-TC1`; `grade10-site-auction-listing-page-US15-TC2-1` → `g10.auction-listing-page.US15-TC2`; `grade10-site-auction-listing-page-US12-TC9-1` → `g10.auction-listing-page.US12-TC9`

## Reconciliation

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; QA1 output and report; Dev report; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-5ps` rev3 covers SC-7c2: on the live USD lot, the accepted high maximum is 130000 USD minor and the viewer's next bid is 132500 USD minor, from current 120000 USD minor and the USD increment tier.
- The changed scenario preserves the listing journey and the universal USD bid contract. No PRD, journey, feature-root, or durable-baseline contradiction was found. The changed listing scenario does not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- Fourteen existing cases remain draft and are manual until automation execution proof is linked: `g10.auction-listing-page.US1-TC1`, `TC-82e`, `TC-89i`, `TC-3xv`, `TC-6r8`, `TC-wka`, `TC-e6y`, `TC-fe3`, `TC-4op`, `TC-pjv`, `TC-i5l`, `TC-jhd`, `TC-amc`, and `TC-84a`. Testability is `automation, manual`; no assertions or opaque case IDs changed.
- The edited case remains draft. No implementation execution or human approval is claimed.
