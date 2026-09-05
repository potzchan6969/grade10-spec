---
title: Identity Store
---

The identity store holds the verified identity of a person — legal name, date of
birth, document type, a masked document number, its expiry, and a photograph of
the document — and exists to enforce one idea: **the same human is the same
human**. A product that needs to know who somebody is binds the check another
product already recorded instead of photographing the passport again.

It is the most tightly walled service in the estate: it is reached only by
Grade10's own services, and no address of it answers a browser. The reason is in
its own source — a route here would put the legal names and passport photographs
of every customer of every product one misconfigured origin away from a
browser.

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
verifies before travelling and whose document is what is being kept, vault
staff, who read a case's identity, record one at the counter, and look at the
document image, and every product that asks whether a signed-in person is
verified — the store at a checkout, the auction at a bid — and is told a
standing, never a name.

One store per brand. A collector verified on grade10.com is unknown to ZZZ,
which verifies nobody and runs none.

The raw document number never lands. It crosses the binding in memory, becomes a
mask and a keyed digest, and is never stored, returned or logged. The digest is
keyed rather than a bare hash, because a document number's whole space is small
enough to walk offline — a bare digest of one *is* the number.

:::callout{kind="note"}
"One verified identity per person" is checkable, not enforced. A case holds one
identity and that much is guaranteed. The document-number digest makes a
repeated document findable, and nothing looks — so the same document under a
second account is a query somebody could run, not an alarm that fires.
:::

:::detail{title="For engineers" for="engineer"}
`packages/e-kyc/` in the application repository, deployed once per brand —
`grade10-e-kyc-service` for Grade10, with its own Neon project and bucket, and
a `BRAND` var that selects the hosted template. Its entire HTTP surface is a
health route and dev setup; everything a product asks arrives over a service
binding, minted per product by a class factory in two kinds. The service —
the record, its case bindings and the five hosted calls — is what the vault
holds as `KYC_SERVICE`. The gate — one method, a person's standing and no
identity field — is minted for the store and the auction, and each binds its
own as `KYC_GATE` in the change that first gates a checkout or a bid on it.

Writes and case bindings are scoped to the calling product by the entrypoint its
binding names. What cannot be scoped is the person: `latestForUser` and the
standing read across every product deliberately, and that read is the whole
reason this store left the vault.

Capture keys are content-addressed, so the object name is the digest of its
bytes and no folder scheme exists. Two mechanisms move bytes out, and only one is
erasure: a purge drain settles rows first and bytes second, re-judging each key
immediately before deleting it; an hourly orphan sweep is garbage collection,
reclaiming aged objects no row names, with three proofs before every delete.
There is no deletion-log sweep here at all — erasure arrives as the owning
product releasing its binding, because only that product knows whether the
evidence is under legal hold.

The record carries a provider and a provider reference: constants on a counter
check, the vendor's on a hosted one. The hosted check's own life — raise with
reuse first, open, start, settle, withdraw, the two sweeps and the three
routes — is published by the package over a host port the product supplies,
and the collector's page is the package's own slice; the vault is the first
host, and a second product mounts the same hundred lines. A case binds exactly
one identity, enforced by the bindings table's primary key; the document-number
digest carries no unique index and nothing queries it.

Background:
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
and
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md).
:::
