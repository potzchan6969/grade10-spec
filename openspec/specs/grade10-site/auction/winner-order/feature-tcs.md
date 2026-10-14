# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/201
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** winner-order-SC-04, winner-order-SC-05, winner-order-SC-38, winner-order-SC-39, winner-order-SC-62, winner-order-SC-63, winner-order-SC-69, winner-order-SC-96, winner-order-SC-110, winner-order-SC-111, winner-order-SC-180, winner-order-SC-184, winner-order-SC-214, winner-order-SC-215, winner-order-SC-216, winner-order-SC-249, winner-order-SC-257, winner-order-SC-287, winner-order-SC-26, winner-order-SC-27, winner-order-SC-28

## Walk 1: Winner settles a won listing — phase 1

**Starting state:**

**Steps 1–3 setup:**

- customer(signed in, holds a default shipping address) leads `<listing_1_1>`.

**Steps 4–6 setup:**

- customer(signed in, no default shipping address) leads `<listing_2_1>`.

**Steps 7–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_3_1>`.

**Steps 8–9 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_4_1>`.
- `<address_far>` is saved on the account.

**Steps 10–13 setup:**

- customer A(card linked) leads `<listing_5_1>`, bidding on the card on file.

**Steps 14–15 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_6_1>`.
- `<card_declining>` is mocked to decline.

**Steps 16–17 setup:**

- `<listing_7_1>` was extended twice and closed with a winner at `<recorded_close>`.

**Steps 18–20 setup:**

- customer(signed in, no saved shipping address) won `<winner_order_8_1>`.

**Steps 21–22 setup:**

- customer(signed in) has `<address_home>` as default and `<address_work>` saved.

**Steps 23–24 setup:**

- customer(winner) confirmed `<address_home>` on `<winner_order_10_1>`.

**Steps 25–25 setup:**

- customer(winner) confirmed `<address_work>` on `<winner_order_11_1>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_1_1 | A listing taking bids, led by this collector, closing within a minute; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–6 data:**

| Field | Value |
| --- | --- |
| listing_2_1 | A listing taking bids, led by this collector, closing within a minute; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 7–7 data:**

| Field | Value |
| --- | --- |
| winner_order_3_1 | An unpaid order whose delivery address is pre-filled from the account default, not confirmed; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–9 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_4_1 | An unpaid HKD order, total `<total before>`; bind its identity only | · |
| address_far | Far: a saved address whose shipping and insurance cost `<difference>` more; bind the address name only | · |
| total before | HKD3,280 | (fixed derived value) |
| difference | HKD50 | (range: 1000–79999 minor units) |
| total after | HKD 3,330.00 | `<total before>` plus `<difference>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 10–13 data:**

| Field | Value |
| --- | --- |
| listing_5_1 | A listing taking bids, led by customer A, closing within a minute; bind its identity only |
| card | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| winner_order_6_1 | An unpaid order inside its payment deadline; bind its identity only |
| card_declining | A card the provider declines |
| card_good | A card the provider accepts |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–17 data:**

| Field | Value |
| --- | --- |
| listing_7_1 | A listing whose close moved twice under extended bidding; bind its identity only |
| recorded_close | 2026-09-03T12:00:00Z, the recorded (moved) close |
| payment_deadline | 2026-09-10T12:00:00Z: `<recorded_close>` plus 604800s (7 days) |
| pdf_deadline | 2026-09-10 20:00 GMT+8: `<payment_deadline>` in GMT+8 |
| local_deadline | 2026-09-10 08:00 EDT: `<payment_deadline>` in America/New_York |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 18–20 data:**

| Field | Value |
| --- | --- |
| winner_order_8_1 | An unpaid order inside its setup window; bind its identity only |
| address_home | A shipping address named Home |
| address_work | A shipping address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 21–22 data:**

| Field | Value |
| --- | --- |
| address_home | A saved shipping address named Home |
| address_work | A saved shipping address named Work |
| winner_order_9_1 | An order opened after step 1; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 23–24 data:**

| Field | Value |
| --- | --- |
| winner_order_10_1 | An unpaid order whose delivery address is `<address_home>`; bind its identity only |
| address_home | A saved shipping address named Home |
| new street | A different address line 1 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 25–25 data:**

| Field | Value |
| --- | --- |
| winner_order_11_1 | An unpaid order whose delivery address is `<address_work>`; bind its identity only |
| address_work | A saved shipping address named Work |

### Route

1. Wait for `<listing_1_1>` to close.
2. Navigate to `<winner order url>` for `<listing_1_1>`.
   - Step 2: one Winner Order exists for `<listing_1_1>`. `g10.auction-winner-order.US1-TC1`
3. Read Order Summary.
   - Step 3: Shipping & Handling, Insurance and Tax read TBD. `g10.auction-winner-order.US1-TC1`
   - Step 3: no charge is marked as an estimate. `g10.auction-winner-order.US1-TC1`
4. Wait for `<listing_2_1>` to close.
5. Navigate to `<winner order url>` for `<listing_2_1>`.
   - Step 5: the winning bid and buyer's premium show. `g10.auction-winner-order.US1-TC2`
   - Step 5: Shipping & Handling, Insurance and Tax read TBD. `g10.auction-winner-order.US1-TC2`
6. Try to pay.
   - Step 6: payment is refused until a delivery address is given. `g10.auction-winner-order.US1-TC2`
7. Try to pay without confirming the delivery address.
   - Payment is refused. `g10.auction-winner-order.US1-TC3`
   - The order asks the winner to confirm the delivery address. `g10.auction-winner-order.US1-TC3`
8. Change the delivery address to the saved address named `<address_far>`.
9. Read the totals before paying.
   - The new total reads `<total after>`, equal to `<total before>` plus `<difference>`. `g10.auction-winner-order.US1-TC4`
   - Both `<total before>` and `<total after>` show before payment. `g10.auction-winner-order.US1-TC4`
   - No separate charge of `<difference>` is raised. `g10.auction-winner-order.US1-TC4`
10. Wait for `<listing_5_1>` to close.
11. Read customer A's authorizations and charges for `<listing_5_1>` at the card provider.
   - Step 11 shows no authorization and no charge for `<listing_5_1>`. `g10.auction-winner-order.US1-TC5`
12. Once the invoice for `<listing_5_1>` is sent, pay it by card through hosted Checkout with `<card>`.
   - Step 12 opens hosted Checkout for the invoice total. `g10.auction-winner-order.US1-TC5`
13. Read customer A's card transactions for `<listing_5_1>` again.
   - Step 13 shows one charge, for the invoice total. `g10.auction-winner-order.US1-TC5`
14. Pay with `<card_declining>`.
   - Step 14: the invoice stays unpaid and payable. `g10.auction-winner-order.US1-TC6`
15. Pay with `<card_good>`.
   - Step 15: payment is accepted; the order reads paid. `g10.auction-winner-order.US1-TC6`
16. Read the payment deadline on `<listing_7_1>`'s invoice.
   - Step 16: the deadline is `<payment_deadline>` and the PDF shows it as `<pdf_deadline>`. `g10.auction-winner-order.US1-TC7`
17. Open `<winner order url>` in a browser set to America/New_York.
   - Step 17: Winner Order shows the same instant in the viewer's local zone as `<local_deadline>`. `g10.auction-winner-order.US1-TC7`
18. Save `<address_home>` and `<address_work>` to the account address book.
   - Step 18: both addresses are in the address book, each under its name. `g10.auction-winner-order.US1-TC8`
19. Navigate to `<winner order url>` for `<winner_order_8_1>`.
20. Open the delivery address picker.
   - Step 20: both are offered for the order. `g10.auction-winner-order.US1-TC8`
21. Set `<address_work>` as the default.
   - Step 21: only `<address_work>` is marked default. `g10.auction-winner-order.US1-TC9`
22. Navigate to `<winner order url>` for `<winner_order_9_1>`.
   - Step 22: the delivery address is pre-filled with `<address_work>`. `g10.auction-winner-order.US1-TC9`
23. Edit `<address_home>`'s address line 1 to `<new street>` in the address book.
   - Step 23: the address book shows `<new street>`. `g10.auction-winner-order.US1-TC10`
24. Navigate to `<winner order url>` for `<winner_order_10_1>`.
   - Step 24: the order still shows the original address line 1. `g10.auction-winner-order.US1-TC10`
25. Archive `<address_work>` in the address book.
   - The winner is asked to choose another address for `<winner_order_11_1>`. `g10.auction-winner-order.US1-TC11`
   - `<address_work>` stays available while the order uses it. `g10.auction-winner-order.US1-TC11`

## Walk 2: Winner settles a won listing — phase 2

**Starting state:**

**Steps 1–3 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_12_1>`.

**Steps 4–5 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_13_1>`, Complete Order Setup open.

**Steps 6–7 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_14_1>`, Personal selected.

**Steps 8–9 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_15_1>`, with form mode `<form mode>` and missing field `<missing field>`.

**Steps 10–11 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_16_1>`, Personal selected.

**Steps 12–14 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_17_1>`, Personal selected.

**Steps 15–17 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_18_1>`, Personal selected.

**Steps 18–18 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_19_1>`.

**Steps 19–20 setup:**

- customer(winner, has saved address `<address fixture>` of type `<address type>`) is on `<winner order url>` for `<winner_order_20_1>`, Complete Order Setup open.

**Steps 21–24 setup:**

- customer(winner) is on delivery Add Address for `<winner_order_21_1>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| winner_order_12_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| winner_order_13_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| winner_order_14_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps 8–9 data:**

| `<form mode>` | `<missing field>` | `<phone country>` | `<phone digits>` | `<company name>` |
| --- | --- | --- | --- | --- |
| Company | Company Name | United States | 4155550100 | (empty) |
| Personal | Phone | United States | (empty) | Not shown |
| Personal | Phone | (not chosen) | 4155550100 | Not shown |

| Field | Value |
| --- | --- |
| winner_order_15_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| winner_order_16_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps 12–14 data:**

| Field | Value |
| --- | --- |
| winner_order_17_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| stored phone | +14155550100 |

**Steps 15–17 data:**

| Field | Value |
| --- | --- |
| winner_order_18_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Address line 2 | (empty) |
| State or province | (empty) |
| Postal code | 94105 |

**Steps 18–18 data:**

| Field | Value |
| --- | --- |
| winner_order_19_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps 19–20 data:**

| `<address type>` | `<address title>` | `<address fixture>` |
| --- | --- | --- |
| Personal | Alex Chen | Saved personal address with street, city or region, country, phone and postal code |
| Company | Northwind Collectibles | Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code |

| Field | Value |
| --- | --- |
| winner_order_20_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 21–24 data:**

| Field | Value |
| --- | --- |
| winner_order_21_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

### Route

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Look at the Phone field.
   - Phone shows a globe only: no flag, no calling-code divider. `g10.auction-winner-order.US1-TC12`
   - The placeholder shows an example with a calling code, `+852 12345678`. `g10.auction-winner-order.US1-TC12`
   - No calling country is chosen. `g10.auction-winner-order.US1-TC12`
4. Open Add Address for delivery.
5. Read the Personal / Company control and the fields below it.
   - Personal is selected. `g10.auction-winner-order.US1-TC13`
   - Company Name is not shown. `g10.auction-winner-order.US1-TC13`
6. Click Company on the Personal / Company control.
7. Read the fields below it.
   - Company is selected. `g10.auction-winner-order.US1-TC14`
   - Company Name shows, marked required. `g10.auction-winner-order.US1-TC14`
8. Prepare mode `<form mode>`, phone country `<phone country>`, phone digits `<phone digits>` and Company Name `<company name>` where shown; leave `<missing field>` unset.
9. Click confirm.
   - The confirm is refused, with a message beside `<missing field>`. `g10.auction-winner-order.US1-TC16`
   - No address is saved or applied to the order. `g10.auction-winner-order.US1-TC16`
10. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
11. Click confirm.
   - The confirm is accepted; no phone-format refusal shows. `g10.auction-winner-order.US1-TC18`
   - The address is applied to the order. `g10.auction-winner-order.US1-TC18`
12. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, stored phone `<stored phone>`.
13. Click confirm.
   - Step 13: the confirm is accepted. `g10.auction-winner-order.US1-TC19`
14. Read the phone on the order's delivery address.
   - Step 14: the phone reads `<stored phone>`. `g10.auction-winner-order.US1-TC19`
15. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Address line 2 `<Address line 2>`, State or province `<State or province>`, Postal code `<Postal code>`.
16. Click confirm.
   - Step 16: the confirm is accepted. `g10.auction-winner-order.US1-TC20`
17. Read the order's delivery address.
   - Step 17: line 1 and postal code show; line 2 and state are empty. `g10.auction-winner-order.US1-TC20`
18. Read every field label on the form.
   - No Apt., Suite or Building field shows. `g10.auction-winner-order.US1-TC21`
   - Address line 2 shows as the optional second line. `g10.auction-winner-order.US1-TC21`
19. Open the delivery address picker.
20. Read the card for `<address fixture>`.
   - The title reads `<address title>` for the `<address type>` address. `g10.auction-winner-order.US1-TC22`
   - The body shows street, city or region, and country. `g10.auction-winner-order.US1-TC22`
   - The body shows no postal code and no phone. `g10.auction-winner-order.US1-TC22`
21. Click Company.
22. Fill Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
23. Click confirm.
   - Step 23: the order's delivery address carries Northwind Collectibles, Alex Chen, phone and 94105. `g10.auction-winner-order.US1-TC24`
24. Reopen the delivery address picker.
   - Step 24: the card reads Northwind Collectibles, with no phone or postal code. `g10.auction-winner-order.US1-TC24`

## Walk 3: Winner settles a won listing — phase 3

**Starting state:**

**Steps 1–4 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_22_1>`, reading Awaiting Setup.

**Steps 5–6 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_23_1>`.

**Steps 7–8 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_24_1>`.

**Steps 9–9 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_25_1>`.

**Steps 10–12 setup:**

- `<listing_26_1>` holds listing code `<code_1>`.
- `<listing_26_2>` is a draft whose internal id hashes to `<code_1>`.

**Steps 13–14 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_27_1>`.
- An operator changed `<winner_order_27_1>` to `<address_work>` and bank transfer.

**Steps 15–16 setup:**

- customer(winner) confirmed `<address_work>` on `<winner_order_28_1>`.

**Steps 17–18 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is closed.
- The winner order under test is `<winner_order_29_1>`.

**Steps 19–19 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The winner order under test is `<winner_order_30_1>`.

**Steps 20–20 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is closed with the fixture default Hong Kong selected.
- The winner order under test is `<winner_order_31_1>`.

**Steps 21–22 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The winner order under test is `<winner_order_32_1>`.

**Steps 23–24 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is open on a long A–Z list.
- The winner order under test is `<winner_order_33_1>`.

**Steps 25–26 setup:**

- A design-system Autocomplete is rendered with a long option list taller than its capped popup height.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| winner_order_22_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone | +14155550100 |
| Address line 1 | 100 Market St |
| Town or city | San Francisco |
| Postal code | 94105 |
| Country or region | United States |
| Billing | Same as delivery, left ticked |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| winner_order_23_1 | An order whose sent invoice includes Insurance; bind its identity only |
| insurance_amount | The Insurance amount on that invoice |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_24_1 | An order whose invoice is not yet sent; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 9–9 data:**

| Field | Value |
| --- | --- |
| winner_order_25_1 | An order whose sent invoice has no Insurance; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 10–12 data:**

| Field | Value |
| --- | --- |
| code_1 | A listing code in use |

| Field | Value |
| --- | --- |
| listing_26_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_26_2 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps 13–14 data:**

| Field | Value |
| --- | --- |
| winner_order_27_1 | An HKD order reading Preparing Invoice, home address and card confirmed; bind its identity only |
| address_work | A saved address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 15–16 data:**

| Field | Value |
| --- | --- |
| winner_order_28_1 | An order reading Preparing Invoice, `<address_work>` confirmed; bind its identity only |
| address_work | A saved address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 17–18 data:**

| Field | Value |
| --- | --- |
| winner_order_29_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 19–19 data:**

| Field | Value |
| --- | --- |
| winner_order_30_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 20–20 data:**

| Field | Value |
| --- | --- |
| winner_order_31_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 21–22 data:**

| Field | Value |
| --- | --- |
| winner_order_32_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 23–24 data:**

| Field | Value |
| --- | --- |
| Typed query | hong |

| Field | Value |
| --- | --- |
| winner_order_33_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 25–26 data:**

| Field | Value |
| --- | --- |
| Typed query | uni |

### Route

1. Open Complete Order Setup.
2. Enter Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone `<Phone>`, Address line 1 `<Address line 1>`, Town or city `<Town or city>`, Postal code `<Postal code>`, Country or region `<Country or region>`, Billing `<Billing>`, winner order url `<winner order url>`.
3. Confirm setup.
4. Read Delivery and Billing on Order Summary.
   - Delivery shows company, recipient, phone, 100 Market St, San Francisco 94105 and United States. `g10.auction-winner-order.US1-TC25`
   - Billing shows the same as Delivery. `g10.auction-winner-order.US1-TC25`
5. Find Insurance on Order Summary.
   - Step 5: Insurance reads `<insurance_amount>`, not TBD. `g10.auction-winner-order.US1-TC26`
6. Hover the Insurance info tooltip.
   - Step 6: the tooltip reads `0.9% of the order value during transit.` `g10.auction-winner-order.US1-TC26`
7. Read the fee rows on Order Summary.
   - Step 7: Insurance shows with the other fee rows, reading TBD. `g10.auction-winner-order.US1-TC27`
8. Hover the Insurance info tooltip.
   - Step 8: the tooltip reads `0.9% of the order value during transit.` `g10.auction-winner-order.US1-TC27`
9. Read Order Summary.
   - No Insurance row and no Insurance tooltip show. `g10.auction-winner-order.US1-TC28`
10. Publish `<listing_26_2>`.
11. Read `<listing_26_2>`'s listing code.
   - Step 11: `<listing_26_2>` holds a code other than `<code_1>`, hashed again with a counter. `g10.auction-winner-order.US1-TC29`
   - Step 11: `L` and 5 characters; no `0`, `O`, `1`, `I` or lower case. `g10.auction-winner-order.US1-TC29`
12. Change the hash method, then read both listing codes.
   - Step 12: both listings keep their codes. `g10.auction-winner-order.US1-TC29`
13. Reload the order.
   - Step 13: the order shows `<address_work>` and bank transfer, still Preparing Invoice. `g10.auction-winner-order.US1-TC34`
14. Look for address and payment-method controls.
   - Step 14: no control changes either. `g10.auction-winner-order.US1-TC34`
15. Archive `<address_work>` in the address book.
   - Step 15: `<address_work>` is archived. `g10.auction-winner-order.US1-TC35`
16. Navigate to `<winner order url>` for `<winner_order_28_1>`.
   - Step 16: the order still shows `<address_work>`. `g10.auction-winner-order.US1-TC35`
17. Open the Country/Region picker.
   - Step 17 opens a popup listing every country and region A–Z, not a short designated set. `g10.auction-winner-order.US1-TC36`
18. Scroll the popup from the first option to the last.
   - Step 18 keeps the full catalogue available inside the capped-height popup. `g10.auction-winner-order.US1-TC36`
19. Look at the country or region field label beside the picker.
   - The label reads Country/Region. `g10.auction-winner-order.US1-TC37`
20. Read the Country/Region field without opening the popup.
   - The field shows Hong Kong. `g10.auction-winner-order.US1-TC38`
   - Country/Region options are not in the tree. `g10.auction-winner-order.US1-TC38`
21. Open the Country/Region picker.
   - Step 21 shows every country and region A–Z in the popup. `g10.auction-winner-order.US1-TC39`
22. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.
   - Step 22 scrolls the long list inside a capped height without truncating the catalogue to a short set. `g10.auction-winner-order.US1-TC39`
23. Focus the open Country/Region picker.
24. Type `<Typed query>`.
   - Step 24 shows only country or region names that match the query. `g10.auction-winner-order.US1-TC40`
   - Names that do not match (for example Australia) are not shown. `g10.auction-winner-order.US1-TC40`
25. Open the Autocomplete.
26. Type `<Typed query>`.
   - The list shows only options whose labels match the query. `g10.auction-winner-order.US1-TC41`
   - Non-matching options are not shown. `g10.auction-winner-order.US1-TC41`

## Walk 4: Winner settles a won listing — phase 4

**Starting state:**

**Steps 1–1 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is open.
- The winner order under test is `<winner_order_35_1>`.

**Steps 2–2 setup:**

- customer(winner) is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is open.
- The winner order under test is `<winner_order_36_1>`.

**Steps 3–5 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is closed on the fixture default.
- The winner order under test is `<winner_order_37_1>`.

**Steps 6–6 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- Country/Region has no value selected.
- Other required address fields that the form needs are filled.
- The winner order under test is `<winner_order_38_1>`.

**Steps 7–8 setup:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The winner order under test is `<winner_order_39_1>`.

**Steps 9–10 setup:**

- customer(winner) holds an auction order whose invoice has not been sent.
- The winner order under test is `<winner_order_40_1>`.

**Steps 11–13 setup:**

- customer(winner) holds a paid auction order whose invoice includes Tax of HKD70 (range: >0 minor units).
- The winner order under test is `<winner_order_41_1>`.

**Steps 14–16 setup:**

- customer(winner) holds a paid auction order whose operator added no Tax.
- The winner order under test is `<winner_order_42_1>`.

**Steps 17–19 setup:**

- admin(operator with payment-processing) is on a card order in Preparing Invoice.
- The order's lines before Tax total HKD3,280 (fixed derived value).
- The winner order under test is `<winner_order_43_1>`.

**Steps 20–22 setup:**

- Grade10 holds no bank details for the currency `<settlement currency>`.
- customer(winner) holds an auction order in `<settlement currency>` in Awaiting Setup.
- The winner order under test is `<winner_order_44_1>`.

**Steps 23–25 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
- customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.
- The winner order under test is `<winner_order_45_1>`.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |

| Field | Value |
| --- | --- |
| winner_order_35_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 2–2 data:**

| Query partition | `<typed query>` | `<matching result>` |
| --- | --- | --- |
| Early alphabet | afg | Afghanistan, or the catalogue name that matches |
| Late alphabet | zim | Zimbabwe, or the catalogue name that matches |

| Field | Value |
| --- | --- |
| winner_order_36_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 3–5 data:**

| Field | Value |
| --- | --- |
| Typed query | united king |
| Country or region | United Kingdom |

| Field | Value |
| --- | --- |
| winner_order_37_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 6–6 data:**

| Field | Value |
| --- | --- |
| winner_order_38_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_39_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 9–10 data:**

| Field | Value |
| --- | --- |
| winner_order_40_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 11–13 data:**

| Field | Value |
| --- | --- |
| winner_order_41_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 14–16 data:**

| Field | Value |
| --- | --- |
| winner_order_42_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 17–19 data:**

| Field | Value |
| --- | --- |
| winner_order_43_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 20–22 data:**

| Field | Value |
| --- | --- |
| settlement currency | The supported settlement currency with no bank details in this fixture; bind its currency code only |
| winner_order_44_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 23–25 data:**

| `<new rail>` | `<recorded method>` |
| --- | --- |
| FPS | bank transfer on FPS |
| HK Local | bank transfer on HK Local |

| Field | Value |
| --- | --- |
| winner_order_45_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Type `<Typed query>`.
   - The list shows no country or region options. `g10.auction-winner-order.US1-TC42`
2. Type `<typed query>`.
   - The country `<matching result>` appears in the filtered list. `g10.auction-winner-order.US1-TC43`
   - Unrelated country names outside the query are not shown. `g10.auction-winner-order.US1-TC43`
3. Open the Country/Region picker.
4. Type `<Typed query>`.
5. Select United Kingdom from the filtered matches.
   - Step 5 closes the popup. `g10.auction-winner-order.US1-TC45`
   - The field shows United Kingdom. `g10.auction-winner-order.US1-TC45`
   - Options are no longer in the tree. `g10.auction-winner-order.US1-TC45`
6. Activate Confirm or Use This Address with Country/Region empty.
   - A field refusal appears beside Country/Region. `g10.auction-winner-order.US1-TC46`
   - The address is not applied with an empty country or region. `g10.auction-winner-order.US1-TC46`
7. Open the Country/Region picker.
8. Note whether an early-alphabet name and a late-alphabet name both appear in the list.
   - The open list includes names from the start of the A–Z range and from near the end. `g10.auction-winner-order.US1-TC47`
   - The set is not limited to a short designated sample. `g10.auction-winner-order.US1-TC47`
9. Open Winner Order.
10. Read Tax in Order Summary and open its info tip.
   - Tax reads TBD with the other fee rows. `g10.auction-winner-order.US1-TC30`
   - No calculated Tax amount is shown. `g10.auction-winner-order.US1-TC30`
   - The tip reads `Set by Grade10 for where your order ships. Some orders have none.` `g10.auction-winner-order.US1-TC30`
11. Open Winner Order and read Order Summary.
12. Open the invoice PDF.
13. Open the receipt PDF.
   - Order Summary shows Tax of HKD70 (range: >0 minor units) between Insurance and Payment Processing Fee. `g10.auction-winner-order.US1-TC31`
   - Order Summary offers the Tax info tip with the stated copy. `g10.auction-winner-order.US1-TC31`
   - The invoice PDF and the receipt PDF each show Tax of HKD70 (range: >0 minor units) between Insurance and Subtotal. `g10.auction-winner-order.US1-TC31`
   - Each PDF's Subtotal includes Tax of HKD70 (range: >0 minor units). `g10.auction-winner-order.US1-TC31`
14. Open Winner Order and read Order Summary.
15. Open the invoice PDF.
16. Open the receipt PDF.
   - No surface shows a Tax line. `g10.auction-winner-order.US1-TC32`
   - Order Summary offers no Tax info tip. `g10.auction-winner-order.US1-TC32`
17. Add Tax of HKD70 (range: >0 minor units).
18. Send the invoice.
19. Read its Subtotal and payment processing fee inputs.
   - The Subtotal is HKD3,350 (fixed derived value). `g10.auction-winner-order.US1-TC33`
   - Grade10 computes the payment processing fee from that Subtotal. `g10.auction-winner-order.US1-TC33`
20. Start setup, choose the home address and reach the payment method choice.
21. Send Grade10 a setup confirmation carrying the home address and bank transfer.
22. Reload the order.
   - Only card is offered. `g10.auction-winner-order.US1-TC48`
   - Grade10 refuses the confirmation. `g10.auction-winner-order.US1-TC48`
   - The order is still Awaiting Setup, with no delivery address and no method recorded. `g10.auction-winner-order.US1-TC48`
23. Change the choice to `<new rail>`.
24. Confirm the home address.
25. Reload the order.
   - The order records `<recorded method>`, not card. `g10.auction-winner-order.US1-TC50`
   - The order reads Preparing Invoice. `g10.auction-winner-order.US1-TC50`

## Walk 5: Winner settles a won listing — phase 5

**Starting state:**

**Steps 1–2 setup:**

- Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
- customer(winner) holds an auction order in HKD in Awaiting Setup.
- The winner order under test is `<winner_order_46_1>`.

**Steps 3–6 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds no card fee rule in `<settlement currency>`.
- customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.
- The winner order under test is `<winner_order_47_1>`.

**Steps 7–9 setup:**

- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup.
- The winner order under test is `<winner_order_48_1>`.

**Steps 10–11 setup:**

- customer(winner) whose account language is Traditional Chinese is on delivery Add Address of an auction order in Awaiting Setup.
- The winner order under test is `<winner_order_49_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_46_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 3–6 data:**

| `<settlement currency>` | `<offered rails>` |
| --- | --- |
| HKD | FPS, HK Local |
| USD | HK Local, International via SWIFT |

| Field | Value |
| --- | --- |
| winner_order_47_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 7–9 data:**

| Field | Value |
| --- | --- |
| winner_order_48_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| winner_order_49_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Choose the home address, choose no payment method, and confirm.
2. Reload the order.
   - Grade10 refuses the confirmation. `g10.auction-winner-order.US1-TC51`
   - The order is still Awaiting Setup. `g10.auction-winner-order.US1-TC51`
3. Choose the home address and `<settlement currency>`, and reach the payment method choice.
4. Try to choose card.
5. Send Grade10 a setup confirmation carrying the home address and card.
6. Reload the order.
   - Card reads that it is not yet available in `<settlement currency>`, and cannot be chosen. `g10.auction-winner-order.US1-TC52`
   - The rails `<offered rails>` are offered. `g10.auction-winner-order.US1-TC52`
   - Grade10 refuses the confirmation. `g10.auction-winner-order.US1-TC52`
   - The order holds no delivery address and no method. `g10.auction-winner-order.US1-TC52`
7. Choose the home address and reach the payment method choice.
8. Try to choose card, then bank transfer, then confirm.
9. Reload the order.
   - The page says payment is not yet available in USD and offers Contact Us. `g10.auction-winner-order.US1-TC53`
   - Neither method can be chosen, and Grade10 refuses the confirmation. `g10.auction-winner-order.US1-TC53`
   - The order is still Awaiting Setup, holding no delivery address and no method. `g10.auction-winner-order.US1-TC53`
10. Open the Country/Region picker and read the names.
11. Type `日本`.
   - The names read in Traditional Chinese. `g10.auction-winner-order.US1-TC56`
   - The list narrows to `日本`. `g10.auction-winner-order.US1-TC56`

## Walk 6: Winner follows a settled listing to delivery — phase 1

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_51_1>`.

**Steps 3–3 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_52_1>`.

**Steps 4–5 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_53_1>`.

**Steps 6–6 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_54_1>`.

**Steps 7–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_55_1>`.

**Steps 8–8 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_56_1>`.
- The second payment was later refunded or reversed.

**Steps 9–11 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_57_1>` and `<winner_order_57_2>`.

**Steps 12–14 setup:**

- `<winner_order_58_1>` is dispatched.
- The carrier delivery feed is mocked to report delivery with `<handover time>` and `<signature>`.

**Steps 15–15 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_59_1>`.
- admin(holds payment-processing) confirms its proof at `<confirm time>`.

**Steps 16–16 setup:**

- `<winner_order_60_1>` is paid, with a replaced invoice, a current invoice and a receipt.
- Its winner deleted the account a year after payment.
- The clock is 6 years after payment, inside the 7-year retention.

**Steps 17–18 setup:**

- `<winner_order_61_1>` was paid by card; its receipt ID is `<receipt id>`.

**Steps 19–20 setup:**

- customer(winner) is on `<winner order url>` for an order in `<order state>`, prepared as follows: `<fixture setup>`.
- The winner order under test is `<winner_order_62_1>`.

**Steps 21–22 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_63_1>`.

**Steps 23–23 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_64_1>`.

**Steps 24–25 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_65_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_51_1 | An HKD order paid in full at `<final amount>`; bind its identity only | · |
| final amount | HKD3,330 | (range: 80000–399999 minor units) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_52_1 | An HKD order with invoice total `<total>`, paid by one payment of `<total>`; bind its identity only | · |
| total | HKD1,080 | (fixed derived value) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–5 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_53_1 | An HKD order with invoice total `<total>`, paid `<payment 1>` then `<payment 2>`; bind its identity only | · |
| total | HKD 1 | 080.00 |
| payment 1 | HKD 420.00 | · |
| payment 2 | HKD 310.00 | · |

| Receipt | `<previous payments>` | `<current payment received>` | `<remaining balance due>` | Fixture notes |
| --- | --- | --- | --- | --- |
| First | 0 | HKD 420.00 | HKD 660.00 | `<remaining balance due>`: `<total>` − `<payment 1>` |
| Second | HKD 420.00 | HKD 310.00 | HKD 350.00 | `<remaining balance due>`: `<total>` − `<payment 1>` − `<payment 2>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_54_1 | An HKD order, total `<total>`, paid `<paid before>`, then closed Paid by an operator recording `<closing payment>` within the closing tolerance; bind its identity only | · |
| total | HKD 1 | 080.00 |
| paid before | HKD 960.00 | · |
| closing payment | HKD 60.00 | · |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 7–7 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_55_1 | An HKD order, total `<total>`, with an operator-confirmed payment of `<payment>`; bind its identity only | · |
| total | HKD 1 | 080.00 |
| payment | HKD 1 | 190.00 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–8 data:**

| Field | Value |
| --- | --- |
| winner_order_56_1 | An HKD order, total HKD 1,080.00, paid HKD 220.00, HKD 310.00, HKD 140.00 in that order, one receipt each; bind its identity only |

| Receipt | `<previous payments>` | `<current payment received>` | `<remaining balance due>` |
| --- | --- | --- | --- |
| First | 0 | HKD 220.00 | HKD 860.00 |
| Second | HKD 220.00 | HKD 310.00 | HKD 550.00 |
| Third | HKD 530.00 | HKD 140.00 | HKD 410.00 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| winner_order_57_1 | A paid order dispatched with a carrier, `<tracking number>` and a recorded tracker link; bind its identity only |
| winner_order_57_2 | A paid order dispatched with a carrier and `<tracking number>`, and no tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| tracking number | The shipment tracking number on the seeded order; bind its number only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 12–14 data:**

| Field | Value |
| --- | --- |
| winner_order_58_1 | A paid, dispatched order; bind its identity only |
| handover time | The handover timestamp in the carrier's report |
| signature | The signature image in the carrier's report |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 15–15 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_59_1 | An HKD order, invoice `INV-202609-LK7P2Q-02`, total `<total>`, reading Payment Verifying; bind its identity only | · |
| total | HKD3,290 | (fixed derived value) |
| confirm time | 2026-09-30T16:30:00Z, October in Hong Kong | · |
| receipt id | `REC-202610-LK7P2Q-02-P1` | · |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–16 data:**

| Field | Value |
| --- | --- |
| winner_order_60_1 | A paid order whose invoice was once reissued; bind its identity only |

**Steps 17–18 data:**

| Field | Value |
| --- | --- |
| winner_order_61_1 | A card-paid order; bind its identity only |
| receipt id | `REC-202609-LK7P2Q-01-P1` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 19–20 data:**

| `<order state>` | `<fixture setup>` |
| --- | --- |
| Shipped | Paid, fulfilment fulfilled, delivery not confirmed, tracker link present |
| Delivered | Paid, fulfilment fulfilled, delivery confirmed, tracker link present |

| Field | Value |
| --- | --- |
| winner_order_62_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| carrier tracking url | The public carrier tracking URL for this fixture; bind its URL only |
| tracking number | The shipment tracking number on the seeded order; bind its number only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 21–22 data:**

| Field | Value |
| --- | --- |
| winner_order_63_1 | A paid order with fulfilment `unfulfilled`; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 23–23 data:**

| Field | Value |
| --- | --- |
| winner_order_64_1 | A paid, fulfilled order with a ship date, a tracking number and a recorded tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 24–25 data:**

| Field | Value |
| --- | --- |
| winner_order_65_1 | A paid order with fulfilment fulfilled and a tracking number, where the operator recorded no tracker link; bind its identity only |
| tracking number | The tracking number recorded for `<winner_order_65_1>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Download the receipt PDF.
2. Read its lines.
   - Winning bid, buyer's premium, shipping, insurance when added, Tax when added and final amount show. `g10.auction-winner-order.US2-TC1`
   - The lines sum to `<final amount>`. `g10.auction-winner-order.US2-TC1`
   - It names how it was paid. `g10.auction-winner-order.US2-TC1`
3. Download the receipt PDF.
   - Original Invoice Total `<total>`; Previous Payments 0. `g10.auction-winner-order.US2-TC4`
   - Current Payment Received `<total>`; Remaining Balance Due 0. `g10.auction-winner-order.US2-TC4`
