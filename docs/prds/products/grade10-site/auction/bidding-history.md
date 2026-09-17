---
title: Bidding History
spec: grade10-site/auction/bidding-history
order: 26
---

The account keeps one retained record of everything bidding did, so an
auditable money decision stays explainable without a support ticket.

## The Index

In My Auctions this is the Bidding tab; [My
Auctions](/p/grade10-site/auction/account-record) owns the surrounding
navigation and the Watching tab.

- **One row per listing** — every listing the account submitted a maximum
  on, ordered by its latest activity
- **What a row carries** — the listing, its current or final price, and the
  collector's standing
- **Standing** — pending, leading, outbid, won, lost, canceled, or
  failed-only, which means every maximum attempt was refused and nothing was
  accepted
- **Filters** — Active keeps what is still running; Completed keeps what is
  done
- **Owner only** — the record belongs to the storefront account alone; no
  input reads anyone else's, and nothing deletes or hides an entry, because
  the record is the audit

## One Listing's Story

An entry opens into one chronological explanation of that listing.

- **Private events** — every server-evaluated maximum action leaves one: a
  maximum accepted, a maximum refused and why, or a maximum set or raised
- **Public movements** — interleaved with the private events, the movements
  that changed the collector's standing
- **Private stays private** — another bidder's maximum never appears, only
  the public consequence that displaced them
- **Labels** — a configure or raise reads as a maximum set or raised, and a
  refusal as a refused maximum, matching the lot's wording; there is no new
  account tab and no maximums-only route

## On the Lot

A signed-in owner with personal bidding activity opens **Your bidding**
beside the public recent-bids label, and re-reads this lot without leaving
the page.

- **Bid placed** — the auto-bid sequence Grade10 accepted for them on this
  lot, amount and time only; the first tab and the default, with an empty
  state when there is none yet
- **Your maximums** — every accepted configure or raise of the private cap,
  newest first, amount and time only, with no Set or Raised status on the row
- **No summary** — the live private maximum stays on the bid panel only; the
  dialog is tabs and lists
- **Owner only** — neither list shows another bidder's maximum, identity or
  payment facts; the public recent-bids list stays public-only
- **Refusals stay on the account** — a refused maximum is not on the lot
  dialog; it remains in the account chronology at `/bids`

## Boundary Outcomes

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

::cases{id="grade10-site/auction/bidding-history"}

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
