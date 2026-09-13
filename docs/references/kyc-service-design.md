# KYC service design note

An engineer's working note on how the KYC service is built, moved here from
the engineer block of [KYC](../prds/products/grade10-site/account/kyc.md) on
2026-09-13, where it read as a design record rather than a code map. The
page and `grade10-site/vault/identity-verification` carry the decisions; the
application repository's
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
and [vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
architecture records are where this belongs once they carry it. Explanatory,
never authoritative.

## Deployment

- **One service per brand** — `packages/e-kyc/` in the application
  repository, deployed as `grade10-e-kyc-service` for Grade10 with its own
  Neon project and bucket, and a `BRAND` var that selects the hosted template
- **HTTP surface** — a health route and dev setup, nothing else; everything a
  product asks arrives over a service binding

## Bindings

- **Minted per product** — a class factory issues a binding in two kinds
- **The service** — the record, its case bindings and the five hosted calls;
  what a host holds as `KYC_SERVICE` — the vault for its cases, the store for
  the site's own accounts
- **The gate** — one method, a person's standing and no identity field; what a
  product that only reads would hold. None does today; the factory is
  published for the day one does
- **Scope** — writes and case bindings are scoped to the calling product by
  the entrypoint its binding names. The person cannot be scoped:
  `latestForUser` and the standing read across every product deliberately,
  which is the reason the service left the vault

## Evidence Storage

- **Content-addressed keys** — the object name is the digest of its bytes;
  no folder scheme exists
- **Purge drain** — the one mechanism that is erasure: settles rows first and
  bytes second, re-judging each key immediately before deleting it
- **Orphan sweep** — hourly garbage collection, reclaiming aged objects no
  row names, with three proofs before every delete
- **No deletion-log sweep** — erasure arrives as the owning product releasing
  its binding, because only that product knows whether the evidence is under
  legal hold

## The Record

- **Provider and reference** — constants on a counter check, the vendor's on
  a hosted one
- **The hosted check's life** — raise with reuse first, open, start, settle,
  withdraw, the two sweeps and the three routes; published by the package over
  a host port the product supplies. The collector's page is the package's
  own slice; the vault is the first host, and a second product mounts the
  same hundred lines
- **One identity per case** — enforced by the bindings table's primary key
- **Document-number digest** — carries no unique index, and nothing queries
  it
