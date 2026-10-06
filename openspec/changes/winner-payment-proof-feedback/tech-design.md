## Context

The proof upload already has a settled backend contract and a preview dialog.
This change completes the interaction around that contract in the preview
Winner Order page, the standalone Submit Payment Proof stories, and the
consuming `grade10-site` assembly. The store owns the behavior and copy; the
application repositories own their page composition.

## Composition

- **Shared preview feedback** - Keep success and failure toast creation in one
  preview-local helper. The page and standalone stories call the same helper,
  so title and description cannot drift.
- **Page callback** - Winner Order supplies the success callback that changes
  its invoice view to Payment Verifying. The helper does not own page status.
  A standalone story supplies no page callback and still renders the success
  toast before closing its dialog.
- **Consumer integration** - `grade10-site` wires the same success and failure
  outcomes into its existing Winner Order dialog and page. The feedback
  helper is preview-local and is not a new `@grade10/ui` export, so the
  consuming application carries the same small composition contract and
  copies the approved catalog strings through its existing i18n path.

## State and sequencing

The proof form has four observable phases: ready, converting, submitting and
failed. File selection enters converting only for HEIC or HEIF. A successful
conversion enters ready; submit enters submitting; a failed upload returns to
failed while retaining the draft. A successful upload invokes the page success
callback, emits the success toast, and closes the dialog. The page then hides
both payment entry points and renders Payment Verifying.

Converting and submitting share one busy guard. The guard disables the whole
form and consumes Cancel, Escape and overlay-dismiss attempts. The guard is
released only when the conversion or upload settles. The ordinary dirty-leave
`window.confirm` remains for a non-busy draft, as the decision record requires.

## Integration boundaries

- **Existing rail composition** - `add-winner-how-to-pay-rails` owns the
  proof-only dialog, the View Bank Details entry point and the hidden controls.
  This change adds feedback and busy behavior inside that settled composition.
- **Existing upload contract** - `complete-auction-post-sale` owns storage,
  invoice status, operator review and the proof endpoint. No backend, database,
  file validation or operator surface changes are needed here.
- **Shared documents and tokens** - This planning change edits only its delta;
  acceptance folds its Winner Order requirement into the durable spec. No
  shared component, token, catalog package or PRD changes here. Existing
  Dialog, FileDropzone, Toast and Alert blocks remain the design-system source.

## Risks and verification

- **Page and story drift** - exercise both standalone success and failure
  stories plus the page flow against the same helper and exact copy.
- **Race on leave** - interaction tests attempt all three leave paths during
  conversion and submission and assert the dialog remains open.
- **Consumer drift** - the grade10-site integration tests assert the same
  success/failure copy, status transition, hidden controls and busy lock.

## Open questions

None. The consuming application's existing upload procedure and Winner Order
read model are sufficient; only their composition needs the feedback contract.
