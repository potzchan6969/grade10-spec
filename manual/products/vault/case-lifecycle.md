---
title: Case Lifecycle
order: 1
---

A case walks a named list of statuses: `draft`, `submitted`, `under_valuation`,
`offer_made`, `accepted`, `signing`, `vaulted`, `active`, `repaid`, `released`,
and the ways out that are not a release — `declined`, `cancelled`, `expired`,
`forfeited`.

Which lane a case runs is decided at intake by one question: does the collector
want a loan against the item? A financing amount makes it the financed lane; no
amount makes it storage. The storage lane skips the offer, the payout and the
repayment entirely, and goes to `accepted` straight from `under_valuation` on
agreed custody terms.

:::flow{title="Intake to release"}
# Intake
The item arrives as a request and gets on the diary.

## Open a draft
The collector fills the request wizard — details, then photos, then send —
saying what they have and whether they want a loan against it.

## Submit
`draft → submitted`, guarded on at least one photo.

## Book a visit
On the case, or walk in. The appointment service is the source of truth and the
case caches the booking for display. Every diary refusal collapses to one code.

# Valuation and offer
What the item is worth, and — financed lane — what Grade10 will lend against it.

## Start the valuation
`submitted → under_valuation`, which also marks the booking completed if there
was one.

## Record a value
On every case, financed or not, because custody and insurance need one.

## Make an offer
Financed lane only: `under_valuation → offer_made`. A counter-offer is the same
move again — the open offer is superseded and the new one inserted in one
transaction. Staff can also dispute it back to `under_valuation`.

## Accept
`offer_made → accepted`, guarded on the open offer not having expired. The
storage lane arrives here from `under_valuation` instead. Either lane can exit at
`under_valuation → declined` — the item is refused and nothing has been signed.

# Signing and custody
Who the collector is, what they sign, and where the item goes.

## Record the identity check
A verification id is bound to the case. No name, birth date or document number is
stored on the case, only the reference.

## Prepare documents
`accepted → signing`, opening one packet — the custody agreement always, the loan
agreement second when financed.

## Sign in the shop
Staff mint a single-use signing ticket and hand it over as a link or a QR code.
The collector reads every page on the iPad, consents per document, and signs.

## Vault the item
`signing → vaulted`, guarded on an executed packet holding every document the
lane requires. A locker id is optional.

# The loan
Financed lane only. A storage case sits in the vault until the collector asks
for it back.

## Pay out
Financed lane: the treasurer records the payout — `vaulted → active`. The
transfer already happened; this records it, and it must equal the accepted
offer's principal.

## Repay
Each repayment carries the caller's idempotency key and the balance the caller
quoted; a disagreement is refused as a stale quote. When repayments satisfy what
is due, `active → repaid`.

# Release

## Ask for it back
The collector's request records the ask and nothing else. The item leaves custody
in person, against a signed release, on a pickup visit booked on the case.

## Release
Staff prepare a release packet — its own packet, because a separate visit weeks
later is a separate execution — the collector signs it, and the case closes at
`released`, guarded on nothing outstanding and no packet still open.
:::

## The exits that are not a release

- **Forfeiture** — `active → forfeited`, past due with a payout recorded. Manual,
  financed lane only. The item settles what was owed.
- **The unwind** — `vaulted → cancelled`, only while no payout has been recorded.
  It runs the release machinery but signs no release document, because the
  custody is being undone rather than discharged.
- **Cancelled before custody** — from `accepted` or `signing`, by staff or by the
  packet-expiry sweep.
- **Expired** — a draft or a submission, by sweep; a submitted case only after
  confirming it holds no live booking.

:::callout{kind="decision"}
**An unwind stops where the money starts.** Nothing unwinds past `active`: once a
payout is recorded, the way out is repayment or forfeiture, never a status
rewind.
:::

:::callout{kind="decision"}
Two statuses deliberately do not exist. There is no `appointment_booked`, because
a booking is a relationship rather than a state of the case. And there is no
`overdue`, because overdue is a computation against a clock, and a status would
be a cached answer that can be wrong.
:::

:::callout{kind="note"}
None of this is specified. The status list, the guards and the lanes are read
from the vault's own vocabulary module and its architecture doc; no OpenSpec
capability covers them, so there is no requirement to embed here and no test-case
suite traced to one.
:::

:::detail{title="Where the guards live" for="engineer"}
The vocabulary — statuses, terminal and bookable subsets, lanes, offer statuses,
custody movement kinds, repayment methods, document template ids, item categories
and the case-event kinds that make up a case's history — is
`packages/vault/contracts/src/vocabulary.ts`, mirrored in
[the architecture doc](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md).
Refusals are a closed list in `packages/vault/contracts/src/failures.ts`;
`OBLIGATIONS_OUTSTANDING`, `QUOTE_STALE`, `KYC_REQUIRED` and
`DOCUMENTS_INCOMPLETE` are the four that gate the moves above.

The automated half runs as sweeps in `packages/vault/backend/src/sweeps/`, each
work list tagged fast or slow and routine or repair: expired drafts,
submissions, offers and packets; booking repair, recovery, cancellation and
no-shows; sealed deliveries, cleared holds, deletion entries, identity releases
and discards, chain verification, object archiving, digest verification and
retention reviews.
:::