4. Open the Receipt PDF row.
   - Step 4: both receipts are listed on one row, oldest first. `g10.auction-winner-order.US2-TC5`
5. Open the first receipt, then the second.
   - Step 5: each shows Original Invoice Total `<total>` with Previous Payments `<previous payments>`, Current Payment Received `<current payment received>` and Remaining Balance Due `<remaining balance due>`. `g10.auction-winner-order.US2-TC5`
6. Open the receipt for `<closing payment>`.
   - Original Invoice Total `<total>`; Previous Payments `<paid before>`. `g10.auction-winner-order.US2-TC6`
   - Current Payment Received `<closing payment>`; Remaining Balance Due 0. `g10.auction-winner-order.US2-TC6`
   - No shortfall or write-off line shows. `g10.auction-winner-order.US2-TC6`
7. Open the receipt.
   - Original Invoice Total `<total>`; Previous Payments 0. `g10.auction-winner-order.US2-TC7`
   - Current Payment Received `<payment>`; Remaining Balance Due 0. `g10.auction-winner-order.US2-TC7`
   - No negative balance or credit line shows. `g10.auction-winner-order.US2-TC7`
8. Open each receipt in turn.
   - Each receipt still shows Previous Payments `<previous payments>`, Current Payment Received `<current payment received>` and Remaining Balance Due `<remaining balance due>`. `g10.auction-winner-order.US2-TC8`
   - No receipt was reissued. `g10.auction-winner-order.US2-TC8`
9. Read the shipment section of `<winner_order_57_1>`.
   - Step 9: `<tracking number>` shows as a link, with no separate carrier name. `g10.auction-winner-order.US2-TC2`
10. Click `<tracking number>`.
   - Step 10: the tracker link opens. `g10.auction-winner-order.US2-TC2`
11. Read the shipment section of `<winner_order_57_2>`.
   - Step 11: `<tracking number>` shows as plain text, with no carrier name and no Track shipment control. `g10.auction-winner-order.US2-TC2`
12. Wait for the delivery report to be processed.
13. Navigate to `<winner order url>` for `<winner_order_58_1>`.
14. Open the delivery proof.
   - `<handover time>` and `<signature>` show, not only a delivered flag. `g10.auction-winner-order.US2-TC3`
15. Download the receipt PDF.
   - The receipt ID is `<receipt id>`. `g10.auction-winner-order.US2-TC9`
   - Original Invoice Total `<total>`; Previous Payments 0. `g10.auction-winner-order.US2-TC9`
   - Current Payment Received `<total>`; Remaining Balance Due 0. `g10.auction-winner-order.US2-TC9`
16. Retrieve `<winner_order_60_1>`'s documents from the archive.
   - The replaced invoice, current invoice and receipt PDFs are all returned. `g10.auction-winner-order.US2-TC10`
17. Deliver the same payment confirmation for `<winner_order_61_1>` again.
18. Open the receipt on `<winner order url>` for `<winner_order_61_1>`.
   - The receipt ID is still `<receipt id>`. `g10.auction-winner-order.US2-TC11`
   - No second receipt ID or audit number exists for `<winner_order_61_1>`. `g10.auction-winner-order.US2-TC11`
19. Read Order Progress.
20. Open `<tracking number>`.
   - Order Progress shows `<tracking number>` as an external link with an arrow icon. `g10.auction-winner-order.US2-TC12`
   - Order Progress shows no Track shipment button or carrier name. `g10.auction-winner-order.US2-TC12`
   - Step 20 opens `<carrier tracking url>` in a new tab. `g10.auction-winner-order.US2-TC12`
21. Read the status badge.
22. Read Order Progress.
   - Badge reads Preparing Shipment. `g10.auction-winner-order.US2-TC55`
   - Badge uses `default`. `g10.auction-winner-order.US2-TC55`
   - Shipping is the current (progress) progress step — not incomplete. `g10.auction-winner-order.US2-TC55`
   - Shipping subtext reads Preparing to ship. `g10.auction-winner-order.US2-TC55`
   - No step is labelled Preparing Shipment. `g10.auction-winner-order.US2-TC55`
23. Read the status badge and Order Progress.
   - Badge reads Shipped and uses `default`. `g10.auction-winner-order.US2-TC20`
   - Shipping is the current progress step with the day-only ship date. `g10.auction-winner-order.US2-TC20`
   - The tracking number is the external carrier link. `g10.auction-winner-order.US2-TC20`
   - Order Progress adds no separate Track shipment control and no separate carrier name. `g10.auction-winner-order.US2-TC20`
24. Read Order Progress.
25. Select `<tracking number>`.
   - Order Progress shows `<tracking number>` as plain text, not a link. `g10.auction-winner-order.US2-TC14`
   - Order Progress shows no carrier name and no Track shipment control. `g10.auction-winner-order.US2-TC14`
   - Step 25 opens nothing. `g10.auction-winner-order.US2-TC14`

## Walk 7: Winner follows a settled listing to delivery and adjacent checks

**Starting state:**

**Steps 1–1 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_66_1>`.

**Steps 2–5 setup:**

- admin(operator with payment-processing) holds a USD order in Preparing Invoice; its winning bid is `<winning_bid>` and it has no other invoice lines.
- Auction Payment settings holds the USD premium minimum `<premium_minimum>`.
- The winner order under test is `<winner_order_67_1>`.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| winner_order_66_1 | A paid, fulfilled order with a ship date and a tracking number, and no recorded tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 2–5 data:**

| `<winning_bid>` | `<premium_minimum>` | `<buyers_premium>` | `<final_amount>` | Rule | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| USD1,350 | USD0 | USD270.00 | USD1 | 20% of the winning bid | `<winning_bid>`: (range: 80000-399999 minor units); `<final_amount>`: 620.00 |
| USD10.03 | USD0 | USD2.01 | USD12.04 | 20% is 200.6 minor units, rounded half up | `<winning_bid>`: (fixed boundary) |
| USD10.02 | USD0 | USD2.00 | USD12.02 | 20% is 200.4 minor units, rounded half up | `<winning_bid>`: (fixed boundary) |
| USD50 | USD20 | USD20.00 | USD70.00 | The minimum, higher than 20% (USD10) | `<winning_bid>`: (fixed fixture); `<premium_minimum>`: (fixed configured value) |
| USD2,500 | USD200.00 | USD500.00 | USD3 | 20% of the winning bid; operator does not enter it | `<winning_bid>`: (fixed scenario fixture); `<premium_minimum>`: (fixed configured value); `<final_amount>`: 000.00 |

| Field | Value |
| --- | --- |
| winner_order_67_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Read Order Progress.
   - Shipping is the current progress step with the day-only ship date. `g10.auction-winner-order.US2-TC56`
   - The tracking number reads as plain text, not a link. `g10.auction-winner-order.US2-TC56`
   - Order Progress shows no carrier name and no Track shipment control. `g10.auction-winner-order.US2-TC56`
2. As the operator, open Send Invoice and read the quote fields.
   - Step 2: no buyer's premium input is shown or requested from the operator. `g10.auction-winner-order.US3-TC5`
3. Send the invoice without entering a buyer's premium.
   - Step 3: the invoice is sent with Buyer's Premium of `<buyers_premium>`, equal to the greater of 20% of `<winning_bid>` rounded half up to USD cents and `<premium_minimum>`. `g10.auction-winner-order.US3-TC5`
4. As the winner, read Order Summary.
   - Step 4: the winning bid line reads `<winning_bid>` and Buyer's Premium reads `<buyers_premium>`. `g10.auction-winner-order.US3-TC5`
   - Step 4: the total equals `<final_amount>`, equal to `<winning_bid>` plus `<buyers_premium>`. `g10.auction-winner-order.US3-TC5`
5. Hover the Buyer's Premium info tooltip.
   - Step 5: a brief tooltip explains Buyer's Premium. `g10.auction-winner-order.US3-TC5`

## Walk 8: Winner pays an invoice by card

**Starting state:**

**Steps 1–1 setup:**

- customer(winner) holds an order in Pending Payment, with invoice status.
- `pending` or `expired`.
- The winner order under test is `<winner_order_68_1>`.

**Steps 2–5 setup:**

- customer(winner) holds an order in Pending Payment.
- The winner order under test is `<winner_order_69_1>`.

**Steps 6–7 setup:**

- customer(winner) holds a Pending Payment order whose last payment session was abandoned.
- The winner order under test is `<winner_order_70_1>`.

**Steps 8–8 setup:**

- customer(winner) completed a hosted card session, but the authenticated.
- auction-order read model has not yet recorded the invoice as paid.
- The winner order under test is `<winner_order_71_1>`.

**Steps 9–9 setup:**

- customer(winner) holds an order whose authenticated auction-order read model.
- returns invoice status `paid` and fulfilment status `unfulfilled`.
- The winner order under test is `<winner_order_72_1>`.

**Steps 10–12 setup:**

- customer(winner) is suspended from bidding and holds an order whose invoice.
- is `pending`.
- The winner order under test is `<winner_order_73_1>`.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| winner_order_68_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 2–5 data:**

| Field | Value |
| --- | --- |
| winner_order_69_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| winner_order_70_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–8 data:**

| Field | Value |
| --- | --- |
| winner_order_71_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 9–9 data:**

| Field | Value |
| --- | --- |
| winner_order_72_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 10–12 data:**

| Field | Value |
| --- | --- |
| winner_order_73_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Navigate to `<winner order url>`.
   - Every invoice line and Pay with Card are shown in the order summary. `g10.auction-winner-order.US4-TC1`
   - The confirmed delivery address and the listing are shown. `g10.auction-winner-order.US4-TC1`
   - An expired invoice still reads Pending Payment and offers Contact Us instead. of Pay with Card. `g10.auction-winner-order.US4-TC1`
2. Navigate to `<winner order url>`.
3. Click Pay Now.
4. Wait until the payment session times out.
5. Return to `<winner order url>`.
   - The page says payment was not completed. `g10.auction-winner-order.US4-TC3`
   - The order still reads Pending Payment. `g10.auction-winner-order.US4-TC3`
   - Pay Now is available. `g10.auction-winner-order.US4-TC3`
6. Navigate to `<winner order url>`.
7. Click Pay Now.
   - A new payment session opens. `g10.auction-winner-order.US4-TC4`
   - It charges the same invoice amount. `g10.auction-winner-order.US4-TC4`
8. Navigate to `<winner order url>`.
   - The page shows Confirming payment. `g10.auction-winner-order.US4-TC5`
   - The order does not read Preparing Shipment. `g10.auction-winner-order.US4-TC5`
9. Navigate to `<winner order url>`.
   - The order status reads Preparing Shipment. `g10.auction-winner-order.US4-TC6`
10. Navigate to `<winner order url>`.
11. Read the alerts under the listing.
12. Choose Pay what is owed.
   - An alert under the listing says bidding is suspended and payment does not lift it. `g10.auction-winner-order.US4-TC7`
   - Choosing Pay what is owed brings the order summary's pay control into view. `g10.auction-winner-order.US4-TC7`

## Walk 9: Winner misses the payment deadline

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_74_1>`.

**Steps 3–3 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_75_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_74_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–3 data:**

| Field | Value |
| --- | --- |
| winner_order_75_1 | An unpaid order an operator cancelled; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Read the status and the inline alert.
   - Step 1: the order reads Payment Overdue, with Contact Us. `g10.auction-winner-order.US5-TC1`
2. Look for payment controls.
   - Step 2: no card Pay is offered and no payment deadline shows. `g10.auction-winner-order.US5-TC1`
3. Read the page.
   - No progress stepper shows. `g10.auction-winner-order.US5-TC2`
   - No invoice PDF control shows. `g10.auction-winner-order.US5-TC2`

## Walk 10: Winner misses the address deadline

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_76_1>`.

**Steps 3–4 setup:**

- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup, whose listing closed 48 hours ago, with setup not confirmed.
- admin(operator with payment processing).
- The winner order under test is `<winner_order_77_1>`.

**Steps 5–5 setup:**

- customer(winner) added a one-time delivery address to an auction order without saving it and did not confirm before the setup deadline.
- admin(operator with payment processing) reopened its setup after the deadline passed.
- The winner order under test is `<winner_order_78_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_76_1 | An order whose setup deadline, 172800s (48 hours) after the close, passed with setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| winner_order_77_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 5–5 data:**

| Field | Value |
| --- | --- |
| winner_order_78_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Read the status and the inline alert.
   - Step 1: the order reads Setup Overdue, with Contact Us. `g10.auction-winner-order.US7-TC1`
2. Look for setup controls.
   - Step 2: no Confirm and no address editing are offered. `g10.auction-winner-order.US7-TC1`
3. As the winner, open the order.
4. As the operator, open the order and read what it offers.
   - The winner's order reads Setup Overdue. `g10.auction-winner-order.US7-TC5`
   - The operator can reopen or record its setup. `g10.auction-winner-order.US7-TC5`
5. As the winner, open the order and read the address picker.
   - The picker does not offer the one-time address. `g10.auction-winner-order.US7-TC6`

## Walk 11: Winner pays an invoice with a policy premium

**Starting state:**

**Steps 1–1 setup:**

- A USD winner's sent invoice has winning bid `<winning bid>`, configured minimum `<premium minimum>` and no other lines.

**Steps 2–2 setup:**

- A USD winner's sent invoice has a winning bid whose 20% premium is below the minimum.

**Steps 3–3 setup:**

- The USD premium minimum is 0.

**Steps 4–7 setup:**

- `<winner_order_82_1>`'s invoice was sent while the USD minimum was 0.

**Shared test data:**

**Steps 1–1 data:**

| `<winning bid>` | `<premium minimum>` | `<buyers premium>` | `<final amount>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD2,400 | USD0 | USD480.00 | USD2 | `<winning bid>`: (fixed fixture); `<final amount>`: 880.00 |
| USD2,500 | USD200.00 | USD500.00 | USD3 | `<winning bid>`: (fixed fixture); `<final amount>`: 000.00 |
| USD1.01 | USD0 | USD0.20 | USD1.21 | `<winning bid>`: (fixed boundary) |

**Steps 2–2 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD1 | (range: >0 minor units) |
| minimum premium | USD1 | (fixed configured minimum) |

**Steps 3–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD10.03 | (fixed boundary: 20% is a half minor unit away from a whole one) |
| premium | USD2.01 | 20% is 200.6 minor units, rounded half up |

**Steps 4–7 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_82_1 | A USD order won at USD7, invoice sent with premium `<sent premium>`; bind its identity only | · |
| sent premium | USD1.40 | 20% of USD7 |
| new minimum | USD20 | (fixed configured value) |

### Route

1. Read the invoice winning bid, buyer's premium and final amount.
   - The premium `<buyers premium>` is the greater of 20% of `<winning bid>`, rounded half up, or `<premium minimum>`. `g10.auction-winner-order.US8-TC1`
   - The final amount `<final amount>` includes `<buyers premium>`. `g10.auction-winner-order.US8-TC1`
   - For the USD1.01 row, the premium is USD0.20, an integer count of USD minor units. `g10.auction-winner-order.US8-TC1`
2. Read the invoice winning bid and buyer's premium.
   - The premium equals `<minimum premium>` because 20% of `<winning bid>` is lower. `g10.auction-winner-order.US8-TC2`
3. Compute the premium for `<winning bid>`.
   - The premium is `<premium>`. `g10.auction-winner-order.US8-TC3`
4. Set the USD premium minimum to `<new minimum>`.
5. Read the API response for `<winner_order_82_1>`'s sent invoice.
   - Step 5: the premium is still `<sent premium>`. `g10.auction-winner-order.US8-TC4`
6. Reissue `<winner_order_82_1>`'s invoice.
7. Read the API response for the reissued invoice.
   - Step 7: the premium is `<new minimum>`. `g10.auction-winner-order.US8-TC4`

## Walk 12: Winner pays an invoice by bank transfer — phase 1

**Starting state:**

**Steps 1–4 setup:**

- Outside production, Grade10 holds FPS bank details and Payment Settings holds an HKD card fee rule.
- customer(winner) holds an HKD auction order in Awaiting Setup with a saved home address.
- The winner order under test is `<winner_order_84_1>`.

**Steps 5–7 setup:**

- customer(winner) is on `<winner order url>` for `<order bt>`.
- The winner order under test is `<winner_order_85_1>`.

**Steps 8–10 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_86_1>`.

**Steps 11–13 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_87_1>`.

**Steps 14–16 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_88_1>`.

**Steps 17–19 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_89_1>`.

**Steps 20–23 setup:**

- customer(winner) is on `<winner order url>` for `<order bt>`.
- The winner order under test is `<winner_order_90_1>`.

**Steps 24–24 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_91_1>`.

**Steps 25–25 setup:**

- `<winner_order_92_1>` reads Payment Verifying for customer A.

**Steps 26–26 setup:**

- customer A's order is in the state `<order state>`.
- The order is prepared as follows: `<fixture setup>`.
- The winner order under test is `<winner_order_93_1>`.

**Steps 27–27 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_94_1>`.
- The order has this setup: `<order state>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value |
| --- | --- |
| winner_order_84_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| time left | 2 days 6 hours (194400s) before the payment deadline |
| proof | One PDF under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_85_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–10 data:**

| `<proof files>` |
| --- |
| 1 JPEG (lower limit) |
| 1 PNG |
| 1 HEIC |
| 3 files mixing PDF, JPEG and PNG (upper limit) |

| Field | Value |
| --- | --- |
| winner_order_86_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 11–13 data:**

| `<proof files>` |
| --- |
| 0 files |
| 4 files, each allowed and under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_87_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 14–16 data:**

| Field | Value |
| --- | --- |
| winner_order_88_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | One PDF of 5242880 bytes (5 MiB), at the limit |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 17–19 data:**

| `<proof files>` |
| --- |
| A GIF image |
| A Word document |
| Four PDFs and one HEIC image |

| Field | Value |
| --- | --- |
| winner_order_89_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 20–23 data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| proof | Two PNG files |

| Field | Value |
| --- | --- |
| winner_order_90_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 24–24 data:**

| Field | Value |
| --- | --- |
| winner_order_91_1 | An order reading Payment Verifying; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 25–25 data:**

| Field | Value |
| --- | --- |
| winner_order_92_1 | customer A's order, proof uploaded, reading Payment Verifying; bind its identity only |

**Steps 26–26 data:**

| `<order state>` | `<fixture setup>` |
| --- | --- |
| Payment Verifying | Proof uploaded, order reads Payment Verifying |
| Pending Payment | Sent bank-transfer invoice, order reads Pending Payment |

| Field | Value |
| --- | --- |
| winner_order_93_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 27–27 data:**

| `<order state>` |
| --- |
| Preparing Invoice, bank transfer chosen |
| Card invoice sent, unpaid |
| Bank-transfer invoice paid |

| Field | Value |
| --- | --- |
| winner_order_94_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Choose HKD and FPS, then confirm the home address.
2. As the operator, send the invoice for bank transfer on FPS.
3. As the winner, open View Bank Details.
4. Read the dialog and payment reference.
   - The invoice names the selected FPS rail and its reference. `g10.auction-winner-order.US9-TC1`
   - The dialog shows FPS ID, account name and an FPS QR only, without rail tabs or copy controls. `g10.auction-winner-order.US9-TC1`
   - No HK Local or SWIFT details show. `g10.auction-winner-order.US9-TC1`
5. Click Submit Payment Proof.
6. Choose `<proof>`.
7. Submit the proof.
   - A toast reads Proof submitted and We'll verify your payment shortly. `g10.auction-winner-order.US9-TC2`
   - The order reads Payment Verifying. `g10.auction-winner-order.US9-TC2`
   - The deadline stops with `<time left>` kept. `g10.auction-winner-order.US9-TC2`
   - A default inline Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed: under Order progress on small viewports and under the listing from `lg` up. `g10.auction-winner-order.US9-TC2`
   - Card Pay, Submit Payment Proof, View Bank Details and further uploads are hidden. `g10.auction-winner-order.US9-TC2`
   - `<proof>` and its file name are not shown. `g10.auction-winner-order.US9-TC2`
8. Click Submit Payment Proof.
9. Choose `<proof files>`.
10. Submit, then accept the confirm step.
   - The upload is accepted, every file kept (HEIC stored as JPEG). `g10.auction-winner-order.US9-TC3`
   - The order reads Payment Verifying. `g10.auction-winner-order.US9-TC3`
11. Click Submit Payment Proof.
12. Choose `<proof files>`.
13. Submit.
   - The upload is refused and says why. `g10.auction-winner-order.US9-TC4`
   - The order still reads Pending Payment; the deadline runs. `g10.auction-winner-order.US9-TC4`
14. Click Submit Payment Proof.
15. Choose `<proof>`.
16. Submit, then accept the confirm step.
   - The upload is accepted. `g10.auction-winner-order.US9-TC5`
   - The order reads Payment Verifying. `g10.auction-winner-order.US9-TC5`
17. Click Submit Payment Proof.
18. Choose `<proof files>`.
19. Submit.
   - The whole upload is refused, naming the allowed types. `g10.auction-winner-order.US9-TC6`
   - Nothing is stored; the order still reads Pending Payment. `g10.auction-winner-order.US9-TC6`
20. Click Submit Payment Proof.
21. Choose `<proof>`.
22. Read the inline warning that files cannot be added or changed after submission.
23. Cancel without submitting.
   - No second confirm screen is shown. `g10.auction-winner-order.US9-TC7`
   - No proof is stored. `g10.auction-winner-order.US9-TC7`
   - The order still reads Pending Payment; the deadline runs. `g10.auction-winner-order.US9-TC7`
   - Submit Payment Proof is still offered. `g10.auction-winner-order.US9-TC7`
24. Read the progress stepper's Payment step and the deadline.
   - Payment is the current step, its subtext naming no date. `g10.auction-winner-order.US9-TC8`
   - No payment deadline shows as running. `g10.auction-winner-order.US9-TC8`
25. As customer A, send a second proof upload for `<winner_order_92_1>` through the API.
   - The upload is refused. `g10.auction-winner-order.US9-TC9`
   - The first proof set is unchanged. `g10.auction-winner-order.US9-TC9`
26. As customer A, send a card payment for the order through the API.
   - The payment is refused; no charge is made. `g10.auction-winner-order.US9-TC10`
   - The order still reads the state `<order state>`. `g10.auction-winner-order.US9-TC10`
27. Open the payment area.
   - No proof upload is offered. `g10.auction-winner-order.US9-TC11`

## Walk 13: Winner pays an invoice by bank transfer — phase 2

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_95_1>`.

**Steps 3–4 setup:**

- `<winner_order_96_1>` belongs to customer A.
- customer B is signed in, in a separate session.

**Steps 5–8 setup:**

- customer(winner) is on `<winner order url>` for `<order bt>`.
- The connection is set to drop during upload.
- The winner order under test is `<winner_order_97_1>`.

**Steps 9–9 setup:**

- `<winner_order_98_1>`'s invoice is sent.

**Steps 10–12 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_99_1>`.

**Steps 13–13 setup:**

- customer A's `<winner_order_100_1>` reads Pending Payment.

**Steps 14–15 setup:**

- `<winner_order_101_1>` reached Payment Verifying before its payment deadline.

**Steps 16–18 setup:**

- customer(winner of `<winner_order_102_1>` and `<winner_order_102_2>`) is signed in.
- The browser may use the clipboard.

**Steps 19–20 setup:**

- customer(winner) is signed in on `<winner order url>` for `<winner_order_103_1>`.
- Submit Payment Proof is open.

**Steps 21–23 setup:**

- Grade10 holds the sample bank details for each rail outside production, and Payment Settings holds a card fee rule in `<settlement currency>`.
- customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.
- The winner order under test is `<winner_order_104_1>`.

**Steps 24–25 setup:**

- Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
- customer(winner) holds an auction order in HKD in Awaiting Setup.
- The winner order under test is `<winner_order_105_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_95_1 | A bank-transfer order past its payment deadline, unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| winner_order_96_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

**Steps 5–8 data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| proof | Three allowed files under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_97_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 9–9 data:**

| Field | Value |
| --- | --- |
| winner_order_98_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| listing code | LK7P2Q, the listing's code |
| reference | LK7P2Q01: `<listing code>` then the two-digit invoice count |

**Steps 10–12 data:**

| Field | Value |
| --- | --- |
| winner_order_99_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | One PDF of 5242881 bytes (5 MiB + 1 byte) with two small PNGs |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 13–13 data:**

| Field | Value |
| --- | --- |
| winner_order_100_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | An executable renamed to .pdf |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| winner_order_101_1 | An order reading Payment Verifying, no operator action yet; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–18 data:**

| Field | Value |
| --- | --- |
| winner_order_102_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| reference | LK7P2Q01, `<winner_order_102_1>`'s bank reference |
| winner_order_102_2 | An order with a sent card invoice, unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 19–20 data:**

| `<busy work>` | `<leave route>` |
| --- | --- |
| Proof submission in progress | Cancel |
| HEIC conversion in progress | Escape |
| Proof submission in progress | Overlay dismiss |

| Field | Value |
| --- | --- |
| winner_order_103_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 21–23 data:**

| `<settlement currency>` | `<rail>` |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

| Field | Value |
| --- | --- |
| winner_order_104_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 24–25 data:**

| Field | Value |
| --- | --- |
| winner_order_105_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Open the payment area.
   - Step 1: no proof upload is offered; the overdue alert shows Contact Us. `g10.auction-winner-order.US9-TC12`
2. Send a proof upload for `<winner_order_95_1>` through the API.
   - Step 2: the upload is refused; the order still reads Payment Overdue. `g10.auction-winner-order.US9-TC12`
3. As customer B, send a proof upload for `<winner_order_96_1>` through the API.
4. As customer B, request `<winner_order_96_1>`'s proof.
   - Both requests are refused. `g10.auction-winner-order.US9-TC13`
   - `<winner_order_96_1>` still reads Pending Payment. `g10.auction-winner-order.US9-TC13`
5. Click Submit Payment Proof.
6. Choose `<proof>` and submit.
7. Let the connection drop during upload.
   - Step 7: Submit Payment Proof stays open with `<proof>` selected. `g10.auction-winner-order.US9-TC14`
   - Step 7: a toast reads Proof not submitted and Nothing was saved. Try again. `g10.auction-winner-order.US9-TC14`
   - Step 7: the order reads Pending Payment; the deadline runs; nothing is stored. `g10.auction-winner-order.US9-TC14`
8. Restore the connection and submit `<proof>` again.
   - Step 8: the upload is accepted. `g10.auction-winner-order.US9-TC14`
9. Read `<winner_order_98_1>`'s bank reference.
   - It reads `<reference>`. `g10.auction-winner-order.US9-TC15`
   - 8 characters, capitals and digits only, no hyphen, space or symbol. `g10.auction-winner-order.US9-TC15`
   - It fits one 35-character SWIFT remittance line. `g10.auction-winner-order.US9-TC15`
10. Click Submit Payment Proof.
11. Choose `<proof>`.
12. Submit.
   - The whole upload is refused, naming the 5 MB limit. `g10.auction-winner-order.US9-TC16`
   - None of the three files is stored; the order still reads Pending Payment. `g10.auction-winner-order.US9-TC16`
13. As customer A, send `<proof>` as a proof upload through the API.
   - The whole upload is refused. `g10.auction-winner-order.US9-TC17`
   - Nothing is stored; the order still reads Pending Payment. `g10.auction-winner-order.US9-TC17`
14. Move the clock past the original payment deadline.
15. Open `<winner order url>` for `<winner_order_101_1>` as its winner.
   - The order still reads Payment Verifying, not Payment Overdue. `g10.auction-winner-order.US9-TC19`
16. Open `<winner order url>` for `<winner_order_102_1>`.
17. Click the copy control beside the bank reference, then paste.
   - Step 17 pastes exactly `<reference>`, no space. `g10.auction-winner-order.US9-TC20`
18. Open `<winner order url>` for `<winner_order_102_2>`.
   - Step 18 shows no bank reference and no copy control. `g10.auction-winner-order.US9-TC20`
19. Start `<busy work>`.
20. Use `<leave route>`.
   - Submit Payment Proof stays open. `g10.auction-winner-order.US9-TC30`
   - The form remains locked until `<busy work>` finishes. `g10.auction-winner-order.US9-TC30`
21. Choose `<settlement currency>` and read the method choices.
   - Step 21: Card and the `<rail>` option are offered, none selected. `g10.auction-winner-order.US9-TC22`
22. Confirm the delivery address with `<rail>`.
23. Reload the order.
   - Step 23: the order records bank transfer on `<rail>` and reads Preparing Invoice. `g10.auction-winner-order.US9-TC22`
24. Choose the home address and reach the payment method choice.
25. Read each method.
   - Card reads `Card fee about 3.4% + a fixed amount`. `g10.auction-winner-order.US9-TC23`
   - Bank transfer reads `Bank fee set on your invoice`, naming no amount. `g10.auction-winner-order.US9-TC23`
   - Neither method is selected. `g10.auction-winner-order.US9-TC23`

## Walk 14: Winner pays an invoice by bank transfer — phase 3

**Starting state:**

**Steps 1–5 setup:**

- customer(winner) is signed in on `<winner order url>` for `<winner_order_106_1>`.

**Steps 6–6 setup:**

- customer(winner) is signed in on `<winner order url>` for `<winner_order_107_1>`.

**Steps 7–8 setup:**

- customer(winner) is on Winner Order for `<winner_order_108_1>`, whose invoice is pending and picked rail is `<rail>`.
- The invoice is in `<settlement currency>` on rail `<rail>`.

**Steps 9–9 setup:**

- customer(winner) is signed in on `<winner order url>` for `<winner_order_109_1>`.

**Shared test data:**

**Steps 1–5 data:**

| Field | Value |
| --- | --- |
| winner_order_106_1 | An auction order whose invoice was sent for bank transfer and is pending; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–6 data:**

| Field | Value |
| --- | --- |
| winner_order_107_1 | An HKD auction order whose invoice was sent for FPS and is pending; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_108_1 | An auction order whose invoice was sent for `<rail>` and is pending; bind its identity only |

| `<settlement currency>` | `<rail>` |
| --- | --- |
| HKD | HK Local |
| USD | International via SWIFT |

**Steps 9–9 data:**

| Field | Value |
| --- | --- |
| winner_order_109_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Open `<winner order url>` for `<winner_order_106_1>`.
2. Read Order summary.
3. Choose View Bank Details.
4. Close View Bank Details.
5. Choose Submit Payment Proof.
   - Order summary shows Submit Payment Proof with View Bank Details under it. `g10.auction-winner-order.US9-TC21`
   - View Bank Details opens the View Bank Details dialog. `g10.auction-winner-order.US9-TC21`
   - Submit Payment Proof opens the Submit Payment Proof dialog. `g10.auction-winner-order.US9-TC21`
6. Open View Bank Details from Order summary.
   - FPS ID, account name and an FPS QR are shown. `g10.auction-winner-order.US9-TC32`
   - Amount due is shown without Copy. `g10.auction-winner-order.US9-TC32`
   - The bank reference is shown as a detail row without Copy at the bottom. `g10.auction-winner-order.US9-TC32`
   - No HK Local or SWIFT details are shown. `g10.auction-winner-order.US9-TC32`
7. Read the invoice actions and open View Bank Details.
8. Read the bank details.
   - No card Pay control is offered on the bank transfer invoice. `g10.auction-winner-order.US9-TC24`
   - No rail tabs show, and only `<rail>` shows. `g10.auction-winner-order.US9-TC24`
   - No bank-detail row has a copy control. `g10.auction-winner-order.US9-TC24`
   - HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference. `g10.auction-winner-order.US9-TC24`
   - SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference and memo warning, then the OUR charges note after the reference. `g10.auction-winner-order.US9-TC24`
   - Only `<rail>` shows. `g10.auction-winner-order.US9-TC24`
9. Choose Submit Payment Proof.
   - The dialog title is Submit Payment Proof. `g10.auction-winner-order.US9-TC25`
   - Amount due and transfer reference are not shown. `g10.auction-winner-order.US9-TC25`
   - No FPS, HK Local or SWIFT tab is shown. `g10.auction-winner-order.US9-TC25`

## Walk 15: Winner's payment proof is not accepted

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_110_1>`.

**Steps 3–4 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_111_1>`.

**Steps 5–6 setup:**

- `<winner_order_112_1>` reads Payment Verifying with `<time left>` kept.

**Steps 7–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_113_1>`.

**Steps 8–9 setup:**

- `<winner_order_114_1>` was returned once, uploaded again with `<time left 2>` kept, and reads Payment Verifying.

**Steps 10–11 setup:**

- customer(winner) chose bank transfer and uploaded proof for `<winner_order_115_1>`.
- An operator returned the proof with `<return reason>`.
- customer is on `<winner_order_115_1>`'s Winner Order page.

**Steps 12–12 setup:**

- customer(winner)'s proof for `<winner_order_116_1>` was returned with `<first reason>`.
- The winner uploaded proof again, and it was returned with `<second reason>`.
- customer is on `<winner_order_116_1>`'s Winner Order page.

**Steps 13–14 setup:**

- customer(winner) uploaded proof for `<winner_order_117_1>`; no letter was sent on upload.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_110_1 | A bank-transfer order whose proof an operator returned with `<external reason>` and `<internal reason>`; bind its identity only |
| external reason | Amount received does not match |
| internal reason | A note for operators only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| winner_order_111_1 | A bank-transfer order whose proof was returned, inside its deadline; bind its identity only |
| proof | One new PDF under 5 MB |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–6 data:**

| `<time left>` | Fixture notes |
| --- | --- |
| 60s | `<time left>`: (1 minute) |
| 604740s | `<time left>`: (6 days 23 hours 59 minutes) |

| Field | Value |
| --- | --- |
| winner_order_112_1 | A bank-transfer order reading Payment Verifying; bind its identity only |

| Field | Value |
| --- | --- |
| return time | The fixture timestamp when the operator returns the proof; bind its datetime only |

**Steps 7–7 data:**

| Field | Value |
| --- | --- |
| winner_order_113_1 | A bank-transfer order returned with 60s left, and that minute has passed; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–9 data:**

| Field | Value |
| --- | --- |
| winner_order_114_1 | A bank-transfer order on its second check; bind its identity only |
| time left 2 | The time left at the second upload |

| Field | Value |
| --- | --- |
| return time | The fixture timestamp when the operator returns the proof; bind its datetime only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| winner_order_115_1 | An order whose invoice was sent, proof uploaded `<time left>` before its payment deadline; bind its identity only |
| time left | 2 days (172800s), a time inside the 7-day payment window |
| return reason | The reason text the operator entered for the winner |
| return time | 18 hours after the upload |

**Steps 12–12 data:**

| Field | Value |
| --- | --- |
| winner_order_116_1 | An order paid by bank transfer, inside its payment window; bind its identity only |
| first reason | Amount does not match |
| second reason | Reference missing from the transfer |

**Steps 13–14 data:**

| Field | Value |
| --- | --- |
| winner_order_117_1 | An order paid by bank transfer, `<time left>` before its payment deadline at upload; bind its identity only |
| time left | 2 days (172800s) |
| return reason | The reason text the operator enters for the winner |

### Route

1. Read the order.
2. Download the invoice PDF and read it.
   - `<external reason>` shows. `g10.auction-winner-order.US10-TC2`
   - `<internal reason>` appears on neither. `g10.auction-winner-order.US10-TC2`
