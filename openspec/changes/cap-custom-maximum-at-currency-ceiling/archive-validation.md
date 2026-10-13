# Archive Validation

## Implementation

- **Shared source** - [PR 1089](https://github.com/9gag/grade10-spec/pull/1089), merged as `cea6d10a6c0b82527c581beb9ce466413a595f8b`. Tests precede implementation in `05cd38952` and `76193e0cb`; code follows in `c7d336103`. Its report records 52 focused regressions, 794 shared UI and Storybook tests, catalogs, type checks, formatting and manual checks.
- **Application** - [PR 1060](https://github.com/9gag/grade10/pull/1060), merged as `3e2a274e03c2f15fa082405b400dd34f323d7c39`. Test commits `de0e245958` and `5c566ad70f` precede the application changes. The shared pin supplies the required currency ceiling. A defensive ceiling refusal returns the form to idle without a message, draft reset or retry.
- **Browser proof** - [41 passing browser/API cases](https://github.com/9gag/grade10/issues/1008#issuecomment-6122133066) at `121e2d0bc57bed7eee64c1f91ca6337dd86ed5b3`. The three E2E files, shared pin and backend ceiling regression are unchanged between that proof and the archive-validation checkout. Normal bids use isolated real services; defensive responses are mocked. No new browser run was performed during archive validation.

## Fresh Checks

Verified on Grade10 `2ad66c014c02d8a36443c4bb8ee8e84ed3d80577` with shared pin `cea6d10a6c0b82527c581beb9ce466413a595f8b`:

| Check | Result |
| --- | --- |
| Accepted build baseline | Passed; baseline `4e95fb4f3d077b753f14a933cf50ba3a6468953a` |
| Adapter, refusal mapper and ListingView | 159 tests passed |
| API decoder | 39 tests passed |
| Shared money helper and rendered bid actions | 52 tests passed |
| Backend placeBid and ceiling neighbors | 21 tests passed |

## Walk Disposition

- **Automated** - Shared custom-maximum cases TC19 to TC26 name `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`. The defensive refusal case TC-55k names the same file. Neighbor auto-bid refusal TC-dfw names `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`. Both active and durable suites carry these links.
- **Remaining manual cases in this delivery** - None. Unrelated manual cases in the durable suites remain with their owning capabilities. Automation classification does not record a human QA verdict.
- **Later contract** - `collapse-maximum-entry-at-ceiling` owns chip clamping and collapsed entry. `add-auction-internal-bid` owns the later internal-bid behavior. The implementation record acknowledges the changed target scope without claiming those later outcomes for this delivery.
- **Product decisions** - The existing Product decisions table in Bidding Rules already preserves the currency ceilings, input correction and silent-refusal decisions. No decision needs to move.
