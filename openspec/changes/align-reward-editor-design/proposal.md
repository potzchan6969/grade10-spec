**Author:** @ecchochan - 2026-09-14

## Why

The reward editor on staging (`admin.grade10-stg.com/rewards/new`) does
everything the approved design mock ([`mock.html`](mock.html)) does, but it
looks and reads differently. The kind is a radio list with two options, short
choices are radio rows, money fields put the currency after the amount, and
the preview rail is one flat card. A free item, the most common physical
reward, has no choice of its own: the operator finds `Everything (free)` under
Money off, then Named variants, then picks one.

## What Changes

- **Kind** — three cards: Money off, Free item, Gift with a purchase. A free
  item is one variant at 100% off, saved as the same coupon Money off saves,
  and a stored reward of that shape opens as a free item
- **Short choices** — discount, scope, channels, stock and window are
  segmented controls, on every admin page that lays a choice across the line
- **Money fields** — the currency sits in front of the amount, on every admin
  page
- **Grade10 admin theme** — the mock's type, heading sizes, corner radii and
  status tints, on every Grade10 admin page
- **Preview rail** — the menu card with its points and Redeem pill, the coupon
  sentence with its values in bold, and the basket check as a foldable section
  with a tinted verdict
- **Page** — a `← Rewards` link above the title and a save bar pinned to the
  bottom
- **Copy** — the mock's words, except where staging's carry a rule the mock
  lacks: a coupon never adds the item to the basket, and named products are
  online-only too

Everything staging already does stays: the searchable facet picker, adding
basket lines by search, Duplicate and Archive on the edit page, and
`Everything (free)` on any scope.

## Non-Goals

- No change to what a coupon takes off, or to what saving sends to the backend
- No new theme for the ZZZ admin: it keeps Stone, and the shared controls take
  their new shape wherever it renders them
- No change to how a table cell writes an amount
- No dark admin: the brand states light only
- No thumbnails in the picked list: the catalogue search carries no image

## Capabilities

### Modified Capabilities

- `grade10-site/loyalty/programme`:
  - "A reward names a kind, a discount and a scope" states the maximum
    discount as optional, as the console already saves it
  - "The console's reward form authors a reward's full definition" offers a
    free item as its own choice, and reopens a stored reward of that shape as
    one

## Impact

- **Console package** (`packages/frontend-console`, grade10) — `ChoiceList`
  draws segmented and card appearances and drops `horizontal`; `MoneyField`
  puts the currency first; headings, panels, the rail layout and a
  `Disclosure` word change. No `@grade10/design-system` or `@grade10/ui`
  export changes
- **Admin theme and root** (`packages/frontend-admin-theme`,
  `apps/admin/grade10`, grade10) — type, sizes, radii and tints; the font is
  loaded
- **Reward editor** (`packages/loyalty/admin-frontend`, grade10) — choices,
  the free item draft, the rail, the save bar and the copy
- **Call sites** — appointment dialogs, loyalty views and the admin test pages
  move off `horizontal`; the ZZZ admin's shared headings follow
- **End-to-end suite** — `apps/frontend/grade10/e2e/tests/loyalty/rewards.spec.ts`
  creates and reopens a free item

## Success

- An operator creating a free item makes two choices (Free item, one
  variant), where staging takes four

## Open Questions

- ❓ **Currency mark** — the mock shows `HK$`; fields show the ISO code (`HKD`),
  as console tables do, until @ecchochan decides otherwise

## Follow-on Changes

- Form choices are announced as one choice, whatever their appearance
- The console export list matches what the package exports
- **Reward editor structure** — one catalogue picks object, a rail that takes
  its words and a basket slot, and the editor emitting its own save command
- **Console words in their own files** — `vocabulary.tsx` split at its seams,
  with the Select create-option note corrected
- **Fields that take an id and a read-only form** — in place of wrapper divs
  and a `disabled` on every control
- **Button `outline`** — kept or dropped, now that the Grade10 secondary button
  draws the same
- **Admin end-to-end pages on the page fixture** — so every admin spec keeps a
  capture per step
- **A pinned rail taller than the screen** — its bottom reachable before the
  form ends
- **The checkout test bench's gift** — keeps the product handle it was picked
  with
- **A cleared per-redemption bound stays cleared** — a backend fix found here,
  with one coupon fulfilment builder for the loyalty backend tests
- **The users directory on a phone** — an open account panel runs past the
  screen's edge, because its column keeps a 28rem minimum

## Archive

@ecchochan archives once grade10 deploys this to production.

## References

- [Rewards · Reward Types](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-types)
- [Rewards · Reward Catalog](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-catalog)
