# Tasks — shared-auth-audit

Groups 2 and 3 are claimable immediately. Groups 4 and 5 need group 1
landed; they do not need each other. Group 6 needs group 5 landed. Frontend
groups run against contracts and fixtures, never a running backend.

## 1. Shared audit list contract (grade10) (owner: @rita-liu)

- [ ] 1.1 Extend `auditListInput` and `AuditPagePayload` with `order`, `after`, `actorId`, `subjectId`, `personId`, `action`, `ok`, `from`, `to`, and `atSeq` so `audit-SC-01`, `audit-SC-02`, `audit-SC-04`, `audit-SC-06`, and `audit-SC-16` are expressible on the wire without an email field
- [ ] 1.2 Extend `AuditPageQuery` to the same shape so `listAuditPage` can apply those filters; default remains newest-first unfiltered (`audit-SC-03`)
- [ ] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` on `@grade10/audit-contracts` and `@grade10/postgres`

## 2. Audit list indexes (grade10) (owner: @rita-liu)

- [ ] 2.1 Add `idx_audit_logs_actor_at_seq`, `idx_audit_logs_subject_at_seq` (`subject_id IS NOT NULL`), and `idx_audit_logs_action_at_seq` on `createAuditLogsTable`, with `-- lock:` on the generated `CREATE INDEX` statements, so filtered `audit-SC-01` reads do not seq-scan `audit_logs`
- [ ] 2.2 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`

## 3. Identity-trail writes (grade10) (owner: @rita-liu)

- [ ] 3.1 Make `createUnverifiedAccount` append `auth.account.create-unverified` with actor `system` and outcome `created` only when it mints a `users.id`, so `audit-SC-15`, `audit-SC-16`, `audit-SC-17`, and `audit-SC-20` pass; fail-closed so `audit-SC-27` leaves no account
- [ ] 3.2 Make `ensureVerifiedAccount` append one `auth.account.create-verified` row (outcome `created`) on a mint and one `auth.account.verify` row on an unverified→verified flip, and append nothing on already-verified, so `audit-SC-18`, `audit-SC-19`, `audit-SC-20`, and `audit-SC-32` pass; fail-closed so `audit-SC-28` leaves the account unverified
- [ ] 3.3 Append `auth.two-factor.generate-backup-codes` fail-closed before the handler, withholding the codes, so `audit-SC-21`, `audit-SC-26`, and `audit-SC-29` pass
- [ ] 3.4 Pin enable (first live verify, not enrollment start) and fail-closed disable so `audit-SC-22`, `audit-SC-23`, `audit-SC-24`, `audit-SC-35`, and `audit-SC-36` pass
- [ ] 3.5 Keep the in-transaction `auth.account.delete` as the only deletion row (`skipAudit` on `users.deleteAccount`) so `audit-SC-25` and `audit-SC-34` pass as one click, one row
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run test:backend` for auth (both brands)

## 4. Filtered audit list (grade10) (owner: @rita-liu)

Needs group 1 landed.

- [ ] 4.1 Apply the new `AuditPageQuery` fields in `listAuditPage` (AND filters, `personId` as actor-or-subject, inclusive `from`/`to`, `order`, `after`, inclusive `atSeq`) so `audit-SC-01`, `audit-SC-02`, `audit-SC-03`, `audit-SC-04`, and `audit-SC-16` pass on one chain
- [ ] 4.2 Pass the extended `audit.list` input through every worker that already mounts the audit router; add no email parameter, so `audit-SC-06` cannot search the trail by email
- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run test:backend` for postgres audit paging and each brand's auth `audit.list`

## 5. Audit trail frontend (grade10) (owner: @rita-liu)

Needs group 1 landed. Claimable against fixtures; no running backend.

- [ ] 5.1 Thread filters, sort, `personId`, and `atSeq` through `AuditTrailRepository`, `mergeAuditPages`, and `useAuditTrail`; requesting only the selected chains so `audit-SC-01`, `audit-SC-03`, `audit-SC-04`, and `audit-SC-09` pass, and unfiltered silence still freezes paging
- [ ] 5.2 Lift the Audit table into `@grade10/audit-admin-frontend` with a subject column, readable action map, expand, copy, and jump-to-`atSeq`, so `audit-SC-10`, `audit-SC-11`, `audit-SC-12`, `audit-SC-13`, `audit-SC-15`, and `audit-SC-16` pass against fixture chains
- [ ] 5.3 Distinguish empty trail from filtered no-matches (`audit-SC-08`) and keep email and hashes off the row (`audit-SC-15`)
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` for `@grade10/audit-admin-frontend`
- [ ] 5.5 Collapse the chain strip to one line when every requested chain is reading, and a `Notice` per product that is not, so `audit-SC-17` and `audit-SC-16` pass

## 6. Admin Audit section (grade10) (owner: @rita-liu)

Needs group 5 landed. Claimable against fixtures.

- [ ] 6.1 Wire both brands' Audit pages through the shared section, putting filters and sort in the location (never email) so `audit-SC-07` passes
- [ ] 6.2 Do not offer an email filter or read the directory from Audit (`audit-SC-05`, `audit-SC-06`); `Link` actor/subject to `/users?user=` only with `user:list` (`audit-SC-14`)
- [ ] 6.3 Convert the date fields with `startOfDay` / `endOfDay` and ignore a start day after the end day, so `audit-SC-02` holds on the surface
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
