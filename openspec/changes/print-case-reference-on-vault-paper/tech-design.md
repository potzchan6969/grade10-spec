## Context

The three vault templates in grade10
`packages/vault/backend/src/documents/templates/` take a `caseId` field and
print it twice: the `Case` fact and the footer line. `prepare.ts` fills it
with `vaultCase.id` in the custody, loan and release drafts. The case row
already carries `reference`: `NOT NULL`, unique and pattern-checked
(`db/schema/cases.ts`), so every case has one to print.

doc-sign's certificate (`packets/certificate.ts`) prints `Case: <caseRef>` on
the page the seal appends, and the seal builds it from the `sign_packets` row.

What surrounds the paper and does not move:

- **doc-sign's `caseRef`** - the packet's join key to the case. It holds the
  case id and is read to lock the case, read its identity and void open
  packets, so it cannot carry the reference
- **Digests** - `sourceSha256` is taken over the bytes rendered at
  preparation and stored with the document row. The seal re-hashes the stored
  bytes against it, verification and the archive re-hash read stored bytes,
  and no path renders a template again after preparation
- **The drift key** - `packetPlan` hashes each template's data as
  `canonicalJson` in the render phase and again under the case lock. It is
  compared in memory and never stored
- **The render memo** - keyed by template, data, instant and face. Only a test
  host binds one

## Goals / Non-Goals

**Goals:**

- No template can be handed the case id where it prints the case
- The certificate names the case with the handle its packet was prepared with
- What the paper prints of the case is readable by a node test without a PDF

**Non-Goals:**

- doc-sign's `caseRef`, and every certificate line but `Case`
- Grading's certificate: grading passes no label and keeps printing its
  submission id
- Re-rendering, re-sealing or migrating any packet

## Decisions

The rule is
[`grade10-site/vault/documents-and-signing`](specs/grade10-site/vault/documents-and-signing/spec.md)'s
new requirement, "A document names the case by its reference". The choices
below are how it lands.

| Decision | Choice | Rejected |
| --- | --- | --- |
| The field | Rename `caseId` to `caseReference` on `CustodyAgreementData`, `LoanAgreementData` and `ReleaseDocumentData`. A caller still passing `caseId` fails the type check, both on the excess property and on the missing one | Keeping `caseId` and passing the reference in it: the name would say id and hold a reference, and a caller that never changed would keep compiling. A branded reference type: the column is plain text, and a brand would need a cast at every read for one field |
| The source | The three drafts in `prepare.ts` pass `vaultCase.reference`, read off the same row as every other printed fact, in both phases | A second read of the reference: the row is already in hand under the lock |
| The footer | One helper in `templates/page.ts` builds `<trading name> <kind> · case <reference>`, and each template exports its footer beside its `*Facts` and `*Terms` (`custodyAgreementFooter`, `loanAgreementFooter`, `releaseDocumentFooter`) | Three template literals, as today: a test reaches them only by parsing a PDF |
| The page argument | `DocumentPageArgs.reference` becomes `footer`, since it holds the whole line | Keeping `reference`: beside `caseReference` it reads as the case's reference |
| The labels | `Case` and `case` stay (Q6) | - |
| doc-sign's join key | `renderCasePacket` keeps `caseRef: args.caseId` | Passing the reference as `caseRef`: it is the join key every packet lookup, lock and void uses, and the packets already stored carry the id |
| The certificate's case | `RenderPacketArgs` gains an optional `caseLabel`, stored at preparation in a nullable `sign_packets.case_label`. The seal prints `Case: <caseLabel ?? caseRef>`, and `CertificateData.caseRef` becomes `caseLabel`, the line it prints. Vault passes `caseLabel: vaultCase.reference` from the row it already holds | A host port read at the seal: a packet prepared with the id would seal with the reference on its certificate and the id on its page. A required field: grading would have to choose a handle in a vault change |
| The column | Generated into vault's and grading's schemas, nullable and never backfilled. The host's column guard compares the whole row, so the label is frozen with the rest of the packet and the guard is not regenerated | A backfill: a packet sealed before the change keeps the bytes it was sealed with, and an open one keeps the id it was rendered with (Q4) |

## Service Interfaces

Each template is a pure function of its data. Only the case's field changes.
Nothing opens a transaction or takes a lock it did not before; the packet row
takes one more column.

