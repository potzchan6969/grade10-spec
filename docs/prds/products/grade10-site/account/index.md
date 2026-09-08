---
title: Account
icon: user-circle
---

A collector's own page on the Grade10 site, at `grade10.com/profile`. Signed
out, it asks for sign-in — [Accounts](/p/shared/auth) covers what a session is
and how sign-in and sign-out work, the same way across every brand.

- **Profile** — the display name, bio, and avatar a collector shows about
  themselves ([Profile](/p/grade10-site/account/profile))
- **KYC** — the verified standing that clears a high-value order, a
  high-value bid, or a vault visit, what the check keeps, and how it is run
  ([KYC](/p/grade10-site/account/kyc))

Both sit on the one page: the profile is the page, and the KYC card is on it.

:::detail{title="Code map" for="engineer"}
`packages/grade10-store/backend/src/identity/` hosts the KYC gate and the
case; the profile is `@grade10/store-frontend`'s own slice. Background:
[docs/architecture/account-data.md](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md).
:::
