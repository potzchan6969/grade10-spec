# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review · 16/41
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector reads their bidding index

**Starting state:**

**Steps 1–2 setup:**

- customer(signed in) set a maximum on `<listing_3>`, then raised it.

**Steps 3–7 setup:**

- customer(signed in, enrolled to bid) has an accepted bid on `<listing_6>`.
- The customer has never bid on `<listing_7>` and is on `<listing_7 url>`.

**Steps 8–10 setup:**

- A signed-in collector has activity on open listing `<listing_9>`, closed listing `<listing_10>` and canceled listing `<listing_11>`.

**Steps 11–12 setup:**

- customer(signed in) has more Active listings than one page holds.
- No newer activity is added during the pass.

**Steps 13–14 setup:**

- customer(signed in) has placed no bid.
- Another Grade10 account has bidding activity.
- Another storefront has bidding activity for the same account id.

**Steps 15–17 setup:**

- customer A(signed in) placed a bid on `<listing_18>`, with this state: `<listing state>`.

**Steps 18–22 setup:**

- customer A(signed in, enrolled to bid) bid on `<listing_21>` and `<listing_22>`, and customer B has since outbid them on `<listing_21>`.
- customer A's latest activity on `<listing_22>` is newer than on `<listing_21>`.
- customer A is on `<listing_21 url>`.

**Steps 23–24 setup:**

- customer A(signed in) placed a bid on `<listing_24>`.
- customer B(signed in) watches `<listing_24>` and never bid on it.
- admin(holds `auction:operate`) called `<listing_24>` off.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_3 | A listing on which this collector set a maximum and then raised it; bind its identity only |
| listing_3 | The listing with the retained activity described in the pre-conditions; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 3–7 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_6 | An open HKD listing the customer bid on; bind its identity only | · |
| listing_7 | An open HKD listing with no bid from anyone; bind its identity only | · |
| opening price | HK$370 | (range: 1000–79999 minor units), `<listing_7>`'s starting price |
| refused bid | HK$120 | below `<opening price>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_7 url | The URL of `<listing_7>`; bind its URL only |

**Steps 8–10 data:**

| Field | Value |
| --- | --- |
| listing_9 | An open listing with this collector's accepted bidding activity; bind its identity only |
| listing_10 | A closed listing with this collector's accepted bidding activity; bind its identity only |
| listing_11 | A canceled listing with this collector's accepted bidding activity; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 11–12 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 13–14 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 15–17 data:**

| `<listing state>` | `<filter>` | `<standing>` |
| --- | --- | --- |
| Open, customer A leads | **Active** | Leading |
| Open, customer B leads | **Active** | Outbid |
| Closed, customer A won | **Completed** | Won |
| Closed, customer B won | **Completed** | Outbid |
| Called off after customer A's bid | **Completed** | Canceled |

| Field | Value |
| --- | --- |
| listing_18 | A listing with customer A's accepted bid and state `<listing state>`; bind its identity only |
| listing_18 | The listing with the retained activity described in the pre-conditions; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 18–22 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_21 | An open HKD listing led by customer B; bind its identity only | · |
| listing_22 | An open HKD listing customer A bid on after their last bid on `<listing_21>`; bind its identity only | · |
| current bid | HK$5,460 | (range: 400000–799999 minor units), `<listing_21>`'s current bid |
| increment | HK$80 | (fixed tier increment), the HK$4,000 tier |
| next minimum | HK$5,540 | (fixed derived value), `<current bid>` plus `<increment>` |
| refused bid | HK$5,460 | equal to `<current bid>`, below `<next minimum>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_21 url | The URL of `<listing_21>`; bind its URL only |

**Steps 23–24 data:**

| Field | Value |
| --- | --- |
| listing_24 | A published HKD listing, called off after customer A's bid; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

### Route

1. Navigate to `<grade10 bids url>`.
2. Check `<listing_3>` in the bidding index.
   - The listing `<listing_3>` appears once at the position of its latest activity. `g10.auction-bidding-history.US1-TC1`
   - The summary for `<listing_3>` shows the collector's current standing. `g10.auction-bidding-history.US1-TC1`
3. Type `<refused bid>` into the custom maximum on the bid panel.
4. Confirm the bid.
   - Step 4: the bid form names the minimum, `<opening price>`. `g10.auction-bidding-history.US1-TC2`
5. Navigate to `<grade10 bids url>`.
6. Select **Active**.
   - Step 6 lists `<listing_6>`. `g10.auction-bidding-history.US1-TC2`
7. Select **Completed**.
   - Step 7 lists the collector's completed listings. `g10.auction-bidding-history.US1-TC2`
   - Each standing on the index is Leading, Outbid, Won or Canceled. `g10.auction-bidding-history.US1-TC2`
8. Navigate to `<grade10 bids url>`.
9. Select **Active**.
   - Step 9 shows only `<listing_9>`. `g10.auction-bidding-history.US1-TC3`
10. Select **Completed**.
   - Step 10 shows `<listing_10>` and `<listing_11>`. `g10.auction-bidding-history.US1-TC3`
11. Navigate to `<grade10 bids url>`.
12. Follow every returned cursor.
   - Every active listing appears exactly once in latest-activity order. `g10.auction-bidding-history.US1-TC4`
13. Navigate to `<grade10 bids url>`.
14. Check the bidding index.
   - The bidding index is empty. `g10.auction-bidding-history.US1-TC5`
   - The page shows this Grade10 account's index. `g10.auction-bidding-history.US1-TC5`
15. Navigate to `<grade10 bids url>`.
16. Select `<filter>`.
17. Find `<listing_18>`.
   - `<listing_18>` shows once, with `<standing>`. `g10.auction-bidding-history.US1-TC6`
   - It shows its current or final price. `g10.auction-bidding-history.US1-TC6`
18. Type `<refused bid>` into the custom maximum on the bid panel.
19. Confirm the bid.
   - Step 19: the bid form names minimum `<next minimum>`, equal to `<current bid>` plus `<increment>`. `g10.auction-bidding-history.US1-TC7`
20. Navigate to `<grade10 bids url>`.
21. Read the **Active** list.
22. Expand `<listing_21>`.
   - `<listing_21>` reads Outbid, priced at `<current bid>`. `g10.auction-bidding-history.US1-TC7`
   - `<listing_21>` still sits below `<listing_22>`. `g10.auction-bidding-history.US1-TC7`
   - `<listing_21>`'s latest activity time is its last accepted bid's. `g10.auction-bidding-history.US1-TC7`
   - Step 22's history matches that last accepted bid. `g10.auction-bidding-history.US1-TC7`
23. As customer A, navigate to `<grade10 bids url>` and select **Completed**.
   - Step 23 lists `<listing_24>` with standing Canceled. `g10.auction-bidding-history.US1-TC8`
24. As customer B, navigate to `<grade10 bids url>` and select **Active**, then **Completed**.
   - Step 24 lists customer B's accepted listings. `g10.auction-bidding-history.US1-TC8`

## Walk 2: Collector audits every maximum Grade10 accepted

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, card linked, no bid on `<listing_27>`) is on `<listing_27 url>`.
- The listing has opening price `<opening price>`.

**Steps 4–8 setup:**

- customer A(signed in, enrolled to bid) leads `<listing_30>` with a maximum of `<customer A maximum>`.
- The entries of `<listing_30>`'s history on `<grade10 bids url>`, and the listing's bid count, are noted.
- customer A is on `<listing_30 url>`.

**Steps 9–13 setup:**

- customer(signed in, card linked) is on `<listing_33 url>` and has placed no bid on it.
- The maximum input rejects decimal value `<malformed maximum>` in this fixture.

**Steps 14–18 setup:**

- customer A(signed in, card linked) is on `<listing_36 url>` and has placed no bid on it.
- customer B(signed in) can open the same listing.
- No one is signed in on a third session.
- The listing has opening price `<opening price>`.

**Steps 19–22 setup:**

- customer A(signed in) leads `<listing_39>` with a maximum of `<customer A maximum>`.
- customer B(signed in, card linked) is on `<listing_39 url>`.
- The listing has current bid `<current bid>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_27 | An open USD listing with no other bidder, opening price `<opening price>`; bind its identity only | · |
| maximum | USD560 | (range: 50000–99999 minor units) |
| opening price | USD100 | (fixed tier boundary) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_27 url | The URL of `<listing_27>`; bind its URL only |

**Steps 4–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_30 | An open HKD listing led by customer A; bind its identity only | · |
| customer A maximum | HK$200 | (range: 1000–79999 minor units) |
| refused raise | HK$200 | equal to `<customer A maximum>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_30 url | The URL of `<listing_30>`; bind its URL only |

