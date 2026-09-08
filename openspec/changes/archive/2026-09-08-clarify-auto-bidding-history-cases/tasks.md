## 1. Store copy and durable documentation (grade10-spec)

- [x] 1.1 Update every shared `auctionBiddingHistory` locale so accepted submissions are described as automatic maximums, refusals are maximum-specific, and no new history copy presents manual bidding as available; preserve compatibility keys only where the app still reads legacy rows (SC-37, SC-38, SC-39, SC-40, SC-41).
- [x] 1.2 Rewrite `docs/prds/products/grade10-site/auction/bidding-history.md` to describe the maximum-only index, private maximum audit, ordered challenger/automatic-response records, equal-maximum behavior, and the eight boundary outcomes without duplicating normative scenarios (SC-01, SC-11, SC-29 through SC-41).
- [x] 1.3 After the behavior ships, carry the change's `Feature set` and all five user journeys into the durable capability/manual records, then archive the OpenSpec change without changing the accepted requirements (US-01 through US-05).
- [x] 1.4 Verify the store copy and manual build with `pnpm check:manual` and the i18n package's catalog/resolution checks.

## 2. Shared contracts and schemas (grade10)

- [x] 2.1 Update the auction action-log constants, input schemas, and field-combination validation to make automatic maximum configuration, raise, refusal, and engine response the new-write vocabulary while retaining legacy manual values for decoding persisted history (SC-37, SC-38, SC-40, SC-41).
- [x] 2.2 Update the combined-history contract and adapters so a group can return multiple accepted public records in stable sequence order, maximum-specific refusal presentation, automatic-only new source semantics, and legacy source compatibility without exposing another bidder's maximum (SC-11, SC-12, SC-13, SC-29 through SC-36).
- [x] 2.3 Update contract fixtures and focused contract tests to assert the exact eight outcome rows, including the single A1000 public record for an equal maximum, and rejection of unsupported manual action writes (SC-29 through SC-41).
- [x] 2.4 Verify the contracts package and affected consumers with its focused tests and the repository typecheck.

## 3. Database migration and invariants (grade10)

- [x] 3.1 Add an additive auction migration for `automatic_max_refused`, its account/private field combination, and the default for new bid-source writes; keep legacy manual checks, append-only guards, keys, and pagination indexes intact (SC-37, SC-38, SC-39).
- [x] 3.2 Update generated schema artifacts and migration metadata without rewriting historical manual rows or backfilling public history; document the expand/compatibility order in the migration comments where the repository convention requires it (SC-37, SC-40, SC-41).
- [x] 3.3 Verify the migration with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, and the auction database invariant tests.

## 4. Auction backend and history projection (grade10)

- [x] 4.1 Normalize `maximumMinor` and the legacy `amountMinor` alias at the bidding boundary, write new commitments as automatic maxima, remove new manual request/accept/refuse writes, and emit `automatic_max_refused` only after server evaluation fails; keep browser-only validation event-free (SC-37, SC-38, SC-39, SC-40).
- [x] 4.2 Replace scattered boundary arithmetic with one deterministic `resolveAutomaticMaximumOutcome` function that consumes `currentLeaderMaximumMinor`, `currentBidMinor`, `incomingMaximumMinor`, and `incrementMinor`; make the database transaction call it once and apply its returned change set while preserving legacy commitments and the existing two-maximum settlement rule (SC-29 through SC-36).
- [x] 4.3 Add one explicit unit-test case for each boundary row—450 refused, 500→B500/A600, 700→B700/A800, 950→B950/A1000, 1000→A1000 only, 1001→B1001, 1100→B1100, and 1120→B1100—and assert acceptance, leader, resolved amount, public-record count/order, privacy, and one-increment cap (SC-29 through SC-36).
- [x] 4.4 Make the accepted action group atomic and idempotent: write the challenger's accepted public record before an applicable automatic response except for the equal-maximum case, which emits only A's resolved 1000 public record while retaining B's accepted maximum privately (SC-30 through SC-36, SC-41).
- [x] 4.5 Update action-group processing, bidder-status projection, notification inputs, and combined-history rendering to recognize the new events, preserve legacy reads, render every accepted row in group sequence order, and keep account/storefront authorization and cursor paging unchanged (SC-01 through SC-05, SC-11 through SC-18, SC-29 through SC-41).
- [x] 4.6 Add or update backend tests at the repository, service, action-group, persistence, read, and payment boundaries so each of the eight maximum inputs asserts accepted/refused state, public row count and order, private event visibility, standing, and retry idempotency (SC-29 through SC-41).
- [x] 4.7 Verify the auction backend with `pnpm run test:backend` and the focused auction test files.

## 5. Bidding-history consumer (grade10)

- [x] 5.1 Update the existing `/bids` history event mapper and renderer to consume multiple accepted rows per action group, label automatic maximum activity and maximum refusals correctly, keep private automatic-maximum events scoped to the account, and avoid introducing a new page or layout state (SC-11 through SC-14, SC-29 through SC-41).
- [x] 5.2 Update page fixtures, component tests, and end-to-end cases so B's action appears before A's automatic response, equal maxima show only B's public row, higher maxima show only B's row, and refusal/notification behavior remains separate from bid-history rows (SC-29 through SC-36, SC-41).
- [x] 5.3 Verify the affected frontend package and `/bids` page with focused tests, `pnpm run lint`, `pnpm run typecheck`, and the relevant production build check.
