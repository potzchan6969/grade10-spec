---
title: The Drop-off
spec: grade10-site/grading/dropoff-booking
order: 2
---

The drop-off is the visit the cards are handed in on, booked from the
submission into the shop's diary — [Appointments](/p/grade10-site/appointment).

## Rules

| Rule | Value | Confirms |
| --- | --- | --- |
| Visit | ❓ about 20 minutes, up to 20 cards | Product |
| Bulk visit | ❓ about 45 minutes, 20 cards or more | Product |
| Batch cut-off | ❓ Thursday 19:00 on the shop's clock; the batch leaves Friday | Operations, against the courier's pickup schedule |
| Estimate | ❓ counted from the day the batch leaves | Commercial |
| Booking window | ❓ the next 30 days, in the shop's own zone | Product |
| Fee | HKD, paid at the counter once every card is checked and the agreement signed | — |

## Booking

- 🚧 **The diary service** — a Grading drop-off service bound to the
  submission, as the vault's visit is: the visit carries the list, the diary
  is given no address, and the submission owns every email; a Bulk variant
  takes the longer slot
- 🚧 **Where and when** — the shop, a day in the next 30 days and a time in
  the shop's own zone; beside the day, the batch it makes: hand in by that
  Thursday 19:00 and the cards leave that Friday, after it the next batch's
  dates
- 🚧 **A second submission** — joins a drop-off already booked: one visit,
  both lists
- 🚧 **A walk-in** — books the customer-bookable Grading service at
  `grade10.com/book` with a name and an email, and lists the cards at the
  counter
- 🚧 **Move or cancel** — any time before the visit starts, from the
  submission page; an email each
- 🚧 **A missed visit** — closes the visit, not the plan: the list and the
  estimate stay as they were, and another drop-off is booked from the
  submission page
- 🚧 **The booked page** — the day, the time and the shop, add to calendar,
  move, cancel, and the day the cards leave with the estimated day back

## Before You Come

🚧 **Four items** — on the booked page and in the booked email:

1. **The cards, each in a sleeve** — penny sleeves are fine; no toploaders
   taped shut and nothing to keep, because the grader keeps the sleeve
2. **The list** — staff check each card against it; it can change until the
   cards are checked in
3. **The signature, then the fee** — on the shop iPad once every card is
   checked and photographed, then the fee by card, cash or FPS at the till
4. **The day the cards leave** — the Friday the batch ships when handed in by
   that Thursday 19:00, and the estimated day back at the shop

- 🚧 **The vault, on the same visit** — a vault case for a card not being
  graded, or one coming back, takes the identity check the vault asks for;
  grading itself needs no ID — [Vault](/p/grade10-site/vault)

<!-- story: the drop-off picker with the batch line, the booked page -->

:::detail{title="Code map" for="engineer"}
- **Diary** — three catalogue entries in `packages/appointment`: the
  product-bound Grading drop-off, its Bulk variant, and the customer-bookable
  Grading visit; no new diary logic
- **Booking** — `packages/grading/backend` books over the per-product
  entrypoint and caches the visit on the submission, as the vault does
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The submission owns every email | Decided | The diary is given no address for a product booking, so booked, moved, cancelled, missed and the day before are grading's own messages | Product |
| A missed visit closes a visit | Decided | Only the plan's expiry clock ends a plan; a collector who missed a visit rebooks from the page with the list intact | Product |
| One visit for two submissions | Decided | A second submission joins a drop-off already booked, so a collector with two levels still makes one trip | Product |
| Diary services | ❓ Open | A product-bound drop-off service, a Bulk variant with the longer duration, and the customer-bookable Grading visit kept for the walk-in; the names and durations | Product, Engineering |
| Batch cut-off | ❓ Open | Thursday 19:00 with the batch shipping Friday, checked against the courier's pickup schedule | Operations |
| One shop | Decided | More shops appear in the picker as they open; the first release has one | Owner |
:::
