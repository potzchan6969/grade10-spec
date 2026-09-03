## User journeys

### shared-auth-audit-US-04: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

**Accepted by:**

- `shared-auth-audit-SC-15` — A trusted product creating an account is on the trail
- `shared-auth-audit-SC-16` — A trusted product finding an unverified account is not on the trail
- `shared-auth-audit-SC-17` — A trusted product finding a verified account is not on the trail
- `shared-auth-audit-SC-18` — A trusted product creating a verified account is on the trail
- `shared-auth-audit-SC-19` — A trusted product verifying an unverified account is on the trail
- `shared-auth-audit-SC-20` — A product-write entry names the system and the user id
- `shared-auth-audit-SC-25` — Deleting an account is on the trail
- `shared-auth-audit-SC-27` — An unrecorded product create does not create the account
- `shared-auth-audit-SC-28` — An unrecorded verify does not mark the account verified
- `shared-auth-audit-SC-32` — A trusted product verifying an already-verified account is not on the trail
- `shared-auth-audit-SC-34` — An unrecorded delete does not remove the account

### shared-auth-audit-US-05: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

**Accepted by:**

- `shared-auth-audit-SC-21` — Regenerating recovery codes is on the trail
- `shared-auth-audit-SC-22` — Enabling a second factor is on the trail
- `shared-auth-audit-SC-23` — Starting enrollment is not the enable entry
- `shared-auth-audit-SC-24` — Disabling a second factor is on the trail
- `shared-auth-audit-SC-26` — Recovery codes stay off the trail
- `shared-auth-audit-SC-29` — An unrecorded regenerate does not replace the codes
- `shared-auth-audit-SC-35` — A failed enable record leaves the factor active
- `shared-auth-audit-SC-36` — An unrecorded disable does not remove the factor
- `shared-auth-audit-SC-37` — A later proof records a missing enable