**Steps 9–13 data:**

| Field | Value |
| --- | --- |
| listing_33 | An open HKD listing; bind its identity only |
| malformed maximum | 10.50 |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_33 url | The URL of `<listing_33>`; bind its URL only |

**Steps 14–18 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_36 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| first maximum | HK$420 | (range: 1000–79999 minor units) |
| raised maximum | HK$560 | (range: 1000–79999 minor units) |
| opening price | HK$280 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_36 url | The URL of `<listing_36>`; bind its URL only |

**Steps 19–22 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_39 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$680 | (range: 1000–79999 minor units) |
| customer B maximum | HK$430 | (range: 1000–79999 minor units), below `<customer A maximum>` |
| current bid | HK$280 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_39 url | The URL of `<listing_39>`; bind its URL only |

### Route

1. Enter `<maximum>` in the custom maximum on the bid panel and place the bid.
2. Navigate to `<grade10 bids url>`.
3. Expand `<listing_27>`.
   - Step 3 shows one event, a maximum set at `<maximum>`, for the signed-in account. `g10.auction-bidding-history.US2-TC1`
4. Type `<refused raise>` into the custom maximum on the bid panel.
5. Confirm the bid.
   - Step 5: the bid form keeps `<customer A maximum>` as the maximum on file. `g10.auction-bidding-history.US2-TC2`
6. Navigate to `<grade10 bids url>`.
7. Expand `<listing_30>`.
   - Step 7 shows the noted entries. `g10.auction-bidding-history.US2-TC2`
8. Return to `<listing_30 url>` and read the bid count.
   - Step 8's bid count is the one noted. `g10.auction-bidding-history.US2-TC2`
9. Note the bidding index on `<grade10 bids url>`.
   - The bidding index matches the note from step 9. `g10.auction-bidding-history.US2-TC3`
10. Open `<listing_33 url>`.
11. Type `<malformed maximum>` into the custom maximum on the bid panel.
12. Read the custom maximum.
13. Return to `<grade10 bids url>`.
   - The custom maximum shows `<malformed maximum>` is not accepted. `g10.auction-bidding-history.US2-TC3`
   - No bid is submitted. `g10.auction-bidding-history.US2-TC3`
14. As customer A, enter `<first maximum>` in the custom maximum and place the bid.
15. Enter `<raised maximum>` in the custom maximum and place the bid.
16. Navigate to `<grade10 bids url>` and expand `<listing_36>`.
   - Step 16 records `<first maximum>` and then `<raised maximum>`. `g10.auction-bidding-history.US2-TC4`
17. As customer B, navigate to `<grade10 bids url>` and expand `<listing_36>` if it is listed.
18. Signed out, open `<listing_36 url>` and read public recent bids.
   - Customer B's bidding index lists customer B's accepted listings. `g10.auction-bidding-history.US2-TC4`
   - Signed-out recent bids show the public price and the listing pseudonym. `g10.auction-bidding-history.US2-TC4`
19. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
20. As customer A, navigate to `<grade10 bids url>`.
21. Expand `<listing_39>`.
   - Step 21 labels customer A's answering movement as automatic. `g10.auction-bidding-history.US2-TC5`
22. Signed out, open `<listing_39 url>` and read the new public price.
   - Step 22 shows the listing pseudonym on the new public price. `g10.auction-bidding-history.US2-TC5`

## Walk 3: Collector reads one listing's combined history

**Starting state:**

**Steps 1–3 setup:**

- customer A(signed in) leads `<listing_42>` at `<opening price>`, with a maximum equal to `<opening price>`.
- customer B(signed in, card linked) is on `<listing_42 url>`.

**Steps 4–6 setup:**

- customer A(signed in) leads `<listing_45>` with maximum `<customer A maximum>`, above `<current bid>`.
- customer B(signed in, card linked) is on `<listing_45 url>`.
- The listing has current bid `<current bid>`.

**Steps 7–9 setup:**

- One listing has more public and private events than one page holds. No new event is added during the pass.

**Steps 10–13 setup:**

- customer A(signed in) has a combined history on `<listing_51>`.
- One decision on that history wrote customer A's maximum, their accepted price `<accepted price>`, customer B's response at `<response price>`, and customer A's outbid standing, between an older and a newer rival price.
- No new bid is placed on `<listing_51>` during the pass.

**Steps 14–16 setup:**

- Each row starts from the same fixture.
- customer A(signed in) leads `<listing_54>` with an accepted maximum `<customer A maximum>`.
- The current public bid is `<current bid>` and the increment is `<increment>`.
- customer B(signed in, card linked) has placed no bid on `<listing_54>` and is on `<listing_54 url>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_42 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| customer B maximum | HK$520 | (range: 1000–79999 minor units) |
| opening price | HK$360 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_42 url | The URL of `<listing_42>`; bind its URL only |

**Steps 4–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_45 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$650 | (range: 1000–79999 minor units) |
| customer B maximum | HK$410 | (range: 1000–79999 minor units) |
| current bid | HK$300 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_45 url | The URL of `<listing_45>`; bind its URL only |

**Steps 7–9 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 10–13 data:**

| Field | Value |
| --- | --- |
| listing_51 | An open USD listing customer A and customer B both bid on; bind its identity only |
| split decision | The decision containing customer A's accepted price `<accepted price>`, customer B's response `<response price>` and customer A's outbid standing; bind its identity only |

| Field | Value | Fixture notes |
| --- | --- | --- |
| accepted price | USD320 | (range: 10000–49999 minor units) |
| response price | USD330 | (range: 10000–49999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 14–16 data:**

| `<customer B maximum>` | `<public history>` | `<leader>` | `<account history>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD5 | customer B bids USD5, then customer A responds automatically at USD6, at the same time | customer A | customer B's maximum is retained at USD5 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 500, 600 |
| USD7 | customer B bids USD7, then customer A responds automatically at USD8, at the same time | customer A | customer B's maximum is retained at USD7 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 700, 800 |
| USD9.50 | customer B bids USD9.50, then customer A responds automatically at USD10 without exceeding USD10 | customer A | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 950, 1000 |
| USD10 | customer B bids USD10 first, then customer A responds automatically at USD10, at the same time | customer A | the maximum stays private | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1000 |
| USD10.01 | customer B bids USD10.01 once; customer A has no new bid record | customer B | customer B's maximum is retained at USD10.01 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1001 |
| USD11 | customer B bids USD11 once, with no intermediate record or new bid record for customer A | customer B | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100 |
| USD11.20 | customer B bids USD11 once, one increment above customer A's maximum; customer A has no new bid record | customer B | customer B's maximum is retained at USD11.20 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100, 1120 |

| Field | Value | Fixture notes |
| --- | --- | --- |
| customer A maximum | USD10 | (fixed boundary for these history rows) |
| current bid | USD4 | (fixed starting state) |
| increment | USD1 | (fixed tier increment) |
| listing_54 | The listing with the retained activity described in the pre-conditions; bind its identity only | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_54 url | The URL of `<listing_54>`; bind its URL only |

