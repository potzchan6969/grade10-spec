## Purpose

Where a collector books a visit to a shop without an account, and what they
hold afterwards: the confirmation, the private link that moves or cancels the
visit, the reminder, and a signed-in collector's own list. The diary beneath
it is `shared/appointment/scheduling`; the components it composes are
`shared/ui/appointment-booking`; every requirement of
`grade10-site/site/crawlable-pages` and `shared/localization` binds its public
address.

## Feature set

- Booking a visit
  - Five picks: service, shop, day, time and details, in that order, with the choice so far always in view
  - No account needed: a name and an email address book a visit; a phone number is optional
  - Honest times: only what the diary offers, in the shop's zone with the zone named
  - Stale picks: a time taken between the picker and the confirmation is refused and the times refresh
  - Direct link: an address naming a service opens the flow at that service
- After booking
  - Confirmation: what was booked, where, when, and the link that manages it
  - Private link: moves or cancels the visit without an account, and stays out of every server log
  - Own list: a signed-in collector sees every visit booked under their address
- Public address
  - Prerendered and localized: the booking surface answers like every public surface
  - Private addresses stay private: the manage and own-list addresses are never listed or indexed

## ADDED Requirements

### Requirement: A collector books a visit without an account

The site SHALL let a collector book a customer-bookable service at
`/book`, in this order.

1. *Collector* — **Pick a service** from every customer-bookable service,
   each shown with its name, description and duration
2. *Collector* — **Pick a shop** among those offering it, each shown with its
   name and address
3. *Collector* — **Pick a day** on a month calendar that marks which days
   offer something, reaching no further than the service's booking horizon
4. *Collector* — **Pick a time** from the day's offered starts, shown in the
   shop's zone with the zone named
5. *Collector* — **Enter their details**: name, email address, a phone number
   if they wish, the service's questions in order, and notes
6. *Site* — **Book it** and show the confirmation, or say the time was taken
   and return the collector to the day's times

The site SHALL refuse to send a booking whose name, address or required
answer is missing, saying which, and SHALL send nothing until they are
supplied. `/book?service=<slug>` SHALL open the flow with that service picked.
A product-bound service SHALL never be listed.

#### Scenario: grade10-site-appointment-booking-SC-01 - Collector books a grading visit

- **GIVEN** a customer-bookable grading service offered at one shop
- **WHEN** a collector with no account picks the service, the shop, a day, a time, and enters a name and an email address
- **THEN** the confirmation shows the service, the shop and its address, the start in the shop's zone naming the zone, and the link that manages the visit
- **AND** a confirmation is sent to that address

#### Scenario: grade10-site-appointment-booking-SC-02 - Missing details are refused before anything is sent

- **GIVEN** a collector on the details step of a service with one required question
- **WHEN** they submit without an email address and without answering the question
- **THEN** the form names both as missing
- **AND** no booking is requested

#### Scenario: grade10-site-appointment-booking-SC-03 - A time taken meanwhile is refused and the times refresh

- **GIVEN** a collector on the details step for the last free time of a day
- **WHEN** that time is taken by somebody else before they submit
- **THEN** the site says the time was taken
- **AND** returns them to that day's times, refreshed, with their details kept

#### Scenario: grade10-site-appointment-booking-SC-04 - The service's questions are asked in order

- **GIVEN** a service asking a `choice` question and then a `text` question
- **WHEN** a collector reaches the details step
- **THEN** the two questions are shown after the contact fields, in that order, the required one marked

#### Scenario: grade10-site-appointment-booking-SC-05 - Only what the diary offers is shown

- **GIVEN** a shop open 10:00 to 14:00 in `Asia/Hong_Kong` with one desk and a live booking at 11:00
- **WHEN** a collector opens that day for a 60-minute service
- **THEN** the times shown are exactly those the diary offers, labelled in Hong Kong time with the zone named
- **AND** no time between 10:05 and 11:55 is shown

#### Scenario: grade10-site-appointment-booking-SC-06 - A day with nothing free cannot be picked

- **GIVEN** a shop closed on the coming Sunday
- **WHEN** a collector views that month
- **THEN** that Sunday is shown as unavailable and cannot be picked

#### Scenario: grade10-site-appointment-booking-SC-07 - Days beyond the horizon cannot be picked

- **GIVEN** a service with a booking horizon of 30 days
- **WHEN** a collector views the month holding the 31st day from today
- **THEN** every day from the 31st on is shown as unavailable

#### Scenario: grade10-site-appointment-booking-SC-08 - Only customer-bookable services are listed