3. Click Submit Payment Proof.
4. Choose `<proof>`, submit and accept the confirm step.
   - The order reads Payment Verifying again. `g10.auction-winner-order.US10-TC3`
   - The deadline stops with the time then left. `g10.auction-winner-order.US10-TC3`
5. Return the proof at `<return time>`.
6. Read the API response for the new deadline.
   - The deadline is `<return time>` plus `<time left>`. `g10.auction-winner-order.US10-TC4`
7. Read the status and the payment area.
   - The order reads Payment Overdue. `g10.auction-winner-order.US10-TC5`
   - Proof upload is hidden; the overdue alert shows Contact Us. `g10.auction-winner-order.US10-TC5`
8. Return the proof again at `<return time>`.
9. Read the API response for the new deadline.
   - The deadline is `<return time>` plus `<time left 2>`. `g10.auction-winner-order.US10-TC6`
10. Read the order status and the alert.
   - Step 10: the order no longer reads Payment Verifying. `g10.auction-winner-order.US10-TC8`
   - Step 10: `<return reason>` is shown to the winner. `g10.auction-winner-order.US10-TC8`
11. Read the payment deadline.
   - Step 11: Pay by reads `<return time>` plus `<time left>`. `g10.auction-winner-order.US10-TC8`
   - Step 11: Submit Payment Proof and View Bank Details are offered again. `g10.auction-winner-order.US10-TC8`
12. Read the page.
   - `<second reason>` is shown. `g10.auction-winner-order.US10-TC9`
   - `<first reason>` is not shown. `g10.auction-winner-order.US10-TC9`
   - No proof file or file name is shown. `g10.auction-winner-order.US10-TC9`
13. Have an operator return the proof with `<return reason>`.
14. Read the mail sent to the winner's registered email.
   - One Proof not accepted letter carrying `<return reason>`. `g10.auction-winner-order.US10-TC10`
   - Its Pay by equals the return time plus `<time left>`. `g10.auction-winner-order.US10-TC10`
   - No payment reminder was sent while the proof was under check. `g10.auction-winner-order.US10-TC10`

## Walk 16: Winner bills a won listing to a different address

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) is on Complete Order Setup for `<winner_order_118_1>`.

**Steps 3–4 setup:**

- customer(winner) is on billing Add Address for `<winner_order_119_1>`, with form mode `<form mode>` and missing field `<missing field>`.

**Steps 5–8 setup:**

- customer(winner) is on Complete Order Setup for `<winner_order_120_1>`, delivery confirmed to `<address_sf>`.

**Steps 9–11 setup:**

- customer(winner) is on billing Add Address of an auction order in Awaiting Setup, after unticking Same as delivery address.
- The winner order under test is `<winner_order_121_1>`.

**Steps 12–14 setup:**

- customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
- On it, after unticking Same as delivery address, they added a one-time billing address without saving it, and have not confirmed.
- The winner order under test is `<winner_order_122_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_118_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps 3–4 data:**

| `<form mode>` | `<missing field>` | `<phone country>` | `<phone digits>` | `<company name>` |
| --- | --- | --- | --- | --- |
| Personal | Phone | Canada | (empty) | Not shown |
| Company | Company Name | Canada | 4165550100 | (empty) |

| Field | Value |
| --- | --- |
| winner_order_119_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 5–8 data:**

| Field | Value |
| --- | --- |
| winner_order_120_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_sf | A personal address for Alex Chen, 100 Market St, San Francisco |
| Kind | Company |
| Company Name | Northwind Billing Ltd |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550199 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| winner_order_121_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 12–14 data:**

| Field | Value |
| --- | --- |
| winner_order_122_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Untick Same as delivery address.
2. Open Add Address for billing.
   - The Personal / Company control shows above the fields, Personal selected. `g10.auction-winner-order.US11-TC1`
   - Phone shows a country selector, starting empty with a globe only. `g10.auction-winner-order.US11-TC1`
   - Company Name is hidden. `g10.auction-winner-order.US11-TC1`
3. Prepare mode `<form mode>`, phone country `<phone country>`, phone digits `<phone digits>` and Company Name `<company name>` where shown; leave `<missing field>` unset.
4. Click confirm.
   - The confirm is refused, with a message beside `<missing field>`. `g10.auction-winner-order.US11-TC2`
   - The order's billing address is unchanged. `g10.auction-winner-order.US11-TC2`
5. Untick Same as delivery address.
6. Open billing Add Address.
7. Fill address_sf `<address_sf>`, Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
8. Confirm billing.
   - Delivery still reads `<address_sf>`. `g10.auction-winner-order.US11-TC4`
   - Billing reads Northwind Billing Ltd, Toronto, with the phone. `g10.auction-winner-order.US11-TC4`
9. Open the Country/Region picker and read the list.
10. Open delivery Add Address's picker and read its list.
11. Back on billing, type `Jap`.
   - The billing list holds every country and region in A-Z order, the same list as delivery. `g10.auction-winner-order.US11-TC5`
   - Typing leaves only the names that match `Jap`, Japan among them. `g10.auction-winner-order.US11-TC5`
12. Leave the order for another page, then return to it.
13. Read the billing addresses offered.
14. Open the account address book.
   - The one-time billing address is still offered for billing. `g10.auction-winner-order.US11-TC6`
   - The address book does not hold the one-time billing address. `g10.auction-winner-order.US11-TC6`

## Walk 17: Winner confirms delivery when five addresses are already saved — phase 1

**Starting state:**

**Steps 1–2 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_123_1>`.

**Steps 3–7 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_124_1>`.

**Steps 8–10 setup:**

- customer(winner, five saved shipping addresses) is on delivery Add new address for `<winner_order_125_1>`.

**Steps 11–12 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_126_1>`.

**Steps 13–17 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_127_1>`.

**Steps 18–20 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_128_1>`.

**Steps 21–24 setup:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_129_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_123_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–7 data:**

| Field | Value |
| --- | --- |
| winner_order_124_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–10 data:**

| Field | Value |
| --- | --- |
| winner_order_125_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | (empty) |
| First name | Jordan |
| Last name | Lee |
| Phone country | (not chosen) |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps 11–12 data:**

| Field | Value |
| --- | --- |
| winner_order_126_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 13–17 data:**

| Field | Value |
| --- | --- |
| winner_order_127_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 18–20 data:**

| Field | Value |
| --- | --- |
| winner_order_128_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 21–24 data:**

| Field | Value |
| --- | --- |
| winner_order_129_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Open the delivery address picker.
2. Click Add new address.
   - The Personal / Company control shows, Personal selected, Company Name hidden. `g10.auction-winner-order.US12-TC1`
   - Phone shows a country selector and number input, no country chosen. `g10.auction-winner-order.US12-TC1`
3. Open the delivery address picker.
4. Click Add new address.
5. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, winner order url `<winner order url>`, Save this address for future orders unticked.
6. Confirm the address for this order.
   - Step 6: the order's delivery address is the entered address, with phone. `g10.auction-winner-order.US12-TC2`
7. Open the account address book.
   - Step 7: the book still holds five addresses. `g10.auction-winner-order.US12-TC2`
8. Click Company.
9. Fill Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, Save this address for future orders unticked.
10. Click confirm.
   - The confirm is refused, with messages beside Company Name and Phone. `g10.auction-winner-order.US12-TC3`
   - The order's delivery address is unchanged. `g10.auction-winner-order.US12-TC3`
   - The book still holds five addresses. `g10.auction-winner-order.US12-TC3`
11. Open the delivery address picker.
12. Click Add new address.
   - The address form opens; no message blocks it. `g10.auction-winner-order.US12-TC4`
13. Open the delivery address picker.
14. Click Add new address.
15. Enter `<address_new>`, Save this address for future orders unticked.
16. Confirm the address for this order.
   - Step 16: the order's delivery address is `<address_new>`. `g10.auction-winner-order.US12-TC5`
17. Open the account address book.
   - Step 17: the book still holds five addresses. `g10.auction-winner-order.US12-TC5`
18. Open the delivery address picker.
19. Click Add new address and enter `<address_new>`.
20. Click Use this address.
   - `<address_new>` shows as a draft entry at the top of the picker. `g10.auction-winner-order.US12-TC6`
   - The five saved addresses list below it. `g10.auction-winner-order.US12-TC6`
21. Open the delivery address picker.
22. Click Add new address and enter `<address_new>`.
23. Click Save this address for future orders.
   - Step 23: the checkbox is disabled and stays unticked. `g10.auction-winner-order.US12-TC7`
24. Hover the info icon beside it.
   - Step 24: a short reason says the book is full. `g10.auction-winner-order.US12-TC7`

## Walk 18: Winner confirms delivery when five addresses are already saved — phase 2

**Starting state:**

**Steps 1–5 setup:**

- customer(winner, four saved shipping addresses) is on `<winner order url>` for `<winner_order_130_1>`.

**Steps 6–9 setup:**

- customer(winner, five saved shipping addresses including `<address_home>`) is signed in.

**Steps 10–12 setup:**

- customer(winner, five saved shipping addresses including `<address_home>`) is on the account address book.

**Steps 13–15 setup:**

- customer(winner) holds six saved shipping addresses, seeded from before the cap.
- customer is on `<winner order url>` for `<winner_order_133_1>`.

**Steps 16–19 setup:**

- customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
- On it, they added a one-time delivery address without saving it, and have not confirmed.
- The winner order under test is `<winner_order_134_1>`.

**Shared test data:**

**Steps 1–5 data:**

| Field | Value |
| --- | --- |
| winner_order_130_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–9 data:**

| Field | Value |
| --- | --- |
| address_home | A saved address named Home, used by no unpaid order |
| winner_order_131_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 10–12 data:**

| Field | Value |
| --- | --- |
| address_home | A saved address named Home |
| new street | A different address line 1 |

**Steps 13–15 data:**

| Field | Value |
| --- | --- |
| winner_order_133_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–19 data:**

| Field | Value |
| --- | --- |
| winner_order_134_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Tick Save this address for future orders.
   - Step 3: the checkbox is enabled and ticks. `g10.auction-winner-order.US12-TC8`
4. Confirm the address for this order.
5. Open the account address book.
   - Step 5: the book holds five, including `<address_new>`. `g10.auction-winner-order.US12-TC8`
6. Remove `<address_home>` from the address book.
   - Step 6: the book holds four addresses. `g10.auction-winner-order.US12-TC9`
7. Navigate to `<winner order url>` for `<winner_order_131_1>`.
8. Click Add new address in the delivery picker and enter `<address_new>`.
9. Click Save this address for future orders.
   - Step 9: the checkbox is enabled and ticks. `g10.auction-winner-order.US12-TC9`
10. Open `<address_home>` for editing.
11. Change address line 1 to `<new street>`.
12. Save.
   - The book still holds five addresses. `g10.auction-winner-order.US12-TC10`
   - `<address_home>` shows once, with `<new street>`. `g10.auction-winner-order.US12-TC10`
13. Open the account address book in a new tab.
   - Step 13: all six addresses are listed. `g10.auction-winner-order.US12-TC11`
14. On the order, click Add new address in the delivery picker and enter `<address_new>`.
15. Click Save this address for future orders.
   - Step 15: the checkbox is disabled and stays unticked. `g10.auction-winner-order.US12-TC11`
16. Leave the order for another page, then return to it.
17. Read the delivery address picker.
18. Open the account address book.
19. Back on the order, select the one-time delivery address, a payment method, and confirm.
   - The delivery picker lists the one-time address ahead of the saved addresses. `g10.auction-winner-order.US12-TC12`
   - The address book does not hold the one-time address. `g10.auction-winner-order.US12-TC12`
   - The confirmation is accepted with the one-time delivery address. `g10.auction-winner-order.US12-TC12`

## Walk 19: Winner learns their order was cancelled and adjacent checks

**Starting state:**

**Steps 1–1 setup:**

- customer(winner of `<winner_order_135_1>`) is on Winner Order.

**Steps 2–4 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_136_1>`.

**Steps 5–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_137_1>`.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| winner_order_135_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 2–4 data:**

| Field | Value |
| --- | --- |
| winner_order_136_1 | A paid order refunded to the card, with an operator note; bind its identity only |
| refund amount | The amount returned |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| winner_order_137_1 | A paid order where the difference over the total was returned; bind its identity only |
| difference | The amount returned |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Read the status, listing, winning bid and actions.
   - The page says Cancelled on the cancellation day, as a day-only date in the winner's local zone. `g10.auction-winner-order.US13-TC1`
   - The listing and winning bid remain visible. `g10.auction-winner-order.US13-TC1`
   - Contact Us is the only action. `g10.auction-winner-order.US13-TC1`
   - No cancellation reason is shown. `g10.auction-winner-order.US13-TC1`
2. Read the status, actions and receipt links.
   - Step 2: the order reads Refunded; no stepper, Pay, address or shipment action. `g10.auction-winner-order.US14-TC1`
   - Step 2: the invoice and every receipt still download. `g10.auction-winner-order.US14-TC1`
3. Read below Order Total.
   - Step 3: `<refund amount>` shows below Order Total. `g10.auction-winner-order.US14-TC1`
4. Open the refund details from the inline alert.
   - Step 4: Amount, Transfer to, Reason, then Note, in that order. `g10.auction-winner-order.US14-TC1`
   - Step 4: Transfer to shows the card brand and last four only; no Reference. `g10.auction-winner-order.US14-TC1`
5. Read the status and invoice lines.
   - Step 5: status and invoice lines are unchanged; it does not read Refunded. `g10.auction-winner-order.US15-TC1`
6. Read below Order Total.
   - Step 6: only `<difference>` shows as returned. `g10.auction-winner-order.US15-TC1`
7. Open the refund details.
   - Step 7: the details open, showing no proof and no provider reference. `g10.auction-winner-order.US15-TC1`

## Walk 20: Winner emails Grade10 from a locked order — phase 1

**Starting state:**

**Steps 1–1 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_138_1>`.

**Steps 2–3 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_139_1>`.

**Steps 4–5 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_140_1>`.

**Steps 6–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_141_1>`.

**Steps 8–9 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_142_1>`.

**Steps 10–11 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_143_1>`.

**Steps 12–13 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_144_1>`.

**Steps 14–15 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_145_1>`.

**Steps 16–18 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_146_1>`.

**Steps 19–22 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_147_1>`.
- The browser may use the clipboard.

**Steps 23–25 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_148_1>`.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| winner_order_138_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 2–3 data:**

| Field | Value |
| --- | --- |
| winner_order_139_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| winner_order_140_1 | An order past its setup deadline, no invoice issued; bind its identity only |
| listing_title | The listing title on that order; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| winner_order_141_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–9 data:**

| Field | Value |
| --- | --- |
| winner_order_142_1 | An order reading Partially Paid, with one receipt; bind its identity only |
| invoice_id | That order's invoice id |
| receipt_ids | That invoice's receipt ids |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 10–11 data:**

| Field | Value |
| --- | --- |
| winner_order_143_1 | An order reading Partially Paid, with three receipts; bind its identity only |
| receipt_ids | Every receipt id on that invoice, oldest first |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 12–13 data:**

| Field | Value |
| --- | --- |
| winner_order_144_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| winner_order_145_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–18 data:**

| Field | Value |
| --- | --- |
| winner_order_146_1 | An order whose payment deadline passed unpaid; bind its identity only |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 19–22 data:**

| Field | Value |
| --- | --- |
| winner_order_147_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 23–25 data:**

| Field | Value |
| --- | --- |
| winner_order_148_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Click Contact Us on the inline alert.
   - A dialog opens with To, Subject and Message. `g10.auction-winner-order.US16-TC1`
   - No mail app opens, and no toast naming only the address replaces the dialog. `g10.auction-winner-order.US16-TC1`
2. Click Contact Us.
3. Read To.
   - To reads `support@grade10.com`. `g10.auction-winner-order.US16-TC2`
4. Click Contact Us.
5. Read Subject.
   - Subject reads `Auction lot `<listing_title>`: setup overdue`, with no invoice id. `g10.auction-winner-order.US16-TC3`
6. Click Contact Us.
7. Read Subject.
   - Subject reads `Auction order `<invoice_id>`: payment overdue`. `g10.auction-winner-order.US16-TC4`
8. Click Contact Us.
9. Read Subject and Message.
   - Subject reads `Auction order `<invoice_id>`: partial payment`. `g10.auction-winner-order.US16-TC5`
   - Message lists `<receipt_ids>`. `g10.auction-winner-order.US16-TC5`
   - Message shows no remaining balance. `g10.auction-winner-order.US16-TC5`
10. Click Contact Us.
11. Read Message.
   - Message lists every id in `<receipt_ids>`. `g10.auction-winner-order.US16-TC6`
   - Message shows no remaining balance. `g10.auction-winner-order.US16-TC6`
12. Search the page for `support@grade10.com`.
   - Step 12: the address is not on the page. `g10.auction-winner-order.US16-TC7`
13. Click Contact Us.
   - Step 13: To shows `support@grade10.com`. `g10.auction-winner-order.US16-TC7`
14. Click Contact Us.
15. Read the dialog footer.
   - Copy Message is the primary action, first. `g10.auction-winner-order.US16-TC8`
   - Open Mail App is the secondary action, second. `g10.auction-winner-order.US16-TC8`
16. Click Contact Us.
   - Step 16: Message is a multi-line field, order facts prefilled. `g10.auction-winner-order.US16-TC9`
17. Look at the copy controls beside To, Subject and Message.
   - Step 17: To and Subject each have a copy control; Message has none. `g10.auction-winner-order.US16-TC9`
18. Type `<winner_question>` into Message, below the prefilled facts.
   - Step 18: Message keeps `<winner_question>`. `g10.auction-winner-order.US16-TC9`
19. Click Contact Us.
20. Type `<winner_question>` into Message.
21. Click Copy Message.
22. Paste into a plain-text field.
   - The paste holds To `support@grade10.com`. `g10.auction-winner-order.US16-TC10`
   - It holds Subject `Auction order `<invoice_id>`: payment overdue`. `g10.auction-winner-order.US16-TC10`
   - It holds Message with `<winner_question>`. `g10.auction-winner-order.US16-TC10`
23. Click Contact Us.
24. Type `<winner_question>` into Message.
25. Read the Open Mail App link target.
   - It is a `mailto:` to `support@grade10.com`. `g10.auction-winner-order.US16-TC11`
   - Its subject is `Auction order `<invoice_id>`: payment overdue`. `g10.auction-winner-order.US16-TC11`
   - Its body includes `<winner_question>`. `g10.auction-winner-order.US16-TC11`

## Walk 21: Winner emails Grade10 from a locked order — phase 2

**Starting state:**

**Steps 1–3 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_149_1>`.
- The browser may use the clipboard.

**Steps 4–5 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_150_1>`.

**Steps 6–7 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_151_1>`.

**Steps 8–10 setup:**

- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup.
- The winner order under test is `<winner_order_152_1>`.

**Steps 11–13 setup:**

- customer(winner) holds an auction order in Setup Overdue, whose payment access is closed.
- The browser may use the clipboard.
- The winner order under test is `<winner_order_153_1>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| winner_order_149_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| winner_order_150_1 | An order payment-overdue after its invoice was reissued; bind its identity only |
| current_invoice_id | The current invoice id |
| replaced_invoice_id | The replaced invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| winner_order_151_1 | An order an operator cancelled, with a category and note; bind its identity only |
| listing_title | That order's listing title; bind its identity only |
| invoice_id | That order's invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–10 data:**

| Field | Value |
| --- | --- |
| winner_order_152_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 11–13 data:**

| Field | Value |
| --- | --- |
| winner_order_153_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Click Contact Us.
2. Click the copy control beside To, then paste.
   - Step 2 pastes only `support@grade10.com`. `g10.auction-winner-order.US16-TC12`
3. Click the copy control beside Subject, then paste.
   - Step 3 pastes only the Subject. `g10.auction-winner-order.US16-TC12`
   - Copy Message stays in the footer. `g10.auction-winner-order.US16-TC12`
4. Click Contact Us.
5. Read Subject.
   - Subject reads `Auction order `<current_invoice_id>`: payment overdue`. `g10.auction-winner-order.US16-TC13`
   - It does not name `<replaced_invoice_id>`. `g10.auction-winner-order.US16-TC13`
6. Click Contact Us.
7. Read Subject and Message.
   - Subject reads `Auction lot `<listing_title>`: order cancelled`. `g10.auction-winner-order.US16-TC14`
   - Message names `<listing_title>`, `<invoice_id>` and status Cancelled. `g10.auction-winner-order.US16-TC14`
   - Neither names the operator's category or note. `g10.auction-winner-order.US16-TC14`
8. Open the order and choose Contact Us.
9. Read the Subject and the Message.
10. Read the order status.
   - The Subject and Message are those of the `setup overdue` reason. `g10.auction-winner-order.US16-TC15`
   - The order status still reads Awaiting Setup. `g10.auction-winner-order.US16-TC15`
11. Open the order and choose Contact Us.
12. Choose Copy Message.
13. Watch the button and the page for a few seconds.
   - The button reads Copied for a moment, then Copy Message again. `g10.auction-winner-order.US16-TC16`
   - No toast appears. `g10.auction-winner-order.US16-TC16`
   - The To and Subject controls are unchanged. `g10.auction-winner-order.US16-TC16`

## Walk 22: Winner matches a bank refund against their own statement and adjacent checks

**Starting state:**

**Steps 1–1 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_154_1>`.

**Steps 2–3 setup:**

- customer(winner) holds an order in Awaiting Setup.
- The winner order under test is `<winner_order_155_1>`.

**Steps 4–4 setup:**

- customer(winner) holds an order in Preparing Invoice.
- The winner order under test is `<winner_order_156_1>`.

**Steps 5–7 setup:**

- customer(winner) holds an order in Awaiting Setup.
- The winner order under test is `<winner_order_157_1>`.

**Steps 8–10 setup:**

- customer(winner) holds an order in Awaiting Setup.
- The winner order under test is `<winner_order_158_1>`.

**Steps 11–11 setup:**

- customer(winner of `<winner_order_159_1>`) is on Winner Order.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value |
| --- | --- |
| winner_order_154_1 | A paid order refunded by bank transfer, no operator note; bind its identity only |
| bank reference | The provider reference the operator recorded |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 2–3 data:**

| Field | Value |
| --- | --- |
| winner_order_155_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 4–4 data:**

| Field | Value |
| --- | --- |
| winner_order_156_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–7 data:**

| Field | Value |
| --- | --- |
| First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code | Filled |
| Phone | `<a phone number of unusual length and format>` |
| Company Name, Address Line 2, Apt./Suite/Building | Empty |

| Field | Value |
| --- | --- |
| winner_order_157_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| a phone number of unusual length and format | The unusual-length and unusual-format phone fixture; bind its literal input only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 8–10 data:**

| Field | Value |
| --- | --- |
| winner_order_158_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 11–11 data:**

| Field | Value |
| --- | --- |
| winner_order_159_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

### Route

1. Open the refund details from the inline alert.
   - Amount, Transfer to, Reference, then Reason, in that order; no Note. `g10.auction-winner-order.US17-TC1`
   - Transfer to shows a bank icon, masked destination, bank name beneath. `g10.auction-winner-order.US17-TC1`
   - Reference reads `<bank reference>`. `g10.auction-winner-order.US17-TC1`
   - No proof and no full account number show. `g10.auction-winner-order.US17-TC1`
2. Navigate to `<winner order url>`.
3. Read the page from the header to the sidebar.
   - The header shows Winner Order and the status badge. `g10.auction-winner-order.US19-TC1`
   - Order Progress shows Address current, then Invoice, Payment, Shipping and. Completed. `g10.auction-winner-order.US19-TC1`
   - The listing's title shows in the listing card only. `g10.auction-winner-order.US19-TC1`
   - No Order Information, Collection Method, Order Status list or Lots section. shows. `g10.auction-winner-order.US19-TC1`
4. Navigate to `<winner order url>`.
   - The confirmed address is shown. `g10.auction-winner-order.US19-TC2`
   - No invoice and no Pay Now are shown. `g10.auction-winner-order.US19-TC2`
5. Navigate to `<winner order url>`.
6. Fill the address form with **Test data**.
7. Click Confirm.
   - The address is accepted. `g10.auction-winner-order.US19-TC3`
   - The order status reads Preparing Invoice. `g10.auction-winner-order.US19-TC3`
8. Navigate to `<winner order url>`.
9. Fill every required field except Town/City and Postal Code.
10. Click Confirm.
   - The address is refused. `g10.auction-winner-order.US19-TC4`
   - An error shows on Town/City and on Postal Code. `g10.auction-winner-order.US19-TC4`
   - The order status still reads Awaiting Setup. `g10.auction-winner-order.US19-TC4`
11. Read the payment step, settlement alert and receipt area.
   - The page reads Partially Paid. `g10.auction-winner-order.US20-TC1`
   - Pay, Submit Payment Proof, View Bank Details and a payment deadline are absent. `g10.auction-winner-order.US20-TC1`
   - The page offers Contact Us, shows the full invoice amount and no remaining balance. `g10.auction-winner-order.US20-TC1`
   - Each recorded payment has a separate receipt link, oldest first. `g10.auction-winner-order.US20-TC1`

## Walk 23: Winner quotes their order

**Starting state:**

**Steps 1–2 setup:**

- One winning order has a card invoice and another has a bank-transfer invoice.
- The winner order under test is `<winner_order_160_1>`.

**Steps 3–4 setup:**

- The latest invoice for payment reference `<payment reference>` is `<current invoice id>`.

**Steps 5–6 setup:**

- A new listing's 5-character candidate collides with an active code or retained reservation.

**Steps 7–8 setup:**

- A listing and its order already store payment reference `<payment reference>`.
- The winner order under test is `<winner_order_163_1>`.

**Steps 9–10 setup:**

- A listing has payment reference `<payment reference>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_160_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| next invoice id | IN-LK423100 |
| current invoice id | IN-LK42399 |
| payment reference | LK423 |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| payment reference | LK423 |
| winner_order_163_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 9–10 data:**

| Field | Value |
| --- | --- |
| payment reference | LK423 |

### Route

1. Open each invoice and its order.
2. Read the invoice ID and payment reference.
   - Each order and invoice shows its invoice ID and unchanged payment reference. `g10.auction-winner-order.US21-TC1`
   - The card invoice and bank-transfer invoice use the same reference rules. `g10.auction-winner-order.US21-TC1`
   - No receipt breakdown or receipt amount is asserted here. `g10.auction-winner-order.US21-TC1`
3. Reissue the invoice.
4. Read the new invoice ID.
   - The new invoice ID is `<next invoice id>`. `g10.auction-winner-order.US21-TC2`
   - The payment reference remains `<payment reference>`. `g10.auction-winner-order.US21-TC2`
5. Create the listing.
6. Read the stored listing/payment reference.
   - Allocation retries and stores a distinct valid code. `g10.auction-winner-order.US21-TC3`
   - The code is not treated as collision-free merely because its source is a UUID or listing ID. `g10.auction-winner-order.US21-TC3`
7. Change the allocator implementation.
8. Read the listing and order references.
   - Both continue to use `<payment reference>`. `g10.auction-winner-order.US21-TC4`
   - No new listing receives a retained code. `g10.auction-winner-order.US21-TC4`
9. Fetch the public listing page and its shared preview.
10. Inspect server HTML, embedded state and preview metadata.
   - The payment reference has no labelled public field and appears only as the lower-case suffix of the canonical address. `g10.auction-winner-order.US21-TC5`

## Walk 24: Winner reviews invoice and payment details

**Starting state:**

**Steps 1–2 setup:**

- An order has invoice `<original invoice id>`, then reissued invoice `<current invoice id>`, with payment reference `<payment reference>`.
- The winner order under test is `<winner_order_165_1>`.

**Steps 3–4 setup:**

- An invoice is `<current invoice id>` for payment reference `<payment reference>`.
- A full or partial payment for that invoice has finalized.

**Steps 5–6 setup:**

- A historical receipt ID is `<historical receipt id>`.

**Steps 7–7 setup:**

- A card payment has a Grade10 payment reference and a provider reference.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| original invoice id | IN-LK42301 |
| current invoice id | IN-LK42302 |
| payment reference | LK423 |
| winner_order_165_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| current invoice id | IN-LK42302 |
| payment reference | LK423 |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| historical receipt id | REC-202609-LK7P2Q-01-P1 |

### Route

1. Look up the order by each invoice ID and by `<payment reference>`.
2. Open both invoice PDFs.
   - Each lookup finds the same order. `g10.auction-winner-order.US22-TC1`
   - The replacement invoice names the replaced invoice and keeps `<payment reference>`. `g10.auction-winner-order.US22-TC1`
3. Open the receipt.
4. Read its identifier.
   - The first receipt ID is `RC-LK42302P1`. `g10.auction-winner-order.US22-TC2`
   - A later finalized payment for that invoice receives `P2`, then `P10` without padding. `g10.auction-winner-order.US22-TC2`
   - A receipt for another invoice starts at `P1` for that invoice. `g10.auction-winner-order.US22-TC2`
5. Open the historical receipt after the new identifier ships.
6. Record a refund, reversal or void.
   - The historical receipt ID remains `<historical receipt id>`. `g10.auction-winner-order.US22-TC3`
   - No receipt ID is created for the refund, reversal or void. `g10.auction-winner-order.US22-TC3`
7. Read Stripe metadata and the winner-facing order and invoice.
   - Stripe metadata carries the Grade10 payment reference. `g10.auction-winner-order.US22-TC4`
   - The provider reference appears on no winner-facing surface. `g10.auction-winner-order.US22-TC4`

## Walk 25: Winner gets the address form back

**Starting state:**

**Steps 1–2 setup:**

- `<listing_169_1>` closed at its recorded close and no delivery address is confirmed on its order.
- customer(winner of `<listing_169_1>`) is on `<winner order url>` at `<one minute before close>`.
- The winner order under test is `<winner_order_169_1>`.

**Steps 3–4 setup:**

- `<listing_170_1>` closed at its recorded close and no delivery address is confirmed on its order.
- customer(winner of `<listing_170_1>`) is on `<winner order url>` at `<the address deadline>`.
- The winner order under test is `<winner_order_170_1>`.

**Steps 5–6 setup:**

- `<listing_171_1>`'s order has no confirmed delivery address, derives as Setup Overdue,.
- has invoice status `not_issued`, and its address deadline passed on 2026-09-05T12:00:00Z.
- An operator reopened the address form at `<the reopen>`.
- customer(winner of `<listing_171_1>`) is on `<winner order url>`.
- The winner order under test is `<winner_order_171_1>`.

**Steps 7–8 setup:**

- `<listing_172_1>`'s order has no confirmed delivery address and its address deadline passed two hours ago.
- customer(winner of `<listing_172_1>`) is signed in.
- The winner order under test is `<winner_order_172_1>`.

**Steps 9–11 setup:**

- customer(winner of `<listing_173_1>`, `<listing_173_2>` and `<listing_173_3>`) won three listings that closed at different datetimes.

**Steps 12–13 setup:**

- `<winner_order_174_1>` carries a confirmed delivery address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.
- customer(winner of `<winner_order_174_1>`) is on `<winner order url>`.

**Steps 14–15 setup:**

- `<winner_order_175_1>`'s invoice is `expired` and its address was confirmed and is locked.
- customer(winner of `<winner_order_175_1>`) is on `<winner order url>`.

**Steps 16–18 setup:**

- `<winner_order_176_1>`'s address deadline has passed with no address confirmed.
- customer(winner of `<winner_order_176_1>`) is signed in.

**Steps 19–20 setup:**

- `<winner_order_177_1>`'s address deadline has passed.
- An operator holds payment-processing.

**Steps 21–22 setup:**

- `<extended listing>` was scheduled to close at 2026-09-12T08:45:00Z, took a late bid, and closed at 2026-09-12T09:00:00Z after extended bidding.
- customer(winner of `<extended listing>`) is on `<winner order url>`.
- The winner order under test is `<winner_order_178_1>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_169_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| Entrance closes | 2026-09-05T12:00:00Z |
| one minute before close | 2026-09-05T11:59:00Z |

| Field | Value |
| --- | --- |
| winner_order_169_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_169_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_170_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| the address deadline | 2026-09-05T12:00:00Z |

| Field | Value |
| --- | --- |
| winner_order_170_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_170_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| the reopen | 2026-09-07T09:00:00Z |
| New address deadline | 2026-09-09T09:00:00Z |

| Field | Value |
| --- | --- |
| winner_order_171_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_171_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_172_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_172_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| listing_173_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| listing_173_2>` recorded close | 2026-09-03T18:30:00Z; bind its identity only |
| listing_173_3>` recorded close | 2026-09-04T09:15:00Z; bind its identity only |

| Field | Value |
| --- | --- |
| listing_173_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_173_2 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_173_3 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps 12–13 data:**

| Field | Value |
| --- | --- |
| winner_order_174_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 14–15 data:**

| Field | Value |
| --- | --- |
| winner_order_175_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 16–18 data:**

| Field | Value |
| --- | --- |
| winner_order_176_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 19–20 data:**

| Field | Value |
| --- | --- |
| winner_order_177_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 21–22 data:**

| Field | Value |
| --- | --- |
| winner_order_178_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| extended listing | The extended listing fixture described by the pre-conditions; bind its value only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Choose the account's saved home address.
2. Confirm the delivery address.
   - The confirmation is accepted. `g10.auction-winner-order.US23-TC1`
   - The order reads Preparing Invoice. `g10.auction-winner-order.US23-TC1`
   - No invoice is issued by the confirmation itself. `g10.auction-winner-order.US23-TC1`
3. Attempt to confirm the account's saved home address.
4. Read the order's delivery address.
   - The confirmation is refused. `g10.auction-winner-order.US23-TC2`
   - The order holds no confirmed delivery address. `g10.auction-winner-order.US23-TC2`
   - The order still reads Setup Overdue. `g10.auction-winner-order.US23-TC2`
5. Read the delivery address area.
6. Confirm the account's saved home address.
   - The address deadline reads 2026-09-09T09:00:00Z, measured from the reopen. `g10.auction-winner-order.US23-TC4`
   - The confirmation is accepted. `g10.auction-winner-order.US23-TC4`
   - The order reads Preparing Invoice. `g10.auction-winner-order.US23-TC4`
7. Read the delivery address area for a reopen or extend control.
8. Submit a reopen of the address form as the winner.
   - No reopen or extend control is offered to the winner. `g10.auction-winner-order.US23-TC5`
   - The reopen is refused. `g10.auction-winner-order.US23-TC5`
   - The address deadline is unchanged. `g10.auction-winner-order.US23-TC5`
9. Open each of the three auction orders.
10. Read each order's address deadline.
11. Confirm a different delivery address on each order.
   - Three separate orders exist, one per listing. `g10.auction-winner-order.US23-TC6`
   - The three address deadline passes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z. `g10.auction-winner-order.US23-TC6`
   - Each order keeps the address confirmed on it and awaits its own invoice. `g10.auction-winner-order.US23-TC6`
12. Attempt to change the delivery address to the account's work address.
13. Read the delivery address area.
   - The change is refused even though the 48 hours have not elapsed. `g10.auction-winner-order.US23-TC7`
   - The order still shows the address the invoice was quoted for. `g10.auction-winner-order.US23-TC7`
   - The area points the winner at Grade10 for a change. `g10.auction-winner-order.US23-TC7`
14. Read the delivery address area.
15. Attempt to change the delivery address to the account's work address.
   - No address form is offered. `g10.auction-winner-order.US23-TC8`
   - The change is refused. `g10.auction-winner-order.US23-TC8`
   - The overdue alert carries Contact Us and no card Pay control is shown. `g10.auction-winner-order.US23-TC8`
