design_waived: Preview-only change composing the existing Link and Stepper in the existing WinnerProgressCard; it adds no application-repository work or new Figma-owned component.

## Context

The preview Winner Order assembles Order Progress in `apps/preview`. The
Shipped and Delivered stories already provide the fulfilment and tracking
facts. This change changes their presentation only; it adds no stored data,
service, or shared component contract.

## Decisions

- Reuse the existing tracking URL supplied to the preview card. Render the
  tracking number itself as the external `Link` in Order Progress, with its
  existing external-arrow treatment and new-tab behavior. Do not derive a URL
  from the carrier name or tracking number.
- Keep the display conditional on a fulfilled order with a tracking number.
  The `delivery_confirmed` fact does not hide or replace the link, so Shipped
  and Delivered use the same presentation. Preserve their existing stepper
  positions: Shipping for Shipped and Completed for Delivered.
- Remove the separate Track shipment control and carrier name from Order
  Progress. The shipped record's tracker contents are carried by
  `add-winner-order-tax-line`, not here.

## Risks / Trade-offs

- **A story can pass with the wrong destination** -> Assert the link `href`
  against the carrier tracking URL in both Shipped and Delivered story play
  functions.

## Open Questions

None.
