## Context

The Winner Order page already receives an optional `insuranceAmountMinor` on
the sent invoice and omits the Insurance row when that value is absent. Its
page-local `invoiceLines` and `SummaryRow` functions do not yet carry tooltip
metadata, and the no-invoice summary lists the other fee categories without
Insurance. The design system already exports the Tooltip primitives and the
Info icon pattern used elsewhere on the page. The preview assembly already
supports per-line tooltip content, while the shared `auctionOrders` catalogs
have no Insurance tip key yet.

## Goals / Non-Goals

**Goals:**

- Make the three Insurance summary states explicit in the page composition:
  shown with an amount, shown as TBD before send, and absent when not added.
- Add the Insurance tip to the shared auction-order vocabulary and preview
  states so the implementation and visual reference use the same copy.
- Keep the tooltip accessible through the existing design-system primitive and
  prove the behavior with focused tests and a fresh browser walk.
- Extend only the development winner fixture seam needed to seed a sent
  invoice with Insurance for E2E; keep the production contract unchanged.

**Non-Goals:**

- No database migration, invoice pricing change, or new production endpoint.
- No change to the existing fee labels, tooltip copy, or omission behavior for
  any other invoice line.

## Decisions

The capability spec governs when Insurance is present, whether it has an
amount, and the exact tooltip copy. The implementation keeps those facts at
the Winner Order presentation boundary.

- **Summary metadata** — add an optional tooltip string to the page-local
  `SummaryLine` shape. `invoiceLines` supplies the Insurance tip only when it
  creates the Insurance line; the no-invoice branch supplies the same tip to
  its TBD Insurance row. This keeps omission structural rather than rendering
  a hidden trigger.
- **Tooltip composition** — render the existing design-system `Tooltip`,
  `TooltipProvider`, `TooltipTrigger`, and `TooltipContent` around the Info
  icon. Give the icon-only trigger an accessible label that names Insurance,
  and keep the tip text in one page constant. A new shared component would add
  an export and a dependency for a single consumer, so it is rejected.
- **Copy ownership** — add the tip to the shared `auctionOrders` namespace in
  every supported locale and pass it into the page as translated copy. The
  winner-order page is a collector-facing site surface, so a literal is
  rejected even though the current page has older untranslated strings.
- **Preview reference** — update the existing Winner Order preview fixtures and
  interaction assertions to cover the insured, omitted, and pre-invoice
  states. A new design-system or `@grade10/ui` export is not needed.
- **Pre-invoice amount** — add Insurance only to the existing `invoice ===
  null` TBD list. Do not synthesize an invoice line or calculate a value before
  send; the sent-invoice path remains the only source of money values.
- **E2E fixture seam** — add an optional positive `insuranceAmountMinor` to the
  development-only winner fixture request and pass it through to `sendInvoice`.
  The default remains omitted, so existing status fixtures continue to prove
  the no-Insurance path. This is preferable to mutating production invoice
  behavior or relying on a database-only setup in Playwright.
- **Tests** — page tests cite `winner-order-SC-169`, `winner-order-SC-170`,
  and `winner-order-SC-171`; the fixture tests prove the optional seed input;
  the E2E walk uses the public winner-order URL and the isolated seed endpoint.

## Risks / Trade-offs

- **Risk:** A tooltip trigger could be rendered for an omitted Insurance row.
  **Mitigation:** Store the tooltip on the same optional line object and render
  the trigger only when that line exists; assert the absent state in tests.
- **Risk:** E2E coverage could pass against a fixture that does not contain
  Insurance. **Mitigation:** Require the seed response and page assertions to
  show the configured amount before opening the tooltip.
- **Risk:** The development fixture's optional amount could accept invalid
  values. **Mitigation:** Reuse the existing positive-minor-unit validation at
  the route boundary and keep the value optional.
