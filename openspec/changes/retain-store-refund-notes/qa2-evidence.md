# QA2 — retain-store-refund-notes

## Scope and source identity

Fresh reconciliation of committed draft `711d098188c919117a69605fe8696c3da38fe348`, plus the coordinator's subsequent suite-only Q9 Settled repair, against the [QA1 evidence](qa1-evidence.md), its independent `/tmp/refund-note-qa1-output/qa1-evidence.md`, frozen `/tmp/refund-note-qa1` inputs, [current decisions](decisions.md), [technical design](tech-design.md), [delta](specs/grade10-site/store/order-detail/spec.md), [tasks](tasks.md), [PRD][prd] and [page suite][suite]. QA1 cases were not regenerated from scenarios. Only this evidence file is written by this pass.

Read the Store exception in [suite governance][store-rule]: PRD rules own Store cases; they carry no OpenSpec scenario links and no `feature-tcs.md` is created under OpenSpec. All new behavior is backend-only. The API out-of-suite header is the correct routing; it does not prove an implementation works.

Current Purpose/Feature set, complete journey file and PRD match the frozen QA1 inputs. At initial review, the page suite matched the frozen suite after removing its one API header; the domain suite is byte-identical. The coordinator then appended only the Q9 Settled paragraph; the diff changes no case body, marker or status. Reviewed suite SHA-256: `5036ead756e16a23ab4982cc8da5b320786d98a3938191443c858c1bc66000cc`. Current decisions add the non-anchor Q9 clarification; this does not change roots, journeys, frontend scope or the direct-source-text outcome. QA1 supplied a real Raised question rather than silently selecting precedence.

Fetched `origin/main` during this pass; scoped `git log HEAD..origin/main` found no changes to this change, the Order Details durable capability or its PRD. The coordinator's `/tmp/refund-note-review-preflight.log` says `ready`: 4 requirements, 2 PRD lines, 2 durable targets, 0 overlaps. That is a structural planning receipt, not runtime evidence.

## Blind backend partition dispositions

All 13 QA1 partitions are retained as backend verification obligations. Links below reconcile existing blind expectations; they do not turn them into GUI cases or executed tests. Task numbers refer to the [delivery plan][tasks].

| QA1 partition | Disposition and source-linked planned coverage |
| --- | --- |
| Ordinary non-empty webhook note; same provider read | Retain. [Q2][decisions], [retention requirement / SC10][retention] and technical design's separate metadata inputs preserve exact text through both arms; tasks 2.1, 4.1–4.4, 6.2. |
| Absent, null, empty, whitespace-only | Retain, distinguishing input omission from output absence. [Q2/Q9][decisions], [SC14][retention] and [optional Reason][exposure]: omission preserves prior knowledge; canonical null/blank clears; no reason field is returned for no text. Tasks 2.1, 3.1, 4.1. |
| Meaningful surrounding whitespace, non-Latin text, newlines | Retain exactly; trim only to decide emptiness. [Q2][decisions], [SC10][retention], [SC17][exposure]; tasks 2.1, 4.1, 5.1 and literal fixtures in 6.1–6.2. No invented length/truncation boundary. |
| Machine/idempotency-looking and markup-looking text | Retain literally as data, without approval, classification or execution. [Q1/Q5/Q8][decisions], [SC17][exposure]; tasks 2.1, 4.1, 5.1. Existing refund creation and exact idempotency equality remain regression obligations under 4.4. |
| Zero, one, multiple refunds | Retain. [SC12][retention], [SC15][exposure], [SC21][reads]; optional collection preserves old responses, `[]` means no retained records, original refund identity remains unique. Tasks 2.1, 3.1, 5.1. |
| Two refunds sharing one line; one refund naming several lines | Retain. [Q6][decisions], [explicit-attribution requirement][exposure] and technical design decision 4 support both; task 3.1's association tests and 6.2's exact-association assertions own verification. SC15 directly illustrates distinct lines sharing a variant, not these two partitions; do not claim its example alone asserts them. Name both fixtures when implementing the already-scoped association tests. |
| No lines, including delivery-only refund | Retain at refund level. [SC16][exposure] distinguishes `[]`, unknown `null` and unresolved explicit identities; optional exact-match variant cannot be invented. Tasks 2.1, 3.1, 5.1, 6.1–6.2. |
| Owner and valid private link, including another signed-in account | Retain existing grants. [Q4][decisions], [PRD Order Link][order-link], [SC19][reads] and technical design API projection; tasks 5.1–5.3, 6.2. Existing GUI access cases do not assert the hidden reason field. |
| Wrong owner, wrong secret, unknown order | Retain refusal before metadata lookup/repair. [PRD Owner-Only Address][order], [Wrong Link][order-link], [SC20][reads]; tasks 5.1, 5.3, 6.2. No order-existence or metadata disclosure. |
| Duplicate after financial dedupe | Retain metadata enrichment under original refund identity. [Q7][decisions], [SC12][retention]; tasks 3.1, 4.1–4.4, 6.2 assert no duplicate metadata or repeated money, points or stock effect. |
| Reconciliation and old-order enrichment | Retain, without invented history or mandatory backfill. [SC12][retention], [SC21][reads], technical design Historical replay; tasks 4.3–4.4, 5.1, 6.2. Existing eligible refresh remains bounded; explicit old-order replay is metadata-only and dry-run by default. |
| Erasure then replay/provider sync | Retain, including the race. [Q8][decisions], [SC22][erasure], technical design durable order guard and lock order; tasks 3.1, 3.3–3.4, 4.1, 6.2. Financial facts survive. |
| Logging/analytics in ingestion/read/error paths | Retain raw-text exclusion. [Q8][decisions], [erasure/privacy requirement and SC22][erasure], technical design processor diagnostics; task 4.1 explicitly requires this assertion. A privacy assertion is backend evidence, not a GUI observation. |

