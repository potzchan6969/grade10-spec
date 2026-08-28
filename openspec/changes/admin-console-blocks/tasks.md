# Tasks — admin-console-blocks

## 1. Console package grows the shared blocks (grade10) (owner: @sean)

- [x] 1.1 Bump `external/grade10-spec` to a `main` SHA carrying the design-system Table primitives; rebase the console package's table furniture onto `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`, keying headings positionally, keeping its consumer surface unchanged so `console-blocks-SC-01` and `console-blocks-SC-02` hold
- [x] 1.2 Add `SectionHeader`, `StatusBadge`, and `Figure` with props types, ported from the surveyed markup, making `console-blocks-SC-03` and `console-blocks-SC-12` pass
- [x] 1.3 Add `OperatorIdentity` (email, roles, sign-out callback, failure line) with its props type, making `console-blocks-SC-03` and `console-blocks-SC-12` pass
- [x] 1.4 Add `CursorPager` composing `Pagination`/`PaginationPrevious`/`PaginationNext`, making `console-blocks-SC-14` pass
- [x] 1.5 Consolidate the refusal keeper and the ISO-code money formatter into the package beside `useDebounced`; compose the formatter in `Money` so `console-blocks-SC-13` passes
- [x] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:submodules`

## 2. The user directory moves in (grade10) (owner: @sean)

Needs group 1 landed: the ported table sits on the console package's furniture.

- [x] 2.1 Copy `UserTable`, `UserRolesDialog`, `UserModerationDialog`, `UserSessionsDialog`, their types, and their tests into the console package, exports unchanged, table shell on the package furniture, so `user-directory-SC-01` through `user-directory-SC-10` pass from the new home
- [x] 2.2 Re-point grade10-auth admin-frontend's directory imports to the console package (`user-directory-SC-01`), leaving the apps' two-factor imports on `@grade10/ui` (`console-blocks-SC-04`)
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The shared UI package sheds the directory (grade10-spec)

Needs group 2 merged in grade10: the application repo re-points before this deletes.

- [ ] 3.1 Delete `packages/ui/src/blocks/auth-user-directory` and its public-entry exports so `console-blocks-SC-04` passes with the two-factor exports intact
- [ ] 3.2 Drop the capability row from the shared-ui specs README and add the `admin-console` product bullet to the specs README
- [ ] 3.3 Verify: `pnpm run lint`, `pnpm run typecheck`

## 4. Audit and store consoles migrate (grade10) (owner: @sean)

- [x] 4.1 Move the audit trail section onto `Table`, `Status`, and `CursorPager`, making `console-blocks-SC-01`, `console-blocks-SC-05`–`SC-07`, and `console-blocks-SC-14` pass there
- [x] 4.2 Move the store orders table, POS switches card, and order-claims card onto `Table`, `Status`, `SectionHeader`, `StatusBadge`, and `Money`, making `console-blocks-SC-01`, `console-blocks-SC-05`–`SC-07`, and `console-blocks-SC-13` pass there
- [x] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 5. Loyalty and appointment consoles migrate (grade10) (owner: @sean)

- [ ] 5.1 Move the loyalty ledger and redemptions tables onto `Table`, `Status`, `StatusBadge`, and `Money`, and collapse the two private figure components into `Figure`, making `console-blocks-SC-01` and `console-blocks-SC-13` pass there
- [ ] 5.2 Move the appointment day and schedule panels onto `Table`, `Status`, and `SectionHeader`, making `console-blocks-SC-01` and `console-blocks-SC-05`–`SC-07` pass there
- [ ] 5.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 6. Vault console migrates (grade10)

- [ ] 6.1 Move the case queue, timeline, payouts, and documents tables onto `Table`, `Status`, `SectionHeader`, and `Figure`, making `console-blocks-SC-01` pass there
- [ ] 6.2 Re-point vault's exported minor-unit formatter to the console package's formatter so `console-blocks-SC-13` passes with one implementation
- [ ] 6.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 7. Auction console migrates (grade10)

- [ ] 7.1 Replace the five panel badge maps with `StatusBadge` and adopt `SectionHeader` where the post-sale panel passes the ignored justify value, making `console-blocks-SC-01` pass there
- [ ] 7.2 Replace the post-sale panel's native confirms with the package's dialog confirmation, making `console-blocks-SC-08` and `console-blocks-SC-09` pass
- [ ] 7.3 Move the bidders and fulfillment filters onto `SegmentedControl` (`console-blocks-SC-11`) and give the bidders queue a `CursorPager` (`console-blocks-SC-14`)
- [ ] 7.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 8. Admin applications migrate (grade10)

- [ ] 8.1 Move the grade10 admin app's rewards, invitations, members, vault, auction, appointments, and dashboard pages onto the blocks: tables and status (`console-blocks-SC-01`, `SC-05`–`SC-07`), the dashboard's refused read in the error tone (`console-blocks-SC-06`), members paging on `CursorPager` (`console-blocks-SC-14`), panel switches on `Tabs` (`console-blocks-SC-10`), the window filter on `SegmentedControl` (`console-blocks-SC-11`), and the shop picker on `Select`
- [ ] 8.2 Replace the settings page's hand-built deactivation dialog with `FormDialog` (`console-blocks-SC-08`, `console-blocks-SC-09`) and its identity card, the gate page, and the app shell strips with `OperatorIdentity` (`console-blocks-SC-01`)
- [ ] 8.3 Apply the same moves to the zzz admin app's pages and shell, including its dashboard's error tone (`console-blocks-SC-06`)
- [ ] 8.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 9. Delivery (grade10)

Needs group 3 merged in grade10-spec: the bump crosses the deletion.

- [ ] 9.1 Re-point `external/grade10-spec` past the block deletion and pass `pnpm run check:submodules`, proving `console-blocks-SC-04`
- [ ] 9.2 Record the console package as the admin block home in `docs/conventions/code-layout.md` and run `pnpm run check:handbook` for the reshaped package surface
- [ ] 9.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`
