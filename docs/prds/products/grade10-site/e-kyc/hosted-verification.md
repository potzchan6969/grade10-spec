---
title: Hosted Verification
spec: grade10-site/e-kyc/hosted-verification
order: 2
---

A collector who has booked a vault visit proves who they are on their own phone,
days before they travel. A verification provider hosts the check and decides it;
Grade10 renders none of it, asks for nothing the provider collects, and reads the
verdict when it arrives.

## What the collector does

:::flow{title="Verifying before the visit"}
## The invitation arrives
Booking an intake visit on a case with no verified identity sends the collector a
link, at the email address the case already holds. The collector signs in to
nothing: the link is the whole credential, and a case may exist before its
collector ever has an account.
## The provider runs the check
The link opens the provider's own ceremony: photograph the document, photograph
your face, done. It is resumable, so a collector who stops halfway comes back to
where they were rather than to the beginning.
## The verdict comes back on its own
Minutes later, usually. Nobody waits for it — not the collector, not the case,
not an operator.
## Grade10 judges it again
Age and document validity are refused here, on the dates the provider returns,
not taken on the provider's word. One image of the document is pulled into
Grade10's own bucket before the identity is readable; the face capture stays
with the provider, and what the record keeps of it is the finding.
## The case is bound
The verified identity lands on the case the invitation named, and any signing
packet still out is voided — its paperwork was written from the identity this
replaces.
:::

## Where a check stands

| State | What it means |
| --- | --- |
| Invited | Asked, not started |
| Started | Opened, not finished |
| Submitted | Finished, being decided |
| Stalled | Submitted, and the provider has not decided in the time it usually takes |
| Approved | Vouched for, and our own refusals passed |
| Declined | Refused, by the provider, by us, or because the case could not take it |
| Expired | Ran out of time |
| Withdrawn | The case no longer needs it |

Approved, Declined, Expired and Withdrawn are final. A collector who needs
another chance is invited again, as a new check — a decided check never moves.
Submitted never expires on its own, because a verdict may still arrive; it goes
stalled instead, so an operator can tell a check that is coming from one that is
not.

One case holds one live check. Asking again while one is out hands back the one
the collector already has, so nobody ends up holding two invitations and
guessing.

## The counter is never gated

A collector with no smartphone, a document the provider cannot read, a provider
outage — all served by the check staff perform at the counter, and none of them
requires a hosted check to have been tried first. Recording at the counter
withdraws whatever hosted check was out.

A counter check over a check the provider *declined* is different: it is an
override. It carries a reason, names who gave it, is refused without one, and
shows on the case beside the decline.

What it is *not*, yet, is four eyes. The intent was that an override take a
higher grant than an ordinary counter check — but `staff` holds `vault:approve`
wherever it holds `vault:operate`, and no other role holds either, so a grant
would separate nobody. The recorded reason is the control that works; the grant
becomes one the day a role separates the two, which is a `shared/auth/roles`
change and this change's open question.

:::detail{title="Product decisions" for="pm"}
The check is the collector's to complete, on their own device, because a
document read by a person at a counter produces no liveness or tamper signal,
cannot fail early enough to be fixed, and puts a legal name through a keyboard
on its way to a signature page.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Booked a visit, at home | Verifies in minutes, arrives ready. |
| Collector | Document lapsed | Finds out at home, not after travelling. |
| Collector | No smartphone | Verified at the counter, no worse off than today. |
| Vault operator | Meeting a collector | Appointment starts at the item, not the passport. |
| Compliance | Reviewing a signed agreement | Knows the face matched the document, not only that staff looked. |

**Not in scope.** Retiring the counter check. Verifying anybody outside a vault
case. Sanctions and watchlist screening. Re-verification on a schedule. Putting
a browser in front of the identity store.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Arrive verified | Share of intake visits whose collector was verified before arriving. | Product |
| Time to verified | Median hours from case submitted to identity verified. | Product |
| Drop-off | Share of invitations that expire without a decision. | Product |
| Fallback rate | Share of visits that still need a counter check. | Operations |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Vendor | Decided | Persona — hosted government-ID and selfie check, verdict by webhook, a redaction command, and org-level retention policies. | Product |
| The face stays with the provider | Decided | Grade10 runs no matching engine, so a stored selfie could never be re-compared. The record keeps what the provider checked and found. | Product |
| A decline is overridable, and recorded | Decided | The counter is never blocked, but an override carries a reason and takes the approving grant. | Compliance |
| Vendor-neutral requirements | Decided | The spec describes a hosted check and names no vendor, so replacing one is a delivery decision. | Product |
| When it is asked for | Decided | On booking an intake visit, and on demand by an operator before custody. | Product |
| Sign-in | Decided | Not required. A case can exist before its collector has an account. | Product |
| Trust in a verdict | Decided | Proven to come from the provider, about a check we issued, acted on once. Anything else changes nothing and is recorded as rejected. | Engineering |
| Counter fallback | Decided | Permanent, and never gated on a hosted attempt. | Operations |
| Invitation and check lifetimes | ❓ Open | 14 days and 24 hours provisionally. Must outlive a collector who books two weeks ahead. | Product |
| Which cases must hold an approved hosted check | ❓ Open | Until a class is named, no case is in it and the override is the only control. | Compliance |
| Lawful basis for the biometric processing | ❓ Open | A processor's face match on our instruction is special-category processing however it is stored. | Compliance |
| What a decline says | ❓ Open | A repeated reason teaches a fraudster what to fix; the operator and the collector may not see the same words. | Compliance |
| Documents and countries | ❓ Open | Which of the four document types, and which issuing countries, the provider is configured for. | Compliance |

**Risks.** A verdict is a trust boundary the estate has never had — every
identity today is written by an authenticated operator. And a verdict can land
on a case that moved while it was in flight: sealed, erased, past custody, or
verified at the counter in the meantime. The case keeps the identity it had, and
the check that arrived too late is discarded rather than bound.
:::
