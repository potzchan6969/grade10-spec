---
title: Money Amounts
spec: shared/money-amounts
order: 1
---

## Values

| Rule | Value |
| --- | --- |
| Amount | An integer count of minor units and an ISO 4217 code: `249000` and `HKD` |
| Decimal from an outside system | Read as text and converted exactly: `1.15` HKD is `115` |
| Too much precision | Refused, never rounded: `1.155` HKD fails |
| Code not in the table | Stops with an error that names the code |
| Collector shape | The symbol and the amount: `HK$2,490.00` |
| Operator shape | The ISO code and the amount: `HKD 2,490.00` |
| Sent messages | English grouping and punctuation, whatever the reader's language |

The examples use 249,000 minor units of HKD, which is HK$2,490.00.

## Currencies

The platform shows and converts the codes in this table. Any other code is
refused on every surface.

| Minor unit digits | Codes |
| --- | --- |
| 0 | BIF, CLP, DJF, GNF, ISK, JPY, KMF, KRW, PYG, RWF, UGX, UYI, VND, VUV, XAF, XOF, XPF |
| 2 | AED, AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HKD, ILS, INR, MXN, MYR, NOK, NZD, PHP, PLN, RON, SEK, SGD, THB, TRY, TWD, USD, ZAR |
| 3 | BHD, IQD, JOD, KWD, LYD, OMR, TND |

- **IDR** — ❓ TBC: whether IDR joins the table. The product owner decides.
  Until then IDR is refused everywhere.

## Currencies in Use

A brand or surface quotes in the currency its owning page sets. This table
names those currencies and does not decide them.

| Surface | Currencies | Owning page |
| --- | --- | --- |
| Grade10 store and loyalty points | HKD | [Points](/p/grade10-site/loyalty/points) |
| zzz store | USD | Brand setting |
| Vault | HKD, USD, one per case | [Loan and Money](/p/grade10-site/vault/loan-and-money) |
| Auction | USD, HKD, JPY, one per lot | [Bidding](/p/grade10-site/auction/bidding) |
| Grading | HKD | [Grading](/p/grade10-site/grading) |

A spend or payment in another currency is refused, not converted.

- 🚧 **A reference price may be converted** - a price quoted in another
  currency is converted at a recorded rate where it only values something: a
  yen market price behind a vault card's incentive, at the day's ECB rate -
  [Earnings](/p/grade10-site/vault/earnings) - or a consignment's HKD floor
  listed at a dollar auction, at the auction's fixed rate. Neither is a
  payment, and what is paid is still in the payer's own currency

## Display Shapes

Money takes two shapes, and each surface uses the one its audience calls for.

| Shape | Who reads it | Symbol or code | HKD 249,000 minor | JPY 249,000 minor |
| --- | --- | --- | --- | --- |
| Collector | A customer on a storefront, auction, vault or grading page, and the messages they receive | Symbol | `HK$2,490.00` | `¥249,000` |
| Operator | An admin table, detail view or console row | ISO code | `HKD 2,490.00` | `JPY 249,000` |

- **Digits** — the currency's minor-unit digits always show: two for HKD, none
  for JPY, three for KWD (`KWD 1,234.567`). A whole amount keeps them, except
  on [Book a Visit](/p/grade10-site/appointment/booking), whose presses and
  lines read `HK$100`; an amount with cents keeps every digit there,
  `HK$100.50`.
- **Grouping** — thousands are grouped in both shapes. A collector's decimal
  and grouping marks follow the reader's own locale. Sent messages use English.
- **Bid amounts** — ❓ TBC: whether bid amounts show the digits above or whole
  units. The product owner decides. The evidence is in the money sweep
  reference.
- **Summary lines** — ❓ TBC: whether a summary line beside a total may drop the
  region, as `$` beside `HK$` on one HKD order. The product owner decides.
- **Narrow symbol** — ❓ TBC: whether a line that drops the region is a third
  shape. This page allows two shapes and no third. The product owner decides.
- **Invoice item lines** - the item table on an auction invoice or receipt
  shows the symbol on every amount, `US$101.00` on a USD line and `HK$793.00`
  on an HKD one, as the lines under it do.

:::detail{title="Code helpers" for="engineer"}
| Helper | Module | Use for |
| --- | --- | --- |
| `toMinorUnits`, `fromMinorUnits` | `@grade10/utils/money` | A decimal string from or to an outside system |
| `formatMoney` | `@grade10/utils/money` | The collector shape, or the operator shape with `currencyDisplay: "code"`; `trailingZeros: "strip"` drops the zero cents of a whole amount |
| `formatAmount` | `@grade10/utils/money` | The number alone, under a header that names the currency |
| `parseMinorUnits` | `@grade10/utils/money` | A typed amount, or null when the currency cannot hold it |
| `currencyExponent`, `SUPPORTED_CURRENCY_CODES` | `@grade10/utils/money` | The digits of a code, and the codes in the table above |
| `formatMoney`, `parseMoneyInputToMinor` | `@grade10/ui` (`lib/format-money`) | The shared auction listing blocks, which keep their own copy of the table |
| `formatMinor` | `@grade10/frontend-console` (`money.ts`) | Console tables, the operator shape |
:::

:::detail{title="Product decisions" for="pm"}
**Users.** Collectors reading an amount on a storefront, auction, vault or
grading page. Operators reading rows that can span currencies. Engineers adding
a surface that shows money.

**Measurement.** None. A test holds the shared table equal to this page's table,
so the two cannot drift apart unnoticed.

**Decisions.** One table of codes and digits for every surface, rather than one
table per surface. Two shapes, chosen by audience. An amount the currency cannot
hold is refused, never rounded. Floating point loses cents, so an amount is
never a decimal inside the platform. Invoice and receipt item lines carry the
symbol, rather than bare numbers under a header that names the currency, so a
document reads one shape throughout.

**Not in scope.** Which currency a brand quotes in, which sits on its owning
page. Converting a payment, which the platform never does.
:::
