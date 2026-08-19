## 1. The shared date module (grade10)

- [ ] 1.1 Add `date-fns@^4` and `@date-fns/tz@^1` to `packages/utils/package.json` and register the `./dates` subpath, checking the resolved versions against the optional peers `@base-ui/react` declares.
- [ ] 1.2 Add `packages/utils/src/dates.ts` with `formatDay`, `formatMoment`, `formatEvent` and `formatDeadline` over date-fns `format`, one stated pattern each and `{ locale?: Locale; timeZone? }` applied through `tz` from `@date-fns/tz`, satisfying "A date takes one of four shapes" for "A day carries no time" and "An audit entry is ordered to the second", and "The platform states the format, and can be told the language" for all three of its scenarios.
- [ ] 1.3 Give `formatDeadline` the `zzz` token it cannot be rendered without, satisfying "A deadline names its time zone" for all three scenarios and "A message the platform sends states one zone" for "An auction email states its zone".
- [ ] 1.4 Let date-fns's `RangeError` on an invalid instant reach the caller unswallowed, satisfying "A date that is not a date stops the render".
- [ ] 1.5 Move `startOfDay`, `endOfDay` and `dayValue` from `apps/admin/grade10/src/dates.ts` into the module, re-expressing their string math as `startOfDay(parseISO(day))`, `endOfDay(parseISO(day))` and `format(at, "yyyy-MM-dd")` under the existing suite, with `apps/admin/grade10/src/dates.test.ts` moving to `packages/utils/test/dates.test.ts` and satisfying "A typed calendar day covers that whole day" for all three scenarios.
- [ ] 1.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` for the `@grade10/utils` suite.

## 2. Auction messages (grade10)

- [ ] 2.1 Render the close time in `packages/grade10-auction/backend/src/email/render.tsx` with `formatDeadline` at `timeZone: "UTC"`, deleting the local `CLOSES_AT` formatter, satisfying "A message the platform sends states one zone" for "Two recipients read one time"; the rendered close moves from `Aug 19, 2026, 02:00 PM UTC` to `19 Aug 2026, 14:00 GMT+0`, so update the email suite's expectation to the new text rather than around it.
- [ ] 2.2 Confirm the auction Worker bundles date-fns without a runtime import failure, and record the bundle delta `pnpm run build` reports for the auction service.
- [ ] 2.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and `pnpm run build`.

## 3. Operator-facing surfaces (grade10)

- [ ] 3.1 Replace the inline formatters in `apps/admin/grade10/src/pages/{store/OrdersTable,auction/parts,liability/LiabilitySection,rewards/RewardsSection,members/MemberRedemptionsTable,members/MemberLedgerTable}.tsx` with `formatMoment`, and in `pages/{users/UserTable,members/MemberSummaryCard,invitations/InvitationsSection}.tsx` with `formatDay`, satisfying "Two operator tables show one moment the same way" and "One reader, two browsers".
- [ ] 3.2 Replace the formatter in `apps/admin/grade10/src/pages/audit/AuditSection.tsx` with `formatEvent`, keeping the seconds an audit log is read for.
- [ ] 3.3 Do the same for `apps/admin/zzz/src/pages/{store/OrdersTable,users/UserTable,audit/AuditSection}.tsx`, so both panels read one module, satisfying "The same shape across both brands".
- [ ] 3.4 Repoint `apps/admin/grade10/src/pages/rewards/RewardFormDialog.tsx` and `pages/invitations/GrantInvitationDialog.tsx` at the module's day bridge and delete `apps/admin/grade10/src/dates.ts`, satisfying "A day reads back as it was typed" at the surface that types one.
- [ ] 3.5 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 4. Collector-facing surfaces (grade10)

- [ ] 4.1 Render both close times in `apps/frontend/grade10/src/pages/auctions/AuctionsPage.tsx` with `formatDeadline`, satisfying "The auction page shows a close", "A closed listing" and "A page and a message agree".
- [ ] 4.2 Repoint `packages/grade10-store/frontend/src/features/account/profile/presentation/views/ProfileView.tsx` at `formatDay`, so both storefronts read one module through the shared feature.
- [ ] 4.3 Repoint `packages/grade10-store/demo/src/useCases/{profile,orders}.tsx` and `packages/grade10-auction/demo/src/useCases/listingPage.tsx` at the module with an explicit `timeZone`, so their assertions do not depend on the machine running them.
- [ ] 4.4 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 5. Keeping it consolidated (grade10)

This group's check fails until groups 1 through 4 have landed their deletions.

- [ ] 5.1 Add `scripts/check-dates.mjs`, wired into `pnpm run check:libs` beside `check-money.mjs`, failing when `Intl.DateTimeFormat`, `toLocaleDateString`, `toLocaleTimeString` or `toLocaleString` appears outside `packages/utils/src/dates.ts`, and equally when `date-fns` or `@date-fns/tz` is imported outside it, with `packages/loyalty/backend/src/utils/time.ts` exempted by path and by a stated reason — it reads wall-clock parts to compute a program's period boundaries and renders nothing.
- [ ] 5.2 Prove the guard by planting each pattern it claims to catch — including a bare `date-fns` import — and watching it fail, then removing them.
- [ ] 5.3 Name the date module in `docs/conventions/code-layout.md` as the one place a date becomes text, beside the money rule it mirrors.
- [ ] 5.4 Update `docs/architecture/handbook.html` for the `@grade10/utils/dates` subpath.
- [ ] 5.5 Run `pnpm run check:libs`, `pnpm run check:handbook`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build`.
