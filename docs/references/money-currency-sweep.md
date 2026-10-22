# Money and Currency Sweep

A snapshot of where money and currency are handled in both repositories, taken
on 2026-10-10. It is the evidence behind [Money Amounts](/platform/shared/money-amounts),
which carries the decisions. Line numbers were current on that day and drift
as code moves.

## Currency Tables

**Platform table** — `packages/utils/src/money.ts` in `grade10`, `CURRENCY_EXPONENTS`,
51 codes. The spec's `packages/ui/src/lib/format-money.ts` held a second table
of 22 codes, with IDR and without 30 of the platform's codes. It now matches
the page exactly, and a test holds it so.

**Allow-lists by surface**

- **Auction** — `USD`, `HKD`, `JPY` in `SUPPORTED_AUCTION_CURRENCIES`
  (`packages/grade10-auction/contracts/src/bidIncrements.ts:1`), and the same
  three in a hand-written normaliser at `:49`. The payment settings table has
  `CHECK (currency IN ('USD','HKD','JPY'))`
  (`apps/backend/grade10/auction/src/db/migrations/0000_auction_baseline.sql:1518`).
- **Vault** — `HKD`, `USD` in `VAULT_CURRENCIES`
  (`packages/vault/contracts/src/schemas.ts:85`). The database checks only the
  three-letter shape, so the contract is the gate.
- **Inventory** — `Schema.Literal("USD")` on card prices
  (`packages/inventory/contracts/src/cardPrice.ts:132`). PriceCharting is USD-only.
- **Grading** — `GRADING_CURRENCY = "HKD"` (`packages/grading/contracts/src/batchActs.ts:20`).
  Its database checks the three-letter shape only.

**Shape-only checks, no exponent check** — auction order contracts
(`winnerOrder.ts:9`, `operatorOrder.ts:49`, `auctionOrders.ts:17`), inventory
(`inventory/contracts/src/schemas.ts:99`), coupons (`coupons/contracts/src/schemas.ts:14`),
grading (`batchActs.ts:45`). Store orders, inventory sold currency, loyalty
point holds and auction listings have no currency check in the database. They
rely on refusal in code, for example `services/external/ingest.ts:163`.

## Per-Brand Currency

- `packages/app-env/src/store.ts:12` — `CURRENCIES = { grade10: "HKD", zzz: "USD" }`.
  The comment there says the store currency must equal the brand's loyalty
  currency. The `zzz` brand has no loyalty program in this tree, so that rule
  cannot be tested for `zzz`.
- `packages/app-env/src/loyalty.ts:18` — loyalty `currency: "HKD"`, one point per 100 minor units.
- `packages/grade10-auction/backend/src/services/listings/schedule.ts:48` —
  a default listing currency that reads the `grade10` brand whatever the deploy brand.
- `packages/grade10-auction/backend/src/services/orders/operatorView.ts:346` —
  falls back to `"HKD"`.
- `packages/grade10-auction/backend/src/services/orders/bankDetails.ts:16` —
  bank transfer offered for HKD and sandbox only.
- `packages/grading/backend/src/email/letters/format.ts:42` — every letter in
  HKD. `letterFormat(brand)` takes a brand and ignores it for currency.
- `packages/grading/contracts/src/paste.ts:37-50` — a bare `$` reads as HKD,
  and `ReferenceSales` in USD converts to HKD at the reference rate (`:131-150`).
- `packages/shopify` — a single-currency rule enforced at ingest, for example
  `services/webhooks.ts:531` and `services/cart/review.ts:66`.
- `packages/grade10-auction/backend/src/services/orders/cardPayments.ts:208` —
  refuses a payment whose currency differs from the invoice.

## Helper Usage

Correct use of `@grade10/utils/money`: the Shopify payloads and mappers
(`packages/shopify/backend/src/webhooks/payloads.ts`, `admin/orders.ts:50`,
`catalog/mappers.ts:48`); grading paste (`paste.ts:48`, `parseMinorUnits`);
grading letters and page templates (`letters/format.ts:42`,
`documents/templates/page.ts:231`); auction receipt and order documents
(`services/auctions/orderDocument.ts:137-179`, `receiptPdf.ts:72-81`); auction
email (`email/render.tsx:60-71`, `emailPort.ts:278-283`); vault
(`packages/vault/backend/src/amounts.ts:12`).

No `Intl.NumberFormat` with a currency exists outside `utils/money.ts`. No
`HK$`, `¥` or `₩` symbol is hardcoded in scoped production source.

## Findings and Their Verdicts

Each candidate went to an independent devil's-advocate review before any change.
Verdicts are as of this snapshot, and the fixed items name the commit.

