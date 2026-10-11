## User journeys

### grade10-admin-auction-internal-bid-US-01: Admin protects a lot with an internal bid at a set time

**As an** auction admin,
**I want** to set a hidden house maximum on a listing, the internal bidder it bids as, and the time Grade10 commits it,
**so that** the lot cannot sell below what the house will accept, without a high starting price putting early bidders off.

### grade10-admin-auction-internal-bid-US-02: Admin changes an internal bid before its time

**As an** auction admin,
**I want** to change or remove the amount and the time until the internal bid is committed,
**so that** I can react to the market before the house has bid at all.

### grade10-admin-auction-internal-bid-US-03: Admin raises a committed internal bid

**As an** auction admin,
**I want** to raise the house maximum any time the lot still takes a bid,
**so that** I can keep protecting a lot that is running hotter than expected.

### grade10-admin-auction-internal-bid-US-04: Admin lowers a committed internal bid without moving the lead

**As an** auction admin,
**I want** to lower the house maximum when the leader and the current bid stay as they are,
**so that** I can loosen the protection without changing anything a collector has already seen.

### grade10-admin-auction-internal-bid-US-05: Admin learns an internal bid came too late

**As an** auction admin,
**I want** to see that an internal bid was not placed because the price had already passed it,
**so that** I can raise it or let the lot sell.

### grade10-admin-auction-internal-bid-US-06: Admin reads a lot the house bought in

**As an** auction admin,
**I want** a lot the house won to read Bought in, with no order and its stock released,
**so that** I can tell it from a sale and from a lot nobody bid on, and decide what to do with the card.

### grade10-admin-auction-internal-bid-US-07: Admin keeps protected lots secret from staff

**As an** auction admin,
**I want** operators without secret-floor access never to see an internal bid's amount or time, or learn that a lot has one before the house bids,
**so that** the house's floor stays known only to those allowed to set it.

### grade10-admin-auction-internal-bid-US-08: Admin learns a listing edit cleared the internal bid

**As an** auction admin,
**I want** to see that a change to a listing's window, starting price or currency cleared its internal bid,
**so that** I can set a new one before the lot sells unprotected.

### grade10-admin-auction-internal-bid-US-09: Admin keeps the internal bidders an internal bid can bid as

**As an** auction admin,
**I want** to add, rename and retire internal bidder profiles in auction admin,
**so that** each listing's internal bid can bid as the internal bidder I choose for it.
