# grade10-site/auction/notifications Test Cases

**Status:** pending-review · 0/31
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector hears a watched listing is opening

**Starting state:**

**Steps 1–1 setup:**

- customer(signed in) watches `<listing_1>` with email alerts on.
- The account's Auction email alerts master is on.
- The clock is moved to `<moment>`.

**Steps 2–5 setup:**

- customer(signed out in this browser) watches `<listing_2>` with email alerts on.
- The clock is moved to the scheduled start of `<listing_2>`.

**Steps 6–7 setup:**

- customer(signed in) watches `<listing_1>`, with listing email alerts `<listing_email_alerts>` and Auction email alerts master `<auction_email_alerts>`.
- The clock is moved past `<listing_1>`'s scheduled start.

**Steps 8–8 setup:**

- customer(signed in) watches `<listing_3>` with email alerts on.
- `<listing_3>` is called off before its scheduled start.
- The clock is moved past `<listing_3>`'s scheduled start.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A published listing whose bidding has not started | · |
| opening warning | 86400s | (24 hours) before the scheduled start |

| `<moment>` | `<letter_kind>` |
| --- | --- |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps 2–5 data:**

| Field | Value |
| --- | --- |
| listing_2 | A listing taking bids, watched by this collector with email alerts on |

| Field | Value |
| --- | --- |
| listing_2 url | The canonical URL of `<listing_2>`; bind the URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing whose bidding has not started |

| `<listing_email_alerts>` | `<auction_email_alerts>` |
| --- | --- |
| Off | On |
| On | Off |

**Steps 8–8 data:**

| Field | Value |
| --- | --- |
| listing_3 | A listing called off before its scheduled start |

### Route

1. Read the mail sent to the collector's registered email.
   - Exactly one copy of `<letter_kind>`, about `<listing_1>`. `g10.auction-notifications.US1-TC1`
   - It goes to the account's registered email. `g10.auction-notifications.US1-TC1`
2. Read the mail sent to the collector's registered email and open the Bidding has opened letter.
   - Step 2: subject, heading, listing block and footer name `<listing_2>`. `g10.auction-notifications.US1-TC2`
   - Step 2: the footer says email alerts are on for this auction. `g10.auction-notifications.US1-TC2`
3. Click the listing action.
   - Step 3: `<listing_2 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`. `g10.auction-notifications.US1-TC2`
4. Back in the letter, click Manage alerts.
   - Step 4: sign-in is offered first; no alert is changed. `g10.auction-notifications.US1-TC2`
5. Complete sign-in from the offer.
   - Step 5: My Auctions opens; `<listing_2>` is still watched, alerts on. `g10.auction-notifications.US1-TC2`
6. Read the mail sent to the collector's registered email.
   - Step 6: neither opening letter was sent for `<listing_1>`. `g10.auction-notifications.US1-TC3`
7. Read the collector's My Auctions.
   - Step 7: `<listing_1>` is still watched. `g10.auction-notifications.US1-TC3`
8. Read the mail sent to the collector's registered email.
   - Bidding has opened was not sent for `<listing_3>`. `g10.auction-notifications.US1-TC4`

## Walk 2: Collector returns before a listing closes

**Starting state:**

**Steps 1–3 setup:**

- customer A watches `<listing_4>`, email alerts off for `<listing_4>`, master on.

**Steps 4–5 setup:**

- customer A watches `<listing_4>`, email alerts on for `<listing_4>`, Auction email alerts master off.

**Steps 6–7 setup:**

- customer A watches or bid on `<listing_5>`, email alerts on.
- `<listing_5>` is in extended bidding, its moved close more than an hour away.

**Steps 8–8 setup:**

- customer(signed in) has this relationship to `<listing_6>` as `<relationship>`, email alerts on.
- The clock is moved to `<closing warning>`.

**Steps 9–11 setup:**

- customer A watches `<listing_7>` with email alerts on and has received Bidding closes in 24 hours.
- customer B(enrolled to bid) is ready to bid on `<listing_7>`.

**Steps 12–12 setup:**

- customer watches `<listing_6>` with email alerts on.
- The clock is moved to 3600s (1 hour) before the scheduled close.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing taking bids, scheduled to close more than 24 hours away |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing taking bids, scheduled to close more than 24 hours away |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| listing_5 | A listing in extended bidding |

**Steps 8–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_6 | A listing taking bids, not in extended bidding | · |
| closing warning | 86400s | (24 hours) before the scheduled close |

| `<relationship>` | `<expected_letters>` |
| --- | --- |
| Watch only | One Bidding closes in 24 hours |
| Bid, not watched before | One Bidding closes in 24 hours |
| Watched, then bid | One Bidding closes in 24 hours |
| Bid, then unwatched, alerts still on | One Bidding closes in 24 hours |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| listing_7 | A listing taking bids, inside its last minutes before the scheduled close |
| late bid | The next valid bid, placed inside the extension window |

**Steps 12–12 data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing taking bids, not in extended bidding |

### Route

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Move the clock to 3600s (1 hour) before the scheduled close.
3. Read the mail sent to customer A.
   - No Bidding closes in 24 hours letter for `<listing_4>`. `g10.auction-notifications.US2-TC5`
   - No closing reminder at the one-hour mark. `g10.auction-notifications.US2-TC5`
4. Move the clock to 86400s (24 hours) before the scheduled close.
5. Read the mail sent to customer A.
   - No Bidding closes in 24 hours letter for `<listing_4>`. `g10.auction-notifications.US2-TC6`
6. Move the clock to 3600s (1 hour) before the moved close.
7. Read the mail sent to customer A.
   - No closing reminder at the one-hour mark before the moved close. `g10.auction-notifications.US2-TC9`
8. Read the mail sent to the collector's registered email.
   - The collector receives `<expected_letters>` about `<listing_6>`, and no other copy. `g10.auction-notifications.US2-TC11`
9. As customer B, place `<late bid>`.
10. Move the clock to 86400s (24 hours) before the moved close.
11. Read the mail sent to customer A.
   - One Extended bidding has started letter for `<listing_7>`. `g10.auction-notifications.US2-TC12`
   - No second Bidding closes in 24 hours letter. `g10.auction-notifications.US2-TC12`
12. Read the mail sent to the collector's registered email.
   - No closing reminder was sent for `<listing_6>` at the one-hour mark. `g10.auction-notifications.US2-TC13`

