## Context

The proposal holds the motive. This file holds how the work lands.

- **Lot currency today** - A listing carries one of USD, HKD or JPY. The bid schedule, the ceiling, the invoice currency, the premium minimum, the card rule and the bank details all key off it.
- **Money** - Every amount is an integer count of minor units plus an ISO 4217 code, per `shared/money-amounts`. That contract does not change.
- **Blocks take props** - `packages/ui` blocks receive amounts and currency on the view and pick no policy. `AuctionWinnerOrder` in `packages/ui/src/blocks/auction-order` and the PDFs in `packages/ui/src/blocks/auction-invoice-and-receipt-pdf` already render what they are given.
- **Already landed** - `DEFAULT_LISTING_CURRENCY` is `USD` in `packages/ui/src/lib/format-money.ts`. Bid-side fixtures in `packages/ui`, `apps/preview` and `apps/emails` read `US$`. Invoice fixtures stay HK$ to show an HKD order.
- **Two repositories** - This store holds blocks, catalogs, preview pages and letter previews. The application repository `grade10` holds the site and admin wiring, the services and the database.

## Goals / Non-Goals

**Goals:**

- One USD fact per money line, one pure conversion to HKD, and one place that owns both.
- A sent invoice that never re-prices, whatever happens to the conversion figure later.
- A currency and a rail that the order records and every later surface reads; internal orders receive HKD and FPS at close, while ordinary winners and operators choose from the offered set.
- A one-time, reversible-by-restore overwrite of lot currency.

**Non-Goals:**

- A preferred-currency reference price, a live or per-order rate, a third currency.
- Moving conversion into `packages/ui`, or changing `shared/money-amounts`.
- Changing a sent invoice, the card rule's shape or the bank transfer fee model.

## Decisions

The specs govern the rules. These rows record how they are built.

### Where the conversion and the rate live

- **Spec governs** - `grade10-site/auction/winner-order`, "An HKD order converts each USD line at a fixed rate and rounds it up".
- **One pure function, one constant** - The application's auction pricing module in `grade10` owns the rate as the integer pair 785 over 100 and one function that turns USD minor units into HKD minor units: multiply by 785, divide by 10000 rounding up to a whole dollar, multiply by 100. It uses integer arithmetic only, never a float.
- **Server authoritative** - The service computes every line, the sum and the card fee. The view carries the USD facts and the HKD lines. Blocks, letters and PDFs render them and never convert.
- **This store holds no copy** - Fixtures in `packages/ui`, `apps/preview` and `apps/emails` hold literal HKD numbers. A fixture test in `grade10` asserts each HKD fixture equals the function's output for its USD fact, so a fixture cannot drift.
- **Rejected: a shared helper in `packages/ui`** - It would put policy in a presentation package and give two sources of the figure.
- **Rejected: convert the USD total once** - The HKD lines on the invoice would not add up to its total. Decided in `decisions.md` Q9.

### What a stored invoice carries

- **Spec governs** - "Invoice fields" and "An HKD invoice, receipt and letter carry HKD only".
- **Persist, do not recompute** - At send the service writes one row per line holding the USD fact and the settlement amount. For a USD invoice the two are equal. A read never converts, so a later change to the figure cannot move a sent invoice.
- **No rate on the invoice** - The figure is one constant and the lines protect the invoice. A per-invoice rate column would add a field that could leak onto a page. A reviewed change moves the constant and applies only to invoices sent or reissued after it.
- **Card fee** - Computed in the settlement currency from that currency's rule, on the sum of the settlement lines, and stored as its own line with no USD fact. The Order Summary reads it from that line in HKD, after the separator below the two totals, on top of the converted HKD total; the USD total leaves it out and no USD fee shows. The winner pays the converted HKD total plus the fee, the invoice's Order Total (`decisions.md` Q17).
- **Reissue** - Reprices from the USD facts in the currency the operator chose, which may differ from the replaced invoice's. A change to the settlement currency or payment choice counts; a payment choice includes its rail. A rail-only change writes a new invoice and bank snapshot and leaves the replaced invoice and snapshot untouched.
- **Rejected: store only HKD** - The Order Summary needs the USD lines, and an audit needs the fact the conversion started from.

### Order currency and bank rail

