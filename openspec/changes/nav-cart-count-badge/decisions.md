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
| Q11 | The site-chrome Handler-gated line is restated here in wording `omit-profile-account-menu` changes. Which change carries it? | `omit-profile-account-menu`, as its Q12 records. Feature-set lines fold by label, so a restated line reverts whatever folded before it. This change keeps only the lines it changes: Active-line count, Cart slot and Cart count; the Cart slot line says a supplied slot shows Cart with or without a cart handler. That change's Handler-gated line names both slots - "render only when their handler is supplied, or, for account and cart, their slot" - as `Nav` shows them (`packages/design-system/src/components/layout/nav.tsx:326-327`). Whichever is accepted first, the durable Handler-gated line disagrees with the Cart slot rule until the other lands, so the two are accepted back to back, in either order, as that change's Q12 allows - decided by the round | Each change carrying the other's lines, which ties both changes to every later edit of either. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/site-chrome | What does the header count mean? | Q8 |
| grade10-site/site/page-shell | Should an already verified same-member count remain while a refresh is pending, and does a failed mutation trigger that refresh? | Q9 |
| shared/ui/site-chrome | Rebase onto `omit-profile-account-menu`: this delta restates the Handler-gated line that change rewrites. | Q11 |
| shared/ui/site-chrome | QA2 fourth reading: `omit-profile-account-menu`'s Handler-gated line shows cart only with its handler and names the account slot alone, against this change's Cart slot line. | Q11 |
| shared/ui/site-chrome | QA2 fifth reading: Q11 said `omit-profile-account-menu`'s Handler-gated line names the cart slot; that change's branch still names the account slot alone. | Q11 |
