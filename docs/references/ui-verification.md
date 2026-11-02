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
- **Dashboard** - The UI Verification Dashboard, a page of its own, reads the same archive across every story.

## How It Flows

1. **Declare** - The application keeps a declaration and a site recipe beside the story. The recipe returns the component's locator on the site.
2. **Capture the site** - `pnpm ui:verify capture` runs in the application repository with the app and Storybook served. It records the full site viewport at desktop, tablet and mobile, for each locale, with the component's box in each image. It records the story's reference beside it, as that run saw it.
3. **Store** - Runs go to the local filesystem in development, and to R2 through the Worker when hosted.
4. **Approve** - In the Approve tab, a designer approves the story's reference. Approving captures the live story at once, stores the images, and approves them. Only site captures are run by hand.
5. **Capture every reference** - Within an hour of each Storybook deploy, or on request from the Reference captures page, the deployed Worker captures every case's reference, at most once every six hours. Nothing runs in CI. The Reference captures page shows each run as it goes.
6. **Site Compare** - The Site Compare tab holds each site capture to the last approved reference, and flags how far the run's own reference has drifted from it.
7. **Compare pixels** - Runs in the browser on the archived PNGs. It writes nothing.
8. **See every story** - The UI Verification Dashboard ranks the approvals waiting and the site drifts across all stories.

## Set Up Locally

```bash
pnpm install --frozen-lockfile
pnpm storybook:workbench
```

- **Open** - Open a Flows story, such as Auction / Flows / Bid And Win A Lot, then the Approve or Site Compare tab. Site Compare compares flows only.
- **Archive** - Development mounts the filesystem archive at the Storybook origin. The default is `.cache/ui-verification` in this checkout, or in the consuming app root when this checkout is its submodule. Set `UI_VERIFICATION_ARCHIVE` to an absolute directory before startup for another one.
- **Hosted data, locally** - Set `UI_VERIFICATION_REMOTE` to the hosted Storybook origin, such as `https://storybook.grade10-stg.com`, to read its runs, references and approvals instead. Sign in once with `cloudflared access login <origin>`; the workbench asks `cloudflared access token` for each read and sends it as `cf-access-token`, so the Worker sees you. `UI_VERIFICATION_REMOTE_TOKEN` gives a token instead. It only reads: approve, capture and request changes are refused, because they would judge the hosted Storybook's reference, not this checkout's. It cannot be set beside `UI_VERIFICATION_ARCHIVE`.
- **No data yet** - Both tabs stay empty until the application has captured a site run, which names the story's cases. Capture from the application repository, then press Refresh.
- **Reference capture** - Approving uses the preview app's Playwright, launched by the workbench itself. `packages/ui-verification/src/reference-capture.mjs` renders the story from this Storybook: fixed sizes, scale 1, reduced motion, `en-US`, `Asia/Hong_Kong`, light. The application's site runs draw their reference with the same module.
- **Capture** - Run `pnpm ui:verify capture` in the application repository. It captures every flow, starting the local stack and this Storybook when they are not running; `tools/ui-verification/README.md` there has the rest.

## Give A Story A Case

- **Rule** - Every Auction story, bar those under State Tests, carries `parameters.verification.caseId` in the form `vc_<uuid>`. A case names one story, so no two stories share one.
- **Permanent** - Mint it once and never change it. Archived runs find the story by it, so a new id orphans the history.
- **New story** - `pnpm storybook:check` fails an Auction story with no id. `pnpm storybook:case-ids --write` adds one to each story that lacks it; then run Biome on the files.
- **Other domains** - Add the domain to `VERIFIED_DOMAINS` in `scripts/storybook/case-ids.mjs`, then run the same command.
- **State Tests** - These stories drive an API response and have no site screen to compare, so they carry no id.

## Capture One Domain

- **Domain** - `pnpm ui:verify capture --domain auction` in the application repository captures only the flows whose story is in that Storybook domain. A domain is the first segment of the story id.
- **Domains** - `pnpm ui:verify capture --help` there lists each declared domain and how many cases it holds.
- **More than one** - `--domain` repeats, and combines with `--selection`. Cases outside the domains are recorded as not selected.

- **Case list** - `pnpm storybook:case-ids --list Auction` prints each Auction `caseId` and its story id, for a selection or a declaration file.
- **Check** - Capture one case first. Press Refresh in Site Compare and confirm the story shows the run.

## Approve A Reference

