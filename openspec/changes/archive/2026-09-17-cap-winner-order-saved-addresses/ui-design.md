# UI design

Storybook under `My Auctions/Confirm Delivery Address` is the layout source of
truth for the address picker and nested Add Delivery Address form this change
extends. No new Figma frame; CheckboxButton disabled-unchecked follows Figma
`2176:4095`.

Behaviour stays in the capability spec. This file maps surfaces, exports, and
states — it does not restate requirements.

## Screens

### Confirm Delivery Address

| Surface | Storybook (SoT) |
| --- | --- |
| Picker with saved cards | `My Auctions/Confirm Delivery Address` → Picker |
| Nested Add Delivery Address | `My Auctions/Confirm Delivery Address` → Add delivery address |
| Empty address book | `My Auctions/Confirm Delivery Address` → No saved addresses |
| Remove a saved card | `My Auctions/Confirm Delivery Address` → Remove saved address |
| Book at the five-address cap | `My Auctions/Confirm Delivery Address` → Address book full |

### Design-system primitives (supporting)

| Surface | Storybook (SoT) |
| --- | --- |
| CheckboxButton disabled unchecked | `Components/CheckboxButton` → Disabled unchecked |
| CheckboxListInput disabled checked | `Components/CheckboxListInput` → Disabled checked |
| CheckboxListInput disabled unchecked | `Components/CheckboxListInput` → Disabled unchecked |

## Components

### Confirm Delivery Address (preview assembly)

Preview-only under `apps/preview` until a shared Winner Order address block
exists — not a `@grade10/ui` export yet.

- Design-system `Dialog` / `DialogContent` (nested Add Delivery Address at
  `z-[60]`)
- Design-system `RadioList` + `RadioCard` for saved and one-time draft options
- Design-system `EmptyState` when the book is empty
- Design-system `CheckboxListInput` (`size="sm"`) for Save this address for
  future orders — disabled and unchecked at the cap
- Design-system `Tooltip` + `TooltipTrigger` + `TooltipContent` beside the
  refused save row (Info icon; not inside the checkbox label). Tooltip
  positioner uses `z-[100]` so content clears nested dialogs
- Design-system `Button`, `TextInput`, `Select`, `IconButton`, `HStack`,
  `VStack` as composed today

### Design-system changes in this change

- **CheckboxButton** — disabled unchecked draws `background-subtle` + dashed
  border (Figma `2176:4095`); disabled checked keeps primary at opacity-50
- **CheckboxListInput** — disabled dims label and count only; the control keeps
  its own disabled drawing
- **Tooltip** — content positioner raised above nested dialog stacking

### Still work in this repo (not yet)

- Shared `@grade10/ui` Winner Order address dialog export — preview assembly
  until delivery plans the block
- `packages/i18n` keys for picker copy and the refuse tooltip — preview strings
  today; catalog answers when the shared block ships

## States

| State | Anchor |
| --- | --- |
| Book at five saved addresses: Add new address still opens; Save for future disabled unchecked with Info tooltip; Use this address keeps a one-time draft at the top of the picker | `winner-order-US-09` |
| Newly saved address (under the cap) leads the picker list | `winner-order-US-01` |
| Empty book EmptyState; Confirm disabled until an address exists | `winner-order-US-01` |
| Remove a saved card frees a slot so save can be offered again | `winner-order-US-09` |
