---
title: Identity Check
spec: grade10-site/vault/identity-check
order: 4
---

The identity a case's agreements are signed under. The vault holds a reference
to it and nothing else — no name, no birth date, no document number — because
the record itself lives in [the identity store](/p/grade10-site/e-kyc).

## How a case gets one

- **Reuse first** — a check the collector already passed is bound rather than
  asked for again
- **Booking asks** — an intake visit booked on a case with nothing to reuse
  invites the collector to [verify before travelling](/p/grade10-site/e-kyc/hosted-verification)
- **An operator asks** — again, on a case that needs one, any time before
  custody
- **The counter records** — staff read the document in front of them, from the
  case screen

## What the case shows

| Shown | Meaning |
| --- | --- |
| Verified | An identity is bound — who checked it, and when |
| Out | A hosted check is invited, started or submitted |
| Stalled | A hosted check was submitted and the provider has not decided |
| Refused | The last hosted check was declined, and why |
| Lapsed | The last hosted check expired or was withdrawn |
| None | Nothing has been asked for |

A case with a check still out is not a case with no identity, and the screen
says which — an operator arranging a visit needs to know the difference.

## When the verdict lands

The identity binds under the case's own guard, and any signing packet still out
is voided: its documents were written from the identity this replaces. What the
bind displaces is settled rather than dropped — discarded when the new binding
stands, restored when it does not.

A verdict can arrive after the case has moved. A case in custody or beyond, one
holding sealed signing evidence, one whose personal data has been erased, and
one verified at the counter in the meantime all refuse it: the case keeps the identity it had, the late check is discarded, and
the operator is told. A release packet reads the identity the executed agreement
already holds, and an erased case takes no new personal data at all.

## The gate

No identity, no paperwork. Documents are never rendered for a case with no
bound identity, and a packet whose identity changed between rendering and
sealing cannot be sealed — the paper would name a person the case no longer says
it is about. The name printed comes from the verified record and from nothing
anybody types.

:::detail{title="Product decisions" for="pm"}
The vault is the only product that verifies anybody today, so its case is where
every identity decision is felt: who is asked, when, and what happens to
paperwork already rendered when the answer changes.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Vault operator | Collector arrives verified | Starts at the item; no passport handling. |
| Vault operator | Collector arrives unverified | Checks the document and carries on, same as today. |
| Vault operator | Verdict lands mid-appointment | Sees it, and sees that the old packet is void. |
| Collector | Verdict arrives after their case was sealed | Nothing changes underneath a signed agreement. |

**Not in scope.** Identity for any product but the vault. Changing which case
statuses may record a check. Re-verifying a collector whose document expires
while their item is in custody.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Verified on arrival | Share of intake visits whose case already held an identity. | Operations |
| Late verdicts | Count of verdicts refused because the case had moved. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Invitation trigger | Decided | Booking an intake visit on a case with no identity. | Product |
| Pre-custody only | Decided | A check is recordable from draft through signing, never once the item is in the vault. | Compliance |
| Reuse before asking | Decided | A case binds a check the collector already passed rather than paying for a second one. | Product |
| Override on a decline | Decided | The counter stays open, but over a decline it takes a recorded reason naming who gave it. No separate grant: no shipped role holds `vault:operate` without `vault:approve`, so one would separate nobody until the roles do. | Compliance |
| Late verdict | Decided | Refused, discarded, and reported. The case keeps what it had. | Engineering |
| Packet voiding | Decided | A bind voids an outstanding packet, whichever path produced the identity. | Product |
| Operator visibility | Decided | The case distinguishes out, stalled, refused and lapsed from none. | Design |
| Where the state is shown | Decided | Case detail alone. A column across every row would put a person's verification status on a screen nobody opened for it. | Design |

**Risks.** The asynchronous verdict gives the existing rebind machinery a new
way to be raced. It already settles a displaced check — discarding or restoring
it — and this change hands it a race nobody at a counter could previously
cause.
:::