16. Open the account address book.
17. Edit the saved home address and save a new work address.
18. Return to `<winner order url>`.
   - Both address-book writes are accepted. `g10.auction-winner-order.US23-TC9`
   - Neither reaches the auction order. `g10.auction-winner-order.US23-TC9`
   - The order still has no confirmed delivery address and still offers no address form. `g10.auction-winner-order.US23-TC9`
19. The operator reopens the address form with a reason.
20. Read the winner's post-close letters for that listing.
   - The order offers the address form again. `g10.auction-winner-order.US23-TC10`
   - No letter about the reopen reaches the winner. `g10.auction-winner-order.US23-TC10`
21. Read the address deadline under Confirm delivery address.
22. Confirm the account's saved home address at 2026-09-14T08:50:00Z, ten minutes before that deadline and after 48 hours from the scheduled close.
   - The deadline reads 2026-09-14T09:00:00Z, counted from the actual close. `g10.auction-winner-order.US23-TC11`
   - The confirmation is accepted and the order reads Preparing Invoice. `g10.auction-winner-order.US23-TC11`

## Walk 26: Additional fixture checks

**Starting state:**

**Steps 1–4 setup:**

- `<listing_50_1>` is prepared with this bidding state: `<bidding at close>`, its recorded close a few minutes away, and no further bid is coming.
- `<listing_50_1>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, which holds `<house billing address>`.
- customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_50_1>` as described by `<bidding at close>`.
- admin(auction operator) is on `<grade10 auction send log url>`.
- The winner order under test is `<winner_order_50_1>`.

**Steps 5–5 setup:**

- The invoice is for an HKD settlement and the USD premium rule has a non-zero minimum.

**Steps 6–6 setup:**

- A winner is on setup for a won listing whose auction bids were in USD.

**Steps 7–10 setup:**

- A winner is on order setup with an address and billing address ready.
- The USD winning bid is `<usd winning bid minor units>` minor units, with premium `<usd premium minor units>` minor units.
- The winner order under test is `<winner_order_180_1>`.

**Steps 11–12 setup:**

- A winner chose HKD and an operator sent the invoice.

**Steps 13–15 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
- customer(winner) holds `<winner_order_182_1>` in Awaiting Setup with a saved home address.

**Steps 16–19 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
- customer(winner) holds `<winner_order_183_1>` in Awaiting Setup with a saved home address.

**Steps 20–23 setup:**

- admin(operator with payment-processing) holds `<winner_order_184_1>` in Preparing Invoice, whose winner confirmed HKD and bank transfer on HK Local.
- customer(winner) holds `<winner_order_184_1>`.

**Steps 24–26 setup:**

- admin(operator with payment-processing) holds `<winner_order_185_1>`, whose pending invoice was sent in HKD for bank transfer on HK Local.

**Steps 27–28 setup:**

- A winner is on order setup with USD and HKD settlement choices.
- The winner order under test is `<winner_order_186_1>`.

**Steps 29–30 setup:**

- A USD winner selected an International via SWIFT method before confirming setup.

**Steps 31–35 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
- customer(winner) holds `<winner_order_188_1>` in Awaiting Setup with a saved home address.

**Steps 36–38 setup:**

- A winner selected `<selected method>` for USD, and that method is offered for HKD.

**Steps 39–41 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
- customer(winner) holds `<winner_order_190_1>` in Awaiting Setup with a saved home address.

**Steps 42–43 setup:**

- Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in HKD.
- customer(winner) holds `<winner_order_191_1>` in Awaiting Setup with a saved home address.

**Steps 44–46 setup:**

- Payment Settings holds a card fee rule in HKD.
- customer(winner) holds `<winner_order_192_1>` in Awaiting Setup with a saved home address.
- The environment is `<environment>`, with bank details prepared as `<bank details setup>`.

**Steps 47–48 setup:**

- Payment Settings holds a USD card fee rule of `<usd rate>` and an HKD card fee rule of `<hkd rate>`.
- customer(winner) holds `<winner_order_193_1>` in Awaiting Setup with a saved home address.

**Steps 49–54 setup:**

- The USD premium minimum is USD0.
- customer(winner) is on `<winner order url>` for `<winner_order_194_1>`.

**Steps 55–55 setup:**

- A winner paid in full an HKD invoice whose total is 103100 minor units in HKD, for a listing bid in USD.

**Steps 56–56 setup:**

- Grade10 sent letters about `<winner_order_196_1>`, which is settled in HKD and has a sent invoice.

**Steps 57–57 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_197_1>`.

**Steps 58–59 setup:**

- Payment Settings holds a USD card fee rule of 4.4% and USD0.30, and an HKD card fee rule of 3.4% and HK$2.35.
- `<winner_order_198_1>` is settled in HKD by card, with its invoice sent.
- customer(winner) is on `<winner order url>` for `<winner_order_198_1>`.

**Steps 60–60 setup:**

- None.

**Steps 61–65 setup:**

- `<winner_order_200_1>` is settled in HKD and paid in full, and Grade10 sent letters about it.

**Steps 66–67 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_201_1>`.

**Steps 68–69 setup:**

- The winner selected HKD and two pending invoices have USD bid, premium and Shipping & Handling lines: one bank-transfer order and one card order.
- Payment Settings uses HKD card rule `<card rule>`.
- The winner order under test is `<winner_order_202_1>`.

**Steps 70–70 setup:**

- The winner selected USD and the invoice has no converted HKD total.

**Steps 71–72 setup:**

- customer(winner) is on `<winner order url>` for `<winner_order_204_1>`.

**Shared test data:**

**Steps 1–4 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_50_1 | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00); bind its identity only | · |
| house maximum | 600000 minor units | (HK$6,000.00), the listing's committed internal bid |
| internal bidder | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test | · |
| house billing address | A Hong Kong address with every required field: name "Grade10 Stock Room", 1 Test Road, Central, Hong Kong | · |

| Row | `<bidding at close>` | `<order after close>` | `<auction won letters>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | One, `<internal bidder>`'s, flagged internal, winning bid 508000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | One, `<internal bidder>`'s, flagged internal, winning bid 400000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, not flagged internal, winning bid 608000, Awaiting Setup | One, to customer A |

| Field | Value |
| --- | --- |
| winner_order_50_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 5–5 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD1 | (range: >0 minor units) |
| minimum premium | USD1 | (fixed configured minimum) |
| exchange rate | 7.85 HKD per USD | · |

**Steps 7–10 data:**

| `<settlement currency>` | `<usd winning bid minor units>` | `<usd premium minor units>` | `<invoice amounts>` |
| --- | ---: | ---: | --- |
| USD | 250000 | 50000 | Winning Bid 250000 USD; Buyer's Premium 50000 USD; total 300000 USD |
| HKD | 250000 | 50000 | Winning Bid 1962500 HKD; Buyer's Premium 392500 HKD; total 2356500 HKD |

| Field | Value |
| --- | --- |
| winner_order_180_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 13–15 data:**

| Field | Value |
| --- | --- |
| winner_order_182_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps 16–19 data:**

| Field | Value |
| --- | --- |
| winner_order_183_1 | An order won in USD, in Awaiting Setup; bind its identity only |
| Currency | HKD |
| Method | FPS |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 20–23 data:**

| Field | Value |
| --- | --- |
| winner_order_184_1 | An order in Preparing Invoice, settled in HKD by bank transfer on HK Local; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 24–26 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_185_1 | An order won at `<winning bid>`, with a pending HKD invoice; bind its identity only | · |
| winning bid | USD100.00 | (fixed derived value), 10000 minor units |
| winning bid HKD | HKD785.00 | (fixed derived value), 78500 minor units |

**Steps 27–28 data:**

| `<currency>` | `<offered methods>` |
| --- | --- |
| USD | Card, HK Local, International via SWIFT |
| HKD | Card, FPS, HK Local |

| Field | Value |
| --- | --- |
| winner_order_186_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 31–35 data:**

| Field | Value |
| --- | --- |
| winner_order_188_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps 36–38 data:**

| `<selected method>` | `<expected selection>` |
| --- | --- |
| Card | Card remains selected |
| HK Local | HK Local remains selected |

**Steps 39–41 data:**

| `<settlement currency>` | `<rail>` | Why this row |
| --- | --- | --- |
| USD | FPS | FPS is offered in HKD only |
| HKD | International via SWIFT | SWIFT is offered in USD only |

| Field | Value |
| --- | --- |
| winner_order_190_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 42–43 data:**

| Field | Value |
| --- | --- |
| winner_order_191_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps 44–46 data:**

| `<environment>` | `<bank details setup>` | `<offered methods>` | `<rail>` |
| --- | --- | --- | --- |
| Outside production | HK Local only | Card, HK Local | FPS |
| Production, before Finance confirms an account | None | Card | FPS |

| Field | Value |
| --- | --- |
| winner_order_192_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 47–48 data:**

| Field | Value |
| --- | --- |
| winner_order_193_1 | An order won in USD, in Awaiting Setup; bind its identity only |
| usd rate | 4.4% and a fixed amount (fixed configured value) |
| hkd rate | 3.4% and a fixed amount (fixed configured value) |

**Steps 49–54 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_194_1 | A listing won at `<winning bid>`, settled in HKD by FPS, with Shipping & Handling `<shipping>`, invoice sent; bind its identity only | · |
| winner_order_194_2 | A listing won at USD100.00, settled in HKD by FPS, invoice sent; bind its identity only | · |
| winner_order_194_3 | A listing won at USD101.00, settled in HKD by FPS, invoice sent; bind its identity only | · |
| winner_order_194_4 | A listing won at USD101.00, settled in HKD by bank transfer, invoice sent with 0 USD bank transfer fee; bind its identity only | · |
| winning bid HKD exact | HK$793.00 | (fixed derived value), 79,300 minor units |
| premium HKD exact | HK$159.00 | (fixed derived value), 15,900 minor units |
| shipping HKD exact | HK$79.00 | (fixed derived value), 7,900 minor units |
| subtotal HKD exact | HK$1,031.00 | (fixed derived value), 103,100 minor units |
| winning bid | USD250 | (fixed fixture): USD250 x 7.85 is 1962.5, rounded up to HK$1,963 |
| premium | USD50 | (fixed derived value): 20% of `<winning bid>`, premium minimum USD0; HK$393 after rounding up 392.5 |
| shipping | USD12 | (fixed fixture): HK$95 after rounding up 94.2 |
| total HKD | HK$2,451 | 1,963 + 393 + 95, each line rounded up, then summed |
| Whole-total value | HK$2,450 | USD312 x 7.85 is 2449.2, rounded up (the wrong total) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 56–56 data:**

| Field | Value |
| --- | --- |
| winner_order_196_1 | An order settled in HKD with a sent invoice of HK$2,451; bind its identity only |

**Steps 57–57 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_197_1 | An order settled in HKD, paid in full, with a part refund `<refund>`; bind its identity only | · |
| refund | HK$100 | (any whole HK$ amount below the amount paid) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 58–59 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_198_1 | A listing won at USD101.00, with a USD20.20 premium and USD10.01 Shipping & Handling, settled in HKD by card; bind its identity only | · |
| HKD Subtotal | HK$1,031.00 | (fixed derived value): HK$793 bid + HK$159 premium + HK$79 Shipping & Handling |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 60–60 data:**

| `<usd amount>` | `<hkd amount>` | Why this row | Fixture notes |
| --- | --- | --- | --- |
| USD100.00 | HK$785 | Exact: 785.00, nothing to round | `<usd amount>`: (fixed boundary) |
| USD100.01 | HK$786 | 785.0785 rounds up, not to nearest | `<usd amount>`: (fixed boundary) |
| USD0.01 | HK$1 | 0.0785 rounds up to one whole HK$ | `<usd amount>`: (fixed boundary) |

**Steps 61–65 data:**

| Field | Value |
| --- | --- |
| winner_order_200_1 | An order settled in HKD whose invoice of HK$2,451 was paid in full; bind its identity only |

**Steps 66–67 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_201_1 | An order settled in HKD by bank transfer on HK Local whose invoice lines total HKD1,031.00, with a bank transfer fee typed in USD; bind its identity only | · |
| bank transfer fee | USD50.00 | (fixed boundary or equality), 5000 minor units, which converts to HKD392.50 before rounding |
| fee HKD | HKD393.00 | (fixed derived value), 39300 minor units |
| total HKD | HKD1,424.00 | (fixed derived value), 142400 minor units |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps 68–69 data:**

| `<payment method>` | `<usd line facts>` | `<hkd line facts>` | Fixture notes |
| --- | --- | ---: | --- |
| Bank transfer | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79 | `<hkd line facts>`: 300; 15,900; 7,900 minor; subtotal 103,100 minor |
| Card | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79 | `<hkd line facts>`: 300; 15,900; 7,900 minor; subtotal 103,100 minor |

| Field | Value |
| --- | --- |
| card rule | 3.4% + 235 minor units |
| card fee | 3873 HKD minor units |
| card amount payable | 106973 HKD minor units |
| usd subtotal | 13121 USD minor units |
| hkd subtotal | 103100 HKD minor units |
| winner_order_202_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps 71–72 data:**

| Field | Value |
| --- | --- |
| winner_order_204_1 | A listing won at USD250 (fixed fixture), settled in HKD, setup confirmed, invoice not sent; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

### Route

1. Wait until `<listing_50_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_50_1>`.
   - Step 2 holds exactly one order, the order described by `<order after close>`. `g10.auction-winner-order.US1-TC57`
3. As customer A, read My Auctions' row for `<listing_50_1>` from the API.
   - Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order. `g10.auction-winner-order.US1-TC57`
4. Filter the send log by `<listing_50_1>` and read the rows from the close.
   - Step 4 reads `<auction won letters>`. `g10.auction-winner-order.US1-TC57`
   - Step 4 holds no row addressed to `<internal bidder>`'s email label: no won, address or setup letter. `g10.auction-winner-order.US1-TC57`
5. Read the invoice premium and converted lines.
   - The premium is the greater of 20% of `<winning bid>` or `<minimum premium>`. `g10.auction-winner-order.US8-TC5`
   - HKD line amounts are each converted at the configured rate and rounded up before summing. `g10.auction-winner-order.US8-TC5`
6. Read the settlement currency and payment method choices.
   - USD and HKD are offered; neither is selected. `g10.auction-winner-order.US24-TC1`
   - No payment method is selected before a currency is chosen. `g10.auction-winner-order.US24-TC1`
7. Choose `<settlement currency>`.
8. Choose a payment method offered for it.
9. Confirm the order setup.
10. Read the invoice currency and order total.
   - The invoice shows the amounts `<invoice amounts>` in `<settlement currency>`, with no conversion for USD. `g10.auction-winner-order.US24-TC2`
   - When `<settlement currency>` is HKD, its converted lines use 7.85 and round up to whole HKD; no USD amount is printed. `g10.auction-winner-order.US24-TC2`
11. Try to change the settlement currency to USD.
12. Read the invoice and order currency.
   - The currency change is refused. `g10.auction-winner-order.US24-TC3`
   - The sent invoice and order remain in HKD. `g10.auction-winner-order.US24-TC3`
13. Choose the home address as the delivery address and as the billing address, and choose no settlement currency.
14. Send Grade10 a setup confirmation carrying both addresses and no currency.
   - Step 14 is refused. `g10.auction-winner-order.US24-TC4`
15. Reload `<winner_order_182_1>`.
   - Step 15 reads the order in Awaiting Setup, holding no delivery address, no currency and no method. `g10.auction-winner-order.US24-TC4`
16. Open `<winner order url>` for `<winner_order_183_1>`.
17. Choose the home address, choose HKD and choose FPS.
18. Confirm the home address.
   - Step 18 is accepted. `g10.auction-winner-order.US24-TC5`
19. Reload `<winner_order_183_1>`.
   - Step 19 reads HKD as the order's settlement currency. `g10.auction-winner-order.US24-TC5`
   - Step 19 reads the order as Preparing Invoice. `g10.auction-winner-order.US24-TC5`
20. As the operator, change the settlement currency to USD with the reason `Winner picked the wrong currency`.
   - Step 20: the order records USD and still reads Preparing Invoice. `g10.auction-winner-order.US24-TC6`
21. As the winner, open `<winner order url>` for `<winner_order_184_1>` and read the order.
   - Step 21: Winner Order reads in USD and offers no control to change the currency. `g10.auction-winner-order.US24-TC6`
22. As the winner, send Grade10 a request to change the currency to HKD.
   - Step 22: the request is refused. `g10.auction-winner-order.US24-TC6`
23. Read the order again.
   - Step 23: the order still reads USD. `g10.auction-winner-order.US24-TC6`
24. Reissue the invoice in USD, keeping HK Local, with a reason.
25. Read the new invoice's Winning Bid.
26. Read the replaced invoice in the order's invoice history.
   - The new invoice's Winning Bid reads `<winning bid>` in USD, with no conversion. `g10.auction-winner-order.US24-TC7`
   - The replaced invoice still reads its Winning Bid in HKD, `<winning bid HKD>`. `g10.auction-winner-order.US24-TC7`
27. Choose `<currency>`.
28. Read all payment method choices.
   - Exactly `<offered methods>` are offered. `g10.auction-winner-order.US25-TC1`
   - Each bank rail is a separate choice. `g10.auction-winner-order.US25-TC1`
   - No method from the other currency is offered. `g10.auction-winner-order.US25-TC1`
29. Switch settlement currency to HKD.
30. Read the selected method and available choices.
   - International via SWIFT is no longer selected or offered. `g10.auction-winner-order.US25-TC2`
   - The available HKD choices appear, with none selected. `g10.auction-winner-order.US25-TC2`
31. Choose the home address, choose USD and choose International via SWIFT.
32. Change the settlement currency to HKD.
33. Read the payment method choice.
   - Step 33: no method is selected. `g10.auction-winner-order.US25-TC3`
34. Confirm the home address without choosing a method.
   - Step 34 is refused. `g10.auction-winner-order.US25-TC3`
35. Reload `<winner_order_188_1>`.
   - Step 35 reads the order in Awaiting Setup, holding no delivery address, no currency and no method. `g10.auction-winner-order.US25-TC3`
36. Select `<selected method>` for USD.
37. Switch settlement currency to HKD.
38. Read the selected payment method.
   - `<expected selection>` because HKD still offers `<selected method>`. `g10.auction-winner-order.US25-TC4`
39. Choose the home address and `<settlement currency>`.
40. Send Grade10 a setup confirmation carrying the home address and `<rail>`.
   - Step 40 is refused. `g10.auction-winner-order.US25-TC5`
41. Reload `<winner_order_190_1>`.
   - Step 41 reads the order in Awaiting Setup, holding no delivery address, no currency and no method. `g10.auction-winner-order.US25-TC5`
42. Choose the home address and HKD.
43. Read each method in the payment method choice.
   - Card reads `Card fee about 3.4% + a fixed amount`. `g10.auction-winner-order.US25-TC6`
   - FPS and HK Local each read `Bank fee set on your invoice`, naming no amount. `g10.auction-winner-order.US25-TC6`
   - No method is selected. `g10.auction-winner-order.US25-TC6`
44. Choose the home address and HKD, and read the payment method choice.
   - Step 44 offers exactly `<offered methods>`. `g10.auction-winner-order.US25-TC7`
45. Send Grade10 a setup confirmation carrying the home address and `<rail>`.
   - Step 45 is refused. `g10.auction-winner-order.US25-TC7`
46. Reload `<winner_order_192_1>`.
   - FPS is not offered. `g10.auction-winner-order.US25-TC7`
   - Step 46 reads the order holding no delivery address and no method. `g10.auction-winner-order.US25-TC7`
47. Choose USD and read the card choice.
   - Step 47: card reads `Card fee about 4.4% + a fixed amount`. `g10.auction-winner-order.US25-TC8`
48. Switch to HKD and read the card choice.
   - Step 48: card reads `Card fee about 3.4% + a fixed amount`. `g10.auction-winner-order.US25-TC8`
49. Open `<winner_order_194_1>`'s invoice.
50. Read Buyer's Premium, Shipping & Handling and the total.
51. Open `<winner_order_194_2>`'s invoice and read its Winning Bid.
52. Open `<winner_order_194_3>`'s invoice and read its Winning Bid.
53. Open `<winner_order_194_1>`'s invoice PDF.
   - Step 53: every amount in the invoice PDF reads in HKD, the Winning Bid is 78,500 minor units, and no USD amount or conversion rate appears. `g10.auction-winner-order.US26-TC1`
54. Open `<winner_order_194_4>`'s invoice and read its lines and total.
   - Buyer's Premium reads HK$393 and Shipping & Handling reads HK$95. `g10.auction-winner-order.US26-TC1`
   - The total reads `<total HKD>`, not the whole-total value. `g10.auction-winner-order.US26-TC1`
   - Every amount reads in HKD, and no USD amount appears. `g10.auction-winner-order.US26-TC1`
   - No USD winning bid is printed. `g10.auction-winner-order.US26-TC1`
   - `<winner_order_194_2>`'s Winning Bid is 78,500 minor units in HKD. `g10.auction-winner-order.US26-TC1`
   - `<winner_order_194_3>`'s Winning Bid is 79,300 minor units in HKD, not 79,285. `g10.auction-winner-order.US26-TC1`
   - Step 54: Winning Bid is `<winning bid HKD exact>`, Buyer's Premium is `<premium HKD exact>`, Shipping & Handling is `<shipping HKD exact>`, and the total is `<subtotal HKD exact>`, the sum of the rounded lines. `g10.auction-winner-order.US26-TC1`
55. Read the receipt and payment confirmed letter.
   - The order total and payment each read 103100 minor units in HKD. `g10.auction-winner-order.US26-TC2`
   - Neither document prints the USD winning bid or conversion rate. `g10.auction-winner-order.US26-TC2`
56. Read each letter Grade10 sent for `<winner_order_196_1>`.
   - Every amount in every letter sent after the winner picked HKD reads in HKD. `g10.auction-winner-order.US26-TC3`
   - No letter sent after the winner picked HKD prints a USD winning bid or a conversion rate. `g10.auction-winner-order.US26-TC3`
   - The won-listing letter, sent at the close before any currency was picked, names the winning bid in US$. `g10.auction-winner-order.US26-TC3`
57. Read the order's refund.
   - The refund reads `<refund>` in HKD. `g10.auction-winner-order.US26-TC4`
   - No USD amount appears beside it. `g10.auction-winner-order.US26-TC4`
58. Open the invoice.
59. Read the card fee and the total.
   - The card fee is 3,873 minor units in HKD, the HKD rule's gross-up fee on the HKD Subtotal. `g10.auction-winner-order.US26-TC5`
   - The total is 106,973 minor units in HKD. `g10.auction-winner-order.US26-TC5`
   - The USD rule is not applied. `g10.auction-winner-order.US26-TC5`
60. Convert `<usd amount>` to HKD.
   - The result is `<hkd amount>`. `g10.auction-winner-order.US26-TC6`
61. Read the settlement currency choice before picking HKD on a new order.
62. Read Order Summary on `<winner_order_200_1>`.
63. Read its invoice.
64. Read its receipt.
65. Read each letter sent for it.
   - No surface names a rate, an exchange rate or 7.85. `g10.auction-winner-order.US26-TC7`
66. Open the invoice.
67. Read the Payment Processing Fee and the total.
   - The Payment Processing Fee reads `<fee HKD>`, the typed amount converted and rounded up to the whole HK$. `g10.auction-winner-order.US26-TC8`
   - The total reads `<total HKD>`, the sum of the rounded lines and the fee. `g10.auction-winner-order.US26-TC8`
   - Every amount reads in HKD. `g10.auction-winner-order.US26-TC8`
68. Read each Order Summary from top to bottom: `<usd line facts>`, then `<hkd line facts>` for `<payment method>`.
69. Read the amount payable for `<payment method>`.
   - Both rows list the bid, premium and Shipping & Handling lines in USD. `g10.auction-winner-order.US27-TC1`
   - Both rows show the USD subtotal of `<usd subtotal>` before the HKD subtotal of `<hkd subtotal>`. `g10.auction-winner-order.US27-TC1`
   - The bank-transfer row has no card fee and has an amount payable of `<hkd subtotal>` in HKD. `g10.auction-winner-order.US27-TC1`
   - The card row shows the HKD card fee of `<card fee>` after the separator below both totals; its amount payable is `<card amount payable>` in HKD and includes the fee, with no USD fee line. `g10.auction-winner-order.US27-TC1`
70. Read the Order Summary totals.
   - The summary shows one USD total. `g10.auction-winner-order.US27-TC2`
   - It shows no HKD subtotal or fee. `g10.auction-winner-order.US27-TC2`
71. Read Order Summary.
   - Step 71: no HKD total shows. `g10.auction-winner-order.US27-TC3`
72. Read the listing card.
   - Step 72: the winning bid reads USD250.00, in USD. `g10.auction-winner-order.US27-TC3`

## g10.auction-winner-order.US1: Winner settles a won listing

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the listing I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-8q4 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC1: A listing closing with a winner opens one order whose quoted charges read TBD

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, holds a default shipping address) leads `<listing_1_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1_1 | A listing taking bids, led by this collector, closing within a minute; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Wait for `<listing_1_1>` to close.
2. Navigate to `<winner order url>` for `<listing_1_1>`.
3. Read Order Summary.

**Expected Results:**

* Step 2: one Winner Order exists for `<listing_1_1>`.
* Step 3: Shipping & Handling, Insurance and Tax read TBD.
* Step 3: no charge is marked as an estimate.

<!-- trace:case id=g10.auction-winner-order.TC-qaq rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC2: With no delivery address the invoice cannot be paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, no default shipping address) leads `<listing_2_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2_1 | A listing taking bids, led by this collector, closing within a minute; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Wait for `<listing_2_1>` to close.
2. Navigate to `<winner order url>` for `<listing_2_1>`.
3. Try to pay.

**Expected Results:**

* Step 2: the winning bid and buyer's premium show.
* Step 2: Shipping & Handling, Insurance and Tax read TBD.
* Step 3: payment is refused until a delivery address is given.

<!-- trace:case id=g10.auction-winner-order.TC-shz rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC3: A pre-filled default address must still be confirmed before paying

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_3_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_3_1 | An unpaid order whose delivery address is pre-filled from the account default, not confirmed; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Try to pay without confirming the delivery address.

**Expected Results:**

* Payment is refused.
* The order asks the winner to confirm the delivery address.

<!-- trace:case id=g10.auction-winner-order.TC-yuw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC4: Changing the address shows the old and new totals before paying

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_4_1>`.
* `<address_far>` is saved on the account.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_4_1 | An unpaid HKD order, total `<total before>`; bind its identity only | · |
| address_far | Far: a saved address whose shipping and insurance cost `<difference>` more; bind the address name only | · |
| total before | HKD3,280 | (fixed derived value) |
| difference | HKD50 | (range: 1000–79999 minor units) |
| total after | HKD 3,330.00 | `<total before>` plus `<difference>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Change the delivery address to the saved address named `<address_far>`.
2. Read the totals before paying.

**Expected Results:**

* The new total reads `<total after>`, equal to `<total before>` plus `<difference>`.
* Both `<total before>` and `<total after>` show before payment.
* No separate charge of `<difference>` is raised.

<!-- trace:case id=g10.auction-winner-order.TC-0p6 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC5: The winner's card holds nothing from bidding and one fresh charge settles

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer A(card linked) leads `<listing_5_1>`, bidding on the card on file.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5_1 | A listing taking bids, led by customer A, closing within a minute; bind its identity only |
| card | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |

**Steps:**

1. Wait for `<listing_5_1>` to close.
2. Read customer A's authorizations and charges for `<listing_5_1>` at the card provider.
3. Once the invoice for `<listing_5_1>` is sent, pay it by card through hosted Checkout with `<card>`.
4. Read customer A's card transactions for `<listing_5_1>` again.

**Expected Results:**

* Step 2 shows no authorization and no charge for `<listing_5_1>`.
* Step 3 opens hosted Checkout for the invoice total.
* Step 4 shows one charge, for the invoice total.

<!-- trace:case id=g10.auction-winner-order.TC-5vo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC6: A declined card leaves the invoice payable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_6_1>`.
* `<card_declining>` is mocked to decline.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_6_1 | An unpaid order inside its payment deadline; bind its identity only |
| card_declining | A card the provider declines |
| card_good | A card the provider accepts |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Pay with `<card_declining>`.
2. Pay with `<card_good>`.

**Expected Results:**

* Step 1: the invoice stays unpaid and payable.
* Step 2: payment is accepted; the order reads paid.

<!-- trace:case id=g10.auction-winner-order.TC-vxj rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC7: The payment deadline is seven days from the recorded close

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_7_1>` was extended twice and closed with a winner at `<recorded_close>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7_1 | A listing whose close moved twice under extended bidding; bind its identity only |
| recorded_close | 2026-09-03T12:00:00Z, the recorded (moved) close |
| payment_deadline | 2026-09-10T12:00:00Z: `<recorded_close>` plus 604800s (7 days) |
| pdf_deadline | 2026-09-10 20:00 GMT+8: `<payment_deadline>` in GMT+8 |
| local_deadline | 2026-09-10 08:00 EDT: `<payment_deadline>` in America/New_York |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the payment deadline on `<listing_7_1>`'s invoice.
2. Open `<winner order url>` in a browser set to America/New_York.

**Expected Results:**

* Step 1: the deadline is `<payment_deadline>` and the PDF shows it as `<pdf_deadline>`.
* Step 2: Winner Order shows the same instant in the viewer's local zone as `<local_deadline>`.

<!-- trace:case id=g10.auction-winner-order.TC-h5e rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC8: Two named saved addresses are both offered on an order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, no saved shipping address) won `<winner_order_8_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_8_1 | An unpaid order inside its setup window; bind its identity only |
| address_home | A shipping address named Home |
| address_work | A shipping address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Save `<address_home>` and `<address_work>` to the account address book.
2. Navigate to `<winner order url>` for `<winner_order_8_1>`.
3. Open the delivery address picker.

**Expected Results:**

* Step 1: both addresses are in the address book, each under its name.
* Step 3: both are offered for the order.

<!-- trace:case id=g10.auction-winner-order.TC-hrx rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC9: One default address pre-fills a new order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in) has `<address_home>` as default and `<address_work>` saved.

**Test data:**

| Field | Value |
| --- | --- |
| address_home | A saved shipping address named Home |
| address_work | A saved shipping address named Work |
| winner_order_9_1 | An order opened after step 1; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Set `<address_work>` as the default.
2. Navigate to `<winner order url>` for `<winner_order_9_1>`.

**Expected Results:**

* Step 1: only `<address_work>` is marked default.
* Step 2: the delivery address is pre-filled with `<address_work>`.

<!-- trace:case id=g10.auction-winner-order.TC-jje rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC10: Editing a saved address leaves the order's snapshot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed `<address_home>` on `<winner_order_10_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_10_1 | An unpaid order whose delivery address is `<address_home>`; bind its identity only |
| address_home | A saved shipping address named Home |
| new street | A different address line 1 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Edit `<address_home>`'s address line 1 to `<new street>` in the address book.
2. Navigate to `<winner order url>` for `<winner_order_10_1>`.

**Expected Results:**

* Step 1: the address book shows `<new street>`.
* Step 2: the order still shows the original address line 1.

<!-- trace:case id=g10.auction-winner-order.TC-5jc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC11: An address an unpaid order uses cannot be archived

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed `<address_work>` on `<winner_order_11_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_11_1 | An unpaid order whose delivery address is `<address_work>`; bind its identity only |
| address_work | A saved shipping address named Work |

**Steps:**

1. Archive `<address_work>` in the address book.

**Expected Results:**

* The winner is asked to choose another address for `<winner_order_11_1>`.
* `<address_work>` stays available while the order uses it.

<!-- trace:case id=g10.auction-winner-order.TC-nsg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC12: Add Address opens with no phone country chosen

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_12_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_12_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Look at the Phone field.

**Expected Results:**

* Phone shows a globe only: no flag, no calling-code divider.
* The placeholder shows an example with a calling code, `+852 12345678`.
* No calling country is chosen.

<!-- trace:case id=g10.auction-winner-order.TC-4gp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC13: Add Address opens on Personal with Company Name hidden

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_13_1>`, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_13_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open Add Address for delivery.
2. Read the Personal / Company control and the fields below it.

**Expected Results:**

* Personal is selected.
* Company Name is not shown.

<!-- trace:case id=g10.auction-winner-order.TC-rx1 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC14: Choosing Company shows a required Company Name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_14_1>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_14_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps:**

1. Click Company on the Personal / Company control.
2. Read the fields below it.

**Expected Results:**

* Company is selected.
* Company Name shows, marked required.

<!-- trace:case id=g10.auction-winner-order.TC-51d rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC16: Missing required address field is refused

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_15_1>`, with form mode `<form mode>` and missing field `<missing field>`.

**Test data:**

| `<form mode>` | `<missing field>` | `<phone country>` | `<phone digits>` | `<company name>` |
| --- | --- | --- | --- | --- |
| Company | Company Name | United States | 4155550100 | (empty) |
| Personal | Phone | United States | (empty) | Not shown |
| Personal | Phone | (not chosen) | 4155550100 | Not shown |

| Field | Value |
| --- | --- |
| winner_order_15_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Prepare mode `<form mode>`, phone country `<phone country>`, phone digits `<phone digits>` and Company Name `<company name>` where shown; leave `<missing field>` unset.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside `<missing field>`.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qwo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC18: An unusual phone format is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_16_1>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_16_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps:**

1. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
2. Click confirm.

**Expected Results:**

* The confirm is accepted; no phone-format refusal shows.
* The address is applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qia rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC19: A parseable phone is stored in E.164

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_17_1>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_17_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| stored phone | +14155550100 |

**Steps:**

1. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, stored phone `<stored phone>`.
2. Click confirm.
3. Read the phone on the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: the phone reads `<stored phone>`.

<!-- trace:case id=g10.auction-winner-order.TC-phu rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC20: Address line 2 and state may be left empty

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_18_1>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_18_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Address line 2 | (empty) |
| State or province | (empty) |
| Postal code | 94105 |

**Steps:**

1. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Address line 2 `<Address line 2>`, State or province `<State or province>`, Postal code `<Postal code>`.
2. Click confirm.
3. Read the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: line 1 and postal code show; line 2 and state are empty.

<!-- trace:case id=g10.auction-winner-order.TC-2vd rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC21: Add Address has no Apt, Suite or Building field

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_19_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_19_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps:**

1. Read every field label on the form.

**Expected Results:**

* No Apt., Suite or Building field shows.
* Address line 2 shows as the optional second line.

<!-- trace:case id=g10.auction-winner-order.TC-4zr rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC22: Address card title follows its address type

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner, has saved address `<address fixture>` of type `<address type>`) is on `<winner order url>` for `<winner_order_20_1>`, Complete Order Setup open.

**Test data:**

| `<address type>` | `<address title>` | `<address fixture>` |
| --- | --- | --- |
| Personal | Alex Chen | Saved personal address with street, city or region, country, phone and postal code |
| Company | Northwind Collectibles | Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code |

| Field | Value |
| --- | --- |
| winner_order_20_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Read the card for `<address fixture>`.

**Expected Results:**

* The title reads `<address title>` for the `<address type>` address.
* The body shows street, city or region, and country.
* The body shows no postal code and no phone.

<!-- trace:case id=g10.auction-winner-order.TC-ajg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC24: A company delivery address with phone confirms onto the order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<winner_order_21_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_21_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Click Company.
2. Fill Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
3. Click confirm.
4. Reopen the delivery address picker.

**Expected Results:**

* Step 3: the order's delivery address carries Northwind Collectibles, Alex Chen, phone and 94105.
* Step 4: the card reads Northwind Collectibles, with no phone or postal code.

<!-- trace:case id=g10.auction-winner-order.TC-kqe rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC25: Order Summary shows the full delivery and billing addresses after setup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_22_1>`, reading Awaiting Setup.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_22_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone | +14155550100 |
| Address line 1 | 100 Market St |
| Town or city | San Francisco |
| Postal code | 94105 |
| Country or region | United States |
| Billing | Same as delivery, left ticked |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open Complete Order Setup.
2. Enter Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone `<Phone>`, Address line 1 `<Address line 1>`, Town or city `<Town or city>`, Postal code `<Postal code>`, Country or region `<Country or region>`, Billing `<Billing>`, winner order url `<winner order url>`.
3. Confirm setup.
4. Read Delivery and Billing on Order Summary.

