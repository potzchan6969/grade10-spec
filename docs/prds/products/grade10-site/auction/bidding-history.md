---
title: Bidding History
spec: grade10-site/auction/bidding-history
order: 9
---

The account keeps one retained record of everything bidding did, so an
auditable money decision stays explainable without a support ticket. It lives
at the account's bids address and belongs to the storefront account alone —
no input a collector supplies reads anyone else's record, and there is no
control to delete or hide an entry, because the record is the audit.

In My Auctions, this is the Bidding tab. The [auction
record](/p/grade10-site/auction/account-record) owns the surrounding account
navigation, the Watching tab, and its account-level presentation; this
capability owns the Bidding index and the detailed story behind each listing.

## Index

Every listing the account submitted an automatic maximum on appears exactly
once, ordered by its latest activity, carrying the listing's identity, its
current or final price, and the collector's standing: pending, leading,
outbid, won, lost, canceled, or failed-only, which means every maximum
attempt was refused and nothing was accepted. An Active filter keeps what is
still running; Completed keeps what is done.

## Lot Personal Bidding

On the lot, a signed-in owner who has personal bidding activity opens
**Your bidding** beside the public recent-bids label. That dialog is the place
to re-read this lot's private maximum history and the bids Grade10 placed,
without leaving the page.

- 🚧 **Bid placed** — the auto-bid sequence Grade10 accepted for them on
  this lot, amount and time only; first tab and the default when the dialog
  opens (empty state when none yet)
- 🚧 **Your maximums** — every accepted configure or raise of that private
  cap, newest first, with amount and time only — no **Set** / **Raised**
  status on the row; second tab
- 🚧 **No dialog maximum summary** — the live private maximum stays on the
  bid panel only; the dialog is tabs and lists
- 🚧 **Owner only** — neither list shows another bidder's maximum, identity,
  or payment facts; the public recent-bids list stays public-only
- 🚧 **Refused attempts stay on the account** — a refused maximum is not on
  the lot dialog; it remains in the account chronology at `/bids`

## One listing's story

An entry opens into a single chronological explanation of that listing.
Every server-evaluated maximum action the collector took leaves a private
event — a maximum accepted, a maximum refused and why, or a private maximum
set or raised — interleaved with the public movements that changed their
standing. Private facts stay private: another bidder's maximum never
appears, only the public consequence that displaced them.

- 🚧 **Maximum labels** — configure and raise events read as a maximum set or
  raised (and refused as a refused maximum), matching the lot wording; there
  is no new account tab or maximums-only route

## Boundary outcomes

The auction engine keeps the challenger's accepted action before an automatic
response, caps a response at one increment above the next maximum, and keeps
an equal maximum with the earlier leader. The account story therefore reads
these boundary outcomes as follows:

| Incoming maximum | Public story |
| --- | --- |
| 450 | Refused below the next valid amount |
| 500 | Challenger at 500, then automatic response at 600 |
| 700 | Challenger at 700, then automatic response at 800 |
| 950 | Challenger at 950, then automatic response at 1000 |
| 1000 | One public response at 1000; the earlier leader remains ahead |
| 1001 | Challenger leads at 1001 |
| 1100 | Challenger leads at 1100 |
| 1120 | Challenger leads at 1100, one increment above the earlier maximum |

:::detail{title="Product decisions" for="pm"}
A collector can see what Grade10 bid for them and what their cap is now, but
cannot scan when they raised the ceiling and to what on the lot without
reading the full account chronology. Mixing maximums and bid steps under one
**Your bid** column causes support and trust confusion.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Bidder | On the lot, deciding whether to raise | Sees past accepted maximums and the bids Grade10 placed, without leaving the page. |
| Bidder | Outbid or closed | Still reads their last accepted maximum and their own bid steps privately. |
| Bidder | Auditing every refusal | Uses `/bids` chronology; the lot dialog does not duplicate refusals. |

**Not in scope.** A second bid-card link or maximum-only dialog. Stacked
full-height tables in one scroll. A new `/bids` filter, tab, or
maximums-only page. Refused maximums on the lot dialog. Maximum history on
the public recent-bids list. Manual-vs-automatic type badges on bid-sequence
rows. Lowering, cancelling, or editing a past maximum from history. Export,
share, or print. ZZZ storefront surfaces.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Lot dialog opens with both lists understood | Share of support tickets that confuse maximum vs bid-step on a lot after the dialog lands | Product |
| Raise after reading maximum history | Share of maximum raises that follow an open of **Your bidding** on the same lot | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Primary surface | Decided | Lot personal dialog only; entry and title **Your bidding** | Product |
| Layout | Decided | Two tabs in order — **Bid placed**, then **Your maximums** — not one merged table and not stacked full tables; no sticky **Your maximum now** in the dialog | Product |
| Live maximum | Decided | Current private maximum stays on the bid panel only | Product |
| Default tab | Decided | Always **Bid placed** (empty bids state when that list has no rows) | Product |
| Maximum rows | Decided | Accepted configure and raise caps only; amount and time only — no **Set** / **Raised** status on the row | Product |
| Bid-sequence rows | Decided | Auto-bid sequence Grade10 placed for the owner | Product |
| Privacy | Decided | Owner only; public recent bids unchanged | Product |
| Account `/bids` | Decided | Clearer maximum labels only; no new account tab | Product |
| Refused on lot | Decided | v1 keeps refusals on the account chronology only | Product |

**Risks.** A collector who only opens **Bid placed** may still miss a
raise history until they switch tabs; the live cap remains on the bid panel
behind the dialog.
:::
