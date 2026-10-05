---
name: openspec-archive-change
description: Archive an accepted OpenSpec change after implementation is verified. Deployment does not wait for it.
---

# Archive a Verified Change

The accepted contract is published to `openspec/specs/` before implementation.
Archiving preserves the change record after implementation; it does not fold
requirements a second time and does not wait for deployment.

1. **Check implementation evidence.** Confirm required task groups are complete
   and verified. In the application repository, record the implemented
   contract and source commits with
   `pnpm plan implementation <change> [--commit <sha>] --component <deploy-component>...`.
   The first claim records the durable contract baseline and target scope. The
   generated `implementation.json` identifies the accepted fingerprint,
   repository commits and concrete components. A change implemented wholly in
   `grade10-spec` records its repository commit there.
2. **Check acceptance and archive readiness.** Confirm `acceptance.json` names
   the accepted content fingerprint. Run `pnpm run archive:preflight <change>`.
   It compares the claim baseline with the current durable target scope. Record
   every difference in `compatibilityAcknowledgement`; an editorial entry names
   its reason, and a semantic entry also names its test or other evidence.
3. **Keep QA downstream.** Archive does not wait for human QA review or test
   execution. After deployment makes the implementation available, human QA
   reviews and classifies suites through `/tcs-review`; `/tcs-run-sheet` handles
   manual execution, and the review updates durable suites after archive.
4. **Preserve product decisions.** Move any decision that outlives the change
   into the capability PRD's `Product decisions` block. Record what moved, or
   `none`, as required by the archive preflight.
5. **Check the durable pages.** Remove the 🚧 marks for outcomes delivered by
   this change. The durable requirements were already published before
   implementation, so do not edit them as a second fold. Run `pnpm check:manual`
   after page updates.
6. **Archive.** Move the change to
   `openspec/changes/archive/YYYY-MM-DD-<change-name>/`, keeping the proposal,
   decisions, design, tasks, acceptance record, implementation record and
   `rounds.md`. Run the applicable archive and suite validation commands.

Report the archived path, accepted fingerprint, implementation record, durable
specs already published, and any remaining work.
