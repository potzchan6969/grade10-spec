## User journeys

### grade10-site-vault-valuation-and-offer-US-01: Operator prices a loan against an item they have valued

**As a** member of shop staff,
**I want** to record what the item is worth and write terms the brand's own
bounds allow,
**so that** no loan leaves the counter above what the item is worth or outside
what the business lends.

**Accepted by:**

- `grade10-site-vault-valuation-and-offer-SC-01` — A re-valuation is appended
- `grade10-site-vault-valuation-and-offer-SC-04` — An offer above the valuation is refused
- `grade10-site-vault-valuation-and-offer-SC-06` — A rate above the band is refused
- `grade10-site-vault-valuation-and-offer-SC-08` — A term the brand does not write is refused
- `grade10-site-vault-valuation-and-offer-SC-13` — A counter-offer replaces the first

### grade10-site-vault-valuation-and-offer-US-02: Collector answers an offer from their own phone

**As a** collector,
**I want** to accept or decline the offer on my case wherever I am reading it,
**so that** I can say yes before I come in, or say no and still be offered
something else.

**Accepted by:**

- `grade10-site-vault-valuation-and-offer-SC-14` — A declined offer leaves the request open
- `grade10-site-vault-valuation-and-offer-SC-16` — A collector accepts from their own case
- `grade10-site-vault-valuation-and-offer-SC-17` — An offer that lapsed cannot be accepted
- `grade10-site-vault-valuation-and-offer-SC-18` — Accepting costs nothing yet

### grade10-site-vault-valuation-and-offer-US-03: Collector who only wants storage agrees terms

**As a** collector who asked for no loan,
**I want** custody terms agreed against the recorded valuation,
**so that** the item can be taken in without anybody writing a loan I did not
ask for.

**Accepted by:**

- `grade10-site-vault-valuation-and-offer-SC-03` — Terms need a valuation
- `grade10-site-vault-valuation-and-offer-SC-12` — Custody still opens
- `grade10-site-vault-valuation-and-offer-SC-19` — Storage terms need only the valuation