**Expected Results:**

* Delivery shows company, recipient, phone, 100 Market St, San Francisco 94105 and United States.
* Billing shows the same as Delivery.

<!-- trace:case id=g10.auction-winner-order.TC-apy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC26: A sent invoice with Insurance shows the amount and its tip

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_23_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_23_1 | An order whose sent invoice includes Insurance; bind its identity only |
| insurance_amount | The Insurance amount on that invoice |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Find Insurance on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance reads `<insurance_amount>`, not TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-aq5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC27: Before the invoice is sent, Insurance reads TBD

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_24_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_24_1 | An order whose invoice is not yet sent; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the fee rows on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance shows with the other fee rows, reading TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-7cb rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC28: A sent invoice without Insurance shows no Insurance row

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_25_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_25_1 | An order whose sent invoice has no Insurance; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Summary.

**Expected Results:**

* No Insurance row and no Insurance tooltip show.

<!-- trace:case id=g10.auction-winner-order.TC-u99 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC29: A listing code already held is replaced before publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_26_1>` holds listing code `<code_1>`.
* `<listing_26_2>` is a draft whose internal id hashes to `<code_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| code_1 | A listing code in use |

| Field | Value |
| --- | --- |
| listing_26_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_26_2 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps:**

1. Publish `<listing_26_2>`.
2. Read `<listing_26_2>`'s listing code.
3. Change the hash method, then read both listing codes.

**Expected Results:**

* Step 2: `<listing_26_2>` holds a code other than `<code_1>`, hashed again with a counter.
* Step 2: `L` and 5 characters; no `0`, `O`, `1`, `I` or lower case.
* Step 3: both listings keep their codes.

<!-- trace:case id=g10.auction-winner-order.TC-6vp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC34: The winner sees an operator's edit before send, and cannot change it

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_27_1>`.
* An operator changed `<winner_order_27_1>` to `<address_work>` and bank transfer.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_27_1 | An HKD order reading Preparing Invoice, home address and card confirmed; bind its identity only |
| address_work | A saved address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Reload the order.
2. Look for address and payment-method controls.

**Expected Results:**

* Step 1: the order shows `<address_work>` and bank transfer, still Preparing Invoice.
* Step 2: no control changes either.

<!-- trace:case id=g10.auction-winner-order.TC-gk5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC35: Archiving an address a confirmed order uses leaves the order's copy

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed `<address_work>` on `<winner_order_28_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_28_1 | An order reading Preparing Invoice, `<address_work>` confirmed; bind its identity only |
| address_work | A saved address named Work |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Archive `<address_work>` in the address book.
2. Navigate to `<winner order url>` for `<winner_order_28_1>`.

**Expected Results:**

* Step 1: `<address_work>` is archived.
* Step 2: the order still shows `<address_work>`.

<!-- trace:case id=g10.auction-winner-order.TC-nxn rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC36: Delivery Add Address offers a complete A–Z country catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed.

* The winner order under test is `<winner_order_29_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_29_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker.
2. Scroll the popup from the first option to the last.

**Expected Results:**

* Step 1 opens a popup listing every country and region A–Z, not a short designated set.
* Step 2 keeps the full catalogue available inside the capped-height popup.

<!-- trace:case id=g10.auction-winner-order.TC-0v6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC37: Country/Region field label matches the manual wording

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

* The winner order under test is `<winner_order_30_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_30_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Look at the country or region field label beside the picker.

**Expected Results:**

* The label reads Country/Region.

<!-- trace:case id=g10.auction-winner-order.TC-20b rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC38: Closed field shows the selected or default country

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed with the fixture default Hong Kong selected.

* The winner order under test is `<winner_order_31_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_31_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read the Country/Region field without opening the popup.

**Expected Results:**

* The field shows Hong Kong.
* Country/Region options are not in the tree.

<!-- trace:case id=g10.auction-winner-order.TC-8fw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC39: Open catalogue lists every country inside a scrollable popup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

* The winner order under test is `<winner_order_32_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_32_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker.
2. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.

**Expected Results:**

* Step 1 shows every country and region A–Z in the popup.
* Step 2 scrolls the long list inside a capped height without truncating the catalogue to a short set.

<!-- trace:case id=g10.auction-winner-order.TC-gsw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC40: Typing filters the list to matching country names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open on a long A–Z list.

* The winner order under test is `<winner_order_33_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | hong |

| Field | Value |
| --- | --- |
| winner_order_33_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Focus the open Country/Region picker.
2. Type `<Typed query>`.

**Expected Results:**

* Step 2 shows only country or region names that match the query.
* Names that do not match (for example Australia) are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-x35 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC41: Autocomplete filter works in isolation on a long list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* A design-system Autocomplete is rendered with a long option list taller than its capped popup height.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | uni |

**Steps:**

1. Open the Autocomplete.
2. Type `<Typed query>`.

**Expected Results:**

* The list shows only options whose labels match the query.
* Non-matching options are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-8bf rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC42: A query with no match leaves the list empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

* The winner order under test is `<winner_order_35_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |

| Field | Value |
| --- | --- |
| winner_order_35_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Type `<Typed query>`.

**Expected Results:**

* The list shows no country or region options.

<!-- trace:case id=g10.auction-winner-order.TC-9fh rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC43: Country filter returns the matching name

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
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

* The winner order under test is `<winner_order_36_1>`.

**Test data:**

| Query partition | `<typed query>` | `<matching result>` |
| --- | --- | --- |
| Early alphabet | afg | Afghanistan, or the catalogue name that matches |
| Late alphabet | zim | Zimbabwe, or the catalogue name that matches |

| Field | Value |
| --- | --- |
| winner_order_36_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Type `<typed query>`.

**Expected Results:**

* The country `<matching result>` appears in the filtered list.
* Unrelated country names outside the query are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-r90 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC45: Choosing a filtered country closes the picker on that selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed on the fixture default.

* The winner order under test is `<winner_order_37_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | united king |
| Country or region | United Kingdom |

| Field | Value |
| --- | --- |
| winner_order_37_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker.
2. Type `<Typed query>`.
3. Select United Kingdom from the filtered matches.

**Expected Results:**

* Step 3 closes the popup.
* The field shows United Kingdom.
* Options are no longer in the tree.

<!-- trace:case id=g10.auction-winner-order.TC-iso rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC46: Empty Country/Region is refused beside the field

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* Country/Region has no value selected.
* Other required address fields that the form needs are filled.

* The winner order under test is `<winner_order_38_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_38_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Activate Confirm or Use This Address with Country/Region empty.

**Expected Results:**

* A field refusal appears beside Country/Region.
* The address is not applied with an empty country or region.

<!-- trace:case id=g10.auction-winner-order.TC-wc8 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC47: Catalogue includes both early and late alphabet partitions

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

* The winner order under test is `<winner_order_39_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_39_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker.
2. Note whether an early-alphabet name and a late-alphabet name both appear in the list.

**Expected Results:**

* The open list includes names from the start of the A–Z range and from near the end.
* The set is not limited to a short designated sample.

<!-- trace:case id=g10.auction-winner-order.TC-ujy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC30: Tax is pending before the invoice is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds an auction order whose invoice has not been sent.

* The winner order under test is `<winner_order_40_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_40_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open Winner Order.
2. Read Tax in Order Summary and open its info tip.

**Expected Results:**

* Tax reads TBD with the other fee rows.
* No calculated Tax amount is shown.
* The tip reads `Set by Grade10 for where your order ships. Some orders have none.`

<!-- trace:case id=g10.auction-winner-order.TC-m21 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC31: Sent tax is itemised throughout the order record

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose invoice includes Tax of HKD70 (range: >0 minor units).

* The winner order under test is `<winner_order_41_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_41_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* Order Summary shows Tax of HKD70 (range: >0 minor units) between Insurance and Payment Processing Fee.
* Order Summary offers the Tax info tip with the stated copy.
* The invoice PDF and the receipt PDF each show Tax of HKD70 (range: >0 minor units) between Insurance and Subtotal.
* Each PDF's Subtotal includes Tax of HKD70 (range: >0 minor units).

<!-- trace:case id=g10.auction-winner-order.TC-nvv rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC32: An untaxed invoice leaves Tax out

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose operator added no Tax.

* The winner order under test is `<winner_order_42_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_42_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* No surface shows a Tax line.
* Order Summary offers no Tax info tip.

<!-- trace:case id=g10.auction-winner-order.TC-dvc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC33: Card fee is grossed up on tax

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* admin(operator with payment-processing) is on a card order in Preparing Invoice.
* The order's lines before Tax total HKD3,280 (fixed derived value).

* The winner order under test is `<winner_order_43_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_43_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Add Tax of HKD70 (range: >0 minor units).
2. Send the invoice.
3. Read its Subtotal and payment processing fee inputs.

**Expected Results:**

* The Subtotal is HKD3,350 (fixed derived value).
* Grade10 computes the payment processing fee from that Subtotal.

<!-- trace:case id=g10.auction-winner-order.TC-n0y rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC48: A currency without bank details offers card only

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
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds no bank details for the currency `<settlement currency>`.
* customer(winner) holds an auction order in `<settlement currency>` in Awaiting Setup.

* The winner order under test is `<winner_order_44_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| settlement currency | The supported settlement currency with no bank details in this fixture; bind its currency code only |
| winner_order_44_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Start setup, choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

<!-- trace:case id=g10.auction-winner-order.TC-4dz rev=3 covers=g10.auction-winner-order.SC-pt5 -->
### g10.auction-winner-order.US1-TC50:

Runs once per row of **Test data**. The method can change until the winner confirms

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

* The winner order under test is `<winner_order_45_1>`.

**Test data:**

| `<new rail>` | `<recorded method>` |
| --- | --- |
| FPS | bank transfer on FPS |
| HK Local | bank transfer on HK Local |

| Field | Value |
| --- | --- |
| winner_order_45_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Change the choice to `<new rail>`.
2. Confirm the home address.
3. Reload the order.

**Expected Results:**

* The order records `<recorded method>`, not card.
* The order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-miy rev=1 covers=g10.auction-winner-order.SC-wn1 -->
### g10.auction-winner-order.US1-TC51: A confirmation with no method is refused

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

* The winner order under test is `<winner_order_46_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_46_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address, choose no payment method, and confirm.
2. Reload the order.

**Expected Results:**

* Grade10 refuses the confirmation.
* The order is still Awaiting Setup.

<!-- trace:case id=g10.auction-winner-order.TC-csb rev=2 covers=g10.auction-winner-order.SC-vbp,g10.auction-winner-order.SC-7y2 -->
### g10.auction-winner-order.US1-TC52: A currency with no card fee rule reads card as not yet available

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds no card fee rule in `<settlement currency>`.
* customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.

* The winner order under test is `<winner_order_47_1>`.

**Test data:**

| `<settlement currency>` | `<offered rails>` |
| --- | --- |
| HKD | FPS, HK Local |
| USD | HK Local, International via SWIFT |

| Field | Value |
| --- | --- |
| winner_order_47_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and `<settlement currency>`, and reach the payment method choice.
2. Try to choose card.
3. Send Grade10 a setup confirmation carrying the home address and card.
4. Reload the order.

**Expected Results:**

* Card reads that it is not yet available in `<settlement currency>`, and cannot be chosen.
* The rails `<offered rails>` are offered.
* Grade10 refuses the confirmation.
* The order holds no delivery address and no method.

<!-- trace:case id=g10.auction-winner-order.TC-z2f rev=1 covers=g10.auction-winner-order.SC-cz1 -->
### g10.auction-winner-order.US1-TC53: With neither method the winner reads payment is not yet available

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

* The winner order under test is `<winner_order_48_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_48_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Try to choose card, then bank transfer, then confirm.
3. Reload the order.

**Expected Results:**

* The page says payment is not yet available in USD and offers Contact Us.
* Neither method can be chosen, and Grade10 refuses the confirmation.
* The order is still Awaiting Setup, holding no delivery address and no method.

<!-- trace:case id=g10.auction-winner-order.TC-97r rev=1 covers=g10.auction-winner-order.SC-05o -->
### g10.auction-winner-order.US1-TC56: A Traditional Chinese account reads and searches Country/Region in Traditional Chinese

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) whose account language is Traditional Chinese is on delivery Add Address of an auction order in Awaiting Setup.

* The winner order under test is `<winner_order_49_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_49_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker and read the names.
2. Type `日本`.

**Expected Results:**

* The names read in Traditional Chinese.
* The list narrows to `日本`.

<!-- trace:case id=g10.auction-winner-order.TC-srq rev=2 covers=g10.auction-winner-order.SC-los -->
### g10.auction-winner-order.US1-TC57: A close with an internal bidder leading opens its order with its billing address and sends no letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_50_1>` is prepared with this bidding state: `<bidding at close>`, its recorded close a few minutes away, and no further bid is coming.
* `<listing_50_1>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, which holds `<house billing address>`.
* customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_50_1>` as described by `<bidding at close>`.
* admin(auction operator) is on `<grade10 auction send log url>`.

* The winner order under test is `<winner_order_50_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_50_1 | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00); bind its identity only | · |
| house maximum | 600000 minor units | (HK$6,000.00), the listing's committed internal bid |
| internal bidder | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test | · |
| house billing address | A Hong Kong address with every required field: name "Grade10 Stock Room", 1 Test Road, Central, Hong Kong | · |

| Row | `<bidding at close>` | `<order after close>` | `<auction won letters>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | One, `<internal bidder>`'s, flagged internal, winning bid 508000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | One, `<internal bidder>`'s, flagged internal, winning bid 400000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, not flagged internal, winning bid 608000, Awaiting Setup | One, to customer A |

| Field | Value |
| --- | --- |
| winner_order_50_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Wait until `<listing_50_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_50_1>`.
3. As customer A, read My Auctions' row for `<listing_50_1>` from the API.
4. Filter the send log by `<listing_50_1>` and read the rows from the close.

**Expected Results:**

* Step 2 holds exactly one order, the order described by `<order after close>`.
* Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order.
* Step 4 reads `<auction won letters>`.
* Step 4 holds no row addressed to `<internal bidder>`'s email label: no won, address or setup letter.

### g10.auction-winner-order.US1-TC15: A company address without Company Name is refused (folded into g10.auction-winner-order.US1-TC16)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<order_setup>`, Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| Company Name | (empty) |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Company Name.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-r03 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC17: Phone digits with no country are refused (folded into g10.auction-winner-order.US1-TC16)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | (not chosen) |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Phone.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-jo6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC23: A company address card is titled with the company name (folded into g10.auction-winner-order.US1-TC22)

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner, has `<address_company>` saved) is on `<winner order url>` for `<order_setup>`, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_company>` | A saved company address for Northwind Collectibles, recipient Alex Chen, with phone and postal code |

**Steps:**

1. Open the delivery address picker.
2. Read `<address_company>`'s card.

**Expected Results:**

* The title reads Northwind Collectibles, not Alex Chen.
* The body shows street, city or region, and country.
* The body shows no postal code and no phone.

<!-- trace:case id=g10.auction-winner-order.TC-u2z rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC44: Filter matches a late-alphabet name (folded into g10.auction-winner-order.US1-TC43)

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open near the start of the A–Z list.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zim |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* Zimbabwe (or the catalogue name that matches) appears in the filtered list.
* Unrelated early-alphabet names are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-pvm rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC49: A currency with no bank details offers card only (folded into g10.auction-winner-order.US1-TC48)

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Payment Settings holds a USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

---

## g10.auction-winner-order.US2: Winner follows a settled listing to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=2 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC1: The receipt itemises what was paid and sums to the total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_51_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_51_1 | An HKD order paid in full at `<final amount>`; bind its identity only | · |
| final amount | HKD3,330 | (range: 80000–399999 minor units) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Download the receipt PDF.
2. Read its lines.

**Expected Results:**

* Winning bid, buyer's premium, shipping, insurance when added, Tax when added and final amount show.
* The lines sum to `<final amount>`.
* It names how it was paid.

<!-- trace:case id=g10.auction-winner-order.TC-qvc rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC4: A single full payment's receipt reads zero before and zero left

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_52_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_52_1 | An HKD order with invoice total `<total>`, paid by one payment of `<total>`; bind its identity only | · |
| total | HKD1,080 | (fixed derived value) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<total>`; Remaining Balance Due 0.

<!-- trace:case id=g10.auction-winner-order.TC-myw rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC5: Receipts for part payments carry the running history in order

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_53_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_53_1 | An HKD order with invoice total `<total>`, paid `<payment 1>` then `<payment 2>`; bind its identity only | · |
| total | HKD 1 | 080.00 |
| payment 1 | HKD 420.00 | · |
| payment 2 | HKD 310.00 | · |

| Receipt | `<previous payments>` | `<current payment received>` | `<remaining balance due>` | Fixture notes |
| --- | --- | --- | --- | --- |
| First | 0 | HKD 420.00 | HKD 660.00 | `<remaining balance due>`: `<total>` − `<payment 1>` |
| Second | HKD 420.00 | HKD 310.00 | HKD 350.00 | `<remaining balance due>`: `<total>` − `<payment 1>` − `<payment 2>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the Receipt PDF row.
2. Open the first receipt, then the second.

**Expected Results:**

* Step 1: both receipts are listed on one row, oldest first.
* Step 2: each shows Original Invoice Total `<total>` with Previous Payments `<previous payments>`, Current Payment Received `<current payment received>` and Remaining Balance Due `<remaining balance due>`.

<!-- trace:case id=g10.auction-winner-order.TC-gss rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC6: A receipt that closes within tolerance reads zero left

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_54_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_54_1 | An HKD order, total `<total>`, paid `<paid before>`, then closed Paid by an operator recording `<closing payment>` within the closing tolerance; bind its identity only | · |
| total | HKD 1 | 080.00 |
| paid before | HKD 960.00 | · |
| closing payment | HKD 60.00 | · |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the receipt for `<closing payment>`.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments `<paid before>`.
* Current Payment Received `<closing payment>`; Remaining Balance Due 0.
* No shortfall or write-off line shows.

<!-- trace:case id=g10.auction-winner-order.TC-b4d rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC7: An overpayment's receipt records the whole payment and zero left

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_55_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_55_1 | An HKD order, total `<total>`, with an operator-confirmed payment of `<payment>`; bind its identity only | · |
| total | HKD 1 | 080.00 |
| payment | HKD 1 | 190.00 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the receipt.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<payment>`; Remaining Balance Due 0.
* No negative balance or credit line shows.

<!-- trace:case id=g10.auction-winner-order.TC-vmr rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC8: A later refund or reversal leaves issued receipts unchanged

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_56_1>`.
* The second payment was later refunded or reversed.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_56_1 | An HKD order, total HKD 1,080.00, paid HKD 220.00, HKD 310.00, HKD 140.00 in that order, one receipt each; bind its identity only |

| Receipt | `<previous payments>` | `<current payment received>` | `<remaining balance due>` |
| --- | --- | --- | --- |
| First | 0 | HKD 220.00 | HKD 860.00 |
| Second | HKD 220.00 | HKD 310.00 | HKD 550.00 |
| Third | HKD 530.00 | HKD 140.00 | HKD 410.00 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open each receipt in turn.

**Expected Results:**

* Each receipt still shows Previous Payments `<previous payments>`, Current Payment Received `<current payment received>` and Remaining Balance Due `<remaining balance due>`.
* No receipt was reissued.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=3 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC2: A dispatched listing shows the tracking number as the carrier link only with a tracker link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_57_1>` and `<winner_order_57_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_57_1 | A paid order dispatched with a carrier, `<tracking number>` and a recorded tracker link; bind its identity only |
| winner_order_57_2 | A paid order dispatched with a carrier and `<tracking number>`, and no tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| tracking number | The shipment tracking number on the seeded order; bind its number only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the shipment section of `<winner_order_57_1>`.
2. Click `<tracking number>`.
3. Read the shipment section of `<winner_order_57_2>`.

**Expected Results:**

* Step 1: `<tracking number>` shows as a link, with no separate carrier name.
* Step 2: the tracker link opens.
* Step 3: `<tracking number>` shows as plain text, with no carrier name and no Track shipment control.

<!-- trace:case id=g10.auction-winner-order.TC-l8v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC3: Delivery proof keeps the carrier's timestamp and signature

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<winner_order_58_1>` is dispatched.
* The carrier delivery feed is mocked to report delivery with `<handover time>` and `<signature>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_58_1 | A paid, dispatched order; bind its identity only |
| handover time | The handover timestamp in the carrier's report |
| signature | The signature image in the carrier's report |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Wait for the delivery report to be processed.
2. Navigate to `<winner order url>` for `<winner_order_58_1>`.
3. Open the delivery proof.

**Expected Results:**

* `<handover time>` and `<signature>` show, not only a delivered flag.

<!-- trace:case id=g10.auction-winner-order.TC-v6v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC9: A receipt ID takes the payment month and the receipt shows the breakdown

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_59_1>`.
* admin(holds payment-processing) confirms its proof at `<confirm time>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_59_1 | An HKD order, invoice `INV-202609-LK7P2Q-02`, total `<total>`, reading Payment Verifying; bind its identity only | · |
| total | HKD3,290 | (fixed derived value) |
| confirm time | 2026-09-30T16:30:00Z, October in Hong Kong | · |
| receipt id | `REC-202610-LK7P2Q-02-P1` | · |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* The receipt ID is `<receipt id>`.
* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<total>`; Remaining Balance Due 0.

<!-- trace:case id=g10.auction-winner-order.TC-kq2 rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC10: Invoice and receipt PDFs outlive a deleted account

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<winner_order_60_1>` is paid, with a replaced invoice, a current invoice and a receipt.
* Its winner deleted the account a year after payment.
* The clock is 6 years after payment, inside the 7-year retention.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_60_1 | A paid order whose invoice was once reissued; bind its identity only |

**Steps:**

1. Retrieve `<winner_order_60_1>`'s documents from the archive.

**Expected Results:**

* The replaced invoice, current invoice and receipt PDFs are all returned.

<!-- trace:case id=g10.auction-winner-order.TC-xx4 rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC11: A repeated payment confirmation keeps one receipt ID

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<winner_order_61_1>` was paid by card; its receipt ID is `<receipt id>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_61_1 | A card-paid order; bind its identity only |
| receipt id | `REC-202609-LK7P2Q-01-P1` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Deliver the same payment confirmation for `<winner_order_61_1>` again.
2. Open the receipt on `<winner order url>` for `<winner_order_61_1>`.

**Expected Results:**

* The receipt ID is still `<receipt id>`.
* No second receipt ID or audit number exists for `<winner_order_61_1>`.

<!-- trace:case id=g10.auction-winner-order.TC-uox rev=1 covers=g10.auction-winner-order.SC-h7d -->
### g10.auction-winner-order.US2-TC13: Shipped Order Progress opens the carrier tracker (folded into g10.auction-winner-order.US2-TC12)

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<shipped order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<shipped order>` | A paid order with fulfilment fulfilled, a tracking number, an operator tracker link and delivery not confirmed |
| `<tracking number>` | The tracking number recorded for `<shipped order>` |
| `<carrier tracking URL>` | The carrier's tracking page for `<shipped order>` |

**Steps:**

1. Read Order Progress.
2. Open `<tracking number>`.

**Expected Results:**

* Order Progress shows `<tracking number>` as an external link with an arrow icon.
* Order Progress shows no Track shipment button or carrier name.
* Step 2 opens `<carrier tracking URL>` in a new tab.

<!-- trace:case id=g10.auction-winner-order.TC-l0r rev=2 covers=g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC12: A shipped or delivered order keeps the carrier tracker

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for an order in `<order state>`, prepared as follows: `<fixture setup>`.

* The winner order under test is `<winner_order_62_1>`.

**Test data:**

| `<order state>` | `<fixture setup>` |
| --- | --- |
| Shipped | Paid, fulfilment fulfilled, delivery not confirmed, tracker link present |
| Delivered | Paid, fulfilment fulfilled, delivery confirmed, tracker link present |

| Field | Value |
| --- | --- |
| winner_order_62_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| carrier tracking url | The public carrier tracking URL for this fixture; bind its URL only |
| tracking number | The shipment tracking number on the seeded order; bind its number only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Progress.
2. Open `<tracking number>`.

**Expected Results:**

* Order Progress shows `<tracking number>` as an external link with an arrow icon.
* Order Progress shows no Track shipment button or carrier name.
* Step 2 opens `<carrier tracking url>` in a new tab.
<!-- trace:case id=g10.auction-winner-order.TC-nmg rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC55: Preparing Shipment pings Shipping with Preparing to ship

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_63_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_63_1 | A paid order with fulfilment `unfulfilled`; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status badge.
2. Read Order Progress.

**Expected Results:**

* Badge reads Preparing Shipment.
* Badge uses `default`.
* Shipping is the current (progress) progress step — not incomplete.
* Shipping subtext reads Preparing to ship.
* No step is labelled Preparing Shipment.

<!-- trace:case id=g10.auction-winner-order.TC-7j8 rev=2 covers=g10.auction-winner-order.SC-lk0 -->
### g10.auction-winner-order.US2-TC20: Shipped keeps Shipping current

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_64_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_64_1 | A paid, fulfilled order with a ship date, a tracking number and a recorded tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status badge and Order Progress.

**Expected Results:**

* Badge reads Shipped and uses `default`.
* Shipping is the current progress step with the day-only ship date.
* The tracking number is the external carrier link.
* Order Progress adds no separate Track shipment control and no separate carrier name.

<!-- trace:case id=g10.auction-winner-order.TC-gg7 rev=1 covers=g10.auction-winner-order.SC-tgb -->
### g10.auction-winner-order.US2-TC14: Shipped order without a tracker link shows the number as plain text

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_65_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_65_1 | A paid order with fulfilment fulfilled and a tracking number, where the operator recorded no tracker link; bind its identity only |
| tracking number | The tracking number recorded for `<winner_order_65_1>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Progress.
2. Select `<tracking number>`.

**Expected Results:**

* Order Progress shows `<tracking number>` as plain text, not a link.
* Order Progress shows no carrier name and no Track shipment control.
* Step 2 opens nothing.

<!-- trace:case id=g10.auction-winner-order.TC-45h rev=1 covers=g10.auction-winner-order.SC-lk0 -->
### g10.auction-winner-order.US2-TC56: A shipped order with no tracker link shows the number as plain text

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_66_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_66_1 | A paid, fulfilled order with a ship date and a tracking number, and no recorded tracker link; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Progress.

**Expected Results:**

* Shipping is the current progress step with the day-only ship date.
* The tracking number reads as plain text, not a link.
* Order Progress shows no carrier name and no Track shipment control.

---

## g10.auction-winner-order.US3: Winner checks the buyer's premium on an invoice

**As a** winner,
**I want** the buyer's premium on my invoice to follow one published rule,
**so that** I can check what I am charged on top of my winning bid.

<!-- trace:case id=g10.auction-winner-order.TC-x85 rev=3 covers=g10.auction-winner-order.SC-zhu,g10.auction-winner-order.SC-b16,g10.auction-winner-order.SC-2mz -->
### g10.auction-winner-order.US3-TC5: The invoice's Buyer's Premium follows the published rule

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
* **Trace:** winner-order-US-03

**Pre-conditions:**

* admin(operator with payment-processing) holds a USD order in Preparing Invoice; its winning bid is `<winning_bid>` and it has no other invoice lines.
* Auction Payment settings holds the USD premium minimum `<premium_minimum>`.

* The winner order under test is `<winner_order_67_1>`.

**Test data:**

| `<winning_bid>` | `<premium_minimum>` | `<buyers_premium>` | `<final_amount>` | Rule | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| USD1,350 | USD0 | USD270.00 | USD1 | 20% of the winning bid | `<winning_bid>`: (range: 80000-399999 minor units); `<final_amount>`: 620.00 |
| USD10.03 | USD0 | USD2.01 | USD12.04 | 20% is 200.6 minor units, rounded half up | `<winning_bid>`: (fixed boundary) |
| USD10.02 | USD0 | USD2.00 | USD12.02 | 20% is 200.4 minor units, rounded half up | `<winning_bid>`: (fixed boundary) |
| USD50 | USD20 | USD20.00 | USD70.00 | The minimum, higher than 20% (USD10) | `<winning_bid>`: (fixed fixture); `<premium_minimum>`: (fixed configured value) |
| USD2,500 | USD200.00 | USD500.00 | USD3 | 20% of the winning bid; operator does not enter it | `<winning_bid>`: (fixed scenario fixture); `<premium_minimum>`: (fixed configured value); `<final_amount>`: 000.00 |

| Field | Value |
| --- | --- |
| winner_order_67_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. As the operator, open Send Invoice and read the quote fields.
2. Send the invoice without entering a buyer's premium.
3. As the winner, read Order Summary.
4. Hover the Buyer's Premium info tooltip.

**Expected Results:**

* Step 1: no buyer's premium input is shown or requested from the operator.
* Step 2: the invoice is sent with Buyer's Premium of `<buyers_premium>`, equal to the greater of 20% of `<winning_bid>` rounded half up to USD cents and `<premium_minimum>`.
* Step 3: the winning bid line reads `<winning_bid>` and Buyer's Premium reads `<buyers_premium>`.
* Step 3: the total equals `<final_amount>`, equal to `<winning_bid>` plus `<buyers_premium>`.
* Step 4: a brief tooltip explains Buyer's Premium.

---

## g10.auction-winner-order.US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the listing moves to Preparing Shipment without contacting Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-9gh rev=2 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC1: An unpaid order shows invoice, Pay with Card, address and listing

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order in Pending Payment, with invoice status.
  `pending` or `expired`.

* The winner order under test is `<winner_order_68_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_68_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.

**Expected Results:**

* Every invoice line and Pay with Card are shown in the order summary.
* The confirmed delivery address and the listing are shown.
* An expired invoice still reads Pending Payment and offers Contact Us instead.
  of Pay with Card.

<!-- trace:case id=g10.auction-winner-order.TC-0cm rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC2: Order Information reads Invoice Status, not Paid Status

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order whose invoice status is paid.

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Scroll to Order Information.

**Expected Results:**

* Invoice Status reads Paid.
* No Paid Status label appears.

<!-- trace:case id=g10.auction-winner-order.TC-3ie rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC3: A timed-out payment session leaves the invoice payable

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order in Pending Payment.

* The winner order under test is `<winner_order_69_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_69_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Click Pay Now.
3. Wait until the payment session times out.
4. Return to `<winner order url>`.

**Expected Results:**

* The page says payment was not completed.
* The order still reads Pending Payment.
* Pay Now is available.

<!-- trace:case id=g10.auction-winner-order.TC-uf2 rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC4: Pay Now after an abandoned session starts a fresh one

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds a Pending Payment order whose last payment session was abandoned.

* The winner order under test is `<winner_order_70_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_70_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Click Pay Now.

**Expected Results:**

* A new payment session opens.
* It charges the same invoice amount.

<!-- trace:case id=g10.auction-winner-order.TC-w3e rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC5: A completed payment shows Confirming payment before Preparing Shipment

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) completed a hosted card session, but the authenticated.
  auction-order read model has not yet recorded the invoice as paid.

* The winner order under test is `<winner_order_71_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_71_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.

**Expected Results:**

* The page shows Confirming payment.
* The order does not read Preparing Shipment.

<!-- trace:case id=g10.auction-winner-order.TC-s0i rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC6: A recorded payment reads Preparing Shipment

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order whose authenticated auction-order read model.
  returns invoice status `paid` and fulfilment status `unfulfilled`.

* The winner order under test is `<winner_order_72_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_72_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.

**Expected Results:**

* The order status reads Preparing Shipment.

---

<!-- trace:case id=g10.auction-winner-order.TC-td7 rev=1 covers=g10.auction-winner-order.SC-1yn -->
### g10.auction-winner-order.US4-TC7: A suspended winner reads the suspension under the listing

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) is suspended from bidding and holds an order whose invoice.
  is `pending`.

* The winner order under test is `<winner_order_73_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_73_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Read the alerts under the listing.
3. Choose Pay what is owed.

**Expected Results:**

* An alert under the listing says bidding is suspended and payment does not lift it.
* Choosing Pay what is owed brings the order summary's pay control into view.

---

## g10.auction-winner-order.US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** Winner Order to read Payment Overdue with Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-uup rev=1 covers=g10.auction-winner-order.SC-9vf -->
### g10.auction-winner-order.US5-TC1: Past the payment deadline the order reads Payment Overdue with Contact Us

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_74_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_74_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status and the inline alert.
2. Look for payment controls.

**Expected Results:**

* Step 1: the order reads Payment Overdue, with Contact Us.
* Step 2: no card Pay is offered and no payment deadline shows.

<!-- trace:case id=g10.auction-winner-order.TC-rwa rev=1 covers=g10.auction-winner-order.SC-9vf -->
### g10.auction-winner-order.US5-TC2: A cancelled order shows no stepper and no invoice PDF

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
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_75_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_75_1 | An unpaid order an operator cancelled; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the page.

**Expected Results:**

* No progress stepper shows.
* No invoice PDF control shows.

---

## g10.auction-winner-order.US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of listing close,
**I want** Winner Order to read Setup Overdue with Contact Us and no Confirm,
**so that** I know self-service setup has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-2in rev=1 covers=g10.auction-winner-order.SC-36a,g10.auction-winner-order.SC-k2b -->
### g10.auction-winner-order.US7-TC1: Past the setup deadline the order reads Setup Overdue with Contact Us

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_76_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_76_1 | An order whose setup deadline, 172800s (48 hours) after the close, passed with setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status and the inline alert.
2. Look for setup controls.

**Expected Results:**

* Step 1: the order reads Setup Overdue, with Contact Us.
* Step 2: no Confirm and no address editing are offered.

<!-- trace:case id=g10.auction-winner-order.TC-s5e rev=1 covers=g10.auction-winner-order.SC-ii6 -->
### g10.auction-winner-order.US7-TC5: The setup deadline still runs where no method is offered

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup, whose listing closed 48 hours ago, with setup not confirmed.
* admin(operator with payment processing).

* The winner order under test is `<winner_order_77_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_77_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. As the winner, open the order.
2. As the operator, open the order and read what it offers.

**Expected Results:**

* The winner's order reads Setup Overdue.
* The operator can reopen or record its setup.

<!-- trace:case id=g10.auction-winner-order.TC-zwj rev=1 covers=g10.auction-winner-order.SC-m55 -->
### g10.auction-winner-order.US7-TC6: The one-time address is gone once the setup deadline passes

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) added a one-time delivery address to an auction order without saving it and did not confirm before the setup deadline.
* admin(operator with payment processing) reopened its setup after the deadline passed.