## Walk 3: Collector raises after being outbid

**Starting state:**

**Steps 1–3 setup:**

- customer A leads `<listing_8>` with email alerts on, maximum equal to the current bid.
- customer B(enrolled to bid) uses a separate session.

**Steps 4–5 setup:**

- customer A leads `<listing_8>` with email alerts on and a maximum above `<customer B bid>`.
- customer B(enrolled to bid) uses a separate session.

**Steps 6–8 setup:**

- customer A leads `<listing_8>`, with email alerts off for `<listing_8>`.
- customer B(enrolled to bid) uses a separate session.

**Steps 9–10 setup:**

- customer A leads `<listing_9>` at `<leader price>` with maximum `<customer A maximum>`, email alerts on.
- `<listing_9>`'s internal bid has this setup: `<internal_bid_before>`.
- admin(holds auction:reserve) is on `<listing_9>`'s editor in the admin.

**Steps 11–12 setup:**

- `<listing_9>`'s internal bid of `<house maximum>` is committed, and the house leads it over customer A's maximum `<customer A maximum>`.
- customer B(card linked) is signed in on the listing page for `<listing_9>`.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>` |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>`, below customer A's maximum |

**Steps 6–8 data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>` |

**Steps 9–10 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| customer A maximum | US$5000 | (US$5,000.00); fixed, 500000 minor units |
| price after | US$5080 | `<customer A maximum>` plus its 8000 increment; fixed, 508000 minor units |

| Row | `<internal_bid_before>` | `<house_action>` | `<leader price>` | Fixture notes | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| Commit at its time | US$6000 | Wait until its commit time passes | US$4000 | `<internal_bid_before>`: its time 5 minutes ahead; `<leader price>`: the starting price | fixed, 600000 minor units; fixed, 400000 minor units |
| Raise past the leader | US$4500 | Raise to US$6000 (fixed, 600000 minor units) and click Save | US$4580 | `<internal_bid_before>`: committed and outbid; `<leader price>`: 450000 plus its 8000 increment | fixed, 450000 minor units; fixed, 458000 minor units |

**Steps 11–12 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| house maximum | US$6000 | (US$6,000.00); fixed, 600000 minor units |
| customer A maximum | US$5000 | (US$5,000.00); fixed, 500000 minor units |
| customer B maximum | US$7000 | above `<house maximum>`; fixed, 700000 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

### Route

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
   - Step 2: one You have been outbid letter for `<listing_8>`. `g10.auction-notifications.US3-TC1`
   - Step 2: no New bid letter for this bid. `g10.auction-notifications.US3-TC1`
3. Read the mail sent to customer B.
   - Step 3: no letter about customer B's own bid. `g10.auction-notifications.US3-TC1`
4. As customer B, place `<customer B bid>`.
5. Read the mail sent to customer A.
   - customer A still leads `<listing_8>`. `g10.auction-notifications.US3-TC2`
   - No You have been outbid letter was sent to customer A. `g10.auction-notifications.US3-TC2`
6. As customer B, place `<customer B bid>`.
7. Read the mail sent to customer A.
   - Step 7: no letter was sent for `<listing_8>`. `g10.auction-notifications.US3-TC3`
8. Open customer A's My Auctions.
   - Step 8: `<listing_8>` reads Outbid; the bid stands. `g10.auction-notifications.US3-TC3`
9. Follow this instruction for the house bid: `<house_action>`.
   - Step 9: the house leads at `<price after>`. `g10.auction-notifications.US3-TC4`
10. Read the mail sent to customer A for the act.
   - Step 10: one You have been outbid letter, and no New bid letter. `g10.auction-notifications.US3-TC4`
   - Step 10: the letter names no house and no reserve. `g10.auction-notifications.US3-TC4`
11. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
   - Step 11: customer B leads. `g10.auction-notifications.US3-TC5`
12. Filter the send log by `<listing_9>` and read the rows from customer B's bid.
   - Step 12 holds no row addressed to the house. `g10.auction-notifications.US3-TC5`

## Walk 4: Collector hears a new bid on a listing they bid on

**Starting state:**

**Steps 1–2 setup:**

- customer A bid on `<listing_10>` earlier, was outbid and told so, email alerts on.
- customer B leads `<listing_10>`.
- customer D watches `<listing_10>` without bidding, email alerts on.
- customer C(enrolled to bid) uses a separate session.

**Steps 3–5 setup:**

- customer A bid on `<listing_11>` earlier, was outbid and told so, email alerts on.
- New-bid sending is held until the steps below finish.

**Steps 6–8 setup:**

- customer A leads `<listing_12>` at `<starting price>` with maximum `<customer A maximum>`, email alerts on.
- `<listing_12>` has an internal bid of `<house maximum>`, its time a few minutes ahead.

**Steps 9–11 setup:**

- customer A leads `<listing_9>` at `<current bid>` with maximum `<customer A maximum>`, over customer B, both email alerts on.
- `<listing_9>` has an internal bid of `<short amount>`, its time a few minutes ahead.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Steps 12–15 setup:**

- `<listing_9>`'s internal bid of `<house maximum>` is committed, and the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
- customer A and customer B bid on `<listing_9>`, and customer D watches it without bidding, all with email alerts on.
- admin(holds auction:reserve) is on `<listing_9>`'s editor in the admin.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing taking bids, with bids from customer A and customer B |
| customer C bid | The next valid bid on `<listing_10>`, above customer B's maximum |

**Steps 3–5 data:**

| Field | Value |
| --- | --- |
| listing_11 | A listing taking bids, with an earlier bid from customer A |
| bids | Three accepted bids from customers B and C, each the next valid bid |

**Steps 6–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_12 | A published USD listing taking bids, starting price `<starting price>`, scheduled close a day away | · |
| starting price | US$4000 | (US$4,000.00); fixed, 400000 minor units |
| customer A maximum | US$7000 | (US$7,000.00); fixed, 700000 minor units |
| house maximum | US$6000 | (US$6,000.00), below `<customer A maximum>`; fixed, 600000 minor units |
| price after | US$6080 | `<house maximum>` plus its 8000 increment; fixed, 608000 minor units |

**Steps 9–11 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| customer A maximum | US$7000 | (US$7,000.00); fixed, 700000 minor units |
| current bid | US$6000 | ; fixed, 600000 minor units |
| short amount | US$5500 | short of the 608000 next minimum; fixed, 550000 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps 12–15 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| house maximum | US$6000 | (US$6,000.00); fixed, 600000 minor units |
| customer A maximum | US$5000 | (US$5,000.00), customer B's below it; fixed, 500000 minor units |
| current bid | US$5080 | `<customer A maximum>` plus its 8000 increment; fixed, 508000 minor units |
| lowered maximum | US$5500 | (US$5,500.00), above `<current bid>`; fixed, 550000 minor units |

### Route

1. As customer C, place `<customer C bid>`.
2. Read the mail sent to customers A, B, C and D.
   - customer A: one New bid letter naming `<customer C bid>`. `g10.auction-notifications.US4-TC1`
   - customer B: You have been outbid only. `g10.auction-notifications.US4-TC1`
   - customer C: no letter about their own bid. `g10.auction-notifications.US4-TC1`
   - customer D: no New bid letter. `g10.auction-notifications.US4-TC1`
3. Place `<bids>` in turn.
4. Release sending.
5. Read the mail sent to customer A.
   - One New bid letter for `<listing_11>`. `g10.auction-notifications.US4-TC2`
   - It names the leading bid after the last of `<bids>`. `g10.auction-notifications.US4-TC2`
6. Wait until the internal bid's time passes.
7. Read the listing page for `<listing_12>` as customer A.
   - Step 7: customer A still leads, at `<price after>`. `g10.auction-notifications.US4-TC3`
8. Read the mail sent to customer A for the commit.
   - Step 8: one New bid on a lot you bid on letter, and no outbid letter. `g10.auction-notifications.US4-TC3`
   - Step 8: the letter names no house and no reserve. `g10.auction-notifications.US4-TC3`
9. Wait until the internal bid's time passes.
10. Read the mail sent to customer A and customer B after that time.
   - Step 10: neither gets a letter for `<listing_9>`. `g10.auction-notifications.US4-TC4`
11. Filter the send log by `<listing_9>` and read the rows after that time.
   - Step 11 holds no row for `<listing_9>` after that time. `g10.auction-notifications.US4-TC4`
12. In the Internal bid section, change the amount to `<lowered maximum>`.
13. Click Save.
   - Step 13 is accepted; the house still leads at `<current bid>`. `g10.auction-notifications.US4-TC5`
14. Read the mail sent to customer A, customer B and customer D after the save.
   - Step 14: none of them gets a letter for `<listing_9>`. `g10.auction-notifications.US4-TC5`
15. Filter the send log by `<listing_9>` and read the rows after the save.
   - Step 15 holds no row for `<listing_9>` after the save. `g10.auction-notifications.US4-TC5`

## Walk 5: Operator looks up what a collector was sent

**Starting state:**

**Steps 1–2 setup:**

- customer A was sent Bidding has opened and Bidding closes in 24 hours for `<listing_13>`.
- customer B was sent Bidding has opened for `<listing_13>`.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Steps 3–3 setup:**

- customer C was never sent auction mail.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_13 | A listing customer A and customer B watch |
| customer A email | customer A's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps 3–3 data:**

| Field | Value |
| --- | --- |
| customer C email | customer C's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

### Route

1. Filter by `<customer A email>`.
   - Step 1: two rows, both customer A's; none of customer B's. `g10.auction-notifications.US5-TC1`
2. Read each row.
   - Step 2: each row shows message type, recipient email, `<listing_13>` and Sent At. `g10.auction-notifications.US5-TC1`
   - Step 2: no row shows or opens the letter body. `g10.auction-notifications.US5-TC1`
3. Filter by `<customer C email>`.
   - No rows show; the log says nothing was sent. `g10.auction-notifications.US5-TC2`

## Walk 6: Collector who lost hears the listing closed

**Starting state:**

**Steps 1–2 setup:**

- customer A bid on `<listing_14>`, email alerts on, and does not lead.
- customer B leads `<listing_14>`.

**Steps 3–4 setup:**

- customer A watched `<listing_15>`, then bid on it, email alerts on, and does not lead.
- customer B leads `<listing_15>`.

**Steps 5–6 setup:**

- customer B watches `<listing_16>`, email alerts on, and leads it.

**Steps 7–9 setup:**

- customer A bid `<customer A bid>` and customer B bid `<customer B bid>` on `<listing_17>`, both with email alerts on; the house leads at `<winning bid>` under its internal bid.
- `<listing_17>`'s close is a few minutes away, and no further bid is coming.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_14 | A listing taking bids, with bids from customer A and customer B, about to close |
| customer A bid | customer A's highest bid on `<listing_14>` |
| winning bid | customer B's winning bid at the close |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_15 | A listing taking bids, watched and bid on by customer A, led by customer B, about to close |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| listing_16 | A listing taking bids, watched and led by customer B, about to close |

**Steps 7–9 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_17 | A published USD listing protected by a committed internal bid of `<house maximum>` | · |
| house maximum | US$500 | fixed, 50000 minor units |
| customer A bid | US$300 | fixed, 30000 minor units |
| customer B bid | US$250 | fixed, 25000 minor units |
| winning bid | US$305 | fixed, 30500 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

### Route

1. Let `<listing_14>` close with customer B winning.
2. Read the mail sent to customer A.
   - One You did not win letter for `<listing_14>`. `g10.auction-notifications.US6-TC1`
   - It names Winning bid as `<winning bid>` and Their bid as `<customer A bid>`. `g10.auction-notifications.US6-TC1`
3. Let `<listing_15>` close with customer B winning.
4. Read the mail sent to customer A.
   - Exactly one close letter: You did not win. `g10.auction-notifications.US6-TC2`
   - No Lot watched, sold letter. `g10.auction-notifications.US6-TC2`
5. Let `<listing_16>` close with customer B winning.
6. Read the mail sent to customer B.
   - No You did not win, Lot watched, sold or Lot watched, ended letter. `g10.auction-notifications.US6-TC3`
   - Only the auction-won order letter arrives. `g10.auction-notifications.US6-TC3`
7. Let `<listing_17>` close with the house leading.
8. Read the mail sent to customer A and customer B for the close.
   - Step 8: each gets one You did not win letter naming Winning bid `<winning bid>` and their own bid. `g10.auction-notifications.US6-TC4`
   - Step 8: neither letter names the house or a reserve. `g10.auction-notifications.US6-TC4`
9. Filter the send log by `<listing_17>` and read the rows from the close.
   - Step 9 holds no auction-won letter and no row addressed to the house. `g10.auction-notifications.US6-TC4`

## Walk 7: Watcher hears a sold listing ended

**Starting state:**

**Steps 1–2 setup:**

- customer D watches `<listing_18>`, email alerts on, and never bid on it.
- customer B leads `<listing_18>`.

**Steps 3–4 setup:**

- customer D watches `<listing_18>`, never bid on it, with listing email alerts `<listing_email_alerts>` and Auction email alerts master `<auction_email_alerts>`.
- customer B leads `<listing_18>`.

**Steps 5–6 setup:**

- customer D watches `<listing_19>`, email alerts on, and never bid on it.
- No collector bid on `<listing_19>`; its internal bid was committed, the house leading at `<starting price>`.
- `<listing_19>`'s close is a few minutes away.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_18 | A listing taking bids, led by customer B, about to close |
| winning bid | customer B's winning bid at the close |

**Steps 3–4 data:**

| `<listing_email_alerts>` | `<auction_email_alerts>` |
| --- | --- |
| Off | On |
| On | Off |

| Field | Value |
| --- | --- |
| listing_18 | A listing taking bids, led by customer B, about to close |

**Steps 5–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_19 | A published USD listing, starting price `<starting price>`, extension duration 1800s (30mins), internal bid US$6000 (fixed, 600000 minor units) | · |
| starting price | US$305 | fixed, 30500 minor units |

### Route

1. Let `<listing_18>` close with customer B winning.
2. Read the mail sent to customer D.
   - One Lot watched, sold letter for `<listing_18>`. `g10.auction-notifications.US7-TC1`
   - It names Sold for as `<winning bid>`. `g10.auction-notifications.US7-TC1`
3. Let `<listing_18>` close with customer B winning.
4. Read the mail sent to customer D.
   - No Lot watched, sold letter was sent. `g10.auction-notifications.US7-TC2`
5. Let `<listing_19>` close.
6. Read the mail sent to customer D for the close.
   - Step 6: one Lot watched, sold letter, Sold for `<starting price>`, and no Lot watched, ended letter. `g10.auction-notifications.US7-TC3`
   - Step 6: no letter names the house or a reserve. `g10.auction-notifications.US7-TC3`

## Walk 8: Collector hears a no-bids close as ended only

**Starting state:**

**Steps 1–2 setup:**

- customer D watches `<listing_20>`, email alerts on, and never bid on it.

**Steps 3–4 setup:**

- customer D and customer E watch `<listing_20>`, email alerts on, and never bid on it.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_20 | A listing taking bids with no bids, about to close |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_20 | A listing taking bids with no bids, about to close |

### Route

1. Let `<listing_20>` close with no bids.
2. Read the mail sent to customer D.
   - One Lot watched, ended letter for `<listing_20>`. `g10.auction-notifications.US8-TC1`
   - Subject, preheader and body say the listing ended. `g10.auction-notifications.US8-TC1`
   - None says unsold, did not sell or no sale. `g10.auction-notifications.US8-TC1`
   - No Sold for, Winning bid or Highest bid shows. `g10.auction-notifications.US8-TC1`
3. Let `<listing_20>` close with no bids.
4. Read every letter sent for `<listing_20>`.
   - Only Lot watched, ended letters, one each to customer D and customer E. `g10.auction-notifications.US8-TC2`
   - No You did not win letter. `g10.auction-notifications.US8-TC2`
   - No Lot watched, sold letter. `g10.auction-notifications.US8-TC2`

## g10.auction-notifications.US1: Collector hears a watched listing is opening

**As a** collector,
**I want** to be emailed as a watched listing opens,
**so that** I can come back and bid without sitting on the page.

<!-- trace:case id=g10.auction-notifications.TC-b0t rev=1 covers=g10.auction-notifications.SC-7kd,g10.auction-notifications.SC-km6,g10.auction-notifications.SC-n5v,g10.auction-notifications.SC-r1s,g10.auction-notifications.SC-io5,g10.auction-notifications.SC-4qb,g10.auction-notifications.SC-4du,g10.auction-notifications.SC-yz5,g10.auction-notifications.SC-5o6,g10.auction-notifications.SC-fxu,g10.auction-notifications.SC-vsw,g10.auction-notifications.SC-aud,g10.auction-notifications.SC-yzf,g10.auction-notifications.SC-wna -->
### g10.auction-notifications.US1-TC1: Watcher is mailed 24 hours before and at the opening

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<listing_1>` with email alerts on.
* The account's Auction email alerts master is on.
* The clock is moved to `<moment>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A published listing whose bidding has not started | · |
| opening warning | 86400s | (24 hours) before the scheduled start |

| `<moment>` | `<letter_kind>` |
| --- | --- |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Exactly one copy of `<letter_kind>`, about `<listing_1>`.
* It goes to the account's registered email.

<!-- trace:case id=g10.auction-notifications.TC-jca rev=2 -->
### g10.auction-notifications.US1-TC2: The opening letter says alerts are on and links to My Auctions

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
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed out in this browser) watches `<listing_2>` with email alerts on.
* The clock is moved to the scheduled start of `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | A listing taking bids, watched by this collector with email alerts on |

