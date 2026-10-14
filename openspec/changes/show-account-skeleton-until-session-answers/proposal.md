**Author:** @seankcw - 2026-10-14

## Why

A collector who is already signed in opens the site and sees Sign In in the
header, then the account icon a moment later: the site shows Sign In until the
session answers. The header reads as signed out to every returning collector,
and it changes under them on every visit.

**Metric** - first paints where a signed-in collector's header shows Sign In
before the account icon; this change takes it to 0.

## What Changes

- **Placeholder before the session answers** - the site header holds the
  account entry's place with a placeholder the size of the account icon until
  the session first answers, so a signed-in collector goes straight to the
  account icon and a signed-out visitor straight to Sign In
- **A pending session for the shared header** - `SiteHeader` takes a pending
  session and draws that placeholder itself, so the look stays the store
  block's rather than the site's
- **Controls beside the account entry** - the page shell's rule for the
  session's arrival says no other control appears or disappears; the account
  entry's own change in width may move the language and search controls to
  its left

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `shared/ui/site-chrome`: `SiteHeader` takes a pending session and draws the
  account placeholder
- `grade10-site/site/page-shell`: the account entry before the session first
  answers, and what may move beside it when the session arrives

## Impact

- **Store** - `SiteHeader` in `packages/ui` and its stories; the session type
  gains a pending value, which no existing caller has to pass
- **grade10** - the site shell in `apps/frontend/grade10` passes the pending
  session until the session first answers
- **Overlap** - `restrict-auctions-by-region` modifies the same `SiteHeader`
  requirement; `nav-cart-count-badge`, accepted, modified the same page-shell
  requirement

## References

- [Page Shell · Session](../../../docs/prds/products/grade10-site/site/page-shell.md#session)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