* The winner order under test is `<winner_order_78_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_78_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. As the winner, open the order and read the address picker.

**Expected Results:**

* The picker does not offer the one-time address.

---

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction listing,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-n3p rev=3 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### g10.auction-winner-order.US8-TC1: Invoice premium is 20 percent of the winning bid

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* A USD winner's sent invoice has winning bid `<winning bid>`, configured minimum `<premium minimum>` and no other lines.

**Test data:**

| `<winning bid>` | `<premium minimum>` | `<buyers premium>` | `<final amount>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD2,400 | USD0 | USD480.00 | USD2 | `<winning bid>`: (fixed fixture); `<final amount>`: 880.00 |
| USD2,500 | USD200.00 | USD500.00 | USD3 | `<winning bid>`: (fixed fixture); `<final amount>`: 000.00 |
| USD1.01 | USD0 | USD0.20 | USD1.21 | `<winning bid>`: (fixed boundary) |

**Steps:**

1. Read the invoice winning bid, buyer's premium and final amount.

**Expected Results:**

* The premium `<buyers premium>` is the greater of 20% of `<winning bid>`, rounded half up, or `<premium minimum>`.
* The final amount `<final amount>` includes `<buyers premium>`.
* For the USD1.01 row, the premium is USD0.20, an integer count of USD minor units.

<!-- trace:case id=g10.auction-winner-order.TC-zt4 rev=2 -->
### g10.auction-winner-order.US8-TC2: One USD minimum applies below twenty percent

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* A USD winner's sent invoice has a winning bid whose 20% premium is below the minimum.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD1 | (range: >0 minor units) |
| minimum premium | USD1 | (fixed configured minimum) |

**Steps:**

1. Read the invoice winning bid and buyer's premium.

**Expected Results:**

* The premium equals `<minimum premium>` because 20% of `<winning bid>` is lower.

<!-- trace:case id=g10.auction-winner-order.TC-dd3 rev=2 -->
### g10.auction-winner-order.US8-TC3: With a zero minimum, 20% is rounded half up

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The USD premium minimum is 0.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD10.03 | (fixed boundary: 20% is a half minor unit away from a whole one) |
| premium | USD2.01 | 20% is 200.6 minor units, rounded half up |

**Steps:**

1. Compute the premium for `<winning bid>`.

**Expected Results:**

* The premium is `<premium>`.

<!-- trace:case id=g10.auction-winner-order.TC-i06 rev=2 covers=g10.auction-winner-order.SC-ip8 -->
### g10.auction-winner-order.US8-TC4: A sent invoice keeps its premium when the minimum changes

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<winner_order_82_1>`'s invoice was sent while the USD minimum was 0.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_82_1 | A USD order won at USD7, invoice sent with premium `<sent premium>`; bind its identity only | · |
| sent premium | USD1.40 | 20% of USD7 |
| new minimum | USD20 | (fixed configured value) |

**Steps:**

1. Set the USD premium minimum to `<new minimum>`.
2. Read the API response for `<winner_order_82_1>`'s sent invoice.
3. Reissue `<winner_order_82_1>`'s invoice.
4. Read the API response for the reissued invoice.

**Expected Results:**

* Step 2: the premium is still `<sent premium>`.
* Step 4: the premium is `<new minimum>`.

<!-- trace:case id=g10.auction-winner-order.TC-xji rev=1 -->
### g10.auction-winner-order.US8-TC5: HKD order converts the premium and minimum together

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
* **Trace:** winner-order-US-03

**Pre-conditions:**

* The invoice is for an HKD settlement and the USD premium rule has a non-zero minimum.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD1 | (range: >0 minor units) |
| minimum premium | USD1 | (fixed configured minimum) |
| exchange rate | 7.85 HKD per USD | · |

**Steps:**

1. Read the invoice premium and converted lines.

**Expected Results:**

* The premium is the greater of 20% of `<winning bid>` or `<minimum premium>`.
* HKD line amounts are each converted at the configured rate and rounded up before summing.

---

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-w18 rev=4 covers=g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-i03 -->
### g10.auction-winner-order.US9-TC1: Bank invoice shows the chosen rail and reference

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Outside production, Grade10 holds FPS bank details and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an HKD auction order in Awaiting Setup with a saved home address.

* The winner order under test is `<winner_order_84_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_84_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose HKD and FPS, then confirm the home address.
2. As the operator, send the invoice for bank transfer on FPS.
3. As the winner, open View Bank Details.
4. Read the dialog and payment reference.

**Expected Results:**

* The invoice names the selected FPS rail and its reference.
* The dialog shows FPS ID, account name and an FPS QR only, without rail tabs or copy controls.
* No HK Local or SWIFT details show.

<!-- trace:case id=g10.auction-winner-order.TC-isg rev=2 covers=g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-8q1 -->
### g10.auction-winner-order.US9-TC2: Uploading proof stops the deadline and reads Payment Verifying

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<order bt>`.

* The winner order under test is `<winner_order_85_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| time left | 2 days 6 hours (194400s) before the payment deadline |
| proof | One PDF under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_85_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit the proof.

**Expected Results:**

* A toast reads Proof submitted and We'll verify your payment shortly.
* The order reads Payment Verifying.
* The deadline stops with `<time left>` kept.
* A default inline Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed: under Order progress on small viewports and under the listing from `lg` up.
* Card Pay, Submit Payment Proof, View Bank Details and further uploads are hidden.
* `<proof>` and its file name are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-n2e rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC3: One to three files of each allowed type are accepted

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_86_1>`.

**Test data:**

| `<proof files>` |
| --- |
| 1 JPEG (lower limit) |
| 1 PNG |
| 1 HEIC |
| 3 files mixing PDF, JPEG and PNG (upper limit) |

| Field | Value |
| --- | --- |
| winner_order_86_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof files>`.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted, every file kept (HEIC stored as JPEG).
* The order reads Payment Verifying.

<!-- trace:case id=g10.auction-winner-order.TC-nhm rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC4: Too few or too many files are refused

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_87_1>`.

**Test data:**

| `<proof files>` |
| --- |
| 0 files |
| 4 files, each allowed and under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_87_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof files>`.
3. Submit.

**Expected Results:**

* The upload is refused and says why.
* The order still reads Pending Payment; the deadline runs.

<!-- trace:case id=g10.auction-winner-order.TC-chi rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC5: A file of exactly 5 MB is accepted

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_88_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_88_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | One PDF of 5242880 bytes (5 MiB), at the limit |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted.
* The order reads Payment Verifying.

<!-- trace:case id=g10.auction-winner-order.TC-pld rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC6: A file of another type refuses the whole upload

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_89_1>`.

**Test data:**

| `<proof files>` |
| --- |
| A GIF image |
| A Word document |
| Four PDFs and one HEIC image |

| Field | Value |
| --- | --- |
| winner_order_89_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof files>`.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the allowed types.
* Nothing is stored; the order still reads Pending Payment.

<!-- trace:case id=g10.auction-winner-order.TC-8kk rev=2 covers=g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-8uw -->
### g10.auction-winner-order.US9-TC7: Backing out of the confirm step uploads nothing

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<order bt>`.

* The winner order under test is `<winner_order_90_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| proof | Two PNG files |

| Field | Value |
| --- | --- |
| winner_order_90_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Read the inline warning that files cannot be added or changed after submission.
4. Cancel without submitting.

**Expected Results:**

* No second confirm screen is shown.
* No proof is stored.
* The order still reads Pending Payment; the deadline runs.
* Submit Payment Proof is still offered.

<!-- trace:case id=g10.auction-winner-order.TC-sni rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC8: While proof is checked, no deadline runs

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_91_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_91_1 | An order reading Payment Verifying; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the progress stepper's Payment step and the deadline.

**Expected Results:**

* Payment is the current step, its subtext naming no date.
* No payment deadline shows as running.

<!-- trace:case id=g10.auction-winner-order.TC-1vz rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC9: A second upload is refused while Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* `<winner_order_92_1>` reads Payment Verifying for customer A.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_92_1 | customer A's order, proof uploaded, reading Payment Verifying; bind its identity only |

**Steps:**

1. As customer A, send a second proof upload for `<winner_order_92_1>` through the API.

**Expected Results:**

* The upload is refused.
* The first proof set is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-e6w rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC10: Card payment is refused for an ineligible order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer A's order is in the state `<order state>`.

* The order is prepared as follows: `<fixture setup>`.

* The winner order under test is `<winner_order_93_1>`.

**Test data:**

| `<order state>` | `<fixture setup>` |
| --- | --- |
| Payment Verifying | Proof uploaded, order reads Payment Verifying |
| Pending Payment | Sent bank-transfer invoice, order reads Pending Payment |

| Field | Value |
| --- | --- |
| winner_order_93_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. As customer A, send a card payment for the order through the API.

**Expected Results:**

* The payment is refused; no charge is made.
* The order still reads the state `<order state>`.

<!-- trace:case id=g10.auction-winner-order.TC-3c9 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC11: Proof upload is not offered where it does not apply

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_94_1>`.

* The order has this setup: `<order state>`.

**Test data:**

| `<order state>` |
| --- |
| Preparing Invoice, bank transfer chosen |
| Card invoice sent, unpaid |
| Bank-transfer invoice paid |

| Field | Value |
| --- | --- |
| winner_order_94_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the payment area.

**Expected Results:**

* No proof upload is offered.

<!-- trace:case id=g10.auction-winner-order.TC-i2f rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC12: An expired bank-transfer invoice takes no proof

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_95_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_95_1 | A bank-transfer order past its payment deadline, unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the payment area.
2. Send a proof upload for `<winner_order_95_1>` through the API.

**Expected Results:**

* Step 1: no proof upload is offered; the overdue alert shows Contact Us.
* Step 2: the upload is refused; the order still reads Payment Overdue.

<!-- trace:case id=g10.auction-winner-order.TC-gl2 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC13: Another collector can neither upload nor read the proof

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* `<winner_order_96_1>` belongs to customer A.
* customer B is signed in, in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_96_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |

**Steps:**

1. As customer B, send a proof upload for `<winner_order_96_1>` through the API.
2. As customer B, request `<winner_order_96_1>`'s proof.

**Expected Results:**

* Both requests are refused.
* `<winner_order_96_1>` still reads Pending Payment.

<!-- trace:case id=g10.auction-winner-order.TC-q03 rev=2 covers=g10.auction-winner-order.SC-uxu -->
### g10.auction-winner-order.US9-TC14: An upload cut off part-way leaves the invoice pending

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<order bt>`.
* The connection is set to drop during upload.

* The winner order under test is `<winner_order_97_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| order bt | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| proof | Three allowed files under 5 MB |

| Field | Value |
| --- | --- |
| winner_order_97_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>` and submit.
3. Let the connection drop during upload.
4. Restore the connection and submit `<proof>` again.

**Expected Results:**

* Step 3: Submit Payment Proof stays open with `<proof>` selected.
* Step 3: a toast reads Proof not submitted and Nothing was saved. Try again.
* Step 3: the order reads Pending Payment; the deadline runs; nothing is stored.
* Step 4: the upload is accepted.

<!-- trace:case id=g10.auction-winner-order.TC-bxv rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC15: The bank reference fits every way to pay

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* `<winner_order_98_1>`'s invoice is sent.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_98_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| listing code | LK7P2Q, the listing's code |
| reference | LK7P2Q01: `<listing code>` then the two-digit invoice count |

**Steps:**

1. Read `<winner_order_98_1>`'s bank reference.

**Expected Results:**

* It reads `<reference>`.
* 8 characters, capitals and digits only, no hyphen, space or symbol.
* It fits one 35-character SWIFT remittance line.

<!-- trace:case id=g10.auction-winner-order.TC-8vs rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC16: A file over 5 MB refuses the whole upload

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_99_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_99_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | One PDF of 5242881 bytes (5 MiB + 1 byte) with two small PNGs |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the 5 MB limit.
* None of the three files is stored; the order still reads Pending Payment.

<!-- trace:case id=g10.auction-winner-order.TC-w24 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC17: A file whose content is not its extension is refused

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Blocked:** Engineering - is the file type checked by content or by extension?

**Pre-conditions:**

* customer A's `<winner_order_100_1>` reads Pending Payment.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_100_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| proof | An executable renamed to .pdf |

**Steps:**

1. As customer A, send `<proof>` as a proof upload through the API.

**Expected Results:**

* The whole upload is refused.
* Nothing is stored; the order still reads Pending Payment.

<!-- trace:case id=g10.auction-winner-order.TC-6bf rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC19: The old deadline passing during the check expires nothing

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* `<winner_order_101_1>` reached Payment Verifying before its payment deadline.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_101_1 | An order reading Payment Verifying, no operator action yet; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Move the clock past the original payment deadline.
2. Open `<winner order url>` for `<winner_order_101_1>` as its winner.

**Expected Results:**

* The order still reads Payment Verifying, not Payment Overdue.

<!-- trace:case id=g10.auction-winner-order.TC-ypl rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC20: The reference copy control copies it exactly, on bank transfer only

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of `<winner_order_102_1>` and `<winner_order_102_2>`) is signed in.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_102_1 | An HKD order with a sent bank-transfer invoice, reading Pending Payment; bind its identity only |
| reference | LK7P2Q01, `<winner_order_102_1>`'s bank reference |
| winner_order_102_2 | An order with a sent card invoice, unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open `<winner order url>` for `<winner_order_102_1>`.
2. Click the copy control beside the bank reference, then paste.
3. Open `<winner order url>` for `<winner_order_102_2>`.

**Expected Results:**

* Step 2 pastes exactly `<reference>`, no space.
* Step 3 shows no bank reference and no copy control.

<!-- trace:case id=g10.auction-winner-order.TC-xl5 rev=2 covers=g10.auction-winner-order.SC-bb1 -->
### g10.auction-winner-order.US9-TC30: Busy proof form blocks every leave route

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on `<winner order url>` for `<winner_order_103_1>`.
* Submit Payment Proof is open.

**Test data:**

| `<busy work>` | `<leave route>` |
| --- | --- |
| Proof submission in progress | Cancel |
| HEIC conversion in progress | Escape |
| Proof submission in progress | Overlay dismiss |

| Field | Value |
| --- | --- |
| winner_order_103_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Start `<busy work>`.
2. Use `<leave route>`.

**Expected Results:**

* Submit Payment Proof stays open.
* The form remains locked until `<busy work>` finishes.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=3 covers=g10.auction-winner-order.SC-v59 -->
### g10.auction-winner-order.US9-TC22:

Runs once per row of **Test data**. The picked rail is recorded with the address where Grade10 holds bank details

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Grade10 holds the sample bank details for each rail outside production, and Payment Settings holds a card fee rule in `<settlement currency>`.
* customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.

* The winner order under test is `<winner_order_104_1>`.

**Test data:**

| `<settlement currency>` | `<rail>` |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

| Field | Value |
| --- | --- |
| winner_order_104_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose `<settlement currency>` and read the method choices.
2. Confirm the delivery address with `<rail>`.
3. Reload the order.

**Expected Results:**

* Step 1: Card and the `<rail>` option are offered, none selected.
* Step 3: the order records bank transfer on `<rail>` and reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-bmd rev=1 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US9-TC23: The choice shows each method's fee wording, neither selected

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

* The winner order under test is `<winner_order_105_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_105_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Read each method.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* Bank transfer reads `Bank fee set on your invoice`, naming no amount.
* Neither method is selected.

<!-- trace:case id=g10.auction-winner-order.TC-6nc rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC21: Order summary offers Submit Payment Proof and View Bank Details

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on `<winner order url>` for `<winner_order_106_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_106_1 | An auction order whose invoice was sent for bank transfer and is pending; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open `<winner order url>` for `<winner_order_106_1>`.
2. Read Order summary.
3. Choose View Bank Details.
4. Close View Bank Details.
5. Choose Submit Payment Proof.

**Expected Results:**

* Order summary shows Submit Payment Proof with View Bank Details under it.
* View Bank Details opens the View Bank Details dialog.
* Submit Payment Proof opens the Submit Payment Proof dialog.

<!-- trace:case id=g10.auction-winner-order.TC-vvf rev=2 -->
### g10.auction-winner-order.US9-TC32: View Bank Details opens on FPS with QR

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on `<winner order url>` for `<winner_order_107_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_107_1 | An HKD auction order whose invoice was sent for FPS and is pending; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open View Bank Details from Order summary.

**Expected Results:**

* FPS ID, account name and an FPS QR are shown.
* Amount due is shown without Copy.
* The bank reference is shown as a detail row without Copy at the bottom.
* No HK Local or SWIFT details are shown.

<!-- trace:case id=g10.auction-winner-order.TC-9v4 rev=5 covers=g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii -->
### g10.auction-winner-order.US9-TC24: HK Local and SWIFT details show their expanded fields

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on Winner Order for `<winner_order_108_1>`, whose invoice is pending and picked rail is `<rail>`.

* The invoice is in `<settlement currency>` on rail `<rail>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_108_1 | An auction order whose invoice was sent for `<rail>` and is pending; bind its identity only |

| `<settlement currency>` | `<rail>` |
| --- | --- |
| HKD | HK Local |
| USD | International via SWIFT |

**Steps:**

1. Read the invoice actions and open View Bank Details.
2. Read the bank details.

**Expected Results:**

* No card Pay control is offered on the bank transfer invoice.
* No rail tabs show, and only `<rail>` shows.
* No bank-detail row has a copy control.
* HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference.
* SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference and memo warning, then the OUR charges note after the reference.
* Only `<rail>` shows.

<!-- trace:case id=g10.auction-winner-order.TC-xmr rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC25: Submit Payment Proof is proof-only

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on `<winner order url>` for `<winner_order_109_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_109_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Choose Submit Payment Proof.

**Expected Results:**

* The dialog title is Submit Payment Proof.
* Amount due and transfer reference are not shown.
* No FPS, HK Local or SWIFT tab is shown.

<!-- trace:case id=g10.auction-winner-order.TC-mxq rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC18: A card payment on a bank-transfer invoice is refused (folded into g10.auction-winner-order.US9-TC10)

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer A's `<order_bt>` reads Pending Payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. As customer A, send a card payment for `<order_bt>` through the API.

**Expected Results:**

* The payment is refused; no charge is made.
* The order still reads Pending Payment.

---

## g10.auction-winner-order.US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

<!-- trace:case id=g10.auction-winner-order.TC-39a rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC2: The operator's internal reason never reaches the winner

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_110_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_110_1 | A bank-transfer order whose proof an operator returned with `<external reason>` and `<internal reason>`; bind its identity only |
| external reason | Amount received does not match |
| internal reason | A note for operators only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the order.
2. Download the invoice PDF and read it.

**Expected Results:**

* `<external reason>` shows.
* `<internal reason>` appears on neither.

<!-- trace:case id=g10.auction-winner-order.TC-bij rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC3: After a return the winner can upload again

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_111_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_111_1 | A bank-transfer order whose proof was returned, inside its deadline; bind its identity only |
| proof | One new PDF under 5 MB |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`, submit and accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying again.
* The deadline stops with the time then left.

<!-- trace:case id=g10.auction-winner-order.TC-bgm rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC4: Time left at the edges survives a return

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* `<winner_order_112_1>` reads Payment Verifying with `<time left>` kept.

**Test data:**

| `<time left>` | Fixture notes |
| --- | --- |
| 60s | `<time left>`: (1 minute) |
| 604740s | `<time left>`: (6 days 23 hours 59 minutes) |

| Field | Value |
| --- | --- |
| winner_order_112_1 | A bank-transfer order reading Payment Verifying; bind its identity only |

| Field | Value |
| --- | --- |
| return time | The fixture timestamp when the operator returns the proof; bind its datetime only |

**Steps:**

1. Return the proof at `<return time>`.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is `<return time>` plus `<time left>`.

<!-- trace:case id=g10.auction-winner-order.TC-zew rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC5: A return adds no grace once the time left runs out

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_113_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_113_1 | A bank-transfer order returned with 60s left, and that minute has passed; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status and the payment area.

**Expected Results:**

* The order reads Payment Overdue.
* Proof upload is hidden; the overdue alert shows Contact Us.

<!-- trace:case id=g10.auction-winner-order.TC-t06 rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC6: A second return keeps the time left at the second upload

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* `<winner_order_114_1>` was returned once, uploaded again with `<time left 2>` kept, and reads Payment Verifying.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_114_1 | A bank-transfer order on its second check; bind its identity only |
| time left 2 | The time left at the second upload |

| Field | Value |
| --- | --- |
| return time | The fixture timestamp when the operator returns the proof; bind its datetime only |

**Steps:**

1. Return the proof again at `<return time>`.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is `<return time>` plus `<time left 2>`.

<!-- trace:case id=g10.auction-winner-order.TC-1ys rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC8: Returned proof shows the reason and the deadline resumes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) chose bank transfer and uploaded proof for `<winner_order_115_1>`.
* An operator returned the proof with `<return reason>`.
* customer is on `<winner_order_115_1>`'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_115_1 | An order whose invoice was sent, proof uploaded `<time left>` before its payment deadline; bind its identity only |
| time left | 2 days (172800s), a time inside the 7-day payment window |
| return reason | The reason text the operator entered for the winner |
| return time | 18 hours after the upload |

**Steps:**

1. Read the order status and the alert.
2. Read the payment deadline.

**Expected Results:**

* Step 1: the order no longer reads Payment Verifying.
* Step 1: `<return reason>` is shown to the winner.
* Step 2: Pay by reads `<return time>` plus `<time left>`.
* Step 2: Submit Payment Proof and View Bank Details are offered again.

<!-- trace:case id=g10.auction-winner-order.TC-tlh rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC9: Only the latest return reason is shown

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner)'s proof for `<winner_order_116_1>` was returned with `<first reason>`.
* The winner uploaded proof again, and it was returned with `<second reason>`.
* customer is on `<winner_order_116_1>`'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_116_1 | An order paid by bank transfer, inside its payment window; bind its identity only |
| first reason | Amount does not match |
| second reason | Reference missing from the transfer |

**Steps:**

1. Read the page.

**Expected Results:**

* `<second reason>` is shown.
* `<first reason>` is not shown.
* No proof file or file name is shown.

<!-- trace:case id=g10.auction-winner-order.TC-e3m rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC10: Returned proof sends Proof not accepted with the new Pay by

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) uploaded proof for `<winner_order_117_1>`; no letter was sent on upload.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_117_1 | An order paid by bank transfer, `<time left>` before its payment deadline at upload; bind its identity only |
| time left | 2 days (172800s) |
| return reason | The reason text the operator enters for the winner |

**Steps:**

1. Have an operator return the proof with `<return reason>`.
2. Read the mail sent to the winner's registered email.

**Expected Results:**

* One Proof not accepted letter carrying `<return reason>`.
* Its Pay by equals the return time plus `<time left>`.
* No payment reminder was sent while the proof was under check.

---

## g10.auction-winner-order.US11: Winner bills a won listing to a different address

**As a** winner who pays from a different address than the one the listing ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the listing goes.

<!-- trace:case id=g10.auction-winner-order.TC-qlk rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC1: Billing Add Address has phone and Personal or Company

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for `<winner_order_118_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_118_1 | An order inside its setup window, setup incomplete; bind its identity only |

**Steps:**

1. Untick Same as delivery address.
2. Open Add Address for billing.

**Expected Results:**

* The Personal / Company control shows above the fields, Personal selected.
* Phone shows a country selector, starting empty with a globe only.
* Company Name is hidden.

<!-- trace:case id=g10.auction-winner-order.TC-9ch rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC2: Missing billing address field is refused

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address for `<winner_order_119_1>`, with form mode `<form mode>` and missing field `<missing field>`.

**Test data:**

| `<form mode>` | `<missing field>` | `<phone country>` | `<phone digits>` | `<company name>` |
| --- | --- | --- | --- | --- |
| Personal | Phone | Canada | (empty) | Not shown |
| Company | Company Name | Canada | 4165550100 | (empty) |

| Field | Value |
| --- | --- |
| winner_order_119_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Prepare mode `<form mode>`, phone country `<phone country>`, phone digits `<phone digits>` and Company Name `<company name>` where shown; leave `<missing field>` unset.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside `<missing field>`.
* The order's billing address is unchanged.
<!-- trace:case id=g10.auction-winner-order.TC-dno rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC3: A company billing address without Company Name is refused (folded into g10.auction-winner-order.US11-TC2)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address for `<order_setup>`, Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| Company Name | (empty) |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550100 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Company Name.
* The order's billing address is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-7ax rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC4: A company billing address applies apart from delivery

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for `<winner_order_120_1>`, delivery confirmed to `<address_sf>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_120_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_sf | A personal address for Alex Chen, 100 Market St, San Francisco |
| Kind | Company |
| Company Name | Northwind Billing Ltd |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550199 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Untick Same as delivery address.
2. Open billing Add Address.
3. Fill address_sf `<address_sf>`, Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`.
4. Confirm billing.

**Expected Results:**

* Delivery still reads `<address_sf>`.
* Billing reads Northwind Billing Ltd, Toronto, with the phone.

<!-- trace:case id=g10.auction-winner-order.TC-v3x rev=1 covers=g10.auction-winner-order.SC-rlh,g10.auction-winner-order.SC-1i2 -->
### g10.auction-winner-order.US11-TC5: Billing Add Address lists and filters the delivery Country/Region catalogue

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address of an auction order in Awaiting Setup, after unticking Same as delivery address.

* The winner order under test is `<winner_order_121_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_121_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the Country/Region picker and read the list.
2. Open delivery Add Address's picker and read its list.
3. Back on billing, type `Jap`.

**Expected Results:**

* The billing list holds every country and region in A-Z order, the same list as delivery.
* Typing leaves only the names that match `Jap`, Japan among them.

<!-- trace:case id=g10.auction-winner-order.TC-bwi rev=1 covers=g10.auction-winner-order.SC-z4a -->
### g10.auction-winner-order.US11-TC6: An unsaved one-time billing address is there on return

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
* On it, after unticking Same as delivery address, they added a one-time billing address without saving it, and have not confirmed.

* The winner order under test is `<winner_order_122_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_122_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Leave the order for another page, then return to it.
2. Read the billing addresses offered.
3. Open the account address book.

**Expected Results:**

* The one-time billing address is still offered for billing.
* The address book does not hold the one-time billing address.

---

## g10.auction-winner-order.US12: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

<!-- trace:case id=g10.auction-winner-order.TC-mv4 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC1: Add Address at the five-address cap shows phone and kind

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_123_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_123_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The Personal / Company control shows, Personal selected, Company Name hidden.
* Phone shows a country selector and number input, no country chosen.

<!-- trace:case id=g10.auction-winner-order.TC-yzv rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC2: At the cap a one-time personal address confirms without saving

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_124_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_124_1 | An order inside its setup window, setup incomplete; bind its identity only |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Fill First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, winner order url `<winner order url>`, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is the entered address, with phone.
* Step 5: the book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-jfw rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC3: At the cap a company address without Company Name or phone is refused

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on delivery Add new address for `<winner_order_125_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_125_1 | An order inside its setup window, setup incomplete; bind its identity only |
| Kind | Company |
| Company Name | (empty) |
| First name | Jordan |
| Last name | Lee |
| Phone country | (not chosen) |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Click Company.
2. Fill Kind `<Kind>`, Company Name `<Company Name>`, First name `<First name>`, Last name `<Last name>`, Phone country `<Phone country>`, Phone digits `<Phone digits>`, Country or region `<Country or region>`, Town or city `<Town or city>`, Address line 1 `<Address line 1>`, Postal code `<Postal code>`, Save this address for future orders unticked.
3. Click confirm.

**Expected Results:**

* The confirm is refused, with messages beside Company Name and Phone.
* The order's delivery address is unchanged.
* The book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-8e5 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC4: At the cap, Add new address still opens

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_126_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_126_1 | An order inside its setup window, setup incomplete; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The address form opens; no message blocks it.

<!-- trace:case id=g10.auction-winner-order.TC-0hi rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC5: At the cap a one-time address sets the order's delivery and saves nothing

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_127_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_127_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Enter `<address_new>`, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is `<address_new>`.
* Step 5: the book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-nbn rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC6: A one-time address sits as a draft at the top of the picker

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_128_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_128_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Click Use this address.

**Expected Results:**

* `<address_new>` shows as a draft entry at the top of the picker.
* The five saved addresses list below it.

<!-- trace:case id=g10.auction-winner-order.TC-j6u rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC7: At the cap, saving a new address is refused with a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<winner_order_129_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_129_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Click Save this address for future orders.
4. Hover the info icon beside it.

**Expected Results:**

* Step 3: the checkbox is disabled and stays unticked.
* Step 4: a short reason says the book is full.

<!-- trace:case id=g10.auction-winner-order.TC-go0 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC8: Below the cap, a new address can be saved

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, four saved shipping addresses) is on `<winner order url>` for `<winner_order_130_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_130_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Tick Save this address for future orders.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 3: the checkbox is enabled and ticks.
* Step 5: the book holds five, including `<address_new>`.

<!-- trace:case id=g10.auction-winner-order.TC-tz6 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC9: Removing a saved address frees a slot for saving

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses including `<address_home>`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| address_home | A saved address named Home, used by no unpaid order |
| winner_order_131_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Remove `<address_home>` from the address book.
2. Navigate to `<winner order url>` for `<winner_order_131_1>`.
3. Click Add new address in the delivery picker and enter `<address_new>`.
4. Click Save this address for future orders.

**Expected Results:**

* Step 1: the book holds four addresses.
* Step 4: the checkbox is enabled and ticks.

<!-- trace:case id=g10.auction-winner-order.TC-s5g rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC10: Editing a saved address at the cap takes no extra slot

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses including `<address_home>`) is on the account address book.

**Test data:**

| Field | Value |
| --- | --- |
| address_home | A saved address named Home |
| new street | A different address line 1 |

**Steps:**

1. Open `<address_home>` for editing.
2. Change address line 1 to `<new street>`.
3. Save.

**Expected Results:**

* The book still holds five addresses.
* `<address_home>` shows once, with `<new street>`.

<!-- trace:case id=g10.auction-winner-order.TC-yru rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC11: A book already over the cap keeps every address and still refuses saves

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds six saved shipping addresses, seeded from before the cap.
* customer is on `<winner order url>` for `<winner_order_133_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_133_1 | An order inside its setup window, setup incomplete; bind its identity only |
| address_new | A complete personal shipping address not in the book |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the account address book in a new tab.
2. On the order, click Add new address in the delivery picker and enter `<address_new>`.
3. Click Save this address for future orders.

**Expected Results:**

* Step 1: all six addresses are listed.
* Step 3: the checkbox is disabled and stays unticked.

<!-- trace:case id=g10.auction-winner-order.TC-kp5 rev=1 covers=g10.auction-winner-order.SC-zyl -->
### g10.auction-winner-order.US12-TC12: An unsaved one-time delivery address is there on return

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
* On it, they added a one-time delivery address without saving it, and have not confirmed.

* The winner order under test is `<winner_order_134_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_134_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Leave the order for another page, then return to it.
2. Read the delivery address picker.
3. Open the account address book.
4. Back on the order, select the one-time delivery address, a payment method, and confirm.

**Expected Results:**

* The delivery picker lists the one-time address ahead of the saved addresses.
* The address book does not hold the one-time address.
* The confirmation is accepted with the one-time delivery address.

---

## g10.auction-winner-order.US13: Winner learns their order was cancelled

**As a** winner whose order an operator cancelled,
**I want** Winner Order to say it was cancelled and when, with the listing I won and a way to contact Grade10,
**so that** I know the order is closed and who to ask about it.

<!-- trace:case id=g10.auction-winner-order.TC-3x8 rev=2 covers=g10.auction-winner-order.SC-1fb -->
### g10.auction-winner-order.US13-TC1: Cancelled keeps the listing and winning bid visible

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-13

**Pre-conditions:**

* customer(winner of `<winner_order_135_1>`) is on Winner Order.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_135_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read the status, listing, winning bid and actions.

**Expected Results:**

* The page says Cancelled on the cancellation day, as a day-only date in the winner's local zone.
* The listing and winning bid remain visible.
* Contact Us is the only action.
* No cancellation reason is shown.

---

## g10.auction-winner-order.US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

<!-- trace:case id=g10.auction-winner-order.TC-xfb rev=1 covers=g10.auction-winner-order.SC-zfp,g10.auction-winner-order.SC-yhv -->
### g10.auction-winner-order.US14-TC1: A card-refunded order reads Refunded and keeps its records

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
* **Trace:** winner-order-US-14

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_136_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_136_1 | A paid order refunded to the card, with an operator note; bind its identity only |
| refund amount | The amount returned |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status, actions and receipt links.
2. Read below Order Total.
3. Open the refund details from the inline alert.

**Expected Results:**

* Step 1: the order reads Refunded; no stepper, Pay, address or shipment action.
* Step 1: the invoice and every receipt still download.
* Step 2: `<refund amount>` shows below Order Total.
* Step 3: Amount, Transfer to, Reason, then Note, in that order.
* Step 3: Transfer to shows the card brand and last four only; no Reference.

---

## g10.auction-winner-order.US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned below the invoice total, while the listing, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

<!-- trace:case id=g10.auction-winner-order.TC-pca rev=1 covers=g10.auction-winner-order.SC-7m4 -->
### g10.auction-winner-order.US15-TC1: A returned overpayment leaves the order and invoice standing

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
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_137_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_137_1 | A paid order where the difference over the total was returned; bind its identity only |
| difference | The amount returned |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the status and invoice lines.
2. Read below Order Total.
3. Open the refund details.

**Expected Results:**

* Step 1: status and invoice lines are unchanged; it does not read Refunded.
* Step 2: only `<difference>` shows as returned.
* Step 3: the details open, showing no proof and no provider reference.

---

## g10.auction-winner-order.US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-iro rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC1: Contact Us opens the copy-first email dialog

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_138_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_138_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us on the inline alert.

**Expected Results:**

* A dialog opens with To, Subject and Message.
* No mail app opens, and no toast naming only the address replaces the dialog.

<!-- trace:case id=g10.auction-winner-order.TC-le5 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC2: The dialog addresses support@grade10.com

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_139_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_139_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read To.

**Expected Results:**

* To reads `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-ta0 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC3: A setup-overdue Subject names the listing and no invoice

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_140_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_140_1 | An order past its setup deadline, no invoice issued; bind its identity only |
| listing_title | The listing title on that order; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction lot `<listing_title>`: setup overdue`, with no invoice id.

<!-- trace:case id=g10.auction-winner-order.TC-gxu rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC4: A payment-overdue Subject names the invoice

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_141_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_141_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order `<invoice_id>`: payment overdue`.

<!-- trace:case id=g10.auction-winner-order.TC-rt4 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC5: A partial-payment email lists receipts and never the balance

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_142_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_142_1 | An order reading Partially Paid, with one receipt; bind its identity only |
| invoice_id | That order's invoice id |
| receipt_ids | That invoice's receipt ids |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction order `<invoice_id>`: partial payment`.
* Message lists `<receipt_ids>`.
* Message shows no remaining balance.

<!-- trace:case id=g10.auction-winner-order.TC-28a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC6: With several receipts, each receipt id is listed

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_143_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_143_1 | An order reading Partially Paid, with three receipts; bind its identity only |
| receipt_ids | Every receipt id on that invoice, oldest first |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Message.

**Expected Results:**

* Message lists every id in `<receipt_ids>`.
* Message shows no remaining balance.

<!-- trace:case id=g10.auction-winner-order.TC-59a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC7: The support address is hidden until Contact Us opens

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_144_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_144_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Search the page for `support@grade10.com`.
2. Click Contact Us.

**Expected Results:**

