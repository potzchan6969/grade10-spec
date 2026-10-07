---
title: Booking Blocks
spec: shared/ui/appointment-booking
order: 12
---

The booking surface, drawn once: the pickers, the details form, the summary,
the confirmation, and the card that manages one visit. A brand's site
imports them and supplies the words, the diary's answers and the callbacks.

- **`BookingServicePicker`**, **`BookingLocationPicker`** — one choice each,
  reported by id
- **`BookingSlotPicker`** — a month of days marked available or not, and the
  picked day's times in a named zone
- **`BookingDetailsForm`** — name, email, phone, the service's questions and
  notes, validated before they are reported
- **`BookingSummary`** — the choice so far, always in view
- **`BookingConfirmation`** — what was booked and the link that manages it
- **`BookingManageCard`** — one visit, with a move and a confirmed cancel
  while it is live

::story{id="appointment-booking-bookingslotpicker--default" title="The slot picker"}

::story{id="appointment-booking-bookingslotpicker--failed" title="A failed read is not an empty day"}

::story{id="appointment-booking-bookingmanagecard--live" title="A live visit"}

::story{id="appointment-booking-bookingmanagecard--closed" title="A closed visit"}

## Time Zone

- **The shop's clock** - the slot picker, the summary and the visit card show
  the shop's times, whatever zone the collector is in; the visit is physical,
  so the shop's clock is the one that matters
  ([Dates and Times](/p/platform/shared/dates-and-times))
- **The label** - no rule sets how the blocks name the zone; their default
  label is HKT for Hong Kong, and a page may pass its own
