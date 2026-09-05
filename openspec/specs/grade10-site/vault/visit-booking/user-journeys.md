## User journeys

### grade10-site-vault-visit-booking-US-01: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

**Accepted by:**

- `grade10-site-vault-visit-booking-SC-01` — A visit is booked after the offer
- `grade10-site-vault-visit-booking-SC-03` — A draft takes no visit
- `grade10-site-vault-visit-booking-SC-04` — A sibling case is vaulted without a visit
- `grade10-site-vault-visit-booking-SC-07` — A slot in the past is refused

### grade10-site-vault-visit-booking-US-02: Borrower books the visit they repay and collect on

**As a** borrower,
**I want** to book a visit while my loan is running,
**so that** I can pay the balance and take the item home in one appointment.

**Accepted by:**

- `grade10-site-vault-visit-booking-SC-02` — A live loan books its pickup
- `grade10-site-vault-visit-booking-SC-11` — A missed pickup keeps the case
- `grade10-site-vault-visit-booking-SC-13` — Taking the item in closes the visit

### grade10-site-vault-visit-booking-US-03: Collector moves a visit they cannot make

**As a** collector,
**I want** to move or cancel my visit up to the slot, and to hear about it
whether I moved it or the shop did,
**so that** missing one day does not cost me the case.

**Accepted by:**

- `grade10-site-vault-visit-booking-SC-05` — The same slot asked for twice is one visit
- `grade10-site-vault-visit-booking-SC-06` — Staff move a visit and the collector hears
- `grade10-site-vault-visit-booking-SC-08` — A stale copy is repaired rather than acted on
- `grade10-site-vault-visit-booking-SC-10` — A missed drop-off ends the request
