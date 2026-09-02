**Author:** @seankcw - 2026-08-19

## Why

A collector reading a price on one Grade10 surface and the same price on
another does not see the same number. The platform has six independent
implementations of "turn minor units into something a person reads", and they
disagree in output and in correctness:

| Where | 249000 + HKD renders as | Exponent |
| --- | --- | --- |
| The site's store and auction pages | `HK$2,490.00` | fixed ÷100 |
| The auction demo | `HK$2,490.00` | fixed ÷100 |
| The store demo | `HKD 2,490.00` | fixed ÷100 |
| The grade10 admin auction table | `HK$2,490.00` | fixed ÷100 |
| The grade10 and zzz admin order and ledger tables | `HKD 2490.00` | fixed ÷100 |
| Auction email | `HK$2,490.00` | from the currency |

Two defects, one live and one waiting:

- **Live:** an operator reading an order table sees `HKD 2490.00` — no
  thousands separator — beside an auction table showing `HK$2,490.00` for the
  same money. Five of the six renderings also ignore the reader's locale or
  ignore the currency symbol, so the platform has no consistent voice for the
  single most important number a collector reads.
- **Waiting:** five of the six divide by 100 unconditionally. Both brands
  quote in exponent-2 currencies today (grade10 in HKD, zzz in USD), so
  nothing is wrong on screen right now. The first brand or marketplace priced
  in JPY or KRW would show every amount at one hundredth of its value, and
  BHD or KWD at one thousandth. For a trading-card business, Japan is not a
  hypothetical market.

The correct half of the answer already exists but is locked in the wrong
place: the Shopify integration owns a full ISO 4217 exponent table and
string-exact decimal conversion, reachable only by importing a payment
provider's package, and it fails with that provider's name in the error.

This change puts one exponent-aware money module where every surface can
reach it, and routes all six renderings through it.

**Metric:** currencies the platform can quote, charge, and display without a
display defect — 2-decimal currencies only today, every ISO 4217 exponent
after. Secondary: money-rendering sites not routed through the shared
module, 6 → 0.

## What Changes

- Add a `shared/money-amounts` capability: how an amount converts between minor
  units and a decimal amount, what happens to an unknown currency, and the
  two display shapes the platform uses — one for collectors, one for
  operators.
- Convert every amount by its currency's ISO 4217 minor-unit exponent rather
  than a fixed hundred, and fail loudly on a currency code the platform has
  no exponent for.
- Give operator tables one shape (ISO code, locale grouping) and collector
  surfaces another (currency symbol, reader's locale), replacing four
  accidental variants with two chosen ones.
- Move the exponent table and decimal conversion out of the Shopify
  integration so the payment provider consumes the shared module rather than
  owning it.

## Capabilities

### New Capabilities

- `shared/money-amounts`: How a money amount is converted and displayed on every
  Grade10 surface — backend, storefront, admin, and email.

### Modified Capabilities

- None.

## Impact

- Affected consumer: the `grade10` application repository — the site's store
  and auction pages, both admin panels' order, ledger and auction tables, the
  auction's outbid and won emails, the store and auction demos, and the
  Shopify integration package.
- Visible change for operators: order and ledger tables gain thousands
  separators. No collector-facing amount changes value or shape in HKD or
  USD.
- No wire format changes. Amounts stay integer minor units plus an ISO 4217
  code on every wire, exactly as today.
- No database, deployment, or authentication impact.

## Non-goals

- Currency conversion between currencies. A brand quotes in one currency and
  refuses a spend in another; this change does not alter that.
- A `Money` value type across the wire contracts. Amount and currency stay
  the separate fields each contract already declares.
- Translating currency names or moving money strings into the message
  catalogs.
- Reworking amount *validation*. Where a surface rejects a fractional or
  non-positive amount today, it keeps its own rule.
