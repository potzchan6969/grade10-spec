# Carry the member card in Apple Wallet and Google Wallet

**Author:** @ecchochan - 2026-09-04

Product context: [Profile](../../../docs/prds/products/grade10-site/loyalty/profile.md)
and [Shopify Integration](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md).
The vendor working notes are
[`docs/references/juicysuites.md`](../../../docs/references/juicysuites.md).

Depends on `add-shopify-membership-pos`, which opens the counter and carries
the identification arms this change re-cuts. That change lands first; this one
makes the card durable and puts it where a member already looks.

## Why

A member at the counter unlocks their phone, finds the site, signs in, opens
`/membership`, waits for a code to mint, and reads it against a ten-minute
countdown with a queue behind them. Nothing about a loyalty card needs that.
The code is single-use because it was designed as a credential, and the cost
of that decision is the whole distribution problem: a code that dies cannot
live on a lock screen, cannot be handed to Apple Wallet or Google Wallet, and
cannot be shown by a member whose phone has no signal in a basement shop.

A membership card is an identifier, not a secret. What protects a member's
points is that every act on them is read back, notified, audited and
reversible — not that the number was minted eight seconds ago.

The measurable claims: **share of in-store identifications made from a wallet
pass**, **median seconds from a member reaching for their phone to a till
session opening**, and **share of members holding a pass**.

## What Changes

- **The member card becomes one durable code**, stable across sessions and
  devices, rendered scannable and as a grouped typed form of the same value,
  and infeasible to guess against the whole membership. The mint, the
  countdown, the refresh and the replay refusal go with the dynamic code.
- **A member replaces their card in one action**, and an operator can replace
  it for them under the permission an elevated act requires. Replacement is
  immediate: the previous code identifies nobody.
- **The card records where it was used** — every identification, whether or not
  it led to an act — and offers the replacement beside that history. That is
  what a member acts on when a card leaks, and it replaces the guarantee the
  single-use code was carrying.
- **The card is added to Apple Wallet and to Google Wallet** from the
  membership surface and from the welcome message, carrying the member's name,
  tier, balance and the same code the card shows.
- **A pass stays current** — a change to any of those reaches every pass the
  member holds within fifteen minutes, and a burst of changes costs one
  refresh.
- **Spending on a scanned card becomes a switch**, so the owner can withdraw it
  and leave lookup and collection working, exactly as email spending already
  works.

## Non-Goals

- **NFC tap** — Apple VAS and Google Smart Tap both need certified reader
  hardware the counter does not have, and Apple needs its own NFC certificate.
- **A second brand** — ZZZ runs no till, so it gets no card and no pass.
- **A native application** — both passes are added from the web.
- **Offers, stamps and messages on the pass** — the pass carries identity,
  standing and the code, and links back to the membership surface for
  everything else.
- **Changing what a point is worth, how it is earned, or what a session may
  do** — the programme's rules and the till's acts are untouched.

## Capabilities

### Modified Capabilities

- `grade10-site/store/membership` — the member card stops being a minted
  credential and becomes a durable one the member holds, replaces and carries
  in a phone wallet. In-store identification, the till session, spending,
  attribution and pairing are otherwise untouched.

### Capabilities this one must agree with

- `grade10-site/store/membership` as `add-shopify-membership-pos` states it.
  That change introduces the capability and this one re-cuts one requirement
  inside it, so the two are edited together: the base change keeps the till —
  the email arm, the throttle, the session and the audit — and stops describing
  the code's lifetime, which this change owns. Whichever archives second reads
  the other first.
- `grade10-site/loyalty/programme` owns what a member sees about themselves.
  A pass is a second rendering of that, never a second source of it.

## Impact

- **Members** gain a card that opens from a lock screen, works with no signal,
  and survives being read out early.
- **Shopkeepers** scan the same barcode from a wallet, a browser or a printed
  card, and stop hearing that a code expired mid-queue.
- **The Grade10 site** loses the mint call, the countdown and the refresh from
  the membership surface, and gains the two wallet actions, the use history and
  the replacement.
- **`@grade10/ui`** — `MemberCard`'s contract changes shape: no countdown, no
  expiry, no refresh; the code, its typed form, the recent uses, the two wallet
  links and the replacement instead.
- **Apple** requires a Pass Type ID, its signing material, and an update
  service the passes call. **Google** requires an issuer account and a service
  account key. Both are per brand and neither exists yet.

## Open questions

- ❓ Does an identification with no act following it notify the member, or is
  the card's own use history enough? Stated here as history only.
- ❓ Does signing out everywhere, or an account recovery, replace the card
  automatically?
- ❓ How long does a card's use history run — the twenty uses the presentation
  list showed, or a dated window?
