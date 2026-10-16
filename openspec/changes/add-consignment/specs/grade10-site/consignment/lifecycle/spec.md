# grade10-site/consignment/lifecycle Specification

## Purpose

The consignment itself: an owner hands the house collectables to sell in
the store or at auction, from intake and the agreed terms through the sale
to the ending and the return.

The paper it signs is `grade10-site/consignment/documents`; the money is
`grade10-site/consignment/payout`; the consignor's own read is
`grade10-site/consignment/consignor-portal`; the counter it is worked from
is `grade10-admin/consignment/console`.

## Feature set

- Opening a consignment
  - Where it is taken: at the shop's counter or at an event such as a card
    show, the consignment recording where
  - Who consigns: an individual or a company, a company registering its own
    facts; whether a Grade10 account is linked
  - What is taken: graded collectables at launch; an ungraded item refused
  - The channel picked: the store or the auction, recorded at intake
  - Registered at intake: each item's market value and the consignment
    rates applying to it
- The terms
  - Price and floor: a list price and a floor agreed for each item before
    the agreement is prepared
  - At auction: the floor alone, which becomes the lot's start price and
    cannot be moved; no reserve
  - The schedule pinned: the commission, incentive, fees and term in force
    when the agreement is prepared stay with the consignment
- On sale
  - Checked before it publishes: an item passes intake inspection and
    photography before it is published
  - Logged on the form: each item is logged in Shopify when the consignment
    form is completed
  - One item one channel: one store product, or a draft lot staff place;
    never both
  - The first sale wins: a second sale of the same item is refunded
  - Within the floor: staff move the price without asking and the consignor
    is told; below it only on the consignor's written yes
  - The owner until delivery: the item stays the consignor's until the
    buyer has it
- A sale comes back
  - Reported on its own: the store and the auction report each sale,
    delivery and refund
  - Recorded by hand: only when a channel did not report it
- Ending
  - The term: on sale until the term ends, its remaining days counting
    down, warned at ending soon; the term's figure is unset
  - What an unsold item does: unsettled - the directions on the table are
    extending the term, a lower price, the other channel or a relist, the
    vault for long-term storage, or the consignor booking a collection at
    the shop or having it shipped back
  - Taken back early: before it sells, for the early take-back fee where
    one is set
- Returning
  - Tracked: an item going back travels under its tracking
  - Signed for: the return closes on the signed return receipt