### Route

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_42>`.
   - Customer B appears under the listing pseudonym. `g10.auction-bidding-history.US3-TC1`
   - That step shows customer A outbid at the public price. `g10.auction-bidding-history.US3-TC1`
   - The amounts shown are the public price. `g10.auction-bidding-history.US3-TC1`
4. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
5. As customer A, navigate to `<grade10 bids url>`.
6. Expand `<listing_45>`.
   - Customer B's action comes first when they share a time. `g10.auction-bidding-history.US3-TC2`
   - Customer A's following movement is marked automatic. `g10.auction-bidding-history.US3-TC2`
   - Both records read as one step. `g10.auction-bidding-history.US3-TC2`
7. Navigate to `<grade10 bids url>`.
8. Expand that listing's combined history.
9. Follow every returned cursor.
   - Every retained event visible to that collector appears exactly once in stable order. `g10.auction-bidding-history.US3-TC4`
10. Navigate to `<grade10 bids url>`.
11. Expand `<listing_51>`.
12. Follow every cursor at a page size of 1.
   - Step 12 returns every record of `<split decision>` on one page. `g10.auction-bidding-history.US3-TC5`
13. Read the same history as one page of 50.
   - Step 13 reads those records in the same order. `g10.auction-bidding-history.US3-TC5`
14. Enter `<customer B maximum>` in the custom maximum on the bid panel and place the bid.
15. Read the listing's public recent bids.
   - Step 15: public history reads as follows: `<public history>`, under listing pseudonyms. `g10.auction-bidding-history.US3-TC6`
16. Navigate to `<grade10 bids url>` and expand `<listing_54>`.
   - The leader is `<leader>`. `g10.auction-bidding-history.US3-TC6`
   - For rows with an account-history check, step 16 shows the following: `<account history>`. `g10.auction-bidding-history.US3-TC6`

## Walk 4: Collector's bidding history stays on their storefront account

**Starting state:**

**Steps 1–2 setup:**

- A Grade10 storefront session for account A with id `<account id>`.

**Steps 3–4 setup:**

- Grade10 and ZZZ each have an account with account id `<account id>`. Grade10 holds private bidding events for that id.

**Steps 5–7 setup:**

- customer(signed in) has retained bidding history.
- The bid, maximum, listing standing and auction close of one of its listings are noted.

**Steps 8–9 setup:**

- No storefront session.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| account id | The Grade10 account A identity; bind its id only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| account id | An id present on separate Grade10 and ZZZ accounts; bind the shared id only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

### Route

1. Navigate to `<grade10 bids url>` as account A.
2. Check the bidding index and combined histories.
   - Auction returns only A's Grade10 activity and the public movements that belong in its combined histories. `g10.auction-bidding-history.US4-TC1`
3. Sign in to ZZZ as the account with id `<account id>`.
4. Read its bidding history.
   - The ZZZ history lists that storefront's activity. `g10.auction-bidding-history.US4-TC2`
5. Navigate to `<grade10 bids url>`.
6. Read and page the index and that listing's combined history.
7. Check that listing's bid, maximum, listing standing and auction close.
   - The noted bid, maximum, listing standing and auction close match the note. `g10.auction-bidding-history.US4-TC4`
8. Read the API response for an account bidding index with no storefront session.
9. Read the API response for a public listing.
   - Grade10 refuses the account index read. `g10.auction-bidding-history.US4-TC3`
   - The public listing read shows public price movements and listing pseudonyms. `g10.auction-bidding-history.US4-TC3`

## Walk 5: Collector opens their bids at /bids

**Starting state:**

**Steps 1–3 setup:**

- A signed-in Grade10 collector with active and completed bidding activity.

**Steps 4–5 setup:**

- An open listing on which the collector is outbid.

**Steps 6–7 setup:**

- The visitor is signed out.

**Steps 8–10 setup:**

- A signed-in collector with no entries in the filter `<filter>`.

**Steps 11–12 setup:**

- customer(signed in) is opening `<grade10 bids url>`.
- The bidding index is delayed, so the selected page has not answered yet.

**Steps 13–14 setup:**

- customer(signed in) is opening `<grade10 bids url>`.
- The bidding index is mocked to fail for the selected page.

**Steps 15–16 setup:**

- customer(signed in) has a visible bidding summary on `<grade10 bids url>`.
- That listing's combined history is delayed, so it has not answered yet.

**Steps 17–18 setup:**

- A visible index or combined history page with a further cursor.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 8–10 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| filter | Active | Representative filter with no entries; Completed also fits when empty |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 11–12 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 13–14 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 15–16 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

### Route

1. Navigate to `<grade10 bids url>`.
2. Check the page and the site chrome.
3. Switch to **Completed**.
   - The page shows the Active summaries inside the existing site chrome. `g10.auction-bidding-history.US5-TC1`
   - Switching to **Completed** stays in that same page. `g10.auction-bidding-history.US5-TC1`
4. Navigate to `<grade10 bids url>`.
5. Expand that summary.
   - The combined history identifies the public movement that outbid **You**. `g10.auction-bidding-history.US5-TC2`
   - The page offers a route to the still-open listing. `g10.auction-bidding-history.US5-TC2`
6. Navigate to `<grade10 bids url>`.
7. Complete the existing sign-in flow.
   - The Grade10 site starts its existing sign-in flow. `g10.auction-bidding-history.US5-TC3`
   - Successful sign-in returns the collector to `/bids`. `g10.auction-bidding-history.US5-TC3`
8. Navigate to `<grade10 bids url>`.
9. Select `<filter>`.
10. Wait until the filter finishes loading.
   - The page shows the empty state for the filter `<filter>`. `g10.auction-bidding-history.US5-TC4`
   - That empty state is the list's message. `g10.auction-bidding-history.US5-TC4`
11. Navigate to `<grade10 bids url>`.
12. Check the page during the delay.
   - The page shows a labeled bidding-history loading state inside the site chrome. `g10.auction-bidding-history.US5-TC5`
   - That loading state is the list's message. `g10.auction-bidding-history.US5-TC5`
13. Navigate to `<grade10 bids url>`.
14. Check the page.
   - The page shows a retryable bidding-history error. `g10.auction-bidding-history.US5-TC6`
   - That error is the list's message. `g10.auction-bidding-history.US5-TC6`
15. Expand that summary.
16. Check the summary and the history area during the delay.
   - That summary stays visible with a labeled history-loading state. `g10.auction-bidding-history.US5-TC7`
   - The history area shows that loading state. `g10.auction-bidding-history.US5-TC7`
17. Activate the next-page control.
18. Activate it again while the next page is still loading.
   - The entries already shown remain visible while the next page loads. `g10.auction-bidding-history.US5-TC8`
   - The next-page control takes one request for that page. `g10.auction-bidding-history.US5-TC8`

## Walk 6: Collector opens their bids at /bids

**Starting state:**

**Steps 1–2 setup:**

- customer(signed in) can see the bidding index on `<grade10 bids url>`.
- One listing's combined history is mocked to fail.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 3–5 data:**

| Field | Value |
| --- | --- |
| zzz store url | The ZZZ storefront URL; bind its URL only |

### Route

1. Expand that listing.
2. Check that summary and the other summaries.
   - That summary remains visible with a retryable history error. `g10.auction-bidding-history.US5-TC9`
   - Other summaries and their histories remain usable. `g10.auction-bidding-history.US5-TC9`
3. Sign in to `<zzz store url>`.
4. Look for a bidding-history route or screen.
5. Use ZZZ's authenticated backend against the shared history contract.
   - ZZZ's storefront routes match the routes from before this capability. `g10.auction-bidding-history.US5-TC10`
   - A signed-in ZZZ history read returns that storefront's activity. `g10.auction-bidding-history.US5-TC10`

## Walk 7: Collector reviews maximum history on the listing

**Starting state:**

**Steps 1–4 setup:**

- customer(signed-in bidder with one accepted automatic maximum and no automatic bid placed for them yet on `<listing_102>`) is on that listing's page. **Your bidding** is visible beside public recent bids.

**Steps 5–9 setup:**

- customer(signed-in bidder who set a maximum on `<listing_105>`, later raised it, and then had a further raise refused) is on that listing's page.

**Steps 10–13 setup:**

- customer A(signed-in bidder with personal bidding activity) and customer B(rival with a private maximum) both have activity on `<listing_108>`.
- customer A is on that listing's page.
- The public recent bids and customer A's live maximum on the bid panel are noted.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| listing_102 | A listing with this collector's one accepted automatic maximum and no automatic bid placed for them yet; bind its identity only |

**Steps 5–9 data:**

| Field | Value |
| --- | --- |
| listing_105 | A listing where this collector set and raised a maximum, then had a further raise refused; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 10–13 data:**

| Field | Value |
| --- | --- |
| listing_108 | A listing with customer A's personal bidding activity and customer B's private maximum; bind its identity only |

### Route

1. Activate **Your bidding**.
2. Inspect the dialog title, description, tab order, and the active tab.
3. Activate **Your maximums**.
4. Inspect the maximum rows and whether a sticky current-maximum summary is shown.
   - The dialog title is **Your bidding**. `g10.auction-bidding-history.US6-TC1`
   - Tabs appear in order **Bid placed**, then **Your maximums**. `g10.auction-bidding-history.US6-TC1`
   - **Bid placed** is active and shows the empty bids state. `g10.auction-bidding-history.US6-TC1`
   - **Your maximums** lists the accepted maximum's amount and time. `g10.auction-bidding-history.US6-TC1`
   - The live maximum stays on the bid panel. `g10.auction-bidding-history.US6-TC1`
5. Activate **Your bidding**.
6. Activate **Your maximums**.
7. Inspect every maximum row.
8. Navigate to `<grade10 bids url>`.
9. Expand `<listing_105>`.
   - **Your maximums** lists the accepted set and raise, newest first, each row an amount and a time. `g10.auction-bidding-history.US6-TC2`
   - Both listing tabs list those accepted amounts. `g10.auction-bidding-history.US6-TC2`
   - Step 9 lists those accepted amounts. `g10.auction-bidding-history.US6-TC2`
10. Activate **Your bidding**.
11. Inspect **Bid placed** and **Your maximums**.
12. Dismiss the dialog.
13. Re-check public recent bids, live maximum and listing standing.
   - **Bid placed** and **Your maximums** list customer A's amounts and times. `g10.auction-bidding-history.US6-TC3`
   - Public recent bids, the live maximum and the standing match the note. `g10.auction-bidding-history.US6-TC3`

## Walk 8: Collector reviews bids Grade10 placed on the listing

**Starting state:**

**Steps 1–4 setup:**

- customer(signed-in bidder with at least one automatic bid Grade10 placed for them and at least one accepted maximum on `<listing_111>`) is on that listing's page.

**Steps 5–7 setup:**

- customer(signed-in bidder with one accepted automatic maximum and no automatic bid placed for them yet on `<listing_114>`) is on that listing's page.

**Steps 8–11 setup:**

- customer(signed-in bidder with both bid-sequence and maximum rows on `<listing_117>`) is on that listing's page. Note standing, live maximum, and public recent bids before opening the dialog.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| listing_111 | A listing with this collector's automatic bid records and accepted maximum records; bind its identity only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| listing_114 | A listing with this collector's one accepted automatic maximum and no automatic bid placed for them yet; bind its identity only |

**Steps 8–11 data:**

| Field | Value |
| --- | --- |
| listing_117 | A listing with this collector's automatic bid records and accepted maximum records; bind its identity only |

### Route

1. Activate **Your bidding**.
2. Inspect the active tab and **Bid placed** rows.
3. Activate **Your maximums**.
4. Inspect maximum rows.
   - **Bid placed** is the initial active tab. `g10.auction-bidding-history.US7-TC1`
   - Tab order is **Bid placed**, then **Your maximums**. `g10.auction-bidding-history.US7-TC1`
   - **Bid placed** lists the owner's automatic bid amounts and times. `g10.auction-bidding-history.US7-TC1`
   - **Your maximums** lists every accepted configure or raise for that owner on that listing, newest first, each row an amount and a time. `g10.auction-bidding-history.US7-TC1`
   - The live maximum stays on the bid panel. `g10.auction-bidding-history.US7-TC1`
5. Activate **Your bidding**.
6. Inspect the active tab copy.
7. Activate **Your maximums** and return to **Bid placed**.
   - **Bid placed** is active on open and shows the empty-bids state. `g10.auction-bidding-history.US7-TC2`
   - **Bid placed** and **Your maximums** stay separate tabs. `g10.auction-bidding-history.US7-TC2`
8. Activate **Your bidding**.
9. Switch between **Bid placed** and **Your maximums**.
10. Dismiss the dialog.
11. Re-check standing, live maximum, and public recent bids.
   - Standing, the live maximum and public recent bids match the note. `g10.auction-bidding-history.US7-TC3`

## Walk 9: Collector reads clearer maximum labels on /bids and adjacent checks

**Starting state:**

**Steps 1–4 setup:**

- customer(signed in) set an automatic maximum on `<listing_120>`, later raised it, and then had a further raise refused.

**Steps 5–6 setup:**

- `<listing_123>` is published with at least one counted public bid from a bidder whose email is `<email_ada>`.

**Steps 7–8 setup:**

- `<listing_126>` has a public bid whose bidder email was erased, and a public bid whose email local part has no letter or digit before `@`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| listing_120 | A listing where this collector set and raised a maximum, then had a further raise refused; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| expected_letter | `A` |
| listing_123 | A published listing with a counted public bid whose bidder email is `<email_ada>`; bind its identity only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| listing_126 | A listing with two public bids: one from an erased email and one from a letterless and digitless email local part; bind its identity only |

### Route

1. Navigate to `<grade10 bids url>`.
2. Expand `<listing_120>`.
3. Inspect the set and raise events.
4. Read the account navigation.
   - Those events read as a maximum set and a maximum raised. `g10.auction-bidding-history.US8-TC1`
   - The chronology lists those accepted amounts. `g10.auction-bidding-history.US8-TC1`
   - Account navigation stays on the bids page. `g10.auction-bidding-history.US8-TC1`
5. Read the anonymous public listing response for `<listing_123>`.
6. Find the public bid row for that bidder.
   - The row's listing pseudonym is of the form Bidder N. `g10.auction-bidding-history.US9-TC1`
   - The row's avatar character is `<expected_letter>`. `g10.auction-bidding-history.US9-TC1`
   - The response body contains neither `<email_ada>` nor a personal display name for that bidder. `g10.auction-bidding-history.US9-TC1`
7. Read the anonymous public listing response for `<listing_126>`.
8. Check each of those two public bid rows.
   - Each row's avatar character is `B`. `g10.auction-bidding-history.US9-TC2`
   - Each row still shows a listing pseudonym of the form Bidder N. `g10.auction-bidding-history.US9-TC2`
   - Neither row exposes an email. `g10.auction-bidding-history.US9-TC2`

## g10.auction-bidding-history.US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I placed a bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

### g10.auction-bidding-history.US1-TC1: Repeated activity is grouped under one listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) set a maximum on `<listing_3>`, then raised it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A listing on which this collector set a maximum and then raised it; bind its identity only |
| listing_3 | The listing with the retained activity described in the pre-conditions; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Check `<listing_3>` in the bidding index.

**Expected Results:**

* The listing `<listing_3>` appears once at the position of its latest activity.
* The summary for `<listing_3>` shows the collector's current standing.

<!-- trace:case id=g10.auction-bidding-history.TC-bhz rev=2 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC2: A listing whose every bid was refused is not in the index

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, enrolled to bid) has an accepted bid on `<listing_6>`.
* The customer has never bid on `<listing_7>` and is on `<listing_7 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_6 | An open HKD listing the customer bid on; bind its identity only | · |
| listing_7 | An open HKD listing with no bid from anyone; bind its identity only | · |
| opening price | HK$370 | (range: 1000–79999 minor units), `<listing_7>`'s starting price |
| refused bid | HK$120 | below `<opening price>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_7 url | The URL of `<listing_7>`; bind its URL only |

**Steps:**

1. Type `<refused bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to `<grade10 bids url>`.
4. Select **Active**.
5. Select **Completed**.

