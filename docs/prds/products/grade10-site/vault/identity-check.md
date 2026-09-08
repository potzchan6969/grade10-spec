---
title: Identity Check
spec: grade10-site/vault/identity-check
order: 4
---

The identity a case's agreements are signed under. The vault holds a reference
to it and nothing else — no name, no birth date, no document number — because
the record and the one hosted check live with [KYC](/p/grade10-site/account/kyc);
this page is what happens on site, and what a case demands of its identity.

## Getting an identity

- **Reuse first** — a check the collector already passed, anywhere in Grade10,
  is bound rather than asked for again
- **Before the visit** — an intake visit booked on a case with nothing to
  reuse sends the collector the hosted check, and an operator can send it
  again on any case that needs one, any time before custody
- **At the counter** — staff read the document in front of them and record it
  from the case screen; never gated on a hosted attempt having been tried
- **Pre-custody only** — recordable from draft through signing, never once the
  item is in the vault

## Counter check

:::flow{title="Recording at the counter"}
## Staff — Open the case
The identity panel on the case screen, on a case that has not yet reached
custody.
## Staff — Read the document
Legal name, date of birth, document type, number and expiry, from the document
in hand; one photograph of the document.
## Grade10 — Refuse what the record refuses
Under age and an expired document, judged on the day; the raw number becomes a
mask and a digest on the way in and is never kept.
## Grade10 — Bind
The identity lands on the case, and whatever hosted check was still out is
withdrawn.
:::

- **Over a decline, an override** — the counter is never blocked, but
  recording over a hosted check the provider declined carries a reason, names
  who gave it, is refused without one, and shows on the case beside the
  decline
- **Not four eyes, yet** — `staff` holds `vault:approve` wherever it holds
  `vault:operate`, and no other role holds either, so a higher grant would
  separate nobody; the recorded reason is the control that works, and the
  grant becomes one the day a role separates the two (a `shared/auth/roles`
  change)

## Identity states

::image{src="assets/diagrams/vault-identity-states.svg" alt="How a case moves between None, Out, Stalled, Verified, Lapsed and Refused"}

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

## Verdict

The identity binds under the case's own guard, and any signing packet still out
is voided: its documents were written from the identity this replaces. What the
bind displaces is settled rather than dropped — discarded when the new binding
stands, restored when it does not.

A verdict can arrive after the case has moved. A case in custody or beyond, one
holding sealed signing evidence, one whose personal data has been erased, and
one verified at the counter in the meantime all refuse it: the case keeps the
identity it had, the late check is discarded, and the operator is told. A
release packet reads the identity the executed agreement already holds, and an
erased case takes no new personal data at all.

## Gate

No identity, no paperwork. Documents are never rendered for a case with no
bound identity, and a packet whose identity changed between rendering and
sealing cannot be sealed — the paper would name a person the case no longer says
it is about. The name printed comes from the verified record and from nothing
anybody types.

:::detail{title="Product decisions" for="pm"}
The vault is where an identity is felt: who is asked, when, what the counter
can do when the hosted check cannot, and what happens to paperwork already
rendered when the answer changes.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Vault operator | Collector arrives verified | Starts at the item; no passport handling. |
| Vault operator | Collector arrives unverified | Checks the document and carries on, same as today. |
| Vault operator | Verdict lands mid-appointment | Sees it, and sees that the old packet is void. |
| Collector | No smartphone, or a document the provider cannot read | Verified at the counter, no worse off than today. |
| Collector | Verdict arrives after their case was sealed | Nothing changes underneath a signed agreement. |

**Not in scope.** Identity for any product but the vault. Retiring the counter
check. Changing which case statuses may record a check. Re-verifying a
collector whose document expires while their item is in custody.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Verified on arrival | Share of intake visits whose case already held an identity. | Operations |
| Time to verified | Median hours from case submitted to identity verified. | Product |
| Fallback rate | Share of visits that still need a counter check. | Operations |
| Late verdicts | Count of verdicts refused because the case had moved. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Invitation trigger | Decided | Booking an intake visit on a case with no identity, and an operator on demand before custody. | Product |
| Pre-custody only | Decided | A check is recordable from draft through signing, never once the item is in the vault. | Compliance |
| Reuse before asking | Decided | A case binds a check the collector already passed rather than paying for a second one. | Product |
| Counter fallback | Decided | Permanent, and never gated on a hosted attempt; the counter is equal evidence, so no case must hold an approved hosted check. | Operations |
| Override on a decline | Decided | The counter stays open, but over a decline it takes a recorded reason naming who gave it. No separate grant: no shipped role holds `vault:operate` without `vault:approve`, so one would separate nobody until the roles do. | Compliance |
| Late verdict | Decided | Refused, discarded, and reported. The case keeps what it had. | Engineering |
| Packet voiding | Decided | A bind voids an outstanding packet, whichever path produced the identity. | Product |
| Operator visibility | Decided | The case distinguishes out, stalled, refused and lapsed from none. | Design |
| Where the state is shown | Decided | Case detail alone. A column across every row would put a person's verification status on a screen nobody opened for it. | Design |

**Risks.**

- **A raced rebind** — the asynchronous verdict gives the existing rebind
  machinery a new way to be raced; it already settles a displaced check,
  discarding or restoring it, and now meets a race nobody at a counter could
  previously cause
- **A verdict landing late** — on a case that moved while it was in flight:
  sealed, erased, past custody, or verified at the counter; the case keeps the
  identity it had, and the late check is discarded rather than bound
:::
