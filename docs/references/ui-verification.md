# UI Verification

## Ownership Decision

| Decision | Value |
| --- | --- |
| Approval and comparison workbench | This repository's combined Storybook |
| Historical storage | A dedicated R2 archive |
| Browser access | The Storybook origin's `/api/*` routes |
| Site capture recipes | Each consuming application's E2E directory |
| Shared protocol | `packages/ui-verification` |
| Authority | User instruction on 2026-10-09 to centralise verification in the spec Storybook |

- **Package** - `@grade10/ui-verification` owns the recording contract, archive validation, pixel diff, and the authenticated archive API used by the workbench and consuming capture tools.
- **Boundary** - This developer tool does not fetch product data or add orchestration to shared product components.
- **Browser imports** - The panel imports the browser-safe `model` and `pixel-diff` exports; archive and scoring exports run in Node or a Worker with `nodejs_compat`.
- **Identity** - A story carries a permanent verification `caseId`; application declarations add the target and capture point, so the same story can serve several sites.
- **History** - Saved reference and site PNGs stay immutable in the archive, independently of what the latest Storybook renders.
- **Two tabs** - Approve, where a designer approves the Storybook reference, and Site Compare, where the site is held to the approved reference.

## How It Flows

1. **Declare** - The application keeps a declaration and a site recipe beside the story. The recipe returns the component's locator on the site.
2. **Capture the site** - `pnpm ui:verify capture` runs in the application repository with the app and Storybook served. It records the full site viewport at desktop, tablet and mobile, for each locale, with the component's box in each image. It records the story's reference beside it, as that run saw it.
3. **Store** - Runs go to the local filesystem in development, and to R2 through the Worker when hosted.
4. **Approve** - In the Approve tab, a designer approves the story's reference. Approving captures the live story in this workbench, stores that image, and approves it. Only site captures are run by hand.
5. **Site Compare** - The Site Compare tab holds each site capture to the last approved reference, and flags how far the run's own reference has drifted from it.
6. **Compare pixels** - Runs in the browser on the archived PNGs. It writes nothing.

## Set Up Locally

```bash
pnpm install --frozen-lockfile
pnpm storybook:workbench
```

- **Open** - Open a story that carries a `verification` parameter, then the Approve or Site Compare tab. The Not Found story is the first.
- **Archive** - Development mounts the filesystem archive at the Storybook origin. The default is `.cache/ui-verification` in this checkout, or in the consuming app root when this checkout is its submodule. Set `UI_VERIFICATION_ARCHIVE` to an absolute directory before startup for another one.
- **No data yet** - Both tabs stay empty until the application has captured a site run, which names the story's cases. Capture from the application repository, then press Refresh.
- **Reference capture** - Approving uses the preview app's Playwright, launched by the workbench itself. `packages/ui-verification/src/reference-capture.mjs` renders the story from this Storybook: fixed sizes, scale 1, reduced motion, `en-US`, `Asia/Hong_Kong`, light. The application's site runs draw their reference with the same module.
- **Capture** - Follow `tools/ui-verification/README.md` in the application repository. The short form is `pnpm ui:verify capture --config ./ui-verification.json --selection all`, pointed at the same archive directory.

## Give A Story A Case

- **Rule** - Every Auction story, bar those under State Tests, carries `parameters.verification.caseId` in the form `vc_<uuid>`. A case names one story, so no two stories share one.
- **Permanent** - Mint it once and never change it. Archived runs find the story by it, so a new id orphans the history.
- **New story** - `pnpm storybook:check` fails an Auction story with no id. `pnpm storybook:case-ids --write` adds one to each story that lacks it; then run Biome on the files.
- **Other domains** - Add the domain to `VERIFIED_DOMAINS` in `scripts/storybook/case-ids.mjs`, then run the same command.
- **State Tests** - These stories drive an API response and have no site screen to compare, so they carry no id.

## Capture One Domain

❓ The capture tool is in the application repository, and this repository holds no copy of its options. Run `pnpm ui:verify capture --help` there for how to select cases.

- **Case list** - `pnpm storybook:case-ids --list Auction` prints each Auction `caseId` and its story id, for a selection or a declaration file.
- **Check** - Capture one case first. Press Refresh in Site Compare and confirm the story shows the run.

## Approve A Reference

- **Approve tab** - Per size it shows Last approved, Current and the pixel diff between them, both cropped to the reference region.
- **Approve all sizes** - Captures the live story at desktop, tablet and mobile in the chosen locale, stores each image, and approves all three. The reference is the design to hold the site to. A comment is optional.
- **All or nothing** - Every size is captured before anything is stored, so a size that fails to capture leaves no approval behind.
- **Region off the screen** - At the case's score size the reference region must fit the screen. At another size a region that does not fit is compared as the whole viewport, as a site run does.
- **Capture current reference** - Captures all three sizes without approving them, to see how far the story has moved from the last approval.
- **Request changes** - The current reference at the chosen size is wrong. A comment is required, on one line. It needs a captured reference to judge.
- **Current reference** - The newest reference this workbench captured at the case, target, capture point, size and locale.
- **Last approved reference** - The newest approved one at the same case, target, capture point, size and locale.
- **What an approval judges** - One captured reference image, tied to its SHA-256. A later capture of the same PNG carries the approval. A capture that changes one pixel is not approved.
- **Newest wins** - Approvals are never edited or deleted. A new one on the same image replaces the shown one; the history lists every decision at that size and locale.
- **First baseline** - With no approval yet there is nothing to diff. Approve to start one.
- **Commit** - Each capture records this checkout's commit, and says so when the checkout had uncommitted changes.
- **Who** - Hosted, the approver is the Cloudflare Access identity, never a name typed in the panel. The publisher token cannot approve. Locally, every approval is `local-development`.
- **Where** - Each captured reference is one record under `ui-verification/v1/references/`, with its PNG under `ui-verification/<referenceId>/`. Each decision is one record under `ui-verification/v1/approvals/<referenceId>/`.
- **Hosted capture** - ❓ The hosted Worker cannot run a browser, so approving there answers that capture runs in the local workbench only. Tony L confirms whether to capture with Cloudflare Browser Rendering.

