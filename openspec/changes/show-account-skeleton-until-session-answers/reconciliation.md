# Cluster: nav-cart-count-badge -> show-account-skeleton-until-session-answers -> restrict-auctions-by-region

## Ownership

| Shared requirement | Owner of each part | What the others say |
| --- | --- | --- |
| `grade10-site/site/page-shell` / The chrome does not wait for the session | `nav-cart-count-badge` owns the cart count lines; this change owns the account entry before the first answer and what may move when the session arrives (Q7, Q10) | `nav-cart-count-badge` is accepted and folded; this change's block copies the folded text and edits only its own lines |
| `shared/ui/site-chrome` / SiteHeader composes Nav with session-aware account entry | This change owns the `"pending"` session value, the **Pending** paragraph, `shared-ui-site-chrome-SC-45` to `shared-ui-site-chrome-SC-48`; `restrict-auctions-by-region` owns My Auctions as a handler-gated item and `shared-ui-site-chrome-SC-44` | `restrict-auctions-by-region` carries this change's session value and **Pending** paragraph, and restates SC-45 to SC-48 so folding it second keeps them; until this change folds, the current tree reports those four ids as issued twice, and `accept:preflight`'s folded check passes |

## Decisions

- **Order** - this change is accepted before `restrict-auctions-by-region`, which waits on its own Figma frame; decided by @seankcw on 2026-10-14, who also authorized the edit to `restrict-auctions-by-region` in this change's pull request, for @tangconst to review
- **Case numbers** - `restrict-auctions-by-region` issued `g10.shared-site-chrome.US1-TC28` first; this change's SiteHeader cases take US1-TC29 to US1-TC32

## Order

1. `nav-cart-count-badge` - accepted
2. `show-account-skeleton-until-session-answers`
3. `restrict-auctions-by-region`
