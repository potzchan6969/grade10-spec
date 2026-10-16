# grade10-site/consignment/consignor-notifications Specification

## Purpose

What a consignor hears about their own consignments, and what happens to a
message that does not go out.

The events themselves belong to the capability that writes them; this is
what the consignor hears of them.

## Feature set

- What is sent
  - One message per event: every event either names a message or is decided
    silent
  - The set: Received, Agreement signed, On sale, Price changed, Sold,
    Payout date set, Paid, Ending soon, Ended unsold, Returned
  - Their language: by email, from the brand's catalogue, to the
    consignment's own address
- A message that fails
  - Flagged, not dropped: a message that runs out of attempts flags its
    consignment
  - Sent again: staff send it again
