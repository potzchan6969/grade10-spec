# Durable specifications

Specs are grouped by the application that ships them, one capability directory
per durable contract:

```text
openspec/specs/<product>/<domain>/<capability>/spec.md
```

Grade10 ships four applications, and they are the four product directories:

- `grade10-site` — the grade10 site: the shell every page renders in, how it answers
  an address, and every collector-facing surface inside it — the store, the
  auction, the loyalty programme, and the vault.
- `grade10-admin` — the grade10 admin site: the operator surfaces that draft and
  publish auction listings and campaigns, close out a won listing, hold the
  stock count behind them, and work the vault's queue and its book.
- `zzz-site` — the ZZZ site: the ZZZ brand's own collector-facing surfaces.
- `zzz-admin` — the ZZZ admin site. No capability is specified yet; add its
  first as `openspec/specs/zzz-admin/<domain>/<capability>/spec.md`.

A fifth directory is not an application:

- `shared` — the contracts that bind more than one of the four. A capability
  lives here only when two or more applications are held to it: session and
  identity behavior (`auth/*`), the shared component package and its surfaces
  (`ui/*`), the admin console vocabulary both admin sites render (`console/*`),
  the Figma-to-code audit rails (`design-sync/*`), and the platform-wide
  formats every surface renders (`dates-and-times`, `money-amounts`,
  `localization`, `frontend-composition`).

Inside a product, capabilities are grouped one level further by the domain they
belong to, so a product with twenty capabilities reads as five groups rather than
one alphabetical run: `grade10-site/site/*`, `grade10-site/store/*`, `grade10-site/auction/*`,
`grade10-site/loyalty/*`, `grade10-site/vault/*`. The `shared` layer groups the same way — `shared/auth/*`,
`shared/ui/*`, `shared/console/*`, `shared/design-sync/*` — except for the
platform-wide formats, which sit bare because they belong to no group smaller
than everything.

A capability's OpenSpec ID is its path: `grade10-site/auction/listing-page`,
`shared/auth/sign-in`, `shared/money-amounts`. Use that ID with `openspec show`
and `openspec validate`, both of which accept the extra level.

Where a capability belongs is decided by who is held to it, not by what it is
about. An auction surface a collector uses is `grade10-site/auction/*`; the operator
surface that publishes it is `grade10-admin/auction-*`; a component both brands
render is `shared/ui-*`. Adding a fifth application means a new top-level
directory here plus a bullet in this list — and that is a product decision, not
a filing one.

These specs hold the latest accepted product contract. An active change carries
its delta under
`openspec/changes/<change>/specs/<product>/<domain>/<capability>/`. Complete the
isolated QA and Dev readings, reconcile the technical design and test plan, and
resolve product questions before `spec:accept` folds the accepted contract here.

Implementation targets the change's immutable acceptance fingerprint and
artifact snapshot. Later accepted changes may advance this directory while that
implementation continues. Archive preserves the verified implementation record
and performs no second fold. The manual's environment availability view reads
deployment evidence to show where an implementation is running.

See [PRDs and OpenSpec](../../docs/governance/prd-and-openspec.md) for the
acceptance, implementation, and archive procedure.
