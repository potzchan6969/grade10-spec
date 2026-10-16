reviewed: ea5ac1b35964833fafb479b50c63a89af1be7bcd
source-identity: 313fe45ff096dad4900a51f0257bf19ce3fcf5cb42a812d479f06dfb40bf6bdf
baseline-identity: unavailable
verdict: Not ready - 1 blocker

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `docs/prds/products/grade10-site/loyalty/membership.md` (Membership row, "No expiry line" bullet) × `decisions.md` Q3 and `## Raised` × `proposal.md` × `specs/.../feature-tcs.md` | The balance-expiry line's new home is undecided and every artifact carries the open mark: the page says `❓ Where the expiry date reads instead`, Q3's decided cell and the Raised row carry `❓ ... Tier & Benefits page 🚧`, and `accept:preflight` refuses the change while any of them stand. The line leaves `TierCard` either way; the question is only whether its relocation to the Tier & Benefits page is confirmed. Parked: `awaiting: decisions` in `.openspec.yaml` holds acceptance until the Tier & Benefits page design answers it. | PM | the PRD line and `decisions.md`, then the delta prose | open |
| 2 | note | `openspec/changes/never-lock-a-coupon/specs/grade10-site/loyalty/programme/spec.md:442` × `openspec/changes/redesign-tier-card/specs/grade10-site/loyalty/programme/spec.md:5` | Both deltas restate `The membership surface exports` with different text: `never-lock-a-coupon` carries the pre-redesign clause set (expiry-line prop, renewal validity) under the `TierCard` name. `depends_on` orders the fold correctly, but if it accepts or archives first, the durable contract briefly claims the card renders a line it no longer has — publish order matters, not correctness of the final fold. | — | landing order; no source change | open |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `redesign-tier-card` sources (proposal, decisions, spec delta, user-journeys, feature-tcs, tasks, `.openspec.yaml`) | `313fe45f…` review-scope digest, 404 inputs | full read; page-to-delta, same-facts, nothing-open, folded-result | — |
| `docs/prds/products/grade10-site/loyalty/membership.md` | worktree | 🚧/❓ lines vs delta; embed `loyalty-membership-blocks-tiercard--gold`; callout names Figma frame | — |
| `docs/prds/products/grade10-site/loyalty/{coupons,operator-console,paying-with-points,points,rewards,tiers}.md` | worktree | frontmatter `spec:` scope; no page states the card's old facts | — |
| `openspec/specs/grade10-site/loyalty/programme/spec.md` | `ea5ac1b` | MODIFIED names an existing requirement; all six scenarios carried; Purpose untouched | — |
| `never-lock-a-coupon` delta | worktree | overlap on the shared requirement; `depends_on` fold order | — |
| `pnpm plan:review-preflight --json` | — | `ready`, zero blockers; overlap expansion taken | — |
| `pnpm accept:preflight` | — | refused: unresolved ❓/TBC in decisions, proposal, feature-tcs; open Raised row | — |
| `pnpm check:manual` | — | 0 failures; warnings are pre-existing suite/doc gaps | — |
| `pnpm openspec validate`, `pnpm validate:changes` | — | change valid; 81 changes validated | — |
