# Carry the member card in a phone wallet

**Author:** @ecchochan - 2026-09-04

Product context: [Profile](../../../docs/prds/products/grade10-site/loyalty/profile.md)
and [Shopify Integration](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md).
The vendor working notes are
[`docs/references/juicysuites.md`](../../../docs/references/juicysuites.md).

Depends on `add-shopify-membership-pos`, which creates the capability and the
counter this change adds a surface to. That change lands first and is untouched
here.

## Why

A member at the counter unlocks their phone, finds the site, signs in, opens
`/membership`, waits for a code to mint, and reads it against a ten-minute
countdown with a queue behind them. Every step needs signal, and a card shop
with a metal roof does not always have it.

None of that is the code's dynamism. It is the distribution: a code that has to
be fetched cannot live on a lock screen. A wallet pass fixes exactly that.

**Both wallets, on their own terms.** Google regenerates a pass's barcode on the
member's own device from a secret it already holds, so its code is current with
no network and a photograph is worthless within the minute. Apple has no such
mechanism and no prospect of one — a pass's barcode is a fixed string, changed
only by fetching a new pass over a network the counter may not have. So an
Apple code is durable, and it is made safe by what it is not allowed to do
rather than by how fresh it is: it identifies, and it neither spends points nor
collects a reward. Neither wallet carries a permanent right, which is the
property the counter actually needs.

The measurable claims: **share of counter identifications made from a pass, by
wallet**; **counter identifications that expire or replay before staff scan
them**, which a Google pass drives to zero; and **Apple identifications
followed by a spend on the site's card in the same visit**, which is what the
durable code costs a member.

## What Changes

- **A member adds their card to Google Wallet or Apple Wallet** from the
  membership surface and from the message that welcomes them, carrying their
  name, tier, balance and a scannable code.
- **A Google code rotates on the device** — regenerated on a fixed period from
  a secret the pass already holds, so it is current with no signal, and a code
  identifies at most once.
- **An Apple code is durable and identifies only** — the programme makes it and
  prints it into the pass, so it scans on every visit with no signal and needs
  nothing of the phone; it opens a session that reads the member's panel and
  refuses to spend points or collect a reward.
- **A member holds one pass per wallet**, and acting on one leaves the other
  untouched.
- **A pass identification is recorded as its own kind**, so how members reach
  the counter is countable from the first day rather than inferred later.
- **A member ends a pass in one action**, and an operator can end it for a
  member who asks. Ending is immediate: codes the ended pass makes identify
  nobody.
- **The pass follows the member's standing, one sweep behind** — the wallet
  holds a member's name, tier and balance by the end of the first sweep after
  they move, sweeps five minutes apart at most, whether the change was recorded
  or happened on its own; a burst of changes costs one update.
- **A pass speaks the languages the membership surface does** — its words are
  the surface's own, in every language the brand speaks, and the phone picks.
- **Erasing a member erases the pass**, retried until the wallet confirms it.

## Non-Goals

- **Spending or collecting from an Apple pass** — a durable code identifies and
  nothing more. Both stay behind a switch that is off, and a member who wants
  either is served by the card on the site.
- **Changing the member card** — the card on the site keeps minting a
  single-use code with its typed fallback. Nothing about the counter, the till
  session, the throttle or what a session may do moves.
- **NFC tap** — Google Smart Tap and Apple VAS both need certified reader
  hardware the counter does not have, and Apple's needs an entitlement besides.
- **A second brand** — ZZZ runs no till.
- **Offers, stamps and messages on the pass** — it carries identity and
  standing, and links back to the membership surface for the rest.

## Capabilities

### New Capabilities

None. This change delivers into the existing `grade10-site/store/wallet-member-card`
capability rather than opening a new one.

### Modified Capabilities

- `grade10-site/store/wallet-member-card` — the wallet pass in either wallet,
  the code each carries, what a session opened from one may do, its currency,
  and ending one. The durable spec already covers the pass row, its states,
  the sweep and erasure at the storage layer; this delta adds the member- and
  counter-facing behaviour on top and extends the storage-layer requirements
  it shares scenarios with.

### Capabilities this one must agree with

- `grade10-site/loyalty/programme` owns what a member sees about themselves. A
  pass is a second rendering of that, never a second source of it.

## Impact

- **Members** gain a card that opens from a lock screen and scans with no
  signal, and stop reading a code against a countdown.
- **Shopkeepers** scan a pass exactly as they scan the site's card. No new
  refusal, no new motion.
- **The Grade10 site** gains the save action on the membership surface; the
  member card itself is untouched.
- **`@grade10/ui`** gains one export, carrying one row per wallet so a member
  holding one is still offered the other. `MemberCard`'s contract does not
  change — no consuming application adapts.
- **Google** requires an issuer account, a service-account key, and publishing
  access. None exists, none is same-day, and the class needs its own review.
- **Apple** requires a Developer Program enrolment in the organisation's name, a
  pass type identifier per environment, a signing certificate that expires
  yearly, and an APNs key. None exists, and the enrolment is the slow step.

**Ordering.** `add-shopify-membership-pos` archives first — `depends_on` in
`.openspec.yaml` says so. This delta folds into the durable
`openspec/specs/grade10-site/store/wallet-member-card/`, the capability the
wallet page names, so its `## Feature set` group is merged into the durable
one by hand at archive.

**Scenario ids run SC-13 to SC-37 and journeys US-06 to US-08**, the next
unused after the durable spec's SC-01 to SC-12 and US-01 to US-05.

## References

- [Member Card in a Wallet · Wallets](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#wallets)
- [Member Card in a Wallet · Adding and Ending](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#adding-and-ending)
