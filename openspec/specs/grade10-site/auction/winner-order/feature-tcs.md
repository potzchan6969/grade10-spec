# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/177
**Drafts styled:** 2026-10-12, tcs-rules r5
**Out of suite:** none.

## Walk 1: Winner settles a won lot — phase 1

**Starting state:**

- customer(signed in, holds a default shipping address) leads `<lot_1>`.
- ❓ The spec does not identify the surface where the tester waits for `<lot_1>` to close.
- customer(signed in, no default shipping address) leads `<lot_1>`.
- customer(winner) is on `<winner order url>` for `<order_prefilled>`.
- customer(winner) is on `<winner order url>` for `<order_unpaid>`.
- `<address_far>` is saved on the account.
- customer A(card linked) leads `<lot_1>`, bidding on the card on file.
- `<card_declining>` is mocked to decline.
- `<lot_2>` was extended twice and closed with a winner at `<close>`.
- customer(signed in, no saved shipping address) won `<order_unpaid>`.
- customer(signed in) has `<address_home>` as default and `<address_work>` saved.
- customer(winner) confirmed `<address_home>` on `<order_unpaid>`.
- customer(winner) confirmed `<address_work>` on `<order_unpaid>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, led by this collector, closing within a minute |
| `<order_prefilled>` | An unpaid order whose delivery address is pre-filled from the account default, not confirmed |
| `<order_unpaid>` | An unpaid HKD order, total `<total before>` |
| `<address_far>` | A saved address whose shipping and insurance cost `<difference>` more |
| `<total before>` | HKD3,280 (fixed derived value) |
| `<difference>` | HKD50 (range: 1000–79999 minor units) |
| `<total after>` | HKD 3,330.00: `<total before>` plus `<difference>` |
| `<lot_1>` | A lot taking bids, led by customer A, closing within a minute |
| `<card>` | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |
| `<order_unpaid>` | An unpaid order inside its payment deadline |
| `<card_declining>` | A card the provider declines |
| `<card_good>` | A card the provider accepts |
| `<lot_2>` | A lot whose close moved twice under extended bidding |
| `<close>` | 2026-09-03T12:00:00Z, the recorded (moved) close |
| `<deadline>` | 2026-09-10T12:00:00Z: `<close>` plus 604800s (7 days) |
| `<order_unpaid>` | An unpaid order inside its setup window |
| `<address_home>` | A shipping address named Home |
| `<address_work>` | A shipping address named Work |
| `<address_home>` | A saved shipping address named Home |
| `<address_work>` | A saved shipping address named Work |
| `<order_new>` | An order opened after step 1 |
| `<order_unpaid>` | An unpaid order whose delivery address is `<address_home>` |
| `<new street>` | A different address line 1 |
| `<order_unpaid>` | An unpaid order whose delivery address is `<address_work>` |

### Route

1. Wait for `<lot_1>` to close.
2. Navigate to `<winner order url>` for `<lot_1>`.
   - one Winner Order exists for `<lot_1>`. g10.auction-winner-order.US1-TC1
3. Read Order Summary.
   - Shipping & Handling, Insurance and Tax read TBD. g10.auction-winner-order.US1-TC1
   - no charge is marked as an estimate. g10.auction-winner-order.US1-TC1
4. Wait for `<lot_1>` to close.
5. Navigate to `<winner order url>` for `<lot_1>`.
   - the winning bid and buyer's premium show. g10.auction-winner-order.US1-TC2
   - Shipping & Handling, Insurance and Tax read TBD. g10.auction-winner-order.US1-TC2
6. Try to pay.
   - payment is refused until a delivery address is given. g10.auction-winner-order.US1-TC2
7. Try to pay without confirming the delivery address.
   - Payment is refused. g10.auction-winner-order.US1-TC3
   - The order asks the winner to confirm the delivery address. g10.auction-winner-order.US1-TC3
8. Change the delivery address to `<address_far>`.
9. Read the totals before paying.
   - The new total reads `<total after>`, equal to `<total before>` plus `<difference>`. g10.auction-winner-order.US1-TC4
   - Both `<total before>` and `<total after>` show before payment. g10.auction-winner-order.US1-TC4
   - No separate charge of `<difference>` is raised. g10.auction-winner-order.US1-TC4
10. Wait for `<lot_1>` to close.
11. Read customer A's authorizations and charges for `<lot_1>` at the card provider.
   - shows no authorization and no charge for `<lot_1>`. g10.auction-winner-order.US1-TC5
12. Once the invoice for `<lot_1>` is sent, pay it by card through hosted Checkout with `<card>`.
   - opens hosted Checkout for the invoice total. g10.auction-winner-order.US1-TC5
13. Read customer A's card transactions for `<lot_1>` again.
   - shows one charge, for the invoice total. g10.auction-winner-order.US1-TC5
14. Pay with `<card_declining>`.
   - the invoice stays unpaid and payable. g10.auction-winner-order.US1-TC6
15. Pay with `<card_good>`.
   - payment is accepted; the order reads paid. g10.auction-winner-order.US1-TC6
16. Read the payment deadline on `<lot_2>`'s invoice.
   - the deadline is `<deadline>` and the PDF shows it as 2026-09-10 20:00 `GMT+8`. g10.auction-winner-order.US1-TC7
17. Open `<winner order url>` in a browser set to America/New_York.
   - Winner Order shows the same instant in the viewer's local zone as 08:00 `EDT`. g10.auction-winner-order.US1-TC7
18. Save `<address_home>` and `<address_work>` to the account address book.
   - both addresses are in the address book, each under its name. g10.auction-winner-order.US1-TC8
19. Navigate to `<winner order url>` for `<order_unpaid>`.
20. Open the delivery address picker.
   - both are offered for the order. g10.auction-winner-order.US1-TC8
21. Set `<address_work>` as the default.
   - only `<address_work>` is marked default. g10.auction-winner-order.US1-TC9
22. Navigate to `<winner order url>` for `<order_new>`.
   - the delivery address is pre-filled with `<address_work>`. g10.auction-winner-order.US1-TC9
23. Edit `<address_home>`'s address line 1 to `<new street>` in the address book.
   - the address book shows `<new street>`. g10.auction-winner-order.US1-TC10
24. Navigate to `<winner order url>` for `<order_unpaid>`.
   - the order still shows the original address line 1. g10.auction-winner-order.US1-TC10
25. Archive `<address_work>` in the address book.
   - The winner is asked to choose another address for `<order_unpaid>`. g10.auction-winner-order.US1-TC11
   - `<address_work>` stays available while the order uses it. g10.auction-winner-order.US1-TC11

## Walk 2: Winner settles a won lot — phase 2

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_setup>`.
- customer(winner) is on `<winner order url>` for `<order_setup>`, Complete Order Setup open.
- customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.
- customer(winner) is on delivery Add Address for `<order_setup>`, with the form mode and missing field in the row.
- customer(winner) is on delivery Add Address for `<order_setup>`.
- customer(winner, has an address in the row) is on `<winner order url>` for `<order_setup>`, Complete Order Setup open.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| Item | Form mode: Company; Missing field: Company Name; Phone country: United States; Phone digits: 4155550100; Company Name: (empty) |
| Item | Form mode: Personal; Missing field: Phone; Phone country: United States; Phone digits: (empty); Company Name: Not shown |
| Item | Form mode: Personal; Missing field: Phone; Phone country: (not chosen); Phone digits: 4155550100; Company Name: Not shown |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| `<stored phone>` | +14155550100 |
| Phone digits | 4155550100 |
| Address line 2 | (empty) |
| State or province | (empty) |
| Item | Address type: Personal; Title: Alex Chen; Address fixture: Saved personal address with street, city or region, country, phone and postal code |
| Item | Address type: Company; Title: Northwind Collectibles; Address fixture: Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code |
| Kind | Company |
| Company Name | Northwind Collectibles |

### Route

1. Open Complete Order Setup.
   - Phone shows a globe only: no flag, no calling-code divider. g10.auction-winner-order.US1-TC12
2. Open Add Address for delivery.
   - The placeholder shows an example with a calling code, `+852 12345678`. g10.auction-winner-order.US1-TC12
3. Look at the Phone field.
   - No calling country is chosen. g10.auction-winner-order.US1-TC12
4. Open Add Address for delivery.
   - Personal is selected. g10.auction-winner-order.US1-TC13
5. Read the Personal / Company control and the fields below it.
   - Company Name is not shown. g10.auction-winner-order.US1-TC13
6. Click Company on the Personal / Company control.
   - Company is selected. g10.auction-winner-order.US1-TC14
7. Read the fields below it.
   - Company Name shows, marked required. g10.auction-winner-order.US1-TC14
8. Use one concrete test-data row: Form mode: Company; Missing field: Company Name; Phone country: United States; Phone digits: 4155550100; Company Name: (empty); Form mode: Personal; Missing field: Phone; Phone country: United States; Phone digits: (empty); Company Name: Not shown; Form mode: Personal; Missing field: Phone; Phone country: (not chosen); Phone digits: 4155550100; Company Name: Not shown.
   a. Use Form mode "Company"; Missing field "Company Name"; Phone country "United States"; Phone digits "4155550100"; leave Company Name empty.
   b. Use Form mode "Personal"; Missing field "Phone"; Phone country "United States"; leave Phone digits empty; leave Company Name hidden.
   c. Use Form mode "Personal"; Missing field "Phone"; leave Phone country unselected; Phone digits "4155550100"; leave Company Name hidden.
   - The confirm is refused, with a message beside the missing field. g10.auction-winner-order.US1-TC16
9. Click confirm.
   - No address is saved or applied to the order. g10.auction-winner-order.US1-TC16
10. Fill the form: First name "Alex"; Last name "Chen"; Phone country "United Kingdom"; Phone digits "+44 (0)20 7946 0958"; Country or region "United Kingdom"; Town or city "London"; Address line 1 "10 Downing St"; Postal code "SW1A 2AA".
   - The confirm is accepted; no phone-format refusal shows. g10.auction-winner-order.US1-TC18
11. Click confirm.
   - The address is applied to the order. g10.auction-winner-order.US1-TC18
12. Fill the form: First name "Alex"; Last name "Chen"; Phone country "United States"; Phone digits "(415) 555-0100"; Country or region "United States"; Town or city "San Francisco"; Address line 1 "100 Market St"; Postal code "94105"; <stored phone> "+14155550100".
13. Click confirm.
   - the confirm is accepted. g10.auction-winner-order.US1-TC19
14. Read the phone on the order's delivery address.
   - the phone reads `<stored phone>`. g10.auction-winner-order.US1-TC19
15. Fill the form: First name "Alex"; Last name "Chen"; Phone country "United States"; Phone digits "4155550100"; Country or region "United States"; Town or city "San Francisco"; Address line 1 "100 Market St"; leave Address line 2 empty; leave State or province empty; Postal code "94105".
16. Click confirm.
   - the confirm is accepted. g10.auction-winner-order.US1-TC20
17. Read the order's delivery address.
   - line 1 and postal code show; line 2 and state are empty. g10.auction-winner-order.US1-TC20
18. Read every field label on the form.
   - No Apt., Suite or Building field shows. g10.auction-winner-order.US1-TC21
   - Address line 2 shows as the optional second line. g10.auction-winner-order.US1-TC21
19. Open the delivery address picker.
20. Use one concrete test-data row: Address type: Personal; Title: Alex Chen; Address fixture: Saved personal address with street, city or region, country, phone and postal code; Address type: Company; Title: Northwind Collectibles; Address fixture: Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code.
   a. Use Address type "Personal"; Title "Alex Chen"; Address fixture "Saved personal address with street, city or region, country, phone and postal code".
   b. Use Address type "Company"; Title "Northwind Collectibles"; Address fixture "Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code".
   - The title matches the row's expected address type. g10.auction-winner-order.US1-TC22
   - The body shows street, city or region, and country. g10.auction-winner-order.US1-TC22
   - The body shows no postal code and no phone. g10.auction-winner-order.US1-TC22
21. Click Company.
22. Fill the form: Kind "Company"; Company Name "Northwind Collectibles"; First name "Alex"; Last name "Chen"; Phone country "United States"; Phone digits "4155550100"; Country or region "United States"; Town or city "San Francisco"; Address line 1 "100 Market St"; Postal code "94105".
23. Click confirm.
   - the order's delivery address carries Northwind Collectibles, Alex Chen, phone and 94105. g10.auction-winner-order.US1-TC24
24. Reopen the delivery address picker.
   - the card reads Northwind Collectibles, with no phone or postal code. g10.auction-winner-order.US1-TC24
25. Open Complete Order Setup.

