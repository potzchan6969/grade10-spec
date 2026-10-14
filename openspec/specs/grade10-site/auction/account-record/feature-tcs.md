# grade10-site/auction/account-record Test Cases

**Status:** reopened · 0/33
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Reach My Auctions and read bidding rows — phase 1

**Starting state:**

**Steps 1–4 setup:**

- customer(signed in) is on `<listing_43 url>`.

**Steps 5–5 setup:**

- customer(signed in) has bookmarked every listing in **Test data**, and nothing else.

**Steps 6–7 setup:**

- customer(signed in, has never watched or bid on a listing).

**Steps 8–9 setup:**

- customer(signed in) watches `<listing_37>`.
- The My Auctions read is mocked to fail once, then succeed.

**Steps 10–11 setup:**

- customer(signed out) has watched listings under their account.

**Steps 12–13 setup:**

- customer A(signed in) has bid on `<listing_35>`, with this state: `<listing_state>`.

**Steps 14–15 setup:**

- customer A(signed in) leads `<listing_34>` and is on `<my auctions url>`.
- customer B(signed in, enrolled to bid) is on `<listing_34 url>` in a separate session.

**Steps 16–16 setup:**

- customer A(signed in) has bid on `<listing_33>` and is on `<my auctions url>`.
- The refresh of `<listing_33>`'s bid and close is mocked to fail.

**Steps 17–20 setup:**

- customer A(signed in) holds maximum `<customer A maximum>` and standing `<your_standing>` for `<listing_31>`, with state `<listing_state>`, current bid `<current bid>` and minimum next bid `<minimum next bid>`, and is on `<listing_31 url>`.

**Steps 21–24 setup:**

- customer A(signed in, enrolled to bid) has neither watched nor bid on `<listing_31>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| listing_43 | A published listing whose bidding has not started, scheduled to open inside the test window; bind its identity only |
| listing_43 url | The URL of `<listing_43>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 5–5 data:**

| Listing | Bookmark | Close |
| --- | --- | --- |
| listing_38 | Bid | Open, closes in 3 days |
| listing_39 | Bid | Open, closes in 1 day |
| listing_40 | Watch only | Open, closes in 2 days |
| listing_41 | Watch only | Open, closes in 5 hours |
| listing_42 | Watch only | Closed yesterday |

| Field | Value |
| --- | --- |
| listing_38 | A listing with Bid for this customer; Open, closes in 3 days; bind its identity only |
| listing_39 | A listing with Bid for this customer; Open, closes in 1 day; bind its identity only |
| listing_40 | A listing with Watch only for this customer; Open, closes in 2 days; bind its identity only |
| listing_41 | A listing with Watch only for this customer; Open, closes in 5 hours; bind its identity only |
| listing_42 | A listing with Watch only for this customer; Closed yesterday; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps 8–9 data:**

| Field | Value |
| --- | --- |
| listing_37 | An open listing taking bids, watched by this collector; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps 12–13 data:**

| `<listing_state>` | `<your_standing>` |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

| Field | Value |
| --- | --- |
| listing_35 | An open listing bid on by customer A, with state `<listing_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| listing_34 | An open listing taking bids, led by customer A with no maximum above the current bid; bind its identity only |
| customer B bid | The next valid bid shown on customer B's bid panel |
| listing_34 url | The URL of `<listing_34>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 16–16 data:**

| Field | Value |
| --- | --- |
| listing_33 | An open listing taking bids, bid on by customer A; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 17–20 data:**

| `<listing_state>` | `<customer A maximum>` | `<current bid>` | `<minimum next bid>` | `<refused raise>` | `<your_standing>` |
| --- | --- | --- | --- | --- | --- |
| Open, customer B leads | 25000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Outbid, with the next valid bid |
| Open, customer A leads at 30000 USD minor units | 30000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Leading |

| Field | Value |
| --- | --- |
| listing_31 | An open USD listing taking bids; bind its identity only |
| listing_31 url | The URL of `<listing_31>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 21–24 data:**

| Field | Value |
| --- | --- |
| listing_31 | An open USD listing taking bids; bind its identity only |
| low bid | One minor unit below the next valid bid shown on customer A's bid panel |
| listing_31 url | The URL of `<listing_31>`; bind its URL only |
| my auctions url | The My Auctions URL |

### Route

1. Click the Watch control.
2. Navigate to `<my auctions url>`.
   - Step 2: `<listing_43>` shows once, Your Standing `--`. `g10.auction-account-record.US1-TC1`
3. Wait until `<listing_43>`'s bidding starts, then reload `<my auctions url>`.
   - Step 3: `<listing_43>` is still listed. `g10.auction-account-record.US1-TC1`
4. Click `<listing_43>`'s row.
   - Step 4: `<listing_43 url>` opens, taking bids. `g10.auction-account-record.US1-TC1`
5. Navigate to `<my auctions url>`.
   - The title count reads 5. `g10.auction-account-record.US1-TC2`
   - Rows read, top down: `<listing_39>`, `<listing_38>`, `<listing_41>`, `<listing_40>`, `<listing_42>`. `g10.auction-account-record.US1-TC2`
   - Each listing shows once. `g10.auction-account-record.US1-TC2`
6. Navigate to `<my auctions url>`.
   - Step 6: the page says nothing is bookmarked; no error shows. `g10.auction-account-record.US1-TC3`
7. Click the catalogue offer.
   - Step 7: the auction catalogue opens. `g10.auction-account-record.US1-TC3`
8. Navigate to `<my auctions url>`.
   - Step 8: the page says the read failed; it does not read as empty. `g10.auction-account-record.US1-TC4`
   - Step 8: no catalogue offer shows. `g10.auction-account-record.US1-TC4`
9. Click retry.
   - Step 9: `<listing_37>` is listed. `g10.auction-account-record.US1-TC4`
10. Navigate to `<my auctions url>`.
   - Step 10: sign-in is offered; no bookmarked listing shows. `g10.auction-account-record.US1-TC5`
11. Complete sign-in from the offer.
   - Step 11: the collector returns to My Auctions, showing their own listings. `g10.auction-account-record.US1-TC5`
12. Navigate to `<my auctions url>`.
13. Find `<listing_35>`'s row.
   - Your Standing reads `<your_standing>`. `g10.auction-account-record.US2-TC1`
   - Current bid reads `<listing_35>`'s current bid. `g10.auction-account-record.US2-TC1`
   - For Outbid, the next valid bid equals current bid plus its increment. `g10.auction-account-record.US2-TC1`
14. As customer B, place `<customer B bid>`.
15. As customer A, reload `<my auctions url>`.
   - `<listing_34>` reads Outbid, with the next valid bid. `g10.auction-account-record.US2-TC2`
   - Current bid reads `<customer B bid>`. `g10.auction-account-record.US2-TC2`
16. Wait for the next refresh of `<listing_33>`'s row.
   - `<listing_33>`'s current bid and close are shown as not current. `g10.auction-account-record.US2-TC3`
17. Place `<refused raise>`.
   - Step 17 shows the refusal on the bid panel. `g10.auction-account-record.US2-TC4`
18. Note `<listing_31>`'s current bid on its page.
   - Current bid reads the bid noted at step 18, still `<current bid>`, never `<refused raise>`. `g10.auction-account-record.US2-TC4`
19. Navigate to `<my auctions url>`.
20. Find `<listing_31>`'s row.
   - Your Standing reads `<your_standing>`. `g10.auction-account-record.US2-TC4`
21. Navigate to `<my auctions url>` and note the title count.
   - The title count equals the count noted at step 21. `g10.auction-account-record.US2-TC5`
22. Navigate to `<listing_31 url>` and place `<low bid>`.
   - Step 22 shows the refusal on the bid panel. `g10.auction-account-record.US2-TC5`
23. Navigate to `<my auctions url>`.
24. Open the Active, Upcoming and Ended tabs in turn.
   - No tab holds a row for `<listing_31>`. `g10.auction-account-record.US2-TC5`

## Walk 2: Reach My Auctions and read bidding rows and adjacent checks

**Starting state:**

**Steps 1–4 setup:**

- customer A(signed in, enrolled to bid) bid on `<listing_29>` and `<listing_30>`, and customer B has since outbid them on `<listing_29>`.
- customer A is on `<listing_29 url>`.

**Steps 5–6 setup:**

- customer(signed in) won `<listing_28>`, whose proof was under check.
- An operator then took this action: `<operator_action>`.

**Steps 7–7 setup:**

- customer A won `<listing_27>`, which reads Payment Verifying.
- customer B(signed in) uses a separate session.

**Steps 8–9 setup:**

- customer(signed in) won `<listing_26>`, whose order has this state: `<order_state>`.

**Steps 10–10 setup:**

- customer(winner) is on My Auctions with rows for `<listing_24>` and `<listing_25>`.

**Steps 11–12 setup:**

- customer A(signed in) bid on `<listing_23>`, which ended as follows: `<ending_state>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_29 | An open USD listing led by customer B, closing after `<listing_30>`; bind its identity only | · |
| listing_30 | An open USD listing customer A bid on, closing before `<listing_29>`; bind its identity only | · |
| current bid | USD5,460 | (range: 400000–799999 minor units) |
| increment | USD80 | (fixed tier increment), the USD4,000 tier |
| next minimum | USD5,540 | Fixed derived value: `<current bid>` plus `<increment>` |
| refused bid | USD5,460, equal to `<current bid>`, below `<next minimum>` | · |

