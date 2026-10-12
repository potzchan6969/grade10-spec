# UI: Redraw vault collector pages

The design reference is the Figma file `Grade10-DS-2026` and the Storybook workbench, where the surfaces are being composed from `@grade10/design-system` primitives and `@grade10/ui` blocks. Figma owns layout; the capability spec owns behavior.

## Screens

### Asset Detail

- Graded: [7029:2](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7029-2)
- Raw: [7054:7072](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7054-7072)
- Blocks: [7025:2](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7025-2), with annotated sub-frames Asset Summary `7054:6854`, Asset Details `7054:6185`, Asset Custody & Documents `7054:5063`
- Gallery annotation: [7029:76](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7029-76)
- Stories: `pages-vault-asset-detail--graded`, `pages-vault-asset-detail--raw`; block stories `vault-asset-summary--*`, `vault-asset-details--*`, `vault-asset-custody-documents--default`

### Portfolio

`awaiting:` figma — the list frame has not been drawn; the workbench story `pages-vault-portfolio--*` stands in until it is.

### Request Retrieval

`awaiting:` figma — the dialog frame has not been drawn; the workbench story `pages-vault-request-retrieval--*` stands in until it is.

### Intake Tracker

`awaiting:` figma — no frame drawn; the workbench story `pages-submissions--in-progress` stands in until it is.

### Book a Visit

`awaiting:` figma — no frame drawn; the workbench story `pages-appointment-book-visit--default` stands in until it is.

## Components

Asset Detail composes, all existing:

- `@grade10/design-system` — `Badge`, `Card`, `Alert`, `Button`, `Link`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Stepper`, `Step`, `Text`, `Breadcrumbs`
- `@grade10/ui` — `ListingLotGallery` (`ListingLotGalleryImage` with `label`, rendered beside the counter per `7029:76`)
- Page-local in `apps/preview/src/pages/` — `VaultAssetSummary`, `VaultAssetDetails`, `VaultAssetCustodyDocuments`, `VaultRequestRetrievalDialog`

Flagged work, already landed in this repo pending this change's tasks:

- `Alert` honors a custom `icon` on any `status` (the `warning` shell carries `TrendUp` for Value Potential).
- `ListingLotGalleryImage` gains `label`; the counter reads `1 / 3 · Front`.
- Document rows whose `href` is external render the action as an anchor opening a new tab with `ArrowSquareOut` (PSA cert report → psacard.com).

## States

### Asset Detail

| State | Shows | Anchor |
| --- | --- | --- |
| Graded | Grade, Cert Number with `Verify` link, Vault Storage ID, Location, Condition; custody log and documents tabs | `grade10-site-vault-portfolio-US-02` |
| Raw | No grade/cert rows; `Value Potential` alert inside the estimate card with `Submit for Grading` | `grade10-site-vault-portfolio-US-05` |
| Cert verification | `Verify` link opens the institute's cert page in a new tab | `grade10-site-vault-portfolio-US-03` |
| Custody log | Vertical `Stepper`; latest entry `completed`, history `upcoming` | `grade10-site-vault-portfolio-US-02` |
| Documents | One `Alert` row per document; external report opens a new tab, downloads use `PDF`/`ZIP` actions | `grade10-site-vault-portfolio-US-02` |
| Request retrieval | `Request Retrieval` link opens the retrieval dialog | `grade10-site-vault-portfolio-US-06` |
| Listing | `List for Auction` and `List for Sale` fill the row evenly | `grade10-site-vault-portfolio-US-04` |
| Soft launch | No compare figure (`showEstimateChange` off), no listing CTAs | `grade10-site-vault-portfolio-US-02` |
| Auction unavailable | `List for Auction` hidden while `List for Sale` stays; each listing flag ships on its own timeline | `grade10-site-vault-portfolio-US-04` |
| Sale unavailable | `List for Sale` hidden while `List for Auction` stays | `grade10-site-vault-portfolio-US-04` |