- **Approve tab** - Per size it shows Last approved, Current and the pixel diff between them, both cropped to the reference region.
- **Approve all sizes** - A focused capture: the live story at desktop, tablet and mobile in the chosen locale, stored and approved. It runs at once and is never held. The reference is the design to hold the site to. A comment is optional.
- **Capture current reference** - The same focused capture without approving, to see how far the story has moved from the last approval.
- **Few stories** - A focused capture covers at most five stories, so it finishes in seconds.
- **All or nothing** - Every size is captured before anything is stored, so a size that fails leaves no reference and no approval behind.
- **Region off the screen** - At the case's score size the reference region must fit the screen. At another size a region that does not fit is compared as the whole viewport, as a site run does.
- **Request changes** - The current reference at the chosen size is wrong. A comment is required, on one line. It needs a captured reference to judge.
- **Current reference** - The newest captured reference at the case, target, capture point, size and locale, from a focused or a full capture.
- **Last approved reference** - The newest approved one at the same case, target, capture point, size and locale.
- **What an approval judges** - One captured reference image, tied to its SHA-256. A later capture of the same PNG carries the approval. A capture that changes one pixel is not approved.
- **Newest wins** - Approvals are never edited or deleted. A new one on the same image replaces the shown one; the history lists every decision at that size and locale.
- **First baseline** - With no approval yet there is nothing to diff. Approve to start one.
- **Loading** - Until a story's references and approvals load, the Approve and Site Compare tabs say so: the size tabs, the flag and the image slots wait, nothing is compared, and Approve, Request changes and Capture are off. An empty list is never shown as "no reference" before it has loaded.
- **Commit** - Each capture records the commit it drew. Hosted, that is the deploy's build receipt. Locally, it is this checkout's commit, flagged when the checkout had uncommitted changes.
- **Who** - Hosted, the approver is the Cloudflare Access identity, never a name typed in the panel. The publisher token cannot approve. Locally, every approval is `local-development`.

## Capture Every Reference

- **Full capture** - Every active case of every archived site run, at every size and in every locale that run recorded.
- **When** - Within an hour of each Storybook deploy, and when someone presses Request a full capture on the Reference captures page.
- **Noticing a deploy** - Each hour a Cron Trigger on the Worker reads the build receipt from its own static assets. A commit it has not seen asks for a full capture; the same commit asks for nothing. No CI step runs or requests a capture.
- **Six hours** - At most one full capture starts in any six hours. A request inside that window waits in one slot, and the newest request replaces an older one. The waiting request starts when the window opens.
- **Focused captures are apart** - Approve and Capture current reference never wait for the window, and they run beside a full capture.
- **Batches** - A full capture takes a few shots at a time, saves its progress, and goes on. A restart or an eviction resumes it from the last saved shot.
- **A failed shot** - The run records it with its case, size, locale and message, and goes on. The run ends as Failed and names how many shots failed.
- **A redeploy mid-run** - When the deployed commit changes during a full capture, the run stops as Failed rather than mix two commits. The deploy's own request captures the new commit.

## Reference Captures Page

- **Where** - A page of its own, not a panel. Open it from Reference captures in the Approve tab, or at `?path=/reference-captures/`.
- **Schedule** - When the last full capture started, when the next one can start, and the request that waits for it.
- **Current runs** - Each running capture, full or focused, with a progress bar of shots captured, the failed count, and the commit being captured.
- **Run history** - Every finished run: its lane and trigger, who asked, its state and message, its commit, and its shots.
- **Live** - While a run goes or a request waits, the page refreshes every five seconds.

## UI Verification Dashboard

