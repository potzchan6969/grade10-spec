# Tasks

Depends on `revise-loyalty-programme-rules` landing first: it carries the
programme rules, the `channel` field on every recording, and reward fulfilment
that this change's till and codes build on.

Group 1 lands in **grade10-spec** and the submodule bump is the boundary:
groups 7 and 8 cannot start until it has shipped. Groups 2 and 4 are the
foundations — pairing and the till session — and everything else reads them.

Design decisions and open questions: [`design.md`](design.md). Screens and
component exports: [`ui.md`](ui.md).

## 1. Store blocks (grade10-spec)

- [ ] 1.1 Draw the member-card and till frames in Figma and link them from `ui.md`
- [ ] 1.2 Export `MemberCard` from `@grade10/ui` — the dynamic identification code, rendered scannable and as a short typed fallback
- [ ] 1.3 Export `PendingCollectionList` from `@grade10/ui` — rewards paid for and awaiting collection, each with its window and where to collect it
- [ ] 1.4 Extend `RewardMenu` to take a quantity for a per-unit reward and to state a physical reward's collection window
- [ ] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run design-system:check`

## 2. Commerce customer pairing (grade10)

- [ ] 2.1 Pair every member with exactly one commerce customer, server-side and behind the account, so *Sign-up never waits on the provider* passes
- [ ] 2.2 Make the pairing idempotent under a lost response, so *A lost response does not duplicate a customer* passes
- [ ] 2.3 Park an unresolvable conflict where an operator can see it, so *A conflict parks visibly* passes
- [ ] 2.4 Send an opaque key and never the account identifier, and attach only verified identity, so *The account identifier never leaves Grade10* and *An unverified email attaches nothing* pass
- [ ] 2.5 Back-fill pairings for existing members as a re-runnable sweep
- [ ] 2.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 3. Erasure reaches the provider (grade10)

Shares the account-deletion signal with `revise-loyalty-programme-rules` group
12 — coordinate the hook with the auth track before claiming either.

- [ ] 3.1 Erase the commerce customer irreversibly when a member is erased, resuming after a crash so *A crash mid-erasure does not resurrect the customer* passes
- [ ] 3.2 Clean up a customer created while erasure was running, so *A racing creation is cleaned up* passes
- [ ] 3.3 Verify: `pnpm run test:backend`

## 4. In-store identification and the till session (grade10)

- [ ] 4.1 Mint a short-lived, single-use identification code on the member card, refusing a replay with where and when it was first used, so *A replayed code is refused with its history* passes
- [ ] 4.2 Render it scannable and as a typed fallback infeasible to guess, pausing entry for a shop after repeated failures
- [ ] 4.3 Look a member up by exact email, disclosing nothing on a miss, so *An email miss discloses nothing* passes, and rate-limit identifier-typed lookups
- [ ] 4.4 Record the account identity and never the email address
- [ ] 4.5 Open a time-limited till session on either identification, recording how the member was identified and labelling every read and act with staff and location, so *A lookup is recorded* passes
- [ ] 4.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Staff-assisted spending and collection (grade10)

Depends on group 4 for the session, and on `revise-loyalty-programme-rules`
group 5 for fulfilment.

- [ ] 5.1 Spend a member's points from the till as one recorded mutation, so *A double tap spends once* passes
- [ ] 5.2 Notify the member instantly on every staff-assisted act, so *The member's phone is the monitor* passes
- [ ] 5.3 Reverse the spend when a sale is cancelled after tender, so *A cancel after tender is caught* passes
- [ ] 5.4 Park a redeemed physical reward as awaiting collection, kept out of every retry and failure alarm, so *Waiting is not failing* passes
- [ ] 5.5 Confirm a collection once at handover, recording who and when and refusing a second, so *Collection completes once* passes
- [ ] 5.6 Notify the member on handover, so *The member hears about the handover* passes
- [ ] 5.7 Cancel a waiting collection on an operator reversal and refuse one already handed over, so *A waiting collection is cancelled by the reversal* and *A collected reward cannot be reversed* pass
- [ ] 5.8 Redeem a per-unit reward in a quantity as one debit, refusing a quantity above either bound by name, so *One redemption, one debit* and *A quantity above the bound is refused* pass
- [ ] 5.9 Add the per-redemption and per-member daily bounds to the programme config, refused at boot when a per-unit reward exists without them
- [ ] 5.10 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 6. Money-off codes either channel accepts (grade10)

Depends on group 2 for pairing and on `revise-loyalty-programme-rules` group 5
for fulfilment.

- [ ] 6.1 Scope every points code to the member's own commerce customer, single-use and for a fixed amount, so *Another member cannot use the code* passes
- [ ] 6.2 Require a purchase at least the code's own value and refuse rather than burn it, so *A big code on a small cart is refused, not burned* passes
- [ ] 6.3 Refuse a second order-level discount alongside it, so *One points code per order* passes
- [ ] 6.4 Re-scope outstanding codes when a member's pairing moves to a different customer
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. Physical-store orders: ingestion and attribution (grade10)

Depends on group 2 for pairing and on `revise-loyalty-programme-rules` group 2
for `channel`.

- [ ] 7.1 Ingest a physical-store order exactly once whether it arrives by webhook or by the reconciling sweep, so *Webhook and sweep converge* passes
- [ ] 7.2 Leave the platform's own checkout out of that path, so *The platform's own checkout is not re-ingested* passes
- [ ] 7.3 Keep a refund exactly-once for an order whose owner is not yet known, so *A refund before identity is not lost or doubled* passes
- [ ] 7.4 Attribute an order to a member on evidence after the fact, so *A sale rung up before registration is not lost* passes, with one claim live at a time so *Two claimers cannot both win* passes
- [ ] 7.5 Price earning on every channel through the loyalty capability's own eligibility rule, so *A gift card earns nothing anywhere* and *Points spent lower the same order's earning* pass
- [ ] 7.6 Add the attribution action and its undo to the console, so *A wrong attribution is one action to undo* passes
- [ ] 7.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. The till never blocks a sale (grade10)

Depends on group 4.

- [ ] 8.1 Complete the sale when the programme is unreachable or spending is switched off, so *The kill switch stops spending, not selling* passes
- [ ] 8.2 Make staff-typed email lookup stoppable on its own while card identification keeps working, so *Email-assisted spending can be stopped alone* passes
- [ ] 8.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 9. POS extension (grade10)

Depends on groups 4, 5 and 8, and on group 1 shipping. A new deliverable with
its own deploy lane; needs a second dev shop for staging, three extension-only
apps, one metafield definition, and customer and order webhook subscriptions.

- [ ] 9.1 Build the till panel — identify a member, show tier, both counts, affordable rewards, open codes and pending collections
- [ ] 9.2 Wire spending, code application and handover confirmation through the till session
- [ ] 9.3 Fall back to a guest sale whenever identification or the programme is unavailable, never blocking the sale
- [ ] 9.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`

## 10. Member surfaces for the shop (grade10)

Depends on group 1 shipping and the submodule bump.

- [ ] 10.1 Show the member card's dynamic code on the membership page
- [ ] 10.2 List rewards awaiting collection with their window and where to collect them
- [ ] 10.3 Take a quantity for a per-unit reward, refusing one above the bound by name
- [ ] 10.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`
