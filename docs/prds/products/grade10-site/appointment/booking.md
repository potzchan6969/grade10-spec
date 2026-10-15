---
title: Book a Visit
spec: grade10-site/appointment/booking
order: 1
---

A signed-in collector books a visit to a shop in five picks, and leaves
holding a link that manages it.

- **Service** — every customer-bookable service, with its length
- **Shop** — the shops offering it, with their addresses; one shop is
  already picked. The step shows while any service runs at more than one
  shop, so the steps never change with the service picked
- **Steps** — a row over the flow names the picks, done up to the current
  one; Back walks them back, and the row itself takes no press
- **Day** — a month calendar marking the days with something free, no further
  than the service's horizon; a full or closed day says so under its number
  and still picks, to say why. A phone reads a 14-day strip instead
- **Time** — the day's offered starts, in the shop's zone with the zone named;
  no press jumps to the earliest time
- **Details** — the account's name, email and phone read as a summary nobody
  edits here, then the service's questions and notes; the phone is asked for
  only when the account has none, and is optional unless the service requires
  one
- **Signed out** — the details step asks the collector to sign in; the picks
  are kept through the sign-in. Guest booking is built and switched off
- **Pay** — a service that takes payment at booking names it on the press,
  `Confirm booking with HK$100 deposit` or `Confirm booking and pay HK$300`,
  with the refund rule and where it is paid under the presses as footnotes.
  The press sends the collector to Stripe's checkout; the time is held 15
  minutes, and the visit is booked once the payment arrives
- **Amounts** — a whole amount drops its zero cents, `HK$100`; an amount with
  cents keeps them, `HK$100.50`
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

::story{id="appointment-booking-blocks-bookingslotpicker--default" title="Picking a day and a time"}

::story{id="appointment-booking-blocks-bookingdetailsform--default" title="The details step"}

::story{id="appointment-booking-blocks-bookingconfirmation--default" title="The confirmation"}

Every step, state and phone frame: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd).

:::detail{title="Product decisions" for="pm"}
A visit is booked under the collector's account. Guest booking — a name and
an email, the account later — is built and switched off; the diary still
finds a guest visit made before by the address it was booked under.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Account | Decided | Required: a collector signs in to book. Guest booking stays in the code behind a switch, off. | Product |
| Booking for someone else | Decided | Not offered: a visit is booked for the account holder. Built and switched off. | Product |
| Time zone shown | Decided | The shop's, named; the visit is physical. | Product |
| Second visit, same service | Decided | Refused while one is live; a collector with two cards books one visit. | Product |
| Phone number | Decided | Optional by default; a service turns on Require a phone number when the shop calls before the visit, and the booking is refused without one. Set per service, because only some visits need a call. | Operations |
| Reminders | Decided | Set per service: up to five leads, a day and two hours before by default, each removable. | Product |
| Services by card count | ❓ Open | Grading drop-off for 1 to 19 cards, 30 min; Bulk grading drop-off for 20 or more, 45 min, in the Grading room. | Operations |
| Shop step | Decided | Shown while any service runs at more than one shop, whichever service is picked; skipped only when none does. Steps that change under the collector read as a mistake. | Product |
| Step row | Decided | The design system's stepper, which takes no press; Back is the one way to an earlier pick - decided by the owner, 2026-10-15 | Design |
| A full day | ❓ Open | Shows the earliest time at each shop; no waitlist. | Product |
| Prefill | Decided | A signed-in collector books under the account's name, email and phone, shown read-only; a wrong detail is changed on the account. Book again carries the service, the shop and the answers. | Product |
| Shop facts in 繁中 | ❓ Open | Shop names, addresses, how to get there and counter names are stored in both languages. | Product |
| Payment at booking | Decided | Set per service: none, a deposit or the full price, in HKD, paid on Stripe's checkout. Staff bookings and product visits pay in the shop. | Product |
| Refunds | Decided | Set per service and off by default: a collector's cancellation before a cut-off, and a visit the shop cancels, each refunds in full only when the service allows it. | Product |
| Unpaid hold | Decided | 15 minutes; an unpaid booking then ends and frees the time. Stripe keeps a checkout open 30 minutes at the least, so the diary closes the page itself when the hold ends. | Product |
| Pay notice | Decided | No separate box: the press names the amount, and the refund rule sits under the presses as a footnote. | Product |
| Anonymous write | Decided | A challenge plus a per-address budget of twenty asks an hour. A booking holds a desk and sends mail on nobody's authority, and the two brakes answer different questions: whether a person is there at all, and how much one address may spend however convincingly it asks. | Product |
:::