- **GIVEN** a customer-bookable grading service and a product-bound vault visit service
- **WHEN** a collector opens `/book`
- **THEN** the grading service is listed and the vault visit is not

#### Scenario: grade10-site-appointment-booking-SC-09 - A service address opens the flow at that service

- **WHEN** a collector opens `/book?service=grading`
- **THEN** the flow opens with the grading service picked, at the shop step

#### Scenario: grade10-site-appointment-booking-SC-10 - A second live visit for the same service is told so

- **GIVEN** a live booking of the grading service under an address
- **WHEN** a collector books the grading service again under that address at another time
- **THEN** the site says a visit is already booked and shows when it is
- **AND** no second booking is written

### Requirement: A private link manages the booking

The confirmation, and every mail answering a request the collector made from
the link, SHALL carry a link to `/book/manage` whose secret travels in the
address fragment, so no server log holds it; the diary keeps only a hash of
the secret, so no other mail can carry the link. Opening the link SHALL show
the booking's service, shop, address,
start in the shop's zone, and state. While the booking is live the link SHALL
offer to move it, through the same day and time picks as a new booking, and
to cancel it after a confirmation. A closed booking SHALL show its state and
offer nothing. A link naming no booking SHALL answer not found.

#### Scenario: grade10-site-appointment-booking-SC-11 - The link opens the booking

- **GIVEN** a live direct booking
- **WHEN** the collector opens the link from their confirmation
- **THEN** the page shows the service, the shop and its address, the start in the shop's zone, and offers to move or cancel

#### Scenario: grade10-site-appointment-booking-SC-12 - The collector moves the visit from the link

- **GIVEN** a live direct booking at 10:00
- **WHEN** the collector opens the link, picks another day and time, and confirms
- **THEN** the same booking is live at the new start
- **AND** an update is sent to their address

#### Scenario: grade10-site-appointment-booking-SC-13 - The collector cancels from the link

- **GIVEN** a live direct booking
- **WHEN** the collector opens the link, chooses to cancel, and confirms
- **THEN** the booking is `cancelled` and the page says so
- **AND** a cancellation is sent to their address

#### Scenario: grade10-site-appointment-booking-SC-14 - A closed booking's link offers nothing

- **GIVEN** a direct booking in `completed`
- **WHEN** the collector opens its link
- **THEN** the page shows the visit as completed and offers neither a move nor a cancellation

#### Scenario: grade10-site-appointment-booking-SC-15 - A link naming nothing answers not found

- **WHEN** a collector opens `/book/manage` with a secret the diary does not hold
- **THEN** the page answers not found and shows no booking

#### Scenario: grade10-site-appointment-booking-SC-16 - The secret never leaves the browser

- **WHEN** the collector opens a manage link
- **THEN** the request for the page carries no secret in its path or query
- **AND** the secret reaches the diary only in the body of the booking's own reads and writes

### Requirement: A signed-in collector sees their own visits

`/book/mine` SHALL list, for a signed-in collector, every booking whose
attendee address is the account's address, upcoming visits first and past
ones after, each opening its manage link. Signed out, the address SHALL
invite the collector to sign in.

#### Scenario: grade10-site-appointment-booking-SC-17 - The list holds the visits under the collector's address

- **GIVEN** a signed-in collector whose address holds one live booking tomorrow and one completed last week
- **WHEN** they open `/book/mine`
- **THEN** tomorrow's visit is listed first as upcoming and last week's after it as past
- **AND** each opens the page that manages it

#### Scenario: grade10-site-appointment-booking-SC-18 - Signed out, the list invites sign-in

- **WHEN** a collector with no session opens `/book/mine`
- **THEN** the page invites them to sign in and lists nothing

### Requirement: The booking surface answers as a public surface

`/book` SHALL answer at one address per locale with its own title and
description in the first response, and SHALL be listed in the sitemap once
per locale. `/book/manage` and `/book/mine` SHALL answer at one address per
locale, SHALL NOT be listed in the sitemap, and SHALL tell crawlers not to
index them.

#### Scenario: grade10-site-appointment-booking-SC-19 - The booking surface is served and listed

- **WHEN** a crawler fetches `/book`, `/tc/book` and `/sc/book`
- **THEN** each answers 200 with the booking surface's title and description in its own language before any script runs
- **AND** the sitemap lists all three

#### Scenario: grade10-site-appointment-booking-SC-20 - The private addresses are never indexed

- **WHEN** a crawler reads the sitemap and fetches `/book/manage` and `/book/mine`
- **THEN** neither address is in the sitemap
- **AND** each answers with a directive not to index it
