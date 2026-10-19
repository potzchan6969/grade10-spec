# Accept review — transfer-relist-listing-slug

**Reviewed:** 2026-10-15
**Reviewed by:** planning-dev accept-review pass (@mason5991 coordinating)
**Source identity:** see latest `pnpm accept:preflight` fingerprint below
**Verdict:** Not ready to accept — store-wide folded `tcs:validate --require-suites` gate

## Scope checked

- PRD: Auction Management Relist / slug transfer lines; Display address note
- `proposal.md`, `decisions.md` (Q1–Q11 landed), journeys (Context US-04/US-09/US-73; no MODIFIED journey)
- `tech-design.md`, delta Relist + generated-slug requirements, `feature-tcs.md` (9 draft cases, QA2 reconciled), `tasks.md`
- Cluster `reconciliation.md` with `release-called-off-listing-slugs` (that change owns `Slug is the listing's public lookup key`)

## Repairs landed after first Not ready

- Removed duplicate US-09 from Context+MODIFIED (kept durable Context only)
- Raised Landed cells are single `Q<n>`
- Mid-line 🚧 lifted on management/display
- Dropped MODIFIED restatement of `Slug is the listing's public lookup key` (overlap)
- Restored durable Purpose text in the delta

## Gate receipts

| Gate | Result |
| --- | --- |
| `pnpm plan:review-preflight transfer-relist-listing-slug` | ready (2 requirements, 0 overlaps after slug-requirement drop) |
| `pnpm run tcs:validate -- transfer-relist-listing-slug` | pass (warnings only for intentionally unlinked US9-TC11, US73-TC9) |
| `pnpm accept:preflight transfer-relist-listing-slug` | refused — folded-store `tcs:validate --require-suites` fails on pre-existing archive-fold and missing-suite findings outside this change |

**Latest fingerprint / baseline** (preflight still prints them before refusing):

- Fingerprint: `d3562a70d087281dcb8a1381349d31ce2511e872b5797c6a414dcc5f6cf99cf0`
- Baseline: `5da32c7a9f47142c816707dcbd03c826962d63d77da51d17533e0882981a8956`
- Durable files to write: listing `spec.md`, `user-journeys.md`, `feature-tcs.md`

## Findings

### Store / tooling (blocks accept)

1. **blocker** — Folded `tcs:validate --require-suites` exits 1 on store-wide “archived cases never folded” and “journeys but no feature suite” findings. Same class of gate that holds `add-store-cart-drawer-ui` in `planning-run-pending.md`. Not introduced by this change's suite (scoped validate is clean).

### Change content

No open product blockers. Q10/Q11 settled. Cluster ownership recorded.

## Next

Accept once the store-wide suite gate is clear (or the accept path scopes the folded validate). Then:

```bash
pnpm accept:preflight transfer-relist-listing-slug
pnpm spec:accept transfer-relist-listing-slug --baseline <digest> --reviewed-by <human>
```
