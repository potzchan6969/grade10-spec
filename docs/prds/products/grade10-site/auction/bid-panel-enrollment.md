---
title: Bid Panel Enrollment
spec: grade10-site/auction/bid-panel-enrollment
order: 24
---

Before a collector can choose a maximum, the bid panel settles sign-in and a
linked card.

## Panel States

| State | What the collector sees |
| --- | --- |
| **Signed out** | The primary bid action offers sign-in; recent public bids stay visible, with no standing badge |
| **No linked card** | Amount controls visible but disabled; only the primary action and the empty card slot open setup |
| **Card on file** | Amount controls enabled; a card linked on an earlier lot carries over |
| **Linked, before the first bid** | The card row offers Change |
| **Linked, after the first bid** | The card stays, without Change, for every later raise on this lot |
| **Authorization running** | Setup and the bid action wait while the card check runs |
| **Authorization failed** | The failure is shown and the controls stay usable |

## Setup

:::flow{title="Linking a card"}
## *Collector* — **Opens setup**
From the primary bid action or the empty card slot.
## *Provider* — **Takes the card**
In a provider-hosted field; card details never pass through Grade10.
## *Collector* — **Attests their age**
Once per account. Continue enables only with a card entered and the
attestation checked, and disables again if either is undone.
## *Panel* — **Links**
Continue reads Linking, the field and the attestation lock, and the modal
cannot be dismissed until it is done; closing before that leaves no card on
file.
## *Panel* — **Enables the amounts**
The linked card shows with a tooltip saying a hold is authorized for the
maximum on each bid and the card is charged only on a win; Change stays until
the first accepted bid.
:::

- **No hold in setup** — linking takes no hold; the hold, when holds are on,
  waits for the maximum — [Bid Card and
  Holds](/p/grade10-site/auction/bid-payment-method)
- **Change card** — the same modal, with the prior card shown and the
  attestation pre-checked
- **Enrolled** — an accepted first bid completes enrolment; what the panel
  says about auto-bidding belongs to
  [Auto-Bidding](/p/grade10-site/auction/auto-bidding)

::story{id="auction-listing-bid-panel--signed-out" title="Signed out"}

::story{id="auction-listing-bid-panel--need-card" title="Need card"}

::story{id="auction-listing-bid-panel-dialogs--setup-modal" title="Setup modal"}

::story{id="auction-listing-bid-panel-dialogs--setup-modal-linking" title="Setup linking"}

::story{id="auction-listing-bid-panel--linked-card-editable" title="Linked card with change"}

::story{id="auction-listing-bid-panel--linked-card" title="Linked card after first bid"}

::cases{id="grade10-site/auction/bid-panel-enrollment"}

:::detail{title="Product decisions" for="pm"}
A collector who can pick a maximum before they have a card abandons setup after
sign-in or asks whether a card from another lot already counts. Setup is link
and attest; the hold waits for commit so a new lot does not feel like
re-authorizing the same card.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Signed-in collector with no card | Opens a live lot | Sees disabled amount controls and a clear link-card action before they can bid. |
| Collector who linked on a prior lot | Opens a new lot | Sees the prior card and enabled amount controls without setup. |
| Collector who wants another card | Has not bid on this lot yet | Changes the linked card from the panel, then bids. |

**Not in scope.** Authorize or hold inside setup. A general account payment
manager. Changing the card after the first bid on that lot.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Link-to-bid-ready | Share of signed-in collectors who complete link-card setup and reach an enabled bid panel without abandoning. | Product |
| Repeat-lot setup skip | Share of collectors with a card on file who bid on a later lot without opening setup. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Link before amount | Decided | No linked card: presets and custom maximum stay visible but disabled; only Link a card to bid and the empty slot open setup. | Product |
| Setup is link only | Decided | Title Link a card to bid; body Link a card for bidding. When you set a maximum, we authorize a hold for that amount. You are only charged if you win.; continue Link Card. Setup itself does not take a hold. | Product |
| Card carries across lots | Decided | A linked card carries to a new lot; Grade10 does not force re-link. Change remains until the first bid on that lot. | Product |
| Hold on commit | Decided | When holds are enabled, authorize and hold run when the collector commits a maximum, under Bid Card and Holds — not in setup. | Product |
:::