## Walk 3: Winner settles a won lot — phase 3

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_setup>`, reading Awaiting Setup.
- customer(winner) is on `<winner order url>` for `<order_with_insurance>`.
- customer(winner) is on `<winner order url>` for `<order_pre_invoice>`.
- customer(winner) is on `<winner order url>` for `<order_without_insurance>`.
- `<listing_2>` holds listing code `<code_1>`.
- `<listing_3>` is a draft whose internal id hashes to `<code_1>`.
- customer(winner) is on `<winner order url>` for `<order_preparing>`.
- An operator changed `<order_preparing>` to `<address_work>` and bank transfer.
- customer(winner) confirmed `<address_work>` on `<order_preparing>`.
- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is closed.
- The Country/Region picker is closed with the fixture default Hong Kong selected.
- The Country/Region picker is open on a long A–Z list.
- A design-system Autocomplete is rendered with a long option list taller than its capped popup height.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
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
| `<order_with_insurance>` | An order whose sent invoice includes Insurance |
| `<insurance_amount>` | The Insurance amount on that invoice |
| `<order_pre_invoice>` | An order whose invoice is not yet sent |
| `<order_without_insurance>` | An order whose sent invoice has no Insurance |
| `<code_1>` | A listing code in use |
| `<order_preparing>` | An HKD order reading Preparing Invoice, home address and card confirmed |
| `<address_work>` | A saved address named Work |
| `<order_preparing>` | An order reading Preparing Invoice, `<address_work>` confirmed |
| Typed query | hong |
| Typed query | uni |

### Route

1. Enter the delivery address: Kind "Company"; Company Name "Northwind Collectibles"; First name "Alex"; Last name "Chen"; Phone "+14155550100"; Address line 1 "100 Market St"; Town or city "San Francisco"; Postal code "94105"; Country or region "United States"; Billing "Same as delivery, left ticked".
2. Confirm setup.
3. Read Delivery and Billing on Order Summary.
   - Delivery shows company, recipient, phone, 100 Market St, San Francisco 94105 and United States. g10.auction-winner-order.US1-TC25
   - Billing shows the same as Delivery. g10.auction-winner-order.US1-TC25
4. Find Insurance on Order Summary.
   - Insurance reads `<insurance_amount>`, not TBD. g10.auction-winner-order.US1-TC26
5. Hover the Insurance info tooltip.
   - the tooltip reads `0.9% of the order value during transit.` g10.auction-winner-order.US1-TC26
6. Read the fee rows on Order Summary.
   - Insurance shows with the other fee rows, reading TBD. g10.auction-winner-order.US1-TC27
7. Hover the Insurance info tooltip.
   - the tooltip reads `0.9% of the order value during transit.` g10.auction-winner-order.US1-TC27
8. Read Order Summary.
   - No Insurance row and no Insurance tooltip show. g10.auction-winner-order.US1-TC28
9. Publish `<listing_3>`.
10. Read `<listing_3>`'s listing code.
   - `<listing_3>` holds a code other than `<code_1>`, hashed again with a counter. g10.auction-winner-order.US1-TC29
   - `L` and 5 characters; no `0`, `O`, `1`, `I` or lower case. g10.auction-winner-order.US1-TC29
11. Change the hash method, then read both listing codes.
   - both listings keep their codes. g10.auction-winner-order.US1-TC29
12. Reload the order.
   - the order shows `<address_work>` and bank transfer, still Preparing Invoice. g10.auction-winner-order.US1-TC34
13. Look for address and payment-method controls.
   - no control changes either. g10.auction-winner-order.US1-TC34
14. Archive `<address_work>` in the address book.
   - `<address_work>` is archived. g10.auction-winner-order.US1-TC35
15. Navigate to `<winner order url>` for `<order_preparing>`.
   - the order still shows `<address_work>`. g10.auction-winner-order.US1-TC35
16. Open the Country/Region picker.
   - opens a popup listing every country and region A–Z, not a short designated set. g10.auction-winner-order.US1-TC36
17. Scroll the popup from the first option to the last.
   - keeps the full catalogue available inside the capped-height popup. g10.auction-winner-order.US1-TC36
18. Look at the country or region field label beside the picker.
   - The label reads Country/Region. g10.auction-winner-order.US1-TC37
19. Read the Country/Region field without opening the popup.
   - The field shows Hong Kong. g10.auction-winner-order.US1-TC38
   - Country/Region options are not in the tree. g10.auction-winner-order.US1-TC38
20. Open the Country/Region picker.
   - shows every country and region A–Z in the popup. g10.auction-winner-order.US1-TC39
21. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.
   - scrolls the long list inside a capped height without truncating the catalogue to a short set. g10.auction-winner-order.US1-TC39
22. Focus the open Country/Region picker.
23. Type "hong" into the Country/Region search field.
   - shows only country or region names that match the query. g10.auction-winner-order.US1-TC40
   - Names that do not match (for example Australia) are not shown. g10.auction-winner-order.US1-TC40
24. Open the Autocomplete.
   - The list shows only options whose labels match the query. g10.auction-winner-order.US1-TC41
25. Type "uni" into the Country/Region search field.
   - Non-matching options are not shown. g10.auction-winner-order.US1-TC41

## Walk 4: Winner settles a won lot — phase 4

**Starting state:**

- `customer(winner)` is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is open.
- customer(winner) is on Winner Order setup with delivery Add Address open.
- The Country/Region picker is closed on the fixture default.
- Country/Region has no value selected.
- Other required address fields that the form needs are filled.
- customer(winner) holds an auction order whose invoice has not been sent.
- customer(winner) holds a paid auction order whose invoice includes Tax of HKD70 (range: >0 minor units).
- customer(winner) holds a paid auction order whose operator added no Tax.
- admin(operator with payment-processing) is on a card order in Preparing Invoice.
- The order's lines before Tax total HKD3,280 (fixed derived value).
- Grade10 holds no bank details for the currency in the row.
- customer(winner) holds an auction order in that currency in Awaiting Setup.
- Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
- customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

**Shared test data:**

| Item | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |
| Item | Query partition: Early alphabet; Typed query: afg; Matching result: Afghanistan, or the catalogue name that matches |
| Item | Query partition: Late alphabet; Typed query: zim; Matching result: Zimbabwe, or the catalogue name that matches |
| Typed query | united king |
| Country or region | United Kingdom |

### Route

1. Type "zzzz-not-a-country" into the Country/Region search field.
   - The list shows no country or region options. g10.auction-winner-order.US1-TC42
2. Use one concrete test-data row: Query partition: Early alphabet; Typed query: afg; Matching result: Afghanistan, or the catalogue name that matches; Query partition: Late alphabet; Typed query: zim; Matching result: Zimbabwe, or the catalogue name that matches.
   a. Use Typed query "afg".
   b. Use Typed query "zim".
   - The matching country appears in the filtered list. g10.auction-winner-order.US1-TC43
   - Unrelated country names outside the query are not shown. g10.auction-winner-order.US1-TC43
3. Open the Country/Region picker.
4. Type "united king" into the Country/Region search field.
   - The field shows United Kingdom. g10.auction-winner-order.US1-TC45
5. Select United Kingdom from the filtered matches.
   - closes the popup. g10.auction-winner-order.US1-TC45
   - Options are no longer in the tree. g10.auction-winner-order.US1-TC45
6. Activate Confirm or Use This Address with Country/Region empty.
   - A field refusal appears beside Country/Region. g10.auction-winner-order.US1-TC46
   - The address is not applied with an empty country or region. g10.auction-winner-order.US1-TC46
7. Open the Country/Region picker.
   - The open list includes names from the start of the A–Z range and from near the end. g10.auction-winner-order.US1-TC47
8. Note whether an early-alphabet name and a late-alphabet name both appear in the list.
   - The set is not limited to a short designated sample. g10.auction-winner-order.US1-TC47
9. Open Winner Order.
10. Read Tax in Order Summary and open its info tip.
   - Tax reads TBD with the other fee rows. g10.auction-winner-order.US1-TC30
   - No calculated Tax amount is shown. g10.auction-winner-order.US1-TC30
   - The tip reads `Set by Grade10 for where your order ships. Some orders have none.` g10.auction-winner-order.US1-TC30
11. Open Winner Order and read Order Summary.
12. Open the invoice PDF.
13. Open the receipt PDF.
   - Order Summary shows Tax of HKD70 (range: >0 minor units) between Insurance and Payment Processing Fee. g10.auction-winner-order.US1-TC31
   - Order Summary offers the Tax info tip with the stated copy. g10.auction-winner-order.US1-TC31
   - The invoice PDF and the receipt PDF each show Tax of HKD70 (range: >0 minor units) between Insurance and Subtotal. g10.auction-winner-order.US1-TC31
   - Each PDF's Subtotal includes Tax of HKD70 (range: >0 minor units). g10.auction-winner-order.US1-TC31
14. Open Winner Order and read Order Summary.
15. Open the invoice PDF.
16. Open the receipt PDF.
   - No surface shows a Tax line. g10.auction-winner-order.US1-TC32
   - Order Summary offers no Tax info tip. g10.auction-winner-order.US1-TC32
17. Add Tax of HKD70 (range: >0 minor units).
18. Send the invoice.
19. Read its Subtotal and payment processing fee inputs.
   - The Subtotal is HKD3,350 (fixed derived value). g10.auction-winner-order.US1-TC33
   - Grade10 computes the payment processing fee from that Subtotal. g10.auction-winner-order.US1-TC33
20. Start setup, choose the home address and reach the payment method choice.
   - Only card is offered. g10.auction-winner-order.US1-TC48
21. Send Grade10 a setup confirmation carrying the home address and bank transfer.
   - Grade10 refuses the confirmation. g10.auction-winner-order.US1-TC48
22. Reload the order.
   - The order is still Awaiting Setup, with no delivery address and no method recorded. g10.auction-winner-order.US1-TC48
23. Change the choice to bank transfer.
24. Confirm the home address.
25. Reload the order.
   - The order records bank transfer, not card. g10.auction-winner-order.US1-TC50
   - The order reads Preparing Invoice. g10.auction-winner-order.US1-TC50

## Walk 5: Winner settles a won lot — phase 5

**Starting state:**

- Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
- customer(winner) holds an auction order in HKD in Awaiting Setup.
- Outside production, Grade10 holds the sample HKD bank details, and Payment Settings holds no HKD card fee rule.
- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup.
- customer(winner) whose account language is Traditional Chinese is on delivery Add Address of an auction order in Awaiting Setup.

### Route

1. Choose the home address, choose no payment method, and confirm.
   - Grade10 refuses the confirmation. g10.auction-winner-order.US1-TC51
2. Reload the order.
   - The order is still Awaiting Setup. g10.auction-winner-order.US1-TC51
3. Choose the home address and reach the payment method choice.
   - Card reads that it is not yet available in HKD, and cannot be chosen. g10.auction-winner-order.US1-TC52
4. Try to choose card.
   - Bank transfer is offered. g10.auction-winner-order.US1-TC52
5. Send Grade10 a setup confirmation carrying the home address and card.
   - Grade10 refuses the confirmation. g10.auction-winner-order.US1-TC52
6. Reload the order.
   - The order holds no delivery address and no method. g10.auction-winner-order.US1-TC52
7. Choose the home address and reach the payment method choice.
   - The page says payment is not yet available in USD and offers Contact Us. g10.auction-winner-order.US1-TC53
8. Try to choose card, then bank transfer, then confirm.
   - Neither method can be chosen, and Grade10 refuses the confirmation. g10.auction-winner-order.US1-TC53
9. Reload the order.
   - The order is still Awaiting Setup, holding no delivery address and no method. g10.auction-winner-order.US1-TC53
10. Open the Country/Region picker and read the names.
   - The names read in Traditional Chinese. g10.auction-winner-order.US1-TC56
11. Type `日本`.
   - The list narrows to `日本`. g10.auction-winner-order.US1-TC56

## Walk 6: Winner follows a settled lot to delivery — phase 1

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_paid>`.
- customer(winner) is on `<winner order url>` for `<order_parts>`.
- customer(winner) is on `<winner order url>` for `<order_tolerance>`.
- customer(winner) is on `<winner order url>` for `<order_over>`.
- customer(winner) is on `<winner order url>` for `<order_three>`.
- The second payment was later refunded or reversed.
- customer(winner) is on `<winner order url>` for `<order_shipped>` and `<order_shipped_no_link>`.
- `<order_shipped>` is dispatched.
- The carrier delivery feed is mocked to report delivery with `<handover time>` and `<signature>`.
- customer(winner) is on `<winner order url>` for `<order_verifying>`.
- admin(holds payment-processing) confirms its proof at `<confirm time>`.
- `<order_paid>` is paid, with a replaced invoice, a current invoice and a receipt.
- Its winner deleted the account a year after payment.
- The clock is 6 years after payment, inside the 7-year retention.
- `<order_paid>` was paid by card; its receipt ID is `<receipt id>`.
- customer(winner) is on `<winner order url>` for the order in the row.
- customer(winner) is on `<winner order url>` for `<order_preparing_shipment>`.
- customer(winner) is on `<winner order url>` for `<order_shipped>`.
- customer(winner) is on `<winner order url>` for `<untracked-link order>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_paid>` | An HKD order paid in full at `<final amount>` |
| `<final amount>` | HKD3,330 (range: 80000–399999 minor units) |
| `<order_paid>` | An HKD order with invoice total `<total>`, paid by one payment of `<total>` |
| `<total>` | HKD1,080 (fixed derived value) |
| `<order_parts>` | An HKD order with invoice total `<total>`, paid `<payment 1>` then `<payment 2>` |
| `<total>` | HKD 1,080.00 |
| `<payment 1>` | HKD 420.00 |
| `<payment 2>` | HKD 310.00 |
| Item | Field: Receipt; Value: Previous Payments; Value 3: Current Payment Received; Value 4: Remaining Balance Due |
| Item | Field: First; Value: 0; Value 3: HKD 420.00; Value 4: HKD 660.00: `<total>` − `<payment 1>` |
| Item | Field: Second; Value: HKD 420.00; Value 3: HKD 310.00; Value 4: HKD 350.00: `<total>` − `<payment 1>` − `<payment 2>` |
| `<order_tolerance>` | An HKD order, total `<total>`, paid `<paid before>`, then closed Paid by an operator recording `<closing payment>` within the closing tolerance |
| `<paid before>` | HKD 960.00 |
| `<closing payment>` | HKD 60.00 |
| `<order_over>` | An HKD order, total `<total>`, with an operator-confirmed payment of `<payment>` |
| `<payment>` | HKD 1,190.00 |
| `<order_three>` | An HKD order, total HKD 1,080.00, paid HKD 220.00, HKD 310.00, HKD 140.00 in that order, one receipt each |
| Item | Field: First; Value: 0; Value 3: HKD 220.00; Value 4: HKD 860.00 |
| Item | Field: Second; Value: HKD 220.00; Value 3: HKD 310.00; Value 4: HKD 550.00 |
| Item | Field: Third; Value: HKD 530.00; Value 3: HKD 140.00; Value 4: HKD 410.00 |
| `<order_shipped>` | A paid order dispatched with a carrier, `<tracking number>` and a recorded tracker link |
| `<order_shipped_no_link>` | A paid order dispatched with a carrier and `<tracking number>`, and no tracker link |
| `<order_shipped>` | A paid, dispatched order |
| `<handover time>` | The handover timestamp in the carrier's report |
| `<signature>` | The signature image in the carrier's report |
| `<order_verifying>` | An HKD order, invoice `INV-202609-LK7P2Q-02`, total `<total>`, reading Payment Verifying |
| `<total>` | HKD3,290 (fixed derived value) |
| `<confirm time>` | 2026-09-30T16:30:00Z, October in Hong Kong |
| `<receipt id>` | `REC-202610-LK7P2Q-02-P1` |
| `<order_paid>` | A paid order whose invoice was once reissued |
| `<order_paid>` | A card-paid order |
| `<receipt id>` | `REC-202609-LK7P2Q-01-P1` |
| Shipped | Paid, fulfilment fulfilled, delivery not confirmed, tracker link present |
| Delivered | Paid, fulfilment fulfilled, delivery confirmed, tracker link present |
| `<order_preparing_shipment>` | A paid order with fulfilment `unfulfilled` |
| `<order_shipped>` | A paid, fulfilled order with a ship date, a tracking number and a recorded tracker link |
| `<untracked-link order>` | A paid order with fulfilment fulfilled and a tracking number, where the operator recorded no tracker link |
| `<tracking number>` | The tracking number recorded for `<untracked-link order>` |

### Route

1. Download the receipt PDF.
2. Read its lines.
   - Winning bid, buyer's premium, shipping, insurance when added, Tax when added and final amount show. g10.auction-winner-order.US2-TC1
   - The lines sum to `<final amount>`. g10.auction-winner-order.US2-TC1
   - It names how it was paid. g10.auction-winner-order.US2-TC1
3. Download the receipt PDF.
   - Original Invoice Total `<total>`; Previous Payments 0. g10.auction-winner-order.US2-TC4
   - Current Payment Received `<total>`; Remaining Balance Due 0. g10.auction-winner-order.US2-TC4
4. Open the Receipt PDF row.
   - both receipts are listed on one row, oldest first. g10.auction-winner-order.US2-TC5
5. Open the first receipt, then the second.
   - each shows Original Invoice Total `<total>` and its row's values. g10.auction-winner-order.US2-TC5
6. Open the receipt for `<closing payment>`.
   - Original Invoice Total `<total>`; Previous Payments `<paid before>`. g10.auction-winner-order.US2-TC6
   - Current Payment Received `<closing payment>`; Remaining Balance Due 0. g10.auction-winner-order.US2-TC6
   - No shortfall or write-off line shows. g10.auction-winner-order.US2-TC6
7. Open the receipt.
   - Original Invoice Total `<total>`; Previous Payments 0. g10.auction-winner-order.US2-TC7
   - Current Payment Received `<payment>`; Remaining Balance Due 0. g10.auction-winner-order.US2-TC7
   - No negative balance or credit line shows. g10.auction-winner-order.US2-TC7
8. Open each receipt in turn.
   - Each still shows its row's values. g10.auction-winner-order.US2-TC8
   - No receipt was reissued. g10.auction-winner-order.US2-TC8
9. Read the shipment section of `<order_shipped>`.
   - `<tracking number>` shows as a link, with no separate carrier name. g10.auction-winner-order.US2-TC2
10. Click `<tracking number>`.
   - the tracker link opens. g10.auction-winner-order.US2-TC2
11. Read the shipment section of `<order_shipped_no_link>`.
   - `<tracking number>` shows as plain text, with no carrier name and no Track shipment control. g10.auction-winner-order.US2-TC2
12. Wait for the delivery report to be processed.
13. Navigate to `<winner order url>` for `<order_shipped>`.
14. Open the delivery proof.
   - `<handover time>` and `<signature>` show, not only a delivered flag. g10.auction-winner-order.US2-TC3
15. Download the receipt PDF.
   - The receipt ID is `<receipt id>`. g10.auction-winner-order.US2-TC9
   - Original Invoice Total `<total>`; Previous Payments 0. g10.auction-winner-order.US2-TC9
   - Current Payment Received `<total>`; Remaining Balance Due 0. g10.auction-winner-order.US2-TC9
16. Retrieve `<order_paid>`'s documents from the archive.
   - The replaced invoice, current invoice and receipt PDFs are all returned. g10.auction-winner-order.US2-TC10
17. Deliver the same payment confirmation for `<order_paid>` again.
   - The receipt ID is still `<receipt id>`. g10.auction-winner-order.US2-TC11
18. Open the receipt on `<winner order url>` for `<order_paid>`.
   - No second receipt ID or audit number exists for `<order_paid>`. g10.auction-winner-order.US2-TC11
19. Read Order Progress.
20. Open `<tracking number>`.
   - Order Progress shows `<tracking number>` as an external link with an arrow icon. g10.auction-winner-order.US2-TC12
   - Order Progress shows no Track shipment button or carrier name. g10.auction-winner-order.US2-TC12
   - opens `<carrier tracking URL>` in a new tab. g10.auction-winner-order.US2-TC12
21. Read the status badge.
22. Read Order Progress.
   - Badge reads Preparing Shipment. g10.auction-winner-order.US2-TC55
   - Badge uses `default`. g10.auction-winner-order.US2-TC55
   - Shipping is the current (progress) progress step — not incomplete. g10.auction-winner-order.US2-TC55
   - Shipping subtext reads Preparing to ship. g10.auction-winner-order.US2-TC55
   - No step is labelled Preparing Shipment. g10.auction-winner-order.US2-TC55
23. Read the status badge and Order Progress.
   - Badge reads Shipped and uses `default`. g10.auction-winner-order.US2-TC20
   - Shipping is the current progress step with the day-only ship date. g10.auction-winner-order.US2-TC20
   - The tracking number is the external carrier link. g10.auction-winner-order.US2-TC20
   - Order Progress adds no separate Track shipment control and no separate carrier name. g10.auction-winner-order.US2-TC20
24. Read Order Progress.
25. Select `<tracking number>`.
   - Order Progress shows `<tracking number>` as plain text, not a link. g10.auction-winner-order.US2-TC14
   - Order Progress shows no carrier name and no Track shipment control. g10.auction-winner-order.US2-TC14
   - opens nothing. g10.auction-winner-order.US2-TC14

## Walk 7: Winner follows a settled lot to delivery and adjacent checks

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_shipped_no_link>`.
- customer(winner) won a lot at `<winning bid>`, and its invoice was sent.
- The currency's premium minimum in Auction Payment settings is `<minimum>` at send.
- customer is on the order's Winner Order page.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_shipped_no_link>` | A paid, fulfilled order with a ship date and a tracking number, and no recorded tracker link |
| Item | Winning bid: HKD13,500 (range: 800000–3999999 minor units); Minimum: HKD 0; Buyer's Premium: HKD 2,700; Rule: 20% of the winning bid |
| Item | Winning bid: JPY 1003; Minimum: JPY 0; Buyer's Premium: JPY 201; Rule: 20% is 200.6, rounded half up |
| Item | Winning bid: JPY 1002; Minimum: JPY 0; Buyer's Premium: JPY 200; Rule: 20% is 200.4, rounded half up |
| Item | Winning bid: HKD500 (range: 1000–79999 minor units); Minimum: HKD200 (fixed configured value); Buyer's Premium: HKD 200; Rule: The minimum, higher than 20% (HKD 100) |

### Route

1. Read Order Progress.
   - Shipping is the current progress step with the day-only ship date. g10.auction-winner-order.US2-TC56
   - The tracking number reads as plain text, not a link. g10.auction-winner-order.US2-TC56
   - Order Progress shows no carrier name and no Track shipment control. g10.auction-winner-order.US2-TC56
2. Read Order Summary.
   - the winning bid line reads `<winning bid>`. g10.auction-winner-order.US3-TC5
   - Buyer's Premium reads the row's value. g10.auction-winner-order.US3-TC5
   - the total equals the sum of the lines shown. g10.auction-winner-order.US3-TC5
3. Hover the Buyer's Premium info tooltip.
   - a brief tooltip explains Buyer's Premium. g10.auction-winner-order.US3-TC5

## Walk 8: Winner pays an invoice by card

**Starting state:**

- customer(winner) holds an order in Pending Payment, with invoice status.
- customer(winner) holds an order in Pending Payment.
- customer(winner) holds a Pending Payment order whose last payment session was abandoned.
- customer(winner) completed a hosted card session, but the authenticated.
- customer(winner) holds an order whose authenticated auction-order read model.
- customer(winner) is suspended from bidding and holds an order whose invoice.

### Route

1. Navigate to `<grade10 auction order url>`.
   - Every invoice line and Pay with Card are shown in the order summary. g10.auction-winner-order.US4-TC1
   - The confirmed delivery address and the lot are shown. g10.auction-winner-order.US4-TC1
   - An expired invoice still reads Pending Payment and offers Contact Us instead. of Pay with Card. g10.auction-winner-order.US4-TC1
2. Navigate to `<grade10 auction order url>`.
3. Click Pay Now.
4. Wait until the payment session times out.
5. Return to `<grade10 auction order url>`.
   - The page says payment was not completed. g10.auction-winner-order.US4-TC3
   - The order still reads Pending Payment. g10.auction-winner-order.US4-TC3
   - Pay Now is available. g10.auction-winner-order.US4-TC3
6. Navigate to `<grade10 auction order url>`.
   - A new payment session opens. g10.auction-winner-order.US4-TC4
7. Click Pay Now.
   - It charges the same invoice amount. g10.auction-winner-order.US4-TC4
8. Navigate to `<grade10 auction order url>`.
   - The page shows Confirming payment. g10.auction-winner-order.US4-TC5
   - The order does not read Preparing Shipment. g10.auction-winner-order.US4-TC5
9. Navigate to `<grade10 auction order url>`.
   - The order status reads Preparing Shipment. g10.auction-winner-order.US4-TC6
10. Navigate to `<grade10 auction order url>`.
11. Read the alerts under the lot.
12. Choose Pay what is owed.
   - An alert under the lot says bidding is suspended and payment does not lift it. g10.auction-winner-order.US4-TC7
   - Choosing Pay what is owed brings the order summary's pay control into view. g10.auction-winner-order.US4-TC7

## Walk 9: Winner misses the payment deadline

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.
- customer(winner) is on `<winner order url>` for `<order_cancelled>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<order_cancelled>` | An unpaid order an operator cancelled |

### Route

1. Read the status and the inline alert.
   - the order reads Payment Overdue, with Contact Us. g10.auction-winner-order.US5-TC1
2. Look for payment controls.
   - no card Pay is offered and no payment deadline shows. g10.auction-winner-order.US5-TC1
3. Read the page.
   - No progress stepper shows. g10.auction-winner-order.US5-TC2
   - No invoice PDF control shows. g10.auction-winner-order.US5-TC2

## Walk 10: Winner misses the address deadline

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_setup_overdue>`.
- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup, whose lot closed 48 hours ago, with setup not confirmed.
- admin(operator with payment processing).
- customer(winner) added a one-time delivery address to an auction order without saving it and did not confirm before the setup deadline.
- admin(operator with payment processing) reopened its setup after the deadline passed.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup_overdue>` | An order whose setup deadline, 172800s (48 hours) after the close, passed with setup incomplete |

### Route

1. Read the status and the inline alert.
   - the order reads Setup Overdue, with Contact Us. g10.auction-winner-order.US7-TC1
2. Look for setup controls.
   - no Confirm and no address editing are offered. g10.auction-winner-order.US7-TC1
3. As the winner, open the order.
   - The winner's order reads Setup Overdue. g10.auction-winner-order.US7-TC5
4. As the operator, open the order and read what it offers.
   - The operator can reopen or record its setup. g10.auction-winner-order.US7-TC5
5. As the winner, open the order and read the address picker.
   - The picker does not offer the one-time address. g10.auction-winner-order.US7-TC6

## Walk 11: Winner pays an invoice with a policy premium

**Starting state:**

- The HKD premium minimum is 0.
- An invoice is created for `<order_1>`.
- The HKD premium minimum is `<minimum>`.
- The JPY premium minimum is 0.
- `<order_2>`'s invoice was sent while the HKD minimum was 0.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_1>` | An HKD order won at `<winning bid>` |
| `<winning bid>` | HKD3,150 (range: 80000–399999 minor units) |
| `<premium>` | HKD 560.00: 20% of `<winning bid>` |
| `<minimum>` | HKD200 (fixed configured value) |
| `<winning bid>` | HKD7 (fixed boundary or equality) |
| 20% of `<winning bid>` | HKD1 (fixed derived value) |
| `<winning bid>` | JPY 1003 |
| `<premium>` | JPY 201: 20% is 200.6, rounded half up |
| `<order_2>` | An HKD order won at HKD 7.00, invoice sent with premium HKD 1.00 |
| `<new minimum>` | HKD 200.00 |

