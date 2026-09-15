**Author:** @tangconst - 2026-09-15

## Why

When a lot stops taking bids, only the winner is told by email. Watchers and
losing bidders who kept email alerts on hear nothing at close — progress mail
stops at open / 24h-to-close / extended bidding, and order mail is winner-only.
Collectors who followed a lot then learn the outcome only if they reopen the
site.

A second failure mode is already visible in preview copy that was corrected:
a no-bids close letter must not say the lot did not sell or show a Highest
bid. Collector lot status is **Ended** for sold and unsold alike; disclosing
non-sale in mail contradicts that and confuses no-bids close with a later
winner default (走數).

**Metric:** share of enrolled non-winner and watcher closes that send exactly
one close-outcome letter before the collector next opens the lot or My
Auctions. **Guardrail:** zero no-bids close letters whose subject, preheader
or body uses unsold / did not sell / no sale / no bids, or that show a
Highest bid highlight.

## What Changes

- **Close-outcome letters on `notifications`** — when a lot closes, enrolled
  collectors who did not win receive one transactional letter (alerts on,
  same enrolment as progress mail):
  - **Non-winner** — someone else won; Winning bid and Their bid when supplied
    (campaign `lot_closed_didnt_win`)
  - **Watcher, sold** — watch-only; Sold for when a winning bid is supplied
    (campaign `lot_ended_watched`)
  - **No bids at close** — Ended only: watched letter without a winning amount
    and/or public campaign `lot_ended`; never Highest bid or non-sale wording.
    No-bids means nobody bid — not winner default. No bidder letter
- **Dedup** — a watcher who also bid gets the bidder close letter only. The
  winner gets only the auction-won order letter from
  `notifications-order`
- **Letter shape** — same shared auction letter; mute footer and campaign
  tags gain the close-outcome kinds

## Non-Goals

- **Winner order mail** — auction-won, invoice-sent, payment reminders,
  shipped / delivered / cancelled stay on `notifications-order`;
  `revise-auction-winner-invoicing` already rewrites auction-won
- **Address reminders** — cadence and copy stay open (❓ on Order
  Notifications); not delivered by this change
- **Hold release copy on the non-winner letter** — deferred (❓); My Auctions
  remains the hold record
- **Called-off notice** — called-off lots still send nothing further
- **Push, SMS, digests** — email only
- **React Email template filenames / preview paths** — stay on the emails PR;
  this change locks campaigns and outcomes only

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `grade10-site/auction/notifications`: close-outcome letters for watchers and
  non-winners, including Ended-only wording when the lot closes with no bids

## Impact

| Surface | Effect |
| --- | --- |
| Notification service | New close-outcome kinds; enrol and dedup against winner order mail |
| Send log | New message types beside the existing six |
| `apps/emails` | Preview templates for the kinds (implementation may trail) |
| Order Notifications | Unchanged here; address reminder remains open |

## Open questions

| Question | Who settles it |
| --- | --- |
| Hold line on the non-winner letter | Product |
| Address reminder count / hours (24h / 72h draft) | Product — follow-on on `notifications-order` |
| Whether no-bids sends watched Ended-only, public `lot_ended`, or both | Product |

## Follow-on changes

- Address reminders while a won order stays Awaiting Address, once cadence is
  confirmed
- Hold-release wording on the non-winner letter, if Product wants it beside
  My Auctions

## References

- [Notifications · Close Outcome](../../../docs/prds/products/grade10-site/auction/notifications.md#close-outcome)
- [Order Notifications](../../../docs/prds/products/grade10-site/auction/notifications-order.md) — address reminder stays ❓; not delivered here
