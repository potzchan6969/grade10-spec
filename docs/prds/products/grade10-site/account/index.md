---
title: Account
icon: user-circle
---

A collector's own page on the Grade10 site, at `grade10.com/profile`. Signed
out, it asks for sign-in — [Accounts](/p/grade10-site/account/accounts) covers what a session is
and how sign-in and sign-out work, the same way across every brand.

- **Profile** — what a collector shows about themselves, and the address they
  signed in with ([Profile](/p/grade10-site/account/profile))
- **KYC** — the verified standing that clears a high-value bid, a request from Grade10, or a vault visit, and the
  verification page ([KYC](/p/grade10-site/account/kyc))
- **Business verification** - the business behind an account, verified when
  Grade10 asks ([Business Verification](/p/grade10-site/account/business-verification))
- **KYC service** - where a verified identity lives, how it is reused and
  erased, and the hosted check's states ([KYC Service](/p/grade10-site/account/kyc-service))
- **Delivery addresses** — the ones a collector keeps and confirms onto
  an auction order ([Delivery Addresses](/p/grade10-site/auction/account#delivery-address-management))

Verification has its own page, `grade10.com/verification`: the identity card,
the business card and any request from Grade10.

:::detail{title="Code map" for="engineer"}
`packages/grade10-store/backend/src/kyc/` hosts the KYC gate and the
case; the profile is `@grade10/store-frontend`'s own slice. Background:
[docs/architecture/account-data.md](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md).
:::
