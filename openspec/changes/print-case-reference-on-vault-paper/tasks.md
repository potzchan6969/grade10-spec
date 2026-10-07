## 1. The manual (grade10-spec)

- [ ] 1.1 Keep the 🚧 lines that name the paper's case by its reference: **The case** under `## Document terms` in `docs/prds/products/grade10-site/vault/documents-and-signing.md`, and **Case reference on the paper** in `docs/prds/products/grade10-site/vault/collector-pages.md`, restating no requirement
- [ ] 1.2 Verify: `pnpm check:manual`, `openspec validate print-case-reference-on-vault-paper --strict`

## 2. The case reference on the paper (grade10)

Nothing here waits on group 1: the work is in the vault backend alone.

- [ ] 2.1 The tests this group's scenarios name, in their own commit before its code, ticked last: in the node lane, `packages/vault/backend/test/documents/paper.test.ts` reads the `Case` fact and the exported footer of the custody agreement, the loan agreement and the release receipt, and finds the reference and no id; in the behaviour suite, `packages/vault/backend/src/testing/suites/registerPaper.ts` prepares a financed packet and a release receipt and finds the case row's `reference`, not its `id`, in the data each template's `render` receives, then signs a packet and finds no template rendered again, the prepared `sourceSha256` on every sealed row, and each sealed digest verified as sealed (`grade10-site-vault-documents-and-signing-SC-39`, `grade10-site-vault-documents-and-signing-SC-40`, `grade10-site-vault-documents-and-signing-SC-42`)
- [ ] 2.2 Make `grade10-site-vault-documents-and-signing-SC-39` and `grade10-site-vault-documents-and-signing-SC-40` pass: rename `caseId` to `caseReference` on the three templates' data types; build each footer with one helper in `templates/page.ts` and export it beside the template's facts as `custodyAgreementFooter`, `loanAgreementFooter` and `releaseDocumentFooter`; rename `DocumentPageArgs.reference` to `footer`; pass `vaultCase.reference` in the three drafts in `prepare.ts`, leaving doc-sign's `caseRef` on the case id
- [ ] 2.3 Make `grade10-site-vault-documents-and-signing-SC-42` pass: the seal and verification keep working from the bytes stored at preparation, with no change to doc-sign; the test from 2.1 is the evidence
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm --filter @grade10/vault-service exec vitest run test/documents/paper.test.ts`, `pnpm --filter @grade10/vault-worker exec vitest run test/db/scenarios.spec.ts`

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its input. Human QA reviews cases after deployment (`/tcs-review print-case-reference-on-vault-paper`), and `/tcs-run-sheet` executes manual cases when needed. Needs group 2 landed.

The vault's e2e files run on the isolated stack and are skipped on staging, so
3.1 is the guardrail and 3.3 is a walk by hand on staging.

- [ ] 3.1 One walk per journey this change adds, end to end through the interface its actor uses, kept as the change's end-to-end suite in `apps/frontend/grade10/e2e/tests/vault/paper.spec.ts`, with the PDF reader in `helpers/grading-papers.ts` lifted into a shared helper: a financed packet sealed at the counter, its custody and loan agreements read as text from the sealed copy, each `Case` fact and footer naming the case's reference and no id, and the release receipt read the same way at collection (`grade10-site-vault-documents-and-signing-US-07`); the reference read off that custody agreement typed into the console's search, which answers with that one case, and the case opened (`grade10-site-vault-documents-and-signing-US-08`, `grade10-site-vault-documents-and-signing-SC-41`)
- [ ] 3.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/vault/paper.spec.ts`, in the walks' own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 3.3 Walk it on staging once group 2 is deployed there: prepare a financed packet for a staging case, read the custody and loan agreements in the ceremony and confirm the `Case` fact and the footer show the reference the ceremony's header shows; seal it, download each sealed copy and read the same two lines; search the console for that reference and open the case; and verify by its digest a document sealed before the deploy, which still answers as sealed. Record what was seen in the walk's `rounds.md` row; no case is marked from this walk
- [ ] 3.4 Verify: `apps/frontend/grade10/e2e/tests/vault/paper.spec.ts` on the isolated stack, `pnpm run tcs:validate`, `pnpm check:manual`