- **Spec governs** - "The winner chooses a settlement currency at order setup" and "The winner chooses a payment method with the address".
- **Reuse the method field** - The order keeps `card` or `bank_transfer` as it does today, and gains a nullable settlement currency and a nullable bank rail that is required when the method is `bank_transfer`.
- **Offered set is derived** - A server function takes the settlement currency, whether a card rule exists for it and which rails have bank details, and returns the offered methods. The currency-to-rails map is one table: HKD gives FPS and HK Local, USD gives HK Local and SWIFT. The view carries the result, so the block never decides.
- **Currency change** - The setup write validates the method against the offered set for the currency in the same request. A method the new currency does not offer is refused, and the form clears it on the client from the same set.
- **Lock** - Confirmation writes address, currency, method and rail in one transaction. The invoice send reads those values inside its own transaction, so a send cannot see a half-confirmed order.
- **Operator edit** - An operator's edit before send, and a reissue, write currency, method and rail through the same offered-set validation as the winner's confirmation, in one transaction, and record each changed part with its value before and after on the invoice log. A currency change that leaves the held method unoffered is refused unless the same edit names another.
- **Internal bidder's order** - The close writes the internal bidder's billing address, `settlement_currency=HKD`, `payment_method=bank_transfer` and `bank_rail=fps` in the same order insert. The winning lot and bid remain USD. The order starts in Preparing Invoice; no invoice is issued at close. The operator still quotes and sends the invoice, lets it expire and cancels the order. There is no winner or operator setup step.
- **Legacy internal orders** - Before adding the constraints, the migration checks every existing internal order. If an old row cannot be represented truthfully as HKD and FPS without changing an already sent invoice, the migration stops before it changes any order or invoice. The migration never re-prices or edits a sent invoice. It can be rerun after the legacy rows have a valid, reviewed mapping.
- **Rejected: a four-valued method** - It would break every reader of `card` and `bank_transfer` for no gain; the rail only matters to View Bank Details.

### Bank details shown

- **Spec governs** - "A bank transfer invoice shows how to pay".
- **Snapshot the rail picked** - The invoice snapshot holds the details of the one rail, not all three. The dialog reads the snapshot and shows no tabs.
- **Config stays keyed by rail** - Finance's configuration is unchanged. Finance configures the USD and HKD bank details rail by rail, and a rail is offered once its details are held (`decisions.md` Q21). Whether USD and HKD share an HK Local account is a configuration fact, not a model change; see Open Questions.

### Bid currency, schedule and ceiling

- **Spec governs** - `grade10-site/auction/bid-increments` and `grade10-admin/auction/listing`.
- **Keep the currency column** - The listing, bid and maximum rows keep their currency, validated to `USD` on every write. Dropping the column would break every stored money pair and the contracts that read it.
- **One schedule** - The increment lookup loses its currency switch and reads one USD table and one USD ceiling. The HKD and JPY rows are deleted, not left as dead data.
- **API and form** - Both refuse any other code. The admin form shows USD as fixed text.

### Site bid facts and read paths

- **Scope** - `grade10-site/auction/auto-bidding`, `account-record`, `listing-page`, `bidder-suspension` and `notifications` carry auction bid facts. Their maxima, current prices, minimum next bids and close-outcome bid amounts use USD minor units after the listing overwrite.
- **Viewer floor** - My Auctions and the live lot page read the minimum next bid supplied for that viewer and listing version. They do not derive a floor from the displayed price. The USD schedule gives a 132500 minor-unit floor after an accepted manual bid of 130000.
- **Settlement boundary** - These site bid facts remain USD when an internal bidder's order starts in HKD on FPS at close. The order is created without sending an invoice; the operator still quotes and sends it. A later payment-rail or settlement-currency change is enough to reissue under the order pricing rules above.

### Payment Settings

- **Spec governs** - `grade10-admin/auction/payment-settings`.
- **Premium minimum** - One USD value. The premium is computed in USD, then converted as a line under HKD, so there is no HKD minimum to keep in step.
- **Card rules** - Keyed by currency, USD and HKD only. The save validates the code set, and the page lists two rows.
- **Rejected: a minimum per settlement currency** - It would compute the premium twice. Decided in `decisions.md` Q11.

### Verified-bidder bar

- **Spec governs** - `grade10-site/auction/auction`, "A bid at or above the identity bar needs a verified bidder"; this change's delta states US$15,000.
- **Value** - The brand's bar becomes 1500000 USD minor units. The storefront compares the bid's USD minor units to it before the auction hears of the bid. No conversion is involved.
- **Boundary** - A bid of 1500000 is held and a bid of 1499900 is not. The comparison is at or above, in integer minor units.
- **Where** - A brand configuration value in `grade10`, not a code constant.

### Operator quote and letters