**Expected Results:**

* Step 2: the bid form names the minimum, `<opening price>`.
* Step 4 lists `<listing_6>`.
* Step 5 lists the collector's completed listings.
* Each standing on the index is Leading, Outbid, Won or Canceled.

<!-- trace:case id=g10.auction-bidding-history.TC-c6d rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC3: Active and completed activity separate cleanly

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
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* A signed-in collector has activity on open listing `<listing_9>`, closed listing `<listing_10>` and canceled listing `<listing_11>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | An open listing with this collector's accepted bidding activity; bind its identity only |
| listing_10 | A closed listing with this collector's accepted bidding activity; bind its identity only |
| listing_11 | A canceled listing with this collector's accepted bidding activity; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Select **Active**.
3. Select **Completed**.

**Expected Results:**

* Step 2 shows only `<listing_9>`.
* Step 3 shows `<listing_10>` and `<listing_11>`.

<!-- trace:case id=g10.auction-bidding-history.TC-s3o rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC4: Paging does not repeat or skip a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has more Active listings than one page holds.
* No newer activity is added during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Follow every returned cursor.

**Expected Results:**

* Every active listing appears exactly once in latest-activity order.

<!-- trace:case id=g10.auction-bidding-history.TC-ev8 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### g10.auction-bidding-history.US1-TC5: Account with no bidding activity has an empty index

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has placed no bid.
* Another Grade10 account has bidding activity.
* Another storefront has bidding activity for the same account id.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Check the bidding index.

**Expected Results:**

* The bidding index is empty.
* The page shows this Grade10 account's index.

<!-- trace:case id=g10.auction-bidding-history.TC-wit rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC6: Each listing's standing is Leading, Outbid, Won or Canceled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) placed a bid on `<listing_18>`, with this state: `<listing state>`.

**Test data:**

| `<listing state>` | `<filter>` | `<standing>` |
| --- | --- | --- |
| Open, customer A leads | **Active** | Leading |
| Open, customer B leads | **Active** | Outbid |
| Closed, customer A won | **Completed** | Won |
| Closed, customer B won | **Completed** | Outbid |
| Called off after customer A's bid | **Completed** | Canceled |

| Field | Value |
| --- | --- |
| listing_18 | A listing with customer A's accepted bid and state `<listing state>`; bind its identity only |
| listing_18 | The listing with the retained activity described in the pre-conditions; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Select `<filter>`.
3. Find `<listing_18>`.

**Expected Results:**

* `<listing_18>` shows once, with `<standing>`.
* It shows its current or final price.

<!-- trace:case id=g10.auction-bidding-history.TC-hv4 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC7: A refused bid leaves an Outbid listing in its place

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in, enrolled to bid) bid on `<listing_21>` and `<listing_22>`, and customer B has since outbid them on `<listing_21>`.
* customer A's latest activity on `<listing_22>` is newer than on `<listing_21>`.
* customer A is on `<listing_21 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_21 | An open HKD listing led by customer B; bind its identity only | · |
| listing_22 | An open HKD listing customer A bid on after their last bid on `<listing_21>`; bind its identity only | · |
| current bid | HK$5,460 | (range: 400000–799999 minor units), `<listing_21>`'s current bid |
| increment | HK$80 | (fixed tier increment), the HK$4,000 tier |
| next minimum | HK$5,540 | (fixed derived value), `<current bid>` plus `<increment>` |
| refused bid | HK$5,460 | equal to `<current bid>`, below `<next minimum>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_21 url | The URL of `<listing_21>`; bind its URL only |

**Steps:**

1. Type `<refused bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to `<grade10 bids url>`.
4. Read the **Active** list.
5. Expand `<listing_21>`.

