reviewed: 7f1a0eaff9c37d1ff8dc2a438a414b1971c5745f
source-identity: 0fe2bfa716dfa0f57cc44c55177c6241aeb8e917be235442a06f1e7454855537
baseline-identity: 26e7f6fada02156be5dae5532a6c5ce386b3b1d0787e863744b8e9044b7c94b5
verdict: Not ready - 1 blocker

| # | Change | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | this change | blocker | `docs/prds/products/grade10-site/site/page-shell.md:42-44` and the `Account placeholder` leaf, `specs/grade10-site/site/page-shell/spec.md:6-8`, against the state table and **Once**, `spec.md:21-25` and `:36-40`, `grade10-site-site-page-shell-SC-72` and `-SC-74` | What a later read shows is stated three ways. The page says a later read "keeps the entry already shown unless it finds no session", so a visitor shown Sign In who signs in elsewhere keeps Sign In; the state table and SC-72 show the account icon. The leaf says "a failed read shows Sign In", so a later failed read shows Sign In; **Once**, SC-74 and Q8 keep the entry. `369df5fdd` reworded the `Stable layout` leaf for Q10 but left this leaf as it was before Q8, and QA2 records no disposition for it. The folded leaf is the next blind pass's input, and this wording already raised Q8 once | @seankcw (page), planning-dev (leaf) | The page line first: a first read that fails shows Sign In; after that, a read that fails keeps the entry shown, and a read that answers shows what it found. Then the leaf: "a first read that fails shows Sign In". Q3 and Q8 stand as recorded | open |
| 2 | this change | fix | `ui-design.md:32-33` against `grade10-site-site-page-shell-SC-74` and `-SC-78` | Same family as 1. `Session read failed - Sign In` does not say first read. `Re-read after the first answer - the entry already shown, unchanged` anchors SC-74 and SC-78, whose THENs change the entry to Sign In or to the account icon | planning-dev | `ui-design.md`: name the first read; the re-read row keeps the entry until a read answers with another session, and a failed re-read keeps it | open |
| 3 | this change | fix | **First answer** and **Once**, `specs/grade10-site/site/page-shell/spec.md:27-30` and `:36-40`, and `grade10-site-site-page-shell-SC-74` (`:141-149`), against `tech-design.md:58` and `tasks.md:14` (2.1) | The requirement never says which reads fail. Tech-design and task 2.1 make a later 401 show Sign In, because better-auth clears `data` on a 401, and any other failure keep the entry. SC-74's "fails without returning a session" reads a 401 as a failure that keeps the account icon. Sign In is right for the collector, since a 401 says the session is gone. But an engineer building from the spec alone could go either way, and task 2.1's test asserts one side | planning-dev | The delta: one sentence in **First answer** - a read the auth service refuses as signed out returns no session; a read fails when it gets no answer or a server error. No case moves: US9-TC7-1 and US9-TC11-1 use a 500 and a dropped read | open |
| 4 | this change | note | `page-shell.md:38-40` against `grade10-site-site-page-shell-SC-76` and `docs/prds/products/shared/ui/site-chrome.md:32-34` | The page-shell line omits "nothing read aloud" (Q5). The site-chrome page states it, but SC-76 is a page-shell scenario with no page-shell line | @seankcw | `page-shell.md`: add "and nothing read aloud" | open |
| 5 | this change | note | `page-shell.md:127-141` and `site-chrome.md:118-122` (Product decisions), against `docs/governance/prd-and-openspec.md:73` and `:198` | Neither page has a row for the product judgments this change turns on: the Sign In-sized pill (Q2), the timer (Q4), reserving Sign In's width (Q7). Governance asks the change to add them; archive preserves them at the latest | @seankcw | The pages' Product decisions blocks, now or at archive | open |
| 6 | this change | note | `shared-ui-site-chrome-SC-47` (`specs/shared/ui/site-chrome/spec.md:258-260`) against `tasks.md:5` (1.1) and `tech-design.md:70` | No store-lane check is planned for SC-47's last AND, that no other control's box changes when `session` becomes `"signed-in"`. US1-TC32 walks it | planning-dev | `tasks.md` 1.1 | open |
| 7 | this change | note | `specs/shared/ui/site-chrome/spec.md:264` | SC-46's **Serves** line still names the screen reader, which QA2's split moved to SC-48 | planning-dev | The delta's **Serves** line | open |
| 8 | cluster | note | Current-tree `pnpm check:manual`, `Permanent ids issued twice`, `shared-ui-site-chrome-SC-45` to `-SC-48` | The reasoning holds. `checkIssued` in `tools/manual/check/deltas.mjs` skips an id once it is durable. `restrict-auctions-by-region` restates the four ids under the same trace markers, so after this change folds no id is issued twice. This requires acceptance in the same pull request, as `7f1a0eaff` says; merged before acceptance, the store's `main` fails `check:manual` | planning-dev | None; accept before the pull request merges | open |
| 9 | `nav-cart-count-badge` | note | `openspec/changes/nav-cart-count-badge/specs/grade10-site/site/page-shell/spec.md:11` | Archive moves an accepted change and does not refold it. Its archive preflight will meet `The chrome does not wait for the session` as this change amends it, and needs an acknowledgement | Its archiver | Its archive record | open |
| 10 | this change | note | `reconciliation.md:12` | `restrict-auctions-by-region` no longer waits on `omit-profile-account-menu`, which was archived on 2026-10-12. The order stands | planning-dev | `reconciliation.md` | open |