* Step 1: the address is not on the page.
* Step 2: To shows `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-a9f rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC8: Copy Message comes first, Open Mail App second

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_145_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_145_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read the dialog footer.

**Expected Results:**

* Copy Message is the primary action, first.
* Open Mail App is the secondary action, second.

<!-- trace:case id=g10.auction-winner-order.TC-mtb rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC9: Message is editable; only the footer copies the whole email

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_146_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_146_1 | An order whose payment deadline passed unpaid; bind its identity only |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Look at the copy controls beside To, Subject and Message.
3. Type `<winner_question>` into Message, below the prefilled facts.

**Expected Results:**

* Step 1: Message is a multi-line field, order facts prefilled.
* Step 2: To and Subject each have a copy control; Message has none.
* Step 3: Message keeps `<winner_question>`.

<!-- trace:case id=g10.auction-winner-order.TC-vdc rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC10: Copy Message copies To, Subject and the edited Message

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_147_1>`.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_147_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Type `<winner_question>` into Message.
3. Click Copy Message.
4. Paste into a plain-text field.

**Expected Results:**

* The paste holds To `support@grade10.com`.
* It holds Subject `Auction order `<invoice_id>`: payment overdue`.
* It holds Message with `<winner_question>`.

<!-- trace:case id=g10.auction-winner-order.TC-mq9 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC11: Open Mail App carries the current Subject and Message

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_148_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_148_1 | An order whose payment deadline passed unpaid; bind its identity only |
| invoice_id | That order's invoice id |
| winner_question | A short question typed into Message |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Type `<winner_question>` into Message.
3. Read the Open Mail App link target.

**Expected Results:**

* It is a `mailto:` to `support@grade10.com`.
* Its subject is `Auction order `<invoice_id>`: payment overdue`.
* Its body includes `<winner_question>`.

<!-- trace:case id=g10.auction-winner-order.TC-ovr rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC12: The To and Subject copy controls copy only their field

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_149_1>`.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_149_1 | An order whose payment deadline passed unpaid; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Click the copy control beside To, then paste.
3. Click the copy control beside Subject, then paste.

**Expected Results:**

* Step 2 pastes only `support@grade10.com`.
* Step 3 pastes only the Subject.
* Copy Message stays in the footer.

<!-- trace:case id=g10.auction-winner-order.TC-9co rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC13: After a reissue, Subject names the current invoice

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_150_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_150_1 | An order payment-overdue after its invoice was reissued; bind its identity only |
| current_invoice_id | The current invoice id |
| replaced_invoice_id | The replaced invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order `<current_invoice_id>`: payment overdue`.
* It does not name `<replaced_invoice_id>`.

<!-- trace:case id=g10.auction-winner-order.TC-v40 rev=1 covers=g10.auction-winner-order.SC-e1w -->
### g10.auction-winner-order.US16-TC14: Contact Us on a cancelled order reads order cancelled

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_151_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_151_1 | An order an operator cancelled, with a category and note; bind its identity only |
| listing_title | That order's listing title; bind its identity only |
| invoice_id | That order's invoice id |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction lot `<listing_title>`: order cancelled`.
* Message names `<listing_title>`, `<invoice_id>` and status Cancelled.
* Neither names the operator's category or note.

<!-- trace:case id=g10.auction-winner-order.TC-nat rev=1 covers=g10.auction-winner-order.SC-i2y -->
### g10.auction-winner-order.US16-TC15: Contact Us on an order with no method asks about setup

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

* The winner order under test is `<winner_order_152_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_152_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the order and choose Contact Us.
2. Read the Subject and the Message.
3. Read the order status.

**Expected Results:**

* The Subject and Message are those of the `setup overdue` reason.
* The order status still reads Awaiting Setup.

<!-- trace:case id=g10.auction-winner-order.TC-yp9 rev=1 covers=g10.auction-winner-order.SC-81q -->
### g10.auction-winner-order.US16-TC16: Copy Message confirms through its own state on a locked order

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) holds an auction order in Setup Overdue, whose payment access is closed.
* The browser may use the clipboard.

* The winner order under test is `<winner_order_153_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_153_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open the order and choose Contact Us.
2. Choose Copy Message.
3. Watch the button and the page for a few seconds.

**Expected Results:**

* The button reads Copied for a moment, then Copy Message again.
* No toast appears.
* The To and Subject controls are unchanged.

---

## g10.auction-winner-order.US17: Winner matches a bank refund against their own statement

**As a** winner whose refund was sent by bank transfer,
**I want** the reference the operator sent it under, beside the amount and where it went,
**so that** I can find the credit on my statement without asking Customer Service.

<!-- trace:case id=g10.auction-winner-order.TC-3s7 rev=1 covers=g10.auction-winner-order.SC-u8s -->
### g10.auction-winner-order.US17-TC1: A bank refund shows the masked destination and its reference

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
* **Trace:** winner-order-US-17

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_154_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_154_1 | A paid order refunded by bank transfer, no operator note; bind its identity only |
| bank reference | The provider reference the operator recorded |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the refund details from the inline alert.

**Expected Results:**

* Amount, Transfer to, Reference, then Reason, in that order; no Note.
* Transfer to shows a bank icon, masked destination, bank name beneath.
* Reference reads `<bank reference>`.
* No proof and no full account number show.

---

## g10.auction-winner-order.US19: Winner confirms where a won listing ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

<!-- trace:case id=g10.auction-winner-order.TC-clp rev=2 covers=g10.auction-winner-order.SC-cu4 -->
### g10.auction-winner-order.US19-TC1: The page shows the listing once and none of the old sections

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

* The winner order under test is `<winner_order_155_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_155_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Read the page from the header to the sidebar.

**Expected Results:**

* The header shows Winner Order and the status badge.
* Order Progress shows Address current, then Invoice, Payment, Shipping and.
  Completed.
* The listing's title shows in the listing card only.
* No Order Information, Collection Method, Order Status list or Lots section.
  shows.

<!-- trace:case id=g10.auction-winner-order.TC-gf4 rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US19-TC5: Timeline uses the auction-order read model timestamps

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order whose auction-order read model returns a
  recorded timestamp for each reached status.

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Read the Order Status section.

**Expected Results:**

* Each status shows the timestamp returned for that status.
* No timestamp is replaced with the page-load time.

<!-- trace:case id=g10.auction-winner-order.TC-grt rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US19-TC2: Preparing Invoice shows the address and no payment

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Preparing Invoice.

* The winner order under test is `<winner_order_156_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_156_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.

**Expected Results:**

* The confirmed address is shown.
* No invoice and no Pay Now are shown.

<!-- trace:case id=g10.auction-winner-order.TC-6xf rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US19-TC3: A complete address with optional fields empty is accepted

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

* The winner order under test is `<winner_order_157_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code | Filled |
| Phone | `<a phone number of unusual length and format>` |
| Company Name, Address Line 2, Apt./Suite/Building | Empty |

| Field | Value |
| --- | --- |
| winner_order_157_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| a phone number of unusual length and format | The unusual-length and unusual-format phone fixture; bind its literal input only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Fill the address form with **Test data**.
3. Click Confirm.

**Expected Results:**

* The address is accepted.
* The order status reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-lwp rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US19-TC4: Empty required fields are refused with field errors

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

* The winner order under test is `<winner_order_158_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_158_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Navigate to `<winner order url>`.
2. Fill every required field except Town/City and Postal Code.
3. Click Confirm.

**Expected Results:**

* The address is refused.
* An error shows on Town/City and on Postal Code.
* The order status still reads Awaiting Setup.

---

## g10.auction-winner-order.US20: Winner waits out a partial payment an operator is collecting

**As a** winner whose invoice an operator has started collecting in parts,
**I want** a locked order with Contact Us and a receipt for every payment made so far,
**so that** I always have proof of what I have paid, without needing to track a running balance myself.

<!-- trace:case id=g10.auction-winner-order.TC-sv8 rev=1 covers=g10.auction-winner-order.SC-34b -->
### g10.auction-winner-order.US20-TC1: The partially paid order is locked

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
* **Trace:** winner-order-US-20

**Pre-conditions:**

* customer(winner of `<winner_order_159_1>`) is on Winner Order.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_159_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read the payment step, settlement alert and receipt area.

**Expected Results:**

* The page reads Partially Paid.
* Pay, Submit Payment Proof, View Bank Details and a payment deadline are absent.
* The page offers Contact Us, shows the full invoice amount and no remaining balance.
* Each recorded payment has a separate receipt link, oldest first.

---

## g10.auction-winner-order.US21: Winner quotes their order

**As a** winner of an auction listing,
**I want** my order to have a clear, stable payment reference I can quote,
**so that** I can reference it when contacting support or making inquiries about my purchase, without a separate order ID.

<!-- trace:case id=g10.auction-winner-order.TC-ppj rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC1: Invoice and payment references appear on both invoice methods

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* One winning order has a card invoice and another has a bank-transfer invoice.

* The winner order under test is `<winner_order_160_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_160_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Open each invoice and its order.
2. Read the invoice ID and payment reference.

**Expected Results:**

* Each order and invoice shows its invoice ID and unchanged payment reference.
* The card invoice and bank-transfer invoice use the same reference rules.
* No receipt breakdown or receipt amount is asserted here.

<!-- trace:case id=g10.auction-winner-order.TC-93n rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC2: Invoice numbering continues after 99

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* The latest invoice for payment reference `<payment reference>` is `<current invoice id>`.

**Test data:**

| Field | Value |
| --- | --- |
| next invoice id | IN-LK423100 |
| current invoice id | IN-LK42399 |
| payment reference | LK423 |

**Steps:**

1. Reissue the invoice.
2. Read the new invoice ID.

**Expected Results:**

* The new invoice ID is `<next invoice id>`.
* The payment reference remains `<payment reference>`.

<!-- trace:case id=g10.auction-winner-order.TC-ehf rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC3: Listing-code allocation retries a projection collision

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A new listing's 5-character candidate collides with an active code or retained reservation.

**Steps:**

1. Create the listing.
2. Read the stored listing/payment reference.

**Expected Results:**

* Allocation retries and stores a distinct valid code.
* The code is not treated as collision-free merely because its source is a UUID or listing ID.

<!-- trace:case id=g10.auction-winner-order.TC-wa2 rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC4: A stored payment reference survives allocator changes

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A listing and its order already store payment reference `<payment reference>`.

* The winner order under test is `<winner_order_163_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| payment reference | LK423 |
| winner_order_163_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Change the allocator implementation.
2. Read the listing and order references.

**Expected Results:**

* Both continue to use `<payment reference>`.
* No new listing receives a retained code.

<!-- trace:case id=g10.auction-winner-order.TC-azi rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC5: The public listing page withholds the payment reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A listing has payment reference `<payment reference>`.

**Test data:**

| Field | Value |
| --- | --- |
| payment reference | LK423 |

**Steps:**

1. Fetch the public listing page and its shared preview.
2. Inspect server HTML, embedded state and preview metadata.

**Expected Results:**

* The payment reference has no labelled public field and appears only as the lower-case suffix of the canonical address.

---

## g10.auction-winner-order.US22: Winner reviews invoice and payment details

**As a** winner,
**I want** my invoice and payment receipts to show stable public references built from my payment reference,
**so that** I can contact Grade10, make a payment, and reconcile charges without exposing internal system keys.

<!-- trace:case id=g10.auction-winner-order.TC-urm rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC1: Reissued invoice IDs still find the order

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* An order has invoice `<original invoice id>`, then reissued invoice `<current invoice id>`, with payment reference `<payment reference>`.

* The winner order under test is `<winner_order_165_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| original invoice id | IN-LK42301 |
| current invoice id | IN-LK42302 |
| payment reference | LK423 |
| winner_order_165_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Look up the order by each invoice ID and by `<payment reference>`.
2. Open both invoice PDFs.

**Expected Results:**

* Each lookup finds the same order.
* The replacement invoice names the replaced invoice and keeps `<payment reference>`.

<!-- trace:case id=g10.auction-winner-order.TC-mr5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC2: A finalized payment receives the new receipt identifier

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* An invoice is `<current invoice id>` for payment reference `<payment reference>`.
* A full or partial payment for that invoice has finalized.

**Test data:**

| Field | Value |
| --- | --- |
| current invoice id | IN-LK42302 |
| payment reference | LK423 |

**Steps:**

1. Open the receipt.
2. Read its identifier.

**Expected Results:**

* The first receipt ID is `RC-LK42302P1`.
* A later finalized payment for that invoice receives `P2`, then `P10` without padding.
* A receipt for another invoice starts at `P1` for that invoice.

<!-- trace:case id=g10.auction-winner-order.TC-gfa rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC3: Historical receipt identifiers stay unchanged

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* A historical receipt ID is `<historical receipt id>`.

**Test data:**

| Field | Value |
| --- | --- |
| historical receipt id | REC-202609-LK7P2Q-01-P1 |

**Steps:**

1. Open the historical receipt after the new identifier ships.
2. Record a refund, reversal or void.

**Expected Results:**

* The historical receipt ID remains `<historical receipt id>`.
* No receipt ID is created for the refund, reversal or void.

<!-- trace:case id=g10.auction-winner-order.TC-gs5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC4: Provider references stay internal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* A card payment has a Grade10 payment reference and a provider reference.

**Steps:**

1. Read Stripe metadata and the winner-facing order and invoice.

**Expected Results:**

* Stripe metadata carries the Grade10 payment reference.
* The provider reference appears on no winner-facing surface.

---

## g10.auction-winner-order.US23: Winner gets the address form back

**As a** winner who missed the 48-hour address deadline,
**I want** Grade10 to reopen the address form when I get in touch, and nothing about my saved addresses to be blocked meanwhile,
**so that** I can still settle the listing I won once I have told Grade10 where to ship it.

<!-- trace:case id=g10.auction-winner-order.TC-9uu rev=1 covers=g10.auction-winner-order.SC-r6m -->
### g10.auction-winner-order.US23-TC1: Address confirmed a minute inside the window is accepted

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<listing_169_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<listing_169_1>`) is on `<winner order url>` at `<one minute before close>`.

* The winner order under test is `<winner_order_169_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_169_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| Entrance closes | 2026-09-05T12:00:00Z |
| one minute before close | 2026-09-05T11:59:00Z |

| Field | Value |
| --- | --- |
| winner_order_169_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_169_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Choose the account's saved home address.
2. Confirm the delivery address.

**Expected Results:**

* The confirmation is accepted.
* The order reads Preparing Invoice.
* No invoice is issued by the confirmation itself.

<!-- trace:case id=g10.auction-winner-order.TC-io3 rev=1 covers=g10.auction-winner-order.SC-kz8 -->
### g10.auction-winner-order.US23-TC2: First confirmation is refused at the 48-hour mark

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<listing_170_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<listing_170_1>`) is on `<winner order url>` at `<the address deadline>`.

* The winner order under test is `<winner_order_170_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_170_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| the address deadline | 2026-09-05T12:00:00Z |

| Field | Value |
| --- | --- |
| winner_order_170_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_170_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Attempt to confirm the account's saved home address.
2. Read the order's delivery address.

**Expected Results:**

* The confirmation is refused.
* The order holds no confirmed delivery address.
* The order still reads Setup Overdue.

<!-- trace:case id=g10.auction-winner-order.TC-w89 rev=1 covers=g10.auction-winner-order.SC-6ax -->
### g10.auction-winner-order.US23-TC4: A reopened address form runs a fresh 48 hours from the reopen

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
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<listing_171_1>`'s order has no confirmed delivery address, derives as Setup Overdue,.
  has invoice status `not_issued`, and its address deadline passed on 2026-09-05T12:00:00Z.
* An operator reopened the address form at `<the reopen>`.
* customer(winner of `<listing_171_1>`) is on `<winner order url>`.

* The winner order under test is `<winner_order_171_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| the reopen | 2026-09-07T09:00:00Z |
| New address deadline | 2026-09-09T09:00:00Z |

| Field | Value |
| --- | --- |
| winner_order_171_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_171_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the delivery address area.
2. Confirm the account's saved home address.

**Expected Results:**

* The address deadline reads 2026-09-09T09:00:00Z, measured from the reopen.
* The confirmation is accepted.
* The order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-bth rev=1 covers=g10.auction-winner-order.SC-6ax -->
### g10.auction-winner-order.US23-TC5: Winner has no way to reopen the address form

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<listing_172_1>`'s order has no confirmed delivery address and its address deadline passed two hours ago.
* customer(winner of `<listing_172_1>`) is signed in.

* The winner order under test is `<winner_order_172_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_172_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| listing_172_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps:**

1. Read the delivery address area for a reopen or extend control.
2. Submit a reopen of the address form as the winner.

**Expected Results:**

* No reopen or extend control is offered to the winner.
* The reopen is refused.
* The address deadline is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-w21 rev=1 covers=g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-gqs -->
### g10.auction-winner-order.US23-TC6: Three won listings open three orders with their own address deadlines

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
* **Trace:** Delivery address

**Pre-conditions:**

* customer(winner of `<listing_173_1>`, `<listing_173_2>` and `<listing_173_3>`) won three listings that closed at different datetimes.

**Test data:**

| Field | Value |
| --- | --- |
| listing_173_1>` recorded close | 2026-09-03T12:00:00Z; bind its identity only |
| listing_173_2>` recorded close | 2026-09-03T18:30:00Z; bind its identity only |
| listing_173_3>` recorded close | 2026-09-04T09:15:00Z; bind its identity only |

| Field | Value |
| --- | --- |
| listing_173_1 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_173_2 | The listing prepared with the original state in the pre-conditions; bind its identity only |
| listing_173_3 | The listing prepared with the original state in the pre-conditions; bind its identity only |

**Steps:**

1. Open each of the three auction orders.
2. Read each order's address deadline.
3. Confirm a different delivery address on each order.

**Expected Results:**

* Three separate orders exist, one per listing.
* The three address deadline passes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z.
* Each order keeps the address confirmed on it and awaits its own invoice.

<!-- trace:case id=g10.auction-winner-order.TC-aui rev=1 covers=g10.auction-winner-order.SC-js5,g10.auction-winner-order.SC-h7y -->
### g10.auction-winner-order.US23-TC7: Sent invoice stops the winner changing the address

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<winner_order_174_1>` carries a confirmed delivery address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.
* customer(winner of `<winner_order_174_1>`) is on `<winner order url>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_174_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Attempt to change the delivery address to the account's work address.
2. Read the delivery address area.

**Expected Results:**

* The change is refused even though the 48 hours have not elapsed.
* The order still shows the address the invoice was quoted for.
* The area points the winner at Grade10 for a change.

<!-- trace:case id=g10.auction-winner-order.TC-us7 rev=1 covers=g10.auction-winner-order.SC-h7y -->
### g10.auction-winner-order.US23-TC8: Expired invoice does not reopen the address form

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery address

**Pre-conditions:**

* `<winner_order_175_1>`'s invoice is `expired` and its address was confirmed and is locked.
* customer(winner of `<winner_order_175_1>`) is on `<winner order url>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_175_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the delivery address area.
2. Attempt to change the delivery address to the account's work address.

**Expected Results:**

* No address form is offered.
* The change is refused.
* The overdue alert carries Contact Us and no card Pay control is shown.

<!-- trace:case id=g10.auction-winner-order.TC-euy rev=1 covers=g10.auction-winner-order.SC-byg -->
### g10.auction-winner-order.US23-TC9: A missed address deadline leaves the account address book alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery address

**Pre-conditions:**

* `<winner_order_176_1>`'s address deadline has passed with no address confirmed.
* customer(winner of `<winner_order_176_1>`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_176_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the account address book.
2. Edit the saved home address and save a new work address.
3. Return to `<winner order url>`.

**Expected Results:**

* Both address-book writes are accepted.
* Neither reaches the auction order.
* The order still has no confirmed delivery address and still offers no address form.

<!-- trace:case id=g10.auction-winner-order.TC-yee rev=1 covers=g10.auction-winner-order.SC-90v -->
### g10.auction-winner-order.US23-TC10: A reopen sends the winner no letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<winner_order_177_1>`'s address deadline has passed.
* An operator holds payment-processing.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_177_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. The operator reopens the address form with a reason.
2. Read the winner's post-close letters for that listing.

**Expected Results:**

* The order offers the address form again.
* No letter about the reopen reaches the winner.

<!-- trace:case id=g10.auction-winner-order.TC-ron rev=1 covers=g10.auction-winner-order.SC-oos -->
### g10.auction-winner-order.US23-TC11: The address deadline counts from the extended close

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
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<extended listing>` was scheduled to close at 2026-09-12T08:45:00Z, took a late bid, and closed at 2026-09-12T09:00:00Z after extended bidding.
* customer(winner of `<extended listing>`) is on `<winner order url>`.

* The winner order under test is `<winner_order_178_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_178_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

| Field | Value |
| --- | --- |
| extended listing | The extended listing fixture described by the pre-conditions; bind its value only |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the address deadline under Confirm delivery address.
2. Confirm the account's saved home address at 2026-09-14T08:50:00Z, ten minutes before that deadline and after 48 hours from the scheduled close.

**Expected Results:**

* The deadline reads 2026-09-14T09:00:00Z, counted from the actual close.
* The confirmation is accepted and the order reads Preparing Invoice.

---

## g10.auction-winner-order.US24: Winner chooses the currency they pay in

**As a** winner of a listing bid in USD,
**I want** to settle in USD or HKD when I set the order up,
**so that** I pay in the currency my money is already in.

<!-- trace:case id=g10.auction-winner-order.TC-ayp rev=1 covers=g10.auction-winner-order.SC-o92 -->
### g10.auction-winner-order.US24-TC1: Order setup offers USD and HKD without a choice

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is on setup for a won listing whose auction bids were in USD.

**Steps:**

1. Read the settlement currency and payment method choices.

**Expected Results:**

* USD and HKD are offered; neither is selected.
* No payment method is selected before a currency is chosen.

<!-- trace:case id=g10.auction-winner-order.TC-79a rev=2 covers=g10.auction-winner-order.SC-8c6 -->
### g10.auction-winner-order.US24-TC2: Chosen settlement currency prices the invoice

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is on order setup with an address and billing address ready.

* The USD winning bid is `<usd winning bid minor units>` minor units, with premium `<usd premium minor units>` minor units.

* The winner order under test is `<winner_order_180_1>`.

**Test data:**

| `<settlement currency>` | `<usd winning bid minor units>` | `<usd premium minor units>` | `<invoice amounts>` |
| --- | ---: | ---: | --- |
| USD | 250000 | 50000 | Winning Bid 250000 USD; Buyer's Premium 50000 USD; total 300000 USD |
| HKD | 250000 | 50000 | Winning Bid 1962500 HKD; Buyer's Premium 392500 HKD; total 2356500 HKD |

| Field | Value |
| --- | --- |
| winner_order_180_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose `<settlement currency>`.
2. Choose a payment method offered for it.
3. Confirm the order setup.
4. Read the invoice currency and order total.

**Expected Results:**

* The invoice shows the amounts `<invoice amounts>` in `<settlement currency>`, with no conversion for USD.
* When `<settlement currency>` is HKD, its converted lines use 7.85 and round up to whole HKD; no USD amount is printed.

<!-- trace:case id=g10.auction-winner-order.TC-8ea rev=1 covers=g10.auction-winner-order.SC-k63 -->
### g10.auction-winner-order.US24-TC3: Sent invoice locks the chosen currency

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner chose HKD and an operator sent the invoice.

**Steps:**

1. Try to change the settlement currency to USD.
2. Read the invoice and order currency.

**Expected Results:**

* The currency change is refused.
* The sent invoice and order remain in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-a61 rev=1 covers=g10.auction-winner-order.SC-j1l -->
### g10.auction-winner-order.US24-TC4: A confirmation with no currency is refused

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<winner_order_182_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_182_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps:**

1. Choose the home address as the delivery address and as the billing address, and choose no settlement currency.
2. Send Grade10 a setup confirmation carrying both addresses and no currency.
3. Reload `<winner_order_182_1>`.

**Expected Results:**

* Step 2 is refused.
* Step 3 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-x0r rev=1 covers=g10.auction-winner-order.SC-lq9 -->
### g10.auction-winner-order.US24-TC5: Confirming with HKD records HKD and the order reads Preparing Invoice

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<winner_order_183_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_183_1 | An order won in USD, in Awaiting Setup; bind its identity only |
| Currency | HKD |
| Method | FPS |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open `<winner order url>` for `<winner_order_183_1>`.
2. Choose the home address, choose HKD and choose FPS.
3. Confirm the home address.
4. Reload `<winner_order_183_1>`.

**Expected Results:**

* Step 3 is accepted.
* Step 4 reads HKD as the order's settlement currency.
* Step 4 reads the order as Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-flb rev=1 covers=g10.auction-winner-order.SC-rau -->
### g10.auction-winner-order.US24-TC6: An operator corrects the currency before send, and the winner still cannot write it

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* admin(operator with payment-processing) holds `<winner_order_184_1>` in Preparing Invoice, whose winner confirmed HKD and bank transfer on HK Local.
* customer(winner) holds `<winner_order_184_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_184_1 | An order in Preparing Invoice, settled in HKD by bank transfer on HK Local; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. As the operator, change the settlement currency to USD with the reason `Winner picked the wrong currency`.
2. As the winner, open `<winner order url>` for `<winner_order_184_1>` and read the order.
3. As the winner, send Grade10 a request to change the currency to HKD.
4. Read the order again.

**Expected Results:**

* Step 1: the order records USD and still reads Preparing Invoice.
* Step 2: Winner Order reads in USD and offers no control to change the currency.
* Step 3: the request is refused.
* Step 4: the order still reads USD.

<!-- trace:case id=g10.auction-winner-order.TC-r4x rev=1 covers=g10.auction-winner-order.SC-d84 -->
### g10.auction-winner-order.US24-TC7: A reissue in the other currency prices the new invoice from the USD amounts and leaves the replaced one

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* admin(operator with payment-processing) holds `<winner_order_185_1>`, whose pending invoice was sent in HKD for bank transfer on HK Local.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_185_1 | An order won at `<winning bid>`, with a pending HKD invoice; bind its identity only | · |
| winning bid | USD100.00 | (fixed derived value), 10000 minor units |
| winning bid HKD | HKD785.00 | (fixed derived value), 78500 minor units |

**Steps:**

1. Reissue the invoice in USD, keeping HK Local, with a reason.
2. Read the new invoice's Winning Bid.
3. Read the replaced invoice in the order's invoice history.

**Expected Results:**

* The new invoice's Winning Bid reads `<winning bid>` in USD, with no conversion.
* The replaced invoice still reads its Winning Bid in HKD, `<winning bid HKD>`.

---

## g10.auction-winner-order.US25: Winner picks a payment method their currency offers

**As a** winner who has picked a settlement currency,
**I want** to see only the payment methods that currency offers, with each Hong Kong and overseas bank rail named,
**so that** I choose a way to pay that works for the account I will send it from.

<!-- trace:case id=g10.auction-winner-order.TC-52z rev=1 covers=g10.auction-winner-order.SC-oyi,g10.auction-winner-order.SC-crs -->
### g10.auction-winner-order.US25-TC1: Each currency offers its payment methods and rails

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* A winner is on order setup with USD and HKD settlement choices.

* The winner order under test is `<winner_order_186_1>`.

**Test data:**

| `<currency>` | `<offered methods>` |
| --- | --- |
| USD | Card, HK Local, International via SWIFT |
| HKD | Card, FPS, HK Local |

| Field | Value |
| --- | --- |
| winner_order_186_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose `<currency>`.
2. Read all payment method choices.

**Expected Results:**

* Exactly `<offered methods>` are offered.
* Each bank rail is a separate choice.
* No method from the other currency is offered.

<!-- trace:case id=g10.auction-winner-order.TC-7j7 rev=1 -->
### g10.auction-winner-order.US25-TC2: Switching currency clears an unavailable method

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* A USD winner selected an International via SWIFT method before confirming setup.

**Steps:**

1. Switch settlement currency to HKD.
2. Read the selected method and available choices.

**Expected Results:**

* International via SWIFT is no longer selected or offered.
* The available HKD choices appear, with none selected.

<!-- trace:case id=g10.auction-winner-order.TC-vje rev=1 covers=g10.auction-winner-order.SC-4lj -->
### g10.auction-winner-order.US25-TC3: A confirmation after a switch that cleared the method is refused

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<winner_order_188_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_188_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps:**

1. Choose the home address, choose USD and choose International via SWIFT.
2. Change the settlement currency to HKD.
3. Read the payment method choice.
4. Confirm the home address without choosing a method.
5. Reload `<winner_order_188_1>`.

**Expected Results:**

* Step 3: no method is selected.
* Step 4 is refused.
* Step 5 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-rwy rev=2 covers=g10.auction-winner-order.SC-6un -->
### g10.auction-winner-order.US25-TC4:

Runs once per row of **Test data**. Switching currency keeps a still-offered method

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* A winner selected `<selected method>` for USD, and that method is offered for HKD.

**Test data:**

| `<selected method>` | `<expected selection>` |
| --- | --- |
| Card | Card remains selected |
| HK Local | HK Local remains selected |

**Steps:**

1. Select `<selected method>` for USD.
2. Switch settlement currency to HKD.
3. Read the selected payment method.

**Expected Results:**

* `<expected selection>` because HKD still offers `<selected method>`.

<!-- trace:case id=g10.auction-winner-order.TC-2ac rev=1 covers=g10.auction-winner-order.SC-rge -->
### g10.auction-winner-order.US25-TC5: A confirmation carrying a method the currency does not offer is refused

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<winner_order_190_1>` in Awaiting Setup with a saved home address.

**Test data:**

| `<settlement currency>` | `<rail>` | Why this row |
| --- | --- | --- |
| USD | FPS | FPS is offered in HKD only |
| HKD | International via SWIFT | SWIFT is offered in USD only |

| Field | Value |
| --- | --- |
| winner_order_190_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and `<settlement currency>`.
2. Send Grade10 a setup confirmation carrying the home address and `<rail>`.
3. Reload `<winner_order_190_1>`.

**Expected Results:**

* Step 2 is refused.
* Step 3 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-jfi rev=1 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US25-TC6: Each HKD method reads its fee wording and none is selected

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in HKD.
* customer(winner) holds `<winner_order_191_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_191_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps:**

1. Choose the home address and HKD.
2. Read each method in the payment method choice.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* FPS and HK Local each read `Bank fee set on your invoice`, naming no amount.
* No method is selected.

<!-- trace:case id=g10.auction-winner-order.TC-pes rev=1 covers=g10.auction-winner-order.SC-1aa,g10.auction-winner-order.SC-er5 -->
### g10.auction-winner-order.US25-TC7: A bank rail is offered only where Grade10 holds its bank details

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Payment Settings holds a card fee rule in HKD.
* customer(winner) holds `<winner_order_192_1>` in Awaiting Setup with a saved home address.

* The environment is `<environment>`, with bank details prepared as `<bank details setup>`.

**Test data:**

| `<environment>` | `<bank details setup>` | `<offered methods>` | `<rail>` |
| --- | --- | --- | --- |
| Outside production | HK Local only | Card, HK Local | FPS |
| Production, before Finance confirms an account | None | Card | FPS |

| Field | Value |
| --- | --- |
| winner_order_192_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and HKD, and read the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and `<rail>`.
3. Reload `<winner_order_192_1>`.

**Expected Results:**

* Step 1 offers exactly `<offered methods>`.
* FPS is not offered.
* Step 2 is refused.
* Step 3 reads the order holding no delivery address and no method.

<!-- trace:case id=g10.auction-winner-order.TC-a8g rev=1 covers=g10.auction-winner-order.SC-o4y -->
### g10.auction-winner-order.US25-TC8: The card fee range reads the percentage of the currency picked

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Payment Settings holds a USD card fee rule of `<usd rate>` and an HKD card fee rule of `<hkd rate>`.
* customer(winner) holds `<winner_order_193_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_193_1 | An order won in USD, in Awaiting Setup; bind its identity only |
| usd rate | 4.4% and a fixed amount (fixed configured value) |
| hkd rate | 3.4% and a fixed amount (fixed configured value) |

**Steps:**

1. Choose USD and read the card choice.
2. Switch to HKD and read the card choice.

**Expected Results:**

* Step 1: card reads `Card fee about 4.4% + a fixed amount`.
* Step 2: card reads `Card fee about 3.4% + a fixed amount`.

---

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt in HKD

**As a** winner who picked HKD,
**I want** every amount on my invoice, receipt and order letters in HKD,
**so that** I pay and keep records in one currency without working out a rate.

<!-- trace:case id=g10.auction-winner-order.TC-ac5 rev=3 covers=g10.auction-winner-order.SC-gc6,g10.auction-winner-order.SC-buj,g10.auction-winner-order.SC-ekn,g10.auction-winner-order.SC-tmf -->
### g10.auction-winner-order.US26-TC1: An HKD invoice reads every amount in HKD, each line rounded up then summed

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* The USD premium minimum is USD0.
* customer(winner) is on `<winner order url>` for `<winner_order_194_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_194_1 | A listing won at `<winning bid>`, settled in HKD by FPS, with Shipping & Handling `<shipping>`, invoice sent; bind its identity only | · |
| winner_order_194_2 | A listing won at USD100.00, settled in HKD by FPS, invoice sent; bind its identity only | · |
| winner_order_194_3 | A listing won at USD101.00, settled in HKD by FPS, invoice sent; bind its identity only | · |
| winner_order_194_4 | A listing won at USD101.00, settled in HKD by bank transfer, invoice sent with 0 USD bank transfer fee; bind its identity only | · |
| winning bid HKD exact | HK$793.00 | (fixed derived value), 79,300 minor units |
| premium HKD exact | HK$159.00 | (fixed derived value), 15,900 minor units |
| shipping HKD exact | HK$79.00 | (fixed derived value), 7,900 minor units |
| subtotal HKD exact | HK$1,031.00 | (fixed derived value), 103,100 minor units |
| winning bid | USD250 | (fixed fixture): USD250 x 7.85 is 1962.5, rounded up to HK$1,963 |
| premium | USD50 | (fixed derived value): 20% of `<winning bid>`, premium minimum USD0; HK$393 after rounding up 392.5 |
| shipping | USD12 | (fixed fixture): HK$95 after rounding up 94.2 |
| total HKD | HK$2,451 | 1,963 + 393 + 95, each line rounded up, then summed |
| Whole-total value | HK$2,450 | USD312 x 7.85 is 2449.2, rounded up (the wrong total) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open `<winner_order_194_1>`'s invoice.
2. Read Buyer's Premium, Shipping & Handling and the total.
3. Open `<winner_order_194_2>`'s invoice and read its Winning Bid.
4. Open `<winner_order_194_3>`'s invoice and read its Winning Bid.
5. Open `<winner_order_194_1>`'s invoice PDF.
6. Open `<winner_order_194_4>`'s invoice and read its lines and total.

**Expected Results:**

* Buyer's Premium reads HK$393 and Shipping & Handling reads HK$95.
* The total reads `<total HKD>`, not the whole-total value.
* Every amount reads in HKD, and no USD amount appears.
* No USD winning bid is printed.
* `<winner_order_194_2>`'s Winning Bid is 78,500 minor units in HKD.
* `<winner_order_194_3>`'s Winning Bid is 79,300 minor units in HKD, not 79,285.
* Step 5: every amount in the invoice PDF reads in HKD, the Winning Bid is 78,500 minor units, and no USD amount or conversion rate appears.
* Step 6: Winning Bid is `<winning bid HKD exact>`, Buyer's Premium is `<premium HKD exact>`, Shipping & Handling is `<shipping HKD exact>`, and the total is `<subtotal HKD exact>`, the sum of the rounded lines.

<!-- trace:case id=g10.auction-winner-order.TC-nf6 rev=3 covers=g10.auction-winner-order.SC-vvm -->
### g10.auction-winner-order.US26-TC2: HKD receipt omits the USD winning bid

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* A winner paid in full an HKD invoice whose total is 103100 minor units in HKD, for a listing bid in USD.

**Steps:**

1. Read the receipt and payment confirmed letter.

**Expected Results:**

* The order total and payment each read 103100 minor units in HKD.
* Neither document prints the USD winning bid or conversion rate.

<!-- trace:case id=g10.auction-winner-order.TC-9dm rev=1 -->
### g10.auction-winner-order.US26-TC3: Order letters of an HKD order carry HKD amounts

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* Grade10 sent letters about `<winner_order_196_1>`, which is settled in HKD and has a sent invoice.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_196_1 | An order settled in HKD with a sent invoice of HK$2,451; bind its identity only |

**Steps:**

1. Read each letter Grade10 sent for `<winner_order_196_1>`.

**Expected Results:**

* Every amount in every letter sent after the winner picked HKD reads in HKD.
* No letter sent after the winner picked HKD prints a USD winning bid or a conversion rate.
* The won-listing letter, sent at the close before any currency was picked, names the winning bid in US$.

<!-- trace:case id=g10.auction-winner-order.TC-q56 rev=1 -->
### g10.auction-winner-order.US26-TC4: A refund on an HKD order reads in HKD

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_197_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_197_1 | An order settled in HKD, paid in full, with a part refund `<refund>`; bind its identity only | · |
| refund | HK$100 | (any whole HK$ amount below the amount paid) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the order's refund.

**Expected Results:**

* The refund reads `<refund>` in HKD.
* No USD amount appears beside it.

<!-- trace:case id=g10.auction-winner-order.TC-3ly rev=2 covers=g10.auction-winner-order.SC-qtr -->
### g10.auction-winner-order.US26-TC5: The card fee of an HKD order comes from the HKD rule

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* Payment Settings holds a USD card fee rule of 4.4% and USD0.30, and an HKD card fee rule of 3.4% and HK$2.35.
* `<winner_order_198_1>` is settled in HKD by card, with its invoice sent.
* customer(winner) is on `<winner order url>` for `<winner_order_198_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_198_1 | A listing won at USD101.00, with a USD20.20 premium and USD10.01 Shipping & Handling, settled in HKD by card; bind its identity only | · |
| HKD Subtotal | HK$1,031.00 | (fixed derived value): HK$793 bid + HK$159 premium + HK$79 Shipping & Handling |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the invoice.
2. Read the card fee and the total.

