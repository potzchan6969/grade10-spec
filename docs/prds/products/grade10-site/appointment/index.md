---
title: Appointments
---

The appointment service is the diary every visit to a shop is booked into: a
card to grade, a case to open in the vault, a loan to sign. It knows what a
visit is for, where it happens and what it occupies, when each shop is open,
and who is expected when. It is one package, deployed once per brand, so ZZZ
books into its own shops with the same screens.

- **Services** — what a collector books: a name, a length, the pauses around
  it, the notice it needs, how far ahead it opens, the questions it asks
  1. `Grading` — customer bookable, from the site
  2. `Vault visit` — bound to the vault, booked from a case, never listed
- **Shops** — a place with an address and one clock; every opening hour is
  read in the shop's own zone
- **Resources** — the desks, rooms and devices a visit occupies; a shop's
  capacity is the count of them that are free, never a number typed on a rule
- **Availability** — derived when asked, from the weekly rules, the special
  dates, the blocks, the buffers and what is already booked; nothing is stored
  as a slot
- **Bookings** — one visit on one resource, `booked` until it is `cancelled`,
  `completed` or a `no_show`; every change appends an event

## Who uses it

- **Collectors** book a grading visit at [`grade10.com/book`](/p/grade10-site/appointment/booking)
  with a name and an email, and hold a private link that moves or cancels it
- **Operators** run the diary from the
  [Appointments section](/p/grade10-admin/appointment) of the console: shops,
  resources, hours, blocks, the day by resource, and a visit booked at the
  counter
- **Products** book over a service binding, naming the case and the service;
  a product's visit is moved from the product, never from the diary

## What a booking tells its owner

A booking with an email address is told everything that happens to it, with a
calendar file attached: a confirmation, an update when it moves, a
cancellation, and one reminder ahead of the visit at the lead the service
sets. A booking without an address, which is what a product booking usually
is, is told nothing by the diary; the product tells its collector itself.

The rules themselves are [`shared/appointment/scheduling`](/p/shared/appointment/scheduling).
