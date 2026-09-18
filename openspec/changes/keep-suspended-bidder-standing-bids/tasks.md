## 1. Product record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update the bidder-suspension, Users-panel, and shared user-directory PRD pages to describe one auction standing, preserved standing maxima, operator causes, and reason privacy (`suspension-SC-12`–`SC-22`, `grade10-admin-console-user-directory-SC-16`–`SC-19`, `shared-console-user-directory-SC-30`–`SC-32`)
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. Shared contracts (grade10)

- [ ] 2.1 Split collector and operator suspension projections, and add the handler-gated auction-standing props to `UserAccountPanel` without changing its public export set (`suspension-SC-20`, `grade10-admin-console-user-directory-SC-16`–`SC-19`, `shared-console-user-directory-SC-30`–`SC-32`)
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run test`

## 3. Data migration (grade10)

- [ ] 3.1 Make operator-only suspension causes nullable, backfill active legacy Bidders bans into the authoritative auction suspension, and preserve historical retraction logs (`suspension-SC-17`–`SC-22`)
- [ ] 3.2 Verify: `pnpm run db:drizzle:generate && pnpm run check:migrations`

## 4. Backend and API (grade10)

- [ ] 4.1 Route Bidders moderation and Users-panel suspension through one idempotent, grant-protected suspension service, recording operator and deadline causes without duplicate active rows (`suspension-SC-17`–`SC-22`)
- [ ] 4.2 Remove suspension-time bid retraction and re-resolution while keeping the new-bid and maximum-raise guard; prove standing maxima, unchanged history, normal close, and payable won lots (`suspension-SC-12`–`SC-16`)
- [ ] 4.3 Deliver the operator-suspension notice with contact guidance while omitting the operator's reason from collector-facing data (`suspension-SC-20`)
- [ ] 4.4 Verify: `pnpm run test:backend`

## 5. Frontend (grade10)

- [ ] 5.1 Render auction standing apart from platform ban in the Users account panel, expose only the grant- and state-appropriate move, and delegate confirmation to `UserModerationDialog` (`grade10-admin-console-user-directory-SC-16`–`SC-19`, `shared-console-user-directory-SC-30`–`SC-32`)
- [ ] 5.2 Render collector suspension status and contact guidance without the operator reason, and keep standing bids and normal winner order surfaces visible (`suspension-SC-13`–`SC-16`, `suspension-SC-20`)
- [ ] 5.3 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build`