## Coverage

Full review: no prior ledger exists.

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `openspec/changes/show-account-skeleton-until-session-answers/` | tree `be70105a2cac` at `7f1a0eaff` | Proposal, decisions Q1-Q10 and `## Raised`, `.openspec.yaml`, UI and technical design, tasks, both deltas, journeys and suites. Every 🚧 line served; every requirement asked for by a line; every decision carried; tasks and lanes cite every new scenario; every case `draft` | None |
| `docs/prds/products/grade10-site/site/page-shell.md` | blob `f04177eaa046` | `## Session`: 3 🚧 lines, plus the unmarked line rewritten without "or move", which is true before and after the change. The ❓ `Collector help` row is Help's, outside this change | None |
| `docs/prds/products/shared/ui/site-chrome.md` | blob `5f694e179175` | `## Account Entry`: the 🚧 Pending session line against the **Pending** paragraph | None |
| `openspec/specs/grade10-site/site/page-shell/` | tree `1a9338787041`, folded through `prepareAcceptance` | Feature set merges by label: `Stable layout` replaced, `Account placeholder` added, `Chrome before the session` kept. The MODIFIED block keeps `nav-cart-count-badge`'s folded text. `US2-TC2-4` replaces `US2-TC2-3` by revision. Unchanged consumers checked: the account control, the compact bar, small widths, and the cart count's unresolved session | None |
| `openspec/specs/shared/ui/site-chrome/` | tree `48f3a9e8333c`, folded | The block is the durable text plus the session value, **Pending** and SC-45 to SC-48. The placeholder reaches `Nav` as `accountSlot`, so the rule that a control with no handler and no slot is absent still holds. `Purpose` unchanged | None |
| `nav-cart-count-badge` | tree `1c3af68e203f` | Accepted. Its page-shell block equals the durable text, so this change amends its result | None |
| `restrict-auctions-by-region` | tree `b21f713c80a3` | Its SiteHeader block is this change's block plus My Auctions gating and SC-44. The session values, **Pending** and SC-45 to SC-48 are word for word, with the same trace markers. `depends_on` names this change. Feature set labels do not touch `Pending session` | None |
| `draw-account-menu-and-profile` | tree `859ffef9d924` | Journeys only, US-03 as context; no requirement and no id collision | None |
| QA2 records in both `feature-tcs.md` | at `7f1a0eaff` | Both readings and the coordinator repair: every case and scenario disposed, with no uncovered anchor or contradicted reading left, except the leaf in finding 1 | QA2, 2026-10-14 |
| grade10 `apps/frontend/grade10/src/` (`clients/auth.ts`, `root.tsx`, `chrome/SiteShell.tsx`) | grade10 `263c5828de` | Tech-design's claims: pending until hydration, the two-value `signedIn` today | None |
| `packages/design-system/src/components/layout/nav.tsx` | blob `f978c603743f` | Primary navigation centred absolutely, controls row right-aligned with Cart last, so Q10 needs no `Nav` change | None |

## Gate Receipts

| Gate | Exit | Result |
| --- | --- | --- |
| `pnpm plan:review-preflight show-account-skeleton-until-session-answers --json` | 0 | Ready, no blockers; overlaps `nav-cart-count-badge` on page-shell and `restrict-auctions-by-region` on site-chrome. Rerun because the receipt at `032e662f6` predates the restatement |
| `pnpm accept:preflight show-account-skeleton-until-session-answers` | 0 | Ready to fold and accept; fingerprint `08c18642bafb28ec89da427754b8dba29efb8a0d66de3be634b3b1ac91536113`, the same as the coordinator's receipt; 6 durable files |
| `pnpm check:manual` | 1 | One rule fails, `Permanent ids issued twice`: SC-45 to SC-48 from both changes, finding 8. No `changed meaning` warning on either page |

`validate:changes` and `tcs:validate` run inside the acceptance preflight above.

## Rerun Scope

Findings 1 and 3 change a page line, a feature-set leaf and requirement text. A rerun reads those edits, the `ui-design.md` rows, the cases citing SC-72 and SC-74, and a fresh `pnpm accept:preflight`. Notes 4 to 10 need no rerun.
