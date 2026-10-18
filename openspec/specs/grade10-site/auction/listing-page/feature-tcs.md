# grade10-site/auction/listing-page Test Cases

**Status:** reopened · 0/70
**Reviewed:** 2026-09-01, lapsed 2026-09-29
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** grade10-site-auction-listing-page-SC-75 - the storefront locale test of task 6.1, added after the blind pass, because a page language the brand has no field for is a mapping in the views, not a route a collector walks

## Walk 1: Collector opens a listing at its own address and adjacent checks

**Starting state:**

**Steps 1–3 setup:**

- The catalogue publishes `<published_listing>`. JavaScript disabled in the browser.

**Steps 4–5 setup:**

- The catalogue publishes two listings.

**Steps 6–7 setup:**

- JavaScript disabled in the browser.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

| Field | Value |
| --- | --- |
| lang | The supported language code selected for the canonical listing URL in this fixture; bind its URL language segment only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |
| second_published_listing_url | The canonical URL of a different published listing with its own name and standing; bind the URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

### Route

1. Navigate to `<published_listing_url>`.
2. Check the rendered page.
3. Check the page source.
   - Response status is 200 and the listing page renders. `g10.auction-listing-page.US1-TC1`
   - URL contains `<lang>`. `g10.auction-listing-page.US1-TC1`
   - Page source carries that listing's name, description, and bidding standing. `g10.auction-listing-page.US1-TC1`
4. Navigate to `<published_listing_url>` and note name, standing, title, meta description and `og:url`.
5. Navigate to `<second_published_listing_url>` and note the same.
   - Each response carries its own listing's name and standing. `g10.auction-listing-page.US1-TC2`
   - Each response carries its own title, meta description and `og:url`. `g10.auction-listing-page.US1-TC2`
6. Navigate to `<published_listing_url>`.
7. Check the page source for `og:title`, `og:description` and `og:url`.
   - Page source carries `og:title`, `og:description` and `og:url` naming that listing and its own address. `g10.auction-listing-page.US2-TC1`
   - None of them names the auction catalogue in its place. `g10.auction-listing-page.US2-TC1`

## Walk 2: Collector opens an address that names no listing

**Starting state:**

**Steps 1–3 setup:**

- The catalogue publishes no listing for `<unknown_listing_url>`.

**Steps 4–5 setup:**

- The catalogue publishes `<published_listing>`.

**Steps 6–13 setup:**

- customer is outside the business and has `<original_address>` saved.
- The original listing is in `<state>`.
- No eligible public listing holds its original slug.
- The browser runs no client-side scripts.
- For called-off rows, the collector watched the original before call off.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| unknown_listing_url | An auction listing URL with no published listing or eligible holder; bind the URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 6–13 data:**

| `<state>` | `<original_address>` |
| --- | --- |
| Draft, never published | The draft's address |
| Called off in this pass | Its saved address before call off |
| Called off before this release | Its saved address before call off |
| Called off, slug saved by a new unpublished draft | The shared slug's address |
| Called off, slug held by a created unpublished replacement | The shared slug's address |

### Route

1. Navigate to `<unknown_listing_url>`.
2. Check the rendered page.
3. Check the response status.
   - Response status is 404. `g10.auction-listing-page.US3-TC1`
   - The site's not-found surface is on screen. `g10.auction-listing-page.US3-TC1`
4. Navigate to `<published_listing_url>`.
5. Check the response status and the rendered page.
   - Response status is 200. `g10.auction-listing-page.US3-TC2`
   - The page is that listing's page. `g10.auction-listing-page.US3-TC2`
6. Navigate to `<original_address>`.
7. Check the response status.
   - Step 7 returns 404. `g10.auction-listing-page.US3-TC3`
8. Check the served page.
   - Step 8 shows Page not found. `g10.auction-listing-page.US3-TC3`
9. Inspect its response body and embedded data.
   - Step 9 contains no original-listing or replacement-listing data. `g10.auction-listing-page.US3-TC3`
   - Step 9 contains no listing code or payment reference. `g10.auction-listing-page.US3-TC3`
10. Open the original listing code alone as the listing address.
   - Step 10 returns 404. `g10.auction-listing-page.US3-TC3`
11. Inspect that response and page.
   - Step 11 shows Page not found with no listing data or code. `g10.auction-listing-page.US3-TC3`
12. Open the original collector's watchlist.
13. Search for the called-off original listing.
   - Neither original listing nor unpublished replacement appears. `g10.auction-listing-page.US3-TC3`
   - No empty listing page, redirect or catalogue replaces it. `g10.auction-listing-page.US3-TC3`
   - Step 13 does not show the called-off original in the watchlist. `g10.auction-listing-page.US3-TC3`
   - An unpublished replacement does not appear there either. `g10.auction-listing-page.US3-TC3`

## Walk 3: Collector reads a live listing while scripts load

**Starting state:**

**Steps 1–4 setup:**

- `<published_listing>` is on the catalogue.

**Steps 5–8 setup:**

- a bidding countdown is shown on `<published_listing>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 5–8 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

### Route

1. Navigate to `<published_listing_url>`.
2. Note the served name, description and standing in the document.
3. Wait until scripts finish loading.
4. Check the same fields on screen.
   - The same listing is on screen with its served name, description and standing still present. `g10.auction-listing-page.US4-TC1`
   - None of them is replaced by a loading placeholder. `g10.auction-listing-page.US4-TC1`
5. Navigate to `<published_listing_url>`.
6. Note how long bidding has left in the document.
7. Wait until scripts finish loading.
8. Check how long bidding has left on screen.
   - What is on screen continues from what the document carried, rather than contradicting it. `g10.auction-listing-page.US4-TC2`

## Walk 4: Collector reaches a listing from the catalogue

**Starting state:**

**Steps 1–2 setup:**

- The collector is viewing the auction catalogue, which lists `<published_listing>`.

**Steps 3–4 setup:**

- The catalogue holds `<published_listing>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |

| Field | Value |
| --- | --- |
| grade10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing in the catalogue; bind its public title only |

| Field | Value |
| --- | --- |
| grade10 sitemap url | The sitemap URL in the test environment; bind its URL only |

### Route

1. Navigate to `<grade10 auction url>`.
2. Open `<published_listing>` the catalogue lists.
   - The browser is on that listing's address, showing that listing's page. `g10.auction-listing-page.US5-TC1`
3. Fetch `<grade10 sitemap url>`.
4. Check every sitemap entry.
   - `<published_listing>`'s address is listed as an absolute URL of the serving environment. `g10.auction-listing-page.US5-TC2`
   - No entry carries an unfilled parameter in place of a listing. `g10.auction-listing-page.US5-TC2`

## Walk 5: Watch an auction and open My Auctions from the toast

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, no bid on `<listing_12>`, not watching `<listing_12>`) is on `<listing_12 url>`.

**Steps 4–5 setup:**

- customer(signed out) is on `<listing_12 url>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_12 | An open listing taking bids, not watched and not bid on by this collector |
| listing_12 url | The canonical URL of `<listing_12>`; bind the URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| listing_12 | An open listing taking bids |
| listing_12 url | The canonical URL of `<listing_12>`; bind the URL only |

### Route

1. Note the current bid, time left and bid panel.
2. Click the Watch control.
   - Step 2: the control reads Watching. `g10.auction-listing-page.US6-TC1`
   - Step 2: a toast says email alerts are on, with View My Auctions. `g10.auction-listing-page.US6-TC1`
   - Step 2: current bid, time left and bid panel are unchanged. `g10.auction-listing-page.US6-TC1`
3. Click View My Auctions in the toast.
   - Step 3: My Auctions opens and lists `<listing_12>` once, Your Standing `--`. `g10.auction-listing-page.US6-TC1`
   - Step 3: `<listing_12>`'s email alerts switch is on. `g10.auction-listing-page.US6-TC1`
4. Click the Watch control.
   - Step 4: sign-in is offered; no toast says email alerts are on. `g10.auction-listing-page.US6-TC2`
5. Sign in using the offered sign-in flow.
   - Step 5: the collector returns to `<listing_12 url>`. `g10.auction-listing-page.US6-TC2`
   - Step 5: the control reads Watch; nothing was watched before sign-in. `g10.auction-listing-page.US6-TC2`

## Walk 6: Unwatch from the auction and undo

**Starting state:**

**Steps 1–2 setup:**

- customer(signed in, watching `<listing_13>`, no bid on `<listing_13>`) is on `<listing_13 url>`.

**Steps 3–5 setup:**

- customer(signed in, watching `<listing_13>`, no bid on `<listing_13>`) is on `<listing_13 url>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_13 | An open listing taking bids, watched with email alerts on, not bid on by this collector |
| listing_13 url | The canonical URL of `<listing_13>`; bind the URL only |

| Field | Value |
| --- | --- |
| grade10 my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps 3–5 data:**

| Field | Value |
| --- | --- |
| listing_13 | An open listing taking bids, watched with email alerts on, not bid on by this collector |
| listing_13 url | The canonical URL of `<listing_13>`; bind the URL only |

| Field | Value |
| --- | --- |
| grade10 my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

### Route

1. Click the Watching control.
   - Step 1: the control reads Watch. `g10.auction-listing-page.US7-TC1`
   - Step 1: a toast says the listing left My Auctions, with Undo. `g10.auction-listing-page.US7-TC1`
   - Step 1: current bid, time left and bid panel are unchanged. `g10.auction-listing-page.US7-TC1`
2. Open `<grade10 my auctions url>` in a new tab.
   - Step 2: `<listing_13>` is not listed. `g10.auction-listing-page.US7-TC1`
3. Click the Watching control.
4. Click Undo in the toast.
   - Step 4: the control reads Watching again. `g10.auction-listing-page.US7-TC2`
5. Open `<grade10 my auctions url>` in a new tab.
   - Step 5: `<listing_13>` is listed once, Your Standing `--`. `g10.auction-listing-page.US7-TC2`
   - Step 5: `<listing_13>`'s email alerts switch is on. `g10.auction-listing-page.US7-TC2`

## Walk 7: After bidding, Watching stays locked and adjacent checks

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, enrolled to bid, not watching `<listing_14>`, no bid on `<listing_14>`) is on `<listing_14 url>`.

**Steps 4–4 setup:**

- customer A(signed in, has bid on `<listing_15>`, outbid) is on `<listing_15 url>`.

**Steps 5–6 setup:**

- The listing at `<closed listing url>` is in `<listing_state>` for the viewer described in Test data.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_14 | An open listing taking bids, with no bid from this collector |
| first bid | The next valid bid shown on the bid panel |
| listing_14 url | The canonical URL of `<listing_14>`; bind the URL only |

**Steps 4–4 data:**

| Field | Value |
| --- | --- |
| listing_15 | An open listing taking bids, where customer A bid before and customer B now leads |
| raise | The next valid bid shown on the bid panel |
| listing_15 url | The canonical URL of `<listing_15>`; bind the URL only |

**Steps 5–6 data:**

| `<listing_state>` | Viewer |
| --- | --- |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

| Field | Value |
| --- | --- |
| closed listing url | The canonical URL of the closed listing in this row; bind the URL only |

### Route

1. Place `<first bid>` from the bid panel.
   - Step 1: a toast says email alerts are on. `g10.auction-listing-page.US8-TC1`
   - Step 1: the control reads Watching, disabled. `g10.auction-listing-page.US8-TC1`
2. Click the Watching control.
   - Step 2: nothing changes; no Unwatch toast. `g10.auction-listing-page.US8-TC1`
3. Reload `<listing_14 url>`.
   - Step 3: the control still reads Watching, disabled; no alerts toast. `g10.auction-listing-page.US8-TC1`
4. Place `<raise>` from the bid panel.
   - No toast says email alerts are on. `g10.auction-listing-page.US8-TC2`
   - The control reads Watching, disabled. `g10.auction-listing-page.US8-TC2`
5. Navigate to `<closed listing url>`.
   - Step 5: the listing page renders. `g10.auction-listing-page.US9-TC1`
6. Check the listing image area and the bid panel area.
   - Step 6: no Watch or Watching control shows anywhere on the listing page. `g10.auction-listing-page.US9-TC1`

## Walk 8: Collector quotes a published listing

**Starting state:**

**Steps 1–3 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 4–8 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.
- Its bidding standing stays unchanged during the pass.
- The browser initially runs no scripts.

**Steps 9–12 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 13–15 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 16–18 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 19–21 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 22–22 setup:**

- A published listing exists and its listing code is known from the admin listing screen.

**Steps 23–24 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 4–8 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 9–12 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 13–15 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 16–18 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 19–21 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 22–22 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |

**Steps 23–24 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

### Route

1. Open `<published_listing_url>`.
2. View the page's response source before any script runs.
3. Identify each occurrence of `<listing_code>` and inspect its context.
   - The source names the listing by its title. `g10.auction-listing-page.US10-TC1`
   - The only code occurrence is the lower-case suffix of the canonical address; no labelled listing-code or payment-reference field is present. `g10.auction-listing-page.US10-TC1`
4. Open `<published_listing_url>` with scripts disabled.
5. Record its served title, description and bidding standing.
   - Step 5 provides the addressed listing's title, description and bidding standing. `g10.auction-listing-page.US10-TC2`
6. Enable scripts on the same address.
7. Read the hydrated page, DOM, source and document metadata.
   - Step 7 keeps those same served values after hydration. `g10.auction-listing-page.US10-TC2`
8. Inspect every listing-code occurrence.
   - No placeholder replaces served content. `g10.auction-listing-page.US10-TC2`
   - Hydrated DOM and document metadata name the same listing. `g10.auction-listing-page.US10-TC2`
   - No separate listing-code or payment-reference field appears. `g10.auction-listing-page.US10-TC2`
   - A code occurs only within the full canonical address. `g10.auction-listing-page.US10-TC2`
9. Fetch the share-preview metadata for `<published_listing_url>`.
10. Search the preview's title, description and url for `<listing_code>`.
11. Inspect the preview image and embedded metadata.
12. Read the same address's document title and meta description.
   - The preview's title and description have no labelled listing-code or payment-reference field. `g10.auction-listing-page.US10-TC3`
   - Its URL is the canonical address ending in the lower-case listing-code suffix. Previously cached preview content may persist; the test does not require a purge or regeneration. A fresh preview fetch must satisfy the absence above. `g10.auction-listing-page.US10-TC3`
   - The preview identifies the public listing by title and full address. `g10.auction-listing-page.US10-TC3`
   - Image and embedded metadata expose no separate code or payment reference. `g10.auction-listing-page.US10-TC3`
   - Step 12 identifies the same public listing by title and description. `g10.auction-listing-page.US10-TC3`
   - Neither document field contains a listing code or payment reference. `g10.auction-listing-page.US10-TC3`
13. Open `<published_listing_url>`.
14. Read the browser tab title and the page's meta description.
15. Compare the title and description with the addressed listing.
   - Neither the tab title nor the meta description contains the listing code. `g10.auction-listing-page.US10-TC4`
   - Both identify the addressed listing, never the auction catalogue. `g10.auction-listing-page.US10-TC4`
