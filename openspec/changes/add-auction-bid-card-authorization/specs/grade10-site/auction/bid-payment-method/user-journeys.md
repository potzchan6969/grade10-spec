## User journeys

### grade10-site-auction-bid-payment-method-US-01: Collector authorizes a first bid

**As a** signed-in collector,
**I want** to select a card and authorize my maximum before placing my first
bid on a listing,
**so that** I know the bid is backed by the card I chose.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-01` — First bid requires a payment method
- `grade10-site-auction-bid-payment-method-SC-02` — A selected payment method authorizes the maximum
- `grade10-site-auction-bid-payment-method-SC-03` — Payment authentication stays in the dialog
- `grade10-site-auction-bid-payment-method-SC-04` — A refused authorization does not place a bid

### grade10-site-auction-bid-payment-method-US-02: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-05` — A later bid retains the listing's payment method
- `grade10-site-auction-bid-payment-method-SC-06` — Raising a maximum raises the authorization

### grade10-site-auction-bid-payment-method-US-03: Collector is released when outbid

**As a** collector who has been outbid,
**I want** the hold on my card cancelled,
**so that** money is not held for a listing I cannot win.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-07` — An outbid cancels the authorization
- `grade10-site-auction-bid-payment-method-SC-08` — Provider outcomes remain idempotent
