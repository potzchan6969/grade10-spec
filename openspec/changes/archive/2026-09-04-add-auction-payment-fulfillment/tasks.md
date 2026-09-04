# Tasks: Auction payment and fulfillment

Every implementation group lands in the `grade10` repository. Nothing changes
in `grade10-spec` packages: `ui-design.md` names only existing design-system exports
and no `@grade10/ui` contract.

Group 1 is the shared interface boundary. Group 2 lands the additive database
shape. Groups 3 and 4 require groups 1 and 2. Group 5 requires group 1 only and
uses fixture procedures, so it can land in parallel with backend delivery.

## 1. Shared post-sale contracts and grants (grade10)

- [x] 1.1 Make `Staff cannot record payment`, `Finance cannot record shipment`, and `Publishing a listing does not need the shipment grant` pass at the shared vocabulary: add distinct `auction:payment` and `auction:shipment` permissions, add the finance role, give staff shipment but not payment, keep catalogue operations separate, and pin every role-to-grant mapping.
- [x] 1.2 Define and test the `@grade10/auction-contracts/admin` codecs for the closed outcome set, keyset queue page and filter, listing detail, winner contact, payment and shipment state, cursor-paged trail, and command outcomes, keeping all money as integer minor units plus ISO 4217 currency.
- [x] 1.3 Extend `AuctionAdminProcedureClient`, its tRPC adapter, and fixture transport with post-sale reads and commands returning `unknown`, so the new slice can decode the shared contract rather than import backend shapes.
- [x] 1.4 Make `Winner email is the contact without Stripe identifiers` possible across both storefront entrypoints: extend the Auction binding identity input with the authenticated session's optional name and pass it beside user id and email from the shared store router without adding a caller-selectable storefront.
- [x] 1.5 Verification: run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 2. Additive Auction persistence (grade10)