16. Open `<published_listing_url>`.
17. View the page's response source.
18. Search any data embedded in the document, outside the visible text, for `<listing_code>`.
   - No field in the embedded data carries the listing code. `g10.auction-listing-page.US10-TC5`
19. Open `<published_listing_url>` and let the page finish loading.
20. Inspect the responses the page's own client-side requests receive.
21. Search those responses for `<listing_code>`.
   - No page response contains a separate listing-code or payment-reference field. `g10.auction-listing-page.US10-TC6`
22. Open the auction's listing-address path, substituting `<listing_code>` for its usual identifier.
   - The address does not resolve to that listing's page. `g10.auction-listing-page.US10-TC7`
   - The site's not-found surface is shown, the same as for any address naming no published listing. `g10.auction-listing-page.US10-TC7`
23. Open `<published_listing_url>` as a signed-out visitor and search the page and its source for `<listing_code>`.
24. Open the same address signed in as a registered collector and repeat the search.
   - Neither view has a labelled listing-code or payment-reference field; the canonical address may end in the lower-case code suffix. `g10.auction-listing-page.US10-TC8`
   - The title and address shown are identical in both views. `g10.auction-listing-page.US10-TC8`

## Walk 9: Collector quotes a published listing

**Starting state:**

**Steps 1–4 setup:**

- A listing's auction has closed with a winning bid, so an order now exists on that listing.

**Steps 5–7 setup:**

- The catalogue publishes no listing for `<unknown_listing_url>`.

**Steps 8–9 setup:**

- A previously published listing has canonical address `<listing_url>` and code `<listing_code>`.
- The listing is closed or settled, without explicit deletion.
- The listing was not called off.

**Steps 10–11 setup:**

- A preview for `<listing_url>` was cached while the listing was publicly available.
- The listing subsequently closes, without explicit deletion.
- An authorized admin or the winner knows `<listing_code>`.

**Shared test data:**

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| unknown_listing_url | An auction listing URL with no published listing or eligible holder; bind the URL only |

**Steps 8–9 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| listing_url | The canonical URL of the listing in this case, retained after the close; bind the URL only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| listing_url | The canonical URL of the listing in this case, retained after the close; bind the URL only |

### Route

1. Open the listing's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.
4. Inspect hydrated DOM, page lookup responses, title and description.
   - The page and preview contain no labelled listing-code or payment-reference field. `g10.auction-listing-page.US10-TC9`
   - The code appears only as the lower-case suffix of the canonical address. `g10.auction-listing-page.US10-TC9`
   - All surfaces name the same listing and its full address. `g10.auction-listing-page.US10-TC9`
   - Title and description contain no listing code or payment reference. `g10.auction-listing-page.US10-TC9`
   - Embedded and network data contain no separate code or payment reference. `g10.auction-listing-page.US10-TC9`
5. Fetch `<unknown_listing_url>`.
6. Search the response, including any error detail, for a listing code.
7. Check the not-found page and embedded data.
   - Response status is 404. `g10.auction-listing-page.US10-TC10`
   - No listing code appears anywhere in the response. `g10.auction-listing-page.US10-TC10`
   - No listing content or separate payment reference appears. `g10.auction-listing-page.US10-TC10`
8. Open `<listing_url>` directly.
9. Inspect the rendered page, response source and fresh share-preview metadata.
   - `<listing_url>` still returns its public listing page. `g10.auction-listing-page.US10-TC11`
   - The page and fresh preview identify the listing by its public title and canonical URL. `g10.auction-listing-page.US10-TC11`
   - Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata. `g10.auction-listing-page.US10-TC11`
   - Closing does not release or replace `<listing_url>` or `<listing_code>`. `g10.auction-listing-page.US10-TC11`
10. Request the existing cached preview for `<listing_url>`.
11. Inspect its title, description, URL, image and embedded metadata.
   - The cached preview may continue to show previously cached public listing metadata and `<listing_url>`. `g10.auction-listing-page.US10-TC12`
   - It contains no separate listing code or payment reference, internal/provider reference, winner data or admin-only data. `g10.auction-listing-page.US10-TC12`

## Walk 10: Collector contacts support about a listing

**Starting state:**

**Steps 1–5 setup:**

- A published listing exists at its own address.
- The listing code `<listing_code>` is known from the admin listing screen.

**Steps 6–6 setup:**

- A published listing exists and its listing code is known from a leak or from another surface.

**Steps 7–10 setup:**

- A listing's auction has closed with a winning bid, so an order now exists on that listing.

**Shared test data:**

**Steps 1–5 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps 6–6 data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |

### Route

1. Open `<published_listing_url>`.
2. Read the public listing title and full address.
   - Step 2 provides the public title and full address. `g10.auction-listing-page.US11-TC1`
3. Inspect the page and source for a separate code field.
   - Step 3 offers no separate code or payment reference. `g10.auction-listing-page.US11-TC1`
4. As admin(support), find the public listing by that title.
   - Step 4 finds the listing without a listing code. `g10.auction-listing-page.US11-TC1`
5. Open the matched listing.
   - Support lookup shows no separate listing-code or payment-reference field. `g10.auction-listing-page.US11-TC1`
   - Step 5 identifies the same listing by title and full address. `g10.auction-listing-page.US11-TC1`
   - The opened public listing shows no separate code to support. `g10.auction-listing-page.US11-TC1`
6. Attempt to open the listing's address by substituting `<listing_code>` for the listing's usual identifier.
   - The listing code does not resolve to the listing. `g10.auction-listing-page.US11-TC2`
   - No working link to the listing can be built from the code alone. `g10.auction-listing-page.US11-TC2`
7. Open the listing's own address on the public listing page.
8. Note its title and address.
9. Inspect DOM, source, embedded data and fresh preview metadata.
   - Step 9 exposes no separate code or payment reference. `g10.auction-listing-page.US11-TC3`
10. As admin(support), find and open the listing by title.
   - The title and canonical address are unchanged by the order. `g10.auction-listing-page.US11-TC3`
   - The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix. `g10.auction-listing-page.US11-TC3`
   - Step 10 finds the same listing without a code. `g10.auction-listing-page.US11-TC3`

## Walk 11: Collector sees another bid on the listing without reloading

**Starting state:**

**Steps 1–2 setup:**

- `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
- customer A is on the listing page for `<listing_1>`.
- customer B(card linked) is signed in on a separate session, on the same listing page.

**Steps 3–4 setup:**

- `<listing_2>` is open with one accepted bid, its scheduled close under a minute away.
- customer A is on the listing page for `<listing_2>`.

**Steps 5–7 setup:**

- `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
- customer A is on the listing page for `<listing_1>`, with the browser's live connection to the auction blocked.
- customer B(card linked) is signed in on a separate session, on the same listing page.

**Steps 8–11 setup:**

- `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
- customer A is on the listing page for `<listing_1>`.
- customer B(card linked) is signed in on a separate session, on the same listing page.

**Steps 12–14 setup:**

- customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<customer A maximum>`, and is on its listing page.
- customer B(card linked) is signed in on a separate session, on the same listing page.

**Steps 15–16 setup:**

- customer A(signed in) leads `<listing_8>` with maximum `<customer A maximum>`.
- customer C(signed out) is on the listing page for `<listing_8>`, with the browser's network inspector recording its live connection.
- customer B(card linked) is signed in on a separate session, on the same listing page.

**Steps 17–20 setup:**

- `<listing_16>` is open in USD, before its scheduled close, with no bid.
- customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the listing page for `<listing_16>`, in English.

**Steps 21–25 setup:**

- `<listing_16>` is open in USD, before its scheduled close, with no bid.
- customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the listing page for `<listing_16>`, in English.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid count | 3 | · |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps 3–4 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_2 | An open USD listing with one accepted bid, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |

**Steps 5–7 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps 8–11 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

**Steps 12–14 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_8 | An open USD listing, scheduled close more than an hour away | · |
| current bid | USD1200 | (120000 USD minor units) |
| customer A maximum | USD1275 | (127500 USD minor units) |
| customer B maximum | USD1300 | (130000 USD minor units), above `<customer A maximum>` |
| increment | USD25 | (2500 USD minor units), the USD1000 tier increment |
| highest_bid_after | USD1,300 | (130000 USD minor units): `<customer A maximum>` plus `<increment>` |
| minimum_next_bid | USD1,325 | (132500 USD minor units): `<highest_bid_after>` plus `<increment>` |

**Steps 15–16 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_8 | An open USD listing, scheduled close more than an hour away | · |
| customer A maximum | USD9,280 | (range: 500000–999999 minor units) |
| customer B maximum | USD6,160 | (range: 500000–999999 minor units), below `<customer A maximum>` |

**Steps 17–20 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| maximum | USD1,800 | At least two increments above the opening price; representative USD fixture |
| listing_16 | An open USD listing with no bid, before its scheduled close, opening price at least two increments below `<maximum>`; bind its identity only | · |

**Steps 21–25 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| maximum | USD1,800 | At least two increments above the opening price; representative USD fixture |
| higher maximum | USD2,200 | At least two increments above `<maximum>`; representative USD fixture |
| listing_16 | An open USD listing with no bid, before its scheduled close, opening price at least two increments below `<maximum>`; bind its identity only | · |

### Route

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.
   - Highest bid reads `<bid amount>` on customer A's page. `g10.auction-listing-page.US12-TC1`
   - The bid count reads `<bid count>` plus 1. `g10.auction-listing-page.US12-TC1`
   - Time left still counts to the scheduled close. `g10.auction-listing-page.US12-TC1`
   - customer A's page did not reload. `g10.auction-listing-page.US12-TC1`
3. Watch Time left through the scheduled close, without reloading.
4. Read Time left and its label.
   - Time left never reads Closed at the scheduled close. `g10.auction-listing-page.US12-TC2`
   - Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`. `g10.auction-listing-page.US12-TC2`
   - The page did not reload. `g10.auction-listing-page.US12-TC2`
5. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
6. As customer A, wait on the page without reloading.
7. Read Highest bid and the bid count.
   - Highest bid reads `<bid amount>` and the bid count includes customer B's bid. `g10.auction-listing-page.US12-TC3`
   - customer A's page did not reload. `g10.auction-listing-page.US12-TC3`
8. Take customer A's browser offline.
9. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
10. Bring customer A's browser back online, without reloading.
11. As customer A, read Highest bid and the bid count.
   - Highest bid reads `<bid amount>` and the bid count includes customer B's bid. `g10.auction-listing-page.US12-TC4`
   - customer A's page did not reload. `g10.auction-listing-page.US12-TC4`
12. As customer A, read the standing on the bid panel.
   - Step 12 reads Leading, with Your maximum `<customer A maximum>`. `g10.auction-listing-page.US12-TC5`
13. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
14. As customer A, without reloading, read the standing, Highest bid and the next valid bid.
   - Step 14 reads Outbid, with no reload. `g10.auction-listing-page.US12-TC5`
   - Step 14 reads Highest bid `<highest_bid_after>`, `<customer A maximum>` plus `<increment>`. `g10.auction-listing-page.US12-TC5`
   - Step 14 shows `<minimum_next_bid>` as the minimum next valid bid. `g10.auction-listing-page.US12-TC5`
15. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
16. As customer C, read every message the live connection received after step 1.
   - Step 16 shows an update carrying the new price, bid count and close. `g10.auction-listing-page.US12-TC6`
   - No message carries `<customer A maximum>`, an account id, an email or a card detail. `g10.auction-listing-page.US12-TC6`
   - Any bidder a message names appears only by the listing's pseudonym. `g10.auction-listing-page.US12-TC6`
17. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
18. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
19. As customer B, read the Recent bids rows at `<maximum>`.
   - Step 19: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A leads and set `<maximum>` first, whatever time each row shows. `g10.auction-listing-page.US12-TC7`
   - Step 19: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one. `g10.auction-listing-page.US12-TC7`
20. Hover the Info control on customer B's row at `<maximum>`.
   - Step 20: the tip reads When maximums match, the earlier one leads. `g10.auction-listing-page.US12-TC7`
21. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
22. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
23. As customer C, enter `<higher maximum>` in the custom maximum on the bid panel and confirm it.
24. As customer C, read the current price and the Recent bids rows at `<maximum>`.
   - Step 24: the current price is above `<maximum>`, and customer C's row leads Recent bids. `g10.auction-listing-page.US12-TC8`
   - Step 24: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A set `<maximum>` first, whatever time each row shows. `g10.auction-listing-page.US12-TC8`
   - Step 24: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one. `g10.auction-listing-page.US12-TC8`
25. Hover the Info control on customer B's row at `<maximum>`.
   - Step 25: the tip reads When maximums match, the earlier one leads. `g10.auction-listing-page.US12-TC8`

## Walk 12: Collector sees another bid on the listing without reloading and adjacent checks

**Starting state:**

**Steps 1–3 setup:**

- collector A has `<listing_17>` open with a live line.
- customer B(card linked, email `<customer B email>`) can bid on `<listing_17>` from another session.

**Steps 4–6 setup:**

- `<listing_3>` is open, its close about 12 minutes away.
- customer A is on the listing page for `<listing_3>` on a device whose clock is `<device skew>`.
- customer B is on the same listing page on a device whose clock is correct.

**Steps 7–9 setup:**

- `<listing_4>` is open with no accepted bid, its close under a minute away.
- customer A is on the listing page for `<listing_4>`.

**Steps 10–12 setup:**

- `<listing_3>` is open, its close about 12 minutes away.
- customer A is on the listing page for `<listing_3>`.
- customer B is on the same listing page on a device whose clock is correct.

**Steps 13–15 setup:**

- `<listing_3>` is open, its close about 12 minutes away.
- customer A is on the listing page for `<listing_3>`.
- The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| customer B email | `mike@example.com` |
| listing_17 | An open USD listing whose live connection is available and customer B can bid; bind its identity only |
| customer B avatar letter | M: the public avatar letter derived from `<customer B email>`; bind the letter only |

**Steps 4–6 data:**

| `<device skew>` |
| --- |
| 4 minutes ahead |
| 4 minutes behind |

| Field | Value |
| --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away |

| Field | Value | Fixture notes |
| --- | --- | --- |
| observation interval | 45 seconds | (fixed observation fixture) |

**Steps 7–9 data:**

| Field | Value |
| --- | --- |
| listing_4 | An open USD listing with no bids, extension duration 1800s (30mins) |
| last moment | 0.4 seconds before the close |

**Steps 10–12 data:**

| `<away>` |
| --- |
| customer A's device sleeps for 45 seconds |
| customer A's browser goes offline for 45 seconds, then reconnects |
| customer A switches to another tab for 45 seconds, then back |

| Field | Value |
| --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away |
| clock change | a 90-second forward change to customer A's device clock |

**Steps 13–15 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away | · |
| correction | 0.6 seconds | under a second |

| Field | Value | Fixture notes |
| --- | --- | --- |
| observation interval | 5 seconds | (fixed observation fixture) |

### Route

1. As collector A, watch Recent Bids.
2. As customer B, place an accepted public bid on `<listing_17>`.
3. As collector A, without reloading, find customer B's new Recent Bids row.
   - The new row appears without a reload. `g10.auction-listing-page.US12-TC9`
   - Its avatar shows `<customer B avatar letter>`. `g10.auction-listing-page.US12-TC9`
   - Its readable label is a listing pseudonym, not an email. `g10.auction-listing-page.US12-TC9`
4. Read Time left on customer A's page and customer B's page at the same moment.
   - Both pages read the same Time left, to the second, at step 4. `g10.auction-listing-page.US13-TC1`
5. Wait `<observation interval>`.
6. Read Time left on both pages at the same moment.
   - Both pages read the same Time left, to the second, at step 6. `g10.auction-listing-page.US13-TC1`
   - Neither page is off by `<device skew>`. `g10.auction-listing-page.US13-TC1`
7. Watch Time left from 10 seconds before the close.
   - Through step 7 Time left shows whole seconds only, never tenths. `g10.auction-listing-page.US13-TC2`
8. Read Time left at `<last moment>`.
   - At step 8 Time left reads 1 second, never 0. `g10.auction-listing-page.US13-TC2`
9. Read Time left just after the close passes.
   - At step 9 Time left reads 0 or the listing reads Closed. `g10.auction-listing-page.US13-TC2`
10. Apply `<clock change>` while `<away>`.
11. Return to the listing page, without reloading.
12. Read Time left on customer A's page and customer B's page at the same moment.
   - Both pages read the same Time left, to the second. `g10.auction-listing-page.US13-TC3`
13. Switch to another tab.
14. Switch back to the listing page.
15. Watch Time left for `<observation interval>`.
   - Time left never reads a higher value than it read the moment before. `g10.auction-listing-page.US13-TC4`

## Walk 13: Bidder waits on a closed listing for its result

**Starting state:**

**Steps 1–2 setup:**

- The listing `<listing_18>` has this state: `<listing_state>`, its close under a minute away, and no further bid will be placed.
- `<viewer>` is signed in and on the listing page for `<listing_18>`.

**Steps 3–6 setup:**

- customer A leads `<listing_6>` and is on its listing page.
- `<listing_6>`'s close is under a minute away, and no further bid will be placed.
- Recording `<listing_6>`'s close is held back until the next sweep.

**Steps 7–11 setup:**

- customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
- customer A(card linked) is signed in and on the listing page for `<listing_9>`, and has never bid on it.
- Once the page has loaded, customer A's browser blocks the auction's time route, live socket and listing reads, and its device clock runs `<clock lag>` behind the auction's, so the page keeps its bid controls enabled past the close.

**Steps 12–16 setup:**

- `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
- customer A(card linked) is signed in and on the listing page for `<listing_10>`.
- Once the page has loaded, customer A's browser blocks the auction's time route, live socket and listing reads, and its device clock runs `<clock lag>` behind the auction's, so the page keeps its bid controls enabled past the close.