| Field | Value |
| --- | --- |
| listing_29 url | The URL of `<listing_29>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 5–6 data:**

| `<operator_action>` | `<your_standing>` |
| --- | --- |
| Returned the proof | Won, Pending Payment |
| Confirmed the payment | Won, Processing |

| Field | Value |
| --- | --- |
| listing_28 | A listing won by this customer whose payment proof was under check; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 7–7 data:**

| Field | Value |
| --- | --- |
| listing_27 | customer A's won listing, proof under check; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 8–9 data:**

| `<order_state>` | `<your_standing>` |
| --- | --- |
| Delivery not yet set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |

| Field | Value |
| --- | --- |
| listing_26 | A listing won by this customer whose order has state `<order_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 10–10 data:**

| Field | Value |
| --- | --- |
| listing_24 | A won listing with invoice `paid` and fulfilment `unfulfilled`; bind its identity only |
| listing_25 | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation; bind its identity only |

**Steps 11–12 data:**

| `<ending_state>` | `<your_standing>` |
| --- | --- |
| Closed with customer B winning | Didn't win |
| Called off by Grade10 | Didn't win |

| Field | Value |
| --- | --- |
| listing_23 | A listing bid on by customer A, ended with `<ending_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

### Route

1. Type `<refused bid>` into the custom maximum on the bid panel.
   - `<listing_29>` still sits below `<listing_30>`, as before step 1. `g10.auction-account-record.US2-TC6`
2. Confirm the bid.
   - Step 2: the bid form says Minimum bid is `<next minimum>`. `g10.auction-account-record.US2-TC6`
3. Navigate to `<my auctions url>`.
4. Find `<listing_29>`'s row in the Active tab.
   - Step 4: Your Standing reads Outbid, with the next valid bid `<next minimum>`. `g10.auction-account-record.US2-TC6`
   - Current bid reads `<current bid>`. `g10.auction-account-record.US2-TC6`
   - No row reads Bid submitted or Bid not accepted. `g10.auction-account-record.US2-TC6`
5. Navigate to `<my auctions url>`.
6. Read `<listing_28>`'s row.
   - Your Standing reads `<your_standing>`. `g10.auction-account-record.US3-TC2`
7. As customer B, navigate to `<my auctions url>`.
   - No `<listing_27>` row shows. `g10.auction-account-record.US3-TC4`
8. Navigate to `<my auctions url>`.
9. Find `<listing_26>`'s row.
   - Your Standing reads `<your_standing>`. `g10.auction-account-record.US3-TC5`
   - The row offers View order. `g10.auction-account-record.US3-TC5`
10. Read Status on each row.
   - `<listing_24>` reads Preparing Shipment with the `default` status badge. `g10.auction-account-record.US3-TC20`
   - `<listing_25>` reads Shipped with the `default` status badge. `g10.auction-account-record.US3-TC20`
11. Navigate to `<my auctions url>`.
12. Select the Ended tab and find `<listing_23>`'s row.
   - Your Standing reads `<your_standing>`. `g10.auction-account-record.US4-TC1`
   - The row says the card was not charged. `g10.auction-account-record.US4-TC1`
   - No amount is shown as charged. `g10.auction-account-record.US4-TC1`

## Walk 3: Watch and bid from auction surfaces

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, not watching `<listing_22>`, no bid on `<listing_22>`) is on `<listing_22 url>`.

**Steps 4–5 setup:**

- customer(signed in, not watching `<listing_22>`, no bid on `<listing_22>`) is on `<grade10 auction catalogue url>`.

**Steps 6–8 setup:**

- customer A(signed in) watches `<listing_21>`.
- customer B(signed in, never watched or bid on `<listing_21>`) uses a separate session.

**Steps 9–11 setup:**

- customer(signed in, enrolled to bid, not watching `<listing_20>`, no bid on `<listing_20>`) is on `<listing_20 url>`.

**Steps 12–13 setup:**

- customer(signed in, enrolled to bid, watching `<listing_18>`, no bid on `<listing_18>`) is on `<listing_18 url>`.
- The collector also watches `<listing_19>` without bidding.

**Steps 14–17 setup:**

- customer(signed in, enrolled to bid, not watching `<listing_17>`, no bid on `<listing_17>`) is on `<listing_17 url>`.
- The account has this state: `<account_state>`.
- The title count on `<my auctions url>` is noted.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_22 | An open listing taking bids, not watched and not bid on by this collector; bind its identity only |
| listing_22 url | The URL of `<listing_22>`; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| listing_22 | An open listing taking bids, not watched and not bid on by this collector; bind its identity only |
| my auctions url | The My Auctions URL |
| grade10 auction catalogue url | The auction catalogue URL |

**Steps 6–8 data:**

| Field | Value |
| --- | --- |
| listing_21 | An open listing taking bids, watched by customer A only; bind its identity only |
| listing_21 url | The URL of `<listing_21>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| listing_20 | An open listing taking bids, with no bid from this collector and no other bidder; bind its identity only |
| first bid | The next valid bid shown on the bid panel |
| listing_20 url | The URL of `<listing_20>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 12–13 data:**

| Field | Value |
| --- | --- |
| listing_18 | An open listing taking bids, watched by this collector, closing after `<listing_19>`; bind its identity only |
| listing_19 | An open listing taking bids, watch-only for this collector, closing before `<listing_18>`; bind its identity only |
| first bid | The next valid bid shown on `<listing_18>`'s bid panel |
| listing_18 url | The URL of `<listing_18>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps 14–17 data:**