### Route

1. Read the API response for `<order_1>`'s invoice.
   - Buyer's premium is `<premium>`. g10.auction-winner-order.US8-TC1
   - The total includes `<premium>`. g10.auction-winner-order.US8-TC1
2. Compute the premium for `<winning bid>`.
   - The premium is `<minimum>`, not 20% of `<winning bid>`. g10.auction-winner-order.US8-TC2
3. Compute the premium for `<winning bid>`.
   - The premium is `<premium>`. g10.auction-winner-order.US8-TC3
4. Set the HKD premium minimum to `<new minimum>`.
5. Read the API response for `<order_2>`'s sent invoice.
   - the premium is still HKD 1.00. g10.auction-winner-order.US8-TC4
6. Reissue `<order_2>`'s invoice.
7. Read the API response for the reissued invoice.
   - the premium is `<new minimum>`. g10.auction-winner-order.US8-TC4

## Walk 12: Winner pays an invoice by bank transfer — phase 1

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_bt>`.
- customer(winner) is on `<winner order url>` for `<order bt>`.
- customer(winner) is on `<winner order url>` for `<order_verifying>`.
- `<order_verifying>` reads Payment Verifying for customer A.
- customer A's order is in the state named in the row.
- customer(winner) is on `<winner order url>` for `<order>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<order bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<time left>` | 2 days 6 hours (194400s) before the payment deadline |
| `<proof>` | One PDF under 5 MB |
| Item | Files: 1 JPEG (lower limit) |
| Item | Files: 1 PNG |
| Item | Files: 1 HEIC |
| Item | Files: 3 files mixing PDF, JPEG and PNG (upper limit) |
| Item | Files: Field; Value 2: Value |
| Item | Files: `<order_bt>`; Value 2: An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| Item | Files: 0 files |
| Item | Files: 4 files, each allowed and under 5 MB |
| `<proof>` | One PDF of 5242880 bytes (5 MiB), at the limit |
| Item | Files: A GIF image |
| Item | Files: A Word document |
| Item | Files: Four PDFs and one HEIC image |
| `<proof>` | Two PNG files |
| `<order_verifying>` | An order reading Payment Verifying |
| `<order_verifying>` | customer A's order, proof uploaded, reading Payment Verifying |
| Payment Verifying | Proof uploaded, order reads Payment Verifying |
| Pending Payment | Sent bank-transfer invoice, order reads Pending Payment |
| Item | Order state: Preparing Invoice, bank transfer chosen |
| Item | Order state: Card invoice sent, unpaid |
| Item | Order state: Bank-transfer invoice paid |

### Route

1. Open the payment area.
2. Read the payment instructions.
   - SWIFT, FPS and Hong Kong local transfer details show. g10.auction-winner-order.US9-TC1
   - The bank reference shows, with a copy control and a request to quote it. g10.auction-winner-order.US9-TC1
   - No card Pay is offered. g10.auction-winner-order.US9-TC1
3. Click Submit Payment Proof.
4. Choose `<proof>`.
5. Submit the proof.
   - A toast reads Proof submitted and We'll verify your payment shortly. g10.auction-winner-order.US9-TC2
   - The order reads Payment Verifying. g10.auction-winner-order.US9-TC2
   - The deadline stops with `<time left>` kept. g10.auction-winner-order.US9-TC2
   - A default inline Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed: under Order progress on small viewports and under the lot from `lg` up. g10.auction-winner-order.US9-TC2
   - Card Pay, Submit Payment Proof, View Bank Details and further uploads are hidden. g10.auction-winner-order.US9-TC2
   - `<proof>` and its file name are not shown. g10.auction-winner-order.US9-TC2
6. Click Submit Payment Proof.
7. Choose the row's files.
8. Submit, then accept the confirm step.
   - The upload is accepted, every file kept (HEIC stored as JPEG). g10.auction-winner-order.US9-TC3
   - The order reads Payment Verifying. g10.auction-winner-order.US9-TC3
9. Click Submit Payment Proof.
10. Choose the row's files.
11. Submit.
   - The upload is refused and says why. g10.auction-winner-order.US9-TC4
   - The order still reads Pending Payment; the deadline runs. g10.auction-winner-order.US9-TC4
12. Click Submit Payment Proof.
13. Choose `<proof>`.
14. Submit, then accept the confirm step.
   - The upload is accepted. g10.auction-winner-order.US9-TC5
   - The order reads Payment Verifying. g10.auction-winner-order.US9-TC5
15. Click Submit Payment Proof.
16. Choose the row's files.
17. Submit.
   - The whole upload is refused, naming the allowed types. g10.auction-winner-order.US9-TC6
   - Nothing is stored; the order still reads Pending Payment. g10.auction-winner-order.US9-TC6
18. Click Submit Payment Proof.
   - No second confirm screen is shown. g10.auction-winner-order.US9-TC7
19. Choose `<proof>`.
   - No proof is stored. g10.auction-winner-order.US9-TC7
20. Read the inline warning that files cannot be added or changed after submission.
   - The order still reads Pending Payment; the deadline runs. g10.auction-winner-order.US9-TC7
21. Cancel without submitting.
   - Submit Payment Proof is still offered. g10.auction-winner-order.US9-TC7
22. Read the progress stepper's Payment step and the deadline.
   - Payment is the current step, its subtext naming no date. g10.auction-winner-order.US9-TC8
   - No payment deadline shows as running. g10.auction-winner-order.US9-TC8
23. As customer A, send a second proof upload for `<order_verifying>` through the API.
   - The upload is refused. g10.auction-winner-order.US9-TC9
   - The first proof set is unchanged. g10.auction-winner-order.US9-TC9
24. As customer A, send a card payment for the order through the API.
   - The payment is refused; no charge is made. g10.auction-winner-order.US9-TC10
   - The order still reads the state named in the row. g10.auction-winner-order.US9-TC10
25. Open the payment area.
   - No proof upload is offered. g10.auction-winner-order.US9-TC11

## Walk 13: Winner pays an invoice by bank transfer — phase 2

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_bt_overdue>`.
- `<order_bt>` belongs to customer A.
- customer B is signed in, in a separate session.
- customer(winner) is on `<winner order url>` for `<order bt>`.
- The connection is set to drop during upload.
- `<order_bt>`'s invoice is sent.
- customer(winner) is on `<winner order url>` for `<order_bt>`.
- customer A's `<order_bt>` reads Pending Payment.
- `<order_verifying>` reached Payment Verifying before its payment deadline.
- customer(winner of `<order_bt>` and `<order_card>`) is signed in.
- The browser may use the clipboard.
- customer(winner) is signed in on `<winner order url>` for `<pending bank-transfer order>`.
- Submit Payment Proof is open.
- Grade10 holds HKD bank details, as outside production.
- customer(winner) holds an auction order in HKD in Awaiting Setup.
- Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_bt_overdue>` | A bank-transfer order past its payment deadline, unpaid |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<order bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | Three allowed files under 5 MB |
| `<listing code>` | LK7P2Q, the listing's code |
| `<reference>` | LK7P2Q01: `<listing code>` then the two-digit invoice count |
| `<proof>` | One PDF of 5242881 bytes (5 MiB + 1 byte) with two small PNGs |
| `<proof>` | An executable renamed to .pdf |
| `<order_verifying>` | An order reading Payment Verifying, no operator action yet |
| `<reference>` | LK7P2Q01, `<order_bt>`'s bank reference |
| `<order_card>` | An order with a sent card invoice, unpaid |
| Proof submission in progress | Cancel |
| HEIC conversion in progress | Escape |
| Proof submission in progress | Overlay dismiss |

### Route

1. Open the payment area.
   - no proof upload is offered; the overdue alert shows Contact Us. g10.auction-winner-order.US9-TC12
2. Send a proof upload for `<order_bt_overdue>` through the API.
   - the upload is refused; the order still reads Payment Overdue. g10.auction-winner-order.US9-TC12
3. As customer B, send a proof upload for `<order_bt>` through the API.
   - Both requests are refused. g10.auction-winner-order.US9-TC13
4. As customer B, request `<order_bt>`'s proof.
   - `<order_bt>` still reads Pending Payment. g10.auction-winner-order.US9-TC13
5. Click Submit Payment Proof.
6. Choose `<proof>` and submit.
7. Let the connection drop during upload.
   - Submit Payment Proof stays open with `<proof>` selected. g10.auction-winner-order.US9-TC14
   - a toast reads Proof not submitted and Nothing was saved. Try again. g10.auction-winner-order.US9-TC14
   - the order reads Pending Payment; the deadline runs; nothing is stored. g10.auction-winner-order.US9-TC14
8. Restore the connection and submit `<proof>` again.
   - the upload is accepted. g10.auction-winner-order.US9-TC14
9. Read `<order_bt>`'s bank reference.
   - It reads `<reference>`. g10.auction-winner-order.US9-TC15
   - 8 characters, capitals and digits only, no hyphen, space or symbol. g10.auction-winner-order.US9-TC15
   - It fits one 35-character SWIFT remittance line. g10.auction-winner-order.US9-TC15
10. Click Submit Payment Proof.
11. Choose `<proof>`.
12. Submit.
   - The whole upload is refused, naming the 5 MB limit. g10.auction-winner-order.US9-TC16
   - None of the three files is stored; the order still reads Pending Payment. g10.auction-winner-order.US9-TC16
13. As customer A, send `<proof>` as a proof upload through the API.
   - The whole upload is refused. g10.auction-winner-order.US9-TC17
   - Nothing is stored; the order still reads Pending Payment. g10.auction-winner-order.US9-TC17
14. Move the clock past the original payment deadline.
15. Open `<winner order url>` for `<order_verifying>` as its winner.
   - The order still reads Payment Verifying, not Payment Overdue. g10.auction-winner-order.US9-TC19
16. Open `<winner order url>` for `<order_bt>`.
17. Click the copy control beside the bank reference, then paste.
   - pastes exactly `<reference>`, no space. g10.auction-winner-order.US9-TC20
18. Open `<winner order url>` for `<order_card>`.
   - shows no bank reference and no copy control. g10.auction-winner-order.US9-TC20
19. Start `<busy work>`.
   - Submit Payment Proof stays open. g10.auction-winner-order.US9-TC30
20. Use `<leave route>`.
   - The form remains locked until `<busy work>` finishes. g10.auction-winner-order.US9-TC30
21. Confirm a delivery address with bank transfer.
   - Card and bank transfer were both offered, neither selected. g10.auction-winner-order.US9-TC22
22. Reload the order.
   - The order records bank transfer and reads Preparing Invoice. g10.auction-winner-order.US9-TC22
23. Choose the home address and reach the payment method choice.
24. Read each method.
   - Card reads `Card fee about 3.4% + a fixed amount`. g10.auction-winner-order.US9-TC23
   - Bank transfer reads `Bank fee set on your invoice`, naming no amount. g10.auction-winner-order.US9-TC23
   - Neither method is selected. g10.auction-winner-order.US9-TC23
25. Open `<the winner's auction order url>` for `<pending_bank_transfer_order>`.

## Walk 14: Winner pays an invoice by bank transfer — phase 3

**Starting state:**

- customer(winner) is signed in on `<the winner's auction order url>` for `<pending_bank_transfer_order>`.
- customer(winner) has View Bank Details open for `<pending_bank_transfer_order>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An auction order whose invoice was sent for bank transfer and is pending |
| `<narrow_viewport>` | A viewport below `sm` |
| `<wide_viewport>` | A viewport at `sm` or wider |

### Route

1. Read Order summary.
2. Choose View Bank Details.
3. Close View Bank Details.
4. Choose Submit Payment Proof.
   - Order summary shows Submit Payment Proof with View Bank Details under it. g10.auction-winner-order.US9-TC21
   - View Bank Details opens the View Bank Details dialog. g10.auction-winner-order.US9-TC21
   - Submit Payment Proof opens the Submit Payment Proof dialog. g10.auction-winner-order.US9-TC21
5. Open View Bank Details from Order summary.
   - The FPS tab is selected. g10.auction-winner-order.US9-TC32
   - FPS ID, account name and an FPS QR are shown. g10.auction-winner-order.US9-TC32
   - Amount due is shown without Copy. g10.auction-winner-order.US9-TC32
   - The bank reference is shown as a detail row without Copy at the bottom of the FPS tab. g10.auction-winner-order.US9-TC32
6. Choose HK Local.
   - HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference. g10.auction-winner-order.US9-TC24
7. Choose International (SWIFT).
   - SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference, then the OUR charges note after the reference. g10.auction-winner-order.US9-TC24
8. Set `<narrow_viewport>` and scroll the tab track to International.
   - At `<narrow_viewport>`, each tab label stays readable and the tab track scrolls horizontally. g10.auction-winner-order.US9-TC24
9. Set `<wide_viewport>`.
   - At `<wide_viewport>`, the three tabs share the full-width track. g10.auction-winner-order.US9-TC24
10. Choose Submit Payment Proof.
   - The dialog title is Submit Payment Proof. g10.auction-winner-order.US9-TC25
   - Amount due and transfer reference are not shown. g10.auction-winner-order.US9-TC25
   - No FPS, HK Local or SWIFT tab is shown. g10.auction-winner-order.US9-TC25

## Walk 15: Winner's payment proof is not accepted

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_returned>`.
- `<order_verifying>` reads Payment Verifying with the row's `<time left>` kept.
- customer(winner) is on `<winner order url>` for `<order_returned_late>`.
- `<order_verifying>` was returned once, uploaded again with `<time left 2>` kept, and reads Payment Verifying.
- customer(winner) chose bank transfer and uploaded proof for `<order_verifying>`.
- An operator returned the proof with `<return reason>`.
- customer is on `<order_verifying>`'s Winner Order page.
- customer(winner)'s proof for `<order_verifying>` was returned with `<first reason>`.
- The winner uploaded proof again, and it was returned with `<second reason>`.
- customer(winner) uploaded proof for `<order_verifying>`; no letter was sent on upload.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_returned>` | A bank-transfer order whose proof an operator returned with `<external reason>` and `<internal reason>` |
| `<external reason>` | Amount received does not match |
| `<internal reason>` | A note for operators only |
| `<order_returned>` | A bank-transfer order whose proof was returned, inside its deadline |
| `<proof>` | One new PDF under 5 MB |
| Item | Time left: 60s (1 minute) |
| Item | Time left: 604740s (6 days 23 hours 59 minutes) |
| Item | Time left: Field; Value 2: Value |
| Item | Time left: `<order_verifying>`; Value 2: A bank-transfer order reading Payment Verifying |
| `<order_returned_late>` | A bank-transfer order returned with 60s left, and that minute has passed |
| `<order_verifying>` | A bank-transfer order on its second check |
| `<time left 2>` | The time left at the second upload |
| `<order_verifying>` | An order whose invoice was sent, proof uploaded `<time left>` before its payment deadline |
| `<time left>` | 2 days (172800s), a time inside the 7-day payment window |
| `<return reason>` | The reason text the operator entered for the winner |
| `<return time>` | 18 hours after the upload |
| `<order_verifying>` | An order paid by bank transfer, inside its payment window |
| `<first reason>` | Amount does not match |
| `<second reason>` | Reference missing from the transfer |
| `<order_verifying>` | An order paid by bank transfer, `<time left>` before its payment deadline at upload |
| `<time left>` | 2 days (172800s) |
| `<return reason>` | The reason text the operator enters for the winner |

### Route

1. Read the order.
   - `<external reason>` shows. g10.auction-winner-order.US10-TC2
2. Download the invoice PDF and read it.
   - `<internal reason>` appears on neither. g10.auction-winner-order.US10-TC2
3. Click Submit Payment Proof.
   - The order reads Payment Verifying again. g10.auction-winner-order.US10-TC3
4. Choose `<proof>`, submit and accept the confirm step.
   - The deadline stops with the time then left. g10.auction-winner-order.US10-TC3
5. Return the proof at `<return time>`.
6. Read the API response for the new deadline.
   - The deadline is `<return time>` plus the row's time left. g10.auction-winner-order.US10-TC4
7. Read the status and the payment area.
   - The order reads Payment Overdue. g10.auction-winner-order.US10-TC5
   - Proof upload is hidden; the overdue alert shows Contact Us. g10.auction-winner-order.US10-TC5
8. Return the proof again at `<return time>`.
9. Read the API response for the new deadline.
   - The deadline is `<return time>` plus `<time left 2>`. g10.auction-winner-order.US10-TC6
10. Read the order status and the alert.
   - the order no longer reads Payment Verifying. g10.auction-winner-order.US10-TC8
   - `<return reason>` is shown to the winner. g10.auction-winner-order.US10-TC8
11. Read the payment deadline.
   - Pay by reads `<return time>` plus `<time left>`. g10.auction-winner-order.US10-TC8
   - Submit Payment Proof and View Bank Details are offered again. g10.auction-winner-order.US10-TC8
12. Read the page.
   - `<second reason>` is shown. g10.auction-winner-order.US10-TC9
   - `<first reason>` is not shown. g10.auction-winner-order.US10-TC9
   - No proof file or file name is shown. g10.auction-winner-order.US10-TC9
13. Have an operator return the proof with `<return reason>`.
14. Read the mail sent to the winner's registered email.
   - One Proof not accepted letter carrying `<return reason>`. g10.auction-winner-order.US10-TC10
   - Its Pay by equals the return time plus `<time left>`. g10.auction-winner-order.US10-TC10
   - No payment reminder was sent while the proof was under check. g10.auction-winner-order.US10-TC10

## Walk 16: Winner bills a won lot to a different address

**Starting state:**

- customer(winner) is on Complete Order Setup for `<order_setup>`.
- customer(winner) is on billing Add Address for `<order_setup>`, with the form mode and missing field in the row.
- customer(winner) is on Complete Order Setup for `<order_setup>`, delivery confirmed to `<address_sf>`.
- customer(winner) is on billing Add Address of an auction order in Awaiting Setup, after unticking Same as delivery address.
- customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
- On it, after unticking Same as delivery address, they added a one-time billing address without saving it, and have not confirmed.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| Item | Form mode: Personal; Missing field: Phone; Phone country: Canada; Phone digits: (empty); Company Name: Not shown |
| Item | Form mode: Company; Missing field: Company Name; Phone country: Canada; Phone digits: 4165550100; Company Name: (empty) |
| `<address_sf>` | A personal address for Alex Chen, 100 Market St, San Francisco |
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

### Route

1. Untick Same as delivery address.
2. Open Add Address for billing.
   - The Personal / Company control shows above the fields, Personal selected. g10.auction-winner-order.US11-TC1
   - Phone shows a country selector, starting empty with a globe only. g10.auction-winner-order.US11-TC1
   - Company Name is hidden. g10.auction-winner-order.US11-TC1
3. Use one concrete test-data row: Form mode: Personal; Missing field: Phone; Phone country: Canada; Phone digits: (empty); Company Name: Not shown; Form mode: Company; Missing field: Company Name; Phone country: Canada; Phone digits: 4165550100; Company Name: (empty).
   a. Use Form mode "Personal"; Missing field "Phone"; Phone country "Canada"; leave Phone digits empty; leave Company Name hidden.
   b. Use Form mode "Company"; Missing field "Company Name"; Phone country "Canada"; Phone digits "4165550100"; leave Company Name empty.
   - The confirm is refused, with a message beside the missing field. g10.auction-winner-order.US11-TC2
4. Click confirm.
   - The order's billing address is unchanged. g10.auction-winner-order.US11-TC2
5. Untick Same as delivery address.
6. Open billing Add Address.
7. Open billing Add Address.
8. Confirm billing.
   - Delivery still reads `<address_sf>`. g10.auction-winner-order.US11-TC4
   - Billing reads Northwind Billing Ltd, Toronto, with the phone. g10.auction-winner-order.US11-TC4
9. Open the Country/Region picker and read the list.
10. Open delivery Add Address's picker and read its list.
11. Back on billing, type `Jap`.
   - The billing list holds every country and region in A-Z order, the same list as delivery. g10.auction-winner-order.US11-TC5
   - Typing leaves only the names that match `Jap`, Japan among them. g10.auction-winner-order.US11-TC5
12. Leave the order for another page, then return to it.
13. Read the billing addresses offered.
14. Open the account address book.
   - The one-time billing address is still offered for billing. g10.auction-winner-order.US11-TC6
   - The address book does not hold the one-time billing address. g10.auction-winner-order.US11-TC6

## Walk 17: Winner confirms delivery when five addresses are already saved — phase 1

**Starting state:**

- customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.
- customer(winner, five saved shipping addresses) is on delivery Add new address for `<order_setup>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |
| Kind | Company |
| Company Name | (empty) |
| Phone country | (not chosen) |
| Phone digits | (empty) |
| `<address_new>` | A complete personal shipping address not in the book |