**Steps 17–19 setup:**

- `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
- customer A is on the listing page for `<listing_11>`, with its live updates delayed by `<update delay>`.
- customer C(card linked) is signed in on a separate session, on the same listing page.

**Steps 20–22 setup:**

- `<listing_19>` is live in USD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
- customer C is on the listing page for `<listing_19>`, in English.

**Steps 23–24 setup:**

- `<listing_20>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
- `<listing_21>` is past its close with no bid, its close recorded with no winner.
- customer C is signed in on a separate session.

**Shared test data:**

**Steps 1–2 data:**

| `<listing_state>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

| Field | Value |
| --- | --- |
| listing_18 | A USD listing in `<listing_state>` with its close under a minute away; bind its identity only |

**Steps 3–6 data:**

| Field | Value |
| --- | --- |
| listing_6 | A USD listing led by customer A |

**Steps 7–11 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A USD listing in extended bidding, led by customer B, no cap | · |
| leader price | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

| Field | Value | Fixture notes |
| --- | --- | --- |
| clock lag | 30 seconds | (fixed stale-clock fixture) |
| bid delay | 5 seconds | (fixed after-close fixture, shorter than `<clock lag>`) |

**Steps 12–16 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_10 | An open USD listing with no bids, starting price USD280 (range: 10000–49999 minor units), extension duration 1800s (30mins), no cap | · |
| bid amount | USD280 | (range: 10000–49999 minor units), the opening price |

| Field | Value | Fixture notes |
| --- | --- | --- |
| clock lag | 30 seconds | (fixed stale-clock fixture) |
| bid delay | 5 seconds | (fixed after-close fixture, shorter than `<clock lag>`) |

**Steps 17–19 data:**

| Field | Value |
| --- | --- |
| listing_11 | A USD listing in extended bidding, led by customer B, extension duration `<extension duration>`, no cap |
| bid amount | At or above the minimum next bid |

| Field | Value | Fixture notes |
| --- | --- | --- |
| update delay | 5 seconds | (fixed live-update delay fixture) |
| last bid offset | 1 second | (fixed last-second boundary) |
| extension duration | 1800s | (30mins) |

**Steps 20–22 data:**

| Field | Value |
| --- | --- |
| listing_19 | A live USD listing led by customer A with customer B below, recorded close a minute away; bind its identity only |

**Steps 23–24 data:**

| Field | Value |
| --- | --- |
| listing_20 | A USD listing past its close with bids, recording its close held until the next sweep; bind its identity only |
| listing_21 | A USD listing past its close with no bid, recorded with no winner; bind its identity only |

### Route

1. Watch the listing through its close, without reloading.
2. Read the listing's state until the result appears.
   - Once the close passes, the page reads Closed with no result. `g10.auction-listing-page.US14-TC1`
   - The page then reads `<result>`, without a reload. `g10.auction-listing-page.US14-TC1`
3. Watch the listing through its close, without reloading.
4. Wait 30 seconds.
5. Reload the listing page.
6. Wait until the close is recorded.
   - Through steps 3 to 3 the page reads Closed with no result. `g10.auction-listing-page.US14-TC2`
   - No step shows Won, Did not win or Ended before the close is recorded. `g10.auction-listing-page.US14-TC2`
   - After step 6 the page reads Won, without a reload. `g10.auction-listing-page.US14-TC2`
7. Wait until `<bid delay>` after the close, by the auction's clock.
8. Place `<bid amount>`.
9. Read the bid panel.
   - At step 9 the bid panel reads "Your bid did not go through." alone. `g10.auction-listing-page.US14-TC4`
10. Unblock the auction, reload the listing page and wait until the close is recorded.
11. Read the listing's state and the bid panel.
   - No new label or wording appears for the refused bid. `g10.auction-listing-page.US14-TC4`
   - At step 11 Highest bid reads `<leader price>`. `g10.auction-listing-page.US14-TC4`
   - At step 11 customer A's page shows neither Won nor Did not win. `g10.auction-listing-page.US14-TC4`
12. Wait until `<bid delay>` after the scheduled close, by the auction's clock.
13. Place `<bid amount>`.
14. Read the bid panel.
   - At step 14 the bid panel reads "Your bid did not go through." alone. `g10.auction-listing-page.US14-TC5`
15. Unblock the auction, reload the listing page and wait until the close is recorded.
16. Read Time left, the listing's state and the bid panel.
   - At step 16 Time left never read Extended bidding. `g10.auction-listing-page.US14-TC5`
   - At step 16 the listing reads Ended, with No bids under it. `g10.auction-listing-page.US14-TC5`
   - At step 16 the page shows neither Won nor Did not win. `g10.auction-listing-page.US14-TC5`
17. As customer C, place `<bid amount>` `<last bid offset>` before the recorded close.
18. As customer A, watch Time left through the recorded close, without reloading.
19. As customer A, read the listing's state and the bid panel once the update arrives.
   - Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled. `g10.auction-listing-page.US14-TC6`
   - At step 19 Time left is labelled Extended bidding and counts to customer C's bid time plus `<extension duration>`. `g10.auction-listing-page.US14-TC6`
   - At step 19 the bid controls are enabled. `g10.auction-listing-page.US14-TC6`
   - No step shows Won, Did not win or Ended, and the page did not reload. `g10.auction-listing-page.US14-TC6`
20. As customer C, read Recent bids before the close.
   - Step 20: no row shows a crown. `g10.auction-listing-page.US14-TC7`
21. Wait for the close to be recorded as sold to customer A, without reloading.
22. As customer C, read Recent bids again.
   - Step 22: customer A's winning row shows a crown named Winner after the amount. `g10.auction-listing-page.US14-TC7`
   - Step 22: no other row, customer B's included, shows a crown. `g10.auction-listing-page.US14-TC7`
23. As customer C, open the listing page for `<listing_20>` and read Recent bids.
   - Step 23: the listing reads Closed and no row shows a crown. `g10.auction-listing-page.US14-TC8`
24. As customer C, open the listing page for `<listing_21>` and read Recent bids.
   - Step 24: the listing reads Ended with No bids under it, Recent bids holds no row, and no crown shows. `g10.auction-listing-page.US14-TC8`

## Walk 14: Collector tells Recent Bids rivals apart by avatar letter

**Starting state:**

**Steps 1–2 setup:**

- `<listing_1>` is open in USD.
- customer A(card linked, email `<customer A email>`) and customer B(card linked, email `<customer B email>`) each have an accepted public bid on `<listing_1>`.
- A collector is on the listing page for `<listing_1>` in English.

**Steps 3–4 setup:**

- customer A(signed in, card linked, email `<customer A email>`) has an accepted public bid on open `<listing_2>` and is on that listing page.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| customer A email | `ada@example.com` |
| customer A avatar letter | A: the public avatar letter derived from `<customer A email>`; bind the letter only |
| customer B email | `bob@example.com` |
| customer B avatar letter | B: the public avatar letter derived from `<customer B email>`; bind the letter only |
| listing_1 | The open USD listing with accepted public bids in this case; bind its identity only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| customer A email | `ada@example.com` |
| customer A avatar letter | A: the public avatar letter derived from `<customer A email>`; bind the letter only |
| listing_2 | The open USD listing with customer A’s accepted public bid in this case; bind its identity only |

### Route

1. Open Recent Bids on the listing page.
2. Find customer A's public row and customer B's public row.
   - Customer A's avatar shows `<customer A avatar letter>`. `g10.auction-listing-page.US15-TC1`
   - Customer B's avatar shows `<customer B avatar letter>`. `g10.auction-listing-page.US15-TC1`
   - Neither row shows an email or personal name. `g10.auction-listing-page.US15-TC1`
   - Readable labels stay listing pseudonyms or You, not an email-prefixed form. `g10.auction-listing-page.US15-TC1`
3. Open Recent Bids.
4. Find the row marked You.
   - The You row's avatar shows `<customer A avatar letter>`. `g10.auction-listing-page.US15-TC2`
   - The row still shows the You badge. `g10.auction-listing-page.US15-TC2`

## Walk 15: Additional fixture checks

**Starting state:**

**Steps 1–6 setup:**

- customer has `<reused_address>` saved before `<original_listing>` was called off.
- `<replacement_listing>` is the eligible current holder in `<replacement_state>`.
- No bid or standing change occurs during this pass.
- The browser runs no client-side scripts.

**Steps 7–11 setup:**

- customer has `<reused_address>` saved before `<original_listing>` was called off.
- `<replacement_listing>` is public and holds that released slug.
- customer is on the auction catalogue with scripts running.
- A saved link in this session names `<reused_address>`.

**Steps 12–17 setup:**

- customer is on the auction catalogue with scripts running.
- `<original_listing>` is called off and `<holder_state>` applies.
- A saved link in this session names `<released_address>`.

**Shared test data:**

**Steps 1–6 data:**

| Field | Value |
| --- | --- |
| original_listing | A called-off listing with a different title and description |
| replacement_listing | The eligible current holder, with its own title, description and bidding standing |
| reused_address | The original address shared by both listings |

| `<replacement_state>` |
| --- |
| Published, open to collectors |
| Closed, retained by public lookup |
| Settled, retained by public lookup |

**Steps 7–11 data:**

| Field | Value |
| --- | --- |
| original_listing | A called-off listing with a different title and description |
| replacement_listing | The eligible current holder, with its own title and description |
| reused_address | The original address shared by both listings |

**Steps 12–17 data:**

| `<holder_state>` | `<released_address>` |
| --- | --- |
| No listing holds the released slug | `<original_listing>`'s former address |
| A new unpublished draft holds the released slug | `<original_listing>`'s former address |
| A created unpublished replacement holds the released slug | `<original_listing>`'s former address |

| Field | Value |
| --- | --- |
| original_listing | The called-off listing that previously held `<released_address>`; bind its identity only |

### Route

1. Navigate to `<reused_address>`.
   - Step 1 returns 200 at `<reused_address>`. `g10.auction-listing-page.US1-TC3`
2. Read the served page.
   - Step 2 shows `<replacement_listing>`'s content and standing. `g10.auction-listing-page.US1-TC3`
3. Inspect its title, description and Open Graph metadata.
   - Step 3 names `<replacement_listing>` and `<reused_address>`. `g10.auction-listing-page.US1-TC3`
4. Inspect embedded data and fresh share-preview metadata.
   - Step 4 names only `<replacement_listing>` as the current holder. `g10.auction-listing-page.US1-TC3`
5. Enable scripts on this same address.
6. Read the hydrated page and client lookup data.
   - No content or fresh metadata identifies `<original_listing>`. `g10.auction-listing-page.US1-TC3`
   - No redirect or called-off page appears. `g10.auction-listing-page.US1-TC3`
   - Preview title, description and URL identify `<replacement_listing>`. `g10.auction-listing-page.US1-TC3`
   - No separate listing-code or payment-reference field appears. `g10.auction-listing-page.US1-TC3`
   - A code appears only within the full canonical address. `g10.auction-listing-page.US1-TC3`
   - The served document title and meta description name `<replacement_listing>`. `g10.auction-listing-page.US1-TC3`
   - Its canonical address and og:url equal `<reused_address>`. `g10.auction-listing-page.US1-TC3`
   - og:title and og:description name `<replacement_listing>`. `g10.auction-listing-page.US1-TC3`
   - Step 6 keeps the same `<replacement_listing>`, title, description and bidding standing. `g10.auction-listing-page.US1-TC3`
   - No placeholder, old-listing content or separate code field replaces served content. `g10.auction-listing-page.US1-TC3`
7. Open the saved link through client navigation.
8. Read the listing page after its lookup completes.
   - Step 8 shows `<replacement_listing>`'s content and standing. `g10.auction-listing-page.US1-TC4`
9. Reload `<reused_address>`.
   - Step 9 returns 200. `g10.auction-listing-page.US1-TC4`
10. Read the served page.
   - Step 10 shows the same `<replacement_listing>`. `g10.auction-listing-page.US1-TC4`
11. Inspect hydrated DOM, lookup response and fresh preview metadata.
   - The address remains `<reused_address>`. `g10.auction-listing-page.US1-TC4`
   - No content identifies `<original_listing>`. `g10.auction-listing-page.US1-TC4`
   - No redirect or called-off page appears. `g10.auction-listing-page.US1-TC4`
   - Step 11 names `<replacement_listing>`, its title and full address. `g10.auction-listing-page.US1-TC4`
   - Neither `<original_listing>` nor its data appears. `g10.auction-listing-page.US1-TC4`
   - No separate listing-code or payment-reference field appears. `g10.auction-listing-page.US1-TC4`
12. Open the saved link through client navigation.
13. Read the page after its lookup completes.
   - Step 13 shows Page not found. `g10.auction-listing-page.US3-TC4`
14. Inspect the client lookup response.
   - Step 14 contains no listing data or listing code. `g10.auction-listing-page.US3-TC4`
15. Reload the address.
   - Step 15 returns 404 with the same not-found surface. `g10.auction-listing-page.US3-TC4`
16. Open the original code alone through client navigation.
17. Reload that code-only address.
   - Neither `<original_listing>` nor the unpublished holder appears. `g10.auction-listing-page.US3-TC4`
   - Steps 16 and 17 show Page not found, with no listing data. `g10.auction-listing-page.US3-TC4`
   - Step 17 returns 404 and no listing code. `g10.auction-listing-page.US3-TC4`
   - No redirect, empty listing page or catalogue replaces it. `g10.auction-listing-page.US3-TC4`

## g10.auction-listing-page.US1: Collector opens a listing at its own address

**As a** collector,
**I want** a listing's address to answer with that listing's own page in the response
HTML,
**so that** I can read its name, its description and where its bidding stands
without waiting for a script to run.

### g10.auction-listing-page.US1-TC1: Listing answers whole before scripts run

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
The catalogue publishes `<published_listing>`. JavaScript disabled in the browser.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

| Field | Value |
| --- | --- |
| lang | The supported language code selected for the canonical listing URL in this fixture; bind its URL language segment only |

**Steps:**

1. Navigate to `<published_listing_url>`.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Response status is 200 and the listing page renders.
* URL contains `<lang>`.
* Page source carries that listing's name, description, and bidding standing.

<!-- trace:case id=g10.auction-listing-page.TC-82e rev=2 -->
### g10.auction-listing-page.US1-TC2: Two listings answer as two pages

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
The catalogue publishes two listings.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |
| second_published_listing_url | The canonical URL of a different published listing with its own name and standing; bind the URL only |

**Steps:**

1. Navigate to `<published_listing_url>` and note name, standing, title, meta description and `og:url`.
2. Navigate to `<second_published_listing_url>` and note the same.

**Expected Results:**

* Each response carries its own listing's name and standing.
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

* customer has `<reused_address>` saved before `<original_listing>` was called off.
* `<replacement_listing>` is the eligible current holder in `<replacement_state>`.
* No bid or standing change occurs during this pass.
* The browser runs no client-side scripts.

**Test data:**

| Field | Value |
| --- | --- |
| original_listing | A called-off listing with a different title and description |
| replacement_listing | The eligible current holder, with its own title, description and bidding standing |
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
* Step 2 shows `<replacement_listing>`'s content and standing.
* Step 3 names `<replacement_listing>` and `<reused_address>`.
* No content or fresh metadata identifies `<original_listing>`.
* No redirect or called-off page appears.
* Step 4 names only `<replacement_listing>` as the current holder.
* Preview title, description and URL identify `<replacement_listing>`.
* No separate listing-code or payment-reference field appears.
* A code appears only within the full canonical address.
* The served document title and meta description name `<replacement_listing>`.
* Its canonical address and og:url equal `<reused_address>`.
* og:title and og:description name `<replacement_listing>`.
* Step 6 keeps the same `<replacement_listing>`, title, description and bidding standing.
* No placeholder, old-listing content or separate code field replaces served content.

<!-- trace:case id=g10.auction-listing-page.TC-tof rev=3 -->
### g10.auction-listing-page.US1-TC4: Client navigation opens the eligible replacement listing

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

* customer has `<reused_address>` saved before `<original_listing>` was called off.
* `<replacement_listing>` is public and holds that released slug.
* customer is on the auction catalogue with scripts running.
* A saved link in this session names `<reused_address>`.

**Test data:**

| Field | Value |
| --- | --- |
| original_listing | A called-off listing with a different title and description |
| replacement_listing | The eligible current holder, with its own title and description |
| reused_address | The original address shared by both listings |

**Steps:**

1. Open the saved link through client navigation.
2. Read the listing page after its lookup completes.
3. Reload `<reused_address>`.
4. Read the served page.
5. Inspect hydrated DOM, lookup response and fresh preview metadata.

**Expected Results:**

* Step 2 shows `<replacement_listing>`'s content and standing.
* The address remains `<reused_address>`.
* Step 3 returns 200.
* Step 4 shows the same `<replacement_listing>`.
* No content identifies `<original_listing>`.
* No redirect or called-off page appears.
* Step 5 names `<replacement_listing>`, its title and full address.
* Neither `<original_listing>` nor its data appears.
* No separate listing-code or payment-reference field appears.

---

## g10.auction-listing-page.US2: Collector shares a listing link

**As a** collector,
**I want** a listing link to unfurl as that listing and its own canonical address,
**so that** a link I pass on names the listing it points at instead of the auction
catalogue.

<!-- trace:case id=g10.auction-listing-page.TC-89i rev=2 -->
### g10.auction-listing-page.US2-TC1: Shared listing link unfurls as that listing

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

**Test data:**

| Field | Value |
| --- | --- |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Navigate to `<published_listing_url>`.
2. Check the page source for `og:title`, `og:description` and `og:url`.

**Expected Results:**

* Page source carries `og:title`, `og:description` and `og:url` naming that listing and its own address.
* None of them names the auction catalogue in its place.

---

## g10.auction-listing-page.US3: Collector opens an address that names no listing

**As a** collector,
**I want** an address under the auction's listings that names no published listing to
answer with the site's not-found surface,
**so that** I am never shown an empty listing page or the catalogue in its place.

<!-- trace:case id=g10.auction-listing-page.TC-3xv rev=2 -->
### g10.auction-listing-page.US3-TC1: Unknown listing address returns not-found

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
The catalogue publishes no listing for `<unknown_listing_url>`.

**Test data:**

| Field | Value |
| --- | --- |
| unknown_listing_url | An auction listing URL with no published listing or eligible holder; bind the URL only |

**Steps:**

1. Navigate to `<unknown_listing_url>`.
2. Check the rendered page.
3. Check the response status.

**Expected Results:**

* Response status is 404.
* The site's not-found surface is on screen.

<!-- trace:case id=g10.auction-listing-page.TC-6r8 rev=2 -->
### g10.auction-listing-page.US3-TC2: Published listing address returns the listing page

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
The catalogue publishes `<published_listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Navigate to `<published_listing_url>`.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 200.
* The page is that listing's page.

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
5. Open the original listing code alone as the listing address.
6. Inspect that response and page.
7. Open the original collector's watchlist.
8. Search for the called-off original listing.