| `<account_state>` | `<typed bid>` | `<refusal_message>` | Fixture notes |
| --- | --- | --- | --- |
| Bidding allowed | USD140 | Minimum bid is `<opening price>` | `<typed bid>` is below `<opening price>` |
| Bidding suspended by an operator | USD280 | Bidding is suspended on this account. Contact Us to resolve it. | `<typed bid>` equals `<opening price>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_17 | An open USD listing with no bid from anyone; bind its identity only | · |
| opening price | USD280 | (range: 1000–79999 minor units), the starting price |

| Field | Value |
| --- | --- |
| listing_17 url | The URL of `<listing_17>`; bind its URL only |
| my auctions url | The My Auctions URL |

### Route

1. Click the Watch control.
   - Step 1: a toast says email alerts are on, with View My Auctions. `g10.auction-account-record.US5-TC1`
2. Click View My Auctions in the toast.
   - Step 2: My Auctions opens; the title count includes `<listing_22>`. `g10.auction-account-record.US5-TC1`
3. Find the `<listing_22>` row.
   - Step 3: `<listing_22>` shows once, with key image, title and close. `g10.auction-account-record.US5-TC1`
   - Step 3: Your Standing reads `--`. `g10.auction-account-record.US5-TC1`
   - Step 3: Email alerts switch is on; Unwatch is offered. `g10.auction-account-record.US5-TC1`
4. Click the watch control on `<listing_22>`'s card, bottom right of the image.
   - Step 4: the card's control reads Watching. `g10.auction-account-record.US5-TC2`
5. Navigate to `<my auctions url>`.
   - Step 5: `<listing_22>` shows once, Your Standing `--`, email alerts on. `g10.auction-account-record.US5-TC2`
6. As customer B, navigate to `<my auctions url>`.
   - Step 6: `<listing_21>` is not listed. `g10.auction-account-record.US5-TC3`
7. As customer B, navigate to `<listing_21 url>`.
   - Step 7: the control reads Watch; no watch count shows. `g10.auction-account-record.US5-TC3`
8. As customer B, open the page source of `<listing_21 url>`.
   - Step 8: no watch count and no watcher's identity appear. `g10.auction-account-record.US5-TC3`
9. Place `<first bid>` from the bid panel.
   - Step 9: one toast says email alerts are on. `g10.auction-account-record.US6-TC1`
10. Reload `<listing_20 url>`.
   - Step 10: no alerts toast shows. `g10.auction-account-record.US6-TC1`
11. Navigate to `<my auctions url>`.
   - Step 11: `<listing_20>` shows once, Your Standing Leading. `g10.auction-account-record.US6-TC1`
   - Step 11: Email alerts switch is on; no Unwatch is offered. `g10.auction-account-record.US6-TC1`
12. Place `<first bid>` from the bid panel.
13. Navigate to `<my auctions url>`.
   - `<listing_18>` shows once, Your Standing Leading, no Unwatch. `g10.auction-account-record.US6-TC2`
   - `<listing_18>` sits above `<listing_19>`: bid rows before watch-only. `g10.auction-account-record.US6-TC2`
14. Type `<typed bid>` into the custom maximum on the bid panel.
15. Confirm the bid.
   - Step 15: the bid form says `<refusal_message>`, and no alerts toast shows. `g10.auction-account-record.US6-TC3`
16. Reload `<listing_17 url>`.
   - Step 16: the watch control offers Watch, not locked to watching. `g10.auction-account-record.US6-TC3`
17. Navigate to `<my auctions url>`.
   - Step 17: `<listing_17>` is not listed in any tab. `g10.auction-account-record.US6-TC3`
   - Step 17: the title count is the one noted. `g10.auction-account-record.US6-TC3`

## Walk 4: Filter rows and read close results — phase 1

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in) watches `<listing_14>`, `<listing_15>` and `<listing_16>`.

**Steps 4–6 setup:**

- customer(signed in) watches `<listing_13>`, a listing whose bidding has not opened.

**Steps 7–8 setup:**

- customer(signed in) watches only open listings.

**Steps 9–11 setup:**

- customer(signed in) watches `<listing_12>`, a published listing that has closed.

**Steps 12–13 setup:**

- customer(winner) has a Won row for `<listing_11>` whose order `<winner_order_1>` is available.

**Steps 14–15 setup:**

- customer owns `<listing_10>`, whose order `<winner_order_2>` is Partially Paid.

**Steps 16–17 setup:**

- customer A(signed in) bid on `<listing_9>`, which closed with customer B winning.

**Steps 18–19 setup:**

- customer(signed in) has Won rows for `<listing_7>` and `<listing_8>`.

**Steps 20–21 setup:**

- customer(signed in) won `<listing_6>`, whose order has this state: `<order_state>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_14 | A published listing whose bidding has not opened; bind its identity only |
| listing_15 | A published listing whose bidding is open; bind its identity only |
| listing_16 | A published listing that has closed; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 4–6 data:**

| Field | Value |
| --- | --- |
| listing_13 | A published watched listing whose bidding has not opened and opens inside the test window; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| listing_12 | A published watched listing that has closed; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 12–13 data:**

| Field | Value |
| --- | --- |
| listing_11 | A listing won by this customer with an available winner order; bind its identity only |
| winner_order_1 | The winner order belonging to `<listing_11>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing won by this customer; bind its identity only |
| winner_order_2 | The Partially Paid winner order belonging to `<listing_10>`; bind its identity only |

**Steps 16–17 data:**

| Field | Value |
| --- | --- |
| listing_9 | A closed listing won by customer B; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 18–19 data:**

| Field | Value |
| --- | --- |
| listing_7 | A won listing whose order reads Payment Overdue; bind its identity only |
| listing_8 | A won listing whose order reads Awaiting Setup inside the setup window; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 20–21 data:**

| `<order_state>` | `<your_standing>` | `<excluded_standing>` |
| --- | --- | --- |
| Setup deadline (48 hours from close) passed, setup incomplete | Won, Setup Overdue | Awaiting Setup |
| Payment deadline (7 days from invoice send) passed, unpaid | Won, Payment Overdue | Pending Payment |

| Field | Value |
| --- | --- |
| listing_6 | A listing won by this customer whose order has state `<order_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

### Route

1. Navigate to `<my auctions url>`.
   - Step 1 shows the Active tab, listing only `<listing_15>`. `g10.auction-account-record.US7-TC1`
2. Open the Upcoming tab.
   - Step 2 lists only `<listing_14>`; step 3 lists only `<listing_16>`. `g10.auction-account-record.US7-TC1`
3. Open the Ended tab.
   - Title badge shows 3. `g10.auction-account-record.US7-TC1`
4. Navigate to `<my auctions url>`.
5. Wait until `<listing_13>` bidding opens.
6. Reload `<my auctions url>`.
   - `<listing_13>` is listed in the Active tab. `g10.auction-account-record.US7-TC2`
   - `<listing_13>` is not listed in the Upcoming tab. `g10.auction-account-record.US7-TC2`
7. Navigate to `<my auctions url>`.
8. Open the Upcoming tab.
   - The Upcoming tab shows its no-listings empty state. `g10.auction-account-record.US7-TC3`
9. Navigate to `<my auctions url>`.
10. Open the Ended tab.
11. Click the Email alerts control on `<listing_12>`.
   - The Email alerts control is disabled. `g10.auction-account-record.US7-TC4`
   - The alert setting for `<listing_12>` is unchanged. `g10.auction-account-record.US7-TC4`
12. Navigate to `<my auctions url>`.
13. Select the order entry point on `<listing_11>`'s Won row.
   - The matching order `<winner_order_1>` opens. `g10.auction-account-record.US7-TC5`
   - My Auctions performs no payment, address, or order-status write. `g10.auction-account-record.US7-TC5`
14. Open My Auctions and read `<listing_10>`'s Won row.
15. Select View order.
   - The row status is Partially Paid with its warning treatment. `g10.auction-account-record.US8-TC1`
   - View order opens `<winner_order_2>`, the Partially Paid Winner Order. `g10.auction-account-record.US8-TC1`
16. Navigate to `<my auctions url>`.
17. Read `<listing_9>`'s row.
   - Your Standing reads Didn't win, and the row says the card was not charged. `g10.auction-account-record.US8-TC2`
   - No View order is offered. `g10.auction-account-record.US8-TC2`
18. Navigate to `<my auctions url>`.
19. Read `<listing_7>` and `<listing_8>`'s rows.
   - `<listing_7>` reads Won, Payment Overdue, and offers View order. `g10.auction-account-record.US8-TC3`
   - `<listing_7>` has no helper line and no way to reach Grade10 on the row. `g10.auction-account-record.US8-TC3`
   - `<listing_8>` reads Won, Awaiting Setup, and offers View order. `g10.auction-account-record.US8-TC3`
   - `<listing_8>` has no confirm-address helper line on the row. `g10.auction-account-record.US8-TC3`