### Route

1. Open the delivery address picker.
   - The Personal / Company control shows, Personal selected, Company Name hidden. g10.auction-winner-order.US12-TC1
2. Click Add new address.
   - Phone shows a country selector and number input, no country chosen. g10.auction-winner-order.US12-TC1
3. Open the delivery address picker.
4. Click Add new address.
5. Open the delivery address picker.
6. Confirm the address for this order.
   - the order's delivery address is the entered address, with phone. g10.auction-winner-order.US12-TC2
7. Open the account address book.
   - the book still holds five addresses. g10.auction-winner-order.US12-TC2
8. Click Company.
   - The confirm is refused, with messages beside Company Name and Phone. g10.auction-winner-order.US12-TC3
9. Fill the form: Kind "Company"; leave Company Name empty; First name "Jordan"; Last name "Lee"; leave Phone country unselected; leave Phone digits empty; Country or region "United States"; Town or city "New York"; Address line 1 "350 5th Ave"; Postal code "10118", Save this address for future orders unticked.
   - The order's delivery address is unchanged. g10.auction-winner-order.US12-TC3
10. Click confirm.
   - The book still holds five addresses. g10.auction-winner-order.US12-TC3
11. Open the delivery address picker.
12. Click Add new address.
   - The address form opens; no message blocks it. g10.auction-winner-order.US12-TC4
13. Open the delivery address picker.
14. Click Add new address.
15. Enter `<address_new>`, Save this address for future orders unticked.
16. Confirm the address for this order.
   - the order's delivery address is `<address_new>`. g10.auction-winner-order.US12-TC5
17. Open the account address book.
   - the book still holds five addresses. g10.auction-winner-order.US12-TC5
18. Open the delivery address picker.
19. Click Add new address and enter `<address_new>`.
20. Click Use this address.
   - `<address_new>` shows as a draft entry at the top of the picker. g10.auction-winner-order.US12-TC6
   - The five saved addresses list below it. g10.auction-winner-order.US12-TC6
21. Open the delivery address picker.
22. Click Add new address and enter `<address_new>`.
23. Click Save this address for future orders.
   - the checkbox is disabled and stays unticked. g10.auction-winner-order.US12-TC7
24. Hover the info icon beside it.
   - a short reason says the book is full. g10.auction-winner-order.US12-TC7
25. Open the delivery address picker.

## Walk 18: Winner confirms delivery when five addresses are already saved — phase 2

**Starting state:**

- customer(winner, four saved shipping addresses) is on `<winner order url>` for `<order_setup>`.
- customer(winner, five saved shipping addresses including `<address_home>`) is signed in.
- customer(winner, five saved shipping addresses including `<address_home>`) is on the account address book.
- customer(winner) holds six saved shipping addresses, seeded from before the cap.
- customer is on `<winner order url>` for `<order_setup>`.
- customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
- On it, they added a one-time delivery address without saving it, and have not confirmed.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |
| `<address_home>` | A saved address named Home, used by no unpaid order |
| `<address_home>` | A saved address named Home |
| `<new street>` | A different address line 1 |

### Route

1. Click Add new address and enter `<address_new>`.
2. Tick Save this address for future orders.
   - the checkbox is enabled and ticks. g10.auction-winner-order.US12-TC8
3. Confirm the address for this order.
4. Open the account address book.
   - the book holds five, including `<address_new>`. g10.auction-winner-order.US12-TC8
5. Remove `<address_home>` from the address book.
   - the book holds four addresses. g10.auction-winner-order.US12-TC9
6. Navigate to `<winner order url>` for `<order_setup>`.
7. Click Add new address in the delivery picker and enter `<address_new>`.
8. Click Save this address for future orders.
   - the checkbox is enabled and ticks. g10.auction-winner-order.US12-TC9
9. Open `<address_home>` for editing.
10. Change address line 1 to `<new street>`.
11. Save.
   - The book still holds five addresses. g10.auction-winner-order.US12-TC10
   - `<address_home>` shows once, with `<new street>`. g10.auction-winner-order.US12-TC10
12. Open the account address book in a new tab.
   - all six addresses are listed. g10.auction-winner-order.US12-TC11
13. On the order, click Add new address in the delivery picker and enter `<address_new>`.
14. Click Save this address for future orders.
   - the checkbox is disabled and stays unticked. g10.auction-winner-order.US12-TC11
15. Leave the order for another page, then return to it.
16. Read the delivery address picker.
17. Open the account address book.
18. Back on the order, select the one-time delivery address, a payment method, and confirm.
   - The delivery picker lists the one-time address ahead of the saved addresses. g10.auction-winner-order.US12-TC12
   - The address book does not hold the one-time address. g10.auction-winner-order.US12-TC12
   - The confirmation is accepted with the one-time delivery address. g10.auction-winner-order.US12-TC12

## Walk 19: Winner learns their order was cancelled and adjacent checks

**Starting state:**

- customer(winner of `<cancelled order>`) is on Winner Order.
- customer(winner) is on `<winner order url>` for `<order_refunded>`.
- customer(winner) is on `<winner order url>` for `<order_overpaid>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_refunded>` | A paid order refunded to the card, with an operator note |
| `<refund amount>` | The amount returned |
| `<order_overpaid>` | A paid order where the difference over the total was returned |
| `<difference>` | The amount returned |

### Route

1. Read the status, lot, winning bid and actions.
   - The page says Cancelled on the cancellation day, as a day-only date in the winner's local zone. g10.auction-winner-order.US13-TC1
   - The lot and winning bid remain visible. g10.auction-winner-order.US13-TC1
   - Contact Us is the only action. g10.auction-winner-order.US13-TC1
   - No cancellation reason is shown. g10.auction-winner-order.US13-TC1
2. Read the status, actions and receipt links.
   - the order reads Refunded; no stepper, Pay, address or shipment action. g10.auction-winner-order.US14-TC1
   - the invoice and every receipt still download. g10.auction-winner-order.US14-TC1
3. Read below Order Total.
   - `<refund amount>` shows below Order Total. g10.auction-winner-order.US14-TC1
4. Open the refund details from the inline alert.
   - Amount, Transfer to, Reason, then Note, in that order. g10.auction-winner-order.US14-TC1
   - Transfer to shows the card brand and last four only; no Reference. g10.auction-winner-order.US14-TC1
5. Read the status and invoice lines.
   - status and invoice lines are unchanged; it does not read Refunded. g10.auction-winner-order.US15-TC1
6. Read below Order Total.
   - only `<difference>` shows as returned. g10.auction-winner-order.US15-TC1
7. Open the refund details.
   - the details open, showing no proof and no provider reference. g10.auction-winner-order.US15-TC1

## Walk 20: Winner emails Grade10 from a locked order — phase 1

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.
- customer(winner) is on `<winner order url>` for `<order_setup_overdue>`.
- customer(winner) is on `<winner order url>` for `<order_partially_paid>`.
- customer(winner) is on `<winner order url>` for `<order_partially_paid_many>`.
- The browser may use the clipboard.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<order_setup_overdue>` | An order past its setup deadline, no invoice issued |
| `<lot_title>` | The lot title on that order |
| `<invoice_id>` | That order's invoice id |
| `<order_partially_paid>` | An order reading Partially Paid, with one receipt |
| `<receipt_ids>` | That invoice's receipt ids |
| `<order_partially_paid_many>` | An order reading Partially Paid, with three receipts |
| `<receipt_ids>` | Every receipt id on that invoice, oldest first |
| `<winner_question>` | A short question typed into Message |

### Route

1. Click Contact Us on the inline alert.
   - A dialog opens with To, Subject and Message. g10.auction-winner-order.US16-TC1
   - No mail app opens, and no toast naming only the address replaces the dialog. g10.auction-winner-order.US16-TC1
2. Click Contact Us.
3. Read To.
   - To reads `support@grade10.com`. g10.auction-winner-order.US16-TC2
4. Click Contact Us.
5. Read Subject.
   - Subject reads `Auction lot `<lot_title>`: setup overdue`, with no invoice id. g10.auction-winner-order.US16-TC3
6. Click Contact Us.
7. Read Subject.
   - Subject reads `Auction order `<invoice_id>`: payment overdue`. g10.auction-winner-order.US16-TC4
8. Click Contact Us.
9. Read Subject and Message.
   - Subject reads `Auction order `<invoice_id>`: partial payment`. g10.auction-winner-order.US16-TC5
   - Message lists `<receipt_ids>`. g10.auction-winner-order.US16-TC5
   - Message shows no remaining balance. g10.auction-winner-order.US16-TC5
10. Click Contact Us.
   - Message lists every id in `<receipt_ids>`. g10.auction-winner-order.US16-TC6
11. Read Message.
   - Message shows no remaining balance. g10.auction-winner-order.US16-TC6
12. Search the page for `support@grade10.com`.
   - the address is not on the page. g10.auction-winner-order.US16-TC7
13. Click Contact Us.
   - To shows `support@grade10.com`. g10.auction-winner-order.US16-TC7
14. Click Contact Us.
   - Copy Message is the primary action, first. g10.auction-winner-order.US16-TC8
15. Read the dialog footer.
   - Open Mail App is the secondary action, second. g10.auction-winner-order.US16-TC8
16. Click Contact Us.
   - Message is a multi-line field, order facts prefilled. g10.auction-winner-order.US16-TC9
17. Look at the copy controls beside To, Subject and Message.
   - To and Subject each have a copy control; Message has none. g10.auction-winner-order.US16-TC9
18. Type `<winner_question>` into Message, below the prefilled facts.
   - Message keeps `<winner_question>`. g10.auction-winner-order.US16-TC9
19. Click Contact Us.
20. Type `<winner_question>` into Message.
21. Click Copy Message.
22. Paste into a plain-text field.
   - The paste holds To `support@grade10.com`. g10.auction-winner-order.US16-TC10
   - It holds Subject `Auction order `<invoice_id>`: payment overdue`. g10.auction-winner-order.US16-TC10
   - It holds Message with `<winner_question>`. g10.auction-winner-order.US16-TC10
23. Click Contact Us.
   - It is a `mailto:` to `support@grade10.com`. g10.auction-winner-order.US16-TC11
24. Type `<winner_question>` into Message.
   - Its subject is `Auction order `<invoice_id>`: payment overdue`. g10.auction-winner-order.US16-TC11
25. Read the Open Mail App link target.
   - Its body includes `<winner_question>`. g10.auction-winner-order.US16-TC11

## Walk 21: Winner emails Grade10 from a locked order — phase 2

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.
- The browser may use the clipboard.
- customer(winner) is on `<winner order url>` for `<order_payment_overdue_reissued>`.
- customer(winner) is on `<winner order url>` for `<order_cancelled>`.
- Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
- customer(winner) holds an auction order in USD in Awaiting Setup.
- customer(winner) holds an auction order in Setup Overdue, whose payment access is closed.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<order_payment_overdue_reissued>` | An order payment-overdue after its invoice was reissued |
| `<current_invoice_id>` | The current invoice id |
| `<replaced_invoice_id>` | The replaced invoice id |
| `<order_cancelled>` | An order an operator cancelled, with a category and note |
| `<lot_title>` | That order's lot title |
| `<invoice_id>` | That order's invoice id |

### Route

1. Click Contact Us.
2. Click the copy control beside To, then paste.
   - pastes only `support@grade10.com`. g10.auction-winner-order.US16-TC12
3. Click the copy control beside Subject, then paste.
   - pastes only the Subject. g10.auction-winner-order.US16-TC12
   - Copy Message stays in the footer. g10.auction-winner-order.US16-TC12
4. Click Contact Us.
   - Subject reads `Auction order `<current_invoice_id>`: payment overdue`. g10.auction-winner-order.US16-TC13
5. Read Subject.
   - It does not name `<replaced_invoice_id>`. g10.auction-winner-order.US16-TC13
6. Click Contact Us.
7. Read Subject and Message.
   - Subject reads `Auction lot `<lot_title>`: order cancelled`. g10.auction-winner-order.US16-TC14
   - Message names `<lot_title>`, `<invoice_id>` and status Cancelled. g10.auction-winner-order.US16-TC14
   - Neither names the operator's category or note. g10.auction-winner-order.US16-TC14
8. Open the order and choose Contact Us.
9. Read the Subject and the Message.
10. Read the order status.
   - The Subject and Message are those of the `setup overdue` reason. g10.auction-winner-order.US16-TC15
   - The order status still reads Awaiting Setup. g10.auction-winner-order.US16-TC15
11. Open the order and choose Contact Us.
   - The button reads Copied for a moment, then Copy Message again. g10.auction-winner-order.US16-TC16
12. Choose Copy Message.
   - No toast appears. g10.auction-winner-order.US16-TC16
13. Watch the button and the page for a few seconds.
   - The To and Subject controls are unchanged. g10.auction-winner-order.US16-TC16

## Walk 22: Winner matches a bank refund against their own statement and adjacent checks

**Starting state:**

- customer(winner) is on `<winner order url>` for `<order_bank_refunded>`.
- customer(winner) holds an order in Awaiting Setup.
- customer(winner) holds an order in Preparing Invoice.
- customer(winner of `<partially-paid order>`) is on Winner Order.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<order_bank_refunded>` | A paid order refunded by bank transfer, no operator note |
| `<bank reference>` | The provider reference the operator recorded |
| First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code | Filled |
| Phone | `<a phone number of unusual length and format>` |
| Company Name, Address Line 2, Apt./Suite/Building | Empty |

### Route

1. Open the refund details from the inline alert.
   - Amount, Transfer to, Reference, then Reason, in that order; no Note. g10.auction-winner-order.US17-TC1
   - Transfer to shows a bank icon, masked destination, bank name beneath. g10.auction-winner-order.US17-TC1
   - Reference reads `<bank reference>`. g10.auction-winner-order.US17-TC1
   - No proof and no full account number show. g10.auction-winner-order.US17-TC1
2. Navigate to `<grade10 auction order url>`.
3. Read the page from the header to the sidebar.
   - The header shows Winner Order and the status badge. g10.auction-winner-order.US19-TC1
   - Order Progress shows Address current, then Invoice, Payment, Shipping and. Completed. g10.auction-winner-order.US19-TC1
   - The lot's title shows in the lot card only. g10.auction-winner-order.US19-TC1
   - No Order Information, Collection Method, Order Status list or Lots section. shows. g10.auction-winner-order.US19-TC1
4. Navigate to `<grade10 auction order url>`.
   - The confirmed address is shown. g10.auction-winner-order.US19-TC2
   - No invoice and no Pay Now are shown. g10.auction-winner-order.US19-TC2
5. Navigate to `<grade10 auction order url>`.
6. Follow the concrete values for each branch: g10.auction-winner-order.US19-TC3: Fill the address form: First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code — Filled; Phone — `<a phone number of unusual length and format>`; Company Name, Address Line 2, Apt./Suite/Building — Empty | g10.auction-winner-order.US19-TC4: Fill every required field except Town/City and Postal Code.
7. Click Confirm.
   - The address is accepted. g10.auction-winner-order.US19-TC3
   - The order status reads Preparing Invoice. g10.auction-winner-order.US19-TC3
8. Navigate to `<grade10 auction order url>`.
   - The address is refused. g10.auction-winner-order.US19-TC4
9. Fill every required field except Town/City and Postal Code.
   - An error shows on Town/City and on Postal Code. g10.auction-winner-order.US19-TC4
10. Click Confirm.
   - The order status still reads Awaiting Setup. g10.auction-winner-order.US19-TC4
11. Read the payment step, settlement alert and receipt area.
   - The page reads Partially Paid. g10.auction-winner-order.US20-TC1
   - Pay, Submit Payment Proof, View Bank Details and a payment deadline are absent. g10.auction-winner-order.US20-TC1
   - The page offers Contact Us, shows the full invoice amount and no remaining balance. g10.auction-winner-order.US20-TC1
   - Each recorded payment has a separate receipt link, oldest first. g10.auction-winner-order.US20-TC1

## Walk 23: Winner quotes their order

**Starting state:**

- One winning order has a card invoice and another has a bank-transfer invoice.
- The latest invoice for payment reference `LK423` is `IN-LK42399`.
- A new listing's 5-character candidate collides with an active code or retained reservation.
- A listing and its order already store payment reference `LK423`.
- A listing has payment reference `LK423`.

### Route

1. Open each invoice and its order.
2. Read the invoice ID and payment reference.
   - Each order and invoice shows its invoice ID and unchanged payment reference. g10.auction-winner-order.US21-TC1
   - The card invoice and bank-transfer invoice use the same reference rules. g10.auction-winner-order.US21-TC1
   - No receipt breakdown or receipt amount is asserted here. g10.auction-winner-order.US21-TC1
3. Reissue the invoice.
   - The new invoice ID is `IN-LK423100`. g10.auction-winner-order.US21-TC2
4. Read the new invoice ID.
   - The payment reference remains `LK423`. g10.auction-winner-order.US21-TC2
5. Create the listing.
   - Allocation retries and stores a distinct valid code. g10.auction-winner-order.US21-TC3
6. Read the stored listing/payment reference.
   - The code is not treated as collision-free merely because its source is a UUID or listing ID. g10.auction-winner-order.US21-TC3
7. Change the allocator implementation.
   - Both continue to use `LK423`. g10.auction-winner-order.US21-TC4
8. Read the listing and order references.
   - No new listing receives a retained code. g10.auction-winner-order.US21-TC4
9. Fetch the public listing page and its shared preview.
10. Inspect server HTML, embedded state and preview metadata.
   - The payment reference has no labelled public field and appears only as the lower-case suffix of the canonical address. g10.auction-winner-order.US21-TC5

## Walk 24: Winner reviews invoice and payment details

**Starting state:**

- An order has invoice `IN-LK42301`, then reissued invoice `IN-LK42302`, with payment reference `LK423`.
- An invoice is `IN-LK42302` for payment reference `LK423`.
- A full or partial payment for that invoice has finalized.
- A historical receipt ID is `REC-202609-LK7P2Q-01-P1`.
- A card payment has a Grade10 payment reference and a provider reference.

### Route

1. Look up the order by each invoice ID and by `LK423`.
   - Each lookup finds the same order. g10.auction-winner-order.US22-TC1
2. Open both invoice PDFs.
   - The replacement invoice names the replaced invoice and keeps `LK423`. g10.auction-winner-order.US22-TC1
3. Open the receipt.
4. Read its identifier.
   - The first receipt ID is `RC-LK42302P1`. g10.auction-winner-order.US22-TC2
   - A later finalized payment for that invoice receives `P2`, then `P10` without padding. g10.auction-winner-order.US22-TC2
   - A receipt for another invoice starts at `P1` for that invoice. g10.auction-winner-order.US22-TC2
5. Open the historical receipt after the new identifier ships.
   - The historical receipt ID remains `REC-202609-LK7P2Q-01-P1`. g10.auction-winner-order.US22-TC3
6. Record a refund, reversal or void.
   - No receipt ID is created for the refund, reversal or void. g10.auction-winner-order.US22-TC3
7. Read Stripe metadata and the winner-facing order and invoice.
   - Stripe metadata carries the Grade10 payment reference. g10.auction-winner-order.US22-TC4
   - The provider reference appears on no winner-facing surface. g10.auction-winner-order.US22-TC4

## Walk 25: Winner gets the address form back

**Starting state:**

- `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
- customer(winner of `<lot_1>`) is on `<the winner's auction order url>` at `<one minute before close>`.
- customer(winner of `<lot_1>`) is on `<the winner's auction order url>` at `<the address deadline>`.
- `<lot_1>`'s order has no confirmed delivery address, derives as Setup Overdue,.
- An operator reopened the address form at `<the reopen>`.
- customer(winner of `<lot_1>`) is on `<the winner's auction order url>`.
- `<lot_1>`'s order has no confirmed delivery address and its address deadline passed two hours ago.
- customer(winner of `<lot_1>`) is signed in.
- customer(winner of `<lot_1>`, `<lot_3>` and `<lot_4>`) won three lots that closed at different datetimes.
- `<sent-invoice order>` carries a confirmed delivery address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.
- customer(winner of `<sent-invoice order>`) is on `<the winner's auction order url>`.
- `<expired-invoice order>`'s invoice is `expired` and its address was confirmed and is locked.
- customer(winner of `<expired-invoice order>`) is on `<the winner's auction order url>`.
- `<missed-deadline order>`'s address deadline has passed with no address confirmed.
- customer(winner of `<missed-deadline order>`) is signed in.
- `<missed-deadline order>`'s address deadline has passed.
- An operator holds payment-processing.
- `<extended lot>` was scheduled to close at 2026-09-12T08:45:00Z, took a late bid, and closed at 2026-09-12T09:00:00Z after extended bidding.
- customer(winner of `<extended lot>`) is on `<the winner's auction order url>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| Entrance closes | 2026-09-05T12:00:00Z |
| `<one minute before close>` | 2026-09-05T11:59:00Z |
| `<the address deadline>` | 2026-09-05T12:00:00Z |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| New address deadline | 2026-09-09T09:00:00Z |
| `<lot_3>` recorded close | 2026-09-03T18:30:00Z |
| `<lot_4>` recorded close | 2026-09-04T09:15:00Z |

### Route

1. Choose the account's saved home address.
2. Confirm the delivery address.
   - The confirmation is accepted. g10.auction-winner-order.US23-TC1
   - The order reads Preparing Invoice. g10.auction-winner-order.US23-TC1
   - No invoice is issued by the confirmation itself. g10.auction-winner-order.US23-TC1
3. Attempt to confirm the account's saved home address.
4. Read the order's delivery address.
   - The confirmation is refused. g10.auction-winner-order.US23-TC2
   - The order holds no confirmed delivery address. g10.auction-winner-order.US23-TC2
   - The order still reads Setup Overdue. g10.auction-winner-order.US23-TC2
5. Read the delivery address area.
6. Confirm the account's saved home address.
   - The address deadline reads 2026-09-09T09:00:00Z, measured from the reopen. g10.auction-winner-order.US23-TC4
   - The confirmation is accepted. g10.auction-winner-order.US23-TC4
   - The order reads Preparing Invoice. g10.auction-winner-order.US23-TC4
7. Read the delivery address area for a reopen or extend control.
8. Submit a reopen of the address form as the winner.
   - No reopen or extend control is offered to the winner. g10.auction-winner-order.US23-TC5
   - The reopen is refused. g10.auction-winner-order.US23-TC5
   - The address deadline is unchanged. g10.auction-winner-order.US23-TC5
9. Open each of the three auction orders.
   - Three separate orders exist, one per lot. g10.auction-winner-order.US23-TC6
10. Read each order's address deadline.
   - The three address deadline passes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z. g10.auction-winner-order.US23-TC6
11. Confirm a different delivery address on each order.
   - Each order keeps the address confirmed on it and awaits its own invoice. g10.auction-winner-order.US23-TC6
12. Attempt to change the delivery address to the account's work address.
13. Read the delivery address area.
   - The change is refused even though the 48 hours have not elapsed. g10.auction-winner-order.US23-TC7
   - The order still shows the address the invoice was quoted for. g10.auction-winner-order.US23-TC7
   - The area points the winner at Grade10 for a change. g10.auction-winner-order.US23-TC7
14. Read the delivery address area.
15. Attempt to change the delivery address to the account's work address.
   - No address form is offered. g10.auction-winner-order.US23-TC8
   - The change is refused. g10.auction-winner-order.US23-TC8
   - The overdue alert carries Contact Us and no card Pay control is shown. g10.auction-winner-order.US23-TC8
16. Open the account address book.
   - Both address-book writes are accepted. g10.auction-winner-order.US23-TC9
17. Edit the saved home address and save a new work address.
   - Neither reaches the auction order. g10.auction-winner-order.US23-TC9
18. Return to `<the winner's auction order url>`.
   - The order still has no confirmed delivery address and still offers no address form. g10.auction-winner-order.US23-TC9
