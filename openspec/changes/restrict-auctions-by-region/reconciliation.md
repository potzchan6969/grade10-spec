# Reconciliation: site-chrome account entry

`restrict-auctions-by-region` and `draw-account-menu-and-profile` both modify
`shared/ui/site-chrome` — *SiteHeader composes Nav with session-aware account
entry*. Each keeps its own scope, acceptance and verdict.

## Ownership

- **`restrict-auctions-by-region`** owns the requirement and its text as it
  stands on durable.
- **`draw-account-menu-and-profile`** changes one clause of it: the signed-in
  avatar shows `accountAvatarSrc` where supplied, else the initial. It restates
  the requirement on top of whatever durable holds when it archives, and keeps
  the other change's clauses.

- **`restrict-auctions-by-region`'s block restates the avatar clause and scenarios
  SC-49 and SC-50 as well**, so the store's delta check holds whichever of the
  two archives first; its other text is unchanged.

## Decisions

- Decided by @seankcw: `restrict-auctions-by-region` is the owner and archives
  first.

## Order

1. `restrict-auctions-by-region`
2. `draw-account-menu-and-profile` — `depends_on` records it
