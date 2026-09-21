## Screens

### Winner Order — Complete Order Setup · Add Address (delivery)

Layout SoT: Storybook —

- `my-auctions-winner-order-setup-complete-order-setup--add-delivery-address`
- `my-auctions-winner-order-setup-complete-order-setup--delivery-picker`

No new Figma frame — nested Add Address already uses design-system `Select`
for Country/Region; this change fills the option list and keeps letter
typeahead with scroll-into-view.

Billing Add Address is the same nested form today; whether Product requires
the same full catalogue there is ❓ — do not treat billing parity as decided
in States until that row closes.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` | `@grade10/design-system` | Country/Region picker; typeahead highlight scrolls into the popup |
| Page-local setup dialog | `apps/preview` `winner-order-setup-dialog` | Delivery (and shared nested) Add Address; catalogue module beside the page |

**Missing / engineer-owned:** where the country/region catalogue is obtained
(owned ISO + `Intl.DisplayNames`, npm package, or crawl from grade10-admin) —
flag for `tech-design.md` / `tasks.md`, not a new primitive. Preview may keep
a stand-in module until the app wires the chosen source.

No new `@grade10/ui` export for this picker.

**Copy:** label Country/Region; placeholder and empty refusal name country or
region. Preview holds English stand-ins; `grade10-site` answers keys in
`@grade10/i18n` when it wires setup.

## States

### Winner Order — delivery Add Address · Country/Region

| State | Shows | Anchor |
| --- | --- | --- |
| Closed | Trigger shows selected or default country/region (Hong Kong in fixtures); options not in the tree | `winner-order-US-01` |
| Open, long list | Every country/region A–Z in the popup; list scrolls inside a capped height | `winner-order-US-01` |
| Typeahead | Typed letter highlights the next matching name; that option is inside the popup's visible scrollport | `winner-order-US-01` |
| Empty refused | Confirm/Use This Address with country empty shows field refusal beside Country/Region | `winner-order-US-01` |
