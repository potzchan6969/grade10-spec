# grade10-admin/consignment/console Specification

## Purpose

The Consignment section of the admin console: a queue of consignments cut
by what each one waits for, one consignment's page and the acts and flags
on it, the treasurer's payouts, and the settings and grants behind every
act.

The consignment itself is `grade10-site/consignment/lifecycle`; the money
it moves is `grade10-site/consignment/payout`.

## Feature set

- The queue
  - Cut by what waits: every consignment sits in exactly one view - New, To
    price, To sign, To list, On sale, Sold, Payout due, Ended unsold,
    Returning, Closed
  - Rows that explain: the consignor, each item's label code, the channel,
    the price, days on sale and a badge naming why it waits
  - Counts: each view carries its count, and every view adds up to all
- One consignment
  - The parts: the header, the items, the channel, the terms, the
    documents, the money and the timeline
  - Acts: receive - recording where it was taken, the channel and each
    item's market value and rates - set terms, prepare the agreement, list,
    change the price, take off sale, return, extend, move to the other
    channel or the vault
  - The rule first: a dialog states the rule before the act
  - Withheld in words: an act not offered says why
  - Flags: sold twice, out of step, cannot apply, price moved, amount
    differs, refund in part - dismissed once dealt with, raised again on a
    changed fact
- Payouts
  - The due list: every payout past its window, oldest first, with what it
    is made of
  - Recorded: the amount, the bank reference and the day the money left,
    with the statement to the consignor
  - Corrected: a second holder of the payout grant, never the one who
    recorded it
  - Exported: a period's payouts as a CSV, on the audit chain
- Settings
  - Every figure a setting: commission by channel and price band, the
    incentive, the minimum, fees, the term, the windows, when a consignor
    is paid, identity, ending soon
  - Pinned at the agreement: a change reaches the next agreement prepared;
    one waiting for a signature keeps its schedule
  - Unset refuses: an agreement is not prepared while a figure it prints is
    unset
- Who may act
  - Six grants: read, operate, approve, payout, display, settings - and two
    people for money, staff and treasurer sharing none
  - Second factor and audit: required in production, and every act filed
    under its consignment
