---
title: Identity store
summary: One verified identity per person, held behind a wall no browser can reach.
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

Nobody signs into it. The people it serves are vault staff, who record a
verification at the counter from inside the vault's admin panel, and the
customer, whose document is what is being kept. The two refusals staff hear are
the business ones — the person is under age, or the document has expired — and
both are judged at the clock of whoever is asking, because a record made two
years ago may have aged past its document's expiry since.

The raw document number never lands. It crosses the binding in memory, becomes a
mask and a keyed digest, and is never stored, returned or logged. The digest is
keyed rather than a bare hash, because a document number's whole space is small
enough to walk offline — a bare digest of one *is* the number.

:::flow{title="Recording a check at the counter"}
## Staff open the dialog
A vault case reaches a status where identity may be recorded, and staff type the
legal name character for character off the document, the date of birth, the
document type, number and expiry, then take or attach a photograph.
## The photograph is scrubbed and sent
Image metadata is stripped in the browser. The vault calls the store over its
binding, with no database transaction open, because the store is another worker.
## Refusals first, then bytes
Under age or expired document stop here. Otherwise the number is masked and
digested, the photograph is written to the bucket, and the verification row and
its case binding commit together — bytes before row, so the only crash residue
is an object no row names.
## The case is updated under its lock
A short transaction takes the case row, re-judges it, voids any signing packet
still out — its documents were written from the record this replaces — and
records the verification beside the event.
## Recording again rebinds
A retry converges on one binding rather than leaving a second photograph behind.
What was displaced goes on an outbox the vault settles, restoring it or
discarding it.
## Reading it back
The photograph is fetched later over the same binding, through the vault's own
audited download route. The vault never holds a bucket key.
:::

:::callout{kind="warning"}
"One verified identity per person" is a property the data model makes
*checkable*, not one the database enforces. A case binds exactly one identity
and that is enforced by a primary key. But the document-number digest carries no
unique index, and nothing queries it yet — so the same document turning up under
a second account is a query somebody could run, not an alarm that fires.
:::

:::callout{kind="note"}
No spec covers this service. Nothing in the store describes the verified record,
the person-wide read, the case binding, the mask table, the keyed digest, the
capture keys, the purge outbox or the refusals. The design lives in the
application repository's architecture docs and in the source comments, which are
the only written record of several of these decisions.
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

Background:
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
and
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md).
:::
