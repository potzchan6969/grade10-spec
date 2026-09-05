## User journeys

### grade10-site-vault-identity-verification-US-01: Operator checks who is standing at the counter

**As a** member of shop staff,
**I want** to record the customer's document once, with a photograph of it,
**so that** the agreement they sign names the person we actually checked.

**Accepted by:**

- `grade10-site-vault-identity-verification-SC-01` — A check binds to the case
- `grade10-site-vault-identity-verification-SC-04` — Under eighteen is refused
- `grade10-site-vault-identity-verification-SC-06` — A document that lapsed before the signature is refused
- `grade10-site-vault-identity-verification-SC-08` — The case says nothing about the person

### grade10-site-vault-identity-verification-US-02: Returning customer is not asked for their passport again

**As a** collector who has used the vault before,
**I want** the check the shop already made to cover my new case,
**so that** I am not photographed a second time for the same document.

**Accepted by:**

- `grade10-site-vault-identity-verification-SC-09` — The last check binds to the new case
- `grade10-site-vault-identity-verification-SC-10` — A check that has aged out cannot be reused

### grade10-site-vault-identity-verification-US-03: Operator is warned when one document is on several accounts

**As a** member of shop staff,
**I want** to be told how many other accounts hold the same document, without
being told whose,
**so that** I can ask about it at the counter without the case being blocked
and without learning about somebody else's account.

**Accepted by:**

- `grade10-site-vault-identity-verification-SC-11` — A duplicate document flags the case
- `grade10-site-vault-identity-verification-SC-12` — The other accounts are never named

### grade10-site-vault-identity-verification-US-04: Collector collects an item on a passport that has since lapsed

**As a** collector,
**I want** my own property back even though the document I signed under has
expired since,
**so that** the shop's own rule does not cost me the thing it is holding.

**Accepted by:**

- `grade10-site-vault-identity-verification-SC-07` — A lapsed document does not hold somebody's property
- `grade10-site-vault-identity-verification-SC-13` — A signed case refuses a re-record