| Field | Value |
| --- | --- |
| listing_2 url | The canonical URL of `<listing_2>`; bind the URL only |

**Steps:**

1. Read the mail sent to the collector's registered email and open the Bidding has opened letter.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Complete sign-in from the offer.

**Expected Results:**

* Step 1: subject, heading, listing block and footer name `<listing_2>`.
* Step 1: the footer says email alerts are on for this auction.
* Step 2: `<listing_2 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`.
* Step 3: sign-in is offered first; no alert is changed.
* Step 4: My Auctions opens; `<listing_2>` is still watched, alerts on.

<!-- trace:case id=g10.auction-notifications.TC-pk7 rev=2 -->
### g10.auction-notifications.US1-TC3: No opening mail when alerts are off for the listing or the account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<listing_1>`, with listing email alerts `<listing_email_alerts>` and Auction email alerts master `<auction_email_alerts>`.
* The clock is moved past `<listing_1>`'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing whose bidding has not started |

| `<listing_email_alerts>` | `<auction_email_alerts>` |
| --- | --- |
| Off | On |
| On | Off |

**Steps:**

1. Read the mail sent to the collector's registered email.
2. Read the collector's My Auctions.

**Expected Results:**

* Step 1: neither opening letter was sent for `<listing_1>`.
* Step 2: `<listing_1>` is still watched.

