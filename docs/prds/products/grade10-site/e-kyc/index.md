---
title: Identity Store
---

The identity store holds the verified identity of a person — legal name, date of
birth, document type, a masked document number, its expiry, and a photograph of
the document — and exists to enforce one idea: **the same human is the same
human**. A product that needs to know who somebody is binds the check another
product already recorded instead of photographing the passport again.

It is the most tightly walled service in the estate. Its own worker, its own
database, its own bucket, and no public route of any kind — a product reaches it
only over a service binding. The reason is in its own source: a route here would
put the legal names and passport photographs of every customer of every product
one misconfigured origin away from a browser.

## Two ways to be verified

- **Before the visit** — the collector completes a check on their own phone,
  hosted and decided by a verification provider, and the verdict comes back on
  its own ([hosted verification](/p/grade10-site/e-kyc/hosted-verification))
- **At the counter** — staff read the document in front of them and record it
  from the vault case ([the case's side](/p/grade10-site/vault/identity-check))

Both write [the same record](/p/grade10-site/e-kyc/identity-record), and it says
which of the two made it. The counter check is the fallback that never closes:
no smartphone, an unreadable document, a provider outage, a refused check — the
visit still works.

Nobody signs into the store itself. The people it serves are the collector, who
verifies before travelling and whose document is what is being kept, and vault
staff, who read a case's identity, record one at the counter, and download the
photograph under an audited grant.

The raw document number never lands. It crosses the binding in memory, becomes a
mask and a keyed digest, and is never stored, returned or logged. The digest is
keyed rather than a bare hash, because a document number's whole space is small
enough to walk offline — a bare digest of one *is* the number.

:::callout{kind="warning"}
The hosted check is specified and not yet built. Every verified identity in the
estate today is a member of staff typing a document at a counter — one provider
kind exists, and it means exactly that. Read every page describing a collector
who verifies themselves as the intended product, not the shipped one.
:::

:::callout{kind="note"}
"One verified identity per person" is a property the data model makes
*checkable*, not one the database enforces. A case binds exactly one identity
and that is enforced by a primary key. But the document-number digest carries no
unique index, and nothing queries it yet — so the same document turning up under
a second account is a query somebody could run, not an alarm that fires.
:::

:::detail{title="For engineers" for="engineer"}
`packages/e-kyc/` in the application repository, deployed as
`grade10-e-kyc-service`. Its entire HTTP surface is a health route and dev
setup; the eight real methods are RPC over a `KYC_SERVICE` binding, minted per
product by a class factory. The vault is the only consumer today — the
cross-product reuse is built end to end and wired to exactly one product.

Writes and case bindings are scoped to the calling product by the entrypoint its
binding names. What cannot be scoped is the person: `latestForUser` reads across
every product deliberately, and that read is the whole reason this store left the
vault.

Capture keys are content-addressed, so the object name is the digest of its
bytes and no folder scheme exists. Two mechanisms move bytes out, and only one is
erasure: a purge drain settles rows first and bytes second, re-judging each key
immediately before deleting it; an hourly orphan sweep is garbage collection,
reclaiming aged objects no row names, with three proofs before every delete.
There is no deletion-log sweep here at all — erasure arrives as the owning
product releasing its binding, because only that product knows whether the
evidence is under legal hold.

The record already carries a provider and a provider reference, and both are
constant today. A hosted provider is not another value behind the same write: it
inverts the flow with its own ceremony and verdict, so the seam is the package
boundary rather than an adapter inside the counter check.

Background:
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
and
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md).
:::