- **Where** - A page of its own, not a panel. Open it from Dashboard in the Approve or Site Compare tab, on the Reference captures page, or at `?path=/verification-dashboard/`.
- **Reads** - Every site run, reference and approval through the workbench's `/api/*` routes. A row is one case at the newest run that holds evidence for it, in the chosen locale. A failed read shows nothing, so a partial list cannot look complete.
- **Loading** - The site runs draw the rows first, in name order. Each value the references or approvals decide - a status, a reference drift, a site drift against Last approved, a thumbnail, a rank - shows a skeleton until both lists are in. Its box cannot be pressed and its story cannot be approved until then. Site drift against Current reference needs only the runs.
- **Stored scores** - The coordinator stores each pair's drift score the first time anyone asks, by the pair's two hashes and boxes, so a score never goes stale. The dashboard reads the scores of exactly the pairs it shows, ranks by them, and never downloads an image to rank. Only the same bytes in the same box settle without a download; the coordinator takes every size from the archived images, never from what a client sent. A pair it cannot read is tried three times, then stored as unread for six hours, and the browser compares it meanwhile.
- **Ten at a time** - Rows draw worst first, ten at a time; Show more adds ten. The browser compares only the rows it draws that have no stored score yet, and asks the coordinator to score every unscored pair, so the next load ranks them at once. Diff images are never stored.
- **Stories** - Every count is of stories, not cases or sizes. A flow's steps are one story.
- **Story status** - Approved when every size is. Otherwise Pending Comments when any size has a change request, No baseline when no size was ever approved, and Not approved for the rest. Each story has one status, so the four boxes add up to the total.
- **Tolerance** - Reference drift and site drift share one line: past 10% of the region, or a region of another size. The Approve and Site Compare tabs use the same line.
- **Approvals tab** - Reference drift only, in three sections: unapproved references past the tolerance, worst first; stories with no baseline; the other unapproved references. Pressing the Approved box lists the approved stories.
- **Site drift tab** - One list, the highest site drift between the sizes first. A screen size filter ranks by that size alone. Compare the site with Last approved, where a size with no approved reference has nothing to compare and shows `-`, or Current reference, the reference the run recorded, where a compact label says when that reference is approved.
- **Domain filter** - Choosing a domain groups either tab by Storybook path, each path keeping its tab's order and ranking from 1.
- **Story dialog** - Row Approve only opens the dialog, so a person sees the images first. Approve all sizes makes the focused capture the Approve tab makes. Request changes needs one size and a comment. On the Site drift tab there is no approval: nobody approves a site capture.
- **Fix prompts** - On the Site drift tab, Copy prompt copies one story's drift report with a sample prompt to fix the site. The button above the table copies every drift past the tolerance in the current filters as one batch prompt. The page shows what it copied.

## Where Captures And Approvals Live

- **Coordinator** - One capture coordinator owns the schedule, the live runs, every approval, an index of every reference by case, and the drift scores. Between full captures its alarm fills the index from the archive once, then scores queued pairs a few per wake. `/api/references` answers from the index once it is filled, so a story's references are one lookup, not a scan of the archive. Hosted, it is one Cloudflare Durable Object, `ReferenceCaptures`, and its alarm drives a full capture. Locally, the workbench runs it in-process, with JSON files beside the archive and a timer for the alarm.
- **Archive** - Holds what never changes: each captured reference as a record under `ui-verification/v1/references/` with its PNG under `ui-verification/<referenceId>/`, and each finished run under `ui-verification/v1/reference-runs/`.
- **Approvals** - Live in the coordinator, one record per decision, keyed by case. They are never edited.
- **Browser** - Hosted, Cloudflare Browser Rendering draws each reference. Locally, the preview app's Playwright does. The two never meet: each writes its own archive.

## Compare A Site

- **Expected layout (Story)** - The story open in Storybook. It is filled in, not chosen. A target choice appears only when the story maps to more than one site target.
- **Compared version** - An app commit paired with a Storybook reference commit, labelled by tag when there is one. The commits are the identity.
- **Captured** - When the shown run was captured. A version has one static layout, so the panel shows its newest run only. Older runs stay in the archive and are not offered.
- **Locale** - Switch between the locales a run recorded. The panel never substitutes another locale's image.
- **Status** - One card per size, with the pixel result. It is in the panel's words: not compared, a percentage that differs, size differs, no reference.
- **Evidence** - One row per size: Reference, Site and Pixel diff.
- **All recordings** - Opens the story list of the chosen version, to review stories other than the open one.
- **Compare the site with** - Last approved reference, the default, or Current reference: the reference the run recorded. A size with no approved reference uses the run's reference, and the panel says so.
- **Drift flag** - When the run's reference differs from the last approved one by more than 10% of the reference region, the toggle says by how much. A reference region that changed size is flagged too.
- **Approval flag** - Beside the toggle, the story reference's approval at the chosen size, as the Approve tab shows it: Reference approved, Reference not approved, Changes requested, or No approved reference. A size tab names its flag too.

## Compare Pixels

- **Anchor** - The component's box. Each image is cropped to its recorded region, or kept whole when none was recorded, and the two crops are aligned at their top-left corner. The page around the component cannot move the result.
- **Equal size** - Both anchors must have the same size. If not, the panel says so and does not resize either image. Fix the layout before comparing pixels.
- **Difference** - A pixel differs when its colour distance passes a fixed threshold, so small anti-aliasing noise is ignored. Differences are boxed on the overlay as regions.
- **Colour cue** - Under 0.5% differing shows green. It is a reading aid, not a pass or fail gate.
- **Where it runs** - In the browser, from the archived PNGs after their SHA-256 check, and in the coordinator for stored scores, with the same crop and the same diff. The coordinator stores the ratio only. Recompare gives the same result.

