reviewed: c58525e56596d325f452d49e0e1cc19fc5b23244
source-identity: cce4f643458c9b228fe8e02dfbbbef41d5bc07f84d4c453fbe5f9b1b22ed881d
baseline-identity: 26e7f6fada02156be5dae5532a6c5ce386b3b1d0787e863744b8e9044b7c94b5
verdict: Ready to accept

Findings 1 to 10 were raised at `7f1a0eaff`; their line numbers are that revision's.

| # | Change | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | this change | blocker | `docs/prds/products/grade10-site/site/page-shell.md:42-44` and the `Account placeholder` leaf, `specs/grade10-site/site/page-shell/spec.md:6-8`, against the state table and **Once**, `spec.md:21-25` and `:36-40`, `grade10-site-site-page-shell-SC-72` and `-SC-74` | What a later read shows is stated three ways. The page says a later read "keeps the entry already shown unless it finds no session", so a visitor shown Sign In who signs in elsewhere keeps Sign In; the state table and SC-72 show the account icon. The leaf says "a failed read shows Sign In", so a later failed read shows Sign In; **Once**, SC-74 and Q8 keep the entry. `369df5fdd` reworded the `Stable layout` leaf for Q10 but left this leaf as it was before Q8, and QA2 records no disposition for it. The folded leaf is the next blind pass's input, and this wording already raised Q8 once | @seankcw (page), planning-dev (leaf) | The page line first, then the leaf. Q3 and Q8 stand as recorded | fixed c58525e56 |
| 2 | this change | fix | `ui-design.md:32-33` against `grade10-site-site-page-shell-SC-74` and `-SC-78` | Same family as 1. `Session read failed - Sign In` does not say first read. `Re-read after the first answer - the entry already shown, unchanged` anchors SC-74 and SC-78, whose THENs change the entry to Sign In or to the account icon | planning-dev | `ui-design.md` | fixed c58525e56 |
| 3 | this change | fix | **First answer** and **Once**, `specs/grade10-site/site/page-shell/spec.md:27-30` and `:36-40`, and `grade10-site-site-page-shell-SC-74`, against `tech-design.md:58` and `tasks.md:14` (2.1) | The requirement never says which reads fail. Tech-design and task 2.1 make a later 401 show Sign In and any other failure keep the entry; SC-74's "fails without returning a session" reads a 401 as a failure that keeps the account icon | planning-dev | The delta's **First answer** | fixed c58525e56 |
| 4 | this change | note | `page-shell.md:38-40` against `grade10-site-site-page-shell-SC-76` | The page-shell line omits "nothing read aloud" (Q5), which SC-76 requires | @seankcw | `page-shell.md` | fixed c58525e56 |
| 5 | this change | note | `page-shell.md` and `site-chrome.md` Product decisions blocks, against `docs/governance/prd-and-openspec.md:73` and `:198` | Neither page has a row for the Sign In-sized pill (Q2), the timer (Q4) or reserving Sign In's width (Q7). Archive preserves them at the latest | @seankcw | The pages' Product decisions blocks, at archive | open |
| 6 | this change | note | `shared-ui-site-chrome-SC-47` against `tasks.md:5` (1.1) | No store-lane check was planned for SC-47's last AND, that no other control's box changes when `session` becomes `"signed-in"` | planning-dev | `tasks.md` 1.1 | fixed c58525e56 |
| 7 | this change | note | `specs/shared/ui/site-chrome/spec.md:264` | SC-46's **Serves** line named the screen reader, which QA2's split moved to SC-48 | planning-dev | The delta, and the restated copy in `restrict-auctions-by-region` | fixed c58525e56 |
| 8 | cluster | note | Current-tree `pnpm check:manual`, `Permanent ids issued twice`, `shared-ui-site-chrome-SC-45` to `-SC-48` | The reasoning holds. `checkIssued` in `tools/manual/check/deltas.mjs` skips an id once it is durable, and `restrict-auctions-by-region` restates the four under the same trace markers. This requires acceptance in the same pull request; merged before acceptance, the store's `main` fails `check:manual` | planning-dev | None; accept before the pull request merges | open |
| 9 | `nav-cart-count-badge` | note | `openspec/changes/nav-cart-count-badge/specs/grade10-site/site/page-shell/spec.md:11` | Archive moves an accepted change and does not refold it. Its archive preflight will meet `The chrome does not wait for the session` as this change amends it, and needs an acknowledgement | Its archiver | Its archive record | open |
| 10 | this change | note | `reconciliation.md:12` | `restrict-auctions-by-region` no longer waits on `omit-profile-account-menu`, archived on 2026-10-12 | planning-dev | `reconciliation.md` | fixed c58525e56 |
| 11 | this change | note | `## Reconciliation` in `specs/grade10-site/site/page-shell/feature-tcs.md` | The `Account placeholder` leaf QA1 read is now reworded, and the record has no row for it, as it has for `Stable layout`. Every case agrees with the new leaf: US9-TC7-1, US9-TC9-1, US9-TC10-1 and US9-TC11-1, so no case moves. Optional | planning-dev | The suite's `## Reconciliation` | open |

