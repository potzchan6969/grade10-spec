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
| Visit | about 20 minutes, up to 20 cards | Product |
| Bulk visit | about 45 minutes, 20 cards or more, or two lists on one visit passing 20 together | Product |
| Batch cut-off | Thursday 19:00 on the shop's clock; the batch leaves the next day | Operations, against the courier's pickup schedule |
| Estimate | counted from the day the batch leaves | Commercial |
| Booking window | the service's own horizon in the diary, seeded at 30 days; never a grading setting | Product |
| Fee | HKD, paid at the counter once every card is checked and the agreement signed; the cover line beside it at Express and Super Express | — |

## Booking

- 🚧 **The diary service** — a Grading drop-off service bound to the
  submission, as the vault's visit is: the visit carries the list, the diary
  is given no address, and the submission owns every email
- 🚧 **Where it is booked** — in grading's own booking view, which the
  collector's page opens after the plan is kept, and for any submission that
  holds no drop-off and has none to join
- 🚧 **The Bulk drop-off** — 20 cards or more books the longer service; so
  do two lists on one visit that pass 20 together, and a booked list edited
  past 20
- 🚧 **Where and when** — the shop, a day inside the service's horizon and a
  time in the shop's own zone; beside the day, the batch it makes: hand in by
  that Thursday 19:00 and the cards leave the next day, after it the next
  batch's dates
- 🚧 **A second submission** — joins the drop-off the first one booked: the
  first submission owns the visit, the second is listed under it and its page
  reads the same day and time, and the slot is sized for both lists
- 🚧 **A walk-in** — books the customer-bookable Grading service at
  `grade10.com/book` with a name and an email, and lists the cards at the
  counter
- 🚧 **Move or cancel** — any time before the visit starts, from the page
  of the submission that owns the visit; an email each
- 🚧 **Leaving a joined visit** — a second submission's page offers no move
  and no cancel of the visit: it leaves by cancelling itself, and the visit
  stands, sized for the lists left on it
- 🚧 **A missed visit** — after the grace period grading tells the diary the
  collector did not come (the shop's console may also close it first);
  within the hour the submission reads the outcome, sends the missed email
  and keeps the list and the estimate as they were, and another drop-off is
  booked from the submission page
- 🚧 **A visit ended without a hand-in restarts the plan's clock** — missed
  or cancelled, from the day it ended, `plan_expiry_days` counted from there
  rather than from the day the plan was first kept, for every submission on
  the visit, a joined one too, so a collector whose visit ended weeks into
  their plan is not left with only what was originally left to book again in
- 🚧 **The booked view** — the day, the time and the shop, add to calendar,
  move, cancel, and the day the cards leave with the estimated day back

## Before You Come

🚧 **Four items** — on the booked view and in the booked email:

1. **The cards, each in a sleeve** — penny sleeves are fine; no toploaders
   taped shut and nothing to keep, because the grader keeps the sleeve
2. **The list** — staff check each card against it; it can change until the
   cards are handed in
3. **The signature, then the fee** — on the shop iPad once every card is
   checked and photographed, then the fee by card, cash or FPS at the till
4. **The day the cards leave** — the day after the batch closes when handed
   in by that Thursday 19:00, and the estimated day back at the shop

- 🚧 **The vault, on the same visit** — a vault case for a card not being
  graded, or one coming back, takes the identity check the vault asks for;
  grading itself needs no ID — [Vault](/p/grade10-site/vault)

<!-- story: the drop-off picker with the batch line, the booked page -->

:::detail{title="Code map" for="engineer"}
- **Diary** — three catalogue entries in `packages/appointment`: the
  product-bound Grading drop-off, its Bulk variant, and the customer-bookable
  Grading visit; no new diary logic; the horizon is the service's field
- **Booking** — `packages/grading/backend` books over the per-product
  entrypoint and caches the visit on the submission, as the vault does; a
  sweep after the slot reads the visit's outcome over the binding
- **Views** — `DropoffBooking` and `DropoffBooked` in
  `packages/grading/frontend`, over `BookingLocationPicker`,
  `BookingSlotPicker`, `BookingConfirmation`, `BookingManageCard` and
  `NoteList` from `@grade10/ui`
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The submission owns every email | Decided | The diary is given no address for a product booking, so booked, moved, cancelled, missed and the day before are grading's own messages | Product |
| A missed visit closes a visit | Decided | After the grace period grading tells the diary the collector did not come, the same shape the vault takes; the submission reads the outcome within the hour. Only the plan's expiry clock ends a plan, restarted from the day a visit ended without a hand-in, missed or cancelled, so a collector who missed a visit rebooks from the page with the list intact and the clock they actually have left | Product |
| One visit for two submissions | Decided | The first submission owns the visit and a second joins it, listed under the same day and time with the slot sized for both lists, so a collector with two levels still makes one trip and the diary holds one booking | Product |
| The booking blocks are the diary's | Decided | The picker, the details, the confirmation and the manage card are `@grade10/ui`'s appointment-booking exports; grading adds the batch line and its own wizard rail | Design |
| Diary services | Decided | A product-bound drop-off service, a Bulk variant with the longer duration, and the customer-bookable Grading visit kept for the walk-in, about 20 and 45 minutes; the horizon, the minimum notice and the buffers are each service's diary fields | Product, Engineering |
| Batch cut-off | Decided | Thursday 19:00 with the batch shipping the next day, checked against the courier's pickup schedule | Operations |
| One shop | Decided | More shops appear in the picker as they open; the first release has one | Owner |
:::
