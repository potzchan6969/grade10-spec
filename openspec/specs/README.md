# Durable specifications

Specs are grouped by product, one capability directory per durable product contract:

```text
openspec/specs/<product>/<capability>/spec.md
```

The products are:

- `grade10-store` — the Grade10 trading-card store surfaces (all pre-existing capabilities live here).
- `zzz` — the ZZZ site's own surfaces, starting with how it answers an address.
- `grade10-site` — the grade10 application's own surfaces: the shell every page
  renders in, and anything belonging to the site rather than to a product inside
  it.
- `shared-ui` — cross-product contracts for the shared components every store
  application consumes: the compound components in `packages/ui`, and the site
  chrome the design system publishes.
- `shared-auth` — cross-product session behavior, entering a session and
  leaving one, shared by every surface of either brand regardless of which
  application renders it.
- `design-sync` — the rails that hold code and the Figma file to each other:
  what the design-to-code audit must detect, and which components it must
  reach. Not a product surface; a contract the tooling owes every product.
- `grade10-auction` — Grade10's card-auction surfaces: collector browse and
  bid, and the operator queue that closes out a won listing.

A capability's OpenSpec ID is `<product>/<capability>` (for example `grade10-store/loyalty`); use that ID with `openspec show` and `openspec validate`. Adding a product is a new top-level directory here plus a bullet in this list.

These specs hold current requirements. An active change may contain a focused delta spec under `openspec/changes/<change>/specs/<product>/<capability>/`; sync the accepted delta into this directory before archiving the change.