20. Navigate to `<my auctions url>`.
21. Read `<listing_6>`'s row.
   - Your Standing reads `<your_standing>`, never `<excluded_standing>`. `g10.auction-account-record.US9-TC1`
   - The row offers View order. `g10.auction-account-record.US9-TC1`
   - Listing, close and current bid read as on any Won row. `g10.auction-account-record.US9-TC1`

## Walk 5: Filter rows and read close results — phase 2

**Starting state:**

**Steps 1–5 setup:**

- customer A(signed in) leads `<listing_5>`.
- `<listing_5>`'s close has passed, and recording it is held back.

**Steps 6–7 setup:**

- customer B(signed in) bid `<customer B bid>` on `<listing_4>`.
- customer A has since raised `<listing_4>`'s current bid to `<current bid>`.

**Shared test data:**

**Steps 1–5 data:**

| Field | Value |
| --- | --- |
| listing_5 | A USD listing led by customer A, its close passed and not yet recorded; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps 6–7 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_4 | An open USD listing, its close more than an hour away; bind its identity only | · |
| customer B bid | 100000 USD minor units | · |
| current bid | 120000 USD minor units | above `<customer B bid>` |

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

### Route

1. Navigate to `<my auctions url>`.
2. Find `<listing_5>`'s row and read its tab and Your Standing.
   - At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win. `g10.auction-account-record.US10-TC2`
3. Let recording the close resume.
4. Reload `<my auctions url>`.
5. Find `<listing_5>`'s row and read Your Standing.
   - At step 5 the row is in the Ended tab and Your Standing reads Won. `g10.auction-account-record.US10-TC2`
6. As customer B, navigate to `<my auctions url>`.
7. Find `<listing_4>`'s row in the Active tab.
   - Current bid reads `<current bid>`, not `<customer B bid>`. `g10.auction-account-record.US10-TC3`
   - Your Standing reads Outbid, with the next valid bid. `g10.auction-account-record.US10-TC3`

## g10.auction-account-record.US1: Mark a listing now and find it again later

**As a** collector,
**I want** to watch listings I am interested in before bidding opens,
**so that** I can find them again when it does without searching the catalogue a second time.

<!-- trace:case id=g10.auction-account-record.TC-3pj rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
### g10.auction-account-record.US1-TC1: A listing watched before it opens is found when it opens

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
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) is on `<listing_43 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_43 | A published listing whose bidding has not started, scheduled to open inside the test window; bind its identity only |
| listing_43 url | The URL of `<listing_43>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Click the Watch control.
2. Navigate to `<my auctions url>`.
3. Wait until `<listing_43>`'s bidding starts, then reload `<my auctions url>`.
4. Click `<listing_43>`'s row.

**Expected Results:**

* Step 2: `<listing_43>` shows once, Your Standing `--`.
* Step 3: `<listing_43>` is still listed.
* Step 4: `<listing_43 url>` opens, taking bids.

<!-- trace:case id=g10.auction-account-record.TC-s25 rev=2 -->
### g10.auction-account-record.US1-TC2: My Auctions orders bid rows, then watch-only, then closed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) has bookmarked every listing in **Test data**, and nothing else.

**Test data:**

| Listing | Bookmark | Close |
| --- | --- | --- |
| listing_38 | Bid | Open, closes in 3 days |
| listing_39 | Bid | Open, closes in 1 day |
| listing_40 | Watch only | Open, closes in 2 days |
| listing_41 | Watch only | Open, closes in 5 hours |
| listing_42 | Watch only | Closed yesterday |

| Field | Value |
| --- | --- |
| listing_38 | A listing with Bid for this customer; Open, closes in 3 days; bind its identity only |
| listing_39 | A listing with Bid for this customer; Open, closes in 1 day; bind its identity only |
| listing_40 | A listing with Watch only for this customer; Open, closes in 2 days; bind its identity only |
| listing_41 | A listing with Watch only for this customer; Open, closes in 5 hours; bind its identity only |
| listing_42 | A listing with Watch only for this customer; Closed yesterday; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.

**Expected Results:**

* The title count reads 5.
* Rows read, top down: `<listing_39>`, `<listing_38>`, `<listing_41>`, `<listing_40>`, `<listing_42>`.
* Each listing shows once.

<!-- trace:case id=g10.auction-account-record.TC-wtn rev=2 -->
### g10.auction-account-record.US1-TC3: Nothing bookmarked is an empty state that offers the catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, has never watched or bid on a listing).

**Test data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Click the catalogue offer.

**Expected Results:**

* Step 1: the page says nothing is bookmarked; no error shows.
* Step 2: the auction catalogue opens.

<!-- trace:case id=g10.auction-account-record.TC-5jj rev=2 -->
### g10.auction-account-record.US1-TC4: A failed read says so and retries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_37>`.
* The My Auctions read is mocked to fail once, then succeed.

**Test data:**

| Field | Value |
| --- | --- |
| listing_37 | An open listing taking bids, watched by this collector; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Click retry.

**Expected Results:**

* Step 1: the page says the read failed; it does not read as empty.
* Step 1: no catalogue offer shows.
* Step 2: `<listing_37>` is listed.

<!-- trace:case id=g10.auction-account-record.TC-2c9 rev=2 -->
### g10.auction-account-record.US1-TC5: Signed-out visitor is asked to sign in and returned

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
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed out) has watched listings under their account.

**Test data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Complete sign-in from the offer.

**Expected Results:**

* Step 1: sign-in is offered; no bookmarked listing shows.
* Step 2: the collector returns to My Auctions, showing their own listings.

---

## g10.auction-account-record.US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

<!-- trace:case id=g10.auction-account-record.TC-gj0 rev=3 -->
### g10.auction-account-record.US2-TC1: Your Standing reads each open-listing_35 state

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
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) has bid on `<listing_35>`, with this state: `<listing_state>`.

**Test data:**

| `<listing_state>` | `<your_standing>` |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

| Field | Value |
| --- | --- |
| listing_35 | An open listing bid on by customer A, with state `<listing_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<listing_35>`'s row.

**Expected Results:**

* Your Standing reads `<your_standing>`.
* Current bid reads `<listing_35>`'s current bid.
* For Outbid, the next valid bid equals current bid plus its increment.

<!-- trace:case id=g10.auction-account-record.TC-oi7 rev=2 -->
### g10.auction-account-record.US2-TC2: Being outbid moves the row from Leading to Outbid

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
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_34>` and is on `<my auctions url>`.
* customer B(signed in, enrolled to bid) is on `<listing_34 url>` in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_34 | An open listing taking bids, led by customer A with no maximum above the current bid; bind its identity only |
| customer B bid | The next valid bid shown on customer B's bid panel |
| listing_34 url | The URL of `<listing_34>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. As customer A, reload `<my auctions url>`.

**Expected Results:**

* `<listing_34>` reads Outbid, with the next valid bid.
* Current bid reads `<customer B bid>`.

<!-- trace:case id=g10.auction-account-record.TC-nv4 rev=2 -->
### g10.auction-account-record.US2-TC3: A value that could not refresh is marked not current

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) has bid on `<listing_33>` and is on `<my auctions url>`.
* The refresh of `<listing_33>`'s bid and close is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| listing_33 | An open listing taking bids, bid on by customer A; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Wait for the next refresh of `<listing_33>`'s row.

**Expected Results:**

* `<listing_33>`'s current bid and close are shown as not current.

<!-- trace:case id=g10.auction-account-record.TC-w62 rev=3 covers=g10.auction-account-record.SC-dsc -->
### g10.auction-account-record.US2-TC4: A refused raise leaves the row's Standing as it was

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) holds maximum `<customer A maximum>` and standing `<your_standing>` for `<listing_31>`, with state `<listing_state>`, current bid `<current bid>` and minimum next bid `<minimum next bid>`, and is on `<listing_31 url>`.

**Test data:**

| `<listing_state>` | `<customer A maximum>` | `<current bid>` | `<minimum next bid>` | `<refused raise>` | `<your_standing>` |
| --- | --- | --- | --- | --- | --- |
| Open, customer B leads | 25000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Outbid, with the next valid bid |
| Open, customer A leads at 30000 USD minor units | 30000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Leading |

