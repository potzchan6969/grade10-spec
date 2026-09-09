## User journeys

### grade10-site-auction-bid-payment-method-US-01: Collector authorizes a first bid on commit

**As a** signed-in collector with a linked card,
**I want** my maximum to authorize in the background when I commit,
**so that** I am not asked to confirm a hold in a separate modal.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-01` — Commit without a linked method is refused
- `grade10-site-auction-bid-payment-method-SC-02` — Linked method authorizes the maximum on commit
- `grade10-site-auction-bid-payment-method-SC-03` — Payment authentication stays on the bid surface
- `grade10-site-auction-bid-payment-method-SC-04` — A refused authorization does not place a bid
- `grade10-site-auction-bid-payment-method-SC-09` — Provider failure on commit does not place a bid
- `grade10-site-auction-bid-payment-method-SC-10` — Linked method carries over to a new listing
- `grade10-site-auction-bid-payment-method-SC-12` — Decline copy on the bid action
- `grade10-site-auction-bid-payment-method-SC-13` — Provider-failure copy on the bid action

### grade10-site-auction-bid-payment-method-US-02: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-05` — A later bid retains the listing's payment method
- `grade10-site-auction-bid-payment-method-SC-06` — Raising a maximum raises the authorization
- `grade10-site-auction-bid-payment-method-SC-11` — Raise authorization failure keeps the prior maximum
- `grade10-site-auction-bid-payment-method-SC-15` — An unsupported increment does not leave a pending bid

### grade10-site-auction-bid-payment-method-US-03: Collector is released when outbid

**As a** collector who has been outbid,
**I want** the hold on my card cancelled,
**so that** money is not held for a listing I cannot win.

**Accepted by:**

- `grade10-site-auction-bid-payment-method-SC-07` — An outbid cancels the authorization
- `grade10-site-auction-bid-payment-method-SC-08` — Provider outcomes remain idempotent