## Rerun

Narrow rerun of `c555499c2..c58525e56`: 7 files, no case, journey or technical-design edit.

- **1** - The page line and the leaf now say a first read that fails shows Sign In, a later read that fails keeps the entry, and a read finding a different session changes it. The leaf matches the requirement's own wording in **Once**, which also names the read that returns no session
- **2** - Four rows, each tied to the scenario it states: SC-71, SC-72, SC-74, and SC-74 with SC-78
- **3** - **First answer** now counts a refusal saying the collector is not signed in as no session, and a read fails only with neither answer. That agrees with the state table, SC-71, SC-74, tech-design's failed re-read, task 2.1, and the cases, which use a 500 and a dropped read
- **4, 6, 7, 10** - Each edit says what the finding asked. `restrict-auctions-by-region`'s SiteHeader block still differs from this change's only by its My Auctions gating and SC-44

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `openspec/changes/show-account-skeleton-until-session-answers/` | tree `8631987b8f44` at `c58525e56` | The repaired page-shell delta, site-chrome delta, `ui-design.md`, `tasks.md` and `reconciliation.md`, against the requirement, scenarios, cases and tech design | Proposal, decisions, journeys, suites, tech design and the QA2 records: review at `7f1a0eaff` (tree `be70105a2cac`) |
| `docs/prds/products/grade10-site/site/page-shell.md` | blob `7127bc4b6e17` | The two repaired 🚧 lines against the state table, **Once** and SC-76 | The rest of `## Session`: review at `7f1a0eaff` (blob `f04177eaa046`) |
| `docs/prds/products/shared/ui/site-chrome.md` | blob `5f694e179175` | Unchanged | Review at `7f1a0eaff` |
| `openspec/specs/grade10-site/site/page-shell/` | tree `1a9338787041` | Unchanged durable; the repaired leaf still merges by label as an added item | Fold and consumer checks: review at `7f1a0eaff` |
| `openspec/specs/shared/ui/site-chrome/` | tree `48f3a9e8333c` | Unchanged durable | Review at `7f1a0eaff` |
| `restrict-auctions-by-region` | tree `c30d1bc3e296` | The SC-46 **Serves** edit; its SiteHeader block diffed again against this change's | The rest: review at `7f1a0eaff` (tree `b21f713c80a3`) |
| `nav-cart-count-badge`, `draw-account-menu-and-profile`, grade10 `263c5828de`, `nav.tsx` | Unchanged since `7f1a0eaff` | None | Review at `7f1a0eaff` |

## Gate Receipts

| Gate | Exit | Result |
| --- | --- | --- |
| `pnpm plan:review-preflight show-account-skeleton-until-session-answers --json` | 0 | Ready, no blockers; the same two overlaps |
| `pnpm accept:preflight show-account-skeleton-until-session-answers` | 0 | Ready to fold and accept; fingerprint `0c117e01ffeb20f7f48a3ce015369a3e2bd2d3e6683c400f89f64be8d64d2fa6`, the same as the coordinator's receipt; 6 durable files |
| `pnpm check:manual` | 1 | One rule fails, `Permanent ids issued twice`: SC-45 to SC-48 from both changes, note 8. No `changed meaning` warning on either page |

`validate:changes` and `tcs:validate` run inside the acceptance preflight above.
