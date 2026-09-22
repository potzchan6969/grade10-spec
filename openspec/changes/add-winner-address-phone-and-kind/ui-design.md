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

### Winner Order — Complete Order Setup · Delivery picker

Layout SoT: Storybook —

- `my-auctions-winner-order-setup-complete-order-setup--delivery-picker`

Saved and one-time address cards use the shared RadioCard title for the
display name — company name when the address is company, recipient name when
personal.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `SegmentedControl`, `SegmentedControlItem` | `@grade10/design-system` | Personal / Company; sliding pill |
| `InputShell`, `Input`, `Select` (setup country) | `@grade10/design-system` | Phone field shell; Country/Region on setup — invalid uses inset ring like Text Input |
| `AuctionAddressForm` | `@grade10/ui` | Shared address form; owns kind + phone |
| Block-local `AuctionPhoneField` | `@grade10/ui` `auction-order` | Wraps `react-phone-number-input`; not a design-system primitive |
| Page-local setup dialog | `apps/preview` `winner-order-setup-dialog` | Nested Add Address uses the shared form contract |

**Missing / deferred:** Figma PhoneInput set and Code Connect — promote the
block field when design publishes one.

**Copy:** Personal, Company, Phone, Company Name, Enter phone number, country
search placeholder. Preview holds English stand-ins; `grade10-site` answers
keys in `@grade10/i18n` when it wires setup.

## States

### Add Address · Phone

| State | Shows | Anchor |
| --- | --- | --- |
| No country | Globe only (no divider); placeholder Enter phone number with a small gap after the globe | `winner-order-US-01` |
| Country selected, empty number | Flag + calling code, divider, placeholder | `winner-order-US-01` |
| Calling code already in value | Flag only (no duplicate calling code beside the flag), divider, national / international digits in the input | `winner-order-US-01` |
| Country popup | Search e.g. United States; flag, name, calling code | `winner-order-US-01` |
| Empty refused | Field refusal beside Phone | `winner-order-US-01` |

### Add Address · Kind

| State | Shows | Anchor |
| --- | --- | --- |
| Personal (default) | SegmentedControl Personal selected with sliding pill; Company Name hidden | `winner-order-US-01` |
| Company | Company selected; Company Name required | `winner-order-US-01` |

### Delivery picker · Cards

| State | Shows | Anchor |
| --- | --- | --- |
| Personal saved | RadioCard title is recipient name | `winner-order-US-01` |
| Company saved | RadioCard title is company name | `winner-order-US-01` |