- **Spec governs** - `grade10-admin/auction/post-sale`, "The quote is typed in USD and read in the settlement currency", and `grade10-site/auction/notifications-order`, "Order letters read the currency the winner pays in".
- **One pricing call** - The quote dialog, the send and a reissue call the same pricing function as the invoice. The dialog types USD lines, including the bank transfer fee, and reads back the settlement-currency subtotal, fee and total. The total the operator read is checked again at send, so a changed rate or premium minimum refuses the send.
- **Rail named** - The dialog reads the order's method and rail and shows no other rail. A card quote shows the card fee read-only and no bank fee field.
- **Letters read stored lines** - Every letter after setup reads the invoice's settlement currency and stored lines. Only the won-lot letter reads the bid's USD amount. A reissue in another currency sends the new invoice's lines.

### Presentation in this store

- **`packages/ui`** - `AuctionWinnerOrder` in `packages/ui/src/blocks/auction-order` gains the optional props `settlementCurrency`, `paymentChoices`, `summary.convertedTotal`, `summary.convertedFee` and `bankDetails`, and the exported types `AuctionSettlementCurrency`, `AuctionPaymentRail`, `AuctionWinnerOrderPaymentChoice` and `AuctionWinnerOrderBankDetails`, per `shared/ui/auction-order`. The View Bank Details dialog that `apps/preview` assembles today moves into the block and renders the one rail supplied. `AuctionInvoicePdf` and `AuctionReceiptPdf` already print the amounts and currency they receive; they gain tests for an HKD document with no USD bid.
- **`packages/ui` listing** - `ListingAuctionBidCard` keeps one ceiling, 1000000000 USD minor units; its stories and tests drop the HKD and JPY ceilings, per `shared/ui/auction-listing`. The ceiling already arrives on the view.
- **`packages/i18n`** - Labels for USD, HKD and each rail, the two total lines, and the choice's helper text, in every language the catalogs hold. The rate appears in no key.
- **`apps/preview`** - Winner order stories for a USD order, an HKD order on each rail, the currency-switch clearing a method, and a USD card rule missing. The setup dialog and the how-to-pay dialog under `apps/preview/src/pages/auction/post-bidding` pass the new props.
- **Consumers** - `grade10` site's Winner Order page and `apps/preview`; no other application reads these blocks.
- **`apps/emails`** - HKD order letters print settlement-currency amounts and no USD bid. The won-lot letter keeps `US$`.

## Service Interfaces

Names are descriptive. Each is one processor with one input shape and one success or refusal shape.

| Service | Input | Success | Refusal |
| --- | --- | --- | --- |
| Confirm winner order setup | order id, address, billing address, settlement currency, method, rail | order records currency, method and rail; status Preparing Invoice | `CURRENCY_REQUIRED`, `METHOD_NOT_OFFERED`, `ADDRESS_INVALID`; nothing written |
| Close internal bidder win | lot id, internal bidder id, winning USD bid | internal order records address, HKD, `bank_transfer` and FPS; status Preparing Invoice; no invoice | invalid or missing internal bidder address; nothing written |
| Edit order before send | order id, address, settlement currency, method, rail, reason | order records the new values; log entry; status stays Preparing Invoice | `METHOD_NOT_OFFERED`, `REASON_REQUIRED`, `NOTHING_CHANGED`, `FORBIDDEN`; nothing written |
| Send invoice | order id, operator quote in USD (shipping, insurance, tax, bank fee), the total the operator read | invoice with line rows, fee, total, deadline, bank snapshot | `NO_CARD_RULE`, `CURRENCY_NOT_SET`, `ORDER_NOT_READY`, `QUOTE_CHANGED`; nothing written |
| Reissue invoice | order id, changed parts including settlement currency or payment choice (method and rail), quote in USD, reason | new invoice and lines; replaced invoice untouched | `METHOD_NOT_OFFERED`, `NO_CARD_RULE`, `NOTHING_CHANGED`, `QUOTE_CHANGED`; nothing written |
| Offered methods | settlement currency | list of methods and rails with their fee-range text | none |
| Save payment settings | premium minimum in USD, card rules for USD and HKD | stored whole, operator and time recorded | `CURRENCY_UNSUPPORTED`, `RANGE`, `FORBIDDEN`; nothing written |
| Overwrite lot currency | none | counts of listings, bids and maximums rewritten | none; re-running changes nothing |

Send invoice, in one transaction: read the confirmed order, read the USD quote, convert each line, sum, read the card rule for the currency, compute the fee, write line rows, write the bank snapshot for the rail, write the invoice, set the deadline.

Example, an HKD order by card, rule 3.4% + 235 minor units:

| Line | USD minor units | HKD minor units |
| --- | ---: | ---: |
| Winning Bid | 10100 | 79300 |
| Buyer's Premium | 2020 | 15900 |
| Shipping & Handling | 1001 | 7900 |
| Subtotal | 13121 | 103100 |
| Payment Processing Fee | - | 3873 |
| Order Total | - | 106973 |