19. The operator reopens the address form with a reason.
   - The order offers the address form again. g10.auction-winner-order.US23-TC10
20. Read the winner's post-close letters for that lot.
   - No letter about the reopen reaches the winner. g10.auction-winner-order.US23-TC10
21. Read the address deadline under Confirm delivery address.
   - The deadline reads 2026-09-14T09:00:00Z, counted from the actual close. g10.auction-winner-order.US23-TC11
22. Confirm the account's saved home address at 2026-09-14T08:50:00Z, ten minutes before that deadline and after 48 hours from the scheduled close.
   - The confirmation is accepted and the order reads Preparing Invoice. g10.auction-winner-order.US23-TC11

## g10.auction-winner-order.US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### g10.auction-winner-order.US1-TC1: A lot closing with a winner opens one order whose quoted charges read TBD

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

* customer(signed in, holds a default shipping address) leads `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, led by this collector, closing within a minute |

**Steps:**

1. Wait for `<lot_1>` to close.
2. Navigate to `<winner order url>` for `<lot_1>`.
3. Read Order Summary.

**Expected Results:**

* Step 2: one Winner Order exists for `<lot_1>`.
* Step 3: Shipping & Handling, Insurance and Tax read TBD.
* Step 3: no charge is marked as an estimate.

`<!-- trace:case id=g10.auction-winner-order.TC-qaq rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(signed in, no default shipping address) leads `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, led by this collector, closing within a minute |

**Steps:**

1. Wait for `<lot_1>` to close.
2. Navigate to `<winner order url>` for `<lot_1>`.
3. Try to pay.

**Expected Results:**

* Step 2: the winning bid and buyer's premium show.
* Step 2: Shipping & Handling, Insurance and Tax read TBD.
* Step 3: payment is refused until a delivery address is given.

`<!-- trace:case id=g10.auction-winner-order.TC-shz rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_prefilled>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_prefilled>` | An unpaid order whose delivery address is pre-filled from the account default, not confirmed |

**Steps:**

1. Try to pay without confirming the delivery address.

**Expected Results:**

* Payment is refused.
* The order asks the winner to confirm the delivery address.

`<!-- trace:case id=g10.auction-winner-order.TC-yuw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_unpaid>`.
* `<address_far>` is saved on the account.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_unpaid>` | An unpaid HKD order, total `<total before>` |
| `<address_far>` | A saved address whose shipping and insurance cost `<difference>` more |
| `<total before>` | HKD3,280 (fixed derived value) |
| `<difference>` | HKD50 (range: 1000–79999 minor units) |
| `<total after>` | HKD 3,330.00: `<total before>` plus `<difference>` |

**Steps:**

1. Change the delivery address to `<address_far>`.
2. Read the totals before paying.

**Expected Results:**

* The new total reads `<total after>`, equal to `<total before>` plus `<difference>`.
* Both `<total before>` and `<total after>` show before payment.
* No separate charge of `<difference>` is raised.

`<!-- trace:case id=g10.auction-winner-order.TC-0p6 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer A(card linked) leads `<lot_1>`, bidding on the card on file.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, led by customer A, closing within a minute |
| `<card>` | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |

**Steps:**

1. Wait for `<lot_1>` to close.
2. Read customer A's authorizations and charges for `<lot_1>` at the card provider.
3. Once the invoice for `<lot_1>` is sent, pay it by card through hosted Checkout with `<card>`.
4. Read customer A's card transactions for `<lot_1>` again.

**Expected Results:**

* Step 2 shows no authorization and no charge for `<lot_1>`.
* Step 3 opens hosted Checkout for the invoice total.
* Step 4 shows one charge, for the invoice total.

`<!-- trace:case id=g10.auction-winner-order.TC-5vo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_unpaid>`.
* `<card_declining>` is mocked to decline.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_unpaid>` | An unpaid order inside its payment deadline |
| `<card_declining>` | A card the provider declines |
| `<card_good>` | A card the provider accepts |

**Steps:**

1. Pay with `<card_declining>`.
2. Pay with `<card_good>`.

**Expected Results:**

* Step 1: the invoice stays unpaid and payable.
* Step 2: payment is accepted; the order reads paid.

`<!-- trace:case id=g10.auction-winner-order.TC-vxj rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* `<lot_2>` was extended twice and closed with a winner at `<close>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A lot whose close moved twice under extended bidding |
| `<close>` | 2026-09-03T12:00:00Z, the recorded (moved) close |
| `<deadline>` | 2026-09-10T12:00:00Z: `<close>` plus 604800s (7 days) |

**Steps:**

1. Read the payment deadline on `<lot_2>`'s invoice.
2. Open `<winner order url>` in a browser set to America/New_York.

**Expected Results:**

* Step 1: the deadline is `<deadline>` and the PDF shows it as 2026-09-10 20:00 `GMT+8`.
* Step 2: Winner Order shows the same instant in the viewer's local zone as 08:00 `EDT`.

`<!-- trace:case id=g10.auction-winner-order.TC-h5e rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(signed in, no saved shipping address) won `<order_unpaid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_unpaid>` | An unpaid order inside its setup window |
| `<address_home>` | A shipping address named Home |
| `<address_work>` | A shipping address named Work |

**Steps:**

1. Save `<address_home>` and `<address_work>` to the account address book.
2. Navigate to `<winner order url>` for `<order_unpaid>`.
3. Open the delivery address picker.

**Expected Results:**

* Step 1: both addresses are in the address book, each under its name.
* Step 3: both are offered for the order.

`<!-- trace:case id=g10.auction-winner-order.TC-hrx rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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
| `<address_home>` | A saved shipping address named Home |
| `<address_work>` | A saved shipping address named Work |
| `<order_new>` | An order opened after step 1 |

**Steps:**

1. Set `<address_work>` as the default.
2. Navigate to `<winner order url>` for `<order_new>`.

**Expected Results:**

* Step 1: only `<address_work>` is marked default.
* Step 2: the delivery address is pre-filled with `<address_work>`.

`<!-- trace:case id=g10.auction-winner-order.TC-jje rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) confirmed `<address_home>` on `<order_unpaid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_unpaid>` | An unpaid order whose delivery address is `<address_home>` |
| `<address_home>` | A saved shipping address named Home |
| `<new street>` | A different address line 1 |

**Steps:**

1. Edit `<address_home>`'s address line 1 to `<new street>` in the address book.
2. Navigate to `<winner order url>` for `<order_unpaid>`.

**Expected Results:**

* Step 1: the address book shows `<new street>`.
* Step 2: the order still shows the original address line 1.

`<!-- trace:case id=g10.auction-winner-order.TC-5jc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) confirmed `<address_work>` on `<order_unpaid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_unpaid>` | An unpaid order whose delivery address is `<address_work>` |
| `<address_work>` | A saved shipping address named Work |

**Steps:**

1. Archive `<address_work>` in the address book.

**Expected Results:**

* The winner is asked to choose another address for `<order_unpaid>`.
* `<address_work>` stays available while the order uses it.

`<!-- trace:case id=g10.auction-winner-order.TC-nsg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Look at the Phone field.

**Expected Results:**

* Phone shows a globe only: no flag, no calling-code divider.
* The placeholder shows an example with a calling code, `+852 12345678`.
* No calling country is chosen.

`<!-- trace:case id=g10.auction-winner-order.TC-4gp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_setup>`, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Open Add Address for delivery.
2. Read the Personal / Company control and the fields below it.

**Expected Results:**

* Personal is selected.
* Company Name is not shown.

`<!-- trace:case id=g10.auction-winner-order.TC-rx1 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Click Company on the Personal / Company control.
2. Read the fields below it.

**Expected Results:**

* Company is selected.
* Company Name shows, marked required.

`<!-- trace:case id=g10.auction-winner-order.TC-51d rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`, with the form mode and missing field in the row.

**Test data:**

| Form mode | Missing field | Phone country | Phone digits | Company Name |
| --- | --- | --- | --- | --- |
| Company | Company Name | United States | 4155550100 | (empty) |
| Personal | Phone | United States | (empty) | Not shown |
| Personal | Phone | (not chosen) | 4155550100 | Not shown |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside the missing field.
* No address is saved or applied to the order.
`<!-- trace:case id=g10.auction-winner-order.TC-qwo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is accepted; no phone-format refusal shows.
* The address is applied to the order.

`<!-- trace:case id=g10.auction-winner-order.TC-qia rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| `<stored phone>` | +14155550100 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.
3. Read the phone on the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: the phone reads `<stored phone>`.

`<!-- trace:case id=g10.auction-winner-order.TC-phu rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`, Personal selected.

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
| Address line 2 | (empty) |
| State or province | (empty) |
| Postal code | 94105 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.
3. Read the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: line 1 and postal code show; line 2 and state are empty.

`<!-- trace:case id=g10.auction-winner-order.TC-2vd rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Read every field label on the form.

**Expected Results:**

* No Apt., Suite or Building field shows.
* Address line 2 shows as the optional second line.

`<!-- trace:case id=g10.auction-winner-order.TC-4zr rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner, has an address in the row) is on `<winner order url>` for `<order_setup>`, Complete Order Setup open.

**Test data:**

| Address type | Title | Address fixture |
| --- | --- | --- |
| Personal | Alex Chen | Saved personal address with street, city or region, country, phone and postal code |
| Company | Northwind Collectibles | Saved company address with recipient Alex Chen, street, city or region, country, phone and postal code |

**Steps:**

1. Open the delivery address picker.
2. Read the address card from **Test data**.

**Expected Results:**

* The title matches the row's expected address type.
* The body shows street, city or region, and country.
* The body shows no postal code and no phone.
`<!-- trace:case id=g10.auction-winner-order.TC-ajg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on delivery Add Address for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
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
2. Fill the fields from **Test data**.
3. Click confirm.
4. Reopen the delivery address picker.

**Expected Results:**

* Step 3: the order's delivery address carries Northwind Collectibles, Alex Chen, phone and 94105.
* Step 4: the card reads Northwind Collectibles, with no phone or postal code.

`<!-- trace:case id=g10.auction-winner-order.TC-kqe rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_setup>`, reading Awaiting Setup.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
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

**Steps:**

1. Open Complete Order Setup.
2. Enter the delivery address from **Test data**.
3. Confirm setup.
4. Read Delivery and Billing on Order Summary.

**Expected Results:**

* Delivery shows company, recipient, phone, 100 Market St, San Francisco 94105 and United States.
* Billing shows the same as Delivery.

`<!-- trace:case id=g10.auction-winner-order.TC-apy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_with_insurance>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_with_insurance>` | An order whose sent invoice includes Insurance |
| `<insurance_amount>` | The Insurance amount on that invoice |

**Steps:**

1. Find Insurance on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance reads `<insurance_amount>`, not TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

`<!-- trace:case id=g10.auction-winner-order.TC-aq5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_pre_invoice>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_pre_invoice>` | An order whose invoice is not yet sent |

**Steps:**

1. Read the fee rows on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance shows with the other fee rows, reading TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

`<!-- trace:case id=g10.auction-winner-order.TC-7cb rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

* customer(winner) is on `<winner order url>` for `<order_without_insurance>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_without_insurance>` | An order whose sent invoice has no Insurance |

**Steps:**

1. Read Order Summary.

**Expected Results:**

* No Insurance row and no Insurance tooltip show.

`<!-- trace:case id=g10.auction-winner-order.TC-u99 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

* `<listing_2>` holds listing code `<code_1>`.
* `<listing_3>` is a draft whose internal id hashes to `<code_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<code_1>` | A listing code in use |

**Steps:**

1. Publish `<listing_3>`.
2. Read `<listing_3>`'s listing code.
3. Change the hash method, then read both listing codes.

**Expected Results:**

* Step 2: `<listing_3>` holds a code other than `<code_1>`, hashed again with a counter.
* Step 2: `L` and 5 characters; no `0`, `O`, `1`, `I` or lower case.
* Step 3: both listings keep their codes.

`<!-- trace:case id=g10.auction-winner-order.TC-6vp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

* customer(winner) is on `<winner order url>` for `<order_preparing>`.
* An operator changed `<order_preparing>` to `<address_work>` and bank transfer.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_preparing>` | An HKD order reading Preparing Invoice, home address and card confirmed |
| `<address_work>` | A saved address named Work |

**Steps:**

1. Reload the order.
2. Look for address and payment-method controls.

**Expected Results:**

* Step 1: the order shows `<address_work>` and bank transfer, still Preparing Invoice.
* Step 2: no control changes either.

`<!-- trace:case id=g10.auction-winner-order.TC-gk5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

* customer(winner) confirmed `<address_work>` on `<order_preparing>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_preparing>` | An order reading Preparing Invoice, `<address_work>` confirmed |
| `<address_work>` | A saved address named Work |

**Steps:**

1. Archive `<address_work>` in the address book.
2. Navigate to `<winner order url>` for `<order_preparing>`.

**Expected Results:**

* Step 1: `<address_work>` is archived.
* Step 2: the order still shows `<address_work>`.

`<!-- trace:case id=g10.auction-winner-order.TC-nxn rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open the Country/Region picker.
2. Scroll the popup from the first option to the last.

**Expected Results:**

* Step 1 opens a popup listing every country and region A–Z, not a short designated set.
* Step 2 keeps the full catalogue available inside the capped-height popup.

`<!-- trace:case id=g10.auction-winner-order.TC-0v6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Look at the country or region field label beside the picker.

**Expected Results:**

* The label reads Country/Region.

`<!-- trace:case id=g10.auction-winner-order.TC-20b rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Read the Country/Region field without opening the popup.

**Expected Results:**

* The field shows Hong Kong.
* Country/Region options are not in the tree.

`<!-- trace:case id=g10.auction-winner-order.TC-8fw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open the Country/Region picker.
2. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.

**Expected Results:**

* Step 1 shows every country and region A–Z in the popup.
* Step 2 scrolls the long list inside a capped height without truncating the catalogue to a short set.

`<!-- trace:case id=g10.auction-winner-order.TC-gsw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | hong |

**Steps:**

1. Focus the open Country/Region picker.
2. Type the query from **Test data**.

**Expected Results:**

* Step 2 shows only country or region names that match the query.
* Names that do not match (for example Australia) are not shown.

`<!-- trace:case id=g10.auction-winner-order.TC-x35 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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
2. Type the query from **Test data**.

**Expected Results:**

* The list shows only options whose labels match the query.
* Non-matching options are not shown.

`<!-- trace:case id=g10.auction-winner-order.TC-8bf rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* The list shows no country or region options.

`<!-- trace:case id=g10.auction-winner-order.TC-9fh rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Test data:**

| Query partition | Typed query | Matching result |
| --- | --- | --- |
| Early alphabet | afg | Afghanistan, or the catalogue name that matches |
| Late alphabet | zim | Zimbabwe, or the catalogue name that matches |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* The matching country appears in the filtered list.
* Unrelated country names outside the query are not shown.
`<!-- trace:case id=g10.auction-winner-order.TC-r90 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | united king |
| Country or region | United Kingdom |

**Steps:**

1. Open the Country/Region picker.
2. Type the query from **Test data**.
3. Select United Kingdom from the filtered matches.

**Expected Results:**

* Step 3 closes the popup.
* The field shows United Kingdom.
* Options are no longer in the tree.

`<!-- trace:case id=g10.auction-winner-order.TC-iso rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Activate Confirm or Use This Address with Country/Region empty.

