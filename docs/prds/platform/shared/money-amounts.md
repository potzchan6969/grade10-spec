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

- **IDR** ❓ TBC: the shared listing formatter held IDR and the platform table
  did not. The product owner decides whether IDR joins the table. Until then
  IDR is refused everywhere.

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

## Display Shapes

Money takes two shapes, and each surface uses the one its audience calls for.

| Shape | Who reads it | Symbol or code | HKD 249,000 minor | JPY 249,000 minor |
| --- | --- | --- | --- | --- |
| Collector | A customer on a storefront, auction, vault or grading page, and the messages they receive | Symbol | `HK$2,490.00` | `¥249,000` |
| Operator | An admin table, detail view or console row | ISO code | `HKD 2,490.00` | `JPY 249,000` |

- **Digits** — the currency's minor-unit digits always show: two for HKD, none
  for JPY, three for KWD (`KWD 1,234.567`). A whole amount keeps them.
- **Grouping** — thousands are grouped in both shapes. A collector's decimal
  and grouping marks follow the reader's own locale. Sent messages use English.
- **Bid amounts** ❓ TBC: the auction listing and the bid ladder show whole
  major units, as in `HK$800` and `¥15,000`, where the digits rule above gives
  `HK$800.00`. The product owner decides whether bid amounts keep the digits
  rule or keep whole units.
- **Narrow symbol** ❓ TBC: the order pages print summary lines as `$1,770.00`
  and the total as `HK$1,704.50` on the same HKD order, which the collector
  shape does not give. [Order Detail](/p/grade10-site/store/order-detail) and
  [Bidding](/p/grade10-site/auction/bidding) hold the same split. The product
  owner decides whether a summary line may drop the region. This page allows
  two shapes and no third, so a dropped region is either a third shape or a
  mistake.
- **Invoice item amounts** ❓ TBC: the auction invoice's item table prints bare
  numbers, and its totals print the symbol shape. The product owner decides
  whether item lines keep the bare number under a header that names the
  currency.

:::detail{title="Code helpers" for="engineer"}
| Helper | Module | Use for |
| --- | --- | --- |
| `toMinorUnits`, `fromMinorUnits` | `@grade10/utils/money` | A decimal string from or to an outside system |
| `formatMoney` | `@grade10/utils/money` | The collector shape, or the operator shape with `currencyDisplay: "code"` |
| `formatAmount` | `@grade10/utils/money` | The number alone, under a header that names the currency |
| `parseMinorUnits` | `@grade10/utils/money` | A typed amount, or null when the currency cannot hold it |
| `currencyExponent`, `SUPPORTED_CURRENCY_CODES` | `@grade10/utils/money` | The digits of a code, and the codes in the table above |
| `formatMoney`, `parseMoneyInputToMinor` | `@grade10/ui` (`lib/format-money`) | The shared auction listing blocks, which keep their own copy of the table |
| `formatMinor` | `@grade10/frontend-console` (`money.ts`) | Console tables, the operator shape |

The table lives in `@grade10/utils` for the Grade10 backend and frontends, and
`@grade10/ui` keeps the same codes, held equal to this page by a test. A
surface that needs a new helper adds it to `@grade10/utils/money`, not to its
own file.
:::

:::detail{title="Product decisions" for="pm"}
Floating point loses cents, so an amount is never a decimal inside the
platform. A collector wants the symbol and their own punctuation. An operator
scanning a table that spans currencies needs the ISO code on every row, because
a column where some amounts are dollars and some are yen is a mistake waiting
to be made.

**Not in scope.** Which currency a brand quotes in, which sits on its owning
page. Currency conversion, which the platform does not do.
:::
