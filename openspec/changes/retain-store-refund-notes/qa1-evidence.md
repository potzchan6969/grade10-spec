# QA1 — retain-store-refund-notes

## Scope and isolation

- Ran the bundled `spec-to-tcs` workflow against `/tmp/refund-note-qa1` only. No application source, parent worktree requirements, scenarios, technical design, archive or QA2 material was read.
- Read the bundled proposal, decisions, feature-set-only outline and context journey; the Order Details PRD; the Order Details suite and Store domain suite; and both bundled governance files. Used a heading-only inventory of the other supplied Store suites to identify owning routes.
- The outline contains no Requirements section. The eight files declared by `inputs.json` match their supplied SHA-256 values; details are in `validation.json`.
- Owner: page-level Store suite, `docs/prds/products/grade10-site/store/tests/orderDetails-tcs.md`. Store cases trace PRD rules and carry no OpenSpec scenario links.

## Suite disposition

The existing page suite is `pending-review · 4/23`, styled to tcs-rules r7: 4 actual and 19 draft cases. The domain suite is `approved · 7/7`. This is a narrow update, not regeneration.

- New cases: 0. Existing page cases: all 23 retained with identical bodies, statuses, markers and revisions. Domain cases: all 7 unchanged; no domain suite output is necessary.
- Added observations or rows: none. No current route shows a refund reason. The PRD explicitly states “The frontend display is follow-on work”; source note availability alone cannot make a GUI assertion executable.
- Walk: No walk — the requested behavior is backend-only data retention and exposure. Inventing a note on the screen, an admin publication control or a tester calling an API as a product actor would violate scope or governance.
- Suite output changes only one header line: `Out of suite (api)` for the new reason-data behavior. The suite status and existing Drafts styled date remain unchanged.
- Domain reuse: `g10.store-dmn.TC7` already walks private-link-to-owner navigation; `g10.store-dmn.TC5` reaches owned order facts. Neither proves reason data. Existing page TC2 and TC10 walk access refusals; TC8 and TC9 walk permitted link/owner routes. Preserve these as regression routes, without claiming they verify hidden API fields.
- Duplicate candidates introduced: none. Existing baseline case overlap or unrelated untraced PRD rules have not been changed.

## Blind backend coverage checklist — out of suite (api)

These are implementation-verification needs inferred from the permitted anchors, not GUI test cases and not an execution result. QA2 should reconcile them against Dev's independent requirements; no scenario ids have been read or assigned.

| Partition or transition | Expected behavior grounded in the bundle | Source |
| --- | --- | --- |
| Non-empty ordinary note from webhook; same from provider read | Exact supplied string is durable and retrievable per refund | PRD Items / Refund Reason Data; Q2 |
| Missing, null, empty and whitespace-only input | No reason; no invented fallback | Q2 |
| Meaningful leading/trailing spaces, non-Latin text, newlines | Preserve the non-empty source string exactly | Q2 |
| Machine-looking idempotency note; markup-looking text | Expose literal text as data; no classification, mapping, rewriting or markup execution | Q1, Q5, Q8 |
| Zero, one and multiple refund records | Legacy orders remain readable; distinct refund identities retain distinct optional notes | Q6, Q7 |
| Two refunds naming the same line; one refund naming several lines | Keep refunds separate and only explicit associations; no latest order-wide note replacement | Q6 |
| Note-bearing refund naming no line, including delivery-only refund | Retain at refund level; attach to no inferred line | Q6 |
| Owner detail and valid private link, including a non-owner link holder | Supply reason under existing access grants, with no new grants or account-data exposure | PRD Order Link; Q4 |
| Wrong owner, wrong secret, missing order | Existing denial behavior protects the new metadata too | PRD Owner-Only Address / Wrong Link; Q4, Q8 |
| Duplicate delivery after money was deduplicated | Metadata may still be enriched; no repeat money, points or stock effect | Q7; Non-Goals |
| Provider reconciliation and old-order metadata enrichment | Existing financial facts and old clients remain valid; missing historical note stays absent | Q7; proposal Impact |
| Erasure followed by replay or provider synchronization | Erasure clears reason text and synchronization does not restore it | Q8 |
| Logging or analytics during ingestion/read/error handling | Raw refund text does not enter logs or analytics | Q8 |

No numeric length boundary is stated. Exact-fidelity coverage must not invent a truncation policy. Concurrency handling, API property names, transaction boundaries, source precedence and fixtures are implementation details for Dev; this pass does not choose them.

## Raised product choice

One Raised row is supplied in the copied `decisions.md`: whether later different non-empty text for the same refund replaces the retained reason. Recommendation: reflect the latest authoritative source text without adding note history. This is distinct from settling technical event ordering. It is not converted into a case. QA2 may close a routine choice under the governance held test; this pass claims no human decision or accepted answer.

Direct exposure, no approval/mapping, machine-looking text exposure, whitespace-only absence, no inferred line attribution and no frontend scope are already settled and were not reopened.

## Anchor and validation handoff

- The new rule exists at `order-detail#items/refund-reason-data`; its backend behavior has no GUI case in this phase. A rule-coverage warning is expected until the frontend follow-on provides a reachable display; do not close it by manufacturing a case.
- The bundle carries no runnable full repository or Storybook. No global `tcs:validate` or `validate:changes` command was run, as instructed. No app tests, browser walk or runtime validation was run.
- Local structural checks passed: eight frozen-input hashes match; original page case text is byte-preserved after removing the added header; 23 page cases remain; no OpenSpec TCS file was created; the outline has no Requirements section.
- QA2 owns requirement reconciliation, the Raised disposition, any final out-of-suite wording and full-repository validation. Store cases receive no `covers` links. No review verdict or execution claim has been added to a suite.