| Field | Value |
| --- | --- |
| listing_31 | An open USD listing taking bids; bind its identity only |
| listing_31 url | The URL of `<listing_31>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Place `<refused raise>`.
2. Note `<listing_31>`'s current bid on its page.
3. Navigate to `<my auctions url>`.
4. Find `<listing_31>`'s row.

**Expected Results:**

* Step 1 shows the refusal on the bid panel.
* Your Standing reads `<your_standing>`.
* Current bid reads the bid noted at step 2, still `<current bid>`, never `<refused raise>`.

<!-- trace:case id=g10.auction-account-record.TC-na3 rev=2 -->
### g10.auction-account-record.US2-TC5: A refused first bid adds no row

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) has neither watched nor bid on `<listing_31>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_31 | An open USD listing taking bids; bind its identity only |
| low bid | One minor unit below the next valid bid shown on customer A's bid panel |
| listing_31 url | The URL of `<listing_31>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>` and note the title count.
2. Navigate to `<listing_31 url>` and place `<low bid>`.
3. Navigate to `<my auctions url>`.
4. Open the Active, Upcoming and Ended tabs in turn.

**Expected Results:**

* Step 2 shows the refusal on the bid panel.
* No tab holds a row for `<listing_31>`.
* The title count equals the count noted at step 1.

<!-- trace:case id=g10.auction-account-record.TC-8mz rev=2 -->
### g10.auction-account-record.US2-TC6: An Outbid bidder's refused bid leaves their row Outbid and in place

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) bid on `<listing_29>` and `<listing_30>`, and customer B has since outbid them on `<listing_29>`.
* customer A is on `<listing_29 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_29 | An open USD listing led by customer B, closing after `<listing_30>`; bind its identity only | · |
| listing_30 | An open USD listing customer A bid on, closing before `<listing_29>`; bind its identity only | · |
| current bid | USD5,460 | (range: 400000–799999 minor units) |
| increment | USD80 | (fixed tier increment), the USD4,000 tier |
| next minimum | USD5,540 | Fixed derived value: `<current bid>` plus `<increment>` |
| refused bid | USD5,460, equal to `<current bid>`, below `<next minimum>` | · |

| Field | Value |
| --- | --- |
| listing_29 url | The URL of `<listing_29>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Type `<refused bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to `<my auctions url>`.
4. Find `<listing_29>`'s row in the Active tab.

**Expected Results:**

* Step 2: the bid form says Minimum bid is `<next minimum>`.
* Step 4: Your Standing reads Outbid, with the next valid bid `<next minimum>`.
* Current bid reads `<current bid>`.
* `<listing_29>` still sits below `<listing_30>`, as before step 1.
* No row reads Bid submitted or Bid not accepted.

---

## g10.auction-account-record.US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the listing shipped.

<!-- trace:case id=g10.auction-account-record.TC-hj7 rev=2 -->
### g10.auction-account-record.US3-TC2: A Won row follows the proof check's outcome

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
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(signed in) won `<listing_28>`, whose proof was under check.
* An operator then took this action: `<operator_action>`.

**Test data:**

| `<operator_action>` | `<your_standing>` |
| --- | --- |
| Returned the proof | Won, Pending Payment |
| Confirmed the payment | Won, Processing |

| Field | Value |
| --- | --- |
| listing_28 | A listing won by this customer whose payment proof was under check; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<listing_28>`'s row.

**Expected Results:**

* Your Standing reads `<your_standing>`.

<!-- trace:case id=g10.auction-account-record.TC-wt4 rev=2 -->
### g10.auction-account-record.US3-TC4: Another collector never sees a Payment Verifying row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A won `<listing_27>`, which reads Payment Verifying.
* customer B(signed in) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_27 | customer A's won listing, proof under check; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.

**Expected Results:**

* No `<listing_27>` row shows.

<!-- trace:case id=g10.auction-account-record.TC-83f rev=2 -->
### g10.auction-account-record.US3-TC5: A Won row reads its order's status

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
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_26>`, whose order has this state: `<order_state>`.

**Test data:**

| `<order_state>` | `<your_standing>` |
| --- | --- |
| Delivery not yet set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |

| Field | Value |
| --- | --- |
| listing_26 | A listing won by this customer whose order has state `<order_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<listing_26>`'s row.

**Expected Results:**

* Your Standing reads `<your_standing>`.
* The row offers View order.

<!-- trace:case id=g10.auction-account-record.TC-lvl rev=2 -->
### g10.auction-account-record.US3-TC20: Won-row status follows payment and fulfilment state

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
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(winner) is on My Auctions with rows for `<listing_24>` and `<listing_25>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_24 | A won listing with invoice `paid` and fulfilment `unfulfilled`; bind its identity only |
| listing_25 | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation; bind its identity only |

**Steps:**

1. Read Status on each row.

**Expected Results:**

* `<listing_24>` reads Preparing Shipment with the `default` status badge.
* `<listing_25>` reads Shipped with the `default` status badge.

<!-- trace:case id=g10.auction-account-record.TC-now rev=2 -->
### g10.auction-account-record.US3-TC23: Shipped Won row keeps the default badge

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner) is on My Auctions with `<won_shipped>`.

**Test data:**

| Field | Value |
| --- | --- |
| <won_shipped> | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |

**Steps:**

1. Read Status on that row.

**Expected Results:**

* Status reads Shipped.
* Status badge uses `default`.

---

## g10.auction-account-record.US4: Know I was not charged when I lose

**As a** losing bidder,
**I want** to see that my card was not charged,
**so that** I know I owe nothing for a listing I did not win.

<!-- trace:case id=g10.auction-account-record.TC-rfz rev=3 -->
### g10.auction-account-record.US4-TC1: Didn't win says the card was not charged

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
* **Trace:** grade10-site-auction-account-record-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) bid on `<listing_23>`, which ended as follows: `<ending_state>`.

**Test data:**

| `<ending_state>` | `<your_standing>` |
| --- | --- |
| Closed with customer B winning | Didn't win |
| Called off by Grade10 | Didn't win |

| Field | Value |
| --- | --- |
| listing_23 | A listing bid on by customer A, ended with `<ending_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the Ended tab and find `<listing_23>`'s row.

**Expected Results:**

* Your Standing reads `<your_standing>`.
* The row says the card was not charged.
* No amount is shown as charged.

---

## g10.auction-account-record.US5: Watch from the auction with alerts toast

**As a** collector,
**I want** watching a listing from its page to put it on My Auctions and tell me alerts are on,
**so that** I can open My Auctions from the toast when I want to manage it.

<!-- trace:case id=g10.auction-account-record.TC-7pb rev=2 -->
### g10.auction-account-record.US5-TC1: Watched listing lands on My Auctions as watch-only

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
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, not watching `<listing_22>`, no bid on `<listing_22>`) is on `<listing_22 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_22 | An open listing taking bids, not watched and not bid on by this collector; bind its identity only |
| listing_22 url | The URL of `<listing_22>`; bind its URL only |

**Steps:**

1. Click the Watch control.
2. Click View My Auctions in the toast.
3. Find the `<listing_22>` row.

**Expected Results:**

* Step 1: a toast says email alerts are on, with View My Auctions.
* Step 2: My Auctions opens; the title count includes `<listing_22>`.
* Step 3: `<listing_22>` shows once, with key image, title and close.
* Step 3: Your Standing reads `--`.
* Step 3: Email alerts switch is on; Unwatch is offered.

