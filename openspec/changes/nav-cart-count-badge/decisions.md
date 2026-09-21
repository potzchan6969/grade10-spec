## Goals

- Connect the existing shared badge to the member cart in grade10-site, including when the drawer is closed.

- With a cart control present and active lines in the cart, the header cart
  icon shows the same active-line count as the cart drawer title badge.
- With no active lines, or while the host has not yet supplied a count, the
  badge is absent.
- Design-system `Nav` stays count-agnostic; `SiteHeader` owns the badge.

## Non-Goals

- Deriving sold-out / unavailable exclusion inside the chrome — the
  application supplies the same active count `CartDrawerHeader` already uses
  (`shared/ui/store-cart`).
- Changing the cart drawer badge, empty state, or cleanup rules.
- Adding a backend count endpoint, polling inventory, or changing cart storage.
- Truncating large counts to `99+` or similar — the indicator shows the full
  number.
- Auction-first surfaces before Store answers the cart drawer, which correctly
  omit the cart control.
- Teaching design-system `Nav` about cart counts.
- A loading or skeleton treatment for the header badge — the host omits the
  count until it knows; drawer header skeleton stays the drawer's.
- A signed-out guest cart count — there is no guest cart; signed-out visitors
  get no badge.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Specs, suite, and package code already exist — reopen product scope, or close planning? | Close planning: write this file from the settled choices; leave the delta and suite unless a later fact forces a change (recommended) | Rewriting proposal, journeys, and requirements from scratch — rejected: the contract already matches the goals, and reopening would duplicate work already reconciled. |
| Q2 | What does a signed-out collector's cart badge read? (`require-sign-in-from-nav-cart` deferred this here.) | No guest cart → signed-out always gets no badge (count omitted or `0`) (recommended) | Inventing a signed-out count or a special "guest" pip — rejected: members-only cart; activation is sign-in; chrome only shows a badge when the app supplies `cartItemCount > 0`. |
| Q3 | What does the header count mean? | Same active-line count as the drawer title badge; app-supplied; chrome does not derive it (recommended) | Chrome counting cart lines itself, or including sold-out / unavailable — rejected: `shared/ui/store-cart` already owns that rule for `CartDrawerHeader`. |
| Q4 | Header overlay vs drawer title chip — same primitive? | Header uses `StatusIndicator` `type="count"` `variant="brand"`; drawer title keeps `Badge` `variant="brand"` (recommended) | Putting `Badge` on the nav icon, or swapping the drawer to `StatusIndicator` — rejected: overlay vs in-title chip are different surfaces; do not swap one for the other here. |
| Q5 | Cap large counts at `99+`? | Always show the full number the app supplies (recommended) | Truncating to `99+` — rejected: the drawer title badge shows the full active count; the header must match. |
| Q6 | Loading / unknown count while the cart hydrates? | Omit until known — no badge loading API on `SiteHeader`; host withholds the prop or passes `0` until it knows (recommended) | A skeleton or pending state on the header badge — rejected: out of scope; drawer header skeleton stays the drawer's concern. |
| Q7 | Does this change deliver the application count? | Extend this active change with grade10-site integration, as requested on 2026-09-21. Preserve the shared contract and existing task IDs. | A second overlapping badge change or more presentation-only work. |
| Q8 | Which count reaches the header? | Count distinct active lines in the same reviewed basket as the drawer, never summed quantities or checkout-eligible lines alone. | Using the existing quantity total, which counts unavailable lines and multiples differently. |
| Q9 | What happens while the current basket cannot be reviewed? | Keep the last verified count for the same member while checking, including after a failed cart update, as chosen by the author on 2026-09-21. Hide it if the check fails. Initial unknown state stays hidden; clear the previous member immediately when session ownership changes. | Hiding a verified same-member count during every refresh, or retaining a failed/previous-member count. |
| Q10 | When does the count refresh? | Review on member cart hydration, settled cart mutations, and explicit cart review/retry, even when the drawer is closed. Reuse current invalidation; no inventory polling or cross-device real-time guarantee. | Opening the drawer as the only trigger, or introducing a background polling service. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/site-chrome | What does the header count mean? | Q3 |
| grade10-site/site/page-shell | Should an already verified same-member count remain while a refresh is pending, and does a failed mutation trigger that refresh? | Q9 |
