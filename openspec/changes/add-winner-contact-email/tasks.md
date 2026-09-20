## 1. Design system and catalogs (grade10-spec)

- [x] 1.1 Confirm `Textarea` stays exported from `@grade10/design-system` with the TextInput label / status / message contract (`winner-order-SC-162`)
- [x] 1.2 Add Winner Order Contact Us dialog chrome keys (title, To, Subject, Message, Copy Message, Open Mail App) under `@grade10/i18n` for every shared locale
- [x] 1.3 Keep letter Contact Us mailto helpers and templates covering setup overdue, payment overdue, cancelled, delivered and partial payment, each naming `support@grade10.com` in the body (`order-mail-SC-57`–`SC-61`)
- [x] 1.4 Keep the Post-Bidding Contact Us 🚧 / Copy Message confirmation ❓ lines aligned with the deltas (`pnpm check:manual`)
- [x] 1.5 Verify: `pnpm run typecheck && pnpm run test && pnpm check:manual`

## 2. Email rendering (grade10)

Depends on group 1 only for the submodule bump that carries Textarea and catalogs; letter string helpers can land in parallel against fixtures.

- [x] 2.1 Add ready-email helpers in the auction email package mirroring the store's subject / body / mailto rules (`winner-order-SC-164`–`SC-166`, `order-mail-SC-57`–`SC-61`)
- [x] 2.2 Build per-letter `contactUrl` at render from the order's current invoice id, lot title, receipt ids and reason — replace the bare storefront `mailto:support@grade10.com` constant for those kinds (`order-mail-SC-57`–`SC-61`, MODIFIED delivered / cancelled destination)
- [x] 2.3 Verify: `pnpm run typecheck && pnpm run test --filter @grade10/grade10-auction`

## 3. Winner Order frontend (grade10)

Can proceed from contracts and fixtures; does not need a running mail backend.

- [x] 3.1 Bump `external/grade10-spec` for `Textarea` and dialog i18n keys
- [x] 3.2 Replace the Contact Us toast with the copy-first dialog: To and Subject fixed with in-place copy, editable Message, Copy Message then Open Mail App (`winner-order-SC-160`–`SC-163`, `SC-167`)
- [x] 3.3 Prefill Subject and Message from the order's current invoice id, lot title, reason and receipt ids; omit the remaining balance; keep `support@grade10.com` off the page until open (`winner-order-SC-161`, `SC-164`–`SC-166`, `SC-168`)
- [x] 3.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test --filter grade10`
