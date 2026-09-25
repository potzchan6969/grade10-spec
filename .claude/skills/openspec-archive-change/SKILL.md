---
name: openspec-archive-change
description: Archive an accepted OpenSpec change after implementation is verified and before deployment.
---

# Archive a Verified Change

The accepted contract is published to `openspec/specs/` before implementation.
Archiving preserves the change record after implementation; it does not fold
requirements a second time and does not wait for deployment.

1. **Check implementation evidence.** Confirm required task groups are complete
   and verified. In the application repository, record the implemented
   contract and source commits with
   `pnpm plan implementation <change> [--commit <sha>] --component <deploy-component>...`.
   The generated `implementation.json` identifies the accepted fingerprint,
   repository commits and concrete components. A change implemented wholly in
   `grade10-spec` records its repository commit there.
2. **Check acceptance and archive readiness.** Confirm `acceptance.json` names
   the accepted content fingerprint and that the current artifacts still match
   it. Run `pnpm run archive:preflight <change>` and resolve every refusal.
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