| # | Claim | Verdict | Where it stands |
| --- | --- | --- | --- |
| 1 | Shopify POS till rounds over-precise decimals (`integrations/shopify-pos/grade10/src/acts/money.ts`) | Partial | Fixed in `fa63f660`: refuses instead of rounding |
| 2 | POS cash pad throws for a decimal point in a zero-decimal currency (`packages/pos/frontend/src/shell/screens/cash.ts`) | Partial, latent | Fixed in `9479d29e`: Apply stays off, no throw from typed input. Terminal totals still reach the throwing helper; the POS brands today are HKD and USD |
| 3 | Inventory stock dialog multiplies and rounds a typed price (`StockDialogs.tsx`) | Partial | Fixed in `a9675e30`: refuses an over-precise price |
| 4 | Draft-order discount divides before the helper (`draftOrders.ts:149`) | Refuted | The caller refuses an indivisible cut before this line, returning a typed refusal |
| 5 | Draft-order `Number(...)` wrapping loses precision (`draftOrders.ts:193,205`) | Refuted on precision | Shortest round-trip form is exact for these strings. The Shopify wire type is not checked here |
| 6 | PriceCharting rounds with `* 100` (`priceChartingClient.ts:17-21`) | Refuted | The source is USD-only, and integers are read as cents |
| 7 | Winner-order HKD fallback shows `HK$0.00` (`winnerOrderView.ts:213`, `winnerOrderRead.ts:99`) | Refuted | The fallback is dead for a live order: the server supplies the winning bid's currency |
| 8 | Till `money()` prints the operator code shape on a member-facing screen (`integrations/shopify-pos/grade10/src/acts/money.ts`) | Decision | Open: [Display Shapes](/platform/shared/money-amounts) |
| 9 | Auction invoice item lines print bare numbers (`orderDocument.ts:137-141`) | Decision | Decided: item lines carry the symbol, per [Display Shapes](/platform/shared/money-amounts) |
| 10 | A bare `$` in grading paste reads as HKD (`paste.ts:37-50`) | Decision | Deliberate and tested. Open whether to warn or refuse |
| 11 | Shared formatter shows whole HKD without fraction digits (`packages/ui/src/lib/format-money.ts`) | Decision | Open: [Display Shapes](/platform/shared/money-amounts). Changing it changes the agreed auction look |

Not defects: `integrations/shopify-pos/grade10/src/host/tabletMoney.ts:19`
(`*100` is percent in hundredths) and `loyalty/.../earning.ts:47` (`/100` is
basis points).

Still open from the review, not fixed: `tabletMoney.ts` and `host/fake.ts`
still call the throwing `toMinorUnits`, and points amounts that cannot be read
are read as zero in `flow.ts:717`. Neither is reachable with the amounts
Shopify sends.

## Carrier Convention

`packages/grade10-store/backend/src/services/shipping.ts:73-80` maps exponent 2
to a factor of 1 and exponent 0 to 100, because the carrier wire quotes that
way. It throws for exponent 3. A KWD brand cannot quote carriers. This departs
from the exponent by design and is recorded here so it is not "fixed".

## Display Surfaces

- **Collector shape (symbol)** — store checkout, cart, product and order
  pages (`packages/grade10-store/frontend/src/features/orders/checkout/presentation/projections.ts:182-294`,
  `features/products/product/presentation/mappers/productSummary.ts:52-59`);
  auction order, record and bidding pages
  (`packages/grade10-auction/frontend/src/features/orders/winner-order/winnerOrderView.ts:210-215`,
  `apps/frontend/grade10/src/pages/auctions/AuctionOrdersPage.tsx:157`); auction
  emails in English (`emailPort.ts:669-671`, `render.tsx:25`); vault documents
  (`packages/vault/backend/src/documents/templates/loanAgreement.ts:61`).
- **Operator shape (code)** — console tables and the money cell
  (`packages/frontend-console/src/money.ts:9-10`, `table.tsx:117-119`,
  `MoneyField.tsx:82,103`); store orders table
  (`packages/grade10-store/admin-frontend/.../OrdersTable.tsx:81`); auction
  invoice and payments (`packages/grade10-auction/admin-frontend/.../InvoiceAndPayments.tsx:110-125`);
  loyalty programme words (`packages/loyalty/admin-frontend/.../words.ts:62`).
- **Point of sale** — `packages/pos/frontend/src/shell/chrome/checkoutColumn.ts`
  and the order and cash screens use the symbol shape on the staff till.

## Open Questions Carried to the Page

- Whether bid amounts show the digits or whole units (the auction listing and bid ladder).
- Whether a summary line beside an HKD total may drop `HK$` to `$` (order detail and post-bidding pages).
- Whether the narrow symbol is a third shape.
- Whether IDR joins the platform table.
- Whether a bare `$` in grading paste should warn or be refused.
