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

- **Package** - `@grade10/ui-verification` owns the recording contract, archive validation, assessment calibration, and authenticated archive API used by the workbench and consuming capture tools.
- **Boundary** - This developer tool does not fetch product data or add orchestration to shared product components.
- **Browser imports** - The panel imports the browser-safe `model` export; archive and scoring exports run in Node or a Worker with `nodejs_compat`.
- **Identity** - A story carries a permanent verification `caseId`; application declarations add the target and capture point, so the same story can serve several sites.
- **History** - Saved reference and site PNGs remain immutable, independently of what the latest Storybook renders.

## Local Workbench

```bash
pnpm install --frozen-lockfile
pnpm storybook:workbench
```

- **Endpoint** - The Verification panel connects to the Storybook origin automatically; the deployment serves the archive API and static workbench on that origin.
- **Development** - Storybook development mounts the filesystem archive at its own origin automatically. The default is `.cache/ui-verification` in this checkout, or in the consuming app root when this checkout is its submodule. Set `UI_VERIFICATION_ARCHIVE` to an absolute directory before startup to select another archive.
- **Worker preview** - Build the workbench and run Wrangler with `apps/preview/wrangler.storybook.jsonc` to exercise the combined static and API deployment locally.
- **Pairing** - The Not Found story carries a permanent case ID. Its consuming app declaration selects `pages-not-found--default`; site routes and state setup stay with the application recipe.

## Archive Operations

- **Storage** - Provision the configured archive and preview buckets before deploying the combined Worker. Keep this evidence separate from expiring E2E report storage.
- **Human access** - Configure `ACCESS_ISSUER` and `ACCESS_AUD` for the Cloudflare Access application protecting the Storybook origin. The Worker verifies signed assertions before reading evidence or saving a named review.
- **Publishing** - Set the Worker secret `PUBLISHER_TOKEN`. A capture runner supplies the matching bearer token and, when Access protects the host, its separate service credentials.
- **Origins** - The combined Worker allows its own request origin by default. Set `ALLOWED_ORIGINS` to exact additional origins only when a separate development workbench needs access.
- **Secrets** - Browser bundles contain no R2, publisher, or Access service credentials.
- **Failure** - Missing authentication configuration never makes the archive public; unauthenticated requests fail while static Storybook assets remain available under the site's Access policy.

## Capture And Review

- **Recording** - Applications capture a full site viewport at desktop, tablet, and mobile sizes, and score only the declared comparison size.
- **Checkpoints** - Tags are preferred labels; resolved app and reference commits remain authoritative provenance.
- **Selection** - The panel resolves the current story's permanent case ID and offers its application targets. All recordings opens the story list for a selected app/reference commit pair, with tags as version labels and a separate selector for repeated runs. Selection uses a recorded locator first, then a unique current verification identity. A generic story can match by case ID alone. Missing or ambiguous matches retain the archived evidence without navigation.
- **Images** - The reference preview fits its recorded comparison region; the site preview always shows the full viewport. Original PNGs remain immutable and downloadable.
- **Review destination** - The form displays the storage destination reported by the archive API. Local reviews use `local-development`; deployed reviews use the authenticated person.
- **Demo assessments** - Each synthetic demo run has a marked shadow assessment at its declared score profile. Real captures require an external evaluator report; capture does not imply assessment.
- **Assessment** - Model similarity remains advisory until independently labelled human evidence meets the archive's calibration policy; human review decisions are append-only records.
- **Protocol** - The application's pinned spec commit supplies the shared protocol. Consumers update that pin only after the upstream implementation is merged.
