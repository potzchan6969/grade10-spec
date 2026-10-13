# Group 9 Validation

## Scope

- **Tasks** - 9.2, 9.3 and 9.4 only. Group 11 and archive are outside this delivery.
- **Acceptance** - `2617613598e0d5cb306203567db6665450e377d783ca07f7634b1dcec87ce7c5`; the recorded contract baseline is `5e81c99640a29ec0167180dd51d028c06f623bff`.
- **Implementation** - [PR 1057](https://github.com/9gag/grade10-spec/pull/1057) merged as `537c78b082467ed863b87d1658f7e93c5f19fee7`. The Proof not accepted template was added at `ec27b60a1` and its deadline wording was corrected at `275e0c04f`.
- **Verification source** - Existing behavior was checked at `4ac43dbe05d222eca1603008a68e8b0321fb26b1`. Integrated preview lint repairs were checked at `e57f10456dcd1c79ae8c00e8ef35b32d28bfdb17`. Commit `ad29151da` adds a comment that preserves the cancellation clock export lines during formatting; it changes no executable code.
- **Application** - Its selected spec commit, `97e79f13ac2c1ee51a687fed5eefaa341bf0be36`, already contains the merged group implementation. The new repairs concern preview exports and story helpers. No application pin change is needed for these repairs.

## Results

All package commands used Bash, Node `24.14.1`, pnpm `11.21.0`, `enable-global-virtual-store=false` and `verify-deps-before-run=error`.

| Check | Command or assertion | Result | Source |
| --- | --- | --- | --- |
| Accepted plan and build baseline | `pnpm plan preflight complete-auction-post-sale`; `pnpm plan build-preflight complete-auction-post-sale` | Passed against published main | Recorded acceptance and baseline above |
| Email types | `pnpm --dir apps/emails run typecheck` | Passed | `4ac43dbe` |
| Proof not accepted render | Render the template through React Email; check external reason, Pay by deadline, heading and absence of internal reason | 5 assertions passed | `4ac43dbe` |
| Shipped render | Missing or blank tracker uses Winner Order; recorded tracker remains primary | 9 assertions passed | `4ac43dbe` |
| Shipped regression | `pnpm --dir apps/preview exec vitest run --project unit src/pages/auction/post-bidding/order-shipped-email.test.mjs` | 3 tests passed | `4ac43dbe` |
| Contact Us interaction | `pnpm --dir apps/preview exec vitest run --project storybook --testNamePattern 'Payment Overdue'` | 1 passed; 472 unselected. Copied resets, no toast, To and Subject controls remain | `4ac43dbe` |
| Preview lint | `pnpm --dir apps/preview run lint` | Passed with 0 errors and 25 existing story-name warnings after repair | `e57f10456` |
| Preview unit suite | `pnpm --dir apps/preview exec vitest run --project unit` | 32 tests passed | `e57f10456` |
| Preview browser suite | `pnpm --dir apps/preview exec vitest run --project storybook` | 473 tests passed across 103 files | `e57f10456` |
| Page Storybook build | `pnpm --dir apps/preview run build-storybook` | Passed | `e57f10456` |
| Workbench Storybook build | `pnpm --dir apps/preview run build-storybook:workbench` | Passed | `e57f10456` |
| Story references | `pnpm run storybook:check` | Passed with existing warnings | `e57f10456` |
| Static review | Independent Standards and Spec review of existing behavior and the 10-file lint repair | 0 Standards findings; 0 Spec findings | `4ac43dbe` and `e57f10456` |

## Repairs And Trade-offs

- **Lint baseline** - The required preview lint initially failed with 10 Fast Refresh errors. Remove unused helper exports from Winner Order and the manual link container. Remove the unused vault story helper. Move the cart drawer's used story helper to a separate file and update its 5 story imports. Component bodies and props remain unchanged.
- **Test timing** - This run verified behavior already merged on main. It adds no new behavior test. The existing stories and rendered shipment regression provide the automated proof. The lint repair starts from the recorded failing lint result.
- **Protected lines** - A formatting-only attempt to collapse the export list was stopped on `CANCELLED_AT_MS`. The delivered commit preserves that line and adds a comment explaining the shared story clock. No override trailer or hook bypass was used.
- **Cart picture CI** - The first PR cycle passed 547 design-system stories and 848 shared UI stories, then failed 1 of 10 cart-picture browser cases. Its fixture requested `store-cart-blocks-cartdrawer-body--pictures`; the declared `CartDrawerBody` title resolves to `store-cart-blocks-cartdrawerbody--pictures`. Commit `2ac3ba977` corrects that fixture ID. All 10 cases pass locally. The image, whitespace-alt and callback assertions remain unchanged.
- **Backend quality** - CRAP and mutation are N/A because this scope changes no backend service or production application code.
- **Application E2E** - N/A for the new repair because it changes only preview exports and story helpers. The full preview browser suite verifies their consumers.
- **New visual proof** - N/A because the repair changes no rendered screen, email or visual state. The original implementation and review are linked above.

## UI Inventory

| Block | Classification | Owner and path | Consumers | Capability | Storybook coverage | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| ProofNotAcceptedEmail | Reused | Store, `apps/emails/emails/auction/order/proof-not-accepted.tsx` | Email preview | Proof not accepted letter | Email preview template | Render assertions and email typecheck |
| OrderShippedEmail | Reused | Store, `apps/emails/emails/auction/order/order-shipped.tsx` | Email preview | Shipped letter with or without tracker | Email preview template | Render assertions and 3 rendered regression tests |
| WinnerOrderContactDialog | Reused | Store, `apps/preview/src/pages/auction/post-bidding/winner-order-contact-dialog.tsx` | Winner Order and standalone preview | Copy Message confirmation | `Auction/Post Bidding/Screens/Winner Order/Email Grade10`, `PaymentOverdue` in `email-grade10.stories.tsx` | Focused interaction and full preview browser suite |

- **Counts** - 0 distinct added blocks, 0 changed rendered blocks, 3 reused surfaces. Export and story-helper repairs change no component body.
- **Ownership shares** - N/A - no distinct UI blocks added.

## Publication Gates

- **Preview TypeScript** - A supplemental local `pnpm --dir apps/preview exec tsc -b` attempt reported 2 pre-existing `transition.exit` diagnostics in `apps/preview/src/pages/auction/display/auction-catalogue-card.tsx:952` and `:999`. Both properties exist at the reviewed baseline. [PR CI Typecheck](https://github.com/9gag/grade10-spec/actions/runs/38457105232) passed at `4787e1d83f07ac9304a8718ae56e57ae21053f4d`. Preserve the local diagnostic as historical evidence; it is not a current CI blocker.
- **Manual baseline** - The first cycle and the planning completion attempt were blocked by 43 rollout lines on the Daily Reminder page after its change was archived. The same failures appear in [main Lint run 38455497785](https://github.com/9gag/grade10-spec/actions/runs/38455497785), at `c018d48ca858658f9167d723e7a639a79379b951`.
- **Baseline dependency** - [PR 1159](https://github.com/9gag/grade10-spec/pull/1159) merged after all applicable checks passed, as `88c060a64a5314bd46428dd6ac96c06d703074b7`. It removes 29 stale behavior markers and changes 14 decision statuses to Decided. The archive has all 36 tasks checked, application implementation `77face13e8dea2fe420ff39768fca871c004bfc7`, and explicit contract acknowledgements. Independent review confirms no requirement, owner, link, future-source statement or deployment claim changes. Manual validation becomes 0 failures with 306 existing warnings. Merge `31972e9ce` brings this verified dependency into the final group branch.
- **Round landing** - The doctor reports a missing dev hand and stale specs/test-cases for a future round landing. This change predates round adoption and has no round records. Preserve its existing completion workflow. Do not add a round that would retrospectively require rows for all its completed groups.
- **Disposition** - The store refused `pnpm plan done complete-auction-post-sale 9.2 9.4` on the manual baseline gate and changed no checkbox. All 3 tasks remain open until the baseline dependency and final group delivery pass. Close them in one completion command after the verified repair lands.

## Local Evidence

- **Directory** - `/private/tmp/complete-auction-post-sale-group-9/` holds the worker reports, validated handoffs, source reviews and command logs. The directory is temporary; this record and the PR description preserve the summary.
- **Reports** - `email-report.md`, `preview-report.md`, `review.md`, `repair-review.md`, `preview-lint-final.log`, `preview-unit-final.log`, `preview-stories-final.log`, `storybook-build-final.log`, `storybook-workbench-build-final.log`, `manual-final.log` and `baseline-preview-typecheck.log`.
- **Failed attempts** - The first shipment test filter found no files and earns no validation credit. A browser listener denial was rerun with approved execution. The preview worker's first runtime attempt was rerun under Bash with the pinned versions. Generated Storybook output was removed before lint so only source files were checked.
