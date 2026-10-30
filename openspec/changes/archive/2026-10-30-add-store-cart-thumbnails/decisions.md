## Goals

- Show the first current product picture for each retained reviewed cart line.
- Keep the existing shared picture fallback and sold-out treatment.
- Keep picture data out of stored cart intent and cart write inputs.
- Preserve legacy response compatibility, amounts, status and checkout readiness.

## Non-Goals

- Variant-specific picture selection, another product read per line or a picture cache.
- Shared UI redesign, new copy, database migration or a new production dependency.
- Changes to checkout arithmetic, cart status, readiness or production operations.
- Pending-operation behavior or implementation from the separate cart-drawer change.

## Decisions

The approved [thumbnail brief](../../../docs/references/store-cart-thumbnails.md) settles this scope on 2026-10-13. This change carries the picture work formerly in Groups 10-14 of `add-store-cart-drawer-ui`; that change retains its pending-operation Groups 15-17.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which picture identifies a cart product? | Its first current catalogue picture, matching the collection card, delivered by the existing live review | Variant-specific selection or another product read per line |
| Q2 | What happens without a picture or catalogue alt text? | Keep the existing placeholder when no picture is supplied; use the item name when alt text is absent or empty | Invented pictures or new fallback copy and layout |
| Q3 | Does picture absence affect checkout? | No; picture enrichment preserves price, quantity, status, totals and readiness | Treating missing pictures as unavailable products or blocking checkout |
| Q4 | Where is picture data kept? | In current reviewed display facts only; restored image-free intent obtains pictures through review again | Persisting picture metadata in member or guest cart intent |
| Q5 | Does guest-route coverage change who can open the drawer? | No; retain the existing member and guest cart journeys. Check both response paths for compatible optional enrichment | Adding a new signed-out policy from transport tests |
| Q6 | Who owns shared regression coverage? | Grade10-spec owns controlled-asset picture stories using existing props; Grade10 owns review-to-drawer integration | Copying the shared renderer into the application |
| Q7 | Does whitespace-only alt text use the item name? | No; only absent or empty text uses the item name. Existing shared rendering preserves a supplied non-empty string | New whitespace normalization in the shared block |
| Q8 | Does an empty picture URL show the placeholder? | Yes; the existing shared renderer treats an empty source as missing | Treating an empty source as a picture request |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-cart | Does whitespace-only catalogue alt text use the item name? | Q7 |
| shared/ui/store-cart | Does an empty picture URL show the placeholder? | Q8 |
