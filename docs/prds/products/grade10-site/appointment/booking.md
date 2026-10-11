---
title: Book a Visit
spec: grade10-site/appointment/booking
order: 1
---

A collector books a visit to a shop without an account, in five picks, and
leaves holding a link that manages it.

- **Service** — every customer-bookable service, with its length
- **Shop** — the shops offering it, with their addresses
- **Day** — a month calendar marking the days with something free, no further
  than the service's horizon
- **Time** — the day's offered starts, in the shop's zone with the zone named
- **Details** — name, email, a phone number, the service's questions, notes;
  the phone is optional unless the service requires one
- **Signed in** — the account's name, email and phone read as a summary
  nobody edits here; the phone is asked for only when the account has none
- **Pay** — a service that takes payment at booking sends the collector to
  Stripe's checkout for its deposit or its full price; the time is held 30
  minutes, and the visit is booked once the payment arrives
- **URL**
  1. `grade10.com/book` — the flow
  2. `grade10.com/book?service=<slug>` — the flow opened at one service
  3. `grade10.com/book/manage#<secret>` — one booking, from the link in the mail
  4. `grade10.com/book/mine` — every visit under a signed-in collector's address

## After booking

- **Confirmation** — what was booked, where, when, and the manage link; the
  same arrives by mail with a calendar file
- **Manage link** — moves the visit through the same day and time picks, or
  cancels it after a confirmation; a closed visit shows its state and offers
  nothing
- **Secret** — travels in the address fragment, so no server log holds it,
  and reaches the diary only inside the booking's own reads and writes
- **Reminders** — at each lead the service sets, none to five of them
- **Payment** — a receipt by mail once paid; an abandoned checkout releases the
  time and says so
- **Refund** — only where the service allows it: a cancellation before the
  service's cut-off, or a visit the shop cancels; otherwise the payment is kept
- **One live visit per service** — booking the same service twice under one
  address is told about the visit already held
- ❓ **Visit page** - the manage link opens [Your Visit](/p/grade10-site/appointment/visit), which follows the visit through the day

## Designs

::story{id="appointment-booking-bookingslotpicker--default" title="Picking a day and a time"}

::story{id="appointment-booking-bookingdetailsform--default" title="The details step"}

::story{id="appointment-booking-bookingconfirmation--default" title="The confirmation"}

Every step, state and phone frame: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd).

:::detail{title="Product decisions" for="pm"}
A visit is booked by the person who will turn up, not by an account, because
the first thing a new collector does with Grade10 is bring a card in. The
account comes later, and the diary finds their visits by the address they
gave.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Account | Decided | None needed; a name and an email book a visit. | Product |
| Time zone shown | Decided | The shop's, named; the visit is physical. | Product |
| Second visit, same service | Decided | Refused while one is live; a collector with two cards books one visit. | Product |
| Phone number | Decided | Optional by default; a service turns on Require a phone number when the shop calls before the visit, and the booking is refused without one. Set per service, because only some visits need a call. | Operations |
| Reminders | Decided | Set per service: up to five leads, a day and two hours before by default, each removable. | Product |
| Services by card count | ❓ Open | Grading drop-off for 1 to 19 cards, 30 min; Bulk grading drop-off for 20 or more, 45 min, in the Grading room. | Operations |
| A full day | ❓ Open | Shows the earliest time at each shop and, today, the walk-in wait; no waitlist. | Product |
| Prefill | Decided | A signed-in collector books under the account's name, email and phone, shown read-only; a wrong detail is changed on the account. Book again carries the service, the shop and the answers. | Product |
| Shop facts in 繁中 | ❓ Open | Shop names, addresses, how to get there and counter names are stored in both languages. | Product |
| Payment at booking | Decided | Set per service: none, a deposit or the full price, in HKD, paid on Stripe's checkout. Staff bookings, walk-ins and product visits pay in the shop. | Product |
| Refunds | Decided | Set per service and off by default: a collector's cancellation before a cut-off, and a visit the shop cancels, each refunds in full only when the service allows it. | Product |
| Unpaid hold | Decided | 30 minutes, the shortest checkout Stripe keeps open; an unpaid booking then ends and frees the time. | Engineering |
| Anonymous write | Decided | A challenge plus a per-address budget of ten asks a day. A booking holds a desk and sends mail on nobody's authority, and the two brakes answer different questions: whether a person is there at all, and how much one address may spend however convincingly it asks. | Product |
:::
