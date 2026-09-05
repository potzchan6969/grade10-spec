---
title: Booking Blocks
spec: shared/ui/appointment-booking
order: 12
---

The booking surface, drawn once: the pickers, the details form, the summary,
the confirmation, the card that manages one visit and the list of a
collector's own. A brand's site imports them and supplies the words, the
diary's answers and the callbacks.

- **`BookingSteps`** — where the collector is in the flow, and the way back
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
- **`BookingList`** — upcoming visits, then past ones

::story{id="appointment-booking-bookingslotpicker--default" title="The slot picker"}

::story{id="appointment-booking-bookingslotpicker--failed" title="A failed read is not an empty day"}

::story{id="appointment-booking-bookingmanagecard--live" title="A live visit"}

::story{id="appointment-booking-bookingmanagecard--closed" title="A closed visit"}
