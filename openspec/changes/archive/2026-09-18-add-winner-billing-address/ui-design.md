# UI design

Storybook workbench under `apps/preview` is the layout source for Winner
Order setup. No Figma frame for the setup dialog, the invoice PDF, or the
admin billing edit. Behaviour stays in the journeys and, once written, the
capability specs. Payment-method copy is on
[`add-winner-bank-transfer`](../add-winner-bank-transfer/ui-design.md).

## Screens

### Winner Order — Order setup

No Figma frame. Storybook: `My Auctions/Winner Order/Setup/Complete Order Setup`
in `apps/preview/src/pages/complete-order-setup.stories.tsx`. The page that
opens it is `My Auctions/Winner Order/Setup` in
`apps/preview/src/pages/winner-order.settlement.stories.tsx`.

### Invoice and receipt

No Figma frame. No Storybook story. Bill To and Ship To are the PDF outcome
in the proposal.

### Post-sale — missing billing address

No Figma frame. No Storybook story.

## Components

- **Preview assembly, not a published export:** `WinnerOrderSetupDialog` in
  `apps/preview/src/pages/winner-order-setup-dialog.tsx`
- **Existing primitives:** `Dialog`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogSubtext`, `DialogDescription`, `DialogBody`,
  `DialogFooter`, `DialogClose`, `Button`, `RadioList`, `RadioCard`,
  `CheckboxListInput`, `EmptyState`, `TextInput`, `Select`, `SelectTrigger`,
  `SelectValue`, `SelectContent`, `SelectItem`, `IconButton`, `Tooltip`,
  `TooltipProvider`, `TooltipTrigger`, `TooltipContent`, `VStack`
- **Not built yet:** `AuctionAddressForm` in `packages/ui`, the export
  `add-my-auction-orders` names. The billing checkbox and the second address
  land on that block. Work in this store
- **i18n:** the step titles, `Add Address`, `Same as delivery address`, and
  the step descriptions are catalog work at delivery. Preview holds English
  draft props. `shared/` answers them unless a brand claims one

## States

### Winner Order — Order setup

| State | Shows | Anchor |
| --- | --- | --- |
| Delivery | Title Delivery Address. Step 1 of 3. We’ll ship this lot here. You set the billing address on the last step. Saved address cards. Add New Address. Continue | `winner-order-SC-152` |
| No saved addresses | EmptyState: No saved addresses. Add a delivery address to continue. Continue disabled | `winner-order-SC-152` |
| Add address | Title Add Address, from delivery or billing. Use This Address | `winner-order-SC-153` |
| Address book full | Save this address for future orders refused. A one-time address still confirms | `winner-order-SC-153` |
| Billing, same as delivery | Title Billing Address. Step 3 of 3. This address is printed on your invoice. Same as delivery address ticked. The delivery address shown. Complete Order Setup | `winner-order-SC-152` |
| Billing, different address | Same as delivery address unticked. Saved-address picker. Add New Address | `winner-order-SC-153` |
| Billing, no saved addresses | Same as delivery address unticked. EmptyState: No saved addresses. Add a billing address to continue | `winner-order-SC-153` |

### Invoice and receipt

| State | Shows | Anchor |
| --- | --- | --- |
| Bill To and Ship To | Both from the order snapshot. A receipt keeps the invoice’s addresses | `winner-order-SC-154` |

### Post-sale — missing billing address

| State | Shows | Anchor |
| --- | --- | --- |
| Send refused | Send names the missing billing address | `post-sale-SC-153` |
| Added before send | The operator adds the billing address with the edit before send | `post-sale-SC-154` |
| Phone record | Asks for billing. Same as delivery address ticked | `post-sale-SC-154` |
