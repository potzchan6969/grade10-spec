reviewed: 0a5e152f2a9a5d1efa7cdf1d94fa7d265df422f4 (repair e3902a5ed; independent scoped rerun)
source-identity: 8a752c93d9b155f436d219bc3816424c055e78d6b584b19bc66e6224e5981600
baseline-identity: d4d138558878f00b9d758a041c0f2eb426d2c9a54e6f2eb1ca07ea9f712f3fd7
verdict: Ready to accept

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `specs/grade10-site/auction/winner-order/user-journeys.md:3` | `pnpm accept:preflight` refuses the fold: the delta carries a `**Walked by:**` line, which cannot stand beside the 25 durable journeys of `winner-order`. The delta journeys file only restates `winner-order-US-02` and `-US-20` under `## Context`; it changes none. | Dev | delete the `**Walked by:**` line (or the whole file, if no journey changes) | fixed e3902a5ed |
| 2 | fix | `specs/grade10-site/auction/winner-order/spec.md:12` · `docs/prds/products/grade10-site/auction/post-bidding.md:464` | The issue date has no zone or shape. Durable day-only dates read "in the viewer's local zone", and the receipt PDF prints `Asia/Hong_Kong` (`shared/dates-and-times`). A winner near midnight can read a label date one day off the PDF the label is meant to match. | Product (@tangconst) | the page and `decisions.md` first (a new row, or Q1), then the requirement | fixed e3902a5ed |
| 3 | fix | `tasks.md` 2.1 · `.openspec.yaml` | Consumption has no verify row (the cases `US2-TC57`, `US2-TC58`), and no task retires `receiptNumbered` and `receiptNumberedPdf` (`Receipt · P{n}`) in `@grade10/i18n` `auctionOrders.json`. The file has no `hands`, and no `ui-design.md` or `ui_waived` although a label a winner reads changes. | Dev | `tasks.md`; `.openspec.yaml` | fixed e3902a5ed |
| 4 | note | `docs/prds/products/grade10-site/auction/post-bidding.md:463` | The "oldest first" line is unmarked and already true on `main` (`SC-156`); the delta restates it in the requirement. This agrees, not a conflict. | - | - | open |

| 5 | note | `decisions.md` Q4 | The date-zone choice (viewer's local zone) was confirmed by @tangconst on 2026-10-23; no requirement text changed | Product | - | fixed |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| proposal.md, decisions.md, tasks.md, tech-design.md, .openspec.yaml | 0a5e152f2 | page-to-delta, nothing-open (the Raised row lands on Q1), tech-design adds no behaviour | - |
| specs/grade10-site/auction/winner-order/spec.md | 0a5e152f2 | folded-result against durable requirement (`spec.md:1320`) and `SC-67`, `SC-68`, `SC-156`; ids `SC-307`, `SC-308` free on `main` and in every active change | - |
| feature-tcs delta | 0a5e152f2 | `US2-TC57`, `US2-TC58` free (durable max `US2-TC56`), draft, each covers one scenario; no durable case reads the old label | - |
| user-journeys delta | 0a5e152f2 | finding 1 | - |
| docs/prds post-bidding.md `#receipt-documents` | 0a5e152f2 | same-facts: example string, `RC-` prefix, ID-less fallback agree; date zone - finding 2 | - |
| Overlap | 0a5e152f2 | `plan:review-preflight` lists none; `add-auction-internal-bid` and `convert-hkd-order-at-subtotal` touch other requirements | - |
| pnpm plan:review-preflight --json | ready, no blockers | manifest, overlaps, durable targets | - |
| pnpm accept:preflight | ready to fold and accept (fingerprint 9cd48dd5) | gate receipt, rerun after repair | - |
| pnpm check:manual | 0 failures, 348 warnings | none name this change | - |
