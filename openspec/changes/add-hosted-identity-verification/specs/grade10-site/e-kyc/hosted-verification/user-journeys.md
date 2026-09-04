## User journeys

### grade10-site-e-kyc-hosted-verification-US-01: Collector verifies their identity before travelling to the store

**As a** collector who has booked a vault visit,
**I want** to prove who I am on my own phone before I travel,
**so that** my appointment is about my card rather than my passport, and a
document problem reaches me while I can still do something about it.

**Accepted by:**

- `grade10-site-e-kyc-hosted-verification-SC-01` — A collector completes the check before arriving
- `grade10-site-e-kyc-hosted-verification-SC-02` — Grade10 asks for nothing the provider collects
- `grade10-site-e-kyc-hosted-verification-SC-03` — An invitation opens the check it names
- `grade10-site-e-kyc-hosted-verification-SC-09` — Asking twice does not invite twice
- `grade10-site-e-kyc-hosted-verification-SC-11` — An unproven verdict changes nothing
- `grade10-site-e-kyc-hosted-verification-SC-12` — A verdict for a check nobody issued changes nothing
- `grade10-site-e-kyc-hosted-verification-SC-13` — A repeated verdict is applied once
- `grade10-site-e-kyc-hosted-verification-SC-14` — A verdict for a check that is no longer the case's live check binds nothing
- `grade10-site-e-kyc-hosted-verification-SC-15` — An approved verdict for a minor is Declined
- `grade10-site-e-kyc-hosted-verification-SC-16` — An approved verdict on an expired document is Declined

### grade10-site-e-kyc-hosted-verification-US-02: Collector falls back to the counter when the hosted check does not complete

**As a** collector whose check ran out, was refused, or never suited me,
**I want** the shop to check my document in front of me,
**so that** a check I could not finish costs me nothing but the counter's own
minute.

**Accepted by:**

- `grade10-site-e-kyc-hosted-verification-SC-04` — A completed invitation does not open again
- `grade10-site-e-kyc-hosted-verification-SC-05` — An expired invitation is refused
- `grade10-site-e-kyc-hosted-verification-SC-06` — An unopened invitation expires
- `grade10-site-e-kyc-hosted-verification-SC-07` — An abandoned check expires rather than waiting forever
- `grade10-site-e-kyc-hosted-verification-SC-08` — A decided check does not move again
- `grade10-site-e-kyc-hosted-verification-SC-10` — A withdrawn check frees the case to be invited again
- `grade10-site-e-kyc-hosted-verification-SC-17` — A collector returning mid-check is shown where they are
- `grade10-site-e-kyc-hosted-verification-SC-18` — A declined collector is told what to do next
- `grade10-site-e-kyc-hosted-verification-SC-19` — Staff record a check while a hosted one is live
- `grade10-site-e-kyc-hosted-verification-SC-20` — A counter check after a decline is recorded as an override
- `grade10-site-e-kyc-hosted-verification-SC-21` — A provider outage does not stop a visit
- `grade10-site-e-kyc-hosted-verification-SC-22` — A check the provider never decides is stalled rather than lost
