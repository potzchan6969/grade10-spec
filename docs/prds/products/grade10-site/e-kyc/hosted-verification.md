---
title: Hosted Verification
spec: grade10-site/e-kyc/hosted-verification
order: 2
---

A collector who has booked a vault visit proves who they are on their own phone,
days before they travel. A verification provider hosts the check and decides it;
Grade10 renders none of it, asks for nothing the provider collects, and reads the
verdict when it arrives.

:::callout{kind="warning"}
Specified, not built. Today every verified identity is a member of staff typing
a document at a counter. This page describes the intended product.
:::

## What the collector does

:::flow{title="Verifying before the visit"}
## The invitation arrives
Booking an intake visit on a case with no verified identity sends the collector a
link, at the contact details the case already holds. Signing in is not required —
a case can exist before its collector ever has an account.
## The provider runs the check
The link opens the provider's own ceremony: photograph the document, photograph
your face, done. It is resumable, so a collector who stops halfway comes back to
where they were rather than to the beginning.
## The verdict comes back on its own
Minutes later, usually. Nobody waits for it — not the collector, not the case,
not an operator.
## Grade10 judges it again
Age and document validity are refused here, on the dates the provider returns,
not taken on the provider's word. The document images are pulled into Grade10's
own bucket before the identity is readable.
## The case is bound
The verified identity lands on the case the invitation named, and any signing
packet still out is voided — its paperwork was written from the identity this
replaces.
:::

## Where a check stands

| State | What it means | What the collector is told |
| --- | --- | --- |
| Invited | Asked, not started | Start it |
| Started | Opened, not finished | Carry on where you left off |
| Submitted | Finished, being decided | Nothing to do |
| Approved | Vouched for, and our own refusals passed | You are verified |
| Declined | Refused, by the provider or by us | Bring the document to the store |
| Expired | Ran out of time | Ask to be invited again |
| Withdrawn | The case no longer needs it | Nothing to do |

The last four are final. A collector who needs another chance is invited again,
as a new check — a decided check never moves.

One case holds one live check. Asking again while one is out hands back the one
the collector already has, so nobody ends up holding two invitations and
guessing.

## The counter is never gated

A collector with no smartphone, a document the provider cannot read, a provider
outage, a refused check — all of them are served by the check staff perform at
the counter, and none of them requires a hosted check to have been tried first.
Recording at the counter withdraws whatever hosted check was out.

:::detail{title="Product decisions" for="pm"}
Every identity check today happens inside an appointment: the collector hands
over a passport, staff type it, and a lapsed document is discovered with the
collector already in the shop. Moving the check to the collector's own phone
gives back the appointment, moves a document problem to somewhere it can be
fixed, and adds the liveness and tamper signals a person reading a document
cannot produce.

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
| Vendor | Decided | Persona — hosted government-ID and selfie check, verdict by webhook, and a redaction API, which is what makes vendor-side erasure deliverable. | Product |
| Vendor-neutral requirements | Decided | The spec describes a hosted check and names no vendor, so replacing one is a delivery decision. | Product |
| When it is asked for | Decided | On booking an intake visit, and on demand by an operator before custody. | Product |
| Sign-in | Decided | Not required. A case can exist before its collector has an account. | Product |
| Trust in a verdict | Decided | Proven to come from the provider, about a check we issued, acted on once. Anything else changes nothing and is recorded as rejected. | Engineering |
| Counter fallback | Decided | Permanent, and never gated on a hosted attempt. | Operations |
| Invitation and check lifetimes | ❓ Open | Days from invitation, hours from start. Must outlive a collector who books two weeks ahead. | Product |
| What a decline says | ❓ Open | A repeated reason teaches a fraudster what to fix; the operator and the collector may not see the same words. | Compliance |
| Whether a decline stands | ❓ Open | Whether staff may record a counter check on a case the provider declined, and what that is recorded as. | Compliance |
| Documents and countries | ❓ Open | Which of the four document types, and which issuing countries, the provider is configured for. | Compliance |

**Risks.** A verdict is a trust boundary the estate has never had — every
identity today is written by an authenticated operator. And a verdict can land
on a case that moved while it was in flight: sealed, erased, or past custody.
The case keeps the identity it had, and the check that arrived too late is
discarded rather than bound.
:::