<!-- trace:case id=g10.auction-notifications.TC-10a rev=2 -->
### g10.auction-notifications.US1-TC4: A listing called off before it opens sends nothing further

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<listing_3>` with email alerts on.
* `<listing_3>` is called off before its scheduled start.
* The clock is moved past `<listing_3>`'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A listing called off before its scheduled start |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Bidding has opened was not sent for `<listing_3>`.

---

## g10.auction-notifications.US2: Collector returns before a listing closes

**As a** collector,
**I want** to be emailed when a listing I watch or bid on is a day from its scheduled close,
**so that** a moving deadline does not pass without me.

<!-- trace:case id=g10.auction-notifications.TC-tbm rev=2 -->
### g10.auction-notifications.US2-TC5: A muted watcher gets no closing warnings

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_4>`, email alerts off for `<listing_4>`, master on.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Move the clock to 3600s (1 hour) before the scheduled close.
3. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for `<listing_4>`.
* No closing reminder at the one-hour mark.

<!-- trace:case id=g10.auction-notifications.TC-v00 rev=2 -->
### g10.auction-notifications.US2-TC6: The account master off blocks the closing warning

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_4>`, email alerts on for `<listing_4>`, Auction email alerts master off.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for `<listing_4>`.

<!-- trace:case id=g10.auction-notifications.TC-n1b rev=2 -->
### g10.auction-notifications.US2-TC9: No one-hour reminder before a moved close

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches or bid on `<listing_5>`, email alerts on.
* `<listing_5>` is in extended bidding, its moved close more than an hour away.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A listing in extended bidding |

**Steps:**

1. Move the clock to 3600s (1 hour) before the moved close.
2. Read the mail sent to customer A.

**Expected Results:**

* No closing reminder at the one-hour mark before the moved close.

<!-- trace:case id=g10.auction-notifications.TC-lk4 rev=2 -->
### g10.auction-notifications.US2-TC11: Closes in 24 hours reaches watchers and bidders

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(signed in) has this relationship to `<listing_6>` as `<relationship>`, email alerts on.
* The clock is moved to `<closing warning>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_6 | A listing taking bids, not in extended bidding | · |
| closing warning | 86400s | (24 hours) before the scheduled close |