**Expected Results:**

* Step 2: the bid form names minimum `<next minimum>`, equal to `<current bid>` plus `<increment>`.
* `<listing_21>` reads Outbid, priced at `<current bid>`.
* `<listing_21>` still sits below `<listing_22>`.
* `<listing_21>`'s latest activity time is its last accepted bid's.
* Step 5's history matches that last accepted bid.

<!-- trace:case id=g10.auction-bidding-history.TC-92c rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### g10.auction-bidding-history.US1-TC8: A call-off adds no listing for a collector who never bid on it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) placed a bid on `<listing_24>`.
* customer B(signed in) watches `<listing_24>` and never bid on it.
* admin(holds `auction:operate`) called `<listing_24>` off.

**Test data:**

| Field | Value |
| --- | --- |
| listing_24 | A published HKD listing, called off after customer A's bid; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. As customer A, navigate to `<grade10 bids url>` and select **Completed**.
2. As customer B, navigate to `<grade10 bids url>` and select **Active**, then **Completed**.

**Expected Results:**

* Step 1 lists `<listing_24>` with standing Canceled.
* Step 2 lists customer B's accepted listings.

---

## g10.auction-bidding-history.US2: Collector audits every maximum Grade10 accepted

**As a** collector,
**I want** every maximum Grade10 accepts for me kept as a private event,
**so that** I can see what I set or raised, and what was placed automatically, without exposing my maximum to a rival.

<!-- trace:case id=g10.auction-bidding-history.TC-1ao rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC1: An accepted bid is recorded once, as a maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked, no bid on `<listing_27>`) is on `<listing_27 url>`.
* The listing has opening price `<opening price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_27 | An open USD listing with no other bidder, opening price `<opening price>`; bind its identity only | · |
| maximum | USD560 | (range: 50000–99999 minor units) |
| opening price | USD100 | (fixed tier boundary) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_27 url | The URL of `<listing_27>`; bind its URL only |

**Steps:**

1. Enter `<maximum>` in the custom maximum on the bid panel and place the bid.
2. Navigate to `<grade10 bids url>`.
3. Expand `<listing_27>`.

**Expected Results:**

* Step 3 shows one event, a maximum set at `<maximum>`, for the signed-in account.

<!-- trace:case id=g10.auction-bidding-history.TC-q0n rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC2: A refused bid adds no event to the collector's history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in, enrolled to bid) leads `<listing_30>` with a maximum of `<customer A maximum>`.
* The entries of `<listing_30>`'s history on `<grade10 bids url>`, and the listing's bid count, are noted.
* customer A is on `<listing_30 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_30 | An open HKD listing led by customer A; bind its identity only | · |
| customer A maximum | HK$200 | (range: 1000–79999 minor units) |
| refused raise | HK$200 | equal to `<customer A maximum>` |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_30 url | The URL of `<listing_30>`; bind its URL only |

**Steps:**

1. Type `<refused raise>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to `<grade10 bids url>`.
4. Expand `<listing_30>`.
5. Return to `<listing_30 url>` and read the bid count.

**Expected Results:**

* Step 2: the bid form keeps `<customer A maximum>` as the maximum on file.
* Step 4 shows the noted entries.
* Step 5's bid count is the one noted.

<!-- trace:case id=g10.auction-bidding-history.TC-l6l rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC3: Browser-only validation creates no Auction event

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on `<listing_33 url>` and has placed no bid on it.
* The maximum input rejects decimal value `<malformed maximum>` in this fixture.

**Test data:**

| Field | Value |
| --- | --- |
| listing_33 | An open HKD listing; bind its identity only |
| malformed maximum | 10.50 |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_33 url | The URL of `<listing_33>`; bind its URL only |

**Steps:**

1. Note the bidding index on `<grade10 bids url>`.
2. Open `<listing_33 url>`.
3. Type `<malformed maximum>` into the custom maximum on the bid panel.
4. Read the custom maximum.
5. Return to `<grade10 bids url>`.

**Expected Results:**

* The custom maximum shows `<malformed maximum>` is not accepted.
* No bid is submitted.
* The bidding index matches the note from step 1.

<!-- trace:case id=g10.auction-bidding-history.TC-5aw rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC4: Automatic maximum is recorded and stays private

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
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in, card linked) is on `<listing_36 url>` and has placed no bid on it.
* customer B(signed in) can open the same listing.
* No one is signed in on a third session.
* The listing has opening price `<opening price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_36 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| first maximum | HK$420 | (range: 1000–79999 minor units) |
| raised maximum | HK$560 | (range: 1000–79999 minor units) |
| opening price | HK$280 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_36 url | The URL of `<listing_36>`; bind its URL only |

**Steps:**

1. As customer A, enter `<first maximum>` in the custom maximum and place the bid.
2. Enter `<raised maximum>` in the custom maximum and place the bid.
3. Navigate to `<grade10 bids url>` and expand `<listing_36>`.
4. As customer B, navigate to `<grade10 bids url>` and expand `<listing_36>` if it is listed.
5. Signed out, open `<listing_36 url>` and read public recent bids.

**Expected Results:**

* Step 3 records `<first maximum>` and then `<raised maximum>`.
* Customer B's bidding index lists customer B's accepted listings.
* Signed-out recent bids show the public price and the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-shn rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### g10.auction-bidding-history.US2-TC5: Engine bid is labeled automatic

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
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_39>` with a maximum of `<customer A maximum>`.
* customer B(signed in, card linked) is on `<listing_39 url>`.
* The listing has current bid `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_39 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$680 | (range: 1000–79999 minor units) |
| customer B maximum | HK$430 | (range: 1000–79999 minor units), below `<customer A maximum>` |
| current bid | HK$280 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_39 url | The URL of `<listing_39>`; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_39>`.
4. Signed out, open `<listing_39 url>` and read the new public price.

**Expected Results:**

* Step 3 labels customer A's answering movement as automatic.
* Step 4 shows the listing pseudonym on the new public price.

---

## g10.auction-bidding-history.US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC1: Competing bid shows customer A outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_42>` at `<opening price>`, with a maximum equal to `<opening price>`.
* customer B(signed in, card linked) is on `<listing_42 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_42 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| customer B maximum | HK$520 | (range: 1000–79999 minor units) |
| opening price | HK$360 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_42 url | The URL of `<listing_42>`; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_42>`.

**Expected Results:**

* Customer B appears under the listing pseudonym.
* That step shows customer A outbid at the public price.
* The amounts shown are the public price.

