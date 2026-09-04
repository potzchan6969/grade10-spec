---
title: Case Lifecycle
order: 2
---

A case is one item, one collector and one path through fourteen statuses,
decided at intake by one question: does the collector want a loan against it.

- **Two lanes, one machine** — a financing amount at intake makes the
  financed lane; none makes storage
  1. **Financed** — `draft → submitted → under_valuation → offer_made →
     accepted → signing → vaulted → active → repaid → released`
  2. **Storage** — `draft → submitted → under_valuation → accepted → signing
     → vaulted → released`
- **Exits that are not a release** — `declined`, `cancelled`, `expired`,
  `forfeited`
- **What is not a status** — a booking (a relationship the diary holds) and
  overdue (a computation against the clock)
- **One case, one item** — a unique index; a collector with three items has
  three cases, and staff cannot open the siblings for them

:::flow{title="Intake to release"}
# Intake
The item is described online and gets on the diary.

## Collector — Open a draft
Details, then photos, then send; the loan amount is the lane.

## Collector — Send it in
`draft → submitted`, guarded on at least one photo.

## Collector — Book a visit
On the case, or by walking in. The diary holds the seat and the case caches
it; only a `submitted` case can book.

# Valuation and offer
What the item is worth and, on the financed lane, what Grade10 lends against
it.

## Staff — Start the valuation
`submitted → under_valuation`; marks any booking completed.

## Staff — Record a value
Every case, both lanes; appended, never edited; a figure below a standing
offer is refused.

## Staff — Make an offer
Financed lane: `under_valuation → offer_made`. Principal at most the
valuation; a counter-offer supersedes and inserts in one transaction; staff
can also withdraw it back to `under_valuation`.

## Staff — Record the acceptance
`offer_made → accepted` on staff's click, guarded on the offer not having
expired. The storage lane goes `under_valuation → accepted` on agreed terms.
Either lane may end at `declined` here.

# Signing and custody
Who the collector is, what they sign, where the item goes.

## Staff — Record the identity check
A verification id bound to the case; nothing about the person is stored on
it.

## Staff — Prepare documents
`accepted → signing`; one packet, the custody agreement always and the loan
agreement when financed. The packet lives **24 hours**.

## Collector — Sign on the shop iPad
A single-use link or QR code, **30 minutes**, one device.

## Staff — Confirm vaulted
`signing → vaulted`, guarded on an executed packet; the locker id is
optional.

# The loan
Financed lane only.

## Treasurer — Record the payout
`vaulted → active`. The transfer already happened; the amount must equal the
principal.

## Treasurer — Record repayments
Each carries the caller's key and the balance quoted; when the arithmetic says
settled, `active → repaid`.

# Release
The item goes home in person.

## Collector — Ask for it back
Records the ask; the item leaves on a pickup visit against a signed release.

## Staff — Release
A release packet of its own, signed; `repaid → released` or `vaulted →
released`, guarded on nothing outstanding and no packet open.
:::

## Timers

| Clock | Value | What ends |
| --- | --- | --- |
| Draft untouched | **7 days** | the case, as `expired`, with an email |
| Submitted with no live booking | **30 days** | the case, as `expired`, with an email |
| No-show after the slot | **24 hours** | the case, as `expired`, with the "sat unfinished" email |
| Offer open | a day staff pick, ending at midnight UTC | the offer; the case stays `offer_made`; no email |
| Signing packet | **24 hours** | the packet, then the case as `cancelled`; no email |
| Signing link | **30 minutes**, one device | the link |
| Sweeps | every **15 minutes** and hourly | liveness only; every deadline is also enforced where it is read |

## The exits

- **Declined** — from `under_valuation`, by staff, with a reason the
  collector reads verbatim
- **Cancelled before custody** — from `accepted` or `signing`, by staff or by
  the packet sweep
- **The unwind** — `vaulted → cancelled`, only while no payout is recorded;
  it runs the release machinery but signs no release document
- **Forfeited** — `active → forfeited`, by staff, any time after the due
  date; no grace period, no notice, no materiality test; the item settles the
  debt and the case owes nothing
- **Nothing unwinds past a payout** — from `active` the way out is repayment
  or forfeiture, never a status rewind

:::callout{kind="warning"}
Preparing documents ahead of the visit kills the case. Preparing moves the
case into `signing`, the packet expires after 24 hours, and the sweep then
cancels the case, a terminal status, with no email. Documents prepared on
Monday for a Thursday visit leave a `cancelled` case on Thursday.
:::

:::callout{kind="warning"}
Four moves a pawn counter makes every week have no transition: renew or extend
a live loan (an offer can only be made from `under_valuation` or
`offer_made`), book a visit on an `active` case, accept an offer as the
collector, and open a case at the counter for a walk-in.
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Lane at intake | Decided | The financing amount's presence is the lane; nothing later asks which kind of case this is | Product |
| No `overdue` status | Decided | Overdue is the due calculation against a clock; a status would be a cached answer that can be wrong | Engineering |
| No booking status | Decided | A booking is the diary's row; the case caches it for display and a sweep repairs drift | Engineering |
| Unwind stops at the payout | Decided | Once money left, the exits are repayment or forfeiture | Product |
| Order of the flow | ❓ Open | Built book-first; the owner's notes are offer-first (remote valuation, WhatsApp offer, acceptance, then a booking). Offer-first needs `under_valuation`, `offer_made`, `accepted` and `signing` bookable, and "valuation started" to stop meaning "visit happened" | Owner |
| Renewal | ❓ Open | A move that appends an offer to an `active` case and re-bases the due date; none exists | Owner |
| Repay-and-collect visit | ❓ Open | `active` bookable | Product |
| Early document preparation | ❓ Open | Expire the packet, not the case; let staff re-prepare from `accepted` | Engineering |
| Counter intake | ❓ Open | An operator intake for a walk-in, with or without an account, plus sibling cases and item edits | Product |
| Collector cancel | ❓ Open | No collector-side cancel before the visit | Product |
| Grace and notice before forfeiture | ❓ Open | None today | Owner |
| No-show | ❓ Open | Ends the case as `expired` with the draft's wording; a reschedule window and its own copy | Product |
:::

:::detail{title="For engineers" for="engineer"}
- **Vocabulary** — `packages/vault/contracts/src/vocabulary.ts`: statuses,
  terminal and bookable subsets, lanes, the from-column of every move, offer
  statuses, event kinds, categories, movement kinds, repayment methods,
  template ids
- **The machine** — `packages/vault/backend/src/cases/transitions.ts` is the
  only writer of the status; every move is a guarded update returning the
  row, with its history row in the same transaction, and zero rows is a named
  conflict
- **Refusals** — `packages/vault/contracts/src/failures.ts`;
  `OBLIGATIONS_OUTSTANDING`, `QUOTE_STALE`, `KYC_REQUIRED`,
  `DOCUMENTS_INCOMPLETE` and `PAYOUT_RECORDED` gate the moves above
- **Sweeps** — `packages/vault/backend/src/sweeps/`: expiry of drafts,
  submissions, offers and packets; booking repair, recovery and no-shows;
  delivery, archive, integrity, chain verification, retention review
- **Architecture** —
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md);
  its rebind sentence and its "where it lives" table are stale
:::
