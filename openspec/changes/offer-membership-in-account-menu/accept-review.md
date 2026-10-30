reviewed: 03056a172
source-identity: 70e9e6c37a04ca353dca85a6b44c0fa4d2de75828fe26cf32c00f20eaf9498fa
baseline-identity: 2d936271c9e85dfcd39bf51f54982d09ad3e670d878d73165cac8c11efd74a4b
verdict: Not ready - 1 blocker

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | Folded `openspec/specs/grade10-site/site/page-shell/feature-tcs.md` `## Settled` (main :1198-1205, folded :1291-1298) against the change suite's `## Settled` (:191-199), SC-80 and the requirement (delta `spec.md`:28-32); folded `## Background` :9, :12 against :14; `scripts/openspec/lib/acceptance.mjs` `mergeList` :580, `appendMissing` :555, :961 | The suite fold only adds: `## Settled` items are unioned and `## Background` paragraphs are appended, so nothing a change writes can retire a durable line. In the folded suite, "a later change offers it; until then the menu never offers it" sits beside "Membership right after it wherever the membership page is carried". The superseded menu line without Membership also stays. `<site>` is defined three times, and two of them say staging carries only the account page. So the suite states one fact two ways. `accept:preflight` passes because no gate looks for superseded suite lines. QA2's remedy, striking the lines "by hand at acceptance" (change suite :222-223), is not part of any procedure: `spec:accept` writes the fold as computed, `/planning-dev` has no step for editing a fold by hand, and a later strike is a durable edit outside the fold that archive has to acknowledge. This is a category, not one instance: the fold at `8936e2e46` (Accept draw-account-menu-and-profile) already left main's duplicate `<site>` line. Row 2 is the next instance | planning-dev | The fold first: give `mergeList` and the Background merge a way for a change's suite to replace a durable `## Settled` item or `## Background` line that it supersedes, with a regression case in `scripts/openspec/acceptance.test.mjs`, as its own commit on store `main`. Then this change's suite names the two superseded Settled lines and the stale `<site>` line through that path. Rerun `accept:preflight` and re-read the folded suite. Not in the PRD or delta, which are right | open |
| 2 | fix | Change suite `## Settled` :203-206 | "Whether the shared header keeps an unnamed Submissions item is the follow-up site-chrome change's (Q6)" puts a pointer to a future change into a durable suite. That is the same kind of line row 1 cannot retire. Q6 already records the deferral in `decisions.md`, and the site-chrome page's 🚧 "No other item" line carries it to the follow-up | QA | Change suite `## Settled`: keep the grade10 fact ("the site supplies none, so the menu holds ... and nothing else") and drop the clause about the follow-up | open |
| 3 | note | `docs/prds/products/shared/ui/site-chrome.md`:35-38; no site-chrome delta | The change added this 🚧 line, and its own delta does not serve it. That is acceptable. `docs/governance/prd-and-openspec.md`:10 says the mark is the whole record and no change has to deliver it. Leaving the old unmarked "after My Auctions" line would leave a page line untrue against Q1, which the Folded result check forbids. The line names who delivers it in the same form as the page's existing Profile-image lines (:41-46, draw-account-menu-and-profile Q10). Holds nothing | - | - | open |
| 4 | note | Folded page-shell `spec.md`:655-659 and SC-80, SC-82, against `openspec/specs/shared/ui/site-chrome/spec.md`:304-307 and SC-38 (:451-458) and `restrict-auctions-by-region`'s unaccepted site-chrome delta (`spec.md`:57-58, :204-210) | After the fold, page-shell places Membership right after Profile, while the shared header's contract and the overlapping delta keep "Profile, My Orders, My Auctions, Membership, Sign Out". That is the menu order stated two ways across capabilities. It is a note, not a blocker, only because Q8 is the human's scope decision with this cost named. Also, the component at grade10's pin `003f16bd7` already draws the new order (`efc781e5a`, and the `WithProfile` story asserts it), and the site-chrome page marks the gap 🚧. The risk is that a reader of site-chrome SC-38 changes `SiteHeader` back. The `SiteShell.test.tsx` and `store-shut.test.tsx` assertions in `tech-design.md` Risks cover that. The accepting human can reopen it with one reply | follow-up site-chrome change | - | open |

## Closed Raised rows

