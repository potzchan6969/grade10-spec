## 1. The shared date module (grade10)

- [ ] 1.1 Add `packages/utils/src/dates.ts` with `formatDay`, `formatMoment`, `formatEvent` and `formatDeadline`, each taking `{ locale?, timeZone? }` and memoizing its `Intl.DateTimeFormat` on both, satisfying "A date takes one of four shapes" for "A day carries no time", "An audit entry is ordered to the second" and "A reader reads their own locale"; register the `./dates` subpath in `packages/utils/package.json`.
- [ ] 1.2 Give `formatDeadline` a time-zone name it cannot be rendered without, satisfying "A deadline names its time zone" for all three scenarios and "A message the platform sends states one zone" for "An auction email states its zone".
- [ ] 1.3 Move `startOfDay`, `endOfDay` and `dayValue` from `apps/admin/grade10/src/dates.ts` into the module unchanged, with `apps/admin/grade10/src/dates.test.ts` moving to `packages/utils/test/dates.test.ts`, satisfying "A typed calendar day covers that whole day" for all three scenarios.
- [ ] 1.4 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` for the `@grade10/utils` suite.

## 2. Auction messages (grade10)

- [ ] 2.1 Render the close time in `packages/grade10-auction/backend/src/email/render.tsx` with `formatDeadline` at `timeZone: "UTC"` and `locale: "en"`, deleting the local `CLOSES_AT` formatter, satisfying "A message the platform sends states one zone" for "Two recipients read one time" and holding the existing email suite's rendered output unchanged.
- [ ] 2.2 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Operator-facing surfaces (grade10)

- [ ] 3.1 Replace the inline formatters in `apps/admin/grade10/src/pages/{store/OrdersTable,auction/parts,liability/LiabilitySection,rewards/RewardsSection,members/MemberRedemptionsTable,members/MemberLedgerTable}.tsx` with `formatMoment`, and in `pages/{users/UserTable,members/MemberSummaryCard,invitations/InvitationsSection}.tsx` with `formatDay`, satisfying "Two operator tables show one moment the same way".
- [ ] 3.2 Replace the formatter in `apps/admin/grade10/src/pages/audit/AuditSection.tsx` with `formatEvent`, keeping the seconds an audit log is read for.
- [ ] 3.3 Do the same for `apps/admin/zzz/src/pages/{store/OrdersTable,users/UserTable,audit/AuditSection}.tsx`, so both panels read one module, satisfying "The same shape across both brands".
- [ ] 3.4 Repoint `apps/admin/grade10/src/pages/rewards/RewardFormDialog.tsx` and `pages/invitations/GrantInvitationDialog.tsx` at the module's day bridge and delete `apps/admin/grade10/src/dates.ts`.
- [ ] 3.5 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 4. Collector-facing surfaces (grade10)

- [ ] 4.1 Render both close times in `apps/frontend/grade10/src/pages/auctions/AuctionsPage.tsx` with `formatDeadline`, satisfying "The auction page shows a close", "A closed listing" and "A page and a message agree".
- [ ] 4.2 Repoint `packages/grade10-store/frontend/src/features/account/profile/presentation/views/ProfileView.tsx` at `formatDay`, so both storefronts read one module through the shared feature.
- [ ] 4.3 Repoint `packages/grade10-store/demo/src/useCases/{profile,orders}.tsx` and `packages/grade10-auction/demo/src/useCases/listingPage.tsx` at the module with an explicit `locale` and `timeZone`, so their assertions do not depend on the machine running them.
- [ ] 4.4 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 5. Keeping it consolidated (grade10)

This group's check fails until groups 1 through 4 have landed their deletions.

- [ ] 5.1 Add `scripts/check-dates.mjs`, wired into `pnpm run check:libs` beside `check-money.mjs`, failing when `Intl.DateTimeFormat`, `toLocaleDateString`, `toLocaleTimeString` or `toLocaleString` appears outside `packages/utils/src/dates.ts`, with `packages/loyalty/backend/src/utils/time.ts` exempted by path and by a stated reason — it reads wall-clock parts to compute a program's period boundaries and renders nothing.
- [ ] 5.2 Name the date module in `docs/conventions/code-layout.md` as the one place a date becomes text, beside the money rule it mirrors.
- [ ] 5.3 Update `docs/architecture/handbook.html` for the `@grade10/utils/dates` subpath.
- [ ] 5.4 Run `pnpm run check:libs`, `pnpm run check:handbook`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build`.