| `<relationship>` | `<expected_letters>` |
| --- | --- |
| Watch only | One Bidding closes in 24 hours |
| Bid, not watched before | One Bidding closes in 24 hours |
| Watched, then bid | One Bidding closes in 24 hours |
| Bid, then unwatched, alerts still on | One Bidding closes in 24 hours |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* The collector receives `<expected_letters>` about `<listing_6>`, and no other copy.

<!-- trace:case id=g10.auction-notifications.TC-o3h rev=2 -->
### g10.auction-notifications.US2-TC12: Extension sends its own letter, not a second closing warning

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_7>` with email alerts on and has received Bidding closes in 24 hours.
* customer B(enrolled to bid) is ready to bid on `<listing_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | A listing taking bids, inside its last minutes before the scheduled close |
| late bid | The next valid bid, placed inside the extension window |

**Steps:**

1. As customer B, place `<late bid>`.
2. Move the clock to 86400s (24 hours) before the moved close.
3. Read the mail sent to customer A.

**Expected Results:**

* One Extended bidding has started letter for `<listing_7>`.
* No second Bidding closes in 24 hours letter.

<!-- trace:case id=g10.auction-notifications.TC-7q5 rev=2 -->
### g10.auction-notifications.US2-TC13: No one-hour reminder is sent

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer watches `<listing_6>` with email alerts on.
* The clock is moved to 3600s (1 hour) before the scheduled close.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing taking bids, not in extended bidding |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* No closing reminder was sent for `<listing_6>` at the one-hour mark.

---

## g10.auction-notifications.US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a listing I bid on,
**so that** I can raise my maximum while the listing still takes bids.

<!-- trace:case id=g10.auction-notifications.TC-sdf rev=1 covers=g10.auction-notifications.SC-ga4,g10.auction-notifications.SC-vsu,g10.auction-notifications.SC-7rk,g10.auction-notifications.SC-yky,g10.auction-notifications.SC-02a -->
### g10.auction-notifications.US3-TC1: Displaced leader gets outbid, not also new bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>` with email alerts on, maximum equal to the current bid.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>` |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
3. Read the mail sent to customer B.

**Expected Results:**

* Step 2: one You have been outbid letter for `<listing_8>`.
* Step 2: no New bid letter for this bid.
* Step 3: no letter about customer B's own bid.

<!-- trace:case id=g10.auction-notifications.TC-0tc rev=2 -->
### g10.auction-notifications.US3-TC2: A raise absorbed by the leader's maximum sends no outbid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>` with email alerts on and a maximum above `<customer B bid>`.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>`, below customer A's maximum |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.

**Expected Results:**

* customer A still leads `<listing_8>`.
* No You have been outbid letter was sent to customer A.

<!-- trace:case id=g10.auction-notifications.TC-4q8 rev=2 -->
### g10.auction-notifications.US3-TC3: A muted bidder is not told they were outbid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>`, with email alerts off for `<listing_8>`.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing taking bids, led by customer A |
| customer B bid | The next valid bid on `<listing_8>` |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
3. Open customer A's My Auctions.

**Expected Results:**

* Step 2: no letter was sent for `<listing_8>`.
* Step 3: `<listing_8>` reads Outbid; the bid stands.

