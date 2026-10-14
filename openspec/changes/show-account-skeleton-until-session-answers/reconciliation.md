# Cluster: nav-cart-count-badge -> show-account-skeleton-until-session-answers -> restrict-auctions-by-region

## Ownership

| Shared requirement | Owner of each part | What the others say |
| --- | --- | --- |
| `grade10-site/site/page-shell` / The chrome does not wait for the session | `nav-cart-count-badge` owns the cart count lines; this change owns the account entry before the first answer and what may move when the session arrives (Q7, Q10) | `nav-cart-count-badge` is accepted and folded; this change's block copies the folded text and edits only its own lines |
| `shared/ui/site-chrome` / SiteHeader composes Nav with session-aware account entry | This change owns the `"pending"` session value, the **Pending** paragraph, `shared-ui-site-chrome-SC-45` and `shared-ui-site-chrome-SC-46`; `restrict-auctions-by-region` owns My Auctions as a handler-gated item and `shared-ui-site-chrome-SC-44` | `restrict-auctions-by-region` carries this change's session value and **Pending** paragraph, and takes SC-45 and SC-46 from the durable spec once this change is accepted |

## Decisions

- **Order** - this change is accepted before `restrict-auctions-by-region`, which waits on its own Figma frame and on `omit-profile-account-menu`; decided by @seankcw on 2026-10-14, who also authorized the edit to `restrict-auctions-by-region` in this change's pull request, for @tangconst to review

## Order

1. `nav-cart-count-badge` - accepted
2. `show-account-skeleton-until-session-answers`
3. `restrict-auctions-by-region`
