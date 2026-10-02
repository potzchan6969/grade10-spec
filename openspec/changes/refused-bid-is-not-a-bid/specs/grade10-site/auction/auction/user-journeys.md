## Context user journeys

### grade10-site-auction-auction-US-12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

## ADDED User journeys

### grade10-site-auction-auction-US-13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a lot,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the lot keeps a leader and I never pay more than the price stood at before.

### grade10-site-auction-auction-US-14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** a refused bid to say why on the bid form and to leave no trace anywhere else,
**so that** I never read a bid I did not place as one I did.

## MODIFIED User journeys

### grade10-site-auction-auction-US-02: Collector places a bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US-04: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the lot closes.

### grade10-site-auction-auction-US-11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

## REMOVED User journeys

### grade10-site-auction-auction-US-03: Collector's card hold is released when they are outbid

**Reason:** a bid holds nothing on the card, so being outbid has nothing to release.
