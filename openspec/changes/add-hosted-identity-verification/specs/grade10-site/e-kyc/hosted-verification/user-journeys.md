## User journeys

### grade10-site-e-kyc-hosted-verification-US-01: Collector verifies their identity before travelling to the store

**As a** collector who has booked a vault visit,
**I want** to prove who I am on my own phone before I travel,
**so that** my appointment is about my card rather than my passport, and a
document problem reaches me at home.

**Accepted by:**

- `grade10-site-e-kyc-hosted-verification-SC-01` — A collector completes the check before arriving
- `grade10-site-e-kyc-hosted-verification-SC-02` — Grade10 asks for nothing the provider collects
- `grade10-site-e-kyc-hosted-verification-SC-03` — An invitation opens the check it names
- `grade10-site-e-kyc-hosted-verification-SC-13` — A repeated verdict is applied once
- `grade10-site-e-kyc-hosted-verification-SC-14` — A verdict that arrives late is still applied
- `grade10-site-e-kyc-hosted-verification-SC-15` — An approved verdict for a minor is Declined
- `grade10-site-e-kyc-hosted-verification-SC-16` — An approved verdict on an expired document is Declined

### grade10-site-e-kyc-hosted-verification-US-02: Collector picks up a check they left unfinished

**As a** collector who stopped halfway through an identity check,
**I want** to reopen it and see exactly where I am,
**so that** I finish it instead of starting again, and I know what to do when it
has run out or been refused.

**Accepted by:**

- `grade10-site-e-kyc-hosted-verification-SC-04` — A completed invitation does not open again
- `grade10-site-e-kyc-hosted-verification-SC-05` — An expired invitation is refused
- `grade10-site-e-kyc-hosted-verification-SC-06` — An unopened invitation expires
- `grade10-site-e-kyc-hosted-verification-SC-07` — An abandoned check expires rather than waiting forever
- `grade10-site-e-kyc-hosted-verification-SC-08` — A decided check does not move again
- `grade10-site-e-kyc-hosted-verification-SC-17` — A collector returning mid-check is shown where they are
- `grade10-site-e-kyc-hosted-verification-SC-18` — A declined collector is told what to do next