| Template | Input (excerpt) | `Case` fact | Footer |
| --- | --- | --- | --- |
| `custodyAgreement` | `{ caseReference: "QC7PEQ", entity: { tradingName: "Grade10", ... }, ... }` | `["Case", "QC7PEQ"]` | `Grade10 custody · case QC7PEQ` |
| `loanAgreement` | the same, `entity` the lender | `["Case", "QC7PEQ"]` | `Grade10 financing · case QC7PEQ` |
| `releaseDocument` | the same, `entity` the custodian | `["Case", "QC7PEQ"]` | `Grade10 release · case QC7PEQ` |

The six characters are shorter than the id they replace, so no page that fits
today overruns its signature box.

| Packet | `case_label` | Certificate |
| --- | --- | --- |
| Vault, prepared after the change | `QC7PEQ` | `Case: QC7PEQ` |
| Vault, prepared before it | null | `Case: vc_...`, as its page |
| Grading | null | `Case: <submission id>`, as today |

## Test Lanes

| Scenario | Lane | Where |
| --- | --- | --- |
| `grade10-site-vault-documents-and-signing-SC-39`, `grade10-site-vault-documents-and-signing-SC-40` | Node: the facts and the exported footers of all three templates hold the reference and no id | `packages/vault/backend/test/documents/paper.test.ts`, fixtures moved to `caseReference` |
| `grade10-site-vault-documents-and-signing-SC-39`, `grade10-site-vault-documents-and-signing-SC-40` | Behaviour suite over Postgres: the data each template's spied `render` receives carries the case row's `reference` and not its `id` | `packages/vault/backend/src/testing/suites/registerPaper.ts`, run by `apps/backend/grade10/vault/test/db/scenarios.spec.ts` |
| `grade10-site-vault-documents-and-signing-SC-42` | Behaviour suite: signing a packet calls no template's `render`, the sealed rows keep the prepared `sourceSha256`, and verification answers each digest as sealed | The same suite |
| `grade10-site-vault-documents-and-signing-SC-43` | Node: `certificateLines` prints `Case: <caseLabel>`; doc-sign's ceremony suite seals a packet prepared with a label and one without, and finds the label, then `caseRef`, on the certificate | `packages/doc-sign/backend/test/packets/certificate.test.ts`, `packages/doc-sign/backend/src/testing/suites/ceremony.ts` |
| `grade10-site-vault-documents-and-signing-SC-43` | Behaviour suite over Postgres: the prepared packet's `case_label` is the case row's `reference` | `registerPaper.ts`, as above |
| `grade10-site-vault-documents-and-signing-SC-41`, `grade10-site-vault-documents-and-signing-SC-43` | E2E on the isolated stack: seal a financed packet, read the sealed custody agreement as text, find the reference on its page and its certificate and no id, search the console for its `Case` fact and open the one case it answers | `apps/frontend/grade10/e2e/tests/vault/`, with the PDF reader in `helpers/grading-papers.ts` lifted to a shared helper |

No e2e helper asserts a vault document's text today, so none moves with the
field.

## Risks / Trade-offs

- [A caller passes the id under the new name] → the behaviour suite compares
  the rendered data with the case row's `reference` and `id`, and the node
  test refuses an id-shaped value on the page
- [Packets open at deploy print the id] → their bytes and digests were taken
  at preparation and seal unchanged, as decided (Q4). Staff prepare again for
  the reference. A packet lives a day, or a day past its visit
- [A vault caller omits `caseLabel`] → the certificate falls back to the case
  id without failing; the behaviour suite reads the stored `case_label` against
  the case row, and the e2e walk reads the certificate
- [Grading's certificate names the submission by its id while its page names
  the submission reference] → unchanged here; grading passing its reference is
  a follow-on
- [Staff hold paper that prints an id] → the console's search takes a case-id
  prefix of seven characters or more
  (`grade10-admin/vault/operator-queue`), unchanged (Q5)

## Migration Plan

1. Apply the generated migration adding the nullable `case_label` to vault's
   and grading's `sign_packets`. No backfill or flag.
2. Deploy the vault worker, and the grading worker for its schema.
3. Packets prepared from then on print the reference on the page and the
   certificate. Sealed and open packets keep their bytes and a null label.

Rollback is a code revert; the column stays and is ignored. A packet prepared
in between prints the reference on its page and, sealed after the revert, the
id on its certificate.
