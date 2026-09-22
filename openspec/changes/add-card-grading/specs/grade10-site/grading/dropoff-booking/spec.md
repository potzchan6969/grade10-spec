# grade10-site/grading/dropoff-booking Specification

## Purpose

The visit a submission's cards are handed in on: which service it books, the
batch the chosen day makes, and what moving, cancelling or missing it costs.

The diary that holds shops, services and slots is another service's
(`grade10-site/appointment/booking`); this capability is what a submission may
ask of it, what the submission keeps of the answer, and what it tells the
collector, because the diary tells them nothing for a product booking.

## Feature set

- The diary services
  - Three entries, no new diary logic: the drop-off bound to the submission,
    its longer Bulk variant, and the customer-bookable visit a walk-in books
  - The submission owns every message: the diary is given no address, so
    booked, moved, cancelled, missed and the day before are grading's own
  - The booking window: the service's own horizon, read from the diary
- Booking the visit
  - Where and when: the shop, a day inside the horizon, and a time in the
    shop's own zone
  - Sized by the list: twenty cards or more takes the longer visit, and so do
    two lists on one visit that pass twenty together
  - The diary refuses in its own words: a slot not offered, full, without its
    resource or already booked, and another day offered
- The batch a day makes
  - Read beside the day: hand in by the cut-off and the cards leave the next
    day
  - Past the cut-off: the next batch's close and ship days instead
  - The estimate runs from the ship day: not from the day the visit is booked
- The booked page
  - The visit as booked: the day, the time, the shop and its address, with a
    calendar file
  - Before you come: the cards sleeved, the list staff check against, the
    signature before the fee, and the day the cards leave
  - The vault on the same visit: a card not being graded can open a vault
    case, which asks for the identity check grading does not
- Moving, cancelling and missing
  - Any time before it starts: moved or cancelled from the submission page,
    and told either way
  - A missed visit closes the visit: the diary's console closes it and the
    submission reads the outcome within the hour
  - The list survives: a cancelled or missed visit keeps the cards and the
    estimate as they were, and another drop-off is booked from the page
- One visit, two submissions
  - The first submission owns it: a second joins that visit rather than
    booking its own
  - Read through the owner: the joiner's page shows the same day and time
  - Detached with the owner: a visit the owner cancels or misses leaves every
    joiner asked to book again
- The walk-in
  - Booked with a name and an email: the customer-bookable visit, with no list
  - Listed at the counter: the cards are written with the collector at the
    desk, and the visit carries no submission