## Compare A Site

- **Expected layout (Story)** - The story open in Storybook. It is filled in, not chosen. A target choice appears only when the story maps to more than one site target.
- **Compared version** - An app commit paired with a Storybook reference commit, labelled by tag when there is one. The commits are the identity.
- **Captured** - When the shown run was captured. A version has one static layout, so the panel shows its newest run only. Older runs stay in the archive and are not offered.
- **Locale** - Switch between the locales a run recorded. The panel never substitutes another locale's image.
- **Status** - One card per size, with the pixel result. It is in the panel's words: not compared, a percentage that differs, size differs, no reference.
- **Evidence** - One row per size: Reference, Site and Pixel diff.
- **All recordings** - Opens the story list of the chosen version, to review stories other than the open one.
- **Compare the site with** - Last approved reference, the default, or Current reference: the reference the run recorded. A size with no approved reference uses the run's reference, and the panel says so.
- **Drift flag** - When the run's reference differs from the last approved one by more than 20% of the reference region, the toggle says by how much. A reference region that changed size is flagged too.
- **Approval flag** - Beside the toggle, the story reference's approval at the chosen size, as the Approve tab shows it: Reference approved, Reference not approved, Changes requested, or No approved reference. A size tab names its flag too.

## Compare Pixels

- **Anchor** - The component's box. Each image is cropped to its recorded region, or kept whole when none was recorded, and the two crops are aligned at their top-left corner. The page around the component cannot move the result.
- **Equal size** - Both anchors must have the same size. If not, the panel says so and does not resize either image. Fix the layout before comparing pixels.
- **Difference** - A pixel differs when its colour distance passes a fixed threshold, so small anti-aliasing noise is ignored. Differences are boxed on the overlay as regions.
- **Colour cue** - Under 0.5% differing shows green. It is a reading aid, not a pass or fail gate.
- **Where it runs** - In the browser, from the archived PNGs after their SHA-256 check. Nothing is stored. Recompare gives the same result.

## Set Up Hosted Operation

❓ The hosted path is built and tested locally. No Worker has been deployed and no remote run has been uploaded.

- **Storage** - Provision the configured archive and preview buckets before deploying the combined Worker. Keep this evidence separate from expiring E2E report storage.
- **Deploy** - `pnpm --dir apps/preview run deploy-storybook:staging` builds the workbench and deploys with `apps/preview/wrangler.storybook.jsonc`.
- **Human access** - Set `ACCESS_ISSUER` and `ACCESS_AUD` for the Cloudflare Access application protecting the Storybook origin. The Worker verifies signed assertions before it reads evidence.
- **Approving** - ❓ Approving needs a reference capture, which the Worker cannot make yet. Hosted, the Approve tab shows approvals made elsewhere but cannot add one.
- **Publishing** - Set the Worker secret `PUBLISHER_TOKEN`. A capture runner publishes with `pnpm ui:verify publish --run <runId> --archive <dir> --endpoint <storybook origin> --token-env UI_VERIFICATION_TOKEN`. When Access protects the host, the runner also needs its service credentials.
- **Publisher token** - `PUBLISHER_TOKEN` is a value you choose, not one Cloudflare issues. Generate it with `openssl rand -hex 32`. Store it on the Worker with `pnpm dlx wrangler@4.120.0 secret put PUBLISHER_TOKEN -c wrangler.storybook.jsonc` in `apps/preview`. Give the same value to the runner as `UI_VERIFICATION_TOKEN`. Keep it in the team's secret manager, never in git or in the Storybook bundle.
- **Reuse** - A run that reuses captures needs its source run published first.
- **Origins** - The Worker allows its own origin. Set `ALLOWED_ORIGINS` only for a separate development workbench.
- **Secrets** - Browser bundles hold no R2, publisher or Access credentials.
- **Failure** - Missing authentication configuration never makes the archive public. Static Storybook assets stay behind the site's Access policy.

## Decisions

- **Approve the reference, not the site** - Approval says the Storybook reference is the right design, at each version it is approved. Site Compare holds the site to it; nobody approves a site capture.
- **No site reviews or calibration** - Human reviews of site captures and calibration are retired, with their routes. Model assessments stay advisory: nothing passes automatically.
- **The workbench captures what it approves** - An approval names an image this workbench captured from the live story, so the designer approves what they see. The run's own reference shows drift; it is never approved.
- **One reference capturer** - The workbench and the application's site runs draw a reference with the same module, so they differ only by the Playwright install each runs. ❓ The application resolves Playwright 1.62.1 and this repository 1.62.0; Tony L confirms whether to pin them together.
- **Latest run per version** - Recaptures append a new run and the panel shows the newest. Deleting the older run was ruled out: later runs may reuse its images, and a half-finished overwrite would leave a version with no valid evidence.
- **Old runs** - Older English-only runs keep their original images and coverage. Missing locale or viewport evidence stays unavailable.
