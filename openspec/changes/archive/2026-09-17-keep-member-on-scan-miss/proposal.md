**Author:** @ecchochan - 2026-09-15

## Why

A scan at the till that finds nobody takes the member off the sale. On the
staging tablet, something the till read as a scan found nobody in the middle
of a spend: the member's panel was gone, and staff had to scan the member's
card again to finish the sale. The session on the server was still open the
whole time; only the till had let go of it.

The measure: **the same member identified twice within a minute at one
shop**, which should fall.

## What Changes

- **A lookup that identifies nobody leaves the member on the sale.** No
  match, a used or expired code, paused or throttled entry, or no answer: the
  till keeps the member, their session and the points and coupons staff had
  chosen, and the panel shows what the lookup answered.
- **A lookup that finds a member replaces the one on the sale**, as today.
- **An outdated till or membership switched off still takes membership off
  the till**, as today; the sale goes on as an ordinary sale.

## Non-Goals

- A lookup with nobody on the sale behaves as today.
- No change to how long a session lives or what a session may do.
- A found member whose panel cannot be read, which reads as membership
  switched off, is its own change.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `grade10-site/store/membership`: identification at the till keeps the
  member on the sale when a lookup identifies nobody.

## Impact

- The till extension's lookup and its hold on the session
  (`integrations/shopify-pos/grade10`), one extension version
- The browser till and the demo lane, which run the same extension

## References

- [Shopify Integration · POS Extension](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md#pos-extension)