<!-- trace:case id=g10.auction-bidding-history.TC-i8u rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC2: Automatic response is attributed to customer A

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_45>` with maximum `<customer A maximum>`, above `<current bid>`.
* customer B(signed in, card linked) is on `<listing_45 url>`.
* The listing has current bid `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_45 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$650 | (range: 1000–79999 minor units) |
| customer B maximum | HK$410 | (range: 1000–79999 minor units) |
| current bid | HK$300 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_45 url | The URL of `<listing_45>`; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_45>`.

**Expected Results:**

* Customer B's action comes first when they share a time.
* Customer A's following movement is marked automatic.
* Both records read as one step.

<!-- trace:case id=g10.auction-bidding-history.TC-mug rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC4: Full retained history remains pageable

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* One listing has more public and private events than one page holds. No new event is added during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand that listing's combined history.
3. Follow every returned cursor.

**Expected Results:**

* Every retained event visible to that collector appears exactly once in stable order.

<!-- trace:case id=g10.auction-bidding-history.TC-iuc rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### g10.auction-bidding-history.US3-TC5: A history page never splits one auction decision

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) has a combined history on `<listing_51>`.
* One decision on that history wrote customer A's maximum, their accepted price `<accepted price>`, customer B's response at `<response price>`, and customer A's outbid standing, between an older and a newer rival price.
* No new bid is placed on `<listing_51>` during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| listing_51 | An open USD listing customer A and customer B both bid on; bind its identity only |
| split decision | The decision containing customer A's accepted price `<accepted price>`, customer B's response `<response price>` and customer A's outbid standing; bind its identity only |

| Field | Value | Fixture notes |
| --- | --- | --- |
| accepted price | USD320 | (range: 10000–49999 minor units) |
| response price | USD330 | (range: 10000–49999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand `<listing_51>`.
3. Follow every cursor at a page size of 1.
4. Read the same history as one page of 50.

**Expected Results:**

* Step 3 returns every record of `<split decision>` on one page.
* Step 4 reads those records in the same order.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### g10.auction-bidding-history.US3-TC6: Boundary maxima write the stated history

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* Each row starts from the same fixture.
* customer A(signed in) leads `<listing_54>` with an accepted maximum `<customer A maximum>`.
* The current public bid is `<current bid>` and the increment is `<increment>`.
* customer B(signed in, card linked) has placed no bid on `<listing_54>` and is on `<listing_54 url>`.

**Test data:**

| `<customer B maximum>` | `<public history>` | `<leader>` | `<account history>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD5 | customer B bids USD5, then customer A responds automatically at USD6, at the same time | customer A | customer B's maximum is retained at USD5 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 500, 600 |
| USD7 | customer B bids USD7, then customer A responds automatically at USD8, at the same time | customer A | customer B's maximum is retained at USD7 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 700, 800 |
| USD9.50 | customer B bids USD9.50, then customer A responds automatically at USD10 without exceeding USD10 | customer A | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 950, 1000 |
| USD10 | customer B bids USD10 first, then customer A responds automatically at USD10, at the same time | customer A | the maximum stays private | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1000 |
| USD10.01 | customer B bids USD10.01 once; customer A has no new bid record | customer B | customer B's maximum is retained at USD10.01 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1001 |
| USD11 | customer B bids USD11 once, with no intermediate record or new bid record for customer A | customer B | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100 |
| USD11.20 | customer B bids USD11 once, one increment above customer A's maximum; customer A has no new bid record | customer B | customer B's maximum is retained at USD11.20 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100, 1120 |

| Field | Value | Fixture notes |
| --- | --- | --- |
| customer A maximum | USD10 | (fixed boundary for these history rows) |
| current bid | USD4 | (fixed starting state) |
| increment | USD1 | (fixed tier increment) |
| listing_54 | The listing with the retained activity described in the pre-conditions; bind its identity only | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_54 url | The URL of `<listing_54>`; bind its URL only |

**Steps:**

1. Enter `<customer B maximum>` in the custom maximum on the bid panel and place the bid.
2. Read the listing's public recent bids.
3. Navigate to `<grade10 bids url>` and expand `<listing_54>`.

**Expected Results:**

* Step 2: public history reads as follows: `<public history>`, under listing pseudonyms.
* The leader is `<leader>`.
* For rows with an account-history check, step 3 shows the following: `<account history>`.

<!-- trace:case id=g10.auction-bidding-history.TC-ybl rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### g10.auction-bidding-history.US3-TC3: Failed attempt sits beside unchanged auction state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* A collector's attempt fails while another bidder remains leading.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.
3. Check the accepted price and leading pseudonym.

**Expected Results:**

* The failed private event appears at its authoritative time with its safe reason.
* The auction's accepted price and leading pseudonym remain unchanged.

---

## g10.auction-bidding-history.US4: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maximums or my standing.

<!-- trace:case id=g10.auction-bidding-history.TC-nvt rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC1: Storefront account reads its own history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* A Grade10 storefront session for account A with id `<account id>`.

**Test data:**

| Field | Value |
| --- | --- |
| account id | The Grade10 account A identity; bind its id only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>` as account A.
2. Check the bidding index and combined histories.

**Expected Results:**

* Auction returns only A's Grade10 activity and the public movements that belong in its combined histories.

<!-- trace:case id=g10.auction-bidding-history.TC-0mp rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC2: Same account id on another storefront is unrelated

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
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* Grade10 and ZZZ each have an account with account id `<account id>`. Grade10 holds private bidding events for that id.

**Test data:**

| Field | Value |
| --- | --- |
| account id | An id present on separate Grade10 and ZZZ accounts; bind the shared id only |

**Steps:**

1. Sign in to ZZZ as the account with id `<account id>`.
2. Read its bidding history.

**Expected Results:**

* The ZZZ history lists that storefront's activity.

<!-- trace:case id=g10.auction-bidding-history.TC-ls6 rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC3: Anonymous reader cannot read private history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/listings/publicState.spec.ts`, `grade10:packages/grade10-store/backend/src/testing/suites/auctionRouter.ts`

**Pre-conditions:**
No storefront session.

**Steps:**

1. Read the API response for an account bidding index with no storefront session.
2. Read the API response for a public listing.

**Expected Results:**

* Grade10 refuses the account index read.
* The public listing read shows public price movements and listing pseudonyms.

<!-- trace:case id=g10.auction-bidding-history.TC-87o rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### g10.auction-bidding-history.US4-TC4: Reading history is inert

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
* **Trace:** grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has retained bidding history.
* The bid, maximum, listing standing and auction close of one of its listings are noted.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Read and page the index and that listing's combined history.
3. Check that listing's bid, maximum, listing standing and auction close.

**Expected Results:**

* The noted bid, maximum, listing standing and auction close match the note.

---

## g10.auction-bidding-history.US5: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

<!-- trace:case id=g10.auction-bidding-history.TC-p6t rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC1: Signed-in collector opens active bids

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* A signed-in Grade10 collector with active and completed bidding activity.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Check the page and the site chrome.
3. Switch to **Completed**.

**Expected Results:**

* The page shows the Active summaries inside the existing site chrome.
* Switching to **Completed** stays in that same page.

<!-- trace:case id=g10.auction-bidding-history.TC-04o rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC2: Outbid summary leads to its explanation and listing

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* An open listing on which the collector is outbid.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand that summary.

**Expected Results:**

* The combined history identifies the public movement that outbid **You**.
* The page offers a route to the still-open listing.

<!-- trace:case id=g10.auction-bidding-history.TC-9al rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC3: Signed-out visitor preserves the destination

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* The visitor is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Complete the existing sign-in flow.

**Expected Results:**

* The Grade10 site starts its existing sign-in flow.
* Successful sign-in returns the collector to `/bids`.

