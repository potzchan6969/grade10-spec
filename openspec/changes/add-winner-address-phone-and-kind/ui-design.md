## Screens

### Winner Order — Complete Order Setup · Add Address

Layout SoT: Storybook —

- `my-auctions-winner-order-setup-complete-order-setup--add-delivery-address`
- `Auction Order/AuctionAddressForm` (Personal, Company, phone empty / filled)

No new Figma frame. Phone chrome follows the approved comps (flag or globe,
calling code when shown, divider when shown, national number; country popup
with search). Ignore password-manager overlays in comps.

Personal / Company sits above the scrollable fields so the segmented-control
pill shadow is not clipped by `DialogBody` scroll-fade.

Country/Region on setup uses design-system `Autocomplete` (searchable
catalogue) — owned by `full-winner-order-country-region-list`; this change
does not redefine that picker.

### Winner Order — Complete Order Setup · Delivery picker

Layout SoT: Storybook —

- `my-auctions-winner-order-setup-complete-order-setup--delivery-picker`

Saved and one-time address cards use the shared RadioCard title for the
display name — company name when the address is company, recipient name when
personal. Card body lines are street, city or region, and country — no
postal code and no phone.

### Winner Order — Order summary · Delivery and Billing

Layout SoT: Storybook —

- `my-auctions-winner-order-setup--preparing-invoice`
- Setup confirm flow: `my-auctions-winner-order-setup--complete-setup-flow`

No new Figma frame. Order summary reuses the sidebar text stack already on
Winner Order; content is the confirmed snapshot, not the lean picker card body.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `SegmentedControl`, `SegmentedControlItem` | `@grade10/design-system` | Personal / Company; sliding pill |
| `InputShell`, `Input`, `Autocomplete` (setup country) | `@grade10/design-system` | Phone field shell; Country/Region on setup — invalid uses inset ring like Text Input |
| `AuctionAddressForm` | `@grade10/ui` | Shared address form; owns kind + phone |
| Block-local `AuctionPhoneField` | `@grade10/ui` `auction-order` | Wraps `react-phone-number-input`; not a design-system primitive |
| Page-local setup dialog | `apps/preview` `winner-order-setup-dialog` | Nested Add Address; picker lean `lines` vs order `summary` |
| Page-local Winner Order page | `apps/preview` `winner-order-page` | Order summary Delivery / Billing show `summary` |

**Missing / deferred:** Figma PhoneInput set and Code Connect — promote the
block field when design publishes one.

**Copy:** Personal, Company, Phone, Company Name, phone placeholder
`+852 12345678`, country search placeholder. Preview holds English stand-ins;
`grade10-site` answers
keys in `@grade10/i18n` when it wires setup.

## States

### Add Address · Phone

| State | Shows | Anchor |
| --- | --- | --- |
| No country | Globe only (no divider); placeholder `+852 12345678` with a small gap after the globe | `winner-order-SC-187`, `winner-order-SC-201` |
| Country selected, empty number | Flag + calling code, divider, placeholder | `winner-order-SC-186` |
| Calling code already in value | Flag only (no duplicate calling code beside the flag), divider, national / international digits in the input | **Out of suite:** Storybook `Auction Order/AuctionAddressForm` phone comps |
| Country popup | Search e.g. United States; flag, name, calling code | **Out of suite:** Storybook `Auction Order/AuctionAddressForm` phone comps |
| Empty refused | Field refusal beside Phone | `winner-order-SC-185` |

### Add Address · Kind

| State | Shows | Anchor |
| --- | --- | --- |
| Personal (default) | SegmentedControl Personal selected with sliding pill; Company Name hidden | `winner-order-SC-190` |
| Company | Company selected; Company Name required | `winner-order-SC-191` |

### Delivery picker · Cards

| State | Shows | Anchor |
| --- | --- | --- |
| Personal saved | RadioCard title is recipient name; body is street, city/region, country | `winner-order-SC-192`, `winner-order-SC-202` |
| Company saved | RadioCard title is company name; body is street, city/region, country | `winner-order-SC-193`, `winner-order-SC-202` |
| Body omits | No postal code and no phone on the card body | `winner-order-SC-202` |

### Winner Order · Order summary

| State | Shows | Anchor |
| --- | --- | --- |
| Personal delivery | Recipient name, phone, full address including postal | `winner-order-SC-203` |
| Company delivery | Company name, recipient name, phone, full address including postal | `winner-order-SC-203` |
| Billing same as delivery | Billing block matches Delivery | `winner-order-SC-203` |
| Distinct from picker | Summary includes phone and postal; picker card body still omits them | `winner-order-SC-202`, `winner-order-SC-203` |
