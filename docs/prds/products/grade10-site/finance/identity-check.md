---
title: Identity Check
spec: grade10-site/vault/identity-check
order: 4
---

The identity a vault case's papers are signed under. The record and the one
hosted check live with [KYC](/p/grade10-site/account/kyc); this page is what
the vault asks of them.

## Getting an identity

- 🚧 **The ID Record** — read by staff on the intake form and kept on the collector's account, once for every service; the vault's papers print its legal name and masked number - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
- 🚧 **Verified Once, for the Account** — the identity check is the account's, done once and reused: asked before money leaves Grade10, a cash-out or a loan advance, and once for a mail-in, where no staff see the ID - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)
- 🚧 **The Store's Bid Bar** — a bid above it asks for the same check, once; the bar stays the store's own, US$15,000 by default - [KYC](/p/grade10-site/account/kyc)
- **Built** — staff record the document on each case from the case screen, with its date of birth and a photograph, or bind a check the collector already passed; a case invites nobody to a hosted check, and recording over a declined check carries a reason

## Identity states

- **Built** — a case shows Verified, Out, Stalled, Refused, Lapsed or None; a verdict that arrives after the case moved is refused, discarded and reported

::image{src="assets/diagrams/vault-identity-states.svg" alt="How a case moves between None, Out, Stalled, Verified, Lapsed and Refused"}

- 🚧 **No States on a Case** — a case reads the ID record its visit took, and shows no verification of its own

## Gate

- 🚧 **Papers Read the ID Record** — the papers are never prepared for a visit with no ID record, and the name printed comes from the record, never from anything typed later
- 🚧 **One Gate for Cash-Out and Loan** — a contradiction holds the cash-out, or refuses the loan acceptance, onto one held list an approver decides - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#held-list)
- 🚧 **No Settings** — the check is required before money leaves, so there is no point for an admin to switch on or off
- **Built** — no paper is rendered for a case with no bound identity, a packet whose identity changed can't be sealed, and each point the vault asks — before the paperwork, at every cash-out and before sale proceeds reach the balance — is an admin setting

:::detail{title="Product decisions" for="pm"}
The vault is where an identity used to be felt at the door. It now asks for
none there: staff record the ID in hand once for the account, and the account's
own check waits until money leaves.

**Not in scope.** The store's bid bar itself, which stays the store's own -
[KYC](/p/grade10-site/account/kyc).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Invitation trigger | Decided | None: a case invites nobody to a hosted check, and the account's own check is the way to verify at home, decided 2026-10-13. | Owner |
| Counter fallback | Decided | Permanent, and never gated on a hosted attempt; the counter is equal evidence. | Operations |
| An account's identity, not a case's | 🚧 | The ID record is read once on the intake form and kept on the account for every service; the identity check is the account's, at cash-out alone, and the vault binds no verification to a case - the counter review, round 2, 2026-11-02, in place of the per-case binding, pre-custody recording, packet voiding and late-verdict rules | Product |
| The store's bid bar | Decided | It stays the store's own control on buyers, not a payout gate, and reads the same account check - the counter review, round 3, 2026-11-02 | Product |
:::