<!-- trace:case id=g10.auction-account-record.TC-tzp rev=2 -->
### g10.auction-account-record.US5-TC2: Watching from the catalogue card lands on My Auctions

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
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, not watching `<listing_22>`, no bid on `<listing_22>`) is on `<grade10 auction catalogue url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_22 | An open listing taking bids, not watched and not bid on by this collector; bind its identity only |
| my auctions url | The My Auctions URL |
| grade10 auction catalogue url | The auction catalogue URL |

**Steps:**

1. Click the watch control on `<listing_22>`'s card, bottom right of the image.
2. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 1: the card's control reads Watching.
* Step 2: `<listing_22>` shows once, Your Standing `--`, email alerts on.

<!-- trace:case id=g10.auction-account-record.TC-sse rev=2 -->
### g10.auction-account-record.US5-TC3: A watch is seen only by its owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) watches `<listing_21>`.
* customer B(signed in, never watched or bid on `<listing_21>`) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_21 | An open listing taking bids, watched by customer A only; bind its identity only |
| listing_21 url | The URL of `<listing_21>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.
2. As customer B, navigate to `<listing_21 url>`.
3. As customer B, open the page source of `<listing_21 url>`.

**Expected Results:**

* Step 1: `<listing_21>` is not listed.
* Step 2: the control reads Watch; no watch count shows.
* Step 3: no watch count and no watcher's identity appear.

---

## g10.auction-account-record.US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a listing to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

<!-- trace:case id=g10.auction-account-record.TC-l63 rev=2 -->
### g10.auction-account-record.US6-TC1: First bid puts the listing on My Auctions without a Watch

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
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching `<listing_20>`, no bid on `<listing_20>`) is on `<listing_20 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_20 | An open listing taking bids, with no bid from this collector and no other bidder; bind its identity only |
| first bid | The next valid bid shown on the bid panel |
| listing_20 url | The URL of `<listing_20>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Reload `<listing_20 url>`.
3. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 1: one toast says email alerts are on.
* Step 2: no alerts toast shows.
* Step 3: `<listing_20>` shows once, Your Standing Leading.
* Step 3: Email alerts switch is on; no Unwatch is offered.

<!-- trace:case id=g10.auction-account-record.TC-9rb rev=2 -->
### g10.auction-account-record.US6-TC2: Bidding on a watched listing keeps one row

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
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, enrolled to bid, watching `<listing_18>`, no bid on `<listing_18>`) is on `<listing_18 url>`.
* The collector also watches `<listing_19>` without bidding.

**Test data:**

| Field | Value |
| --- | --- |
| listing_18 | An open listing taking bids, watched by this collector, closing after `<listing_19>`; bind its identity only |
| listing_19 | An open listing taking bids, watch-only for this collector, closing before `<listing_18>`; bind its identity only |
| first bid | The next valid bid shown on `<listing_18>`'s bid panel |
| listing_18 url | The URL of `<listing_18>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Navigate to `<my auctions url>`.

**Expected Results:**

* `<listing_18>` shows once, Your Standing Leading, no Unwatch.
* `<listing_18>` sits above `<listing_19>`: bid rows before watch-only.

<!-- trace:case id=g10.auction-account-record.TC-43z rev=2 -->
### g10.auction-account-record.US6-TC3: A refused first bid puts nothing on My Auctions

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
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching `<listing_17>`, no bid on `<listing_17>`) is on `<listing_17 url>`.
* The account has this state: `<account_state>`.
* The title count on `<my auctions url>` is noted.

**Test data:**

| `<account_state>` | `<typed bid>` | `<refusal_message>` | Fixture notes |
| --- | --- | --- | --- |
| Bidding allowed | USD140 | Minimum bid is `<opening price>` | `<typed bid>` is below `<opening price>` |
| Bidding suspended by an operator | USD280 | Bidding is suspended on this account. Contact Us to resolve it. | `<typed bid>` equals `<opening price>` |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_17 | An open USD listing with no bid from anyone; bind its identity only | · |
| opening price | USD280 | (range: 1000–79999 minor units), the starting price |

| Field | Value |
| --- | --- |
| listing_17 url | The URL of `<listing_17>`; bind its URL only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Type `<typed bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Reload `<listing_17 url>`.
4. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 2: the bid form says `<refusal_message>`, and no alerts toast shows.
* Step 3: the watch control offers Watch, not locked to watching.
* Step 4: `<listing_17>` is not listed in any tab.
* Step 4: the title count is the one noted.

---

## g10.auction-account-record.US7: Collector reads My Auctions by bidding window

**As a** collector
**I want** my listings split into Active, Upcoming and Ended tabs
**so that** I see what needs me now without scrolling past closed and unopened listings.

<!-- trace:case id=g10.auction-account-record.TC-91p rev=2 -->
### g10.auction-account-record.US7-TC1: Each listing sits in the tab its bidding window names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_14>`, `<listing_15>` and `<listing_16>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | A published listing whose bidding has not opened; bind its identity only |
| listing_15 | A published listing whose bidding is open; bind its identity only |
| listing_16 | A published listing that has closed; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Open the Upcoming tab.
3. Open the Ended tab.

**Expected Results:**

* Step 1 shows the Active tab, listing only `<listing_15>`.
* Title badge shows 3.
* Step 2 lists only `<listing_14>`; step 3 lists only `<listing_16>`.

<!-- trace:case id=g10.auction-account-record.TC-z0b rev=2 -->
### g10.auction-account-record.US7-TC2: A listing moves to Active when its window opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_13>`, a listing whose bidding has not opened.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | A published watched listing whose bidding has not opened and opens inside the test window; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Wait until `<listing_13>` bidding opens.
3. Reload `<my auctions url>`.

**Expected Results:**

* `<listing_13>` is listed in the Active tab.
* `<listing_13>` is not listed in the Upcoming tab.

<!-- trace:case id=g10.auction-account-record.TC-tbh rev=2 -->
### g10.auction-account-record.US7-TC3: An empty tab says it has no listings

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches only open listings.

**Test data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Open the Upcoming tab.

**Expected Results:**

* The Upcoming tab shows its no-listings empty state.

<!-- trace:case id=g10.auction-account-record.TC-tzc rev=2 -->
### g10.auction-account-record.US7-TC4: Email alerts cannot be changed on an Ended row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_12>`, a published listing that has closed.

**Test data:**

| Field | Value |
| --- | --- |
| listing_12 | A published watched listing that has closed; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Open the Ended tab.
3. Click the Email alerts control on `<listing_12>`.

**Expected Results:**

* The Email alerts control is disabled.
* The alert setting for `<listing_12>` is unchanged.

<!-- trace:case id=g10.auction-account-record.TC-6xk rev=2 -->
### g10.auction-account-record.US7-TC5: A Won row opens its auction order

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
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(winner) has a Won row for `<listing_11>` whose order `<winner_order_1>` is available.

**Test data:**

| Field | Value |
| --- | --- |
| listing_11 | A listing won by this customer with an available winner order; bind its identity only |
| winner_order_1 | The winner order belonging to `<listing_11>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the order entry point on `<listing_11>`'s Won row.

**Expected Results:**

* The matching order `<winner_order_1>` opens.
* My Auctions performs no payment, address, or order-status write.

---

## g10.auction-account-record.US8: Winner revisits a partially paid order

**As a** winner with an order being collected in parts,
**I want** My Auctions to keep the Won row linked to the order,
**so that** I can return to the locked payment record.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=2 -->
### g10.auction-account-record.US8-TC1: A partially paid Won row opens Winner Order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer owns `<listing_10>`, whose order `<winner_order_2>` is Partially Paid.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing won by this customer; bind its identity only |
| winner_order_2 | The Partially Paid winner order belonging to `<listing_10>`; bind its identity only |

**Steps:**

1. Open My Auctions and read `<listing_10>`'s Won row.
2. Select View order.

**Expected Results:**

* The row status is Partially Paid with its warning treatment.
* View order opens `<winner_order_2>`, the Partially Paid Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=3 -->
### g10.auction-account-record.US8-TC2: A Didn't win row offers no View order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) bid on `<listing_9>`, which closed with customer B winning.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | A closed listing won by customer B; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<listing_9>`'s row.

**Expected Results:**

* Your Standing reads Didn't win, and the row says the card was not charged.
* No View order is offered.

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=2 -->
### g10.auction-account-record.US8-TC3: A Won row carries no status-specific contact helper

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) has Won rows for `<listing_7>` and `<listing_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | A won listing whose order reads Payment Overdue; bind its identity only |
| listing_8 | A won listing whose order reads Awaiting Setup inside the setup window; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<listing_7>` and `<listing_8>`'s rows.