## Scenario dispositions

Each scenario is **out of suite (api)** under the existing [page header][suite]. None has an asserting Store GUI case in this phase, and none receives a `covers` link. This is intentional routing, distinct from planned backend assertion coverage below. Stable marker suffixes identify the current scenario unambiguously.

| Scenario | Reconciliation and implementation verification ownership |
| --- | --- |
| [SC10][retention] (`SC-qhz`) | Ordinary source fidelity through both ingress arms matches QA1; tasks 2, 4 and local walk 6. |
| [SC11][retention] (`SC-sx2`) | Pending/restock-only metadata refines root retention without manufacturing settlement; technical design separates metadata before money filters. Tasks 4.1–4.2 and 6.1–6.2. QA1's financial-safety expectation supports it; no GUI refund-money assertion is inferred. |
| [SC12][retention] (`SC-mne`) | Duplicate/old-unkeyed history and retry enrichment match QA1; tasks 3.1, 4.1, 4.3–4.4 and 6.2. Original refund ids remain distinct from later financial event keys. |
| [SC13][retention] (`SC-h1q`) | Q9's canonical correction and delayed webhook precedence; tasks 3.1, 4.1, 4.3 and 6.2. No unsupported source-revision freshness promise. |
| [SC14][retention] (`SC-kou`) | Q9 canonical empty clears, omission preserves and delayed delivery cannot restore; tasks 2.1, 3.1, 4.1 and 6.2. Associations omitted by the update also remain. |
| [SC15][exposure] (`SC-bxr`) | Per-refund text and exact lines, including distinct lines sharing a variant; tasks 2.1, 3.1, 5.1 and 6.2. Same-line/many-line partitions remain additional association fixtures, as above. |
| [SC16][exposure] (`SC-y9x`) | No-line, unknown and unresolved association distinctions; tasks 2.1, 3.1, 5.1 and 6.1–6.2. No invented variant. |
| [SC17][exposure] (`SC-4bo`) | QA1 exact literal/system/markup text and blank absence; tasks 2.1, 4.1, 5.1 and 6.2. No screen or HTML execution claim. |
| [SC18][exposure] (`SC-6ot`) | Stable ordering is a reversible technical refinement under exposure; the API contract and detail projection agree. Task 5.1 explicitly tests tied/unknown issue times, task 6.2 asserts stable order. |
| [SC19][reads] (`SC-gnm`) | Owner/private-link parity with no account/loyalty facts on link response; tasks 5.1–5.3 and 6.2. Existing access walks are regression context, not reason-data proof. |
| [SC20][reads] (`SC-e8r`) | Existing refusals protect metadata before enrichment; tasks 5.1, 5.3 and 6.2. Matches QA1 denial partition. |
| [SC21][reads] (`SC-idf`) | Missing history/provider failure stays readable and compatible; metadata-only replay enriches later. Tasks 2.1, 4.3–4.4, 5.1, 6.2. |
| [SC22][erasure] (`SC-46a`) | Erasure, replay/race protection and raw-text diagnostic exclusion match QA1; tasks 3.1, 3.3–3.4, 4.1 and 6.2. These require real backend assertions, not a claim from GUI access cases. |

All four added requirements have backend scenarios and implementation/test ownership. No scenario is unreached **and unlisted**: all thirteen belong to the API out-of-suite inventory. No live GUI case asserts these complete THEN clauses, so none is wrongly excluded despite being covered by a living case.

## Complete anchor and task coverage

| Frozen anchor | Reconciled coverage |
| --- | --- |
| Refund reason retention: source fidelity; replay-safe enrichment | [SC10–SC14][retention], Q2/Q7/Q9 and QA1 ingestion/replay partitions; tasks 2–4 and 6. |
| Refund reason exposure: direct optional text; explicit attribution | [SC15–SC18][exposure], Q1/Q2/Q5/Q6 and QA1 exact-text/identity/association partitions; tasks 2, 3, 5 and 6. |
| Existing boundaries: private purchase data; backend scope | [SC19–SC21][reads], [SC22][erasure], Q3/Q4/Q8, authorization/compatibility/privacy partitions; tasks 3–6. No frontend work is required. |
| [grade10-site-store-order-detail-US-01][journey] | The changed data portion is covered by the exposure/read scenarios and deterministic API walk in task 6. Existing GUI journey assertions remain in the page suite and domain routes; that fact supplies no hidden-note coverage. Retention and erasure root scenarios support this journey without manufacturing a new actor or screen. |

