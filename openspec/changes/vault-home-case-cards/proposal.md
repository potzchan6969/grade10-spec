**Author** - @ecchochan, 2026-10-02

Product context: [Collector Pages · Case List](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-list), built from [Vault Blocks](../../../docs/prds/products/shared/ui/vault-case.md).

## Why

The site assembles its own case card from `FactCard`, so the vault home
with cases does not read as its board, and no published story shows it
without signing in.

**Metric:** every difference between the board's Vault home and the site's
list in the same state is closed or named by a row in `decisions.md`, with
no card assembly left in the site.

## What Changes

- **One home, two consumers** - the home with cases becomes `VaultCases` in
  `@grade10/ui`, drawing a card per case; the Vault Case stories and the site
  both render it, each from its own data
- **The card reads as the board** - as
  [the card's requirement](specs/shared/ui/vault-case/spec.md) states; the
  item's name opens the case
- **Your cases** - a heading with the count, a full-width Start a request and
  the several-items note around the cards
- **The site's assembly goes** - `CaseList` maps each case into the block;
  its own card, the Open button and the No visit booked line go

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/vault-case` - `VaultCases` joins the two vault blocks.

## Impact

| Consumer | Change |
| --- | --- |
| `@grade10/ui` | Exports `VaultCases` with its types and a story per case state |
| `@grade10/i18n` | `vault.list.yourCases` in every shared locale; `vault.list.open` and `vault.list.noVisit` go |
| `packages/vault/frontend` | `CaseList` renders `VaultCases`; the ownership chip's tones follow the board |
| `apps/frontend/grade10` E2E | A card is opened by its one control rather than by Open |

## Ordering and Dependencies

- **After `vault-walk-ins-and-owners`**, archived. A walk-in draft's line is
  that change's word, carried as the card's next step unchanged
- **Beside `add-item-registry`**. It touches neither the list nor
  `shared/ui/vault-case`

## References

- [Collector Pages · Case List](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-list)
- [Vault Blocks · The Blocks](../../../docs/prds/products/shared/ui/vault-case.md#the-blocks)
