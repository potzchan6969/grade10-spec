## 1. Product record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update the Payment Method manual page to record that a maximum raise uses one existing authorization, requests eligible incremental and extended authorization, and follows the provider's returned deadline; preserve release-at-close and invoice settlement as the product boundary.
- [ ] 1.2 Verify the capability page and change artifacts with pnpm check:manual and openspec validate fix-auction-payment-hold-increment --strict.

## 2. Shared Stripe contracts and fakes (grade10) (owner: @htonyl)

- [ ] 2.1 Make grade10-site-auction-bid-payment-method-SC-06 and SC-14 pass by adding the incremental-authorization outcome and client operation, accepting optional incremental and extended authorization requests when creating a manual hold, and pinning that the increment amount is the new total.
- [ ] 2.2 Make grade10-site-auction-bid-payment-method-SC-11 and SC-15 pass by modeling provider unexpected-state refusal as a controlled declined outcome while keeping unknown provider faults distinct.
- [ ] 2.3 Make the shared Stripe client and fake-provider tests pass, then verify with pnpm --dir packages/stripe/backend test and pnpm --dir packages/stripe/backend typecheck.

## 3. Auction provider adapter and hold state machine (grade10)

- [ ] 3.1 Make grade10-site-auction-bid-payment-method-SC-06 and SC-14 pass by requesting eligible authorization capabilities at hold creation, calling incremental authorization for raises, and recording the provider's returned capture deadline.
- [ ] 3.2 Make grade10-site-auction-bid-payment-method-SC-11 and SC-15 pass by translating the exact unexpected-state refusal, marking the replacement bid and hold terminally failed, and preserving the prior accepted bid and provider reference.
- [ ] 3.3 Make the raise retry and concurrency cases pass without creating a second live hold, including the stable idempotency key and existing hold lock; verify with pnpm --dir packages/grade10-auction/backend typecheck and the focused auction DB tests.
- [ ] 3.4 Run the full auction database lane and confirm the customer-facing refusal and pending states remain covered by the existing bid journey tests: pnpm --dir apps/backend/grade10/auction exec vitest run --project db.

## 4. Integration handoff (grade10)

- [ ] 4.1 After the OpenSpec change lands on grade10-spec main, bump external/grade10-spec to the merged commit so the application worktree reads the approved delta, journeys, and draft feature suite.
- [ ] 4.2 Review the final application diff against the change's scenarios and run git diff --check plus the touched package typechecks and test lanes before handoff.
