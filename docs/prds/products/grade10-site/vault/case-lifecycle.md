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
- **Two moves back** — a reversed payout returns `active → vaulted` while no
  repayment is live; a reversed repayment reopens `repaid → active`
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
it.

# Valuation and offer
What the item is worth and, on the financed lane, what the shop lends against
it.

## Staff — Start the valuation
`submitted → under_valuation`; marks any booking completed.

## Staff — Record a value
Every case, both lanes; appended, never edited; a figure below a standing
offer is refused.

## Staff — Make an offer
Financed lane: `under_valuation → offer_made`. Principal at most the
valuation, and within the brand's loan-to-value cap, rate band and term
presets where those are set; the expiry must fall after now and before the
loan's own due date. A counter-offer supersedes and inserts in one
transaction; staff can also withdraw it back to `under_valuation`.

## Staff — Record the acceptance
`offer_made → accepted` on staff's click, guarded on the offer not having
expired. The storage lane goes `under_valuation → accepted` on agreed terms.
Either lane may end at `declined` here.

# Signing and custody
Who the collector is, what they sign, where the item goes.

## Staff — Record the identity check
A verification id bound to the case, or the collector's last check reused
under the same refusals; nothing about the person is stored on the case.

## Staff — Prepare documents
`accepted → signing`; one packet, the custody agreement always and the loan
agreement when financed. The packet lives **24 hours**, or until a day after
the booked visit when there is one.

## Collector — Sign on the shop iPad
A single-use link or QR code, **30 minutes**, one device.

## Staff — Confirm vaulted
`signing → vaulted`, guarded on an executed packet; the locker id is
optional.

# The loan
Financed lane only.

## Treasurer — Record the payout
`vaulted → active`, refused when the offer is already past due. The transfer
already happened; the amount must equal the principal and the bank reference
is required.

## Treasurer — Record repayments
Each carries the date the money reached the bank, the recorder's key and the
balance quoted at that date; when the arithmetic says settled, `active →
repaid`.

# Release
The item goes home in person.

## Collector — Ask for it back
Records one ask while the item is held; the item leaves on a pickup visit
against a signed release.

## Staff — Release
A release packet of its own, signed; `repaid → released` or `vaulted →
released`, guarded on nothing outstanding and no packet open.
:::

## Timers

| Clock | Value | What ends |
| --- | --- | --- |
| Draft untouched | **7 days** | the case, as `expired`, with the untouched email |
| Submitted with no live booking | **30 days** | the case, as `expired`, with the unbooked email |
| Signing with no live booking and nothing executed | **30 days** | the case, as `cancelled`, with the cancelled email |
| No-show before custody | **24 hours** after the slot | the case, as `expired`, with the missed-visit email |
| No-show for a pickup | **24 hours** after the slot | the visit only; the case stays and can book again |
| Offer open | a day staff pick, ending at midnight UTC, never past the due date | the offer, with an email; the case stays `offer_made` |
| Signing packet | **24 hours**, or a day past the booked visit | the packet only; staff prepare again |
| Signing link | **30 minutes**, one device | the link |
| Sweeps | every **15 minutes** and hourly | liveness only; every deadline is also enforced where it is read |

## The exits

- **Declined** — from `under_valuation`, by staff, with a reason the
  collector reads verbatim
- **Cancelled before custody** — from `accepted` or `signing`, by staff or by
  the abandonment sweep; the collector is told
- **The unwind** — `vaulted → cancelled`, only while no payout is live; it
  runs the release machinery but signs no release document
- **Forfeited** — `active → forfeited`, by staff, any time after the due
  date; no grace period, no notice, no materiality test; the item settles the
  debt, the figure it settled reaches the audit chain, the diary closes any
  visit, and the collector is told
- **Nothing unwinds past a live payout** — from `active` the way out is
  repayment, forfeiture, or a recorded reversal of the payout itself

:::callout{kind="warning"}
Four moves a pawn counter makes have no transition: renew or extend a live
loan (an offer can only be made from `under_valuation` or `offer_made`),
accept an offer as the collector, open a case at the counter for a walk-in,
and let a collector cancel their own request. Renewal is open on
[Loan and Money](/p/grade10-site/vault/loan-and-money) and counter intake on
[Operator Console](/p/grade10-site/vault/operator-console).
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Lane at intake | Decided | The financing amount's presence is the lane; nothing later asks which kind of case this is | Product |
| No `overdue` status | Decided | Overdue is the due calculation against a clock; a status would be a cached answer that can be wrong | Engineering |
| No booking status | Decided | A booking is the diary's row; the case caches it for display and a sweep repairs drift | Engineering |
| A packet expiring ends nothing | Decided | The ceremony's window and the case's abandonment are two clocks; only the second is terminal | Engineering |
| A live loan books its visit | Decided | `active` is bookable; a missed pickup closes the visit, never the case | Product |
| A reversal moves the case back | Decided | A reversed payout returns the case to `vaulted`; a reversed repayment reopens the loan | Product |
| Unwind stops at a live payout | Decided | Once money left and stands, the exits are repayment or forfeiture | Product |
| Order of the flow | ❓ Open | Built book-first; the owner's notes are offer-first (remote valuation, WhatsApp offer, acceptance, then a booking). Offer-first needs `under_valuation`, `offer_made`, `accepted` and `signing` bookable, and "valuation started" to stop meaning "visit happened" | Owner |
| Collector cancel | ❓ Open | No collector-side cancel before the visit | Product |
| Grace and notice before forfeiture | ❓ Open | Grace days are a lending-policy value, unset; notice needs the reminder kinds | Owner |
:::

:::detail{title="For engineers" for="engineer"}
- **Vocabulary** — `packages/vault/contracts/src/vocabulary.ts`: statuses,
  terminal and bookable subsets, lanes, the from-column of every move, offer
  statuses, event kinds with the staff-only subset, categories, movement
  kinds, repayment methods, template ids
- **The machine** — `packages/vault/backend/src/cases/transitions.ts` is the
  only writer of the status; every move is a guarded update returning the
  row, with its history row in the same transaction, and zero rows is a named
  conflict
- **Refusals** — `packages/vault/contracts/src/failures.ts`;
  `OBLIGATIONS_OUTSTANDING`, `QUOTE_STALE`, `KYC_REQUIRED`,
  `DOCUMENTS_INCOMPLETE`, `PAYOUT_RECORDED` and `PAYOUT_ALREADY_RECORDED`
  gate the moves above
- **Sweeps** — `packages/vault/backend/src/sweeps/`: expiry of drafts,
  submissions, abandoned signing, offers and packets; booking repair,
  recovery and no-shows across every bookable status; notification retries;
  delivery, archive, integrity, chain verification, retention review, overdue
  loans
- **Architecture** —
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
:::
