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

## Decisions

- Decided by @seankcw: `restrict-auctions-by-region` is the owner and archives
  first.

## Order

1. `restrict-auctions-by-region`
2. `draw-account-menu-and-profile` — `depends_on` records it