<!-- trace:case id=g10.auction-bidding-history.TC-u0u rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC4: Empty filter is explicit

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* A signed-in collector with no entries in the filter `<filter>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| filter | Active | Representative filter with no entries; Completed also fits when empty |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Select `<filter>`.
3. Wait until the filter finishes loading.

**Expected Results:**

* The page shows the empty state for the filter `<filter>`.
* That empty state is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-5h6 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC5: Initial loading reserves the bidding list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) is opening `<grade10 bids url>`.
* The bidding index is delayed, so the selected page has not answered yet.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Check the page during the delay.

**Expected Results:**

* The page shows a labeled bidding-history loading state inside the site chrome.
* That loading state is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-u23 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC6: Index failure is retryable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) is opening `<grade10 bids url>`.
* The bidding index is mocked to fail for the selected page.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Check the page.

**Expected Results:**

* The page shows a retryable bidding-history error.
* That error is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-jy9 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC7: Expanding history preserves its summary while loading

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) has a visible bidding summary on `<grade10 bids url>`.
* That listing's combined history is delayed, so it has not answered yet.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Expand that summary.
2. Check the summary and the history area during the delay.

**Expected Results:**

* That summary stays visible with a labeled history-loading state.
* The history area shows that loading state.

<!-- trace:case id=g10.auction-bidding-history.TC-h9q rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC8: Loading more preserves entries already shown

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A visible index or combined history page with a further cursor.

**Steps:**

1. Activate the next-page control.
2. Activate it again while the next page is still loading.

**Expected Results:**

* The entries already shown remain visible while the next page loads.
* The next-page control takes one request for that page.

<!-- trace:case id=g10.auction-bidding-history.TC-e9b rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC9: History failure preserves the listing summary

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
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) can see the bidding index on `<grade10 bids url>`.
* One listing's combined history is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Expand that listing.
2. Check that summary and the other summaries.

**Expected Results:**

* That summary remains visible with a retryable history error.
* Other summaries and their histories remain usable.

<!-- trace:case id=g10.auction-bidding-history.TC-nyy rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### g10.auction-bidding-history.US5-TC10: ZZZ receives no bidding-history page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

None.

**Test data:**

| Field | Value |
| --- | --- |
| zzz store url | The ZZZ storefront URL; bind its URL only |

**Steps:**

1. Sign in to `<zzz store url>`.
2. Look for a bidding-history route or screen.
3. Use ZZZ's authenticated backend against the shared history contract.

**Expected Results:**

* ZZZ's storefront routes match the routes from before this capability.
* A signed-in ZZZ history read returns that storefront's activity.

---

## g10.auction-bidding-history.US6: Collector reviews maximum history on the listing

**As a** signed-in collector,
**I want** to open **Your bidding** on a listing and read every accepted maximum I set or raised there,
**so that** I can see when I raised the ceiling without leaving the listing or opening the full account chronology.

<!-- trace:case id=g10.auction-bidding-history.TC-p4o rev=1 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC1: Maximum-only listing opens on Bid placed with empty bids

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed-in bidder with one accepted automatic maximum and no automatic bid placed for them yet on `<listing_102>`) is on that listing's page. **Your bidding** is visible beside public recent bids.

**Test data:**

| Field | Value |
| --- | --- |
| listing_102 | A listing with this collector's one accepted automatic maximum and no automatic bid placed for them yet; bind its identity only |

**Steps:**

1. Activate **Your bidding**.
2. Inspect the dialog title, description, tab order, and the active tab.
3. Activate **Your maximums**.
4. Inspect the maximum rows and whether a sticky current-maximum summary is shown.

**Expected Results:**

* The dialog title is **Your bidding**.
* Tabs appear in order **Bid placed**, then **Your maximums**.
* **Bid placed** is active and shows the empty bids state.
* **Your maximums** lists the accepted maximum's amount and time.
* The live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-3hn rev=2 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC2: Raised maximums list without refusals on the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed-in bidder who set a maximum on `<listing_105>`, later raised it, and then had a further raise refused) is on that listing's page.

**Test data:**

| Field | Value |
| --- | --- |
| listing_105 | A listing where this collector set and raised a maximum, then had a further raise refused; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Activate **Your bidding**.
2. Activate **Your maximums**.
3. Inspect every maximum row.
4. Navigate to `<grade10 bids url>`.
5. Expand `<listing_105>`.

**Expected Results:**

* **Your maximums** lists the accepted set and raise, newest first, each row an amount and a time.
* Both listing tabs list those accepted amounts.
* Step 5 lists those accepted amounts.

<!-- trace:case id=g10.auction-bidding-history.TC-s22 rev=1 covers=g10.auction-bidding-history.SC-roe -->
### g10.auction-bidding-history.US6-TC3: Listing personal bidding stays private and inert

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed-in bidder with personal bidding activity) and customer B(rival with a private maximum) both have activity on `<listing_108>`.
* customer A is on that listing's page.
* The public recent bids and customer A's live maximum on the bid panel are noted.

**Test data:**

| Field | Value |
| --- | --- |
| listing_108 | A listing with customer A's personal bidding activity and customer B's private maximum; bind its identity only |

**Steps:**

1. Activate **Your bidding**.
2. Inspect **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check public recent bids, live maximum and listing standing.

**Expected Results:**

* **Bid placed** and **Your maximums** list customer A's amounts and times.
* Public recent bids, the live maximum and the standing match the note.

---

## g10.auction-bidding-history.US7: Collector reviews bids Grade10 placed on the listing

**As a** signed-in collector,
**I want** the listing dialog to separate the bids Grade10 placed for me from my
maximums, open on **Bid placed** by default, and list that tab first,
**so that** I do not read an auto-bid step as my maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-lx1 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC1: Bid placed stays default when both lists have rows

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed-in bidder with at least one automatic bid Grade10 placed for them and at least one accepted maximum on `<listing_111>`) is on that listing's page.

**Test data:**

| Field | Value |
| --- | --- |
| listing_111 | A listing with this collector's automatic bid records and accepted maximum records; bind its identity only |

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab and **Bid placed** rows.
3. Activate **Your maximums**.
4. Inspect maximum rows.

**Expected Results:**

* **Bid placed** is the initial active tab.
* Tab order is **Bid placed**, then **Your maximums**.
* **Bid placed** lists the owner's automatic bid amounts and times.
* **Your maximums** lists every accepted configure or raise for that owner on that listing, newest first, each row an amount and a time.
* The live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-j30 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC2: Empty Bid placed remains the default before any auto-bid

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed-in bidder with one accepted automatic maximum and no automatic bid placed for them yet on `<listing_114>`) is on that listing's page.

**Test data:**

| Field | Value |
| --- | --- |
| listing_114 | A listing with this collector's one accepted automatic maximum and no automatic bid placed for them yet; bind its identity only |

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab copy.
3. Activate **Your maximums** and return to **Bid placed**.

**Expected Results:**

* **Bid placed** is active on open and shows the empty-bids state.
* **Bid placed** and **Your maximums** stay separate tabs.

<!-- trace:case id=g10.auction-bidding-history.TC-7py rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### g10.auction-bidding-history.US7-TC3: Reading separated lists does not change auction facts

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed-in bidder with both bid-sequence and maximum rows on `<listing_117>`) is on that listing's page. Note standing, live maximum, and public recent bids before opening the dialog.

**Test data:**

| Field | Value |
| --- | --- |
| listing_117 | A listing with this collector's automatic bid records and accepted maximum records; bind its identity only |

**Steps:**

1. Activate **Your bidding**.
2. Switch between **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check standing, live maximum, and public recent bids.

**Expected Results:**

* Standing, the live maximum and public recent bids match the note.

---

## g10.auction-bidding-history.US8: Collector reads clearer maximum labels on /bids

**As a** signed-in collector,
**I want** configure and raise events on `/bids` named as maximum set or raised,
**so that** the account chronology matches the listing wording without a new account tab.

<!-- trace:case id=g10.auction-bidding-history.TC-qo3 rev=2 covers=g10.auction-bidding-history.SC-9ua -->
### g10.auction-bidding-history.US8-TC1: Account chronology names maximum set and raised, and no refusal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-08

**Pre-conditions:**

* customer(signed in) set an automatic maximum on `<listing_120>`, later raised it, and then had a further raise refused.

**Test data:**

| Field | Value |
| --- | --- |
| listing_120 | A listing where this collector set and raised a maximum, then had a further raise refused; bind its identity only |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand `<listing_120>`.
3. Inspect the set and raise events.
4. Read the account navigation.

**Expected Results:**

* Those events read as a maximum set and a maximum raised.
* The chronology lists those accepted amounts.
* Account navigation stays on the bids page.

---

## g10.auction-bidding-history.US9: Collector sees public bid avatars without learning emails

**As a** collector,
**I want** each public bid avatar to show one letter from that bidder's email
without learning their email or name,
**so that** I can tell rivals apart on the public ledger while identity stays
behind the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-ava rev=1 -->
### g10.auction-bidding-history.US9-TC1: Public ledger avatar matches the email local-part letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_123>` is published with at least one counted public bid from a bidder whose email is `<email_ada>`.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| expected_letter | `A` |
| listing_123 | A published listing with a counted public bid whose bidder email is `<email_ada>`; bind its identity only |

**Steps:**

1. Read the anonymous public listing response for `<listing_123>`.
2. Find the public bid row for that bidder.

**Expected Results:**

* The row's listing pseudonym is of the form Bidder N.
* The row's avatar character is `<expected_letter>`.
* The response body contains neither `<email_ada>` nor a personal display name for that bidder.