**Expected Results:**

* `<listing_7>` reads Won, Payment Overdue, and offers View order.
* `<listing_7>` has no helper line and no way to reach Grade10 on the row.
* `<listing_8>` reads Won, Awaiting Setup, and offers View order.
* `<listing_8>` has no confirm-address helper line on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=2 -->
### g10.auction-account-record.US8-TC4: An Awaiting Setup row carries no confirm-address helper

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* customer(signed in) won `<lot_11>`, whose setup is incomplete inside the setup window.

**Test data:**

| Field | Value |
| --- | --- |
| lot_11 | A won lot whose order reads Awaiting Setup |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot_11>`'s row.

**Expected Results:**

* Your Standing reads Won, Awaiting Setup, with View order.
* No confirm-address helper line shows on the row.

---

## g10.auction-account-record.US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won listings to read Setup Overdue or Payment Overdue in Status,
**so that** I can tell closed self-service from listings still inside their window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=2 -->
### g10.auction-account-record.US9-TC1: Overdue won listings read Setup Overdue or Payment Overdue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_6>`, whose order has this state: `<order_state>`.

**Test data:**

| `<order_state>` | `<your_standing>` | `<excluded_standing>` |
| --- | --- | --- |
| Setup deadline (48 hours from close) passed, setup incomplete | Won, Setup Overdue | Awaiting Setup |
| Payment deadline (7 days from invoice send) passed, unpaid | Won, Payment Overdue | Pending Payment |

| Field | Value |
| --- | --- |
| listing_6 | A listing won by this customer whose order has state `<order_state>`; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<listing_6>`'s row.

**Expected Results:**

* Your Standing reads `<your_standing>`, never `<excluded_standing>`.
* The row offers View order.
* Listing, close and current bid read as on any Won row.

---

## g10.auction-account-record.US10: Bidder reads each listing's price and result on My Auctions

**As a** bidder,
**I want** each listing I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a listing sold for and whether I lost it without opening the listing.

<!-- trace:case id=g10.auction-account-record.TC-p3p rev=2 -->
### g10.auction-account-record.US10-TC2: Row shows no result before the close is recorded

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
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_5>`.
* `<listing_5>`'s close has passed, and recording it is held back.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A USD listing led by customer A, its close passed and not yet recorded; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<listing_5>`'s row and read its tab and Your Standing.
3. Let recording the close resume.
4. Reload `<my auctions url>`.
5. Find `<listing_5>`'s row and read Your Standing.

**Expected Results:**

* At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win.
* At step 5 the row is in the Ended tab and Your Standing reads Won.

<!-- trace:case id=g10.auction-account-record.TC-y6p rev=3 covers=g10.auction-account-record.SC-fao -->
### g10.auction-account-record.US10-TC3: Open row shows the auction's current price, not the collector's bid

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
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`

**Pre-conditions:**

* customer B(signed in) bid `<customer B bid>` on `<listing_4>`.
* customer A has since raised `<listing_4>`'s current bid to `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_4 | An open USD listing, its close more than an hour away; bind its identity only | · |
| customer B bid | 100000 USD minor units | · |
| current bid | 120000 USD minor units | above `<customer B bid>` |

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.
2. Find `<listing_4>`'s row in the Active tab.

**Expected Results:**

* Current bid reads `<current bid>`, not `<customer B bid>`.
* Your Standing reads Outbid, with the next valid bid.

<!-- trace:case id=g10.auction-account-record.TC-j99 rev=2 -->
### g10.auction-account-record.US10-TC1: Ended row shows the final price and the recorded result

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
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* `<lot_1>` closed, its close recorded, customer A winning at `<final price>`.
* customer B's last bid on `<lot_1>` was `<customer B bid>`.
* `<viewer>` is signed in.

**Test data:**

| `<viewer>` | `<own last bid>` | `<standing>` |
| --- | --- | --- |
| customer A | `<customer A maximum>` | Won |
| customer B | `<customer B bid>` | Didn't win |

| Field | Value |
| --- | --- |
| `<lot_1>` | A closed USD lot both customers bid on |
| `<final price>` | 513000 minor units, `<customer B bid>` plus its 8000 increment |
| `<customer A maximum>` | 800000 minor units, above `<final price>` |
| `<customer B bid>` | 505000 minor units, customer B's maximum, below `<final price>` |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the Ended tab.
3. Find `<lot_1>`'s row.

**Expected Results:**

* Current bid reads `<final price>`, not `<own last bid>`.
* Your Standing reads `<standing>`.

<!-- trace:case id=g10.auction-account-record.TC-hgl rev=2 -->
### g10.auction-account-record.US10-TC4: Lone first bid confirming after the close reads Didn't win on an unsold lot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* Bid-time card holds are on.
* `<lot_4>` has no bid, and its scheduled close is under a minute away.
* customer B(signed in) placed `<first bid>` on `<lot_4>`, and its payment confirmation is held back.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A USD lot with a starting price of 20000 minor units and no bid |
| `<first bid>` | 20000 minor units, the opening price |

**Steps:**

1. Wait until `<lot_4>`'s scheduled close has passed and its close is recorded.
2. Let the payment confirmation resume.
3. Navigate to `<my auctions url>`.
4. Select the Ended tab and find `<lot_4>`'s row.

**Expected Results:**

* The row is in the Ended tab, and Your Standing reads Didn't win.
* The row says the card hold is releasing or released, never charged.
* Current bid reads as on any unsold lot's row, not `<first bid>`.

---

## Settled

- `grade10-site-auction-account-record-US3-TC1` and `grade10-site-auction-account-record-US3-TC3` are held by `grade10-site-auction-account-record-US3-TC5`, whose rows read each won status.
- The Won-row control label (View order or Open order) is design copy; either reads as the entry to Winner Order.
- My Auctions carries the mixed standing and order-state values in Status, including Setup Overdue and Payment Overdue.
- Contact for expired payment is Winner Order only (author @tangconst).
- Didn't win says the card was not charged; no hold copy remains.
- Your Standing on an open lot is Leading or Outbid; Bid submitted and Bid not accepted are gone, and a refused bid changes no row.
- Archived cases from `2026-09-16-revise-auction-winner-invoicing` (`grade10-site-auction-account-record-US8-TC3-1`, `grade10-site-auction-account-record-US8-TC4-1`) are represented by survivor `g10.auction-account-record.US8-TC3`; the duplicate `US8-TC4` is deprecated.
- Archived cases from `2026-09-18-add-winner-bank-transfer` (`grade10-site-auction-account-record-US3-TC2-1`, `grade10-site-auction-account-record-US3-TC4-1`) are represented by `g10.auction-account-record.US3-TC2` and `g10.auction-account-record.US3-TC4`.
- Archived case `grade10-site-auction-account-record-US9-TC1-1` from `2026-09-24-add-auction-overdue-order-status` is represented by `g10.auction-account-record.US9-TC1`.
- Archived cases from `2026-09-30-add-my-auction-orders` (`grade10-site-auction-account-record-US7-TC1-1`, `grade10-site-auction-account-record-US7-TC2-1`, `grade10-site-auction-account-record-US7-TC3-1`, `grade10-site-auction-account-record-US7-TC4-1`, `grade10-site-auction-account-record-US7-TC5-1`) are represented by `g10.auction-account-record.US7-TC1` through `g10.auction-account-record.US7-TC5`.
- Draft `US3-TC20` absorbs `US3-TC23` as a two-row payment and fulfilment matrix; both rows retain their status assertions and `US3-TC23` is deprecated.
- Draft `US8-TC3` absorbs `US8-TC4` as a two-row status-helper matrix; both rows retain their status assertions and `US8-TC4` is deprecated.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The Won row remains linked while collection is partial | **Folded in:** `grade10-site-auction-account-record-SC-62` |