All six task groups have a stated purpose: group 1 maintains the marked PRD without executable claims; group 2 tests additive contracts before changing them; group 3 tests persistence/erasure and both schema migrations; group 4 tests independent ingestion, replay and unchanged settlement; group 5 tests authorized projection/compatibility; group 6 supplies a protected deterministic fixture door and backend end-to-end walk. Each application group names verification. The fixture/provider triggers avoid waiting for cron, real Shopify or deployment. Application gates and fixtures are future implementation obligations, not completed work.

## Q9 closure, suite status and findings

- **Q9 is already settled.** QA1 raised replacement versus first-note retention. [Current Q9][decisions] chooses the current confirmed provider answer, explicit-empty clearing and omission preservation; [technical design decision 3](tech-design.md#decisions) implements it and SC13–SC14 express it. QA1's recommendation to follow authoritative source text agrees. Event precedence and serialized commit order are technical mechanisms; neither reading asserts a source revision the provider does not supply. No contradiction or held product choice was found, and Q1–Q8 are not reopened.
- **Closed source-owner repair:** initial review found Q9 absent from the durable suite's `## Settled`, as required by [Raised/reconciliation governance][raised-rule]. The coordinator appended `Refund reason freshness` there. QA2 verified the resulting paragraph against Q9 and SC13–SC14: confirmed provider replacement, explicit-empty clearing, omission preservation and delayed-webhook protection all agree. It carries no scenario id or frontend assertion; the suite-only diff changes no case. This finding is closed, with no held decision remaining.
- **Draft status:** page suite remains `pending-review · 4/23` (4 actual, 19 draft); domain suite remains `approved · 7/7`. New GUI cases: 0; duplicate new cases: 0; existing case bodies/revisions: unchanged. No QA approval, automation classification or execution status is implied.
- **Reuse without overclaim:** page TC2/TC10 retain refusal journeys and TC8/TC9 retain permitted-link/owner journeys. Domain `g10.store-dmn.TC5` and `TC7` retain owned-order/private-link navigation context. They do not verify retained reason data; no new observation can be joined to them until a frontend can expose that data.
- **Uncovered/overclaims:** no missing root, journey or behavioral requirement was found. No GUI coverage is claimed for `order-detail#items/refund-reason-data`; its rule-coverage warning is an expected consequence of this backend-only phase. Same-line/many-line association fixtures are not individually illustrated by SC15 and must be retained in the scoped backend tests. Exact fidelity has no numeric length limit to invent. Optional refund records do not assert settled money. No immutable source-version freshness, automatic complete historical backfill or future frontend behavior is claimed.

## Evidence limits

This is planning reconciliation, not implementation acceptance or a `Ready to accept` verdict. No application tests, database migration lanes, contract tests, backend API walk, browser walk, deployed checks, provider calls or production replay were run by QA2. No `check:manual`, `tcs:validate`, acceptance preflight or strict change validation was run by this pass; the review-preflight output above is the coordinator's supplied receipt. QA2 performed read-only source review, the scoped drift inspection and byte/text comparisons stated above. Acceptance review, refreshed gates after the coordinator's rebase, and publication remain with the coordinator. The reported remote-main move from `8f5253a3ceb842d7706f9ad274652dbaa439260f` to `927e5d09f534` has no scoped source changes in the drift inspection; QA2 makes no claim that the earlier receipt substitutes for refreshed baseline-sensitive gates.

[prd]: ../../../docs/prds/products/grade10-site/store/order-detail.md#items
[order]: ../../../docs/prds/products/grade10-site/store/order-detail.md#order
[order-link]: ../../../docs/prds/products/grade10-site/store/order-detail.md#order-link
[suite]: ../../../docs/prds/products/grade10-site/store/tests/orderDetails-tcs.md
[store-rule]: ../../../docs/governance/specs-to-test-cases.md#store
[raised-rule]: ../../../docs/governance/specs-to-test-cases.md#raised
[decisions]: decisions.md#decisions
[retention]: specs/grade10-site/store/order-detail/spec.md#requirement-refund-metadata-retains-the-supplied-source-facts
[exposure]: specs/grade10-site/store/order-detail/spec.md#requirement-retained-refund-records-expose-optional-reasons-and-precise-attribution
[reads]: specs/grade10-site/store/order-detail/spec.md#requirement-existing-authorized-detail-reads-carry-retained-reasons
[erasure]: specs/grade10-site/store/order-detail/spec.md#requirement-refund-reason-text-stays-within-the-existing-erasure-boundary
[journey]: specs/grade10-site/store/order-detail/user-journeys.md#grade10-site-store-order-detail-us-01-collector-inspects-one-owned-order
[tasks]: tasks.md

## Preflight source repair

Acceptance preflight found that the delta's narrow Purpose would replace the whole durable capability Purpose. The coordinator restored the existing durable Purpose verbatim. Frozen journey and Feature set roots and all thirteen scenarios are unchanged; this non-anchor repair preserves the existing capability scope and requires no blind-case regeneration. The initial snapshot hashes in planning-inputs.json remain historical input evidence.