- **`shared/ui/site-chrome` - Submissions (Q6)** - accepted. Source: grade10 `apps/frontend/grade10/src/chrome/shell/SiteShell.tsx` passes no `onSubmissions` (checked with the draft applied), plus the non-goal "Submissions in the account menu". The Capability cell is not a finding. The schema's `decisions` instruction has the pass write "the capability it read", and site-chrome was in scope when QA1 ran. The row lands as Q6, and the site-chrome half is carried by that page's 🚧 "No other item" line.
- **`grade10-site/site/page-shell` - a collector who never joined (Q7)** - accepted. Source: Membership page :7, "An account is a member", and its callout at :40-43 that the join page is removed.

## Human input

### Questions

1. **How row 1 is repaired** - Should acceptance wait for the fold to learn supersession, or go ahead with a durable repair commit made by hand?
   - **A - Fix the fold first - Recommended** - A store tooling commit lets a change's suite retire a durable `## Settled` item or `## Background` line. Then this suite uses it and is folded cleanly. It costs one tooling commit with a test before acceptance, and it repairs main's existing duplicate `<site>` line as well.
   - **B - Accept, then repair the durable suite by hand** - A commit right after `spec:accept` strikes the three stale lines, and archive acknowledges the difference. Acceptance is not delayed, but the next change that restates a Settled or Background line repeats the problem.
   - **Why it matters** - QA1 reads the durable `## Settled` blind. A line saying the menu never offers Membership would be read as settled product.
   - **Blocks** - Acceptance of this change.
   - **Reasons** - Row 1; `docs/governance/specs-to-test-cases.md`:44 (QA1 reads the existing suite "with its `## Settled`"); the earlier instance at `8936e2e46`.

## Coverage

Full first review; no prior ledger.

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `pnpm plan:review-preflight --json` | rerun at 03056a172, exit 0, ready; digest 70e9e6c3; 1 requirement, 3 page lines, 3 durable targets, 0 overlaps, no expansions | manifest scope | - |
| `pnpm accept:preflight` | coordinator receipt at 03056a172, exit 0; fingerprint f2cbd5f2 and baseline 2d936271, reproduced by `prepareAcceptance` | blocked-preflight stop; fold outputs rendered and read | coordinator `gates/accept-preflight.txt` |
| `pnpm check:manual` | coordinator receipt at 03056a172, clean tree; 0 failures, 91 warnings, no `changed meaning`, none on page-shell or site-chrome | Warnings | coordinator `gates/manual.txt` |
| `openspec validate --strict`, `validate:changes`, `validate-test-cases` | coordinator receipts at 03056a172, exit 0 | structure; 4 cases `draft` | coordinator `gates/` |
| Drift: `origin/main` after fetch | 910e3de6b, one commit past the branch base (auction winner-order UI and its catalogs) | touches no page, spec, i18n chrome key or fold code in scope | - |
| Change: `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`, `.openspec.yaml`, page-shell `spec.md`, `user-journeys.md`, `feature-tcs.md` | 03056a172 | Page to delta, Same facts, Nothing open, Designs, Journeys and cases | - |
| `ui-design.md` | absent; optional in the schema | the drawn state is `SiteHeader` `WithProfile` at pin 003f16bd7, which asserts Profile, Membership, My Orders | - |
| Pages: Page Shell (frontmatter, Account Menu, Membership decision row), Site Header and Footer Account Entry, Membership :1-43, Carried Surfaces lane table | 03056a172 | Page to delta, Same facts, Nothing open (only ❓ is Collector help, out of scope) | - |
| Folded durable page-shell `spec.md`, `user-journeys.md`, `feature-tcs.md` | `prepareAcceptance` at 03056a172 | Folded result: MODIFIED requirement exists on main; Purpose kept; unchanged account-control and header-controls requirements agree; suite rows 1-2 | - |
| Related contract `shared/ui/site-chrome` `spec.md`, and the overlap `restrict-auctions-by-region` site-chrome delta (not accepted) | 03056a172 | Same facts across capabilities; Overlap | - |
| Catalog `packages/i18n/messages/grade10/{en,zh-Hans,zh-Hant}/chrome.json` `membership` | 03056a172 | label clause and SC-84 | - |
| Fold code `scripts/openspec/lib/acceptance.mjs` `mergeSuite` | 03056a172 | how Settled and Background fold | - |
| grade10 draft `SiteShell.tsx`, `SiteShell.test.tsx`, `store-shut.test.tsx` (uncommitted, `claude/membership-account-menu`) | working tree | matches `tech-design.md` Decisions (`config.gates.membership`, `ROUTES.membership`, `tChrome("membership")`); tests for SC-82 to SC-84 not yet written, which is task 1.1 progress and not a planning finding | - |