- [x] 2.1 Add settlement payment source and `awaiting_wire`, backfill existing captured settlements to Stripe, and prove the migrated shape supports `Stripe capture and manual collection are different outcomes`, `Wire request releases the card hold`, and `Manual collection marks Paid via Manual and releases the hold` without rewriting winner or amount.
- [x] 2.2 Store the storefront-authenticated bidder name snapshot beside email and prove `Winner email is the contact without Stripe identifiers` can return name when supplied while never selecting Stripe customer or payment-method identifiers.
- [x] 2.3 Add the checked, indexed, append-only listing trail table and prove `Stripe paid and an operator comment share the trail`: outcome and comment rows are disjoint, deterministic per listing, and update, delete, and truncate are refused.
- [x] 2.4 Keep legacy fulfillment rows compatible with `Shipment follows paid, then started, then completed`: `created`/`paid` remain pre-shipment, `shipped`/`received` project to the two milestones, and an absent formatted address can be stored without moving state.
- [x] 2.5 Verification: run `pnpm run db:drizzle:generate`, commit the generated migration and metadata, then run `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 3. Post-sale reads and listing trail API (grade10)

This group starts after groups 1 and 2 land.

- [x] 3.1 Implement one clock-parameterized outcome projection and keyset queue query that makes `A listing inside the last hour is Ending soon`, `Stripe capture and manual collection are different outcomes`, `An operator works only listings awaiting wire`, and `Awaiting wire is highlighted as needing action` pass with the same expression for labels and filters.
- [x] 3.2 Make `Operator opens a won listing` pass through one decoded detail read containing listing facts, extension, minor-unit money, outcome, payment, shipment, and the first trail page without any control that can change the winner.
- [x] 3.3 Make `Winner email is the contact without Stripe identifiers` pass by joining the winning bidder snapshot and optional formatted address under `auction:read`, omitting every Stripe identifier and any dependency on `auction:moderate` or `user:list`.
- [x] 3.4 Make `Stripe paid and an operator comment share the trail` pass through cursor-paged reads and an `auction:read` comment mutation that records the fresh operator snapshot in the same immutable trail as outcome changes.
- [x] 3.5 Expose the queue, detail, trail, and comment procedures with the group 1 output codecs, add their permission-map assertions, and keep the global audit-chain middleware in place without returning chain hashes through the post-sale contract.
- [x] 3.6 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and `pnpm run build`.

## 4. Lock-serialized payment and shipment commands (grade10)

This group starts after groups 1 and 2 land.

- [x] 4.1 Make `Wire request releases the card hold` pass under the listing lock, recording one operator trail transition and handing open holds to the existing release sweep without starting a capture.
- [x] 4.2 Make `Manual collection marks Paid via Manual and releases the hold` and `A second paid attempt is refused` pass with a first-paid-wins compare-and-set; return a retryable conflict instead of overwriting an in-flight capture.
- [x] 4.3 Make `Stripe capture marks the listing Paid via Stripe` pass from synchronous capture, verified `payment_intent.succeeded`, and reconciliation through one idempotent Stripe-paid transition that records source and a Stripe trail actor and never claims an Awaiting wire settlement.
- [x] 4.4 Make `Recording an address does not ship the listing` pass by setting the absent formatted address under `auction:shipment` without changing outcome or accepting Stripe identity fields.
- [x] 4.5 Make `Operator closes out a won listing`, `Shipment follows paid, then started, then completed`, and `Shipment cannot skip ahead` pass under the listing lock, preserving winner and paid source and appending each operator transition atomically.
- [x] 4.6 Make `Staff cannot record payment`, `Finance cannot record shipment`, and `Publishing a listing does not need the shipment grant` pass at the server routes; move capture retry to `auction:payment` while leaving catalogue publishing on `auction:operate` and cancellation/release recovery on `auction:settle`.
- [x] 4.7 Record automatic capture give-up as a system outcome transition, keep notification and deletion sweeps compatible with manual paid, awaiting wire, and both shipment milestones, and prove repeated provider events and commands are idempotent.
- [x] 4.8 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and `pnpm run build`.

## 5. Grade10 admin queue and listing detail (grade10)

This group depends only on group 1 and must run against the fixture procedure
client, not a live Auction worker.

- [x] 5.1 Add the shallow `features/operations/post-sale` slice to `@grade10/auction-admin-frontend`: decoded datasource, repository port and implementation, fixture state machine, DI tokens and module, query/mutation hooks, public subpath, and `auctionAdminModules`, with module and hook tests over the real graph and fixture client.
- [x] 5.2 Make `A listing inside the last hour is Ending soon`, `Stripe capture and manual collection are different outcomes`, and `An operator works only listings awaiting wire` pass in the default Queue panel with the full labels and closed-set outcome filter.
- [x] 5.3 Make `Stripe capture and manual collection are different outcomes` and `Awaiting wire is highlighted as needing action` pass using existing Badge variants plus a separate row attention treatment, with no new design-system variant or token.
- [x] 5.4 Make `Operator opens a won listing` and `Winner email is the contact without Stripe identifiers` pass in the app-owned detail assembly, formatting money from minor units and never rendering Stripe identifiers or a winner-changing control.
- [x] 5.5 Make `Wire request releases the card hold`, `Manual collection marks Paid via Manual and releases the hold`, `Recording an address does not ship the listing`, `Shipment follows paid, then started, then completed`, `Operator closes out a won listing`, and `Stripe paid and an operator comment share the trail` pass through the post-sale hooks; retain the selected listing across mutation invalidation and transport retry.
- [x] 5.6 Make `Staff cannot record payment` and `Finance cannot record shipment` pass using `hasPermission`: every unavailable step stays visible and disabled, while allowed actions use confirmation and surface named business refusals.
- [x] 5.7 Replace the standalone Settlements and Fulfillment panels with the Queue/detail workflow while retaining catalogue Listings, Sales, and Bidders navigation, so `Publishing a listing does not need the shipment grant` remains reachable and unchanged.
- [x] 5.8 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## Validation disposition

- Feature-specific implementation and regression tests shipped in merged PR #102; subsequent main-branch Typecheck, Lint, Test backend, and Migrations workflows are green for the current tree.
- The repository-wide Test workflow still has an unrelated `grade10-store` failure in `src/useCases/benefits.test.tsx`; it does not exercise the auction post-sale surface. The change is archived with that external baseline failure recorded rather than attributed to this capability.