**Expected Results:**

* Step 2 returns 404.
* Step 3 shows Page not found.
* Neither original listing nor unpublished replacement appears.
* No empty listing page, redirect or catalogue replaces it.
* Step 4 contains no original-listing or replacement-listing data.
* Step 4 contains no listing code or payment reference.
* Step 5 returns 404.
* Step 6 shows Page not found with no listing data or code.
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
* `<original_listing>` is called off and `<holder_state>` applies.
* A saved link in this session names `<released_address>`.

**Test data:**

| `<holder_state>` | `<released_address>` |
| --- | --- |
| No listing holds the released slug | `<original_listing>`'s former address |
| A new unpublished draft holds the released slug | `<original_listing>`'s former address |
| A created unpublished replacement holds the released slug | `<original_listing>`'s former address |

| Field | Value |
| --- | --- |
| original_listing | The called-off listing that previously held `<released_address>`; bind its identity only |

**Steps:**

1. Open the saved link through client navigation.
2. Read the page after its lookup completes.
3. Inspect the client lookup response.
4. Reload the address.
5. Open the original code alone through client navigation.
6. Reload that code-only address.

**Expected Results:**

* Step 2 shows Page not found.
* Neither `<original_listing>` nor the unpublished holder appears.
* Step 3 contains no listing data or listing code.
* Step 4 returns 404 with the same not-found surface.
* Steps 5 and 6 show Page not found, with no listing data.
* Step 6 returns 404 and no listing code.
* No redirect, empty listing page or catalogue replaces it.

---

## g10.auction-listing-page.US4: Collector reads a live listing while scripts load

**As a** collector,
**I want** the listing I was served to stay on screen once scripts finish loading,
**so that** nothing I was reading blanks into a placeholder and no value
disagrees with what the document carried.

<!-- trace:case id=g10.auction-listing-page.TC-wka rev=2 -->
### g10.auction-listing-page.US4-TC1: Served listing stays on screen after scripts

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
`<published_listing>` is on the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Navigate to `<published_listing_url>`.
2. Note the served name, description and standing in the document.
3. Wait until scripts finish loading.
4. Check the same fields on screen.

**Expected Results:**

* The same listing is on screen with its served name, description and standing still present.
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
a bidding countdown is shown on `<published_listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Navigate to `<published_listing_url>`.
2. Note how long bidding has left in the document.
3. Wait until scripts finish loading.
4. Check how long bidding has left on screen.

**Expected Results:**

* What is on screen continues from what the document carried, rather than contradicting it.

---

## g10.auction-listing-page.US5: Collector reaches a listing from the catalogue

**As a** collector,
**I want** to open a listing's own address from the catalogue without a page load,
**so that** the listing I picked out of the list is the page I land on.

<!-- trace:case id=g10.auction-listing-page.TC-fe3 rev=2 -->
### g10.auction-listing-page.US5-TC1: Catalogue opens the listing's own address

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
The collector is viewing the auction catalogue, which lists `<published_listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing available in the auction catalogue; bind its public title only |

| Field | Value |
| --- | --- |
| grade10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Open `<published_listing>` the catalogue lists.

**Expected Results:**

* The browser is on that listing's address, showing that listing's page.

<!-- trace:case id=g10.auction-listing-page.TC-edm rev=3 -->
### g10.auction-listing-page.US5-TC2: Sitemap lists each published listing

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
The catalogue holds `<published_listing>`.

**Test data:**

| Field | Value |
| --- | --- |
| published_listing | A published listing in the catalogue; bind its public title only |

| Field | Value |
| --- | --- |
| grade10 sitemap url | The sitemap URL in the test environment; bind its URL only |

**Steps:**

1. Fetch `<grade10 sitemap url>`.
2. Check every sitemap entry.

**Expected Results:**

* `<published_listing>`'s address is listed as an absolute URL of the serving environment.
* No entry carries an unfilled parameter in place of a listing.

---

## g10.auction-listing-page.US6: Watch an auction and open My Auctions from the toast

**As a** collector on a listing I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that listing without hunting for the account page.

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

* customer(signed in, no bid on `<listing_12>`, not watching `<listing_12>`) is on `<listing_12 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_12 | An open listing taking bids, not watched and not bid on by this collector |
| listing_12 url | The canonical URL of `<listing_12>`; bind the URL only |

**Steps:**

1. Note the current bid, time left and bid panel.
2. Click the Watch control.
3. Click View My Auctions in the toast.

**Expected Results:**

* Step 2: the control reads Watching.
* Step 2: a toast says email alerts are on, with View My Auctions.
* Step 2: current bid, time left and bid panel are unchanged.
* Step 3: My Auctions opens and lists `<listing_12>` once, Your Standing `--`.
* Step 3: `<listing_12>`'s email alerts switch is on.

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

* customer(signed out) is on `<listing_12 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_12 | An open listing taking bids |
| listing_12 url | The canonical URL of `<listing_12>`; bind the URL only |

**Steps:**

1. Click the Watch control.
2. Sign in using the offered sign-in flow.

**Expected Results:**

* Step 1: sign-in is offered; no toast says email alerts are on.
* Step 2: the collector returns to `<listing_12 url>`.
* Step 2: the control reads Watch; nothing was watched before sign-in.

---

## g10.auction-listing-page.US7: Unwatch from the auction and undo

**As a** collector who watched a listing without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the listing again.

<!-- trace:case id=g10.auction-listing-page.TC-pjv rev=2 -->
### g10.auction-listing-page.US7-TC1: Unwatch removes the listing and turns alerts off

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

* customer(signed in, watching `<listing_13>`, no bid on `<listing_13>`) is on `<listing_13 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | An open listing taking bids, watched with email alerts on, not bid on by this collector |
| listing_13 url | The canonical URL of `<listing_13>`; bind the URL only |

| Field | Value |
| --- | --- |
| grade10 my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps:**

1. Click the Watching control.
2. Open `<grade10 my auctions url>` in a new tab.

**Expected Results:**

* Step 1: the control reads Watch.
* Step 1: a toast says the listing left My Auctions, with Undo.
* Step 1: current bid, time left and bid panel are unchanged.
* Step 2: `<listing_13>` is not listed.

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

* customer(signed in, watching `<listing_13>`, no bid on `<listing_13>`) is on `<listing_13 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | An open listing taking bids, watched with email alerts on, not bid on by this collector |
| listing_13 url | The canonical URL of `<listing_13>`; bind the URL only |

| Field | Value |
| --- | --- |
| grade10 my auctions url | The signed-in My Auctions URL in the test environment; bind its URL only |

**Steps:**

1. Click the Watching control.
2. Click Undo in the toast.
3. Open `<grade10 my auctions url>` in a new tab.

**Expected Results:**

* Step 2: the control reads Watching again.
* Step 3: `<listing_13>` is listed once, Your Standing `--`.
* Step 3: `<listing_13>`'s email alerts switch is on.

---

## g10.auction-listing-page.US8: After bidding, Watching stays locked

**As a** bidder on this listing,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the listing,
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

* customer(signed in, enrolled to bid, not watching `<listing_14>`, no bid on `<listing_14>`) is on `<listing_14 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | An open listing taking bids, with no bid from this collector |
| first bid | The next valid bid shown on the bid panel |
| listing_14 url | The canonical URL of `<listing_14>`; bind the URL only |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Click the Watching control.
3. Reload `<listing_14 url>`.

**Expected Results:**

* Step 1: a toast says email alerts are on.
* Step 1: the control reads Watching, disabled.
* Step 2: nothing changes; no Unwatch toast.
* Step 3: the control still reads Watching, disabled; no alerts toast.

<!-- trace:case id=g10.auction-listing-page.TC-amc rev=2 -->
### g10.auction-listing-page.US8-TC2: A second bid on the listing shows no alerts toast

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

* customer A(signed in, has bid on `<listing_15>`, outbid) is on `<listing_15 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_15 | An open listing taking bids, where customer A bid before and customer B now leads |
| raise | The next valid bid shown on the bid panel |
| listing_15 url | The canonical URL of `<listing_15>`; bind the URL only |