**Expected Results:**

* The card fee is 3,873 minor units in HKD, the HKD rule's gross-up fee on the HKD Subtotal.
* The total is 106,973 minor units in HKD.
* The USD rule is not applied.

<!-- trace:case id=g10.auction-winner-order.TC-uz6 rev=2 -->
### g10.auction-winner-order.US26-TC6: A USD amount converts to HKD rounded up to a whole HK$

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-26

**Pre-conditions:**

* None.

**Test data:**

| `<usd amount>` | `<hkd amount>` | Why this row | Fixture notes |
| --- | --- | --- | --- |
| USD100.00 | HK$785 | Exact: 785.00, nothing to round | `<usd amount>`: (fixed boundary) |
| USD100.01 | HK$786 | 785.0785 rounds up, not to nearest | `<usd amount>`: (fixed boundary) |
| USD0.01 | HK$1 | 0.0785 rounds up to one whole HK$ | `<usd amount>`: (fixed boundary) |

**Steps:**

1. Convert `<usd amount>` to HKD.

**Expected Results:**

* The result is `<hkd amount>`.

<!-- trace:case id=g10.auction-winner-order.TC-k5y rev=1 -->
### g10.auction-winner-order.US26-TC7: No page, invoice, receipt or letter names the conversion rate

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* `<winner_order_200_1>` is settled in HKD and paid in full, and Grade10 sent letters about it.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_200_1 | An order settled in HKD whose invoice of HK$2,451 was paid in full; bind its identity only |

**Steps:**

1. Read the settlement currency choice before picking HKD on a new order.
2. Read Order Summary on `<winner_order_200_1>`.
3. Read its invoice.
4. Read its receipt.
5. Read each letter sent for it.

**Expected Results:**

* No surface names a rate, an exchange rate or 7.85.

<!-- trace:case id=g10.auction-winner-order.TC-one rev=1 covers=g10.auction-winner-order.SC-8gv -->
### g10.auction-winner-order.US26-TC8: A bank transfer fee typed in USD converts and rounds up with the other lines

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_201_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_201_1 | An order settled in HKD by bank transfer on HK Local whose invoice lines total HKD1,031.00, with a bank transfer fee typed in USD; bind its identity only | · |
| bank transfer fee | USD50.00 | (fixed boundary or equality), 5000 minor units, which converts to HKD392.50 before rounding |
| fee HKD | HKD393.00 | (fixed derived value), 39300 minor units |
| total HKD | HKD1,424.00 | (fixed derived value), 142400 minor units |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the invoice.
2. Read the Payment Processing Fee and the total.

**Expected Results:**

* The Payment Processing Fee reads `<fee HKD>`, the typed amount converted and rounded up to the whole HK$.
* The total reads `<total HKD>`, the sum of the rounded lines and the fee.
* Every amount reads in HKD.

---

## g10.auction-winner-order.US27: Winner who settles in HKD reads the order total in both currencies

**As a** winner who picked HKD,
**I want** my Order Summary to keep the listing's USD amounts and show a USD total then the HKD total I will pay,
**so that** I see what I won and what it costs me in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=3 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4 -->
### g10.auction-winner-order.US27-TC1: HKD summary places card fee after both subtotals

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* The winner selected HKD and two pending invoices have USD bid, premium and Shipping & Handling lines: one bank-transfer order and one card order.

* Payment Settings uses HKD card rule `<card rule>`.

* The winner order under test is `<winner_order_202_1>`.

**Test data:**

| `<payment method>` | `<usd line facts>` | `<hkd line facts>` | Fixture notes |
| --- | --- | ---: | --- |
| Bank transfer | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79 | `<hkd line facts>`: 300; 15,900; 7,900 minor; subtotal 103,100 minor |
| Card | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79 | `<hkd line facts>`: 300; 15,900; 7,900 minor; subtotal 103,100 minor |

| Field | Value |
| --- | --- |
| card rule | 3.4% + 235 minor units |
| card fee | 3873 HKD minor units |
| card amount payable | 106973 HKD minor units |
| usd subtotal | 13121 USD minor units |
| hkd subtotal | 103100 HKD minor units |
| winner_order_202_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read each Order Summary from top to bottom: `<usd line facts>`, then `<hkd line facts>` for `<payment method>`.
2. Read the amount payable for `<payment method>`.

**Expected Results:**

* Both rows list the bid, premium and Shipping & Handling lines in USD.
* Both rows show the USD subtotal of `<usd subtotal>` before the HKD subtotal of `<hkd subtotal>`.
* The bank-transfer row has no card fee and has an amount payable of `<hkd subtotal>` in HKD.
* The card row shows the HKD card fee of `<card fee>` after the separator below both totals; its amount payable is `<card amount payable>` in HKD and includes the fee, with no USD fee line.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=1 covers=g10.auction-winner-order.SC-59h -->
### g10.auction-winner-order.US27-TC2: USD summary shows one USD total

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* The winner selected USD and the invoice has no converted HKD total.

**Steps:**

1. Read the Order Summary totals.

**Expected Results:**

* The summary shows one USD total.
* It shows no HKD subtotal or fee.

<!-- trace:case id=g10.auction-winner-order.TC-17a rev=1 covers=g10.auction-winner-order.SC-ug0 -->
### g10.auction-winner-order.US27-TC3: The HKD total waits for the invoice

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_204_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_204_1 | A listing won at USD250 (fixed fixture), settled in HKD, setup confirmed, invoice not sent; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Summary.
2. Read the listing card.

**Expected Results:**

* Step 1: no HKD total shows.
* Step 2: the winning bid reads USD250.00, in USD.

---

## Settled

- `winner-order-US3-TC1` is held by `winner-order-US8-TC1`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC2` is held by `winner-order-US8-TC2`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC3` is held by `winner-order-US8-TC3`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC4` is held by `winner-order-US8-TC4`: the same premium claim, under the policy-premium journey.
- `configure-auction-buyer-charges` archived its premium cases as `winner-order-US7-TC2`, `winner-order-US7-TC3` and `winner-order-US7-TC4`; `winner-order-US8-TC2` to `winner-order-US8-TC4` hold them, and `winner-order-US7` is the address-deadline journey.
- `winner-order-US10-TC1` is held by `winner-order-US10-TC8`, and `winner-order-US10-TC7` by `winner-order-US10-TC9`.
- `winner-order-US9-TC1` is `winner-order-US12-TC4`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC2` is `winner-order-US12-TC5`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC3` is `winner-order-US12-TC6`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC4` is `winner-order-US12-TC7`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC5` is `winner-order-US12-TC8`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC6` is `winner-order-US12-TC9`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC7` is `winner-order-US12-TC10`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC8` is `winner-order-US12-TC11`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- The premium amount is calculated at invoice creation; the bid panel shows the rate only.
- Non-parseable phone still applies with the entered value; E.164 only when parseable
- Missing phone country or digits share one refusal beside Phone
- Switching back to Personal drops the Company Name requirement
- Billing country or region list parity stays the open PRD question, outside this change
- Partial-payment letter Contact Us is in scope with the same ready mailto
- Subject uses the order's current invoice id after a reissue
- Expired ends self-service card pay (author @tangconst, 2026-09-15).
- Progress is presentation only; status names stay derived from order facts,
  including Payment Overdue and Setup Overdue.
- Absolute deadline datetime; no countdown.
- 48-hour address confirm window; missed window hides Confirm and shows Contact Us (Storybook 2026-09-16).
- Insurance remains optional and separate from Payment Processing Fee.
- Receipt PDF after payment on the same row as Invoice.
- Fee tooltips on Buyer’s Premium, Shipping & Handling, Insurance, and Payment
  Processing Fee (brief fee copy); the Insurance copy is `0.9% of the order
  value during transit.`
- Receipt and invoice identifier formats remain out of scope.
- Winner Order's live balance remains out of scope; only receipt values are
  covered here.
- Receipt contents after a tolerance-close or confirmed overpayment use
  `Remaining Balance Due = 0`.
- Refunds and reversals preserve issued receipts; this suite does not define
  what a later payment may do.
- Closed Country/Region field state belongs to design-system Autocomplete, not a Winner Order case
- Long-list scrollport is presentation on ui-design; catalogue completeness is the Country/Region requirement
- Early and late alphabet filter partitions are redundant with the catalogue and search requirements
- Choosing a filtered country is the design-system Autocomplete selection contract
- Autocomplete unit-layer filter is out of suite in design-system tests and stories
- Letter typeahead on Select is superseded by searchable Autocomplete on Country/Region
- Catalogue display locale stays the open PRD question
- Shippable destinations only stays the open PRD question
- A bid holds nothing on the card, so the close releases and captures nothing: the winner pays the invoice on their order, and a losing bidder reads on My Auctions that their card was not charged (decisions Q1, Q2).
- Bank details are held per currency on each lane: the sample account outside production, and none in production until Finance confirms Grade10's account.
- Archived cases from `2026-10-06-define-public-auction-identifiers` (`winner-order-US21-TC1-1`, `winner-order-US21-TC2-1`, `winner-order-US21-TC3-1`, `winner-order-US21-TC4-1`, `winner-order-US21-TC5-1`, `winner-order-US22-TC1-1`, `winner-order-US22-TC2-1`, `winner-order-US22-TC3-1`, `winner-order-US22-TC4-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-21-add-winner-contact-email` (`winner-order-US5-TC1-1`, `winner-order-US7-TC1-1`, `winner-order-US16-TC1-1`, `winner-order-US16-TC2-1`, `winner-order-US16-TC3-1`, `winner-order-US16-TC4-1`, `winner-order-US16-TC5-1`, `winner-order-US16-TC6-1`, `winner-order-US16-TC7-1`, `winner-order-US16-TC8-1`, `winner-order-US16-TC9-1`, `winner-order-US16-TC10-1`, `winner-order-US16-TC11-1`, `winner-order-US16-TC12-1`, `winner-order-US16-TC13-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-23-add-winner-address-phone-and-kind` (`winner-order-US1-TC12-1`, `winner-order-US1-TC13-1`, `winner-order-US1-TC14-1`, `winner-order-US1-TC15-1`, `winner-order-US1-TC16-1`, `winner-order-US1-TC17-1`, `winner-order-US1-TC18-1`, `winner-order-US1-TC19-1`, `winner-order-US1-TC20-1`, `winner-order-US1-TC21-1`, `winner-order-US1-TC22-1`, `winner-order-US1-TC23-1`, `winner-order-US1-TC24-1`, `winner-order-US1-TC25-1`, `winner-order-US11-TC1-1`, `winner-order-US11-TC2-1`, `winner-order-US11-TC3-1`, `winner-order-US11-TC4-1`, `winner-order-US12-TC1-1`, `winner-order-US12-TC2-1`, `winner-order-US12-TC3-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-29-full-winner-order-country-region-list` (`winner-order-US1-TC36-1`, `winner-order-US1-TC37-1`, `winner-order-US1-TC38-1`, `winner-order-US1-TC39-1`, `winner-order-US1-TC40-1`, `winner-order-US1-TC41-1`, `winner-order-US1-TC42-1`, `winner-order-US1-TC43-1`, `winner-order-US1-TC44-1`, `winner-order-US1-TC45-1`, `winner-order-US1-TC46-1`, `winner-order-US1-TC47-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-30-add-my-auction-orders` (`winner-order-US4-TC1-1`, `winner-order-US4-TC2-1`, `winner-order-US4-TC3-1`, `winner-order-US4-TC4-1`, `winner-order-US4-TC5-1`, `winner-order-US4-TC6-1`, `winner-order-US19-TC1-1`, `winner-order-US19-TC5-1`, `winner-order-US19-TC2-1`, `winner-order-US19-TC3-1`, `winner-order-US19-TC4-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-10-03-refused-bid-is-not-a-bid` (`winner-order-US1-TC5-2`, `winner-order-US6-TC1-1`, `winner-order-US6-TC2-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-11-add-auction-winner-journey` (`winner-order-US1-TC1-1`, `winner-order-US1-TC2-1`, `winner-order-US1-TC3-1`, `winner-order-US1-TC4-1`, `winner-order-US1-TC5-1`, `winner-order-US1-TC6-1`, `winner-order-US1-TC7-1`, `winner-order-US1-TC8-1`, `winner-order-US1-TC9-1`, `winner-order-US1-TC10-1`, `winner-order-US1-TC11-1`, `winner-order-US2-TC1-1`, `winner-order-US2-TC2-1`, `winner-order-US2-TC3-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-16-configure-auction-buyer-charges` (`winner-order-US7-TC1-1`, `winner-order-US7-TC2-1`, `winner-order-US7-TC3-1`, `winner-order-US7-TC4-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-16-revise-auction-winner-invoicing` (`winner-order-US1-TC1-1`, `winner-order-US1-TC2-1`, `winner-order-US1-TC3-1`, `winner-order-US1-TC4-1`, `winner-order-US1-TC5-1`, `winner-order-US5-TC1-1`, `winner-order-US5-TC2-1`, `winner-order-US7-TC1-1`, `winner-order-US2-TC1-1`, `winner-order-US2-TC2-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-18-add-winner-bank-transfer` (`winner-order-US1-TC12-1`, `winner-order-US1-TC13-1`, `winner-order-US1-TC14-1`, `winner-order-US1-TC15-1`, `winner-order-US1-TC16-1`, `winner-order-US1-TC17-1`, `winner-order-US1-TC18-1`, `winner-order-US1-TC19-1`, `winner-order-US1-TC20-1`, `winner-order-US1-TC21-1`, `winner-order-US1-TC22-1`, `winner-order-US1-TC23-1`, `winner-order-US1-TC24-1`, `winner-order-US1-TC25-1`, `winner-order-US1-TC26-1`, `winner-order-US1-TC27-1`, `winner-order-US1-TC28-1`, `winner-order-US1-TC29-1`, `winner-order-US1-TC30-1`, `winner-order-US1-TC31-1`, `winner-order-US1-TC32-1`, `winner-order-US1-TC33-1`, `winner-order-US1-TC34-1`, `winner-order-US1-TC35-1`, `winner-order-US2-TC4-1`, `winner-order-US2-TC5-1`, `winner-order-US2-TC6-1`, `winner-order-US2-TC7-1`, `winner-order-US2-TC8-1`, `winner-order-US2-TC9-1`, `winner-order-US2-TC10-1`, `winner-order-US2-TC11-1`, `winner-order-US9-TC1-1`, `winner-order-US9-TC2-1`, `winner-order-US9-TC3-1`, `winner-order-US9-TC4-1`, `winner-order-US9-TC5-1`, `winner-order-US9-TC16-1`, `winner-order-US9-TC6-1`, `winner-order-US9-TC7-1`, `winner-order-US9-TC8-1`, `winner-order-US9-TC9-1`, `winner-order-US9-TC10-1`, `winner-order-US9-TC11-1`, `winner-order-US9-TC12-1`, `winner-order-US9-TC13-1`, `winner-order-US9-TC14-1`, `winner-order-US9-TC15-1`, `winner-order-US9-TC17-1`, `winner-order-US9-TC18-1`, `winner-order-US9-TC19-1`, `winner-order-US9-TC20-1`, `winner-order-US10-TC1-1`, `winner-order-US10-TC2-1`, `winner-order-US10-TC3-1`, `winner-order-US10-TC4-1`, `winner-order-US10-TC5-1`, `winner-order-US10-TC6-1`, `winner-order-US10-TC7-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-18-add-winner-billing-address` (`winner-order-US2-TC1-1`, `winner-order-US11-TC1-1`, `winner-order-US11-TC2-1`, `winner-order-US11-TC3-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-23-add-winner-refund` (`winner-order-US14-TC1-1`, `winner-order-US15-TC1-1`, `winner-order-US17-TC1-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-24-add-auction-overdue-order-status` (`winner-order-US5-TC1-1`, `winner-order-US7-TC1-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-24-add-shipping-insurance-order-summary-tooltip` (`winner-order-US1-TC12-1`, `winner-order-US1-TC13-1`, `winner-order-US1-TC14-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-24-carry-receipt-payment-breakdown` (`winner-order-US2-TC4-1`, `winner-order-US2-TC5-1`, `winner-order-US2-TC6-1`, `winner-order-US2-TC7-1`, `winner-order-US2-TC8-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- Archived cases from `2026-09-30-winner-order-on-storybook-blocks` (`winner-order-US4-TC1-2`, `winner-order-US4-TC2-1`, `winner-order-US4-TC7-1`, `winner-order-US19-TC1-2`, `winner-order-US19-TC5-1`) were folded into the 2026-10-12 suite rewrite. The current suite owns the rewritten display headings; stable trace marker ids remain unchanged.
- `g10.auction-winner-order.US1-TC15`, `g10.auction-winner-order.US1-TC17`, `g10.auction-winner-order.US1-TC23`, `g10.auction-winner-order.US1-TC44`, `g10.auction-winner-order.US9-TC18` and `g10.auction-winner-order.US11-TC3` fold into their surviving cases; each survivor runs the listed input partitions.
- A close with the house leading opens one auction order for the internal bidder, flagged internal, Preparing Invoice with the internal bidder's billing address as its delivery and billing address and bank transfer; it issues no invoice and sends no won, address or other order letter, to the internal bidder or anyone (Q5, Q33, Q50, Q51, Q52, Q53)
- Q20 settles the internal order at lot close as HKD/FPS automatically, without setup or a winner/operator selection step; no invoice is issued at close.
- Q31 counts a payment-choice change, including a rail-only change, as a reissue change.
- Q16 types bank-transfer fees in USD and converts each fee line to HKD rounded up.
- Q18 preserves USD only in the won-lot letter sent before currency selection; later order letters use settlement currency.
- Q19 shows the percentage from the card rule for the currency selected.
- SC-95 retains its historical title; its active body requires only the picked HK Local rail, with no tabs or other rail details.
- SC-302 uses the rounded fee of 39,300 minor HKD and total 142,400 minor HKD.

## Reconciliation

**Run:** QA2 round 6, 2026-10-12, over the round-4 run below. Dev's round-6 reading raised `winner-order-SC-277` to revision 2, a close with the house leading now opening the internal bidder's order, and dropped the MODIFIED block of one invoice and one order per lot. QA1's round-6 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the case here. QA2 read both, the delta specs, `decisions.md` through Q58, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Round 6, revised** - `g10.auction-winner-order.US1-TC57` to `g10.auction-winner-order.US1-TC57` by `winner-order-SC-277`: a close with the internal bidder leading opens its order, flagged internal, and sends no letter; its marker's revision rises to 2
- **Round 6, corrected to the requirement** - QA1's House rows read the order not Awaiting Setup with only its billing address; they now read Preparing Invoice, `<house billing address>` as both addresses and bank transfer, as `winner-order-SC-277` states (Q52, Q53). `<house billing address>` names "Grade10 Stock Room", not the internal bidder (Q55)
- **Round 6, out of suite** - `winner-order-SC-26`, `winner-order-SC-27` and `winner-order-SC-28` restate a collector winner's order, unchanged by this change, and stay with the durable suite's cases, beside the Collector over the house row here; `grade10-admin-auction-internal-bid-US6-TC4-1` also walks `winner-order-SC-277` through the order page and the send log
- **Round 6, settled** - the stale line that the house is never a lot's winner is rewritten under Q5, Q33 and Q50 to Q53
- **Round 6, rejected** - none
- **Round 6, raised** - none
- **Round 6, contradicted** - none

**Run, round 4:** QA2 round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `g10.auction-winner-order.US1-TC57` by `winner-order-SC-277`, its Collector over the house row the unchanged `winner-order-SC-26`
- **Renumbered** - QA1 drafted it as `g10.auction-winner-order.US1-TC48`; `complete-auction-post-sale` has since published `TC48` to `TC53` and `TC56` under US1 in the durable suite, so it takes `TC57`, past every number issued there. Its Suites drop `smoke`, which the durable US1 already carries
- **Anchors** - `winner-order-SC-277` serves the Feature set group `A lot the house won`, a rule with no actor; the case traces `winner-order-US-01`, the journey a collector's win walks. Joined on the behaviour
- **Out of suite** - superseded by Round 6, out of suite
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** QA2 2026-10-14, independent reconciliation of the blind QA1 cases against the current Dev scenarios and original journey anchors. Read proposal, decisions and `## Raised`, relevant revised PRDs, journeys, tech design, current and durable winner-order specs and suites, and `docs/governance/specs-to-test-cases.md`; QA1's report and pre-QA2 READY receipt were read as review inputs. The revised cases were not derived from scenarios. Case dispositions are recorded before the post-hoc links below.

| Scenario | Disposition and evidence |
| --- | --- |
| SC-278 | Covered by `TC-ayp`; both currencies offered, neither selected. |
| SC-279 | Covered by `TC-a61`; no-currency confirmation refused and state unchanged. |
| SC-280 | Covered by `TC-x0r`; confirmed HKD and Preparing Invoice. |
| SC-281 | Covered by USD row in `TC-79a`; no conversion and USD lines/total. |
| SC-282 | Covered by `TC-8ea`; the HKD-sent invoice refuses a USD write and remains HKD. |
| SC-300, SC-301 | Covered by `TC-flb` and `TC-r4x`; operator pre-send correction and cross-currency reissue. |
| SC-283, SC-284, SC-285 | Covered by repaired `TC-ac5`; exact 100.00, 101.00 and 101.00/20.20/10.01 USD bank-transfer fixtures with converted lines and rounded sum. |
| SC-286 | Covered by `TC-3ly`; exact 103,100 minor HKD subtotal, 3,873 fee, 106,973 total, HKD rule selected. |
| SC-287 | Out of suite: pricing module change test planned in task 6.1; the fixed rate is a code constant, not an operator-editable value. |
| SC-288 | Covered by repaired `TC-ac5`; exact USD100 / HKD78,500 invoice and PDF, no USD amount or rate. |
| SC-289 | Covered by repaired `TC-nf6`; exact HKD103,100 receipt and payment-confirmed letter, no USD winning bid or rate. |
| SC-290, SC-304 | Covered by `TC-vwm`; exact supplied USD/HKD lines, subtotals, HKD card-fee gross-up, separator and payable amount. |
| SC-291 | Covered by `TC-7qs`; one USD total only. |
| SC-292 | Covered by `TC-17a`; no HKD total before invoice send and USD bid on lot card. |
| SC-40 | Covered by repaired `TC-x85`; the operator quote has no premium input, then the invoice carries the exact USD500 premium for a USD2,500 bid and USD200 minimum. |
| SC-41, SC-42 | Covered by `TC-x85`; exact min-higher and half-up invoice rows. |
| SC-43 | Covered by `TC-i06`; sent premium stays and reissue uses new minimum. |
| SC-46, SC-47 | Covered by repaired `TC-n3p`; exact USD2,500/500 premium with final amount inclusion, and USD1.01/0.20 integer-minor boundary. |
| SC-293, SC-294 | Covered by `TC-52z`; exact offered method/rail sets for HKD and USD. |
| SC-295 | Covered by `TC-vje`; switch clears selection and confirmation without new choice is refused. `TC-7j7` asserts only the clearing sub-outcome. |
| SC-296 | Covered by repaired `TC-rwy`; its HK Local row stays selected when switching to HKD. |
| SC-297, SC-248 | Covered by `TC-csb`; no-card-rule outcome and available rails. |
| SC-298 | Covered by `TC-2ac`; unsupported method refused and setup facts unchanged. |
| SC-90 | Covered by repaired `TC-eu8`; its HKD/FPS row records bank transfer on FPS and Preparing Invoice after confirmation. |
| SC-91 | Covered by `TC-jfi`; exact HKD card/bank-fee wording and no selection. |
| SC-303 | Covered by `TC-a8g`; USD 4.4% to HKD 3.4% choice wording. |
| SC-92, SC-226 | Covered by `TC-pes`; outside-production HK Local-only and production no-bank-detail partitions, including FPS refusal. |
| SC-93 | Covered by repaired `TC-4dz`; its HK Local row changes Card to HK Local and confirms the address. |
| SC-94, SC-249, SC-257 | Out of suite: existing durable cases `TC-miy`, `TC-z2f`, `TC-s5e`; SC-249 has the same no-method refusal path, and SC-257 is setup-deadline behavior. |
| SC-95 | Covered by `TC-9v4` for HK Local details and no card Pay. The title is explicitly historical and does not assert three rails. |
| SC-181 | Covered by repaired `TC-w18`; it walks setup, send and the FPS dialog and checks FPS ID, account name, QR and no other rails. `TC-vvf` remains a duplicate candidate. |
| SC-182, SC-183 | Covered by repaired `TC-9v4`; local and SWIFT fields, reference/memo warning, and OUR note order. |
| SC-299 | Covered by repaired `TC-w18`; it walks HKD/FPS setup, invoice send and the FPS detail view. |
| SC-277 | Covered at domain; see the full case link below. |
| SC-302 | Covered by `TC-one`; Q16's USD-typed fee is converted per line to 39,300 HKD and total 142,400. |
| SC-04, SC-05, SC-38, SC-39, SC-62, SC-63, SC-69, SC-110, SC-111, SC-214, SC-215, SC-216 | Out of suite: unchanged invoice-field scenarios remain with existing durable invoice cases; current winner-order changes do not alter those unchanged routes. |
| SC-26, SC-27, SC-28 | Out of suite: unchanged close/duplicate-close/address-ready routes remain with durable winner-order lot-close cases. |

**Anchor coverage:** All eight declared journeys have at least one case: US1, US3, US8, US9, US24, US25, US26 and US27. No journey anchor is uncovered. US26 has uncovered scenario holes recorded above.

- **Covered at domain** - SC-277 is fully asserted by `grade10-admin-auction-e2e-US4-TC2-5` in [domain-tcs.md](../../../grade10-admin/auction/domain-tcs.md#L253). Its expected results cover exactly one internal order, `not_issued`, HKD/FPS, the internal bidder's address, Preparing Invoice, no setup, no invoice at close, and no won, address, invoice, payment or other order letters to any recipient. The case and scenario use the same USD winning bid of 10,100 minor units.

**Other uncovered behavior:** US26 refund-in-HKD case `TC-q56` is required by the anchor/requirement, but no current scenario states that output; case remains unlinked. `TC-xji` also remains unlinked because no scenario states conversion of the one USD premium minimum together with the premium. `TC-9dm` asserts post-pick letters and the pre-pick won-lot exception across all letters; no single scenario asserts that full set.

**Overclaims and duplicates:** `TC-k5y` reads the setup choice and Order Summary as well as invoice, receipt and letters; its no-rate expectation is supported by the broad requirement that no page names the rate, but its scope exceeds the named document scenarios. `TC-w18` and `TC-vvf` overlap on FPS detail presentation; `TC-w18` owns SC-181 and SC-299 after route repair, while TC-vvf remains unlinked. `TC-7j7` and `TC-vje` overlap on switch-clearing; only `TC-vje` also asserts refusal.

**Contradictions:** None found in current winner-order sources. SC-95's historical title is explicitly retained in its active spec and the body requires one picked rail. SC-302's current scenario and TC-one agree at 39,300 minor HKD fee and 142,400 minor HKD total. SC-277 and Q20 agree on automatic HKD/FPS at close without setup.

**Case lifecycle:** All new or changed cases remain `draft`; case IDs are preserved. Ten cases were revised within their existing anchors: TC-n3p, TC-w18, TC-eu8, TC-9v4, TC-4dz, TC-rwy, TC-x85, TC-ac5, TC-nf6 and TC-vwm.

### Blind-case dispositions

| Case | Disposition |
| --- | --- |
| `TC-n3p` | Repair in US8 anchor: vary the USD minimum by row and assert exact USD2,500/200/500/3,000 and USD1.01/0/0.20/1.21 outcomes; rev 3. |
| `TC-zt4` | Retain; the USD1 minimum example remains within US8 and has no exact matching scenario fixture. |
| `TC-dd3` | Retain; calculation boundary case remains a draft. It does not assert invoice-send route. |
| `TC-i06` | Retain; fully checks the sent and reissued premium transition. |
| `TC-xji` | Retain; the HKD conversion of premium and USD minimum is required by US8, but no scenario states this combined outcome. |
| `TC-w18` | Repair within US9: drive HKD/FPS setup, invoice send, then the FPS details dialog; it covers SC-181 and SC-299. It remains a duplicate candidate with TC-vvf; rev 4. |
| `TC-eu8` | Repair within US9: start from a USD-won order, choose currency and rail, inspect offered choices before confirm, then assert the persisted bank-transfer rail and Preparing Invoice; covers SC-90 for HKD/FPS. Rev 3. |
| `TC-9v4` | Repair US9 assertion to include SWIFT memo warning and no copy controls on bank detail rows; rev 5. Covers SC-95, SC-182 and SC-183. |
| `TC-vvf` | Retain; precise FPS dialog case is a duplicate candidate after TC-w18 was repaired; no cover link assigned. |
| `TC-x85` | Repair within US3: add the exact SC-40 operator quote/send route and no-premium-input assertion while retaining SC-41/42 rows; rev 3. |
| `TC-4dz` | Repair within US1: retain the FPS row and add the HK Local row for Card-to-rail change, confirming each recorded rail; rev 3, covers SC-93. |
| `TC-csb` | Retain; covers no-card-rule outcomes for HKD and USD, including the HKD rail choices. |
| `TC-ayp` | Retain; setup choices are unselected and fully assert SC-278. |
| `TC-79a` | Retain; USD/HKD invoice rows verify the selected settlement-currency pricing and line conversions for SC-281. |
| `TC-8ea` | Retain; HKD-sent invoice write to USD is refused and HKD remains, matching SC-282. |
| `TC-a61` | Retain; missing-currency confirmation and unchanged order match SC-279. |
| `TC-x0r` | Retain; confirms HKD and Preparing Invoice, matching SC-280. |
| `TC-flb` | Retain; operator pre-send currency correction and winner write refusal match SC-300. |
| `TC-r4x` | Retain; invoice reissue in USD preserves replaced HKD invoice, matching SC-301. |
| `TC-52z` | Retain; exact USD and HKD method sets match SC-293 and SC-294. |
| `TC-7j7` | Retain; asserts clearing only, not refusal of confirmation, so no SC-295 link. |
| `TC-vje` | Retain; full switch-clear-and-refuse path matches SC-295. |
| `TC-rwy` | Repair within US25: retain the Card row and add HK Local as a second still-offered method, covering SC-296; rev 2. |
| `TC-2ac` | Retain; invalid method confirmation refusal and no persisted setup state match SC-298. |
| `TC-jfi` | Retain; HKD fee wording and no-selection assertions match SC-91. |
| `TC-pes` | Retain; details-availability rows match SC-92 and SC-226. |
| `TC-a8g` | Retain; currency-specific fee ranges match SC-303. |
| `TC-ac5` | Repair within US26: assert exact SC-283/284/285 fixtures and invoice PDF disclosure for SC-288; rev 3. |
| `TC-nf6` | Repair within US26: set SC-289 total/payment fixture and assert receipt plus payment-confirmed letter outputs; rev 3. |
| `TC-9dm` | Retain; post-selection letters assert settlement-currency amounts and the pre-selection won-lot exception; no single scenario covers this full set. |
| `TC-q56` | Retain; refund currency is required by the anchor but no scenario covers it. |
| `TC-3ly` | Retain; exact HKD card-fee rule, fee and payable total match SC-286. |
| `TC-uz6` | Retain; unit conversion cases cover SC-283/284 values but scenario links go to invoice route case TC-ac5; keep unit test unlinked. |
| `TC-k5y` | Retain; no-rate assertions exceed scenario-specific surfaces but the anchor and requirement prohibit rate disclosure anywhere. It has no full scenario THEN match. |
| `TC-one` | Retain; USD-typed bank transfer fee conversion and sum match SC-302. |
| `TC-vwm` | Repair within US27: retain exact card row and add bank-transfer row for the same source amounts, asserting its HKD subtotal without a card fee; rev 3, covers SC-290 and SC-304. |
| `TC-7qs` | Retain; USD-only total and absence of HKD subtotal/fee match SC-291. |
| `TC-17a` | Retain; pre-send absence of HKD total plus USD lot-card bid match SC-292. |

**Pending legacy-unknown rail coverage**

The approved 2026-10-14 refinement adds a historical read partition that this
suite does not yet claim. Existing known-rail trace markers remain unchanged.
Before the next TCS review, parent and the store owner must issue or assign
coverage for these behaviours:

- An ordinary confirmed bank-transfer order whose rail was never recorded reads
  as bank transfer with an unknown rail, without a default or a current Finance
  lookup.
- The same order preserves its confirmed setup, sent invoice amounts and
  currency, and any stored instruction artifact. No new snapshot or guessed
  instructions are created.
- A new confirmation, future operator edit, first send for a confirmed order
  with no invoice, or reissue refuses a missing or unoffered rail and accepts an
  explicitly supported offered rail.

No new scenario or case ID is created in this refinement. The existing
known-rail cases remain proofs for known rails only; the parent/store review
must choose an existing case to refine or issue a store-assigned case ID before
claiming coverage.
