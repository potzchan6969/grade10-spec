# Store Order Status Brief

The brief behind Order Status, drafted on 2026-10-07 from what the store
records: one row per note and each combination a decision settles by name,
drawn in #132 from the owner's thirty rows, with the badge and note the store
gives it and where the store records it. The owner's file is
`Grade10_Store_OrderStatus_PRD_v2.0.md`, which the store does not hold. The
decisions it led to are on [Order Status](../prds/products/grade10-site/commerce/order-status.md). Read
this as the rows the durable spec `grade10-site/commerce/order-status` was checked against, not as the requirements; where a row and the
spec disagree, the spec is correct.

## Status

- **Rows held** - 28: 18 note rows and 10 decided rows, below. Task 1.1
  checks the rule against each, and group 1 waits on none of them (Q17)
- **Decided without the owner** - D1 changed by Q28; D3, a fulfilled order not
  paid in full reading Shipped, on common storefront practice, 2026-10-08,
  since Completed needs the order paid in full (Q9); D7, a canceled order that
  took no money carrying no `awaiting-refund` note, by the product owner on
  2026-10-08, since no surface shows a note this delivery (Q14, Q17); N2 is
  D7's narrowing, and N3 only a rename

## Facts

The four facts and their values are the spec's, in
`openspec/specs/grade10-site/commerce/order-status/spec.md`. Each row reads
order · payment · fulfilment · return.

- **Order** - `open` or `canceled`. Whether Shopify archived the order is not
  read (Q28)
- **Not yet shipped** - any fulfilment but `fulfilled`, `partially_fulfilled`,
  `on_hold` and `scheduled`
- **Any** - the row holds for every value of that fact
- **Record** - a note rule or a badge rule of the spec, and a Q row of the
  change's `decisions.md`

## Note Rows

One row per note the rule names. Each row is every combination that carries
that note.

| Row | Order · payment · fulfilment · return | Badge | Note | Record | Since #132 |
| --- | --- | --- | --- | --- | --- |
| N1 | `open` · `voided` · any · any | Canceled | `payment-voided` | Note rule 1 · Q3 | Same |
| N2 | `canceled` · `partially_paid` or `paid` · any · any | Canceled | `awaiting-refund` | Note rule 2 · Q18 | Narrowed: no longer `pending` or `authorized` |
| N3 | `canceled` · any but `partially_paid` and `paid` · `partially_fulfilled` · any | Canceled | `canceled-some-items-shipped` | Note rule 3 · Q13 | Renamed from `cancelled-some-items-shipped` |
| N4 | `open` · `partially_refunded` · not `on_hold` or `scheduled` · `returned` | Refunded | `items-returned-partial-refund` | Note rule 4 · Q8 | Same |
| N5 | `open` · `refunded` · not `on_hold` or `scheduled` · `returned` | Refunded | `items-returned` | Note rule 5 · Q8 | Same |
| N6 | `open` · `partially_refunded` · `fulfilled` · absent | Refunded | `partial-refund-shipped` | Note rule 6 · Q3 | Same |
| N7 | `open` · `partially_refunded` · `partially_fulfilled` · absent | Refunded | `partial-refund-partly-shipped` | Note rule 7 | Same |
| N8 | `open` · `partially_refunded` · not yet shipped · absent | Refunded | `partial-refund-unshipped` | Note rule 8 · Q16 | Same |
| N9 | `open` · `refunded` · `fulfilled` · absent | Refunded | `refunded-all-items-shipped` | Note rule 9 · Q28 | Widened: an archived one carried no note |
| N10 | `open` · any but `voided`, `refunded` and `partially_refunded` · `partially_fulfilled` · any | Shipped | `some-items-shipped` | Note rule 10 · Q19 | Same |
| N11 | `open` · `partially_refunded` · `on_hold` · any | Processing | `on-hold-partial-refund` | Note rule 11 · Q22 | Same |
| N12 | `open` · any but `voided` and `partially_refunded` · `on_hold` · any | Processing | `on-hold` | Note rule 12 · Q26 | Same |
| N13 | `open` · any but `voided` · `scheduled` · any | Processing | `scheduled` | Note rule 13 · Q26 | Same |
| N14 | `open` · `expired` · not yet shipped · any | Processing | `payment-expired` | Note rule 14 · Q20 | Same |
| N15 | `open` · `unknown` · not yet shipped · any | Processing | `status-indeterminate` | Note rule 15 · Q11 | Same |
| N16 | `open` · `partially_paid` · not yet shipped · any | Processing | `partial-payment-received` | Note rule 16 | Same |
| N17 | `open` · `authorized` · not yet shipped · any | Processing | `payment-authorized` | Note rule 17 | Same |
| N18 | `open` · `pending` · not yet shipped · any | Processing | `awaiting-payment` | Note rule 18 | Same |

## Decided Rows

Combinations a decision settles by name, most with no note. D2 is retired: it
read the same as D1 once archiving stopped deciding the badge (Q28).

| Row | Order · payment · fulfilment · return | Badge | Note | Record | Since #132 |
| --- | --- | --- | --- | --- | --- |
| D1 | `open` · `paid` · `fulfilled` · any | Completed | None | Badge rule 4 · Q1 · Q28 | Changed: read Shipped until archived (Q28) |
| D3 | `open` · any but `paid`, `voided`, `refunded` and `partially_refunded` · `fulfilled` · any | Shipped | None | Badge rule 5 · Q9 | Changed: an archived one read Completed |
| D4 | `open` · `paid` · `partially_fulfilled` · any | Shipped | `some-items-shipped` | Badge rule 5 · Q19 | Same |
| D5 | `open` · `paid` · `unfulfilled` or `in_progress` · any | Processing | None | Badge rule 6 · Q4 | Same |
| D6 | `open` · `paid` · `fulfilled` · `returned` | Completed | None | Q8 | Same |
| D7 | `canceled` · `pending` or `authorized` · any but `partially_fulfilled` · any | Canceled | None | Note rule 2 · Q18 | Changed: carried `awaiting-refund` |
| D8 | `canceled` · `refunded` · any but `partially_fulfilled` · any | Canceled | None | Q21 | Same |
| D9 | `canceled` · `voided` · any but `partially_fulfilled` · any | Canceled | None | Q25 | Same |
| D10 | `open` · `refunded` · `on_hold` · any | Processing | `on-hold` | Q26 | Same |
| D11 | `open` · `partially_refunded` · `scheduled` · any | Processing | `scheduled` | Q26 | Same |

## Task 1.1

1. *Engineer* - **Writes one case per row** in `ORDER_STATUS_CASES`, with its
   badge and note, beside one case per scenario
2. *Product manager* - **Reopens D3** as a Decisions row if the owner reads
   a fulfilled order not paid in full as Completed; the page holds Shipped
   until that row is settled