**Expected Results:**

* A field refusal appears beside Country/Region.
* The address is not applied with an empty country or region.

`<!-- trace:case id=g10.auction-winner-order.TC-wc8 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open the Country/Region picker.
2. Note whether an early-alphabet name and a late-alphabet name both appear in the list.

**Expected Results:**

* The open list includes names from the start of the A–Z range and from near the end.
* The set is not limited to a short designated sample.

`<!-- trace:case id=g10.auction-winner-order.TC-ujy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open Winner Order.
2. Read Tax in Order Summary and open its info tip.

**Expected Results:**

* Tax reads TBD with the other fee rows.
* No calculated Tax amount is shown.
* The tip reads `Set by Grade10 for where your order ships. Some orders have none.`

`<!-- trace:case id=g10.auction-winner-order.TC-m21 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* Order Summary shows Tax of HKD70 (range: >0 minor units) between Insurance and Payment Processing Fee.
* Order Summary offers the Tax info tip with the stated copy.
* The invoice PDF and the receipt PDF each show Tax of HKD70 (range: >0 minor units) between Insurance and Subtotal.
* Each PDF's Subtotal includes Tax of HKD70 (range: >0 minor units).

`<!-- trace:case id=g10.auction-winner-order.TC-nvv rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* No surface shows a Tax line.
* Order Summary offers no Tax info tip.

`<!-- trace:case id=g10.auction-winner-order.TC-dvc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

**Steps:**

1. Add Tax of HKD70 (range: >0 minor units).
2. Send the invoice.
3. Read its Subtotal and payment processing fee inputs.

**Expected Results:**

* The Subtotal is HKD3,350 (fixed derived value).
* Grade10 computes the payment processing fee from that Subtotal.

`<!-- trace:case id=g10.auction-winner-order.TC-n0y rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

* Grade10 holds no bank details for the currency in the row.
* customer(winner) holds an auction order in that currency in Awaiting Setup.

**Steps:**

1. Start setup, choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.
`<!-- trace:case id=g10.auction-winner-order.TC-4dz rev=1 covers=g10.auction-winner-order.SC-1aa -->`

### g10.auction-winner-order.US1-TC50: The method can change until the winner confirms

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

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

**Steps:**

1. Change the choice to bank transfer.
2. Confirm the home address.
3. Reload the order.

**Expected Results:**

* The order records bank transfer, not card.
* The order reads Preparing Invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-miy rev=1 covers=g10.auction-winner-order.SC-wn1 -->`

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

**Steps:**

1. Choose the home address, choose no payment method, and confirm.
2. Reload the order.

**Expected Results:**

* Grade10 refuses the confirmation.
* The order is still Awaiting Setup.

`<!-- trace:case id=g10.auction-winner-order.TC-csb rev=1 covers=g10.auction-winner-order.SC-7y2 -->`

### g10.auction-winner-order.US1-TC52: A currency with no card fee rule reads card as not yet available

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

* Outside production, Grade10 holds the sample HKD bank details, and Payment Settings holds no HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Try to choose card.
3. Send Grade10 a setup confirmation carrying the home address and card.
4. Reload the order.

**Expected Results:**

* Card reads that it is not yet available in HKD, and cannot be chosen.
* Bank transfer is offered.
* Grade10 refuses the confirmation.
* The order holds no delivery address and no method.

`<!-- trace:case id=g10.auction-winner-order.TC-z2f rev=1 covers=g10.auction-winner-order.SC-cz1 -->`

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

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Try to choose card, then bank transfer, then confirm.
3. Reload the order.

**Expected Results:**

* The page says payment is not yet available in USD and offers Contact Us.
* Neither method can be chosen, and Grade10 refuses the confirmation.
* The order is still Awaiting Setup, holding no delivery address and no method.

`<!-- trace:case id=g10.auction-winner-order.TC-97r rev=1 covers=g10.auction-winner-order.SC-05o -->`

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

* `<listing_1>` is led as the row states, its recorded close a few minutes away, and no further bid is coming.
* `<listing_1>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, which holds `<house billing address>`.
* customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_1>` as the row states.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), the listing's committed internal bid |
| `<internal bidder>` | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test |
| `<house billing address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 1 Test Road, Central, Hong Kong |

| Row | Bidding at the close | Order for `<listing_1>` after the close | Auction-won letters for `<listing_1>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | One, `<internal bidder>`'s, flagged internal, winning bid 508000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | One, `<internal bidder>`'s, flagged internal, winning bid 400000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, not flagged internal, winning bid 608000, Awaiting Setup | One, to customer A |

**Steps:**

1. Wait until `<listing_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_1>`.
3. As customer A, read My Auctions' row for `<listing_1>` from the API.
4. Filter the send log by `<listing_1>` and read the rows from the close.

**Expected Results:**

* Step 2 holds exactly one order, the row's order.
* Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order.
* Step 4 reads the row's auction-won letters.
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

`<!-- trace:case id=g10.auction-winner-order.TC-r03 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

`<!-- trace:case id=g10.auction-winner-order.TC-jo6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

`<!-- trace:case id=g10.auction-winner-order.TC-u2z rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->`

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

`<!-- trace:case id=g10.auction-winner-order.TC-pvm rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->`

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

`<!-- trace:case id=g10.auction-winner-order.TC-o26 rev=1 covers=g10.auction-winner-order.SC-pt5 -->`

---

## g10.auction-winner-order.US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

`<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=2 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_paid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_paid>` | An HKD order paid in full at `<final amount>` |
| `<final amount>` | HKD3,330 (range: 80000–399999 minor units) |

**Steps:**

1. Download the receipt PDF.
2. Read its lines.

**Expected Results:**

* Winning bid, buyer's premium, shipping, insurance when added, Tax when added and final amount show.
* The lines sum to `<final amount>`.
* It names how it was paid.

`<!-- trace:case id=g10.auction-winner-order.TC-qvc rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_paid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_paid>` | An HKD order with invoice total `<total>`, paid by one payment of `<total>` |
| `<total>` | HKD1,080 (fixed derived value) |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<total>`; Remaining Balance Due 0.

`<!-- trace:case id=g10.auction-winner-order.TC-myw rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_parts>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_parts>` | An HKD order with invoice total `<total>`, paid `<payment 1>` then `<payment 2>` |
| `<total>` | HKD 1,080.00 |
| `<payment 1>` | HKD 420.00 |
| `<payment 2>` | HKD 310.00 |

| Receipt | Previous Payments | Current Payment Received | Remaining Balance Due |
| --- | --- | --- | --- |
| First | 0 | HKD 420.00 | HKD 660.00: `<total>` − `<payment 1>` |
| Second | HKD 420.00 | HKD 310.00 | HKD 350.00: `<total>` − `<payment 1>` − `<payment 2>` |

**Steps:**

1. Open the Receipt PDF row.
2. Open the first receipt, then the second.

**Expected Results:**

* Step 1: both receipts are listed on one row, oldest first.
* Step 2: each shows Original Invoice Total `<total>` and its row's values.

`<!-- trace:case id=g10.auction-winner-order.TC-gss rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_tolerance>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_tolerance>` | An HKD order, total `<total>`, paid `<paid before>`, then closed Paid by an operator recording `<closing payment>` within the closing tolerance |
| `<total>` | HKD 1,080.00 |
| `<paid before>` | HKD 960.00 |
| `<closing payment>` | HKD 60.00 |

**Steps:**

1. Open the receipt for `<closing payment>`.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments `<paid before>`.
* Current Payment Received `<closing payment>`; Remaining Balance Due 0.
* No shortfall or write-off line shows.

`<!-- trace:case id=g10.auction-winner-order.TC-b4d rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_over>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_over>` | An HKD order, total `<total>`, with an operator-confirmed payment of `<payment>` |
| `<total>` | HKD 1,080.00 |
| `<payment>` | HKD 1,190.00 |

**Steps:**

1. Open the receipt.

**Expected Results:**

* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<payment>`; Remaining Balance Due 0.
* No negative balance or credit line shows.

`<!-- trace:case id=g10.auction-winner-order.TC-vmr rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_three>`.
* The second payment was later refunded or reversed.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_three>` | An HKD order, total HKD 1,080.00, paid HKD 220.00, HKD 310.00, HKD 140.00 in that order, one receipt each |

| Receipt | Previous Payments | Current Payment Received | Remaining Balance Due |
| --- | --- | --- | --- |
| First | 0 | HKD 220.00 | HKD 860.00 |
| Second | HKD 220.00 | HKD 310.00 | HKD 550.00 |
| Third | HKD 530.00 | HKD 140.00 | HKD 410.00 |

**Steps:**

1. Open each receipt in turn.

**Expected Results:**

* Each still shows its row's values.
* No receipt was reissued.

`<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=3 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
### g10.auction-winner-order.US2-TC2: A dispatched lot shows the tracking number as the carrier link only with a tracker link

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

* customer(winner) is on `<winner order url>` for `<order_shipped>` and `<order_shipped_no_link>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_shipped>` | A paid order dispatched with a carrier, `<tracking number>` and a recorded tracker link |
| `<order_shipped_no_link>` | A paid order dispatched with a carrier and `<tracking number>`, and no tracker link |

**Steps:**

1. Read the shipment section of `<order_shipped>`.
2. Click `<tracking number>`.
3. Read the shipment section of `<order_shipped_no_link>`.

**Expected Results:**

* Step 1: `<tracking number>` shows as a link, with no separate carrier name.
* Step 2: the tracker link opens.
* Step 3: `<tracking number>` shows as plain text, with no carrier name and no Track shipment control.

`<!-- trace:case id=g10.auction-winner-order.TC-l8v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->`
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

* `<order_shipped>` is dispatched.
* The carrier delivery feed is mocked to report delivery with `<handover time>` and `<signature>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_shipped>` | A paid, dispatched order |
| `<handover time>` | The handover timestamp in the carrier's report |
| `<signature>` | The signature image in the carrier's report |

**Steps:**

1. Wait for the delivery report to be processed.
2. Navigate to `<winner order url>` for `<order_shipped>`.
3. Open the delivery proof.

**Expected Results:**

* `<handover time>` and `<signature>` show, not only a delivered flag.

`<!-- trace:case id=g10.auction-winner-order.TC-v6v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->`
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

* customer(winner) is on `<winner order url>` for `<order_verifying>`.
* admin(holds payment-processing) confirms its proof at `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An HKD order, invoice `INV-202609-LK7P2Q-02`, total `<total>`, reading Payment Verifying |
| `<total>` | HKD3,290 (fixed derived value) |
| `<confirm time>` | 2026-09-30T16:30:00Z, October in Hong Kong |
| `<receipt id>` | `REC-202610-LK7P2Q-02-P1` |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* The receipt ID is `<receipt id>`.
* Original Invoice Total `<total>`; Previous Payments 0.
* Current Payment Received `<total>`; Remaining Balance Due 0.

`<!-- trace:case id=g10.auction-winner-order.TC-kq2 rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->`
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

* `<order_paid>` is paid, with a replaced invoice, a current invoice and a receipt.
* Its winner deleted the account a year after payment.
* The clock is 6 years after payment, inside the 7-year retention.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_paid>` | A paid order whose invoice was once reissued |

**Steps:**

1. Retrieve `<order_paid>`'s documents from the archive.

**Expected Results:**

* The replaced invoice, current invoice and receipt PDFs are all returned.

`<!-- trace:case id=g10.auction-winner-order.TC-xx4 rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->`
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

* `<order_paid>` was paid by card; its receipt ID is `<receipt id>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_paid>` | A card-paid order |
| `<receipt id>` | `REC-202609-LK7P2Q-01-P1` |

**Steps:**

1. Deliver the same payment confirmation for `<order_paid>` again.
2. Open the receipt on `<winner order url>` for `<order_paid>`.

**Expected Results:**

* The receipt ID is still `<receipt id>`.
* No second receipt ID or audit number exists for `<order_paid>`.

`<!-- trace:case id=g10.auction-winner-order.TC-uox rev=1 covers=g10.auction-winner-order.SC-h7d -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-l0r rev=2 covers=g10.auction-winner-order.SC-k4r -->`
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

* customer(winner) is on `<winner order url>` for the order in the row.

**Test data:**

| Order state | Fixture |
| --- | --- |
| Shipped | Paid, fulfilment fulfilled, delivery not confirmed, tracker link present |
| Delivered | Paid, fulfilment fulfilled, delivery confirmed, tracker link present |

**Steps:**

1. Read Order Progress.
2. Open `<tracking number>`.

**Expected Results:**

* Order Progress shows `<tracking number>` as an external link with an arrow icon.
* Order Progress shows no Track shipment button or carrier name.
* Step 2 opens `<carrier tracking URL>` in a new tab.
`<!-- trace:case id=g10.auction-winner-order.TC-nmg rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->`
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

* customer(winner) is on `<winner order url>` for `<order_preparing_shipment>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_preparing_shipment>` | A paid order with fulfilment `unfulfilled` |

**Steps:**

1. Read the status badge.
2. Read Order Progress.

**Expected Results:**

* Badge reads Preparing Shipment.
* Badge uses `default`.
* Shipping is the current (progress) progress step — not incomplete.
* Shipping subtext reads Preparing to ship.
* No step is labelled Preparing Shipment.

`<!-- trace:case id=g10.auction-winner-order.TC-7j8 rev=2 covers=g10.auction-winner-order.SC-lk0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_shipped>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_shipped>` | A paid, fulfilled order with a ship date, a tracking number and a recorded tracker link |

**Steps:**

1. Read the status badge and Order Progress.

**Expected Results:**

* Badge reads Shipped and uses `default`.
* Shipping is the current progress step with the day-only ship date.
* The tracking number is the external carrier link.
* Order Progress adds no separate Track shipment control and no separate carrier name.

`<!-- trace:case id=g10.auction-winner-order.TC-gg7 rev=1 covers=g10.auction-winner-order.SC-tgb -->`
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

* customer(winner) is on `<winner order url>` for `<untracked-link order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<untracked-link order>` | A paid order with fulfilment fulfilled and a tracking number, where the operator recorded no tracker link |
| `<tracking number>` | The tracking number recorded for `<untracked-link order>` |

**Steps:**

1. Read Order Progress.
2. Select `<tracking number>`.

**Expected Results:**

* Order Progress shows `<tracking number>` as plain text, not a link.
* Order Progress shows no carrier name and no Track shipment control.
* Step 2 opens nothing.

`<!-- trace:case id=g10.auction-winner-order.TC-45h rev=1 covers=g10.auction-winner-order.SC-lk0 -->`
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

* customer(winner) is on `<winner order url>` for `<order_shipped_no_link>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_shipped_no_link>` | A paid, fulfilled order with a ship date and a tracking number, and no recorded tracker link |

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

`<!-- trace:case id=g10.auction-winner-order.TC-x85 rev=1 covers=g10.auction-winner-order.SC-zhu,g10.auction-winner-order.SC-b16,g10.auction-winner-order.SC-2mz,g10.auction-winner-order.SC-ip8 -->`
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

* customer(winner) won a lot at `<winning bid>`, and its invoice was sent.
* The currency's premium minimum in Auction Payment settings is `<minimum>` at send.
* customer is on the order's Winner Order page.

**Test data:**

| Winning bid | Minimum | Buyer's Premium | Rule |
| --- | --- | --- | --- |
| HKD13,500 (range: 800000–3999999 minor units) | HKD 0 | HKD 2,700 | 20% of the winning bid |
| JPY 1003 | JPY 0 | JPY 201 | 20% is 200.6, rounded half up |
| JPY 1002 | JPY 0 | JPY 200 | 20% is 200.4, rounded half up |
| HKD500 (range: 1000–79999 minor units) | HKD200 (range: 1000–79999 minor units) | HKD 200 | The minimum, higher than 20% (HKD 100) |

**Steps:**

1. Read Order Summary.
2. Hover the Buyer's Premium info tooltip.

**Expected Results:**

* Step 1: the winning bid line reads `<winning bid>`.
* Step 1: Buyer's Premium reads the row's value.
* Step 1: the total equals the sum of the lines shown.
* Step 2: a brief tooltip explains Buyer's Premium.

---

## g10.auction-winner-order.US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the lot moves to Preparing Shipment without contacting Grade10.

`<!-- trace:case id=g10.auction-winner-order.TC-9gh rev=2 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
### g10.auction-winner-order.US4-TC1: An unpaid order shows invoice, Pay with Card, address and lot

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

**Steps:**

1. Navigate to `<grade10 auction order url>`.

**Expected Results:**

* Every invoice line and Pay with Card are shown in the order summary.
* The confirmed delivery address and the lot are shown.
* An expired invoice still reads Pending Payment and offers Contact Us instead.
  of Pay with Card.

`<!-- trace:case id=g10.auction-winner-order.TC-0cm rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-3ie rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Click Pay Now.
3. Wait until the payment session times out.
4. Return to `<grade10 auction order url>`.

**Expected Results:**

* The page says payment was not completed.
* The order still reads Pending Payment.
* Pay Now is available.

`<!-- trace:case id=g10.auction-winner-order.TC-uf2 rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Click Pay Now.

**Expected Results:**

* A new payment session opens.
* It charges the same invoice amount.

`<!-- trace:case id=g10.auction-winner-order.TC-w3e rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.

**Expected Results:**

* The page shows Confirming payment.
* The order does not read Preparing Shipment.

`<!-- trace:case id=g10.auction-winner-order.TC-s0i rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.

**Expected Results:**

* The order status reads Preparing Shipment.

---

`<!-- trace:case id=g10.auction-winner-order.TC-td7 rev=1 covers=g10.auction-winner-order.SC-1yn -->`
### g10.auction-winner-order.US4-TC7: A suspended winner reads the suspension under the lot

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

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Read the alerts under the lot.
3. Choose Pay what is owed.

**Expected Results:**

* An alert under the lot says bidding is suspended and payment does not lift it.
* Choosing Pay what is owed brings the order summary's pay control into view.

---

## g10.auction-winner-order.US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** Winner Order to read Payment Overdue with Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

`<!-- trace:case id=g10.auction-winner-order.TC-uup rev=1 covers=g10.auction-winner-order.SC-9vf -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Read the status and the inline alert.
2. Look for payment controls.

**Expected Results:**

* Step 1: the order reads Payment Overdue, with Contact Us.
* Step 2: no card Pay is offered and no payment deadline shows.

`<!-- trace:case id=g10.auction-winner-order.TC-rwa rev=1 covers=g10.auction-winner-order.SC-9vf -->`
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

* customer(winner) is on `<winner order url>` for `<order_cancelled>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_cancelled>` | An unpaid order an operator cancelled |

**Steps:**

1. Read the page.

**Expected Results:**

* No progress stepper shows.
* No invoice PDF control shows.

---

## g10.auction-winner-order.US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** Winner Order to read Setup Overdue with Contact Us and no Confirm,
**so that** I know self-service setup has stopped and how to reach Grade10.

`<!-- trace:case id=g10.auction-winner-order.TC-2in rev=1 covers=g10.auction-winner-order.SC-36a,g10.auction-winner-order.SC-k2b -->`
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

* customer(winner) is on `<winner order url>` for `<order_setup_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup_overdue>` | An order whose setup deadline, 172800s (48 hours) after the close, passed with setup incomplete |

**Steps:**

1. Read the status and the inline alert.
2. Look for setup controls.

**Expected Results:**

* Step 1: the order reads Setup Overdue, with Contact Us.
* Step 2: no Confirm and no address editing are offered.

`<!-- trace:case id=g10.auction-winner-order.TC-s5e rev=1 covers=g10.auction-winner-order.SC-ii6 -->`
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
* customer(winner) holds an auction order in USD in Awaiting Setup, whose lot closed 48 hours ago, with setup not confirmed.
* admin(operator with payment processing).

**Steps:**

1. As the winner, open the order.
2. As the operator, open the order and read what it offers.

**Expected Results:**

* The winner's order reads Setup Overdue.
* The operator can reopen or record its setup.

`<!-- trace:case id=g10.auction-winner-order.TC-zwj rev=1 covers=g10.auction-winner-order.SC-m55 -->`
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

**Steps:**

1. As the winner, open the order and read the address picker.

**Expected Results:**

* The picker does not offer the one-time address.

---

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

`<!-- trace:case id=g10.auction-winner-order.TC-n3p rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->`
### g10.auction-winner-order.US8-TC1: The invoice charges 20% of the winning bid as premium

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

* The HKD premium minimum is 0.
* An invoice is created for `<order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | An HKD order won at `<winning bid>` |
| `<winning bid>` | HKD3,150 (range: 80000–399999 minor units) |
| `<premium>` | HKD 630.00: 20% of `<winning bid>` |