## Database Schema

Names follow the existing schema's conventions when written.

| Table | Change | Notes |
| --- | --- | --- |
| auction order | add `settlement_currency` text, nullable, no default; add `bank_rail` text, nullable | Null only for an ordinary winner before confirmation. Checks allow only USD or HKD; require FPS or HK Local for HKD bank transfer, HK Local or SWIFT for USD bank transfer, and no rail for card. An internal order must be HKD, `bank_transfer` and FPS. Preflight existing internal rows before adding validated checks; abort without updates if a sent invoice cannot be preserved |
| invoice | add `settlement_currency` text, not null | Backfilled from each invoice's existing currency. No sent invoice amount, currency, line or bank snapshot is rewritten |
| invoice line | add `usd_minor` bigint, nullable; keep the settlement amount column | Null on a card fee line. Equal to the amount on a USD invoice |
| invoice bank snapshot | hold one rail | Existing rows keep three; new rows hold the picked rail |
| listing, bid, auto-bid maximum | keep `currency`; add a check holding it to `USD` | Applied after the overwrite |
| payment settings | premium minimum becomes one `premium_minimum_usd_minor` bigint, not null, default 0; card rule rows keyed by currency hold `USD` and `HKD` | HKD and JPY minimums and the JPY rule are deleted |

Authoritative: the USD facts and the stored settlement lines. Derived: the offered methods, the two total lines on the page and every display string.

## Risks / Trade-offs

- **[Risk] A display path converts a second time and shows a different figure** → Blocks, PDFs and letters take lines from the view only; a lint rule in `grade10` forbids importing the conversion function outside the pricing module.
- **[Risk] The figure changes later and a reissue prices differently from the sent invoice** → Line rows are stored; a test sends, changes the constant, reads the invoice and expects no change.
- **[Risk] The overwrite leaves a priced-in-HKD amount meaning a different sum** → Accepted by Q12 because every such lot is test data. The overwrite counts its rows, runs once in a transaction, and a database backup precedes it.
- **[Risk] A legacy internal order gets new defaults that misstate its sent invoice** → The migration checks legacy internal rows before applying internal-order constraints and stops before mutation when it cannot preserve the sent invoice. New internal orders always write HKD and FPS at close. Existing sent invoices remain unchanged.
- **[Risk] No USD card rule at launch** → The offered-methods function hides card in USD and the page says it is not yet available. The task list carries Finance's rule as a dated launch dependency.
- **[Risk] A winner changes currency while an operator sends** → Confirmation locks currency and method; send reads the locked values in its transaction, so a half-confirmed order cannot be priced.
- **[Risk] The card processor refuses a currency** → The card charge uses the settlement currency and the invoice total; a sandbox charge in each currency is part of the walk before launch.
- **[Risk] A sibling capability still accepts an HKD or JPY bid** → The listing, test-winner, internal-bid and bid-payment-method deltas all set the current bid and listing currency to USD. Settlement and invoice examples in HKD remain where the winner chooses HKD, per `decisions.md` Q27.
- **[Trade-off] One constant over a table** - A rate table would let a third currency in. The cost is that a new currency is a code change and a spec change, which is the intent.

## Migration Plan

1. Back up the auction tables. Record counts of listings, bids and maximums by currency.
2. Check every existing internal order. If any cannot meet the internal-order checks without changing a sent invoice, stop before mutation and resolve that row.
3. Deploy nullable order columns and invoice fields; backfill invoice currency from each invoice's existing currency; add internal-order checks only after the legacy check passes.
4. Run the overwrite once: set `currency` to `USD` on every listing, bid and auto-bid maximum that holds `HKD` or `JPY`. Amounts, statuses and dates are untouched. Re-running changes nothing.
5. Apply the `USD` check on those columns.
6. Reshape Payment Settings: keep the USD premium minimum, delete HKD and JPY values and the JPY card rule.
7. Finance saves a USD card rule.
8. Set the brand's verified bar to 1500000 USD minor units.
9. Deploy site and admin wiring.

Rollback before step 5: restore the backup. After step 5 the check refuses non-USD writes, so rollback restores the backup and drops the check.

## Open Questions

- **Where Finance configures bank details** - Settled, `decisions.md` Q28: the admin panel, where they remain configurable for USD and HKD. This design does not move it.
- **Separate USD HK Local account** - Whether USD uses the same HK Local account as HKD or a second one. It changes only Finance's configuration key, not the model or the specs.
- **Index of overwritten lots** - Whether support wants a list of lots that were HKD or JPY. The overwrite logs ids already; a report is optional.
