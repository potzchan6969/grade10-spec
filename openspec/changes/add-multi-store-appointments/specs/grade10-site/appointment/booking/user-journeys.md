## User journeys

### grade10-site-appointment-booking-US-01: Collector books a grading visit without an account

**As a** collector with a card to grade,
**I want** to pick a shop and a time and book the visit with nothing but my name and email,
**so that** I arrive at a desk that is expecting me instead of queueing as a walk-in.

**Accepted by:**

- `grade10-site-appointment-booking-SC-01` — Collector books a grading visit
- `grade10-site-appointment-booking-SC-02` — Missing details are refused before anything is sent
- `grade10-site-appointment-booking-SC-03` — A time taken meanwhile is refused and the times refresh
- `grade10-site-appointment-booking-SC-04` — The service's questions are asked in order
- `grade10-site-appointment-booking-SC-05` — Only what the diary offers is shown
- `grade10-site-appointment-booking-SC-06` — A day with nothing free cannot be picked
- `grade10-site-appointment-booking-SC-07` — Days beyond the horizon cannot be picked
- `grade10-site-appointment-booking-SC-08` — Only customer-bookable services are listed
- `grade10-site-appointment-booking-SC-09` — A service address opens the flow at that service
- `grade10-site-appointment-booking-SC-10` — A second live visit for the same service is told so
- `grade10-site-appointment-booking-SC-19` — The booking surface is served and listed

### grade10-site-appointment-booking-US-02: Collector manages a visit after booking it

**As a** collector who has booked a visit,
**I want** to see, move or cancel it from the link in my mail, and to find all my visits when I am signed in,
**so that** a change of plans costs me a minute rather than a phone call.

**Accepted by:**

- `grade10-site-appointment-booking-SC-11` — The link opens the booking
- `grade10-site-appointment-booking-SC-12` — The collector moves the visit from the link
- `grade10-site-appointment-booking-SC-13` — The collector cancels from the link
- `grade10-site-appointment-booking-SC-14` — A closed booking's link offers nothing
- `grade10-site-appointment-booking-SC-15` — A link naming nothing answers not found
- `grade10-site-appointment-booking-SC-16` — The secret never leaves the browser
- `grade10-site-appointment-booking-SC-17` — The list holds the visits under the collector's address
- `grade10-site-appointment-booking-SC-18` — Signed out, the list invites sign-in
- `grade10-site-appointment-booking-SC-20` — The private addresses are never indexed
