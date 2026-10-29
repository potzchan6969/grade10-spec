---
title: Portfolio
spec: grade10-site/vault/portfolio
order: 3
---

What a collector holds in the vault and what they do with it. The portfolio
is the custody half of the vault — items held, not loans — drawn on the
collector's own pages.

- 🚧 **Your items** — everything the collector holds in the vault in one
  list, tabbed by state — All Assets, In Vault, Live Auction, Listed — with
  a sort the tab defines and a count on each tab
- 🚧 **Four states** — In Vault, Listed, Live Auction, Retrieval Pending; an
  item awaiting a retrieval decision still counts as in the vault, and a
  tab with nothing in it is hidden
- 🚧 **One item** — its gallery, status, estimated value since intake, grade
  and certification, storage location, condition, custody history and
  documents; graded and raw items read differently
- 🚧 **Acts on an item** — list it for auction or for sale, submit a raw item
  for grading, or ask for it back
- **Verify at the source** — a graded item's certificate opens the grading
  institute's own record in a new tab
- **Documents** — each document on the item opens or downloads

## Earning and Consigning

What each card in the vault tells the collector about its money.

- 🚧 **Market Price** — the card's 30-day SNKRDUNK price - [Incentive](/p/grade10-site/vault/incentive#daily-amount)
- 🚧 **Daily Incentive** — what the card earns a day, or why it isn't earning today - [Incentive](/p/grade10-site/vault/incentive#earning)
- 🚧 **Vesting** — what is vesting on the card and the day it is released
- 🚧 **Available Amount** — what the collector can cash out - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#wallet)
- 🚧 **Consign Button** — one tap on each card, beside its market price and daily incentive - [Consigning](/p/grade10-site/consignment/consigning#consign-form)
- 🚧 **Documents and Records** — the card's papers and records, exported to PDF - [Vault Documents](/p/grade10-site/vault/documents)
- 🚧 **Cash-Out and Identity Check** — where each stands

## The item's page

- 🚧 **Estimated value since intake** — the intake figure and how far it has
  moved; a listed or auctioned item instead reads its listed price or
  current bid and links out to its listing
- 🚧 **Value potential** — a raw item shows its graded estimate and the
  upside, with `Submit for Grading` inside the callout
- **Custody log** — where the item has been and when, latest first,
  including the store or auction listing
- 🚧 **Locked while listed** — an item on the shelves or at auction cannot
  be requested back until it delists or settles
- 🚧 **Retrieval requested** — sending the request confirms it, turns the
  item Retrieval Pending and adds the request to the custody log; the item
  cannot be listed or requested again while the operator's approval is
  pending
- ❓ **Listing** — what `List for Auction` and `List for Sale` start; the
  request flow is not drawn yet
- ❓ **Retrieval** — what asking for an item back commits to; fees, timing and
  the pickup path are not drawn yet

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The portfolio's screens | Decided | Drawn by @tangconst in `Grade10-DS-2026` — portfolio `7068:7718`, asset detail graded `7029:2`, raw `7054:7072` | Owner |
| Portfolio statuses | Decided | In Vault (no badge), Listed, Live Auction, Retrieval Pending; Retrieval Pending sits in the In Vault tab while the operator's approval is pending | @tangconst |
| Intake on the portfolio | Decided | Items in submission or intake never appear in holdings until vaulted; the intake banner stays a separate alert | @tangconst |
| Retrieval while listed | Decided | A listed or auctioned item cannot be requested back until it delists or settles | @tangconst |
| Retrieval Pending | Decided | A pending item hides `List for Auction`, `List for Sale` and `Request Retrieval` until the operator decides | @tangconst |
| Sorting | Decided | Each tab carries its own sort set and remembers the pick for the session; Live Auction defaults to ending soonest, Listed to recently listed | @tangconst |
| Stats card | 🚧 | Drawn provisional at `7102:1514` — total estimated value and storage fees only; the item count lives on the tab badges | @tangconst |
:::