<!-- trace:case id=g10.auction-bidding-history.TC-avb rev=1 -->
### g10.auction-bidding-history.US9-TC2: Erased or letterless email falls back to B

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_126>` has a public bid whose bidder email was erased, and a public bid whose email local part has no letter or digit before `@`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_126 | A listing with two public bids: one from an erased email and one from a letterless and digitless email local part; bind its identity only |

**Steps:**

1. Read the anonymous public listing response for `<listing_126>`.
2. Check each of those two public bid rows.

**Expected Results:**

* Each row's avatar character is `B`.
* Each row still shows a listing pseudonym of the form Bidder N.
* Neither row exposes an email.

## Settled

- A refused bid is not a bid: it adds no listing to `/bids`, no history entry and no standing, and moves no listing; failed-only standing and refusal reasons are gone.
- `/bids` standing is Leading, Outbid, Won or Canceled.
- A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions (decisions Q14).

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-17-add-lot-maximum-bid-history** — `grade10-site-auction-bidding-history-US6-TC1-1` → `g10.auction-bidding-history.US6-TC1`; `grade10-site-auction-bidding-history-US6-TC2-1` → `g10.auction-bidding-history.US6-TC2`; `grade10-site-auction-bidding-history-US6-TC3-1` → `g10.auction-bidding-history.US6-TC3`; `grade10-site-auction-bidding-history-US7-TC1-1` → `g10.auction-bidding-history.US7-TC1`; `grade10-site-auction-bidding-history-US7-TC2-1` → `g10.auction-bidding-history.US7-TC2`; `grade10-site-auction-bidding-history-US7-TC3-1` → `g10.auction-bidding-history.US7-TC3`; `grade10-site-auction-bidding-history-US8-TC1-1` → `g10.auction-bidding-history.US8-TC1`
- **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-bidding-history-US1-TC1-1` → `g10.auction-bidding-history.US1-TC1`; `grade10-site-auction-bidding-history-US1-TC2-2` → `g10.auction-bidding-history.US1-TC2`; `grade10-site-auction-bidding-history-US1-TC6-1` → `g10.auction-bidding-history.US1-TC6`; `grade10-site-auction-bidding-history-US1-TC7-1` → `g10.auction-bidding-history.US1-TC7`; `grade10-site-auction-bidding-history-US1-TC8-1` → `g10.auction-bidding-history.US1-TC8`; `grade10-site-auction-bidding-history-US2-TC1-2` → `g10.auction-bidding-history.US2-TC1`; `grade10-site-auction-bidding-history-US2-TC2-2` → `g10.auction-bidding-history.US2-TC2`; `grade10-site-auction-bidding-history-US3-TC3-1` → `g10.auction-bidding-history.US3-TC3`; `grade10-site-auction-bidding-history-US3-TC5-1` → `g10.auction-bidding-history.US3-TC5`; `grade10-site-auction-bidding-history-US4-TC4-1` → `g10.auction-bidding-history.US4-TC4`; `grade10-site-auction-bidding-history-US6-TC2-2` → `g10.auction-bidding-history.US6-TC2`; `grade10-site-auction-bidding-history-US6-TC3-1` → `g10.auction-bidding-history.US6-TC3`; `grade10-site-auction-bidding-history-US8-TC1-2` → `g10.auction-bidding-history.US8-TC1`
- **2026-10-07-email-initial-bid-avatars** — `grade10-site-auction-bidding-history-US9-TC1-1` → `g10.auction-bidding-history.US9-TC1`; `grade10-site-auction-bidding-history-US9-TC2-1` → `g10.auction-bidding-history.US9-TC2`

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bidding-history-SC-47` by the Canceled row of `g10.auction-bidding-history.US1-TC6`; `grade10-site-auction-bidding-history-SC-48` by `g10.auction-bidding-history.US3-TC5`; `grade10-site-auction-bidding-history-SC-49` by `g10.auction-bidding-history.US1-TC2`; `grade10-site-auction-bidding-history-SC-50` by `g10.auction-bidding-history.US1-TC7` and `g10.auction-bidding-history.US2-TC2`; `grade10-site-auction-bidding-history-SC-44` by `g10.auction-bidding-history.US6-TC2`; `grade10-site-auction-bidding-history-SC-46` by `g10.auction-bidding-history.US8-TC1`; `grade10-site-auction-bidding-history-SC-18` and `grade10-site-auction-bidding-history-SC-45` by `g10.auction-bidding-history.US4-TC4` and `g10.auction-bidding-history.US6-TC3`; `grade10-site-auction-auction-SC-90`, an Outbid listing keeping its place, by `g10.auction-bidding-history.US1-TC7`
- **Covered at domain** - `g10.auction-dmn.US3-TC2` walks `grade10-site-auction-bidding-history-SC-29`: a maximum below the next bid is refused and its history gains no event
- **Added by QA2** - `g10.auction-bidding-history.US1-TC8` for the other half of `grade10-site-auction-bidding-history-SC-47`: a call-off adds no listing for a collector who only watched. `g10.auction-bidding-history.US2-TC1` for `grade10-site-auction-bidding-history-SC-51`: the durable case read an accepted manual bid, which no longer exists; an accepted bid now reads as one maximum set. `g10.auction-bidding-history.US1-TC1` restyled: its pre-condition asked for manual bids. The `grade10-site-auction-bidding-history-US7` heading carries the journey's new words, with no case changed
- **Revised** - `g10.auction-bidding-history.US1-TC2`, `g10.auction-bidding-history.US2-TC2`, `g10.auction-bidding-history.US6-TC2` and `g10.auction-bidding-history.US8-TC1`: QA1 kept their ids, but each now verifies that a refusal is absent where it was retained, so each moves up a revision. The markers of `g10.auction-bidding-history.US1-TC1`, `g10.auction-bidding-history.US1-TC2`, `g10.auction-bidding-history.US2-TC1` and `g10.auction-bidding-history.US2-TC2` drop the retired grade10-site-auction-bidding-history-SC-02 and grade10-site-auction-bidding-history-SC-38, and those of `g10.auction-bidding-history.US2-TC1` and `g10.auction-bidding-history.US2-TC2` drop grade10-site-auction-bidding-history-SC-37 too. `g10.auction-bidding-history.US4-TC4` and `g10.auction-bidding-history.US6-TC3` lose the hold from what reading leaves unchanged, a draft restyle with `<v>` kept
- **Corrected** - `g10.auction-bidding-history.US3-TC5`, `g10.auction-bidding-history.US6-TC2` and `g10.auction-bidding-history.US6-TC3` traced Feature set groups; they trace their sections' journeys
- **Deprecated** - `g10.auction-bidding-history.US3-TC3`, a failed attempt beside the auction
- **Raised, answered** - Q14: a lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions, as grade10 runs, recommended; answer in `## Settled`
- **Reworded** - `grade10-site-auction-bidding-history-SC-05`: an empty index is now for an account that has placed no bid, in place of one with no retained maximum attempt or automatic-bid activity; `g10.auction-bidding-history.US1-TC5` still asserts it
- **Retired** - grade10-site-auction-bidding-history-SC-02, a failed-only listing, and grade10-site-auction-bidding-history-SC-13, a failed attempt beside the auction, leave their renamed requirements with refused attempts; grade10-site-auction-bidding-history-SC-38, a refused maximum kept as an event, and grade10-site-auction-bidding-history-SC-37, a manual bid request refused, leave "Every accepted maximum action leaves a private event". `grade10-site-auction-bidding-history-SC-51` states the rule that replaces grade10-site-auction-bidding-history-SC-37: every bid is a maximum. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** QA1 blind pass on frozen Feature set + journeys + proposal/decisions/ui-design + linked PRD sections; denied Requirements, tech-design, and archive. Domain suite: no new domain case — existing cases already assert listing-pseudonym naming; avatar letter is feature-owned on US-09/US-15. QA2 reconciled against Dev scenarios SC-52 and SC-53.

| Case | Disposition |
| --- | --- |
| `g10.auction-bidding-history.US9-TC1` | Folded — covered by `grade10-site-auction-bidding-history-SC-52` |
| `g10.auction-bidding-history.US9-TC2` | Folded — covered by `grade10-site-auction-bidding-history-SC-53` |
| `grade10-site-auction-bidding-history-SC-52` | Covered by `g10.auction-bidding-history.US9-TC1` |
| `grade10-site-auction-bidding-history-SC-53` | Covered by `g10.auction-bidding-history.US9-TC2` |
