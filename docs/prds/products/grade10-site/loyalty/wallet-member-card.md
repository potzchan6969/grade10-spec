---
title: Member Card in a Wallet
spec: grade10-site/store/wallet-member-card
order: 8
---

A member's card rides in Google Wallet or Apple Wallet as a second rendering
of the same programme standing the site shows — never a second source of it.

- **Adding a pass** — from the member's own profile page, to either wallet,
  independently of the other
- **Scanning at the counter** — the same QR the terminal reads off the site's
  own card
- **Staying current** — a sweep keeps the pass's balance and tier one lap
  behind the programme; nothing pushes on every earn
- **Ending or losing it** — a member ends a pass from their profile; the
  vendor's own copy is discharged in the background
- **Erasure** — the row stays, armed and empty, so it can still tell the
  vendor to forget the member

## Specs and journeys

**Specs** — this page documents `grade10-site/store/wallet-member-card`. The
requirements are its; this page holds the decision behind them.

::spec{id="grade10-site/store/wallet-member-card"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Which wallets | Decided | Google and Apple, on their own terms; the port names neither. | Product |
| Google's code | Decided | Made on the device from a secret the pass carries, so it scans with no signal. | Product |
| Apple's code | Decided | Made by the programme and durable; made safe by identifying only — it spends nothing and collects nothing. | Product |
| One pass per wallet | Decided | Adding or ending in one leaves the other untouched. | Product |
| How current | Decided | One sweep behind, and a lap is the refresh before the vendor's debt. | Product |
| Ending | Decided | Immediate, by the member or an operator; the vendor's copy is a debt the sweep discharges. | Product |
| Erasure | Decided | The row stays armed and empty; the secret goes, so no further code identifies. | Legal |
| A second brand issuing | ❓ Open | Nothing is brand-specific in the package; the first brand asking decides the certificate handling. | Product |
:::