## Set Up Hosted Operation

❓ The hosted path is built and tested locally. No Worker has been deployed, and no reference has been captured hosted yet.

- **Storage** - Provision the configured archive and preview buckets before deploying the combined Worker. Keep this evidence separate from expiring E2E report storage.
- **Deploy** - `pnpm --dir apps/preview run deploy-storybook:staging` builds the workbench, writes its build receipt, and deploys with `apps/preview/wrangler.storybook.jsonc`.
- **Durable Object and browser** - The Worker config binds `REFERENCE_CAPTURES` to the `ReferenceCaptures` class, with a SQLite storage migration, and `BROWSER` to Browser Rendering. Browser Rendering bills browser time beyond its monthly allowance.
- **Build receipt** - `ui-verification-build.json` in the build names the commit and an artifact digest. The build writes it, and refuses a checkout with uncommitted changes. The Worker's hourly check and every hosted capture read it, and a deploy without one cannot capture.
- **Hourly check** - The Worker config sets a Cron Trigger at 17 minutes past each hour and the variable `STORYBOOK_ORIGIN`, the origin the headless browser opens.
- **Browser through Access** - The headless browser opens the workbench through Cloudflare Access. ❓ Create an Access service token for it, and set the Worker secrets `CAPTURE_ACCESS_CLIENT_ID` and `CAPTURE_ACCESS_CLIENT_SECRET`. The browser sends them to the Storybook origin only.
- **Human access** - Set `ACCESS_ISSUER` and `ACCESS_AUD` for the Cloudflare Access application protecting the Storybook origin. The Worker verifies signed assertions before it reads evidence.
- **Publishing** - Set the Worker secret `PUBLISHER_TOKEN`. A capture runner publishes with `pnpm ui:verify publish --run <runId> --archive <dir> --endpoint <storybook origin> --token-env UI_VERIFICATION_TOKEN`. When Access protects the host, the runner also needs its service credentials.
- **Publisher token** - `PUBLISHER_TOKEN` is a value you choose, not one Cloudflare issues. Generate it with `openssl rand -hex 32`. Store it on the Worker with `pnpm dlx wrangler@4.120.0 secret put PUBLISHER_TOKEN -c wrangler.storybook.jsonc` in `apps/preview`. Give the same value to the runner as `UI_VERIFICATION_TOKEN`. Keep it in the team's secret manager, never in git or in the Storybook bundle.
- **Who may ask** - Only a signed-in person may request a full capture, approve, or make a focused capture. A deploy asks through the Worker's own hourly check.
- **Reuse** - A run that reuses captures needs its source run published first.
- **Origins** - The Worker allows its own origin. Set `ALLOWED_ORIGINS` only for a separate development workbench.
- **Secrets** - Browser bundles hold no R2, publisher or Access credentials.
- **Failure** - Missing authentication configuration never makes the archive public. Static Storybook assets stay behind the site's Access policy.

## Decisions

- **Approve the reference, not the site** - Approval says the Storybook reference is the right design, at each version it is approved. Site Compare holds the site to it; nobody approves a site capture.
- **No site reviews or calibration** - Human reviews of site captures and calibration are retired, with their routes. Model assessments stay advisory: nothing passes automatically.
- **The workbench captures what it approves** - An approval names an image this workbench captured from the live story, so the designer approves what they see. The run's own reference shows drift; it is never approved.
- **Focused and full captures** - A focused capture of a few stories runs at once, so approving never waits. A full capture of every case waits for a six-hour window, which bounds browser time however often the workbench deploys.
- **The Worker notices its own deploys** - An hourly check of its own build receipt starts full captures, so CI only builds and deploys, and holds no capture credentials.
- **One coordinator** - The schedule, the runs and the approvals live in one Durable Object, so one place decides when a capture starts and every approval is written in order.
- **Hosted references come from Browser Rendering** - The deployed workbench captures in Cloudflare Browser Rendering. Its images do not match a local Playwright capture byte for byte, so local and hosted approvals stay in their own archives.
- **One reference capturer** - The workbench and the application's site runs draw a reference with the same module, so they differ only by the Playwright install each runs. ❓ The application resolves Playwright 1.62.1 and this repository 1.62.0; Tony L confirms whether to pin them together.
- **Latest run per version** - Recaptures append a new run and the panel shows the newest. Deleting the older run was ruled out: later runs may reuse its images, and a half-finished overwrite would leave a version with no valid evidence.
- **Old runs** - Older English-only runs keep their original images and coverage. Missing locale or viewport evidence stays unavailable.
