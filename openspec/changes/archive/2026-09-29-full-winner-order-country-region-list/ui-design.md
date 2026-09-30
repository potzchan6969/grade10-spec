## Screens

### Winner Order — Complete Order Setup · Add Address (delivery)

Layout SoT: Storybook —

- `my-auctions-winner-order-setup-complete-order-setup--add-delivery-address`
- `my-auctions-winner-order-setup-complete-order-setup--delivery-picker`

No new Figma frame — nested Add Address uses design-system `Autocomplete`
for Country/Region; this change fills the option list and filters as the
winner types.

Billing Add Address is the same nested form today; whether Product requires
the same full catalogue there is ❓ — do not treat billing parity as decided
in States until that row closes.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Autocomplete`, `AutocompleteContent`, `AutocompleteEmpty`, `AutocompleteInput`, `AutocompleteItem`, `AutocompleteList` | `@grade10/design-system` | Country/Region searchable picker; filter-as-you-type; list rows ≥ 44px |
| Page-local setup dialog | `apps/preview` `winner-order-setup-dialog` | Delivery (and shared nested) Add Address; catalogue module beside the page |

**Missing / engineer-owned:** where the country/region catalogue is obtained
(owned ISO + `Intl.DisplayNames`, npm package, or crawl from grade10-admin) —
flag for `tech-design.md` / `tasks.md`, not a new primitive. Preview may keep
a stand-in module until the app wires the chosen source.

No new `@grade10/ui` export for this picker.

**Copy:** label Country/Region; placeholder and empty refusal name country or
region; search placeholder for the Autocomplete input. Preview holds English
stand-ins; `grade10-site` answers keys in `@grade10/i18n` when it wires setup.

## States

### Winner Order — delivery Add Address · Country/Region

| State | Shows | Anchor |
| --- | --- | --- |
| Closed / empty | Trigger or input shows selected value or empty; options not in the tree until open | **Out of suite:** design-system Autocomplete closed state / stories |
| Open, long list | Every country/region A–Z in the popup; list scrolls inside a capped height; rows ≥ 44px | `winner-order-SC-174` |
| Filter | Typed query narrows the list to matching names | `winner-order-SC-175` |
| No match | Typed query with no catalogue match shows an empty list | `winner-order-SC-178` |
| Empty refused | Confirm/Use This Address with country empty shows field refusal beside Country/Region | `winner-order-SC-177` |
