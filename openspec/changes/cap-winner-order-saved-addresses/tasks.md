## 1. Design system and preview (grade10-spec)

Already shipped: @tangconst merged PR #495 (`feat/cap-winner-order-saved-addresses`)
into `main` on 2026-09-16, before this change had its `spec.md` to check
the work against. `CheckboxButton`'s disabled-unchecked/disabled-checked
drawing, `CheckboxListInput`'s disabled-dims-label-only fix, `Tooltip`'s
`z-[100]` positioner, and both
`apps/preview/src/pages/confirm-delivery-address.stories.tsx` and
`winner-order-address-dialog.tsx` already carry the cap states this
change's `ui-design.md` names. Leaving this group's tasks unchecked since
no `pnpm plan claim`/`done` has recorded them; whoever picks this change
up should confirm the shipped diff against `winner-order-SC-72` through
`SC-79` and check them off through the usual tooling rather than redoing
the work.

- [ ] 1.1 CheckboxButton disabled-unchecked draws `background-subtle` with a
  dashed border (Figma `2176:4095`); disabled-checked keeps primary at
  opacity-50 (`winner-order-SC-75`)
- [ ] 1.2 CheckboxListInput's disabled state dims the label and count only,
  leaving the control's own disabled drawing to CheckboxButton
  (`winner-order-SC-75`)
- [ ] 1.3 Raise Tooltip's content positioner to `z-[100]` so it clears a
  nested dialog's stacking (`winner-order-SC-75`)
- [ ] 1.4 Extend `apps/preview/src/pages/confirm-delivery-address.stories.tsx`
  and `winner-order-address-dialog.tsx` with the cap states from
  `ui-design.md`'s States table: book at five (Save disabled, one-time
  draft leads the list), empty book, and removing a saved card freeing a
  slot (`winner-order-SC-72` through `SC-79`)
- [ ] 1.5 Verify: `pnpm run test`

## 2. Address book cap (grade10)

- [ ] 2.1 Add `address_book_full` to `shippingAddressRefusalCodes` in
  `packages/grade10-auth/contracts/src/shippingAddresses.ts`
  (`winner-order-SC-73`)
- [ ] 2.2 In `saveShippingAddress`
  (`packages/grade10-auth/backend/src/services/shippingAddresses.ts`), count
  the account's non-archived addresses inside the existing `mutate()`
  transaction and refuse with `address_book_full` at five, before the
  insert (`winner-order-SC-72`, `winner-order-SC-73`)
- [ ] 2.3 Extend
  `packages/grade10-auth/backend/test/services/shippingAddresses.repo.test.ts`
  to prove: a fifth save succeeds, a sixth is refused, an account already
  holding six keeps them and is still refused, `updateShippingAddress` on
  one of five never consults the count, and archiving one of five frees a
  slot for the next save (`winner-order-SC-72`, `SC-73`, `SC-76`, `SC-77`,
  `SC-78`)
- [ ] 2.4 Verify: `pnpm run typecheck && pnpm run test:backend`

## 3. Winner Order address confirmation (grade10)

- [ ] 3.1 Add an explicit "Save this address for future orders" checkbox to
  `AuctionWinnerOrderPage.tsx`'s `AddressFields`; `amend()` reads
  `saveToAddressBook` from it instead of inferring it from
  `selectedAddressId === null` (`winner-order-SC-74`, `winner-order-SC-75`)
- [ ] 3.2 Disable the checkbox, leave it unchecked, and show a short refusal
  reason via a Tooltip when the account's saved-address count (from the
  existing `shippingAddresses()` query) is five (`winner-order-SC-75`)
- [ ] 3.3 Confirm a one-time address entered at the cap still sets the
  order's delivery snapshot without adding a sixth saved address
  (`winner-order-SC-74`)
- [ ] 3.4 Handle the `address_book_full` refusal from a save attempt that
  raced past the disabled checkbox (two tabs), surfacing the same short
  reason rather than a generic error (`winner-order-SC-73`)
- [ ] 3.5 Verify: `pnpm run typecheck && pnpm run test`

## 4. Product manual (grade10-spec)

- [ ] 4.1 Clear the 🚧 mark on **Saved addresses** in
  `docs/prds/products/grade10-site/auction/winner-order.md` once deployed;
  leave the ❓ **One-time address persistence** row open for whoever plans
  the shared Dialog assembly. Verify: `pnpm check:manual`
