## 1. Product record (grade10-spec)

- [ ] 1.1 Update the bidder-suspension, admin Users, shared Users-panel, and auction notification PRD pages with the single auction-standing source, operator cause, and untouched standing-bid outcome (`suspension-SC-12`–`SC-22`, `grade10-admin-console-user-directory-SC-16`–`SC-19`, `shared-console-user-directory-SC-30`–`SC-32`)
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. Shared contracts (grade10)

- [ ] 2.1 Add operator-safe and collector-safe suspension projections plus suspend/reinstate inputs and refusal codes to the auction contracts (`suspension-SC-17`–`SC-22`)
- [ ] 2.2 Extend `UserAccountPanel` with handler-gated auction standing and keep confirmation in `UserModerationDialog` (`shared-console-user-directory-SC-30`–`SC-32`)
- [ ] 2.3 Verify: `pnpm run typecheck && pnpm run test`

## 3. Data migration (grade10)

- [ ] 3.1 Make deadline cause fields nullable, preserve the active-suspension uniqueness guard, and add the expand/contract migration for compatibility with `bidders.banned` (`suspension-SC-17`, `suspension-SC-21`)
- [ ] 3.2 Backfill active legacy bans into the suspension projection without rewriting bid or listing history (`suspension-SC-13`)
- [ ] 3.3 Verify: `pnpm run db:drizzle:generate && pnpm run check:migrations`

## 4. Backend and API (grade10)

- [ ] 4.1 Route Bidders ban/unban and Users-panel suspend/reinstate through one idempotent, `auction:moderate`-protected suspension service (`suspension-SC-17`–`SC-22`, `grade10-admin-console-user-directory-SC-16`–`SC-19`)
- [ ] 4.2 Remove suspension-time retraction and re-resolution while retaining new-bid and maximum-raise refusals; prove standing maxima continue through auto-bidding and close (`suspension-SC-12`–`SC-16`)
- [ ] 4.3 Emit the operator-suspension notice without exposing the operator reason to the collector (`suspension-SC-20`)
- [ ] 4.4 Verify: `pnpm run test:backend` and focused auction suspension, bidder moderation, and router tests

## 5. Frontend (grade10)

- [ ] 5.1 Connect the Grade10 Users panel to the grant-protected suspend/reinstate procedures and render one move at a time with the required suspend reason (`grade10-admin-console-user-directory-SC-16`–`SC-19`)
- [ ] 5.2 Render the collector's generic operator-suspension notice and account standing while preserving payment and existing order access (`suspension-US-03`)
- [ ] 5.3 Keep the Bidders moderation surface's compatibility status and actions backed by the shared auction standing (`suspension-SC-13`)
- [ ] 5.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run check:admin-bundle`