**Run:** QA2 rerun, 2026-10-01. QA1's blind pass read the frozen Purpose and Feature set, the change's journeys, `proposal.md`, `decisions.md` with its `## Raised`, the linked pages under `docs/prds/`, `openspec/config.yaml`'s context, the durable suite and the change's domain draft with their `## Reconciliation` stripped; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both readings, the delta, `tech-design.md`, `tasks.md`, and the built My Auctions row mapping in grade10 for reference. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Ended row shows the final price, not the viewer's own bid, with Won or Didn't win (`grade10-site-auction-account-record-US10-TC1-1`, deprecated by QA1 for the domain walk) | **Rejected:** a second walk of the domain case below |
| Before the close is recorded the row reads no result; after it, Won (`grade10-site-auction-account-record-US10-TC2-1`) | **Folded in:** `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-67` |
| QA1 raised: which tab holds the row between the effective and the recorded close, and what Your Standing reads | **Settled by the artifacts:** the open-standing requirement and `grade10-site-auction-account-record-SC-65` - Active tab, the open Status kept, no minimum next valid bid, never Ending soon. TC2-1 patched to assert it; `<v>` kept, the case still draft |
| Open row shows the auction's current price, not the collector's bid (`grade10-site-auction-account-record-US10-TC3-1`) | **Folded in:** `grade10-site-auction-account-record-SC-64` |
| QA1 raised: a lone first bid confirming after the scheduled close - the row's standing | **Settled by the artifacts:** after the close the row reads exactly Won or Didn't win from the recorded result; nobody won, so Didn't win. New case `grade10-site-auction-account-record-US10-TC4-1`, since deprecated: no bid takes a hold to confirm after the close |
| QA1 raised: the same row's Current bid on a lot that closed unsold | **Settled:** Q32 - the row reads as any unsold lot's row, with no new copy; `grade10-site-auction-account-record-US10-TC4-1` asserted it and is deprecated |
| Outbid row past the effective close, before the close is recorded | **Rejected as a scenario:** the requirement already states it (open Status kept, no minimum next valid bid); no blind case asserts it apart from Leading |
| Open-window statuses Leading and Outbid, and Won or Didn't win after the close | **Out of suite:** they serve the context journey `grade10-site-auction-account-record-US-02`; the durable suite's `grade10-site-auction-account-record-US2-TC1-2`, `grade10-site-auction-account-record-US2-TC2-1` and `grade10-site-auction-account-record-US4-TC1-2` assert them |

- **Covered at domain** - `g10.auction-dmn.US12-TC1` walks `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-18` and `grade10-site-auction-account-record-SC-19`: winner and losing bidder read one final price, Won and Didn't win, on My Auctions

**Uncovered anchors:** none. `grade10-site-auction-account-record-US-10` has TC2-1, TC3-1 and TC4-1, and the domain case for the final price on both rows.

| Finding | Disposition |
| --- | --- |
| Didn't win names a hold being released or released (`grade10-site-auction-account-record-US4-TC1-1`, `grade10-site-auction-account-record-US8-TC2-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US4-TC1-2` and `grade10-site-auction-account-record-US8-TC2-2` (Q1) |
| Bid submitted and Bid not accepted rows (`grade10-site-auction-account-record-US2-TC1-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US2-TC1-2`, Leading and Outbid only (Q2) |
| A leader whose raise is refused fits Leading and Bid not accepted | **Folded in:** case `grade10-site-auction-account-record-US2-TC4-1` (Q3) |
| A refused first bid on a lot never watched | **Folded in:** case `grade10-site-auction-account-record-US2-TC5-1` (Q2) |
| Lone first bid confirming after the close (`grade10-site-auction-account-record-US10-TC4-1`) | **Deprecated:** no bid takes a hold to confirm after the close |
| Hold copy retained for Didn’t win | **Superseded:** the row says the card was not charged; no hold copy remains |

**Run:** 2026-10-02, from the delta against the durable suite and the built My Auctions mapping in grade10 (`packages/grade10-auction/backend/src/services/accountRecord.ts`, `apps/frontend/grade10/src/pages/auctions/AccountAuctionRecordPage.tsx`) and its walk (`apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`). It is a statement, not proof.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded into main** - QA1 wrote against the durable suite before `my-auctions-without-bid-holds` was accepted, and main now holds those rewrites: `grade10-site-auction-account-record-US2-TC1-1` is main's `grade10-site-auction-account-record-US2-TC1-2`, `grade10-site-auction-account-record-US4-TC1-1` is main's `grade10-site-auction-account-record-US4-TC1-2`, `grade10-site-auction-account-record-US8-TC2-1` is main's `grade10-site-auction-account-record-US8-TC2-2`, and `grade10-site-auction-account-record-US10-TC4-1` is already deprecated on main. All four are dropped from this suite
- **Joined** - QA1's leader case, a raise equal to the leader's own maximum, was written as `grade10-site-auction-account-record-US2-TC5-1`, an id main issued for a refused first bid. It joins main's `grade10-site-auction-account-record-US2-TC4-1`, whose Leading row reads the same Standing and price; the bid form's words for a maximum not raised are the domain case `g10.auction-dmn.US04-TC03-2`'s
- **Renumbered** - QA1's Outbid case was written as `grade10-site-auction-account-record-US2-TC4-1`, an id main issued for a refused raise. It is `grade10-site-auction-account-record-US2-TC6-1`: main's case reads the Outbid row's Standing and price, and this one adds that the row keeps its place
- **Folded in** - `grade10-site-auction-account-record-SC-71` by `grade10-site-auction-account-record-US2-TC6-1` and main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-auction-SC-90`, the row in the same place, by `grade10-site-auction-account-record-US2-TC6-1`, recorded in the auction suite too; `grade10-site-auction-account-record-SC-70` and `grade10-site-auction-auction-SC-89` by `grade10-site-auction-account-record-US6-TC3-1`, which adds that a refused first bid sets no watch and shows no alerts toast
- **Corrected** - the cases traced the Feature set group The Bidding page; they trace their sections' journeys, `grade10-site-auction-account-record-US-02` and `grade10-site-auction-account-record-US-06`
- **Raised** - none from this suite; Q15, a lost answer on a first bid showing no alerts toast, reaches `grade10-site-auction-account-record-US-06` and is recorded in the auction suite
- **Contradicted** - none
- **Uncovered anchors** - none. `grade10-site-auction-account-record-SC-14`, `grade10-site-auction-account-record-SC-15`, `grade10-site-auction-account-record-SC-64` and `grade10-site-auction-account-record-SC-65` stand by main's cases; `grade10-site-auction-account-record-SC-69` by main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-account-record-SC-70` by main's `grade10-site-auction-account-record-US2-TC5-1` and `grade10-site-auction-account-record-US6-TC3-1`; the Feature set's card-not-charged leaf by main's `grade10-site-auction-account-record-US4-TC1-2`

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** `grade10-site-auction-account-record-SC-20` ← `US3-TC20-1`.
- **Covered:** `grade10-site-auction-account-record-SC-23` ← `US3-TC23-1`.
- **Raised:** none.

**Run:** removal reconciliation, 2026-10-12, for `remove-my-auction-orders`, `grade10-site/auction/account-record`. The modified requirement swaps its cross-reference from `grade10-site/auction/auction-orders` to `grade10-site/auction/winner-order`; `grade10-site-auction-account-record-SC-55` is carried word for word. No case moves - the Won row's walk is unchanged.

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-w62` rev3 covers SC-dsc: both Outbid and Leading rows keep the live current price at 30000 USD minor after the refused 30300 raise; floor is 30500 USD minor.
- `TC-y6p` rev3 covers SC-fao: the Active row shows the live current price 120000 USD minor, above customer B's 100000 USD minor bid.
- SC-b5w has no active case: durable `TC-j99` is deprecated and remains unchanged. **Out of suite:** exact site regression is planned in `tasks.md` 7.7. No case was reactivated.
- The delta preserves the existing account-record journeys and the product rule that rows show current/final auction price. No PRD, journey, feature-root, or durable-baseline contradiction was found. The changed account-record scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. No implementation execution or human approval is claimed.
