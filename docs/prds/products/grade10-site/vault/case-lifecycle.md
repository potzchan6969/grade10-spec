---
title: Case Lifecycle
spec: grade10-site/vault/case-lifecycle
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
  repayment is live, and the item may be paid out again from there; a
  reversed repayment reopens `repaid → active`. The machine holds no other
  move back, so a correction anywhere else has nowhere to land
- **What is not a status** — a booking (a relationship the diary holds) and
  overdue (a computation against the clock)
- **One case, one item** — a unique index; a collector with three items
  sends three requests and books one visit on the first, because a case has
  never needed a booking of its own to be vaulted

:::flow{title="Intake to release"}
# Intake
The item is described online and gets on the diary.

## Collector — Open a draft
Details, then photos, then send; the loan amount is the lane.

## Collector — Send it in
`draft → submitted`, guarded on at least one photo.

## Collector — Book a visit
On the case, at any live status but a draft, so the visit can be booked
before the valuation or after the offer. The diary holds the seat and the
case caches it.

# Valuation and offer
What the item is worth and, on the financed lane, what the shop lends against
it.

## Staff — Start the valuation
`submitted → under_valuation`. A booking is marked completed only once its
slot has started, so a valuation from photographs leaves a future visit
open.

## Staff — Record a value
Every case, both lanes; appended, never edited; a figure below a standing
offer is refused.

## Staff — Make an offer
Financed lane: `under_valuation → offer_made`. Principal at most the
valuation and inside every bound the brand lends under — loan to value, the
rate band, the term presets, the accrual ceiling and how long an offer may
stay open. One gate applies all of them, and in production the offer is
refused outright while a bound or the lender's name is unset. A counter-offer
supersedes and inserts in one transaction; staff can also withdraw it back to
`under_valuation`.

## Collector or staff — Accept the offer
`offer_made → accepted`, from the collector's own case page or from the
counter, guarded on the offer not having expired. Declining the offer returns
the case to `under_valuation` with the offer closed, and the request stays
open for another. Custody terms agreed at the counter take either lane
`under_valuation → accepted` with no offer — a storage case always, and a loan
request the shop is not yet lending against — and either lane may end at
`declined` by staff here.

# Signing and custody
Who the collector is, what they sign, where the item goes.

## Bind the identity check
A verification id is bound to the case. No name, birth date or document number is
stored on the case, only the reference. The check behind it may have been walked
by the collector days earlier, reused from one they already passed, or recorded
by staff at the counter — the case holds the same reference either way.

## Staff — Explain the key terms
Financed lane: staff record that the terms were explained, with a recording
reference where there is one. Nothing else opens the loan packet.

## Staff — Prepare documents
`accepted → signing`; one packet, the custody agreement always and the loan
agreement when financed. The packet lives **24 hours**, or until a day after
the booked visit when there is one.

## Collector — Sign on the shop iPad
A single-use link or QR code, **30 minutes**, one device.

## Staff — Confirm vaulted
`signing → vaulted`, guarded on an executed packet. The shop the item is kept
at is required and the locker id is optional; a visit whose slot has started
is marked completed.

# The loan
Financed lane only.

## Treasurer — Record the payout
`vaulted → active`. The transfer already happened; the amount must equal the
principal, the bank reference is required, and the value date may be no
earlier than the day the paper was sealed. The term starts here: the due date
is computed from that value date and written on the payout row. The person
who made the offer may not be the person who pays it out.

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
| Accepted with no live booking | **30 days** from the move into `accepted` | the case, as `cancelled`, with the cancelled email |
| Signing with no live booking and nothing executed | **30 days** from the move into `signing` | the case, as `cancelled`, with the cancelled email |
| No-show before custody | **24 hours** after the slot | the case, as `expired`, with the missed-visit email |
| No-show on a case in custody | **24 hours** after the slot | the visit only, with the visit-missed email; the case stays and can book again |
| Offer open | a day staff pick, ending at midnight on the shop's clock, at most the brand's **7 days** | the offer, with an email; the case stays `offer_made` |
| Forfeiture notice | **14 days** of cure from the notice, ending at midnight on the shop's clock | nothing; until it passes the item may not be forfeited |
| Reminders | **7** and **1** days before the due date, then every **7** days overdue | nothing; the ladder stops at a forfeiture notice |
| Signing packet | **24 hours**, or a day past the booked visit | the packet only; staff prepare again |
| Signing link | **30 minutes**, one device | the link |
| Sweeps | every **15 minutes** and hourly | liveness only; every deadline is also enforced where it is read |

## The exits

- **Declined** — from `under_valuation`, by staff, with a reason the
  collector reads verbatim
- **Cancelled before custody** — from any status before the item is in the
  vault, by the collector on their own case, by staff, or by the abandonment
  sweep; whatever offer is live closes in the same transaction, the visit is
  cancelled with it, and the collector is told
- **The unwind** — `vaulted → cancelled`, only while no payout is live; it
  runs the release machinery but signs no release document
- **Forfeited** — `active → forfeited`, by staff, past the due date and
  never before the cure date of a written notice has passed; the item settles
  the debt, the figure it settled reaches the audit chain, and the collector
  is told. A visit still ahead is cancelled in the diary and one already past is
  marked a no-show, because calling it completed would say the borrower came
  in, which is the one thing a forfeiture establishes did not happen
- **Nothing unwinds past a live payout** — from `active` the way out is
  repayment, forfeiture, or a recorded reversal of the payout itself

## Specs and journeys

**Specs** — this page documents `grade10-site/vault/case-lifecycle`. The
requirements are its; this page holds the decision behind them.

::spec{id="grade10-site/vault/case-lifecycle"}

::journeys{id="grade10-site/vault/case-lifecycle"}

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
| The order of the flow is the customer's | Decided | Every live status but a draft takes a visit, so valuing from photographs, offering, accepting and then booking the drop-off walks without a forbidden step; the visit completes on the first counter act after its slot | Owner |
| A missed visit closes a visit | Decided | Only the abandonment clocks end a case, because a customer who rebooked must not lose their case overnight; the one exception is a submitted case, which has nothing to hold | Product |
| Collector cancel | Decided | The owner of a case may cancel it in every status before custody; the open offer closes and the visit is cancelled in the same move | Product |
| A clock on `accepted`, none on `repaid` | Decided | Terms agreed and never prepared run out on the same **30-day** abandonment clock as signing, anchored on the event that moved the case; a repaid loan keeps no clock, because the item is the collector's and storage is free | Product |
| What waits on a person, and what waits on a clock | Decided | Before acceptance a case badges somebody — nobody started it, nobody valued it in a week, the offer lapsed; after acceptance it runs a clock | Product |
| An ended case still names its visit | Decided | The cached booking is the record of where the item went; clearing it would erase that and write a cancellation nobody made | Engineering |
| Notice before forfeiture | Decided | No grace on the interest, and a written notice naming a cure date at least **14 days** off before anything may be taken | Owner |
| A different item at the counter | Decided | The case is the item, so a different one is a new case; this one is declined or cancelled | Product |
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
