## Context

Winner Order delivery Add Address in `apps/preview` already lists every
country and region through `apps/preview/src/pages/country-regions.ts` and
design-system `Select` typeahead with scroll-into-view. The live
`grade10-site` Winner Order form still collects `countryCode` as a free-text
`TextInput`, while auction contracts require an ISO 3166-1 alpha-2 code.

See [proposal.md](./proposal.md) for why.

## Goals / Non-Goals

**Goals:**

- Delivery Add Address Country/Region is a complete A–Z Select with letter
  typeahead that scrolls the match into view
- Field label reads Country/Region
- Empty Country/Region is refused beside the field
- Catalogue source is owned and deterministic — no new geo npm dependency

**Non-Goals:**

- Billing Add Address catalogue parity (PRD ❓)
- Shippable-only filter (PRD ❓)
- Site-wide country fields outside Winner Order setup
- Replacing Select with filter-as-you-type autocomplete
- Settling catalogue display locale (PRD ❓) — ship fixed English labels until
  Product lands

## Decisions

The specs own the catalogue completeness, typeahead scroll, label, and empty
refusal. Implementation choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| Catalogue source | Owned ISO 3166-1 alpha-2 list (+ XK) with labels from `Intl.DisplayNames` (`en`, `region`) at module load — same shape as `apps/preview/src/pages/country-regions.ts` | npm geo package; crawling grade10-admin in this change; hard-coding a short designated sample |
| Where the module lives | Keep the preview module as the preview SoT; mirror the same code list and label rules beside the live Winner Order address form in `grade10` (preview is not an import surface for the SPA) | Importing `apps/preview` from `grade10`; publishing a new shared package solely for this list |
| Select value vs API | Select shows the display name; submitted `countryCode` stays ISO alpha-2 to match `packages/grade10-auction/contracts` | Storing the display name on the order (breaks `^[A-Z]{2}$`); free-text country input |
| Typeahead scroll | Consume existing `@grade10/design-system` `Select` scroll-into-view on highlight; add a colocated unit proof if none covers long lists | A Winner Order-only scroll hack; a new `@grade10/ui` picker |
| Billing Add Address | Leave billing's country control unchanged in this change | Assuming delivery's full list applies to billing without Product |
| Display locale | Fixed English labels until the Catalogue display locale ❓ lands | Browser-locale labels that reorder A–Z under the winner's language without a product call |
| i18n | Label and empty-refusal copy through `@grade10/i18n` when the SPA wires setup; preview keeps English stand-ins | Hard-coding Country/Region only in the SPA with no catalog key |

## Risks / Trade-offs

- **[Risk]** Preview and SPA code lists drift → **Mitigation:** same REGION_CODES set and `Intl.DisplayNames` rules; a fixture or snapshot of option count / first / last labels in both trees.
- **[Risk]** Display-name ↔ ISO mapping misses a code → **Mitigation:** build options from codes, never from free labels; tests assert every option's value is a two-letter code.
- **[Risk]** Product later requires shippable-only or billing parity → **Mitigation:** catalogue module stays a pure list; filtering or a second consumer is a follow-up change.

## Database Schema

None. Address snapshots already store `countryCode`.

## Service Interfaces

None. Confirm-address already validates `countryCode` as `^[A-Z]{2}$`.

## Migration Plan

None. Deploy the SPA form change after the submodule bump that carries any
Select / i18n fixes. Rollback reverts the form to the free-text field without
data migration.
