## User journeys

### grade10-site-vault-identity-check-US-01: Operator opens a case for a collector who verified before arriving

**As a** vault operator meeting a collector for their intake visit,
**I want** the case to already hold a verified identity and to say who checked
it,
**so that** the appointment starts at the item, and I can see at a glance
whether a check is on file, still out, or refused.

**Accepted by:**

- `grade10-site-vault-identity-check-SC-01` — Booking an intake visit invites the collector
- `grade10-site-vault-identity-check-SC-19` — A case nobody can be invited on is reported, not left silently unchecked
- `grade10-site-vault-identity-check-SC-02` — A collector already verified is not asked again
- `grade10-site-vault-identity-check-SC-04` — A case with a check out is not shown as unverified, and nothing waits on it
- `grade10-site-vault-identity-check-SC-05` — A verified case names who performed the check
- `grade10-site-vault-identity-check-SC-06` — Binding a verdict voids an outstanding packet
- `grade10-site-vault-identity-check-SC-12` — Preparing documents without an identity is refused
- `grade10-site-vault-identity-check-SC-13` — A packet whose identity moved cannot be sealed
- `grade10-site-vault-identity-check-SC-20` — A prepared document carries the bound identity's name
- `grade10-site-vault-identity-check-SC-16` — A case's identity state is readable, its details are not

### grade10-site-vault-identity-check-US-02: Operator records a check at the counter

**As a** vault operator whose collector arrives unverified,
**I want** to check the document in front of me and carry on,
**so that** a refused, lapsed or never-started check costs the visit nothing,
and a check that overrides a refusal says so on the case.

**Accepted by:**

- `grade10-site-vault-identity-check-SC-03` — An operator asks for a check on a case that needs one
- `grade10-site-vault-identity-check-SC-14` — Staff verify a collector who arrives unverified
- `grade10-site-vault-identity-check-SC-15` — A counter check is refused once the item is in custody
- `grade10-site-vault-identity-check-SC-17` — An override of a refused check carries a reason

### grade10-site-vault-identity-check-US-03: Operator settles a verdict that lands after the case has moved

**As a** vault operator on a case whose hosted verdict arrived late,
**I want** the case to keep the identity it already holds and to tell me what
landed,
**so that** nothing signed, vaulted or erased is disturbed by a check that
finished too late.

**Accepted by:**

- `grade10-site-vault-identity-check-SC-07` — The displaced identity is settled
- `grade10-site-vault-identity-check-SC-08` — A verdict landing after custody begins is refused
- `grade10-site-vault-identity-check-SC-09` — A verdict landing on sealed evidence is refused
- `grade10-site-vault-identity-check-SC-10` — A verdict landing on an erased case is refused
- `grade10-site-vault-identity-check-SC-11` — A refused landing leaves no half-finished state
- `grade10-site-vault-identity-check-SC-18` — A verdict landing on a case verified elsewhere is refused
