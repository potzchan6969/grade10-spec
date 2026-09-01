---
title: ZZZ
---

ZZZ is the platform's second brand. It runs on the same code as grade10 and is
otherwise a separate world: its own domain, its own auth worker, its own users,
its own databases, its own email sender, and its own language. A person with a
grade10 account has no ZZZ account, and sessions never cross.

## What it shares, and what it drops

It shares the code — the same design system, the same shared blocks, the same
auth contract, the same admin packages. What it does not take is grade10's
theme: ZZZ renders the design system's baseline, with no brand theme class of
its own.

It runs **no loyalty programme at all** — that is grade10's alone, so there are
no members, invitations, rewards or liability surfaces anywhere in ZZZ. It has
no auction, vault or appointment surface either, and no public surface yet.
Today its site is three screens: home (the signed-out landing), sign-in, and
the profile. It speaks one language, Korean, and the platform's rule for a
single-language brand is to label the language rather than offer a switch.

The one deliberate exception to the brand wall runs the other way: the auction
service is shared, so a grade10 collector and a ZZZ collector bid against each
other on the same lot while their identities, sessions and money stay apart.

## Who uses it

A **collector** opens the site, signs in, and reaches their profile. An
**operator** works the ZZZ console, which has exactly three sections — users,
store, audit — a strict subset of grade10's thirteen, assembled from the same
shared operator packages.

Because there is no public surface, ZZZ has one durable capability where
grade10 has a dozen. `page-shell`, `crawlable-pages` and every store and
auction capability have no ZZZ counterpart, and that is today's design rather
than an oversight.

:::callout{kind="warning"}
Several things about ZZZ are placeholders rather than decisions. Its own spec
repository does not exist yet, so its words live in grade10's translation
package under a ZZZ brand key and its email copy lives in its auth worker. It
still answers on a subdomain rather than its base domain, its staging and
production hostnames are placeholders, and Google sign-in stays off until ZZZ
has its own OAuth client. The Korean catalogue was drafted machine-assisted and
has not been reviewed by a native speaker.
:::

:::callout{kind="warning"}
ZZZ has no consumer of its account-deletion log — not auth, not store, not api.
Grade10's vault, auction and appointment services sweep their log; ZZZ sweeps
nothing, which is a named follow-up rather than a decision. See
[docs/architecture/account-data.md](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md).
:::

:::detail{title="The brand boundary, concretely" for="engineer"}
One product means one domain, one auth worker, one user base
([docs/architecture/multi-product.md](https://github.com/9gag/grade10/blob/main/docs/architecture/multi-product.md)).
ZZZ has its own session cookie domain, auth worker and secret, trusted origins,
identity database, session cache and store database. It runs three workers —
api, auth, store — against grade10's nine, and its SPA carries the brand in its
package name where grade10's drops it.

Two things beyond the auction are shared on purpose: the tail worker and
Datadog, because that is operator-side observability for the same team rather
than user data.
:::