**Steps:**

1. Place `<raise>` from the bid panel.

**Expected Results:**

* No toast says email alerts are on.
* The control reads Watching, disabled.

---

## g10.auction-listing-page.US9: Closed listing has no watch control

**As a** collector on a closed listing (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

<!-- trace:case id=g10.auction-listing-page.TC-84a rev=2 -->
### g10.auction-listing-page.US9-TC1: A closed listing shows no watch control

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

* The listing at `<closed listing url>` is in `<listing_state>` for the viewer described in Test data.

**Test data:**

| `<listing_state>` | Viewer |
| --- | --- |
| Sold, with a winner | customer(signed in, never watched or bid on it) |
| Sold, with a winner | customer(signed in, watched it before the close, no bid) |
| Sold, with a winner | customer(signed in, bid on it and lost) |
| Sold, with a winner | customer(signed out) |
| Ended with no bids | customer(signed in, watched it before the close) |
| Ended with no bids | customer(signed out) |

| Field | Value |
| --- | --- |
| closed listing url | The canonical URL of the closed listing in this row; bind the URL only |

**Steps:**

1. Navigate to `<closed listing url>`.
2. Check the listing image area and the bid panel area.

**Expected Results:**

* Step 1: the listing page renders.
* Step 2: no Watch or Watching control shows anywhere on the listing page.

---

## g10.auction-listing-page.US10: Collector quotes a published listing

**As a** collector browsing a listing,
**I want** to reference and share a listing by its title and URL,
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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>`.
2. View the page's response source before any script runs.
3. Identify each occurrence of `<listing_code>` and inspect its context.

**Expected Results:**

* The source names the listing by its title.
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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.
* Its bidding standing stays unchanged during the pass.
* The browser initially runs no scripts.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>` with scripts disabled.
2. Record its served title, description and bidding standing.
3. Enable scripts on the same address.
4. Read the hydrated page, DOM, source and document metadata.
5. Inspect every listing-code occurrence.

**Expected Results:**

* Step 2 provides the addressed listing's title, description and bidding standing.
* Step 4 keeps those same served values after hydration.
* No placeholder replaces served content.
* Hydrated DOM and document metadata name the same listing.
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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Fetch the share-preview metadata for `<published_listing_url>`.
2. Search the preview's title, description and url for `<listing_code>`.
3. Inspect the preview image and embedded metadata.
4. Read the same address's document title and meta description.

**Expected Results:**

* The preview's title and description have no labelled listing-code or payment-reference field.
* Its URL is the canonical address ending in the lower-case listing-code suffix.

Previously cached preview content may persist; the test does not require a
purge or regeneration. A fresh preview fetch must satisfy the absence above.
* The preview identifies the public listing by title and full address.
* Image and embedded metadata expose no separate code or payment reference.
* Step 4 identifies the same public listing by title and description.
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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>`.
2. Read the browser tab title and the page's meta description.
3. Compare the title and description with the addressed listing.

**Expected Results:**

* Neither the tab title nor the meta description contains the listing code.
* Both identify the addressed listing, never the auction catalogue.

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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>`.
2. View the page's response source.
3. Search any data embedded in the document, outside the visible text, for `<listing_code>`.

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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>` and let the page finish loading.
2. Inspect the responses the page's own client-side requests receive.
3. Search those responses for `<listing_code>`.

**Expected Results:**

* No page response contains a separate listing-code or payment-reference field.

<!-- trace:case id=g10.auction-listing-page.TC-cbx rev=2 -->
### g10.auction-listing-page.US10-TC7: Listing code does not resolve as a listing address

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

* A published listing exists and its listing code is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |

**Steps:**

1. Open the auction's listing-address path, substituting `<listing_code>` for its usual identifier.

**Expected Results:**

* The address does not resolve to that listing's page.
* The site's not-found surface is shown, the same as for any address naming no published listing.

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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>` as a signed-out visitor and search the page and its source for `<listing_code>`.
2. Open the same address signed in as a registered collector and repeat the search.

**Expected Results:**

* Neither view has a labelled listing-code or payment-reference field; the canonical address may end in the lower-case code suffix.
* The title and address shown are identical in both views.

<!-- trace:case id=g10.auction-listing-page.TC-6de rev=3 -->
### g10.auction-listing-page.US10-TC9: Listing code stays absent once an order exists on the listing

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

* A listing's auction has closed with a winning bid, so an order now exists on that listing.

**Steps:**

1. Open the listing's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Inspect every occurrence of the lower-case listing-code suffix, which is now also the order's payment reference.
4. Inspect hydrated DOM, page lookup responses, title and description.

**Expected Results:**

* The page and preview contain no labelled listing-code or payment-reference field.
* The code appears only as the lower-case suffix of the canonical address.
* All surfaces name the same listing and its full address.
* Title and description contain no listing code or payment reference.
* Embedded and network data contain no separate code or payment reference.

<!-- trace:case id=g10.auction-listing-page.TC-y7l rev=3 -->
### g10.auction-listing-page.US10-TC10: An address naming no listing carries no listing code

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

* The catalogue publishes no listing for `<unknown_listing_url>`.

**Test data:**

| Field | Value |
| --- | --- |
| unknown_listing_url | An auction listing URL with no published listing or eligible holder; bind the URL only |

**Steps:**

1. Fetch `<unknown_listing_url>`.
2. Search the response, including any error detail, for a listing code.
3. Check the not-found page and embedded data.

**Expected Results:**

* Response status is 404.
* No listing code appears anywhere in the response.
* No listing content or separate payment reference appears.

<!-- trace:case id=g10.auction-listing-page.TC-90g rev=4 -->
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
* The listing is closed or settled, without explicit deletion.
* The listing was not called off.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| listing_url | The canonical URL of the listing in this case, retained after the close; bind the URL only |

**Steps:**

1. Open `<listing_url>` directly.
2. Inspect the rendered page, response source and fresh share-preview metadata.

**Expected Results:**

* `<listing_url>` still returns its public listing page.
* The page and fresh preview identify the listing by its public title and canonical URL.
* Outside the lower-case suffix of `<listing_url>`, `<listing_code>` is absent from the page, embedded data, network responses and fresh preview metadata.
* Closing does not release or replace `<listing_url>` or `<listing_code>`.

<!-- trace:case id=g10.auction-listing-page.TC-k71 rev=3 -->
### g10.auction-listing-page.US10-TC12: A cached preview may persist after the close without private data

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
* The listing subsequently closes, without explicit deletion.
* An authorized admin or the winner knows `<listing_code>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| listing_url | The canonical URL of the listing in this case, retained after the close; bind the URL only |

**Steps:**

1. Request the existing cached preview for `<listing_url>`.
2. Inspect its title, description, URL, image and embedded metadata.

**Expected Results:**

* The cached preview may continue to show previously cached public listing metadata and `<listing_url>`.
* It contains no separate listing code or payment reference, internal/provider reference, winner data or admin-only data.

---

## g10.auction-listing-page.US11: Collector contacts support about a listing

**As a** collector contacting support about a listing,
**I want** support to quickly identify which listing I'm referring to,
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

* A published listing exists at its own address.
* The listing code `<listing_code>` is known from the admin listing screen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |
| published_listing_url | The canonical URL of the published listing in this case; bind the URL only |

**Steps:**

1. Open `<published_listing_url>`.
2. Read the public listing title and full address.
3. Inspect the page and source for a separate code field.
4. As admin(support), find the public listing by that title.
5. Open the matched listing.

**Expected Results:**

* Step 2 provides the public title and full address.
* Step 3 offers no separate code or payment reference.
* Step 4 finds the listing without a listing code.
* Support lookup shows no separate listing-code or payment-reference field.
* Step 5 identifies the same listing by title and full address.
* The opened public listing shows no separate code to support.

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

* A published listing exists and its listing code is known from a leak or from another surface.

**Test data:**

| Field | Value |
| --- | --- |
| listing_code | The stable listing code of the listing in this case, known from the surface stated in Pre-conditions; bind the code only |

**Steps:**

1. Attempt to open the listing's address by substituting `<listing_code>` for the listing's usual identifier.

**Expected Results:**

* The listing code does not resolve to the listing.
* No working link to the listing can be built from the code alone.

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

* A listing's auction has closed with a winning bid, so an order now exists on that listing.

**Steps:**

1. Open the listing's own address on the public listing page.
2. Note its title and address.
3. Inspect DOM, source, embedded data and fresh preview metadata.
4. As admin(support), find and open the listing by title.

**Expected Results:**

* The title and canonical address are unchanged by the order.
* The page has no labelled listing-code or payment-reference field; the code appears only as the lower-case canonical-address suffix.
* Step 3 exposes no separate code or payment reference.
* Step 4 finds the same listing without a code.

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

## g10.auction-listing-page.US12: Collector sees another bid on the listing without reloading

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
* customer A is on the listing page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid count | 3 | · |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

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
* customer A is on the listing page for `<listing_2>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_2 | An open USD listing with one accepted bid, extension duration `<extension duration>`, no cap | · |
| extension duration | 1800s | (30mins) |

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
* customer A is on the listing page for `<listing_1>`, with the browser's live connection to the auction blocked.
* customer B(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the listing page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | An open USD listing with bids, scheduled close more than an hour away | · |
| current bid | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<customer A maximum>`, and is on its listing page.
* customer B(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_8 | An open USD listing, scheduled close more than an hour away | · |
| current bid | USD1200 | (120000 USD minor units) |
| customer A maximum | USD1275 | (127500 USD minor units) |
| customer B maximum | USD1300 | (130000 USD minor units), above `<customer A maximum>` |
| increment | USD25 | (2500 USD minor units), the USD1000 tier increment |
| highest_bid_after | USD1,300 | (130000 USD minor units): `<customer A maximum>` plus `<increment>` |
| minimum_next_bid | USD1,325 | (132500 USD minor units): `<highest_bid_after>` plus `<increment>` |

**Steps:**

1. As customer A, read the standing on the bid panel.
2. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read the standing, Highest bid and the next valid bid.

**Expected Results:**

* Step 1 reads Leading, with Your maximum `<customer A maximum>`.
* Step 3 reads Outbid, with no reload.
* Step 3 reads Highest bid `<highest_bid_after>`, `<customer A maximum>` plus `<increment>`.
* Step 3 shows `<minimum_next_bid>` as the minimum next valid bid.

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

* customer A(signed in) leads `<listing_8>` with maximum `<customer A maximum>`.
* customer C(signed out) is on the listing page for `<listing_8>`, with the browser's network inspector recording its live connection.
* customer B(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_8 | An open USD listing, scheduled close more than an hour away | · |
| customer A maximum | USD9,280 | (range: 500000–999999 minor units) |
| customer B maximum | USD6,160 | (range: 500000–999999 minor units), below `<customer A maximum>` |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer C, read every message the live connection received after step 1.

**Expected Results:**

* Step 2 shows an update carrying the new price, bid count and close.
* No message carries `<customer A maximum>`, an account id, an email or a card detail.
* Any bidder a message names appears only by the listing's pseudonym.

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_16>` is open in USD, before its scheduled close, with no bid.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the listing page for `<listing_16>`, in English.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| maximum | USD1,800 | At least two increments above the opening price; representative USD fixture |
| listing_16 | An open USD listing with no bid, before its scheduled close, opening price at least two increments below `<maximum>`; bind its identity only | · |

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_16>` is open in USD, before its scheduled close, with no bid.
* customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the listing page for `<listing_16>`, in English.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| maximum | USD1,800 | At least two increments above the opening price; representative USD fixture |
| higher maximum | USD2,200 | At least two increments above `<maximum>`; representative USD fixture |
| listing_16 | An open USD listing with no bid, before its scheduled close, opening price at least two increments below `<maximum>`; bind its identity only | · |

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* collector A has `<listing_17>` open with a live line.
* customer B(card linked, email `<customer B email>`) can bid on `<listing_17>` from another session.

**Test data:**

| Field | Value |
| --- | --- |
| customer B email | `mike@example.com` |
| listing_17 | An open USD listing whose live connection is available and customer B can bid; bind its identity only |
| customer B avatar letter | M: the public avatar letter derived from `<customer B email>`; bind the letter only |

**Steps:**

1. As collector A, watch Recent Bids.
2. As customer B, place an accepted public bid on `<listing_17>`.
3. As collector A, without reloading, find customer B's new Recent Bids row.

**Expected Results:**

* The new row appears without a reload.
* Its avatar shows `<customer B avatar letter>`.
* Its readable label is a listing pseudonym, not an email.

---

## g10.auction-listing-page.US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the listing's countdown to agree with every other page on that listing, whatever my device's clock says,
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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the listing page for `<listing_3>` on a device whose clock is `<device skew>`.
* customer B is on the same listing page on a device whose clock is correct.

**Test data:**

| `<device skew>` |
| --- |
| 4 minutes ahead |
| 4 minutes behind |

| Field | Value |
| --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away |

| Field | Value | Fixture notes |
| --- | --- | --- |
| observation interval | 45 seconds | (fixed observation fixture) |

**Steps:**

1. Read Time left on customer A's page and customer B's page at the same moment.
2. Wait `<observation interval>`.
3. Read Time left on both pages at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second, at step 1.
* Both pages read the same Time left, to the second, at step 3.
* Neither page is off by `<device skew>`.

<!-- trace:case id=g10.auction-listing-page.TC-56e rev=2 -->
### g10.auction-listing-page.US13-TC2: Last second never reads 0 while the listing takes bids

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_4>` is open with no accepted bid, its close under a minute away.
* customer A is on the listing page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | An open USD listing with no bids, extension duration 1800s (30mins) |
| last moment | 0.4 seconds before the close |

**Steps:**

1. Watch Time left from 10 seconds before the close.
2. Read Time left at `<last moment>`.
3. Read Time left just after the close passes.

**Expected Results:**

* Through step 1 Time left shows whole seconds only, never tenths.
* At step 2 Time left reads 1 second, never 0.
* At step 3 Time left reads 0 or the listing reads Closed.

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the listing page for `<listing_3>`.
* customer B is on the same listing page on a device whose clock is correct.

**Test data:**

| `<away>` |
| --- |
| customer A's device sleeps for 45 seconds |
| customer A's browser goes offline for 45 seconds, then reconnects |
| customer A switches to another tab for 45 seconds, then back |

| Field | Value |
| --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away |
| clock change | a 90-second forward change to customer A's device clock |

**Steps:**

1. Apply `<clock change>` while `<away>`.
2. Return to the listing page, without reloading.
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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_3>` is open, its close about 12 minutes away.
* customer A is on the listing page for `<listing_3>`.
* The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_3 | An open USD listing, close about 12 minutes away | · |
| correction | 0.6 seconds | under a second |

| Field | Value | Fixture notes |
| --- | --- | --- |
| observation interval | 5 seconds | (fixed observation fixture) |

**Steps:**

1. Switch to another tab.
2. Switch back to the listing page.
3. Watch Time left for `<observation interval>`.

**Expected Results:**

* Time left never reads a higher value than it read the moment before.

---

## g10.auction-listing-page.US14: Bidder waits on a closed listing for its result

**As a** bidder,
**I want** a listing past its close to read Closed until its result is recorded, then Won or Did not win,
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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* The listing `<listing_18>` has this state: `<listing_state>`, its close under a minute away, and no further bid will be placed.
* `<viewer>` is signed in and on the listing page for `<listing_18>`.

**Test data:**

| `<listing_state>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

| Field | Value |
| --- | --- |
| listing_18 | A USD listing in `<listing_state>` with its close under a minute away; bind its identity only |

**Steps:**

1. Watch the listing through its close, without reloading.
2. Read the listing's state until the result appears.

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_6>` and is on its listing page.
* `<listing_6>`'s close is under a minute away, and no further bid will be placed.
* Recording `<listing_6>`'s close is held back until the next sweep.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A USD listing led by customer A |

**Steps:**

1. Watch the listing through its close, without reloading.
2. Wait 30 seconds.
3. Reload the listing page.
4. Wait until the close is recorded.

**Expected Results:**

* Through steps 1 to 3 the page reads Closed with no result.
* No step shows Won, Did not win or Ended before the close is recorded.
* After step 4 the page reads Won, without a reload.

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in and on the listing page for `<listing_9>`, and has never bid on it.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and listing reads, and its device clock runs `<clock lag>` behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A USD listing in extended bidding, led by customer B, no cap | · |
| leader price | USD4,960 | (range: 100000–499999 minor units) |
| bid amount | USD5,210 | (range: 500000–999999 minor units), at or above the minimum next bid |

| Field | Value | Fixture notes |
| --- | --- | --- |
| clock lag | 30 seconds | (fixed stale-clock fixture) |
| bid delay | 5 seconds | (fixed after-close fixture, shorter than `<clock lag>`) |

**Steps:**

1. Wait until `<bid delay>` after the close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the listing page and wait until the close is recorded.
5. Read the listing's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* No new label or wording appears for the refused bid.
* At step 5 Highest bid reads `<leader price>`.
* At step 5 customer A's page shows neither Won nor Did not win.

<!-- trace:case id=g10.auction-listing-page.TC-1pq rev=3 -->
### g10.auction-listing-page.US14-TC5: A lone first bid refused past the close leaves the listing Ended with No bids

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in and on the listing page for `<listing_10>`.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and listing reads, and its device clock runs `<clock lag>` behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_10 | An open USD listing with no bids, starting price USD280 (range: 10000–49999 minor units), extension duration 1800s (30mins), no cap | · |
| bid amount | USD280 | (range: 10000–49999 minor units), the opening price |

| Field | Value | Fixture notes |
| --- | --- | --- |
| clock lag | 30 seconds | (fixed stale-clock fixture) |
| bid delay | 5 seconds | (fixed after-close fixture, shorter than `<clock lag>`) |

**Steps:**

1. Wait until `<bid delay>` after the scheduled close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the listing page and wait until the close is recorded.
5. Read Time left, the listing's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* At step 5 Time left never read Extended bidding.
* At step 5 the listing reads Ended, with No bids under it.
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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
* customer A is on the listing page for `<listing_11>`, with its live updates delayed by `<update delay>`.
* customer C(card linked) is signed in on a separate session, on the same listing page.

**Test data:**

| Field | Value |
| --- | --- |
| listing_11 | A USD listing in extended bidding, led by customer B, extension duration `<extension duration>`, no cap |
| bid amount | At or above the minimum next bid |

| Field | Value | Fixture notes |
| --- | --- | --- |
| update delay | 5 seconds | (fixed live-update delay fixture) |
| last bid offset | 1 second | (fixed last-second boundary) |
| extension duration | 1800s | (30mins) |

**Steps:**

1. As customer C, place `<bid amount>` `<last bid offset>` before the recorded close.
2. As customer A, watch Time left through the recorded close, without reloading.
3. As customer A, read the listing's state and the bid panel once the update arrives.

**Expected Results:**

* Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled.
* At step 3 Time left is labelled Extended bidding and counts to customer C's bid time plus `<extension duration>`.
* At step 3 the bid controls are enabled.
* No step shows Won, Did not win or Ended, and the page did not reload.

<!-- trace:case id=g10.auction-listing-page.TC-4ba rev=2 -->
### g10.auction-listing-page.US14-TC7: A sold listing crowns its winning bid and no other

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_19>` is live in USD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
* customer C is on the listing page for `<listing_19>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| listing_19 | A live USD listing led by customer A with customer B below, recorded close a minute away; bind its identity only |

**Steps:**

1. As customer C, read Recent bids before the close.
2. Wait for the close to be recorded as sold to customer A, without reloading.
3. As customer C, read Recent bids again.

**Expected Results:**

* Step 1: no row shows a crown.
* Step 3: customer A's winning row shows a crown named Winner after the amount.
* Step 3: no other row, customer B's included, shows a crown.

<!-- trace:case id=g10.auction-listing-page.TC-hqd rev=2 -->
### g10.auction-listing-page.US14-TC8: A listing without a winner crowns no bid

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* `<listing_20>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
* `<listing_21>` is past its close with no bid, its close recorded with no winner.
* customer C is signed in on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_20 | A USD listing past its close with bids, recording its close held until the next sweep; bind its identity only |
| listing_21 | A USD listing past its close with no bid, recorded with no winner; bind its identity only |

**Steps:**

1. As customer C, open the listing page for `<listing_20>` and read Recent bids.
2. As customer C, open the listing page for `<listing_21>` and read Recent bids.

**Expected Results:**

* Step 1: the listing reads Closed and no row shows a crown.
* Step 2: the listing reads Ended with No bids under it, Recent bids holds no row, and no crown shows.

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

---

## g10.auction-listing-page.US15: Collector tells Recent Bids rivals apart by avatar letter

**As a** collector,
**I want** each Recent Bids avatar on the listing to show that bidder's email
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
* customer A(card linked, email `<customer A email>`) and customer B(card linked, email `<customer B email>`) each have an accepted public bid on `<listing_1>`.
* A collector is on the listing page for `<listing_1>` in English.

**Test data:**

| Field | Value |
| --- | --- |
| customer A email | `ada@example.com` |
| customer A avatar letter | A: the public avatar letter derived from `<customer A email>`; bind the letter only |
| customer B email | `bob@example.com` |
| customer B avatar letter | B: the public avatar letter derived from `<customer B email>`; bind the letter only |
| listing_1 | The open USD listing with accepted public bids in this case; bind its identity only |

**Steps:**

1. Open Recent Bids on the listing page.
2. Find customer A's public row and customer B's public row.

**Expected Results:**

* Customer A's avatar shows `<customer A avatar letter>`.
* Customer B's avatar shows `<customer B avatar letter>`.
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

* customer A(signed in, card linked, email `<customer A email>`) has an accepted public bid on open `<listing_2>` and is on that listing page.

**Test data:**

| Field | Value |
| --- | --- |
| customer A email | `ada@example.com` |
| customer A avatar letter | A: the public avatar letter derived from `<customer A email>`; bind the letter only |
| listing_2 | The open USD listing with customer A’s accepted public bid in this case; bind its identity only |

**Steps:**

1. Open Recent Bids.
2. Find the row marked You.

**Expected Results:**

* The You row's avatar shows `<customer A avatar letter>`.
* The row still shows the You badge.

---

## g10.auction-listing-page.US16: Collector reads a lot's title and description in their own language

**As a** collector,
**I want** the card and the lot page to show the lot's title and description in the language I browse in,
**so that** I understand the card before I bid on it.

<!-- trace:case id=g10.auction-listing-page.TC-x0c rev=1 -->
### g10.auction-listing-page.US16-TC1: Lot page shows the title and description in the page's language

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published and live with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with all three languages written, slug `<slug_1>`, the title and description texts below |
| slug_1 | the address built from the English title and the listing code |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Open the lot page at `<lang>`/auction/listings/`<slug_1>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 1 loads the lot page.
* Step 2 reads `<title reads>`.
* Step 3 reads `<description reads>`.
* Steps 2 and 3 show no text of another language.

<!-- trace:case id=g10.auction-listing-page.TC-juv rev=1 -->
### g10.auction-listing-page.US16-TC2: Catalogue card shows each lot's title in the page's language

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` has all three languages written and `<listing_2>` has an English title only.
* `<listing_1>` and `<listing_2>` are both in the state `<card state>` and appear on the catalogue.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with `<english title>`, `<traditional title>` and `<simplified title>` |
| listing_2 | A published listing with `<english title>` only |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| simplified title | 宝可梦 喷火龙 PSA 10 |

| lang | card state | card title |
| --- | --- | --- |
| /tc | Active | `<traditional title>` |
| /sc | Active | `<simplified title>` |
| /tc | Upcoming | `<traditional title>` |
| /tc | Closed | `<traditional title>` |

**Steps:**

1. Open the catalogue at `<lang>`/auction.
2. Find the card of `<listing_1>`.
3. Find the card of `<listing_2>`.

**Expected Results:**

* Step 2 reads `<card title>` as the card's title.
* Step 3 reads `<english title>` as the card's title.
* Neither card shows a description.

<!-- trace:case id=g10.auction-listing-page.TC-cmf rev=1 covers=g10.auction-listing-page.SC-sbq -->
### g10.auction-listing-page.US16-TC3: A text left unwritten falls back to English on its own

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with `<english title>`, `<english description>` and `<traditional title>`; no Traditional Chinese description |
| slug_3 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_3>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<traditional title>`.
* Step 3 reads `<english description>`.
* Step 3 shows no empty description area.

<!-- trace:case id=g10.auction-listing-page.TC-44a rev=1 -->
### g10.auction-listing-page.US16-TC4: One Chinese is never shown in place of the other

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_4>` is published with the texts named by `<written>` and none in the other Chinese.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A published listing with `<english title>`, `<english description>` and only the `<written>` texts |
| slug_4 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | written |
| --- | --- |
| /sc | Traditional Chinese title and description |
| /tc | Simplified Chinese title and description |

**Steps:**

1. Open the lot page at `<lang>`/auction/listings/`<slug_4>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<english title>`.
* Step 3 reads `<english description>`.
* Steps 2 and 3 show no text of the language `<written>`.

<!-- trace:case id=g10.auction-listing-page.TC-xjc rev=1 -->
### g10.auction-listing-page.US16-TC5: A listing with no translations reads as it did before

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_5>` was published before translations existed and has an English title and description only.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A published listing with `<english title>` and `<english description>` only |
| slug_5 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_5>`.
2. Read the lot title.
3. Read the lot description.
4. Open the lot page at `/auction/listings/<slug_5>`.
5. Read the lot title and description.

**Expected Results:**

* Step 2 reads `<english title>`.
* Step 3 reads `<english description>`.
* Step 5 reads the same title and description as steps 2 and 3.

<!-- trace:case id=g10.auction-listing-page.TC-pda rev=1 -->
### g10.auction-listing-page.US16-TC6: A translation saved as spaces falls back to English

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_6>` is published and its Traditional Chinese `<field>` was saved as 3 spaces; its other Traditional Chinese text is written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A published listing with `<english title>`, `<english description>`, `<traditional title>` and `<traditional description>` before the row's text was set to 3 spaces |
| slug_6 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

| field | expected title | expected description |
| --- | --- | --- |
| title | `<english title>` | `<traditional description>` |
| description | `<traditional title>` | `<english description>` |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_6>`.
2. Read the lot title.
3. Read the lot description.

**Expected Results:**

* Step 2 reads `<expected title>`.
* Step 3 reads `<expected description>`.
* The page shows no blank title and no blank description area.

<!-- trace:case id=g10.auction-listing-page.TC-e8q rev=1 -->
### g10.auction-listing-page.US16-TC7: The first response already carries the title and description in the page's language

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
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published and live with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Request `<lang>`/auction/listings/`<slug_1>` with scripts disabled.
2. Read the lot title in the response HTML.
3. Read the lot description in the response HTML.

**Expected Results:**

* Step 2 reads `<title reads>`.
* Step 3 reads `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-k7m rev=1 -->
### g10.auction-listing-page.US16-TC8: Page title, meta description and Open Graph tags follow the page's language

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language | title reads | description reads |
| --- | --- | --- | --- |
| /tc | Traditional Chinese | `<traditional title>` | `<traditional description>` |
| /sc | Simplified Chinese | `<simplified title>` | `<simplified description>` |
| (none) | English, the default | `<english title>` | `<english description>` |

**Steps:**

1. Request `<lang>`/auction/listings/`<slug_1>` and read the response HTML.
2. Read the page title.
3. Read the meta description.
4. Read the Open Graph title.
5. Read the Open Graph description.

**Expected Results:**

* Step 2 includes `<title reads>`.
* Step 3 includes `<description reads>`.
* Step 4 includes `<title reads>`.
* Step 5 includes `<description reads>`.

<!-- trace:case id=g10.auction-listing-page.TC-hmv rev=1 -->
### g10.auction-listing-page.US16-TC9: Share metadata falls back to English one text at a time

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_3>` is published with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A published listing with `<english title>`, `<english description>` and `<traditional title>`; no Traditional Chinese description |
| slug_3 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Request `/tc/auction/listings/<slug_3>` and read the response HTML.
2. Read the page title and the Open Graph title.
3. Read the meta description and the Open Graph description.

**Expected Results:**

* Step 2 includes `<traditional title>` in both.
* Step 3 includes `<english description>` in both.

<!-- trace:case id=g10.auction-listing-page.TC-aam rev=1 -->
### g10.auction-listing-page.US16-TC10: A title with markup characters renders as text in the page and in metadata

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_7>` is published with a Traditional Chinese title containing the characters in `<markup title>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | A published listing with a Traditional Chinese title `<markup title>` and description containing the same characters |
| slug_7 | the address built from the English title |
| markup title | 噴火龍 <b>"PSA"</b> & <script>1</script> |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_7>`.
2. Read the lot title.
3. Read the Open Graph title and the meta description in the response HTML.

**Expected Results:**

* Step 2 shows `<markup title>` as typed, as text.
* Step 3 shows the characters escaped, with no extra tag or attribute created.
* No script runs.

<!-- trace:case id=g10.auction-listing-page.TC-11y rev=1 covers=g10.auction-listing-page.SC-xpl -->
### g10.auction-listing-page.US16-TC11: Every language answers at the same lot address and the address names the English title

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from `<english title>`, not from a Chinese title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| lang | language |
| --- | --- |
| /tc | Traditional Chinese |
| /sc | Simplified Chinese |
| (none) | English, the default |

**Steps:**

1. Open the catalogue at `<lang>`/auction.
2. Click the card of `<listing_1>`.
3. Read the address of the lot page.

**Expected Results:**

* Step 2 opens the lot page.
* Step 3 ends with `/auction/listings/<slug_1>` after the language prefix `<lang>`.
* Step 3 shows the same `<slug_1>` for every row, built from the English title.

<!-- trace:case id=g10.auction-listing-page.TC-ofr rev=1 covers=g10.auction-listing-page.SC-ex9 -->
### g10.auction-listing-page.US16-TC12: An edited translation shows on the next load and is not pushed to an open page

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on `<g10 site url>`.
* `<listing_1>` is published with `<traditional title>` written.
* admin(auction operator) can edit `<listing_1>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published, live listing with `<english title>` and `<traditional title>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| new traditional title | 寶可夢 噴火龍 初版 PSA 10 |

**Steps:**

1. Open the lot page at `/tc/auction/listings/<slug_1>` and read the title.
2. In the second session, replace the Traditional Chinese title with `<new traditional title>` and click Save.
3. In the first session, read the title without reloading.
4. Reload the lot page.
5. Read the title.

**Expected Results:**

* Step 3 still reads `<traditional title>`.
* Step 5 reads `<new traditional title>`.

<!-- trace:case id=g10.auction-listing-page.TC-p0g rev=1 -->
### g10.auction-listing-page.US16-TC13: Switching the page language switches the lot's texts

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
* **Trace:** grade10-site-auction-listing-page-US-16

**Pre-conditions:**

* customer is on the lot page of `<listing_1>` at `/tc/auction/listings/<slug_1>`.
* `<listing_1>` is published with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing with all three languages written, slug `<slug_1>` |
| slug_1 | the address built from the English title |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Read the lot title and description.
2. Choose Simplified Chinese in the site's language choice.
3. Read the lot title and description.
4. Choose English in the site's language choice.
5. Read the lot title and description.

**Expected Results:**

* Step 1 reads `<traditional title>` and `<traditional description>`.
* Step 3 reads `<simplified title>` and `<simplified description>`, at the `/sc` address.
* Step 5 reads `<english title>` and `<english description>`, at the unprefixed address.

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

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, written from the re-frozen anchors (Purpose, Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with `## Raised`, and the change's `domain-tcs.md`), with the delta scenarios SC-29 to SC-46, `tech-design.md` and `tasks.md`. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. QA2 added US14-TC5 and US14-TC6 for scenarios no blind case reached.

| Finding | Disposition |
| --- | --- |
| US12-TC1: another session's bid shows price and bid count without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-29` |
| US12-TC2: the scheduled close with a bid turns to Extended bidding | **Folded in:** `grade10-site-auction-listing-page-SC-31` |
| US12-TC3: a page with the live line blocked catches up by polling | **Folded in:** `grade10-site-auction-listing-page-SC-32`, `grade10-site-auction-auction-SC-77`. QA2 dropped the case's `auction.realtime` row: no flag exists (Q11) |
| US12-TC4: a page that lost its line catches up when it returns | **Folded in:** `grade10-site-auction-listing-page-SC-41` |
| US12-TC5: the leader's standing turns to Outbid with the next valid bid, without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-43` (Q12) |
| US12-TC6: live updates carry no maximum, account, email or card | **Folded in:** `grade10-site-auction-listing-page-SC-43` (AND clause); the frame contract is `grade10-site-auction-auction-SC-76` |
| US13-TC1: countdowns agree across devices whose clocks disagree | **Folded in:** `grade10-site-auction-listing-page-SC-33` |
| US13-TC2: the last second reads 1, whole seconds only | **Folded in:** `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-44` (Q31) |
| US13-TC3: sleep, reconnect and a tab return re-read the clock | **Folded in:** `grade10-site-auction-listing-page-SC-35` |
| US13-TC4: a sub-second correction never raises the countdown | **Folded in:** `grade10-site-auction-listing-page-SC-36` |
| US14-TC1: Closed with no result until recorded, then Won, Did not win, or Ended with No bids | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-40`; the no-bid row is the requirement's No winner row |
| US14-TC2: a close held to the sweep keeps Closed through a reload and never guesses | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-40` |
| US14-TC3: a hold confirming after the close reads "Your bid did not go through." alone, then Did not win | **Withdrawn:** `grade10-site-auction-listing-page-SC-39` is dropped, because a bid takes no card hold and none confirms after the close |
| US14-TC4: a bid reaching the auction after the close reads the same words alone | **Folded in:** `grade10-site-auction-listing-page-SC-45` (Q13) |
| `grade10-site-auction-listing-page-SC-46`: a lone first bid confirming at the scheduled close; no blind case walked the pending bid | **Added:** `g10.auction-listing-page.US14-TC5`. It also answers QA1's third raised question on the lot page: Ended with No bids, neither Won nor Did not win (Q1) |
| `grade10-site-auction-listing-page-SC-42`: a later recorded close returns a Closed page to Extended bidding; no blind case reached it | **Added:** `g10.auction-listing-page.US14-TC6` |

- **Covered at domain** — `g10.auction-dmn.US7-TC3` walks `grade10-site-auction-listing-page-SC-30`: a price-moving bid in extended bidding restarts the open page's countdown, labelled Extended bidding, without a reload

**Uncovered anchors:** none. `grade10-site-auction-listing-page-US-04` is a context journey; this change adds no scenario serving it, and its durable cases stand.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-listing-page-SC-45` by `g10.auction-listing-page.US14-TC4`; `grade10-site-auction-listing-page-SC-47` by the No bids row of the durable `g10.auction-listing-page.US14-TC1`, which reads Ended with No bids without a reload, and by `g10.auction-listing-page.US14-TC5` for a refused bid past the close
- **Revised** - `g10.auction-listing-page.US14-TC4` adds that a bidder whose only bid was refused past the close reads neither Won nor Did not win; `g10.auction-listing-page.US14-TC5` replaces a bid still confirming at the close with a bid refused past it. QA1 kept their ids; both move up a revision. `g10.auction-listing-page.US12-TC5` and `g10.auction-listing-page.US14-TC6` lose the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `g10.auction-listing-page.US14-TC3`, a bid still confirming at the close
- **Raised** - none
- **Retired** - grade10-site-auction-listing-page-SC-46, a lone first bid still confirming at the close, leaves the result words with the payment confirmation (Q3). No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** Accept-review fix round, 2026-10-05, for change `bid-history-winner-priority`. The Bidding page's Recent bids Winner line promised collectors an outcome no consumer requirement delivered, while `grade10` already sets both flags in `listingLotExtras.ts`. Read `proposal.md`, `decisions.md` (Q1 to Q3), this delta `spec.md`, the page line and the consumer's mapper and its tests. Written beside the scenarios, not blind.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Reread both cases against `grade10-site-auction-listing-page-SC-48` and `grade10-site-auction-listing-page-SC-49`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, its test, `listingUi.ts`'s sold panel and `ListingView.tsx`'s copy. It is a statement, not proof.

**Run:** QA2 reconciliation 2026-10-05, rerun after Q4 and Q5, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q5), `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row as Q4 left them, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts` and `listingLotExtras.test.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A sold lot crowns its won row and no other; a live lot crowns none | **Folded in:** `grade10-site-auction-listing-page-SC-48` / `g10.auction-listing-page.US14-TC7` |
| A tied maximum that came second carries the earlier-leads tip; the leader carries none | **Folded in:** `grade10-site-auction-listing-page-SC-49` / `g10.auction-listing-page.US12-TC7` |
| The tip on an older pair of equal amounts, below the current price | **Folded in:** Q4 settled it and `grade10-site-auction-listing-page-SC-51` states it, so the earlier Out of suite no longer holds; `g10.auction-listing-page.US12-TC8` walks it. The mapper test in `grade10`, `listingLotExtras.test.ts`, "keeps the same-price priority tip on older equal-price pairs", stays its unit proof |
| US12-TC8: an older tie needs a third bidder to move the price past it; customer A's earlier maximum answers customer B's later one | **Kept:** the case reads the rows at `<maximum>` by bidder, not by time, as `grade10-site-auction-listing-page-SC-51` does; customer A's automatic answer is stamped one ms after customer B's challenge, so customer A's row lists first once both are outbid |
| No crown on a lot Closed without a result or ended without a winner, stated by the requirement; no scenario carried it at the first QA2 | **Folded in:** reported to Dev, then at the owner's word `grade10-site-auction-listing-page-SC-50` / `g10.auction-listing-page.US14-TC8`; `listingLotExtras.test.ts`, "crowns no row until the lot is closed sold", proves the mapper half |
| US14-TC8 reread, written without a QA2 read: a sale is absolute and a called-off lot is hidden, so a close with no winner is a lot with no bid, and Recent bids holds no row to crown | **Kept:** the second lot stays, since `grade10-site-auction-listing-page-SC-50` names it; step 2 now asserts Ended with No bids and an empty Recent bids, which the durable `Anyone - No winner` row states, rather than a crown with no row to sit on |
| US14-TC8's first lot was "result not yet recorded" with no way to hold it there | **Folded in:** its pre-condition holds the close back until the next sweep, as the durable US14 delayed-close case does |
| US12-TC7: customer A's maximum on a lot with no bid leaves customer A a row at the opening price as well, so "customer A's row" named two rows, and the tip was read by accessible name | **Folded in:** steps and results name the rows at `<maximum>`, and step 4 hovers the Info control, `grade10-site-auction-listing-page-SC-49`'s WHEN |
| US14-TC7: "customer B's row shows no crown" asserted less than `grade10-site-auction-listing-page-SC-48`'s "no other row" | **Folded in:** step 3 asserts no other row, customer B's included |
| US14-TC7 waits for the sold result without a reload; the scenario does not say so | **Kept:** the page's sold panel and the crown read the same won bid (`listingUi.ts`, `ListingView.tsx`), and US-14's durable cases already read the result without a reload |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named neither the older tie nor `g10.auction-listing-page.US12-TC8` | **Resolved:** reported to Dev; 4.2 now names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles, and 4.4 walks `g10.auction-listing-page.US12-TC8` |
| Facts across the Bidding page line and decision row, Q1 to Q5, `tech-design.md` Decision 4, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; every row tied on amount with a row above it carries the tip, at the current price and at any older tie; the page supplies the copy in `en`, `ko`, `zh-Hans` and `zh-Hant` |
| Questions for the PM | None - Q1 to Q5 settle what this capability turns on |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q6, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause as Q6 left it, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, `listingLotExtras.test.ts` and the public ledger read in `repositories/listings.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6: rows tied on amount list leader or won first, then the earlier maximum | **Agree:** `grade10-site-auction-listing-page-SC-49` and `-SC-51` already name the tie by whose maximum came earlier, not by row time; both cases now say who sets `<maximum>` first in steps 1 and 2 and expect the tip on the row of the later maximum |
| US12-TC7: customer A's automatic answer at `<maximum>` is the leading row | **Kept:** the leader lists first under the build and under Q6 alike |
| US12-TC8: once customer C leads, neither row at `<maximum>` leads | **Kept:** the case expects Q6's order, customer A first; the build gives it, since customer A's answer is stamped one ms after customer B's challenge and both the public read and the mapper rank the newer row first. See the rerun after the built tie order below |
| A walker cannot see when a maximum was set, only each row's shown time, the same on both rows of a tie | **Folded in:** both cases expect the order by who set `<maximum>` first, whatever time each row shows |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named no older tie | **Resolved:** 4.2 names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles with no build change; 4.4 walks the tip at the current price and at an older tie lower down |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; no other active change holds these ids. No collision |
| Facts across the Bidding page line and decision row, Q1 to Q6, `tech-design.md` Decisions 4 and 5, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; a tie lists leader or won first, then the earlier maximum; every row with an equal amount listed above it carries the tip, at the current price and at any older tie |
| Questions for the PM | None - Q6 settles the order of a tie, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `g10.auction-listing-page.US14-TC7` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them.

**Run:** QA2 reconciliation 2026-10-05, rerun after the built tie order, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6, as Q6 now names the one-ms answer stamp), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` the stamp in `resolveStandingMaxima.ts`, the public ledger read in `repositories/listings.ts`, the "recent-bids consecutive same-bidder" test in `autoBidding.spec.ts`, and `listingLotExtras.ts` and its test. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A tie is not random: `resolveStandingMaxima.ts` stamps the leader's automatic answer one ms after the challenger, the public read orders an amount leader or won first, then newer, and the mapper ranks the same way | **Agree:** the earlier maximum lists first at the current price and after both are outbid; `autoBidding.spec.ts` lists the first bidder to set 180,000 above the second once both are outbid |
| An earlier row said US12-TC8 fails at random until task 4.2 lands | **Corrected:** `g10.auction-listing-page.US12-TC8` expects what the build already gives, customer A's row above customer B's at `<maximum>` and the tip on customer B's, and should pass at task 4.4's walk; task 4.2 names scenarios in test titles and changes no build. Each row above now states this outcome |
| US12-TC7 against `grade10-site-auction-listing-page-SC-49` | **Agree:** customer A leads at `<maximum>` and lists first; the tip is on customer B's row only |
| Each of US14-TC7 / `grade10-site-auction-listing-page-SC-48` and US14-TC8 / `-SC-50` | **Agree:** values and outcomes match each GIVEN, THEN and AND; the tie change touches neither |
| Accept-review: the `## Settled` lines cited decisions Q4 and Q6 without the change, and fold beside other changes' Settled lines | **Folded in:** each names `bid-history-winner-priority`; the Q6 line no longer says the order ignores the stamp, since the stamp is what keeps it |
| Accept-review: no `### Manual` table for the four manual cases | **Folded in:** `### Manual` below names what a person drives for each |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| Questions for the PM | None - Q6 settles the order of a tie and the build keeps it, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `g10.auction-listing-page.US14-TC7` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them; every case stays `draft`.

**Run:** the suite pass read the isolated bundle assembled by hand at
`/private/tmp/.../scratchpad/blind-suite-isolated-input.md` (Purpose, Feature
set with the new "Public identifier" group, this capability's
`user-journeys.md` including US-10 and US-11, `decisions.md` with `## Raised`
included, the two PRD sections, and the existing `feature-tcs.md` for id
continuity); it was denied `## Requirements`, `openspec/specs/` beyond the
quoted sections, and `openspec/changes/archive/`. The scenario pass read
`proposal.md`, `decisions.md`, this capability's `user-journeys.md`, the
durable `spec.md`'s full `## Requirements`, and the same two PRD sections; it
did not read `feature-tcs.md` or the suite draft.

| Diff | Disposition |
| --- | --- |
| Suite carried a case for the listing code staying absent once scripts finish running (US10-TC2); no scenario stated it — the scenario draft's "Server-rendered response" bullet only covered the pre-script HTML | Real: the requirement's after-scripts behaviour is undecided by any prior requirement, and the durable "served lot becomes live without blanking" requirement is silent on the listing code. Folded in as `grade10-site-auction-listing-page-SC-25` |
| Suite carried a case for the listing code not resolving as a lot address (US10-TC7, US11-TC2); no scenario stated it | Real: whether the code could double as an alternate lookup key was never proposed or ruled out. Folded in as `grade10-site-auction-listing-page-SC-26` |
| Suite carried a case for a separate listing-code field staying absent once an order exists on the lot (US10-TC9, US11-TC3); no scenario stated it | Real, and already settled by decisions.md Q18 and the proposal: the lower-case code is the canonical-address suffix, never a labelled public field, regardless of whether an order exists. Folded in as `grade10-site-auction-listing-page-SC-27` |
| Suite carried a case for the listing code staying absent regardless of signed-in state (US10-TC8) | Already covered: `SC-20`'s GIVEN/WHEN never conditions on an actor or auth state, so the rule is already unconditional across signed-in and signed-out visitors. No new scenario; case kept as a boundary check against that existing scenario |
| Suite carried two positive cases on US10 (title/address present in the served response; shared-link preview names the lot by title/address) | Misreading of scope: both duplicate durable `grade10-site-auction-listing-page-SC-01` and `-SC-03`, which already prove a lot's title, description and preview render correctly. Not new behaviour from this change. Dropped |
| Suite carried two positive cases on US11 (title/address together identify exactly one lot; the address a collector quotes reopens the same lot) | Misreading of scope: both duplicate durable `SC-01`/`SC-02`/`SC-05` (two lots answer as two pages; a published lot's address answers). Not new behaviour from this change. Dropped |
| Suite carried a case on US11 for a closed lot still resolving by title and address | Misreading of scope: tests general lot-status resolution (Ended lots stay published), which is `grade10-site/auction/lot-status`'s durable behaviour, not this change's identifier guard. Dropped |
| Scenario draft's `SC-24` (not-found response carries no listing code) reached no suite case | Hole: added `g10.auction-listing-page.US10-TC10`, tracing `US-10` — an in-flight delta's suite can only trace journeys this same delta defines, and the durable `US-03` journey (whose not-found requirement this scenario extends) is not part of this delta's `user-journeys.md` |
| Suite's raised question on whether a stale/cached share-preview generated before this change could still surface on a re-share | **Decided in Q15:** old cached content may persist and no purge or regeneration is guaranteed; current pages and fresh metadata still omit the code and private data |
| Suite's raised question on whether the collector-facing payment reference (Q6) ever appears on the listing page after an order exists | Already settled, not a genuine gap: Q10 and the proposal are unconditional that the listing page never shows the code, in any order state. Resolved directly as `SC-27` rather than raised |
| Suite's raised question on whether signed-in state matters here | Already settled, not a genuine gap: the requirement's rule is stated with no actor qualifier. No row raised |
| Suite's raised question on whether a code-shaped-but-wrong guess is handled differently from an ordinary bad address | Already settled by the durable "An address that names no lot is refused" requirement plus this delta's `SC-26`: a listing code is not wired into the address's lookup at all, so it is refused the same as any other unrecognized address. No row raised |

No contradiction between the two readings arose — both independently concluded
the code must never appear on this capability's public surfaces.

**Run:** QA1 blind pass on frozen Feature set + journeys + proposal/decisions/ui-design + linked PRD sections; denied Requirements, tech-design, and archive. Domain: no new domain case (see bidding-history suite Run line). QA2 reconciled against Dev scenarios SC-52 and SC-53.

| Case | Disposition |
| --- | --- |
| `g10.auction-listing-page.US15-TC1` | Folded — covered by `grade10-site-auction-listing-page-SC-52` |
| `g10.auction-listing-page.US15-TC2` | Folded — covered by `grade10-site-auction-listing-page-SC-52` (viewer row clause) |
| `g10.auction-listing-page.US12-TC9` | Folded — covered by `grade10-site-auction-listing-page-SC-53` |
| `grade10-site-auction-listing-page-SC-52` | Covered by `g10.auction-listing-page.US15-TC1` and `US15-TC2-1` |
| `grade10-site-auction-listing-page-SC-53` | Covered by `g10.auction-listing-page.US12-TC9` |

**Run:** 2026-10-08, listing-page sitemap aligned to `grade10-site/site/crawlable-pages`. `g10.auction-listing-page.US5-TC2` retargeted as `US5-TC2-2` / `TC-edm@2`: the sitemap lists each published lot the catalogue holds, and none is an unfilled parameter.

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - All 14 listing-page scenarios have complete routes. TC-2it@3 fetches the replacement without scripts, checks served metadata, then reads hydrated/client data for published, closed and settled holders. TC-x03@2 checks private draft/created client refusal and served 404 on reload. TC-5rp@3, TC-du4@3, TC-y7l@2, TC-87q@3 and TC-6de@2 close the five inherited identifier gaps through preview/document metadata, support lookup, not-found response, hydration continuity and order-existing client data. TC-sa9 remains deprecated under Q2; no case links the retired SC28.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Feature walks name cases this change does not define, so this delta carries none. The durable walks keep the earlier called-off steps until task 1.3 rewrites them through `/tcs-review`. The revised cases above govern.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - Of 14 listing-page scenarios, 11 are linked and 3 are not. Added: TC-pdz@4 now also links SC-04, since every row asserts 404 and the Page not found screen for an address naming no published lot. Kept after re-reading: TC-2it@3 to SC55, TC-x03@2 to SC54 and SC56, TC-5rp@3 to SC-21, TC-du4@3 to SC-23, TC-y7l@2 to SC-24, TC-87q@3 to SC-25, TC-6de@2 to SC-27, TC-pdz@4 to SC-19. Unlinked on purpose: TC-tof@2 (US1-TC4) reads hydrated and lookup data and fresh preview metadata but not the served title, description and canonical URL without scripts that SC55 names, and TC-2it@3 already covers SC55; TC-zq9@2 (US10-TC4) checks only the tab title and meta description, not `og:url`, `og:title` and `og:description` of SC-21; TC-h6y@2 (US11-TC3) does not inspect client-fetched responses that SC-27 names; TC-90g@2 (US10-TC11) asserts a closed or settled listing keeps its address, for which this delta has no scenario.
- **Coverage** - Uncovered scenarios: SC-20 (generated canonical address in the served response without scripts), SC-22 (client-fetched lot data carries no listing code on a published lot) and SC-26 (the code in place of a published lot's address answers not found). The delta mints new ids for them, no durable case claims them, and the inherited durable cases claim only SC-21. TC-pdz@4 and TC-x03@2 test the code-only address only for called-off lots, not for a published lot, so they cannot take SC-26. Record these 3 for a case, or a deliberate decision to leave them to the walk, before approval. No over-claimed case.
- **Contradictions** - No active case in this delta asserts that a called-off address stays reachable or that the canonical slug is retained. TC-sa9 holds that outcome and stays deprecated under Q2. The durable Walk 10 steps 6-9 (`The canonical address still resolves to the called-off listing`) remain until task 1.3.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Unchanged: this delta carries none, and task 1.3 repairs the durable walks through `/tcs-review`.

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-5ps` rev3 covers SC-7c2: on the live USD lot, the accepted high maximum is 130000 USD minor and the viewer's next bid is 132500 USD minor, from current 120000 USD minor and the USD increment tier.
- The changed scenario preserves the listing journey and the universal USD bid contract. No PRD, journey, feature-root, or durable-baseline contradiction was found. The changed listing scenario does not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- Fourteen existing cases remain draft and are manual until automation execution proof is linked: `g10.auction-listing-page.US1-TC1`, `TC-82e`, `TC-89i`, `TC-3xv`, `TC-6r8`, `TC-wka`, `TC-e6y`, `TC-fe3`, `TC-4op`, `TC-pjv`, `TC-i5l`, `TC-jhd`, `TC-amc`, and `TC-84a`. Testability is `automation, manual`; no assertions or opaque case IDs changed.
- The edited case remains draft. No implementation execution or human approval is claimed.

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's blind pass (13 draft cases from the frozen anchors, `proposal.md`, `decisions.md` and the domain draft) and Dev's independent delta. It read this suite, the delta's `spec.md` and `user-journeys.md`, `decisions.md` with `## Raised`, `tech-design.md`, `tasks.md`, the [Auction](/p/grade10-site/auction/display#listing-schema) page, and the shipped code in grade10 (`surfaceHead.ts`, `structuredData.ts`, `listingLotGalleryImages.ts`, `ListingCatalogueCard.tsx`). No case was written or reworded from a scenario, and every case stays `draft`. QA1's own bundle line is not in the draft; the planning run adds it.

- **Linked** - `g10.auction-listing-page.US16-TC3` asserts `grade10-site-auction-listing-page-SC-63`; `US16-TC11` asserts `grade10-site-auction-listing-page-SC-68`; `US16-TC12` asserts `grade10-site-auction-listing-page-SC-67`. `grade10-site-auction-listing-page-SC-69` is asserted by `g10.shared-localization.US1-TC4`, which walks all five surfaces; the link sits on that case
- **Jointly asserted, not linked** - `grade10-site-auction-listing-page-SC-60` is split between `US16-TC1` (rendered page, no text of another language) and `US16-TC7` (the response HTML, with no exclusion read). The scenario's "neither the English nor the Simplified Chinese text" is also contradicted below
- **Partly asserted, not linked** - `grade10-site-auction-listing-page-SC-61` by `US16-TC2`: no default-address row, so the English card at `/auction` is unread. `grade10-site-auction-listing-page-SC-62` by `US16-TC4`: it reads the rendered page where the scenario reads the response HTML with no script. `grade10-site-auction-listing-page-SC-64` by `US16-TC6`: the lot page only, the card and catalogue unread. `grade10-site-auction-listing-page-SC-65` by `US16-TC5`: no Simplified Chinese address and no card. `grade10-site-auction-listing-page-SC-70` by `US16-TC8`: `og:url` is unread
- **Uncovered** - `grade10-site-auction-listing-page-SC-66` (the language survives the handover and a live bid): no case reads the lot after scripts run and a bid lands; task 6.1 tests it, and the domain case places a bid at `/tc` without reading the text after it. `grade10-site-auction-listing-page-SC-71` (a Simplified Chinese address of a Traditional-only lot unfurls in English): `US16-TC9` reads a Traditional address with one text missing, which is `grade10-site-auction-listing-page-SC-63` in the head, and no case fetches `/sc` for a Traditional-only lot. Each owes a case, a row, or an `Out of suite` line naming task 6.1
- **Carried** - `grade10-site-auction-listing-page-SC-03` is unchanged; the durable suite holds its case
- **Cases with no scenario** - `US16-TC10` (a title with markup characters renders as text in the page and the head): real and unstated; check whether `grade10-site/site/crawlable-pages` already owns head escaping, else fold a scenario. `US16-TC13` (switching the page language switches the lot's texts): real, and `tech-design.md` D6 and task 6.1 ("a query key per language") rest on it with no scenario; fold. The `Upcoming` and `Closed` rows of `US16-TC2` and the English-title slug of `US16-TC11` extend `grade10-site-auction-listing-page-SC-61` and `grade10-site-auction-listing-page-SC-68` to states and a decision (4) they do not name
- **Over-claimed** - `US16-TC2` expects neither card to show a description; no scenario or decision says so
- **Contradicted** - `grade10-site-auction-listing-page-SC-60` says the response HTML contains neither the English nor the Simplified Chinese text of either, and decision 19 puts the English title in the gallery alt text, which is in that HTML. Worse, `tech-design.md` D5 resolves `title` on the server and `listingLotGalleryImages.ts` and `ListingCatalogueCard.tsx` fall back to `listing.title` for the alt text, so on a Chinese page the alt text would read the translated title: against decision 19, the admin delta's "gallery alt text SHALL keep the English title", and step 3 of `g10.shared-localization.US1-TC2`. Task 6.3 confirms the head needs no change and no task or scenario owns the alt text. It goes to Dev: carry the English title beside the resolved one, or resolve alt text apart, with a task and a scenario; and word SC-60 on the title and description elements and the head
- **Contradicted, anchor** - `grade10-site-auction-listing-page-SC-70` and `grade10-site-auction-listing-page-SC-71` serve `grade10-site-auction-listing-page-US-02`, and the cases that assert them (`US16-TC8`, `US16-TC9`) trace `grade10-site-auction-listing-page-US-16`; `grade10-site-auction-listing-page-SC-68` and `grade10-site-auction-listing-page-SC-69` serve a feature-set line no case traces
- **Raised, settled** - every row this pass raised is landed in `decisions.md` (Q7 to Q40, the human's defaults); the open PM confirmations are Q43 and Q49 in `decisions.md`; no case waits on a row
- **Anchors** - `grade10-site-auction-listing-page-US-16` holds all 13 cases. The context journeys `grade10-site-auction-listing-page-US-01` and `grade10-site-auction-listing-page-US-02` hold no case here; the durable suite keeps theirs
- **Levels** - the site domain suite traces `grade10-site-auction-listing-page-US-01` and `grade10-site-auction-listing-page-US-02` and walks the English address; this change adds no cross-capability path there, so the proposal carries `No domain impact` for it. The operator-writes, collector-reads path is the admin domain case `g10adm.auction-dmn.US5-TC1`
- **After the human's reply (2026-10-14)** - Dev folded `US16-TC10` as `grade10-site-auction-listing-page-SC-73` and `US16-TC13` as `grade10-site-auction-listing-page-SC-74`, added `grade10-site-auction-listing-page-SC-72` for the alt text, and reworded `grade10-site-auction-listing-page-SC-60` to the title and description elements and the head. `grade10-site-auction-listing-page-SC-66` and `grade10-site-auction-listing-page-SC-71` are verified by task 6.1. Rows settled in `decisions.md` 34 and 35

### Manual

| Manual | Why |
| --- | --- |
| `g10.auction-listing-page.US12-TC7` | To be walked in task 4.4 on the isolated stack: two signed-in bidders each confirm the same custom maximum in turn, and a person reads the rows at that amount and hovers the Info control; the mapper's test flags a tied row it is handed, and the case walks the order the server writes and the tip the page draws |
| `g10.auction-listing-page.US12-TC8` | To be walked in task 4.4 on the isolated stack: three signed-in bidders, the third confirming a higher maximum, and a person reads the older tie and hovers its Info control; the backend test proves the read's order and the mapper's test the flag, and the case walks both through the page |
| `g10.auction-listing-page.US14-TC7` | To be walked in task 4.4 on the isolated stack: a person watches a live lot's close be recorded as sold without reloading, and reads Recent bids before and after; the mapper's test proves the crown from a sold flag it is handed |
| `g10.auction-listing-page.US14-TC8` | To be walked in task 4.4 on the isolated stack: a person opens a lot whose close is held back until the next sweep and a lot ended with no bid, and reads each one's Recent bids; the mapper's test proves no crown before the lot is closed sold |
