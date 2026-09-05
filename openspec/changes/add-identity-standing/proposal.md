# One identity, every product

**Author:** @ecchochan - 2026-09-05

## Why

A collector verified for a vault visit is the same person who checks out in the
store and bids in the auction. The identity store already holds one record per
person and answers it across products — that is what it exists for — but the
only surface it publishes is the one the vault holds: the whole record, and the
writes that bind it to a case.

Two costs follow.

- **A product that only needs a yes or no is offered a passport.** The store
  and the auction need to know whether a signed-in person is verified. Holding
  the service would put the legal names, birth dates and document photographs
  of every customer one binding away from a storefront worker that never asked
  for them.
- **What a brand's store holds is unwritten.** ZZZ and Grade10 share every line
  of code and none of the data; nothing says whether a collector verified on
  grade10.com is verified on zzz. The deployment answers per brand, and no
  requirement holds it there.

**Metric:** share of standing reads by the store and the auction answered
`verified` — a person recognised elsewhere for a check they passed once.

## What Changes

- **A product that only gates reads a standing.** Whether a person is verified,
  when the check was decided, until when its document is honoured, and who
  performed it. No name, no birth date, no document, no case. Judged when it is
  read, so a document that has lapsed since the check reads as expired rather
  than verified.
- **The store and the auction are consumers.** Each is issued a gate of its
  own, so what a worker holds says who is asking, exactly as the vault's
  service does.
- **A verified identity is a brand's own.** One identity store per brand,
  reached only by that brand's products; a brand that verifies nobody deploys
  none, and nothing crosses.

## Non-Goals

- **What the store or the auction gate on.** Which checkout, which bid, and
  what a person is told: each product's own change, with its own journeys.
- **Binding a case outside the vault.** The store and the auction hold a gate,
  not the service; a product that records or binds brings its own change.
- **A standing in the browser.** Nothing here publishes a route; a product's
  own backend reads the gate and decides what its pages say.
- **Re-verification on a schedule.** An expired standing tells a product to ask
  again; when it asks is its own decision.
- **A ZZZ identity store.** ZZZ verifies nobody. The brand axis exists so that
  the day it does, the deployment is a value to fill in rather than a wall to
  build.
- **Finance.** Named in the vocabulary, verifies nobody, and stays as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/e-kyc/identity-record` — the standing a gating product reads,
  the two kinds of consumer, and the brand a record belongs to. Added
  requirements; nothing the vault holds changes.

## Impact

- **The identity store** — a second, narrower surface beside the service,
  issued per consuming product.
- **The store and auction backends** — each binds its gate in the change that
  first gates a checkout or a bid on it; nothing in either reads it yet.
- **No ZZZ surface.** ZZZ runs auth and store only and verifies nobody.
- **No new permission.** A standing is read by a product's own backend for the
  signed-in person; no operator surface changes.

## Open questions

- ❓ **What the store gates on, and what the auction gates on.** A checkout
  above a value, a bid above a value, a category of item — and what the person
  is told. *Owner: Product.*
- ❓ **Whether a ZZZ identity store is ever deployed.** Only once a ZZZ product
  verifies somebody, and then under ZZZ's own vendor account and template.
  *Owner: Product.*