**Steps:**

1. Read the API response for `<order_1>`'s invoice.

**Expected Results:**

* Buyer's premium is `<premium>`.
* The total includes `<premium>`.

`<!-- trace:case id=g10.auction-winner-order.TC-zt4 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->`
### g10.auction-winner-order.US8-TC2: A currency minimum above 20% becomes the premium

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

* The HKD premium minimum is `<minimum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | HKD200 (fixed configured value) |
| `<winning bid>` | HKD7 (fixed boundary or equality) |
| 20% of `<winning bid>` | HKD1 (fixed derived value) |

**Steps:**

1. Compute the premium for `<winning bid>`.

**Expected Results:**

* The premium is `<minimum>`, not 20% of `<winning bid>`.

`<!-- trace:case id=g10.auction-winner-order.TC-dd3 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->`
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

* The JPY premium minimum is 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | JPY 1003 |
| `<premium>` | JPY 201: 20% is 200.6, rounded half up |

**Steps:**

1. Compute the premium for `<winning bid>`.

**Expected Results:**

* The premium is `<premium>`.

`<!-- trace:case id=g10.auction-winner-order.TC-i06 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->`
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

* `<order_2>`'s invoice was sent while the HKD minimum was 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_2>` | An HKD order won at HKD 7.00, invoice sent with premium HKD 1.00 |
| `<new minimum>` | HKD 200.00 |

**Steps:**

1. Set the HKD premium minimum to `<new minimum>`.
2. Read the API response for `<order_2>`'s sent invoice.
3. Reissue `<order_2>`'s invoice.
4. Read the API response for the reissued invoice.

**Expected Results:**

* Step 2: the premium is still HKD 1.00.
* Step 4: the premium is `<new minimum>`.

---

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

`<!-- trace:case id=g10.auction-winner-order.TC-w18 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
### g10.auction-winner-order.US9-TC1: A bank-transfer invoice shows three ways to pay and the reference

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

**Blocked:** Finance - the account details for each way are still open; Product - does the invoice PDF carry them?

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Open the payment area.
2. Read the payment instructions.

**Expected Results:**

* SWIFT, FPS and Hong Kong local transfer details show.
* The bank reference shows, with a copy control and a request to quote it.
* No card Pay is offered.

`<!-- trace:case id=g10.auction-winner-order.TC-isg rev=2 covers=g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-8q1 -->`
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

**Test data:**

| Field | Value |
| --- | --- |
| `<order bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<time left>` | 2 days 6 hours (194400s) before the payment deadline |
| `<proof>` | One PDF under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit the proof.

**Expected Results:**

* A toast reads Proof submitted and We'll verify your payment shortly.
* The order reads Payment Verifying.
* The deadline stops with `<time left>` kept.
* A default inline Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed: under Order progress on small viewports and under the lot from `lg` up.
* Card Pay, Submit Payment Proof, View Bank Details and further uploads are hidden.
* `<proof>` and its file name are not shown.

`<!-- trace:case id=g10.auction-winner-order.TC-n2e rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Files |
| --- |
| 1 JPEG (lower limit) |
| 1 PNG |
| 1 HEIC |
| 3 files mixing PDF, JPEG and PNG (upper limit) |

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted, every file kept (HEIC stored as JPEG).
* The order reads Payment Verifying.

`<!-- trace:case id=g10.auction-winner-order.TC-nhm rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Files |
| --- |
| 0 files |
| 4 files, each allowed and under 5 MB |

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit.

**Expected Results:**

* The upload is refused and says why.
* The order still reads Pending Payment; the deadline runs.

`<!-- trace:case id=g10.auction-winner-order.TC-chi rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | One PDF of 5242880 bytes (5 MiB), at the limit |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted.
* The order reads Payment Verifying.

`<!-- trace:case id=g10.auction-winner-order.TC-pld rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Files |
| --- |
| A GIF image |
| A Word document |
| Four PDFs and one HEIC image |

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the allowed types.
* Nothing is stored; the order still reads Pending Payment.

`<!-- trace:case id=g10.auction-winner-order.TC-8kk rev=2 covers=g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-8uw -->`
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

**Test data:**

| Field | Value |
| --- | --- |
| `<order bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | Two PNG files |

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

`<!-- trace:case id=g10.auction-winner-order.TC-sni rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_verifying>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An order reading Payment Verifying |

**Steps:**

1. Read the progress stepper's Payment step and the deadline.

**Expected Results:**

* Payment is the current step, its subtext naming no date.
* No payment deadline shows as running.

`<!-- trace:case id=g10.auction-winner-order.TC-1vz rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* `<order_verifying>` reads Payment Verifying for customer A.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | customer A's order, proof uploaded, reading Payment Verifying |

**Steps:**

1. As customer A, send a second proof upload for `<order_verifying>` through the API.

**Expected Results:**

* The upload is refused.
* The first proof set is unchanged.

`<!-- trace:case id=g10.auction-winner-order.TC-e6w rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer A's order is in the state named in the row.

**Test data:**

| Order state | Fixture |
| --- | --- |
| Payment Verifying | Proof uploaded, order reads Payment Verifying |
| Pending Payment | Sent bank-transfer invoice, order reads Pending Payment |

**Steps:**

1. As customer A, send a card payment for the order through the API.

**Expected Results:**

* The payment is refused; no charge is made.
* The order still reads the state named in the row.
`<!-- trace:case id=g10.auction-winner-order.TC-3c9 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order>`.

**Test data:**

| Order state |
| --- |
| Preparing Invoice, bank transfer chosen |
| Card invoice sent, unpaid |
| Bank-transfer invoice paid |

**Steps:**

1. Open the payment area.

**Expected Results:**

* No proof upload is offered.

`<!-- trace:case id=g10.auction-winner-order.TC-i2f rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt_overdue>` | A bank-transfer order past its payment deadline, unpaid |

**Steps:**

1. Open the payment area.
2. Send a proof upload for `<order_bt_overdue>` through the API.

**Expected Results:**

* Step 1: no proof upload is offered; the overdue alert shows Contact Us.
* Step 2: the upload is refused; the order still reads Payment Overdue.

`<!-- trace:case id=g10.auction-winner-order.TC-gl2 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* `<order_bt>` belongs to customer A.
* customer B is signed in, in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. As customer B, send a proof upload for `<order_bt>` through the API.
2. As customer B, request `<order_bt>`'s proof.

**Expected Results:**

* Both requests are refused.
* `<order_bt>` still reads Pending Payment.

`<!-- trace:case id=g10.auction-winner-order.TC-q03 rev=2 covers=g10.auction-winner-order.SC-uxu -->`
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

**Test data:**

| Field | Value |
| --- | --- |
| `<order bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | Three allowed files under 5 MB |

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

`<!-- trace:case id=g10.auction-winner-order.TC-bxv rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* `<order_bt>`'s invoice is sent.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<listing code>` | LK7P2Q, the listing's code |
| `<reference>` | LK7P2Q01: `<listing code>` then the two-digit invoice count |

**Steps:**

1. Read `<order_bt>`'s bank reference.

**Expected Results:**

* It reads `<reference>`.
* 8 characters, capitals and digits only, no hyphen, space or symbol.
* It fits one 35-character SWIFT remittance line.

`<!-- trace:case id=g10.auction-winner-order.TC-8vs rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | One PDF of 5242881 bytes (5 MiB + 1 byte) with two small PNGs |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the 5 MB limit.
* None of the three files is stored; the order still reads Pending Payment.

`<!-- trace:case id=g10.auction-winner-order.TC-w24 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer A's `<order_bt>` reads Pending Payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<proof>` | An executable renamed to .pdf |

**Steps:**

1. As customer A, send `<proof>` as a proof upload through the API.

**Expected Results:**

* The whole upload is refused.
* Nothing is stored; the order still reads Pending Payment.

`<!-- trace:case id=g10.auction-winner-order.TC-mxq rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-6bf rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* `<order_verifying>` reached Payment Verifying before its payment deadline.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An order reading Payment Verifying, no operator action yet |

**Steps:**

1. Move the clock past the original payment deadline.
2. Open `<winner order url>` for `<order_verifying>` as its winner.

**Expected Results:**

* The order still reads Payment Verifying, not Payment Overdue.

`<!-- trace:case id=g10.auction-winner-order.TC-ypl rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner of `<order_bt>` and `<order_card>`) is signed in.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| `<reference>` | LK7P2Q01, `<order_bt>`'s bank reference |
| `<order_card>` | An order with a sent card invoice, unpaid |

**Steps:**

1. Open `<winner order url>` for `<order_bt>`.
2. Click the copy control beside the bank reference, then paste.
3. Open `<winner order url>` for `<order_card>`.

**Expected Results:**

* Step 2 pastes exactly `<reference>`, no space.
* Step 3 shows no bank reference and no copy control.

`<!-- trace:case id=g10.auction-winner-order.TC-xl5 rev=2 covers=g10.auction-winner-order.SC-bb1 -->`
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

* customer(winner) is signed in on `<winner order url>` for `<pending bank-transfer order>`.
* Submit Payment Proof is open.

**Test data:**

| `<busy work>` | `<leave route>` |
| --- | --- |
| Proof submission in progress | Cancel |
| HEIC conversion in progress | Escape |
| Proof submission in progress | Overlay dismiss |

**Steps:**

1. Start `<busy work>`.
2. Use `<leave route>`.

**Expected Results:**

* Submit Payment Proof stays open.
* The form remains locked until `<busy work>` finishes.

`<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
### g10.auction-winner-order.US9-TC22: Bank transfer is recorded with the address where Grade10 holds bank details

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

* Grade10 holds HKD bank details, as outside production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Confirm a delivery address with bank transfer.
2. Reload the order.

**Expected Results:**

* Card and bank transfer were both offered, neither selected.
* The order records bank transfer and reads Preparing Invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-bmd rev=1 covers=g10.auction-winner-order.SC-8dl -->`
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

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Read each method.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* Bank transfer reads `Bank fee set on your invoice`, naming no amount.
* Neither method is selected.

`<!-- trace:case id=g10.auction-winner-order.TC-6nc rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is signed in on `<the winner's auction order url>` for `<pending_bank_transfer_order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. Open `<the winner's auction order url>` for `<pending_bank_transfer_order>`.
2. Read Order summary.
3. Choose View Bank Details.
4. Close View Bank Details.
5. Choose Submit Payment Proof.

**Expected Results:**

* Order summary shows Submit Payment Proof with View Bank Details under it.
* View Bank Details opens the View Bank Details dialog.
* Submit Payment Proof opens the Submit Payment Proof dialog.

`<!-- trace:case id=g10.auction-winner-order.TC-vvf rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is signed in on `<the winner's auction order url>` for `<pending_bank_transfer_order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. Open View Bank Details from Order summary.

**Expected Results:**

* The FPS tab is selected.
* FPS ID, account name and an FPS QR are shown.
* Amount due is shown without Copy.
* The bank reference is shown as a detail row without Copy at the bottom of the FPS tab.

`<!-- trace:case id=g10.auction-winner-order.TC-9v4 rev=2 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
### g10.auction-winner-order.US9-TC24: HK Local and SWIFT tabs show expanded fields and stay readable

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

* customer(winner) has View Bank Details open for `<pending_bank_transfer_order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<narrow_viewport>` | A viewport below `sm` |
| `<wide_viewport>` | A viewport at `sm` or wider |

**Steps:**

1. Choose HK Local.
2. Choose International (SWIFT).
3. Set `<narrow_viewport>` and scroll the tab track to International.
4. Set `<wide_viewport>`.

**Expected Results:**

* HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference.
* SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference, then the OUR charges note after the reference.
* At `<narrow_viewport>`, each tab label stays readable and the tab track scrolls horizontally.
* At `<wide_viewport>`, the three tabs share the full-width track.

`<!-- trace:case id=g10.auction-winner-order.TC-xmr rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->`
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

* customer(winner) is signed in on `<the winner's auction order url>` for `<pending_bank_transfer_order>`.

**Steps:**

1. Choose Submit Payment Proof.

**Expected Results:**

* The dialog title is Submit Payment Proof.
* Amount due and transfer reference are not shown.
* No FPS, HK Local or SWIFT tab is shown.

---

## g10.auction-winner-order.US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

`<!-- trace:case id=g10.auction-winner-order.TC-39a rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner) is on `<winner order url>` for `<order_returned>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_returned>` | A bank-transfer order whose proof an operator returned with `<external reason>` and `<internal reason>` |
| `<external reason>` | Amount received does not match |
| `<internal reason>` | A note for operators only |

**Steps:**

1. Read the order.
2. Download the invoice PDF and read it.

**Expected Results:**

* `<external reason>` shows.
* `<internal reason>` appears on neither.

`<!-- trace:case id=g10.auction-winner-order.TC-bij rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner) is on `<winner order url>` for `<order_returned>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_returned>` | A bank-transfer order whose proof was returned, inside its deadline |
| `<proof>` | One new PDF under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose `<proof>`, submit and accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying again.
* The deadline stops with the time then left.

`<!-- trace:case id=g10.auction-winner-order.TC-bgm rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* `<order_verifying>` reads Payment Verifying with the row's `<time left>` kept.

**Test data:**

| Time left |
| --- |
| 60s (1 minute) |
| 604740s (6 days 23 hours 59 minutes) |

| Field | Value |
| --- | --- |
| `<order_verifying>` | A bank-transfer order reading Payment Verifying |

**Steps:**

1. Return the proof at `<return time>`.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is `<return time>` plus the row's time left.

`<!-- trace:case id=g10.auction-winner-order.TC-zew rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner) is on `<winner order url>` for `<order_returned_late>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_returned_late>` | A bank-transfer order returned with 60s left, and that minute has passed |

**Steps:**

1. Read the status and the payment area.

**Expected Results:**

* The order reads Payment Overdue.
* Proof upload is hidden; the overdue alert shows Contact Us.

`<!-- trace:case id=g10.auction-winner-order.TC-t06 rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* `<order_verifying>` was returned once, uploaded again with `<time left 2>` kept, and reads Payment Verifying.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | A bank-transfer order on its second check |
| `<time left 2>` | The time left at the second upload |

**Steps:**

1. Return the proof again at `<return time>`.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is `<return time>` plus `<time left 2>`.

`<!-- trace:case id=g10.auction-winner-order.TC-1ys rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner) chose bank transfer and uploaded proof for `<order_verifying>`.
* An operator returned the proof with `<return reason>`.
* customer is on `<order_verifying>`'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An order whose invoice was sent, proof uploaded `<time left>` before its payment deadline |
| `<time left>` | 2 days (172800s), a time inside the 7-day payment window |
| `<return reason>` | The reason text the operator entered for the winner |
| `<return time>` | 18 hours after the upload |

**Steps:**

1. Read the order status and the alert.
2. Read the payment deadline.

**Expected Results:**

* Step 1: the order no longer reads Payment Verifying.
* Step 1: `<return reason>` is shown to the winner.
* Step 2: Pay by reads `<return time>` plus `<time left>`.
* Step 2: Submit Payment Proof and View Bank Details are offered again.

`<!-- trace:case id=g10.auction-winner-order.TC-tlh rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner)'s proof for `<order_verifying>` was returned with `<first reason>`.
* The winner uploaded proof again, and it was returned with `<second reason>`.
* customer is on `<order_verifying>`'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An order paid by bank transfer, inside its payment window |
| `<first reason>` | Amount does not match |
| `<second reason>` | Reference missing from the transfer |

**Steps:**

1. Read the page.

**Expected Results:**

* `<second reason>` is shown.
* `<first reason>` is not shown.
* No proof file or file name is shown.

`<!-- trace:case id=g10.auction-winner-order.TC-e3m rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->`
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

* customer(winner) uploaded proof for `<order_verifying>`; no letter was sent on upload.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_verifying>` | An order paid by bank transfer, `<time left>` before its payment deadline at upload |
| `<time left>` | 2 days (172800s) |
| `<return reason>` | The reason text the operator enters for the winner |

**Steps:**

1. Have an operator return the proof with `<return reason>`.
2. Read the mail sent to the winner's registered email.

**Expected Results:**

* One Proof not accepted letter carrying `<return reason>`.
* Its Pay by equals the return time plus `<time left>`.
* No payment reminder was sent while the proof was under check.

---

## g10.auction-winner-order.US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

`<!-- trace:case id=g10.auction-winner-order.TC-qlk rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->`
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

* customer(winner) is on Complete Order Setup for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Untick Same as delivery address.
2. Open Add Address for billing.

**Expected Results:**

* The Personal / Company control shows above the fields, Personal selected.
* Phone shows a country selector, starting empty with a globe only.
* Company Name is hidden.

`<!-- trace:case id=g10.auction-winner-order.TC-9ch rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->`
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

* customer(winner) is on billing Add Address for `<order_setup>`, with the form mode and missing field in the row.

**Test data:**

| Form mode | Missing field | Phone country | Phone digits | Company Name |
| --- | --- | --- | --- | --- |
| Personal | Phone | Canada | (empty) | Not shown |
| Company | Company Name | Canada | 4165550100 | (empty) |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside the missing field.
* The order's billing address is unchanged.
`<!-- trace:case id=g10.auction-winner-order.TC-dno rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-7ax rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->`
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

* customer(winner) is on Complete Order Setup for `<order_setup>`, delivery confirmed to `<address_sf>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_sf>` | A personal address for Alex Chen, 100 Market St, San Francisco |
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
3. Fill the billing fields from **Test data**.
4. Confirm billing.

**Expected Results:**

* Delivery still reads `<address_sf>`.
* Billing reads Northwind Billing Ltd, Toronto, with the phone.

`<!-- trace:case id=g10.auction-winner-order.TC-v3x rev=1 covers=g10.auction-winner-order.SC-rlh,g10.auction-winner-order.SC-1i2 -->`
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

**Steps:**

1. Open the Country/Region picker and read the list.
2. Open delivery Add Address's picker and read its list.
3. Back on billing, type `Jap`.

**Expected Results:**

* The billing list holds every country and region in A-Z order, the same list as delivery.
* Typing leaves only the names that match `Jap`, Japan among them.

`<!-- trace:case id=g10.auction-winner-order.TC-bwi rev=1 covers=g10.auction-winner-order.SC-z4a -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-mv4 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The Personal / Company control shows, Personal selected, Company Name hidden.
* Phone shows a country selector and number input, no country chosen.

`<!-- trace:case id=g10.auction-winner-order.TC-yzv rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Fill the fields from **Test data**, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is the entered address, with phone.
* Step 5: the book still holds five addresses.

`<!-- trace:case id=g10.auction-winner-order.TC-jfw rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on delivery Add new address for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
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
2. Fill the fields from **Test data**, Save this address for future orders unticked.
3. Click confirm.

**Expected Results:**

* The confirm is refused, with messages beside Company Name and Phone.
* The order's delivery address is unchanged.
* The book still holds five addresses.

`<!-- trace:case id=g10.auction-winner-order.TC-8e5 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The address form opens; no message blocks it.

`<!-- trace:case id=g10.auction-winner-order.TC-0hi rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Enter `<address_new>`, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is `<address_new>`.
* Step 5: the book still holds five addresses.

`<!-- trace:case id=g10.auction-winner-order.TC-nbn rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Click Use this address.

**Expected Results:**

* `<address_new>` shows as a draft entry at the top of the picker.
* The five saved addresses list below it.

