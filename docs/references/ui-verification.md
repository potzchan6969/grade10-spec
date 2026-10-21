# UI Verification

## Ownership Decision

| Decision | Value |
| --- | --- |
| Review workbench | This repository's combined Storybook |
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

## How It Flows

1. **Declare** - The application keeps a declaration and a site recipe beside the story. The recipe returns the component's locator on the site.
2. **Capture** - `pnpm ui:verify capture` runs in the application repository with the app and Storybook served. It records the reference story and the full site viewport at desktop, tablet and mobile, for each locale, with the component's box in each image.
3. **Store** - Runs go to the local filesystem in development, and to R2 through the Worker when hosted.
4. **Review** - The Verification panel in this Storybook reads the archive on its own origin. It shows the newest run of the chosen version, at all three sizes.
5. **Compare** - Compare pixels runs in the browser on the archived PNGs. It writes nothing.

## Set Up Locally

```bash
pnpm install --frozen-lockfile
pnpm storybook:workbench
```

- **Open** - Open a story that carries a `verification` parameter, then the Verification tab. The Not Found story is the first.
- **Archive** - Development mounts the filesystem archive at the Storybook origin. The default is `.cache/ui-verification` in this checkout, or in the consuming app root when this checkout is its submodule. Set `UI_VERIFICATION_ARCHIVE` to an absolute directory before startup for another one.
- **No data yet** - The panel stays empty until the application has captured a run. Capture from the application repository, then press Refresh.
- **Capture** - Follow `tools/ui-verification/README.md` in the application repository. The short form is `pnpm ui:verify capture --config ./ui-verification.json --selection all`, pointed at the same archive directory.
- **Demo data** - `pnpm ui:verify demo --archive <dir>` in the application repository writes two synthetic runs without Chromium.

## Read The Panel

- **Expected layout (Story)** - The story open in Storybook. It is filled in, not chosen. A target choice appears only when the story maps to more than one site target.
- **Compared version** - An app commit paired with a Storybook reference commit, labelled by tag when there is one. The commits are the identity.
- **Captured** - When the shown run was captured. A version has one static layout, so the panel shows its newest run only. Older runs stay in the archive and are not offered.
- **Locale** - Switch between the locales a run recorded. The panel never substitutes another locale's image.
- **Status** - One card per size, with the pixel result. It is in the panel's words: not compared, a percentage that differs, size differs, no reference.
- **Evidence** - One row per size: Reference, Site and Pixel diff.
- **All recordings** - Opens the story list of the chosen version, to review stories other than the open one.

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
- **Publishing** - Set the Worker secret `PUBLISHER_TOKEN`. A capture runner publishes with `pnpm ui:verify publish --run <runId> --archive <dir> --endpoint <storybook origin> --token-env UI_VERIFICATION_TOKEN`. When Access protects the host, the runner also needs its service credentials.
- **Reuse** - A run that reuses captures needs its source run published first.
- **Origins** - The Worker allows its own origin. Set `ALLOWED_ORIGINS` only for a separate development workbench.
- **Secrets** - Browser bundles hold no R2, publisher or Access credentials.
- **Failure** - Missing authentication configuration never makes the archive public. Static Storybook assets stay behind the site's Access policy.

## Decisions

- **No review in the panel** - The panel shows evidence and the pixel result only. The archive API still has review, assessment and calibration routes. The panel does not call them. ❓ Remove them if nothing else will.
- **Latest run per version** - Recaptures append a new run and the panel shows the newest. Deleting the older run was ruled out: later runs may reuse its images, and a half-finished overwrite would leave a version with no valid evidence.
- **Old runs** - Older English-only runs keep their original images and coverage. Missing locale or viewport evidence stays unavailable.
