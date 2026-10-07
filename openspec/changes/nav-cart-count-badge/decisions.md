## Goals

- A signed-in member sees the same active-line count on the header cart icon
  as on the cart drawer title, on every surface that offers Cart, with the
  drawer open or closed.
- With no active lines, an unknown count, or no signed-in member, the header
  shows no count and keeps the Cart control.
- Design-system `Nav` stays count-agnostic; `SiteHeader` owns the badge and
  grade10-site supplies the number.

## Non-Goals

- Counting cart lines inside the chrome — grade10-site supplies the count (Q8).
- Changing the cart drawer badge, empty state, or cleanup rules.
- Adding a backend count endpoint, polling inventory, or changing cart storage.
- Updating the count live from another device (Q10).
- Truncating large counts to `99+` or similar — the indicator shows the full
  number.
- Auction-first surfaces before Store answers the cart drawer, which omit the
  cart control.
- Teaching design-system `Nav` about cart counts.
- A loading or skeleton treatment for the header badge — the host omits the
  count until it knows; the drawer header skeleton stays the drawer's.
- A signed-out guest cart count — there is no guest cart; signed-out visitors
  get no badge.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q2 | What does a signed-out collector's cart badge read? (`require-sign-in-from-nav-cart` deferred this here.) | No badge: there is no guest cart, so the count is omitted or `0` - decided by the round | A signed-out count or a guest pip — the cart is members-only and the chrome shows a badge only for a supplied count above zero. |
| Q3 | Who works out the header count? | grade10-site supplies it; the chrome displays it and never derives it - decided by the round | The chrome counting cart lines itself — what counts is the site's rule (Q8), and the shared header serves other brands. |
| Q4 | Header overlay vs drawer title chip — same primitive? | Header uses `StatusIndicator` `type="count"` `variant="brand"`; drawer title keeps `Badge` `variant="brand"` - decided by the round | `Badge` on the nav icon, or `StatusIndicator` in the drawer title — an overlay and an in-title chip are different surfaces. |
| Q5 | Cap large counts at `99+`? | Always show the full number supplied - decided by the round | `99+` — the drawer title shows the full count, and the header must match it. |
| Q6 | Loading or unknown count while the cart hydrates? | Omit until known — no badge loading API on `SiteHeader`; the host withholds the prop or passes `0` - decided by the round | A skeleton or pending state on the header badge — the drawer header skeleton stays the drawer's. |
| Q7 | Does this change deliver the application count? | Yes: this change carries the grade10-site integration and keeps the shared contract and its task IDs - decided by the author on 2026-09-21 | A second, overlapping badge change. |
| Q8 | Which count reaches the header? | One per distinct active line in the same reviewed basket as the drawer, whatever its quantity; adjusted lines count, sold-out and unavailable lines do not - decided by the round | The quantity total, which counts multiples and unavailable lines; or checkout-eligible lines alone, which drop adjusted lines the drawer still shows. |
| Q9 | What happens while the current basket cannot be reviewed? | Keep the last verified count for the same member while checking, including after a failed cart update; hide it if the check fails. An unknown first count stays hidden; a member change clears the count at once - decided by the author on 2026-09-21 | Hiding a verified same-member count on every refresh, or keeping a failed or previous-member count. |
| Q10 | When does the count refresh? | When the member's cart loads, when a cart change settles, saved or failed, when the drawer opens, and on Retry after a failed review, with the drawer open or closed. Nothing polls; a change made on another device shows after the next of these - decided by the round | Opening the drawer as the only trigger, or a background polling service. |
| Q11 | Which change carries the site-chrome Handler-gated line? The durable line shows Cart only with its handler, while this change's Cart slot requirement shows Cart for a supplied slot with no handler. | This one, so the durable file agrees with itself from this change's acceptance. The line names the account and cart slots beside the handlers, as `Nav` shows them (`packages/design-system/src/components/layout/nav.tsx:326-327`), and keeps the durable items. This change is accepted before `omit-profile-account-menu`, whose Handler-gated line names both slots and its own menu items, so that line folds over this one later and reverts nothing. The Cart slot line says only what the slot replaces - decided by the round. Carried by the site-chrome Handler-gated and Cart slot feature-set lines and the requirement 'A control renders only when it can act'. | `omit-profile-account-menu` carrying the line, with the two changes accepted back to back - that change still has open rows, so the durable line would contradict the Cart slot requirement between the two acceptances. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/site-chrome | What does the header count mean? | Q8 |
| grade10-site/site/page-shell | Should an already verified same-member count remain while a refresh is pending, and does a failed mutation trigger that refresh? | Q9 |
| shared/ui/site-chrome | Rebase onto `omit-profile-account-menu`: this delta restates the Handler-gated line that change rewrites. | Q11 |
| shared/ui/site-chrome | QA2 fourth reading: `omit-profile-account-menu`'s Handler-gated line shows cart only with its handler and names the account slot alone, against this change's Cart slot line. | Q11 |
| shared/ui/site-chrome | QA2 fifth reading: Q11 said `omit-profile-account-menu`'s Handler-gated line names the cart slot; that change's branch still names the account slot alone. | Q11 |
| shared/ui/site-chrome | Acceptance review: after the fold, the durable Handler-gated line still shows Cart only with its handler, against the Cart slot requirement. | Q11 |
