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

## ADDED Requirements

### Requirement: Every message the consignor hears has words in each language

Each message in the set SHALL have its words in every language a consignor
reads, from the brand's catalogue, and SHALL go by email to the
consignment's own address.

#### Scenario: grade10-site-consignment-consignor-notifications-SC-01 - Every message has words
**Serves:** grade10-site-consignment-consignor-notifications-US-01 - the consignor hears each thing that happens

- **GIVEN** the message set: received, agreement signed, on sale, price changed, off sale, sold, payout date set, paid, ending soon, ended unsold and returned
- **WHEN** each is worded for a consignor reading English, Korean, Simplified or Traditional Chinese
- **THEN** every one has its words
