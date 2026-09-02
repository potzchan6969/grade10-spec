# Open the loyalty programme to the physical shop

**Author:** @ecchochan - 2026-08-22

Product context: [Grade10 loyalty programme](../../../docs/prds/products/membership/index.md).
The engineering design record is [`design.md`](design.md);
[`docs/references/shopify-membership-pos.md`](../../../docs/references/shopify-membership-pos.md)
and
[`docs/references/shopify-pos-extension.md`](../../../docs/references/shopify-pos-extension.md)
carry the longer working notes.

Depends on `revise-loyalty-programme-rules`, which carries the programme's own
rules — tier validity, the two counts, activity-based expiry, the earning order,
points paying at HKD 1, and reward fulfilment. That change lands first; this one
adds the channel.

## Why

Collectors who buy in the shop are anonymous guests. Nothing at the till can say
who they are, so their purchases earn no points, staff see no tier or balance,
and points cannot pay for anything face to face — in the channel that carries
the majority of card sales. The programme is live online and attributes every
order there, so the gap is exactly the physical one.

The measurable claims: **share of physical-store transactions attributed to a
member**, and **staff-assisted redemptions completed per week**.

## What Changes

- **Every member gains exactly one commerce customer**, paired server-side in a
  way that never blocks sign-up and either converges or parks visibly. The
  record carries an opaque key, adopts only verified identity, and erasure
  removes it irreversibly.
- **A member is identified at the till** by a dynamic single-use code from their
  member card or by their exact email, opening a time-limited session that
  authorizes staff to read and act for them with no confirmation on the member's
  device. Every act is audited and the member is notified.
- **Staff spend points and hand over rewards on a member's behalf**, and a sale
  cancelled after tender takes the spend back.
- **A physical reward waits to be collected in person** — paid for, parked, and
  completed by an explicit confirmation at handover that cannot happen twice.
- **A reward may be priced per unit** and redeemed in a quantity, bounded per
  redemption and per member per day.
- **Points become a single-use, member-scoped money-off code** both checkouts
  accept.
- **Physical-store orders join the same money-event pipeline** — ingested
  exactly once, attributable to a member afterwards by evidence, with refunds
  kept exactly-once even before an owner is known.
- **The till degrades to a normal sale, never a blocked one**, with kill
  switches that stop spending without stopping selling.

## Non-Goals

- **The programme's own rules** — tiers, earning, expiry, and what a point is
  worth all belong to `revise-loyalty-programme-rules`.
- **Phone numbers, SMS verification, and phone lookup** — the member card and
  email carry identification.
- **Wallet passes** (Apple/Google) — post-launch at most.
- **A member-facing guest-claim flow** — attributing a past guest order is an
  operator action here.
- **The physical reward menu's content** — which items, their point prices, the
  collection window's length, and how counter stock decrements.

## Capabilities

### New Capabilities

- `grade10-site/store/membership` — the member's commerce identity and the
  physical-store surface: pairing, in-store identification and till sessions,
  staff-assisted spending, money-off code conversion, order ingestion and
  attribution, and channel-uniform earn eligibility.

### Modified Capabilities

- `grade10-site/loyalty/programme`: redemption gains a per-unit quantity and a
  collect-in-person lifecycle. Nothing else about the programme changes here.

### Capabilities this one must agree with

- `grade10-site/store/shopify-commerce` (active change `add-grade10-shopify-store`)
  owns the online store's one-to-one account-to-customer link, including the
  guest checkout that creates both. This change owns what that pairing means to
  a member — the opaque key, erasure, and what may be adopted into an account
  that already existed. Neither may redefine the other's half, and whichever
  archives second reads the other first.

## Impact

| Application | What it must do |
| --- | --- |
| `grade10-store` backend | Pair members with commerce customers, ingest and attribute physical-store orders, and serve the till |
| `grade10-loyalty` backend | Park and complete pending collections; take a quantity on a per-unit redemption |
| POS extension | A new deliverable with its own deploy lane: identify a member, show their panel, spend and hand over on their behalf |
| `grade10-loyalty` console | Attribution and its undo |
| `grade10-loyalty` membership surface | The member card, and rewards awaiting collection |

The commerce provider additionally needs a second dev shop for staging, three
extension-only apps, one metafield definition, and customer and order webhook
subscriptions.

**Migration.** Every existing member needs a paired customer. The pairing path
is idempotent and parks what it cannot resolve, so the backfill runs as a
re-runnable sweep rather than a one-shot.

**Open decisions**, recorded in the PRD rather than resolved here: the physical
reward menu's content, and the per-redemption and daily quantity bounds.