<!-- trace:case id=g10.auction-notifications.TC-bq3 rev=2 -->
### g10.auction-notifications.US3-TC4: A collector the house displaces gets the ordinary outbid letter

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
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_9>` at `<leader price>` with maximum `<customer A maximum>`, email alerts on.
* `<listing_9>`'s internal bid has this setup: `<internal_bid_before>`.
* admin(holds auction:reserve) is on `<listing_9>`'s editor in the admin.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| customer A maximum | US$5000 | (US$5,000.00); fixed, 500000 minor units |
| price after | US$5080 | `<customer A maximum>` plus its 8000 increment; fixed, 508000 minor units |

| Row | `<internal_bid_before>` | `<house_action>` | `<leader price>` | Fixture notes | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| Commit at its time | US$6000 | Wait until its commit time passes | US$4000 | `<internal_bid_before>`: its time 5 minutes ahead; `<leader price>`: the starting price | fixed, 600000 minor units; fixed, 400000 minor units |
| Raise past the leader | US$4500 | Raise to US$6000 (fixed, 600000 minor units) and click Save | US$4580 | `<internal_bid_before>`: committed and outbid; `<leader price>`: 450000 plus its 8000 increment | fixed, 450000 minor units; fixed, 458000 minor units |

**Steps:**

1. Follow this instruction for the house bid: `<house_action>`.
2. Read the mail sent to customer A for the act.

**Expected Results:**

* Step 1: the house leads at `<price after>`.
* Step 2: one You have been outbid letter, and no New bid letter.
* Step 2: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-83j rev=2 -->
### g10.auction-notifications.US3-TC5: The house is never mailed when a collector displaces it

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
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* `<listing_9>`'s internal bid of `<house maximum>` is committed, and the house leads it over customer A's maximum `<customer A maximum>`.
* customer B(card linked) is signed in on the listing page for `<listing_9>`.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| house maximum | US$6000 | (US$6,000.00); fixed, 600000 minor units |
| customer A maximum | US$5000 | (US$5,000.00); fixed, 500000 minor units |
| customer B maximum | US$7000 | above `<house maximum>`; fixed, 700000 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
2. Filter the send log by `<listing_9>` and read the rows from customer B's bid.

**Expected Results:**

* Step 1: customer B leads.
* Step 2 holds no row addressed to the house.

---

## g10.auction-notifications.US4: Collector hears a new bid on a listing they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a listing I already bid on,
**so that** I know the listing moved without being mailed on every increment.

<!-- trace:case id=g10.auction-notifications.TC-qvy rev=1 covers=g10.auction-notifications.SC-rk1,g10.auction-notifications.SC-ktw,g10.auction-notifications.SC-xzz,g10.auction-notifications.SC-gn8 -->
### g10.auction-notifications.US4-TC1: Other bidders hear of a new bid, watchers do not

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<listing_10>` earlier, was outbid and told so, email alerts on.
* customer B leads `<listing_10>`.
* customer D watches `<listing_10>` without bidding, email alerts on.
* customer C(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing taking bids, with bids from customer A and customer B |
| customer C bid | The next valid bid on `<listing_10>`, above customer B's maximum |

**Steps:**

1. As customer C, place `<customer C bid>`.
2. Read the mail sent to customers A, B, C and D.

**Expected Results:**

* customer A: one New bid letter naming `<customer C bid>`.
* customer B: You have been outbid only.
* customer C: no letter about their own bid.
* customer D: no New bid letter.

<!-- trace:case id=g10.auction-notifications.TC-ozl rev=2 -->
### g10.auction-notifications.US4-TC2: Several bids before a send make one letter at the leading bid

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<listing_11>` earlier, was outbid and told so, email alerts on.
* New-bid sending is held until the steps below finish.

**Test data:**

| Field | Value |
| --- | --- |
| listing_11 | A listing taking bids, with an earlier bid from customer A |
| bids | Three accepted bids from customers B and C, each the next valid bid |

**Steps:**

1. Place `<bids>` in turn.
2. Release sending.
3. Read the mail sent to customer A.

**Expected Results:**

* One New bid letter for `<listing_11>`.
* It names the leading bid after the last of `<bids>`.

<!-- trace:case id=g10.auction-notifications.TC-y85 rev=2 -->
### g10.auction-notifications.US4-TC3: A house bid that moves the price mails the leader a new bid letter

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
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<listing_12>` at `<starting price>` with maximum `<customer A maximum>`, email alerts on.
* `<listing_12>` has an internal bid of `<house maximum>`, its time a few minutes ahead.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_12 | A published USD listing taking bids, starting price `<starting price>`, scheduled close a day away | · |
| starting price | US$4000 | (US$4,000.00); fixed, 400000 minor units |
| customer A maximum | US$7000 | (US$7,000.00); fixed, 700000 minor units |
| house maximum | US$6000 | (US$6,000.00), below `<customer A maximum>`; fixed, 600000 minor units |
| price after | US$6080 | `<house maximum>` plus its 8000 increment; fixed, 608000 minor units |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the listing page for `<listing_12>` as customer A.
3. Read the mail sent to customer A for the commit.

**Expected Results:**

* Step 2: customer A still leads, at `<price after>`.
* Step 3: one New bid on a lot you bid on letter, and no outbid letter.
* Step 3: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-znb rev=2 -->
### g10.auction-notifications.US4-TC4: A not-placed internal bid mails no bidder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<listing_9>` at `<current bid>` with maximum `<customer A maximum>`, over customer B, both email alerts on.
* `<listing_9>` has an internal bid of `<short amount>`, its time a few minutes ahead.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| customer A maximum | US$7000 | (US$7,000.00); fixed, 700000 minor units |
| current bid | US$6000 | ; fixed, 600000 minor units |
| short amount | US$5500 | short of the 608000 next minimum; fixed, 550000 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the mail sent to customer A and customer B after that time.
3. Filter the send log by `<listing_9>` and read the rows after that time.

**Expected Results:**

* Step 2: neither gets a letter for `<listing_9>`.
* Step 3 holds no row for `<listing_9>` after that time.

<!-- trace:case id=g10.auction-notifications.TC-e8p rev=2 -->
### g10.auction-notifications.US4-TC5: A house lower that moves nothing mails no bidder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* `<listing_9>`'s internal bid of `<house maximum>` is committed, and the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* customer A and customer B bid on `<listing_9>`, and customer D watches it without bidding, all with email alerts on.
* admin(holds auction:reserve) is on `<listing_9>`'s editor in the admin.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_9 | A published USD listing taking bids, scheduled close a day away | · |
| house maximum | US$6000 | (US$6,000.00); fixed, 600000 minor units |
| customer A maximum | US$5000 | (US$5,000.00), customer B's below it; fixed, 500000 minor units |
| current bid | US$5080 | `<customer A maximum>` plus its 8000 increment; fixed, 508000 minor units |
| lowered maximum | US$5500 | (US$5,500.00), above `<current bid>`; fixed, 550000 minor units |

**Steps:**

1. In the Internal bid section, change the amount to `<lowered maximum>`.
2. Click Save.
3. Read the mail sent to customer A, customer B and customer D after the save.
4. Filter the send log by `<listing_9>` and read the rows after the save.

**Expected Results:**

* Step 2 is accepted; the house still leads at `<current bid>`.
* Step 3: none of them gets a letter for `<listing_9>`.
* Step 4 holds no row for `<listing_9>` after the save.

---

## g10.auction-notifications.US5: Operator looks up what a collector was sent

**As a** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

<!-- trace:case id=g10.auction-notifications.TC-x00 rev=2 -->
### g10.auction-notifications.US5-TC1: Send log filtered by email lists type, listing and time, never body

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
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

**Pre-conditions:**

* customer A was sent Bidding has opened and Bidding closes in 24 hours for `<listing_13>`.
* customer B was sent Bidding has opened for `<listing_13>`.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | A listing customer A and customer B watch |
| customer A email | customer A's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Filter by `<customer A email>`.
2. Read each row.

**Expected Results:**

* Step 1: two rows, both customer A's; none of customer B's.
* Step 2: each row shows message type, recipient email, `<listing_13>` and Sent At.
* Step 2: no row shows or opens the letter body.

<!-- trace:case id=g10.auction-notifications.TC-axs rev=2 -->
### g10.auction-notifications.US5-TC2: An email with no mail shows an empty log

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
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

**Pre-conditions:**

* customer C was never sent auction mail.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value |
| --- | --- |
| customer C email | customer C's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Filter by `<customer C email>`.

**Expected Results:**

* No rows show; the log says nothing was sent.

---

## g10.auction-notifications.US6: Collector who lost hears the listing closed

**As a** collector who bid on a listing,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the listing.

<!-- trace:case id=g10.auction-notifications.TC-gqc rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### g10.auction-notifications.US6-TC1: A losing bidder gets one You did not win letter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid on `<listing_14>`, email alerts on, and does not lead.
* customer B leads `<listing_14>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | A listing taking bids, with bids from customer A and customer B, about to close |
| customer A bid | customer A's highest bid on `<listing_14>` |
| winning bid | customer B's winning bid at the close |

**Steps:**

1. Let `<listing_14>` close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* One You did not win letter for `<listing_14>`.
* It names Winning bid as `<winning bid>` and Their bid as `<customer A bid>`.

<!-- trace:case id=g10.auction-notifications.TC-ris rev=2 -->
### g10.auction-notifications.US6-TC2: A losing bidder who also watched gets only the bidder letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A watched `<listing_15>`, then bid on it, email alerts on, and does not lead.
* customer B leads `<listing_15>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_15 | A listing taking bids, watched and bid on by customer A, led by customer B, about to close |

**Steps:**

1. Let `<listing_15>` close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* Exactly one close letter: You did not win.
* No Lot watched, sold letter.

<!-- trace:case id=g10.auction-notifications.TC-ua3 rev=2 -->
### g10.auction-notifications.US6-TC3: The winner gets no close-outcome letter from this capability

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer B watches `<listing_16>`, email alerts on, and leads it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_16 | A listing taking bids, watched and led by customer B, about to close |

**Steps:**

1. Let `<listing_16>` close with customer B winning.
2. Read the mail sent to customer B.

**Expected Results:**

* No You did not win, Lot watched, sold or Lot watched, ended letter.
* Only the auction-won order letter arrives.

<!-- trace:case id=g10.auction-notifications.TC-2lb rev=3 covers=g10.auction-notifications.SC-xy1 -->
### g10.auction-notifications.US6-TC4: A house win mails every losing bidder and nobody as the winner

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
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid `<customer A bid>` and customer B bid `<customer B bid>` on `<listing_17>`, both with email alerts on; the house leads at `<winning bid>` under its internal bid.
* `<listing_17>`'s close is a few minutes away, and no further bid is coming.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_17 | A published USD listing protected by a committed internal bid of `<house maximum>` | · |
| house maximum | US$500 | fixed, 50000 minor units |
| customer A bid | US$300 | fixed, 30000 minor units |
| customer B bid | US$250 | fixed, 25000 minor units |
| winning bid | US$305 | fixed, 30500 minor units |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Let `<listing_17>` close with the house leading.
2. Read the mail sent to customer A and customer B for the close.
3. Filter the send log by `<listing_17>` and read the rows from the close.

**Expected Results:**

* Step 2: each gets one You did not win letter naming Winning bid `<winning bid>` and their own bid.
* Step 2: neither letter names the house or a reserve.
* Step 3 holds no auction-won letter and no row addressed to the house.

---

## g10.auction-notifications.US7: Watcher hears a sold listing ended

**As a** collector watching a listing without bidding,
**I want** to be emailed when that listing ends with a winner,
**so that** I know bidding is over on a listing I followed.

<!-- trace:case id=g10.auction-notifications.TC-gz5 rev=1 covers=g10.auction-notifications.SC-9ie,g10.auction-notifications.SC-kce -->
### g10.auction-notifications.US7-TC1: A watch-only collector hears Sold for at the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_18>`, email alerts on, and never bid on it.
* customer B leads `<listing_18>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_18 | A listing taking bids, led by customer B, about to close |
| winning bid | customer B's winning bid at the close |

**Steps:**

1. Let `<listing_18>` close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, sold letter for `<listing_18>`.
* It names Sold for as `<winning bid>`.

<!-- trace:case id=g10.auction-notifications.TC-icj rev=2 -->
### g10.auction-notifications.US7-TC2: A watcher with alerts off hears nothing at the close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_18>`, never bid on it, with listing email alerts `<listing_email_alerts>` and Auction email alerts master `<auction_email_alerts>`.
* customer B leads `<listing_18>`.

**Test data:**

| `<listing_email_alerts>` | `<auction_email_alerts>` |
| --- | --- |
| Off | On |
| On | Off |

| Field | Value |
| --- | --- |
| listing_18 | A listing taking bids, led by customer B, about to close |

**Steps:**

1. Let `<listing_18>` close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* No Lot watched, sold letter was sent.

<!-- trace:case id=g10.auction-notifications.TC-7f9 rev=3 covers=g10.auction-notifications.SC-14x -->
### g10.auction-notifications.US7-TC3: A listing only the house bid on mails watchers sold

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
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_19>`, email alerts on, and never bid on it.
* No collector bid on `<listing_19>`; its internal bid was committed, the house leading at `<starting price>`.
* `<listing_19>`'s close is a few minutes away.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_19 | A published USD listing, starting price `<starting price>`, extension duration 1800s (30mins), internal bid US$6000 (fixed, 600000 minor units) | · |
| starting price | US$305 | fixed, 30500 minor units |

**Steps:**

1. Let `<listing_19>` close.
2. Read the mail sent to customer D for the close.

**Expected Results:**

* Step 2: one Lot watched, sold letter, Sold for `<starting price>`, and no Lot watched, ended letter.
* Step 2: no letter names the house or a reserve.

---

## g10.auction-notifications.US8: Collector hears a no-bids close as ended only

**As a** collector watching a listing,
**I want** to be emailed that the listing ended when nobody bid,
**so that** I learn the close without being told the listing did not sell.

<!-- trace:case id=g10.auction-notifications.TC-uzv rev=2 -->
### g10.auction-notifications.US8-TC1: A no-bids close tells the watcher it ended, and nothing more

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D watches `<listing_20>`, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_20 | A listing taking bids with no bids, about to close |

**Steps:**

1. Let `<listing_20>` close with no bids.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, ended letter for `<listing_20>`.
* Subject, preheader and body say the listing ended.
* None says unsold, did not sell or no sale.
* No Sold for, Winning bid or Highest bid shows.

<!-- trace:case id=g10.auction-notifications.TC-7zp rev=2 -->
### g10.auction-notifications.US8-TC2: A no-bids close sends no bidder letter to anyone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D and customer E watch `<listing_20>`, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_20 | A listing taking bids with no bids, about to close |

**Steps:**

1. Let `<listing_20>` close with no bids.
2. Read every letter sent for `<listing_20>`.

**Expected Results:**

* Only Lot watched, ended letters, one each to customer D and customer E.
* No You did not win letter.
* No Lot watched, sold letter.

## Settled

- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-17-add-auction-close-outcome-emails** — `grade10-site-auction-notifications-US6-TC1-1` → `g10.auction-notifications.US6-TC1`; `grade10-site-auction-notifications-US6-TC2-1` → `g10.auction-notifications.US6-TC2`; `grade10-site-auction-notifications-US6-TC3-1` → `g10.auction-notifications.US6-TC3`; `grade10-site-auction-notifications-US7-TC1-1` → `g10.auction-notifications.US7-TC1`; `grade10-site-auction-notifications-US7-TC2-1` → `g10.auction-notifications.US7-TC2`; `grade10-site-auction-notifications-US8-TC1-1` → `g10.auction-notifications.US8-TC1`; `grade10-site-auction-notifications-US8-TC2-1` → `g10.auction-notifications.US8-TC2`.
  - **2026-09-18-email-trigger-revision** — `grade10-site-auction-notifications-US2-TC1-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC2-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC3-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC4-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC5-1` → `g10.auction-notifications.US2-TC5`; `grade10-site-auction-notifications-US2-TC6-1` → `g10.auction-notifications.US2-TC6`; `grade10-site-auction-notifications-US2-TC7-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC8-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC9-1` → `g10.auction-notifications.US2-TC9`; `grade10-site-auction-notifications-US2-TC10-1` → current journey cases are the replacement record.

## Reconciliation

**Run:** QA2 round 6, 2026-10-12, over the run below. Dev's round-6 reading rewrote the requirement's house bullet: the order a house win opens for its internal bidder sends no letter, and `grade10-site-auction-notifications-SC-52` now reads that win opening the internal bidder's order, with no auction-won or setup letter; no scenario id or revision changed. QA1's round-6 blind pass wrote no case here. QA2 read the delta specs, `decisions.md` through Q58 and this suite; not the archive. It is a statement, not proof.

- **Round 6, unchanged** - every case keeps its version: `g10.auction-notifications.US6-TC4` already reads no auction-won letter and no row addressed to the house after a house win, and `g10.auction-notifications.US3-TC5` no letter to the house
- **Round 6, covered elsewhere** - the no-setup-letter result of `grade10-site-auction-notifications-SC-52` is read by `grade10-admin-auction-internal-bid-US6-TC4-1` across the setup window, and every later order letter by `grade10-admin-auction-internal-bid-US6-TC5-1` to `grade10-admin-auction-internal-bid-US6-TC7-1` (Q51)
- **Round 6, rejected** - none
- **Round 6, raised** - none

**Run, round 3:** QA2, 2026-10-08. QA1's round-3 blind pass, rerun after a discarded attempt broke isolation, read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table as it stood through Q25, the linked pages `bidding.md` and `management.md` under `docs/prds/`, and the change's domain draft above the capability with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. Dev's round-3 reading wrote the scenarios, `tech-design.md` and `tasks.md` without QA1's suites. Q26 to Q29 landed after both readings, and where a case contradicted them the decision won. QA2 read QA1's suites, the delta specs, `decisions.md` through Q29, `tech-design.md`, `tasks.md`, the durable specs and suites, and both PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `g10.auction-notifications.US3-TC4` by `grade10-site-auction-notifications-SC-49`; `g10.auction-notifications.US3-TC5` by `grade10-site-auction-notifications-SC-52`; `g10.auction-notifications.US4-TC3` by `grade10-site-auction-notifications-SC-53`, the leader hearing the house's bid as the durable rule mails every enrolled bidder but the one who bid; `g10.auction-notifications.US4-TC4` by `grade10-site-auction-notifications-SC-54`'s not-placed half; `g10.auction-notifications.US6-TC4` by `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-52`; `g10.auction-notifications.US7-TC3` by `grade10-site-auction-notifications-SC-51`
- **Added by QA2** - `g10.auction-notifications.US4-TC5`: a house lower that moves nothing mails nobody, for `grade10-site-auction-notifications-SC-54`'s lower half, which no blind case reached
- **Covered at domain** - `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51` are also walked by `g10.auction-dmn.US13-TC1`
- **Anchors** - `grade10-site-auction-notifications-SC-52` and `grade10-site-auction-notifications-SC-54` serve the Feature set group `House participation`; their cases trace the journeys whose letters they read
- **Out of suite** - none
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-2lb` rev3 covers SC-xy1: customer A's 30000 USD minor bid defeats the house's 30000 USD reserve while its 50000 USD minor internal maximum wins at 30500 USD minor. Close letters identify winning and own bids; no house recipient or house-winner letter is sent.
- `TC-7f9` rev3 covers SC-14x: the watcher sold letter reports 30500 USD minor and no ended letter is sent.
- The changed cases preserve the existing notification journeys and house-recipient rules. No PRD, journey, feature-root, or durable-baseline contradiction was found. These notification scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. No implementation execution or human approval is claimed.
