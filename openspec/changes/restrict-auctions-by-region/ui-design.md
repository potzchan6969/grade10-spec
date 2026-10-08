## Screens

### Auction restricted page

The page a direct auction address answers for a collector in a restricted
region. Same surface family as the site's not-found page —
`apps/preview/src/pages/not-found-page.tsx`, story
`pages-not-found-page--default`: `SiteHeader` with no current nav item, a
centered title and description, one action, `Footer`. The Figma frame for
this page is still owed; until it lands, the not-found page is the agreed
composition and this file draws nothing further.

## Components

- `SiteHeader`, `Footer` — the page's chrome; on a restricted request the
  header carries no auction nav item and no account-menu auction items.
  `onMyAuctions` becomes handler-gated by this change's `shared/ui/site-chrome`
  delta — work in this repo, flagged for tasks.
- `Button` (`@grade10/design-system/components/forms/button`) — the store
  link, as `NotFoundPage` renders Back to Home.
- `VStack` (`@grade10/design-system/components/layout/vstack`) — the
  centered column, as `NotFoundPage` composes it.
- **New message keys** — `@grade10/i18n` answers the page's words in every
  language of its layer. Proposed namespace `shared/<locale>/auctionAvailability.json`
  carrying `title`, `description`, `browseStore` — the layer is settled in
  `tech-design.md`; the keys are work in this repo.
- **No new block** — the page is an application assembly like
  `NotFoundPage`, not a `packages/ui` export.

## States

### Auction restricted page

| State | Shows | Anchor |
| --- | --- | --- |
| Restricted visit | Title, description, store link; chrome with no auction entry points | `grade10-site-auction-availability-SC-09` |
| Unrestricted visit | The auction page itself; the restriction page never renders | `grade10-site-auction-availability-SC-13` |