`<!-- trace:case id=g10.auction-winner-order.TC-j6u rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, five saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Click Save this address for future orders.
4. Hover the info icon beside it.

**Expected Results:**

* Step 3: the checkbox is disabled and stays unticked.
* Step 4: a short reason says the book is full.

`<!-- trace:case id=g10.auction-winner-order.TC-go0 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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

* customer(winner, four saved shipping addresses) is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter `<address_new>`.
3. Tick Save this address for future orders.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 3: the checkbox is enabled and ticks.
* Step 5: the book holds five, including `<address_new>`.

`<!-- trace:case id=g10.auction-winner-order.TC-tz6 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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
| `<address_home>` | A saved address named Home, used by no unpaid order |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Remove `<address_home>` from the address book.
2. Navigate to `<winner order url>` for `<order_setup>`.
3. Click Add new address in the delivery picker and enter `<address_new>`.
4. Click Save this address for future orders.

**Expected Results:**

* Step 1: the book holds four addresses.
* Step 4: the checkbox is enabled and ticks.

`<!-- trace:case id=g10.auction-winner-order.TC-s5g rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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
| `<address_home>` | A saved address named Home |
| `<new street>` | A different address line 1 |

**Steps:**

1. Open `<address_home>` for editing.
2. Change address line 1 to `<new street>`.
3. Save.

**Expected Results:**

* The book still holds five addresses.
* `<address_home>` shows once, with `<new street>`.

`<!-- trace:case id=g10.auction-winner-order.TC-yru rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->`
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
* customer is on `<winner order url>` for `<order_setup>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup>` | An order inside its setup window, setup incomplete |
| `<address_new>` | A complete personal shipping address not in the book |

**Steps:**

1. Open the account address book in a new tab.
2. On the order, click Add new address in the delivery picker and enter `<address_new>`.
3. Click Save this address for future orders.

**Expected Results:**

* Step 1: all six addresses are listed.
* Step 3: the checkbox is disabled and stays unticked.

`<!-- trace:case id=g10.auction-winner-order.TC-kp5 rev=1 covers=g10.auction-winner-order.SC-zyl -->`
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
**I want** Winner Order to say it was cancelled and when, with the lot I won and a way to contact Grade10,
**so that** I know the order is closed and who to ask about it.

`<!-- trace:case id=g10.auction-winner-order.TC-3x8 rev=2 covers=g10.auction-winner-order.SC-1fb -->`
### g10.auction-winner-order.US13-TC1: Cancelled keeps the lot and winning bid visible

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

* customer(winner of `<cancelled order>`) is on Winner Order.

**Steps:**

1. Read the status, lot, winning bid and actions.

**Expected Results:**

* The page says Cancelled on the cancellation day, as a day-only date in the winner's local zone.
* The lot and winning bid remain visible.
* Contact Us is the only action.
* No cancellation reason is shown.

---

## g10.auction-winner-order.US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

`<!-- trace:case id=g10.auction-winner-order.TC-xfb rev=1 covers=g10.auction-winner-order.SC-zfp,g10.auction-winner-order.SC-yhv -->`
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

* customer(winner) is on `<winner order url>` for `<order_refunded>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_refunded>` | A paid order refunded to the card, with an operator note |
| `<refund amount>` | The amount returned |

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
**I want** only the difference returned below the invoice total, while the lot, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

`<!-- trace:case id=g10.auction-winner-order.TC-pca rev=1 covers=g10.auction-winner-order.SC-7m4 -->`
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

* customer(winner) is on `<winner order url>` for `<order_overpaid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_overpaid>` | A paid order where the difference over the total was returned |
| `<difference>` | The amount returned |

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

`<!-- trace:case id=g10.auction-winner-order.TC-iro rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us on the inline alert.

**Expected Results:**

* A dialog opens with To, Subject and Message.
* No mail app opens, and no toast naming only the address replaces the dialog.

`<!-- trace:case id=g10.auction-winner-order.TC-le5 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Read To.

**Expected Results:**

* To reads `support@grade10.com`.

`<!-- trace:case id=g10.auction-winner-order.TC-ta0 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
### g10.auction-winner-order.US16-TC3: A setup-overdue Subject names the lot and no invoice

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

* customer(winner) is on `<winner order url>` for `<order_setup_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_setup_overdue>` | An order past its setup deadline, no invoice issued |
| `<lot_title>` | The lot title on that order |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction lot `<lot_title>`: setup overdue`, with no invoice id.

`<!-- trace:case id=g10.auction-winner-order.TC-gxu rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<invoice_id>` | That order's invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order `<invoice_id>`: payment overdue`.

`<!-- trace:case id=g10.auction-winner-order.TC-rt4 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_partially_paid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_partially_paid>` | An order reading Partially Paid, with one receipt |
| `<invoice_id>` | That order's invoice id |
| `<receipt_ids>` | That invoice's receipt ids |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction order `<invoice_id>`: partial payment`.
* Message lists `<receipt_ids>`.
* Message shows no remaining balance.

`<!-- trace:case id=g10.auction-winner-order.TC-28a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_partially_paid_many>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_partially_paid_many>` | An order reading Partially Paid, with three receipts |
| `<receipt_ids>` | Every receipt id on that invoice, oldest first |

**Steps:**

1. Click Contact Us.
2. Read Message.

**Expected Results:**

* Message lists every id in `<receipt_ids>`.
* Message shows no remaining balance.

`<!-- trace:case id=g10.auction-winner-order.TC-59a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Search the page for `support@grade10.com`.
2. Click Contact Us.

**Expected Results:**

* Step 1: the address is not on the page.
* Step 2: To shows `support@grade10.com`.

`<!-- trace:case id=g10.auction-winner-order.TC-a9f rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Read the dialog footer.

**Expected Results:**

* Copy Message is the primary action, first.
* Open Mail App is the secondary action, second.

`<!-- trace:case id=g10.auction-winner-order.TC-mtb rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<winner_question>` | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Look at the copy controls beside To, Subject and Message.
3. Type `<winner_question>` into Message, below the prefilled facts.

**Expected Results:**

* Step 1: Message is a multi-line field, order facts prefilled.
* Step 2: To and Subject each have a copy control; Message has none.
* Step 3: Message keeps `<winner_question>`.

`<!-- trace:case id=g10.auction-winner-order.TC-vdc rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<invoice_id>` | That order's invoice id |
| `<winner_question>` | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Type `<winner_question>` into Message.
3. Click Copy Message.
4. Paste into a plain-text field.

**Expected Results:**

* The paste holds To `support@grade10.com`.
* It holds Subject `Auction order `<invoice_id>`: payment overdue`.
* It holds Message with `<winner_question>`.

`<!-- trace:case id=g10.auction-winner-order.TC-mq9 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |
| `<invoice_id>` | That order's invoice id |
| `<winner_question>` | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Type `<winner_question>` into Message.
3. Read the Open Mail App link target.

**Expected Results:**

* It is a `mailto:` to `support@grade10.com`.
* Its subject is `Auction order `<invoice_id>`: payment overdue`.
* Its body includes `<winner_question>`.

`<!-- trace:case id=g10.auction-winner-order.TC-ovr rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue>`.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue>` | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Click the copy control beside To, then paste.
3. Click the copy control beside Subject, then paste.

**Expected Results:**

* Step 2 pastes only `support@grade10.com`.
* Step 3 pastes only the Subject.
* Copy Message stays in the footer.

`<!-- trace:case id=g10.auction-winner-order.TC-9co rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->`
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

* customer(winner) is on `<winner order url>` for `<order_payment_overdue_reissued>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_payment_overdue_reissued>` | An order payment-overdue after its invoice was reissued |
| `<current_invoice_id>` | The current invoice id |
| `<replaced_invoice_id>` | The replaced invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order `<current_invoice_id>`: payment overdue`.
* It does not name `<replaced_invoice_id>`.

`<!-- trace:case id=g10.auction-winner-order.TC-v40 rev=1 covers=g10.auction-winner-order.SC-e1w -->`
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

* customer(winner) is on `<winner order url>` for `<order_cancelled>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_cancelled>` | An order an operator cancelled, with a category and note |
| `<lot_title>` | That order's lot title |
| `<invoice_id>` | That order's invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction lot `<lot_title>`: order cancelled`.
* Message names `<lot_title>`, `<invoice_id>` and status Cancelled.
* Neither names the operator's category or note.

`<!-- trace:case id=g10.auction-winner-order.TC-nat rev=1 covers=g10.auction-winner-order.SC-i2y -->`
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

**Steps:**

1. Open the order and choose Contact Us.
2. Read the Subject and the Message.
3. Read the order status.

**Expected Results:**

* The Subject and Message are those of the `setup overdue` reason.
* The order status still reads Awaiting Setup.

`<!-- trace:case id=g10.auction-winner-order.TC-yp9 rev=1 covers=g10.auction-winner-order.SC-81q -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-3s7 rev=1 covers=g10.auction-winner-order.SC-u8s -->`
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

* customer(winner) is on `<winner order url>` for `<order_bank_refunded>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_bank_refunded>` | A paid order refunded by bank transfer, no operator note |
| `<bank reference>` | The provider reference the operator recorded |

**Steps:**

1. Open the refund details from the inline alert.

**Expected Results:**

* Amount, Transfer to, Reference, then Reason, in that order; no Note.
* Transfer to shows a bank icon, masked destination, bank name beneath.
* Reference reads `<bank reference>`.
* No proof and no full account number show.

---

## g10.auction-winner-order.US19: Winner confirms where a won lot ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

`<!-- trace:case id=g10.auction-winner-order.TC-clp rev=2 covers=g10.auction-winner-order.SC-cu4 -->`
### g10.auction-winner-order.US19-TC1: The page shows the lot once and none of the old sections

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

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Read the page from the header to the sidebar.

**Expected Results:**

* The header shows Winner Order and the status badge.
* Order Progress shows Address current, then Invoice, Payment, Shipping and.
  Completed.
* The lot's title shows in the lot card only.
* No Order Information, Collection Method, Order Status list or Lots section.
  shows.

`<!-- trace:case id=g10.auction-winner-order.TC-gf4 rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-grt rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.

**Expected Results:**

* The confirmed address is shown.
* No invoice and no Pay Now are shown.

`<!-- trace:case id=g10.auction-winner-order.TC-6xf rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->`
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

**Test data:**

| Field | Value |
| --- | --- |
| First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code | Filled |
| Phone | `<a phone number of unusual length and format>` |
| Company Name, Address Line 2, Apt./Suite/Building | Empty |

**Steps:**

1. Navigate to `<grade10 auction order url>`.
2. Fill the address form with **Test data**.
3. Click Confirm.

**Expected Results:**

* The address is accepted.
* The order status reads Preparing Invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-lwp rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->`
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

**Steps:**

1. Navigate to `<grade10 auction order url>`.
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

`<!-- trace:case id=g10.auction-winner-order.TC-sv8 rev=1 covers=g10.auction-winner-order.SC-34b -->`
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

* customer(winner of `<partially-paid order>`) is on Winner Order.

**Steps:**

1. Read the payment step, settlement alert and receipt area.

**Expected Results:**

* The page reads Partially Paid.
* Pay, Submit Payment Proof, View Bank Details and a payment deadline are absent.
* The page offers Contact Us, shows the full invoice amount and no remaining balance.
* Each recorded payment has a separate receipt link, oldest first.

---

## g10.auction-winner-order.US21: Winner quotes their order

**As a** winner of an auction lot,
**I want** my order to have a clear, stable payment reference I can quote,
**so that** I can reference it when contacting support or making inquiries about my purchase, without a separate order ID.

`<!-- trace:case id=g10.auction-winner-order.TC-ppj rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->`
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

**Steps:**

1. Open each invoice and its order.
2. Read the invoice ID and payment reference.

**Expected Results:**

* Each order and invoice shows its invoice ID and unchanged payment reference.
* The card invoice and bank-transfer invoice use the same reference rules.
* No receipt breakdown or receipt amount is asserted here.

`<!-- trace:case id=g10.auction-winner-order.TC-93n rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->`
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

* The latest invoice for payment reference `LK423` is `IN-LK42399`.

**Steps:**

1. Reissue the invoice.
2. Read the new invoice ID.

**Expected Results:**

* The new invoice ID is `IN-LK423100`.
* The payment reference remains `LK423`.

`<!-- trace:case id=g10.auction-winner-order.TC-ehf rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->`
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

`<!-- trace:case id=g10.auction-winner-order.TC-wa2 rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->`
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

* A listing and its order already store payment reference `LK423`.

**Steps:**

1. Change the allocator implementation.
2. Read the listing and order references.

**Expected Results:**

* Both continue to use `LK423`.
* No new listing receives a retained code.

`<!-- trace:case id=g10.auction-winner-order.TC-azi rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->`
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

* A listing has payment reference `LK423`.

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

`<!-- trace:case id=g10.auction-winner-order.TC-urm rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->`
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

* An order has invoice `IN-LK42301`, then reissued invoice `IN-LK42302`, with payment reference `LK423`.

**Steps:**

1. Look up the order by each invoice ID and by `LK423`.
2. Open both invoice PDFs.

**Expected Results:**

* Each lookup finds the same order.
* The replacement invoice names the replaced invoice and keeps `LK423`.

`<!-- trace:case id=g10.auction-winner-order.TC-mr5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->`
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

* An invoice is `IN-LK42302` for payment reference `LK423`.
* A full or partial payment for that invoice has finalized.

**Steps:**

1. Open the receipt.
2. Read its identifier.

**Expected Results:**

* The first receipt ID is `RC-LK42302P1`.
* A later finalized payment for that invoice receives `P2`, then `P10` without padding.
* A receipt for another invoice starts at `P1` for that invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-gfa rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->`
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

* A historical receipt ID is `REC-202609-LK7P2Q-01-P1`.

**Steps:**

1. Open the historical receipt after the new identifier ships.
2. Record a refund, reversal or void.

**Expected Results:**

* The historical receipt ID remains `REC-202609-LK7P2Q-01-P1`.
* No receipt ID is created for the refund, reversal or void.

`<!-- trace:case id=g10.auction-winner-order.TC-gs5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->`
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
**so that** I can still settle the lot I won once I have told Grade10 where to ship it.

`<!-- trace:case id=g10.auction-winner-order.TC-9uu rev=1 covers=g10.auction-winner-order.SC-r6m -->`
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

* `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<lot_1>`) is on `<the winner's auction order url>` at `<one minute before close>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| Entrance closes | 2026-09-05T12:00:00Z |
| `<one minute before close>` | 2026-09-05T11:59:00Z |

**Steps:**

1. Choose the account's saved home address.
2. Confirm the delivery address.

**Expected Results:**

* The confirmation is accepted.
* The order reads Preparing Invoice.
* No invoice is issued by the confirmation itself.

`<!-- trace:case id=g10.auction-winner-order.TC-io3 rev=1 covers=g10.auction-winner-order.SC-kz8 -->`
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

* `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<lot_1>`) is on `<the winner's auction order url>` at `<the address deadline>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| `<the address deadline>` | 2026-09-05T12:00:00Z |

**Steps:**

1. Attempt to confirm the account's saved home address.
2. Read the order's delivery address.

**Expected Results:**

* The confirmation is refused.
* The order holds no confirmed delivery address.
* The order still reads Setup Overdue.

`<!-- trace:case id=g10.auction-winner-order.TC-w89 rev=1 covers=g10.auction-winner-order.SC-6ax -->`
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

* `<lot_1>`'s order has no confirmed delivery address, derives as Setup Overdue,.
  has invoice status `not_issued`, and its address deadline passed on 2026-09-05T12:00:00Z.
* An operator reopened the address form at `<the reopen>`.
* customer(winner of `<lot_1>`) is on `<the winner's auction order url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| New address deadline | 2026-09-09T09:00:00Z |

**Steps:**

1. Read the delivery address area.
2. Confirm the account's saved home address.

**Expected Results:**

* The address deadline reads 2026-09-09T09:00:00Z, measured from the reopen.
* The confirmation is accepted.
* The order reads Preparing Invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-bth rev=1 covers=g10.auction-winner-order.SC-6ax -->`
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

* `<lot_1>`'s order has no confirmed delivery address and its address deadline passed two hours ago.
* customer(winner of `<lot_1>`) is signed in.

**Steps:**

1. Read the delivery address area for a reopen or extend control.
2. Submit a reopen of the address form as the winner.

**Expected Results:**

* No reopen or extend control is offered to the winner.
* The reopen is refused.
* The address deadline is unchanged.

`<!-- trace:case id=g10.auction-winner-order.TC-w21 rev=1 covers=g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-gqs -->`
### g10.auction-winner-order.US23-TC6: Three won lots open three orders with their own address deadlines

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

* customer(winner of `<lot_1>`, `<lot_3>` and `<lot_4>`) won three lots that closed at different datetimes.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| `<lot_3>` recorded close | 2026-09-03T18:30:00Z |
| `<lot_4>` recorded close | 2026-09-04T09:15:00Z |

**Steps:**

1. Open each of the three auction orders.
2. Read each order's address deadline.
3. Confirm a different delivery address on each order.

**Expected Results:**

* Three separate orders exist, one per lot.
* The three address deadline passes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z.
* Each order keeps the address confirmed on it and awaits its own invoice.

`<!-- trace:case id=g10.auction-winner-order.TC-aui rev=1 covers=g10.auction-winner-order.SC-js5,g10.auction-winner-order.SC-h7y -->`
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

* `<sent-invoice order>` carries a confirmed delivery address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.
* customer(winner of `<sent-invoice order>`) is on `<the winner's auction order url>`.

**Steps:**

1. Attempt to change the delivery address to the account's work address.
2. Read the delivery address area.

**Expected Results:**

* The change is refused even though the 48 hours have not elapsed.
* The order still shows the address the invoice was quoted for.
* The area points the winner at Grade10 for a change.

`<!-- trace:case id=g10.auction-winner-order.TC-us7 rev=1 covers=g10.auction-winner-order.SC-h7y -->`
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

* `<expired-invoice order>`'s invoice is `expired` and its address was confirmed and is locked.
* customer(winner of `<expired-invoice order>`) is on `<the winner's auction order url>`.

**Steps:**

1. Read the delivery address area.
2. Attempt to change the delivery address to the account's work address.

**Expected Results:**

* No address form is offered.
* The change is refused.
* The overdue alert carries Contact Us and no card Pay control is shown.

`<!-- trace:case id=g10.auction-winner-order.TC-euy rev=1 covers=g10.auction-winner-order.SC-byg -->`
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

* `<missed-deadline order>`'s address deadline has passed with no address confirmed.
* customer(winner of `<missed-deadline order>`) is signed in.

**Steps:**

1. Open the account address book.
2. Edit the saved home address and save a new work address.
3. Return to `<the winner's auction order url>`.

**Expected Results:**

* Both address-book writes are accepted.
* Neither reaches the auction order.
* The order still has no confirmed delivery address and still offers no address form.

`<!-- trace:case id=g10.auction-winner-order.TC-yee rev=1 covers=g10.auction-winner-order.SC-90v -->`
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

* `<missed-deadline order>`'s address deadline has passed.
* An operator holds payment-processing.

**Steps:**

1. The operator reopens the address form with a reason.
2. Read the winner's post-close letters for that lot.

**Expected Results:**

* The order offers the address form again.
* No letter about the reopen reaches the winner.

`<!-- trace:case id=g10.auction-winner-order.TC-ron rev=1 covers=g10.auction-winner-order.SC-oos -->`
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

* `<extended lot>` was scheduled to close at 2026-09-12T08:45:00Z, took a late bid, and closed at 2026-09-12T09:00:00Z after extended bidding.
* customer(winner of `<extended lot>`) is on `<the winner's auction order url>`.

**Steps:**

1. Read the address deadline under Confirm delivery address.
2. Confirm the account's saved home address at 2026-09-14T08:50:00Z, ten minutes before that deadline and after 48 hours from the scheduled close.

**Expected Results:**

* The deadline reads 2026-09-14T09:00:00Z, counted from the actual close.
* The confirmation is accepted and the order reads Preparing Invoice.

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
