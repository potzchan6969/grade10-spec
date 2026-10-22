# grade10-admin/auction/internal-bid Specification

## Feature set

- Internal bidder win
  - House order total: the operator's quote of an internal bidder's order reads like any HKD quote, one conversion of its USD lines into the HKD total

## MODIFIED Requirements

### Requirement: An internal bidder wins a lot the house leads at its close

When a USD listing closes with the house leading, per
`grade10-site/auction/auction`, the internal bidder its internal bid names
SHALL be the lot's winner for `grade10-site/auction/winner-order`,
`grade10-site/auction/notifications-order` and
`grade10-admin/auction/post-sale`, with the differences below. Collectors
still read the lot sold to the house's listing pseudonym.

At the close Grade10 SHALL open the lot's one auction order for that internal
bidder, per `grade10-site/auction/winner-order`, flagged **internal**:

| Order fact | For an internal bidder's order |
| --- | --- |
| Delivery address and billing address | The internal bidder's billing address as it stands at the close, kept as the order's snapshot; a later change to the profile does not rewrite the order |
| Setup | Confirmed at the close: the order reads Preparing Invoice, never Awaiting Setup or Setup Overdue |
| Settlement currency | HKD |
| Payment method | Bank transfer on FPS |
| Invoice | None at the close; an operator sends it, as for any order |
| Internal flag | Set at the close; it never changes |

An operator SHALL then run the order by hand, through the flows of
`grade10-admin/auction/post-sale`, as for any unpaid order:

1. Quote and send the invoice. Its payment deadline is 7 calendar days from
   the send.
2. Let the deadline pass. The invoice expires, per
   `grade10-site/auction/winner-order`.
3. Cancel the order with a category and a note. The lot returns to stock.

The quote of that order SHALL read as the quote of any HKD order: the USD lines
the operator and Grade10 set, then one Subtotal and total in HKD, one conversion
of those lines, per `grade10-admin/auction/post-sale`, "The quote is typed in USD
and read in the settlement currency".

Grade10 SHALL take none of these steps on its own. For an internal bidder's
order Grade10 SHALL also:

| Capability | What differs |
| --- | --- |
| `grade10-site/auction/notifications-order` | No letter of any kind - won, setup, invoice-sent, reminder, overdue, expiry, reissue, payment, shipping or cancelled - to the internal bidder or to anyone |
| `grade10-site/auction/bidder-suspension` | No suspension when its invoice expires: an internal bidder has no site account |
| `grade10-admin/auction/post-sale` | The cancel confirmation says no letter is sent, in place of the winner being emailed |

Every other fact of the order - its status, segment, addresses, invoice, logs
and timeline - SHALL read as for any order. What each operator reads of the
buyer and the listing:

| Operator | Orders worklist and the order's page | The listing's Listings row and own page |
| --- | --- | --- |
| Holds `auction:reserve` | Flagged internal; the buyer reads House, with the internal bidder's name and email label | Flagged as won by its internal bidder, naming it; the internal bid reads Placed at its last amount |
| Does not | Flagged internal; the buyer reads House, with no name, email or email label | As any won lot, with Open order |

A search of Orders by an email SHALL NOT match an internal bidder's email
label, for any operator.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-nl0 rev=3 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-71 - A lot an internal bidder wins opens its internal order
**Serves:** grade10-admin-auction-internal-bid-US-06 - the house's win opens an order the admin can run

- **GIVEN** a `USD` listing where the house leads at 10100 USD minor units
  with a Placed internal bid of 10100 as Harbour Cards, whose billing address
  is in Hong Kong
- **WHEN** the listing closes
- **THEN** Grade10 opens one auction order for Harbour Cards, flagged
  internal, at a winning bid of 10100 USD minor units
- **AND** the order holds Harbour Cards's billing address as its delivery and
  billing address, with HKD settlement and bank transfer on FPS, and reads Preparing Invoice
- **AND** no invoice is issued and no letter is sent

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-l6i rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-72 - A later change to the internal bidder's address leaves its order as it was
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin changes an internal bidder's address after it has won

- **GIVEN** the order of `grade10-admin-auction-internal-bid-SC-71`
- **WHEN** the admin changes Harbour Cards's billing address
- **THEN** Grade10 accepts it and Internal bidders shows the new address
- **AND** the order still holds the billing address Harbour Cards had at the
  close

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-6fc rev=4 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-73 - An operator sends the internal order's invoice and nobody is mailed
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin sends the invoice of the house's win

- **GIVEN** the order of `grade10-admin-auction-internal-bid-SC-71`, and an
  operator holding payment-processing
- **WHEN** they enter Shipping & Handling of USD10.01 and a bank transfer fee of 0
  USD, then send the invoice at 2026-11-03T09:00:00Z
- **THEN** the quote names bank transfer on FPS and reads a total of
  103000 minor units in HKD, the 13121 minor units in USD of the USD101
  winning bid, USD20.20 premium, USD10.01 shipping and USD0 bank transfer fee
  converted once at 7.85
- **AND** the invoice is `pending` with a payment deadline of
  2026-11-10T09:00:00Z, and the order reads Pending Payment
- **AND** no invoice-sent letter is sent

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-77a rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-74 - The internal order's invoice expires with no letter and no suspension
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin lets the invoice of the house's win expire

- **GIVEN** the invoice of `grade10-admin-auction-internal-bid-SC-73`, unpaid
- **WHEN** 2026-11-10T09:00:00Z passes
- **THEN** the invoice is `expired` and the order reads Payment Overdue
- **AND** no reminder, overdue or expiry letter was sent for the order
- **AND** no account is suspended

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-jzh rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-75 - An operator cancels the expired internal order and the lot returns to stock
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin closes the house's win as any unpaid order

- **GIVEN** the order of `grade10-admin-auction-internal-bid-SC-74`
- **WHEN** an operator opens Cancel
- **THEN** the confirmation says no letter is sent
- **AND** once they cancel with a category and a note, the order reads
  Cancelled, the lot's inventory status is available, and no cancelled letter
  is sent

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-rrc rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-76 - Staff read an internal order's buyer as House
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator without secret-floor access works the house's order

- **GIVEN** the order of `grade10-admin-auction-internal-bid-SC-71`
- **WHEN** an operator whose roles are exactly `staff`, and an admin holding
  `auction:reserve`, each read it in the Orders worklist and on its page
- **THEN** both see it flagged internal, with its buyer read as House
- **AND** the admin also reads Harbour Cards and
  harbour@internal.grade10.example
- **AND** the staff operator reads no name, email or email label for the
  buyer

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-u1p rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-77 - Only a reserve holder sees the listing flagged as the internal bidder's win
**Serves:** grade10-admin-auction-internal-bid-US-07 - operators read a closed lot the house won

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-71` after
  its close, and a second listing collector A won
- **WHEN** an admin holding `auction:reserve`, and an operator whose roles are
  exactly `staff`, each read both on the Listings table and on their own pages
- **THEN** the admin sees the first flagged as won by Harbour Cards, and the
  second not flagged
- **AND** the staff operator sees both as won lots, each offering Open order,
  and no flag on either

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-on5 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-78 - An internal bidder's email label matches no Orders search
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator looks for the house's order by its email label

- **GIVEN** the order of `grade10-admin-auction-internal-bid-SC-71`
- **WHEN** an admin holding `auction:reserve`, and an operator whose roles
  are exactly `staff`, each search Orders by harbour@internal.grade10.example
- **THEN** the search finds no order for either
