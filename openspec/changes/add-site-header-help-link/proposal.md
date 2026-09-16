**Author:** @tangconst - 2026-09-16

## Why

Collectors looking for store or auction help leave the header with nowhere to
go — Help was never wired, and the chrome had no way to open an off-site
documentation host safely. Support and docs live outside the site shell; the
header must still offer a clear path without trapping the collector on a
not-found page.

**Metric:** share of header sessions where Help is activated and lands on the
documentation host in a new tab (baseline unset until the provisional host is
confirmed).

## What Changes

- **Help in the primary nav** — auction-only and full primary nav both list
  Help (wide bar and compact menu), styled like other primary items. When
  Store Locator is present, Help follows it; on auction-first, Help follows
  Auction
- **Opens documentation in a new tab** — Help leaves the site for the docs
  host; the current page stays open
- **`NavLink.external`** — design-system `Nav` opens a link marked `external`
  with `target="_blank"` and `rel="noopener noreferrer"` in primary nav
  (wide and compact) and in utility links
- **Page-shell link rule** — primary nav may include the documentation host
  Product names; unanswered site surfaces stay omitted

## Non-Goals

- **Confirming the docs host** — provisional Mintlify URL stays ❓ until
  Product confirms; this change does not lock the host
- **Shipping, Orders & Returns, or other utility destinations** — out of
  scope until those pages answer
- **In-app help centre or support chat** — off-site docs only
- **Visual external-link icon** — same `NavigationLink` treatment as other
  primary items; no new trailing affordance
- **ZZZ chrome copy or destinations** beyond the shared `NavLink` contract

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/site-chrome`: `NavLink.external` opens marked links in a new tab
- `grade10-site/site/page-shell`: Help primary-nav item (after Store Locator
  when present, after Auction on auction-first); documentation destination
  allowed in primary nav

## Impact

- **`@grade10/design-system`** — `NavLink` gains optional `external`; primary
  nav and utility regions honour it
- **`@grade10/ui`** — `SiteHeader` fixtures pass Help as an external nav item
- **`apps/preview`** — auction chrome lists Help after Auction; store chrome
  lists Help after Store Locator
- **Consumers** — grade10-site supplies Help href and `external: true` once
  Product confirms the host (provisional Mintlify URL acceptable until then)

## Follow-on changes

- Confirm and fold the documentation host address
- Add utility destinations when those pages answer

## Open questions

- **Documentation host** — Product confirms whether
  `https://grade10.mintlify.io/` (or another host) is the durable Help
  destination

## References

- [Page Shell · Help](../../../docs/prds/products/grade10-site/site/page-shell.md#help)
- [Site Header and Footer · External Links](../../../docs/prds/products/shared/ui/site-chrome.md#external-links)
